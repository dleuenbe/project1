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

function renderNotes() {
    var renderingNotes = notes.filter(d => $('#show-finished').prop('checked') || !d.finished).sort(compareById);
    var notesTemplateText = $("#notes-template").html();
    $(".note-bar").get(0).innerHTML = Handlebars.compile(notesTemplateText)(renderingNotes);
}

function compareById(n1, n2) {
    var orderByField = $(".filter-item:checked").prop('id').substr('order-by-'.length);
    return n2[orderByField] == n1[orderByField] ? 0 : n2[orderByField] < n1[orderByField] ? -1 : 1;
}

function registerHandlebarIfConf() {
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
}
