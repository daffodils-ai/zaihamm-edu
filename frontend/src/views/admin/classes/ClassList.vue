<template>
  <div class="classes-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Classes</h1>
        <p class="text-muted">Manage all classes</p>
      </div>
      <router-link to="/admin/classes/new" class="btn btn-primary">
        <i>➕</i> Add Class
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

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <CustomInput
              v-model="filters.name"
              label="Search by Class Name"
              placeholder="Enter class name"
              @blur="applyFilters"
            />
          </div>
          <div class="col-md-4">
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-secondary" @click="clearFilters">Clear</button>
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
        <h5 class="mb-0">Classes List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading classes...</p>
      </div>

      <div v-else-if="classes.length === 0" class="text-center p-5">
        <p class="text-muted">No classes found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" /></th>
              <th>Class Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cls in classes" :key="cls._id">
              <td><input type="checkbox" v-model="selectedClasses" :value="cls._id" /></td>
              <td class="fw-bold">{{ cls.name }}</td>
              <td>{{ cls.description || '-' }}</td>
              <td>
                <span :class="['badge', cls.isActive ? 'bg-success' : 'bg-danger']">
                  {{ cls.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <router-link
                    :to="`/admin/classes/${cls._id}/edit`"
                    class="btn btn-outline-warning"
                    title="Edit"
                  >
                    ✏️
                  </router-link>
                  <button
                    class="btn btn-outline-danger"
                    @click="onDeleteClass(cls._id)"
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
    <div v-if="selectedClasses.length > 0" class="bulk-actions mt-4">
      <div class="card border-warning">
        <div class="card-body d-flex justify-content-between align-items-center">
          <p class="mb-0">{{ selectedClasses.length }} classes selected</p>
          <div class="btn-group" role="group">
            <button class="btn btn-warning btn-sm" @click="toggleSelectedActive">
              {{ selectedClassesActive ? 'Deactivate' : 'Activate' }}
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
import CustomInput from '../../../components/CustomInput.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'ClassList',
  components: {
    CustomInput,
    AlertComponent
  },
  data() {
    return {
      filters: {
        name: ''
      },
      selectedClasses: [],
      selectAll: false,
      successMessage: '',
      errorMessage: '',
      limit: 20
    };
  },
  computed: {
    ...mapState('classes', ['classes', 'loading', 'pagination']),
    ...mapGetters('classes', ['isLoading']),

    currentPage() {
      return this.pagination?.page || 1;
    },
    totalPages() {
      const pages = this.pagination?.pages;
      if (pages) return pages;
      const total = this.pagination?.total || 0;
      const limit = this.pagination?.limit || this.limit;
      return Math.max(1, Math.ceil(total / limit));
    },

    selectedClassesActive() {
      if (this.selectedClasses.length === 0) return true;
      const firstClass = this.classes.find((c) => c._id === this.selectedClasses[0]);
      return firstClass?.isActive;
    }
  },
  watch: {
    selectAll(newVal) {
      if (newVal) {
        this.selectedClasses = this.classes.map((c) => c._id);
      } else {
        this.selectedClasses = [];
      }
    }
  },
  methods: {
    ...mapActions('classes', {
      fetchClasses: 'fetch',
      updateClass: 'update',
      removeClass: 'delete'
    }),

    async applyFilters() {
      try {
        await this.fetchClasses({
          page: 1,
          limit: this.limit,
          filters: this.filters
        });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },

    clearFilters() {
      this.filters = { name: '' };
      this.selectedClasses = [];
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
      if (page < 1 || page > this.totalPages) return;
      await this.fetchClasses({
        page,
        limit: this.limit,
        filters: this.filters
      });
    },

    async onDeleteClass(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.removeClass(id);
        this.successMessage = 'Class deleted successfully';
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },

    async deleteSelected() {
      if (!confirm(`Delete ${this.selectedClasses.length} classes?`)) return;
      try {
        for (const id of this.selectedClasses) {
          await this.removeClass(id);
        }
        this.successMessage = 'Classes deleted successfully';
        this.selectedClasses = [];
        this.selectAll = false;
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },

    async toggleSelectedActive() {
      try {
        const action = this.selectedClassesActive ? 'deactivate' : 'activate';
        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} selected classes?`)) return;
        for (const id of this.selectedClasses) {
          await this.updateClass({
            id,
            data: { isActive: !this.selectedClassesActive }
          });
        }
        this.successMessage = `Classes ${action}d successfully`;
        this.selectedClasses = [];
        this.selectAll = false;
        this.refreshList();
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    }
  },
  mounted() {
    this.applyFilters();
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
