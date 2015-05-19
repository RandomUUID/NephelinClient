"use strict";
/**
 * Created by loeb on 19.05.2015.
 */

var context;
var Messages = require('./Messages');

context = function context(sendMessageFunc, socket) {
        console.log("Context Menu initialised");
        this.send = sendMessageFunc;
        this.socket = socket;
        this.name = "menu";

        $(document).on('contextmenu', function(e) {
            $('.context-menu').css({
                top: e.pageY,
                left: e.pageX,
                display: 'block'
            });

            $('h1').fadeOut('fast');

            return false;
        });

        $(document).click(function(e) {
            if (e.which === 1) {
                $('.context-menu').hide();
            }
        });

        $(document).keydown(function(e) {
            if (e.which === 27) {
                $('.context-menu').hide();
            }
        });
    };
module.exports.Context = context;