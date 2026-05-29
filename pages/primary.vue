<template>
  <div class="page">
    <div class="page-header">
      <h2>Primary School Application</h2>
      <button type="button" class="back-button" @click="goBack">Back to main page</button>
    </div>
    <AdmissionForm schoolType="Primary" @dirty-change="handleDirtyChange" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdmissionForm from '~/components/AdmissionForm.vue'

const router = useRouter()
const hasUnsavedChanges = ref(false)

function handleDirtyChange(value) {
  hasUnsavedChanges.value = value
}

function goBack() {
  if (hasUnsavedChanges.value) {
    const answer = confirm('You have unsaved changes. Discard changes and go back to the main page, or Cancel to continue editing?')
    if (!answer) return
  }
  router.push('/')
}
</script>

<style scoped>
.page{max-width:1100px;width:100%;margin:24px auto;padding:16px;box-sizing:border-box}
.page-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;flex-wrap:wrap}
.back-button{padding:12px 18px;border-radius:999px;border:1px solid rgba(25,118,210,.2);background:#1976d2;color:#fff;font-weight:600;cursor:pointer;transition:background .2s ease,transform .2s ease}
.back-button:hover{background:#115dc2;transform:translateY(-1px)}
</style>
