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
              <CustomSelect
                v-model="form.classIds"
                label="Applicable Classes"
                :options="classOptions"
                :multiple="true"
                :size="8"
                :error="errors.classIds"
              />
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
import CustomSelect from '../../../components/CustomSelect.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'SubjectForm',
  components: { AlertComponent, CustomInput, CustomSelect },
  data() {
    return {
      form: {
        name: '',
        classIds: []
      },
      classOptions: [],
      errors: {},
      loading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    }
  },
  methods: {
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
      await this.loadClasses();
      if (this.isEditMode) {
        await this.loadSubject();
      }
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}
</style>
