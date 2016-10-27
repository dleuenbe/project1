var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function Note(simpleNote)
{
    this.createDate = simpleNote.createDate;
    this.dueDate = simpleNote.dueDate;
    this.finishedDate = simpleNote.finishedDate;
    this.title = simpleNote.title;
    this.description = simpleNote.description;
    this.priority = simpleNote.priority;
}

function publicAdd(simpleNote, callback)
{
    var note= new Note(simpleNote);
    db.insert(note, function(err, savedSimpleNote){
        if(callback){
            callback(replaceId(savedSimpleNote));
        }
    });
}

function publicUpdate(simpleNote, callback)
{
    var note= new Note(simpleNote);
    db.update({ _id: simpleNote.id}, note, {}, (err, numReplaced) => {
       if (callback) {
            callback(numReplaced);
        }
    });
}

function publicGet(id, callback)
{
    db.findOne({ _id: id }, function (err, note) {
        callback( err, replaceId(note));
    });
}

function publicAll(callback)
{
    db.find({}, function (err, simpleNotes) {
        simpleNotes.forEach(n => replaceId(n));
        callback( err, simpleNotes);
    });
}

function replaceId(simpleNote) {
    simpleNote.id = simpleNote._id;
    delete simpleNote._id;
    return simpleNote;
}

module.exports = {add : publicAdd, update: publicUpdate, get : publicGet, all : publicAll};