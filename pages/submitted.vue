<template>
  <div class="submitted-shell">
    <div class="message-card">
      <h1>Application Submitted Successfully</h1>
      <p class="success-message">
        Your admission form has been submitted. Download the completed application and keep it for your records.
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

      <div class="brief-note">
        <strong>Next step:</strong>
        <span>Print the downloaded form and submit it to the school office with the required supporting documents.</span>
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

async function downloadDesignedRegistrationDocument() {
  if (!application.value) return
  loading.value = true
  uploadMessage.value = ''

  try {
    const payload = application.value
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = 595
    const pageHeight = 842
    const margin = 52
    const contentWidth = pageWidth - margin * 2
    const green = [111, 190, 67]
    const dark = [48, 48, 50]
    const line = [98, 98, 98]
    let cursorY = 172
    const value = (text) => String(text || '').trim() || 'N/A'
    const fullName = [payload.firstName, payload.middleName, payload.surname].filter(Boolean).join(' ')

    async function addLogo() {
      try {
        const response = await fetch('/logo.svg')
        const svgText = await response.text()
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' })
        const svgUrl = URL.createObjectURL(svgBlob)
        const img = new Image()
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = svgUrl
        })

        const canvas = document.createElement('canvas')
        canvas.width = 140
        canvas.height = 140
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 140, 140)
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', margin, 58, 66, 66)
        }
        URL.revokeObjectURL(svgUrl)
      } catch (error) {
        doc.setDrawColor(...green)
        doc.setLineWidth(2)
        doc.circle(margin + 33, 91, 26)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(24)
        doc.setTextColor(...green)
        doc.text('U', margin + 33, 100, { align: 'center' })
        doc.setTextColor(0, 0, 0)
      }
    }

    async function drawHeader() {
      doc.setFillColor(...green)
      doc.rect(0, 0, pageWidth, 34, 'F')
      doc.rect(0, pageHeight - 28, pageWidth, 28, 'F')
      doc.setFillColor(...dark)
      doc.triangle(238, 34, 265, 8, pageWidth, 8, 'F')
      doc.rect(265, 8, pageWidth - 265, 26, 'F')
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.4)
      doc.rect(16, 16, pageWidth - 32, pageHeight - 32)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(0, 0, 0)
      doc.text('REGISTRATION FORM', pageWidth / 2, 144, { align: 'center' })
      doc.setFontSize(13)
      doc.text('URAFIKI CAROVANA SCHOOL', margin + 88, 92)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(`${value(payload.schoolType).toUpperCase()} SCHOOL ADMISSION`, margin + 88, 105)
      doc.setDrawColor(160, 160, 160)
      doc.setLineDashPattern([2, 2], 0)
      doc.rect(pageWidth - 138, 66, 72, 88)
      doc.setLineDashPattern([], 0)
      doc.setFontSize(8)
      doc.text('PHOTO', pageWidth - 102, 114, { align: 'center' })

      if (payload.photoPreview) {
        try {
          const mimeType = payload.photoPreview.split(';')[0].split(':')[1] || 'image/jpeg'
          const imageFormat = mimeType.includes('png') ? 'PNG' : 'JPEG'
          doc.addImage(payload.photoPreview, imageFormat, pageWidth - 136, 68, 68, 84)
        } catch (error) {
          // Keep the photo box when jsPDF cannot render the selected image.
        }
      }

      await addLogo()
    }

    function ensureSpace(height) {
      if (cursorY + height <= pageHeight - 58) return
      doc.addPage()
      cursorY = 54
    }

    function drawField(label, fieldValue, x, y, width, options = {}) {
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`${label}:`, x, y)
      const labelWidth = doc.getTextWidth(`${label}: `)
      const lineX = x + labelWidth + 2
      doc.setDrawColor(...line)
      doc.setLineWidth(0.55)
      doc.line(lineX, y + 2, x + width, y + 2)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      const displayValue = options.leaveBlank ? String(fieldValue || '').trim() : value(fieldValue)
      if (displayValue) {
        doc.text(displayValue, lineX + 4, y - 1, { maxWidth: Math.max(24, x + width - lineX - 8) })
      }
    }

    function drawFieldRow(fields) {
      ensureSpace(24)
      fields.forEach((field) => drawField(field.label, field.value, field.x, cursorY, field.width, field))
      cursorY += 22
    }

    function drawSectionTitle(title) {
      ensureSpace(36)
      cursorY += 4
      doc.setFillColor(...green)
      doc.rect(margin, cursorY - 13, contentWidth, 18, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.text(title.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' })
      doc.setTextColor(0, 0, 0)
      cursorY += 22
    }

    function drawParagraph(label, text, minHeight = 44) {
      ensureSpace(minHeight + 28)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(`${label}:`, margin, cursorY)
      cursorY += 12
      const lines = doc.splitTextToSize(value(text), contentWidth - 12).slice(0, 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text(lines, margin + 6, cursorY)
      const boxHeight = Math.max(minHeight, lines.length * 11 + 12)
      doc.setDrawColor(...line)
      doc.rect(margin, cursorY - 10, contentWidth, boxHeight)
      cursorY += boxHeight + 14
    }

    function drawList(title, items, formatter) {
      const filledItems = items.filter((item) => Object.values(item || {}).some((entry) => String(entry || '').trim()))
      if (!filledItems.length) return
      drawSectionTitle(title)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      filledItems.slice(0, 6).forEach((item, index) => {
        ensureSpace(18)
        doc.text(`${index + 1}.`, margin, cursorY)
        doc.setFont('helvetica', 'normal')
        doc.text(formatter(item), margin + 18, cursorY, { maxWidth: contentWidth - 18 })
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, cursorY + 5, margin + contentWidth, cursorY + 5)
        cursorY += 17
        doc.setFont('helvetica', 'bold')
      })
      cursorY += 10
    }

    function drawOfficeUse() {
      ensureSpace(150)
      doc.setDrawColor(120, 120, 120)
      doc.setLineDashPattern([2, 3], 0)
      doc.line(margin, cursorY, margin + contentWidth, cursorY)
      doc.setLineDashPattern([], 0)
      cursorY += 24
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('FOR OFFICE USE', pageWidth / 2, cursorY, { align: 'center' })
      cursorY += 24
      drawFieldRow([
        { label: 'Application Received on', value: '', x: margin, width: 220, leaveBlank: true },
        { label: 'Reference No.', value: '', x: margin + 250, width: contentWidth - 250, leaveBlank: true }
      ])
      drawFieldRow([
        { label: 'Admission No.', value: '', x: margin, width: 220, leaveBlank: true },
        { label: 'Class / Grade', value: '', x: margin + 250, width: contentWidth - 250, leaveBlank: true }
      ])
      drawFieldRow([
        { label: 'Assessment Date', value: '', x: margin, width: 220, leaveBlank: true },
        { label: 'Approved By', value: '', x: margin + 250, width: contentWidth - 250, leaveBlank: true }
      ])
    }

    await drawHeader()
    drawFieldRow([{ label: 'Name', value: fullName, x: margin, width: contentWidth }])
    drawFieldRow([
      { label: 'Date of Birth', value: payload.dob, x: margin, width: 220 },
      { label: 'Nationality', value: payload.citizenship, x: margin + 250, width: contentWidth - 250 }
    ])
    drawFieldRow([
      { label: 'Grade Applied', value: payload.gradeApplied, x: margin, width: 220 },
      { label: 'School Type', value: payload.schoolType, x: margin + 250, width: contentWidth - 250 }
    ])
    drawFieldRow([{ label: 'Previous School', value: payload.previousSchool, x: margin, width: contentWidth }])
    drawFieldRow([
      { label: 'Gender', value: payload.gender, x: margin, width: 160 },
      { label: 'NEMIS No.', value: payload.nemisNumber, x: margin + 180, width: 160 },
      { label: 'Assessment No.', value: payload.assessmentNumber, x: margin + 360, width: contentWidth - 360 }
    ])
    drawSectionTitle('Parent / Guardian Details')
    drawFieldRow([
      { label: 'Name', value: payload.parentName, x: margin, width: 240 },
      { label: 'Relationship', value: payload.parentRelationship, x: margin + 270, width: contentWidth - 270 }
    ])
    drawFieldRow([
      { label: 'Profession', value: payload.profession, x: margin, width: 240 },
      { label: 'Designation', value: payload.designation, x: margin + 270, width: contentWidth - 270 }
    ])
    drawFieldRow([
      { label: 'Mobile', value: payload.mobile1, x: margin, width: 160 },
      { label: 'Alt. Mobile', value: payload.mobile2, x: margin + 180, width: 160 },
      { label: 'Email', value: payload.email, x: margin + 360, width: contentWidth - 360 }
    ])
    drawFieldRow([
      { label: 'Company', value: payload.company, x: margin, width: 240 },
      { label: 'Town / Country', value: `${value(payload.town)} / ${value(payload.country)}`, x: margin + 270, width: contentWidth - 270 }
    ])
    drawSectionTitle('Residential Address')
    drawFieldRow([
      { label: 'Estate / Apartment', value: payload.estateApartment, x: margin, width: 240 },
      { label: 'Location', value: payload.location, x: margin + 270, width: contentWidth - 270 }
    ])
    drawFieldRow([
      { label: 'City', value: payload.city, x: margin, width: 160 },
      { label: 'P.O. Box', value: payload.poBox, x: margin + 180, width: 160 },
      { label: 'County', value: payload.county, x: margin + 360, width: contentWidth - 360 }
    ])
    drawFieldRow([
      { label: 'Estate', value: payload.areaEstate, x: margin, width: 160 },
      { label: 'Road', value: payload.areaRoad, x: margin + 180, width: 160 },
      { label: 'Plot No.', value: payload.areaPlot, x: margin + 360, width: contentWidth - 360 }
    ])
    drawFieldRow([
      { label: 'Transport', value: payload.transportNeeded, x: margin, width: 180 },
      { label: 'Pick up Point', value: payload.transportNeeded === 'Yes' ? payload.pickupPoint : 'N/A', x: margin + 210, width: contentWidth - 210 }
    ])
    drawSectionTitle('Medical And Application Notes')
    drawParagraph('Relevant Medical Information', payload.medicalInfo)
    drawParagraph('Reasons for Applying', payload.reasonsForApplying)
    drawList('Siblings', Array.isArray(payload.siblings) ? payload.siblings : [], (sibling) => (
      `${value(sibling.name)}    Age: ${value(sibling.age)}    Institution: ${value(sibling.institution)}`
    ))
    drawList('Other Children Enrolled At Urafiki Carovana School', Array.isArray(payload.enrolledChildren) ? payload.enrolledChildren : [], (child) => (
      `${value(child.name)}    Grade: ${value(child.grade)}    Relation: ${value(child.relation)}`
    ))
    drawSectionTitle('Verification')
    drawFieldRow([
      { label: 'Parent / Guardian Name', value: payload.verificationName || payload.parentName, x: margin, width: 260 },
      { label: 'Date', value: payload.applicationDate, x: margin + 290, width: contentWidth - 290 }
    ])
    drawFieldRow([
      { label: 'Parent Signature', value: payload.verificationSignature || payload.parentSignature, x: margin, width: 260 }
    ])
    drawSectionTitle('Custody Information')
    drawFieldRow([
      { label: 'Any custody issue the school should be aware of?', value: '', x: margin, width: contentWidth, leaveBlank: true }
    ])
    drawFieldRow([
      { label: 'If yes, explain the area', value: '', x: margin, width: contentWidth, leaveBlank: true }
    ])
    drawSectionTitle('Required Documents Checklist')
    ;[
      ['Copy of Birth Certificate', payload.attachmentNames?.birthCertificate],
      ['Latest Academic Report', payload.attachmentNames?.academicReport],
      ['Clearance / Transfer Letter', payload.attachmentNames?.transferLetter],
      ['NEMIS/KNEC or KAPSEA Document', payload.attachmentNames?.assessmentDocument]
    ].forEach(([label, name]) => {
      ensureSpace(18)
      doc.rect(margin, cursorY - 9, 8, 8)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text(`${label}: ${name || 'To be submitted physically'}`, margin + 18, cursorY)
      cursorY += 16
    })
    drawOfficeUse()

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
  } finally {
    loading.value = false
  }
}

