import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";

const baudRate = [
    1152000, 1000000, 921600, 576000, 500000, 460800, 230400, 115200, 74800, 57600, 38400, 19200, 9600, 4800
]

const SerialModal = forwardRef((props, ref: any) => {
    const [open, setOpen] = useState(false)
    const [defaultOptions, setDefaultOptions] = useState<any>({})
    const promiseRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
        getOptions: (_defaultOptions: any) => {
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
            onFinish={async e => {
                promiseRef.current.resolve(e)
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
