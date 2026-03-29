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
                <label for="priority">
                  <i class="bi bi-flag"></i>
                  Priority Level
                </label>
                <select v-model="form.priority" id="priority">
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
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
                <label for="category">
                  <i class="bi bi-folder"></i>
                  Category
                </label>
                <select v-model="form.category" id="category">
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="events">Events</option>
                  <option value="holidays">Holidays</option>
                  <option value="exams">Exams</option>
                </select>
              </div>
              <div class="form-group">
                <label for="expiryDate">
                  <i class="bi bi-calendar-x"></i>
                  Expiry Date (Optional)
                </label>
                <input v-model="form.expiryDate" type="date" id="expiryDate" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">
                <i class="bi bi-check-circle"></i>
                {{ editingId ? 'Update Notice' : 'Create Notice' }}
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
        <div class="section-header">
          <h2>All Notices</h2>
          <div class="notices-stats">
            <span class="stat-item">
              <i class="bi bi-file-earmark-text"></i>
              {{ notices.length }} Total
            </span>
            <span class="stat-item">
              <i class="bi bi-flag-fill text-warning"></i>
              {{ notices.filter(n => n.priority === 'urgent').length }} Urgent
            </span>
          </div>
        </div>

        <div class="notices-grid">
          <div
            v-for="notice in notices"
            :key="notice.id"
            class="notice-card"
            :class="`priority-${notice.priority || 'normal'}`"
          >
            <div class="notice-header">
              <div class="notice-meta">
                <span class="priority-badge" :class="`priority-${notice.priority || 'normal'}`">
                  <i class="bi bi-flag"></i>
                  {{ (notice.priority || 'normal').charAt(0).toUpperCase() + (notice.priority || 'normal').slice(1) }}
                </span>
                <span class="category-badge">
                  <i class="bi bi-folder"></i>
                  {{ (notice.category || 'general').charAt(0).toUpperCase() + (notice.category || 'general').slice(1) }}
                </span>
              </div>
              <div class="notice-actions">
                <button @click="editNotice(notice)" class="edit-btn" title="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="deleteNotice(notice.id)" class="delete-btn" title="Delete">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <div class="notice-content">
              <h3>{{ notice.title }}</h3>
              <p>{{ notice.content }}</p>
            </div>

            <div class="notice-footer">
              <span class="notice-date">
                <i class="bi bi-calendar"></i>
                {{ formatDate(notice.date) }}
              </span>
              <span v-if="notice.expiryDate" class="notice-expiry">
                <i class="bi bi-calendar-x"></i>
                Expires: {{ formatDate(notice.expiryDate) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="notices.length === 0" class="empty-state">
          <div class="empty-icon">📢</div>
          <h3>No notices yet</h3>
          <p>Create your first notice to get started</p>
          <button @click="showForm = true" class="add-notice-btn">
            <i class="bi bi-plus-circle"></i>
            Create First Notice
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ManageNotices',
  data() {
    return {
      notices: [
        {
          id: 1,
          title: 'Summer Break Announcement',
          content: 'Summer break will start from June 1st, 2026. All students are advised to complete their assignments before the break begins.',
          date: '2026-03-15',
          priority: 'important',
          category: 'holidays'
        },
        {
          id: 2,
          title: 'Final Exam Schedule',
          content: 'Final examinations are scheduled to begin from May 15th, 2026. Please check the detailed schedule on the notice board.',
          date: '2026-03-10',
          priority: 'urgent',
          category: 'exams'
        }
      ],
      showForm: false,
      editingId: null,
      form: {
        title: '',
        content: '',
        priority: 'normal',
        category: 'general',
        expiryDate: ''
      }
    }
  },
  methods: {
    saveNotice() {
      if (this.editingId) {
        const notice = this.notices.find(n => n.id === this.editingId)
        if (notice) {
          notice.title = this.form.title
          notice.content = this.form.content
          notice.priority = this.form.priority
          notice.category = this.form.category
          notice.expiryDate = this.form.expiryDate
          notice.date = new Date().toISOString().split('T')[0]
        }
      } else {
        this.notices.push({
          id: Date.now(),
          title: this.form.title,
          content: this.form.content,
          priority: this.form.priority,
          category: this.form.category,
          expiryDate: this.form.expiryDate,
          date: new Date().toISOString().split('T')[0]
        })
      }
      this.cancelEdit()
    },
    editNotice(notice) {
      this.editingId = notice.id
      this.form = {
        title: notice.title,
        content: notice.content,
        priority: notice.priority || 'normal',
        category: notice.category || 'general',
        expiryDate: notice.expiryDate || ''
      }
      this.showForm = true
    },
    deleteNotice(id) {
      if (confirm('Are you sure you want to delete this notice?')) {
        this.notices = this.notices.filter(n => n.id !== id)
      }
    },
    cancelEdit() {
      this.showForm = false
      this.editingId = null
      this.form = {
        title: '',
        content: '',
        priority: 'normal',
        category: 'general',
        expiryDate: ''
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
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
