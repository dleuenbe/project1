/**
 * Created by david on 07.10.16.
 */
var notesService = (function (localStorageService, note) {

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

    function publicGetVisibleNotesOrdered() {
        if (!loaded) {
            privateLoadNotes();
            loaded = true;
        }
        return notes.filter(n => filterShowFinished || !n.finishedDate).sort(privateCompareById);
    }

    function privateCompareById(n1, n2) {
        return n2[orderByField] == n1[orderByField] ? 0 : n2[orderByField] < n1[orderByField] ? -1 : 1;
    }

    function publicUpdateNote(note) {
        if (isNaN(note.id)) {
            return false; // skip notes without id
        }
        localStorageService.save(note);
        privateUpdateNote(notes, note)
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

    function publicGetNewNote() {
        return note.createNote(privateGetNextId());
    }

    function privateGetNextId() {
        if (notes.length == 0) {
            return 0;
        }
        return Math.max.apply(Math, notes.map(function (n) {
                return n.id;
            })) + 1;
    }

    function publicGetNoteById(id) {
        return notes.filter(n => n.id == id)[0];
    }

    function privateLoadNotes() {
        notes = localStorageService.getAll();
    }

    return {
        orderByField: publicOrderByField,
        setFilterState: publicSetFilterState,
        getVisibleNotesOrdered: publicGetVisibleNotesOrdered,
        updateNote: publicUpdateNote,
        getNewNote: publicGetNewNote,
        getNoteById: publicGetNoteById
    };

})(localStorageService, note);
