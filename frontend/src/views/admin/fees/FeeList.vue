<template>
  <div class="fees-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Fees</h1>
        <p class="text-muted">Manage all fees</p>
      </div>
      <router-link to="/admin/fees/new" class="btn btn-primary">
        <i>➕</i> Add Fee
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
          <div class="col-md-4">
            <CustomSelect
              v-model="filters.classId"
              label="Class"
              :options="classOptions"
              placeholder="All classes"
            />
          </div>
          <div class="col-md-4">
            <CustomSelect
              v-model="filters.sectionId"
              label="Section"
              :options="sectionOptions"
              :disabled="!filters.classId"
              placeholder="All sections"
            />
          </div>
          <div class="col-md-4">
            <CustomSelect
              v-model="filters.studentId"
              label="Student"
              :options="studentOptions"
              :disabled="!filters.classId"
              placeholder="Select class first"
            />
          </div>
          <div class="col-md-4">
            <CustomSelect
              v-model="filters.status"
              label="Status"
              :options="statusOptions"
              placeholder="Filter by status"
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
        <h5 class="mb-0">Fees List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading fees...</p>
      </div>

      <div v-else-if="fees.length === 0" class="text-center p-5">
        <p class="text-muted">No fees found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fee in fees" :key="fee._id">
              <td class="fw-bold">{{ fee.studentId?.fullName || '-' }}</td>
              <td>{{ fee.classId?.name || '-' }}</td>
              <td>₹ {{ fee.amount }}</td>
              <td v-format-date="fee.dueDate"></td>
              <td><span :class="['badge', fee.status === 'paid' ? 'bg-success' : 'bg-warning']">{{ fee.status }}</span></td>
              <td>
                <div class="btn-group btn-group-sm">
                  <router-link :to="`/admin/fees/${fee._id}/edit`" class="btn btn-outline-warning">✏️</router-link>
                  <button class="btn btn-outline-danger" @click="onDeleteFee(fee._id)">🗑️</button>
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
import { classes, sections, students } from '../../../api/api.js';
import CustomSelect from '../../../components/CustomSelect.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'FeeList',
  components: { CustomSelect, AlertComponent },
  data() {
    return {
      filters: { classId: '', sectionId: '', studentId: '', status: '' },
      classOptions: [],
      allSections: [],
      allStudents: [],
      statusOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' }
      ],
      successMessage: '',
      errorMessage: '',
      page: 1,
      limit: 20
    };
  },
  computed: {
    ...mapState('fees', ['fees', 'loading', 'pagination']),
    ...mapGetters('fees', ['isLoading']),
    currentPage() {
      return this.pagination?.page || 1;
    },
    sectionOptions() {
      return this.allSections
        .filter((section) => !this.filters.classId || section.classId === this.filters.classId)
        .map((section) => ({
          value: section._id,
          label: section.className ? `${section.name} (${section.className})` : section.name
        }));
    },
    studentOptions() {
      return this.allStudents
        .filter((student) => !this.filters.classId || student.classId === this.filters.classId)
        .filter((student) => !this.filters.sectionId || student.sectionId === this.filters.sectionId)
        .map((student) => ({
          value: student._id,
          label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
        }));
    },
    totalPages() {
      const pages = this.pagination?.pages;
      if (pages) return pages;
      const total = this.pagination?.total || 0;
      const limit = this.pagination?.limit || this.limit;
      return Math.max(1, Math.ceil(total / limit));
    }
  },
  watch: {
    'filters.classId'() {
      this.filters.sectionId = '';
      this.filters.studentId = '';
    },
    'filters.sectionId'() {
      this.filters.studentId = '';
    }
  },
  methods: {
    ...mapActions('fees', {
      fetchFees: 'fetch',
      removeFee: 'delete'
    }),
    async loadFilterOptions() {
      const [classesResponse, sectionsResponse, studentsResponse] = await Promise.all([
        classes.getAll(1, 200),
        sections.getAll(1, 200),
        students.getAll(1, 500)
      ]);

      const classData = classesResponse?.data || [];
      this.classOptions = classData.map((item) => ({
        value: item._id,
        label: item.classCode ? `${item.name} (${item.classCode})` : item.name
      }));

      const classMap = Object.fromEntries(classData.map((item) => [item._id, item.name]));
      this.allSections = (sectionsResponse?.data || []).map((item) => ({
        ...item,
        classId: item.classId?._id || item.classId,
        className: classMap[item.classId?._id || item.classId] || ''
      }));

      this.allStudents = (studentsResponse?.data || []).map((item) => ({
        ...item,
        classId: item.class?._id || item.latestSession?.classId?._id || item.latestSession?.classId || '',
        sectionId: item.section?._id || item.latestSession?.sectionId?._id || item.latestSession?.sectionId || ''
      }));
    },
    async applyFilters() {
      try {
        this.page = 1;
        await this.fetchFees({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { classId: '', sectionId: '', studentId: '', status: '' };
      this.applyFilters();
    },
    async refreshList() {
      await this.fetchFees({ page: this.page, limit: this.limit, filters: this.filters });
    },
    async goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.page = page;
      await this.fetchFees({ page: this.page, limit: this.limit, filters: this.filters });
    },
    async onDeleteFee(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.removeFee(id);
        this.successMessage = 'Fee deleted';
        if (this.fees.length === 1 && this.currentPage > 1) {
          this.page = this.currentPage - 1;
        }
        await this.fetchFees({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    }
  },
  async mounted() {
    await this.loadFilterOptions();
    this.applyFilters();
  }
};
</script>

<style scoped>
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
.page-header h1 { font-size: 2rem; font-weight: 700; }
</style>
