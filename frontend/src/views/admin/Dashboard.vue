<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar bg-dark">
      <div class="sidebar-brand">
        <router-link to="/admin" class="d-flex align-items-center text-white text-decoration-none">
          <span>🏫</span>
          <span class="ms-2">School MS</span>
        </router-link>
      </div>

      <nav class="sidebar-nav mt-5">
        <div class="nav-section">
          <h6 class="nav-section-title">MENU</h6>
          <router-link
            to="/admin"
            class="nav-link"
            :class="{ active: $route.path === '/admin' }"
          >
            <i class="icon">📊</i>
            <span>Dashboard</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h6 class="nav-section-title">MANAGEMENT</h6>
          <router-link
            to="/admin/students"
            class="nav-link"
            :class="{ active: $route.path.includes('/students') }"
          >
            <i class="icon">👨‍🎓</i>
            <span>Students</span>
          </router-link>
          <router-link
            to="/admin/classes"
            class="nav-link"
            :class="{ active: $route.path.includes('/classes') }"
          >
            <i class="icon">📚</i>
            <span>Classes</span>
          </router-link>
          <router-link
            to="/admin/sections"
            class="nav-link"
            :class="{ active: $route.path.includes('/sections') }"
          >
            <i class="icon">📋</i>
            <span>Sections</span>
          </router-link>
          <router-link
            to="/admin/admissions"
            class="nav-link"
            :class="{ active: $route.path.includes('/admissions') }"
          >
            <i class="icon">📝</i>
            <span>Admissions</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h6 class="nav-section-title">FINANCES</h6>
          <router-link
            to="/admin/fees"
            class="nav-link"
            :class="{ active: $route.path.includes('/fees') }"
          >
            <i class="icon">💰</i>
            <span>Fees</span>
          </router-link>
          <router-link
            to="/admin/exam-results"
            class="nav-link"
            :class="{ active: $route.path.includes('/exam-results') }"
          >
            <i class="icon">🧾</i>
            <span>Exam Results</span>
          </router-link>
          <router-link
            to="/admin/subjects"
            class="nav-link"
            :class="{ active: $route.path.includes('/subjects') }"
          >
            <i class="icon">📘</i>
            <span>Subjects</span>
          </router-link>
          <router-link
            to="/admin/certificates"
            class="nav-link"
            :class="{ active: $route.path.includes('/certificates') }"
          >
            <i class="icon">📄</i>
            <span>Certificates</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h6 class="nav-section-title">COMMUNICATION</h6>
          <router-link
            to="/admin/notices"
            class="nav-link"
            :class="{ active: $route.path.includes('/notices') }"
          >
            <i class="icon">📢</i>
            <span>Notices</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h6 class="nav-section-title">ADMINISTRATION</h6>
          <router-link
            to="/admin/users"
            class="nav-link"
            :class="{ active: $route.path.includes('/users') }"
          >
            <i class="icon">👥</i>
            <span>Users</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-outline-danger w-100" @click="handleLogout">
          <i>🚪</i> Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar -->
      <div class="topbar">
        <div class="topbar-left">
          <button class="btn-toggle-sidebar" @click="toggleSidebar">
            ☰
          </button>
        </div>

        <div class="topbar-right">
          <div class="user-menu dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <span>👤</span>
              <span class="ms-2">{{ userName }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#profile">Profile</a></li>
              <li><a class="dropdown-item" href="#settings">Settings</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item text-danger" href="#logout" @click="handleLogout">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      sidebarOpen: true
    };
  },
  computed: {
    ...mapGetters('auth', ['userName', 'user'])
  },
  methods: {
    ...mapActions('auth', ['logout']),

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },

    handleLogout() {
      if (confirm('Are you sure you want to logout?')) {
        this.logout();
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background-color: #2c3e50;
  color: white;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-brand {
  padding: 2rem 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-brand a {
  color: white !important;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background-color: #3498db;
  color: white;
}

.nav-link .icon {
  font-size: 1.2rem;
  width: 1.5rem;
  margin-right: 0.75rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.sidebar-footer .btn {
  color: #e74c3c;
  border-color: #e74c3c;
}

.sidebar-footer .btn:hover {
  background-color: #e74c3c;
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

/* Top Bar */
.topbar {
  background-color: white;
  border-bottom: 1px solid #ddd;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-toggle-sidebar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2c3e50;
  display: none;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu .btn-link {
  color: #2c3e50;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.user-menu .btn-link:hover {
  color: #3498db;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.dropdown-item {
  color: #2c3e50;
  padding: 0.75rem 1.25rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #3498db;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .btn-toggle-sidebar {
    display: block;
  }

  .content-area {
    padding: 1rem;
  }

  .topbar {
    padding: 1rem;
  }
}
</style>
