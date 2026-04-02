<template>
  <div class="subject-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Subject' : 'Add Subject' }}</h1>
      <p class="text-muted mb-0">Create subjects and optionally restrict them to selected classes.</p>
    </div>

    <AlertComponent
      v-if="successMessage"
      type="success"
      title="Success"
      :message="successMessage"
      @close="successMessage = ''"
    />

    <AlertComponent
      v-if="errorMessage"
      type="danger"
      title="Error"
      :message="errorMessage"
      :timeout="0"
      @close="errorMessage = ''"
    />

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-4">
            <div class="col-md-6">
              <CustomInput
                v-model="form.name"
                label="Subject Name"
                placeholder="Enter subject name"
                required
                :error="errors.name"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Applicable Classes</label>
              <div ref="classDropdown" class="multi-select">
                <button
                  type="button"
                  :class="['multi-select-trigger', { 'is-invalid': errors.classIds, open: classDropdownOpen }]"
                  @click="toggleClassDropdown"
                >
                  <span>{{ selectedClassesLabel }}</span>
                  <span class="multi-select-caret">{{ classDropdownOpen ? '▲' : '▼' }}</span>
                </button>

                <div v-if="classDropdownOpen" class="multi-select-menu">
                  <div class="multi-select-actions">
                    <button type="button" class="btn btn-link btn-sm p-0" @click="selectAllClasses">Select All</button>
                    <button type="button" class="btn btn-link btn-sm p-0" @click="clearAllClasses">Clear All</button>
                  </div>

                  <label
                    v-for="option in classOptions"
                    :key="option.value"
                    class="multi-select-option"
                  >
                    <input
                      type="checkbox"
                      :checked="form.classIds.includes(option.value)"
                      @change="toggleClassSelection(option.value)"
                    />
                    <span>{{ option.label }}</span>
                  </label>
                </div>
              </div>
              <small v-if="errors.classIds" class="text-danger d-block mt-2">{{ errors.classIds }}</small>
              <small class="text-muted">Leave empty if the subject should be available for all classes.</small>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Subject' }}
            </button>
            <router-link to="/admin/subjects" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { classes, subjects } from '../../../api/api.js';
import AlertComponent from '../../../components/AlertComponent.vue';
import CustomInput from '../../../components/CustomInput.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'SubjectForm',
  components: { AlertComponent, CustomInput },
  data() {
    return {
      form: {
        name: '',
        classIds: []
      },
      classOptions: [],
      classDropdownOpen: false,
      errors: {},
      loading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    },
    selectedClassesLabel() {
      if (!this.form.classIds.length) {
        return 'Select applicable classes';
      }

      if (this.form.classIds.length === this.classOptions.length) {
        return 'All classes selected';
      }

      return this.classOptions
        .filter((option) => this.form.classIds.includes(option.value))
        .map((option) => option.label)
        .join(', ');
    }
  },
  methods: {
    toggleClassDropdown() {
      this.classDropdownOpen = !this.classDropdownOpen;
    },
    toggleClassSelection(value) {
      if (this.form.classIds.includes(value)) {
        this.form.classIds = this.form.classIds.filter((item) => item !== value);
        return;
      }

      this.form.classIds = [...this.form.classIds, value];
    },
    selectAllClasses() {
      this.form.classIds = this.classOptions.map((option) => option.value);
    },
    clearAllClasses() {
      this.form.classIds = [];
    },
    handleClickOutside(event) {
      if (!this.classDropdownOpen) return;
      if (this.$refs.classDropdown?.contains(event.target)) return;
      this.classDropdownOpen = false;
    },
    async loadClasses() {
      const response = await classes.getAll(1, 200);
      this.classOptions = (response?.data || []).map((item) => ({
        value: item._id,
        label: item.classCode ? `${item.name} (${item.classCode})` : item.name
      }));
    },
    async loadSubject() {
      const response = await subjects.getById(this.$route.params.id);
      const item = response?.data;
      if (!item) return;

      if (item.isLinked) {
        this.errorMessage = 'Linked subjects cannot be edited.';
        setTimeout(() => this.$router.push('/admin/subjects'), 1200);
        return;
      }

      this.form = {
        name: item.name || '',
        classIds: (item.classIds || []).map((entry) => entry._id || entry)
      };
    },
    validateForm() {
      this.errors = {};
      if (!this.form.name.trim()) {
        this.errors.name = 'Subject name is required';
      }
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.loading = true;
        this.errorMessage = '';
        const payload = {
          name: this.form.name.trim(),
          classIds: this.form.classIds
        };

        if (this.isEditMode) {
          await subjects.update(this.$route.params.id, payload);
        } else {
          await subjects.create(payload);
        }

        this.successMessage = this.isEditMode ? 'Subject updated successfully' : 'Subject created successfully';
        setTimeout(() => this.$router.push('/admin/subjects'), 1000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    try {
      this.loading = true;
      document.addEventListener('click', this.handleClickOutside);
      await this.loadClasses();
      if (this.isEditMode) {
        await this.loadSubject();
      }
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

.multi-select {
  position: relative;
}

.multi-select-trigger {
  width: 100%;
  min-height: 44px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  padding: 0.65rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  color: #2c3e50;
}

.multi-select-trigger.open,
.multi-select-trigger:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.15);
  outline: none;
}

.multi-select-trigger.is-invalid {
  border-color: #e74c3c;
}

.multi-select-caret {
  flex: 0 0 auto;
  font-size: 0.8rem;
  color: #64748b;
}

.multi-select-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  padding: 0.85rem;
  max-height: 280px;
  overflow-y: auto;
}

.multi-select-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.65rem;
  margin-bottom: 0.65rem;
  border-bottom: 1px solid #e7eef5;
}

.multi-select-option {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.45rem 0;
  cursor: pointer;
  color: #2c3e50;
}

.multi-select-option input {
  margin: 0;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
</style>
