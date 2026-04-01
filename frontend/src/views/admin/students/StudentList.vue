<template>
  <div class="students-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Students</h1>
        <p class="text-muted">Manage all students</p>
      </div>
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

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <CustomInput
              v-model="filters.fullName"
              label="Search by Name"
              placeholder="Enter student name"
              @blur="applyFilters"
            />
          </div>
          <div class="col-md-6">
            <CustomInput
              v-model="filters.registrationNumber"
              label="Registration Number"
              placeholder="Search by registration number"
              @blur="applyFilters"
            />
          </div>
          <div class="col-md-6">
            <CustomSelect
              v-model="filters.class"
              label="Class"
              :options="classOptions"
              placeholder="Filter by class"
              @update:model-value="applyFilters"
            />
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-secondary" @click="clearFilters">Clear Filters</button>
              <button class="btn btn-primary" @click="applyFilters">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Students List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading students...</p>
      </div>

      <div v-else-if="students.length === 0" class="text-center p-5">
        <p class="text-muted">No students found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" /></th>
              <th>Roll</th>
              <th>Name</th>
              <th>Registration No.</th>
              <th>Class</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student._id">
              <td><input type="checkbox" v-model="selectedStudents" :value="student._id" /></td>
              <td>{{ student.rollNumber || '-' }}</td>
              <td class="fw-bold">{{ student.fullName }}</td>
              <td><code>{{ student.registrationNumber }}</code></td>
              <td>{{ student.class?.name || '-' }}</td>
              <td><small>{{ student.studentEmail || '-' }}</small></td>
              <td>
                <span
                  :class="['badge', isStudentActive(student) ? 'bg-success' : 'bg-danger']"
                >
                  {{ isStudentActive(student) ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <router-link
                    :to="`/admin/students/${student._id}`"
                    class="btn btn-outline-primary"
                    title="View Details"
                  >
                    👁️
                  </router-link>
                  <router-link
                    :to="`/admin/students/${student._id}/edit`"
                    class="btn btn-outline-warning"
                    title="Edit"
                  >
                    ✏️
                  </router-link>
                  <button
                    class="btn btn-outline-danger"
                    @click="deleteStudent(student._id)"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-4" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <button class="page-link" @click="previousPage">Previous</button>
        </li>
        <li v-for="page in totalPages" :key="page" :class="['page-item', { active: page === currentPage }]">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li :class="['page-item', { disabled: currentPage === totalPages }]">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>

    <!-- Bulk Actions -->
    <div v-if="selectedStudents.length > 0" class="bulk-actions mt-4">
      <div class="card border-warning">
        <div class="card-body d-flex justify-content-between align-items-center">
          <p class="mb-0">{{ selectedStudents.length }} students selected</p>
          <div class="btn-group" role="group">
            <button class="btn btn-warning btn-sm" @click="toggleSelectedActive">
              {{ selectedStudentsActive ? 'Deactivate' : 'Activate' }}
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteSelected">Delete Selected</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { classes } from '../../../api/api.js';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'StudentList',
  components: {
    CustomInput,
    CustomSelect,
    AlertComponent
  },
  data() {
    return {
      filters: {
        fullName: '',
        registrationNumber: '',
        class: ''
      },
      classOptions: [],
      selectedStudents: [],
      selectAll: false,
      successMessage: '',
      errorMessage: '',
      limit: 20
    };
  },
  computed: {
    ...mapState('students', ['students', 'loading', 'error', 'pagination']),
    ...mapGetters('students', ['isLoading', 'totalPages', 'currentPage']),

    selectedStudentsActive() {
      if (this.selectedStudents.length === 0) return true;
      const firstStudent = this.students.find((s) => s._id === this.selectedStudents[0]);
      return this.isStudentActive(firstStudent);
    }
  },
  watch: {
    selectAll(newVal) {
      if (newVal) {
        this.selectedStudents = this.students.map((s) => s._id);
      } else {
        this.selectedStudents = [];
      }
    }
  },
  methods: {
    ...mapActions('students', {
      fetchStudents: 'fetchStudents',
      updateStudentAction: 'updateStudent',
      deleteStudentAction: 'deleteStudent'
    }),

    isStudentActive(student) {
      return student?.isActive ?? student?.is_active ?? false;
    },

    async loadClassOptions() {
      const response = await classes.getAll(1, 200);
      this.classOptions = (response?.data || []).map((item) => ({
        value: item._id,
        label: item.classCode ? `${item.name} (${item.classCode})` : item.name
      }));
    },

    async applyFilters() {
      try {
        await this.fetchStudents({
          page: 1,
          limit: this.limit,
          filters: this.filters
        });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },

    clearFilters() {
      this.filters = { fullName: '', registrationNumber: '', class: '' };
      this.selectedStudents = [];
      this.selectAll = false;
      this.applyFilters();
    },

    async refreshList() {
      await this.applyFilters();
    },

    async previousPage() {
      if (this.currentPage > 1) {
        await this.goToPage(this.currentPage - 1);
      }
    },

    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.goToPage(this.currentPage + 1);
      }
    },

    async goToPage(page) {
      await this.fetchStudents({
        page,
        limit: this.limit,
        filters: this.filters
      });
    },

    async deleteStudent(id) {
      if (!confirm('Are you sure you want to delete this student?')) return;

      try {
        await this.deleteStudentAction(id);
        this.successMessage = 'Student deleted successfully';
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },

    async deleteSelected() {
      if (!confirm(`Delete ${this.selectedStudents.length} students?`)) return;

      try {
        for (const id of this.selectedStudents) {
          await this.deleteStudentAction(id);
        }
        this.successMessage = 'Students deleted successfully';
        this.selectedStudents = [];
        this.selectAll = false;
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },

    async toggleSelectedActive() {
      try {
        const action = this.selectedStudentsActive ? 'deactivate' : 'activate';
        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} selected students?`)) return;

        for (const id of this.selectedStudents) {
          await this.updateStudentAction({
            id,
            data: { is_active: !this.selectedStudentsActive }
          });
        }
        this.successMessage = `Students ${action}d successfully`;
        this.selectedStudents = [];
        this.selectAll = false;
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    }
  },
  async mounted() {
    try {
      await this.loadClassOptions();
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
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.bulk-actions {
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
