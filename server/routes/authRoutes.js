const router = require('express').Router()

const controller = require('../controllers/authCtrl')

// ----------------- Routes ----------------- //

router.post('/token/idp', controller.default)

module.exports = router
