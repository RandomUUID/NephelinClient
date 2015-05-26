'use strict';
/**
 * Created by sirmonkey on 4/3/15.
 */
var ComponentHelper = require('./ComponentHelper');
var Messages = require('./Messages');
var HexagonAlgebra = require('./HexagonAlgebra');
var CanvasHelper = require('./CanvasHelper');


function isClick(board, mousedown, mouseup) {
    if (mousedown.offsetX === mouseup.offsetX &&
        mousedown.offsetY === mouseup.offsetY) {
        board.handlers.click(mousedown);
    }
}

var MainPanel;
MainPanel = function MainPanel(sendMessageFunc, socket) {
    console.log(Date.now() + " main started.");
    var self = this;
    this.send = sendMessageFunc;
    this.socket      = socket;
    this.name      = 'mainpanel';
    this.actions = {
        joinGame: function (msg) {
            var response  = {
                "command": "relay", "receiver": "GameController",
                "action": "joinGame",
                "payload": msg.payload
            };

            var disp      = JSON.stringify(msg.payload);
            $('#mainPanel').append('<p>' + disp + '<p>');
            var canvas    = CanvasHelper.getCanvas();
            var board     = self.ComponentBuilder.components['board'](7, 40, 'normalMap');
            //turnKeys();
            var isDown    = false,
                mousedown = null,
                mousemove = null;
            canvas.addEventListener('mousedown', function (e) {
                isDown = true;
                mousedown = e;
                mousemove = e;
            }, false);
            canvas.addEventListener('mousemove', function (e) {
                if (isDown) {
                    var movement_vector = new HexagonAlgebra.Axial(mousemove.offsetX - e.offsetX,
                        mousemove.offsetY - e.offsetY);
                    mousemove = e;
                    board.handlers.scroll(canvas, movement_vector);
                    canvas.style.cursor="move";
                }
                else{
                    canvas.style.cursor="default";
                }

            }, false);
            canvas.addEventListener('mouseup', function (e) {
                if (isDown) {
                    isClick(board, mousedown, e);
                    isDown = false;
                }
            }, false);
            Board.drawMap(canvas, board.map);
            self.send(response);
        }
    };
    this.ComponentBuilder = new ComponentHelper.ComponentBuilder(self);
};


MainPanel.prototype.receive = function receive(msg){
    console.log("Module: " + this.name + " reached.");
    var action = msg.action;
    switch (action) {
        case "joinGame":
            this.actions.joinGame(msg);
            break;
        default :
            console.log(msg);
            this.send(Messages.ping);
    }
};


MainPanel.prototype.addComponent = function addComponent(component) {
    this.ComponentBuilder.addComponent(component);
};
ClientSessionController.prototype.getComponent = function getComponent(component) {
    return this.ComponentBuilder.components[component];
};

MainPanel.prototype.build = function build() {
    this.ComponentBuilder.build();
};

module.exports.MainPanel = MainPanel;