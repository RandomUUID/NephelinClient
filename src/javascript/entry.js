/**
 * Created by sirmonkey on 4/11/15.
 */
var ClientSessionController = require('./nephelin/ClientSessionController');
var SidePanel = require('./nephelin/SidePanel');

$( document ).ready(function() {
    SidePanel.test();
    var csc = new ClientSessionController.csc('/NephelinServer');
    ClientSessionController.addReceiver(SidePanel.sp);
    csc.openConnection();
    csc.buildComponents();
    console.log('ClientSessionController Starting!');
});
