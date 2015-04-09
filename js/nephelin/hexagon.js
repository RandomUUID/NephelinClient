/**
 * Created by sirmonkey on 4/2/15.
 */


/*
 * ##############################################################################################
 * #										Hexagon												#
 * ##############################################################################################
 */

/**
 *
 * @constructor
 * @param {Cube} coordinate triplet (x , y, z)
 * @param {number} hexagonSideSize - Side length from the hexagon.
 */
function Hexagon(coordinate, hexagonSideSize) {
    this.coordinate = coordinate;
    this.center = hex_center(this.coordinate, hexagonSideSize);
    this.corners = hex_corners(this.center, hexagonSideSize);
    this.size = hexagonSideSize;
    this.bgImg = new Image();
    this.bgImg.src = "img/normal.png";
    this.foregroundImg = null;
    this.bordersColor = ['black','black','black','black','black','black']
}

/**
 * Checks if the given point is inside the polygon.
 * Uses Cross Product (2D)
 * @param {Axial} point to check.
 * @param {Array} vertices
 * @returns {boolean} true if the point is inside and false if not.
 */
isPointIn = function (point, vertices) {
    //Todo polygon sides are marked as outside -- maybe implement another algorithm.
    var i, j;
    var found = true;
    for (i = 0, j = vertices.length - 1; i < vertices.length && found; j = i++) {
        var xProduct = (vertices[j].q - vertices[i].q) * (point.r - vertices[i].r)
                      -(vertices[j].r - vertices[i].r) * (point.q - vertices[i].q);
        if (0 < xProduct && found) found = false;
    }
    return found;
};

/**
 * Maybe useful??
 * @param first
 * @param second
 * @returns {number}
 */
scalarCrossProduct = function (first, second) {
    return (first.q - second.q ) * (first.r - second.r);
};
/**
 * Axial Coordinate Point on cavas
 *
 * @constructor
 * @param q Column (x-axis on convas)
 * @param r Row (y-axis on canvas)
 */
Axial = function(q, r){
    this.q = q;
    this.r = r;
};

Axial.prototype.toCubefromOffset_OddR = function() {
    var x = this.q - (this.r - (this.r&1)) / 2;
    var z = this.r;
    var y = -x-z;
    return new Cube(x,y,z);
};

/**
 * Cube Coordinate aka 3D.
 *
 * @constructor
 * @param x
 * @param y
 * @param z
 */
Cube = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
Cube.prototype.toString = function() {
    return "x:" + this.x.toString() + "y:" + this.y.toString() + "z:" + this.z.toString();
}
/**
 * Converts cube coordinate into axial coordinate.
 * @returns {Axial}
 */
Cube.prototype.toAxial = function() {
    return new Axial(this.x, this.y);
};

/**
 * Converts cube coordinates to "easy" canvas coordinates.
 * @returns {Axial}
 */
Cube.prototype.toOffset_OddR = function () {
    var q = this.x + (this.z - (this.z&1)) / 2;
    var r = this.z;
    return new Axial(q, r);
};
/**
 * Rounds a floating point cube into the nearest integer cube.
 * @param cube
 * @returns {Cube}
 */
cube_round = function(cube) {
    var rx = Math.round(cube.x);
    var ry = Math.round(cube.y);
    var rz = Math.round(cube.z);

    var x_diff = Math.abs(rx - cube.x);
    var y_diff = Math.abs(ry - cube.y);
    var z_diff = Math.abs(rz - cube.z);

    if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry-rz;
    }else if (y_diff > z_diff) {
        ry = -rx-rz;
    }
    else {
        rz = -rx-ry;
    }


    return new Cube(rx, ry, rz)
}

/**
 * Calculates the center of a Hexagon in canvas representation for a Odd Row Map
 *
 * @constructor
 * @param {Cube} coordinate
 * @param {Number} size of the Hexagon.
 * @returns {Axial}
 */
hex_center = function(coordinate, size) {
    //Todo Remove Magic and Unicorns
    var hex = coordinate.toOffset_OddR();
    var height = size  * 2;
    var width = Math.sqrt(3)/ 2 * height ;
    var x = (width / 2) + width*hex.q;
    var y = size + 3/4 * height * hex.r
    if(hex.r == 0) {
        x = (width / 2) + width*hex.q;
        y = size
    } else if(hex.r % 2 == 1){
        x = hex.q == 0 ? width:width+width*hex.q;
    }
    return new Axial(x, y);
};

pixelToCube = function(point, size){
    //Todo Remove Magic and Unicorns
    // Magic and Unicorns -- Start
    var height = size  * 2;
    var width = Math.sqrt(3)/ 2 * height ;
    var q = point.q/width -1/2;
    var r = (4 * (point.r - size) ) / (3 * height );
    // Magic and Unicorns -- End
    var floatingPointCube = (new Axial(q,r)).toCubefromOffset_OddR(); // Refactor this?
    var first_candidate_coord = cube_round(floatingPointCube);
    var neighbors = hex_neighbors(first_candidate_coord);
    var candidates = [first_candidate_coord].concat(neighbors);
    var result = null;
    for (var i = 0; i<candidates.length; i++) {
        var center = hex_center(candidates[i], size);
        if (isPointIn(point, hex_corners(center, size))) {
            console.log("Coordinate converted");
            console.log('Candidate Nr: ' + i);
            console.log((candidates[i]));
            result = candidates[i];
            break;
        }
    }
    return result;
};


