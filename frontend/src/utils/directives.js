/**
 * Date Formatting Directive
 * Usage: v-format-datetime (for DD/MM/YYYY HH:mm:ss AM/PM)
 *        v-format-date (for DD/MM/YYYY)
 */

import { formatDateTime, formatDate } from '../utils/dateUtils.js';

export const vFormatDateTime = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) {
      el.textContent = formatDateTime(value);
    }
  },
  updated(el, binding) {
    const value = binding.value;
    if (value) {
      el.textContent = formatDateTime(value);
    }
  }
};

export const vFormatDate = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) {
      el.textContent = formatDate(value);
    }
  },
  updated(el, binding) {
    const value = binding.value;
    if (value) {
      el.textContent = formatDate(value);
    }
  }
};

export const vActive = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) {
      el.classList.add('badge-success');
      el.textContent = 'Active';
    } else {
      el.classList.add('badge-danger');
      el.textContent = 'Inactive';
    }
  },
  updated(el, binding) {
    const value = binding.value;
    el.classList.remove('badge-success', 'badge-danger');
    if (value) {
      el.classList.add('badge-success');
      el.textContent = 'Active';
    } else {
      el.classList.add('badge-danger');
      el.textContent = 'Inactive';
    }
  }
};
