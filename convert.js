/*jslint browser: false */
/*global require */

var modelName = 'worm.mdl',
    readerBase = require('./lib/MdlDataNormalization.js'),
    writerBase = require('./lib/MdlBinaryWriter.js'),
    data = new readerBase(['in', modelName].join('/'));

new writerBase(data.getNormalized(), ['out/', modelName, '.bin'].join(''));
