<template>
  <div class="sections-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Sections</h1>
        <p class="text-muted">Manage all sections</p>
      </div>
      <router-link to="/admin/sections/new" class="btn btn-primary">
        <i>➕</i> Add Section
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

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <CustomInput
              v-model="filters.name"
              label="Search by Section Name"
              placeholder="Enter section name"
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

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Sections List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading sections...</p>
      </div>

      <div v-else-if="sections.length === 0" class="text-center p-5">
        <p class="text-muted">No sections found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" /></th>
              <th>Section Name</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sec in sections" :key="sec._id">
              <td><input type="checkbox" v-model="selectedSections" :value="sec._id" /></td>
              <td class="fw-bold">{{ sec.name }}</td>
              <td>{{ sec.classId?.name || '-' }}</td>
              <td><span :class="['badge', sec.is_active ? 'bg-success' : 'bg-danger']">{{ sec.is_active ? 'Active' : 'Inactive' }}</span></td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <router-link :to="`/admin/sections/${sec._id}/edit`" class="btn btn-outline-warning">✏️</router-link>
                  <button class="btn btn-outline-danger" @click="deleteSection(sec._id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
  name: 'SectionList',
  components: { CustomInput, AlertComponent },
  data() {
    return {
      filters: { name: '' },
      selectedSections: [],
      selectAll: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    ...mapState('sections', ['sections', 'loading']),
    ...mapGetters('sections', ['isLoading'])
  },
  watch: {
    selectAll(val) {
      this.selectedSections = val ? this.sections.map((s) => s._id) : [];
    }
  },
  methods: {
    ...mapActions('sections', ['fetchSections', 'updateSection', 'deleteSection']),
    async applyFilters() {
      try {
        await this.fetchSections({ page: 1, limit: 20, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { name: '' };
      this.applyFilters();
    },
    async refreshList() {
      await this.applyFilters();
    },
    async deleteSection(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.deleteSection(id);
        this.successMessage = 'Section deleted';
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
.page-header { border-bottom: 2px solid #3498db; padding-bottom: 1.5rem; }
.page-header h1 { font-size: 2rem; font-weight: 700; }
</style>
