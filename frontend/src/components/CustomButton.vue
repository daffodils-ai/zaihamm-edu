<template>
  <div class="custom-button">
    <button
      :class="[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { disabled: isLoading || disabled }
      ]"
      :disabled="isLoading || disabled"
      @click="$emit('click')"
    >
      <span v-if="isLoading" class="spinner spinner-border spinner-border-sm me-2"></span>
      <slot>{{ label }}</slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    label: {
      type: String,
      default: 'Button'
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (v) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(v)
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v)
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.custom-button button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-button button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.custom-button button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}
</style>
