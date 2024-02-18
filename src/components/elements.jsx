import React, { Component } from 'react';
import {Card, Dropdown, Tree, Space} from "antd";
import {DownOutlined} from "@ant-design/icons";

function selectId2Key(id) {
    if (id === -1) {
        return []
    } if (id === -2) {
        return ['window']
    } else {
        return [`E-${id}`]
    }
}

function selectKey2id(key) {
    if (key[0] === 'E') {
        return key.slice(2)
    } if (key === 'window') {
        return -2
    } else {
        return -1
    }
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

    onElementMenuContainerClick(e) {
        if (e.target.localName === 'div') {
            this.setState({rightClickMenuOpen: false})
            this.props.onSelect(-1)
        }
    }

    onElementMenuClick(e) {
        this.setState({rightClickMenuOpen: false})
        if (e.key === 'D2-copy') {
            const obj = {...this.props.data[this.props.selectedId]}
            obj.id = -1
            this.props.onObjectEvent('_update', obj)
        } else if (e.key === 'D2-delete') {
            this.props.onObjectEvent('remove', {id: this.props.selectedId})
        }
    }

    onElementRightClick(e) {
        this.props.onSelect(selectKey2id(e.node.key))
    }

    onSelect(nodes) {
        if (nodes.length === 0) {
            return
        }
        this.props.onSelect(selectKey2id(nodes[0]))
    }

    onMenuOpenChange(e) {
        if (e) {
            const that = this
            setTimeout(()=>{
                if (that.props.selectedId !== -1) {
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
                title: node.name, key: `E-${keys[i]}`
            })
        }

        treeData = treeData.sort((a, b) => a.key.toString().localeCompare(b.key.toString()))
        treeData.unshift({title: "UI Window", key: 'window'})
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
                        />
                    </Dropdown>
                </div>
            </Card>
        );
    }
}

export default Elements;