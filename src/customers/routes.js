const { Router } = require("express");
const controller = require("./controller");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /api/v1/customers/:
 *   get:
 *     summary: Retrieve a list of customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers
 */
router.get("/", controller.getCustomers);

/**
 * @swagger
 * /api/customers/:
 *   post:
 *     summary: Add a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 */

router.post("/", controller.addCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer to retrieve
 *     responses:
 *       200:
 *         description: A single customer
 *       404:
 *         description: Customer not found
 */
router.get("/:id", controller.getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Customer not found
 */
router.put("/:id", controller.updateCustomerColumn);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Remove a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer to remove
 *     responses:
 *       200:
 *         description: Customer removed successfully
 *       404:
 *         description: Customer not found
 */
router.delete("/:id", controller.removeCustomer);

module.exports = router;
