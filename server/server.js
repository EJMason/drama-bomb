require('dotenv').config()
const express = require('express')
const path = require('path')
const chalk = require('chalk')
const app = require('./appInstance')
// const http = require('./httpServer')
require('./database')

app.use(express.static(path.resolve(__dirname, '..', 'build')))
require('./middleware')(app)
require('./routes')(app)

app.get('*', (req, res) => {
  console.log(req.url)
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(process.env.PORT || 2020, () => {
  console.log(chalk.bgGreen.black('Express server now running on port 2020'))
})

module.exports = app
