const express = require('express');
const customerRoutes = require("./src/customers/routes");
const productRoutes = require("./src/products/routes");
const orderRoutes = require("./src/orders/routes");

const { check } = require('express-validator');
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World! I'm an A.I sent to take over the world and eradicate all human life.");
});

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

app.listen(port, () => console.log(`I'm alive AHAHAHAHA! App listening on port ${port}`));