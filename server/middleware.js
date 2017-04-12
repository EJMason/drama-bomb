const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const instantiateMiddleware = app => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())
  app.use(morgan('short'))
}

module.exports = instantiateMiddleware
