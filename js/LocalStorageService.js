/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.localStorageService = (function () {

        function publicSaveEntry(note) {
            var notes = publicGetAll();
            privateUpdateNote(notes, note);
            localStorage.setItem("notes", JSON.stringify(privateRemoveNoteWithoutId(notes)));
        }

        function privateRemoveNoteWithoutId(notes) {
            return notes.filter(n => !isNaN(n.id));
        }

        function privateUpdateNote(notes, note) {
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].id == note.id) {
                    notes.splice(i, 1, note);
                    return;
                }
            }
            notes.push(note);
        }

        function publicGetEntry(id) {
            var notesFromLocalStorage = localStorage.getItem("notes");
            return notesFromLocalStorage.filter((pos, i) => i.id == id)[0];
        }

        function publicGetAll() {
            var notesFromLocalStorage = localStorage.getItem("notes");
            if (notesFromLocalStorage === null) {
                return defaultNotesFromJS;
            }
            return privateRemoveNoteWithoutId(JSON.parse(notesFromLocalStorage));
        }

        return {
            save: publicSaveEntry,
            get: publicGetEntry,
            getAll: publicGetAll
        };
    })();
}) (window.notesAppNamespace = window.notesAppNamespace || {});
