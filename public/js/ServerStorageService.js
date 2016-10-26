/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.serverStorageService = (function ($) {

        function publicSaveEntry(note, callback) {
            $.post({url: '/notes/'+note.id+'/', data: note}).done((id) => {
                callback(id);
            });
        }

        function privateConvertToNotes(inputObjects) {
            return inputObjects.map(n => namespace.note.createNote(n));
        }

        function publicGetEntry(id, callback) {
            $.getJSON({url: '/notes/'+id+'/'}).done((note) => {
                callback(namespace.note.createNote(note));
            });
        }

        function publicGetAll(callback) {
            $.getJSON({url: '/notes/'}).done((notes) => {
                callback(privateConvertToNotes(notes));
            });
        }

        return {
            save: publicSaveEntry,
            get: publicGetEntry,
            getAll: publicGetAll
        };
    })(jQuery);
}) (window.notesAppNamespace = window.notesAppNamespace || {});
