const pool = require("../../db");
const queriesOrders = require("../orders/queries");
const queriesOrderDetails = require("../orderdetails/queries");
const queriesShoppingCart = require("../shoppingcart/queries");
const queriesProducts = require("../products/queries");
const controllerProducts = require("../products/controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processCheckout = async (req, res) => {
  const client = await pool.connect(); // Create a client from the pool for transaction management! We can rollback a transaction if payment fails
  try {
    // Begin transaction - transaction management - Using a client object in this way ensures that all operations between BEGIN and COMMIT/ROLLBACK are executed atomically
    console.log("Beginning Transaction");
    await client.query("BEGIN");

    // Extract info from request body
    console.log("Extracting Info from Req Body");
    const { address_id, paymentInfo } = req.body;
    const customer_id = req.user.id; // Get customer_id from the token

    // Fetch cart items for the user
    console.log("Fetching cart items");
    const cartItemsResult = await client.query(
      queriesShoppingCart.getCartByCustomerId,
      [customer_id]
    );
    const cartItems = cartItemsResult.rows;

    if (!cartItems || cartItems.length === 0) {
      console.log("Cart is empty");
      await client.query("ROLLBACK"); // Rollback transaction if cart is empty
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price and validate stock
    console.log("Calculating Total Price");
    let totalPrice = 0;
    for (const item of cartItems) {
      const productResult = await client.query(queriesProducts.getProductById, [
        item.product_id,
      ]);
      const product = productResult.rows[0];
      console.log("Validating Stock");
      if (product.stock_quantity < item.quantity) {
        console.log("Stock quantity is: " + product.stock_quantity);
        console.log("Item quantity is: " + item.quantity);
        console.log("Stock is insufficient!");
        await client.query("ROLLBACK"); // Rollback transaction if stock is insufficient
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
      0,
    ]);

    console.log("Order Result:", orderResult.rows);

    if (!orderResult.rows || orderResult.rows.length === 0) {
      console.log("Failed to create order");
      await client.query("ROLLBACK");
      return res.status(500).json({ message: "Failed to create order" });
    }

    const order = orderResult.rows[0];

    if (!order || !order.order_id) {
      console.log("Order ID is undefined");
      await client.query("ROLLBACK");
      return res.status(500).json({ message: "Failed to retrieve order ID" });
    }

    const order_id = order.order_id;

  /*Add order Details */
    console.log("Adding order details");
    for (const item of cartItems) {
      const price = await controllerProducts.getProductPriceById(
        item.product_id
      );
      const subtotal = price * item.quantity;
      await client.query(queriesOrderDetails.addOrderDetails, [
        order_id, 
        item.product_id,
        item.quantity,
        subtotal,
      ]);
      // Update product stock
      console.log("Updating product stock quantity");
      await client.query(queriesProducts.updateProductStockQuantity, [
        item.product.stock_quantity - item.quantity,
        item.product_id,
      ]);
    }

    // Clear customer's cart
    console.log("Clearing customer cart");
    await client.query(queriesShoppingCart.removeCartByCustomerId, [
      customer_id,
    ]);

    // Process payment (simplified)
    console.log("Processing payment");
    const paymentResult = processPayment(paymentInfo, totalPrice);
    if (!paymentResult.success) {
      await client.query("ROLLBACK"); // Rollback transaction if payment fails
      console.log("Payment failed");
      return res.status(400).json({ message: "Payment failed" });
    }

    // Commit transaction
    console.log("Committing transaction");
    await client.query("COMMIT");
    console.log("Checkout successful");
    res.status(200).json({ message: "Checkout successful", order });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction on error
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

/*************************************************************************/
/******************************** STRIPE *********************************/
/*gets the order id, queries pool for order by order_id,   */
const createPaymentSession = async (req, res) => {
  try {
    console.log(`checkout.js - createpaymentsession req.data: `, req.data);
    //const orderId = req.query.order_id; // this is wrong 
    //console.log(`checkout.js - createpaymentsession orderId: `, orderId);
    //const orderData = await pool.query(queriesOrders.getOrderById(orderId));
    //console.log(`checkout.js - createpaymentsession orderData: `, orderData);
    //1. get customerID
    // Extract info from request body
    console.log("Extracting Info from Req Body");
    const { address_id, order_id } = req.body;
    if (!address_id || !order_id) {
      console.log("Missing address_id or order_id in the request body");
      return res.status(400).json({ message: "Missing address_id or order_id" });
    }
    console.log(`checkout.js - createpaymentsession address_id: `, address_id);
    const customer_id = req.user.id; // Get customer_id from the token
    console.log(`checkout.js - createpaymentsession customer_id: `, customer_id);
    //2. Get cart data by customer ID - 
    // Fetch cart items for the user
    console.log("Fetching cart items");
    const cartItemsResult = await pool.query(
      queriesShoppingCart.getCartByCustomerId,
      [customer_id]
    );
    const cartItems = cartItemsResult.rows;
    console.log(`checkout.js - createpaymentsession cartItemsResult: `, cartItemsResult);

    if (!cartItems || cartItems.length === 0) {
      console.log("Cart is empty");
      return res.status(400).json({ message: "Cart is empty" });
    }

    
   // Calculate total price and validate stock also //from cart data get product id, item quantity
   console.log("Calculating Total Price");
   let totalPrice = 0;
   let cartData = [];
   for (const item of cartItems) {
     const productResult = await pool.query(queriesProducts.getProductById, [
       item.product_id,
     ]);
     const product = productResult.rows[0];
     console.log("Validating Stock");
     if (product.stock_quantity < item.quantity) {
       console.log("Stock quantity is: " + product.stock_quantity);
       console.log("Item quantity is: " + item.quantity);
       console.log("Stock is insufficient!");
       return res.status(400).json({
         //3. Get product id -> product_name, price
         message: `Insufficient stock for product ${product.product_name}`,
       });
     }
     //4. calculate product price * quantity
     totalPrice += product.price * item.quantity;
     //console.log(`Total price of ${product.product_name} x ${item.quantity} is:  ${totalPrice}`);
     const tempTotal = product.price * item.quantity;
     console.log(`Total price of ${product.product_name} is ${product.price} x ${item.quantity} is:  ${tempTotal}`);
     const productName = product.product_name;
     const itemQuantity = item.quantity;
     const productPrice = product.price;
     //const  totalPr
     cartData.push({productName, itemQuantity, productPrice, tempTotal });
     // Store the product in the item for later use
     item.product = product;
     //console.log(`item.product: `, item.product);
    }
   console.log(`checkout.js - createpaymentsession calculated total price: `, totalPrice);
   console.log(`checkout.js - createpaymentsession cartData: `, cartData);
   /* Example cartData 
cartData:  [
  {
    productName: 'Video Tapes 5',
    itemQuantity: 10,
    productPrice: '14.00',
    tempTotal: 140
  },
  {
    productName: 'Video Tapes',
    itemQuantity: 20,
    productPrice: '19.00',
    tempTotal: 380
  },
  {
    productName: 'Pizza',
    itemQuantity: 38,
    productPrice: '120.00',
    tempTotal: 4560
  }
]
   */

/* Add Order Details */
  
  console.log("Adding order details");
  for (const item of cartItems) {
    const price = await controllerProducts.getProductPriceById(
      item.product_id
    );
    const subtotal = price * item.quantity;
    await pool.query(queriesOrderDetails.addOrderDetails, [
      order_id, 
      item.product_id,
      item.quantity,
      subtotal,
    ]);
    // Update product stock
    console.log("Updating product stock quantity");
    await pool.query(queriesProducts.updateProductStockQuantity, [
      item.product.stock_quantity - item.quantity,
      item.product_id,
    ]);
  }

  // Clear customer's cart
  console.log("Clearing customer cart");
  await pool.query(queriesShoppingCart.removeCartByCustomerId, [
    customer_id,
  ]);

/*  */



    // Generate checkout session using the cartData 
    console.log(`checkout.js - createpaymentsession generating checkout session data:`);
    const cartItemsData = cartData.map((item) => {
      return {
        price_data: {
          currency: "gbp", // ISO currency code in lowercase
          product_data: {
            name: item.productName,
          },
          unit_amount: Number(item.productPrice) * 100, // Convert price to pence
        },
        quantity: Number(item.itemQuantity),
      };
    });
    console.log(`checkout.js - createpaymentsession cartItemsData generated: `, cartItemsData);


    console.log(`checkout.js - createpaymentsession attempting to create stripe checkout session, order_id: `, order_id);
    const orderIdStr = String(order_id);
    console.log("checkout.js Order ID Type:", typeof order_id); // Log the type of order_id
    console.log("checkout.js OrderIdstr Type:", typeof orderIdStr); // Log the type of order_id
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: cartItemsData,
      mode: "payment",
      return_url: `${process.env.FRONT_END_BASE_URL}/checkout/${orderIdStr}/payment-return?session_id={CHECKOUT_SESSION_ID}`, // Need to fix this in front end 
    });

    res.send({ clientSecret: session.client_secret });
  } catch (err) {
    console.error(`checkout.js - createpaymentsession error: `, err); // Detailed error logging
    res.status(500).json({ message: "Failed to create payment session", error: err.message });
  }
};

/* */

const getPaymentSessionStatus = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    res.send({ status: session.status });
  } catch (err) {
    res.status(500).send();
  }
};

/* */

const confirmPaidOrder = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    if (session.status === "complete") {
      const orderId = req.query.order_id;
      if (!orderId) {
        throw new Error(
          "Order ID not included in request; order status could not be updated."
        );
      }
      const orderStatus = await db.getOrderStatus(orderId);
      if (orderStatus === "payment pending") {
        await pool.confirmPaidOrder(orderId);
      }
    }
    res.send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

/******************************** STRIPE END *********************************/

module.exports = {
  processCheckout,
  createPaymentSession,
  getPaymentSessionStatus,
  confirmPaidOrder,
};
