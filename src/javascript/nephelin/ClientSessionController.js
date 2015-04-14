'use strict';
/**
 * Created by sirmonkey on 4/2/15.
 */
/**
 * Initialize Hub and websocket connection.
 * @constructor
 * @param {string} contextpath - Path for the websocket connection.
 */


var receivers    = [],
    components   = [];
var ClientSessionController;
ClientSessionController     = function ClientSessionController(contextpath) {
    var hostname = window.location.hostname;
    this.connection = "ws://" + hostname + ":8080" + contextpath + "/messagechannel";
    this.socket = null;
    this.commands = {
        log: function log(msg) {
            console.log(msg);
        },
        ack: function ack(msg){
            console.log(msg);
        },
        wait: function wait(msg) {
            console.log(this);
            console.log(Date.now() + " CMD: Waiting");
            var response = {
                cmd: "relay",
                receiver: "GameController",
                action: "newGame"
            };
            this.send(response);
        },
        relay: function relay(msg) {
            console.log(msg);
            var receiver = msg.receiver;
            console.log(receiver);
            console.log(components);
            for (var i = 0; i < components.length; i=+1) {
                console.log(components[i].module);
                if (components[i].module === receiver) {
                    console.log("Endpoint: " + receiver + " reached.");
                    components[i].receive(msg);
                }
            }
        }
    };
};


ClientSessionController.prototype  = {
    send : function (msg) {
    console.log(msg);
    this.socket.send(JSON.stringify(msg));
    },
    receive: function receive(event) {
        console.log(this);
        console.log(event);
        var msg        = JSON.parse(event.data);
        var command = this.commands[msg.cmd];
        if (command !== undefined) {
            command(msg);
        } else {
          console.log("Error: Command not found!") ;
        }
    },
    openConnection: function openConnection() {
        if (this.socket === null) {
            this.socket = new WebSocket(this.connection);
            this.socket.onmessage = this.receive.bind(this);
        }
    },
    buildComponents: function buildComponents() {
        console.log("Found: " + receivers.length);
        for (var index = 0; index < receivers.length; index = +1) {
            console.log(receivers[index]);
            var CmpBuilder = receivers[index];
            console.log(CmpBuilder);
            var cmp        = new CmpBuilder(this.send, this.socket);
            console.log(cmp);
            components.push(cmp);

        }
        console.log("----------");
        console.log(components.length);
    }
};
module.exports.csc                     = ClientSessionController;
module.exports.addReceiver             = function (receiver) {
    console.log(receiver);
    receivers.push(receiver);
};


module.exports.receivers = function () {
    return receivers;
};