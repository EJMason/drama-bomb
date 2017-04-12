const mongoose = require('mongoose')
// const User = require('./models/Users')
mongoose.Promise = require('bluebird')


mongoose.connect(process.env.DB_MONGO_CONN)

mongoose.connection.on('open', () => {
  // User.create({ user_id: 111, screen_name: 'apples' }).then(() => {
  //   User.find({ user_id: 111 }).exec((a, b) => {
  //     console.log(a)
  //     console.log(b)
  //   })
  // })
})
