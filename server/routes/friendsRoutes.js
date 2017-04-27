const router = require('express').Router()
const controller = require('../controllers/friendsCtrl')
const checkJWT = require('../middleware/authMiddleware').checkJWT

// ----------------- Routes ----------------- //

router.get('/cron/haters', checkJWT, controller.checkForNewFriendsAndHaters)

module.exports = router
