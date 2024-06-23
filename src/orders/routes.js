const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const controller = require("./controller");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Internal Server Error
 */

router.get("/", controller.getOrders);

/**
 * @swagger
 * /api/v1/orders/{order_id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: An order object
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:order_id", controller.getOrderById);

/**
 * @swagger
 * /api/v1/orders/customer/{customer_id}:
 *   get:
 *     summary: Retrieve orders by customer ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer whose orders are to be retrieved
 *     responses:
 *       200:
 *         description: A list of orders for the specified customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: integer
 *                     description: The order ID
 *                   customer_id:
 *                     type: integer
 *                     description: The customer ID
 *                   order_date:
 *                     type: string
 *                     format: date-time
 *                     description: The date the order was placed
 *                   total_amount:
 *                     type: number
 *                     format: float
 *                     description: The total amount for the order
 *       404:
 *         description: No orders found for the customer
 *       500:
 *         description: Internal Server Error
 */
router.get("/customer/:customer_id", controller.getOrderByCustomerId);

/**
 * @swagger
 * /api/v1/orders/summary/{order_id}:
 *   get:
 *     summary: Retrieve an order summary by order ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: An order summary object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   description: The order ID
 *                 customer_id:
 *                   type: integer
 *                   description: The customer ID
 *                 order_date:
 *                   type: string
 *                   format: date-time
 *                   description: The date the order was placed
 *                 total_amount:
 *                   type: number
 *                   format: float
 *                   description: The total amount for the order
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         description: The product ID
 *                       quantity:
 *                         type: integer
 *                         description: The quantity of the product
 *                       subtotal:
 *                         type: number
 *                         format: float
 *                         description: The subtotal for the product
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/summary/:order_id", controller.getOrderSummaryByOrderId);
/**
 * @swagger
 * /api/v1/orders/{order_id}:
 *   delete:
 *     summary: Remove an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to remove
 *     responses:
 *       200:
 *         description: Order removed successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
//If order is canceled
router.delete("/:order_id", controller.removeOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Add a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               total_amount:
 *                 type: number
 *               address_id:
 *                 type: integer
 *               status_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

//checkout processed -> creates order
router.post(
  "/",
  [
    check("customer_id").exists().isInt(),
    check("total_amount").exists().isNumeric(),
    check("address_id").exists().isInt(),
    check("status_id").exists().isInt(),
  ],
  controller.addOrder
);

/**
 * @swagger
 * /api/v1/orders/{order_id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 nullable: true
 *               total_amount:
 *                 type: number
 *                 nullable: true
 *               address_id:
 *                 type: integer
 *                 nullable: true
 *               status_id:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */

//The order has already been made, maybe only able to change the address before status progress?
router.put(
  "/:order_id",
  [
    check("customer_id").optional().isInt(),
    check("total_amount").optional().isNumeric(),
    check("address_id").optional().isInt(),
    check("status_id").optional().isInt(),
  ],
  controller.updateOrderColumn
);

module.exports = router;
