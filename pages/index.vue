<template>
  <div class="container">
    <h1>School Admission Application</h1>
    <p>Select the application type:</p>
    <div class="links">
      <NuxtLink to="/primary" class="btn">Primary School Application</NuxtLink>
      <NuxtLink to="/junior" class="btn">Junior School Application</NuxtLink>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container{max-width:720px;margin:40px auto;font-family:sans-serif}
.links{display:flex;gap:12px;margin-top:16px}
.btn{padding:10px 16px;background:#1976d2;color:#fff;border-radius:6px;text-decoration:none}
</style>
