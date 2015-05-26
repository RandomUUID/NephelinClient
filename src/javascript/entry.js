'use strict';
/**
 * Created by sirmonkey on 4/11/15.
 */
var clientSessionController = require('./nephelin/ClientSessionController');
var mainpanel = require('./nephelin/mainpanel');
var context = require('./nephelin/context');
var menu = require('./nephelin/menu');
var board = require('./nephelin/Board');

$( document ).ready(function() {
    console.log('ClientSessionController starting!');
    var csc = new clientSessionController.ClientSessionController('/NephelinServer');

    csc.addComponent(mainpanel.MainPanel);
    csc.addComponent(context.Context);
    csc.addComponent(menu.Menu);
    csc.openConnection();
    csc.build();
    var mm = csc.getComponent('mainpanel');
    mm.addComponent(board.Board);
    mm.build();
    console.log('ClientSessionController started!');
});
