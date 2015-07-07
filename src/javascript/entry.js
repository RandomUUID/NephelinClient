'use strict';
/**
 * Created by sirmonkey on 4/11/15.
 */
var ClientSessionController = require('./nephelin/ClientSessionController');
var mainpanel = require('./nephelin/mainpanel');
var context = require('./nephelin/context');
var menu = require('./nephelin/menu');
var Assets = require('./nephelin/Assets');

$( document ).ready(function() {
    console.log('ClientSessionController starting!');
    Assets.preload();
    var csc = new ClientSessionController.ClientSessionController('/NephelinServer');


    csc.addReceiver(mainpanel.sp);
    csc.addReceiver(context.Context);
    csc.addReceiver(menu.Menu);
    csc.openConnection();
    csc.build();
    console.log('ClientSessionController started!');
});
