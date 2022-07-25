import { DataConnection, Peer, PeerJSOption } from "peerjs";
import { EventEmitter } from "eventemitter3";
import { ref } from "vue";
import { LogData, ModelData } from "./models";
import { nanoid } from "nanoid";
import { getLogger } from "../utils/logger";
import { isLog, ModelType } from "./models";
import { Logger, LogLevelDesc } from "loglevel";

interface SaikaClientEvent {
  ready: (id: string) => void;
  connected: () => void;
  login: () => void;
  log: (log: LogData) => void;
}

export interface SaikaClientOptions {
  server: string;
  username: string;

  logLevel?: LogLevelDesc;

  peerOptions: PeerJSOption;
}

export class SaikaClient extends EventEmitter<SaikaClientEvent> {
  private logger: Logger;
  private peer: Peer;
  private connection!: DataConnection;
  private remoteCalls = new Map<string, [Function, Function]>();

  logs = ref<LogData[]>([]);
  get connectionId() {
    return this.connection?.connectionId;
  }

  constructor({ server, username, logLevel, peerOptions }: SaikaClientOptions) {
    super();

    this.logger = getLogger("A.S.Client", logLevel);

    this.peer = new Peer(peerOptions);
    this.peer.on("open", (id) => {
      this.emit("ready", id);

      this.connection = this.peer.connect(server);
      this.connection
        .on("open", async () => {
          this.emit("connected");
          this.logger.info("连接到服务器。");

          await this.remoteCall("login", username);
          this.emit("login");
        })
        .on("data", (data) => {
          if (isLog(data)) {
            this.logger.debug("接收数据：", data);
            this.addLog(data);
            if (isLog(data, "call-result") || isLog(data, "call-error")) {
              const { id } = data.data;
              if (this.remoteCalls.has(id)) {
                const [resolve, reject] = this.remoteCalls.get(id)!;

                if (data.type === "call-result") {
                  resolve(data.data.result);
                } else {
                  reject(data.data.error);
                }

                this.remoteCalls.delete(id);
              }
            }
          } else {
            this.logger.warn("未知数据：", data);
          }
        })
        .on("error", (error) => {
          this.logger.error("链接异常：", error);
        })
        .on("close", () => {
          this.logger.debug("链接已关闭。");
        });
    });
  }

  remoteCall(method: string, ...parameters: unknown[]) {
    this.logger.debug(`远程调用：${method}(${parameters.join(", ")})`);
    return new Promise<unknown>((resolve, reject) => {
      if (this.connection) {
        const id = nanoid(8);
        this.connection.send({
          type: "call",
          data: {
            id,
            method,
            parameters,
          },
        } as ModelData["call"]);
        this.remoteCalls.set(id, [resolve, reject]);
      } else {
        reject("未连接到服务器！");
      }
    });
  }

  sendData<T extends ModelType>(data: ModelData[T]) {
    this.connection.send(data);
    return this;
  }

  addLog(log: LogData) {
    this.logs.value.push(log);
    this.emit("log", log);
    return this;
  }

  close() {
    this.peer.destroy();
  }
}
