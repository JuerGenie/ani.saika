<template>
  <dialog ref="dialogRef" class="base-modal" v-bind="$attrs">
    <header>
      <slot name="header">
        <div class="modal-title">{{ title }}</div>

        <div class="modal-actions">
          <slot name="header-actions">
            <base-button v-if="!cannotClose" small @click="onClose">
              <i class="mdi mdi-close" />
            </base-button>
          </slot>
        </div>
      </slot>
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="showFooter">
      <slot name="footer">
        <base-button v-if="!!onCancel" @click="onClickCancel">取消</base-button>
        <base-button v-if="!!onOk" @click="onClickOk" primary>确定</base-button>
      </slot>
    </footer>
  </dialog>
</template>

<script lang="ts" setup>
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  title?: string;

  cannotClose?: boolean;

  onOk?: () => void;
  onCancel?: () => void;
}>();

const emit = defineEmits<{
  (evt: "ok"): void;
  (evt: "cancel"): void;
  (evt: "close"): void;
  (evt: "show"): void;
}>();

const dialogRef = ref<HTMLDialogElement>();

const slots = useSlots();
const showFooter = computed(
  () => !!slots.footer || !!props.onOk || !!props.onCancel
);

function onClose() {
  dialogRef.value?.classList.remove("active");
  dialogRef.value!.ontransitionend = () => {
    dialogRef.value?.close();
  };

  emit("close");
}
function onShow() {
  dialogRef.value?.showModal();
  dialogRef.value?.classList.add("active");
  emit("show");
}

function onClickCancel() {
  emit("cancel");
  onClose();
}

function onClickOk() {
  emit("ok");
  onClose();
}

defineExpose({
  show: onShow,
  hide: onClose,
});
</script>

<script lang="ts">
import { computed, nextTick, ref, useSlots } from "vue";

export default {
  inheritAttrs: false,
};
</script>

<style lang="postcss">
dialog.base-modal {
  &::backdrop {
    @apply bg-black bg-opacity-0 backdrop-blur-0;
    @apply transition-all duration-200;
  }
  &.active::backdrop {
    @apply bg-opacity-50 backdrop-blur;
  }

  @apply bg-white;
  @apply rounded-lg shadow;
  @apply flex flex-col gap-4;

  @apply opacity-0 blur-sm pointer-events-none;
  &.active {
    @apply opacity-100 blur-0 pointer-events-auto;
  }

  & header {
    @apply flex flex-row items-center gap-2;

    & .modal-title {
      @apply flex-1;
      @apply text-xl;
    }
  }

  & footer {
    @apply flex flex-row items-center justify-end gap-2;
  }
}
</style>
