/**
 * Created by sirmonkey on 4/3/15.
 */
function SidePanelBuilder() {
    console.log(Date.now()+" Sidepanel started.");
    var Component = function() {
        this.sendMessage = null;
        this.socket = null;
        this.endpoint = "sidepanel"; //TODO: Besseren namen!
    };
    Component.prototype.receive = function(msg) {
        var action = msg.action;
        switch (action) {
            case "joinGame":
                this.joinGame(msg);
                break;
            default :
                console.log(msg);
                 this.sendMessage(ping());
        }
    };
    Component.prototype.joinGame = function(msg) {
        console.log(msg.payload);
        var response = {};
        response["cmd"] = "relay";
        response["receiver"] = "GameController";
        response["action"] = "joinGame";
        response["payload"] = msg.payload;
        this.sendMessage(response);
        var disp = JSON.stringify(msg.payload);
        $('#SidePanel').append('<p>'+disp+'<p>');
        var canvas = getCanvas();
        var board = new Board(7, 40, 'oddRowMap');
        turnKeys();
        var isDown = false;
        var mousedown = null;
        canvas.addEventListener('mousedown', function(e) {console.log(e); mousedown = e;isDown = true;}, false);
        canvas.addEventListener('mousemove', function(e) {if (isDown) console.log(e.offsetX)}, false);
        canvas.addEventListener('mouseup', function(e) {if (isDown) {console.log(e); isClick(board, mousedown, e);isDown = false;}}, false);
        drawMap(canvas.getContext('2d'), board.map);
    };
    return new Component();
}

ping = function() {
    var ping = {};
    ping["cmd"] = "relay";
    ping["receiver"] = "SidePanelController";
    ping["action"] = "Ping";
    return ping;
};

isClick = function(board, mousedown, mouseup) {
  if (mousedown.offsetX == mouseup.offsetX && mousedown.offsetY == mouseup.offsetY ) {
      console.log("Wooop Wooop!!");
      boardClickListener(mouseup, board);
  }
};

function getCanvas() {
    if( $("#cv").length )  {
        var canvas = $("#cv").get(0);
        return canvas;
    } else console.log('Error: Canvas not found with selector #cv');
};