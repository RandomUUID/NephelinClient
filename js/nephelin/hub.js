/**
 * Created by sirmonkey on 4/2/15.
 */
/**
 * Initialize Hub and websocket connection.
 * @constructor
 * @param {string} contextpath - Path for the websocket connection.
 */
var blueprints = [];
var components = [];
var hubcontroller;
function main(contextpath) {
    console.log("Found: " + blueprints.length )
    for	(index = 0; index < blueprints.length; index++) {
        console.log(blueprints[index]);
        var CmpBuilder = blueprints[index];
        var cmp = CmpBuilder();
        console.log(cmp);
        components.push(cmp);

    }
    console.log("----------");
    console.log(components.length);
    HubController(contextpath);

}
var HubController = function(contextpath) {
    var connection = "ws://" + window.location.hostname+":8080" + contextpath + "/messagechannel";
    this.socket = new WebSocket(connection);
    this.socket.onmessage = messageAction.bind(this);

    this.sendMessage = function(msg) {
        console.log(msg);
        this.socket.send(JSON.stringify(msg));
    };
    for (var index = 0; index < components.length; index++) {
        components[index].socket = this.socket;
        components[index].sendMessage = this.sendMessage;
        console.log(components[index])
    }
}

//TODO: Rename to receive
 function messageAction(event) {
    var json = JSON.parse(event.data);
    switch (json.cmd) {
        case "wait":
            console.log(Date.now() + " CMD: Waiting");
            var msg = {};
            msg["cmd"] = "relay",
            msg["receiver"] = "GameController";
            msg["action"] = "newGame";
            this.sendMessage(msg);
            break;
        case "relay":
            console.log(Date.now() + " CMD: Relay");
            relay(json);
            break;
        case "log":
            console.log(json);
            break;
    }
}
//TODO: "Better"?
function relay(msg) {
    console.log(msg);
    var receiver = msg.receiver;
    console.log(receiver);
    console.log(components);
    for (var i = 0; i < components.length; i++) {
        console.log(components[i].endpoint);
        if (components[i].endpoint == receiver ) {
            console.log("Endpoint: " + receiver + " reached." );
            components[i].receive(msg);
        };
    };
 }
