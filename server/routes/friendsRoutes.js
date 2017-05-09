const router = require('express').Router()
const controller = require('../controllers/friendsCtrl')
const checkJWT = require('../middleware/authMiddleware').checkJWT

// ----------------- Routes ----------------- //

// checks if there are any new haters or friends
router.get('/cron/haters', checkJWT, controller.checkForNewFriendsAndHaters)
// periodic ping to update redis expiry indicating user is logged in
router.patch('/ping', checkJWT, controller.userPingisLoggedIn)

// router.get('/updater', checkJWT, controller.ssEvents)

module.exports = router