async function downloadDocument() {
  await downloadDesignedRegistrationDocument()
  return

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
    },
    {
      title: 'Custody Information',
      values: [
        ['Any custody issue the school should be aware of?', ''],
        ['If yes, explain the area', '']
      ],
      leaveBlank: true
    }
  ]

  doc.setFontSize(12)

  sections.forEach((section) => {
    doc.setFont('helvetica', 'bold')
    doc.text(section.title, margin, cursorY)
    cursorY += 18
    doc.setFont('helvetica', 'normal')

    section.values.forEach(([label, value]) => {
      const text = section.leaveBlank ? `${label}:` : `${label}: ${value || 'N/A'}`
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
  width: 100%;
  overflow-x: hidden;
}

.message-card {
  max-width: 640px;
  width: 100%;
  background: #fff;
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 154, 0, 0.16);
  box-sizing: border-box;
}

.message-card h1 {
  margin: 0 0 18px;
  font-size: clamp(1.7rem, 2.5vw, 2.4rem);
  color: #231b11;
  line-height: 1.12;
  overflow-wrap: anywhere;
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

.brief-note {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 245, 230, 0.9);
  color: #5e4b35;
  line-height: 1.6;
  box-sizing: border-box;
}

.brief-note strong {
  color: #231b11;
  flex-shrink: 0;
}

.instructions-container {
  max-width: 1200px;
  margin: 60px auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding: 0 24px;
  box-sizing: border-box;
}

.instruction-section {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 154, 0, 0.12);
  overflow: hidden;
}

.instruction-section h2 {
  margin: 0 0 24px;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  color: #231b11;
  border-bottom: 3px solid #ff7c00;
  padding-bottom: 12px;
  word-wrap: break-word;
}

.intro-text {
  color: #5e4b35;
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
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
  align-items: flex-start;
}

.document-item .icon {
  font-size: 28px;
  min-width: 40px;
  flex-shrink: 0;
}

.document-item strong {
  color: #231b11;
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
  display: block;
}

.document-item p {
  margin: 6px 0 0;
  color: #5e4b35;
  font-size: clamp(0.85rem, 1.2vw, 0.95rem);
  line-height: 1.5;
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
  font-size: clamp(0.75rem, 1.2vw, 0.9rem);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.timeline-content strong {
  color: #231b11;
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  display: block;
}

.timeline-content p {
  margin: 8px 0;
  color: #5e4b35;
  line-height: 1.6;
  font-size: clamp(0.85rem, 1.2vw, 0.95rem);
}

.timeline-content small {
  display: block;
  margin-top: 8px;
  color: #8a6b3a;
  font-style: italic;
  font-size: clamp(0.75rem, 1vw, 0.85rem);
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
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #231b11;
  margin: 0;
}

.deadline-text strong {
  color: #ff6d04;
  font-size: clamp(1rem, 2.2vw, 1.3rem);
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
  font-size: clamp(0.85rem, 1.2vw, 0.95rem);
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
    padding: 0 16px;
    max-width: 100%;
  }

  .instruction-section {
    padding: 18px;
    border-radius: 16px;
  }

  .instruction-section h2 {
    font-size: 1.2rem;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }

  .intro-text {
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  .documents-list {
    gap: 12px;
  }

  .document-item {
    gap: 12px;
    padding: 12px;
    flex-wrap: wrap;
  }

  .document-item .icon {
    font-size: 24px;
    min-width: 32px;
  }

  .document-item strong {
    font-size: 0.95rem;
  }

  .document-item p {
    font-size: 0.85rem;
  }

  .timeline {
    padding: 16px;
  }

  .timeline-item {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 18px;
    padding-bottom: 18px;
  }

  .timeline-marker {
    width: 100%;
    padding: 10px;
    font-size: 0.85rem;
  }

  .timeline-content strong {
    font-size: 0.95rem;
  }

  .timeline-content p {
    font-size: 0.9rem;
    margin: 6px 0;
  }

  .timeline-content small {
    font-size: 0.8rem;
  }

  .deadline {
    padding: 20px;
  }

  .deadline-text {
    font-size: 1rem;
  }

  .deadline-text strong {
    font-size: 1.1rem;
  }

  .important-notes {
    padding: 16px;
  }

  .note-item {
    padding: 12px;
    margin-bottom: 10px;
    font-size: 0.9rem;
  }

  .note-item strong {
    font-size: 0.95rem;
  }
}

@media (max-width: 500px) {
  .submitted-shell {
    padding: 20px 12px;
  }

  .message-card {
    padding: 20px 16px;
    border-radius: 20px;
  }

  .message-card h1 {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  .message-card p {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  .instructions-container {
    margin: 30px auto;
    padding: 0 12px;
    gap: 16px;
  }

  .instruction-section {
    padding: 16px;
    border-radius: 14px;
  }

  .instruction-section h2 {
    font-size: 1.05rem;
    margin-bottom: 12px;
  }

  .intro-text {
    font-size: 0.9rem;
  }

  .document-item {
    gap: 10px;
    padding: 10px;
  }

  .document-item .icon {
    font-size: 20px;
    min-width: 28px;
  }

  .timeline-item {
    margin-bottom: 14px;
  }

  .timeline-marker {
    font-size: 0.75rem;
  }

  .deadline-text {
    font-size: 0.95rem;
  }

  .deadline-text strong {
    font-size: 1rem;
  }
}

</style>

