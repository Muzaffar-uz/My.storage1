const router = require('express').Router()
const Usercontroller = require('../controller/user_controller')
const {protect,role} = require('../middleware/auth-middleware')

;
router.get('/role',protect,role("Admin"),Usercontroller.getUser)
router.post('/role',Usercontroller.postUser);
router.put('/role/:id',Usercontroller.updetUser)
router.delete('/role/:id',Usercontroller.delteUser)
router.post('/auth',Usercontroller.auth)
router.post('/res',Usercontroller.repassword)


module.exports = router;