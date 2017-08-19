/**
 * @constructor
 * @returns {Object|MdlPlainWriter}
 */
function MdlPlainWriter(data, resultFile) {
    "use strict";

    var $public = {},
        $private = {};

    $private.construct = function () {
        var fs = require('fs');

        fs.writeFile(resultFile, $private.toMdl());
    };

    $private.toMdl = function () {
        var results = [data.uv.length / 2, ' ', data.vertex.length, "\n"].join(''),
            frame;

        for (frame = 0; frame < data.vertex.length; ++frame) {
            results += $private.toBlob(data.vertex[frame], 3);
        }

        results += $private.toBlob(data.normals, 3);
        results += $private.toBlob(data.uv, 2);

        return results;
    };

    $private.toBlob = function (list, items) {
        var key,
            el,
            result = '',
            tmp,
        iteration = 0;

        for (key = 0; key < list.length / items; ++key) {
            tmp = [];
            for (el = 0; el < items; ++el) {
                if (el > 0) {
                    tmp.push(' ');
                }

                tmp.push(list[iteration++]);
            }
            tmp.push("\n");
            result += tmp.join('');
        }

        return result;
    };

    // Declaration ends
    $private.construct();

    return $public;
}

module.exports = MdlPlainWriter;
