const { Router } = require('express');
const router = Router();
const controller = require('./controller');
//const { check } = require('express-validator');



//get/put/post route to process the checkout???  

// Put this in orders??? //Or send json payload to the orders post route and order details post route??? 
// POST - creating an order, creating order details (Still need to create order details!), 
// 

// router.post('/', [
//   check('customer_id').exists().isInt(),
//   check('items').isArray({ min: 1 }).withMessage('Items array cannot be empty'),
//   check('payment_method').exists().isString(), //payment is a placeholder for now 
//   check('shipping_address').exists().isObject(),
// ], controller.processCheckout);
router.post('/checkout', controller.processCheckout);
router.put('/checkout', controller.processCheckout);




//
module.exports = router;


//
// click purchase (Need checkout routes?)
// 3. checkout route? - 
//process order -> ?post?, 
// PUT -> update stock quantity, // controller - transaction.. rollback transaction?
// POST Creates Orders and Order Details?