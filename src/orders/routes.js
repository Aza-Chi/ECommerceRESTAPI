const { Router } = require('express');
const controller = require('./controller');
const { check } = require('express-validator');

const router = Router();

router.get('/', controller.getOrders);
router.get('/:order_id', controller.getOrderById);

router.delete('/:order_id', controller.removeOrder);

router.post('/', [
    check('customer_id').exists().isInt(),
    check('total_amount').exists().isNumeric(),
    check('address_id').exists().isInt(),
    check('status_id').exists().isInt(),
  ], controller.addOrder);

router.put('/orders/:order_id', [
    check('customer_id').optional().isInt(),
    check('total_amount').optional().isNumeric(),
    check('address_id').optional().isInt(),
    check('status_id').optional().isInt(),
  ], controller.updateOrderColumn);



module.exports = router;