'use strict';
/**
 * Created by sirmonkey on 4/3/15.
 */
var Board = require('./Board');
var Messages = require('./Messages');
var HexagonAlgebra = require('./HexagonAlgebra');

function isClick(board, mousedown, mouseup) {
    if (mousedown.offsetX === mouseup.offsetX &&
        mousedown.offsetY === mouseup.offsetY) {
        board.handlers.click(mousedown);
    }
}

var SidePanel;
SidePanel = function SidePanel(sendMessageFunc, socket) {
    console.log(Date.now() + " Sidepanel started.");
    var self = this;
    this.send = sendMessageFunc;
    this.socket      = socket;
    this.name      = "sidepanel"; // TODO: Besseren namen!
    this.actions = {
        joinGame: function (msg) {
            var response  = {
                "cmd": "relay", "receive": "GameController",
                "action": "joinGame",
                "payload": msg.payload
            };

            var disp      = JSON.stringify(msg.payload);
            $('#SidePanel').append('<p>' + disp + '<p>');
            var canvas    = self.getCanvas();
            var board     = new Board(7, 40, 'oddRowMap');
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
};

SidePanel.prototype = {
    receive: function (msg) {
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
    },
    getCanvas: function () {
        if ($("#cv").length) {
            return $("#cv").get(0);
        } else {
            console.log('Error: Canvas not found with selector #cv');
        }
    }

};
module.exports.sp = SidePanel;