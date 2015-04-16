'use strict';
/**
 * Created by sirmonkey on 4/2/15.
 */


var HexagonAlgebra = require('./HexagonAlgebra');
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
var Hexagon;
Hexagon = function Hexagon(coordinate, hexagonSideSize) {
    this.coordinate = coordinate;
    this.size = hexagonSideSize;
    this.center     = null;
    this.corners    = null;
    this.calcPoints(new HexagonAlgebra.Axial(0,0));

    this.bgImg = new Image();
    this.bgImg.src = "images/normal.png";
    this.foregroundImg = null;
    this.bordersColor = ['black','black','black','black','black','black'];
    this.selected = false;
};
module.exports = Hexagon;

Hexagon.prototype = {
    calcPoints: function calcPoints(reference_point) {
        this.center     = HexagonAlgebra.hex_center(reference_point, this.coordinate, this.size);
        this.corners    = HexagonAlgebra.hex_corners(this.center, this.size);
    }
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
function setHexagonSide(ctx , first, second, begin , close ) {
    //TODO: Refactor
    begin = typeof begin !== 'undefined' ?  begin : true;
    close = typeof close !== 'undefined' ?  close : true;
    if (begin) {
        ctx.beginPath();
        ctx.moveTo(first.q, first.r);
    }
    ctx.lineTo(second.q, second.r);
    if (close) {ctx.closePath();}
}


function drawHexagonSide(ctx , first, second, color) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    setHexagonSide(ctx,first,second);
    ctx.stroke();
}

/**
 * Draws the Hexagon's border.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param hex
 */
function drawHexagonSides(ctx, hex) {
    //TODO: Refactor
    ctx.save();
    for (var i = 0; i < hex.bordersColor.length; i+=1) {
        var second = hex.corners[(i+1) % hex.bordersColor.length];
        drawHexagonSide(ctx,hex.corners[i],second, hex.bordersColor[i]);
    }
    ctx.restore();
}
module.exports.drawHexagonSides = drawHexagonSides;

/**
 * Something about clipping
 * @param ctx
 * @param hex
 */
function setHexagonSides(ctx, hex) {
    //TODO: Refactor -- Magic & Unicorns
    setHexagonSide(ctx, hex.corners[0], hex.corners[1], true, false);
    setHexagonSide(ctx, hex.corners[1], hex.corners[2], false, false);
    setHexagonSide(ctx, hex.corners[2], hex.corners[3], false, false);
    setHexagonSide(ctx, hex.corners[3], hex.corners[4], false, false);
    setHexagonSide(ctx, hex.corners[4], hex.corners[5], false, false);
    setHexagonSide(ctx, hex.corners[5], hex.corners[0], false, true);

}

/**
 * Draws the Hexagon Background.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param {Hexagon} hex
 */
function drawHexagonBackground(ctx, hex) {
    if (hex.bgImg !== null) {
        ctx.save();
        setHexagonSides(ctx, hex);
        ctx.clip();
        ctx.drawImage(hex.bgImg, 0, 0, hex.bgImg.width, hex.bgImg.height, hex.corners[5].q, hex.corners[0].r, hex.corners[2].q - hex.corners[5].q, hex.corners[3].r - hex.corners[0].r);
        ctx.restore();
    }
}

/**
 * Draws the Hexagon Background.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Hexagon} hex
 */
function drawForeground(ctx, hex) {
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
}

/**
 * Draws a 'Grid' on the Hexagons
 * @param ctx
 * @param hex
 */
function drawTestGrid(ctx, hex) {
    ctx.save();
    var color = 'white';
    drawHexagonSide(ctx,hex.corners[0], hex.corners[3], color);
    drawHexagonSide(ctx,hex.corners[1], hex.corners[5], color);
    drawHexagonSide(ctx,hex.corners[2], hex.corners[4], color);
    ctx.restore();
}

/**
 * Draws the Hexagon into the given context.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
 * @param hex
 */
module.exports.drawHexagon = function drawHexagon(ctx, hex) {
    drawHexagonBackground(ctx, hex);
    drawHexagonSides(ctx, hex);
    //drawTestGrid(ctx, hex);
    drawForeground(ctx, hex);
};