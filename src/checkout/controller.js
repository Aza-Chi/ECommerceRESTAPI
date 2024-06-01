const pool = require('../../db'); 
const queriesOrders = require("../orders/queries");
const queriesOrderDetails = require("../orderdetails/queries");
const queriesShoppingCart = require("../shoppingcart/queries");
const queriesProducts = require("../products/queries");

const processCheckout = async (req, res) => {
  const client = await pool.connect(); // Create a client from the pool for transaction management! We can rollback a transaction if payment fails 
  try {
    // Begin transaction - transaction management - Using a client object in this way ensures that all operations between BEGIN and COMMIT/ROLLBACK are executed atomically
    console.log("Beginning Transaction");
    await client.query('BEGIN');
    
    // Extract info from request body
    console.log("Extracting Info from Req Body");
    const { customer_id, address_id, paymentInfo } = req.body;

    // Fetch cart items for the user
    console.log("Fetching cart items");
    const cartItemsResult = await client.query(queriesShoppingCart.getCartByCustomerId, [customer_id]);
    const cartItems = cartItemsResult.rows;

    if (!cartItems || cartItems.length === 0) {
      console.log("Cart is empty");
      await client.query('ROLLBACK'); // Rollback transaction if cart is empty
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price and validate stock
    console.log("Calculating Total Price");
    let totalPrice = 0;
    for (const item of cartItems) {
      const productResult = await client.query(queriesProducts.getProductById, [item.product_id]);
      const product = productResult.rows[0];
      console.log("Validating Stock");
      if (product.stock_quantity < item.quantity) {
        console.log("Stock quantity is: " + product.stock_quantity);
        console.log("Item quantity is: " + item.quantity);
        console.log("Stock is insufficient!");
        await client.query('ROLLBACK'); // Rollback transaction if stock is insufficient
        return res.status(400).json({
          message: `Insufficient stock for product ${product.product_name}`,
        });
      }
      totalPrice += product.price * item.quantity;
      console.log("Total price is: " + totalPrice);
      // Store the product in the item for later use
      item.product = product;
    }

    // Create new order
    console.log("Creating new order");
    const orderResult = await client.query(queriesOrders.addOrder, [
      customer_id,
      totalPrice,
      address_id,
      0
    ]);
    const order = orderResult.rows[0];

    // Add order details
    console.log("Adding order details");
    for (const item of cartItems) {
      await client.query(queriesOrderDetails.addOrderDetails, [
        order.order_id,
        item.product_id,
        item.quantity
      ]);
      // Update product stock
      console.log("Updating product stock quantity");
      await client.query(queriesProducts.updateProductStockQuantity, [
        item.product.stock_quantity - item.quantity,
        item.product_id
      ]);
    }

    // Clear customer's cart
    console.log("Clearing customer cart");
    await client.query(queriesShoppingCart.removeCartByCustomerId, [customer_id]);

    // Process payment (simplified)
    console.log("Processing payment");
    const paymentResult = processPayment(paymentInfo, totalPrice);
    if (!paymentResult.success) {
      await client.query('ROLLBACK'); // Rollback transaction if payment fails
      console.log("Payment failed");
      return res.status(400).json({ message: "Payment failed" });
    }

    // Commit transaction
    console.log("Commiting transaction");
    await client.query('COMMIT');
    console.log("Checkout successful");
    res.status(200).json({ message: "Checkout successful", order });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error("Checkout error:", error);
    console.log("We messed up!");
    res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("Releasing client");
    client.release(); // Release the client back to the pool
  }
};

const processPayment = (paymentInfo, totalPrice) => {
  // Simulate payment processing
  // In a real app, integrate with a payment gateway
  console.log("Processing a pretend payment");
  return { success: true };
};

module.exports = {
  processCheckout,
};