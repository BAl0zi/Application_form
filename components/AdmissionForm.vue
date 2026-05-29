<template>
  <div :class="['form-shell', themeClass]">
    <div class="form-panel">
      <div class="form-sidebar">
        <img src="/logo.svg" alt="School Logo" class="school-logo" />
        <div class="sidebar-copy">
          <p class="eyebrow">Sign up</p>
          <h1>School Admission</h1>
          <p>Complete the application to join our school. Use the left navigation to jump to any section.</p>
        </div>
        <nav class="section-nav">
          <p class="nav-title">Form Sections</p>
          <ul>
            <li><button type="button" @click="scrollTo('section-1')">1. Basic Details</button></li>
            <li><button type="button" @click="scrollTo('section-2')">2. Medical Info</button></li>
            <li><button type="button" @click="scrollTo('section-3')">3. Parent / Guardian</button></li>
            <li><button type="button" @click="scrollTo('section-4')">4. Verification</button></li>
            <li><button type="button" @click="scrollTo('section-5')">5. Attachments</button></li>
          </ul>
        </nav>
      </div>

      <div class="form-card">
        <div class="form-header">
          <div>
            <p class="form-title">Basic Details</p>
            <h2>Apply for admission</h2>
          </div>
        </div>

        <form @submit.prevent="submit">
          <section id="section-1">
            <h3>Section 1: Basic Details</h3>
            <div class="row-group">
              <div class="row">
                <label>First Name</label>
                <input v-model="form.firstName" required />
              </div>
              <div class="row">
                <label>Middle Name</label>
                <input v-model="form.middleName" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Surname</label>
                <input v-model="form.surname" required />
              </div>
              <div class="row">
                <label>Date of Birth</label>
                <input type="date" v-model="form.dob" required />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>School Attended Before</label>
                <input v-model="form.previousSchool" />
              </div>
              <div class="row">
                <label>Citizenship</label>
                <input v-model="form.citizenship" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Religion</label>
                <input v-model="form.religion" />
              </div>
              <div class="row">
                <label>Denomination</label>
                <input v-model="form.denomination" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Parish</label>
                <input v-model="form.parish" />
              </div>
              <div class="row">
                <label>NEMIS Number</label>
                <input v-model="form.nemisNumber" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Assessment Number</label>
                <input v-model="form.assessmentNumber" />
              </div>
              <div class="row">
                <label>Grade Applied</label>
                <input type="number" min="1" max="9" v-model.number="form.gradeApplied" required />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Gender</label>
                <select v-model="form.gender" required>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="row">
                <label>Passport Photo</label>
                <button type="button" class="photo-btn" @click="selectPhoto">Choose Photo</button>
                <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoUpload" hidden />
              </div>
            </div>
            <div v-if="photoPreview" class="photo-preview-card">
              <img :src="photoPreview" alt="Passport photo preview" />
              <p>Passport-size photo selected.</p>
            </div>
          </section>

          <section id="section-2">
            <h3>Section 2: Relevant Medical Information</h3>
            <div class="row">
              <label>Medical Information</label>
              <textarea v-model="form.medicalInfo" placeholder="Provide any relevant medical details"></textarea>
            </div>
          </section>

          <section id="section-3">
            <h3>Section 3: Parent / Guardian Information</h3>
            <div class="row-group">
              <div class="row">
                <label>Name</label>
                <input v-model="form.parentName" required />
              </div>
              <div class="row">
                <label>Relationship</label>
                <select v-model="form.parentRelationship" required>
                  <option value="">Select relationship</option>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Guardian</option>
                </select>
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Profession</label>
                <input v-model="form.profession" />
              </div>
              <div class="row">
                <label>Designation</label>
                <input v-model="form.designation" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Company</label>
                <input v-model="form.company" />
              </div>
              <div class="row">
                <label>Town</label>
                <input v-model="form.town" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Country</label>
                <input v-model="form.country" />
              </div>
              <div class="row">
                <label>Mobile 1</label>
                <input type="tel" v-model="form.mobile1" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Mobile 2</label>
                <input type="tel" v-model="form.mobile2" />
              </div>
              <div class="row">
                <label>Email Address</label>
                <input type="email" v-model="form.email" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Signature</label>
                <input v-model="form.parentSignature" placeholder="Type full name as signature" />
              </div>
              <div class="row">
                <label>Date</label>
                <input type="date" v-model="form.parentSignatureDate" readonly />
              </div>
            </div>
            <div class="section-divider"></div>
            <h4>Family Residential Address</h4>
            <div class="row-group">
              <div class="row">
                <label>Estate / Apartment</label>
                <input v-model="form.estateApartment" />
              </div>
              <div class="row">
                <label>Location</label>
                <input v-model="form.location" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>City</label>
                <input v-model="form.city" />
              </div>
              <div class="row">
                <label>P.O. BOX</label>
                <input v-model="form.poBox" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>County</label>
                <input v-model="form.county" />
              </div>
            </div>
            <div class="section-divider"></div>
            <h4>Siblings</h4>
            <div v-for="(sibling, index) in form.siblings" :key="index" class="dynamic-row">
              <div class="row-group">
                <div class="row">
                  <label>Name</label>
                  <input v-model="sibling.name" />
                </div>
                <div class="row">
                  <label>Age</label>
                  <input type="number" min="1" v-model.number="sibling.age" />
                </div>
                <div class="row">
                  <label>Institution</label>
                  <input v-model="sibling.institution" placeholder="School / institution" />
                </div>
              </div>
              <button type="button" class="remove-btn" @click="removeSibling(index)">Remove sibling</button>
            </div>
            <button type="button" class="add-btn" @click="addSibling">Add sibling</button>
            <div class="section-divider"></div>
            <h4>Other Child Enrolled in Urafiki Carovana School</h4>
            <div v-for="(child, index) in form.enrolledChildren" :key="index" class="dynamic-row">
              <div class="row-group">
                <div class="row">
                  <label>Name</label>
                  <input v-model="child.name" />
                </div>
                <div class="row">
                  <label>Grade</label>
                  <input type="text" v-model="child.grade" />
                </div>
                <div class="row">
                  <label>Relation</label>
                  <input v-model="child.relation" />
                </div>
              </div>
              <button type="button" class="remove-btn" @click="removeEnrolledChild(index)">Remove child</button>
            </div>
            <button type="button" class="add-btn" @click="addEnrolledChild">Add enrolled child</button>
            <div class="section-divider"></div>
            <div class="row">
              <label>Reasons for applying to Urafiki Carovana School</label>
              <textarea v-model="form.reasonsForApplying" placeholder="Explain why you want to join"></textarea>
            </div>
            <div class="section-divider"></div>
            <h4>Area of Residence</h4>
            <div class="row-group">
              <div class="row">
                <label>Estate</label>
                <input v-model="form.areaEstate" />
              </div>
              <div class="row">
                <label>Road</label>
                <input v-model="form.areaRoad" />
              </div>
              <div class="row">
                <label>Plot Number</label>
                <input v-model="form.areaPlot" />
              </div>
            </div>
            <div class="row-group">
              <div class="row transport-row">
                <label>Does the child require school transport?</label>
                <div class="radio-group">
                  <label><input type="radio" value="Yes" v-model="form.transportNeeded" /> Yes</label>
                  <label><input type="radio" value="No" v-model="form.transportNeeded" /> No</label>
                </div>
              </div>
              <div class="row" v-if="form.transportNeeded === 'Yes'">
                <label>Pick up point</label>
                <input v-model="form.pickupPoint" placeholder="Transport pick up location" />
              </div>
            </div>
          </section>

          <section id="section-4">
            <h3>Verification</h3>
            <div class="row-group">
              <div class="row">
                <label>Parent/Guardian Name</label>
                <input v-model="form.verificationName" />
              </div>
              <div class="row">
                <label>Signature</label>
                <input v-model="form.verificationSignature" placeholder="Type full name as signature" />
              </div>
            </div>
            <div class="row-group">
              <div class="row">
                <label>Date of Application</label>
                <input type="date" v-model="form.applicationDate" readonly />
              </div>
            </div>
          </section>

          <section id="section-5">
            <h3>Attachments</h3>
            <div class="attachment-grid">
              <div class="attachment-item">
                <button type="button" class="attachment-btn" @click="selectAttachment('birthCertificate')">Attach Birth Certificate</button>
                <p>{{ attachmentNames.birthCertificate || 'No file selected' }}</p>
                <input ref="birthCertificateRef" type="file" accept="image/*,.pdf" @change="event => handleAttachmentUpload(event, 'birthCertificate')" hidden />
              </div>
              <div class="attachment-item">
                <button type="button" class="attachment-btn" @click="selectAttachment('academicReport')">Attach Academic Report</button>
                <p>{{ attachmentNames.academicReport || 'No file selected' }}</p>
                <input ref="academicReportRef" type="file" accept="image/*,.pdf" @change="event => handleAttachmentUpload(event, 'academicReport')" hidden />
              </div>
              <div class="attachment-item">
                <button type="button" class="attachment-btn" @click="selectAttachment('transferLetter')">Attach Clearance / Transfer Letter</button>
                <p>{{ attachmentNames.transferLetter || 'No file selected' }}</p>
                <input ref="transferLetterRef" type="file" accept="image/*,.pdf" @change="event => handleAttachmentUpload(event, 'transferLetter')" hidden />
              </div>
              <div class="attachment-item">
                <button type="button" class="attachment-btn" @click="selectAttachment('assessmentDocument')">Attach NEMIS/KNEC or KAPSEA Document</button>
                <p>{{ attachmentNames.assessmentDocument || 'No file selected' }}</p>
                <input ref="assessmentDocumentRef" type="file" accept="image/*,.pdf" @change="event => handleAttachmentUpload(event, 'assessmentDocument')" hidden />
              </div>
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
const today = new Date().toISOString().slice(0, 10)
const form = reactive({
  schoolType: props.schoolType,
  firstName: '',
  middleName: '',
  surname: '',
  dob: '',
  previousSchool: '',
  citizenship: '',
  religion: '',
  denomination: '',
  parish: '',
  nemisNumber: '',
  assessmentNumber: '',
  gradeApplied: '',
  gender: '',
  photoNotes: '',
  medicalInfo: '',
  parentName: '',
  parentRelationship: '',
  profession: '',
  designation: '',
  company: '',
  town: '',
  country: '',
  mobile1: '',
  mobile2: '',
  email: '',
  parentSignature: '',
  parentSignatureDate: today,
  estateApartment: '',
  location: '',
  city: '',
  poBox: '',
  county: '',
  siblings: [{ name: '', age: '', institution: '' }],
  enrolledChildren: [{ name: '', grade: '', relation: '' }],
  otherChildName: '',
  otherChildGrade: '',
  otherChildRelation: '',
  reasonsForApplying: '',
  areaEstate: '',
  areaRoad: '',
  areaPlot: '',
  transportNeeded: 'No',
  pickupPoint: '',
  verificationName: '',
  verificationSignature: '',
  applicationDate: today
})
const status = ref('')
const lastSubmitted = ref(null)
const photoPreview = ref('')
const photoInput = ref(null)
const birthCertificateRef = ref(null)
const academicReportRef = ref(null)
const transferLetterRef = ref(null)
const assessmentDocumentRef = ref(null)
const attachmentRefs = {
  birthCertificate: birthCertificateRef,
  academicReport: academicReportRef,
  transferLetter: transferLetterRef,
  assessmentDocument: assessmentDocumentRef
}
const attachmentNames = reactive({
  birthCertificate: '',
  academicReport: '',
  transferLetter: '',
  assessmentDocument: ''
})
const initialFormState = JSON.parse(JSON.stringify(form))
const initialAttachmentNames = JSON.parse(JSON.stringify(attachmentNames))
const isDirty = computed(() => {
  const changedField = Object.keys(form).some((key) => {
    if (key === 'schoolType') return false
    const current = form[key]
    const initial = initialFormState[key]
    if (Array.isArray(current)) {
      if (current.length !== initial.length) return true
      return current.some((item, index) => {
        const initialItem = initial[index] || {}
        return Object.keys(item).some((subKey) => String(item[subKey]).trim() !== String(initialItem[subKey] ?? '').trim())
      })
    }
    return String(current).trim() !== String(initial ?? '').trim()
  })

  const changedAttachments = Object.keys(attachmentNames).some((key) => {
    return String(attachmentNames[key]).trim() !== String(initialAttachmentNames[key] ?? '').trim()
  })

  return changedField || Boolean(photoPreview.value) || changedAttachments
})

