<template>
  <div class="page">
    <h1>{{ title }}</h1>
    <p class="text-muted">This page is under development</p>
  </div>
</template>

<script>
export default {
  name: 'StubPage',
  props: {
    title: { type: String, default: 'Page' }
  }
};
</script>

<style scoped>
.page { padding: 2rem; }
</style>
