var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function Note(simpleNote)
{
    this.id = simpleNote.id;
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
            callback(privateSwitchId(savedSimpleNote));
        }
    });
}

function publicGet(id, callback)
{
    db.findOne({ _id: id }, function (err, note) {
        callback( err, privateSwitchId(note));
    });
}

function publicAll(callback)
{
    db.find({}, function (err, simpleNotes) {
        simpleNotes.forEach(n => privateSwitchId(n));
        callback( err, simpleNotes);
    });
}

function privateSwitchId(simpleNote) {
    simpleNote.id = simpleNote._id;
    simpleNote._id = undefined;
    return simpleNote;
}

module.exports = {add : publicAdd, get : publicGet, all : publicAll};