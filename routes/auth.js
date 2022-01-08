const express = require("express");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// We want to console req.body so we use a middleware in index.js

// Create a User using : POST "/api/auth" - Doesn't require Auth
router.post(
  "/",
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

    try {
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.email,
      });

      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Some Error Occured");
    }

  }
);

module.exports = router;
