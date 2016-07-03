///<reference path="../../typings/index.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', "./printEquation"], function (require, exports, React, printEquation_1) {
    "use strict";
    var debugSaveMatrx = false;
    /**
     * Класс отвечающий за распечатку матрицы
     */
    var SimplexMatrix = (function (_super) {
        __extends(SimplexMatrix, _super);
        function SimplexMatrix(props) {
            _super.call(this, props);
        }
        SimplexMatrix.prototype.render = function () {
            var callback = this.props.callback;
            var _log = this.props.log;
            var len = _log.length - 1;
            var log = _log.map(function (e, i) {
                if (e.backup) {
                    if (debugSaveMatrx) {
                        return React.createElement("div", {key: i}, "save ", React.createElement("span", {dangerouslySetInnerHTML: { __html: '&uarr;' }}));
                    }
                    return;
                }
                return (React.createElement("div", {key: i}, matrixToHtml(e, (callback && i === len) ? callback : null, 'simplex')));
            });
            return (React.createElement("div", null, log));
        };
        return SimplexMatrix;
    }(React.Component));
    exports.SimplexMatrix = SimplexMatrix;
    function matrixToHtml(params, callback, className) {
        var tableEl = null;
        if (params.m && params.p) {
            var matrix = params.m, head = params.p[0], left = params.p[1], select = params.select || null;
            var table = [], headArr = [];
            // шапка
            headArr.push(React.createElement("td", {key: "0"}));
            for (var i = 0; i < head.length; i++) {
                headArr.push(React.createElement("td", {key: i + 1}, "x" + (head[i])));
            }
            headArr.push(React.createElement("td", {key: i + 1}, "b"));
            for (var i_1 = 0; i_1 < matrix.height; i_1++) {
                var row = [];
                // первый столбец
                if (i_1 > left.length - 1) {
                    row.push(React.createElement("td", {key: "0"}, "p"));
                }
                else {
                    row.push(React.createElement("td", {key: "0"}, "x" + (left[i_1])));
                }
                // остальные элементы
                for (var j = 0; j < matrix.width; j++) {
                    var className_1 = (select && select[0] == i_1 && select[1] == j) ? 'select' : '';
                    var touchable = callback && i_1 < matrix.height - 1 && j < matrix.width - 1;
                    if (touchable) {
                        className_1 += ' touch';
                    }
                    row.push(React.createElement("td", {key: j + 1, className: className_1, onClick: touchable ? callback.bind(null, i_1 + "x" + j) : null}, matrix.matrix[i_1][j].toFraction()));
                }
                var className_2 = (select && select[0] == i_1 && select[1] == -1) ? 'select' : '';
                table.push(React.createElement("tr", {key: i_1, className: className_2}, row));
            }
            tableEl = (React.createElement("table", {className: className ? className : ''}, React.createElement("thead", null, React.createElement("tr", null, headArr)), React.createElement("tbody", null, table)));
        }
        return (React.createElement("div", null, params.text ? React.createElement("div", null, params.text) : null, params.equation ?
            React.createElement(printEquation_1.default, {equation: params.equation})
            : null, tableEl));
    }
});

//# sourceMappingURL=simplexMatrix.js.map
