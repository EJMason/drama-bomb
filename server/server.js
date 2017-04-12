require('dotenv').config()
const express = require('express')
const path = require('path')
const chalk = require('chalk')
require('./database')

const port = process.env.PORT || 2020
const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'build')))
require('./middleware')(app)
require('./routes')(app)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(port, () => {
  console.log(chalk.bgGreen.black(`listening on port ${port}`))
})

module.exports = app
