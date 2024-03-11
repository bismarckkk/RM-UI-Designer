import React, {Component} from 'react';
import {Result, List, Space, Drawer} from "antd";
import {CloseCircleOutlined, WarningOutlined} from "@ant-design/icons";

class LogDrawer extends Component {
    state = {show: false, errors: []}

    onClose() {
        this.setState({show: false})
    }

    show(data) {
        this.setState({show: true, errors: data})
    }

    render() {
        let warnings = this.state.errors.filter(error => error.level === 'warn');
        let errors = this.state.errors.filter(error => error.level === 'error');

        let res = <Result
            status="success"
            title="0 error, 0 warning!"
            style={{marginTop: '50px'}}
        />

        if (errors.length + warnings.length > 0) {
            res = <div style={{color: 'var(--ant-color-text)', height: '100%'}}>
                <p>Logged {errors.length} errors, {warnings.length} warnings.</p>
                <div style={{paddingBottom: 10}} className="card-body">
                    <List
                        bordered
                        dataSource={this.state.errors}
                        renderItem={(item) => (
                            <List.Item>
                                <Space size="middle">
                                    { item.level === 'warn' ?
                                        <WarningOutlined /> :
                                        <CloseCircleOutlined />
                                    }
                                    { `${item.time.toLocaleTimeString()}: ${item.message}` }
                                </Space>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        }

        return (
            <Drawer
                title="Serial Debug Log"
                placement="right"
                onClose={() => this.onClose()}
                open={this.state.show}
                size="large"
                getContainer={document.getElementById('content-in')}
                rootStyle={{inset: '25px 0 0 0'}}
            >
                <div style={{
                    width: '100%',
                    height: 'calc(100% - 25px)',
                }}>
                    {res}
                </div>
            </Drawer>
        );
    }
}

export default LogDrawer;