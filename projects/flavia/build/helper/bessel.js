define(["require", "exports", "./tableDiff"], function (require, exports, tableDiff_1) {
    "use strict";
    /**
     * Bessel polynomial interpolation
     */
    var Bessel = (function () {
        function Bessel(func, h, n) {
            var _this = this;
            this.n = n;
            this.table = new tableDiff_1.TableDiff(func, 0, h, 2 * n + 2);
            //this.table.toString();
            this.delta = function (k) { return (_this.table.getDelta(k, 0) + _this.table.getDelta(k, 1)) / 2; };
        }
        Bessel.prototype.bessel = function (x) {
            var result = 0;
            for (var i = 0; i < this.n; i++) {
                result += this.bessel_step(x, i, this.delta);
            }
            return result;
        };
        /**
         *
         * @param t
         * @param n узел интерполяции
         * @param delta функция, возвращающая нужный элемент из таблицы разностей
         * @returns {number}
         */
        Bessel.prototype.bessel_step = function (t, n, delta) {
            var qMul = Bessel.calc_t(t, n);
            return ((qMul / Bessel.factorial(2 * n) * (delta(2 * n) + delta(2 * n)) / 2) +
                ((t - 1 / 2) * qMul / Bessel.factorial(2 * n + 1)) * (delta(2 * n + 1) + delta(2 * n + 1)) / 2);
        };
        /**
         * Return t(t-1)(t+1)...(t-n-1)(t+n-1)(t-n)(t + n - 1)
         * @param t
         * @param n
         * @returns number
         */
        Bessel.calc_t = function (t, n) {
            var c = t;
            for (var i = 1; i < n; i++) {
                c *= t - i;
                c *= t + i;
            }
            return c * (t - n) * (t + n - 1);
        };
        Bessel.factorial = function (n) {
            var c = 1;
            for (var i = 1; i <= n; i++) {
                c *= i;
            }
            return c;
        };
        return Bessel;
    }());
    exports.Bessel = Bessel;
});

//# sourceMappingURL=bessel.js.map
