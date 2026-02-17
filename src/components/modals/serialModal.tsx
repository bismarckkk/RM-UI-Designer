import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";

const baudRate = [
    1152000, 1000000, 921600, 576000, 500000, 460800, 230400, 115200, 74800, 57600, 38400, 19200, 9600, 4800
]

type Deferred<T> = {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};

export type SerialOptions = {
    baudRate: number;
    dataBits: number;
    stopBits: number;
    parity: string;
    flowControl: string;
};

export type SerialModalRef = { getOptions: (defaultOptions: SerialOptions) => Promise<SerialOptions> };

const SerialModal = forwardRef<SerialModalRef>((_props, ref) => {
    const [open, setOpen] = useState(false)
    const [defaultOptions, setDefaultOptions] = useState<SerialOptions>({
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
    })
    const promiseRef = useRef<Deferred<SerialOptions> | null>(null)

    useImperativeHandle(ref, () => ({
        getOptions: (_defaultOptions: SerialOptions) => {
            return new Promise((resolve, reject) => {
                setOpen(true)
                setDefaultOptions(_defaultOptions)
                if (promiseRef.current) {
                    promiseRef.current.reject()
                }
                promiseRef.current = { resolve, reject }
            })
        }
    }))

    return (
        <ModalForm
            title="Serial"
            width={400}
            open={open}
            onOpenChange={setOpen}
            onFinish={async (e: SerialOptions) => {
                promiseRef.current?.resolve(e)
                promiseRef.current = null
                return true
            }}
        >
                <ProFormSelect
                    name="baudRate"
                    label="Baud Rate"
                    width="sm"
                    initialValue={defaultOptions.baudRate}
                    options={baudRate.map(e => ({value: e, label: e.toString()}))}
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="dataBits"
                    label="Data Bits"
                    width="sm"
                    initialValue={defaultOptions.dataBits}
                    options={[
                        { value: 8, label: '8' },
                        { value: 7, label: '7' },
                    ]}
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="stopBits"
                    label="Stop Bits"
                    width="sm"
                    initialValue={defaultOptions.stopBits}
                    options={[
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                    ]}
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="parity"
                    label="Parity"
                    width="sm"
                    initialValue={defaultOptions.parity}
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'even', label: 'Even' },
                        { value: 'odd', label: 'Odd' },
                    ]}
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="flowControl"
                    label="Flow Control"
                    width="sm"
                    initialValue={defaultOptions.flowControl}
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'hardware', label: 'Hardware' },
                    ]}
                    rules={[{ required: true }]}
                />
        </ModalForm>
    );
});

export default SerialModal;
