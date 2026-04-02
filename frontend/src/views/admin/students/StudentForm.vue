<template>
  <div class="student-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Student' : 'Add New Student' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update student information' : 'Admit a new student' }}</p>
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
            <div v-if="isEditMode" class="col-12">
              <div class="profile-strip">
                <div class="profile-preview">
                  <img v-if="form.studentPic" :src="form.studentPic" alt="Student profile" class="profile-photo" />
                  <div v-else class="profile-placeholder">No Photo</div>
                </div>
                <div class="profile-actions">
                  <h5 class="mb-1">Student Profile</h5>
                  <p class="text-muted mb-3">Profile photo preview and current-session ID card download.</p>
                  <button type="button" class="btn btn-outline-dark" :disabled="idCardLoading" @click="downloadIdCard">
                    {{ idCardLoading ? 'Preparing ID Card...' : 'Download ID Card' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.fullName"
                label="Full Name"
                placeholder="Enter full name"
                required
                :error="errors.fullName"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.dateOfBirth"
                label="Date of Birth"
                type="date"
                required
                :error="errors.dateOfBirth"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.age"
                label="Age"
                type="number"
                placeholder="Auto-calculated from date of birth"
                required
                :error="errors.age"
                readonly
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.studentEmail"
                label="Email"
                type="email"
                placeholder="student@example.com"
                :error="errors.studentEmail"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.mobile"
                label="Mobile"
                type="tel"
                placeholder="Mobile number"
                :error="errors.mobile"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.aadharNo"
                label="Aadhar No."
                placeholder="12-digit Aadhar number"
                :error="errors.aadharNo"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.parentAadharNumber"
                label="Parent Aadhar No."
                placeholder="12-digit parent Aadhar number"
                :error="errors.parentAadharNumber"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.gender"
                label="Gender"
                :options="genderOptions"
                placeholder="Select gender"
                :error="errors.gender"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.bloodGroup"
                label="Blood Group"
                placeholder="e.g., O+, B-, AB+"
                :error="errors.bloodGroup"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.fatherName"
                label="Father Name"
                placeholder="Father's name"
                :error="errors.fatherName"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.motherName"
                label="Mother Name"
                placeholder="Mother's name"
                :error="errors.motherName"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.parentEmail"
                label="Parent Email"
                type="email"
                placeholder="parent@example.com"
                :error="errors.parentEmail"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.parentMobile"
                label="Parent Mobile"
                type="tel"
                placeholder="Parent mobile number"
                :error="errors.parentMobile"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.parentAadharRelation"
                label="Parent Aadhar Relation"
                :options="parentAadharRelationOptions"
                placeholder="Select relation"
                required
                :error="errors.parentAadharRelation"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.guardianName"
                label="Guardian Name"
                placeholder="Guardian name if applicable"
                :error="errors.guardianName"
              />
            </div>
            <div class="col-12">
              <CustomInput
                v-model="form.fullAddress"
                label="Full Address"
                placeholder="Complete address"
                :error="errors.fullAddress"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.classId"
                label="Class"
                :options="classOptions"
                placeholder="Select class"
                required
                :error="errors.classId"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.sectionId"
                label="Section"
                :options="sectionOptions"
                placeholder="Select section"
                required
                :error="errors.sectionId"
              />
            </div>
          </div>

          <div class="d-flex gap-2 mt-5">
            <CustomButton
              label="Save"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="handleSubmit"
            />
            <router-link to="/admin/students" class="btn btn-secondary btn-lg">
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { classes, sections, students } from '../../../api/api.js';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import CustomButton from '../../../components/CustomButton.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage, validateAadhar, validatePhone } from '../../../utils/validation.js';

export default {
  name: 'StudentForm',
  components: {
    CustomInput,
    CustomSelect,
    CustomButton,
    AlertComponent
  },
  data() {
    return {
      form: {
        fullName: '',
        age: '',
        dateOfBirth: '',
        studentPic: '',
        studentEmail: '',
        mobile: '',
        aadharNo: '',
        parentAadharNumber: '',
        parentAadharRelation: '',
        gender: '',
        bloodGroup: '',
        fatherName: '',
        motherName: '',
        guardianName: '',
        parentEmail: '',
        parentMobile: '',
        fullAddress: '',
        classId: '',
        sectionId: '',
        year: new Date().getFullYear()
      },
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false,
      idCardLoading: false,
      classOptions: [],
      allSections: [],
      parentAadharRelationOptions: [
        { value: 'father', label: 'Father' },
        { value: 'mother', label: 'Mother' },
        { value: 'brother', label: 'Brother' },
        { value: 'sister', label: 'Sister' },
        { value: 'other', label: 'Other' }
      ],
      genderOptions: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    },
    sectionOptions() {
      const items = this.form.classId
        ? this.allSections.filter((section) => section.classId === this.form.classId)
        : this.allSections;

      return items.map((section) => ({
        value: section._id,
        label: section.className ? `${section.name} (${section.className})` : section.name
      }));
    }
  },
  watch: {
    'form.dateOfBirth'(newValue) {
      if (!newValue) {
        this.form.age = '';
        return;
      }

      const today = new Date();
      const birthDate = new Date(newValue);
      const diffMs = today.getTime() - birthDate.getTime();
      const yearMs = 365.2425 * 24 * 60 * 60 * 1000;
      this.form.age = String(Math.max(Math.floor(diffMs / yearMs), 0));
    },
    'form.classId'(newValue) {
      if (!newValue) {
        this.form.sectionId = '';
        return;
      }

      const validSection = this.allSections.some(
        (section) => section._id === this.form.sectionId && section.classId === newValue
      );

      if (!validSection) {
        this.form.sectionId = '';
      }
    }
  },
  methods: {
    ...mapActions('students', ['createStudent', 'updateStudent', 'fetchStudentById']),

    populateForm(student) {
      const latestSession = student?.latestSession || {};
      this.form = {
        fullName: student?.fullName || '',
        age: student?.age || '',
        dateOfBirth: student?.dateOfBirth ? String(student.dateOfBirth).slice(0, 10) : '',
        studentPic: student?.studentPic || '',
        studentEmail: student?.studentEmail || '',
        mobile: student?.mobile || '',
        aadharNo: student?.aadharNo || '',
        parentAadharNumber: student?.parentAadharNumber || '',
        parentAadharRelation: student?.parentAadharRelation || '',
        gender: student?.gender || '',
        bloodGroup: student?.bloodGroup || '',
        fatherName: student?.fatherName || '',
        motherName: student?.motherName || '',
        guardianName: student?.guardianName || '',
        parentEmail: student?.parentEmail || '',
        parentMobile: student?.parentMobile || '',
        fullAddress: student?.fullAddress || '',
        classId: student?.class?._id || latestSession?.classId?._id || latestSession?.classId || '',
        sectionId: student?.section?._id || latestSession?.sectionId?._id || latestSession?.sectionId || '',
        year: student?.year || latestSession?.year || new Date().getFullYear()
      };
    },

    async loadDropdownData() {
      const [classesResponse, sectionsResponse] = await Promise.all([
        classes.getAll(1, 200),
        sections.getAll(1, 200)
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
    },

    validateForm() {
      this.errors = {};
      if (!this.form.fullName) this.errors.fullName = 'Full name is required';
      if (!this.form.dateOfBirth) this.errors.dateOfBirth = 'Date of birth is required';
      if (!this.form.age || this.form.age < 5 || this.form.age > 30) {
        this.errors.age = 'Valid age is required';
      }
      if (!this.form.fatherName) this.errors.fatherName = 'Father name is required';
      if (!this.form.motherName) this.errors.motherName = 'Mother name is required';
      if (!this.form.parentMobile) {
        this.errors.parentMobile = 'Parent mobile is required';
      } else if (!validatePhone(this.form.parentMobile)) {
        this.errors.parentMobile = 'Parent mobile must be a valid 10-digit number';
      }
      if (this.form.mobile && !validatePhone(this.form.mobile)) {
        this.errors.mobile = 'Mobile must be a valid 10-digit number';
      }
      if (!this.form.aadharNo) {
        this.errors.aadharNo = 'Aadhar number is required';
      } else if (!validateAadhar(this.form.aadharNo)) {
        this.errors.aadharNo = 'Aadhar number must be 12 digits';
      }
      if (!this.form.parentAadharNumber) {
        this.errors.parentAadharNumber = 'Parent Aadhar number is required';
      } else if (!validateAadhar(this.form.parentAadharNumber)) {
        this.errors.parentAadharNumber = 'Parent Aadhar number must be 12 digits';
      }
      if (!this.form.parentAadharRelation) {
        this.errors.parentAadharRelation = 'Parent Aadhar relation is required';
      }
      if (!this.form.gender) this.errors.gender = 'Gender is required';
      if (!this.form.fullAddress) this.errors.fullAddress = 'Full address is required';
      if (!this.form.classId) this.errors.classId = 'Class is required';
      if (!this.form.sectionId) this.errors.sectionId = 'Section is required';
      return Object.keys(this.errors).length === 0;
    },

    saveBlob(blob, fileName) {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    },

    async downloadIdCard() {
      if (!this.isEditMode) return;

      try {
        this.idCardLoading = true;
        const blob = await students.downloadIdCard(this.$route.params.id);
        this.saveBlob(blob, `${(this.form.fullName || 'student').replace(/\s+/g, '_')}_id_card.pdf`);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.idCardLoading = false;
      }
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      try {
        this.isLoading = true;
        this.errorMessage = '';

        if (this.isEditMode) {
          await this.updateStudent({
            id: this.$route.params.id,
            data: this.form
          });
        } else {
          await this.createStudent(this.form);
        }

        this.successMessage = this.isEditMode
          ? 'Student updated successfully'
          : 'Student added successfully';

        setTimeout(() => {
          this.$router.push('/admin/students');
        }, 2000);
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
        const response = await this.fetchStudentById(this.$route.params.id);
        if (response?.success && response.data) {
          this.populateForm(response.data);
        }
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

.profile-strip {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid #dbe7f3;
  border-radius: 18px;
  background: #f8fbff;
}

.profile-preview {
  flex: 0 0 auto;
}

.profile-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid #d9e2ec;
}

.profile-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 18px;
  border: 1px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #64748b;
}
</style>
