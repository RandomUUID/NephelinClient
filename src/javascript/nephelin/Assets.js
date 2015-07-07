'use strict';
/**
 * Created by sirmonkey on 7/7/15.
 */

var images = {};
var counter = 0;

images['bg_grey'] = {'description':'Grey background texture',
                        'url':'images/bg_grey.png'};
images['bg_blue'] = {'description':'Blue background texture',
    'url':'images/bg_blue.png'};
images['bg_red'] = {'description':'Red background texture',
    'url':'images/bg_red.png'};


function preload(callback) {
    var keys = Object.keys(images);
    for(var i = 0; i<keys.length; i+=1) {
        var key = keys[i];
        var img = new Image();
        img.onload = function() {
            counter +=1;
            if (counter === keys.length) {
                console.log("Finished Loading!");
                callback();
            }
        };
        img.src = images[key].url;
        images[key]['image'] = img;
        console.log("Preloading: " + images[key].url);
    }
}
module.exports.images  = images;
module.exports.preload = preload;
