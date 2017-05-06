const router = require('express').Router()
const ctrl = require('../controllers/authCtrl')
const mw = require('../middleware/authMiddleware')

const tester = require('../utilities/cronUtil')

// ----------------- Routes ----------------- //
router.post('/login/init', mw.checkJWT, ctrl.loginInit)

router.get('/test', async (req, res) => {
  try {
    await tester.cronCheck()
    res.status(200).send('auth/test complete!')
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
