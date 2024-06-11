const { Router } = require("express");
const router = Router();
const controller = require("./controller");
const auth = require("../auth/auth");
//const { check } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Checkout process management
 */ /**
 * @swagger
 * /api/v1/checkout:
 *   post:
 *     summary: Process checkout
 *     description: Process the checkout for the authenticated user, including creating an order, updating product stock, and clearing the customer's cart
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_id
 *               - paymentInfo
 *             properties:
 *               address_id:
 *                 type: integer
 *                 description: The ID of the address for the order
 *               paymentInfo:
 *                 type: object
 *                 description: Information about the payment (e.g., payment method, card details)
 *     responses:
 *       200:
 *         description: Checkout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Checkout successful
 *                 order:
 *                   type: object
 *                   description: The details of the created order
 *                   properties:
 *                     order_id:
 *                       type: integer
 *                       description: The ID of the order
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/", auth.authenticateToken, controller.processCheckout); //Don't need to add /checkout here, it's already covered by the base path set in server.js!!!

// Don't actually need the put route, let's leave it here as a reminder for next time!!!
router.put("/", auth.authenticateToken, controller.processCheckout);

//
module.exports = router;

//
// click purchase (Need checkout routes?)
// 3. checkout route? -
//process order -> ?post?,
// PUT -> update stock quantity, // controller - transaction.. rollback transaction?
// POST Creates Orders and Order Details?
