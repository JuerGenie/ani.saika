<template>
  <label :class="{ 'base-input': true, disabled }">
    <slot name="prefix" />
    <input
      v-model="value"
      v-bind="{
        placeholder,
        disabled,
      }"
    />
    <slot name="suffix" />
  </label>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;

  disabled?: boolean;
}>();
const emit = defineEmits<{
  (evt: "update:model-value", val: string): void;
}>();

const value =
  props.modelValue !== undefined
    ? computed({
        get: () => props.modelValue ?? "",
        set: (nv) => emit("update:model-value", nv),
      })
    : ref("");
</script>

<style lang="postcss">
label.base-input {
  @apply border-2 p-2 rounded-lg;
  @apply text-sm inline-block;
  @apply flex flex-row;
  @apply bg-white border-slate-200 ring-blue-500;
  @apply bg-opacity-50 backdrop-blur;

  &.disabled {
    @apply opacity-75 border-opacity-50;
    @apply ring-slate-500;
    @apply cursor-not-allowed;
  }

  & > input {
    @apply appearance-none outline-none;
    @apply flex-1;
    @apply cursor-inherit;
    @apply bg-transparent;
  }

  &:hover,
  &:focus,
  &:focus-within {
    @apply ring-4;
  }

  &:hover {
    @apply bg-opacity-75 ring-opacity-50;
  }

  &:focus,
  &:focus-within {
    @apply bg-opacity-100 ring-opacity-100;
  }
}
</style>
