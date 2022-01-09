const express = require("express");
const fetchuser = require("../Middleware/fetchuser");
const Notes = require("../Models/Notes");
const { body, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

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

// Route 3 : delete a note : Logged in Required
router.get("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const note = await Notes.deleteOne({ _id: req.params.id });
    console.log(note.deletedCount);

    if (note.deletedCount) {
      res.status(200).send("Successfully Deleted");
    } else {
      res.status(500).send("Note desn't exist");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// Route 4 : Updata a note : Logged in Required
router.post("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const note = await Notes.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          tag: req.body.tag,
        },
      }
    );

    if (note.modifiedCount) {
      res.status(200).send("Successfully Updated");
    } else {
      res.status(500).send("Note desn't exist");
    }
  } catch (err) {
    res.status(400).send("Internal Server Error");
  }
});

module.exports = router;
