///<reference path="../typings/main.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', './components/graph', './components/input'], function (require, exports, React, ReactDOM, graph_1, input_1) {
    "use strict";
    var App = (function (_super) {
        __extends(App, _super);
        function App(props) {
            _super.call(this, props);
            this.state = {
                params: {
                    'alpha': 1,
                    'betta': 1,
                    'eps': 1,
                    'gamma': 1,
                    n: 5,
                    a: -10,
                    b: 10,
                    c: -10,
                    d: 10,
                }
            };
        }
        App.prototype.changeParam = function (name, value) {
            var params = this.state.params;
            params[name] = value;
            this.setState({ params: params });
        };
        App.prototype.render = function () {
            return (React.createElement("div", null, React.createElement(input_1.InputC, {labels: this.state.params, callback: this.changeParam.bind(this)}), React.createElement(graph_1.Graph, {params: this.state.params})));
        };
        return App;
    }(React.Component));
    ReactDOM.render(React.createElement(App, null), document.querySelector('.react'));
});

//# sourceMappingURL=app.js.map
