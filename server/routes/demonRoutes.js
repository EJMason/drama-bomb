const router = require('express').Router()

const controller = require('../controllers/demonCtrl')

// ----------------- Routes ----------------- //

router.post('/activate', controller.default)
router.post('/deactivate', controller.default)

module.exports = router
