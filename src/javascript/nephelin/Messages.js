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

module.exports.showContextMenu = {
    command:"relay",
    receiver: "context",
    action: "showContextMenu"
};