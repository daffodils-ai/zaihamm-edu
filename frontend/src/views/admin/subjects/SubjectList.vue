<template>
  <div class="subject-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Subjects</h1>
        <p class="text-muted mb-0">Manage subjects and map them to one or more classes.</p>
      </div>
      <router-link to="/admin/subjects/new" class="btn btn-primary">Add Subject</router-link>
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
          <div class="col-md-6">
            <CustomInput v-model="filters.name" label="Subject Name" placeholder="Search by subject name" />
          </div>
          <div class="col-md-6">
            <CustomSelect
              v-model="filters.classId"
              label="Class Filter"
              :options="classOptions"
              placeholder="All classes"
            />
          </div>
          <div class="col-12 d-flex justify-content-end gap-2">
            <button class="btn btn-outline-secondary" @click="clearFilters">Clear</button>
            <button class="btn btn-primary" :disabled="loading" @click="fetchSubjects(1)">
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted mb-0">Loading subjects...</p>
      </div>

      <div v-else-if="subjects.length === 0" class="text-center p-5">
        <h5>No subjects found</h5>
        <p class="text-muted mb-0">Try adjusting filters or create a new subject.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Classes</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subject in subjects" :key="subject._id">
              <td class="fw-semibold">{{ subject.name }}</td>
              <td>
                <span v-if="subject.classIds?.length">
                  {{ subject.classIds.map((item) => item.name).join(', ') }}
                </span>
                <span v-else class="text-muted">All classes</span>
              </td>
              <td>
                <span :class="['badge', subject.isLinked ? 'text-bg-secondary' : 'text-bg-success']">
                  {{ subject.isLinked ? 'Linked to results' : 'Editable' }}
                </span>
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <router-link :to="`/admin/subjects/${subject._id}`" class="btn btn-outline-dark">View</router-link>
                  <router-link
                    :to="subject.isLinked ? '#' : `/admin/subjects/${subject._id}/edit`"
                    :class="['btn', subject.isLinked ? 'btn-outline-secondary disabled' : 'btn-outline-warning']"
                  >
                    Edit
                  </router-link>
                  <button
                    class="btn btn-outline-danger"
                    :disabled="subject.isLinked"
                    @click="deleteSubjectRecord(subject)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <nav v-if="pagination.pages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: pagination.page === 1 }]">
          <button class="page-link" @click="fetchSubjects(pagination.page - 1)">Previous</button>
        </li>
        <li
          v-for="page in pagination.pages"
          :key="page"
          :class="['page-item', { active: page === pagination.page }]"
        >
          <button class="page-link" @click="fetchSubjects(page)">{{ page }}</button>
        </li>
        <li :class="['page-item', { disabled: pagination.page === pagination.pages }]">
          <button class="page-link" @click="fetchSubjects(pagination.page + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { classes, subjects } from '../../../api/api.js';
import AlertComponent from '../../../components/AlertComponent.vue';
import CustomInput from '../../../components/CustomInput.vue';
import CustomSelect from '../../../components/CustomSelect.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'SubjectList',
  components: { AlertComponent, CustomInput, CustomSelect },
  data() {
    return {
      subjects: [],
      classOptions: [],
      filters: {
        name: '',
        classId: ''
      },
      pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
      },
      loading: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async loadClasses() {
      const response = await classes.getAll(1, 200);
      this.classOptions = (response?.data || []).map((item) => ({
        value: item._id,
        label: item.classCode ? `${item.name} (${item.classCode})` : item.name
      }));
    },
    async fetchSubjects(page = 1) {
      if (page < 1 || page > this.pagination.pages) return;

      try {
        this.loading = true;
        this.errorMessage = '';
        const response = await subjects.getAll(page, this.pagination.limit, this.filters);
        this.subjects = response?.data || [];
        this.pagination = response?.pagination || this.pagination;
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
    clearFilters() {
      this.filters = { name: '', classId: '' };
      this.fetchSubjects(1);
    },
    async deleteSubjectRecord(subject) {
      if (subject.isLinked) return;
      if (!confirm(`Delete subject "${subject.name}"?`)) return;

      try {
        await subjects.delete(subject._id);
        this.successMessage = 'Subject deleted successfully';
        await this.fetchSubjects(this.pagination.page);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    }
  },
  async mounted() {
    try {
      this.loading = true;
      await this.loadClasses();
      await this.fetchSubjects(1);
    } finally {
      this.loading = false;
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
