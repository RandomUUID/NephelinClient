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
var Board;
Board =  function Board(columnSize, hexagonSideSize, mapType) {

    this.hexagonSideSize = hexagonSideSize;
    this.columnSize = columnSize;
    this.mapType = mapType;
    switch (mapType) {
        case 'oddRowMap':
            this.map = mapgen.oddRowMap(columnSize, hexagonSideSize);
            break;
        default :
            this.map = mapgen.oddRowMap(columnSize, hexagonSideSize);
            break;
    }
};
module.exports = Board;


function drawHexagonGrid(ctx, map) {
    for(var coordinate_hexagon in map) {
        Hexagon.drawHexagon(ctx, map[coordinate_hexagon]);
    }
}

/**
 *  *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param hex
 */
module.exports.drawMap = function drawMap(ctx, map) {
    drawHexagonGrid(ctx, map);
    // drawForeground(ctx);
};

Board.prototype = {
    handlers: {
        click: function boardClickListener(e, board) {
            //Todo refactor to be independent of click event
            console.log('click_offset: ' + e.offsetX + '/' + e.offsetY);
            var click_point = new HexagonAlgebra.Axial(e.offsetX, e.offsetY);
            var coordinate = HexagonAlgebra.pixelToCube(click_point, board.hexagonSideSize);
            if (typeof board.map[coordinate] !== 'undefined') {
                console.log("It's a hit!");
                console.log(board.map[coordinate]);
            } else {
                console.log("No hit!");
            }
        }
    }
};


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
