'use strict';
/**
 * Created by tobias on 26.05.15.
 */

var ComponentBuilder;
ComponentBuilder = function ComponentBuilder(self) {
    this.self = self;
    this.receivers = [];
    this.components = {};
};
ComponentBuilder.prototype.addReceiver             = function (receiver) {
    this.receivers.push(receiver);
};
ComponentBuilder.prototype.build = function build() {
    console.log("Components found: " + this.receivers.length);
    for (var index = 0; index < this.receivers.length; index+=1) {
        var ComponentConstructor = this.receivers[index];
        console.log("Nichts!")
        console.log(this.self.send);
        console.log(this.self.socket);
        var cmp        = new ComponentConstructor(this.self.send, this.self.socket);
        this.components[cmp.name] = cmp;
    }
    console.log("Components build: " + this.components.length);
    console.log("----------");
};
module.exports.ComponentBuilder = ComponentBuilder;