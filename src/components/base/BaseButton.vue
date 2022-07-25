<template>
  <button
    :class="{
      'base-button': true,

      small,
      primary,
      secondary,
      warning,
      error,
      success,
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
defineProps<{
  small?: boolean;
  primary?: boolean;
  secondary?: boolean;
  warning?: boolean;
  error?: boolean;
  success?: boolean;
}>();
</script>

<style lang="postcss">
button.base-button {
  @apply rounded-lg p-2;
  @apply bg-primary-500 bg-opacity-0!;
  @apply flex justify-center items-center;

  &:focus-visible {
    @apply outline-none;
  }

  &.small {
    @apply p-1;
  }

  &.primary {
    @apply bg-primary-500;
  }
  &.secondary {
    @apply bg-secondary-500;
  }
  &.warning {
    @apply bg-warning-500;
  }
  &.error {
    @apply bg-error-500;
  }
  &.success {
    @apply bg-success-500;
  }

  &.primary,
  &.secondary,
  &.warning,
  &.error,
  &.success {
    @apply text-white bg-opacity-100!;

    &:hover {
      @apply bg-opacity-80!;
    }
    &:focus {
      @apply bg-opacity-100!;
    }
  }

  &[disabled] {
    @apply opacity-50!;
    @apply cursor-not-allowed;
  }

  &:hover {
    @apply bg-opacity-20!;
  }

  &:focus {
    @apply bg-opacity-40!;
    @apply ring-4 ring-primary;
  }
}
</style>
