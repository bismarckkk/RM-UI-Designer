import React, {Component, createRef} from 'react';
import {Button, Card, Col, Empty, message, Row, Space} from "antd";
import {ProDescriptions} from '@ant-design/pro-components';
import UpdateModal from './modals/updateModal'
import WarningModal from "./modals/warningModal";
import Elements from "./elements";

import {fabric} from 'fabric'
import {getColumnsFromData} from "@/utils/columns";
import {createObjUrl, saveObj} from "@/utils/utils";
import {createUiElement} from "@/utils/fabricObjects";
import Generator from "@/components/generator";
import {readUiFile} from "@/utils/rmuiReader";

class Render extends Component {
    objects = {default: {}}
    state = {
        properties: null,
        selectedId: -1,
        frame: "default",
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
    propertiesRef = createRef()
    modalRef = createRef()
    background = null

    getNewDataId() {
        if (Object.keys(this.state.data).length === 0) {
            return 0
        }
        return Math.max(...Object.keys(this.state.data)) + 1
    }

    save() {
        saveObj(this.objects, 'ui.rmui', this.state.frame)
    }

    generate() {
        this.generatorRef.current.gen(this.objects)
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
            this.canvas.setActiveObject(this.objects[this.state.frame][id])
            this.canvas.renderAll()
        }
    }

