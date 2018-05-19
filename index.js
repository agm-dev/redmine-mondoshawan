const redmine = require('./src/redmine')
const { workingState, totalTime, logLevel } = require('./src/config')

const logDebug = logLevel === 'debug'

console.log(`init process`)
console.log(`get all issues assigned to this user`)

redmine.getIssues({ assigned_to_id: 'me' })
  .then(data => {
    console.log(`get issues OK`)
    if (logDebug) console.log(JSON.stringify(data))
    console.log(`got ${data.issues.length} issues assigned to this user`)
    if (data.issues.length !== data.total_count) console.error(`inconsistence beetween issues.length (${data.issues.length}) and issues.total_count (${data.issues.total_count})`)

    const workingIssues = data.issues.filter(issue => issue.status.id === workingState)
    if (!workingIssues.length) { // TODO: add here default issues
      console.error(`Can't add times because you have no issues in a 'working on' state`)
      process.exit(1)
    }
    console.log(`filtered issues, got ${workingIssues.length} issues with state 'working on'`)

    // we need another api call here because only issue-by-id endpoint returns time spent in the issue
    const promises = workingIssues.reduce((result, issue) => [...result, redmine.getIssueById(issue.id, {})], []) // so we construct an array with promises
    return Promise.all(promises) // then we launch them in parallel
  })
  .then(results => {
    console.log(`got issue data by id from ${results.length} issues`)
    results.map(data => {
      console.log(`issue data from issue id: ${data.issue.id}`)
      if (logDebug) console.log(JSON.stringify(data))
    })

    const idealIssues = results.filter(data => data.issue.spent_hours < data.issue.estimated_hours)
    console.log(`${idealIssues.length} issues with spent_hours value lower than estimated_hours value`)

    const targets = idealIssues.length ? idealIssues : results
    const timePerIssue = totalTime / targets.length
    const promises = targets.reduce((result, target) => {
      const timeEntryData = {
        time_entry: {
          issue_id: target.issue.id,
          hours: timePerIssue,
          comments: 'Time not important. Only life important' // TODO: make this one configurable
        }
      }
      console.log(`time entry to create: ${JSON.stringify(timeEntryData)}`)
      return [...result, redmine.createTimeEntry(timeEntryData)]
    }, [])
    return Promise.all(promises)
  })
  .then(results => {
    console.log(`created ${results.length} time entries`)
    results.map(data => {
      console.log(`created time entry data`)
      if (logDebug) console.log(JSON.stringify(data))
    })
    console.log(`process finished`)
  })
  .catch(err => {
    if (err) {
      throw err
    }
  })
