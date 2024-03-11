import React, {Component} from 'react';
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";

const baudRate = [
    1152000, 1000000, 921600, 576000, 500000, 460800, 230400, 115200, 74800, 57600, 38400, 19200, 9600, 4800
]

class SerialModal extends Component {
    state = { open: false, defaultOptions: {} }
    promise = null

    getOptions(defaultOptions) {
        return new Promise((resolve, reject) => {
            this.setState({open: true, defaultOptions})
            if (this.promise) {
                this.promise.reject()
            }
            this.promise = { resolve, reject }
        })
    }

    async onFinish(e) {
        this.promise.resolve(e)
        this.promise = null
        return true
    }

    render() {
        return (
            <ModalForm
                title="Serial"
                width={400}
                open={this.state.open}
                onOpenChange={open => this.setState({open})}
                onFinish={async e => await this.onFinish(e)}
            >
                <ProFormSelect
                    name="baudRate"
                    label="Baud Rate"
                    width="sm"
                    initialValue={this.state.defaultOptions.baudRate}
                    options={baudRate.map(e => ({value: e, label: e.toString()}))}
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="dataBits"
                    label="Data Bits"
                    width="sm"
                    initialValue={this.state.defaultOptions.dataBits}
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
                    initialValue={this.state.defaultOptions.stopBits}
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
                    initialValue={this.state.defaultOptions.parity}
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
                    initialValue={this.state.defaultOptions.flowControl}
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'hardware', label: 'Hardware' },
                    ]}
                    rules={[{ required: true }]}
                />
            </ModalForm>
        );
    }
}

export default SerialModal;