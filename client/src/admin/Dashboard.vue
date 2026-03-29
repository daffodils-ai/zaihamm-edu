<template>
  <div class="dashboard-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-icon">📊</div>
        <h1 class="hero-title">Admin Dashboard</h1>
        <p class="hero-tagline">Manage school operations and monitor key metrics</p>
      </div>
      <div class="hero-actions">
        <button @click="logout" class="logout-btn">
          <i class="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </section>

    <!-- Stats Overview -->
    <section class="stats-section">
      <div class="container">
        <h2>Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📢</div>
            <div class="stat-content">
              <h3>Total Notices</h3>
              <p class="stat-number">45</p>
              <p class="stat-change positive">+5 this week</p>
            </div>
            <router-link to="/admin/manage-notices" class="stat-link">
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>Pending Admissions</h3>
              <p class="stat-number">12</p>
              <p class="stat-change neutral">3 reviewed today</p>
            </div>
            <a href="#" class="stat-link">
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>Fees Collected</h3>
              <p class="stat-number">$45K</p>
              <p class="stat-change positive">+12% this month</p>
            </div>
            <router-link to="/admin/manage-fees" class="stat-link">
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <h3>Total Students</h3>
              <p class="stat-number">234</p>
              <p class="stat-change positive">+8 this month</p>
            </div>
            <a href="#" class="stat-link">
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="actions-section">
      <div class="container">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card">
            <div class="action-icon">📝</div>
            <h3>Create Notice</h3>
            <p>Post new announcements and updates</p>
            <router-link to="/admin/manage-notices" class="action-btn">
              Create Notice
            </router-link>
          </div>

          <div class="action-card">
            <div class="action-icon">📊</div>
            <h3>Generate Report</h3>
            <p>View detailed analytics and reports</p>
            <button class="action-btn" @click="generateReport">
              Generate Report
            </button>
          </div>

          <div class="action-card">
            <div class="action-icon">👤</div>
            <h3>Manage Users</h3>
            <p>Add or modify user accounts</p>
            <button class="action-btn" @click="manageUsers">
              Manage Users
            </button>
          </div>

          <div class="action-card">
            <div class="action-icon">⚙️</div>
            <h3>System Settings</h3>
            <p>Configure system preferences</p>
            <button class="action-btn" @click="systemSettings">
              Settings
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="activity-section">
      <div class="container">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">📢</div>
            <div class="activity-content">
              <p><strong>New notice posted:</strong> "School Reopening Guidelines"</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-icon">💰</div>
            <div class="activity-content">
              <p><strong>Fee payment received:</strong> John Doe - Grade 10</p>
              <span class="activity-time">4 hours ago</span>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-icon">👤</div>
            <div class="activity-content">
              <p><strong>New admission:</strong> Sarah Smith - Grade 1</p>
              <span class="activity-time">1 day ago</span>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-icon">📝</div>
            <div class="activity-content">
              <p><strong>Notice updated:</strong> "Exam Schedule Changes"</p>
              <span class="activity-time">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    logout() {
      // Add logout logic here
      this.$router.push('/admin/login')
    },
    generateReport() {
      alert('Report generation feature coming soon!')
    },
    manageUsers() {
      alert('User management feature coming soon!')
    },
    systemSettings() {
      alert('System settings feature coming soon!')
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-page {
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

.logout-btn {
  padding: 0.75rem 1.5rem;
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

.logout-btn:hover {
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

/* Stats Section */
.stats-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  border-radius: 12px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.9rem;
  margin: 0;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.neutral {
  color: #6b7280;
}

.stat-link {
  color: #667eea;
  text-decoration: none;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.stat-link:hover {
  color: #764ba2;
}

/* Actions Section */
.actions-section {
  padding: 4rem 2rem;
}

.actions-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.action-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.action-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

/* Activity Section */
.activity-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.activity-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.activity-list {
  max-width: 800px;
  margin: 0 auto;
}

.activity-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.activity-icon {
  font-size: 2rem;
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 8px;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.activity-time {
  color: #6b7280;
  font-size: 0.9rem;
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

  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
