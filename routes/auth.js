const express = require("express");
const User = require("../Models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

const router = express.Router();

// Json Web Tokken
const JWT_SECRET = "harryisagoodboy";

// We want to console req.body so we use a middleware in index.js

// Create a User using : POST "/api/auth" - Doesn't require Auth
router.post(
  "/createuser",
  body("name", "Enter a valid Name").isLength({ min: 3 }),
  body("email", "Email is invalid").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    //   Express validator boiler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a document in db
    // Check whether the user with this email exist
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry : email with same user is already exist !" });
    }

    // Creating a passowrd HASH
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(req.body.password, salt);

    try {
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPassword,
      });

      // document retrival on id is very fast
      const data = {
        id: user.id,
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      // Sending response to client
      res.json({ authToken });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal Server Error Occured");
    }
  }
);

// Authenticate a user using authtoken - No login required
router.post(
  "/login",
  body("email", "Email is invalid").isEmail(),
  body("password", "Password cannot be blank").exists(),
  async (req, res) => {
    //   Express validator boiler - for checking email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Trying to find email in db
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Password comparision
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      } else {
        const data = {
          id: user.id,
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal Server Error Occured");
    }
  }
);
module.exports = router;
