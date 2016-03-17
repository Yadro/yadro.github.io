///<reference path="../../typings/main.d.ts"/>

import * as React from 'react';
import * as Snap from '../../node_modules/snapsvg/dist/snap.svg';
import {GraphPolynom} from "../helper/graph_polynom";
import {TableDiff} from "../helper/tableDiff";
import {Bessel} from "../helper/bessel";

function func(params) {
    let alpha = params.alpha;
    let betta = params.betta;
    let eps = params.eps;
    let gamma = params.gamma;
    return (x) => {
        return alpha * Math.cos(Math.tan(betta * x)) + eps * Math.sin(gamma * x);
    }
}


interface GraphProps {
    params;
}

export class Graph extends React.Component<GraphProps, any> {

    graph: GraphPolynom;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let f = func(this.props.params);
        this.graph = new GraphPolynom('#svg', [f], this.props.params);
        let bessel = new Bessel(f, 1, this.props.params.n);
        this.graph.addGraphic((x) => bessel.bessel(x));
    }

    componentDidUpdate() {
        let f = func(this.props.params);
        let bessel = new Bessel(f, 1, this.props.params.n);
        this.graph.updateGraphics([f, (x) => bessel.bessel(x)], this.props.params);
    }

    render() {
        return (
            <div>
                <svg id="svg" width="800px" height="600px"/>
            </div>
        )
    }
}