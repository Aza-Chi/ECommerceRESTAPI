const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const controller = require("./controller");

/**
 * @swagger
 * tags:
 *   name: Shopping Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/v1/shoppingcart:
 *   get:
 *     summary: Retrieve all shopping carts
 *     tags: [Shopping Cart]
 *     responses:
 *       200:
 *         description: A list of shopping carts
 *       500:
 *         description: Internal Server Error
 */
router.get("/", controller.getCarts);

/**
 * @swagger
 * /api/v1/shoppingcart/customer/{customer_id}:
 *   get:
 *     summary: Retrieve shopping cart by customer ID
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer whose shopping cart to retrieve
 *     responses:
 *       200:
 *         description: A shopping cart object
 *       500:
 *         description: Internal Server Error
 */
router.get("/customer/:customer_id", controller.getCartByCustomerId); //http://localhost:3000/api/v1/shoppingcart/customer/1

/**
 * @swagger
 * /api/v1/shoppingcart/{cart_id}:
 *   delete:
 *     summary: Remove an item from the shopping cart
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the shopping cart item to remove
 *     responses:
 *       200:
 *         description: Shopping cart item removed successfully
 *       404:
 *         description: Shopping cart item not found
 *       500:
 *         description: Internal Server Error
 */

router.delete("/:cart_id", controller.removeCart);
//router.delete('/customer/:customer_id', controller.removeCartByCustomerId); //http://localhost:3000/api/v1/shoppingcart/customer/1

/**
 * @swagger
 * /api/v1/shoppingcart:
 *   post:
 *     summary: Add a new item to the shopping cart
 *     tags: [Shopping Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Shopping cart item added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/",
  [
    check("customer_id").exists().isInt(),
    check("product_id").exists().isInt(),
    check("quantity").exists().isInt(),
  ],
  controller.addCart
);

/**
 * @swagger
 * /api/v1/shoppingcart/{cart_id}:
 *   put:
 *     summary: Update a shopping cart item by ID
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the shopping cart item to update
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
 *               product_id:
 *                 type: integer
 *                 nullable: true
 *               quantity:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Shopping cart item updated successfully
 *       404:
 *         description: Shopping cart item not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/:cart_id",
  [
    check("customer_id").optional().isInt(),
    check("product_id").optional().isInt(),
    check("quantity").optional().isInt(),
  ],
  controller.updateCartColumn
);

module.exports = router;
