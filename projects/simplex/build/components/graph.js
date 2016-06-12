///<reference path="../../typings/index.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', "../helper/graphc"], function (require, exports, React, graphc_1) {
    "use strict";
    var test = [
        [0, 0, 0],
        [0, 1, 3],
        [1, 2, 2],
        [7, 2, 10],
        [1, 1, 1],
        [1, 1, 10],
        [1, 2, -3],
        [1, 2, -20],
    ];
    var Graph = (function (_super) {
        __extends(Graph, _super);
        function Graph(props) {
            _super.call(this, props);
            this.state = {};
        }
        Graph.prototype.componentDidMount = function () {
            this.graph = new graphc_1.GraphC('#svg', this.props.matrix || test);
        };
        Graph.prototype.componentDidUpdate = function () {
            this.graph();
        };
        Graph.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h1", null, "Snap svg"), React.createElement("svg", {id: "svg", width: "800px", height: "600px"})));
        };
        return Graph;
    }(React.Component));
    exports.Graph = Graph;
});

//# sourceMappingURL=graph.js.map
