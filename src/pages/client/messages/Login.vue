<template>
  <div class="login">
    <div class="content">🎉 {{ from }} 进入了聊天室 🎉</div>
  </div>
</template>

<script lang="ts" setup>
import { LogData } from "../../../core/models";

defineProps<{
  from: LogData["from"];
  data: LogData<"login">["data"];
}>();
</script>

<style lang="postcss" scoped>
.login {
  @apply w-full p-2;
  @apply flex flex-row justify-center items-center;

  & .content {
    @apply px-2 py-1 bg-slate-300 text-slate-600;
    @apply rounded-lg;
  }
}
</style>
