import React, {Component} from 'react';
import { ModalForm, ProFormText } from "@ant-design/pro-components";

class FormModal extends Component {
    state = {title: '', open: false, frames: []}
    promise = null

    open(title, frames) {
        return new Promise((resolve, reject) => {
            this.setState({title, open: true, frames})
            this.promise = {resolve, reject}
        })
    }

    render() {
        return (
            <ModalForm
                title={this.state.title}
                autoFocusFirstInput
                width={240}
                open={this.state.open}
                onOpenChange={(e)=>{
                    if (this.promise && !e && this.state.open) {
                        this.promise.reject()
                    }
                    this.setState({open: e})
                }}
                onFinish={async (e)=>{
                    this.promise.resolve(e.frame)
                    this.promise = null
                    return true
                }}
            >
                <ProFormText
                    name="frame"
                    label="New Frame Name"
                    width="sm"
                    rules={[
                        { required: true, message: 'Please input frame name!' },
                        ({ getFieldValue }) => {
                            const that = this
                            return {
                                validator: (_, __)=>{
                                    {
                                        let ok = true
                                        const frame = getFieldValue('frame')
                                        for (const it of that.state.frames) {
                                            if (it === frame) {
                                                ok = false
                                                break
                                            }
                                        }
                                        if (ok) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Cannot create same name frame!'));
                                    }
                                }
                            }
                        }
                    ]}
                />
            </ModalForm>
        );
    }
}

export default FormModal;