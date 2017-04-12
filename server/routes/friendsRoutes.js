const router = require('express').Router()
const controller = require('../controllers/friendsCtrl')

// ----------------- Routes ----------------- //
router.get('/user/ids', controller.placeholder)
router.post('/find/hater', controller.placeholder)

module.exports = router
