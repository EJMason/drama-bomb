const router = require('express').Router()
const ctrl = require('../controllers/authCtrl')
const mw = require('../middleware/authMiddleware')

// ----------------- Routes ----------------- //
router.get('/test', (req, res) => {
  console.log('MEOW....')
  res.status(200).send('yoyoyo')
})

router.post('/login/init', mw.checkJWT, ctrl.loginInit)

module.exports = router
