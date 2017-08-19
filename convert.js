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
    data,
    extension = '.bin',
    source = ['in', modelName].join('/');

if (mode === 'toBin') {
    readerBase = require('./lib/MdlDataNormalization.js');
    writerBase = require('./lib/MdlBinaryWriter.js');
    data = (new readerBase(source)).getNormalized();
}

if (mode === 'binToJson') {
    readerBase = require('./lib/MdlBinaryReader.js');
    data = (new readerBase(source)).getData();
    writerBase = require('./lib/JsonDataWriter.js');
    extension = '.json';
}

if (mode === 'binToMdl') {
    readerBase = require('./lib/MdlBinaryReader.js');
    data = (new readerBase(source)).getData();
    writerBase = require('./lib/MdlPlainWriter.js');
    extension = '.mdl';
}

new writerBase(data, ['out/', modelName, extension].join(''));
