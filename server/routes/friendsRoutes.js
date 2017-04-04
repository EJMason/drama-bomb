const router = require('express').Router()

const controller = require('../controllers/friendsCtrl')

// ----------------- Routes ----------------- //

router.get('/user/ids', controller.default)
router.post('/find/hater', controller.default)


module.exports = router
