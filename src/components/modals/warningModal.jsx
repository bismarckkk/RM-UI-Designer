import React, {Component} from 'react';
import {Button, Modal, Space} from "antd";
import { WarningFilled, InfoCircleFilled, CloseCircleFilled } from "@ant-design/icons";

class WarningModal extends Component {
    state = { open: false }
    initInfo = { okText: 'OK', title: '', content: '', type: 'warning', onOK: null }
    info = { ...this.initInfo }

    open(payload) {
        this.info = payload
        this.setState({open: true})
    }

    onOK() {
        this.setState({open: false}, ()=>{this.info = {...this.initInfo}})
        if (this.info.onOK) {
            this.info.onOK()
        }
    }

    onCancel() {
        this.setState({open: false}, ()=>{this.info = {...this.initInfo}})
    }

    render() {
        let icon = <InfoCircleFilled style={{color: "var(--ant-color-primary)", fontSize: 25}} />
        if (this.info.type === 'warning') {
            icon = <WarningFilled style={{color: "orange", fontSize: 25}} />
        } else if (this.info.type === 'error') {
            icon = <CloseCircleFilled style={{color: "red", fontSize: 25}} />
        }
        return (
            <Modal
                title={
                    <Space size="large" style={{display: 'flex', alignItems: 'center'}}>
                        {icon}
                        <h3>{this.info.title}</h3>
                    </Space>}
                open={this.state.open}
                onOk={() => this.onOK()}
                onCancel={() => this.onCancel()}
                closeIcon={null}
                footer={
                    this.props.couldClose || this.info.onOK ?
                        <Button
                            type="primary"
                            onClick={() => this.onOK()}
                        >
                            {this.info.okText}
                        </Button>
                        :null
                }
                keyboard={this.props.couldClose}
                maskClosable={this.props.couldClose}
                style={{padding: 50}}
                zIndex={10}
            >
                <div style={{marginLeft: 40}}>
                    {this.info.content}
                </div>
            </Modal>
        );
    }
}

export default WarningModal;