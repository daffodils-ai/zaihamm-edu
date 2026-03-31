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
          <div class="col-md-3">
            <CustomInput
              v-model="filters.title"
              label="Search by Title"
              placeholder="Enter notice title"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Notice Type</label>
            <select v-model="filters.noticeType" class="form-select">
              <option value="">All Types</option>
              <option v-for="type in noticeTypeOptions" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">From Date</label>
            <input v-model="filters.fromDate" type="date" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">To Date</label>
            <input v-model="filters.toDate" type="date" class="form-control" />
          </div>
          <div class="col-md-2">
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
              <th>Notice Type</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Description</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notice in notices" :key="notice._id">
              <td class="fw-bold">{{ notice.title }}</td>
              <td>{{ notice.noticeType || '-' }}</td>
              <td v-format-date="notice.fromDate"></td>
              <td v-format-date="notice.toDate"></td>
              <td><small>{{ notice.description?.substring(0, 50) }}...</small></td>
              <td v-format-date="notice.createdAt"></td>
              <td>
                <div class="btn-group btn-group-sm">
                  <router-link :to="`/admin/notices/${notice._id}/edit`" class="btn btn-outline-warning">✏️</router-link>
                  <button class="btn btn-outline-danger" @click="onDeleteNotice(notice._id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <nav v-if="totalPages > 1" class="mt-4" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
        </li>
        <li v-for="page in totalPages" :key="page" :class="['page-item', { active: page === currentPage }]">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li :class="['page-item', { disabled: currentPage === totalPages }]">
          <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
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
      noticeTypeOptions: ['Individual', 'Banner', 'Notice Board'],
      filters: { title: '', noticeType: '', fromDate: '', toDate: '' },
      successMessage: '',
      errorMessage: '',
      page: 1,
      limit: 20
    };
  },
  computed: {
    ...mapState('notices', ['notices', 'loading', 'pagination']),
    ...mapGetters('notices', ['isLoading']),
    currentPage() {
      return this.pagination?.page || 1;
    },
    totalPages() {
      const pages = this.pagination?.pages;
      if (pages) return pages;
      const total = this.pagination?.total || 0;
      const limit = this.pagination?.limit || this.limit;
      return Math.max(1, Math.ceil(total / limit));
    }
  },
  methods: {
    ...mapActions('notices', {
      fetchNotices: 'fetch',
      removeNotice: 'delete'
    }),
    async applyFilters() {
      try {
        if (this.filters.fromDate && this.filters.toDate && this.filters.fromDate > this.filters.toDate) {
          this.errorMessage = 'From Date cannot be after To Date';
          return;
        }
        this.page = 1;
        await this.fetchNotices({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { title: '', noticeType: '', fromDate: '', toDate: '' };
      this.applyFilters();
    },
    async refreshList() {
      await this.fetchNotices({ page: this.page, limit: this.limit, filters: this.filters });
    },
    async goToPage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.page = page;
      await this.fetchNotices({ page: this.page, limit: this.limit, filters: this.filters });
    },
    async onDeleteNotice(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.removeNotice(id);
        this.successMessage = 'Notice deleted';
        if (this.notices.length === 1 && this.currentPage > 1) {
          this.page = this.currentPage - 1;
        }
        await this.fetchNotices({ page: this.page, limit: this.limit, filters: this.filters });
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
