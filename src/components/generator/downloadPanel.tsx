import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Table, Drawer, Button, Space } from "antd";
import CodeMirror from '@uiw/react-codemirror';
import { message } from "@/utils/app";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";
import { cpp } from '@codemirror/lang-cpp';

import { saveText, saveBlob, code2zip } from "@/utils/utils";

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

const DownloadPanel = forwardRef((props: any, ref: any) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState('')
    const checked = useRef<string[]>([])

    useImperativeHandle(ref, () => ({
        downloadChecked: async () => {
            if (checked.current.length === 0) {
                message.error('Please select at least one file.')
                return
            }
            let files = {}
            let code = {...props.code, ...(await props.getUiBase())}
            for (let key of checked.current) {
                files[key] = code[key]
            }
            code2zip(files).then(zip => {
                saveBlob(zip, 'codes.zip')
            })
        }
    }))

    const review = (key: string, suffix: 'h' | 'c') => {
        setPreview(props.code[key][suffix])
        setFileName(`${key}.${suffix}`)
    }

    const download = (key: string, suffix: 'h' | 'c') => {
        saveText(props.code[key][suffix], `${key}.${suffix}`)
        console.log(props.code[key][suffix])
    }

    let data: any[] = [{file: 'ui base .h and .c', key: '_base'}]
    for (let code in props.code) {
        data.push({
            file: `${code} ${getSuffix(props.code[code])}`,
            key: code,
            h: props.code[code].h !== undefined,
            c: props.code[code].c !== undefined
        })
    }

    return (
        <div className="full" style={{overflow: 'hidden'}}>
            <h3 style={{color: 'var(--ant-color-text)', marginBottom: 20}}>Download Data</h3>
            <div style={{paddingBottom: 36}} className="card-body">
                <Table
                    columns={[
                        {title: 'File', dataIndex: 'file', key: 'file'},
                        {
                            title: 'Preview', dataIndex: 'key', key: 'preview',
                            render: (key, item) => (
                                <Space>
                                    {item.h && <Button type="link" onClick={() => {
                                        review(key, 'h')
                                    }}>Preview .h</Button>}
                                    {item.c && <Button type="link" onClick={() => {
                                        review(key, 'c')
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
                                                download(key, 'h')
                                            }}>Download .h</Button>}
                                            {item.c && <Button type="link" onClick={() => {
                                                download(key, 'c')
                                            }}>Download .c</Button>}
                                        </Space>
                                    )
                                } else {
                                    return <Button type="link" onClick={async () => {
                                        const code = await props.getUiBase()
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
                            let selectedRowKeys: any[] = [..._selectedRowKeys]
                            if (selectedRowKeys.includes('_base')) {
                                selectedRowKeys = selectedRowKeys.filter(key => key !== '_base');
                                selectedRowKeys.push('ui_types');
                                selectedRowKeys.push('ui_interface');
                            }
                            checked.current = selectedRowKeys as string[]
                        },
                        getCheckboxProps: (record) => ({
                            name: record.key,
                        })
                    }}
                    pagination={false}
                />
            </div>
            <Drawer
                onClose={() => setPreview(null)}
                open={preview !== null}
                title={fileName}
                size="large"
                getContainer={document.getElementById('content-in')}
                rootStyle={{inset: '25px 0 0 0'}}
            >
                <div style={{height: '100%', overflow: 'auto'}}>
                    <CodeMirror
                        value={preview || ''}
                        theme={isDarkMode() ? xcodeDark : xcodeLight}
                        extensions={[cpp()]}
                        onContextMenu={(event) => {
                            event.stopPropagation()
                        }}
                    />
                </div>
            </Drawer>
        </div>
    );
});

export default DownloadPanel;
