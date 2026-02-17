import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Table, Drawer, Button, Space } from "antd";
import CodeMirror from '@uiw/react-codemirror';
import { message } from "@/utils/app";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";
import { cpp } from '@codemirror/lang-cpp';

import { saveText, saveBlob, code2zip } from "@/utils/utils";

type CodeEntry = { h?: string; c?: string };
type CodeMap = Record<string, CodeEntry>;
type DownloadPanelProps = {
    code: CodeMap;
    getUiBase: () => Promise<CodeMap>;
};
type DownloadPanelRef = { downloadChecked: () => Promise<void> };
type DownloadRow = { file: string; key: string; h?: boolean; c?: boolean };

function getSuffix(obj: CodeEntry) {
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
    if (!element) {
        return false;
    }
    const styles = getComputedStyle(element);
    const textColor = styles.getPropertyValue('--ant-color-text-base');
    return textColor === '#fff';
}

const DownloadPanel = forwardRef<DownloadPanelRef, DownloadPanelProps>((props, ref) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState('')
    const checked = useRef<string[]>([])

    useImperativeHandle(ref, () => ({
        downloadChecked: async () => {
            if (checked.current.length === 0) {
                message.error('Please select at least one file.')
                return
            }
            const files: Record<string, CodeEntry> = {}
            const code: Record<string, CodeEntry> = {...props.code, ...(await props.getUiBase())}
            for (let key of checked.current) {
                files[key] = code[key]
            }
            code2zip(files).then(zip => {
                saveBlob(zip, 'codes.zip')
            })
        }
    }))

    const review = (key: string, suffix: 'h' | 'c') => {
        setPreview(props.code[key][suffix] ?? null)
        setFileName(`${key}.${suffix}`)
    }

    const download = (key: string, suffix: 'h' | 'c') => {
        const content = props.code[key][suffix]
        if (!content) {
            return
        }
        saveText(content, `${key}.${suffix}`)
        console.log(content)
    }

    const data: DownloadRow[] = [{file: 'ui base .h and .c', key: '_base'}]
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
            <h3 style={{color: 'var(--ant-color-text)', marginBottom: 20, marginTop: 0}}>Download Data</h3>
            <div style={{paddingBottom: 36, height: 'calc(100% - 50px)'}} className="card-body">
                <Table
                    columns={[
                        {title: 'File', dataIndex: 'file', key: 'file'},
                        {
                            title: 'Preview', dataIndex: 'key', key: 'preview',
                            render: (key: string, item: DownloadRow) => (
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
                            render: (key: string, item: DownloadRow) => {
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
                            let selectedRowKeys: React.Key[] = [..._selectedRowKeys]
                            if (selectedRowKeys.includes('_base')) {
                                selectedRowKeys = selectedRowKeys.filter(key => key !== '_base');
                                selectedRowKeys.push('ui_types');
                                selectedRowKeys.push('ui_interface');
                            }
                            checked.current = selectedRowKeys.map(String)
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
                getContainer={() => document.getElementById('content-in') ?? document.body}
                rootStyle={{inset: '25px 0 0 0'}}
            >
                <div style={{height: 'calc(100% - 30px)', overflow: 'auto'}}>
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
