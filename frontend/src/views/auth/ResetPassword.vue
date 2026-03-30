<template>
  <div class="reset-password-page">
    <div class="reset-container">
      <div class="reset-card">
        <div class="reset-header">
          <h1>🔐 Reset Password</h1>
          <p>Create a new password</p>
        </div>

        <div class="reset-body">
          <AlertComponent
            v-if="successMessage"
            type="success"
            title="Success"
            :message="successMessage"
            @close="successMessage = ''"
          />

          <AlertComponent
            v-if="errorMessage"
            type="danger"
            title="Error"
            :message="errorMessage"
            :timeout="0"
            @close="errorMessage = ''"
          />

          <form @submit.prevent="handleReset">
            <CustomInput
              v-model="form.userId"
              label="User ID"
              type="text"
              placeholder="Your user ID"
              required
              :error="errors.userId"
            />

            <CustomInput
              v-model="form.newPassword"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              required
              :error="errors.newPassword"
              hint="Password must be at least 8 characters"
            />

            <CustomInput
              v-model="form.confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
              :error="errors.confirmPassword"
            />

            <CustomButton
              label="Reset Password"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="handleReset"
              class="w-100"
            />

            <hr class="my-3" />

            <p class="text-center text-muted mb-0">
              Remember your password?
              <router-link to="/login" class="text-primary">
                Login here
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
import { validatePassword, getErrorMessage } from '../../utils/validation.js';

export default {
  name: 'ResetPassword',
  components: {
    CustomInput,
    CustomButton,
    AlertComponent
  },
  data() {
    return {
      form: {
        userId: '',
        newPassword: '',
        confirmPassword: ''
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      isLoading: false
    };
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),

    validateForm() {
      this.errors = {};

      if (!this.form.userId.trim()) {
        this.errors.userId = 'User ID is required';
      }

      if (!this.form.newPassword.trim()) {
        this.errors.newPassword = 'Password is required';
      } else if (!validatePassword(this.form.newPassword)) {
        this.errors.newPassword = 'Password must be at least 8 characters';
      }

      if (!this.form.confirmPassword.trim()) {
        this.errors.confirmPassword = 'Please confirm your password';
      } else if (this.form.newPassword !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleReset() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.isLoading = true;
        this.errorMessage = '';

        await this.resetPassword({
          userId: this.form.userId,
          newPassword: this.form.newPassword
        });

        this.successMessage = 'Password reset successfully!';
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
        console.error('Reset password error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  padding: 1rem;
}

.reset-container {
  width: 100%;
  max-width: 450px;
}

.reset-card {
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

.reset-header {
  padding: 2rem;
  text-align: center;
  color: white;
  background-color: #2c3e50;
}

.reset-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: white;
}

.reset-header p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.reset-body {
  padding: 2rem;
}

.text-center {
  text-align: center;
}

@media (max-width: 576px) {
  .reset-card {
    margin: 0;
    border-radius: 10px;
  }

  .reset-header {
    padding: 1.5rem;
  }

  .reset-body {
    padding: 1.5rem;
  }

  .reset-header h1 {
    font-size: 1.5rem;
  }
}
</style>
