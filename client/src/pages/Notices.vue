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

        <div class="notices-grid">
          <div v-for="notice in filteredNotices" :key="notice.id" class="notice-card">
            <div class="notice-header">
              <div class="notice-icon">
                <span v-if="notice.priority === 'urgent'">🚨</span>
                <span v-else-if="notice.category === 'academic'">📚</span>
                <span v-else-if="notice.category === 'event'">🎉</span>
                <span v-else>📢</span>
              </div>
              <div class="notice-meta">
                <span class="notice-date">{{ notice.date }}</span>
                <span class="priority-badge">{{ notice.noticeType }}</span>
                <span v-if="notice.priority === 'urgent'" class="priority-badge urgent">Urgent</span>
                <span v-else-if="notice.priority === 'important'" class="priority-badge important">Important</span>
              </div>
            </div>
            <h3>{{ notice.title }}</h3>
            <p class="notice-content">{{ notice.content }}</p>
            <p class="notice-content"><strong>Valid:</strong> {{ notice.fromDate }} to {{ notice.toDate }}</p>
            <div v-if="notice.attachment" class="notice-attachment">
              <span>📎 {{ notice.attachment }}</span>
            </div>
          </div>
        </div>

        <!-- Categories Filter -->
        <div class="filter-section">
          <h3>Filter by Category</h3>
          <div class="filter-buttons">
            <button @click="filterNotices('all')" :class="{ active: activeFilter === 'all' }" class="filter-btn">All</button>
            <button @click="filterNotices('academic')" :class="{ active: activeFilter === 'academic' }" class="filter-btn">Academic</button>
            <button @click="filterNotices('event')" :class="{ active: activeFilter === 'event' }" class="filter-btn">Events</button>
            <button @click="filterNotices('general')" :class="{ active: activeFilter === 'general' }" class="filter-btn">General</button>
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
export default {
  name: 'Notices',
  data() {
    return {
      activeFilter: 'all',
      fromDateFilter: '',
      toDateFilter: '',
      notices: [
        {
          id: 1,
          title: 'Summer Break Announcement',
          date: 'March 15, 2026',
          content: 'Summer break will commence from June 1st to July 31st. Classes will resume on August 1st, 2026. Please ensure all library books are returned before the break.',
          category: 'academic',
          noticeType: 'Notice Board',
          fromDate: '2026-03-15',
          toDate: '2026-06-01',
          priority: 'important',
          attachment: 'Summer Schedule.pdf'
        },
        {
          id: 2,
          title: 'Final Exam Schedule Released',
          date: 'March 10, 2026',
          content: 'Final exams will be held from May 15th to May 30th. The detailed schedule is now available on the student portal. Please check your exam timetable.',
          category: 'academic',
          noticeType: 'Banner',
          fromDate: '2026-03-10',
          toDate: '2026-05-30',
          priority: 'important'
        },
        {
          id: 3,
          title: 'New Library Hours',
          date: 'March 5, 2026',
          content: 'The library will be open from 8 AM to 6 PM starting Monday. Extended hours are available during exam periods.',
          category: 'general',
          noticeType: 'Individual',
          fromDate: '2026-03-05',
          toDate: '2026-12-31',
          priority: 'normal'
        },
        {
          id: 4,
          title: 'Annual Sports Meet 2026',
          date: 'March 1, 2026',
          content: 'Registration for Annual Sports Meet is now open. Events include track and field, basketball, volleyball, and more. Last date for registration: March 20, 2026.',
          category: 'event',
          noticeType: 'Notice Board',
          fromDate: '2026-03-01',
          toDate: '2026-03-20',
          priority: 'normal'
        },
        {
          id: 5,
          title: 'Parent-Teacher Meeting',
          date: 'February 28, 2026',
          content: 'Parent-Teacher meeting scheduled for April 5th, 2026. Individual appointments will be available from 9 AM to 4 PM.',
          category: 'event',
          noticeType: 'Individual',
          fromDate: '2026-02-28',
          toDate: '2026-04-05',
          priority: 'important'
        },
        {
          id: 6,
          title: 'Emergency: Power Outage',
          date: 'February 25, 2026',
          content: 'Due to scheduled maintenance, there will be a brief power outage tomorrow from 10 AM to 12 PM. Classes will be conducted in alternative arrangements.',
          category: 'general',
          noticeType: 'Banner',
          fromDate: '2026-02-25',
          toDate: '2026-02-26',
          priority: 'urgent'
        }
      ]
    }
  },
  computed: {
    filteredNotices() {
      return this.notices.filter((notice) => {
        const categoryMatch = this.activeFilter === 'all' || notice.category === this.activeFilter
        const fromFilterMatch = !this.fromDateFilter || (notice.fromDate && notice.fromDate >= this.fromDateFilter)
        const toFilterMatch = !this.toDateFilter || (notice.toDate && notice.toDate <= this.toDateFilter)
        return categoryMatch && fromFilterMatch && toFilterMatch
      })
    }
  },
  methods: {
    filterNotices(category) {
      this.activeFilter = category
    },
    clearDateFilter() {
      this.fromDateFilter = ''
      this.toDateFilter = ''
    }
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
