<template>
  <div class="notices">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">School Notices</h1>
        <p class="hero-tagline">Stay updated with important announcements and information</p>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">📢</div>
      </div>
    </section>

    <!-- Notices Section -->
    <section class="notices-section">
      <div class="container">
        <div class="notices-header">
          <h2>Latest Announcements</h2>
          <p>Important notices and updates from school administration</p>
        </div>

        <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
        <div v-if="loading" class="loading-banner">Loading notices...</div>

        <div class="notices-grid">
          <div v-for="notice in filteredNotices" :key="notice._id" class="notice-card">
            <div class="notice-header">
              <div class="notice-icon">
                <span v-if="notice.noticeType === 'Banner'">🖼️</span>
                <span v-else-if="notice.noticeType === 'Individual'">👤</span>
                <span v-else>📢</span>
              </div>
              <div class="notice-meta">
                <span class="notice-date">{{ notice.date }}</span>
                <span class="priority-badge">{{ notice.noticeType }}</span>
              </div>
            </div>
            <h3>{{ notice.title }}</h3>
            <p class="notice-content">{{ notice.content }}</p>
            <p class="notice-content"><strong>Valid:</strong> {{ notice.fromDate }} to {{ notice.toDate }}</p>
          </div>
        </div>

        <!-- Filters -->
        <div class="filter-section">
          <h3>Filter Notices</h3>
          <div class="filter-buttons">
            <button @click="filterNotices('all')" :class="{ active: noticeTypeFilter === 'all' }" class="filter-btn">All</button>
            <button @click="filterNotices('Individual')" :class="{ active: noticeTypeFilter === 'Individual' }" class="filter-btn">Individual</button>
            <button @click="filterNotices('Banner')" :class="{ active: noticeTypeFilter === 'Banner' }" class="filter-btn">Banner</button>
            <button @click="filterNotices('Notice Board')" :class="{ active: noticeTypeFilter === 'Notice Board' }" class="filter-btn">Notice Board</button>
          </div>
          <div class="date-filter-row">
            <input v-model="fromDateFilter" type="date" class="filter-date-input" />
            <input v-model="toDateFilter" type="date" class="filter-date-input" />
            <button @click="clearDateFilter" class="filter-btn">Clear Date</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <h2>Need More Information?</h2>
        <p>For any questions or clarifications regarding these notices, please contact:</p>
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div>
              <h4>Email</h4>
              <p>notices@school.edu</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">🏢</div>
            <div>
              <h4>Office</h4>
              <p>Administration Building, Room 101</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../services/api.js'

export default {
  name: 'Notices',
  data() {
    return {
      loading: false,
      errorMessage: '',
      noticeTypeFilter: 'all',
      fromDateFilter: '',
      toDateFilter: '',
      notices: []
    }
  },
  computed: {
    filteredNotices() {
      return this.notices.filter((notice) => {
        const typeMatch = this.noticeTypeFilter === 'all' || notice.noticeType === this.noticeTypeFilter
        const fromFilterMatch = !this.fromDateFilter || (notice.fromDate && notice.fromDate >= this.fromDateFilter)
        const toFilterMatch = !this.toDateFilter || (notice.toDate && notice.toDate <= this.toDateFilter)
        return typeMatch && fromFilterMatch && toFilterMatch
      })
    }
  },
  methods: {
    async fetchNotices() {
      this.loading = true
      this.errorMessage = ''
      try {
        const response = await api.getNotices(1, 100)
        const notices = response.data?.data || []
        this.notices = notices.map((notice) => ({
          _id: notice._id,
          title: notice.title,
          content: notice.description,
          noticeType: notice.noticeType || 'Individual',
          fromDate: notice.fromDate ? String(notice.fromDate).slice(0, 10) : '',
          toDate: notice.toDate ? String(notice.toDate).slice(0, 10) : '',
          date: notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : ''
        }))
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Unable to load notices from DB'
      } finally {
        this.loading = false
      }
    },
    filterNotices(type) {
      this.noticeTypeFilter = type
    },
    clearDateFilter() {
      this.fromDateFilter = ''
      this.toDateFilter = ''
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

.notices {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  min-height: 400px;
}

.hero-content {
  animation: fadeInLeft 0.8s ease-out;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-placeholder {
  background: rgba(255, 255, 255, 0.2);
  padding: 4rem;
  border-radius: 8px;
  text-align: center;
  font-size: 4rem;
  font-weight: bold;
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

/* Notices Section */
.notices-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.notices-header {
  text-align: center;
  margin-bottom: 3rem;
}

.notices-header h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.notices-header p {
  color: #666;
  font-size: 1.1rem;
}

.error-banner,
.loading-banner {
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.error-banner {
  background: #fef2f2;
  color: #991b1b;
}

.loading-banner {
  background: #eff6ff;
  color: #1e3a8a;
}

.notices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.notice-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.notice-card:hover {
  transform: translateY(-4px);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.notice-icon {
  font-size: 2rem;
}

.notice-meta {
  text-align: right;
}

.notice-date {
  display: block;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.priority-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-badge.urgent {
  background: #e74c3c;
  color: white;
}

.priority-badge.important {
  background: #f39c12;
  color: white;
}

.notice-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.notice-content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.notice-attachment {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #495057;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.date-filter-row {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-date-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.55rem 0.75rem;
  background: #fff;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #667eea;
  color: white;
}

/* Contact Section */
.contact-section {
  padding: 4rem 2rem;
}

.contact-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.contact-section > .container > p {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.contact-item h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.contact-item p {
  color: #666;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .notices-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
    flex-direction: column;
  }

  .date-filter-row {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .notice-header {
    flex-direction: column;
    gap: 1rem;
  }

  .notice-meta {
    text-align: left;
  }
}
</style>
