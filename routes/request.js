const router = require('express').Router()
const auth = require('../middleware/auth')
const requestCtrl = require('../controllers/requestController')
const authAdmin = require('../middleware/authAdmin')

/* GET users listing. */
router.post('/createRequest',requestCtrl.createRequest)

// admin
// router.get('/getAllUser',authAdmin,userCtrl.getAllUser)
// router.get('/infor',userCtrl.getInfor)
module.exports = router;
