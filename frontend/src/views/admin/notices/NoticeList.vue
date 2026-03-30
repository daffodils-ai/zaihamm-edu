<template>
  <div class="notices-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Notices</h1>
        <p class="text-muted">Manage all notices</p>
      </div>
      <router-link to="/admin/notices/new" class="btn btn-primary">
        <i>➕</i> Add Notice
      </router-link>
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

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <CustomInput
              v-model="filters.title"
              label="Search by Title"
              placeholder="Enter notice title"
              @blur="applyFilters"
            />
          </div>
          <div class="col-md-4">
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-secondary" @click="clearFilters">Clear</button>
              <button class="btn btn-primary" @click="applyFilters">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Notices List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading notices...</p>
      </div>

      <div v-else-if="notices.length === 0" class="text-center p-5">
        <p class="text-muted">No notices found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notice in notices" :key="notice._id">
              <td class="fw-bold">{{ notice.title }}</td>
              <td><small>{{ notice.description?.substring(0, 50) }}...</small></td>
              <td v-format-date="notice.createdAt"></td>
              <td>
                <div class="btn-group btn-group-sm">
                  <router-link :to="`/admin/notices/${notice._id}/edit`" class="btn btn-outline-warning">✏️</router-link>
                  <button class="btn btn-outline-danger" @click="deleteNotice(notice._id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import CustomInput from '../../../components/CustomInput.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'NoticeList',
  components: { CustomInput, AlertComponent },
  data() {
    return {
      filters: { title: '' },
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    ...mapState('notices', ['notices', 'loading']),
    ...mapGetters('notices', ['isLoading'])
  },
  methods: {
    ...mapActions('notices', ['fetchNotices', 'deleteNotice']),
    async applyFilters() {
      try {
        await this.fetchNotices({ page: 1, limit: 20, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { title: '' };
      this.applyFilters();
    },
    async refreshList() {
      await this.applyFilters();
    },
    async deleteNotice(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.deleteNotice(id);
        this.successMessage = 'Notice deleted';
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    }
  },
  mounted() {
    this.applyFilters();
  }
};
</script>

<style scoped>
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
.page-header h1 { font-size: 2rem; font-weight: 700; }
</style>
