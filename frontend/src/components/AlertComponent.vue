<template>
  <div class="alert-component">
    <div
      v-if="visible"
      :class="['alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show']"
      role="alert"
    >
      <strong>{{ title }}:</strong> {{ message }}
      <button type="button" class="btn-close" @click="close"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertComponent',
  data() {
    return {
      visible: true
    };
  },
  props: {
    type: {
      type: String,
      default: 'success',
      validator: (v) => ['success', 'danger', 'warning', 'info'].includes(v)
    },
    title: {
      type: String,
      default: 'Alert'
    },
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 5000
    }
  },
  watch: {
    message(newVal) {
      if (newVal) {
        this.visible = true;
        if (this.timeout > 0) {
          setTimeout(() => {
            this.visible = false;
          }, this.timeout);
        }
      }
    }
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit('close');
    }
  },
  mounted() {
    if (this.timeout > 0) {
      setTimeout(() => {
        this.visible = false;
      }, this.timeout);
    }
  }
};
</script>

<style scoped>
.alert-component {
  margin-bottom: 1rem;
}

.alert {
  border-radius: 8px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
