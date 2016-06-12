define(["require", "exports", './matrix', 'fraction', "./tools", "../components/printEquation"], function (require, exports, matrix_1, Fraction, tools_1, printEquation_1) {
    "use strict";
    var debugConf = {
        debug: true,
        debugRowCol: false,
        debugRow: false
    };
    var Simplex = (function () {
        /**
         * @param polynom
         * @param matrix матрица
         * @param bystep
         */
        function Simplex(polynom, matrix, bystep) {
            this.debug = [];
            /**
             *
             * @type {number}
             */
            this.isLastStep = false;
            console.clear();
            this.bystep = bystep;
            this.polynomDirect = polynom.pop();
            this.polynom = polynom.map(function (e) { return new Fraction(e); });
            this.originPolynomSize = polynom.length - 1;
            this.matrix = matrix;
            this.head = tools_1.getArrIndex(1, matrix.width - 1);
            this.left = tools_1.getArrIndex(matrix.width, matrix.width + matrix.height - 1);
            this.firstStep();
            this.pushDebug();
            this.debug.push({
                text: 'Приводим задачу к каноническому виду:',
                equation: this.polynomEquationAddMin(this.polynomEquationAddFreeMember(this.createPolynomCoeffEquation(this.polynom)))
            });
            this.pushLog(this.matrix.matrix, [], 'Добавляем строку');
        }
        Simplex.prototype.prev = function () {
            for (var j = this.debug.length - 1; j >= 0; j--) {
                var debug = this.debug.pop();
                if (debug.backup && debug.backup === true && debug.m) {
                    this.restoreMatrixFromDebug(debug);
                    return;
                }
            }
        };
        /**
         * пошаговое вычисление
         * @param position
         * @return {boolean} алгоритм завершен
         */
        Simplex.prototype.next = function (position) {
            var status = this.checkValidSolution();
            if (status === false) {
                console.log('решение не допустимо');
            }
            status = this.checkOptimalSolution();
            if (status === false) {
                console.log('решение не оптимально');
            }
            var pos;
            if (typeof position === 'undefined') {
                pos = this.findReference();
            }
            else {
                pos = {
                    y: position[0],
                    x: position[1]
                };
            }
            if (!pos) {
                this.debug.push({ text: 'Невозможно найти опорный элемент' });
                return true;
            }
            console.log(pos);
            this.oneStep(pos);
            this.pushLog(this.matrix.matrix, [], 'Пересчитываем таблицу:');
            if (this.isLastStep === true) {
                this.showResult();
                return true;
            }
            else if (this.matrix.height + this.matrix.width - 2 === this.originPolynomSize && this.isLastStep === false) {
                this.isLastStep = true;
                var coeff = this.lastStepFindToPrintKnownCoeff();
                this.printKnownCoeff(coeff);
                this.printPolynomWithSubstitution(coeff);
                this.createPolynomCoeffEquation(this.polynom);
                this.lastStep();
                this.pushLog(this.matrix.matrix);
            }
            return false;
        };
        /**
         * Один шаг вычисления таблицы
         * @param reference
         */
        Simplex.prototype.oneStep = function (reference) {
            this.pushDebug();
            this.swap(reference.x, reference.y);
            if (this.head[reference.x] > this.originPolynomSize) {
                this.removeCol(reference.x);
            }
        };
        /**
         * автоматическое вычисление и вывод результата
         */
        Simplex.prototype.calc = function () {
            var l = this.matrix.height - 1;
            for (var i = 0; i < l; i++) {
                var opor = this.findReference();
                console.log(opor);
                this.swap(opor.x, opor.y);
                this.removeCol(opor.x);
                this.pushLog(this.matrix.matrix, [], 'Конец вычислений:');
            }
            this.print();
            this.lastStep();
            this.pushLog(this.matrix.matrix);
        };
        /**
         * Подставляем найденные элементы в полином и находим коэффициенты элементов для последней строки матрицы
         * предпоследний шаг
         */
        Simplex.prototype.lastStep = function () {
            var _this = this;
            var matr = this.matrix;
            var matrRaw = matr.matrix;
            var row = [];
            // calc coefficients
            this.head.forEach(function (num, headIdx) {
                var res = _this.polynom[num - 1];
                var equation = new printEquation_1.PrintEquation();
                equation.push.x(num).equal().fraction(res);
                for (var j = 0; j < _this.matrix.height - 1; j++) {
                    var leftRowValue = _this.left[j];
                    equation.push
                        .plus()
                        .fraction(_this.polynom[leftRowValue - 1])
                        .mul()
                        .fraction(matr.getElem(j, headIdx).neg());
                    res = res.add(matr.getElem(j, headIdx).neg().mul(_this.polynom[leftRowValue - 1]));
                }
                row.push(res);
                equation.push.equal().fraction(res);
                _this.debug.push({ equation: equation });
            });
            // matrRaw[this.matrix.height - 1] = row;
            // calc last coefficient
            var res = tools_1.getLastItem(this.polynom);
            var equation = new printEquation_1.PrintEquation();
            equation.push
                .word('p')
                .equal();
            var lastCol = this.matrix.width - 1;
            this.left.forEach(function (leftValue, rowIdx) {
                equation.push
                    .plus()
                    .fraction(_this.polynom[leftValue - 1])
                    .mul()
                    .fraction(matr.getElem(rowIdx, lastCol));
                res = res.add(matr.getElem(rowIdx, lastCol).mul(_this.polynom[leftValue - 1]));
            });
            row.push(res.neg());
            equation.push
                .plus()
                .fraction(tools_1.getLastItem(this.polynom))
                .equal()
                .fraction(res);
            this.debug.push({ equation: equation });
            matrRaw[this.matrix.height - 1] = row;
        };
        /**
         * Находит, чему равны коэффициенты в стоблце (left)
         */
        Simplex.prototype.lastStepFindToPrintKnownCoeff = function () {
            var _this = this;
            var coeff = {};
            var matrix = this.matrix;
            this.left.forEach(function (k, kIdx) {
                var equation = new printEquation_1.PrintEquation();
                // equation.push.x(k);
                // equation.push.equal();
                for (var i = 0; i < matrix.width; i++) {
                    var el = matrix.getElem(kIdx, i);
                    if (i !== 0) {
                        equation.push.plus();
                    }
                    if (i < matrix.width - 1) {
                        equation.push.fraction(el.neg());
                        equation.push.x(_this.head[i]);
                    }
                    else {
                        equation.push.fraction(el);
                    }
                }
                coeff[k] = equation;
            });
            return coeff;
        };
        /**
         * Распечатывает найденные коэффициенты на предпоследнем шаге
         */
        Simplex.prototype.printKnownCoeff = function (coeffs) {
            for (var k in coeffs) {
                if (coeffs.hasOwnProperty(k)) {
                    var equation = new printEquation_1.PrintEquation();
                    equation.push.x(k);
                    equation.push.sign(0);
                    equation.push.arr(coeffs[k].equation);
                    this.debug.push({ equation: equation });
                }
            }
        };
        /**
         * Распечатать полином
         * @param polynom
         */
        Simplex.prototype.createPolynomCoeffEquation = function (polynom) {
            var equation = new printEquation_1.PrintEquation();
            var len = polynom.length - 1;
            polynom.forEach(function (k, idx) {
                var id = idx + 1;
                equation.push.fraction(k);
                if (idx !== len) {
                    equation.push.sign(2).x(id).plus();
                }
            });
            return equation;
        };
        Simplex.prototype.polynomEquationAddFreeMember = function (equation) {
            var i = this.originPolynomSize + 1;
            this.left.forEach(function (e) {
                equation.push.plus().x(i++);
            });
            return equation;
        };
        Simplex.prototype.polynomEquationAddMin = function (equation) {
            equation.push.sign(4).word('min');
            return equation;
        };
        /**
         * Печатаем полином с подстановкой известных переменных
         * @param coeffs
         */
        Simplex.prototype.printPolynomWithSubstitution = function (coeffs) {
            var equation = new printEquation_1.PrintEquation();
            var len = this.polynom.length - 1;
            this.polynom.forEach(function (k, idx) {
                var id = idx + 1;
                equation.push.fraction(k);
                if (idx === len) {
                    return;
                }
                equation.push.sign(2);
                if (coeffs.hasOwnProperty(id)) {
                    equation.push.word('(').arr(coeffs[id].equation).word(')');
                }
                else {
                    equation.push.x(id);
                }
                equation.push.plus();
            });
            equation.push.arrowMin();
            this.debug.push({ equation: equation });
        };
        /**
         * Преобразование таблицы
         * @param x столбец
         * @param y строка
         */
        Simplex.prototype.swap = function (x, y) {
            var origMatrix = this.matrix.matrix;
            var matrixInst = this.matrix.clone();
            var matrix = matrixInst.matrix;
            var ks = origMatrix[y][x];
            console.log("element: " + ks.toFraction());
            matrixInst.log();
            this.pushLog(matrix, [y, x], 'Находим опорный элемент:');
            var buf = this.head[x];
            this.head[x] = this.left[y];
            this.left[y] = buf;
            // расчет строки y (row)
            for (var i = 0; i < matrixInst.width; i++) {
                matrix[y][i] = origMatrix[y][i].div(ks);
            }
            // расчет столбца x (col)
            for (var i = 0; i < matrixInst.height; i++) {
                matrix[i][x] = origMatrix[i][x].div(ks.neg());
            }
            matrix[y][x] = new Fraction(1).div(ks);
            if (debugConf.debugRowCol) {
                matrixInst.log();
                this.pushLog(matrix, [y, x], 'Вычисляем строку и колонку:');
            }
            // вычисляем остальные строки
            var oporaRow = matrixInst.getRow(y);
            for (var i = 0; i < matrixInst.height; i++) {
                if (i === y)
                    continue;
                var coeff = origMatrix[i][x];
                console.log(i, coeff);
                for (var j = 0; j < matrixInst.width; j++) {
                    if (j === x)
                        continue;
                    matrix[i][j] = origMatrix[i][j].sub(coeff.mul(oporaRow[j]));
                }
                if (debugConf.debugRow) {
                    matrixInst.log();
                    this.pushLog(matrix, [i, -1], 'Вычитаем строку:');
                }
            }
            this.matrix = matrixInst;
            return matrix;
        };
        /**
         * Поиск опорного элемента
         * выбор столбца по минимальному отрицательному элементу
         * @returns {{x: number, y: number}}
         */
        Simplex.prototype.findReference = function () {
            var this_matrix = this.matrix;
            var matrix = this_matrix.matrix;
            var height = this_matrix.height;
            var lastCol = this_matrix.getCol(this_matrix.width - 1);
            var minEls = getMinElements(this_matrix.getRow(this_matrix.height - 1).slice(0, this_matrix.width - 1));
            var minId;
            var x;
            for (var j = 0; j < minEls.length; j++) {
                var el = minEls[j];
                x = el.id;
                // индексы ненулевых положительных значений
                var cur = void 0;
                var i = 0;
                var possibleIdx = [];
                while (i < height) {
                    cur = this_matrix.getElem(i, el.id);
                    if (cur.compare(new Fraction(0)) > 0) {
                        possibleIdx.push(i);
                    }
                    i++;
                }
                if (possibleIdx.length === 0) {
                    continue;
                }
                i = possibleIdx[0];
                var minEl = lastCol[i].div(this_matrix.getElem(i, x));
                minId = i;
                for (var k = 1; k < possibleIdx.length; k++) {
                    var num = lastCol[possibleIdx[k]].div(this_matrix.getElem(possibleIdx[k], x));
                    if (num.compare(minEl) < 0) {
                        minEl = num;
                        minId = possibleIdx[k];
                    }
                }
                break;
            }
            if (minId == null) {
                return null;
            }
            return {
                x: x,
                y: minId
            };
        };
        Simplex.prototype.print = function () {
            var _this = this;
            var obj = {};
            var txt = '';
            var mtx = this.matrix.matrix;
            this.left.forEach(function (e, i) {
                txt += "\nx" + e + " = ";
                var xe = "x" + e;
                obj[xe] = '';
                for (var j = 0; j < _this.matrix.width - 1; j++) {
                    var multipler = mtx[i][j].neg().toFraction() + "*x" + _this.head[j] + " + ";
                    obj[xe] += multipler;
                    txt += multipler;
                }
                var mul = "" + mtx[i][_this.matrix.width - 1].toFraction();
                txt += mul;
                obj[xe] += mul;
            });
            console.log(txt);
            console.log(obj);
            return txt;
        };
        /**
         * возращает номер столбца элемента
         * @param ind
         * @returns {number}
         */
        Simplex.prototype.getHeadIndex = function (ind) {
            var i = this.head.indexOf(ind);
            if (i == -1)
                throw new Error('index not found');
            return i;
        };
        /**
         * возращает номер строки элемента
         * @param ind
         * @returns {number}
         */
        Simplex.prototype.getLeftIndex = function (ind) {
            var i = this.left.indexOf(ind);
            if (i === -1)
                throw new Error('index not found');
            return i;
        };
        /**
         * Вычисляем последнюю строку в матрице
         * и домножаем коэффициенты полинома на -1, если стремится к макс
         * тоже самое с граничными условиями
         */
        Simplex.prototype.firstStep = function () {
            var matr = this.matrix.matrix;
            var _a = this.matrix, height = _a.height, width = _a.width;
            matr = matr.map(function (row) {
                if (row[row.length - 1].s === -1) {
                    return row.map(function (e) { return e.neg(); });
                }
                return row;
            });
            var row = [];
            for (var j = 0; j < width; j++) {
                row.push(0);
                for (var i = 0; i < height; i++) {
                    row[j] += matr[i][j];
                }
            }
            row = row.map(function (e) { return new Fraction(-e); });
            this.matrix.matrix = matr;
            this.matrix.pushRow(row);
            if (this.polynomDirect === 1) {
                this.polynom = this.polynom.map(function (e) { return e.neg(); });
            }
        };
        Simplex.prototype.removeCol = function (col) {
            this.matrix.removeCol(col);
            this.head.splice(col, 1);
        };
        /**
         * Печатает матрицу с именами строк и столбцов, и выделяет элемент или всю строку
         * @param matrix
         * @param select
         * @param text
         */
        Simplex.prototype.pushLog = function (matrix, select, text) {
            this.debug.push({
                m: new matrix_1.MatrixM(matrix),
                p: [tools_1.copyArr(this.head), tools_1.copyArr(this.left)],
                select: select || null,
                text: text || null
            });
        };
        Simplex.prototype.pushDebug = function () {
            this.debug.push({
                m: new matrix_1.MatrixM(this.matrix.matrix),
                p: [tools_1.copyArr(this.head), tools_1.copyArr(this.left)],
                backup: true,
                isLastStep: this.isLastStep
            });
        };
        /**
         * Проверка симплекс таблицы на допустимость
         */
        Simplex.prototype.checkValidSolution = function () {
            var matr = this.matrix;
            var col = matr.getCol(matr.width - 1);
            return col.every(function (el, idx) {
                if (idx === matr.height - 1) {
                    return true;
                }
                return (el.compare(new Fraction(0)) > 0);
            });
        };
        /**
         * Проверка на оптимальность
         */
        Simplex.prototype.checkOptimalSolution = function () {
            var matr = this.matrix;
            var row = matr.getRow(matr.height - 1);
            return row.every(function (el, idx) {
                if (idx === matr.height - 1) {
                    return true;
                }
                return (el.compare(new Fraction(0)) > 0);
            });
        };
        /**
         * восстановление данных из лога
         * @param debugInfo
         * @returns {boolean}
         */
        Simplex.prototype.restoreMatrixFromDebug = function (debugInfo) {
            if (debugInfo.m && debugInfo.p && debugInfo.p.length === 2) {
                this.matrix = debugInfo.m;
                this.head = debugInfo.p[0];
                this.left = debugInfo.p[1];
                this.isLastStep = debugInfo.isLastStep;
            }
            else {
                return false;
            }
        };
        /**
         * Окончательный шаг, вывод коэффициентов
         */
        Simplex.prototype.showResult = function () {
            var matr = this.matrix;
            var equation = new printEquation_1.PrintEquation();
            equation.push
                .word('x*')
                .equal()
                .word('(');
            var coeff = this.getLastColCoeff();
            for (var i = 1; i <= this.originPolynomSize; i++) {
                var num = coeff.hasOwnProperty(i) ? coeff[i] : 0;
                equation.push.fraction(num);
                if (i !== this.originPolynomSize) {
                    equation.push.word(', ');
                }
            }
            equation.push.word(')');
            this.debug.push({ equation: equation });
            var equation2 = new printEquation_1.PrintEquation();
            equation2.push
                .word('f*')
                .equal()
                .fraction(matr.getElem(matr.height - 1, matr.width - 1).neg());
            this.debug.push({ equation: equation2 });
        };
        /**
         * Возвращает объект с номером коэффициента и значением в последнем столбце
         */
        Simplex.prototype.getLastColCoeff = function () {
            var matr = this.matrix;
            var len = matr.height - 1;
            var lastCol = {};
            for (var i = 0; i < len; i++) {
                lastCol[this.left[i]] = matr.getElem(i, matr.width - 1);
            }
            return lastCol;
        };
        return Simplex;
    }());
    exports.Simplex = Simplex;
    /**
     * Минимальный отрицательный элемент
     * @param arr
     * @returns {number|any}
     */
    function getIndMinEl(arr) {
        var max, maxId;
        var i = 0;
        while (i < arr.length && arr[i].s === 1) {
            i++;
        }
        max = arr[i];
        maxId = i;
        for (; i < arr.length; i++) {
            if (arr[i].s === -1 && arr[i].compare(max) > 0) {
                max = arr[i];
                maxId = i;
            }
        }
        return maxId;
    }
    /**
     * Минимальный отрицательный элемент
     * @param arr
     * @returns {number|any}
     */
    function getMinElements(arr) {
        var els = [];
        arr.forEach(function (el, id) {
            if (el.s === 1 || el.n === 0)
                return;
            els.push({ id: id, value: el });
        });
        return els.sort(function (a, b) {
            return a.value.compare(b.value);
        });
    }
});

//# sourceMappingURL=simplex.js.map
