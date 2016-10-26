/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.note = (function () {

        class Note {
            constructor(simpleNote) {
                if (typeof simpleNote === 'object') {   // create Note from simple Object
                    this.id = simpleNote.id;
                    this.createDate = simpleNote.createDate;
                    this.dueDate = simpleNote.dueDate;
                    this.finishedDate = simpleNote.finishedDate;
                    this.title = simpleNote.title;
                    this.description = simpleNote.description;
                    this.priority = simpleNote.priority;
                } else {        // create new Note without id
                    this.createDate = createNewDate();
                    this.priority = 1;
                }
            }
            get formattedDueDate() { return formatDateFromNow(this.dueDate); };
            get formattedFinishedDate() { return formatDateFromNow(this.finishedDate); };
        }

        function formatDateFromNow(date) {
            return moment(date, ["YYYY-MM-DD", "DD.MM.YYYY"]).fromNow();
        }

        function createNewDate() {
            return moment().format('YYYY-MM-DD');
        }

        function publicCreateNote(simpleNote) {
            return new Note(simpleNote);
        }

        return {
            createNote: publicCreateNote
        }
    })();
})(window.notesAppNamespace = window.notesAppNamespace || {});