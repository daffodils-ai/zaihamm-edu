<template>
  <div class="class-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Class' : 'Add New Class' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update class information' : 'Create a new class' }}</p>
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
                label="Class Name"
                placeholder="e.g., Class 10-A"
                required
                :error="errors.name"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.classCode"
                label="Class Code"
                placeholder="e.g., 10A"
                :error="errors.classCode"
              />
            </div>
            <div class="col-12">
              <CustomInput
                v-model="form.description"
                label="Description"
                placeholder="Class description"
                :error="errors.description"
              />
            </div>
          </div>

          <div class="d-flex gap-2 mt-5">
            <CustomButton
              label="Save"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="handleSubmit"
            />
            <router-link to="/admin/classes" class="btn btn-secondary btn-lg">
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomInput from '../../../components/CustomInput.vue';
import CustomButton from '../../../components/CustomButton.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'ClassForm',
  components: {
    CustomInput,
    CustomButton,
    AlertComponent
  },
  data() {
    return {
      form: {
        name: '',
        classCode: '',
        description: ''
      },
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    }
  },
  methods: {
    ...mapActions('classes', {
      createClass: 'create',
      updateClass: 'update',
      fetchClassById: 'fetchById'
    }),

    validateForm() {
      this.errors = {};
      if (!this.form.name) this.errors.name = 'Class name is required';
      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isLoading = true;
        this.errorMessage = '';

        if (this.isEditMode) {
          await this.updateClass({
            id: this.$route.params.id,
            data: this.form
          });
        } else {
          await this.createClass(this.form);
        }

        this.successMessage = this.isEditMode
          ? 'Class updated successfully'
          : 'Class added successfully';

        setTimeout(() => {
          this.$router.push('/admin/classes');
        }, 2000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  async mounted() {
    if (this.isEditMode) {
      try {
        const response = await this.fetchClassById(this.$route.params.id);
        if (response?.success && response.data) {
          this.form = {
            name: response.data.name || '',
            classCode: response.data.classCode || '',
            description: response.data.description || ''
          };
        }
      } catch (error) {
        console.error('Error fetching class:', error);
      }
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
