const express = require("express");
const config = require("config");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/staffMembers");
const { v4: uuidv4 } = require('uuid');

// @route   POST api/user
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a vaild email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //^^ we have to do this for routes that are going
    //to accept data and need validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
    let id = uuidv4();
    //^^ Generate a new ID to give it to the user
      user = new User({
        name,
        email,
        password,
        id
      });
      
      //we need salt to encrypt a password
      //hashing takes some time so we need to await it
      // - Diab
      const salt = await bcrypt.genSalt(10);
      

      user.password = await bcrypt.hash(password, salt);
      await user.save();
      
      const payload = {
        user: {
            id: user.id,
        },
      };
      //expiresIn is the time in minutes after which a token expires
      // - Diab
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
