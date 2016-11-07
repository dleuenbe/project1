/**
 * Created by david on 07.10.16.
 */
(function (namespace, io) {
    'use strict';

    namespace.socketio = (function () {

        var callbacks = {};

        function publicInit() {
            var socket = io.connect();
            for (var key in callbacks) {
                if (callbacks.hasOwnProperty(key)) {
                    socket.on(key, callbacks[key]);
                }
            }
        }

        function publicRegisterCallback(name, callback) {
            callbacks[name] = callback;
        }

        return {
            init: publicInit,
            register: publicRegisterCallback
        };
    })();
})(window.notesAppNamespace = window.notesAppNamespace || {}, io);