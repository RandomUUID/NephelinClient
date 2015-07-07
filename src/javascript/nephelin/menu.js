'use strict';
/**
 * Created by tobias on 06.05.15.
 */

var menuItem;
var dropDown;
var dropDownItem;
var Messages = require('./Messages');
var MenuHelper = require('./MenuHelper');

var Menu;
Menu = function Menu(sendMessageFunc, socket) {
    var self = this;
    this.send = sendMessageFunc;
    this.socket      = socket;
    this.name      = "menu";
    console.log(this.name + " started!");
};

Menu.prototype.actions = {};
Menu.prototype.actions.addMenuItem = function addMenuItem(name) {
    var item = document.createElement("li");
    var drop = document.createElement("ul");
    item.innerHTML = name;
    item.classList.add('menuItem');
    drop.classList.add(name);
    drop.classList.add('dropDown');
    item.appendChild(drop);
    MenuHelper.getMenu().append(item);
};

Menu.prototype.actions.removeMenutItem =
    function removeMenuItem(name) {
    try {
        MenuHelper.getMenuItem(name).remove();
    } catch (e) {
        console.log("Cannot remove " + name);
    }
};

Menu.prototype.actions.addDropDownItem =
    function addDropDownItem(menuItem, name, f) {
    try {
        var drop = $("." + menuItem);
        var li = document.createElement("li");
        li.classList.add("dropDownItem");
        li.innerHTML = name;
        li.onclick = f;
        drop.append(li);
    } catch (e) {
        console.log("Cannot find " + menuItem);
    }
};

Menu.prototype.actions.removeDropDownItem =
    function removeDropDownItem(menuItem, name) {
    try {
        var drop = $("." + menuItem + " li");
        console.log(drop);
        for (var i = 0; i < drop.length; i += 1) {
            console.log(drop[i]);
            if (drop[i].innerText === name) {
                drop[i].remove();
            }
        }
    } catch (e) {
        console.log(e.message);
    }
};
Menu.prototype.init = function init() {
    this.actions.addMenuItem("Game");
    this.actions.addDropDownItem("Game", "New Game", function(){
        alert("New Game started");
    });
    this.actions.addDropDownItem("Game", "Exit Game", function(){
        console.log("exiting Game now");
    });
    this.actions.addMenuItem("Hexagon");
    this.actions.addDropDownItem("Hexagon", "Select All", function(){
        alert("Selected All");
    });
    this.actions.addDropDownItem("Hexagon", "Deselect All", function(){
        console.log("Deselected All");
    });
};

Menu.prototype.receive =  function receive(msg) {
        console.log("Module: " + this.name + " reached.");
        var action = msg.action;
        var p = msg.payload;
        switch (action) {
            case "addMenuItem":
                this.actions.addMenuItem(msg.payload);
                break;
            case "removeMenuItem":
                this.actions.removeMenuItem(msg.payload);
                break;
            case "addDropDownItem":
                this.actions.addMenuItem(p.menuItem, p.name, p.f);
                break;
            case "removeDropDownItem":
                this.actions.addMenuItem(p.menuItem, p.name);
                break;
            case "init":
                this.init();
                break;
            default :
                console.log(msg);
                this.send(Messages.ping);
        }
};
module.exports.Menu = Menu;