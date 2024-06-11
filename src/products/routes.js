const { Router } = require("express");
const controller = require("./controller");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Internal Server Error
 */

router.get("/", controller.getProducts);

/**
 * @swagger
 * /api/v1/products/{product_id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: A product object
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:product_id", controller.getProductById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               product_description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

router.post("/", controller.addProduct);

/**
 * @swagger
 * /api/v1/products/{product_id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 nullable: true
 *               product_description:
 *                 type: string
 *                 nullable: true
 *               price:
 *                 type: number
 *                 nullable: true
 *               stock_quantity:
 *                 type: integer
 *                 nullable: true
 *               category_id:
 *                 type: integer
 *                 nullable: true
 *               image_url:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */

router.put("/:product_id", controller.updateProductColumn);

/**
 * @swagger
 * /api/v1/products/{product_id}:
 *   delete:
 *     summary: Remove a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:product_id", controller.removeProduct);

module.exports = router;
