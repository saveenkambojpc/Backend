const express = require("express");
const fetchuser = require("../Middleware/fetchuser");
const Notes = require("../Models/Notes");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Route 1: Create a new Note : Loggedin required
router.post(
  "/addnote",
  fetchuser,
  body("title").isLength({ min: 3 }),
  fetchuser,
  async (req, res) => {
    //   Express validator boiler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Creating a document
      // Using Destructuring
      // const user = req.user.id;
      // const {title, description,tag} = req.body
      // let note = await Notes.create({user,title,description,tag})

      let note = await Notes.create({
        user: req.user.id, // req.user.id -> comes from fetchuser
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });
      res.send(note);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal Server Error Occured");
    }
  }
);

// Route 2 : fetchallnotes fetch all notes of user which were already logged in : Logged in Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json({ notes });
});

module.exports = router;
