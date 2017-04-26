const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const instantiateMiddleware = app => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())

  console.log('THIS IS THE PROCESS: ', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
  }
}

module.exports = instantiateMiddleware
