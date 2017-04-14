const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const instantiateMiddleware = app => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())

  if (process.env.TESTNG) {
    app.use(morgan('tiny'))
  }
}

module.exports = instantiateMiddleware
