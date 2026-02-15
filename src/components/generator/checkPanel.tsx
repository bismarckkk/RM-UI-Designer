import React from 'react';
import { Result, List, Space } from "antd";
import {CloseCircleOutlined, WarningOutlined} from "@ant-design/icons";

const CheckPanel = (props: any) => {
    let warnings = props.errors.filter(error => error.level === 'Warn');
    let errors = props.errors.filter(error => error.level === 'Error');

    let res = <Result
        status="success"
        title="Check Passed!"
        subTitle="0 error, 0 warning!"
        style={{marginTop: '50px'}}
    />

    if (errors.length + warnings.length > 0) {
        res = <div style={{color: 'var(--ant-color-text)', height: '100%'}}>
            <p>Found {errors.length} errors, {warnings.length} warnings.</p>
            <div style={{paddingBottom: 10}} className="card-body">
                <List
                    bordered
                    dataSource={props.errors}
                    renderItem={(item) => (
                        <List.Item>
                            <Space size="middle">
                                { item.level === 'Warn' ?
                                    <WarningOutlined /> :
                                    <CloseCircleOutlined />
                                }
                                { item.message }
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

export default CheckPanel;
