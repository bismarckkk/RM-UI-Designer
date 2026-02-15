import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Result, List, Space, Drawer} from "antd";
import {CloseCircleOutlined, WarningOutlined} from "@ant-design/icons";

const LogDrawer = forwardRef((props, ref: any) => {
    const [show, setShow] = useState(false)
    const [errorsData, setErrorsData] = useState<any[]>([])

    useImperativeHandle(ref, () => ({
        show: (data: any[]) => {
            setShow(true)
            setErrorsData(data)
        }
    }))

    let warnings = errorsData.filter(error => error.level === 'warn');
    let errors = errorsData.filter(error => error.level === 'error');

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
                        dataSource={errorsData}
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
                onClose={() => setShow(false)}
                open={show}
                size="large"
                getContainer={document.getElementById('content-in')}
                rootStyle={{inset: '25px 0 0 0'}}
                style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
            >
                <div style={{
                    width: '100%',
                    height: 'calc(100% - 25px)',
                }}>
                    {res}
                </div>
            </Drawer>
        );
});

export default LogDrawer;
