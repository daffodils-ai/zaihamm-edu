<template>
  <div class="generic-list">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>{{ title }}</h1>
      </div>
      <router-link :to="createLink" v-if="createLink" class="btn btn-primary">
        ➕ Add {{ singularTitle }}
      </router-link>
    </div>

    <div class="card">
      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary"></div>
      </div>
      <div v-else-if="items.length === 0" class="text-center p-5">
        <p class="text-muted">No {{ title.toLowerCase() }} found</p>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item._id">
              <td>{{ index + 1 }}</td>
              <td class="fw-bold">{{ item.name || item.title || 'N/A' }}</td>
              <td>
                <span :class="['badge', item.is_active ? 'bg-success' : 'bg-danger']">
                  {{ item.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <router-link :to="`${editLink}/${item._id}`" v-if="editLink" class="btn btn-outline-warning">
                    ✏️
                  </router-link>
                  <button class="btn btn-outline-danger" @click="deleteItem(item._id)">
                    🗑️
                  </button>
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
export default {
  name: 'GenericList',
  props: {
    title: String,
    singularTitle: String,
    items: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    createLink: String,
    editLink: String
  },
  methods: {
    deleteItem(id) {
      if (confirm('Are you sure?')) {
        this.$emit('delete', id);
      }
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
