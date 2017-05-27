require('dotenv').config()
const express = require('express')
const path = require('path')
const chalk = require('chalk')

const app = require('./appInstance')
// const http = require('./httpServer')
console.log('THIS IS THE PATH: ')
console.log(path.resolve(__dirname, '..', 'build'))
app.use(express.static(path.resolve(__dirname, '..', 'build')))
require('./middleware')(app)
require('./routes')(app)
require('./database')
require('./services/errorHandling')

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(process.env.PORT || 2020, () => {
  console.log(chalk.bgGreen.black(`\nExpress server now running on port ${process.env.port}`))
  console.log(chalk.bgGreen.black(`Mode: ${process.env.NODE_ENV}`))
})

module.exports = app
