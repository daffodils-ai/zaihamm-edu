<template>
  <div class="exam-result-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Exam Result' : 'Add New Exam Result' }}</h1>
      <p class="text-muted">
        {{ isEditMode ? 'Update result details and subjects' : 'Create a student exam result with all subjects' }}
      </p>
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
              <CustomSelect
                v-model="form.studentId"
                label="Student"
                :options="studentOptions"
                placeholder="Select student"
                required
                :error="errors.studentId"
              />
            </div>
            <div class="col-md-3">
              <CustomSelect
                v-model="form.classId"
                label="Class"
                :options="classOptions"
                placeholder="Select class"
                required
                :error="errors.classId"
              />
            </div>
            <div class="col-md-3">
              <CustomSelect
                v-model="form.sectionId"
                label="Section"
                :options="sectionOptions"
                placeholder="Optional section"
                :error="errors.sectionId"
              />
            </div>
            <div class="col-md-3">
              <CustomInput
                v-model="form.year"
                label="Academic Year"
                type="number"
                placeholder="2026"
                required
                :error="errors.year"
              />
            </div>
            <div class="col-md-5">
              <CustomInput
                v-model="form.examName"
                label="Exam Name"
                placeholder="Half Yearly Examination"
                required
                :error="errors.examName"
              />
            </div>
            <div class="col-md-4">
              <CustomInput
                v-model="form.examDate"
                label="Exam Date"
                type="date"
                required
                :error="errors.examDate"
              />
            </div>
          </div>

          <div class="subjects-panel mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 class="mb-1">Subject Results</h5>
                <p class="text-muted mb-0">Add every subject result for this exam record.</p>
              </div>
              <button type="button" class="btn btn-outline-primary" @click="addSubjectRow">
                + Add Subject
              </button>
            </div>

            <div
              v-for="(subject, index) in form.subjects"
              :key="`subject-${index}`"
              class="subject-row"
            >
              <div class="row g-3 align-items-end">
                <div class="col-lg-3">
                  <CustomInput
                    v-model="subject.subject"
                    label="Subject"
                    placeholder="Mathematics"
                    required
                    :error="subjectErrors(index).subject"
                  />
                </div>
                <div class="col-lg-2 col-md-4">
                  <CustomInput
                    v-model="subject.obtainedMarks"
                    label="Obtained Marks"
                    type="number"
                    placeholder="85"
                    required
                    :error="subjectErrors(index).obtainedMarks"
                  />
                </div>
                <div class="col-lg-2 col-md-4">
                  <CustomInput
                    v-model="subject.passMarks"
                    label="Pass Marks"
                    type="number"
                    placeholder="33"
                    required
                    :error="subjectErrors(index).passMarks"
                  />
                </div>
                <div class="col-lg-2 col-md-4">
                  <CustomInput
                    v-model="subject.totalMarks"
                    label="Total Marks"
                    type="number"
                    placeholder="100"
                    required
                    :error="subjectErrors(index).totalMarks"
                  />
                </div>
                <div class="col-lg-2 col-md-8">
                  <CustomInput
                    v-model="subject.grade"
                    label="Grade"
                    placeholder="A"
                    required
                    :error="subjectErrors(index).grade"
                  />
                </div>
                <div class="col-lg-1 col-md-4">
                  <button
                    type="button"
                    class="btn btn-outline-danger w-100"
                    :disabled="form.subjects.length === 1"
                    @click="removeSubjectRow(index)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="summary-strip mt-4">
            <div class="summary-box">
              <span>Subjects</span>
              <strong>{{ form.subjects.length }}</strong>
            </div>
            <div class="summary-box">
              <span>Total Obtained</span>
              <strong>{{ computedTotals.obtained }}</strong>
            </div>
            <div class="summary-box">
              <span>Total Marks</span>
              <strong>{{ computedTotals.total }}</strong>
            </div>
            <div class="summary-box">
              <span>Percentage</span>
              <strong>{{ computedTotals.percentage }}%</strong>
            </div>
          </div>

          <div class="d-flex gap-2 mt-5">
            <CustomButton
              label="Save Result"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="handleSubmit"
            />
            <router-link to="/admin/exam-results" class="btn btn-secondary btn-lg">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { classes, sections, students } from '../../../api/api.js';
import CustomButton from '../../../components/CustomButton.vue';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

const createSubjectRow = () => ({
  subject: '',
  obtainedMarks: '',
  passMarks: '',
  totalMarks: '',
  grade: ''
});

