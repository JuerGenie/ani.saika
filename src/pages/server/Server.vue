<template>
  <div class="ani-saika">
    <div class="information-panel">
      <div class="title-section">
        <div class="title">🌸 ANI◈SAIKA 🌸</div>
        <div class="name">
          SERVER
          <div class="version">v{{ version }}</div>
        </div>
      </div>
      <div class="copyright-section">
        此页面由 JuerGenie 制作，基于 peer.js，以及 unocss，感谢开源贡献者。
      </div>
    </div>
    <div class="main-panel">
      <div class="message-box">
        <div v-for="message in messages" class="message">
          <div class="time">
            [{{ new Date(message.timestamp).toLocaleString() }}]
          </div>
          <div class="from">
            [{{ users[message.from ?? ""] ?? message.from ?? "unknown" }}]
          </div>
          <div class="data">{{ String(message.data) }}</div>
        </div>
      </div>
      <div class="send-box"></div>
    </div>
    <div class="server-key">服务端ID：{{ serverId }}</div>
    <ul class="connection-list">
      <!-- <li v-for="connection in connections" class="connection">
        {{ connection.peer }}
      </li> -->
    </ul>
    <div class="menu-box">
      <i class="mdi mdi-image" />
    </div>
  </div>
  <!-- <base-modal class="w-128" ref="modalRef" title="创建一个安易彩华服务器">
    <base-input
      v-model="key"
      placeholder="请输入服务器ID（可选）"
      :disabled="creating"
    >
      <template #suffix>
        <base-button :disabled="creating" @click="onOk">确定</base-button>
      </template>
    </base-input>
  </base-modal> -->
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import BaseModal from "../../components/base/BaseModal.vue";
// import BaseInput from "../../components/base/BaseInput.vue";
// import BaseButton from "../../components/base/BaseButton.vue";
import { getLogger } from "../../utils/logger";
import { levels } from "loglevel";
import _ from "lodash";
import { SaikaServer } from "../../core/server";
import { isLog, LogData } from "../../core/models";

const version = __APP_VERSION__;

const modalRef = ref<InstanceType<typeof BaseModal>>();
onMounted(() => {
  modalRef.value?.show();
});

const logger = getLogger("A.S.UI", levels.DEBUG);

const creating = ref(true);
const server = new SaikaServer({
  id: "ani-saika-server",
  logLevel: levels.DEBUG,
  peerOptions: {
    host: "192.168.51.126",
    port: 9000,
    path: "/",
  },
});
server
  .once("ready", () => {
    creating.value = false;
    modalRef.value?.hide();
    logger.info("服务端初始化完毕。");
  })
  .registerCallable("getUsers", () => server.users.value);

const serverId = computed(() => server.serverId.value);
const users = computed(() => server.users.value);
const messages = computed(
  () =>
    server.logs.value.filter((log) =>
      isLog(log, "message")
    ) as LogData<"message">[]
);
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
    @apply row-start-11 row-end-13 col-start-9 col-end-17;
    @apply flex flex-col gap-4 p-4;
    @apply justify-center items-center;

    & > .title-section {
      @apply flex flex-row items-center gap-4;

      & > .title {
        @apply text-2xl;
      }
      & > .name {
        @apply text-md;
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
    @apply row-start-2 row-end-13 col-start-1 col-end-9;
    @apply flex flex-col gap-2 p-2;

    & > .message-box {
      @apply flex-1 rounded-md;
      @apply bg-primary-100;

      & > .message {
        @apply flex flex-row;

        & > .data {
          @apply flex-1;
        }
      }
    }

    & > .send-box {
      @apply h-12 rounded-md;
      @apply bg-primary-100;
    }
  }

  & > .connection-list {
    @apply row-start-1 row-end-10 col-start-9 col-end-17;
  }

  & > .menu-box {
    @apply row-start-10 row-end-11 col-start-9 col-end-17;
    @apply flex flex-row flex-wrap gap-2 items-center;
    @apply px-2;
  }

  & > .server-key {
    @apply col-span-8;
    @apply flex items-center;
    @apply p-4;
  }
}
</style>
