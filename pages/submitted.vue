<template>
  <div class="submitted-shell">
    <div class="message-card">
      <h1>Application Submitted Successfully</h1>
      <p>
        Your admission form has been submitted. You can download the completed application document below.
      </p>
      <div class="actions">
        <button type="button" class="download-btn" @click="downloadDocument" :disabled="!application || loading">
          {{ loading ? 'Preparing document...' : 'Download Document' }}
        </button>
        <NuxtLink to="/" class="home-btn">Back to Home</NuxtLink>
      </div>
      <p v-if="!application" class="notice">
        No submission data is available. Please return to the form and submit again.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jsPDF } from 'jspdf'

const application = ref(null)
const loading = ref(false)

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

function downloadDocument() {
  if (!application.value) return
  loading.value = true

  const payload = application.value
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

  doc.save(getApplicationFilename(payload))
  loading.value = false
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
}

</style>
