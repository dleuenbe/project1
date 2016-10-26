var store = require("../services/nodeStore.js");

module.exports.addNote = function(req, res)
{
    store.add(req.body, (note) => {
        res.json(note.id);
    })
};

module.exports.getNote = function(req, res)
{
    store.get(req.params.id, function(err, note) {
        res.json(note);
    });
};

module.exports.allNotes = function(req, res)
{
    store.all(function(err, notes) {
        res.json(notes);
    });
};