watch(isDirty, (value) => {
  emit('dirty-change', value)
}, { immediate: true })

function resetForm() {
  for (const key of Object.keys(form)) {
    if (key === 'schoolType') continue
    if (Array.isArray(form[key])) {
      if (key === 'siblings') {
        form[key] = [{ name: '', age: '', institution: '' }]
      } else if (key === 'enrolledChildren') {
        form[key] = [{ name: '', grade: '', relation: '' }]
      } else {
        form[key] = []
      }
      continue
    }
    form[key] = key.includes('Date') ? today : ''
  }
  photoPreview.value = ''
  if (photoInput.value) {
    photoInput.value.value = null
  }
  Object.keys(attachmentNames).forEach((key) => {
    attachmentNames[key] = ''
  })
}

function selectPhoto() {
  photoInput.value?.click()
}

function scrollTo(sectionId) {
  const target = document.getElementById(sectionId)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    photoPreview.value = String(reader.result)
  }
  reader.readAsDataURL(file)
}

function selectAttachment(field) {
  attachmentRefs[field]?.value?.click()
}

function handleAttachmentUpload(event, field) {
  const file = event.target.files?.[0]
  if (!file) return
  attachmentNames[field] = file.name
}

function addSibling() {
  form.siblings.push({ name: '', age: '', institution: '' })
}

