const { Router } = require("express");
const { check } = require("express-validator");
const controller = require("./controller");
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address management
 */

/**
 * @swagger
 * /api/v1/addresses/:
 *   get:
 *     summary: Retrieve a list of addresses
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: A list of addresses
 */
router.get("/", controller.getAddresses);

/**
 * @swagger
 * /api/v1/addresses/{address_id}:
 *   get:
 *     summary: Retrieve an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to retrieve
 *     responses:
 *       200:
 *         description: A single address
 */
router.get("/:address_id", controller.getAddressById);

/**
 * @swagger
 * /api/v1/addresses/customer/{customer_id}:
 *   get:
 *     summary: Retrieve addresses by customer ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer whose addresses to retrieve
 *     responses:
 *       200:
 *         description: A list of addresses for the customer
 */
router.get("/customer/:customer_id", controller.getAddressesByCustomerId);

/**
 * @swagger
 * /api/v1/addresses/:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 description: The ID of the customer
 *               address_type:
 *                 type: string
 *                 description: The type of the address (e.g., Shipping, Billing)
 *               address_line_1:
 *                 type: string
 *                 description: The first line of the address
 *               address_line_2:
 *                 type: string
 *                 nullable: true
 *                 description: The second line of the address (optional)
 *               city:
 *                 type: string
 *                 description: The city of the address
 *               country:
 *                 type: string
 *                 description: The country of the address
 *               postcode:
 *                 type: string
 *                 description: The postcode of the address
 *     responses:
 *       201:
 *         description: Address created successfully
 */
router.post(
  "/",
  [
    check("customer_id").exists().isInt(),
    check("address_type").exists().isString(),
    check("address_line_1").exists().isString(),
    check("address_line_2").optional().isString(),
    check("city").exists().isString(),
    check("country").exists().isString(),
    check("postcode").exists().isString(),
  ],
  controller.addAddress
);

/**
 * @swagger
 * /api/v1/addresses/{address_id}:
 *   delete:
 *     summary: Remove an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to remove
 *     responses:
 *       200:
 *         description: Address removed successfully
 */
router.delete("/:address_id", controller.removeAddress); //Remove Address by Address ID not Customer ID!!!

/**
 * @swagger
 * /api/v1/addresses/{address_id}:
 *   put:
 *     summary: Update an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to update
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
 *                 description: The ID of the customer
 *               address_type:
 *                 type: string
 *                 nullable: true
 *                 description: The type of the address (e.g., Shipping, Billing)
 *               address_line_1:
 *                 type: string
 *                 nullable: true
 *                 description: The first line of the address
 *               address_line_2:
 *                 type: string
 *                 nullable: true
 *                 description: The second line of the address (optional)
 *               city:
 *                 type: string
 *                 nullable: true
 *                 description: The city of the address
 *               country:
 *                 type: string
 *                 nullable: true
 *                 description: The country of the address
 *               postcode:
 *                 type: string
 *                 nullable: true
 *                 description: The postcode of the address
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Address not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.put(
  "/:address_id",
  [
    check("customer_id").optional().isInt(),
    check("address_type").optional().isString(),
    check("address_line_1").optional().isString(),
    check("address_line_2").optional().isString(),
    check("city").optional().isString(),
    check("country").optional().isString(),
    check("postcode").optional().isString(),
  ],
  controller.updateAddress
);

module.exports = router;
