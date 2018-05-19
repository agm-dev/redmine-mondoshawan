const Redmine = require('node-redmine') // docs at: https://github.com/zanran/node-redmine
const { apiKey, apiUrl } = require('./config')

const redmine = new Redmine(apiUrl, { apiKey })

// node-redmine only supports callback functions
// so let's try to promisify those we are gonna use
redmine.getIssues = params => {
  return new Promise((resolve, reject) => {
    redmine.issues(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

redmine.getIssueById = (id, params) => {
  return new Promise((resolve, reject) => {
    redmine.get_issue_by_id(id, params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

redmine.createTimeEntry = data => {
  return new Promise((resolve, reject) => {
    redmine.create_time_entry(data, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = redmine
