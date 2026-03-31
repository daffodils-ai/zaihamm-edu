<template>
  <div class="manage-notices-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-icon">📢</div>
        <h1 class="hero-title">Manage Notices</h1>
        <p class="hero-tagline">Create, edit, and manage school announcements</p>
      </div>
      <div class="hero-actions">
        <button @click="showForm = true" class="add-notice-btn">
          <i class="bi bi-plus-circle"></i>
          Add New Notice
        </button>
      </div>
    </section>

    <!-- Form Section -->
    <section v-if="showForm" class="form-section">
      <div class="container">
        <div class="form-card">
          <div class="form-header">
            <h2>{{ editingId ? 'Edit Notice' : 'Create New Notice' }}</h2>
            <button @click="cancelEdit" class="close-btn">
              <i class="bi bi-x"></i>
            </button>
          </div>

          <form @submit.prevent="saveNotice" class="notice-form">
            <div class="form-row">
              <div class="form-group">
                <label for="title">
                  <i class="bi bi-tag"></i>
                  Notice Title *
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  id="title"
                  placeholder="Enter notice title"
                  required
                />
              </div>
              <div class="form-group">
                <label for="noticeType">
                  <i class="bi bi-card-list"></i>
                  Notice Type *
                </label>
                <select v-model="form.noticeType" id="noticeType" required>
                  <option v-for="type in noticeTypeOptions" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="content">
                <i class="bi bi-file-text"></i>
                Notice Content *
              </label>
              <textarea
                v-model="form.content"
                id="content"
                rows="6"
                placeholder="Enter the full notice content here..."
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="fromDate">
                  <i class="bi bi-calendar-event"></i>
                  From Date *
                </label>
                <input v-model="form.fromDate" type="date" id="fromDate" required />
              </div>
              <div class="form-group">
                <label for="toDate">
                  <i class="bi bi-calendar2-check"></i>
                  To Date *
                </label>
                <input v-model="form.toDate" type="date" id="toDate" required />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="saving">
                <i class="bi bi-check-circle"></i>
                {{ saving ? 'Saving...' : (editingId ? 'Update Notice' : 'Create Notice') }}
              </button>
              <button type="button" @click="cancelEdit" class="cancel-btn">
                <i class="bi bi-x-circle"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Notices List Section -->
    <section class="notices-section">
      <div class="container">
        <div v-if="errorMessage" class="status-message error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="status-message success-message">{{ successMessage }}</div>

        <div class="section-header">
          <h2>All Notices</h2>
          <div class="notices-stats">
            <span class="stat-item">
              <i class="bi bi-file-earmark-text"></i>
              {{ pagination.total }} Total
            </span>
          </div>
        </div>

        <div class="filters-row">
          <div class="form-group">
            <label for="filterNoticeType">Notice Type</label>
            <select id="filterNoticeType" v-model="filters.noticeType">
              <option value="">All</option>
              <option v-for="type in noticeTypeOptions" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="filterFromDate">From Date</label>
            <input id="filterFromDate" v-model="filters.fromDate" type="date" />
          </div>
          <div class="form-group">
            <label for="filterToDate">To Date</label>
            <input id="filterToDate" v-model="filters.toDate" type="date" />
          </div>
          <div class="filter-actions">
            <button class="pagination-btn" @click="applyFilters" :disabled="loading">Apply Filter</button>
            <button class="pagination-btn" @click="clearFilters" :disabled="loading">Clear</button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">Loading notices...</div>

        <div v-else-if="notices.length > 0" class="notices-grid">
          <div
            v-for="notice in notices"
            :key="notice._id"
            class="notice-card"
          >
            <div class="notice-header">
              <div class="notice-meta">
                <span class="category-badge">
                  <i class="bi bi-card-list"></i>
                  {{ notice.noticeType }}
                </span>
              </div>
              <div class="notice-actions">
                <button @click="editNotice(notice)" class="edit-btn" title="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="deleteNotice(notice._id)" class="delete-btn" title="Delete">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <div class="notice-content">
              <h3>{{ notice.title }}</h3>
              <p>{{ notice.description }}</p>
            </div>

            <div class="notice-footer">
              <span class="notice-date">
                <i class="bi bi-calendar"></i>
                {{ formatDate(notice.createdAt) }}
              </span>
              <span class="notice-expiry">
                <i class="bi bi-calendar-range"></i>
                {{ formatDate(notice.fromDate) }} - {{ formatDate(notice.toDate) }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📢</div>
          <h3>No notices yet</h3>
          <p>Create your first notice to get started</p>
          <button @click="showForm = true" class="add-notice-btn">
            <i class="bi bi-plus-circle"></i>
            Create First Notice
          </button>
        </div>

        <div v-if="totalPages > 1" class="pagination-wrapper">
          <button class="pagination-btn" :disabled="currentPage === 1 || loading" @click="changePage(currentPage - 1)">
            Previous
          </button>
          <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="pagination-btn" :disabled="currentPage === totalPages || loading" @click="changePage(currentPage + 1)">
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../services/api.js'

export default {
  name: 'ManageNotices',
  data() {
    return {
      notices: [],
      noticeTypeOptions: ['Individual', 'Banner', 'Notice Board'],
      showForm: false,
      editingId: null,
      loading: false,
      saving: false,
      successMessage: '',
      errorMessage: '',
      currentPage: 1,
      limit: 10,
      pagination: {
        total: 0,
        pages: 1
      },
      filters: {
        noticeType: '',
        fromDate: '',
        toDate: ''
      },
      form: {
        title: '',
        content: '',
        noticeType: 'Individual',
        fromDate: '',
        toDate: ''
      }
    }
  },
  computed: {
    totalPages() {
      return this.pagination.pages || 1
    }
  },
  methods: {
    async fetchNotices() {
      this.loading = true
      this.errorMessage = ''
      try {
        const activeFilters = {
          ...(this.filters.noticeType ? { noticeType: this.filters.noticeType } : {}),
          ...(this.filters.fromDate ? { fromDate: this.filters.fromDate } : {}),
          ...(this.filters.toDate ? { toDate: this.filters.toDate } : {})
        }
        const response = await api.getNotices(this.currentPage, this.limit, activeFilters)
        this.notices = response.data?.data || []
        this.pagination = response.data?.pagination || { total: 0, pages: 1 }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to load notices'
      } finally {
        this.loading = false
      }
    },
    async saveNotice() {
      this.saving = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        if (!this.form.fromDate || !this.form.toDate || this.form.fromDate > this.form.toDate) {
          this.errorMessage = 'Please select a valid date range'
          this.saving = false
          return
        }

        const payload = {
          title: this.form.title.trim(),
          description: this.form.content.trim(),
          noticeType: this.form.noticeType,
          fromDate: this.form.fromDate,
          toDate: this.form.toDate
        }

        if (this.editingId) {
          await api.updateNotice(this.editingId, payload)
          this.successMessage = 'Notice updated successfully'
        } else {
          await api.createNotice(payload)
          this.successMessage = 'Notice created successfully'
          this.currentPage = 1
        }

        this.cancelEdit()
        await this.fetchNotices()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to save notice'
      } finally {
        this.saving = false
      }
    },
    editNotice(notice) {
      this.editingId = notice._id
      this.form = {
        title: notice.title,
        content: notice.description,
        noticeType: notice.noticeType || 'Individual',
        fromDate: notice.fromDate ? notice.fromDate.slice(0, 10) : '',
        toDate: notice.toDate ? notice.toDate.slice(0, 10) : ''
      }
      this.showForm = true
    },
    async deleteNotice(id) {
      if (confirm('Are you sure you want to delete this notice?')) {
        try {
          this.errorMessage = ''
          this.successMessage = ''
          await api.deleteNotice(id)
          this.successMessage = 'Notice deleted successfully'

          if (this.notices.length === 1 && this.currentPage > 1) {
            this.currentPage -= 1
          }

          await this.fetchNotices()
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Failed to delete notice'
        }
      }
    },
    async changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return
      this.currentPage = page
      await this.fetchNotices()
    },
    async applyFilters() {
      this.currentPage = 1
      await this.fetchNotices()
    },
    async clearFilters() {
      this.filters = {
        noticeType: '',
        fromDate: '',
        toDate: ''
      }
      this.currentPage = 1
      await this.fetchNotices()
    },
    cancelEdit() {
      this.showForm = false
      this.editingId = null
      this.form = {
        title: '',
        content: '',
        noticeType: 'Individual',
        fromDate: '',
        toDate: ''
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  mounted() {
    this.fetchNotices()
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.manage-notices-page {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 300px;
}

.hero-content {
  flex: 1;
  animation: fadeInLeft 0.8s ease-out;
}

.hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.hero-actions {
  flex-shrink: 0;
}

.add-notice-btn {
  padding: 0.875rem 2rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.add-notice-btn:hover {
  background-color: white;
  color: #667eea;
  transform: translateY(-2px);
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Form Section */
.form-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.notice-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group label i {
  color: #667eea;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafbfc;
  color: #333;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder,
.form-group select::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.cancel-btn {
  padding: 1rem 2rem;
  background: transparent;
  color: #6b7280;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

/* Notices Section */
.notices-section {
  padding: 4rem 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  color: #333;
  font-size: 2.5rem;
  margin: 0;
}

.notices-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.text-warning {
  color: #f59e0b !important;
}

.status-message {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
}

.success-message {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.error-message {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.loading-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-weight: 600;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.notices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.notice-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  border-left: 4px solid #e5e7eb;
}

.notice-card:hover {
  transform: translateY(-4px);
}

.notice-card.priority-urgent {
  border-left-color: #dc2626;
}

.notice-card.priority-important {
  border-left-color: #f59e0b;
}

.notice-card.priority-normal {
  border-left-color: #10b981;
}

.notice-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.notice-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.priority-badge,
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.priority-urgent {
  background-color: #fef2f2;
  color: #dc2626;
}

.priority-badge.priority-important {
  background-color: #fffbeb;
  color: #f59e0b;
}

.priority-badge.priority-normal {
  background-color: #f0fdf4;
  color: #10b981;
}

.category-badge {
  background-color: #f3f4f6;
  color: #374151;
}

.notice-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #f3f4f6;
  color: #667eea;
}

.edit-btn:hover {
  background-color: #667eea;
  color: white;
}

.delete-btn {
  background-color: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #dc2626;
  color: white;
}

.notice-content {
  padding: 1.5rem;
}

.notice-content h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.notice-content p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.notice-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.notice-date,
.notice-expiry {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

.pagination-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #4b5563;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .notices-stats {
    justify-content: center;
  }

  .notices-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .notice-header {
    flex-direction: column;
    gap: 1rem;
  }

  .notice-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
