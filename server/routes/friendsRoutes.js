const router = require('express').Router()
const controller = require('../controllers/friendsCtrl')
const checkJWT = require('../middleware/authMiddleware').checkJWT

// ----------------- Routes ----------------- //
router.get('/user/ids', controller.placeholder)
router.post('/find/hater', controller.placeholder)

router.get('/cron/haters', checkJWT, controller.chronHaters)

module.exports = router
