var express = require('express');
var router = express.Router();
var notes = require('../controller/notesController.js');


router.get("/", notes.allNotes);
router.get("/:id/", notes.getNote);
router.post("/", notes.addNote);
router.post("/:id/", notes.updateNote);

module.exports = router;