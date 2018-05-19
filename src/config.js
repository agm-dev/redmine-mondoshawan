require('dotenv').config()

const apiKey = process.env.API_KEY || null
const apiUrl = process.env.API_URL || null
const workingState = process.env.ISSUE_STATE ? Number(process.env.ISSUE_STATE) : null // need this as number, not string
const totalTime = process.env.TOTAL_TIME ? Number(process.env.TOTAL_TIME) : null // need this as number, not string
const logLevel = process.env.LOG_LEVEL && ['debug', 'info'].includes(process.env.LOG_LEVEL.toLowerCase()) ? process.env.LOG_LEVEL : 'info'

if (!apiKey) {
  console.error('You need to provide API_KEY as env variable')
  process.exit(1)
}

if (!apiUrl) {
  console.error('You need to provide API_URL as env variable')
  process.exit(1)
}

if (!workingState) {
  console.error('You have to provide ISSUE_STATE env variable')
  process.exit(1)
}

if (!totalTime) {
  console.error('You have to provide TOTAL_TIME env variable')
  process.exit(1)
}

module.exports = {
  apiKey,
  apiUrl,
  workingState,
  totalTime,
  logLevel
}
