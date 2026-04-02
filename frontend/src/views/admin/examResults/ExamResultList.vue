<template>
  <div class="exam-result-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Exam Results</h1>
        <p class="text-muted mb-0">Manage, finalize, and download student exam results.</p>
      </div>
      <router-link to="/admin/exam-results/new" class="btn btn-primary">
        Add Result
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
          <div class="col-lg-3 col-md-6">
            <CustomSelect
              v-model="filters.classId"
              label="Class"
              :options="classOptions"
              placeholder="All classes"
            />
          </div>
          <div class="col-lg-3 col-md-6">
            <CustomSelect
              v-model="filters.sectionId"
              label="Section"
              :options="sectionOptions"
              :disabled="!filters.classId"
              placeholder="All sections"
            />
          </div>
          <div class="col-lg-3 col-md-6">
            <CustomSelect
              v-model="filters.studentId"
              label="Student"
              :options="studentOptions"
              :disabled="!filters.classId"
              placeholder="Select class first"
            />
          </div>
          <div class="col-lg-3 col-md-6">
            <CustomInput
              v-model="filters.examDate"
              label="Date"
              type="date"
            />
          </div>
          <div class="col-12 d-flex gap-2 justify-content-end">
            <button class="btn btn-outline-secondary" @click="clearFilters">Clear</button>
            <button class="btn btn-primary" @click="applyFilters">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center p-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3 text-muted">Loading exam results...</p>
    </div>

    <div v-else-if="examResults.length === 0" class="empty-state">
      <h3>No exam results found</h3>
      <p>Try changing the filters or add a new exam result.</p>
    </div>

    <div v-else class="results-grid">
      <div v-for="result in examResults" :key="result._id" class="result-card">
        <div class="card-top">
          <div>
            <div class="eyebrow">{{ result.examName }}</div>
            <h3>{{ result.studentId?.fullName || '-' }}</h3>
            <p class="meta">
              {{ result.studentId?.registrationNumber || '-' }} |
              {{ result.classId?.name || '-' }}
              <span v-if="result.sectionId?.name"> / {{ result.sectionId.name }}</span>
            </p>
          </div>
          <div class="status-stack">
            <span :class="['badge rounded-pill', result.isFinalized ? 'text-bg-success' : 'text-bg-warning']">
              {{ result.isFinalized ? 'Finalized' : 'Draft' }}
            </span>
            <span :class="['badge rounded-pill', result.resultStatus === 'pass' ? 'text-bg-primary' : 'text-bg-danger']">
              {{ result.resultStatus }}
            </span>
          </div>
        </div>

        <div class="summary-grid">
          <div>
            <small>Year</small>
            <strong>{{ result.year }}</strong>
          </div>
          <div>
            <small>Exam Date</small>
            <strong>{{ formatDate(result.examDate) }}</strong>
          </div>
          <div>
            <small>Obtained</small>
            <strong>{{ result.totalObtainedMarks }}/{{ result.totalMarks }}</strong>
          </div>
          <div>
            <small>Grade</small>
            <strong>{{ result.overallGrade }}</strong>
          </div>
        </div>

        <div class="subjects-table table-responsive">
          <table class="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Internal</th>
                <th>External</th>
                <th>Obtained</th>
                <th>Pass</th>
                <th>Total</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in result.subjects" :key="subject._id || subject.subjectId?._id || subject.subjectId || subject.subject">
                <td class="fw-semibold">{{ subject.subject }}</td>
                <td>{{ subject.internalMarks ?? '-' }}</td>
                <td>{{ subject.externalMarks ?? '-' }}</td>
                <td>{{ subject.obtainedMarks }}</td>
                <td>{{ subject.passMarks }}</td>
                <td>{{ subject.totalMarks }}</td>
                <td>{{ subject.grade }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="action-row">
          <button class="btn btn-outline-dark btn-sm" :disabled="pdfLoadingId === result._id" @click="handleDownload(result)">
            {{ pdfLoadingId === result._id ? 'Preparing PDF...' : 'Download PDF' }}
          </button>
          <router-link
            v-if="!result.isFinalized"
            :to="`/admin/exam-results/${result._id}/edit`"
            class="btn btn-outline-warning btn-sm"
          >
            Edit
          </router-link>
          <button v-else class="btn btn-outline-secondary btn-sm" type="button" disabled>
            Edit Locked
          </button>
          <button
            class="btn btn-outline-success btn-sm"
            :disabled="result.isFinalized"
            @click="openFinalizeModal(result)"
          >
            Finalize
          </button>
          <button
            class="btn btn-outline-danger btn-sm"
            :disabled="result.isFinalized"
            @click="handleDelete(result)"
          >
            Delete
          </button>
        </div>
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

    <div v-if="showFinalizeModal && selectedResult" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Finalize Result</h5>
            <button type="button" class="btn-close" @click="closeFinalizeModal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              Finalize <strong>{{ selectedResult.examName }}</strong> for
              <strong>{{ selectedResult.studentId?.fullName }}</strong>?
              After finalizing, this result cannot be edited or deleted.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeFinalizeModal">Cancel</button>
            <button type="button" class="btn btn-success" :disabled="isFinalizing" @click="confirmFinalize">
              {{ isFinalizing ? 'Finalizing...' : 'Yes, Finalize' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showFinalizeModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { examResults as examResultsApi, classes, sections, students } from '../../../api/api.js';
import AlertComponent from '../../../components/AlertComponent.vue';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'ExamResultList',
  components: { AlertComponent, CustomInput, CustomSelect },
  data() {
    return {
      filters: {
        classId: '',
        sectionId: '',
        studentId: '',
        examDate: ''
      },
      studentOptionsSource: [],
      classOptions: [],
      allSections: [],
      page: 1,
      limit: 10,
      successMessage: '',
      errorMessage: '',
      showFinalizeModal: false,
      selectedResult: null,
      isFinalizing: false,
      pdfLoadingId: ''
    };
  },
  computed: {
    ...mapState('examResults', ['examResults', 'pagination']),
    ...mapGetters('examResults', ['isLoading']),
    currentPage() {
      return this.pagination?.page || 1;
    },
    totalPages() {
      return this.pagination?.pages || Math.max(1, Math.ceil((this.pagination?.total || 0) / (this.pagination?.limit || this.limit)));
    },
    sectionOptions() {
      const items = this.filters.classId
        ? this.allSections.filter((section) => section.classId === this.filters.classId)
        : this.allSections;

      return items.map((section) => ({
        value: section._id,
        label: section.className ? `${section.name} (${section.className})` : section.name
      }));
    },
    studentOptions() {
      return this.studentOptionsSource
        .filter((student) => !this.filters.classId || student.classId === this.filters.classId)
        .filter((student) => !this.filters.sectionId || student.sectionId === this.filters.sectionId)
        .map((student) => ({
          value: student._id,
          label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
        }));
    }
  },
  watch: {
    'filters.classId'(value) {
      if (!value) {
        this.filters.sectionId = '';
        return;
      }

      const valid = this.allSections.some((section) => section._id === this.filters.sectionId && section.classId === value);
      if (!valid) {
        this.filters.sectionId = '';
      }
      this.filters.studentId = '';
    },
    'filters.sectionId'() {
      this.filters.studentId = '';
    }
  },
  methods: {
    ...mapActions('examResults', {
      fetchExamResults: 'fetch',
      deleteExamResult: 'delete',
      finalizeExamResult: 'finalize'
    }),
    formatDate(value) {
      if (!value) return '-';
      return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    async loadFilterOptions() {
      const [studentsResponse, classesResponse, sectionsResponse] = await Promise.all([
        students.getAll(1, 200),
        classes.getAll(1, 200),
        sections.getAll(1, 200)
      ]);

      this.studentOptionsSource = (studentsResponse?.data || []).map((student) => ({
        ...student,
        classId: student.class?._id || student.latestSession?.classId?._id || student.latestSession?.classId || '',
        sectionId: student.section?._id || student.latestSession?.sectionId?._id || student.latestSession?.sectionId || ''
      }));

      this.classOptions = (classesResponse?.data || []).map((cls) => ({
        value: cls._id,
        label: cls.classCode ? `${cls.name} (${cls.classCode})` : cls.name
      }));

      const classMap = Object.fromEntries((classesResponse?.data || []).map((cls) => [cls._id, cls.name]));
      this.allSections = (sectionsResponse?.data || []).map((section) => ({
        ...section,
        classId: section.classId?._id || section.classId,
        className: classMap[section.classId?._id || section.classId] || ''
      }));
    },
    async applyFilters() {
      try {
        this.page = 1;
        await this.fetchExamResults({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { classId: '', sectionId: '', studentId: '', examDate: '' };
      this.applyFilters();
    },
    async goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.page = page;
      await this.fetchExamResults({ page: this.page, limit: this.limit, filters: this.filters });
    },
    async handleDelete(result) {
      if (result.isFinalized) return;
      if (!confirm(`Delete ${result.examName} result for ${result.studentId?.fullName}?`)) return;

      try {
        await this.deleteExamResult(result._id);
        this.successMessage = 'Exam result deleted successfully';
        await this.fetchExamResults({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    openFinalizeModal(result) {
      if (result.isFinalized) return;
      this.selectedResult = result;
      this.showFinalizeModal = true;
    },
    closeFinalizeModal() {
      this.showFinalizeModal = false;
      this.selectedResult = null;
    },
    async confirmFinalize() {
      if (!this.selectedResult) return;

      try {
        this.isFinalizing = true;
        await this.finalizeExamResult(this.selectedResult._id);
        this.successMessage = 'Exam result finalized successfully';
        this.closeFinalizeModal();
        await this.fetchExamResults({ page: this.page, limit: this.limit, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isFinalizing = false;
      }
    },
    async handleDownload(result) {
      try {
        this.pdfLoadingId = result._id;
        const blob = await examResultsApi.downloadPdf(result._id);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${result.examName}-${result.studentId?.registrationNumber || result._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.pdfLoadingId = '';
      }
    }
  },
  async mounted() {
    try {
      await this.loadFilterOptions();
      await this.applyFilters();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    }
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

.empty-state {
  border: 1px dashed #c7d2e0;
  background: #fff;
  border-radius: 20px;
  text-align: center;
  padding: 4rem 1.5rem;
}

.results-grid {
  display: grid;
  gap: 1.25rem;
}

.result-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #d8e3ef;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 16px 40px rgba(16, 37, 66, 0.06);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.eyebrow {
  display: inline-block;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #102542;
  color: #fff;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.card-top h3 {
  margin-bottom: 0.25rem;
}

.meta {
  color: #66788a;
  margin-bottom: 0;
}

.status-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-grid > div {
  background: #f4f8fc;
  border-radius: 14px;
  padding: 0.9rem 1rem;
}

.summary-grid small {
  display: block;
  color: #6b7b8d;
  margin-bottom: 0.25rem;
}

.summary-grid strong {
  color: #102542;
  font-size: 1rem;
}

.subjects-table {
  background: #fff;
  border: 1px solid #e3ebf3;
  border-radius: 16px;
  overflow: hidden;
}

.subjects-table thead th {
  background: #102542;
  color: #fff;
  border: none;
  padding: 0.9rem 0.8rem;
}

.subjects-table tbody td {
  padding: 0.8rem;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
