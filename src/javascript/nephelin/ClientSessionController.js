'use strict';
/**
 * Created by sirmonkey on 4/2/15.
 */
/**
 * Initialize Hub and websocket connection.
 * @constructor
 * @param {string} contextpath - Path for the websocket connection.
 */

var Messages = require('./Messages');
var receivers    = [],
    components   = {};
var ClientSessionController;
ClientSessionController     = function ClientSessionController(contextpath) {
    var self = this;
    var hostname = window.location.hostname;
    this.connection = "ws://" + hostname + ":8080" + contextpath + "/messagechannel";
    this.socket = null;
    this.commands = {
        log: function log(msg) {
            console.log(msg);
        },
        response: function response(msg){
            console.log(msg);
        },
        wait: function wait(msg) {
            console.log(Date.now() + " CMD: Waiting");
            self.send(Messages.newGame);
        },
        relay: function relay(msg) {
            console.log('Begin Relay');
            console.log(msg);
            var receiver = msg.receiver;
            console.log('Relay to: ' + receiver);
            var cmp = components[receiver];
            if (typeof cmp !== 'undefined') {
                cmp.receive(msg);
            } else {
                console.log('Receiver: ' + receiver + ' not found!');
            }
            console.log('End Relay');
        }
    };
};


ClientSessionController.prototype  = {
    send : function (msg) {
    this.socket.send(JSON.stringify(msg));
    },
    receive: function receive(event) {
        console.log(event);
        var msg        = JSON.parse(event.data);
        var command = this.commands[msg.command];
        if (command !== undefined) {
            if(msg.ack === 'true') {
                this.acknowledge(msg);
            }
            command(msg);
        } else {
          console.log("Error: Command not found!") ;
        }
    },
    acknowledge: function acknowledge(msg) {
        this.send(Messages.ack(msg.receiver, msg.sender, msg.command));
    },
    openConnection: function openConnection() {
        if (this.socket === null) {
            this.socket = new WebSocket(this.connection);
            this.socket.onmessage = this.receive.bind(this);
        }
    },
    buildComponents: function buildComponents() {
        console.log("Components found: " + receivers.length);
        for (var index = 0; index < receivers.length; index+=1) {
            var CmpBuilder = receivers[index];
            var cmp        = new CmpBuilder(this.send, this.socket);
            components[cmp.name] = cmp;
        }
        console.log("Components build: " + components.length);
        console.log("----------");
    }
};
module.exports.csc                     = ClientSessionController;
module.exports.addReceiver             = function (receiver) {
    receivers.push(receiver);
};


module.exports.receivers = function () {
    return receivers;
};