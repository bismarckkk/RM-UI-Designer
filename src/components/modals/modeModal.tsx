import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { Button, Divider, Modal, Space } from "antd";
import { isAvailable } from "@/utils/autoSaver";

const ModeModal = forwardRef((props, ref: any) => {
    const [open, setOpen] = useState(false)
    const promiseRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
        open: () => {
            return new Promise((resolve, reject) => {
                setOpen(true)
                if (promiseRef.current) {
                    promiseRef.current.reject()
                }
                promiseRef.current = {resolve, reject}
            })
        }
    }))

    const onClick = (mode: string) => {
        setOpen(false)
        promiseRef.current.resolve(mode)
        promiseRef.current = null
    }

    const ava = isAvailable()
    return (
        <Modal
            footer={null}
            maskClosable={false}
            closeIcon={null}
            zIndex={2050}
            open={open}
        >
            <Space direction="vertical" size="middle" style={{width: '100%', padding: 15}}>
                    <Button
                        type="primary" disabled={!ava} style={{ width: '100%' }} size="large"
                        onClick={() => onClick('new')}
                    >
                        New Project
                    </Button>
                    <Button type="primary" disabled={!ava} style={{ width: '100%' }} size="large"
                            onClick={() => onClick('open')}
                    >
                        Open Exist
                    </Button>
                    <Divider />
                    <Button type="primary" style={{ width: '100%' }} size="large"
                            onClick={() => onClick('use')}
                    >
                        Temporary Use
                    </Button>
            </Space>
        </Modal>
    );
});

export default ModeModal;
