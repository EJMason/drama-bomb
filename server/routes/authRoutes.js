const router = require('express').Router()

const controller = require('../controllers/authCtrl')

// ----------------- Routes ----------------- //

router.post('/token/idp', controller.example)
router.post('/login/init', controller.example)

module.exports = router