export default {
  name: 'ExamResultForm',
  components: { CustomButton, CustomInput, CustomSelect, AlertComponent },
  data() {
    return {
      form: {
        studentId: '',
        classId: '',
        sectionId: '',
        year: new Date().getFullYear(),
        examName: '',
        examDate: '',
        subjects: [createSubjectRow()]
      },
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false,
      allSections: [],
      studentOptions: [],
      classOptions: [],
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    },
    sectionOptions() {
      const selectedClassId = this.form.classId;
      const items = selectedClassId
        ? this.allSections.filter((section) => section.classId === selectedClassId)
        : this.allSections;

      return items.map((section) => ({
        value: section._id,
        label: section.className ? `${section.name} (${section.className})` : section.name
      }));
    },
    computedTotals() {
      const obtained = this.form.subjects.reduce((sum, item) => sum + (Number(item.obtainedMarks) || 0), 0);
      const total = this.form.subjects.reduce((sum, item) => sum + (Number(item.totalMarks) || 0), 0);
      const percentage = total ? ((obtained / total) * 100).toFixed(2) : '0.00';
      return { obtained, total, percentage };
    }
  },
  watch: {
    'form.classId'(value) {
      if (!value) {
        this.form.sectionId = '';
        return;
      }

      const valid = this.allSections.some((section) => section._id === this.form.sectionId && section.classId === value);
      if (!valid) {
        this.form.sectionId = '';
      }
    }
  },
  methods: {
    ...mapActions('examResults', {
      createExamResult: 'create',
      updateExamResult: 'update',
      fetchExamResultById: 'fetchById'
    }),
    addSubjectRow() {
      this.form.subjects.push(createSubjectRow());
    },
    removeSubjectRow(index) {
      if (this.form.subjects.length === 1) return;
      this.form.subjects.splice(index, 1);
    },
    subjectErrors(index) {
      return this.errors.subjects?.[index] || {};
    },
    async loadDropdownData() {
      const [studentsResponse, classesResponse, sectionsResponse] = await Promise.all([
        students.getAll(1, 200),
        classes.getAll(1, 200),
        sections.getAll(1, 200)
      ]);

      this.studentOptions = (studentsResponse?.data || []).map((student) => ({
        value: student._id,
        label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
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
    async loadExamResult() {
      const response = await this.fetchExamResultById(this.$route.params.id);
      const result = response?.data;
      if (!result) return;

      if (result.isFinalized) {
        this.errorMessage = 'Finalized results cannot be edited.';
        setTimeout(() => this.$router.push('/admin/exam-results'), 1500);
        return;
      }

      this.form = {
        studentId: result.studentId?._id || result.studentId || '',
        classId: result.classId?._id || result.classId || '',
        sectionId: result.sectionId?._id || result.sectionId || '',
        year: result.year || new Date().getFullYear(),
        examName: result.examName || '',
        examDate: result.examDate ? String(result.examDate).slice(0, 10) : '',
        subjects: (result.subjects || []).map((subject) => ({
          subject: subject.subject || '',
          obtainedMarks: subject.obtainedMarks ?? '',
          passMarks: subject.passMarks ?? '',
          totalMarks: subject.totalMarks ?? '',
          grade: subject.grade || ''
        }))
      };
    },
    validateForm() {
      const errors = {};

      if (!this.form.studentId) errors.studentId = 'Student is required';
      if (!this.form.classId) errors.classId = 'Class is required';
      if (!this.form.year) errors.year = 'Academic year is required';
      if (!this.form.examName?.trim()) errors.examName = 'Exam name is required';
      if (!this.form.examDate) errors.examDate = 'Exam date is required';

      const subjects = [];
      const seenSubjects = new Set();

      this.form.subjects.forEach((subject, index) => {
        const itemErrors = {};
        const name = subject.subject?.trim();
        const obtainedMarks = Number(subject.obtainedMarks);
        const passMarks = Number(subject.passMarks);
        const totalMarks = Number(subject.totalMarks);

        if (!name) itemErrors.subject = 'Subject is required';
        if (Number.isNaN(obtainedMarks)) itemErrors.obtainedMarks = 'Obtained marks are required';
        if (Number.isNaN(passMarks)) itemErrors.passMarks = 'Pass marks are required';
        if (Number.isNaN(totalMarks)) itemErrors.totalMarks = 'Total marks are required';
        if (!subject.grade?.trim()) itemErrors.grade = 'Grade is required';

        if (!Number.isNaN(obtainedMarks) && !Number.isNaN(totalMarks) && obtainedMarks > totalMarks) {
          itemErrors.obtainedMarks = 'Obtained marks cannot exceed total marks';
        }

        if (!Number.isNaN(passMarks) && !Number.isNaN(totalMarks) && passMarks > totalMarks) {
          itemErrors.passMarks = 'Pass marks cannot exceed total marks';
        }

        const normalized = name?.toLowerCase();
        if (normalized && seenSubjects.has(normalized)) {
          itemErrors.subject = 'Duplicate subject not allowed';
        }
        if (normalized) {
          seenSubjects.add(normalized);
        }

        subjects[index] = itemErrors;
      });

      if (subjects.some((item) => Object.keys(item).length)) {
        errors.subjects = subjects;
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    buildPayload() {
      return {
        ...this.form,
        sectionId: this.form.sectionId || null,
        year: Number(this.form.year),
        subjects: this.form.subjects.map((subject) => ({
          subject: subject.subject.trim(),
          obtainedMarks: Number(subject.obtainedMarks),
          passMarks: Number(subject.passMarks),
          totalMarks: Number(subject.totalMarks),
          grade: subject.grade.trim()
        }))
      };
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isLoading = true;
        const payload = this.buildPayload();

        if (this.isEditMode) {
          await this.updateExamResult({ id: this.$route.params.id, data: payload });
        } else {
          await this.createExamResult(payload);
        }

        this.successMessage = this.isEditMode ? 'Exam result updated successfully' : 'Exam result created successfully';
        setTimeout(() => this.$router.push('/admin/exam-results'), 1200);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  async mounted() {
    try {
      this.isLoading = true;
      await this.loadDropdownData();
      if (this.isEditMode) {
        await this.loadExamResult();
      }
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

.subjects-panel {
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  border: 1px solid #dbe7f3;
  border-radius: 20px;
  padding: 1.5rem;
}

.subject-row {
  border: 1px solid #e7eef5;
  border-radius: 16px;
  padding: 1rem;
  background: #fff;
  margin-bottom: 1rem;
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.summary-box {
  background: #102542;
  border-radius: 16px;
  padding: 1rem 1.1rem;
  color: #fff;
}

.summary-box span {
  display: block;
  font-size: 0.82rem;
  opacity: 0.8;
}

.summary-box strong {
  display: block;
  font-size: 1.4rem;
  margin-top: 0.35rem;
}
</style>
