const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const authMiddleware = require("./src/middlewares/authMiddleware");
const fileRoutes = require("./src/routes/fileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

  res.json({
    message: "Cloud Drive API Running"
  });

});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  });

app.listen(PORT, () => {

  console.log(`Server berjalan di port ${PORT}`);

});