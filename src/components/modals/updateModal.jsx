import React, {Component} from 'react';
import { Modal, Button, Space, Spin, Result } from "antd";

import updater from "@/utils/update"
import {message} from "@/utils/app";
import Markdown from "react-markdown";
const { checkUpdate, installUpdate, relaunch } = updater

class UpdateModal extends Component {
    state = { step: 0, content: '' }
    handleClose() {
        this.setState({step: 0})
    }

    async handleOk() {
        try {
            this.setState({step: 2})
            await installUpdate()
            if (!await relaunch()) {
                this.setState({step: 3})
            }
        } catch (_) {
            this.setState({step: -1})
        }
    }

    check() {
        let regex_pr = /(https:\/\/github\.com\/bismarckkk\/RM-UI-Designer\/pull\/)(\d+)/g;
        let regex_cl = /(https:\/\/github\.com\/bismarckkk\/RM-UI-Designer\/compare\/)(v\d+\.\d+\.\d+\.\.\.v\d+\.\d+\.\d+)/g;
        (async () => {
            try {
                const { shouldUpdate, manifest: { body } } = await checkUpdate()
                if (shouldUpdate) {
                    this.setState({
                        step: 1,
                        content: body.replace(regex_pr, (match, p1, p2) => {
                            return `[#${p2}](${p1}${p2})`;
                        }).replace(regex_cl, (match, p1, p2) => {
                            return `[#${p2}](${p1}${p2})`;
                        })
                    })
                }
            } catch (e) {
                message.warning('Failed to check update.')
            }
        })()
    }

    componentDidMount() {
        this.check()
    }

    render() {
        let content = <div />
        if (this.state.step === -1) {
            content = <Result
                status="error"
                title="Update Failed"
            />
        } else if (this.state.step === 1) {
            content = <Markdown
                components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" />
                }}
            >
                {this.state.content}
            </Markdown>
        } else if (this.state.step === 2) {
            content = <div style={{padding: 40, textAlign: 'center', color: 'var(--ant-color-text)'}}>
                <Space direction="vertical">
                    <Spin size="large"/>
                    <h3>Updating...</h3>
                </Space>
            </div>
        } else if (this.state.step === 3) {
            content = <Result
                status="success"
                title="Update Success"
                subTitle="Please restart the app to apply the update."
            />
        }
        return (
            <Modal
                title="Auto Update"
                open={this.state.step}
                closable={this.state.step > 1}
                maskClosable={this.state.step > 1}
                footer={
                    this.state.step > 1 ? null : <Space>
                    <Button onClick={this.handleClose.bind(this)}>Cancel</Button>
                        <Button type="primary" onClick={this.handleOk.bind(this)}>Update</Button>
                    </Space>
                }
            >
                { content }
            </Modal>
        );
    }
}

export default UpdateModal;