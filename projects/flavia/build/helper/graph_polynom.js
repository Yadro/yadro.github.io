define(["require", "exports", '../../node_modules/snapsvg/dist/snap.svg'], function (require, exports, Snap) {
    "use strict";
    var GraphPolynom = (function () {
        function GraphPolynom(id, func, size) {
            var _this = this;
            this.lineStyle = {
                stroke: '#000',
                strokeWidth: 1
            };
            this.lineStyle2 = {
                stroke: '#0f0',
                opacity: 0,
                strokeWidth: 10
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
            this.extremum = [-10, 10, -10, 10, -10, 10];
            this.segment = 30;
            this.paper = Snap(id || 'svg');
            this.func = func;
            this.sizeW = size;
            this.calc();
            this.drawAxis();
            func.forEach(function (f) {
                _this.drawGraphics(f);
            });
        }
        GraphPolynom.prototype.calc = function () {
            /*let extr;
             this.extremum = extr = this.getExtremum();
    
             // определяем размер сегмента
             this.count = extr[5] - extr[4];
             this.size = Math.min(this.sizeSvg[0], this.sizeSvg[1]) - this.padding;
             this.segment = this.size / this.count;
    
             // считаем начало координат
             let x_min = extr[0],
             x_max = extr[1],
             y_min = extr[2],
             y_max = extr[3];
             let graphW = (x_max - x_min) * this.segment,
             graphH = (y_max - y_min) * this.segment;
    
             this.start = [
             this.sizeSvg[0] / 2 - graphW / 2 - x_min * this.segment,
             this.sizeSvg[1] / 2 - graphH / 2 + y_max * this.segment
             ];*/
            // определяем размер сегмента по X и Y
            this.sizeCell = [
                (this.sizeSvg[0] - this.padding) / (-this.sizeW.a + this.sizeW.b),
                (this.sizeSvg[1] - this.padding) / (-this.sizeW.c + this.sizeW.d)
            ];
            // начало координат
            this.start = [
                -this.sizeW.a * this.sizeCell[0],
                -this.sizeW.c * this.sizeCell[1]
            ];
        };
        /**
         * Отрисовка осей координат
         */
        GraphPolynom.prototype.drawAxis = function () {
            var paper = this.paper, sizeW = this.sizeW;
            var startX = -sizeW.a * this.sizeCell[0] + (this.padding / 2), startY = -sizeW.c * this.sizeCell[1] + (this.padding / 2);
            paper.line(startX, 0, startX, this.sizeSvg[1]).attr(this.lineStyle);
            paper.line(0, startY, this.sizeSvg[0], startY).attr(this.lineStyle);
            for (var k = 0; k < 2; k++) {
                var border = k ?
                    [this.sizeW.c, this.sizeW.d] :
                    [this.sizeW.a, this.sizeW.b];
                var pass = GraphPolynom.getsize(this.sizeCell[k % 2]);
                for (var i = border[0]; i <= border[1]; i++) {
                    if (pass && i % pass) {
                        // пропускаем деления, если маленький масштаб
                        continue;
                    }
                    // координаты делений на осях
                    var localX = k ? startX : startX + i * this.sizeCell[0];
                    var localY = k ? startY + i * this.sizeCell[1] : startY;
                    if (k) {
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
            }
        };
        /**
         * Расчет количества отображаемых делений
         * @param size
         * @returns {number}
         */
        GraphPolynom.getsize = function (size) {
            var pass = 0;
            if (size < 25) {
                pass = 2;
                if (size < 18) {
                    pass = 3;
                }
                if (size < 15) {
                    pass = 4;
                }
                if (size < 10) {
                    pass = 5;
                }
                if (size < 7) {
                    pass = 8;
                }
                if (size < 5) {
                    pass = 10;
                }
                if (size < 4) {
                    pass = 20;
                }
            }
            return pass;
        };
        /**
         * Отрисовка графиков
         */
        GraphPolynom.prototype.drawGraphics = function (func) {
            //let step = (this.sizeW.a + this.sizeW.b) / 800;
            var _this = this;
            var last = [0, 0];
            var _loop_1 = function(i) {
                var coord = [];
                coord[0] = last[0];
                coord[1] = last[1];
                var x = coord[2] = i;
                var y = coord[3] = func(i);
                var sign = 1;
                coord = coord.map(function (p, i) {
                    sign = (i % 2) ? -1 : 1; // invert axisY
                    return _this.start[i % 2] + p * _this.sizeCell[i % 2] * sign + _this.padding / 2;
                });
                var line = this_1.paper.line(coord[0], coord[1], coord[2], coord[3])
                    .attr(this_1.lineStyle);
                /*this.paper.line(coord[0], coord[1], coord[2], coord[3])
                    .attr(this.lineStyle2)
                    .hover((e) => {
                        line.attr({stroke: '#f00'});
                    }, (e) => {
                        line.attr(this.lineStyle);
                    });*/
                last[0] = x;
                last[1] = y;
            };
            var this_1 = this;
            for (var i = this.sizeW.a; i < this.sizeW.b; i += .1) {
                _loop_1(i);
            }
        };
        GraphPolynom.prototype.addGraphic = function (f) {
            this.func.push(f);
            this.drawGraphics(f);
        };
        GraphPolynom.prototype.updateGraphics = function (func, size) {
            var _this = this;
            this.func = func;
            this.sizeW = {
                a: size.a != void 0 ? size.a : -10,
                b: size.b != void 0 ? size.b : 10,
                c: size.c != void 0 ? size.c : -10,
                d: size.d != void 0 ? size.d : 10,
            };
            this.calc();
            this.paper.clear();
            this.drawAxis();
            func.forEach(function (f) {
                _this.drawGraphics(f);
            });
        };
        return GraphPolynom;
    }());
    exports.GraphPolynom = GraphPolynom;
});

//# sourceMappingURL=graph_polynom.js.map
