<script>
export default {
  name: 'App',
  mounted() {
    // Restore authentication from storage on app load
    this.$store.dispatch('auth/restoreAuth');
  }
};
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped></style>
