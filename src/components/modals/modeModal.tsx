import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { Button, Divider, Modal, Space } from "antd";
import { isAvailable } from "@/utils/autoSaver";

type Deferred<T> = {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};

export type ModeModalRef = { open: () => Promise<string> };

const ModeModal = forwardRef<ModeModalRef>((_props, ref) => {
    const [open, setOpen] = useState(false)
    const promiseRef = useRef<Deferred<string> | null>(null)

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
        promiseRef.current?.resolve(mode)
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
            <Space direction="vertical" size="middle" style={{width: 'calc(100% - 30px)', padding: 15}}>
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
