/**
 * Created by david on 25.10.16.
 */
function privateUpdateNote(notes, note) {
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == note.id) {
            notes.splice(i, 1, note);
            return;
        }
    }
    notes.push(note);
}
