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
            <CustomInput
              v-model="filters.studentId"
              label="Student ID"
              placeholder="Search by student"
              @blur="applyFilters"
            />
          </div>
          <div class="col-md-4">
            <CustomSelect
              v-model="filters.status"
              label="Status"
              :options="statusOptions"
              placeholder="Filter by status"
              @update:model-value="applyFilters"
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
                  <button class="btn btn-outline-danger" @click="deleteFee(fee._id)">🗑️</button>
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
import CustomSelect from '../../../components/CustomSelect.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'FeeList',
  components: { CustomInput, CustomSelect, AlertComponent },
  data() {
    return {
      filters: { studentId: '', status: '' },
      statusOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' }
      ],
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    ...mapState('fees', ['fees', 'loading']),
    ...mapGetters('fees', ['isLoading'])
  },
  methods: {
    ...mapActions('fees', ['fetchFees', 'deleteFee']),
    async applyFilters() {
      try {
        await this.fetchFees({ page: 1, limit: 20, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { studentId: '', status: '' };
      this.applyFilters();
    },
    async refreshList() {
      await this.applyFilters();
    },
    async deleteFee(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.deleteFee(id);
        this.successMessage = 'Fee deleted';
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
