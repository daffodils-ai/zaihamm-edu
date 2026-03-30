<template>
  <div class="users-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Organization Users</h1>
        <p class="text-muted">Manage all users</p>
      </div>
      <router-link to="/admin/users/new" class="btn btn-primary">
        <i>➕</i> Add User
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
          <div class="col-md-6">
            <CustomInput
              v-model="filters.email"
              label="Search by Email"
              placeholder="Enter email"
              @blur="applyFilters"
            />
          </div>
          <div class="col-md-6">
            <CustomSelect
              v-model="filters.role"
              label="Role"
              :options="roleOptions"
              placeholder="Filter by role"
              @update:model-value="applyFilters"
            />
          </div>
          <div class="col-12">
            <div class="d-flex gap-2">
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
        <h5 class="mb-0">Users List</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="refreshList">
          🔄 Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3 text-muted">Loading users...</p>
      </div>

      <div v-else-if="users.length === 0" class="text-center p-5">
        <p class="text-muted">No users found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" /></th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td><input type="checkbox" v-model="selectedUsers" :value="user._id" /></td>
              <td class="fw-bold">{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.mobile }}</td>
              <td><span class="badge bg-info">{{ user.role }}</span></td>
              <td><span :class="['badge', user.is_active ? 'bg-success' : 'bg-danger']">{{ user.is_active ? 'Active' : 'Inactive' }}</span></td>
              <td>
                <div class="btn-group btn-group-sm">
                  <router-link :to="`/admin/users/${user._id}/edit`" class="btn btn-outline-warning">✏️</router-link>
                  <button class="btn btn-outline-danger" @click="deleteUser(user._id)">🗑️</button>
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
import CustomSelect from '../../../components/CustomSelect.vue';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'OrganizationUserList',
  components: { CustomInput, CustomSelect, AlertComponent },
  data() {
    return {
      filters: { email: '', role: '' },
      roleOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'accountant', label: 'Accountant' }
      ],
      selectedUsers: [],
      selectAll: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    ...mapState('organizationUsers', ['users', 'loading']),
    ...mapGetters('organizationUsers', ['isLoading'])
  },
  watch: {
    selectAll(val) {
      this.selectedUsers = val ? this.users.map((u) => u._id) : [];
    }
  },
  methods: {
    ...mapActions('organizationUsers', ['fetchOrganizationUsers', 'deleteOrganizationUser']),
    async applyFilters() {
      try {
        await this.fetchOrganizationUsers({ page: 1, limit: 20, filters: this.filters });
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    clearFilters() {
      this.filters = { email: '', role: '' };
      this.applyFilters();
    },
    async refreshList() {
      await this.applyFilters();
    },
    async deleteUser(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await this.deleteOrganizationUser(id);
        this.successMessage = 'User deleted';
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
