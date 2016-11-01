;(function(namespace) {
    'use strict';

    $(function () {
        registerHandlebarIfLte();
        $("header > select").change(changeStyle);
        $(".newNote").click(newNote);
        $("#cancelNewNote").click(cancelEdit);
        $("#saveNewNote").click(saveEdit);
        $("#setFinishedDate").click(setFinishedDate);
        $("#clearFinishedDate").click(clearFinishedDate);
        $("#showFinished").change(updateFilter);
        $(".filter-item").change(updateOrder);
        $("#showFinished + label, .filter-item + label").mousedown(false);
        $(".priorityField > label").click(updatePriorityView);
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
        var checked = $('#showFinished').prop('checked');
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
        $(".overviewPage").hide();
        $(".detailPage").show();
    }

    function updateFields(note) {
        $("#idField").val(note.id);
        $("#titleField").val(note.title);
        $("#descriptionField").val(note.description);
        $("#dueDateField").val(note.dueDate);
        $("#priority" + note.priority).prop("checked", true);
        $("#finishedDateField").val(note.finishedDate);
        $("#createDateField").val(note.createDate);
        updatePriorityView();
    }

    function validateForm() {
        $("#editForm")[0].checkValidity();
        var notValid = $("#editForm [name]").filter((pos, input) => !input.validity.valid);
        return notValid.length == 0;
    }

    function showOverviewPage() {
        $(".overviewPage").show();
        $(".detailPage").hide();
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
        $("#finishedDateField").val("");
        return false;
    }

    function setFinishedDate() {
        $("#finishedDateField").val(formatedDate(new Date()));
        return false;
    }

    function formatedDate(date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        return year + "-" + month + "-" + day;
    }

    function renderNotes() {
        var notesTemplateText = $("#notesTemplate").html();
        namespace.notesService.getVisibleNotesOrdered((notes) => {
            $(".noteBar").get(0).innerHTML = Handlebars.compile(notesTemplateText)(notes);
            $(".editButton").click(editNote)
        });
    }

    function updatePriorityView() {
        var pos = parseInt($("input[type='radio'].priorityInput:checked").attr("value"));
        $(".priorityField > label:nth-child(-n+" + pos + ") > img").removeClass("grayscale");
        $(".priorityField > label:nth-last-child(-n+" + (5 - pos) + ") > img").addClass("grayscale");
    }

    function registerHandlebarIfLte() {
        Handlebars.registerHelper('ifLte', function (v1, v2, options) {
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        });
    }
}) (window.notesAppNamespace = window.notesAppNamespace || {});
