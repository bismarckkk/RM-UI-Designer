import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Empty, Tag, Drawer, Divider, Popover, Flex, Space, Button} from "antd";
import {ProDescriptions} from "@ant-design/pro-components";
import {getHeader, getEvent} from "@/utils/serial/msgView";
import {getColumnsFromData} from "@/utils/columns";
import {saveText, uploadFile} from "@/utils/utils";
import type { objectType } from "@/utils/serial/msgView";

type RxHistory = { rx: number; log: Uint8Array[]; start: number };
type RxDrawerRef = { show: (data: Omit<RxHistory, 'start'>) => void };
type LayerLikeObject = { _start?: number; _end?: number; [key: string]: unknown };

const RxDrawer = forwardRef<RxDrawerRef>((_props, ref) => {
    const [show, setShow] = useState(false)
    const [history, setHistory] = useState<RxHistory>({rx: 0, log: [], start: -1})

    useImperativeHandle(ref, () => ({
        show: (data) => {
            setShow(true)
            setHistory({...data, start: -1})
        }
    }))

    const save = () => {
        let res = ''
        for (const chunk of history.log) {
            for (const byte of chunk) {
                res += byte.toString(16).padStart(2, '0').toUpperCase() + ' '
            }
            res = res.slice(0, -1) + '\n'
        }
        res = res.slice(0, -1)
        saveText(res, 'rx.log')
    }

    const load = async () => {
        const file = await uploadFile('.log')
        const reader = new FileReader()
        reader.onload = () => {
            const data = reader.result
            if (typeof data !== 'string') {
                return
            }
            const log = data.split('\n')
            let rx = 0
            const res: Uint8Array[] = []
            for (const line of log) {
                const chunk: number[] = []
                const bytes = line.split(' ')
                for (const byte of bytes) {
                    const parsed = parseInt(byte, 16)
                    if (!Number.isNaN(parsed)) {
                        chunk.push(parsed)
                    }
                }
                res.push(new Uint8Array(chunk))
                rx += chunk.length
            }
            setHistory({rx, log: res, start: -1})
        }
        if (file instanceof Blob) {
            reader.readAsText(file)
        }
    }

    let res: React.ReactNode;
        if (history.log.length === 0) {
            res = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No log yet."/>
        } else {
            const nodes: React.ReactNode[] = []
            let idx = 0;
            const createTag = (item: string, _idx: number) => {
                if (item === 'A5') {
                    return <Tag
                        key={_idx}
                        color="blue"
                        onClick={() => setHistory({...history, start: _idx})}
                    >
                        {item}
                    </Tag>
                } else {
                    return <Tag key={_idx}>{item}</Tag>
                }
            }
            for (let cid = 0; cid < history.log.length; cid++) {
                const chunk = history.log[cid]
                if (idx > history.start || idx + chunk.length < history.start) {
                    nodes.push(<Divider key={cid}/> )
                    nodes.push(...Array.from(chunk).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                        item => {
                            const rr = createTag(item, idx);
                            idx += 1;
                            return rr;
                        }
                    ))
                } else {
                    nodes.push(<Divider key={`${cid}-prefix`}/> )
                    const suffixLen = history.start - idx;
                    const prefix = Array.from(chunk.slice(0, suffixLen))
                    nodes.push(...Array.from(prefix).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                        item => {
                            const rr = createTag(item, idx);
                            idx += 1;
                            return rr;
                        }
                    ))
                    nodes.push(<Divider key={`${cid}-msg`}/> )

                    const maybeMsg = [...chunk.slice(suffixLen)]
                    const startLoc = [0]
                    for (let j = cid + 1; j < history.log.length; j++) {
                        startLoc.push(maybeMsg.length)
                        maybeMsg.push(...Array.from(history.log[j]))
                    }

                    const addSuffix = (msgLength: number) => {
                        nodes.push(<Divider key={`${cid}-suffix`}/> )
                        let addCid;
                        for (addCid = 0; addCid < startLoc.length; addCid++) {
                            if (addCid === 0) {
                                if (history.log[addCid + cid].length - suffixLen > msgLength) {
                                    const chunk = history.log[addCid + cid]
                                    nodes.push(...Array.from(chunk.slice(msgLength + suffixLen)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                        item => {
                                            const rr = createTag(item, idx);
                                            idx += 1;
                                            return rr;
                                        }
                                    ))
                                    break;
                                }
                            } else if (startLoc[addCid] + history.log[addCid + cid].length > msgLength) {
                                const chunk = history.log[addCid + cid]
                                nodes.push(...Array.from(chunk.slice(msgLength - startLoc[addCid])).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                    item => {
                                        const rr = createTag(item, idx);
                                        idx += 1;
                                        return rr;
                                    }
                                ))
                                break;
                            }
                        }
                        cid += addCid
                    }

                    const renderPopContent = (msg: Uint8Array | React.ReactNode[], color: string, info: object, title: string) => {
                        return <Popover
                            title={title}
                            content={
                                <ProDescriptions
                                    dataSource={info as Record<string, unknown>}
                                    columns={getColumnsFromData(info as Record<string, unknown>)}
                                    key={`${idx}-${title}`}
                                    editable={undefined}
                                    column={1}
                                    style={{width: 250}}
                                />
                            }
                            destroyTooltipOnHide={true}
                        >
                            {
                                color !== 'Object' ?
                                    Array.from(msg as Uint8Array).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                            item => {
                                            const rr = createTag2(item, idx, color);
                                            idx += 1;
                                            return rr;
                                        }
                                    ) :
                                    msg
                            }
                        </Popover>
                    }

                    const renderContent = (_msg: number[]) => {
                        const msg = getEvent(Uint8Array.from(_msg))
                        if (msg.events.length > 0) {
                            const res = [renderPopContent(_msg.slice(0, 6), 'purple', msg, 'Info')]
                            let color = "geekblue";
                            for (const event of msg.events) {
                                const eventObj = (event.obj ?? {}) as LayerLikeObject
                                const start = eventObj._start ?? 0
                                const end = eventObj._end ?? _msg.length
                                res.push(renderPopContent(_msg.slice(start, end), color, {operation: event.type, ...eventObj}, 'Object'))
                                if (color === "geekblue") {
                                    color = "cyan";
                                } else {
                                    color = "geekblue";
                                }
                            }
                            return res;
                        } else {
                            const res = [renderPopContent(_msg.slice(0, 2), 'geekblue', {
                                error: 'Wrong sub cmd id',
                                sub_id: msg.sub_id
                            }, 'Error')]
                            res.push(...Array.from(_msg.slice(2)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                item => {
                                    const rr = createTag2(item, idx, 'orange');
                                    idx += 1;
                                    return rr;
                                }
                            ))
                            return res;
                        }
                    }

                    const headerRes = getHeader(Uint8Array.from(maybeMsg))
                    console.log(headerRes)
                    const createTag2 = (item: string, key: number, color: string) => {
                        return <Tag key={key} color={color}>{item}</Tag>
                    }
                    if (headerRes.code === 0) {
                        const header = headerRes.header
                        nodes.push(renderPopContent(maybeMsg.slice(0, 7), 'green', header ?? {}, 'Header'))
                        nodes.push(...renderContent(maybeMsg.slice(7, (header?.length ?? 0) + 7)))
                        nodes.push(...Array.from(maybeMsg.slice((header?.length ?? 0) + 7, (header?.length ?? 0) + 9)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                            item => {
                                const rr = createTag2(item, idx, 'green');
                                idx += 1;
                                return rr;
                            }
                        ))
                        addSuffix((header?.length ?? 0) + 9)
                    } else if (headerRes.code <= 2) {
                        nodes.push(renderPopContent(maybeMsg.slice(0, 1), 'red', headerRes, 'Error'))
                        addSuffix(1)
                    } else if (headerRes.code <= 6) {
                        nodes.push(renderPopContent(Array.from(maybeMsg.slice(0, 5)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                            (item, _idx) => {
                                let color = 'green';
                                if (headerRes.loc?.includes(_idx)) {
                                    color = 'red'
                                }
                                let rr = createTag2(item, idx, color);
                                idx += 1;
                                return rr;
                            }
                        ), "Object", headerRes, 'Error'))
                        addSuffix(5)
                    } else if (headerRes.code <= 7) {
                        if (!headerRes.loc || headerRes.loc.length < 2) {
                            continue
                        }
                        nodes.push(renderPopContent(maybeMsg.slice(0, 7), 'green', headerRes.header ?? {}, 'Header'))
                        nodes.push(...renderContent(maybeMsg.slice(7, headerRes.loc[0])))
                        nodes.push(renderPopContent(maybeMsg.slice(headerRes.loc[0], headerRes.loc[1] + 1), 'red', headerRes, 'Error'))
                        addSuffix(headerRes.loc[1] + 1)
                    }
                }
            }
            res = nodes
        }

    return (
            <Drawer
                title="Serial Rx History"
                placement="right"
                onClose={() => setShow(false)}
                open={show}
                size="large"
                getContainer={() => document.getElementById('content-in') ?? document.body}
                rootStyle={{inset: '25px 0 0 0'}}
                style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
            >
                <div style={{
                    width: '100%',
                    height: 'calc(100% - 30px)',
                }}>
                    <div style={{color: 'var(--ant-color-text)', height: '100%'}}>
                        <Flex justify="space-between" align="center">
                            <p style={{margin: 6}}>
                                RX: {history.rx},&nbsp;&nbsp;
                                This is not a real-time display, close and reopen to refresh.
                            </p>
                            <Space>
                                <Button size="small" type="primary" onClick={() => save()}>
                                    Save
                                </Button>
                                <Button size="small" onClick={() => load()}>
                                    load
                                </Button>
                            </Space>
                        </Flex>
                        <div style={{paddingBottom: 10}} className="card-body">
                            {res}
                        </div>
                    </div>
                </div>
            </Drawer>
        );
});

export default RxDrawer;
