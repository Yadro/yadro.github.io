define(["require", "exports", '../../node_modules/snapsvg/dist/snap.svg'], function (require, exports, Snap) {
    "use strict";
    var GraphC = (function () {
        function GraphC(id, graphs) {
            var _this = this;
            this.lineStyle = {
                stroke: '#000',
                strokeWidth: 2
            };
            this.fontAxisY = {
                fontFamily: 'Source Sans Pro',
                textAnchor: 'middle'
            };
            this.fontAxisX = {
                fontFamily: 'Source Sans Pro',
                textAnchor: 'middle'
            };
            this.padding = 60;
            this.sizeSvg = [800, 600];
            this.coords = [];
            this.paper = Snap(id || 'svg');
            this.graphs = graphs;
            graphs.forEach(function (el) {
                _this.coords.push(_this.calcCoords(el));
            });
            var extr;
            this.extremum = extr = this.getExtremum();
            // определяем размер сегмента
            this.count = extr[5] - extr[4];
            this.size = Math.min(this.sizeSvg[0], this.sizeSvg[1]) - this.padding;
            this.segment = this.size / this.count;
            // считаем начало координат
            var x_min = extr[0], x_max = extr[1], y_min = extr[2], y_max = extr[3];
            var graphW = (x_max - x_min) * this.segment, graphH = (y_max - y_min) * this.segment;
            this.start = [
                this.sizeSvg[0] / 2 - graphW / 2 - x_min * this.segment,
                this.sizeSvg[1] / 2 - graphH / 2 + y_max * this.segment
            ];
            this.drawAxis();
            this.drawAxis(true);
            this.drawGraphics();
        }
        /**
         * Отрисовка оси координат
         * @param vert
         */
        GraphC.prototype.drawAxis = function (vert) {
            var paper = this.paper, size = this.size, count = this.count, segm = this.segment;
            var startX = this.start[0] + .5, startY = this.start[1] + .5, endX, endY;
            if (vert) {
                segm *= -1;
                endY = startY - size;
                endX = startX;
            }
            else {
                endX = startX + size;
                endY = startY;
            }
            var line;
            if (vert) {
                line = paper.line(startX, startY - this.extremum[2] * this.segment, startX, startY - this.extremum[3] * this.segment);
            }
            else {
                line = paper.line(startX + this.extremum[0] * this.segment, startY, startX + this.extremum[1] * this.segment, startY);
            }
            line.attr(this.lineStyle);
            for (var i = Math.floor(this.extremum[4]); i <= Math.floor(this.extremum[5]); i++) {
                var localX = vert ? startX : startX + i * segm;
                var localY = vert ? startY + i * segm : startY;
                if (vert) {
                    if (i != 0) {
                        paper.text(localX - 15, localY + 5, "" + i)
                            .attr(this.fontAxisY);
                    }
                    paper.line(localX, localY, localX - 5, localY)
                        .attr(this.lineStyle);
                }
                else {
                    if (i != 0) {
                        paper.text(localX, localY + 20, "" + i)
                            .attr(this.fontAxisX);
                    }
                    paper.line(localX, localY, localX, localY + 5)
                        .attr(this.lineStyle);
                }
            }
        };
        /**
         * Отрисовка графиков
         */
        GraphC.prototype.drawGraphics = function () {
            var _this = this;
            var start = this.start, angle = this.segment;
            this.coords.forEach(function (coord) {
                var sign = 1;
                coord = coord.map(function (e, i) {
                    sign = (i % 2) ? -1 : 1; // invert axisY
                    return start[i % 2] + e * angle * sign;
                });
                var line = _this.paper.line(coord[0], coord[1], coord[2], coord[3])
                    .attr(_this.lineStyle);
                _this.paper.line(coord[0], coord[1], coord[2], coord[3])
                    .attr({
                    stroke: '#0f0',
                    opacity: 0,
                    strokeWidth: 10
                })
                    .hover(function (e) {
                    line.attr({ stroke: '#f00' });
                }, function (e) {
                    line.attr(_this.lineStyle);
                });
            });
        };
        /**
         * Поиск точек пересечения с осями координат
         * @param equation
         *
         * @example
         * ax_1 + bx_2 = c
         * x_1 = (-bx_2 + c) / a
         * x_2 = (-ax_1 + c) / b
         */
        GraphC.prototype.calcCoords = function (equation) {
            if (equation.length < 3)
                return;
            var a = equation[0], b = equation[1], c = equation[2];
            if (a == 0 && b == 0) {
                return [0, 0, 0, 0];
            }
            if (!a) {
                return [
                    0, c / b,
                    1, c / b
                ];
            }
            if (!b) {
                return [
                    c / a, 0,
                    c / a, 1,
                ];
            }
            return [
                c / a, 0,
                0, c / b // = x2, x1 = 0
            ];
        };
        /**
         * Поиск точек экстремума графиков на осях
         *  0 - x_min
         *  1 - x_max
         *  2 - y_min
         *  3 - y_max
         *  4 - min(x_min, y_min)
         *  5 - max(x_max, y_max)
         * @returns {number[]}
         */
        GraphC.prototype.getExtremum = function () {
            var x = [];
            var y = [];
            this.coords.forEach(function (coord) {
                coord.forEach(function (el, i) {
                    if (i % 2) {
                        y.push(el);
                    }
                    else {
                        x.push(el);
                    }
                });
            });
            var sort = function (a, b) { return a > b ? 1 : -1; };
            x = x.sort(sort);
            y = y.sort(sort);
            return [
                x[0], x[x.length - 1],
                y[0], y[y.length - 1],
                Math.min(x[0], y[0]),
                Math.max(x[x.length - 1], y[y.length - 1])
            ];
        };
        return GraphC;
    }());
    exports.GraphC = GraphC;
});

//# sourceMappingURL=graphc.js.map
