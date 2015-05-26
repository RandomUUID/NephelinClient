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
var ComponentHelper = require('./ComponentHelper');
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
            var cmp = self.ComponentBuilder.components[receiver];
            if (typeof cmp !== 'undefined') {
                cmp.receive(msg);
            } else {
                console.log('Receiver: ' + receiver + ' not found!');
            }
            console.log('End Relay');
        }
    };
    this.ComponentBuilder = new ComponentHelper.ComponentBuilder(self);
    console.log(this.ComponentBuilder);
};

ClientSessionController.prototype.send =  function send(msg) {
    this.socket.send(JSON.stringify(msg));
};
ClientSessionController.prototype.sendLocal = function sendLocal(msg) {
    self.receive(msg);
};
ClientSessionController.prototype.receive = function receive(event) {
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
};
ClientSessionController.prototype.addComponent = function addComponent(component) {
    this.ComponentBuilder.addComponent(component);
};
ClientSessionController.prototype.getComponent = function getComponent(component) {
    return this.ComponentBuilder.components[component];
};
ClientSessionController.prototype.acknowledge = function acknowledge(msg) {
    this.send(Messages.ack(msg.receiver, msg.sender, msg.command));
};
ClientSessionController.prototype.openConnection = function openConnection() {
    if (this.socket === null) {
        this.socket = new WebSocket(this.connection);
        this.socket.onmessage = this.receive.bind(this);
    }
};
ClientSessionController.prototype.build = function build() {
    this.ComponentBuilder.build();
};
module.exports.ClientSessionController                     = ClientSessionController;
