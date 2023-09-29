import React, {Component, createRef} from 'react';
import { Tree, Card, Col, Row, Empty, Dropdown, Modal, Upload, Divider, Button } from "antd";
import { EllipsisOutlined, CheckOutlined, InboxOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { ProDescriptions } from '@ant-design/pro-components';
import Generator from './generator'
import { fabric } from 'fabric'
import { getColumnsFromData } from "../utils/columns";
import { saveObj, createObjUrl } from "../utils/utils";
import { createUiElement, getMenuProps } from "../utils/fabricObjects";

const { Dragger } = Upload;

class Render extends Component {
    data = {}
    objects = {}
    state = {
        treeData: [],
        properties: null,
        groupKey: 'layer',
        selectedId: -1,
        selectedKey: [],
        uiWindow: {
            height: 1080,
            width: 1920,
            ratio: 1,
            team: 'red',
            backgroundImage: true
        },
        rightClickMenuOpen: false,
        infoModalShow: false,
        uploadModalShow: false,
        imageUploadShow: false
    }
    editable = false;
    canvas = null
    canvasRef = createRef()
    generatorRef = createRef()
    background = null

    getNewDataId() {
        if (Object.keys(this.data).length === 0) {
            return 0
        }
        return Math.max(...Object.keys(this.data)) + 1
    }

    updateTree() {
        const key = this.state.groupKey
        let treeData = []
        const keys = Object.keys(this.data)
        for (let i = 0; i < keys.length; i++) {
            const node = this.data[keys[i]]

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
            return
        }
        if (nodes[0] === 'window') {
            this.setState({properties: this.state.uiWindow, selectedId: -1, selectedKey: nodes})
            this.canvas.discardActiveObject()
            this.canvas.renderAll()
            return
        }
        const node = this.getNodeFromId(nodes[0])
        this.select(node)
    }

    select(id) {
        if (typeof id === 'undefined' || id === -1) {
            this.setState({properties: null, selectedId: -1, selectedKey: []})
            this.canvas.discardActiveObject()
            this.canvas.renderAll()
        } else {
            this.setState({properties: this.data[id], selectedId: id, selectedKey: [`E-${id}`]})
            this.canvas.setActiveObject(this.objects[id])
            this.canvas.renderAll()
        }
    }

    elementsMenuOnClick(key) {
        const first = key.keyPath[key.keyPath.length - 1]
        if (first === 'D1-add') {
            const type = key.key.slice(7)
            const nid = this.getNewDataId()
            const options = {
                id: nid,
                name: `New${type}`,
                layer: 0,
                group: 'Ungroup',
                ratio: this.state.uiWindow.ratio,
                team: this.state.uiWindow.team,
                type: `Ui${type}`
            }
            let element = createUiElement(options)
            this.objects[nid] = element
            this.canvas.add(element)

            this.objectsToData()
            this.updateTree()
        } else if (first === 'D1-group') {
            this.setState({groupKey: key.key.slice(9)}, ()=>this.updateTree())
        } else if (first === 'D1-reset') {
            this.reset()
        } else if (first === 'D1-save') {
            this.objectsToData()
            saveObj(this.data, 'ui.rmui')
        } else if (first === 'D1-open') {
            this.setState({uploadModalShow: true})
        } else if (first === "D1-generate") {
            this.generatorRef.current.gen(this.data)
        }
    }

    reset() {
        this.canvas.clear()
        this.canvas.backgroundColor = '#fff'
        if (this.state.uiWindow.backgroundImage) {
            this.canvas.setBackgroundImage(this.background)
        }
        this.objects = {}
        this.data = {}
        this.select(-1)
        this.updateTree()
        this.resetCanvasSize()
        localStorage.setItem('data', "{}")
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
        this.setState({ uiWindow })
        this.canvas.setHeight(height)
        this.canvas.setWidth(width)
        for (const key of Object.keys(this.objects)) {
            this.objects[key].setRatio(uiWindow.ratio)
        }
        this.background?.set({scaleX: 1 / uiWindow.ratio, scaleY: 1 / uiWindow.ratio})
        this.canvas.renderAll()
        this.objectsToData()
        this.setState({infoModalShow: false})
    }

    onReSize() {
        if (!this.state.infoModalShow) {
            this.canvas.setHeight(10)
            this.canvas.setWidth(10)
            this.canvas.renderAll()
            this.setState({infoModalShow: true}, () => {
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
            if (info.team !== this.state.uiWindow.team) {
                for (const key of Object.keys(this.objects)) {
                    this.objects[key].setTeam(info.team)
                }
                this.canvas.renderAll()
                this.objectsToData()
            }
            this.setState({uiWindow: info, properties: info}, ()=> {
                this.resetCanvasSize()
            })
            if (info.backgroundImage !== this.state.uiWindow.backgroundImage) {
                if (info.backgroundImage) {
                    const ratio = this.state.uiWindow.ratio
                    this.background?.set({scaleX: 1 / ratio, scaleY: 1 / ratio})
                    this.canvas.setBackgroundImage(this.background)
                    this.canvas.renderAll()
                } else {
                    this.canvas.setBackgroundImage(null)
                    this.canvas.renderAll()
                }
            }
            if (info.width !== this.state.uiWindow.width || info.height !== this.state.uiWindow.height) {
                Modal.warning({
                    title: 'Warning',
                    content: 'Modify UI window width and height may cause unknown error.'
                })
            }
        } else if (this.state.selectedId !== -1) {
            this.objects[this.state.selectedId].fromObject(info)
            this.canvas.renderAll()
            this.objectsToData()
            this.updateTree()
        }
    }

    componentDidMount() {
        const that = this
        this.canvas = new fabric.Canvas('ui')
        fabric.Image.fromURL(require("../../public/background.png"), (image, _) => {
            that.background = image
            const ratio = that.state.uiWindow.ratio
            that.background?.set({scaleX: 1 / ratio, scaleY: 1 / ratio})
            if (that.state.uiWindow.backgroundImage) {
                that.canvas.setBackgroundImage(that.background)
                that.canvas.renderAll()
            }
        })
        this.canvas.backgroundColor = '#fff'

        this.updateTree()
        window.addEventListener('resize', () => {
            this.onReSize();
        }, false);
        window.addEventListener('copy', e => {
            e.preventDefault()
            let info = null
            if (e.target.localName === 'input') {
                info = e.target.ariaValueNow
            } else if (that.state.selectedId !== -1) {
                info = JSON.stringify(that.data[that.state.selectedId])
            }
            e.clipboardData.setData('text', info)
        })
        window.addEventListener("paste", e => {
            e.preventDefault()
            if (e.target.localName === 'input') {
                e.target.value = e.clipboardData.getData('text')
            } else {
                try {
                    let str = e.clipboardData.getData('text')
                    let obj = JSON.parse(str)
                    obj.id = that.getNewDataId()
                    that.updateObject(obj)
                    that.select(obj.id)
                } catch (e) {

                }
            }
        })
        window.addEventListener('keyup', e => {
            if (e.key === "Delete" && that.state.selectedId !== -1) {
                that.removeObject(that.state.selectedId)
            }
        })
        this.canvas.on({
            "mouse:up": () => {
                for (const key of Object.keys(that.objects)) {
                    that.objects[key].resizeScale()
                }
                that.canvas.renderAll()
                that.objectsToData()
                const active = that.canvas.getActiveObject()
                if (active) {
                    that.select(active.id)
                } else {
                    that.select(-1)
                }
            }
        })
        this.canvas.selection = false

        let data = localStorage.getItem('data')
        if (data) {
            data = JSON.parse(data)
            for (const key of Object.keys(data)) {
                this.updateObject(data[key])
            }
        }
        this.resetCanvasSize()
        this.canvas.renderAll()
        if (data) {
            for (const key of Object.keys(data)) {
                this.select(key)
            }
            this.select(-1)
        }
    }

    objectsToData() {
        this.data = {}
        for (const key of Object.keys(this.objects)) {
            const info = this.objects[key].toObject()
            this.data[info.id] = info
        }
        if (this.state.selectedId !== -1) {
            this.setState({
                properties: this.data[this.state.selectedId]
            })
        }
        if (Object.keys(this.data).length !== 0) {
            localStorage.setItem('data', JSON.stringify(this.data))
        }
    }

    updateObject(obj) {
        if (this.objects[obj.id]) {
            this.objects[obj.id].fromObject(obj)
        } else {
            let options = {
                id: obj.id,
                name: obj.name,
                layer: obj.layer,
                groupName: obj.group,
                type: obj.type,
                ratio: this.state.uiWindow.ratio,
                team: this.state.uiWindow.team,
            }
            let element = createUiElement(options)
            this.objects[obj.id] = element
            element.fromObject(obj)
            element.setRatio(this.state.uiWindow.ratio)
            this.canvas.add(element)
        }
        this.objectsToData()
        this.updateTree()
    }

    removeObject(id) {
        if (this.objects[id]) {
            this.select(-1)
            this.canvas.remove(this.objects[id])
            this.canvas.renderAll()
            delete this.objects[id]
            this.objectsToData()
            this.updateTree()
        }
    }

    onElementRightClick(e) {
        if (e.node.key[0] === 'E') {
            this.select(e.node.key.slice(2))
        } else {
            this.select(-1)
        }
    }

    onElementMenuClick(e) {
        this.setState({rightClickMenuOpen: false})
        if (e.key === 'D2-copy') {
            const obj = {...this.data[this.state.selectedId]}
            obj.id = this.getNewDataId()
            this.updateObject(obj)
        } else if (e.key === 'D2-delete') {
            this.removeObject(this.state.selectedId)
        }
    }

    onMenuOpenChange(e) {
        if (e) {
            const that = this
            setTimeout(()=>{
                if (that.state.selectedId !== -1) {
                    that.setState({rightClickMenuOpen: true})
                } else {
                    that.setState({rightClickMenuOpen: false})
                }
            }, 100)
        } else {
            this.setState({rightClickMenuOpen: false})
        }
    }

    onElementMenuContainerClick(e) {
        if (e.target.localName === 'div') {
            this.setState({rightClickMenuOpen: false, properties: null, selectedId: -1, selectedKey: []})
            this.select(-1)
        }
    }

    onUploadModalCancel() {
        this.setState({uploadModalShow: false})
    }

    onImageUploadModalCancel() {
        this.setState({imageUploadShow: false})
    }

    onUploadFile(file) {
        const reader = new FileReader()
        reader.onload = e => {
            let str = e.target.result
            const data = JSON.parse(str)
            this.reset()
            this.setState({uploadModalShow: false})
            for (const key of Object.keys(data)) {
                this.updateObject(data[key])
            }
        }
        reader.readAsText(file)
        return true
    }

    onUploadImage(file) {
        this.setState({imageUploadShow: false})
        this.background.setSrc(createObjUrl(file), ()=>{
            this.canvas.renderAll()
        })
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
                                            treeData={this.state.treeData}
                                            onSelect={(e)=>this.onSelect(e)}
                                            selectedKeys={this.state.selectedKey}
                                            onRightClick={(e)=>this.onElementRightClick(e)}
                                            defaultExpandParent={true}
                                        />
                                    </Dropdown>
                                </div>
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
                                {
                                    this.state.selectedKey[0] === 'window' ?
                                        <Button onClick={()=>this.setState({imageUploadShow: true})}>
                                            Upload Background
                                        </Button> :
                                        <div />
                                }
                            </div>
                        </Card>
                    </Col>
                    <Col flex="auto" ref={this.canvasRef}>
                        <canvas className="full" id="ui" />
                    </Col>
                </Row>
                <Modal
                    title="Upload Your .rmui File"
                    open={this.state.uploadModalShow}
                    onCancel={()=>this.onUploadModalCancel()}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Divider />
                    <Dragger
                        showUploadList={false}
                        beforeUpload={e=>this.onUploadFile(e)}
                        accept=".rmui"
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Dragger>
                </Modal>
                <Modal
                    title="Upload Your Background Image"
                    open={this.state.imageUploadShow}
                    onCancel={()=>this.onImageUploadModalCancel()}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Divider />
                    <Dragger
                        showUploadList={false}
                        beforeUpload={e=>this.onUploadImage(e)}
                        accept="image/*"
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Dragger>
                </Modal>
                <Generator ref={this.generatorRef} />
            </div>
        );
    }
}

export default Render;