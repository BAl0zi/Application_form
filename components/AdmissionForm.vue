<template>
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
    </div>

    <div class="actions secondary">
      <button type="button" v-if="lastSubmitted" @click="downloadForm" class="download-btn">Download PDF</button>
    </div>

    <p v-if="status" class="status">{{ status }}</p>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { jsPDF } from 'jspdf'
const props = defineProps({ schoolType: { type: String, default: 'Primary' } })
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
form{display:flex;flex-direction:column;gap:20px;font-family:sans-serif}
section{border:1px solid #e0e0e0;padding:18px;border-radius:10px;background:#fafafa}
section h3{margin:0 0 14px;font-size:1.1rem;color:#1a237e}
.row-group{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.row{display:flex;flex-direction:column}
label{font-weight:600;margin-bottom:6px;color:#333}
input,textarea,select{padding:10px;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;font-family:inherit}
textarea{min-height:90px;resize:vertical}
.actions{display:flex;justify-content:flex-end;margin-top:8px}
button{background:#1976d2;color:#fff;padding:12px 18px;border:none;border-radius:8px;cursor:pointer}
button:hover{background:#125aa1}
.download-btn{background:#43a047}
.download-btn:hover{background:#388e3c}
.status{margin-top:10px;color:green;font-weight:600}
@media (max-width: 768px){.row-group{grid-template-columns:1fr}}
</style>
