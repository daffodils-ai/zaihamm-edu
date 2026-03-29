<template>
  <div class="login-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-icon">🔐</div>
        <h1 class="hero-title">Admin Portal</h1>
        <p class="hero-tagline">Secure access to school management system</p>
      </div>
    </section>

    <!-- Login Form Section -->
    <section class="login-section">
      <div class="container">
        <div class="login-container">
          <div class="login-card">
            <div class="login-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access the admin panel</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label for="email">
                  <i class="bi bi-envelope"></i>
                  Email Address
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  placeholder="admin@school.edu"
                  required
                />
              </div>

              <div class="form-group">
                <label for="password">
                  <i class="bi bi-lock"></i>
                  Password
                </label>
                <div class="password-input">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="password-toggle"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input v-model="rememberMe" type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" class="forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" class="login-btn">
                <i class="bi bi-box-arrow-in-right"></i>
                Sign In
              </button>
            </form>

            <div v-if="error" class="error-message">
              <i class="bi bi-exclamation-triangle"></i>
              {{ error }}
            </div>

            <div class="login-footer">
              <p>Need help? Contact system administrator</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      rememberMe: false,
      error: ''
    }
  },
  methods: {
    handleLogin() {
      // Add login logic here
      if (this.email && this.password) {
        this.$router.push('/admin/dashboard')
      } else {
        this.error = 'Please enter both email and password'
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

.hero-icon {
  font-size: 4rem;
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
  max-width: 500px;
  margin: 0 auto;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Login Section */
.login-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  min-height: calc(100vh - 300px);
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
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

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafbfc;
  color: #333;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.login-footer p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .login-section {
    padding: 2rem 1rem;
  }

  .login-card {
    padding: 2rem;
    margin: 0 1rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
