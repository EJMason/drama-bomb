const winston = require('winston')
const stackdriverTransport = require('@google-cloud/logging-winston')
// const slackWinston = require('slack-winston').Slack


let logger
//   new winston.Logger({
//   exitOnError: false,
//   colorize: true,
//   level,
// })

// Support for slack
// logger
//   .add(slackWinston, {
//     domain: 'codewizardlord',
//     token: process.env.SLACK_DEV_TOKEN,
//     webhook_url: process.env.SLACK_DEV_URL,
//     channel: '#drama-bomb-devlog',
//     level: 'warn',
//   })

if (process.env.NODE_ENV !== 'production') {
  logger = new winston.Logger({
    exitOnError: false,
    json: true,
    level: 'verbose',
    transports: [
      new (winston.transports.Console)({
        handleExceptions: true,
        colorize: true,
      }),
    ],
  })
} else {
  logger = new winston.Logger({
    exitOnError: false,
    level: 'info',
  })

  logger
    .add(stackdriverTransport, {
      handleExceptions: true,
      humanReadableUnhandledException: true,
    })
}

module.exports = logger
