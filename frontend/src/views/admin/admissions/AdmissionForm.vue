<template>
  <div class="admission-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Admission Entry' : 'Add New Admission Entry' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update admission information' : 'Create a new admission entry' }}</p>
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
            <!-- Student Information -->
            <div class="col-12">
              <h5 class="border-bottom pb-2">Student Information</h5>
            </div>
            
            <div class="col-md-6">
              <CustomInput
                v-model="form.fullName"
                label="Full Name"
                placeholder="Enter student's full name"
                required
                :error="errors.fullName"
              />
            </div>
            
            <div class="col-md-6">
              <CustomInput
                v-model.number="form.age"
                label="Age"
                type="number"
                placeholder="Enter age"
                required
                :error="errors.age"
                min="0"
                max="150"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.dateOfBirth"
                label="Date of Birth"
                type="date"
                :error="errors.dateOfBirth"
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
                placeholder="Select section (optional)"
                :error="errors.sectionId"
              />
            </div>

            <div class="col-md-6">
              <CustomSelect
                v-model="form.gender"
                label="Gender"
                :options="genderOptions"
                placeholder="Select gender"
                required
                :error="errors.gender"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.bloodGroup"
                label="Blood Group"
                placeholder="Enter blood group"
                :error="errors.bloodGroup"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.mobile"
                label="Mobile Number"
                placeholder="Enter student's mobile"
                :error="errors.mobile"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.studentEmail"
                label="Student Email"
                type="email"
                placeholder="Enter student's email"
                :error="errors.studentEmail"
              />
            </div>

            <!-- Parent/Guardian Information -->
            <div class="col-12">
              <h5 class="border-bottom pb-2 mt-4">Parent/Guardian Information</h5>
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.parentMobile"
                label="Parent Mobile"
                placeholder="Enter parent's mobile"
                required
                :error="errors.parentMobile"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.parentEmail"
                label="Parent Email"
                type="email"
                placeholder="Enter parent's email"
                :error="errors.parentEmail"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.fatherName"
                label="Father's Name"
                placeholder="Enter father's name"
                required
                :error="errors.fatherName"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.motherName"
                label="Mother's Name"
                placeholder="Enter mother's name"
                required
                :error="errors.motherName"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.guardianName"
                label="Guardian Name"
                placeholder="Enter guardian's name"
                :error="errors.guardianName"
              />
            </div>

            <!-- Aadhar Information -->
            <div class="col-12">
              <h5 class="border-bottom pb-2 mt-4">Aadhar Information</h5>
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.aadharNo"
                label="Student Aadhar Number"
                placeholder="Enter student's aadhar number"
                required
                :error="errors.aadharNo"
              />
            </div>

            <div class="col-md-6">
              <CustomInput
                v-model="form.parentAadharNumber"
                label="Parent Aadhar Number"
                placeholder="Enter parent's aadhar number"
                required
                :error="errors.parentAadharNumber"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Parent's Relation in Aadhar</label>
              <select v-model="form.parentAadharRelation" class="form-select" required>
                <option value="">Select relation</option>
                <option v-for="relation in relationOptions" :key="relation" :value="relation">
                  {{ relation }}
                </option>
              </select>
              <div v-if="errors.parentAadharRelation" class="text-danger small">{{ errors.parentAadharRelation }}</div>
            </div>

            <!-- Address -->
            <div class="col-12">
              <h5 class="border-bottom pb-2 mt-4">Address</h5>
            </div>

            <div class="col-12">
              <label class="form-label">Full Address</label>
              <textarea
                v-model="form.fullAddress"
                class="form-control"
                rows="3"
                placeholder="Enter full address"
                required
                :error="errors.fullAddress"
              ></textarea>
            </div>
          </div>

          <div class="d-flex gap-2 mt-5">
            <CustomButton label="Save" variant="primary" size="lg" :is-loading="isLoading" @click="handleSubmit" />
            <CustomButton label="Admit" variant="success" size="lg" :is-loading="isAdmitting" @click="handleAdmit" />
            <router-link to="/admin/admissions" class="btn btn-secondary btn-lg">Cancel</router-link>
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
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'AdmissionForm',
  components: { CustomInput, CustomSelect, CustomButton, AlertComponent },
  data() {
    return {
      form: {
        fullName: '',
        age: '',
        dateOfBirth: '',
        class: '',
        classId: '',
        sectionId: '',
        gender: '',
        bloodGroup: '',
        mobile: '',
        parentMobile: '',
        studentEmail: '',
        parentEmail: '',
        fatherName: '',
        motherName: '',
        guardianName: '',
        aadharNo: '',
        parentAadharNumber: '',
        parentAadharRelation: '',
        fullAddress: ''
      },
      relationOptions: ['father', 'mother', 'brother', 'sister', 'other'],
      genderOptions: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ],
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false,
      isAdmitting: false,
      classOptions: [],
      allSections: []
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
        label: section.name
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
      this.form.age = Math.max(Math.floor(diffMs / yearMs), 0);
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
    ...mapActions('admissions', ['createAdmission', 'updateAdmission', 'fetchAdmissionById']),
    ...mapActions('students', ['createStudent']),
    
    validateForm() {
      this.errors = {};
      
      if (!this.form.fullName) this.errors.fullName = 'Full name is required';
      if (!this.form.age || this.form.age < 0 || this.form.age > 150) {
        this.errors.age = 'Valid age is required (0-150)';
      }
      if (!this.form.dateOfBirth) this.errors.dateOfBirth = 'Date of birth is required';
      if (!this.form.classId) this.errors.classId = 'Class is required';
      if (!this.form.gender) this.errors.gender = 'Gender is required';
      if (!this.form.parentMobile) this.errors.parentMobile = 'Parent mobile is required';
      if (!this.form.fatherName) this.errors.fatherName = "Father's name is required";
      if (!this.form.motherName) this.errors.motherName = "Mother's name is required";
      if (!this.form.aadharNo) this.errors.aadharNo = 'Aadhar number is required';
      if (!this.form.parentAadharNumber) this.errors.parentAadharNumber = 'Parent aadhar number is required';
      if (!this.form.parentAadharRelation) {
        this.errors.parentAadharRelation = 'Parent relation is required';
      }
      if (!this.form.fullAddress) this.errors.fullAddress = 'Full address is required';

      return Object.keys(this.errors).length === 0;
    },

    async loadAdmission() {
      try {
        this.isLoading = true;
        const response = await this.fetchAdmissionById(this.$route.params.id);
        if (response?.success && response.data) {
          const admission = response.data;
          const matchedClass = this.classOptions.find((item) => item.name === admission.class);
          this.form = {
            fullName: admission.fullName || '',
            age: admission.age || '',
            dateOfBirth: admission.dateOfBirth ? String(admission.dateOfBirth).slice(0, 10) : '',
            class: admission.class || '',
            classId: admission.classId?._id || admission.classId || matchedClass?.value || '',
            sectionId: admission.sectionId?._id || admission.sectionId || '',
            gender: admission.gender || '',
            bloodGroup: admission.bloodGroup || '',
            mobile: admission.mobile || '',
            parentMobile: admission.parentMobile || '',
            studentEmail: admission.studentEmail || '',
            parentEmail: admission.parentEmail || '',
            fatherName: admission.fatherName || '',
            motherName: admission.motherName || '',
            guardianName: admission.guardianName || '',
            aadharNo: admission.aadharNo || '',
            parentAadharNumber: admission.parentAadharNumber || '',
            parentAadharRelation: admission.parentAadharRelation || '',
            fullAddress: admission.fullAddress || ''
          };
        }
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadClassOptions() {
      try {
        const [classResponse, sectionResponse] = await Promise.all([
          classes.getAll(1, 200),
          sections.getAll(1, 200)
        ]);

        const classData = classResponse?.data || [];
        this.classOptions = classData.map((item) => ({
          value: item._id,
          label: item.classCode ? `${item.name} (${item.classCode})` : item.name,
          name: item.name
        }));

        this.allSections = (sectionResponse?.data || []).map((item) => ({
          ...item,
          classId: item.classId?._id || item.classId
        }));
      } catch (error) {
        console.error('Failed to load classes:', error);
      }
    },

    buildAdmissionPayload() {
      const selectedClass = this.classOptions.find((item) => item.value === this.form.classId);

      return {
        ...this.form,
        age: Number(this.form.age),
        class: selectedClass?.name || this.form.class || ''
      };
    },

    async handleSubmit() {
      if (!this.validateForm()) return;
      
      try {
        this.isLoading = true;
        const formData = this.buildAdmissionPayload();
        
        if (this.isEditMode) {
          await this.updateAdmission({ id: this.$route.params.id, data: formData });
          this.successMessage = 'Admission entry updated successfully';
        } else {
          await this.createAdmission(formData);
          this.successMessage = 'Admission entry created successfully';
        }
        
        setTimeout(() => this.$router.push('/admin/admissions'), 2000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },

    async handleAdmit() {
      if (!this.validateForm()) return;
      
      try {
        this.isAdmitting = true;
        this.errorMessage = '';
        
        // Prepare student data from admission form
        const studentData = {
          fullName: this.form.fullName,
          age: Number(this.form.age),
          dateOfBirth: this.form.dateOfBirth || null,
          gender: this.form.gender,
          bloodGroup: this.form.bloodGroup,
          mobile: this.form.mobile,
          parentMobile: this.form.parentMobile,
          studentEmail: this.form.studentEmail,
          parentEmail: this.form.parentEmail,
          fatherName: this.form.fatherName,
          motherName: this.form.motherName,
          guardianName: this.form.guardianName,
          aadharNo: this.form.aadharNo,
          parentAadharNumber: this.form.parentAadharNumber,
          parentAadharRelation: this.form.parentAadharRelation,
          fullAddress: this.form.fullAddress,
          classId: this.form.classId,
          sectionId: this.form.sectionId || null,
          year: new Date().getFullYear(),
          admissionTrackerId: this.isEditMode ? this.$route.params.id : null
        };
        
        const response = await this.createStudent(studentData);
        
        if (response?.success) {
          this.successMessage = 'Student admitted successfully';
          setTimeout(() => this.$router.push('/admin/students'), 2000);
        } else {
          this.errorMessage = response?.message || 'Failed to admit student';
        }
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.isAdmitting = false;
      }
    }
  },
  
  async mounted() {
    await this.loadClassOptions();
    if (this.isEditMode) {
      await this.loadAdmission();
    }
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

h5 {
  color: #2c3e50;
  font-weight: 600;
}
</style>
