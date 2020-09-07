const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const users = require("./routes/api/userItem");
const pantries = require("./routes/api/pantryItem");
const donations = require("./routes/api/donateItem");
const sales = require("./routes/api/saleItem");
const notifications = require("./routes/api/notificationItem");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect to mongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected...");
});

// Use Routes
app.use("/api/userItem", users);
app.use("/api/pantryItem", pantries);
app.use("/api/donateItem", donations);
app.use("/api/saleItem", sales);
app.use("/api/notificationItem", notifications);

//Serve static asset if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("pp-react/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "pp-react", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
