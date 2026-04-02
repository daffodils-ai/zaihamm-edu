<template>
  <div class="certificate-page">
    <div class="page-header mb-4">
      <h1>Certificates</h1>
      <p class="text-muted mb-0">Generate certificate records and download selected PDFs as a single zip file.</p>
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
      <div class="card-header">
        <h5 class="mb-0">Generate Certificates</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleGenerate">
          <div class="row g-4">
            <div class="col-md-4">
              <CustomSelect
                v-model="generateForm.classId"
                label="Class"
                :options="classOptions"
                placeholder="Select class"
                required
                :error="generateErrors.classId"
              />
            </div>
            <div class="col-md-4">
              <CustomSelect
                v-model="generateForm.sectionId"
                label="Section"
                :options="sectionOptions"
                :disabled="!generateForm.classId"
                placeholder="All sections"
                :error="generateErrors.sectionId"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Students</label>
              <div ref="studentDropdown" class="multi-select">
                <button
                  type="button"
                  :class="['multi-select-trigger', { 'is-invalid': generateErrors.studentIds, open: studentDropdownOpen }]"
                  :disabled="!generateForm.classId"
                  @click="toggleStudentDropdown"
                >
                  <span>{{ selectedStudentsLabel }}</span>
                  <span class="multi-select-caret">{{ studentDropdownOpen ? '▲' : '▼' }}</span>
                </button>

                <div v-if="studentDropdownOpen" class="multi-select-menu">
                  <div class="multi-select-actions">
                    <button type="button" class="btn btn-link btn-sm p-0" @click="selectAllStudents">Select All</button>
                    <button type="button" class="btn btn-link btn-sm p-0" @click="clearAllStudents">Clear All</button>
                  </div>

                  <label
                    v-for="option in filteredStudentOptions"
                    :key="option.value"
                    class="multi-select-option"
                  >
                    <input
                      type="checkbox"
                      :checked="generateForm.studentIds.includes(option.value)"
                      @change="toggleStudentSelection(option.value)"
                    />
                    <span>{{ option.label }}</span>
                  </label>
                </div>
              </div>
              <small v-if="generateErrors.studentIds" class="text-danger d-block mt-2">{{ generateErrors.studentIds }}</small>
              <small class="text-muted">Leave empty to generate for all students in the selected class/section.</small>
            </div>
            <div class="col-md-6">
              <label class="form-label">Certificate Types</label>
              <div ref="certificateDropdown" class="multi-select">
                <button
                  type="button"
                  :class="['multi-select-trigger', { 'is-invalid': generateErrors.certificateNames, open: certificateDropdownOpen }]"
                  @click="toggleCertificateDropdown"
                >
                  <span>{{ selectedCertificateLabel }}</span>
                  <span class="multi-select-caret">{{ certificateDropdownOpen ? '▲' : '▼' }}</span>
                </button>

                <div v-if="certificateDropdownOpen" class="multi-select-menu">
                  <div class="multi-select-actions">
                    <button type="button" class="btn btn-link btn-sm p-0" @click="selectAllCertificates">Select All</button>
                    <button type="button" class="btn btn-link btn-sm p-0" @click="clearAllCertificates">Clear All</button>
                  </div>

                  <label
                    v-for="option in certificateOptions"
                    :key="option.value"
                    class="multi-select-option"
                  >
                    <input
                      type="checkbox"
                      :checked="generateForm.certificateNames.includes(option.value)"
                      @change="toggleCertificateSelection(option.value)"
                    />
                    <span>{{ option.label }}</span>
                  </label>
                </div>
              </div>
              <small v-if="generateErrors.certificateNames" class="text-danger d-block mt-2">{{ generateErrors.certificateNames }}</small>
            </div>
            <div class="col-12">
              <label class="form-label">Remarks</label>
              <textarea
                v-model="generateForm.remarks"
                class="form-control"
                rows="3"
                placeholder="Add remarks to print on certificates"
              ></textarea>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Generating...' : 'Generate' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <CustomSelect
              v-model="filters.classId"
              label="Class"
              :options="classOptions"
              placeholder="All classes"
            />
          </div>
          <div class="col-md-3">
            <CustomSelect
              v-model="filters.sectionId"
              label="Section"
              :options="filterSectionOptions"
              :disabled="!filters.classId"
              placeholder="All sections"
            />
          </div>
          <div class="col-md-3">
            <CustomSelect
              v-model="filters.studentId"
              label="Student"
              :options="filterStudentOptions"
              :disabled="!filters.classId"
              placeholder="All students"
            />
          </div>
          <div class="col-md-3">
            <CustomSelect
              v-model="filters.certificateName"
              label="Certificate"
              :options="certificateOptions"
              placeholder="All certificates"
            />
          </div>
          <div class="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button class="btn btn-outline-dark" :disabled="!selectedIds.length || downloadLoading" @click="downloadSelected">
              {{ downloadLoading ? 'Preparing zip...' : `Download Selected (${selectedIds.length})` }}
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" @click="clearFilters" type="button">Clear</button>
              <button class="btn btn-primary" @click="fetchCertificates(1)" type="button">Search</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingList" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted mb-0">Loading certificate records...</p>
      </div>

      <div v-else-if="records.length === 0" class="text-center p-5">
        <h5>No certificate records found</h5>
        <p class="text-muted mb-0">Generated certificates will appear here.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  :checked="allCurrentPageSelected"
                  @change="toggleCurrentPageSelection($event.target.checked)"
                />
              </th>
              <th>Certificate</th>
              <th>Student</th>
              <th>Class / Section</th>
              <th>Remarks</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record._id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(record._id)"
                  @change="toggleSelection(record._id, $event.target.checked)"
                />
              </td>
              <td class="text-capitalize">{{ formatCertificateName(record.certificateName) }}</td>
              <td>
                <div class="fw-semibold">{{ record.studentId?.fullName || '-' }}</div>
                <small class="text-muted">{{ record.studentId?.registrationNumber || '-' }}</small>
              </td>
              <td>{{ record.classId?.name || '-' }}<span v-if="record.sectionId?.name"> / {{ record.sectionId.name }}</span></td>
              <td class="text-wrap">{{ record.remarks || '-' }}</td>
              <td>{{ formatDate(record.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <nav v-if="pagination.pages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: pagination.page === 1 }]">
          <button class="page-link" @click="fetchCertificates(pagination.page - 1)">Previous</button>
        </li>
        <li
          v-for="page in pagination.pages"
          :key="page"
          :class="['page-item', { active: page === pagination.page }]"
        >
          <button class="page-link" @click="fetchCertificates(page)">{{ page }}</button>
        </li>
        <li :class="['page-item', { disabled: pagination.page === pagination.pages }]">
          <button class="page-link" @click="fetchCertificates(pagination.page + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { certificates, classes, sections, students } from '../../../api/api.js';
import AlertComponent from '../../../components/AlertComponent.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import { getErrorMessage } from '../../../utils/validation.js';

const CERTIFICATE_LABELS = {
  bonafide: 'Bonafide Certificate',
  character: 'Character Certificate',
  transfer: 'Transfer Certificate',
  admit_card: 'Admit Card'
};

export default {
  name: 'CertificateList',
  components: { AlertComponent, CustomSelect },
  data() {
    return {
      classOptions: [],
      allSections: [],
      allStudents: [],
      certificateOptions: [],
      studentDropdownOpen: false,
      certificateDropdownOpen: false,
      generateForm: {
        classId: '',
        sectionId: '',
        studentIds: [],
        certificateNames: [],
        remarks: ''
      },
      generateErrors: {},
      filters: {
        classId: '',
        sectionId: '',
        studentId: '',
        certificateName: ''
      },
      records: [],
      selectedIds: [],
      pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
      },
      loading: false,
      loadingList: false,
      downloadLoading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    sectionOptions() {
      return this.allSections
        .filter((item) => !this.generateForm.classId || item.classId === this.generateForm.classId)
        .map((item) => ({ value: item._id, label: item.name }));
    },
    filterSectionOptions() {
      return this.allSections
        .filter((item) => !this.filters.classId || item.classId === this.filters.classId)
        .map((item) => ({ value: item._id, label: item.name }));
    },
    candidateStudents() {
      return this.allStudents.filter((student) => {
        if (!this.generateForm.classId) return false;
        const matchesClass = student.classId === this.generateForm.classId;
        const matchesSection = !this.generateForm.sectionId || student.sectionId === this.generateForm.sectionId;
        return matchesClass && matchesSection;
      });
    },
    filteredStudentOptions() {
      return this.candidateStudents
        .map((student) => ({
          value: student._id,
          label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
        }));
    },
    selectedStudentsLabel() {
      if (!this.generateForm.classId) return 'Select class first';
      if (!this.generateForm.studentIds.length) return 'Select students';
      if (this.generateForm.studentIds.length === this.filteredStudentOptions.length) return 'All students selected';

      return this.filteredStudentOptions
        .filter((option) => this.generateForm.studentIds.includes(option.value))
        .map((option) => option.label)
        .join(', ');
    },
    selectedCertificateLabel() {
      if (!this.generateForm.certificateNames.length) return 'Select certificate types';
      if (this.generateForm.certificateNames.length === this.certificateOptions.length) return 'All certificate types selected';

      return this.certificateOptions
        .filter((option) => this.generateForm.certificateNames.includes(option.value))
        .map((option) => option.label)
        .join(', ');
    },
    filterStudentOptions() {
      return this.allStudents
        .filter((student) => !this.filters.classId || student.classId === this.filters.classId)
        .filter((student) => !this.filters.sectionId || student.sectionId === this.filters.sectionId)
        .map((student) => ({
          value: student._id,
          label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
        }));
    },
    allCurrentPageSelected() {
      return this.records.length > 0 && this.records.every((record) => this.selectedIds.includes(record._id));
    }
  },
  watch: {
    'generateForm.classId'() {
      this.generateForm.sectionId = '';
      this.generateForm.studentIds = [];
      this.studentDropdownOpen = false;
    },
    'generateForm.sectionId'() {
      this.generateForm.studentIds = [];
      this.studentDropdownOpen = false;
    },
    'filters.classId'() {
      this.filters.sectionId = '';
      this.filters.studentId = '';
    },
    'filters.sectionId'() {
      this.filters.studentId = '';
    }
  },
  methods: {
    toggleStudentDropdown() {
      if (!this.generateForm.classId) return;
      this.studentDropdownOpen = !this.studentDropdownOpen;
      if (this.studentDropdownOpen) {
        this.certificateDropdownOpen = false;
      }
    },
    toggleCertificateDropdown() {
      this.certificateDropdownOpen = !this.certificateDropdownOpen;
      if (this.certificateDropdownOpen) {
        this.studentDropdownOpen = false;
      }
    },
    toggleStudentSelection(value) {
      if (this.generateForm.studentIds.includes(value)) {
        this.generateForm.studentIds = this.generateForm.studentIds.filter((item) => item !== value);
        return;
      }
      this.generateForm.studentIds = [...this.generateForm.studentIds, value];
    },
    toggleCertificateSelection(value) {
      if (this.generateForm.certificateNames.includes(value)) {
        this.generateForm.certificateNames = this.generateForm.certificateNames.filter((item) => item !== value);
        return;
      }
      this.generateForm.certificateNames = [...this.generateForm.certificateNames, value];
    },
    selectAllStudents() {
      this.generateForm.studentIds = this.filteredStudentOptions.map((option) => option.value);
    },
    clearAllStudents() {
      this.generateForm.studentIds = [];
    },
    selectAllCertificates() {
      this.generateForm.certificateNames = this.certificateOptions.map((option) => option.value);
    },
    clearAllCertificates() {
      this.generateForm.certificateNames = [];
    },
    handleClickOutside(event) {
      if (this.$refs.studentDropdown && !this.$refs.studentDropdown.contains(event.target)) {
        this.studentDropdownOpen = false;
      }
      if (this.$refs.certificateDropdown && !this.$refs.certificateDropdown.contains(event.target)) {
        this.certificateDropdownOpen = false;
      }
    },
    formatCertificateName(value) {
      return CERTIFICATE_LABELS[value] || value;
    },
    formatDate(value) {
      if (!value) return '-';
      return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    downloadBlob(blob, fileName) {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    },
    async loadDropdownData() {
      try {
        const [classResponse, sectionResponse, studentResponse, certificateResponse] = await Promise.all([
          classes.getAll(1, 200),
          sections.getAll(1, 200),
          students.getAll(1, 500),
          certificates.getOptions()
        ]);

        const classData = classResponse?.data || [];
        this.classOptions = classData.map((item) => ({
          value: item._id,
          label: item.classCode ? `${item.name} (${item.classCode})` : item.name
        }));

        this.allSections = (sectionResponse?.data || []).map((item) => ({
          ...item,
          classId: item.classId?._id || item.classId
        }));

        this.allStudents = (studentResponse?.data || []).map((item) => ({
          ...item,
          classId: item.class?._id || item.latestSession?.classId?._id || item.latestSession?.classId || '',
          sectionId: item.section?._id || item.latestSession?.sectionId?._id || item.latestSession?.sectionId || ''
        }));

        this.certificateOptions = (certificateResponse?.data || []).map((value) => ({
          value,
          label: this.formatCertificateName(value)
        }));
      } catch (error) {
        console.error('Error loading dropdown data:', error);
        this.errorMessage = 'Failed to load form options. Some fields may be empty.';
        throw error;
      }
    },
    validateGenerateForm() {
      this.generateErrors = {};
      if (!this.generateForm.classId) {
        this.generateErrors.classId = 'Class is required';
      }
      if (!this.generateForm.certificateNames.length) {
        this.generateErrors.certificateNames = 'Select at least one certificate type';
      }
      return Object.keys(this.generateErrors).length === 0;
    },
    async handleGenerate() {
      if (!this.validateGenerateForm()) return;

      try {
        this.loading = true;
        await certificates.create({
          classId: this.generateForm.classId,
          sectionId: this.generateForm.sectionId || null,
          studentIds: this.generateForm.studentIds,
          certificateNames: this.generateForm.certificateNames,
          remarks: this.generateForm.remarks
        });

        this.successMessage = 'Certificate records generated successfully';
        this.generateForm.studentIds = [];
        this.generateForm.certificateNames = [];
        this.generateForm.remarks = '';
        await this.fetchCertificates(1);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCertificates(page = 1) {
      // Guard against invalid page numbers, but allow page 1 even if pages is 0
      if (page < 1 || (this.pagination.pages > 0 && page > this.pagination.pages)) return;

      try {
        this.loadingList = true;
        const response = await certificates.getAll(page, this.pagination.limit, this.filters);
        this.records = response?.data || [];
        this.pagination = response?.pagination || this.pagination;
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
        this.records = [];
      } finally {
        this.loadingList = false;
      }
    },
    clearFilters() {
      this.filters = {
        classId: '',
        sectionId: '',
        studentId: '',
        certificateName: ''
      };
      this.fetchCertificates(1);
    },
    toggleSelection(id, checked) {
      if (checked) {
        this.selectedIds = [...new Set([...this.selectedIds, id])];
        return;
      }

      this.selectedIds = this.selectedIds.filter((item) => item !== id);
    },
    toggleCurrentPageSelection(checked) {
      const pageIds = this.records.map((item) => item._id);
      if (checked) {
        this.selectedIds = [...new Set([...this.selectedIds, ...pageIds])];
        return;
      }
      this.selectedIds = this.selectedIds.filter((item) => !pageIds.includes(item));
    },
    async downloadSelected() {
      if (!this.selectedIds.length) return;

      try {
        this.downloadLoading = true;
        const blob = await certificates.bulkDownload(this.selectedIds);
        this.downloadBlob(blob, 'certificates.zip');
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.downloadLoading = false;
      }
    }
  },
  async mounted() {
    try {
      document.addEventListener('click', this.handleClickOutside);
      
      // Load dropdown data first
      this.loading = true;
      try {
        await this.loadDropdownData();
      } catch (error) {
        console.error('Dropdown data load failed, but continuing to load certificate list:', error);
        // Continue even if dropdown data fails - the list should still load
      }
      
      // Load certificates regardless of dropdown status
      await this.fetchCertificates(1);
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

.text-wrap {
  max-width: 260px;
}

.multi-select {
  position: relative;
}

.multi-select-trigger {
  width: 100%;
  min-height: 44px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  padding: 0.65rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  color: #2c3e50;
}

.multi-select-trigger.open,
.multi-select-trigger:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.15);
  outline: none;
}

.multi-select-trigger:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.multi-select-trigger.is-invalid {
  border-color: #e74c3c;
}

.multi-select-caret {
  flex: 0 0 auto;
  font-size: 0.8rem;
  color: #64748b;
}

.multi-select-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  padding: 0.85rem;
  max-height: 280px;
  overflow-y: auto;
}

.multi-select-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.65rem;
  margin-bottom: 0.65rem;
  border-bottom: 1px solid #e7eef5;
}

.multi-select-option {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.45rem 0;
  cursor: pointer;
  color: #2c3e50;
}

.multi-select-option input {
  margin: 0;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
</style>
