import React, {Component} from 'react';
import {Table, Drawer, Button, Space} from "antd";
import CodeMirror from '@uiw/react-codemirror';
import {xcodeLight, xcodeDark} from "@uiw/codemirror-theme-xcode";
import {cpp} from '@codemirror/lang-cpp';

import { saveText, saveBlob, code2zip } from "@/utils/utils";
import { getUiBase } from "@/utils/generator/template";

function getSuffix(obj) {
    let res = ''
    if (obj.h) {
        res += '.h'
    }
    if (obj.h && obj.c) {
        res += ' and '
    }
    if (obj.c) {
        res += '.c'
    }
    return res
}

function isDarkMode() {
    const element = document.querySelector('.rmui');
    const styles = getComputedStyle(element);
    const textColor = styles.getPropertyValue('--ant-color-text-base');
    return textColor === '#fff';
}

class DownloadPanel extends Component {
    state = {preview: null, fileName: ''}
    checked = []

    review(key, suffix) {
        this.setState({preview: this.props.code[key][suffix], fileName: `${key}.${suffix}`})
    }

    download(key, suffix) {
        saveText(this.props.code[key][suffix], `${key}.${suffix}`)
        console.log(this.props.code[key][suffix])
    }

    downloadChecked() {
        let files = {}
        let code = {...this.props.code, ...getUiBase()}
        for (let key of this.checked) {
            files[key] = code[key]
        }
        code2zip(files).then(zip => {
            saveBlob(zip, 'codes.zip')
        })
    }

    render() {
        let data = [{file: 'ui base .h and .c', key: '_base'}]
        for (let code in this.props.code) {
            data.push({
                file: `${code} ${getSuffix(this.props.code[code])}`,
                key: code,
                h: this.props.code[code].h !== undefined,
                c: this.props.code[code].c !== undefined
            })
        }

        return (
            <div className="full" style={{overflow: 'hidden'}}>
                <h3 style={{color: 'var(--ant-color-text)', marginBottom: 20}}>Download Data</h3>
                <div style={{height: '100%', paddingBottom: 36, overflow: 'auto'}}>
                    <Table
                        columns={[
                            {title: 'File', dataIndex: 'file', key: 'file'},
                            {
                                title: 'Preview', dataIndex: 'key', key: 'preview',
                                render: (key, item) => (
                                    <Space>
                                        {item.h && <Button type="link" onClick={() => {
                                            this.review(key, 'h')
                                        }}>Preview .h</Button>}
                                        {item.c && <Button type="link" onClick={() => {
                                            this.review(key, 'c')
                                        }}>Preview .c</Button>}
                                    </Space>
                                )
                            }, {
                                title: 'Download', dataIndex: 'key', key: 'download',
                                render: (key, item) => {
                                    if (key !== '_base') {
                                        return (
                                            <Space>
                                                {item.h && <Button type="link" onClick={() => {
                                                    this.download(key, 'h')
                                                }}>Download .h</Button>}
                                                {item.c && <Button type="link" onClick={() => {
                                                    this.download(key, 'c')
                                                }}>Download .c</Button>}
                                            </Space>
                                        )
                                    } else {
                                        return <Button type="link" onClick={async () => {
                                            const code = await getUiBase()
                                            const zip = await code2zip(code)
                                            saveBlob(zip, 'ui_base.zip')
                                        }}>Download .zip</Button>

                                    }
                                }
                            }
                        ]}
                        dataSource={data}
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (_selectedRowKeys) => {
                                let selectedRowKeys = [..._selectedRowKeys]
                                if (selectedRowKeys.includes('_base')) {
                                    selectedRowKeys = selectedRowKeys.filter(key => key !== '_base');
                                    selectedRowKeys.push('ui_types');
                                    selectedRowKeys.push('ui_interface');
                                }
                                this.checked = selectedRowKeys
                            },
                            getCheckboxProps: (record) => ({
                                name: record.key,
                            })
                        }}
                        pagination={false}
                    />
                </div>
                <Drawer
                    onClose={() => this.setState({preview: null})}
                    open={this.state.preview !== null}
                    title={this.state.fileName}
                    size="large"
                    getContainer={document.getElementById('content-in')}
                    rootStyle={{indent: '25px'}}
                >
                    <div style={{height: '100%', overflow: 'auto'}}>
                        <CodeMirror
                            value={this.state.preview || ''}
                            theme={isDarkMode() ? xcodeDark : xcodeLight}
                            extensions={[cpp()]}
                        />
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default DownloadPanel;