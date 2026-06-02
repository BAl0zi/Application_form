import { defineEventHandler, readBody } from 'h3'
import { google } from 'googleapis'

function parseBase64Data(dataUrl: string) {
  if (dataUrl.startsWith('data:')) {
    const parts = dataUrl.split(',')
    return parts[1] || ''
  }
  return dataUrl
}

async function findOrCreateSubfolder(drive: any, parentId: string, name: string) {
  const query = `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false`
  const listResult = await drive.files.list({
    q: query,
    fields: 'files(id,name)',
    spaces: 'drive'
  })

  const existing = listResult.data.files?.[0]
  if (existing?.id) {
    return existing.id
  }

  const createResult = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    }
  })

  return createResult.data.id
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const folderId = config.googleDriveFolderId
  const primaryFolderId = config.googleDrivePrimaryFolderId
  const juniorFolderId = config.googleDriveJuniorFolderId
  const serviceAccountKey = config.googleServiceAccountKey

  if (!folderId) {
    return { success: false, message: 'Missing Google Drive folder ID.' }
  }
  if (!serviceAccountKey) {
    return { success: false, message: 'Missing Google service account credentials.' }
  }

  let credentials
  try {
    credentials = typeof serviceAccountKey === 'string' ? JSON.parse(serviceAccountKey) : serviceAccountKey
  } catch (error) {
    return { success: false, message: 'Invalid Google service account key JSON.' }
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  })

  const drive = google.drive({ version: 'v3', auth })
  const fileData = parseBase64Data(body.fileData)

  if (!fileData) {
    return { success: false, message: 'Missing file data.' }
  }

  const buffer = Buffer.from(fileData, 'base64')
  const mimeType = body.mimeType || 'application/pdf'
  const fileName = body.fileName || 'application.pdf'
  const schoolType = String(body.schoolType || '').trim().toLowerCase()

  let targetFolderId = folderId

  if (schoolType === 'primary') {
    targetFolderId = primaryFolderId || await findOrCreateSubfolder(drive, folderId, 'Primary')
  } else if (schoolType === 'junior') {
    targetFolderId = juniorFolderId || await findOrCreateSubfolder(drive, folderId, 'Junior')
  }

  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [targetFolderId],
        mimeType
      },
      media: {
        mimeType,
        body: buffer
      }
    })

    return {
      success: true,
      fileId: response.data.id,
      fileLink: response.data.id ? `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing` : null
    }
  } catch (error: any) {
    return { success: false, message: error?.message || 'Google Drive upload failed.' }
  }
})
