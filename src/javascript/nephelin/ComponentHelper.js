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
    var built = 0;
    for (var index = 0; index < this.receivers.length; index+=1) {
        var ComponentConstructor = this.receivers[index];
        var cmp        = new ComponentConstructor(this.self.send, this.self.socket);
        this.components[cmp.name] = cmp;
        built += 1;
    }
    console.log("Components built: " + built);
    console.log("----------");
};
module.exports.ComponentBuilder = ComponentBuilder;