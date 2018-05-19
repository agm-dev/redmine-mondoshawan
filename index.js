const Redmine = require('node-redmine') // docs at: https://github.com/zanran/node-redmine
require('dotenv').config()

const apiKey = process.env.API_KEY || null
const apiUrl = process.env.API_URL || null
const workingState = 20 // testing
const totalTime = 1 // 1 day, 8 hours, we only want a number to be split

if (!apiKey || !apiUrl) {
  console.error('You need to provide API_KEY and API_URL as env variables')
  process.exit(1)
}

const redmine = new Redmine(apiUrl, { apiKey })
const targetIssues = []
const addedTimes = []
let ready = true

redmine.issues({ assigned_to_id: 'me' }, (err, data) => {
  if (err) throw err
  console.log(`${data.issues.length} should be equal to ${data.total_count}`)
  // console.log(JSON.stringify(data))
  const workingIssues = data.issues.filter(issue => issue.status.id === workingState)
  if (!workingIssues.length) {
    console.error(`Can't add times because you have no issues in a 'working on' state`)
    process.exit(1)
  }

  // we need another api call here because only issue-by-id endpoint returns time spent in the issue
  ready = false
  for (let i = 0; i < workingIssues.length; i++) {
    redmine.get_issue_by_id(workingIssues[i].id, {}, (err, data) => {
      if (err) throw err
      console.log(`get_issue_by_id ${workingIssues[i].id} response`)
      // console.log(JSON.stringify(data))
      targetIssues.push(data)
      processTargetIssues(workingIssues.length)
    })
  }
})

const processTargetIssues = n => {
  if (n === targetIssues.length) {
    ready = true
    console.log('we are ready!')
  }
  if (ready) {
    // console.log(`TODO: split time between targetIssues (we have ${targetIssues.length})`)
    addTimes(totalTime, targetIssues)
  }
}

const processAddedTimes = n => {
  if (n === addedTimes.length) {
    ready = true
    console.log('times are ready!')
  }
  if (ready) {
    console.log(`all times has been added correctly, you are free to go!`)
  }
}

const addTimes = (totalTime, issues) => {
  /**
   * issue.done_ratio: 50
   * issue.estimated_hours: 1.5
   * issue.total_estimated_hours: 1.5
   * issue.spent_hours: 0.5
   * issue.total_spent_hours: 0.5
   */
  const idealIssues = issues.filter(issue => issue.spent_hours < issue.estimated_hours)
  const targets = idealIssues.length ? idealIssues : issues
  const timePerIssue = totalTime / targets.length
  ready = false
  for (let i = 0; i < targets.length; i++) {
    // console.log(`EEEEH: ${JSON.stringify(targets[i])}`)
    const timeEntryData = {
      time_entry: {
        issue_id: targets[i].issue.id,
        hours: timePerIssue,
        comments: 'Time not important. Only life important'
      }
    }
    console.log(timeEntryData)
    /*
    redmine.create_time_entry(timeEntryData, (err, data) => {
      if (err) throw err;
      console.log(`added time entry with value ${timeEntryData})
      addedTimes.push(targets[i])
      processAddedTimes(targets.length)
    })
    */
    addedTimes.push(targets[i]) // remove on uncoment
    processAddedTimes(targets.length) // remove on uncoment
  }
}

// TODO:
/**
 * -add support for fixed default issues
 * -sort the code, style, split
 * -real test
 */
