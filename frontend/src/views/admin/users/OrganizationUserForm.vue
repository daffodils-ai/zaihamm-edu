<template>
  <div class="user-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit User' : 'Add New User' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update user information' : 'Create a new user' }}</p>
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
                v-model="form.firstName"
                label="First Name"
                placeholder="Enter first name"
                required
                :error="errors.firstName"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.lastName"
                label="Last Name"
                placeholder="Enter last name"
                required
                :error="errors.lastName"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="Enter email"
                required
                :error="errors.email"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.mobile"
                label="Mobile"
                type="tel"
                placeholder="Enter mobile number"
                required
                :error="errors.mobile"
              />
            </div>
            <div v-if="!isEditMode" class="col-md-6">
              <CustomInput
                v-model="form.password"
                label="Password"
                type="password"
                placeholder="Enter password"
                required
                :error="errors.password"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.role"
                label="Role"
                :options="roleOptions"
                placeholder="Select role"
                required
                :error="errors.role"
              />
            </div>
          </div>
          <div class="d-flex gap-2 mt-5">
            <CustomButton label="Save" variant="primary" size="lg" :is-loading="isLoading" @click="handleSubmit" />
            <router-link to="/admin/users" class="btn btn-secondary btn-lg">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import CustomButton from '../../../components/CustomButton.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'OrganizationUserForm',
  components: { CustomInput, CustomSelect, CustomButton, AlertComponent },
  data() {
    return {
      form: { firstName: '', lastName: '', email: '', mobile: '', password: '', role: '' },
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false,
      roleOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'accountant', label: 'Accountant' }
      ]
    };
  },
  computed: {
    isEditMode() { return !!this.$route.params.id; }
  },
  methods: {
    ...mapActions('organizationUsers', ['createOrganizationUser', 'updateOrganizationUser']),
    validateForm() {
      this.errors = {};
      if (!this.form.firstName) this.errors.firstName = 'First name is required';
      if (!this.form.lastName) this.errors.lastName = 'Last name is required';
      if (!this.form.email) this.errors.email = 'Email is required';
      if (!this.form.mobile) this.errors.mobile = 'Mobile is required';
      if (!this.isEditMode && !this.form.password) this.errors.password = 'Password is required';
      if (!this.form.role) this.errors.role = 'Role is required';
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;
      try {
        this.isLoading = true;
        if (this.isEditMode) {
          await this.updateOrganizationUser({ id: this.$route.params.id, data: this.form });
        } else {
          await this.createOrganizationUser(this.form);
        }
        this.successMessage = this.isEditMode ? 'User updated' : 'User added';
        setTimeout(() => this.$router.push('/admin/users'), 2000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
</style>
