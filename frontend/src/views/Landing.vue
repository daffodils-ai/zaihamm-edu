<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <strong>🏫 School Management</strong>
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#features">Features</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">About</a>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Admin Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/student-login" class="nav-link">Student Login</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section text-white py-5">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">
              Manage Your School Efficiently
            </h1>
            <p class="lead mb-4">
              A comprehensive school management system designed to streamline administrative
              tasks, student management, and communication between all stakeholders.
            </p>
            <div class="d-flex gap-3">
              <router-link to="/login" class="btn btn-light btn-lg">
                Admin Portal
              </router-link>
              <router-link to="/student-login" class="btn btn-outline-light btn-lg">
                Student Portal
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <div class="display-1">📚</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section py-5">
      <div class="container">
        <h2 class="text-center mb-5">Key Features</h2>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">👨‍🎓</div>
                <h5 class="card-title mt-3">Student Management</h5>
                <p class="card-text">
                  Comprehensive student records, admission, and tracking system
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">💰</div>
                <h5 class="card-title mt-3">Fee Management</h5>
                <p class="card-text">
                  Track fees, payments, and generate reports easily
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">📢</div>
                <h5 class="card-title mt-3">Notices & Announcements</h5>
                <p class="card-text">
                  Communicate with students and parents instantly
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">📊</div>
                <h5 class="card-title mt-3">Analytics & Reports</h5>
                <p class="card-text">
                  Detailed dashboards and reports for better insights
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">👥</div>
                <h5 class="card-title mt-3">User Management</h5>
                <p class="card-text">
                  Manage admins, teachers, and staff users
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">🔒</div>
                <h5 class="card-title mt-3">Secure & Reliable</h5>
                <p class="card-text">
                  Enterprise-grade security and data protection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">About This System</h2>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <p class="lead">
              Our school management system is built with cutting-edge technology to provide
              a seamless experience for administrators, teachers, students, and parents.
            </p>
            <p>
              With features like real-time notifications, comprehensive reporting, and
              intuitive user interfaces, managing a school has never been easier.
            </p>
            <h5 class="mt-4">What We Offer:</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">✓ Complete Student Information System</li>
              <li class="list-group-item">✓ Automated Fee Management</li>
              <li class="list-group-item">✓ Class and Section Management</li>
              <li class="list-group-item">✓ Notice Board and Announcements</li>
              <li class="list-group-item">✓ Real-time Notifications</li>
              <li class="list-group-item">✓ Advanced Analytics Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section text-white py-5">
      <div class="container text-center">
        <h2 class="mb-4">Ready to Get Started?</h2>
        <p class="lead mb-4">
          Transform your school management experience today
        </p>
        <div class="d-flex gap-3 justify-content-center">
          <router-link to="/login" class="btn btn-light btn-lg">
            Login Now
          </router-link>
          <a href="#features" class="btn btn-outline-light btn-lg">
            Learn More
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer bg-dark text-white py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5>School Management System</h5>
            <p class="text-muted">Simplifying school administration</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a href="#features" class="text-muted text-decoration-none">Features</a></li>
              <li><a href="#about" class="text-muted text-decoration-none">About</a></li>
              <li><router-link to="/login" class="text-muted text-decoration-none">Login</router-link></li>
            </ul>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Contact</h5>
            <p class="text-muted">Email: info@schoolmanagement.com</p>
            <p class="text-muted">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <hr class="bg-secondary" />
        <div class="text-center text-muted">
          <p>&copy; 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Landing'
};
</script>

<style scoped>
.landing-page {
  background-color: #f8f9fa;
}

.navbar {
  background-color: #2c3e50 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-section {
  background-color: #2c3e50;
  display: flex;
  align-items: center;
}

.hero-image {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.feature-card {
  transition: all 0.3s ease;
  border: none;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 3rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.features-section {
  background-color: #fff;
}

.about-section {
  background-color: #f8f9fa;
}

.cta-section {
  background-color: #2c3e50;
}

.footer {
  background-color: #2c3e50;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .hero-section .display-4 {
    font-size: 2rem;
  }

  .feature-icon {
    font-size: 2rem;
  }
}
</style>
