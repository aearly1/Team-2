const express = require("express");
const config = require("config");
const auth = require("../middleware/auth_diab");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/staffMembers");
const e = require("express");

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  // when we include auth as a second parameter, middleware/auth.js is run, and therefore it is now secure
  // -Diab
  
  try {
    const user = await User.findOne({"id": req.user.id }).select("-password");
    //^^ Important Note: "user" variable does NOT contain the password now, only the token
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});




// @route   POST api/auth
// @desc    Auth user & get token (Login)
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //^^ we have to do this for routes that are going
    //to accept data and need validation  
    //- Diab

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, type} = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" });
      }
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          firstLogin: user.firstLogin
        },
      };

      //expiresIn is the time in minutes after which a token expires
      //When token expires the user has to log in again
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
