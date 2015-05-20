'use strict';
/**
 * Created by sirmonkey on 4/13/15.
 */
module.exports.ping = {
    command: 'log',
    receiver: 'SidePanelController',
    action: 'ping'
};

module.exports.ack = function(sender, receiver, payload) {
    var msg;
    msg = {
        command: 'response',
        receiver: receiver,
        sender: sender,
        payload: payload,
        ack: false
    };
    return msg;
};
module.exports.newGame = {
    command: "relay",
    receiver: "GameController",
    action: "newGame"
};

module.exports.addMenuItem = function(name){
    msg = {
        command: "relay",
        receiver: "menu",
        action: "addMenuItem",
        payload: name
    };
    return msg;
};

module.exports.removeMenuItem= function(name){
    msg = {
        command: "relay",
        receiver: "menu",
        action: "removeMenuItem",
        payload: name
    };
    return msg;
};

module.exports.addDropDownItem = function(menuItem, name, f){
    var p = {
        menuItem: menuItem,
        name: name,
        f: f
    };
    msg = {
        command: "relay",
        receiver: "menu",
        action: "addDropDownItem",
        payload: p
    };
    return msg;
};

module.exports.removeDropDownItem = function(menuItem, name){
    var p = {
        menuItem: menuItem,
        name: name
    };

    msg = {
        command: "relay",
        receiver: "menu",
        action: "removeDropDownItem",
        payload: p
    };
    return msg;
};

module.exports.showContextMenu = {
    command:"relay",
    receiver: "context",
    action: "showContextMenu"
};