const router = require('express').Router()

const ctrl = require('../controllers/authCtrl')
const mw = require('../middleware/authMiddleware')

// ----------------- Routes ----------------- //

router.post('/login/init', mw.validateBody, ctrl.loginInit)

module.exports = router
