require('dotenv').config()
const express = require('express')
const path = require('path')
const chalk = require('chalk')

const app = require('./appInstance')
const CronTask = require('./cronTask')
// const http = require('./httpServer')

app.use(express.static(path.resolve(__dirname, '..', 'build')))
require('./middleware')(app)
require('./routes')(app)
require('./database')
require('./services/errorHandling')

app.get('/blah', (req, res) => {
  // req.socket.setTimeout(Infinity)

  setInterval(() => {
    res.write('id: BOOBZ \n')
    res.write('event: something\n')
    res.write('data: 12345\n\n')
  }, 3000)

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })
  // res.status(200).send('BLAH')
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(process.env.PORT || 2020, () => {
  console.log(chalk.bgGreen.black('\nExpress server now running on port 2020'))
  const myCron = new CronTask()
  // myCron.resumeTask()
  // myCron.emitter.on('updated_users', (data) => {
  //   console.log('THE TRIGGER IS WORKING!: ', data)
  // })
})

module.exports = app
