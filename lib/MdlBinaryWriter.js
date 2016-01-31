/*jslint browser: false */
/*global require, module */

/**
 * @param {{frameCount:,vertexCount:,uv:[],normals:[],vertexFrames:[]}} normalizedList
 * @param {string} resultFile
 * @constructor
 * @returns {MdlBinaryWriter}
 */
function MdlBinaryWriter(normalizedList, resultFile) {
    "use strict";

    var $public = this,
        $private = {};

    $private.result = [];

    $private.construct = function () {
        $private.covertAllToBinary();
        $private.writeToFile();
    };

    $private.covertAllToBinary = function () {
        $private.result.push([
            normalizedList.vertexCount,
            ' ',
            normalizedList.frameCount,
            ' '
        ].join(''));
        $private.result.push($private.toBinaryString(normalizedList.uv));
        $private.result.push($private.toBinaryString(normalizedList.normals));
        normalizedList.vertexFrames.forEach(function (vertexList) {
            $private.result.push($private.toBinaryString(vertexList));
        });
    };

    /**
     * @param list
     * @returns {string}
     */
    $private.toBinaryString = function (list) {
        var result = [],
            key;

        for (key = 0; key < list.length; key += 1) {
            result.push(String.fromCharCode(list[key]));
        }

        return result.join('');
    };

    $private.writeToFile = function () {
        var fs = require('fs');

        fs.writeFile(resultFile, $private.result.join(''));
    };

    // Declaration ends
    $private.construct();

    return $public;
}

module.exports = MdlBinaryWriter;
