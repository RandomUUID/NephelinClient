"use strict";
/**
 * Created by loeb on 19.05.2015.
 */

var Context;
var Messages = require('./Messages');

Context = function Context(sendMessageFunc, socket) {
    this.send = sendMessageFunc;
    this.socket = socket;
    this.name = "context";

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
    this.actions.addContextItem("red", function () {
        console.log("Red selected");
        var Board = require('./Board');
        Board.changeSelect("red");
    });
    this.actions.addContextItem("blue", function () {
        console.log("Blue selected");
        var Board = require('./Board');
        Board.changeSelect("blue");
    });
    console.log(this.name + " started!");
};

Context.prototype.actions = {};

Context.prototype.actions.addContextItem = function addContextItem(name, f) {
    var item = document.createElement("li");
    var context = document.createElement("ul");
    item.innerHTML = name;
    item.classList.add("context-item");
    item.onclick = f;
    $(".context-menu .list").append(item);
};

Context.prototype.actions.removeContextItem = function removeContextItem(name) {
    var $items = $(".context-item");
    try {
        for (var i = 0; i < $items.length; i += 1) {
            if ($items[i].innerText === name) {
                $items[i].remove();
            }
        }
    }
    catch
        (e) {
        console.log("menuItem not found: " + name);
    }
};

Context.prototype.receive = function receive(msg) {
    console.log("Module: " + this.name + " reached.");
    var action = msg.action;
    switch (action) {
        case "addContextItem":
            this.actions.addContextItem(msg.payload, function () {
                console.log("Clicked" + msg.payload);
            });
            break;
        case "removeContextItem":
            this.actions.removeContextItem(msg.payload);
            break;
        default :
            console.log(msg);
            this.send(Messages.ping);
    }
};


module.exports.Context = Context;