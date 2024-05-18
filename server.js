const express = require('express');
const helmet = require('helmet');
const csurf = require('csurf'); // CSRF Prevention!!
const cookieParser = require('cookie-parser');
const customerRoutes = require("./src/customers/routes");
const productRoutes = require("./src/products/routes");
const orderRoutes = require("./src/orders/routes");

const app = express();
const port = 3000;

// Use helmet middleware for security
app.use(helmet());

// Middleware to parse cookies
app.use(cookieParser());

// Enable CSRF protection
const csrfProtection = csurf({ cookie: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CSRF protection to all routes
app.use(csrfProtection);

// Set up a route to get the CSRF token
app.get('/get-csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Example route with CSRF protected form
app.get("/form", (req, res) => {
    res.send(`
        <form action="/process" method="POST">
            <input type="hidden" name="_csrf" value="${req.csrfToken()}">
            <button type="submit">Submit</button>
        </form>
    `);
});

// Root route
app.get("/", (req, res) => {
    res.send("Hello World! I'm an A.I sent to take over the world and eradicate all human life.");
});

// POST process route
app.post("/process", (req, res) => {
    res.send("Data is being processed.");
});

// Routes for APIs
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('Invalid CSRF token');
    } else {
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => console.log(`I'm alive AHAHAHAHA! App listening on port ${port}`));


/* Notes:
    nodemon restarts server anytime there are changes made int oa backend file

*/
