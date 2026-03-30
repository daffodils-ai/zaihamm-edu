<template>
  <div class="custom-select">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <select
      :value="modelValue"
      :class="['form-select', { 'is-invalid': error }]"
      :disabled="disabled"
      :required="required"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <small v-if="error" class="text-danger d-block mt-2">{{ error }}</small>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true,
      validator: (arr) => arr.every((opt) => 'value' in opt && 'label' in opt)
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
};
</script>

<style scoped>
.custom-select {
  margin-bottom: 1rem;
}

.form-select {
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.15);
  outline: none;
}

.form-select.is-invalid {
  border-color: #e74c3c;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
</style>
