const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const controller = require("./controller");

/**
 * @swagger
 * tags:
 *   name: OrderDetails
 *   description:  Order details management
 */

/**
 * @swagger
 * /api/v1/orderdetails:
 *   get:
 *     summary: Retrieve all order details
 *     tags: [OrderDetails]
 *     responses:
 *       200:
 *         description: A list of order details
 *       500:
 *         description: Internal Server Error
 */
router.get("/", controller.getOrderDetails);

/**
 * @swagger
 * /api/v1/orderdetails/{order_detail_id}:
 *   get:
 *     summary: Retrieve an order detail by ID
 *     tags: [OrderDetails]
 *     parameters:
 *       - in: path
 *         name: order_detail_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order detail to retrieve
 *     responses:
 *       200:
 *         description: A single order detail
 *       404:
 *         description: Order detail not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:order_detail_id", controller.getOrderDetailsById);

/**
 * @swagger
 * /api/v1/orderdetails:
 *   post:
 *     summary: Add a new order detail
 *     tags: [OrderDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order detail created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/",
  [
    check("order_id").exists().isInt(),
    check("product_id").exists().isInt(),
    check("quantity").exists().isInt(),
    check("subtotal").exists().isNumeric(),
  ],
  controller.addOrderDetails
);
//put
/**
 * @swagger
 * /api/v1/orderdetails/{order_detail_id}:
 *   put:
 *     summary: Update an order detail by ID
 *     tags: [OrderDetails]
 *     parameters:
 *       - in: path
 *         name: order_detail_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order detail to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               subtotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order detail updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Order detail not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/:order_detail_id",
  [
    check("order_id").optional().isInt(),
    check("product_id").optional().isInt(),
    check("quantity").optional().isInt(),
    check("subtotal").optional().isNumeric(),
  ],
  controller.updateOrderDetails
);

/**
 * @swagger
 * /api/v1/orderdetails/{order_detail_id}:
 *   delete:
 *     summary: Do not use this unless you're cleaning up the table, use delete order which will delete order details too - Remove an order detail by ID
 *     tags: [OrderDetails]
 *     parameters:
 *       - in: path
 *         name: order_detail_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order detail to remove
 *     responses:
 *       200:
 *         description: Order detail removed successfully
 *       404:
 *         description: Order detail not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:order_detail_id", controller.removeOrderDetails);

module.exports = router;
