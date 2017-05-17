const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

module.exports = app => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
  }
}

