/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.localStorageService = (function () {

        function publicSaveEntry(note, callback) {
            var notes;
            publicGetAll((allNotes) => notes = allNotes);
            if (note.id == undefined || note.id == "") {
                note.id = privateGetNextId();
            }
            privateUpdateNoteArray(notes, note);
            localStorage.setItem("notes", JSON.stringify(notes));
            callback(note.id);
        }

        function privateUpdateNoteArray(notes, note) {
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].id == note.id) {
                    notes.splice(i, 1, note);
                    return;
                }
            }
            notes.push(note);
         }

        function privateGetNextId() {
            var notes;
            publicGetAll((allNotes) => notes = allNotes);
            if (notes.length == 0) {
                return 0;
            }
            return Math.max.apply(Math, notes.map(function (n) {
                    return n.id;
                })) + 1;
        }

        function publicGetEntry(id, callback) {
            publicGetAll((notes) => callback(notes.filter((n) => n.id == id)[0]));
        }

        function publicGetAll(callback) {
            var notesFromLocalStorageString = localStorage.getItem("notes");
            if (notesFromLocalStorageString === null) {
                notesFromLocalStorageString=defaultNotesFromJS;
            }
            var notesFromLocalStorageObjects = JSON.parse(notesFromLocalStorageString);
            var notesFromLocalStorageNoteObjects = privateConvertToNotes(notesFromLocalStorageObjects);
            callback(notesFromLocalStorageNoteObjects);
        }

        function privateConvertToNotes(inputObjects) {
            return inputObjects.map(n => namespace.note.createNote(n));
        }

        return {
            save: publicSaveEntry,
            get: publicGetEntry,
            getAll: publicGetAll
        };
    })();
}) (window.notesAppNamespace = window.notesAppNamespace || {});
