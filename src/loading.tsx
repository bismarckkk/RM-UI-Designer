import React, {Component} from 'react';
import { Spin } from "antd";

class Loading extends Component {
    render() {
        return (
            <div style={{ paddingTop: 100, textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }
}

export default Loading;