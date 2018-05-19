# Redmine Mondoshawan
Uses redmine api to automatically fill up time entries to complete your working day.

As that Mondoshawan said in [The Fifth Element](https://www.imdb.com/title/tt0119116/):

> Time not important. Only life important

If you are too busy coding or trying to solve real problems you can use this script to fill up time entries in your asigned issues (randomly) to your working day is completed. You can edit those time entries manually later if you have enough time!

## Installation

You will need `node.js` version with support for promises, and `npm`. Then:

```
git clone https://github.com/agm-dev/redmine-mondoshawan
cd redmine-mondoshawan
npm install
```

Once npm has installed required packages, you will have to rename `.env.sample` to `.env` and edit variables with your data:

| KEY | REQUIRED | VALUE |
|-----|----------|-------|
| API_KEY | YES | This is your redmine token. You can get yours from 'My account' section in your redmine. |
| API_URL | YES | The redmine's root url. |
| ISSUE_STATE | YES | Int value that identifies the state of the redmine's issues the script will work with. |
| TOTAL_TIME | YES | Int value that represents the total time of a working day. This is the amount that will be split among valid state issues. |
| LOG_LEVEL | NO | Accepts `debug`, and `info`. You will get json data logs in console when running the script if LOG_LEVEL is set to debug. It's set to info by default.

When everything is done, just exec:

```
npm run prod
# or
node index.js
```

## Contribution

Feel free to open issues or send pull requests :)