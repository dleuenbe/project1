var express = require('express');
var router = express.Router();
var notes = require('../controller/notesController.js');


router.get("/", notes.allNotes);
router.post("/", notes.addNote);
router.get("/:id/", notes.getNote);

module.exports = router;