/**
 * @param columnSize
 * @param hexagonSideSize
 * @param mapType
 * @constructor
 */
Board = function(columnSize, hexagonSideSize, mapType) {
    this.map = null;
    this.hexagonSideSize = hexagonSideSize;
    this.columnSize = columnSize;
    this.mapType = mapType;
    switch (mapType) {
        case 'oddRowMap':
            this.map = oddRowMap(columnSize, hexagonSideSize);
            break;
        default :
            this.map = oddRowMap(columnSize, hexagonSideSize);
            break
    }
};

oddRowMap = function(columnSize, hexagonSideSize) {
    var map = {};
    var track = 0;
    var hex_count = 0;
    for (var z = 0; z < columnSize; z++) {
        var res = z % 2;
        var x_count = columnSize - (res);
        var x = 0;
        if (res == 0 && z > 0) {
            track++;
            x = x - track;
            x_count = x_count - track;
        }
        if (res == 1) {
            x = 0 - track;
            x_count = x_count - track;
        }
        for (;x < x_count; x++) {
            var y  = -x-z;
            var coordinates = new Cube(x, y, z);
            var stopRandom = false;
            if (Math.floor(Math.random() * 2) == 0 || stopRandom) {
                var hexagon = new Hexagon(coordinates, hexagonSideSize);
                hex_count++;
                map[coordinates]= hexagon;
            }
        }
    }
    console.log("Hex Count: " + hex_count);
    return map
};

/**
 *  *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param hex
 */
drawMap = function (ctx, map) {
    drawHexagonGrid(ctx, map);
    // drawForeground(ctx);
};

drawHexagonGrid= function(ctx, map) {
    for(var coordinate_hexagon in map) {
        drawHexagon(ctx, map[coordinate_hexagon]);
    }
};

boardClickListener = function(e, board) {
    //Todo refactor to be independent of click event
    console.log('click_offset: ' + e.offsetX + '/' + e.offsetY);
    var click_point = new Axial(e.offsetX, e.offsetY);
    var coordinate = pixelToCube(click_point, board.hexagonSideSize);
    if (typeof board.map[coordinate] !== 'undefined') {
        console.log("It's a hit!");
        console.log(board.map[coordinate]);
    } else {
        console.log("No hit!")
    }
};

// Test key movement (catch arrow key events)
turnKeys = function() {
    //TODO Something useful
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                console.log("left");
                break;

            case 38: // up
                console.log("up");
                break;

            case 39: // right
                console.log("right");
                break;
            case 40: // down
                console.log("down");
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
};
