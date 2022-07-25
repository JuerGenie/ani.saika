<template>
  <div class="ani-saika">
    <div class="information-panel">
      <div class="title-section">
        <div class="title">🌸ANI◈SAIKA🌸</div>
        <div class="name">
          CLIENT
          <div class="version">v{{ version }}</div>
        </div>
      </div>
      <div class="copyright-section">
        此页面由 JuerGenie 制作，基于 peer.js，以及 unocss，感谢开源贡献者。
      </div>
    </div>
    <div class="main-panel">
      <div class="log-box" ref="logBoxRef">
        <component
          v-for="(log, index) in renderableLogs"
          :is="logComponents[log.type]"
          v-bind="getBindData(log, index)"
        />
      </div>
      <div class="send-box">
        <base-input class="flex-1" v-model="message" />
        <base-button primary @click="sendMessage">发送</base-button>
      </div>
    </div>
    <div class="server-key">客户端ID：{{ current }}</div>
    <ul class="connection-list">
      <li class="title">当前在线</li>
      <li v-for="(user, id) in users" class="connection">
        {{ user }} ({{ id }})
      </li>
    </ul>
    <div class="menu-box">
      <i class="mdi mdi-image" />
    </div>
  </div>
  <base-modal
    class="w-128"
    ref="modalRef"
    title="连接到安易彩华服务器"
    cannot-close
  >
    <div class="flex flex-col gap-4">
      <base-input
        v-model="server"
        placeholder="请输入服务器ID"
        :disabled="creating"
      />
      <base-input
        v-model="username"
        placeholder="请输入昵称"
        :disabled="creating"
      />
    </div>

    <template #footer>
      <base-button @click="onOk">确定</base-button>
    </template>
  </base-modal>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type defineComponent,
} from "vue";
import BaseModal from "../../components/base/BaseModal.vue";
import BaseInput from "../../components/base/BaseInput.vue";
import BaseButton from "../../components/base/BaseButton.vue";
import { getLogger } from "../../utils/logger";
import { levels } from "loglevel";
import _ from "lodash";
import { SaikaClient } from "../../core/client";
import { LogData } from "../../core/models";

import Message from "./messages/Message.vue";
import Login from "./messages/Login.vue";
import Logout from "./messages/Logout.vue";

const version = __APP_VERSION__;

const current = ref("");
const server = ref("ani-saika-server");
const username = ref("");

const users = ref<Record<string, string>>({});

const modalRef = ref<InstanceType<typeof BaseModal>>();
onMounted(() => {
  modalRef.value?.show();
});

const logger = getLogger("A.S.UI", levels.DEBUG);

const creating = ref(false);

const client = shallowRef<SaikaClient>();
onBeforeUnmount(() => {
  client.value?.close();
});

const renderableLogs = computed(
  () =>
    client.value?.logs.value.filter((log) =>
      ["message", "login", "logout"].includes(log.type)
    ) ?? []
);
const logComponents: Record<string, ReturnType<typeof defineComponent>> = {
  message: Message,
  login: Login,
  logout: Logout,
};

function onOk() {
  logger.debug(`on ok: ${server.value}`);

  creating.value = true;
  client.value = new SaikaClient({
    server: "ani-saika-server",
    username: username.value,

    logLevel: levels.DEBUG,

    peerOptions: {
      host: "192.168.51.126",
      port: 9000,
      path: "/",
    },
  });
  client.value
    .on("ready", (id) => {
      current.value = id;
    })
    .on("login", () => {
      creating.value = false;
      modalRef.value?.hide();
    })
    .on("log", async (log) => {
      if (log.type === "login" || log.type === "logout") {
        const res = await client.value?.remoteCall("getUsers");
        users.value = res as any;
      }
    });
}

const message = ref("");
function sendMessage() {
  logger.debug("send message:", message.value);
  client.value?.sendData({
    type: "message",
    data: message.value,
  });
  message.value = "";
}

const logBoxRef = ref<HTMLDivElement>();
watch(renderableLogs, () => {
  nextTick(() =>
    logBoxRef.value?.scroll({
      top: logBoxRef.value.scrollHeight,
      behavior: "smooth",
    })
  );
});

function logIsEqual(left?: LogData, right?: LogData) {
  if (!left || !right) {
    return false;
  }
  const leftDate = new Date(left.timestamp);
  const rightDate = new Date(right.timestamp);
  return (
    left.type === right.type &&
    left.from === right.from &&
    leftDate.toLocaleDateString() === rightDate.toLocaleDateString() &&
    leftDate.getHours() === rightDate.getHours() &&
    leftDate.getMinutes() === rightDate.getMinutes()
  );
}
function getBindData(log: LogData, index: number) {
  const result = {
    ...log,
    from: users.value[log.from!] ?? log.from ?? "unknown",

    atRight: false,
    mergeBlock: false,
    lastBlock: false,
  };
  const pre = renderableLogs.value[index - 1];
  const next = renderableLogs.value[index + 1];
  result.mergeBlock = logIsEqual(pre, log) || logIsEqual(next, log);
  result.lastBlock = !logIsEqual(next, log);

  if (log.from === client.value?.connectionId) {
    result.atRight = true;
  }

  return result;
}
</script>

<style lang="postcss" scoped>
.ani-saika {
  @apply grid grid-rows-12 grid-cols-16;
  @apply w-63rem h-47rem gap-4;

  & > * {
    @apply rounded-lg;
    @apply bg-white;
  }

  & > .information-panel {
    @apply row-start-11 row-end-13 col-start-12 col-end-17;
    @apply flex flex-col gap-4 p-4;
    @apply justify-center items-center;

    & > .title-section {
      @apply flex flex-row items-center gap-4;

      & > .title {
        @apply text-lg;
      }
      & > .name {
        @apply flex flex-row gap-2 items-center justify-center;
        @apply bg-primary text-white;
        @apply px-2 rounded-full;
        & > .version {
          @apply text-xs;
          @apply bg-error text-white;
          @apply px-2 rounded-full;
        }
      }
    }

    & .copyright-section {
      @apply text-sm;
    }
  }

  & > .main-panel {
    @apply row-start-2 row-end-13 col-start-1 col-end-12;
    @apply flex flex-col gap-2 p-2;

    & > .log-box {
      @apply flex-1 rounded-md;
      @apply bg-primary-100;
      @apply overflow-auto scroll-smooth;
    }

    & > .send-box {
      @apply h-12 rounded-md;
      @apply bg-primary-100;

      @apply flex flex-row gap-2 p-1;
    }
  }

  & > .connection-list {
    @apply row-start-1 row-end-10 col-start-12 col-end-17;
    @apply overflow-hidden;

    & > .title {
      @apply p-2;
      @apply font-bold;
      @apply bg-slate-100;
    }

    & > .connection {
      @apply p-2;
    }
  }

  & > .menu-box {
    @apply row-start-10 row-end-11 col-start-12 col-end-17;
    @apply flex flex-row flex-wrap gap-2 items-center;
    @apply px-2;
  }

  & > .server-key {
    @apply col-span-11;
    @apply flex items-center
    @apply p-4;
  }
}
</style>
