/**
 * @author Petr Kratochvila poooow@gmail.com
 */


function rand(min, max) {
    return parseInt(Math.random() * (max - min + 1), 10) + min;
}

/* Default color format */
var format = 'hex';

/**
 *  Convert hsl color to rgb
 *
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @returns {*[]}  RGB Color values (0-255)
 */
function hslToRgb(h, s, l) {
    var m1, m2, hue;
    var r, g, b;
    s /= 100;
    l /= 100;
    if (s == 0)
        r = g = b = (l * 255);
    else {
        if (l <= 0.5)
            m2 = l * (s + 1);
        else
            m2 = l + s - l * s;
        m1 = l * 2 - m2;
        hue = h / 360;
        r = Math.round(HueToRgb(m1, m2, hue + 1 / 3));
        g = Math.round(HueToRgb(m1, m2, hue));
        b = Math.round(HueToRgb(m1, m2, hue - 1 / 3));
    }
    return [r, g, b];
}

function HueToRgb(m1, m2, hue) {
    var v;
    if (hue < 0)
        hue += 1;
    else if (hue > 1)
        hue -= 1;

    if (6 * hue < 1)
        v = m1 + (m2 - m1) * hue * 6;
    else if (2 * hue < 1)
        v = m2;
    else if (3 * hue < 2)
        v = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
    else
        v = m1;

    return 255 * v;
}

/**
 * Convert hsl color ot hex
 *
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 */

function hslToHex(h, s, l) {
    var color = hslToRgb(h, s, l);

    color = color.map(function (v) {
        return v.toString(16);
    });

    return color;
}

/**
 * Generate num of colors for palette of given parameters
 *
 * @param num
 * @param saturation
 * @param lightness
 * @param hueMin Minimal hue value
 * @param hueMax Maximal hue value
 * @param type 'hsl', 'hex', 'rgb' (to be done)
 * @returns {Array} array of colors in requested type declaration
 */

function get_palette_colors(num, saturation, lightness, hueMin, hueMax, type) {
    var palette = [];
    var currentColor;
    var hue;
    var hueRange = hueMax - hueMin;

    for (var i = 0; i < num; i++) {
        hue = Math.floor((hueRange / num) * i) + hueMin;

        if (type == 'hsl') {
            currentColor = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
        } else if (type == 'rgb') {
            currentColor = hslToRgb(hue, saturation, lightness);
            currentColor = "rgb(" + currentColor.join(",") + ")";
        } else {
            currentColor = hslToHex(hue, saturation, lightness);
            currentColor = "#" + currentColor.join("");
        }
        palette.push(currentColor);
    }
    return palette;
}
/**
 * Generate palette
 *
 * @param num Number of colors in palette
 * @param saturation
 * @param lightness
 * @param hueMin Minimal hue value
 * @param hueMax Maximal hue value
 * @param format 'hex', 'hsl', 'rgb'
 */
function generatePalette(num, saturation, lightness, hueMin, hueMax, format) {
    var paletteDiv = document.getElementById('palette');
    /* Clean palette div */
    paletteDiv.innerHTML = '';

    /* To display color itself */
    var paletteColors = get_palette_colors(num, saturation, lightness, hueMin, hueMax, 'hsl');
    /* To make label */
    var paletteColorsHex = get_palette_colors(num, saturation, lightness, hueMin, hueMax, format);

    for (var i = paletteColors.length - 1; i >= 0; i--) {

        /* Colored circle */
        var color = document.createElement('div');
        color.style.backgroundColor = paletteColors[i];
        color.id = 'color';
        paletteDiv.appendChild(color);

        /* Color label */
        var colorLabel = document.createElement('div');
        colorLabel.innerHTML = colorLabel.innerHTML + paletteColorsHex[i];
        colorLabel.className = 'color-label';
        color.appendChild(colorLabel);
    }
}

/**
 *  Change palette parameters (trigger when changed)
 *  @param format
 */
function changeColors() {
    var num = $("#num").slider("value");
    var saturation = $("#saturation").slider("value");
    var lightness = $("#lightness").slider("value");
    var hueMin = $("#hue").slider("values", 0);
    var hueMax = $("#hue").slider("values", 1);


    updateValueLabels(num, saturation, lightness, hueMin, hueMax);
    generatePalette(num, saturation, lightness, hueMin, hueMax, format);
}

/**
 *  Update value labels
 *
 * @param n Number of colors in palette
 * @param s Saturation
 * @param l Lightness
 * @param hueMin
 * @param hueMax
 */
function updateValueLabels(n, s, l, hueMin, hueMax) {
    document.getElementById("sum-value").innerHTML = "(" + n + ")";
    document.getElementById("saturation-value").innerHTML = "(" + s + ")";
    document.getElementById("lightness-value").innerHTML = "(" + l + ")";
    document.getElementById("hue-value").innerHTML = "(" + hueMin + "," + hueMax + ")";
}

function randomize() {
    $("#saturation").slider('value', rand(0, 100));
    $("#lightness").slider('value', rand(0, 100));

    var min = rand(0, 360);
    var max = rand(0, 360);

    if (min > max) {
        min = min + max;
        max = min - max;
        min = min - max;
    }

    $("#hue").slider('values', 0, min);
    $("#hue").slider('values', 1, max);

}

$(function () {
    $("#saturation, #lightness").slider({
        slide: changeColors,
        change: changeColors,
        value: 50
    });
    $("#num").slider({
        slide: changeColors,
        change: changeColors,
        value: 7,
        min: 1,
        max: 64
    });
    $("#hue").slider({
        slide: changeColors,
        change: changeColors,
        range: true,
        values: [0, 360],
        max: 360
    });

    $("#hex").click(function (event) {
        event.preventDefault();
        format = 'hex';
        changeColors();
    });
    $("#rgb").click(function (event) {
        event.preventDefault();
        format = 'rgb';
        changeColors();
    });
    $("#hsl").click(function (event) {
        event.preventDefault();
        format = 'hsl';
        changeColors();
    });

    $("#random").click(function (event) {
        event.preventDefault();
        randomize();
        changeColors();
    });
});

$(document).ready(function () {

    /* Display palette when document loads */
    changeColors();
});