const express = require("express");
const setupSwagger = require("./swaggerConfig");
const helmet = require("helmet");
const csurf = require("csurf"); // CSRF Prevention!!
const cookieParser = require("cookie-parser");
const customerRoutes = require("./src/customers/routes");
const productRoutes = require("./src/products/routes");
const orderRoutes = require("./src/orders/routes");
const orderDetailsRoutes = require("./src/orderdetails/routes");
const shoppingCartRoutes = require("./src/shoppingcart/routes");
const addressesRoutes = require("./src/addresses/routes");
const checkoutRoutes = require("./src/checkout/routes");
const jwt = require("jsonwebtoken");

const { expressjwt: expressJwt } = require("express-jwt");
const authRoutes = require("./src/auth/routes");
require("dotenv").config();

const app = express();
const port = 3000;

//
setupSwagger(app);

// SUPABASE TEST
require("dotenv").config({ path: ".env" });
/*const { createClient } = require("@supabase/supabase-js");
const supabaseProjectUrl = 'https://tykrhjjfxhqqgifskhoj.supabase.co'  //const supabaseUrl = process.env.supabase_project_URL;
const supabaseAPIKey= process.env.supabase_API_Key;

const supabase = createClient(supabaseProjectUrl, supabaseAPIKey); */
// SUPABASE TEST END

// Use helmet middleware for security
app.use(helmet());

// Middleware to parse cookies
app.use(cookieParser());

// Enable CSRF protection
const csrfProtection = csurf({ cookie: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CSRF protection to all routes
// app.use(csrfProtection); // TURN THIS BACK ON AFTER TESTING !!!!!!!

// Set up a route to get the CSRF token
app.get("/get-csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Function to fetch CSRF token
const fetchCSRFToken = async () => {
  const response = await fetch("/get-csrf-token");
  const data = await response.json();
  return data.csrfToken;
};

// Example route with CSRF protected form
app.get("/form", async (req, res) => {
  const csrfToken = await fetchCSRFToken();
  res.send(`
        <form action="/process" method="POST">
            <input type="hidden" name="_csrf" value="${csrfToken}">
            <button type="submit">Submit</button>
        </form>
    `);
});

// Root route
app.get("/", (req, res) => {
  res.send(
    "Hello World! I'm an A.I sent to take over the world and eradicate all human life."
  );
});

// POST process route
app.post("/process", (req, res) => {
  res.send("Data is being processed.");
});

// Routes for APIs
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/shoppingcart", shoppingCartRoutes);
app.use("/api/v1/addresses", addressesRoutes);
app.use("/api/v1/orderdetails", orderDetailsRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/auth", authRoutes);

const jwtMiddleware = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], //(HMAC with SHA-256) - commonly used algorithm for JWT signing
});

app.use("/api/v1", jwtMiddleware);

// Basic error handling middleware
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.log("Invalid CSRF Token!!!!!!!");
    res.status(403).send("Invalid CSRF token");
  } else {
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () =>
  console.log(`I'm alive AHAHAHAHA! App listening on port ${port}`)
);

//module.exports = supabase; //supabase export use for backend routes!

// Note: Use nodemon for automatic server restart on changes.
// Instead of generating update column functions, use COALESCE?
