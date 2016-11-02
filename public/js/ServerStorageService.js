/**
 * Created by david on 07.10.16.
 */
jQuery.noConflict();
;(function(namespace, $) {
    'use strict';

    namespace.serverStorageService = (function ( ) {

        function publicSave(note, callback) {
            if (note.id == "") {
                privateAddNote(note, callback);
            } else {
                privateUpdateNote(note, callback);
            }
        }

        function privateAddNote(note, callback) {
            $.post({url: '/notes/', data: note}).done((id) => {
                callback(id);
            });
        }

        function privateUpdateNote(note, callback) {
            $.post({url: '/notes/' + note.id + '/', data: note}).done((id) => {
                callback(id);
            });
        }

        function publicGet(id, callback) {
            $.getJSON({url: '/notes/'+id+'/'}).done((note) => {
                callback(namespace.note.createNote(note));
            });
        }

        function publicGetAll(callback) {
            $.getJSON({url: '/notes/'}).done((notes) => {
                callback(privateConvertToNotes(notes));
            });
        }

        function privateConvertToNotes(inputObjects) {
            return inputObjects.map(n => namespace.note.createNote(n));
        }

        return {
            save: publicSave,
            get: publicGet,
            all:publicGetAll
        };
    })();
}) (window.notesAppNamespace = window.notesAppNamespace || {}, jQuery);
