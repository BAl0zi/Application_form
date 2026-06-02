<template>
  <div class="submitted-shell">
    <div class="message-card">
      <h1>✓ Application Submitted Successfully</h1>
      <p class="success-message">
        Your admission form has been submitted. Download your completed application document below to keep for your records.
      </p>
      
      <div class="actions">
        <button type="button" class="download-btn" @click="downloadDocument" :disabled="!application || loading">
          {{ loading ? 'Preparing document...' : 'Download Application' }}
        </button>
        <NuxtLink to="/" class="home-btn">Back to Home</NuxtLink>
      </div>
      <p v-if="uploadMessage" class="notice">{{ uploadMessage }}</p>
      <p v-if="!application" class="notice error">
        No submission data is available. Please return to the form and submit again.
      </p>
    </div>

    <div class="instructions-container">
      <div class="instruction-section">
        <h2>Next Steps: Submit Required Documents</h2>
        <p class="intro-text">Print the downloaded application and submit it to the School Office along with the following documents:</p>
        
        <div class="documents-list">
          <div class="document-item">
            <span class="icon">📷</span>
            <div>
              <strong>2 Passport-size Photos</strong>
              <p>Recent passport-size photos of the learner</p>
            </div>
          </div>
          <div class="document-item">
            <span class="icon">📋</span>
            <div>
              <strong>Birth Certificate</strong>
              <p>Copy of birth certificate</p>
            </div>
          </div>
          <div class="document-item">
            <span class="icon">📊</span>
            <div>
              <strong>Academic Report</strong>
              <p>Latest academic report</p>
            </div>
          </div>
          <div class="document-item">
            <span class="icon">📄</span>
            <div>
              <strong>Transfer Letter (if applicable)</strong>
              <p>Clearance or Transfer Letter from previous school</p>
            </div>
          </div>
          <div class="document-item">
            <span class="icon">🏆</span>
            <div>
              <strong>Assessment Documents</strong>
              <p>NEMIS/KNEC Assessment Number (Grade 3-9) or KAPSEA Certificate (JSS)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="instruction-section timeline">
        <h2>Timeline & Communication</h2>
        <div class="timeline-item">
          <div class="timeline-marker">1 Week</div>
          <div class="timeline-content">
            <strong>Confirmation Email</strong>
            <p>You'll receive an email confirming receipt with your Application Reference Number.</p>
            <small>📧 If no email within 1 week, contact the school office.</small>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">2 Weeks</div>
          <div class="timeline-content">
            <strong>Application Outcome & Assessment Date</strong>
            <p>Receive email with application outcome and scheduled assessment date.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">7 Days</div>
          <div class="timeline-content">
            <strong>Pay Assessment Fee</strong>
            <p>Complete payment to secure your assessment slot. Failure to pay will result in application cancellation.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">Post Assessment</div>
          <div class="timeline-content">
            <strong>Final Steps for Successful Candidates</strong>
            <p>Pay Admission & Commitment Fee within 14 days to complete registration. Then receive your Admission Number and instructions to pick up admission documents.</p>
          </div>
        </div>
      </div>

      <div class="instruction-section deadline">
        <h2>⏰ Application Deadline</h2>
        <p class="deadline-text">Complete applications must be submitted by <strong>Wednesday, 1st October 2026</strong></p>
      </div>

      <div class="instruction-section important-notes">
        <h2>Important Notes</h2>
        <div class="note-item">
          <strong>Note 1:</strong> The school may cancel admission for learners with outstanding fee balances from Emanuela Mazzola School or Urafiki Carovana School.
        </div>
        <div class="note-item">
          <strong>Note 2:</strong> If you haven't received communication within 1 week of submitting, please follow up with the school office using the contact details provided.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jsPDF } from 'jspdf'

const application = ref(null)
const loading = ref(false)
const uploadMessage = ref('')

onMounted(() => {
  const stored = localStorage.getItem('submittedApplicationData')
  if (stored) {
    application.value = JSON.parse(stored)
  }
})

function getApplicationFilename(payload) {
  const firstName = String(payload.firstName || 'applicant').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const surname = String(payload.surname || 'student').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const schoolType = String(payload.schoolType || 'application').toLowerCase()
  return `application-${schoolType}-${firstName}-${surname}.pdf`
}

async function downloadDocument() {
  if (!application.value) return
  loading.value = true

  const payload = application.value
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  let cursorY = 50

  uploadMessage.value = ''
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
      values: [['Relevant Medical Information', payload.medicalInfo]]
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

  const fileName = getApplicationFilename(payload)
  const dataUri = doc.output('datauristring')
  const base64Data = dataUri.split(',')[1]
  const driveResponse = await uploadPdfToDrive(fileName, base64Data, 'application/pdf')

  if (driveResponse.success) {
    uploadMessage.value = 'Saved to Google Drive successfully.'
  } else {
    uploadMessage.value = `Google Drive upload failed: ${driveResponse.message}`
  }

  doc.save(fileName)
  loading.value = false
}

