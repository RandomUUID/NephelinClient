'use strict';
/**
 * @param columnSize
 * @param hexagonSideSize
 * @param mapType
 * @constructor
 */
var Hexagon = require('./Hexagon');
var mapgen = require('./MapGenerators');
var HexagonAlgebra = require('./HexagonAlgebra');
var CanvasHelper = require('./CanvasHelper');
var Assets = require('./Assets');
var context = require('./context');
var selectImg;

//TODO: getCanvas from SidePanel
var Board;
Board =  function Board(columnSize, hexagonSideSize, mapType) {
    var self = this;

    this.reference_point = new HexagonAlgebra.Axial(350,400);
    this.hexagonSideSize = hexagonSideSize;
    this.columnSize = columnSize;
    this.mapType = mapType;
    this.hexagonQueue = {};
    switch (mapType) {
        case 'oddRowMap':
            this.map = mapgen.oddRowMap(columnSize, hexagonSideSize);
            break;
        default :
            this.map = mapgen.normalMap(columnSize, hexagonSideSize);
            break;
    }
    this.actions = {
        selectHexagon: function selectHexagon(hexagon) {
            if(typeof self.hexagonQueue[hexagon.coordinate] === 'undefined'){
                hexagon.bgImg = selectImg || Assets.images['bg_grey'].image;
                self.hexagonQueue[hexagon.coordinate] = hexagon;
            }
            else{
                hexagon.bgImg = Assets.images['bg_grey'].image;
                delete self.hexagonQueue[hexagon.coordinate];
            }
        }
    };


    this.handlers = {
        click: function clickHandler(e) {
            //Todo refactor to be independent of click event
            console.log('click_offset: ' + e.offsetX + '/' + e.offsetY);
            var click_point = new HexagonAlgebra.Axial(e.offsetX, e.offsetY);
            var coordinate = HexagonAlgebra.pixel_to_hex(self.reference_point, click_point, self.hexagonSideSize);
            var hex = self.map[coordinate];
            var canvas =CanvasHelper.getCanvas();
            var ctx = canvas.getContext('2d');
            if(e.button === 0){                                             //Leftclick = 0
                if (typeof hex !== 'undefined' && e.button === 0) {
                    console.log("It's a hit!");
                    self.actions.selectHexagon(hex);
                    Hexagon.drawHexagon(ctx,hex);
                    console.log(self.map[coordinate]);

                } else {
                    console.log("No hit!");
                }
                if (typeof Object.keys(self.hexagonQueue) !== 'undefined') {
                    drawMap(canvas, self.hexagonQueue, self.reference_point);
                }
            }
        },
        scroll: function scrollHandler(canvas, movement_vector) {
            self.reference_point.q -= movement_vector.q;
            self.reference_point.r -= movement_vector.r;
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            drawMap(canvas, self.map, self.reference_point);
            drawMap(canvas, self.hexagonQueue, self.reference_point);
        }
    };
};
module.exports = Board;

function drawHexagonGrid(ctx, map, reference_point) {
    for(var coordinate_hexagon in map) {
        if (map.hasOwnProperty(coordinate_hexagon)) {
            // prop is not inherited
            var hex = map[coordinate_hexagon];
            hex.calcAltPoints(reference_point);
            Hexagon.drawHexagon(ctx, hex);
        }
    }
}

module.exports.changeSelect = function changeSelect(color) {
    if(color === "red") {
        selectImg = Assets.images['bg_red'].image;
    }
    if(color === "blue") {
       selectImg = Assets.images['bg_blue'].image;
    }
};

/**
 *  *
 * @param {CanvasRenderingContext2D} canvas - html canvas
 * @param hex
 */
function drawMap(canvas, map, reference_point) {
    var ctx = canvas.getContext('2d');
    reference_point = reference_point || new HexagonAlgebra.Axial(350,400);
    drawHexagonGrid(ctx, map, reference_point);
    // drawForeground(ctx);
}
module.exports.drawMap = drawMap;





// Test key movement (catch arrow key events)
//turnKeys = function() {
//    //TODO Something useful
//    $(document).keydown(function(e) {
//        switch(e.which) {
//            case 37: // left
//                console.log("left");
//                break;
//
//            case 38: // up
//                console.log("up");
//                break;
//
//            case 39: // right
//                console.log("right");
//                break;
//            case 40: // down
//                console.log("down");
//                break;
//
//            default: return; // exit this handler for other keys
//        }
//        e.preventDefault(); // prevent the default action (scroll / move caret)
//    });
//};
