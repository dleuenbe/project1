jQuery.noConflict();
(function (namespace, $, moment, handlebars) {
    'use strict';

    $(function () {
        initEventListener();
        initWebsocket();
        initHistory();
        updateOrder();
        updateFilter();
        renderNotes();
    });

    function initEventListener() {
        $("header > select").change(changeStyle);
        $(".newNote").click(newNoteWithHistory);
        $("#cancelNewNote").click(cancelEdit);
        $("#saveNewNote").click(saveEdit);
        $("#setFinishedDate").click(setFinishedDate);
        $("#clearFinishedDate").click(clearFinishedDate);
        $("#showFinished").change(renderUpdatedFilter);
        $(".filterItem").change(renderUpdatedOrder);
        $("#showFinished + label, .filterItem + label").mousedown(false);
        $(".priorityField > label").click(updatePriorityView);
    }

    function initHistory() {
        history.pushState({page: 'main'}, null, 'index.html');
        window.addEventListener('popstate', data => {
            restorePage(data);
        });
    }

    function restorePage(data) {
        if (data.state.page == 'main') {
            showOverviewPage();
        } else if (data.state.page == 'edit') {
            editNoteWithId(data.state.id);
        } else if (data.state.page == 'new') {
            newNote();
        }
    }

    function changeStyle(event) {
        $("#stylesheetLink").attr("href", event.target.value);
    }

    function renderUpdatedOrder() {
        updateOrder();
        renderNotes();
    }

    function updateOrder() {
        var fieldName = $(".filterItem:checked").prop('id').substr('orderBy-'.length);
        namespace.notesService.orderByField(fieldName);
    }

    function initWebsocket() {
        registerWebsocketCallbacks();
        namespace.socketio.init();
    }

    function registerWebsocketCallbacks() {
        namespace.socketio.register('notes', renderNotes);
        namespace.socketio.register('connect', connectWebsocket);
        namespace.socketio.register('disconnect', disconnectWebsocket);
    }

    function connectWebsocket() {
        $("#websocketState").get(0).innerHTML = "websocket connected";
    }

    function disconnectWebsocket() {
        $("#websocketState").get(0).innerHTML = "websocket disconnected";
    }

    function renderUpdatedFilter() {
        updateFilter();
        renderNotes();
    }

    function updateFilter() {
        var checked = $('#showFinished').prop('checked');
        namespace.notesService.setFilterState(checked);
    }

    function newNoteWithHistory() {
        history.pushState({page: 'new'}, null, 'index.html');
        newNote();
    }

    function newNote() {
        var note = namespace.notesService.createNewNote();
        showDetailPage(note);
    }

    function editNote(event) {
        var id = event.target.value;
        history.pushState({page: 'edit', id: id}, null, 'index.html');
        editNoteWithId(id);
    }

    function editNoteWithId(id) {
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

    function showOverviewPageWithHistory() {
        history.pushState({page: 'main'}, null, 'index.html');
        showOverviewPage();
    }

    function showOverviewPage() {
        $(".overviewPage").show();
        $(".detailPage").hide();
    }

    function cancelEdit() {
        showOverviewPageWithHistory();
        return false;
    }

    function saveEdit() {
        if (!validateForm()) {
            return false;
        }
        namespace.notesService.updateNote(createNoteFromForm(), () => {
            showOverviewPageWithHistory();
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
        return moment(date).format('YYYY-MM-DD');
    }

    function renderNotes() {
        var notesTemplateText = $("#notesTemplate").html();
        namespace.notesService.getVisibleNotesOrdered((notes) => {
            $(".noteBar").get(0).innerHTML = handlebars.compile(notesTemplateText)(notes);
            $(".editButton").click(editNote);
        });
    }

    function updatePriorityView() {
        var pos = parseInt($("input[type='radio'].priorityInput:checked").attr("value"));
        $(".priorityField > label:nth-child(-n+" + pos + ") > img").removeClass("grayscale");
        $(".priorityField > label:nth-last-child(-n+" + (5 - pos) + ") > img").addClass("grayscale");
    }

})(window.notesAppNamespace = window.notesAppNamespace || {}, jQuery, moment, Handlebars);
