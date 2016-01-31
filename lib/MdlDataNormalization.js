/*jslint browser: false */
/*global require, module */

/**
 * @param {string} fileName
 * @returns {MdlDataNormalization}
 */
function MdlDataNormalization(fileName) {
    "use strict";

    var $public = this,
        $private = {};

    $private.vertexCount = 0;
    $private.frameCount = 0;
    $private.normals = [];
    $private.textureCoordinates = [];
    $private.vertexFrames = [];
    $private.ratios = {
        "normal": {"min": NaN, "max": NaN},
        "vertex": {"min": NaN, "max": NaN},
        "uv": {"min": NaN, "max": NaN}
    };
    $private.normalized = {};

    $private.construct = function () {
        var readerBase = require('./MdlReaderStream.js');
        $private.reader = new readerBase(fileName);
        $private.loadData();
    };

    $private.loadData = function () {
        $private.vertexCount = $private.reader.getInt();
        $private.frameCount = $private.reader.getInt();
        $private.vertexFrames.push($private.getVertexFrame());
        $private.loadNormals();
        $private.loadTextureCoordinates();
        $private.loadVertexFrames();
    };

    $private.loadVertexFrames = function () {
        var key;

        for (key = 0; key < $private.frameCount -1; key += 1) {
            $private.vertexFrames.push($private.getVertexFrame());
        }
    };

    /**
     * @returns {Array}
     */
    $private.getVertexFrame = function () {
        var list = [],
            key,
            value;

        for (key = 0; key < $private.vertexCount * 3; key += 1) {
            value = $private.reader.getFloat();
            list.push(value);
            $private.updateRatio(value, 'vertex');
        }

        return list;
    };

    /**
     * @param {Number|float} value
     * @param {string} type
     */
    $private.updateRatio = function (value, type) {
        if (isNaN($private.ratios[type].max) || value > $private.ratios[type].max) {
            $private.ratios[type].max = value;
        }

        if (isNaN($private.ratios[type].min) || value < $private.ratios[type].min) {
            $private.ratios[type].min = value;
        }
    };

    $private.loadNormals = function () {
        var key,
            value;

        for (key = 0; key < $private.vertexCount * 3; key += 1) {
            value = $private.reader.getFloat();
            $private.normals.push(value);
            $private.updateRatio(value, 'normal');
        }
    };

    $private.loadTextureCoordinates = function () {
        var key,
            value;

        for (key = 0; key < $private.vertexCount * 2; key += 1) {
            value = $private.reader.getFloat();
            $private.textureCoordinates.push(value);
            $private.updateRatio(value, 'uv');
        }
    };

    $public.getVertexCount = function () {
        return $private.vertexCount;
    };

    $public.getFrameCount = function () {
        return $private.frameCount;
    };

    $public.getRawNormals = function () {
        return $private.normals;
    };

    $public.getRawTextureCoordinates = function () {
        return $private.textureCoordinates;
    };

    $public.getRawVertexFrames = function () {
        return $private.vertexFrames;
    };

    $public.getRatios = function () {
        return {
            "ratios": $private.ratios,
            "frames": $private.frameCount,
            "vertexCount": $private.vertexCount,
            "normalization": {
                "vertex": $public.getNormalizationCoefficient($private.ratios.vertex),
                "normal": $public.getNormalizationCoefficient($private.ratios.normal),
                "uv": $public.getNormalizationCoefficient($private.ratios.uv)
            }
        };
    };

    $public.getNormalizationCoefficient = function (minMax) {
        var delta = minMax.max - minMax.min,
            addition = 0 - minMax.min,
            multiplication = 255 / delta;

        return {
            "add": addition,
            "multiply": multiplication
        }
    };

    $public.getNormalized = function () {
        $private.normalized.uv = $private.normalize('uv', $private.textureCoordinates);
        $private.normalized.normals = $private.normalize('normal', $private.normals);
        $private.normalized.vertexFrames = [];
        $private.vertexFrames.forEach(function (vertexList) {
            $private.normalized.vertexFrames.push(
                $private.normalize('vertex', vertexList)
            );
        });
        $private.normalized.frameCount = $private.frameCount;
        $private.normalized.vertexCount = $private.vertexCount;

        return $private.normalized;
    };

    /**
     * @param {string} type
     * @param {Array} data
     * @returns {Array}
     */
    $private.normalize = function (type, data) {
        var coefficient = $public.getNormalizationCoefficient($private.ratios[type]),
            result = [],
            key,
            value;

        for (key = 0; key < data.length; key += 1) {
            value = (data[key] + coefficient.add) * coefficient.multiply ;
            result.push(parseInt(value, 10));
        }

        return result;
    };

    //END
    $private.construct();
    return $public;
}

module.exports = MdlDataNormalization;
