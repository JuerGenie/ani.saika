<template>
  <div
    :class="{
      message: true,
      'merge-block': mergeBlock,
      'last-block': lastBlock,
      [atRight ? 'right' : 'left']: true,
    }"
  >
    <div class="avatar">
      <i class="mdi mdi-github" />
    </div>
    <div class="body">
      <div class="from">
        {{ from || "unknown" }}
        <i class="mdi mdi-email-fast" />
        <div class="time">{{ time }}</div>
      </div>
      <div class="data">{{ data }}</div>
    </div>
    <div class="w-10" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { LogData } from "../../../core/models";

const props = defineProps<{
  from?: LogData["from"];
  timestamp: LogData["timestamp"];
  data: LogData<"message">["data"];

  atRight?: boolean;

  mergeBlock?: boolean;
  lastBlock?: boolean;
}>();

const time = computed(() => new Date(props.timestamp).toLocaleString());
</script>

<style lang="postcss" scoped>
.message {
  @apply flex! flex-row gap-2;
  @apply w-full p-2;

  &.right {
    @apply flex-row-reverse;
  }

  & .avatar {
    @apply rounded-full overflow-hidden;
    @apply w-10 max-h-10;
    @apply relative;

    & .mdi {
      @apply w-full h-full text-2xl;
      @apply bg-white;
    }
  }

  & .body {
    @apply flex-1 flex flex-col;
    @apply bg-white;
    @apply overflow-hidden;
    @apply rounded;

    & > * {
      @apply px-4;
    }

    & .from {
      @apply bg-slate-100 text-slate-700;
      @apply flex flex-row items-center;
      @apply py-2;
    }
    & .time {
      @apply text-gray-400 text-xs;
    }
    & .data {
      @apply w-full overflow-auto;
      @apply break-all;
      @apply py-2;
    }
  }

  &:not(.last-block) .body {
    @apply rounded-b-0;

    & .data {
      @apply pb-0;
    }
  }

  &.merge-block {
    &:not(.last-block) {
      @apply pb-0;

      & + .merge-block {
        @apply pt-0;

        & .body {
          @apply rounded-t-0;
        }

        & .mdi,
        & .from {
          @apply hidden;
        }
      }
    }
  }
}
</style>
