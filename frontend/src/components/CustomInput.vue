<template>
  <div class="custom-input">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type"
      :class="['form-control', { 'is-invalid': error }]"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <small v-if="error" class="text-danger d-block mt-2">{{ error }}</small>
    <small v-if="hint" class="text-muted d-block mt-2">{{ hint }}</small>
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (v) => ['text', 'email', 'password', 'number', 'tel', 'date', 'time'].includes(v)
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'blur', 'focus']
};
</script>

<style scoped>
.custom-input {
  margin-bottom: 1rem;
}

.form-control {
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.15);
  outline: none;
}

.form-control.is-invalid {
  border-color: #e74c3c;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.15);
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
</style>
