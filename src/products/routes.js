const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getProducts);
router.get('/:product_id', controller.getProductById);
router.post('/', controller.addProduct);
router.put('/:product_id', controller.updateProductColumn); // description/price?//imgurl/category id

// router.delete('/:id', controller.removeProduct);


module.exports = router;