function removeSibling(index) {
  form.siblings.splice(index, 1)
}

function addEnrolledChild() {
  form.enrolledChildren.push({ name: '', grade: '', relation: '' })
}

function removeEnrolledChild(index) {
  form.enrolledChildren.splice(index, 1)
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

  if (payload.photoPreview) {
    const mimeType = payload.photoPreview.split(';')[0].split(':')[1] || 'image/jpeg'
    const imageFormat = mimeType.includes('png') ? 'PNG' : 'JPEG'
    doc.addImage(payload.photoPreview, imageFormat, margin, cursorY, 100, 120)
    cursorY += 140
  }

  const sections = [
    {
      title: 'Section 1: Basic Details',
      values: [
        ['First Name', payload.firstName],
        ['Middle Name', payload.middleName],
        ['Surname', payload.surname],
        ['Date of Birth', payload.dob],
        ['School Attended Before', payload.previousSchool],
        ['Citizenship', payload.citizenship],
        ['Religion', payload.religion],
        ['Denomination', payload.denomination],
        ['Parish', payload.parish],
        ['NEMIS Number', payload.nemisNumber],
        ['Assessment Number', payload.assessmentNumber],
        ['Grade Applied', payload.gradeApplied],
        ['Gender', payload.gender]
      ]
    },
    {
      title: 'Section 2: Medical Information',
      values: [
        ['Relevant Medical Information', payload.medicalInfo]
      ]
    },
    {
      title: 'Section 3: Parent / Guardian Information',
      values: [
        ['Name', payload.parentName],
        ['Relationship', payload.parentRelationship],
        ['Profession', payload.profession],
        ['Designation', payload.designation],
        ['Company', payload.company],
        ['Town', payload.town],
        ['Country', payload.country],
        ['Mobile 1', payload.mobile1],
        ['Mobile 2', payload.mobile2],
        ['Email Address', payload.email],
        ['Signature', payload.parentSignature],
        ['Signature Date', payload.parentSignatureDate],
        ['Estate / Apartment', payload.estateApartment],
        ['Location', payload.location],
        ['City', payload.city],
        ['P.O. BOX', payload.poBox],
        ['County', payload.county],
        ['Reasons for Applying', payload.reasonsForApplying],
        ['Area Estate', payload.areaEstate],
        ['Area Road', payload.areaRoad],
        ['Area Plot', payload.areaPlot],
        ['Transport Needed', payload.transportNeeded],
        ['Pick up Point', payload.transportNeeded === 'Yes' ? payload.pickupPoint : 'N/A']
      ]
    },
    {
      title: 'Verification',
      values: [
        ['Parent/Guardian Name', payload.verificationName],
        ['Signature', payload.verificationSignature],
        ['Date of Application', payload.applicationDate]
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

  if (Array.isArray(payload.siblings) && payload.siblings.length) {
    doc.setFont('helvetica', 'bold')
    doc.text('Siblings', margin, cursorY)
    cursorY += 18
    doc.setFont('helvetica', 'normal')
    payload.siblings.forEach((sibling, index) => {
      const text = `${index + 1}. ${sibling.name || 'N/A'} — Age: ${sibling.age || 'N/A'} — Institution: ${sibling.institution || 'N/A'}`
      const splitText = doc.splitTextToSize(text, 520)
      doc.text(splitText, margin, cursorY)
      cursorY += splitText.length * 14
      if (cursorY > 760) {
        doc.addPage()
        cursorY = 50
      }
    })
    cursorY += 10
  }

  if (Array.isArray(payload.enrolledChildren) && payload.enrolledChildren.length) {
    doc.setFont('helvetica', 'bold')
    doc.text('Other Children Enrolled at Urafiki Carovana School', margin, cursorY)
    cursorY += 18
    doc.setFont('helvetica', 'normal')
    payload.enrolledChildren.forEach((child, index) => {
      const text = `${index + 1}. ${child.name || 'N/A'} — Grade: ${child.grade || 'N/A'} — Relation: ${child.relation || 'N/A'}`
      const splitText = doc.splitTextToSize(text, 520)
      doc.text(splitText, margin, cursorY)
      cursorY += splitText.length * 14
      if (cursorY > 760) {
        doc.addPage()
        cursorY = 50
      }
    })
    cursorY += 10
  }

  const attachments = [
    ['Copy of Birth Certificate', payload.attachmentNames?.birthCertificate],
    ['Latest Academic Report', payload.attachmentNames?.academicReport],
    ['Clearance / Transfer Letter', payload.attachmentNames?.transferLetter],
    ['NEMIS/KNEC or KAPSEA Document', payload.attachmentNames?.assessmentDocument]
  ]

  doc.setFont('helvetica', 'bold')
  doc.text('Attachments', margin, cursorY)
  cursorY += 18
  doc.setFont('helvetica', 'normal')
  attachments.forEach(([label, value]) => {
    const text = `${label}: ${value || 'Not attached'}`
    const splitText = doc.splitTextToSize(text, 520)
    doc.text(splitText, margin, cursorY)
    cursorY += splitText.length * 14
    if (cursorY > 760) {
      doc.addPage()
      cursorY = 50
    }
  })
  cursorY += 10

  const officialUse = [
    ['Application Received on', '___________________________'],
    ['Reference Number', '___________________________'],
    ['Admission Number', '___________________________']
  ]

  doc.setFont('helvetica', 'bold')
  doc.text('For official use only', margin, cursorY)
  cursorY += 18
  doc.setFont('helvetica', 'normal')
  officialUse.forEach(([label, value]) => {
    const text = `${label}: ${value}`
    const splitText = doc.splitTextToSize(text, 520)
    doc.text(splitText, margin, cursorY)
    cursorY += splitText.length * 14
    if (cursorY > 760) {
      doc.addPage()
      cursorY = 50
    }
  })

  const fileName = `application-${payload.schoolType.toLowerCase()}-${payload.firstName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'form'}-${payload.surname.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'student'}.pdf`
  doc.save(fileName)
}

async function submit(){
  status.value = 'Submitting...'
  try{
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        attachmentNames: JSON.parse(JSON.stringify(attachmentNames))
      })
    })
    const data = await res.json()
    if(data.success){
      status.value = 'Application submitted successfully. You can download the filled form as PDF below.'
      lastSubmitted.value = {
        ...JSON.parse(JSON.stringify(form)),
        photoPreview: photoPreview.value,
        attachmentNames: JSON.parse(JSON.stringify(attachmentNames))
      }
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
.form-panel{max-width:1240px;width:100%;margin:0 auto;display:grid;grid-template-columns:minmax(320px,420px) 1fr;gap:32px;align-items:start;position:relative}
.form-sidebar{background:linear-gradient(180deg,#ff9a20 0%,#ffb571 100%);border-radius:36px;padding:32px 28px;display:flex;flex-direction:column;gap:24px;box-shadow:0 40px 90px rgba(255,133,0,.12);min-width:0;position:sticky;top:24px;align-self:flex-start;overflow:visible;z-index:1;width:100%;max-width:420px}
.form-shell.junior-theme .form-sidebar{background:linear-gradient(180deg,#6f243c 0%,#8d4b6f 100%);box-shadow:0 40px 90px rgba(111,36,60,.16)}
.school-logo{width:68px;height:68px;border-radius:18px;background:rgba(255,255,255,.22);padding:14px;}
.form-shell.junior-theme .school-logo{background:rgba(255,255,255,.18);}
.sidebar-copy{color:#fff}
.form-shell.junior-theme .sidebar-copy{color:#f9f0fb}
.eyebrow{margin:0 0 12px;font-size:.9rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;opacity:.95}
.form-sidebar h1{margin:0 0 16px;font-size:2.4rem;line-height:1.05}
.form-sidebar p{margin:0;font-size:1rem;line-height:1.8;opacity:.95}
.form-card{background:#fff;border-radius:36px;padding:32px 34px 28px;box-shadow:0 40px 90px rgba(97,55,12,.08);border:1px solid rgba(255,154,0,.16);overflow:hidden;min-width:0}
.form-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:28px}
.form-title{margin:0 0 6px;font-size:1rem;font-weight:700;color:#ff7c00}
.form-header h2{margin:0;font-size:2rem;color:#231b11;line-height:1.1;max-width:640px}
.form-shell.junior-theme .form-title{color:#e6bbc8}
.form-shell.junior-theme .form-header h2{color:#3f2232}
.photo-btn{border:none;display:inline-flex;align-items:center;gap:10px;padding:14px 18px;border-radius:18px;background:rgba(255,133,0,.12);color:#ff6d04;font-weight:700;cursor:pointer;transition:background .2s ease}
.photo-btn span{display:inline-flex;width:28px;height:28px;border-radius:50%;align-items:center;justify-content:center;background:#fff;color:#ff6d04;font-size:1.1rem}
.form-shell.junior-theme .photo-btn{background:rgba(255,255,255,.18);color:#ffd4e6}
.photo-area{display:flex;flex-direction:column;align-items:flex-end;gap:10px;max-width:260px;text-align:right}
.photo-note{margin:0;font-size:.9rem;color:#5e4b35;line-height:1.4;max-width:260px}
.photo-preview{display:flex;flex-direction:column;align-items:flex-end;gap:8px;background:rgba(255,255,255,.95);border:1px solid #f5d2ab;border-radius:18px;padding:12px;max-width:260px}
.photo-preview img{width:100%;height:auto;border-radius:14px;object-fit:cover}
.photo-preview p{margin:0;font-size:.95rem;color:#5e4b35}
.photo-preview-card{display:flex;flex-direction:column;gap:10px;background:rgba(255,255,255,.95);border:1px solid #f5d2ab;border-radius:18px;padding:14px;max-width:320px}
.photo-preview-card img{width:100%;height:auto;border-radius:14px;object-fit:cover}
.photo-preview-card p{margin:0;color:#5e4b35;font-size:.95rem}
.section-divider{height:1px;background:rgba(97,55,12,.12);border:none;margin:24px 0}
.dynamic-row{padding:16px 0;border-bottom:1px solid rgba(97,55,12,.1)}
.add-btn,.remove-btn,.attachment-btn{padding:12px 16px;border-radius:16px;border:none;background:#ffbc6a;color:#2b1f0f;font-weight:700;cursor:pointer;transition:background .2s ease}
.add-btn:hover,.remove-btn:hover,.attachment-btn:hover{background:#ff9b23}
.attachment-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.attachment-item{background:rgba(255,255,255,.95);border:1px solid #f5d2ab;border-radius:18px;padding:18px;display:flex;flex-direction:column;gap:10px}
.section-nav{background:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.8);border-radius:24px;padding:20px}
.nav-title{margin:0 0 12px;font-size:.95rem;font-weight:700;color:#2b1f0f;letter-spacing:.08em}
.section-nav ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
.section-nav button{width:100%;text-align:left;padding:10px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.7);background:rgba(255,255,255,.72);color:#2b1f0f;cursor:pointer;transition:background .2s ease}
.section-nav button:hover{background:#fff}
.radio-group{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
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
@media (max-width: 1080px){.form-panel{grid-template-columns:1fr}.form-shell{padding:32px 16px}.form-header{flex-direction:column;align-items:flex-start}.form-sidebar{position:sticky;top:24px;width:auto;margin-left:0}.form-card{margin-left:0}}
@media (max-width: 760px){.row-group{grid-template-columns:1fr}.form-sidebar{padding:24px}.form-card{padding:24px}.form-shell{padding:20px 16px}} 
@media (max-width: 560px){.form-shell{padding:16px 12px}.form-card{padding:20px}.form-header h2{font-size:1.6rem}.progress-card{padding:18px}.sidebar-copy p{font-size:.95rem}.actions{justify-content:center}button{width:100%;min-width:0}.photo-btn{width:100%;justify-content:center}.row-group{gap:14px}}
</style>
