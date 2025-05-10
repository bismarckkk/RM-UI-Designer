import React, {Component} from 'react';
import { Modal, Button, Space, Spin, Result } from "antd";

import updater from "@/utils/update"
import {message} from "@/utils/app";
import {isTauri, isNightly} from "@/utils/utils";
import Markdown from "react-markdown";
const { checkUpdate, installUpdate, relaunch } = updater

class UpdateModal extends Component {
    state = { step: 0, content: '', version: '' }
    handleClose() {
        this.setState({step: 0})
    }

    async handleOk() {
        try {
            this.setState({step: 2})
            await installUpdate()
            if (!isTauri() || !await relaunch()) {
                this.setState({step: 3})
            }
        } catch (_) {
            this.setState({step: -1})
        }
    }

    check() {
        if (process.env.VERSION === 'development') {

        } else if (isNightly()) {
            if (!isTauri()) {
                (async () => {
                    try {
                        const response = await fetch(`/nightly/version?timestamp=${new Date().getTime()}`);
                        if (response.status === 404) {
                            message.error("There is no nightly version now.");
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 2000)
                            return;
                        }
                        const version = await response.text();
                        if (version.trim().slice(0, 7) !== process.env.VERSION.slice(8)) {
                            this.setState({ step: 2 });
                            setTimeout(async () => {
                                const response = await fetch(`/nightly/version?timestamp=${new Date().getTime()}`);
                                const newVersion = await response.text();
                                if (newVersion.trim() === 'no') {
                                    window.location.href = '/';
                                } else {
                                    window.location.reload();
                                }
                            }, 3000);
                        }
                    } catch (e) {
                        message.warning('Failed to check nightly version.');
                    }
                })();
            }
        } else {
            let regex_pr = /(https:\/\/github\.com\/bismarckkk\/RM-UI-Designer\/pull\/)(\d+)/g;
            let regex_cl = /(https:\/\/github\.com\/bismarckkk\/RM-UI-Designer\/compare\/)(v\d+\.\d+\.\d+\.\.\.v\d+\.\d+\.\d+)/g;
            (async () => {
                try {
                    const { shouldUpdate, manifest } = await checkUpdate()
                    if (shouldUpdate) {
                        this.setState({
                            step: 1,
                            content: manifest.body.replace(regex_pr, (match, p1, p2) => {
                                return `[#${p2}](${p1}${p2})`;
                            }).replace(regex_cl, (match, p1, p2) => {
                                return `[#${p2}](${p1}${p2})`;
                            }),
                            version: manifest.version
                        })
                    }
                } catch (e) {
                    message.warning('Failed to check update.')
                }
            })()
        }
    }

    ignore() {
        localStorage.setItem('version_ignored', this.state.version)
        this.handleClose()
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
                zIndex={2100}
                footer={
                    this.state.step === 1 ? <Space>
                        <Button onClick={this.ignore.bind(this)}>Ignore</Button>
                        <Button onClick={this.handleClose.bind(this)}>Cancel</Button>
                        <Button type="primary" onClick={this.handleOk.bind(this)}>Update</Button>
                    </Space> : null
                }
            >
                { content }
            </Modal>
        );
    }
}

export default UpdateModal;