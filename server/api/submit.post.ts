import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // In production, persist to DB or send email here.
  console.log('New application submission:', body)
  return { success: true }
})
