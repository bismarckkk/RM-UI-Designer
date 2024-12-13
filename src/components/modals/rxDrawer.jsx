import React, {Component} from 'react';
import {Empty, Tag, Drawer, Divider, Popover, Flex, Space, Button} from "antd";
import {ProDescriptions} from "@ant-design/pro-components";
import {getHeader, getEvent} from "@/utils/serial/msgView";
import {getColumnsFromData} from "@/utils/columns";
import {saveText, uploadFile} from "@/utils/utils";

class RxDrawer extends Component {
    state = {show: false, history: {rx: 0, log: [], start: -1}}

    onClose() {
        this.setState({show: false})
    }

    show(data) {
        this.setState({show: true, history: {...data, start: -1}})
    }

    save() {
        let res = ''
        for (const chunk of this.state.history.log) {
            for (const byte of chunk) {
                res += byte.toString(16).padStart(2, '0').toUpperCase() + ' '
            }
            res = res.slice(0, -1) + '\n'
        }
        res = res.slice(0, -1)
        saveText(res, 'rx.log')
    }

    async load() {
        const file = await uploadFile('.log')
        const reader = new FileReader()
        reader.onload = () => {
            const data = reader.result
            const log = data.split('\n')
            let rx = 0
            let res = []
            for (const line of log) {
                let chunk = []
                const bytes = line.split(' ')
                for (const byte of bytes) {
                    chunk.push(parseInt(byte, 16))
                }
                res.push(new Uint8Array(chunk))
                rx += chunk.length
            }
            this.setState({history: {rx, log: res, start: -1}})
        }
        reader.readAsText(file)
    }

    render() {
        const that = this;
        let history = this.state.history;
        let res;
        if (history.log.length === 0) {
            res = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No log yet."/>
        } else {
            res = []
            let idx = 0;
            const createTag = (item, _idx) => {
                if (item === 'A5') {
                    return <Tag
                        key={_idx}
                        color="blue"
                        onClick={() => that.setState({history: {...that.state.history, start: _idx}})}
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
                    res.push(<Divider key={cid}/>)
                    res.push(
                        Array.from(chunk).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                            item => {
                                let rr = createTag(item, idx);
                                idx += 1;
                                return rr;
                            }
                        )
                    )
                } else {
                    res.push(<Divider key={`${cid}-prefix`}/>)
                    const suffixLen = history.start - idx;
                    const prefix = Array.from(chunk.slice(0, suffixLen))
                    res.push(
                        Array.from(prefix).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                            item => {
                                let rr = createTag(item, idx);
                                idx += 1;
                                return rr;
                            }
                        )
                    )
                    res.push(<Divider key={`${cid}-msg`}/>)

                    const maybeMsg = [...chunk.slice(suffixLen)]
                    const startLoc = [0]
                    for (let j = cid + 1; j < history.log.length; j++) {
                        startLoc.push(maybeMsg.length)
                        maybeMsg.push(...Array.from(history.log[j]))
                    }

                    const addSuffix = (msgLength) => {
                        res.push(<Divider key={`${cid}-suffix`}/>)
                        let addCid;
                        for (addCid = 0; addCid < startLoc.length; addCid++) {
                            if (addCid === 0) {
                                if (history.log[addCid + cid].length - suffixLen > msgLength) {
                                    const chunk = history.log[addCid + cid]
                                    res.push(
                                        Array.from(chunk.slice(msgLength + suffixLen)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                            item => {
                                                let rr = createTag(item, idx);
                                                idx += 1;
                                                return rr;
                                            }
                                        )
                                    )
                                    break;
                                }
                            } else if (startLoc[addCid] + history.log[addCid + cid].length > msgLength) {
                                const chunk = history.log[addCid + cid]
                                res.push(
                                    Array.from(chunk.slice(msgLength - startLoc[addCid])).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                        item => {
                                            let rr = createTag(item, idx);
                                            idx += 1;
                                            return rr;
                                        }
                                    )
                                )
                                break;
                            }
                        }
                        cid += addCid
                    }

                    const renderPopContent = (msg, color, info, title) => {
                        return <Popover
                            title={title}
                            content={
                                <ProDescriptions
                                    dataSource={info}
                                    columns={getColumnsFromData(info)}
                                    key={`${idx}-${title}`}
                                    editable={false}
                                    column={1}
                                    style={{width: 250}}
                                />
                            }
                            destroyTooltipOnHide={true}
                        >
                            {
                                color !== 'Object' ?
                                    Array.from(msg).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                            item => {
                                            let rr = createTag2(item, idx, color);
                                            idx += 1;
                                            return rr;
                                        }
                                    ) :
                                    msg
                            }
                        </Popover>
                    }

