<template>
  <div class="page">
    <div class="page-header">
      <h2>Primary School Application</h2>
      <NuxtLink to="/" class="back-link">Back to main page</NuxtLink>
    </div>
    <AdmissionForm schoolType="Primary" />
  </div>
</template>

<script setup>
import AdmissionForm from '~/components/AdmissionForm.vue'
</script>

<style scoped>
.page{max-width:1100px;width:100%;margin:24px auto;padding:16px;box-sizing:border-box}
.page-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;flex-wrap:wrap}
.back-link{color:#1976d2;text-decoration:none;font-weight:600}
.back-link:hover{text-decoration:underline}
</style>
