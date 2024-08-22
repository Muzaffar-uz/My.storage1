const router = require('express').Router()
const Gourp_product_conroller = require('../controller/group_product_controller')

router.get('/all',Gourp_product_conroller.getGroup_product)
router.post('/insert',Gourp_product_conroller.postGroup_product);
router.put('/update/:id',Gourp_product_conroller.putGroup_product);
router.delete('/delete/:id',Gourp_product_conroller.delGroup_product)



module.exports = router