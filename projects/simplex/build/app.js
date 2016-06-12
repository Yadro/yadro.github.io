///<reference path="../typings/index.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', 'components/inputMatrix', './components/simplexMatrix', './helper/simplex', './helper/fileLoad', "./components/help"], function (require, exports, React, ReactDOM, inputMatrix_1, simplexMatrix_1, simplex_1, fileLoad_1, help_1) {
    "use strict";
    var App = (function (_super) {
        __extends(App, _super);
        function App(props) {
            _super.call(this, props);
            this.state = {
                matrix: null,
                polynom: null,
                simplex: null,
                log: [],
                bystep: true,
                oninput: true,
                end: false,
            };
        }
        App.prototype.calc = function (matrix, polynom) {
            var bystep = this.state.bystep;
            this.simplex = new simplex_1.Simplex(polynom, matrix, bystep);
            if (!bystep) {
                this.simplex.calc();
            }
            this.setState({
                simplex: this.simplex,
                log: this.simplex.debug,
                oninput: false
            });
        };
        App.prototype.onPrev = function () {
            var res = this.simplex.prev();
            this.setState({
                log: this.simplex.debug,
                end: false
            });
        };
        App.prototype.onNext = function (pos) {
            var res = this.simplex.next(pos);
            this.setState({
                log: this.simplex.debug,
                end: res
            });
        };
        App.prototype.onSelectReference = function (e) {
            var pos = e.split('x');
            if (pos.length != 2) {
                throw new Error('SimplexMatrix: incorrect matrix element');
            }
            var pos_ = pos.map(function (el) { return +el; });
            try {
                this.onNext(pos_);
            }
            catch (err) {
                console.error(err);
            }
        };
        App.prototype.onClickCheckbox = function (e) {
            this.setState({ bystep: e.target.checked });
        };
        App.prototype.onUploadFile = function (obj) {
            this.setState({
                matrix: obj.matrix,
                polynom: obj.polynom
            });
        };
        App.prototype.render = function () {
            return (React.createElement("div", null, React.createElement(help_1.default, null), React.createElement("input", {type: "file", id: "files", name: "files[]", onChange: fileLoad_1.uploadFile.bind(null, this.onUploadFile.bind(this))}), React.createElement(inputMatrix_1.default, {callback: this.calc.bind(this), showCalc: this.state.oninput, matrix: this.state.matrix, polynom: this.state.polynom}), this.state.oninput && false ?
                React.createElement("span", null, React.createElement("input", {id: "checkbox", type: "checkbox", onChange: this.onClickCheckbox.bind(this)}), React.createElement("label", {htmlFor: "checkbox"}, "по шагам")) : null, React.createElement(simplexMatrix_1.SimplexMatrix, {log: this.state.log, callback: this.onSelectReference.bind(this), lastIsTouchable: "false"}), !this.state.oninput && !this.state.end ?
                React.createElement("span", null, React.createElement("button", {onClick: this.onPrev.bind(this)}, "back"), React.createElement("button", {onClick: this.onNext.bind(this, undefined)}, "next")) : null));
        };
        return App;
    }(React.Component));
    ReactDOM.render(React.createElement(App, null), document.querySelector('.react'));
});

//# sourceMappingURL=app.js.map
