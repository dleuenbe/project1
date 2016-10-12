/**
 * Created by david on 07.10.16.
 */
;(function(namespace) {
    'use strict';

    namespace.note = (function () {

        class Note {
            constructor(simpleNote) {
                if (typeof simpleNote === 'number') {        // create new Note
                    this.id = simpleNote;
                    this.createDate = privateFormatedDate(new Date());
                    this.priority = 1;
                } else if (typeof simpleNote === 'object') {   // create Note from simple Object
                    this.id = simpleNote.id;
                    this.createDate = simpleNote.createDate;
                    this.dueDate = simpleNote.dueDate;
                    this.finishedDate = simpleNote.finishedDate;
                    this.title = simpleNote.title;
                    this.description = simpleNote.description;
                    this.priority = simpleNote.priority;
                } else {
                    throw "InvalidArgumentException " + simpleNote;
                }
            }
            get formattedDueDate() {
                return moment(this.dueDate, ["YYYY-MM-DD", "DD.MM.YYYY"]).fromNow();
            };
            get formattedFinishedDate() {
                return moment(this.finishedDate, ["YYYY-MM-DD", "DD.MM.YYYY"]).fromNow();
            };
        }

        function privateFormatedDate(date) {
            var day = ("0" + date.getDate()).slice(-2);
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var year = date.getFullYear();
            return year + "-" + month + "-" + day;
        }

        function publicCreateNote(simpleNote) {
            return new Note(simpleNote);
        }

        return {
            createNote: publicCreateNote
        }
    })();
})(window.notesAppNamespace = window.notesAppNamespace || {});