<template>
  <div class="student-portal">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link to="/student" class="navbar-brand">
          Student Portal
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/student" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/student/notices" class="nav-link">Notices</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/student/fees" class="nav-link">Fees</router-link>
            </li>
            <li class="nav-item">
              <a href="#logout" class="nav-link" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'StudentPortal',
  methods: {
    ...mapActions('auth', ['logout']),
    logout() {
      if (confirm('Are you sure you want to logout?')) {
        this.logout();
        this.$router.push('/student-login');
      }
    }
  }
};
</script>

<style scoped>
.student-portal {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
