'use strict';
/**
 * Created by sirmonkey on 7/7/15.
 */

var images = {};

images['bg_grey'] = {'description':'Grey background texture',
                        'url':'images/bg_grey.png'};
images['bg_blue'] = {'description':'Blue background texture',
    'url':'images/bg_blue.png'};
images['bg_red'] = {'description':'Red background texture',
    'url':'images/bg_red.png'};

function preload() {
    for(var key in images) {
        var img = new Image();
        img.onload = function() {
            console.log('Image loaded!');
        };
        img.src = images[key].url;
        images[key]['image'] = img;
        console.log("Preloading: " + images[key].url);
    }
}
module.exports.images  = images;
module.exports.preload = preload;
