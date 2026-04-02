<template>
  <div class="subject-detail">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Subject Detail</h1>
        <p class="text-muted mb-0">Review subject mapping and usage.</p>
      </div>
      <div class="d-flex gap-2">
        <router-link
          :to="subject?.isLinked ? '#' : `/admin/subjects/${$route.params.id}/edit`"
          :class="['btn', subject?.isLinked ? 'btn-outline-secondary disabled' : 'btn-warning']"
        >
          Edit
        </router-link>
        <router-link to="/admin/subjects" class="btn btn-secondary">Back</router-link>
      </div>
    </div>

    <AlertComponent
      v-if="errorMessage"
      type="danger"
      title="Error"
      :message="errorMessage"
      :timeout="0"
      @close="errorMessage = ''"
    />

    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3 text-muted mb-0">Loading subject...</p>
    </div>

    <div v-else-if="subject" class="card">
      <div class="card-body">
        <div class="row g-4">
          <div class="col-md-6">
            <h6 class="text-muted">Subject Name</h6>
            <p class="fs-5 fw-semibold mb-0">{{ subject.name }}</p>
          </div>
          <div class="col-md-6">
            <h6 class="text-muted">Status</h6>
            <span :class="['badge', subject.isLinked ? 'text-bg-secondary' : 'text-bg-success']">
              {{ subject.isLinked ? 'Linked to exam results' : 'Editable / Deletable' }}
            </span>
          </div>
          <div class="col-12">
            <h6 class="text-muted">Applicable Classes</h6>
            <p v-if="subject.classIds?.length" class="mb-0">
              {{ subject.classIds.map((item) => item.name).join(', ') }}
            </p>
            <p v-else class="mb-0 text-muted">Available for all classes.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { subjects } from '../../../api/api.js';
import AlertComponent from '../../../components/AlertComponent.vue';
import { getErrorMessage } from '../../../utils/validation.js';

export default {
  name: 'SubjectDetail',
  components: { AlertComponent },
  data() {
    return {
      subject: null,
      loading: false,
      errorMessage: ''
    };
  },
  async mounted() {
    try {
      this.loading = true;
      const response = await subjects.getById(this.$route.params.id);
      this.subject = response?.data || null;
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
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
