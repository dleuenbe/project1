(function(handlebars) {
    'use strict';

    $(function () {
        registerHandlebarIfLte();
    });

    function registerHandlebarIfLte() {
        handlebars.registerHelper('ifLte', function (v1, v2, options) {
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        });
    }
}) (Handlebars);
