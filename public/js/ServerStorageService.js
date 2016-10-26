/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.serverStorageService = (function ($) {

        function publicSaveEntry(note, callback) {
            $.get({method: 'post', url: '/notes/'+id}).done((note) => {
                callback(note);
            });
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

        function publicGetEntry(id, callback) {
            $.getJSON({url: '/notes/'+id}).done((note) => {
                callback(note);
            });
        }

        function publicGetAll(callback) {
            $.getJSON({url: '/notes/'}).done((notes) => {
                callback(privateRemoveNoteWithoutId(notes));
            });
        }

        return {
            save: publicSaveEntry,
            get: publicGetEntry,
            getAll: publicGetAll
        };
    })(jQuery);
}) (window.notesAppNamespace = window.notesAppNamespace || {});
