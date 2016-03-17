define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Таблица конечных разностей вперёд
     */
    var TableDiff = (function () {
        /**
         * Конструктор
         * @param func функция
         * @param start пределы
         * @param h шаг
         * @param n максималный порядок конечн разности
         */
        function TableDiff(func, start, h, n) {
            this.x = [];
            this.y = [];
            this.delta = [];
            if (h <= 0) {
                throw new Error('h <= 0');
            }
            this.start = start;
            for (var x = start; x <= start + n; x += h) {
                this.x.push(x);
                this.y.push(func(x));
            }
            var y = this.y;
            for (var i = 0; i < start + n; i++) {
                this.delta.push([]);
                if (i == 0) {
                    for (var k = 0, len = y.length - 1; k < len; k++) {
                        this.delta[i].push(y[k + 1] - y[k]);
                    }
                    continue;
                }
                for (var k = 0, len = y.length - i - 1; k < len; k++) {
                    this.delta[i].push(this.delta[i - 1][k + 1] - this.delta[i - 1][k]);
                }
            }
        }
        /**
         * Возвращает значение вида Δ^k*y_p
         * @param k
         * @param p
         * @returns {number}
         */
        TableDiff.prototype.getDelta = function (k, p) {
            return this.delta[-this.start + k][p];
        };
        TableDiff.prototype.toString = function () {
            console.table({
                x: this.x,
                y: this.y,
            });
            console.table(this.delta);
        };
        return TableDiff;
    }());
    exports.TableDiff = TableDiff;
});

//# sourceMappingURL=tableDiff.js.map
