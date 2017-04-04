const router = require('express').Router()

const controller = require('../controllers/messagesCtrl')

// ----------------- Routes ----------------- //

router.post('/passive', controller.default)
router.post('/aggressive', controller.default)
router.post('/apologize', controller.default)

module.exports = router
