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
            <div class="col-md-4">
              <CustomInput
                v-model="studentSearch"
                label="Student Search"
                placeholder="Search selected class/section students"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="generateForm.studentIds"
                label="Students"
                :options="filteredStudentOptions"
                :multiple="true"
                :size="8"
                :disabled="!generateForm.classId"
                :error="generateErrors.studentIds"
              />
              <small class="text-muted">Leave empty to generate for all students in the selected class/section.</small>
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="generateForm.certificateNames"
                label="Certificate Types"
                :options="certificateOptions"
                :multiple="true"
                :size="6"
                :error="generateErrors.certificateNames"
              />
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
import CustomInput from '../../../components/CustomInput.vue';
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
  components: { AlertComponent, CustomInput, CustomSelect },
  data() {
    return {
      classOptions: [],
      allSections: [],
      allStudents: [],
      studentSearch: '',
      certificateOptions: [],
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
      const needle = this.studentSearch.trim().toLowerCase();
      return this.candidateStudents
        .filter((student) => {
          if (!needle) return true;
          return `${student.fullName} ${student.registrationNumber}`.toLowerCase().includes(needle);
        })
        .map((student) => ({
          value: student._id,
          label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
        }));
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
    },
    'generateForm.sectionId'() {
      this.generateForm.studentIds = [];
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
      if (page < 1 || page > this.pagination.pages) return;

      try {
        this.loadingList = true;
        const response = await certificates.getAll(page, this.pagination.limit, this.filters);
        this.records = response?.data || [];
        this.pagination = response?.pagination || this.pagination;
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
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
      this.loading = true;
      await this.loadDropdownData();
      await this.fetchCertificates(1);
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.loading = false;
    }
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
</style>
