/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.notesService = (function (storageService, note) {

        var notes = [];
        var filterShowFinished = true;
        var orderByField = "dueDate";
        var loaded = false;

        function publicOrderByField(fieldName) {
            orderByField = fieldName;
        }

        function publicSetFilterState(state) {
            filterShowFinished = !!state;
        }

        function publicGetVisibleNotesOrdered(callback) {
            storageService.getAll((notes) => {
                callback(notes.filter(n => filterShowFinished || !n.finishedDate).sort(privateCompareById));
            });
        }

        function privateCompareById(n1, n2) {
            return n2[orderByField] == n1[orderByField] ? 0 : n2[orderByField] < n1[orderByField] ? -1 : 1;
        }

        function publicUpdateNote(note, callback) {
            storageService.save(note, callback);
        }

        function publicCreateNewNote() {
            return note.createNote();
        }

        function publicConvertToNote(simpleNote) {
            return note.createNote(simpleNote);
        }

        function publicGetNoteById(id, callback) {
            storageService.get(id, (note) => callback(note));
        }

        return {
            orderByField: publicOrderByField,
            setFilterState: publicSetFilterState,
            getVisibleNotesOrdered: publicGetVisibleNotesOrdered,
            updateNote: publicUpdateNote,
            createNewNote: publicCreateNewNote,
            convertToNote: publicConvertToNote,
            getNoteById: publicGetNoteById
        };

    })(namespace.serverStorageService, namespace.note);
}) (window.notesAppNamespace = window.notesAppNamespace || {});
