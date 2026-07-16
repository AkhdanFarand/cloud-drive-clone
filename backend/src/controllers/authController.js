const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      User.create(
        {
          name,
          email,
          password: hashedPassword,
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Gagal register",
              error: err.message,
            });
          }
  
          res.status(201).json({
            success: true,
            message: "Register berhasil",
            userId: result.insertId,
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


const getProfile = (req, res) => {

    User.findById(req.user.id, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const user = results[0];

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    });

};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    User.findByEmail(email, async (err, results) => {
        if (err) {
            console.error(err);
          
            return res.status(500).json({
              success: false,
              message: "Database error",
              error: err.message,
            });
          }
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Email tidak ditemukan",
        });
      }
  
      const user = results[0];
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Password salah",
        });
      }
  
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
  
      res.json({
        success: true,
        message: "Login berhasil",
        token,
      });
    });
  };

module.exports = {
  register,
  login,
  getProfile,
};