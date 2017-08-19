/*jslint browser: false */

/*global require, module */

/**
 * @param {string} fileName
 * @returns {MdlReaderStream}
 * @constructor
 */
function MdlReaderStream(fileName) {
    "use strict";

    var $public = this,
        $private = {};

    $private.construct = function () {
        var fs = require('fs');
        $private.rawData = fs.readFileSync(fileName, {"encoding": 'utf8'});
        $private.numeric = new RegExp('[0-9.-]');
    };

    /**
     * @returns {Number|int}
     */
    $public.getInt = function getInt() {
        return parseInt($private.getNumericString(), 10);
    };

    /**
     * @returns {string}
     */
    $private.getNumericString = function () {
        var stringVal = [],
            numberFound = false,
            key;

        for (key = 0; key < $private.rawData.length; key++) {
            if (!$private.numeric.test($private.rawData[key])) {
                if (numberFound) {
                    break;
                }
            } else {
                stringVal.push($private.rawData[key]);
                numberFound = true;
            }
        }

        $private.rawData = $private.rawData.substr(key);

        return stringVal.join('');
    };

    /**
     * @returns {Number|float}
     */
    $public.getFloat = function () {
        return parseFloat($private.getNumericString());
    };

    /**
     * @returns {Number|string|*}
     */
    $public.getByte = function () {
        var key = 0,
            value;

        value = $private.rawData[key];
        $private.rawData = $private.rawData.substr(++key);

        if (value === undefined) {
            value = ' ';
        }

        return value;
    };

    $public.preview = function (length) {
        return $private.rawData.substr(0, length);
    };

    //END
    $private.construct();
    return $public;
}

module.exports = MdlReaderStream;
