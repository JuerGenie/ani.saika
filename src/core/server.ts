import { Logger, LogLevelDesc } from "loglevel";
import { EventEmitter } from "eventemitter3";
import { Peer, DataConnection, PeerJSOption } from "peerjs";
import { ref } from "vue";
import { getLogger } from "../utils/logger";
import { isModel, LogData, ModelData, ModelType } from "./models";

interface SaikaServerEvent {
  ready: (id: string) => void;
}

export interface SaikaServerOptions {
  id: string;
  logLevel?: LogLevelDesc;
  peerOptions: PeerJSOption;
}

type CallableFn = (
  connection: DataConnection,
  ...args: unknown[]
) => unknown | Promise<unknown>;

export class SaikaServer extends EventEmitter<SaikaServerEvent> {
  private logger: Logger;
  private peer: Peer;
  private callables: Record<string, CallableFn> = {};

  // 响应式字段
  serverId = ref("");
  users = ref<Record<DataConnection["connectionId"], string>>({});
  logs = ref<LogData[]>([]);

  // 非响应式字段
  connections: DataConnection[] = [];

  constructor({ id, logLevel, peerOptions }: SaikaServerOptions) {
    super();
    this.logger = getLogger("A.S.Server", logLevel);

    this.peer = new Peer(id, peerOptions);
    this.peer
      .on("open", (newId) => {
        this.serverId.value = newId;
        this.emit("ready", newId);
      })
      .on("connection", (connection) => {
        connection
          .on("data", (data) => {
            if (isModel(data, "call")) {
              const { id, method, parameters } = data.data;
              this.logger.debug(
                `远程调用：${method}(${parameters.join(", ")})，调用ID：${id}`
              );
              this.addLog(connection, data);

              if (!(method in this.callables)) {
                this.sendLog(
                  this.peer,
                  {
                    type: "call-error",
                    data: {
                      id,
                      error: `cannot found callable: ${method}.`,
                    },
                  },
                  [connection]
                );
              } else {
                const result = this.callables[method].apply(undefined, [
                  connection,
                  ...parameters,
                ]);
                this.sendLog(
                  this.peer,
                  {
                    type: "call-result",
                    data: {
                      id,
                      result,
                    },
                  },
                  [connection]
                );
              }
            }
          })
          .on("close", () => {
            this.logger.debug("关闭链接:", connection);
            const index = this.connections.indexOf(connection);
            if (this.users.value[connection.connectionId]) {
              delete this.users.value[connection.connectionId];
            }
            if (index !== -1) {
              this.connections.splice(index, 1);
              this.sendLog(connection, {
                type: "logout",
                data: void 0,
              });
            }
          })
          .on("error", (error) => console.error(connection, error));
      });
    this.registerCallable("login", (connection, username) => {
      if (this.connections.includes(connection)) {
        return true;
      }

      this.logger.info("🔗连接登录：", connection.connectionId, username);
      this.connections.push(connection);
      this.users.value[connection.connectionId] = String(username);

      this.sendLog(connection, {
        type: "login",
        data: String(username),
      });

      connection.on("data", (data) => {
        this.logger.debug("接收数据:", data);
        if (this.connections.includes(connection) && isModel(data)) {
          if (isModel(data, "message")) {
            this.sendLog(connection, data);
          }
        }
      });

      return true;
    });
  }

  send(log: LogData, target: DataConnection[] = this.connections) {
    target.forEach((connection) => {
      connection.send(log);
    });

    return this;
  }

  addLog<T extends ModelType>(from: DataConnection | Peer, data: ModelData[T]) {
    const log: LogData<T> = {
      type: data.type,
      from: "connectionId" in from ? from.connectionId : "system",
      timestamp: Date.now(),
      data: data.data,
    };
    this.logs.value.push(log);
    return log;
  }

  sendLog<T extends ModelType>(
    from: DataConnection | Peer,
    data: ModelData[T],
    target: DataConnection[] = this.connections
  ) {
    const log = this.addLog<T>(from, data);
    this.send(log, target);
    return log;
  }

  registerCallable(name: string, cb: CallableFn) {
    this.callables[name] = cb;
  }
  unregisterCallable(name: string) {
    delete this.callables[name];
  }
}
