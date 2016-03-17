///<reference path="../../typings/main.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', "../helper/graph_polynom", "../helper/bessel"], function (require, exports, React, graph_polynom_1, bessel_1) {
    "use strict";
    function func(params) {
        var alpha = params.alpha;
        var betta = params.betta;
        var eps = params.eps;
        var gamma = params.gamma;
        return function (x) {
            return alpha * Math.cos(Math.tan(betta * x)) + eps * Math.sin(gamma * x);
        };
    }
    var Graph = (function (_super) {
        __extends(Graph, _super);
        function Graph(props) {
            _super.call(this, props);
        }
        Graph.prototype.componentDidMount = function () {
            var f = func(this.props.params);
            this.graph = new graph_polynom_1.GraphPolynom('#svg', [f], this.props.params);
            var bessel = new bessel_1.Bessel(f, 1, this.props.params.n);
            this.graph.addGraphic(function (x) { return bessel.bessel(x); });
        };
        Graph.prototype.componentDidUpdate = function () {
            var f = func(this.props.params);
            var bessel = new bessel_1.Bessel(f, 1, this.props.params.n);
            this.graph.updateGraphics([f, function (x) { return bessel.bessel(x); }], this.props.params);
        };
        Graph.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("svg", {id: "svg", width: "800px", height: "600px"})));
        };
        return Graph;
    }(React.Component));
    exports.Graph = Graph;
});

//# sourceMappingURL=graph.js.map
