///<reference path="../../typings/index.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../node_modules/fraction.js/fraction', "../helper/matrix", '../helper/tools', "../helper/fileLoad"], function (require, exports, React, Fraction, matrix_1, tools_1, fileLoad_1) {
    "use strict";
    /**
     * Класс рисующий поля для ввода коэффициентов матрицы
     * Также сохраняет и восстанавливает её из localStorage
     */
    var InputMatrix = (function (_super) {
        __extends(InputMatrix, _super);
        function InputMatrix(props) {
            _super.call(this, props);
            var matr = localStorage.getItem('matrix');
            var polynom = localStorage.getItem('polynom');
            if (matr) {
                matr = JSON.parse(matr);
            }
            else {
                matr = null;
            }
            var restorePolDir;
            if (polynom) {
                polynom = JSON.parse(polynom);
                restorePolDir = polynom.pop();
            }
            else {
                polynom = null;
            }
            var width = matr ? matr[0].length : 3;
            this.state = {
                polynom: polynom || tools_1.createArray(width),
                polynomDirect: restorePolDir || -1,
                matrix: matr || tools_1.createMatrix(3, 3),
                width: width,
                height: matr ? matr.length : 3,
                errorMsg: ''
            };
            this.selectChange = this.selectChange.bind(this);
        }
        InputMatrix.prototype.componentWillReceiveProps = function (nextProps) {
            if (nextProps.hasOwnProperty('polynom') && tools_1.isArray(nextProps.polynom)
                && nextProps.hasOwnProperty('matrix')) {
                var polynom = nextProps.polynom.slice();
                var polynomDirect = polynom.pop();
                this.setState({
                    polynom: polynom,
                    polynomDirect: polynomDirect,
                    matrix: nextProps.matrix,
                    width: nextProps.polynom.length,
                    height: nextProps.matrix.length,
                });
            }
        };
        InputMatrix.prototype.onChange = function (el, e) {
            var value = e.target.value;
            var matrix = this.state.matrix;
            var pos = el.split(',');
            var i = +pos[0], j = +pos[1];
            if (pos.length == 2 && i < matrix.length && j < matrix[i].length) {
                matrix[i][j] = value;
                this.setState({ matrix: matrix });
            }
            else {
                throw new Error("Ошибка ввода параметра матрицы");
            }
        };
        InputMatrix.prototype.onPolynomChange = function (n, e) {
            var value = e.target.value;
            var polynom = this.state.polynom;
            polynom[n] = value;
            this.setState({ polynom: polynom });
        };
        InputMatrix.prototype.setSize = function (rot, e) {
            var obj = {};
            var _a = this.state, height = _a.height, width = _a.width, matrix = _a.matrix;
            var size = [width, height];
            var setSize = +e.target.value;
            if (setSize > 0 && setSize <= 16) {
                obj[rot] = setSize;
                if (rot == 'width') {
                    size[0] = setSize;
                }
                else {
                    size[1] = setSize;
                }
                obj['matrix'] = tools_1.changeSizeMatrix(matrix, size);
                obj['polynom'] = tools_1.createArray(size[0]);
                this.setState(obj);
            }
        };
        ;
        /**
         * сохраняем матрицу и полином
         */
        InputMatrix.prototype.verify = function () {
            var _a = this.state, matrix = _a.matrix, polynomDirect = _a.polynomDirect;
            var polynom = this.state.polynom.slice();
            polynom.push(polynomDirect);
            var matrixFract = [];
            var error = false;
            matrix.forEach(function (row, i) {
                matrixFract.push([]);
                row.forEach(function (el, j) {
                    try {
                        matrixFract[i].push(new Fraction(el));
                    }
                    catch (e) {
                        error = true;
                        console.log(i + " " + j, e);
                    }
                });
            });
            if (error) {
                this.setState({
                    errorMsg: 'Введенные коэффициенты содержат недопустимые символы'
                });
                return;
            }
            try {
                var parseMatrix = new matrix_1.MatrixM(matrixFract);
                localStorage.setItem('matrix', JSON.stringify(matrix));
                localStorage.setItem('polynom', JSON.stringify(polynom));
                this.props.callback(parseMatrix, polynom);
            }
            catch (e) {
                this.setState({
                    errorMsg: 'Введенные коэффициенты содержат недопустимые символы'
                });
            }
        };
        InputMatrix.prototype.rowPoly = function () {
            var _this = this;
            var polynom = this.state.polynom;
            return (React.createElement("div", {key: polynom.length}, polynom.map(function (el, index) { return (React.createElement("input", {type: "text", key: index, value: el, onChange: _this.onPolynomChange.bind(_this, index)})); }), React.createElement("span", null, "→"), this.selectRender()));
        };
        InputMatrix.prototype.selectChange = function (e) {
            this.setState({ polynomDirect: +e.target.value });
        };
        InputMatrix.prototype.selectRender = function () {
            return (React.createElement("select", {defaultValue: this.state.polynomDirect, onChange: this.selectChange}, React.createElement("option", {value: "-1"}, "min"), React.createElement("option", {value: "1"}, "max")));
        };
        InputMatrix.prototype.rowRender = function (row, index) {
            var _this = this;
            var i = 0;
            return row.map(function (el) { return (React.createElement("input", {type: "text", key: i, value: el, onChange: _this.onChange.bind(_this, index + ',' + i++)})); });
        };
        InputMatrix.prototype.saveToJson = function () {
            var obj = {};
            var poly = this.state.polynom;
            poly.push(this.state.polynomDirect);
            obj['matrix'] = this.state.matrix;
            obj['polynom'] = poly;
            fileLoad_1.downloadFile(JSON.stringify(obj));
        };
        InputMatrix.prototype.render = function () {
            var _this = this;
            var i = 0;
            var matrix = this.state.matrix;
            var matrixComp = matrix.map(function (row) { return (React.createElement("div", {key: i}, _this.rowRender(row, i++))); });
            return (React.createElement("div", null, React.createElement("button", {onClick: this.saveToJson.bind(this)}, "download"), React.createElement("div", null, React.createElement("label", null, "Число коэффициентов полинома:"), React.createElement("input", {type: "number", value: this.state.width, onChange: this.setSize.bind(this, 'width')})), React.createElement("div", null, React.createElement("label", null, "Число граничных условий:"), React.createElement("input", {type: "number", value: this.state.height, onChange: this.setSize.bind(this, 'height')})), React.createElement("div", null, React.createElement("span", null, "Полином:"), this.rowPoly()), React.createElement("div", null, React.createElement("span", null, "Граничные условия:"), matrixComp), this.state.errorMsg.length !== 0 ?
                React.createElement("div", null, this.state.errorMsg) : null, this.props.showCalc ?
                React.createElement("button", {onClick: this.verify.bind(this)}, "calc")
                : null));
        };
        return InputMatrix;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InputMatrix;
});

//# sourceMappingURL=inputMatrix.js.map
