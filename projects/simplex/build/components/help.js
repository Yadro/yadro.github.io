var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var text = (React.createElement("div", null, React.createElement("h2", null, "Решение задачи линейного программирования. Симплекс метод"), React.createElement("div", null, React.createElement("h4", null, "Ввод данных:"), React.createElement("ul", null, React.createElement("li", null, "Сначала вводится число коэффициентов полинома(включая свободный член) и число граничных условий."), React.createElement("li", null, "Затем вводятся коэффициенты полинома и граничных условий."), React.createElement("li", null, "Коэффициенты могут быть целочисленными либо рациональными."), React.createElement("li", null, "Пример ввода рационального числа: \"-1/2\" (без ковычек)."), React.createElement("li", null, "После того как все данные были введены, можно начать вычисления кнопкой ", React.createElement("button", null, "calc"), "."), React.createElement("li", null, "После нажатия на кнопку ", React.createElement("button", null, "calc"), ", введенные данные сохраняются в браузере и восстанавливаются после обновления страницы."), React.createElement("li", null, "Для очистки решения нужно перезагрузить страницу ", React.createElement("button", {onClick: function () { return location.reload(); }}, "↺"))), React.createElement("h4", null, "Выбор опорного элемента:"), React.createElement("ul", null, React.createElement("li", null, "Выбор опорного элемента осуществляется кликом по нужному значению в матрице."), React.createElement("li", null, "Для автоматического выбора опорного элемента, нужно нажать ", React.createElement("button", null, "next"), "."), React.createElement("li", null, React.createElement("button", null, "back"), " возвращает на предыдущий шаг.")), React.createElement("h3", null, "Сохранение в файл и загрузка из файла."), React.createElement("span", null, "Введенные данные сохраняются по нажатию на кнопку", React.createElement("button", null, "download"), "."), React.createElement("br", null), React.createElement("span", null, "Для загрузки данных нужно нажать на ", React.createElement("button", null, "Выберите файл"), " и выбрать нужный файл."))));
    var Help = (function (_super) {
        __extends(Help, _super);
        function Help(props) {
            _super.call(this, props);
            this.onClick = this.onClick.bind(this);
            this.state = {
                show: false
            };
        }
        Help.prototype.onClick = function () {
            this.setState({ show: !this.state.show });
        };
        Help.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("a", {onClick: this.onClick, href: "#"}, this.state.show ? '-' : '+', " help"), this.state.show ?
                React.createElement("div", null, text) : null, React.createElement("br", null), React.createElement("br", null)));
        };
        return Help;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Help;
});

//# sourceMappingURL=help.js.map
