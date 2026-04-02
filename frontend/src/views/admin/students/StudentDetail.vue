<template>
  <div class="student-detail">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Student Details</h1>
        <p class="text-muted">View complete information</p>
      </div>
      <div class="btn-group">
        <button class="btn btn-outline-dark" :disabled="idCardLoading" @click="downloadIdCard">
          {{ idCardLoading ? 'Preparing ID Card...' : 'Download ID Card' }}
        </button>
        <router-link :to="`/admin/students/${$route.params.id}/edit`" class="btn btn-warning">
          ✏️ Edit
        </router-link>
        <button class="btn btn-danger" @click="deleteCurrentStudent">🗑️ Delete</button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center p-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3 text-muted">Loading student details...</p>
    </div>

    <div v-else-if="student" class="row g-4">
      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="mb-0">Profile Photo</h5>
          </div>
          <div class="card-body d-flex align-items-center justify-content-center">
            <img v-if="student.studentPic" :src="student.studentPic" alt="Student profile" class="profile-photo" />
            <div v-else class="profile-photo-placeholder">No Photo</div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0">Personal Information</h5>
              </div>
              <div class="card-body">
                <table class="table table-borderless">
                  <tr><td class="fw-bold">Name:</td><td>{{ student.fullName }}</td></tr>
                  <tr><td class="fw-bold">Registration No:</td><td><code>{{ student.registrationNumber }}</code></td></tr>
                  <tr><td class="fw-bold">Age:</td><td>{{ student.age }}</td></tr>
                  <tr><td class="fw-bold">Blood Group:</td><td>{{ student.bloodGroup || '-' }}</td></tr>
                  <tr><td class="fw-bold">Aadhar No:</td><td>{{ student.aadharNo }}</td></tr>
                  <tr><td class="fw-bold">Email:</td><td>{{ student.studentEmail || '-' }}</td></tr>
                  <tr><td class="fw-bold">Mobile:</td><td>{{ student.mobile || '-' }}</td></tr>
                  <tr>
                    <td class="fw-bold">Status:</td>
                    <td>
                      <span :class="['badge', studentActive ? 'bg-success' : 'bg-danger']">
                        {{ studentActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Academic Information</h5>
              </div>
              <div class="card-body">
                <table class="table table-borderless">
                  <tr><td class="fw-bold">Class:</td><td>{{ student.class?.name || '-' }}</td></tr>
                  <tr><td class="fw-bold">Section:</td><td>{{ student.section?.name || '-' }}</td></tr>
                  <tr><td class="fw-bold">Year:</td><td>{{ student.year || '-' }}</td></tr>
                </table>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-header">
                <h5 class="mb-0">Parent Information</h5>
              </div>
              <div class="card-body">
                <table class="table table-borderless">
                  <tr><td class="fw-bold">Father:</td><td>{{ student.fatherName }}</td></tr>
                  <tr><td class="fw-bold">Mother:</td><td>{{ student.motherName }}</td></tr>
                  <tr><td class="fw-bold">Guardian:</td><td>{{ student.guardianName || '-' }}</td></tr>
                  <tr><td class="fw-bold">Parent Email:</td><td>{{ student.parentEmail || '-' }}</td></tr>
                  <tr><td class="fw-bold">Parent Mobile:</td><td>{{ student.parentMobile || '-' }}</td></tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Address</h5>
          </div>
          <div class="card-body">
            <p class="mb-0">{{ student.fullAddress }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-5">
      <p class="text-muted">Student not found</p>
      <router-link to="/admin/students" class="btn btn-primary">Back to Students</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { students } from '../../../api/api.js';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'StudentDetail',
  data() {
    return {
      idCardLoading: false
    };
  },
  computed: {
    ...mapState('students', ['studentDetail', 'loading']),
    student() {
      return this.studentDetail;
    },
    studentActive() {
      return this.student?.isActive ?? this.student?.is_active ?? false;
    },
    isLoading() {
      return this.loading;
    }
  },
  methods: {
    ...mapActions('students', ['fetchStudentById', 'deleteStudent']),
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
      try {
        this.idCardLoading = true;
        const blob = await students.downloadIdCard(this.$route.params.id);
        this.saveBlob(blob, `${(this.student?.fullName || 'student').replace(/\s+/g, '_')}_id_card.pdf`);
      } catch (error) {
        console.error('Error downloading ID card:', getErrorMessage(error));
      } finally {
        this.idCardLoading = false;
      }
    },
    async deleteCurrentStudent() {
      if (!confirm('Are you sure you want to delete this student?')) return;

      try {
        await this.deleteStudent(this.$route.params.id);
        this.$router.push('/admin/students');
      } catch (error) {
        console.error('Error deleting student:', getErrorMessage(error));
      }
    }
  },
  mounted() {
    this.fetchStudentById(this.$route.params.id);
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

.table-borderless td {
  padding: 0.5rem 0;
  border: none;
}

.profile-photo {
  width: 100%;
  max-width: 240px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid #d9e2ec;
}

.profile-photo-placeholder {
  width: 240px;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 600;
}
</style>
