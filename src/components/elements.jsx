import React, {Component, createRef} from 'react';
import {Card, Dropdown, Tree} from "antd";
import {CheckOutlined, EllipsisOutlined, ThunderboltOutlined} from "@ant-design/icons";
import {getMenuProps} from "@/utils/fabricObjects";
import {saveObj} from "@/utils/utils";
import Generator from "@/components/generator";

function selectId2Key(id) {
    if (id === -1) {
        return []
    } if (id === -2) {
        return ['uiWindow']
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

class Elements extends Component {
    state = {
        treeData: [], 
        rightClickMenuOpen: false,
        groupKey: 'layer',
    }
    generatorRef = createRef()

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
        const first = key.keyPath[key.keyPath.length - 1]
        if (first === 'D1-add') {
            const type = key.key.slice(7)
            const options = {
                id: -1,
                name: `New${type}`,
                layer: 0,
                group: 'Ungroup',
                type: `Ui${type}`
            }
            this.props.onObjectEvent('_add', options)
        } else if (first === 'D1-group') {
            this.setState({groupKey: key.key.slice(9)}, ()=>this.updateTree())
        } else if (first === 'D1-reset') {
            this.props.onReset()
        } else if (first === 'D1-save') {
            saveObj(this.data, 'ui.rmui')
        } else if (first === 'D1-open') {
            this.uploadRef.current.upload('Upload Your .rmui File', '.rmui').then(file=>{
                const reader = new FileReader()
                reader.onload = e => {
                    let str = e.target.result
                    const data = JSON.parse(str)
                    this.reset()
                    for (const key of Object.keys(data)) {
                        this.props.onObjectEvent('_update', data[key])
                    }
                }
                reader.readAsText(file)
            })
        } else if (first === "D1-generate") {
            this.generatorRef.current.gen(this.data)
        }
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
        let groupPos = 0
        const items = [
            {
                key: 'D1-group',
                label: "Group by",
                children: [
                    {key: 'D1-group-layer', label: 'layer'},
                    {key: 'D1-group-group', label: 'group'}
                ]
            },
            {
                key: 'D1-reset',
                label: "Reset Designer",
            }
        ];
        if (this.props.editable) {
            items.unshift({
                key: 'D1-add',
                label: "Add Element",
                children: getMenuProps()
            })
            items.push(
                {type: 'divider'},
                {
                    key: 'D1-open',
                    label: "Open .rmui"
                },
                {
                    key: 'D1-save',
                    label: "Save as .rmui"
                },
                {type: 'divider'},
                {
                    key: 'D1-generate',
                    label: "Generate Code",
                    icon: <ThunderboltOutlined />
                },
            )
            groupPos++;
        }
        for (let i = 0; i < items[groupPos].children.length; i++) {
            if (items[groupPos].children[i].label === this.state.groupKey) {
                items[groupPos].children[i].icon = <CheckOutlined />
            }
        }
        console.log(selectId2Key(this.props.selectedId))
        console.log(this.props.selectedId)
        return (
            <Card
                size="small"
                title="Elements"
                style={{height: "100%"}}
                extra={
                    <Dropdown menu={{ items, onClick: (e)=>this.elementsMenuOnClick(e) }}>
                        <EllipsisOutlined />
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
                            defaultExpandParent={true}
                        />
                    </Dropdown>
                </div>
                <Generator ref={this.generatorRef} />
            </Card>
        );
    }
}

export default Elements;