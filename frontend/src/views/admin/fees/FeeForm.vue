<template>
  <div class="fee-form">
    <div class="page-header mb-4">
      <h1>{{ isEditMode ? 'Edit Fee' : 'Add New Fee' }}</h1>
      <p class="text-muted">{{ isEditMode ? 'Update fee information' : 'Create a new fee' }}</p>
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
                v-model="form.type"
                label="Fee Type"
                :options="typeOptions"
                placeholder="Select fee type"
                required
                :error="errors.type"
              />
            </div>
            <div class="col-md-6">
              <CustomSelect
                v-model="form.status"
                label="Status"
                :options="statusOptions"
                placeholder="Select status"
                required
                :error="errors.status"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.amount"
                label="Amount"
                type="number"
                placeholder="Enter amount"
                required
                :error="errors.amount"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="form.dueDate"
                label="Due Date"
                type="date"
                required
                :error="errors.dueDate"
              />
            </div>
            <div class="col-12">
              <CustomInput
                v-model="form.remarks"
                label="Remarks"
                placeholder="Add remarks"
              />
            </div>
          </div>
          <div class="d-flex gap-2 mt-5">
            <CustomButton label="Save" variant="primary" size="lg" :is-loading="isLoading" @click="handleSubmit" />
            <router-link to="/admin/fees" class="btn btn-secondary btn-lg">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { classes, students } from '../../../api/api.js';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import CustomButton from '../../../components/CustomButton.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'FeeForm',
  components: { CustomInput, CustomSelect, CustomButton, AlertComponent },
  data() {
    return {
      form: {
        studentId: '',
        studentSessionId: '',
        classId: '',
        type: 'monthly',
        status: 'pending',
        amount: '',
        dueDate: '',
        remarks: ''
      },
      errors: {},
      successMessage: '',
      errorMessage: '',
      isLoading: false,
      studentOptions: [],
      classOptions: [],
      statusOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' }
      ],
      typeOptions: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'admission', label: 'Admission' },
        { value: 'exam', label: 'Exam' },
        { value: 'other', label: 'Other' }
      ]
    };
  },
  computed: {
    isEditMode() { return !!this.$route.params.id; }
  },
  watch: {
    async 'form.studentId'(newValue) {
      if (!newValue || this.isEditMode) return;
      try {
        const response = await students.getLatestSession(newValue);
        this.form.studentSessionId = response?.data?._id || '';
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    }
  },
  methods: {
    ...mapActions('fees', {
      createFee: 'create',
      updateFee: 'update',
      fetchFeeById: 'fetchById'
    }),
    async loadDropdownData() {
      const [studentsResponse, classesResponse] = await Promise.all([
        students.getAll(1, 100),
        classes.getAll(1, 100)
      ]);

      this.studentOptions = (studentsResponse?.data || []).map((student) => ({
        value: student._id,
        label: student.registrationNumber ? `${student.fullName} (${student.registrationNumber})` : student.fullName
      }));

      this.classOptions = (classesResponse?.data || []).map((cls) => ({
        value: cls._id,
        label: cls.classCode ? `${cls.name} (${cls.classCode})` : cls.name
      }));
    },
    async loadFee() {
      const response = await this.fetchFeeById(this.$route.params.id);
      if (response?.success && response.data) {
        const fee = response.data;
        this.form = {
          studentId: fee.studentId?._id || fee.studentId || '',
          studentSessionId: fee.studentSessionId?._id || fee.studentSessionId || '',
          classId: fee.classId?._id || fee.classId || '',
          type: fee.type || 'monthly',
          status: fee.status || 'pending',
          amount: fee.amount || '',
          dueDate: fee.dueDate ? String(fee.dueDate).slice(0, 10) : '',
          remarks: fee.remarks || ''
        };
      }
    },
    validateForm() {
      this.errors = {};
      if (!this.form.studentId) this.errors.studentId = 'Student is required';
      if (!this.form.studentSessionId) this.errors.studentId = 'Student session is required';
      if (!this.form.classId) this.errors.classId = 'Class is required';
      if (!this.form.type) this.errors.type = 'Fee type is required';
      if (!this.form.status) this.errors.status = 'Status is required';
      if (!this.form.amount) this.errors.amount = 'Amount is required';
      if (!this.form.dueDate) this.errors.dueDate = 'Due date is required';
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;
      try {
        this.isLoading = true;
        if (this.isEditMode) {
          await this.updateFee({ id: this.$route.params.id, data: this.form });
        } else {
          await this.createFee(this.form);
        }
        this.successMessage = this.isEditMode ? 'Fee updated' : 'Fee added';
        setTimeout(() => this.$router.push('/admin/fees'), 2000);
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
        await this.loadFee();
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
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
</style>
