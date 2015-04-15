'use strict';
/**
 * Created by sirmonkey on 4/13/15.
 */

/**
 * Maybe useful??
 * @param first
 * @param second
 * @returns {number}
 */

var scalarCrossProduct;
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
var Axial;
Axial = function Axial(q, r){
    this.q = q;
    this.r = r;
};
module.exports.Axial = Axial;


/**
 * Cube Coordinate aka 3D.
 *
 * @constructor
 * @param x
 * @param y
 * @param z
 */
var Cube;
Cube = function Cube(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
module.exports.Cube = Cube;

Axial.prototype.toCubefromOffset_OddR = function() {
    var x = this.q - (this.r - (this.r % 2)) / 2;
    var z = this.r;
    var y = -x-z;
    return new Cube(x,y,z);
};



Cube.prototype.toString = function() {
    return "x:" + this.x.toString() + "y:" +
        this.y.toString() + "z:" + this.z.toString();
};
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
    var q = this.x + (this.z - (this.z % 2)) / 2;
    var r = this.z;
    return new Axial(q, r);
};

/**
 * Rounds a floating point cube into the nearest integer cube.
 * @param cube
 * @returns {Cube}
 */
var cube_round = function cube_round(cube) {
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


    return new Cube(rx, ry, rz);
};
module.exports.cube_round = cube_round;

/**
 * Calculates the center of a Hexagon in canvas representation for a Odd Row Map
 *
 * @constructor
 * @param {Cube} coordinate
 * @param {Number} size of the Hexagon.
 * @returns {Axial}
 */
var hex_center = function hex_center(reference_point, coordinate, size) {
    //Todo Remove Magic and Unicorns
    var hex = coordinate.toOffset_OddR();
    var height = size  * 2;
    var width = Math.sqrt(3)/ 2 * height ;
    var x = (width / 2) + width*hex.q;
    var y = size + 3/4 * height * hex.r;
    if(hex.r === 0) {
        x = (width / 2) + width*hex.q;
        y = size;
    } else if(hex.r % 2 === 1){
        x = hex.q === 0 ? width:width+width*hex.q;
    }
    return new Axial(x + reference_point.q, y + reference_point.r);
};
module.exports.hex_center = hex_center;



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
var hex_corner  = function hex_corner(center, size, i, topped) {
    topped = typeof topped !== 'undefined' ?  topped : 'flat';
    var adjust = topped !== 'pointy' ? 0 : 90;
    var angle_deg = 60 * i + adjust;
    var angle_rad = Math.PI / 180 * angle_deg;
    return new Axial(center.q + size * Math.cos(angle_rad),
        center.r + size * Math.sin(angle_rad));
};
module.exports.hex_corner = hex_corner;
/**
 *
 * @param center
 * @param size
 * @returns {Array} Containing the Corners
 */
var hex_corners = function hex_corners(center, size) {
    var corners = [];
    for(var i = 0; i < 6; i=i+1) {
        corners.push(hex_corner(center,size, i, 'pointy'));
    }
    return corners;
};
module.exports.hex_corners = hex_corners;

function hex_neighbors(coordinate) {
    return [new Cube(coordinate.x+1, coordinate.y-1, coordinate.z),
        new Cube(coordinate.x+1, coordinate.y, coordinate.z-1),
        new Cube(coordinate.x, coordinate.y+1, coordinate.z-1),
        new Cube(coordinate.x-1, coordinate.y+1, coordinate.z),
        new Cube(coordinate.x-1, coordinate.y, coordinate.z+1),
        new Cube(coordinate.x, coordinate.y-1, coordinate.z+1)];
}
module.exports.hex_neighbors = hex_neighbors;


/**
 * Checks if the given point is inside the polygon.
 * Uses Cross Product (2D)
 * @param {Axial} point to check.
 * @param {Array} vertices
 * @returns {boolean} true if the point is inside and false if not.
 */
var isPointIn = function isPointIn (point, vertices) {
    //Todo Algorithm that detects sides.
    var i, j;
    var found = true;
    for (i = 0, j = vertices.length - 1; i < vertices.length && found; i+=1) {
        var xProduct = (vertices[j].q - vertices[i].q) *
            (point.r - vertices[i].r) - (vertices[j].r - vertices[i].r) *
            (point.q - vertices[i].q);
        if (0 < xProduct && found) {
            found = false;
        }
        j = i;
    }
    return found;
};
module.exports.isPointIn = isPointIn;
module.exports.pixelToCube = function pixelToCube(ref_point, point, size){
    //Todo Remove Magic and Unicorns
    // Magic and Unicorns -- Start
    var height = size  * 2;
    var width = Math.sqrt(3)/ 2 * height ;
    console.log(ref_point);
    var a = point.q - ref_point.q;
    var b = point.r - ref_point.r;
    var q = a/width -1/2;
    var r = (4 * (b - size) ) / (3 * height );
    // Magic and Unicorns -- End
    var floatingPointCube = (new Axial(q,r)).toCubefromOffset_OddR();
    var first_candidate_coord = cube_round(floatingPointCube);
    var neighbors = hex_neighbors(first_candidate_coord);
    var candidates = [first_candidate_coord].concat(neighbors);
    var result = null;
    for (var i = 0; i<candidates.length; i= i+1) {
        var center = hex_center(ref_point, candidates[i], size);
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
