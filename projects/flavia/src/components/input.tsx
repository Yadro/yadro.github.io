///<reference path="../../typings/main.d.ts"/>
import * as React from 'react';

interface InputCProps {
    labels: {};
    callback: (name, value) => void;
}

export class InputC extends React.Component<InputCProps, any> {

    constructor(props) {
        super(props);
    }

    onChange(name, e: KeyboardEvent) {
        this.props.callback(name, +e.target.value);
    }

    createInput(name, value) {
        return (
            <div key={name}>
                <label htmlFor={name}>{name}</label>
                <input name={name}
                       value={value}
                       type="number"
                       onChange={this.onChange.bind(this, name)}/>
            </div>
        )
    }

    render() {
        let inputGroup = [];
        let labels = this.props.labels;

        for (let i in labels) {
            if (labels.hasOwnProperty(i)) {
                inputGroup.push(this.createInput(i, labels[i]));
            }
        }

        return (
            <div>
                <b>alpha * cos(tan(betta * x)) + eps * sin(gamma * x)</b>
                {inputGroup}
            </div>
        )
    }
}