<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>👨‍🎓 Student Portal</h1>
          <p>Login to Your Account</p>
        </div>

        <div class="login-body">
          <AlertComponent
            v-if="errorMessage"
            type="danger"
            title="Login Failed"
            :message="errorMessage"
            :timeout="0"
            @close="errorMessage = ''"
          />

          <form @submit.prevent="handleLogin">
            <CustomInput
              v-model="form.registrationNumber"
              label="Registration Number"
              type="text"
              placeholder="Your 16-digit registration number"
              required
              :error="errors.registrationNumber"
            />

            <CustomInput
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
              :error="errors.password"
            />

            <div class="form-check mb-3">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="form-check-input"
                id="rememberMeStudent"
              />
              <label class="form-check-label" for="rememberMeStudent">
                Remember me
              </label>
            </div>

            <CustomButton
              label="Login"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="handleLogin"
              class="w-100"
            />

            <hr class="my-3" />

            <p class="text-center text-muted mb-0">
              Admin user?
              <router-link to="/login" class="text-primary">
                Admin Login
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomInput from '../../components/CustomInput.vue';
import CustomButton from '../../components/CustomButton.vue';
import AlertComponent from '../../components/AlertComponent.vue';
import { validateRegistrationNumber, getErrorMessage } from '../../utils/validation.js';

export default {
  name: 'StudentLogin',
  components: {
    CustomInput,
    CustomButton,
    AlertComponent
  },
  data() {
    return {
      form: {
        registrationNumber: '',
        password: ''
      },
      rememberMe: false,
      errors: {},
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    ...mapActions('auth', ['studentLogin']),

    validateForm() {
      this.errors = {};

      if (!this.form.registrationNumber.trim()) {
        this.errors.registrationNumber = 'Registration number is required';
      } else if (!validateRegistrationNumber(this.form.registrationNumber)) {
        this.errors.registrationNumber = 'Registration number must be 16 digits';
      }

      if (!this.form.password.trim()) {
        this.errors.password = 'Password is required';
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleLogin() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.isLoading = true;
        this.errorMessage = '';

        await this.studentLogin({
          registrationNumber: this.form.registrationNumber,
          password: this.form.password
        });

        // Redirect to student dashboard
        this.$router.push('/student');
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
        console.error('Student login error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  padding: 2rem;
  text-align: center;
  color: white;
  background-color: #2c3e50;
}

.login-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: white;
}

.login-header p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.login-body {
  padding: 2rem;
}

.form-check {
  margin-bottom: 1rem;
}

.form-check-input {
  border-radius: 4px;
  cursor: pointer;
}

.text-center {
  text-align: center;
}

@media (max-width: 576px) {
  .login-card {
    margin: 0;
    border-radius: 10px;
  }

  .login-header {
    padding: 1.5rem;
  }

  .login-body {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
