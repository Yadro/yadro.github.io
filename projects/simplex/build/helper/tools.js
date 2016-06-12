define(["require", "exports"], function (require, exports) {
    "use strict";
    function arrayHas(arr, element) {
        return arr.indexOf(element) !== -1;
    }
    exports.arrayHas = arrayHas;
    function createArray(n) {
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(0);
        }
        return a;
    }
    exports.createArray = createArray;
    function getLastItem(arr) {
        return arr[arr.length - 1];
    }
    exports.getLastItem = getLastItem;
    function createMatrix(w, h) {
        var matrix = [];
        for (var i = 0; i < h; i++) {
            matrix[i] = [];
            for (var j = 0; j < w; j++) {
                matrix[i].push('');
            }
        }
        return matrix;
    }
    exports.createMatrix = createMatrix;
    function changeSizeMatrix(matrix, size) {
        var width = size[0];
        var height = size[1];
        if (height > matrix.length) {
            for (var i = matrix.length; i < height; i++) {
                matrix.push([]);
            }
        }
        else {
            matrix.length = height;
        }
        matrix.map(function (row) {
            if (width > row.length) {
                for (var i = row.length; i < width; i++) {
                    row.push('');
                }
            }
            else {
                row.length = width;
            }
            return row;
        });
        return matrix;
    }
    exports.changeSizeMatrix = changeSizeMatrix;
    function getArrIndex(from, to) {
        var arr = [];
        for (var i = from; i <= to; i++) {
            arr.push(i);
        }
        return arr;
    }
    exports.getArrIndex = getArrIndex;
    /**
     * Создает копию массива либо создает через функцию copy
     * @param arr
     * @param copy
     * @returns {T[]}
     */
    function copyArr(arr, copy) {
        if (copy) {
            return arr.map(function (e) {
                return copy(e);
            });
        }
        else {
            return arr.slice();
        }
    }
    exports.copyArr = copyArr;
    function mulVec(vec, f) {
        return vec.map(function (e, i) {
            var t = f(e, i);
            return t !== undefined ? t : e;
        });
    }
    exports.mulVec = mulVec;
    exports.isArray = Array.isArray || function (arr) {
        return toString.call(arr) == '[object Array]';
    };
});

//# sourceMappingURL=tools.js.map
