import React, {Component} from 'react';
import { Button, Divider, Modal, Space } from "antd";
import { isAvailable } from "@/utils/autoSaver";

class ModeModal extends Component {
    state = {title: '', open: false, frames: []}
    promise = null

    open() {
        return new Promise((resolve, reject) => {
            this.setState({open: true})
            if (this.promise) {
                this.promise.reject()
            }
            this.promise = {resolve, reject}
        })
    }

    onClick(mode) {
        this.setState({open: false})
        this.promise.resolve(mode)
        this.promise = null
    }

    render() {
        const ava = isAvailable()
        return (
            <Modal
                footer={null}
                maskClosable={false}
                closeIcon={null}
                zIndex={2050}
                open={this.state.open}
            >
                <Space direction="vertical" size="middle" style={{width: '100%', padding: 15}}>
                        <Button
                            type="primary" disabled={!ava} style={{ width: '100%' }} size="large"
                            onClick={() => this.onClick('new')}
                        >
                            New Project
                        </Button>
                        <Button type="primary" disabled={!ava} style={{ width: '100%' }} size="large"
                                onClick={() => this.onClick('open')}
                        >
                            Open Exist
                        </Button>
                        <Divider />
                        <Button type="primary" style={{ width: '100%' }} size="large"
                                onClick={() => this.onClick('use')}
                        >
                            Temporary Use
                        </Button>
                </Space>
            </Modal>
        );
    }
}

export default ModeModal;