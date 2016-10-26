;(function(namespace) {
    'use strict';

    $(function () {
        registerHandlebarIfLte();
        $("header > select").change(changeStyle);
        $(".new-note").click(newNote);
        $("#cancel-new-note").click(cancelEdit);
        $("#save-new-note").click(saveEdit);
        $("#setFinishedDate").click(setFinishedDate);
        $("#clearFinishedDate").click(clearFinishedDate);
        $("#show-finished").change(updateFilter);
        $(".filter-item").change(updateOrder);
        $("#show-finished + label, .filter-item + label").mousedown(false);
        $(".priority-field > label").click(updatePriorityView);
        $("#errorMessage").hide();
        updateOrder();
        updateFilter();
        renderNotes();
    });

    function changeStyle(event) {
        $("#stylesheetLink").attr("href", event.target.value);
    }

    function updateOrder() {
        var fieldName = $(".filter-item:checked").prop('id').substr('order-by-'.length);
        namespace.notesService.orderByField(fieldName);
        renderNotes();
    }

    function updateFilter() {
        var checked = $('#show-finished').prop('checked');
        namespace.notesService.setFilterState(checked);
        renderNotes();
    }

    function newNote() {
        var note = namespace.notesService.createNewNote();
        showDetailPage(note);
    }

    function editNote(event) {
        var id = event.target.value;
        namespace.notesService.getNoteById(id, (note) => showDetailPage(note));
    }

    function showDetailPage(note) {
        updateFields(note);
        $(".overview-page").hide();
        $(".detail-page").show();
    }

    function updateFields(note) {
        $("#id-field").val(note.id);
        $("#title-field").val(note.title);
        $("#description-field").val(note.description);
        $("#dueDate-field").val(note.dueDate);
        $("#priority" + note.priority).prop("checked", true);
        $("#finishedDate-field").val(note.finishedDate);
        $("#createDate-field").val(note.createDate);
        updatePriorityView();
    }

    function validateForm() {
        $("#editForm")[0].checkValidity();
        var notValid = $("#editForm [name]").filter((pos, input) => !input.validity.valid);
        return notValid.length == 0;
    }

    function showOverviewPage() {
        $(".overview-page").show();
        $(".detail-page").hide();
    }

    function cancelEdit() {
        showOverviewPage();
        return false;
    }

    function saveEdit() {
        if (!validateForm()) {
            return false;
        }
        namespace.notesService.updateNote(createNoteFromForm(), () => {
            showOverviewPage();
            renderNotes();
        });
        return false;
    }

    function createNoteFromForm() {
        var simpleNote = $("#editForm").serializeArray().reduce(function (a, x) {
            a[x.name] = x.value;
            return a;
        }, {});
        return namespace.notesService.convertToNote(simpleNote);
    }

    function clearFinishedDate() {
        $("#finishedDate-field").val("");
        return false;
    }

    function setFinishedDate() {
        $("#finishedDate-field").val(formatedDate(new Date()));
        return false;
    }

    function formatedDate(date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        return year + "-" + month + "-" + day;
    }

    function renderNotes() {
        var notesTemplateText = $("#notes-template").html();
        namespace.notesService.getVisibleNotesOrdered((notes) => {
            $(".note-bar").get(0).innerHTML = Handlebars.compile(notesTemplateText)(notes);
            $(".edit-button").click(editNote)
        });
    }

    function updatePriorityView() {
        var pos = parseInt($("input[type='radio'].priorityInput:checked").attr("value"));
        $(".priority-field > label:nth-child(-n+" + pos + ") > img").removeClass("grayscale");
        $(".priority-field > label:nth-last-child(-n+" + (5 - pos) + ") > img").addClass("grayscale");
    }

    function registerHandlebarIfLte() {
        Handlebars.registerHelper('ifLte', function (v1, v2, options) {
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        });
    }
}) (window.notesAppNamespace = window.notesAppNamespace || {});