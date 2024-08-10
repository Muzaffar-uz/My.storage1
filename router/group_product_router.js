const router = require('express').Router()
const Gourp_product_conroller = require('../controller/group_product_controller')

router.get('/',Gourp_product_conroller.getGroup_product)
router.post('/',Gourp_product_conroller.postGroup_product);
router.put('/',Gourp_product_conroller.putGroup_product);
router.delete('/',Gourp_product_conroller.delGroup_product)



module.exports = router