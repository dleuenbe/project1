function changeStyle(event) {
    $("#stylesheetLink").attr("href", event.target.value);
}

function showNewNotePage() {
    $(".overview-page").hide();
    $(".new-note-page").show();
}

function hideNewNotePage() {
    $(".overview-page").show();
    $(".new-note-page").hide();
}

function cancelNewNotePage() {
    hideNewNotePage();
}

function saveNewNotePage() {
    hideNewNotePage();
}
