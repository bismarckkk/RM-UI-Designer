import React, {Component, createRef} from 'react';
import { Tree, Card, Col, Row, Empty, Dropdown, Modal } from "antd";
import { EllipsisOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { ProDescriptions } from '@ant-design/pro-components';
import { fabric } from 'fabric'

const columns = {
    id: {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        valueType: 'digit',
        editable: false
    },
    name: {
        title: 'Name',
        key: 'name',
        dataIndex: 'name'
    },
    group: {
        title: 'Group',
        key: 'group',
        dataIndex: 'group'
    },
    kind: {
        title: 'Kind',
        key: 'kind',
        dataIndex: 'kind',
        editable: false
    },
    lineWidth: {
        title: 'Line Width',
        key: 'lineWidth',
        dataIndex: 'lineWidth',
        valueType: 'digit',
    },
    layer: {
        title: 'Layer',
        key: 'layer',
        dataIndex: 'layer',
        valueType: 'digit',
    },
    x: {
        title: 'X',
        key: 'x',
        dataIndex: 'x',
        valueType: 'digit',
    },
    y: {
        title: 'Y',
        key: 'y',
        dataIndex: 'y',
        valueType: 'digit',
    },
    width: {
        title: 'Width',
        key: 'width',
        dataIndex: 'width',
        valueType: 'digit',
    },
    height: {
        title: 'Height',
        key: 'height',
        dataIndex: 'height',
        valueType: 'digit',
    },
    rx: {
        title: 'Rx',
        key: 'rx',
        dataIndex: 'rx',
        valueType: 'digit',
    },
    ry: {
        title: 'Ry',
        key: 'ry',
        dataIndex: 'ry',
        valueType: 'digit',
    },
    r: {
        title: 'R',
        key: 'r',
        dataIndex: 'r',
        valueType: 'digit',
    },
    startAngle: {
        title: 'Start Angle',
        key: 'startAngle',
        dataIndex: 'startAngle',
        valueType: 'digit',
    },
    endAngle: {
        title: 'End Angle',
        key: 'endAngle',
        dataIndex: 'endAngle',
        valueType: 'digit',
    },
    fontSize: {
        title: 'Font Size',
        key: 'fontSize',
        dataIndex: 'fontSize',
        valueType: 'digit',
    },
    decimalPlaces: {
        title: 'Decimal Places',
        key: 'decimalPlaces',
        dataIndex: 'decimalPlaces',
        valueType: 'digit',
    },
    number: {
        title: 'Number',
        key: 'number',
        dataIndex: 'number',
        valueType: 'digit',
    },
    text: {
        title: 'Text',
        key: 'text',
        dataIndex: 'text',
    }
}

function getColumnsFromData(data) {
    const keys = Object.keys(data)
    let _columns = []
    for(let i = 0; i < keys.length; i++) {
        if (columns[keys[i]]) {
            _columns.push(columns[keys[i]])
        }
    }
    return _columns
}

class Render extends Component {
    data = [{name: "23", layer: 0, group: 2}, {name: "234", layer: 1, group: 3}]
    state = {
        treeData: [],
        properties: null,
        groupKey: 'layer',
        selectedId: -1,
        selectedKey: [],
        uiWindow: {
            height: 1080,
            width: 1920,
            ratio: 1
        },
        modalShow: false
    }
    editable = false;
    canvas = null
    canvasRef = createRef()

    updateTree() {
        const key = this.state.groupKey
        let treeData = [{title: "UI Window", key: 'window'}]
        for (let i = 0; i < this.data.length; i++) {
            const node = this.data[i]

            let pos = -1
            for (let j = 0; j < treeData.length; j++) {
                if (treeData.key === `${key}-${node[key]}`) {
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
                title: node.name, key: `E-${i}`
            })
        }

        this.setState({treeData})
    }

    getNodeFromId(id) {
        if (id[0] === 'E') {
            return id.slice(2)
        }
        return -1
    }

    onSelect(nodes) {
        if (nodes.length === 0) {
            this.setState({properties: null})
            return
        }
        if (nodes[0] === 'window') {
            this.setState({properties: this.state.uiWindow, selectedId: -1, selectedKey: nodes})
            return
        }
        const node = this.getNodeFromId(nodes[0])
        if (node === -1) {
            this.setState({properties: null, selectedId: -1, selectedKey: nodes})
        } else {
            this.setState({properties: this.data[node], selectedId: node, selectedKey: [nodes[0]]})
        }
    }

    select(id) {
        if (id === -1) {
            this.setState({properties: null, selectedId: -1, selectedKey: []})
        } else {
            this.setState({properties: this.data[id], selectedId: id, selectedKey: [`E-${id}`]})
        }
    }

    elementsMenuOnClick(key) {
        const first = key.keyPath[key.keyPath.length - 1]
        if (first === 'D1-add') {

        } else if (first === 'D1-group') {
            this.setState({groupKey: key.key.slice(9)}, ()=>this.updateTree())

        }
    }

    resetCanvasSize() {
        let width = this.canvasRef.current.clientWidth - 12
        let height = this.canvasRef.current.clientHeight
        let uiWindow = {...this.state.uiWindow}
        if (width / height < uiWindow.width / uiWindow.height) {
            height = width * uiWindow.height / uiWindow.width
            uiWindow.ratio = uiWindow.width / width
        } else {
            width = height * uiWindow.width / uiWindow.height
            uiWindow.ratio = uiWindow.height / height
        }
        console.log(width, height)
        this.setState({ uiWindow })
        this.canvas.setHeight(height)
        this.canvas.setWidth(width)
        this.canvas.renderAll()
        this.setState({modalShow: false})
    }

    onReSize() {
        if (!this.state.modalShow) {
            this.canvas.setHeight(10)
            this.canvas.setWidth(10)
            this.canvas.renderAll()
            this.setState({modalShow: true}, () => {
                Modal.info({
                    title: "Reset UI Window Size",
                    content: "Must reset UI window size after resize browser window.",
                    onOk: ()=>this.resetCanvasSize(),
                    okText: 'Reset'
                })
            })
        }
    }

    onPropertiesChange(key, info) {
        if (this.state.selectedKey[0] === 'window') {
            this.setState({uiWindow: info, properties: info}, ()=> {
                this.resetCanvasSize()
            })
        } else {

        }
    }

    componentDidMount() {
        this.canvas = new fabric.Canvas('ui')
        this.canvas.backgroundColor = '#fff'
        this.resetCanvasSize()
        this.canvas.renderAll()
        this.updateTree()
        window.addEventListener('resize', () => {
            this.onReSize();
        }, false);
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
            }
        ];
        if (this.props.editable) {
            items.unshift({
                key: 'D1-add',
                label: "Add Element",
                children: [
                    {key: 'D1-add-rect', label: 'rect'}
                ]
            })
            groupPos++;
        }
        for (let i = 0; i < items[groupPos].children.length; i++) {
            if (items[groupPos].children[i].label === this.state.groupKey) {
                items[groupPos].children[i].icon = <CheckOutlined />
            }
        }

        return (
            <div className="full">
                <Row warp={false} className="container" gutter={12}>
                    <Col flex="300px">
                        <div style={{height: "50%", paddingBottom: 12}}>
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
                                <Tree
                                    className="card-body"
                                    treeData={this.state.treeData}
                                    onSelect={(e)=>this.onSelect(e)}
                                    selectedKeys={this.state.selectedKey}
                                />
                            </Card>
                        </div>
                        <Card size="small" title="Properties" style={{height: "50%"}}>
                            <div className="card-body">
                                {
                                    this.state.properties ?
                                        <ProDescriptions
                                            dataSource={this.state.properties}
                                            columns={getColumnsFromData(this.state.properties)}
                                            editable={
                                                this.props.editable ?
                                                {onSave: (key, info)=>this.onPropertiesChange(key, info)}:
                                                null
                                            }
                                            column={1}
                                            style={{marginTop: 4}}
                                        /> :
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                            </div>
                        </Card>
                    </Col>
                    <Col flex="auto" ref={this.canvasRef}>
                        {/*<div className="full" id="ui" style={{backgroundColor: "#FFF"}} >*/}
                        {/*    <h1 className="ds-font" style={{padding: 40}}>*/}
                        {/*        UI Panel*/}
                        {/*    </h1>*/}
                        {/*</div>*/}
                        <canvas className="full" id="ui" />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Render;