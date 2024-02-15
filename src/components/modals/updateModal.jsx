import React, {Component} from 'react';
import {Divider, Modal, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import { dialog, fs } from '@tauri-apps/api';
import { isTauri } from "@/utils/utils";

const { Dragger } = Upload;

class UpdateModal extends Component {
    state = {show: false, promise: null, title: '', accept: ''}

    onCancel() {
        this.setState({show: false})
        this.state.promise.reject()
    }

    onUpload(e) {
        const {promise} = this.state
        promise.resolve(e)
        this.setState({show: false})
    }

    upload(title, accept) {
        if (isTauri()) {
            let _accept = [accept.slice(1)]
            let _acceptType = `${_accept} file`
            if (accept === 'image/*') {
                _accept = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg']
                _acceptType = 'image'
            }
            return new Promise((resolve, reject) => {
                (async ()=> {
                    const path = await dialog.open({
                        multiple: false,
                        directory: false,
                        filters: [{ name: _acceptType, extensions: _accept }]
                    })
                    if (path !== null && path.length > 0) {
                        const _path = path.replace(/\\/g, '/')
                        const fileName = _path.split('/').pop()
                        const blob = new Blob([await fs.readBinaryFile(path)]);
                        const file = new File([blob], fileName);
                        resolve(file)
                    } else {
                        reject();
                    }
                })()
            })
        } else {
            return new Promise((resolve, reject) => {
                this.setState({show: true, promise: {resolve, reject}, title, accept})
            })
        }
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