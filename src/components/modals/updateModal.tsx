import React, {useEffect, useState} from 'react';
import { Modal, Button, Space, Spin, Result } from "antd";

import updater from "@/utils/update"
import {message} from "@/utils/app";
import {isTauri, isNightly} from "@/utils/utils";
import Markdown from "react-markdown";
const { checkUpdate, installUpdate, relaunch } = updater

const UpdateModal = () => {
    const [step, setStep] = useState(0)
    const [content, setContent] = useState('')
    const [version, setVersion] = useState('')
    const handleClose = () => {
        setStep(0)
    }

    const handleOk = async () => {
        try {
            setStep(2)
            await installUpdate()
            if (!isTauri() || !await relaunch()) {
                setStep(3)
            }
        } catch (_) {
            setStep(-1)
        }
    }

    const check = () => {
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
                            setStep(2);
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
                        setStep(1)
                        setContent(manifest.body.replace(regex_pr, (match, p1, p2) => {
                            return `[#${p2}](${p1}${p2})`;
                        }).replace(regex_cl, (match, p1, p2) => {
                            return `[#${p2}](${p1}${p2})`;
                        }))
                        setVersion(manifest.version)
                    }
                } catch (e) {
                    message.warning('Failed to check update.')
                }
            })()
        }
    }

    const ignore = () => {
        localStorage.setItem('version_ignored', version)
        handleClose()
    }

    useEffect(() => {
        check()
    }, [])

    let modalContent = <div />
    if (step === -1) {
        modalContent = <Result
                status="error"
                title="Update Failed"
            />
    } else if (step === 1) {
        modalContent = <Markdown
                components={{
                    a: ({node, ...rest}) => <a {...rest} target="_blank" />
                }}
            >
                {content}
            </Markdown>
    } else if (step === 2) {
        modalContent = <div style={{padding: 40, textAlign: 'center', color: 'var(--ant-color-text)'}}>
                <Space direction="vertical">
                    <Spin size="large"/>
                    <h3>Updating...</h3>
                </Space>
            </div>
    } else if (step === 3) {
        modalContent = <Result
                status="success"
                title="Update Success"
                subTitle="Please restart the app to apply the update."
            />
    }
    return (
        <Modal
            title="Auto Update"
            open={!!step}
            closable={step > 1}
            maskClosable={step > 1}
            zIndex={2100}
            footer={
                step === 1 ? <Space>
                    <Button onClick={ignore}>Ignore</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="primary" onClick={handleOk}>Update</Button>
                </Space> : null
            }
        >
            { modalContent }
        </Modal>
    );
}

export default UpdateModal;
