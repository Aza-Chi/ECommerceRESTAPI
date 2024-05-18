const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const controller = require('./controller');

router.get('/', controller.getCarts);
router.get('/customer/:customer_id', controller.getCartByCustomerId); //http://localhost:3000/api/v1/shoppingcart/customer/1


router.delete('/:cart_id', controller.removeCart);

router.post('/', [
    check('customer_id').exists().isInt(),
    check('product_id').exists().isInt(),
    check('quantity').exists().isInt(),
], controller.addCart);

router.put('/:cart_id', [
    check('customer_id').optional().isInt(),
    check('product_id').optional().isInt(),
    check('quantity').optional().isInt(),
], controller.updateCartColumn);

module.exports = router;