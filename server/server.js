require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.static('./build'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('short'))

require('./routes')(app)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'))
})

app.get('/test', (req, res) => {
  res.status(200).send('Hello World!')
})

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '/../public/index.html'))
})

const port = process.env.PORT || 2020

http.listen(port, () => {
  console.log(chalk.bgGreen.black(`listening on port ${port}`))
})

module.exports = http
