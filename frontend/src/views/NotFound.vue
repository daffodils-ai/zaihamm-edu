<template>
  <div class="not-found">
    <div class="container">
      <div class="row align-items-center min-vh-100">
        <div class="col-md-6 text-center">
          <div class="display-1 fw-bold text-danger">404</div>
          <h1 class="mb-3">Page Not Found</h1>
          <p class="lead text-muted mb-4">
            Sorry, the page you're looking for doesn't exist.
          </p>
          <router-link to="/" class="btn btn-primary btn-lg">
            Back to Home
          </router-link>
        </div>
        <div class="col-md-6 text-center">
          <div class="display-1">🔍</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style scoped>
.not-found {
  background-color: #2c3e50;
  min-height: 100vh;
  display: flex;
  align-items: center;
  color: white;
}

.not-found .display-1 {
  font-size: 6rem;
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
</style>
