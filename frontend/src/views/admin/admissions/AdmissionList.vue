<template>
  <div class="admissions-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Admission Entries</h1>
        <p class="text-muted">Manage all admission tracker entries</p>
      </div>
      <div class="d-flex gap-2 align-items-center flex-wrap">
        <button class="btn btn-outline-secondary" :disabled="downloadLoading" @click="downloadTemplate">
          {{ downloadLoading ? 'Preparing...' : 'Download Excel Template' }}
        </button>
        <button class="btn btn-outline-dark" :disabled="exportLoading" @click="exportAdmissions">
          {{ exportLoading ? 'Exporting...' : 'Export Records' }}
        </button>
        <label class="btn btn-success mb-0">
          {{ importLoading ? 'Importing...' : 'Import Excel/CSV' }}
          <input type="file" accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" class="d-none" :disabled="importLoading" @change="handleFileImport" />
        </label>
        <router-link to="/admin/admissions/new" class="btn btn-primary">
          <i>➕</i> Add Admission
        </router-link>
      </div>
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
              v-model="filters.fullName"
              label="Search by Name"
              placeholder="Enter student name"
            />
          </div>
          <div class="col-md-3">
            <CustomInput
              v-model="filters.fatherName"
              label="Father's Name"
              placeholder="Enter father's name"
            />
          </div>
          <div class="col-md-2">
            <CustomInput
              v-model="filters.aadharNo"
              label="Aadhar Number"
              placeholder="Enter aadhar no"
            />
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
        <h5 class="mb-0">Admission Entries List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading admissions...</p>
      </div>

      <div v-else-if="admissions.length === 0" class="text-center p-5">
        <p class="text-muted">No admission entries found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Age</th>
              <th>Father's Name</th>
              <th>Mother's Name</th>
              <th>Aadhar No</th>
              <th>Parent Mobile</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admission in admissions" :key="admission._id">
              <td class="fw-bold">{{ admission.fullName }}</td>
              <td>{{ admission.age }}</td>
              <td>{{ admission.fatherName }}</td>
              <td>{{ admission.motherName }}</td>
              <td>{{ admission.aadharNo }}</td>
              <td>{{ admission.parentMobile }}</td>
              <td v-format-date="admission.createdAt"></td>
              <td>
                <div class="btn-group btn-group-sm">
                  <router-link :to="`/admin/admissions/${admission._id}/edit`" class="btn btn-outline-warning">Admit</router-link>
                  <button class="btn btn-outline-danger" @click="onDeleteAdmission(admission._id)">🗑️</button>
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
import { mapState, mapActions } from 'vuex';
import { admissions } from '../../../api/api.js';
import CustomInput from '../../../components/CustomInput.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'AdmissionList',
  components: { CustomInput, AlertComponent },
  data() {
    return {
      filters: { fullName: '', fatherName: '', motherName: '', aadharNo: '', parentMobile: '', fromDate: '', toDate: '' },
      successMessage: '',
      errorMessage: '',
      downloadLoading: false,
      exportLoading: false,
      importLoading: false,
      page: 1,
      limit: 20
    };
  },
  computed: {
    ...mapState('admissions', ['admissions', 'isLoading']),
    currentPage() {
      return this.page;
    },
    totalPages() {
      const stored = localStorage.getItem(`admissions_${this.page}`);
      return stored ? JSON.parse(stored).pages || 1 : 1;
    }
  },
  methods: {
    ...mapActions('admissions', ['fetchAdmissions', 'deleteAdmission']),
    parseCsvLine(line) {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];

        if (char === '"' && inQuotes && next === '"') {
          current += '"';
          index += 1;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }

      values.push(current);
      return values.map((value) => value.trim());
    },
    parseCsv(text) {
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        return [];
      }

      const headers = this.parseCsvLine(lines[0]);
      return lines.slice(1).map((line) => {
        const values = this.parseCsvLine(line);
        return headers.reduce((acc, header, index) => {
          acc[header] = values[index] ?? '';
          return acc;
        }, {});
      });
    },
    downloadBlob(blob, filename) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    async downloadTemplate() {
      try {
        this.downloadLoading = true;
        const blob = await admissions.downloadTemplate('xlsx');
        this.downloadBlob(blob, 'admission-template.xlsx');
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.downloadLoading = false;
      }
    },
    async exportAdmissions() {
      try {
        this.exportLoading = true;
        const blob = await admissions.exportCsv(this.filters);
        this.downloadBlob(blob, 'admission-records.xlsx');
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.exportLoading = false;
      }
    },
    async handleFileImport(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        this.importLoading = true;
        this.errorMessage = '';
        if (file.name.toLowerCase().endsWith('.csv')) {
          const text = await file.text();
          const rows = this.parseCsv(text);

          if (rows.length === 0) {
            this.errorMessage = 'The selected CSV does not contain any data rows.';
            return;
          }

          const response = await admissions.bulkImport(rows);
          const result = response?.data || {};
          this.successMessage = `Bulk import completed. Created: ${result.created || 0}, Skipped: ${result.skipped || 0}, Failed: ${result.failed || 0}.`;
        } else {
          const response = await admissions.bulkImportFile(file);
          const result = response?.data || {};
          this.successMessage = `Bulk import completed. Created: ${result.created || 0}, Skipped: ${result.skipped || 0}, Failed: ${result.failed || 0}.`;
        }
        await this.loadAdmissions();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.importLoading = false;
        event.target.value = '';
      }
    },
    async loadAdmissions() {
      try {
        this.isLoading = true;
        await this.fetchAdmissions({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },
    applyFilters() {
      this.page = 1;
      this.loadAdmissions();
    },
    clearFilters() {
      this.filters = { fullName: '', fatherName: '', motherName: '', aadharNo: '', parentMobile: '', fromDate: '', toDate: '' };
      this.page = 1;
      this.loadAdmissions();
    },
    refreshList() {
      this.clearFilters();
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.page = page;
        this.loadAdmissions();
      }
    },
    async onDeleteAdmission(id) {
      if (confirm('Are you sure you want to delete this admission entry?')) {
        try {
          await this.deleteAdmission(id);
          this.successMessage = 'Admission entry deleted successfully';
          this.loadAdmissions();
        } catch (error) {
          this.errorMessage = getErrorMessage(error);
        }
      }
    }
  },
  mounted() {
    this.loadAdmissions();
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}
</style>
