// External variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { requireAuth } = require("./Middleware/authMiddleware");
mongoose.set("strictQuery", false);
const multer = require("multer"); // Import multer here
const storage = multer.memoryStorage();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
//database or json file
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
]); //database json file

const upload = multer({ storage });
const cookieParser = require("cookie-parser");

const MongoURI = process.env.MONGO_URI;

//App variables
const app = express();
const port = process.env.PORT || "8000";
// #Importing the userController

// configurations
// Mongo DB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.clearCookie('token');
  res.status(200).send("Welcome to el7a2ni");
});
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/sucess.html`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const administratorRoutes = require("./Routes/administrator"); //to import the router that was exported from administrator.js
app.use("/api/administrator", administratorRoutes);

const guestRoutes = require("./Routes/guest");
app.use("/api/guest", guestRoutes);

const pharmacistRoutes = require("./Routes/pharmacist");
app.use("/api/pharmacist", pharmacistRoutes);

const patientRoutes = require("./Routes/patient");
app.use("/api/patient", patientRoutes);

app.get("/pharmacist", requireAuth);
app.get("/patient", requireAuth);
app.get("/admin", requireAuth);
