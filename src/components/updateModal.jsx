import React, {Component} from 'react';
import {Divider, Modal, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";

const { Dragger } = Upload;

class UpdateModal extends Component {
    state = {show: false, promise: null, title: '', accept: ''}

    onCancel() {
        this.setState({show: false})
    }

    onUpload(e) {
        const {promise} = this.state
        promise.resolve(e)
        this.setState({show: false})
    }

    upload(title, accept) {
        return new Promise((resolve, reject) => {
            this.setState({show: true, promise: {resolve, reject}, title, accept})
        })
    }

    render() {
        return (
            <div>
                <Modal
                    title={this.state.title}
                    open={this.state.show}
                    onCancel={()=>this.onCancel()}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Divider />
                    <Dragger
                        showUploadList={false}
                        beforeUpload={e=>this.onUpload(e)}
                        accept={this.state.accept}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Dragger>
                </Modal>
            </div>
        );
    }
}

export default UpdateModal;