(function (namespace) {
    'use strict';

    namespace.defaultNotesFromJS = [
        {
            "id": 0,
            "createDate": "2016-10-04",
            "dueDate": "2016-09-01",
            "title": "Note1",
            "description": "CreatedAt: 2016-10-04; Beschreibung1",
            "priority": 3,
            "finishedDate": "2010-01-31"
        },
        {
            "id": 1,
            "createDate": "2016-10-03",
            "dueDate": "2016-10-10",
            "title": "Note2",
            "description": "CreatedAt: 2016-10-03; Sehr lange Zeile alles am Stück 012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789",
            "priority": 1,
            "finishedDate": "2016-09-26"
        },
        {
            "id": 2,
            "createDate": "2016-10-01",
            "dueDate": "2016-10-03",
            "title": "Note3",
            "description": "CreatedAt: 2016-10-01; Beschreibung3\nLine2\nLine3\nLine4\nLine5",
            "priority": 5,
            "finishedDate": ""
        },
        {
            "id": 3,
            "createDate": "2016-10-02",
            "dueDate": "2016-10-09",
            "title": "Note4",
            "description": "CreatedAt: 2016-10-02; Beschreibung4",
            "priority": 4,
            "finishedDate": ""
        },
    ];

})(window.notesAppNamespace = window.notesAppNamespace || {});