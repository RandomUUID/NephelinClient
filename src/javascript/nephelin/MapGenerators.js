'use strict';
/**
 * Created by sirmonkey on 4/13/15.
 */
var Hexagon = require('./Hexagon');
var HexagonAlgebra = require('./HexagonAlgebra');
var Assets = require('./Assets');
module.exports.oddRowMap =  function oddRowMap(columnSize, hexagonSideSize) {
    var map = {};
    var track = 0;
    var hex_count = 0;
    for (var z = 0; z < columnSize; z+=1) {
        var res = z % 2;
        var x_count = columnSize - (res);
        var x = 0;
        if (res === 0 && z > 0) {
            track= track + 1;
            x = x - track;
            x_count = x_count - track;
        }
        if (res === 1) {
            x = 0 - track;
            x_count = x_count - track;
        }
        for (;x < x_count; x+=1) {
            var y  = -x-z;
            var coordinates = new HexagonAlgebra.Cube(x, y, z);
            var stopRandom = false;
            if (Math.floor(Math.random() * 2) === 0 || stopRandom) {
                var hexagon = new Hexagon(coordinates, hexagonSideSize);
                hex_count= hex_count + 1;
                map[coordinates]= hexagon;
            }
        }
    }
    console.log("Hex Count: " + hex_count);
    return map;
};
module.exports.normalMap =  function normalMap(columnSize, hexagonSideSize) {
    var map = {};
    var track = 0;
    var hex_count = 0;
    for (var z = 0; z < columnSize; z+=1) {
        var res = z % 2;
        var x_count = columnSize - (res);
        var x = 0;
        if (res === 0 && z > 0) {
            track= track + 1;
            x = x - track;
            x_count = x_count - track;
        }
        if (res === 1) {
            x = 0 - track;
            x_count = x_count - track;
        }
        for (;x < x_count; x+=1) {
            var y  = -x-z;
            var coordinates = new HexagonAlgebra.Cube(x, y, z);
            var stopRandom = true;
            if (Math.floor(Math.random() * 2) === 0 || stopRandom) {
                var hexagon = new Hexagon(coordinates, hexagonSideSize, Assets.images['bg_grey']);
                hexagon.calcAltPoints(new HexagonAlgebra.Axial(0,0));
                hex_count += 1;
                map[coordinates]= hexagon;
            }
        }
    }
    console.log("Hex Count: " + hex_count);
    return map;
};