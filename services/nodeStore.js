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
    db.insert(note, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicGet(id, callback)
{
    db.findOne({ _id: id }, function (err, doc) {
        callback( err, doc);
    });
}

function publicAll(callback)
{
    db.find({}, function (err, docs) {
        callback( err, docs);
    });
}

module.exports = {add : publicAdd, get : publicGet, all : publicAll};