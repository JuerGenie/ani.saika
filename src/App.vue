<template>
  <header>
    <div class="text-xl font-light">🌸 ANI◈SAIKA 🌸</div>
    <div class="text-xs">一个基于 peer.js 实现的在线跑团器</div>
    <div class="text-xs">Author: @juergenie</div>
    <div class="flex-1" />
    <div></div>
  </header>
  <hr />
  <main>
    <div class="text">
      <div v-for="(item, index) in message" :key="index" class="message">
        <div class="flex flex-row text-sm">
          <div class="timestamp">
            [{{ new Date(item.timestamp).toLocaleString() }}]
          </div>
          <div class="from">[{{ item.from }}]</div>
        </div>
        <div class="content">{{ item.content }}</div>
      </div>
    </div>

    <base-modal title="TEST!" ref="modalRef"> HELLO WORLD! </base-modal>
  </main>
  <hr />
  <footer>
    <!-- <button v-if="!connected" class="primary" @click="connectLink">
      链接到目标
    </button>
    <input class="flex-1" v-model="target" />
    <button v-if="connected" class="primary" @click="sendMessage">发送</button> -->
    此页面由 JuerGenie 制作，基于 peer.js，以及 unocss，感谢开源贡献者。
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { Peer, DataConnection } from "peerjs";
import BaseModal from "./components/base/BaseModal.vue";

interface Message {
  from: string;
  timestamp: number;
  content: string;
}

const message = ref<Message[]>([
  {
    from: "JuerGenie",
    timestamp: new Date("2022/07/12 01:12:50").getTime(),
    content: "Hello, can you hear me?",
  },
  {
    from: "JuerGenie",
    timestamp: new Date("2022/07/12 01:12:55").getTime(),
    content: "Hello? Anybody here?",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content: "yes, I'm here.",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!\nlong message test!long message test!\n\nlong message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
  {
    from: "AinaSana",
    timestamp: new Date("2022/07/12 01:12:59").getTime(),
    content:
      "long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!long message test!",
  },
]);

// const peer = new Peer();
// const connections = shallowRef<DataConnection[]>([]);

// peer.once("open", (id) => {
//   message.value.push({
//     from: "system",
//     timestamp: new Date().getDate(),
//     content: `id: ${id}`,
//   });
// });
// peer.on("connection", (connection) => {
//   connections.value.push(connection);
//   connection.on("data", (data) => {
//     message.value.push({
//       from: "system",
//       timestamp: new Date().getDate(),
//       content: String(data),
//     });
//   });
//   connection.on("open", () => {
//     message.value.push({
//       from: "system",
//       timestamp: new Date().getDate(),
//       content: "connection open!",
//     });
//     console.log("client.peer", connection.peer);
//   });
// });
// const target = ref("");

// const connected = ref(false);
// const connect = shallowRef<DataConnection>();
// function connectLink() {
//   connect.value = peer.connect(target.value);
//   connect.value.on("data", (data) => {
//     message.value.push({
//       from: "system",
//       timestamp: new Date().getDate(),
//       content: String(data),
//     });
//   });
//   connect.value.once("open", () => {
//     connected.value = true;
//     message.value.push({
//       from: "system",
//       timestamp: new Date().getDate(),
//       content: "connected!",
//     });
//     console.log("connect.peer", connect.value!.peer);
//   });
// }
// function sendMessage() {
//   connect.value?.send(target.value);
// }
const modalRef = ref<InstanceType<typeof BaseModal>>();
onMounted(() => {
  setTimeout(() => {
    modalRef.value?.show();
  }, 1000);
});
</script>

<style lang="postcss">
#app {
  font-family: "PingFang SC", Avenir, Helvetica, Arial, sans-serif;

  @apply flex flex-col antialiased;
  @apply h-full overflow-auto;

  & > header,
  & > main,
  & > footer {
    @apply px-[calc(50%-480px)];
  }

  & > header {
    @apply h-16;
    @apply flex flex-row gap-4 items-center;
    @apply bg-slate-100;
  }

  & > main {
    @apply flex-1 overflow-auto;

    & .text {
      @apply rounded-lg py-4;
      @apply flex flex-col gap-8;

      & .message {
        @apply flex flex-col;

        & .timestamp {
          @apply text-slate-500;
        }
        & .from {
          @apply text-violet-600;
        }
        & .content {
          @apply text-slate-600;
          @apply whitespace-pre-wrap;
        }
      }
    }
  }

  & > footer {
    @apply h-16;
    @apply flex flex-row gap-4 items-center;
    @apply bg-slate-100;
  }

  & hr {
    @apply border-slate-200;
  }
}
</style>
