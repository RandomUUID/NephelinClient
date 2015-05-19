"use strict";
/**
 * Created by loeb on 19.05.2015.
 */

var context;
var Messages = require('./Messages');

function addContextItem(name, f) {
    var item = document.createElement("li");
    var context = document.createElement("ul");
    item.innerHTML = name;
    item.classList.add("context-item");
    item.onclick = f;
    $(".context-menu .list").append(item);
}

function removeContextItem(name) {
    var items = $(".context-item");
    try {
        for (var i = 0; i < items.length; i += 1) {
            if (items[i].innerText === name) {
                items[i].remove();
            }
        }
    }
    catch
        (e) {
        console.log("menuItem not found: " + name);
    }
}

context = function context(sendMessageFunc, socket) {
    console.log("Context Menu initialised");
    this.send = sendMessageFunc;
    this.socket = socket;
    this.name = "menu";

    $(document).on('contextmenu', function (e) {
        $('.context-menu').css({
            top: e.pageY,
            left: e.pageX,
            display: 'block'
        });

        $('h1').fadeOut('fast');

        return false;
    });

    $(document).click(function (e) {
        if (e.which === 1) {
            $('.context-menu').hide();
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 27) {
            $('.context-menu').hide();
        }
    });

    addContextItem("red", function () {
        console.log("Red selected");
    });
    addContextItem("blue", function () {
        console.log("Blue selected");
    });
};


module.exports.Context = context;