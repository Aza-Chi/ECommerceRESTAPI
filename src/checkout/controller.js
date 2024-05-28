const queriesOrders = require('../orders/queries');
const queriesOrderDetails = require('../orderdetails/queries');
const queriesShoppingCart = require('../shoppingcart/queries');
const queriesProducts = require('../products/queries');
const queriesAddresses = require('../addresses/queries');

const processCheckout = async (req, res) => {
    try {
        // Extract info from request body
        const { customer_id, address_id, paymentInfo } = req.body;

        // Fetch cart items for the user
        const cartItems = await queriesShoppingCart.getCartByCustomerId(customer_id);

        if (!cartItems || cartItems.length === 0) {
            console.log('Cart is emptyyyyyyyyyyyy!!!!');
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total price and validate stock
        let totalPrice = 0;
        for (const item of cartItems) {
            const product = await queriesProducts.getProductById(item.product_id);
            if (product.stock_quantity < item.quantity) {
                console.log('Stock quantity is: ' + product.stock_quantity);
                console.log('Item quantity is: ' + item.quantity);
                console.log('Stock === 0, refill the stock!');
                return res.status(400).json({ message: `Insufficient stock for product ${product.product_name}` });
            }
            totalPrice += product.price * item.quantity;
        }

        // Create new order
        const order = await queriesOrders.addOrder(customer_id, address_id, totalPrice);


        //////////////////////
        // Add order details - TO BE CONTINUED ! 

        
module.exports = {
    processCheckout,
};