///<reference path="../typings/main.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Graph} from './components/graph';
import {TableDiff} from  './helper/tableDiff';
import {InputC} from './components/input';


interface AppState {
    params;
}

class App extends React.Component<any, AppState> {

    constructor(props) {
        super(props);
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
        }
    }

    changeParam(name, value) {
        let params = this.state.params;
        params[name] = value;

        this.setState({params});
    }

    render() {
        return (
            <div>
                <InputC labels={this.state.params}
                        callback={this.changeParam.bind(this)}/>
                <Graph params={this.state.params}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector('.react'));