    async reset() {
        this.canvas.clear()
        this.canvas.backgroundColor = '#fff'
        this.setBackground(require("../assets/background.png"))
        if (!Object.keys(this.objects).includes('default')) {
            await this.onFrameEvent('add', 'default')
        }
        this.objects.default = {}
        await this.onFrameEvent('change', 'default')
        this.objects = {default: {}}
        this.props.onFrameChange({frames: ['default'], selected: 'default'})
        this.select(-1)
        this.resetCanvasSize()
        this.objectsToData()
        localStorage.setItem('data', JSON.stringify({version: 2, data: {default: {}}, selected: 'default'}))
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
        this.setState({uiWindow})
        this.canvas.setHeight(height)
        this.canvas.setWidth(width)
        const parentWidth = this.canvasRef.current.clientWidth;
        const parentHeight = this.canvasRef.current.clientHeight;
        const right = parentWidth - width;
        const bottom = parentHeight - height;
        const coordinateDisplay = document.getElementById('coordinateDisplay');
        coordinateDisplay.style.right = `${right}px`;
        coordinateDisplay.style.bottom = `${bottom}px`;
        console.log(this.objects)
        console.log(this.state.frame)
        for (const key of Object.keys(this.objects[this.state.frame])) {
            this.objects[this.state.frame][key].setRatio(uiWindow.ratio)
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
                this.modalRef.current.open({
                    title: "Reset UI Window Size",
                    content: "Must reset UI window size after resize browser window.",
                    onOK: () => this.resetCanvasSize(),
                    okText: 'Reset',
                    type: 'info'
                })
            })
        }
    }

    onPropertiesChange(key, info) {
        if (this.state.selectedId === -2) {
            if (info.team !== this.state.uiWindow.team) {
                for (const key of Object.keys(this.objects[this.state.frame])) {
                    this.objects[this.state.frame][key].setTeam(info.team)
                }
                this.canvas.renderAll()
                this.objectsToData()
            }
            this.setState({uiWindow: info, properties: info}, () => {
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
                this.modalRef.current.open({
                    title: 'Warning',
                    content: 'Modify UI window width and height may cause unknown error.',
                    type: 'warning'
                })
            }
        } else if (this.state.selectedId !== -1) {
            this.objects[this.state.frame][this.state.selectedId].fromObject(info)
            this.canvas.renderAll()
            this.objectsToData()
        }
    }

    setBackground(url) {
        const that = this
        fabric.Image.fromURL(url, (image, _) => {
            that.background = image
            const ratio = that.state.uiWindow.ratio
            that.background?.set({scaleX: 1 / ratio, scaleY: 1 / ratio})
            if (that.state.uiWindow.backgroundImage) {
                that.canvas.setBackgroundImage(that.background)
                that.canvas.renderAll()
            }
        })
    }

    componentDidMount() {
        const that = this
        this.canvas = new fabric.Canvas('ui')
        this.setBackground(require("../assets/background.png"))
        this.canvas.backgroundColor = '#fff'

        window.addEventListener('resize', () => {
            this.onReSize();
        }, false);
        window.addEventListener('copy', e => {
            e.preventDefault()
            let info = null
            if (e.target.localName === 'input') {
                info = e.target.ariaValueNow
            } else if (that.state.selectedId !== -1 && that.state.selectedId !== -2) {
                info = JSON.stringify(that.state.data[that.state.selectedId])
            }
            e.clipboardData.setData('text', info)
        })
        window.addEventListener("paste", e => {
            e.preventDefault()
            if (e.clipboardData.items.length === 0) {
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
            } else {
                const items = e.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") === 0) {
                        const blob = items[i].getAsFile();
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            console.log(e)
                            that.setBackground(e.target.result)
                        };
                        reader.readAsDataURL(blob);
                    }
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
                for (const key of Object.keys(that.objects[that.state.frame])) {
                    that.objects[that.state.frame][key].resizeScale()
                }
                that.canvas.renderAll()
                that.objectsToData()
                const active = that.canvas.getActiveObject()
                setTimeout(()=>{
                    if (active) {
                        that.select(active.id)
                    } else {
                        that.select(-1)
                    }
                }, 100)
            },
            "mouse:move": (event) => {
                const pointer = this.canvas.getPointer(event.e);
                const ratio = this.state.uiWindow.ratio;
                const x = Math.round(pointer.x * ratio);
                const y = Math.round(pointer.y * ratio);
                const coordinateDisplay = document.getElementById('coordinateDisplay');
                coordinateDisplay.style.display = 'block';
                coordinateDisplay.textContent = `x: ${x}, y: ${y}`;
            },
            "mouse:out": () => {
                const coordinateDisplay = document.getElementById('coordinateDisplay');
                coordinateDisplay.style.display = 'none';
            },
        })
        this.canvas.selection = false

        readUiFile(
            localStorage.getItem('data'),
            (t, e) => this.onObjectEvent(t, e),
            frame => that.onFrameEvent('change', frame),
            () => this.canvas.renderAll()
        )
        this.resetCanvasSize()
    }

    upload() {
        const that = this
        this.uploadRef.current.upload('Upload Your .rmui File', '.rmui').then(file => {
            const reader = new FileReader()
            reader.onload = async e => {
                await that.reset()
                await readUiFile(
                    e.target.result,
                    (t, e) => that.onObjectEvent(t, e),
                    frame => that.onFrameEvent('change', frame),
                    () => that.canvas.renderAll()
                )
            }
            reader.readAsText(file)
        }).catch(_ => {
        })
    }

    objectsToData() {
        let data = {}
        for (const frame of Object.keys(this.objects)) {
            data[frame] = {}
            for (const key of Object.keys(this.objects[frame])) {
                const info = this.objects[frame][key].toObject()
                data[frame][info.id] = info
            }
        }
        this.setState({data: data[this.state.frame]})
        if (this.state.selectedId !== -1) {
            let _d = data[this.state.frame][this.state.selectedId]
            if (this.state.selectedId === -2) {
                _d = this.state.uiWindow
            }
            this.setState({
                properties: { ..._d }
            }, () => {
                this.propertiesRef.current?.reload()
            })
        }
        if (Object.keys(data).length !== 0) {
            let _data = {version: 2, data: data, selected: this.state.frame}
            localStorage.setItem('data', JSON.stringify(_data))
        }
    }

    onObjectEvent(type, obj) {
        const that = this

        function addObject(_obj, complete = true) {
            let options = {
                id: _obj.id,
                name: _obj.name,
                layer: _obj.layer,
                group: _obj.group,
                type: _obj.type,
                ratio: that.state.uiWindow.ratio,
                team: that.state.uiWindow.team,
            }
            let element = createUiElement(options)
            that.objects[that.state.frame][_obj.id] = element
            if (complete) {
                element.fromObject(_obj)
            }
            element.setRatio(that.state.uiWindow.ratio)

            const fabricObjs = that.canvas.getObjects()
            let ok = true
            for (const key of Object.keys(fabricObjs)) {
                if (fabricObjs[key].id === element.id) {
                    ok = false
                    break
                }
            }
            if (ok) {
            }
            that.canvas.add(element)
        }

        if (type === 'add') {
            if (!obj.id || this.objects[this.state.frame][obj.id]) {
                obj.id = this.getNewDataId()
                addObject(obj)
            }
        } else if (type === '_add') {
            obj.id = this.getNewDataId()
            obj.ratio = this.state.uiWindow.ratio
            obj.team = this.state.uiWindow.team
            addObject(obj, false)
        } else if (type === 'update') {
            if (this.objects[this.state.frame][obj.id]) {
                this.objects[this.state.frame][obj.id].fromObject(obj)
            }
        } else if (type === '_update') {
            if (obj.id >= 0 && this.objects[this.state.frame][obj.id]) {
                this.objects[this.state.frame][obj.id].fromObject(obj)
            } else {
                addObject(obj)
            }
        } else if (type === 'remove') {
            const id = obj.id
            if (this.objects[this.state.frame][id]) {
                this.select(-1)
                this.canvas.remove(this.objects[this.state.frame][id])
                this.canvas.renderAll()
                delete this.objects[this.state.frame][id]
                this.objectsToData()
            }
        }

        this.objectsToData()
        this.canvas.renderAll()
    }

    setFrame(frame) {
        if (!this.objects[frame]) {
            this.objects[frame] = {}
        }
        for (const it of Object.keys(this.objects[this.state.frame])) {
            this.canvas.remove(this.objects[this.state.frame][it])
        }
        this.canvas.renderAll()
        const that = this
        return new Promise((resolve, _) => {
            that.setState({frame}, () => {
                const fabricObjs = that.canvas.getObjects()
                for (const it of Object.keys(that.objects[that.state.frame])) {
                    let ok = true
                    for (const key of Object.keys(fabricObjs)) {
                        if (fabricObjs[key].id === that.objects[that.state.frame][it].id) {
                            ok = false
                            break
                        }
                    }
                    if (ok) {
                        that.canvas.add(that.objects[that.state.frame][it])
                    }
                }
                that.objectsToData()
                that.select(-1)
                that.canvas.renderAll()
                resolve()
            })
        })
    }

    async onFrameEvent(type, frame) {
        if (type === 'add') {
            this.objects[frame] = {}
            await this.setFrame(frame)
        } else if (type === 'remove') {
            if (Object.keys(this.objects).length === 1) {
                message.error('Cannot remove last frame!')
                return
            }
            const _frame = frame
            frame = Object.keys(this.objects)[0]
            if (frame === _frame) {
                frame = Object.keys(this.objects)[1]
            }
            await this.setFrame(frame)
            delete this.objects[_frame]
        } else if (type === 'change') {
            await this.setFrame(frame)
        } else if (type === 'copy') {
            this.objects[frame] = {}
            const old = this.objects[this.state.frame]
            await this.setFrame(frame)
            for (const key of Object.keys(old)) {
                this.onObjectEvent('_update', old[key].toObject())
            }
            this.objectsToData()
            this.canvas.renderAll()
        } else if (type === 'rename') {
            this.objects[frame] = this.objects[this.state.frame]
            delete this.objects[this.state.frame]
            this.setState({frame})
        }
        this.props.onFrameChange({frames: Object.keys(this.objects), selected: frame})
        this.objectsToData()
    }

    render() {
        this.canvas?.renderAll()
        return (
            <div className="full">
                <Row warp={false} className="container" gutter={12}
                     style={{paddingTop: 12, paddingLeft: 12, paddingBottom: 12}}>
                    <Col flex="300px">
                        <div style={{height: "50%", paddingBottom: 12}}>
                            <Elements
                                onSelect={e => this.select(e)}
                                onObjectEvent={(t, e) => this.onObjectEvent(t, e)}
                                onReset={() => this.reset()}
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
                                            ref={this.propertiesRef}
                                            key={this.state.selectedId}
                                            editable={
                                                this.props.editable ?
                                                    {
                                                        onSave: (key, info) =>
                                                            this.onPropertiesChange(key, info)
                                                    }
                                                    :
                                                    null
                                            }
                                            column={1}
                                            style={{marginTop: 4}}
                                        /> :
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                }
                                {
                                    this.state.selectedId === -2 ?
                                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                            <Button onClick={() =>
                                                this.uploadRef.current.upload(
                                                    'Upload Your Background Image',
                                                    'image/*'
                                                ).then(file => {
                                                    this.setState({imageUploadShow: false})
                                                    this.setBackground(createObjUrl(file))
                                                }).catch(_ => {
                                                })
                                            }>
                                                Upload Background
                                            </Button>
                                            <Button onClick={() =>
                                                this.setBackground(require("../assets/background.png"))
                                            }>
                                                Reset Background
                                            </Button>
                                        </Space> :
                                        <div/>
                                }
                            </div>
                        </Card>
                    </Col>
                    <Col flex="auto" ref={this.canvasRef}>
                        <canvas className="full" id="ui"/>
                        <div id="coordinateDisplay" style={{bottom: 0, right: 0, display: 'none'}}/>
                    </Col>
                </Row>
                <UpdateModal ref={this.uploadRef}/>
                <Generator ref={this.generatorRef}/>
                <WarningModal ref={this.modalRef} couldClose={false} />
            </div>
        );
    }
}

export default Render;
