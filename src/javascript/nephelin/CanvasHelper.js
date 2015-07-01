'use strict';
/**
 * Created by sirmonkey on 4/18/15.
 */

function getCanvas() {
    if ($("#cv").length) {
        return $("#cv").get(0);
    } else {
        console.log('Error: Canvas not found with selector #cv');
    }
}
module.exports.getCanvas = getCanvas;