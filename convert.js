/*jslint browser: false, nodejs: true */
/*global require, process */

var argsGet = (function () {
    var index = 1;

    return function (fallback) {
        ++index;
        return process.argv[index] !== undefined ? process.argv[index] : fallback;
    };
} ());

var modelName = argsGet('tchest.mdl'),
    mode = argsGet('toBin'),
    readerBase,
    writerBase,
    data;

if (mode === 'toBin') {
    readerBase = require('./lib/MdlDataNormalization.js');
    writerBase = require('./lib/MdlBinaryWriter.js');
    data = new readerBase(['in', modelName].join('/'));

    new writerBase(data.getNormalized(), ['out/', modelName, '.bin'].join(''));
}

if (mode === 'toJson') {

}
