"use strict";
/**
 * Created by loeb on 19.05.2015.
 */

var context;
var Messages = require('./Messages');
var Board = require('./Board');
var self = this;


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

    //TODO dirty!
    addContextItem("red", function () {
        console.log("Red selected");
        var Board = require('./Board');
        Board.changeSelect("red");
    });
    addContextItem("blue", function () {
        console.log("Blue selected");
        var Board = require('./Board');
        Board.changeSelect("blue");
    });
};

context.prototype = {
    receive: function (msg) {
        console.log("Module: " + this.name + " reached.");
        var action = msg.action;
        var p = msg.payload;
        switch (action) {
            case "addContextItem":
                addContextItem(msg.payload, function()
                {console.log("Clicked" + msg.payload);});
                break;
            case "removeContextItem":
                removeContextItem(msg.payload);
                break;
            default :
                console.log(msg);
                this.send(Messages.ping);
        }
    }
};

module.exports.Context = context;