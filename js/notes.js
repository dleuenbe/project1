'use strict';

var notes;

$(function() {
    registerHandlebarIfLte();
    $("header > select").change(changeStyle);
    $(".new-note").click(createNewNote);
    $("#cancel-new-note").click(cancelNewNotePage);
    $("#save-new-note").click(saveNewNotePage);
    $("#setFinishedAtDate").click(setFinishedAtDate);
    $("#clearFinishedAtDate").click(clearFinishedAtDate);
    $("#show-finished, .filter-item").change(renderNotes);
    $("#show-finished + label, .filter-item + label").mousedown(false);
    $(".priority-field > label").click(updatePriorityView);
    $("#errorMessage").hide();
    loadDataFromStorage();
    updatePriorityView();
    renderNotes();
})

function changeStyle(event) {
    $("#stylesheetLink").attr("href", event.target.value);
}

function editNewNotePage(event) {
    var id = event.target.value;
    showNewNotePage(id);
}

function createNewNote() {
    showNewNotePage();
}

function showNewNotePage(id) {
    $(".overview-page").hide();
    var noteToEdit  = new Object();
    if (id == undefined) {
        noteToEdit.id = Math.max.apply(Math,notes.map(function(n){return n.id;}))+1;
        noteToEdit.createDate = createFormatedDate();
        noteToEdit.priority = 1;
    } else {
        noteToEdit = notes.filter(f => f.id == id)[0];
    }
    $("#id-field").val(noteToEdit.id);
    $("#title-field").val(noteToEdit.title);
    $("#description-field").val(noteToEdit.description);
    $("#dueDate-field").val(noteToEdit.dueDate);
    $("#priority"+noteToEdit.priority).prop("checked", true);
    $("#finishedAt-field").val(noteToEdit.finishedAt);
    $("#createDate-field").val(noteToEdit.createDate);
    updatePriorityView();
    clearValidation();
    $(".new-note-page").show();
}

function clearValidation() {
    $("#newNoteForm [name][required]").css("background-color", "");
    $("#errorMessage").hide();
}

function validateForm() {
    clearValidation();
    var notValid = $("#newNoteForm [name][required]").filter((pos, input) => !input.value);
    notValid.css("background-color", "red")
    var valid = notValid.length == 0;
    if (!valid) {
        $("#errorMessage").show();
    }
    return valid;
}

function hideNewNotePage() {
    $(".overview-page").show();
    $(".new-note-page").hide();
}

function cancelNewNotePage() {
    hideNewNotePage();
    return false;
}

function saveNewNotePage() {
    if (!validateForm()) {
        return false;
    }
    var note = $("#newNoteForm").serializeArray().reduce(function(a, x) { a[x.name] = x.value; return a; }, {});
    updateNotes(note);
    hideNewNotePage();
    renderNotes();
    saveToLocalStorage();
    return false;
}

function clearFinishedAtDate() {
    $("#finishedAt-field").val("");
    return false;
}

function setFinishedAtDate() {
    $("#finishedAt-field").val(createFormatedDate());
    return false;
}

function createFormatedDate() {
    var date = new Date();
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth()+1)).slice(-2);
    var year = date.getFullYear();
    return year+"-"+month+"-"+day;
}

function updateNotes(note) {
    for (var i=0; i < notes.length; i++) {
        if (notes[i].id == note.id) {
            notes.splice(i, 1, note);
            return;
        }
    }
    notes.push(note);
}

function renderNotes() {
    var renderingNotes = notes.filter(d => $('#show-finished').prop('checked') || !d.finishedAt).sort(compareById);
    var notesTemplateText = $("#notes-template").html();
    $(".note-bar").get(0).innerHTML = Handlebars.compile(notesTemplateText)(renderingNotes);
    $(".edit-button").click(editNewNotePage);
}

function compareById(n1, n2) {
    var orderByField = $(".filter-item:checked").prop('id').substr('order-by-'.length);
    return n2[orderByField] == n1[orderByField] ? 0 : n2[orderByField] < n1[orderByField] ? -1 : 1;
}

function updatePriorityView() {
    var pos = parseInt($("input[type='radio'].priorityInput:checked").attr("value"));
    $(".priority-field > label:nth-child(-n+"+pos+") > img").removeClass("grayscale");
    $(".priority-field > label:nth-last-child(-n+"+(5-pos)+") > img").addClass("grayscale");
}

function loadDataFromStorage() {
    var notesFromLocalStorage = localStorage.getItem("notes");
    if (notesFromLocalStorage === null) {
        notes = defaultNotesFromJS;
    } else {
        notes = JSON.parse(notesFromLocalStorage);
    }
}

function saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}


function registerHandlebarIfLte() {
    Handlebars.registerHelper('ifLte', function (v1, v2, options) {
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    });
}