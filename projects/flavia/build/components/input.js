var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var InputC = (function (_super) {
        __extends(InputC, _super);
        function InputC(props) {
            _super.call(this, props);
        }
        InputC.prototype.onChange = function (name, e) {
            this.props.callback(name, +e.target.value);
        };
        InputC.prototype.createInput = function (name, value) {
            return (React.createElement("div", {key: name}, React.createElement("label", {htmlFor: name}, name), React.createElement("input", {name: name, value: value, type: "number", onChange: this.onChange.bind(this, name)})));
        };
        InputC.prototype.render = function () {
            var inputGroup = [];
            var labels = this.props.labels;
            for (var i in labels) {
                if (labels.hasOwnProperty(i)) {
                    inputGroup.push(this.createInput(i, labels[i]));
                }
            }
            return (React.createElement("div", null, React.createElement("b", null, "alpha * cos(tan(betta * x)) + eps * sin(gamma * x)"), inputGroup));
        };
        return InputC;
    }(React.Component));
    exports.InputC = InputC;
});

//# sourceMappingURL=input.js.map
