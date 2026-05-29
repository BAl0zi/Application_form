<template>
  <div :class="['form-shell', themeClass]">
    <div class="form-panel">
      <div class="form-sidebar">
        <img src="/logo.svg" alt="School Logo" class="school-logo" />
        <div class="sidebar-copy">
          <p class="eyebrow">Sign up</p>
          <h1>School Admission</h1>
          <p>Complete the application to join our school. Use the steps indicator to track your progress.</p>
        </div>
        <div class="progress-card">
          <div class="step active">1</div>
          <div class="step">2</div>
          <div class="step">3</div>
          <p>Basic Details · Contact Details · Verification</p>
        </div>
      </div>

      <div class="form-card">
        <div class="form-header">
          <div>
            <p class="form-title">Basic Details</p>
            <h2>Apply for admission</h2>
          </div>
          <button type="button" class="photo-btn">
            <span>+</span>
            Add Photo
          </button>
        </div>

        <form @submit.prevent="submit">
          <section>
            <h3>Student Information</h3>
            <div class="row-group">
              <div class="row">
                <label>Child Full Name</label>
                <input v-model="form.childName" required />
              </div>
              <div class="row">
                <label>Gender</label>
                <select v-model="form.childGender" required>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Date of Birth</label>
                <input type="date" v-model="form.dob" required />
              </div>
              <div class="row">
                <label>Birth Certificate / ID No.</label>
                <input v-model="form.birthCertificate" />
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Applying For Class / Year</label>
                <input v-model="form.applyingClass" required />
              </div>
              <div class="row">
                <label>Current Class</label>
                <input v-model="form.currentClass" />
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Previous School (if any)</label>
                <input v-model="form.previousSchool" />
              </div>
              <div class="row">
                <label>Preferred Entry Term</label>
                <select v-model="form.preferredTerm">
                  <option value="">Select term</option>
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Nationality</label>
                <input v-model="form.nationality" />
              </div>
              <div class="row">
                <label>Home Language</label>
                <input v-model="form.homeLanguage" />
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Religion</label>
                <input v-model="form.religion" />
              </div>
              <div class="row">
                <label>Medical Conditions / Allergies</label>
                <input v-model="form.medicalConditions" />
              </div>
            </div>
          </section>

          <section>
            <h3>Parent / Guardian Information</h3>
            <div class="row-group">
              <div class="row">
                <label>Parent / Guardian Name</label>
                <input v-model="form.parentName" required />
              </div>
              <div class="row">
                <label>Relationship to Child</label>
                <input v-model="form.parentRelationship" required />
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Occupation</label>
                <input v-model="form.parentOccupation" />
              </div>
              <div class="row">
                <label>Email Address</label>
                <input type="email" v-model="form.email" required />
              </div>
            </div>

            <div class="row-group">
              <div class="row">
                <label>Contact Phone</label>
                <input type="tel" v-model="form.phone" required />
              </div>
              <div class="row">
                <label>Home Address</label>
                <input v-model="form.address" required />
              </div>
            </div>
          </section>

          <section>
            <h3>Emergency Contact</h3>
            <div class="row-group">
              <div class="row">
                <label>Emergency Contact Name</label>
                <input v-model="form.emergencyContactName" required />
              </div>
              <div class="row">
                <label>Relationship</label>
                <input v-model="form.emergencyContactRelation" required />
              </div>
            </div>

            <div class="row">
              <label>Emergency Contact Phone</label>
              <input type="tel" v-model="form.emergencyContactPhone" required />
            </div>
          </section>

          <section>
            <h3>Additional Information</h3>
            <div class="row">
              <label>Are there siblings at the school?</label>
              <input v-model="form.siblingsAtSchool" placeholder="Names and class if applicable" />
            </div>
            <div class="row">
              <label>Special Needs / Learning Support</label>
              <textarea v-model="form.specialNeeds" placeholder="Include any learning support or accommodations"></textarea>
            </div>
            <div class="row">
              <label>Any other information</label>
              <textarea v-model="form.notes" placeholder="Anything else the school should know"></textarea>
            </div>
          </section>

          <div class="actions">
            <button type="submit">Submit Application</button>
            <button type="button" v-if="lastSubmitted" @click="downloadForm" class="download-btn">Download PDF</button>
          </div>

          <p v-if="status" class="status">{{ status }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { jsPDF } from 'jspdf'
const emit = defineEmits(['dirty-change'])
const props = defineProps({ schoolType: { type: String, default: 'Primary' } })
const themeClass = computed(() => props.schoolType === 'Junior' ? 'junior-theme' : 'primary-theme')
const form = reactive({
  schoolType: props.schoolType,
  childName: '',
  childGender: '',
  dob: '',
  birthCertificate: '',
  applyingClass: '',
  currentClass: '',
  previousSchool: '',
  preferredTerm: '',
  nationality: '',
  homeLanguage: '',
  religion: '',
  medicalConditions: '',
  parentName: '',
  parentRelationship: '',
  parentOccupation: '',
  address: '',
  phone: '',
  email: '',
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactPhone: '',
  siblingsAtSchool: '',
  specialNeeds: '',
  notes: ''
})
const status = ref('')
const lastSubmitted = ref(null)
const isDirty = computed(() => {
  return Object.keys(form).some((key) => {
    if (key === 'schoolType') return false
    return String(form[key]).trim() !== ''
  })
})

watch(isDirty, (value) => {
  emit('dirty-change', value)
}, { immediate: true })

function resetForm() {
  for (const key of Object.keys(form)) {
    if (key !== 'schoolType') {
      form[key] = ''
    }
  }
}

function downloadForm() {
  if (!lastSubmitted.value) return
  const payload = lastSubmitted.value
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  let cursorY = 50

  doc.setFontSize(16)
  doc.text('School Admission Application', margin, cursorY)
  cursorY += 28

  const sections = [
    {
      title: 'Student Information',
      values: [
        ['School Type', payload.schoolType],
        ['Child Full Name', payload.childName],
        ['Gender', payload.childGender],
        ['Date of Birth', payload.dob],
        ['Birth Certificate / ID No.', payload.birthCertificate],
        ['Applying For Class / Year', payload.applyingClass],
        ['Current Class', payload.currentClass],
        ['Previous School', payload.previousSchool],
        ['Preferred Entry Term', payload.preferredTerm],
        ['Nationality', payload.nationality],
        ['Home Language', payload.homeLanguage],
        ['Religion', payload.religion],
        ['Medical Conditions / Allergies', payload.medicalConditions]
      ]
    },
    {
      title: 'Parent / Guardian Information',
      values: [
        ['Parent / Guardian Name', payload.parentName],
        ['Relationship to Child', payload.parentRelationship],
        ['Occupation', payload.parentOccupation],
        ['Email Address', payload.email],
        ['Contact Phone', payload.phone],
        ['Home Address', payload.address]
      ]
    },
    {
      title: 'Emergency Contact',
      values: [
        ['Emergency Contact Name', payload.emergencyContactName],
        ['Relationship', payload.emergencyContactRelation],
        ['Emergency Contact Phone', payload.emergencyContactPhone]
      ]
    },
    {
      title: 'Additional Information',
      values: [
        ['Siblings at School', payload.siblingsAtSchool],
        ['Special Needs / Learning Support', payload.specialNeeds],
        ['Any Other Information', payload.notes]
      ]
    }
  ]

  doc.setFontSize(12)

  sections.forEach((section) => {
    doc.setFont('helvetica', 'bold')
    doc.text(section.title, margin, cursorY)
    cursorY += 18
    doc.setFont('helvetica', 'normal')

    section.values.forEach(([label, value]) => {
      const text = `${label}: ${value || 'N/A'}`
      const splitText = doc.splitTextToSize(text, 520)
      doc.text(splitText, margin, cursorY)
      cursorY += splitText.length * 14
      if (cursorY > 760) {
        doc.addPage()
        cursorY = 50
      }
    })

    cursorY += 10
  })

  const fileName = `application-${payload.schoolType.toLowerCase()}-${payload.childName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'form'}.pdf`
  doc.save(fileName)
}

async function submit(){
  status.value = 'Submitting...'
  try{
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if(data.success){
      status.value = 'Application submitted successfully. You can download the filled form as PDF below.'
      lastSubmitted.value = JSON.parse(JSON.stringify(form))
      resetForm()
    } else {
      status.value = data.message || 'Submission failed.'
    }
  }catch(e){
    status.value = 'Error submitting application.'
  }
}
</script>

<style scoped>
.form-shell{min-height:100vh;width:100%;padding:40px 24px;background:linear-gradient(180deg,#fff6eb 0%,#fff 55%,#fff5eb 100%);display:flex;justify-content:center;align-items:flex-start;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;color:#2f2619;box-sizing:border-box;overflow-x:hidden}
.form-shell.primary-theme{background:linear-gradient(180deg,#fff6eb 0%,#fff 55%,#fff5eb 100%)}
.form-shell.junior-theme{background:linear-gradient(180deg,#f7eef4 0%,#e7ecff 55%,#f3e5f1 100%)}
.form-panel{max-width:1240px;width:100%;display:grid;grid-template-columns:420px 1fr;gap:32px}
.form-sidebar{background:linear-gradient(180deg,#ff9a20 0%,#ffb571 100%);border-radius:36px;padding:32px 28px;display:flex;flex-direction:column;gap:24px;box-shadow:0 40px 90px rgba(255,133,0,.12);min-width:0}
.form-shell.junior-theme .form-sidebar{background:linear-gradient(180deg,#6f243c 0%,#8d4b6f 100%);box-shadow:0 40px 90px rgba(111,36,60,.16)}
.school-logo{width:68px;height:68px;border-radius:18px;background:rgba(255,255,255,.22);padding:14px;}
.form-shell.junior-theme .school-logo{background:rgba(255,255,255,.18);}
.sidebar-copy{color:#fff}
.form-shell.junior-theme .sidebar-copy{color:#f9f0fb}
.eyebrow{margin:0 0 12px;font-size:.9rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;opacity:.95}
.form-sidebar h1{margin:0 0 16px;font-size:2.4rem;line-height:1.05}
.form-sidebar p{margin:0;font-size:1rem;line-height:1.8;opacity:.95}
.progress-card{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);border-radius:24px;padding:22px;display:flex;flex-direction:column;gap:18px}
.progress-card p{margin:0;color:rgba(255,255,255,.92);font-size:.95rem;line-height:1.6}
.step{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;background:rgba(255,255,255,.28)}
.step.active{background:#fff;color:#ff6e00;box-shadow:0 18px 30px rgba(255,133,0,.24)}
.form-card{background:#fff;border-radius:36px;padding:32px 34px 28px;box-shadow:0 40px 90px rgba(97,55,12,.08);border:1px solid rgba(255,154,0,.16);overflow:hidden}
.form-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:28px}
.form-title{margin:0 0 6px;font-size:1rem;font-weight:700;color:#ff7c00}
.form-header h2{margin:0;font-size:2rem;color:#231b11;line-height:1.1;max-width:640px}
.form-shell.junior-theme .form-title{color:#e6bbc8}
.form-shell.junior-theme .form-header h2{color:#3f2232}
.photo-btn{border:none;display:inline-flex;align-items:center;gap:10px;padding:14px 18px;border-radius:18px;background:rgba(255,133,0,.12);color:#ff6d04;font-weight:700;cursor:pointer;transition:background .2s ease}
.photo-btn span{display:inline-flex;width:28px;height:28px;border-radius:50%;align-items:center;justify-content:center;background:#fff;color:#ff6d04;font-size:1.1rem}
.form-shell.junior-theme .photo-btn{background:rgba(255,255,255,.18);color:#ffd4e6}
form{display:flex;flex-direction:column;gap:24px}
section{border:1px solid #fde2c2;padding:26px;border-radius:24px;background:rgba(255,242,228,.95)}
.form-shell.junior-theme section{border-color:#d5bac7;background:rgba(243,225,235,.92)}
section h3{margin:0 0 18px;font-size:1.05rem;color:#603913}
.form-shell.junior-theme section h3{color:#5f2641}
.row-group{display:grid;grid-template-columns:1fr 1fr;gap:20px;min-width:0}
.row{display:flex;flex-direction:column}
label{font-weight:700;margin-bottom:10px;color:#5e4b35}
.form-shell.junior-theme label{color:#5e3b4c}
input,textarea,select{padding:14px 16px;border:1px solid #f5d2ab;border-radius:16px;font-size:1rem;font-family:inherit;background:#fff;outline:none;transition:border-color .2s ease,box-shadow .2s ease}
.form-shell.junior-theme input, .form-shell.junior-theme textarea, .form-shell.junior-theme select{background:#fff7fb}
input:focus,textarea:focus,select:focus{border-color:#ff9d39;box-shadow:0 0 0 4px rgba(255,154,0,.14)}
.form-shell.junior-theme input:focus,.form-shell.junior-theme textarea:focus,.form-shell.junior-theme select:focus{border-color:#7a1d3b;box-shadow:0 0 0 4px rgba(82,36,58,.16)}
textarea{min-height:110px;resize:vertical}
.actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:16px;margin-top:8px}
button{padding:14px 22px;border:none;border-radius:18px;font-weight:700;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;min-width:140px}
button[type='submit']{background:#ff7c00;color:#fff;box-shadow:0 18px 32px rgba(255,124,0,.25)}
button[type='submit']:hover{transform:translateY(-1px)}
.form-shell.junior-theme button[type='submit']{background:#7a1a2c;box-shadow:0 18px 32px rgba(103,30,44,.25)}
.form-shell.junior-theme button[type='submit']:hover{transform:translateY(-1px)}
.download-btn{background:#3f5d99;color:#fff;}
.download-btn:hover{background:#334e85}
.form-shell.junior-theme .download-btn{background:#4f7cac}
.form-shell.junior-theme .download-btn:hover{background:#3f6b96}
.status{margin-top:10px;color:#1f5d28;font-weight:700}
.form-shell.junior-theme .status{color:#5f2845}
@media (max-width: 1080px){.form-panel{grid-template-columns:1fr}.form-shell{padding:32px 16px}.form-header{flex-direction:column;align-items:flex-start}} 
@media (max-width: 760px){.row-group{grid-template-columns:1fr}.form-sidebar{padding:24px}.form-card{padding:24px}.form-shell{padding:20px 16px}} 
@media (max-width: 560px){.form-shell{padding:16px 12px}.form-card{padding:20px}.form-header h2{font-size:1.6rem}.progress-card{padding:18px}.sidebar-copy p{font-size:.95rem}.actions{justify-content:center}button{width:100%;min-width:0}.photo-btn{width:100%;justify-content:center}.row-group{gap:14px}}
</style>
