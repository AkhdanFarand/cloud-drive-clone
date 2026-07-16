const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// tambah ini
router.get("/me", authMiddleware, getProfile);

module.exports = router;