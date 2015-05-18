'use strict';
/**
 * Created by sirmonkey on 4/11/15.
 */
var ClientSessionController = require('./nephelin/ClientSessionController');
var mainpanel = require('./nephelin/mainpanel');
var menu = require('./nephelin/menu');

$( document ).ready(function() {
    console.log('ClientSessionController starting!');
    var csc = new ClientSessionController.csc('/NephelinServer');
    ClientSessionController.addReceiver(mainpanel.sp);
    ClientSessionController.addReceiver(menu.Menu);
    csc.openConnection();
    csc.buildComponents();
    console.log('ClientSessionController started!');
});