//TODO: Better ASCII ART
/**
 *    0____1
 *   /      \
 * 5/   C    \2
 *  \       /
 *  4\ ___ /3
 * @param center
 * @param size
 * @param i
 * @param topped Orientation (pointy or flat)
 * @returns {Axial}
 */
hex_corner = function (center, size, i, topped) {
    topped = typeof topped !== 'undefined' ?  topped : 'flat';
    var adjust = topped !== 'pointy' ? 0 : 90;
    var angle_deg = 60 * i + adjust;
    var angle_rad = Math.PI / 180 * angle_deg;
    return new Axial(center.q + size * Math.cos(angle_rad),
        center.r + size * Math.sin(angle_rad));
};
/**
 *
 * @param center
 * @param size
 * @returns {Array} Containing the Corners
 */
hex_corners = function (center, size) {
    var corners = [];
    for(var i = 0; i < 6; i++) {
        corners.push(hex_corner(center,size, i, 'pointy'));
    }
    return corners;
};

hex_neighbors = function(coordinate) {
    return [new Cube(coordinate.x+1, coordinate.y-1, coordinate.z), new Cube(coordinate.x+1, coordinate.y, coordinate.z-1),
            new Cube(coordinate.x, coordinate.y+1, coordinate.z-1), new Cube(coordinate.x-1, coordinate.y+1, coordinate.z),
            new Cube(coordinate.x-1, coordinate.y, coordinate.z+1), new Cube(coordinate.x, coordinate.y-1, coordinate.z+1)];
};


/**
 * Draws the Hexagon into the given context.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param hex
 */
drawHexagon = function (ctx, hex) {
    drawHexagonBackground(ctx, hex);
    drawHexagonSides(ctx, hex);
    //drawTestGrid(ctx, hex);
    drawForeground(ctx, hex);
};

/**
 * Creates the hexagon path for drawing.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param first
 * @param second
 * @param begin
 * @param close
 */
setHexagonSide = function (ctx , first, second, begin , close ) {
    //TODO: Refactor
    begin = typeof begin !== 'undefined' ?  begin : true;
    close = typeof close !== 'undefined' ?  close : true;
    if (begin) {
        ctx.beginPath();
        ctx.moveTo(first.q, first.r);
    }
    ctx.lineTo(second.q, second.r);
    if (close) ctx.closePath();
};
drawHexagonSide = function (ctx , first, second, color) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    setHexagonSide(ctx,first,second);
    ctx.stroke();
};

/**
 * Draws the Hexagon's border.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param hex
 */
drawHexagonSides = function (ctx, hex) {
    //TODO: Refactor
    ctx.save();
    for (var i = 0; i < hex.bordersColor.length; i++) {
        var second = hex.corners[(i+1) % hex.bordersColor.length];
        drawHexagonSide(ctx,hex.corners[i],second, hex.bordersColor[i])
    }
    ctx.restore();
};

/**
 * Something about clipping
 * @param ctx
 * @param hex
 */
setHexagonSides = function(ctx, hex) {
    //TODO: Refactor -- Magic & Unicorns
    setHexagonSide(ctx, hex.corners[0], hex.corners[1], true, false);
    setHexagonSide(ctx, hex.corners[1], hex.corners[2], false, false);
    setHexagonSide(ctx, hex.corners[2], hex.corners[3], false, false);
    setHexagonSide(ctx, hex.corners[3], hex.corners[4], false, false);
    setHexagonSide(ctx, hex.corners[4], hex.corners[5], false, false);
    setHexagonSide(ctx, hex.corners[5], hex.corners[0], false, true);

};

/**
 * Draws the Hexagon Background.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param {Hexagon} hex
 */
drawHexagonBackground = function (ctx, hex) {
    if (hex.bgImg != null) {
        ctx.save();
        setHexagonSides(ctx, hex);
        ctx.clip();
        ctx.drawImage(hex.bgImg, 0, 0, hex.bgImg.width, hex.bgImg.height, hex.corners[5].q, hex.corners[0].r, hex.corners[2].q - hex.corners[5].q, hex.corners[3].r - hex.corners[0].r);
        ctx.restore();
    }
};

/**
 * Draws the Hexagon Background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Hexagon} hex
 */
drawForeground = function (ctx, hex) {
    ctx.save();
    ctx.font="12px Consolas";

    var tmp = hex.coordinate.toOffset_OddR();
    ctx.fillStyle = 'Blue';
    ctx.fillText(hex.coordinate.z, hex.corners[0].q - 6, hex.corners[0].r - 12.5);
    ctx.fillStyle = 'DarkSalmon';
    ctx.fillText(hex.coordinate.y, hex.corners[2].q + 7.5, hex.corners[2].r + 7.5);
    ctx.fillStyle = 'LightGreen';
    ctx.fillText(hex.coordinate.x, hex.corners[4].q - 12, hex.corners[2].r + 7.5);
    ctx.fillStyle = 'white';
    ctx.fillText(tmp.r+"/"+tmp.q+"", hex.center.q - 6, hex.center.r + 6);
    //"/"+hex.coordinate.z+"/"+hex.coordinate.x, hex.center.q - 15, hex.center.r + 7.5);
    ctx.restore();
};

/**
 * Draws a 'Grid' on the Hexagons
 * @param ctx
 * @param hex
 */
drawTestGrid = function (ctx, hex) {
    ctx.save();
    var color = 'white';
    drawHexagonSide(ctx,hex.corners[0], hex.corners[3], color);
    drawHexagonSide(ctx,hex.corners[1], hex.corners[5], color);
    drawHexagonSide(ctx,hex.corners[2], hex.corners[4], color);
    ctx.restore();
};

