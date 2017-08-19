/**
 * @constructor
 * @param {*} data
 * @param {string} resultFile
 * @returns {Object|JsonDataWriter}
 */
function JsonDataWriter(data, resultFile) {
    "use strict";

    var $public = {},
        $private = {};

    $private.construct = function () {
        var fs = require('fs');

        fs.writeFile(resultFile, JSON.stringify(data));
    };

    // Declaration ends
    $private.construct();

    return $public;
}

module.exports = JsonDataWriter;
