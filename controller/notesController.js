var store = require("../services/noteStore.js");

module.exports.addNote = function(req, res)
{
    store.add(req.body, (note) => {
        res.json(note.id);
    })
};

module.exports.updateNote = function(req, res)
{
    store.update(req.body, (count) => {
        res.json(count);
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