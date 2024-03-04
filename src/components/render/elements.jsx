import React, { Component } from 'react';
import {Card, Dropdown, Tree, Space, Flex} from "antd";
import { DownOutlined, EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import SwitchButton from "./switchButton";

function selectId2Key(ids) {
    return ids.map(id => id === -2 ? 'window' : `E-${id}`)
}

const items = [
    {key: 'D1-group-layer', label: 'layer'},
    {key: 'D1-group-group', label: 'group'}
]

class Elements extends Component {
    state = {
        treeData: [], 
        rightClickMenuOpen: false,
        groupKey: 'layer',
    }
    treeData = []

     selectKey2id(keys) {
        let res = []
        for (let key of keys) {
            if (key === 'window') {
                res.push(-2)
            } else {
                if (key.startsWith('E-')) {
                    res.push(parseInt(key.slice(2)))
                } else {
                    const ids = this.treeData.find(e => e.key === key).children.map(e => parseInt(e.key.slice(2)))
                    for (let id of ids) {
                        if (!res.includes(id)) {
                            res.push(id)
                        }
                    }
                }
            }
        }
        return res
    }

    onElementMenuContainerClick(e) {
        if (e.target.localName === 'div') {
            this.setState({rightClickMenuOpen: false})
            if (e.target.classList.contains('ant-tree') || (!e.ctrlKey && !e.shiftKey)) {
                this.props.onSelect([])
            }
        }
    }

    onElementMenuClick(e) {
        this.setState({rightClickMenuOpen: false})
        if (e.key === 'D2-copy') {
            let info = null
            if (e.target.localName !== 'input' && this.props.selectedId.length !== 0 &&this.props.selectedId[0] !== -2) {
                e.preventDefault()
                info = JSON.stringify(this.props.selectedId.map(id => this.props.data[id]))
                e.clipboardData.setData('text', info)
            }
        } else if (e.key === 'D2-delete') {
            for (let id of this.props.selectedId) {
                this.props.onObjectEvent('remove', {id})
            }
        }
    }

    onElementRightClick(e) {
        let id = this.selectKey2id([e.node.key])
        if (!(id[0] in this.props.selectedId)) {
            this.props.onSelect(id)
        }
    }

    onSelect(nodes) {
        if (nodes.length === 0) {
            return
        }
        let ids = this.selectKey2id(nodes)
        if (ids.includes(-2)) {
            ids = [ids[ids.length - 1]]
        }
        this.props.onSelect(ids)
    }

    onMenuOpenChange(e) {
        if (e) {
            const that = this
            setTimeout(()=>{
                if (that.props.selectedId.length !== 0 && that.props.selectedId[0] !== -2) {
                    that.setState({rightClickMenuOpen: true})
                } else {
                    that.setState({rightClickMenuOpen: false})
                }
            }, 100)
        } else {
            this.setState({rightClickMenuOpen: false})
        }
    }

    elementsMenuOnClick(key) {
        this.setState({groupKey: key.key.slice(9)}, ()=>this.updateTree())
    }

    updateTree() {
        const key = this.state.groupKey
        let treeData = []
        const keys = Object.keys(this.props.data)
        for (let i = 0; i < keys.length; i++) {
            const node = this.props.data[keys[i]]

            let pos = -1
            for (let j = 0; j < treeData.length; j++) {
                if (treeData[j].key === `${key}-${node[key]}`) {
                    pos = j
                    break
                }
            }
            if (pos === -1) {
                treeData.push({
                    title: `${key} ${node[key]}`, key: `${key}-${node[key]}`, children: [], isLeaf: false
                })
                pos = treeData.length - 1
            }

            treeData[pos].children.push({
                title: <Flex justify="space-between" style={{width: '100%'}}>
                    {node.name}
                    <Space>
                        <SwitchButton
                            onChange={(e)=>this.props.onObjectEvent('setAttr', {id: node.id, payload: {visible: e}})}
                            defaultStatus={true}
                            onNode={<EyeInvisibleOutlined/>}
                            offNode={<EyeOutlined/>}
                        />
                        <SwitchButton
                            onChange={(e)=>this.props.onObjectEvent('setAttr', {id: node.id, payload: {selectable: e}})}
                            defaultStatus={true}
                            onNode={<LockOutlined/>}
                            offNode={<UnlockOutlined style={{transform: 'scaleX(-1)'}}/>}
                        />
                    </Space>
                </Flex>,
                key: `E-${keys[i]}`
            })
        }

        treeData = treeData.sort((a, b) => a.key.toString().localeCompare(b.key.toString()))
        treeData.unshift({title: "UI Window", key: 'window'})

        this.treeData = treeData
        return treeData
    }

    render() {
        return (
            <Card
                size="small"
                title="Elements"
                style={{height: "100%"}}
                extra={
                    <Dropdown
                        menu={{
                            items,
                            onClick: (e)=>this.elementsMenuOnClick(e),
                            selectable: true,
                            selectedKeys: [`D1-group-${this.state.groupKey}`]
                        }}
                    >
                        <Space style={{fontSize: 11}}>
                            Group by
                            <DownOutlined size="small" />
                        </Space>
                    </Dropdown>
                }
            >
                <div
                    className="card-body"
                    onMouseUp={(e)=>this.onElementMenuContainerClick(e)}
                >
                    <Dropdown
                        menu={{
                            items: [
                                {key: 'D2-copy', label: 'Copy'},
                                {key: 'D2-delete', label: 'Delete', danger: true}
                            ],
                            onClick: (e)=>{this.onElementMenuClick(e)}
                        }}
                        trigger={['contextMenu']}
                        open={this.state.rightClickMenuOpen}
                        onOpenChange={(e)=>{this.onMenuOpenChange(e)}}
                    >
                        <Tree
                            className="full"
                            treeData={this.updateTree()}
                            onSelect={(e)=>this.onSelect(e)}
                            selectedKeys={selectId2Key(this.props.selectedId)}
                            onRightClick={(e)=>this.onElementRightClick(e)}
                            treeDefaultExpandAll={true}
                            showLine={true}
                            blockNode={true}
                            multiple={true}
                        />
                    </Dropdown>
                </div>
            </Card>
        );
    }
}

export default Elements;