import React, {Component} from 'react';
import {Empty, Tag, Drawer, Divider} from "antd";

class RxDrawer extends Component {
    state = {show: false, history: {rx: 0, log: []}}

    onClose() {
        this.setState({show: false})
    }

    show(data) {
        this.setState({show: true, history: data})
    }

    render() {
        let history = this.state.history;
        let res;
        if (history.log.length === 0) {
            res = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No log yet." />
        } else {
            res = []
            for (const chunk of history.log) {
                res.push(<Divider />)
                res.push(Array.from(chunk).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(item => <Tag>{item}</Tag>))
            }
        }

        return (
            <Drawer
                title="Serial Rx History"
                placement="right"
                onClose={() => this.onClose()}
                open={this.state.show}
                size="large"
                getContainer={document.getElementById('content-in')}
                rootStyle={{inset: '25px 0 0 0'}}
                style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
            >
                <div style={{
                    width: '100%',
                    height: 'calc(100% - 25px)',
                }}>
                    <div style={{color: 'var(--ant-color-text)', height: '100%'}}>
                        <p>RX: {history.rx}</p>
                        <div style={{paddingBottom: 10}} className="card-body">
                            {res}
                        </div>
                    </div>
                </div>
            </Drawer>
        );
    }
}

export default RxDrawer;