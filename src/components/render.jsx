import React, {Component, createRef} from 'react';
import { Card, Col, Row, Empty, Modal, Button } from "antd";
import { ProDescriptions } from '@ant-design/pro-components';
import UpdateModal from './updateModal'
import Elements from "./elements";

import { fabric } from 'fabric'
import { getColumnsFromData } from "@/utils/columns";
import { saveObj } from "@/utils/utils";
import { createUiElement } from "@/utils/fabricObjects";
import Generator from "@/components/generator";

class Render extends Component {
    objects = {}
    state = {
        properties: null,
        selectedId: -1,
        uiWindow: {
            height: 1080,
            width: 1920,
            ratio: 1,
            team: 'red',
            backgroundImage: true
        },
        infoModalShow: false,
        data: {}
    }
    canvas = null
    canvasRef = createRef()
    uploadRef = createRef()
    generatorRef = createRef()
    background = null

    getNewDataId() {
        if (Object.keys(this.state.data).length === 0) {
            return 0
        }
        return Math.max(...Object.keys(this.state.data)) + 1
    }

    save() {
        saveObj(this.state.data, 'ui.rmui')
    }

    generate() {
        this.generatorRef.current.gen(this.state.data)
    }

    select(id) {
        if (typeof id === 'undefined' || id === -1) {
            this.setState({properties: null, selectedId: -1})
            this.canvas.discardActiveObject()
            this.canvas.renderAll()
        } else if (id === -2) {
            this.setState({properties: this.state.uiWindow, selectedId: -2})
            this.canvas.discardActiveObject()
            this.canvas.renderAll()
        } else {
            this.setState({properties: this.state.data[id], selectedId: id})
            this.canvas.setActiveObject(this.objects[id])
            this.canvas.renderAll()
        }
    }


    reset() {
        this.canvas.clear()
        this.canvas.backgroundColor = '#fff'
        if (this.state.uiWindow.backgroundImage) {
            this.canvas.setBackgroundImage(this.background)
        }
        this.objects = {}
        this.select(-1)
        this.resetCanvasSize()
        this.setState({data: {}})
        localStorage.setItem('data', "{}")
    }

    resetCanvasSize() {
        let width = this.canvasRef.current.clientWidth - 14
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
                    that.onObjectEvent('_update', obj)
                    that.select(obj.id)
                } catch (e) {

                }
            }
        })
        window.addEventListener('keyup', e => {
            if (e.key === "Delete" && that.state.selectedId !== -1) {
                that.onObjectEvent('remove', {id: this.state.selectedId})
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
                this.onObjectEvent('_update', data[key])
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
        let data = {}
        for (const key of Object.keys(this.objects)) {
            const info = this.objects[key].toObject()
            data[info.id] = info
        }
        if (this.state.selectedId !== -1) {
            this.setState({
                properties: data[this.state.selectedId]
            })
        }
        this.setState({data})
        if (Object.keys(data).length !== 0) {
            localStorage.setItem('data', JSON.stringify(data))
        }
    }

    onObjectEvent(type, obj) {
        const that = this
        function addObject(_obj, complete=true) {
            let options = {
                id: _obj.id,
                name: _obj.name,
                layer: _obj.layer,
                groupName: _obj.group,
                type: _obj.type,
                ratio: that.state.uiWindow.ratio,
                team: that.state.uiWindow.team,
            }
            let element = createUiElement(options)
            that.objects[_obj.id] = element
            if (complete) {
                element.fromObject(_obj)
            }
            element.setRatio(that.state.uiWindow.ratio)
            that.canvas.add(element)
        }

        if (type === 'add') {
            if (!obj.id || this.objects[obj.id]) {
                obj.id = this.getNewDataId()
                addObject(obj)
            }
        } else if (type === '_add') {
            obj.id = this.getNewDataId()
            obj.ratio = this.state.uiWindow.ratio
            obj.team = this.state.uiWindow.team
            addObject(obj, false)
        } else if(type === 'update') {
            if (this.objects[obj.id]) {
                this.objects[obj.id].fromObject(obj)
            }
        } else if (type === '_update') {
            if (obj.id >= 0 && this.objects[obj.id]) {
                this.objects[obj.id].fromObject(obj)
            } else {
                addObject(obj)
            }
        } else if (type === 'remove') {
            const id = obj.id
            if (this.objects[id]) {
                this.select(-1)
                this.canvas.remove(this.objects[id])
                this.canvas.renderAll()
                delete this.objects[id]
                this.objectsToData()
            }
        }

        this.objectsToData()
    }

    render() {
        return (
            <div className="full">
                <Row warp={false} className="container" gutter={12} style={{paddingTop: 12, paddingLeft: 12, paddingBottom: 12}}>
                    <Col flex="300px">
                        <div style={{height: "50%", paddingBottom: 12}}>
                            <Elements
                                onSelect={e=>this.select(e)}
                                onObjectEvent={(t, e)=>this.onObjectEvent(t, e)}
                                onReset={()=>this.reset()}
                                data={this.state.data}
                                editable={this.props.editable}
                                selectedId={this.state.selectedId}
                            />
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
                                    this.state.selectedId[0] === -2 ?
                                        <Button onClick={()=>
                                            this.uploadRef.current.upload(
                                                'Upload Your Background Image',
                                                'image/*'
                                            ).then(file=>{
                                                this.setState({imageUploadShow: false})
                                                this.background.setSrc(createObjUrl(file), ()=>{
                                                    this.canvas.renderAll()
                                                })
                                            })
                                        }>
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
                <UpdateModal ref={this.uploadRef}/>
                <Generator ref={this.generatorRef} />
            </div>
        );
    }
}

export default Render;