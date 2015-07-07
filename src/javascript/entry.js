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

    var csc = new ClientSessionController.ClientSessionController('/NephelinServer');
    csc.addReceiver(mainpanel.sp);
    csc.addReceiver(context.Context);
    csc.addReceiver(menu.Menu);
    function onLoadingDone() {
        csc.openConnection();
        csc.build();
    }
    Assets.preload(onLoadingDone);
    console.log('ClientSessionController started!');
});
