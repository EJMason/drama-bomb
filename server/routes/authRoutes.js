const router = require('express').Router()

const ctrl = require('../controllers/authCtrl')
const mw = require('../middleware/authMiddleware')

// ----------------- Routes ----------------- //

router.post('/token/idp', ctrl.example)
router.post('/login/init', mw.validateBody, ctrl.example)

module.exports = router
