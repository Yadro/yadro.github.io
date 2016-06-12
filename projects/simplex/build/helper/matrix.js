///<reference path="../../typings/index.d.ts"/>
///<reference path="fraction.js.d.ts"/>
define(["require", "exports", 'fraction', './tools'], function (require, exports, Fraction, tools_1) {
    "use strict";
    var DebugMatrix = (function () {
        function DebugMatrix() {
            this.log = [];
        }
        DebugMatrix.prototype.add = function (info, matrix) {
            var obj;
            if (matrix) {
                obj = {
                    info: info,
                    matrix: matrix
                };
            }
            else {
                obj = { info: info };
            }
            this.log.push(obj);
        };
        DebugMatrix.prototype.past = function (m) {
            this.log[this.log.length - 1].matrix = m;
        };
        return DebugMatrix;
    }());
    function arrFractionToStr(arr) {
        var str = arr.reduce(function (pr, e) { return pr + ", " + e.toFraction(); });
        return "(" + str + ")";
    }
    function copyMatrix(matr) {
        var matrix = [];
        matr.forEach(function (row, i) {
            matrix.push([]);
            row.forEach(function (el) {
                matrix[i].push(el);
            });
        });
        return matrix;
    }
    var MatrixM = (function () {
        function MatrixM(matrix) {
            if (!matrix[0].length) {
                throw new Error('matrix is not correct');
            }
            this.matrix = [];
            if (typeof matrix[0][0] != "object") {
                for (var i = 0; i < matrix.length; i++) {
                    this.matrix.push(tools_1.copyArr(matrix[i], function (el) { return new Fraction(el); }));
                }
            }
            else {
                for (var i = 0; i < matrix.length; i++) {
                    this.matrix.push(tools_1.copyArr(matrix[i], function (el) { return el.clone(); }));
                }
            }
            this.height = matrix.length;
            this.width = matrix[0].length;
        }
        MatrixM.prototype.getElem = function (y, x) {
            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                throw new Error('Index out of bounds');
            }
            return this.matrix[y][x];
        };
        MatrixM.prototype.getRow = function (row) {
            if (row > this.height - 1)
                throw new Error('getRow index out of bound');
            return this.matrix[row];
        };
        MatrixM.prototype.getCol = function (col) {
            if (col > this.width - 1)
                throw new Error('getCol index out of bound');
            var vec = [];
            for (var i = 0; i < this.height; i++) {
                vec.push(this.matrix[i][col]);
            }
            return vec;
        };
        MatrixM.prototype.addRow = function (row, vec, k) {
            if (row >= this.height) {
                throw new Error('Index out of bounds');
            }
            if (vec.length != this.width) {
                console.warn("Length are not equal");
            }
            if (k) {
                vec = vec.map(function (v) { return v.mul(k); });
            }
            for (var i = 0, l = Math.min(this.width, vec.length); i < l; i++) {
                this.matrix[row][i] = this.matrix[row][i].add(vec[i]);
            }
        };
        MatrixM.prototype.addColumn = function (col, vec, k) {
            if (col >= this.width) {
                throw new Error('Index out of bounds');
            }
            if (vec.length != this.width) {
                console.warn("Length are not equal");
            }
            if (k) {
                vec = vec.map(function (v) { return v.mul(k); });
            }
            for (var i = 0, l = Math.min(this.width, vec.length); i < l; i++) {
                this.matrix[i][col] = this.matrix[i][col].add(vec[i]);
            }
        };
        MatrixM.prototype.mulRow = function (row, vec) {
            if (row >= this.height) {
                throw new Error('Index out of bounds');
            }
            if (vec.length != this.width) {
                console.warn("Length are not equal");
            }
            for (var i = 0, l = Math.min(this.width, vec.length); i < l; i++) {
                this.matrix[row][i] = this.matrix[row][i].mul(vec[i]);
            }
        };
        MatrixM.prototype.eachRow = function (row, func, begin) {
            var br = false;
            if (row >= this.height) {
                throw new Error('Index out of bounds');
            }
            function stop() {
                br = true;
            }
            for (var i = begin || 0, l = this.height; i < l; i++) {
                var tmp = func(this.matrix[row][i], i, stop);
                if (br) {
                    break;
                }
                else {
                    if (typeof tmp == "number") {
                        this.matrix[row][i] = new Fraction(tmp);
                    }
                    else if (tmp instanceof Fraction) {
                        this.matrix[row][i] = tmp;
                    }
                }
            }
        };
        MatrixM.prototype.each = function (func) {
            var br = false;
            function stop() {
                br = true;
            }
            for (var i = 0, l = this.height; i < l; i++) {
                var tmp = func(this.matrix[i], i, stop);
                if (br) {
                    break;
                }
                else {
                    if (tmp != null) {
                        this.matrix[i] = new Fraction(tmp);
                    }
                }
            }
        };
        MatrixM.prototype.gauss = function (debug) {
            var height = this.matrix.length;
            var width = this.matrix[0].length;
            var tmp;
            if (debug) {
                this.debugMatrix = new DebugMatrix();
            }
            for (var i = 0; i < height; i++) {
                var el = this.matrix[i][i];
                if (el.n == 0) {
                    if (debug) {
                        this.debugMatrix.add(i + " == 0");
                    }
                    for (var j = i + 1; j < height; j++) {
                        el = this.matrix[j][i];
                        if (el.n != 0) {
                            if (debug) {
                                this.debugMatrix.add(("[" + i + "]" + arrFractionToStr(this.matrix[i]))
                                    + (" + " + arrFractionToStr(this.matrix[j]) + "[" + j + "]"));
                            }
                            for (var k = 0; k < width; k++) {
                                this.matrix[i][k].add(this.matrix[j][k]);
                            }
                            if (debug) {
                                this.debugMatrix.past(this.clone());
                            }
                            break;
                        }
                    }
                }
                if (el.n != 0) {
                    // делим i строку на el
                    if (debug) {
                        this.debugMatrix.add(i + " != 0");
                    }
                    for (var j = 0; j < width; j++) {
                        this.matrix[i][j] = this.matrix[i][j].div(el);
                    }
                    el = new Fraction(1);
                    // делим последующие строки после i-ой так, чтобы в столбце i были нули
                    for (var j = i + 1; j < height; j++) {
                        var c = this.matrix[j][i].neg().div(el);
                        if (c.n == 0) {
                            break;
                        }
                        if (debug)
                            this.debugMatrix.add(("[" + j + "]" + arrFractionToStr(this.matrix[j]) + " + " + c.toFraction())
                                + (" * " + arrFractionToStr(this.matrix[i]) + "[" + i + "]"));
                        for (var k = width - 1; k >= i; k--) {
                            tmp = c.mul(this.matrix[i][k]);
                            this.matrix[j][k] = this.matrix[j][k].add(tmp);
                        }
                        if (debug) {
                            this.debugMatrix.past(this.clone());
                        }
                    }
                }
            }
            return this;
        };
        MatrixM.prototype.gaussSelect = function (debug, columns) {
            var rows = [];
            var _a = this, height = _a.height, width = _a.width;
            var tmp;
            if (debug) {
                this.debugMatrix = new DebugMatrix();
            }
            for (var i = 0; i < height; i++) {
                if (i > columns.length - 1) {
                    break;
                }
                var column = columns[i];
                var el = this.matrix[i][column];
                if (el.n == 0) {
                    for (var j = i + 1; j < height; j++) {
                        el = this.matrix[j][i];
                        if (el.n != 0) {
                            if (debug) {
                                this.debugMatrix.add(("[" + i + "]" + arrFractionToStr(this.matrix[i]))
                                    + (" + " + arrFractionToStr(this.matrix[j]) + "[" + j + "]"));
                            }
                            for (var k = 0; k < width; k++) {
                                this.matrix[i][k].add(this.matrix[j][k]);
                            }
                            if (debug) {
                                this.debugMatrix.past(this.clone());
                            }
                            break;
                        }
                    }
                }
                if (el.n != 0) {
                    rows.push(i);
                    // делим i строку на el
                    for (var j = 0; j < width; j++) {
                        this.matrix[i][j] = this.matrix[i][j].div(el);
                    }
                    el = new Fraction(1);
                    // делим строки после i-ой так, чтобы в столбце i были нули
                    for (var row = i + 1; row < height; row++) {
                        var k = this.matrix[row][column].neg().div(el);
                        if (k.n == 0) {
                            break;
                        }
                        if (debug)
                            this.debugMatrix.add(("[" + row + "]" + arrFractionToStr(this.matrix[row]) + " + " + k.toFraction())
                                + (" * " + arrFractionToStr(this.matrix[i]) + "[" + i + "]"));
                        for (var col_1 = 0; col_1 < width; col_1++) {
                            tmp = k.mul(this.matrix[i][col_1]);
                            this.matrix[row][col_1] = this.matrix[row][col_1].add(tmp);
                        }
                        if (debug) {
                            this.debugMatrix.past(this.clone());
                        }
                    }
                }
            }
            this.debugMatrix.add(function () {
                var msg = rows + ' ' + columns;
                console.warn(msg);
            });
            this.log();
            while (rows.length && columns.length) {
                var numRow = rows.pop();
                var numRol = columns.pop();
                var workRow = this.matrix[numRow];
                console.groupCollapsed("[" + numRow + "][" + numRol + "]");
                for (var i = 0; i < height; i++) {
                    if (i == numRow || this.matrix[i][numRol].n == 0) {
                        continue;
                    }
                    if (workRow[numRol].equals(0) == true) {
                        throw new Error('неверное опорное решение'); // fixme
                    }
                    var iRow = this.matrix[i];
                    var k = iRow[numRol].div(workRow[numRol]);
                    if (debug) {
                        console.warn("[" + i + "]" + arrFractionToStr(iRow) + " - " + k + "*" + arrFractionToStr(workRow));
                    }
                    for (var col = 0; col < width; col++) {
                        iRow[col] = iRow[col].sub(workRow[col].mul(k));
                    }
                    if (debug) {
                        this.log();
                    }
                }
                console.groupEnd();
            }
            return this;
        };
        /**
         * Вставляет строку в конец, обновляет высоту
         * @param row
         */
        MatrixM.prototype.pushRow = function (row) {
            this.matrix.push(row);
            this.height = this.matrix.length;
        };
        /**
         * Удаляет колонку, обновляет ширину
         * @param col
         */
        MatrixM.prototype.removeCol = function (col) {
            for (var i = 0; i < this.height; i++) {
                var arr = [];
                for (var j = 0; j < this.width; j++) {
                    if (col == j)
                        continue;
                    arr.push(this.matrix[i][j]);
                }
                this.matrix[i] = arr;
            }
            this.width -= 1;
        };
        MatrixM.prototype.equals = function (matrix) {
            if (this.height != matrix.height || this.width != matrix.width) {
                return false;
            }
            var _a = this, width = _a.width, height = _a.height;
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    if (!this.matrix[i][j].equals(matrix[i][j])) {
                        return false;
                    }
                }
            }
            return true;
        };
        MatrixM.prototype.clone = function () {
            var matrix = [];
            this.matrix.forEach(function (r, i) {
                matrix.push([]);
                r.forEach(function (e) {
                    matrix[i].push(e.clone());
                });
            });
            return new MatrixM(matrix);
        };
        MatrixM.prototype.toString = function () {
            var buf = '';
            this.matrix.forEach(function (row) {
                var str = '[';
                row.forEach(function (el) {
                    str += '\t' + el.toFraction();
                });
                buf += str + ']\n';
            });
            return buf;
        };
        /**
         * Печатает матрицу в консоль
         */
        MatrixM.prototype.log = function () {
            var m = [];
            this.matrix.forEach(function (row, i) {
                m.push([]);
                row.forEach(function (el) {
                    if (el.d == 1) {
                        m[i].push(+el.toFraction());
                    }
                    else {
                        m[i].push(el.toFraction());
                    }
                });
            });
            console.table(m);
        };
        return MatrixM;
    }());
    exports.MatrixM = MatrixM;
});

//# sourceMappingURL=matrix.js.map
