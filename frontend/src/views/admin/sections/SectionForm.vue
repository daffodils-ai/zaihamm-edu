<template>
  <div class="section-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Section' : 'Add New Section' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update section information' : 'Create a new section' }}</p>
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
                label="Section Name"
                placeholder="e.g., Section A"
                required
                :error="errors.name"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.classId"
                label="Class"
                :options="classOptions"
                placeholder="Select class"
                required
                :error="errors.classId"
              />
            </div>
            <div class="col-12">
              <CustomInput
                v-model="form.description"
                label="Description"
                placeholder="Section description"
              />
            </div>
          </div>
          <div class="d-flex gap-2 mt-5">
            <CustomButton label="Save" variant="primary" size="lg" :is-loading="isLoading" @click="handleSubmit" />
            <router-link to="/admin/sections" class="btn btn-secondary btn-lg">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { classes } from '../../../api/api.js';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import CustomButton from '../../../components/CustomButton.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'SectionForm',
  components: { CustomInput, CustomSelect, CustomButton, AlertComponent },
  data() {
    return {
      form: { name: '', classId: '', description: '' },
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false,
      classOptions: []
    };
  },
  computed: {
    isEditMode() { return !!this.$route.params.id; }
  },
  methods: {
    ...mapActions('sections', {
      createSection: 'create',
      updateSection: 'update',
      fetchSectionById: 'fetchById'
    }),
    async loadClassOptions() {
      const response = await classes.getAll(1, 100);
      this.classOptions = (response?.data || []).map((item) => ({
        value: item._id,
        label: item.classCode ? `${item.name} (${item.classCode})` : item.name
      }));
    },
    async loadSection() {
      const response = await this.fetchSectionById(this.$route.params.id);
      if (response?.success && response.data) {
        this.form = {
          name: response.data.name || '',
          classId: response.data.classId?._id || response.data.classId || '',
          description: response.data.description || ''
        };
      }
    },
    validateForm() {
      this.errors = {};
      if (!this.form.name) this.errors.name = 'Section name is required';
      if (!this.form.classId) this.errors.classId = 'Class is required';
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;
      try {
        this.isLoading = true;
        if (this.isEditMode) {
          await this.updateSection({ id: this.$route.params.id, data: this.form });
        } else {
          await this.createSection(this.form);
        }
        this.successMessage = this.isEditMode ? 'Section updated' : 'Section added';
        setTimeout(() => this.$router.push('/admin/sections'), 2000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  async mounted() {
    try {
      this.isLoading = true;
      await this.loadClassOptions();
      if (this.isEditMode) {
        await this.loadSection();
      }
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
</style>
