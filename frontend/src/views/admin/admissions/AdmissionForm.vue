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
            <router-link to="/admin/admissions" class="btn btn-secondary btn-lg">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomInput from '../../../components/CustomInput.vue';
import CustomButton from '../../../components/CustomButton.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'AdmissionForm',
  components: { CustomInput, CustomButton, AlertComponent },
  data() {
    return {
      form: {
        fullName: '',
        age: '',
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
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    }
  },
  methods: {
    ...mapActions('admissions', ['createAdmission', 'updateAdmission', 'fetchAdmissionById']),
    
    validateForm() {
      this.errors = {};
      
      if (!this.form.fullName) this.errors.fullName = 'Full name is required';
      if (!this.form.age || this.form.age < 0 || this.form.age > 150) {
        this.errors.age = 'Valid age is required (0-150)';
      }
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
          this.form = {
            fullName: admission.fullName || '',
            age: admission.age || '',
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

    async handleSubmit() {
      if (!this.validateForm()) return;
      
      try {
        this.isLoading = true;
        const formData = { ...this.form };
        
        // Convert age to number
        formData.age = Number(formData.age);
        
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
    }
  },
  
  mounted() {
    if (this.isEditMode) {
      this.loadAdmission();
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
