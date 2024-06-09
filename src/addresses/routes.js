const { Router } = require("express");
const { check } = require("express-validator");
const controller = require("./controller");
const router = Router();

router.get("/", controller.getAddresses);
router.get("/:address_id", controller.getAddressById);
router.get("/customer/:customer_id", controller.getAddressesByCustomerId);

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

router.delete("/:address_id", controller.removeAddress); //Remove Address by Address ID not Customer ID!!!

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
