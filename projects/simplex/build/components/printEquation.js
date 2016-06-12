var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'fraction', '../helper/tools'], function (require, exports, React, Fraction, tools_1) {
    "use strict";
    var signs = {
        '-1': ' - ',
        0: ' = ',
        1: ' + ',
        2: '&middot;',
        3: ' : ',
        4: ' &rarr; '
    };
    var PrintEquationComp = (function (_super) {
        __extends(PrintEquationComp, _super);
        function PrintEquationComp(props) {
            _super.call(this, props);
            /**
             * @example x1 = + 1/2·x1 - 1/2·x2 - 1/2·x3 + 1/2·x4 + 5(-1/2·x4 + 10)
             */
            this.equation = [
                { x: 1 },
                { sign: 0 },
                { sign: 1 },
                { fraction: new Fraction(1, 2) },
                { x: 1 },
                { sign: 1 },
                { fraction: new Fraction(-1, 2) },
                { x: 2 },
                { sign: -1 },
                { fraction: new Fraction(1, 2) },
                { x: 3 },
                { sign: -1 },
                { fraction: new Fraction(-1, 2) },
                { x: 4 },
                [
                    { sign: 1 },
                    { fraction: new Fraction(5) },
                    { sign: 2 },
                    { word: '(' },
                    { fraction: new Fraction(-1, 2) },
                    { x: 4 },
                    { sign: 1 },
                    { fraction: new Fraction(10) },
                    { word: ')' },
                ],
            ];
            this.equation = props.equation ? props.equation.equation : this.equation;
        }
        PrintEquationComp.prototype.sub = function (value) {
            return "<sub>" + value + "</sub>";
        };
        PrintEquationComp.prototype.parseFunc = function (el, idx, buf, last) {
            if (el.hasOwnProperty('x')) {
                if (last.hasOwnProperty('fraction')) {
                    buf += '&middot;';
                }
                buf += 'x' + this.sub(el.x);
            }
            else if (el.hasOwnProperty('sign')) {
                buf += signs[el.sign];
            }
            else if (el.hasOwnProperty('fraction')) {
                var fraction = el.fraction;
                if (last.hasOwnProperty('sign') && last.sign !== 0 && last.sign !== 2) {
                    // "- -1" or "+ -1"
                    if (fraction.s === -1) {
                        buf = buf.slice(0, buf.length - 2);
                        if (fraction.s === last.sign) {
                            // "- -1" => "+ 1"
                            buf += "+ ";
                        }
                        else {
                            // "+ -1" => "-1"
                            buf += "- ";
                        }
                        fraction = fraction.neg();
                    }
                }
                else if (last.hasOwnProperty('word') && last.word === ')' && fraction.s === -1) {
                    // ") -1" => ") - 1"
                    buf += " - ";
                    fraction = fraction.neg();
                }
                buf += fraction.toFraction();
            }
            else if (el.hasOwnProperty('word')) {
                buf += el.word;
            }
            else {
                buf += '{???}';
            }
            return buf;
        };
        PrintEquationComp.prototype.parse = function (arr) {
            var _this = this;
            var buf = '';
            var last = {};
            arr.forEach(function (el, idx) {
                if (tools_1.isArray(el)) {
                    buf += _this.parse(el);
                }
                else {
                    buf = _this.parseFunc(el, idx, buf, last);
                }
                last = el;
            });
            return buf;
        };
        PrintEquationComp.prototype.render = function () {
            var res = this.parse(this.equation);
            return React.createElement("div", {dangerouslySetInnerHTML: { __html: res }});
        };
        return PrintEquationComp;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PrintEquationComp;
    var PrintEquation = (function () {
        function PrintEquation() {
            var _this = this;
            this.equation = [];
            this.push = {
                x: function (num) {
                    _this.pushX(num);
                    return _this.push;
                },
                sign: function (sign) {
                    _this.pushSign(sign);
                    return _this.push;
                },
                plus: function () {
                    _this.pushSign(1);
                    return _this.push;
                },
                minus: function () {
                    _this.pushSign(-1);
                    return _this.push;
                },
                mul: function () {
                    _this.pushSign(2);
                    return _this.push;
                },
                equal: function () {
                    _this.pushSign(0);
                    return _this.push;
                },
                word: function (word) {
                    _this.pushWord(word);
                    return _this.push;
                },
                fraction: function (fraction) {
                    _this.pushFraction(fraction);
                    return _this.push;
                },
                arr: function (arr) {
                    if (arr.hasOwnProperty('equation')) {
                        _this.equation.push(arr.equation);
                    }
                    else {
                        _this.equation.push(arr);
                    }
                    return _this.push;
                },
                arrowMin: function () {
                    _this.push.sign(4).word('min');
                    return _this.push;
                }
            };
            this.equation = [];
        }
        PrintEquation.prototype.pushX = function (num) {
            this.equation.push({ x: num });
        };
        PrintEquation.prototype.pushSign = function (sign) {
            this.equation.push({ sign: sign });
        };
        PrintEquation.prototype.pushWord = function (word) {
            this.equation.push({ word: word });
        };
        PrintEquation.prototype.pushFraction = function (fraction) {
            if (typeof fraction === "number") {
                console.log('this is not fraction');
                fraction = new Fraction(fraction);
            }
            this.equation.push({ fraction: fraction });
        };
        return PrintEquation;
    }());
    exports.PrintEquation = PrintEquation;
});

//# sourceMappingURL=printEquation.js.map
