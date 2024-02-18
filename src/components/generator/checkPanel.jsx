import React, {Component} from 'react';
import { Result, List, Space } from "antd";
import {CloseCircleOutlined, WarningOutlined} from "@ant-design/icons";

class CheckPanel extends Component {
    render() {
        let warnings = this.props.errors.filter(error => error.level === 'warning');
        let errors = this.props.errors.filter(error => error.level === 'error');

        let res = <Result
            status="success"
            title="Check Passed!"
            subTitle="0 error, 0 warning!"
            style={{marginTop: '50px'}}
        />

        if (errors.length + warnings.length > 0) {
            res = <div style={{color: 'var(--ant-color-text)', height: '100%'}}>
                <p>Found {errors.length} errors, {warnings.length} warnings.</p>
                <div style={{height: '100%', overflow: 'auto', paddingBottom: 50}}>
                    <List
                        bordered
                        dataSource={this.props.errors}
                        renderItem={(item) => (
                            <List.Item>
                                <Space size="middle">
                                    { item.level === 'warning' ?
                                        <WarningOutlined /> :
                                        <CloseCircleOutlined />
                                    }
                                    { item.info }
                                </Space>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        }

        return (
            <div style={{
                width: '100%',
                height: 'calc(100% - 50px)',
            }}>
                <h3 style={{color: 'var(--ant-color-text)'}}>Check Data</h3>
                {res}
            </div>
        );
    }
}

export default CheckPanel;