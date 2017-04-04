const authRoutes = require('./authRoutes')
const demonRoutes = require('./demonRoutes')
const friendsRoutes = require('./friendsRoutes')
const messagesRoutes = require('./messagesRoutes')

module.exports = app => {
  app.use('/auth', authRoutes)
  app.use('/demon', demonRoutes)
  app.use('/friends', friendsRoutes)
  app.use('/messages', messagesRoutes)
}