                    const renderContent = (_msg) => {
                        const msg = getEvent(Uint8Array.from(_msg))
                        if (msg.events.length > 0) {
                            const res = [renderPopContent(_msg.slice(0, 6), 'purple', msg, 'Info')]
                            let color = "geekblue";
                            for (const event of msg.events) {
                                res.push(renderPopContent(_msg.slice(event.obj._start, event.obj._end), color, event.obj, 'Object'))
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
                            res.push(Array.from(_msg.slice(2)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                                item => {
                                    let rr = createTag2(item, idx, 'orange');
                                    idx += 1;
                                    return rr;
                                }
                            ))
                            return res;
                        }
                    }

                    const headerRes = getHeader(Uint8Array.from(maybeMsg))
                    console.log(headerRes)
                    const createTag2 = (item, key, color) => {
                        return <Tag key={key} color={color}>{item}</Tag>
                    }
                    if (headerRes.code === 0) {
                        const header = headerRes.header
                        res.push(renderPopContent(maybeMsg.slice(0, 7), 'green', header, 'Header'))
                        res.push(...renderContent(maybeMsg.slice(7, header.length + 7)))
                        res.push(Array.from(maybeMsg.slice(header.length + 7, header.length + 9)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                            item => {
                                let rr = createTag2(item, idx, 'green');
                                idx += 1;
                                return rr;
                            }
                        ))
                        addSuffix(header.length + 9)
                    } else if (headerRes.code <= 2) {
                        res.push(renderPopContent(maybeMsg.slice(0, 1), 'red', headerRes, 'Error'))
                        addSuffix(1)
                    } else if (headerRes.code <= 6) {
                        res.push(renderPopContent(Array.from(maybeMsg.slice(0, 5)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).map(
                            (item, _idx) => {
                                let color = 'green';
                                if (headerRes.loc.includes(_idx)) {
                                    color = 'red'
                                }
                                let rr = createTag2(item, idx, color);
                                idx += 1;
                                return rr;
                            }
                        ), "Object", headerRes, 'Error'))
                        addSuffix(5)
                    } else if (headerRes.code <= 7) {
                        res.push(renderPopContent(maybeMsg.slice(0, 7), 'green', headerRes.header, 'Header'))
                        res.push(...renderContent(maybeMsg.slice(7, headerRes.loc[0])))
                        res.push(renderPopContent(maybeMsg.slice(headerRes.loc[0], headerRes.loc[1] + 1), 'red', headerRes, 'Error'))
                        addSuffix(headerRes.loc[1] + 1)
                    }
                }
            }
        }

        return (
            <Drawer
                title="Serial Rx History"
                placement="right"
                onClose={() => this.onClose()}
                open={this.state.show}
                size="large"
                getContainer={document.getElementById('content-in')}
                rootStyle={{inset: '25px 0 0 0'}}
                style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
            >
                <div style={{
                    width: '100%',
                    height: 'calc(100% - 25px)',
                }}>
                    <div style={{color: 'var(--ant-color-text)', height: '100%'}}>
                        <Flex justify="space-between" align="center">
                            <p style={{margin: 6}}>
                                RX: {history.rx},&nbsp;&nbsp;
                                This is not a real-time display, close and reopen to refresh.
                            </p>
                            <Space>
                                <Button size="small" type="primary" onClick={() => this.save()}>
                                    Save
                                </Button>
                                <Button size="small" onClick={() => this.load()}>
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
    }
}

export default RxDrawer;