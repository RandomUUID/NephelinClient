'use strict';
/**
 * Created by sirmonkey on 4/3/15.
 */
var Board = require('./Board');
var Messages = require('./Messages');

function isClick(board, mousedown, mouseup) {
    if (mousedown.offsetX === mouseup.offsetX &&
        mousedown.offsetY === mouseup.offsetY) {
        board.handlers.click(mousedown,board);
    }
}

var SidePanel;
SidePanel = function SidePanel(sendMessageFunc, socket) {
    console.log(Date.now() + " Sidepanel started.");
    var self = this;
    this.send = sendMessageFunc;
    this.socket      = socket;
    this.module      = "sidepanel"; // TODO: Besseren namen!
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
            var isDown    = false;
            var mousedown = null;
            canvas.addEventListener('mousedown', function (e) {
                isDown = true;
                mousedown = e;
            }, false);
            canvas.addEventListener('mousemove', function (e) {
                if (isDown) {
                    console.log(e.offsetX);
                }
            }, false);
            canvas.addEventListener('mouseup', function (e) {
                if (isDown) {
                    isClick(board, mousedown, e);
                    isDown = false;
                }
            }, false);
            Board.drawMap(canvas.getContext('2d'), board.map);
            self.send(response);
        }
    };
};

SidePanel.prototype = {
    receive: function (msg) {
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