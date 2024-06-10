const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const controller = require("./controller");

router.get("/", controller.getOrderDetails);
router.get("/:order_detail_id", controller.getOrderDetailsById);

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

router.delete("/:order_detail_id", controller.removeOrderDetails);

module.exports = router;
