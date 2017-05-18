const router = require('express').Router()
const ctrl = require('../controllers/authCtrl')
const mw = require('../middleware/authMiddleware')

// ----------------- Routes ----------------- //
router.post('/login/init', mw.checkJWT, ctrl.loginInit)
router.delete('/logout', mw.checkJWT, ctrl.logout)

router.get('/test', (req, res) => {
  res.status(400).send('error')
})

module.exports = router
