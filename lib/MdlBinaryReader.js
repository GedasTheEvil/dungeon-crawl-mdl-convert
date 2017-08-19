/*jslint browser: false */

/*global require, module */

/**
 * @constructor
 * @param {string} fileName
 * @returns {Object|MdlBinaryReader}
 */
function MdlBinaryReader(fileName) {
    "use strict";

    var $public = this,
        $private = {
            "itemsPerFrame": 0,
            "frames": 0,
            "results": {
                "vertex": [],
                "normals": [],
                "uv": []
            }
        };

    $private.construct = function () {
        var readerBase = require('./MdlReaderStream.js');
        $private.reader = new readerBase(fileName);
        $private.loadData();
    };

    $private.loadData = function () {
        var frame;
        $private.itemsPerFrame = $private.reader.getInt();
        $private.frames = $private.reader.getInt();

        for (frame = 0; frame < $private.frames; ++frame) {
            $private.results.vertex.push($private.getList(3));
        }

        $private.results.normals = $private.getList(3);
        $private.results.uv = $private.getList(2);
    };

    $private.getList = function (elementCount) {
        console.log({
            "method": "MdlBinaryReader::$private.getList",
            "elementCount": elementCount,
            "nextData": $private.reader.preview(16)
        });

        var reduce = $private.reader.getFloat(),
            divide = $private.reader.getFloat(),
            key,
            results = [],
            byte;

        byte = $private.reader.getByte();

        console.log({
            "method": "MdlBinaryReader::$private.getList",
            "elementCount": elementCount,
            "reduce": reduce,
            "divide": divide,
            "byte": byte,
            "code": byte.charCodeAt(0)
        });

        for (key = 0; key < $private.itemsPerFrame * elementCount; ++key) {
            byte = $private.reader.getByte().charCodeAt(0);
            results.push(byte / divide - reduce);
        }

        return results;
    };

    $public.getData = function () {
        return $private.results;
    };

    //END
    $private.construct();
    return $public;
}

module.exports = MdlBinaryReader;
