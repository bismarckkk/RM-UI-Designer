import React, {Component} from 'react';
import { Drawer } from "antd";

class Generator extends Component {
    state = {show: false}
    data = {}

    gen(data) {
        this.data = data
        this.setState({show: true})
    }

    onClose() {
        this.setState({show: false})
    }

    render() {
        return (
            <div>
                <Drawer
                    title="C Code Generator"
                    placement="right"
                    onClose={()=>this.onClose()}
                    open={this.state.show}
                    size="large"
                >
                    <h1>Not yet completed</h1>
                    <p>{JSON.stringify(this.data)}</p>
                </Drawer>
            </div>
        );
    }
}

export default Generator;