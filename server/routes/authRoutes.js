const router = require('express').Router()
const ctrl = require('../controllers/authCtrl')
const mw = require('../middleware/authMiddleware')

// ----------------- Routes ----------------- //
router.post('/login/init', mw.checkJWT, ctrl.loginInit)
router.delete('/logout', mw.checkJWT, ctrl.logout)

module.exports = router
