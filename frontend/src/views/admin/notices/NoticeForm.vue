<template>
  <div class="notice-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Notice' : 'Add New Notice' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update notice information' : 'Create a new notice' }}</p>
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
                v-model="form.title"
                label="Title"
                placeholder="Enter notice title"
                required
                :error="errors.title"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Notice Type</label>
              <select v-model="form.noticeType" class="form-select" required>
                <option v-for="type in noticeTypeOptions" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea
                v-model="form.description"
                class="form-control"
                rows="5"
                placeholder="Enter notice description"
                required
              ></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label">From Date</label>
              <input
                v-model="form.fromDate"
                type="date"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">To Date</label>
              <input
                v-model="form.toDate"
                type="date"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="d-flex gap-2 mt-5">
            <CustomButton label="Save" variant="primary" size="lg" :is-loading="isLoading" @click="handleSubmit" />
            <router-link to="/admin/notices" class="btn btn-secondary btn-lg">Cancel</router-link>
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
  name: 'NoticeForm',
  components: { CustomInput, CustomButton, AlertComponent },
  data() {
    return {
      form: { title: '', description: '', noticeType: 'Individual', fromDate: '', toDate: '' },
      noticeTypeOptions: ['Individual', 'Banner', 'Notice Board'],
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false
    };
  },
  computed: {
    isEditMode() { return !!this.$route.params.id; }
  },
  methods: {
    ...mapActions('notices', {
      createNotice: 'create',
      updateNotice: 'update',
      fetchNoticeById: 'fetchById'
    }),
    validateForm() {
      this.errors = {};
      if (!this.form.title) this.errors.title = 'Title is required';
      if (!this.form.description) this.errors.description = 'Description is required';
      if (!this.form.noticeType) this.errors.noticeType = 'Notice type is required';
      if (!this.form.fromDate) this.errors.fromDate = 'From date is required';
      if (!this.form.toDate) this.errors.toDate = 'To date is required';
      if (this.form.fromDate && this.form.toDate && this.form.fromDate > this.form.toDate) {
        this.errors.toDate = 'To date must be on or after from date';
      }
      return Object.keys(this.errors).length === 0;
    },
    async loadNotice() {
      try {
        this.isLoading = true;
        const response = await this.fetchNoticeById(this.$route.params.id);
        if (response?.success && response.data) {
          const notice = response.data;
          this.form = {
            title: notice.title || '',
            description: notice.description || '',
            noticeType: notice.noticeType || 'Individual',
            fromDate: notice.fromDate ? String(notice.fromDate).slice(0, 10) : '',
            toDate: notice.toDate ? String(notice.toDate).slice(0, 10) : ''
          };
        }
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmit() {
      if (!this.validateForm()) return;
      try {
        this.isLoading = true;
        if (this.isEditMode) {
          await this.updateNotice({ id: this.$route.params.id, data: this.form });
        } else {
          await this.createNotice(this.form);
        }
        this.successMessage = this.isEditMode ? 'Notice updated' : 'Notice added';
        setTimeout(() => this.$router.push('/admin/notices'), 2000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    if (this.isEditMode) {
      this.loadNotice();
    }
  }
};
</script>

<style scoped>
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
</style>
