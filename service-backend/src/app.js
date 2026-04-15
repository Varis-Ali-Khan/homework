const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/auth", authRoutes);
app.use("/providers", providerRoutes);

module.exports = app;