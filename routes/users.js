const router = require('express').Router()
const auth = require('../middleware/auth')
const userCtrl = require('../controllers/userController')
const authAdmin = require('../middleware/authAdmin')

/* GET users listing. */
router.post('/register',userCtrl.register)
router.post('/login',userCtrl.login)
router.post('/confirm',userCtrl.verify)
router.post('/reset', auth, userCtrl.resetPassword)
router.get('/history',auth,userCtrl.getHistoryPayment)
router.get('/infor',auth,userCtrl.getUserInfor)
router.patch('/update', auth, userCtrl.updateUser)
// admin
router.post('/getAllUser',authAdmin,userCtrl.getAllUser)
router.post('/getInforUser',authAdmin,userCtrl.getDetailUser)
router.patch('/updateUser',authAdmin,userCtrl.UpdateUserAdmin)
// debug 
router.delete('/deleteUser/:idUser',userCtrl.DeleteUserAdmin)

// router.get('/infor',userCtrl.getInfor)
module.exports = router;