async function uploadPdfToDrive(fileName, base64Data, mimeType) {
  try {
    const response = await fetch('/api/drive-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileData: base64Data, mimeType, schoolType: application.value?.schoolType })
    })
    return await response.json()
  } catch (error) {
    return { success: false, message: error?.message || 'Upload request failed.' }
  }
}
</script>

<style scoped>
.submitted-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(180deg, #fff6eb 0%, #fff 55%, #ffefd8 100%);
  box-sizing: border-box;
}

.message-card {
  max-width: 720px;
  width: 100%;
  background: #fff;
  border-radius: 32px;
  padding: 40px 36px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 154, 0, 0.16);
}

.message-card h1 {
  margin: 0 0 18px;
  font-size: clamp(2rem, 2.5vw, 2.8rem);
  color: #231b11;
}

.message-card p {
  margin: 0 0 28px;
  color: #5e4b35;
  line-height: 1.8;
  font-size: 1rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

button,
.home-btn {
  padding: 14px 22px;
  border-radius: 18px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.download-btn {
  background: #ff7c00;
  color: #fff;
  min-width: 180px;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 32px rgba(255, 124, 0, 0.25);
}

.home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #2b1f0f;
  border: 1px solid rgba(43, 31, 15, 0.12);
}

.notice {
  margin-top: 24px;
  color: #8a6b3a;
  font-weight: 700;
}

.notice.error {
  color: #c41c3b;
}

.success-message {
  color: #1f5d28 !important;
  font-weight: 600;
}

.instructions-container {
  max-width: 1200px;
  margin: 60px auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding: 0 24px;
}

.instruction-section {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 154, 0, 0.12);
}

.instruction-section h2 {
  margin: 0 0 24px;
  font-size: 1.6rem;
  color: #231b11;
  border-bottom: 3px solid #ff7c00;
  padding-bottom: 12px;
}

.intro-text {
  color: #5e4b35;
  line-height: 1.8;
  margin-bottom: 20px;
}

.documents-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.document-item {
  display: flex;
  gap: 16px;
  padding: 18px;
  background: rgba(255, 245, 230, 0.8);
  border-radius: 16px;
  border-left: 4px solid #ff7c00;
}

.document-item .icon {
  font-size: 28px;
  min-width: 40px;
}

.document-item strong {
  color: #231b11;
  font-size: 1.05rem;
}

.document-item p {
  margin: 6px 0 0;
  color: #5e4b35;
  font-size: 0.95rem;
}

.timeline {
  padding: 28px;
}

.timeline-item {
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255, 154, 0, 0.2);
}

.timeline-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.timeline-marker {
  flex-shrink: 0;
  width: 100px;
  background: linear-gradient(135deg, #ff7c00, #ffb571);
  color: #fff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.timeline-content strong {
  color: #231b11;
  font-size: 1.1rem;
}

.timeline-content p {
  margin: 8px 0;
  color: #5e4b35;
  line-height: 1.6;
}

.timeline-content small {
  display: block;
  margin-top: 8px;
  color: #8a6b3a;
  font-style: italic;
}

.deadline {
  background: linear-gradient(135deg, rgba(255, 124, 0, 0.05), rgba(255, 181, 113, 0.05));
  border: 2px solid #ff7c00;
}

.deadline h2 {
  color: #ff6d04;
  border-bottom-color: #ffb571;
}

.deadline-text {
  font-size: 1.2rem;
  color: #231b11;
  margin: 0;
}

.deadline-text strong {
  color: #ff6d04;
  font-size: 1.3rem;
}

.important-notes {
  background: rgba(255, 107, 53, 0.04);
  border-left: 5px solid #ff6d35;
}

.note-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  margin-bottom: 12px;
  color: #5e4b35;
  line-height: 1.7;
}

.note-item:last-child {
  margin-bottom: 0;
}

.note-item strong {
  color: #231b11;
}

@media (max-width: 760px) {
  .message-card {
    padding: 28px 22px;
  }

  .actions {
    flex-direction: column;
  }

  button,
  .home-btn {
    width: 100%;
  }

  .instructions-container {
    margin: 40px auto;
    gap: 20px;
  }

  .instruction-section {
    padding: 20px;
  }

  .instruction-section h2 {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }

  .document-item {
    gap: 12px;
    padding: 14px;
  }

  .timeline-item {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .timeline-marker {
    width: 100%;
  }
}

</style>
