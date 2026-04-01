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
                v-model="form.age"
                label="Age"
                type="number"
                placeholder="Enter age"
                required
                :error="errors.age"
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
import { classes, sections } from '../../../api/api.js';
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
        studentEmail: '',
        mobile: '',
        aadharNo: '',
        parentAadharNumber: '',
        parentAadharRelation: '',
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
      classOptions: [],
      allSections: [],
      parentAadharRelationOptions: [
        { value: 'father', label: 'Father' },
        { value: 'mother', label: 'Mother' },
        { value: 'brother', label: 'Brother' },
        { value: 'sister', label: 'Sister' },
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
      if (!this.form.fullAddress) this.errors.fullAddress = 'Full address is required';
      if (!this.form.classId) this.errors.classId = 'Class is required';
      if (!this.form.sectionId) this.errors.sectionId = 'Section is required';
      return Object.keys(this.errors).length === 0;
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
        await this.fetchStudentById(this.$route.params.id);
        // Populate form with fetched data
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
</style>
