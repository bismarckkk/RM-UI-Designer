import React, { Component, createRef } from 'react';
import { Button, Card, Empty, Space } from "antd";
import { message, modal } from "@/utils/app";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ProDescriptions } from '@ant-design/pro-components';
import Elements from "./elements";

import {fabric} from 'fabric'
import {getColumnsFromData} from "@/utils/columns";
import {createObjUrl, saveObj, uploadFile} from "@/utils/utils";
import {createUiElement} from "@/utils/fabricObjects";
import {readUiFile} from "@/utils/rmuiReader";
import History from "@/utils/history";
import lodash from 'lodash'

class Render extends Component {
    objects = {default: {}}
    data = {}
    state = {
        properties: null,
        selectedId: [],
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
    propertiesRef = createRef()
    background = null
    his = new History()

    getNewDataId() {
        if (Object.keys(this.state.data).length === 0) {
            return 0
        }
        return Math.max(...Object.keys(this.state.data)) + 1
    }

    save() {
        saveObj(this.data, 'ui.rmui', this.state.frame)
    }

    updateHistory() {
        setTimeout(() => {
            let _data = {version: 2, data: this.data, selected: this.state.frame}
            if (!lodash.isEqual(_data, this.his.now)) {
                this.his.update(_data)
                this.props.setCouldDo({couldNext: false, couldPrevious: true})
            }
        }, 100)
    }

    getData() {
        return this.data
    }

    select(ids, fromCanvas) {
        if (ids.length === 0) {
            this.setState({properties: null, selectedId: []})
            this.canvas.discardActiveObject()
            this.canvas.renderAll()
        } else if (ids[0] === -2) {
            this.setState({properties: this.state.uiWindow, selectedId: [-2]})
            this.canvas.discardActiveObject()
            this.canvas.renderAll()
        } else {
            if (ids.length === 1) {
                this.setState({properties: this.state.data[ids[0]], selectedId: [ids[0]]})
                this.canvas.setActiveObject(this.objects[this.state.frame][ids[0]])
                this.canvas.renderAll()
            } else {
                this.setState({properties: null, selectedId: ids})
                if(!fromCanvas) {
                    let objectsToSelect = ids.map(id => this.objects[this.state.frame][id])
                    let activeSelection = new fabric.ActiveSelection(objectsToSelect, {canvas: this.canvas, hasControls: false});
                    this.canvas.setActiveObject(activeSelection)
                    this.canvas.renderAll()
                }
            }
        }
    }

    async reset() {
        this.canvas.clear()
        this.canvas.backgroundColor = '#fff'
        this.setBackground(require("../../assets/background.png"))
        if (!Object.keys(this.objects).includes('default')) {
            await this.onFrameEvent('add', 'default')
        }
        this.objects.default = {}
        await this.onFrameEvent('change', 'default')
        this.objects = {default: {}}
        this.props.onFrameChange({frames: ['default'], selected: 'default'})
        this.select([])
        this.resetCanvasSize()
        this.objectsToData()
    }

    resetCanvasSize() {
        if (this.canvas) {
            let width = this.canvasRef.current.clientWidth
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
            this.canvas.viewportTransform[5] = height;
            this.canvas.viewportTransform[3] = -1;
            const parentWidth = this.canvasRef.current.clientWidth;
            const parentHeight = this.canvasRef.current.clientHeight;
            const right = parentWidth - width;
            const bottom = parentHeight - height;
            const coordinateDisplay = document.getElementById('coordinateDisplay');
            coordinateDisplay.style.right = `${right+12}px`;
            coordinateDisplay.style.bottom = `${bottom+25}px`;
            for (const key of Object.keys(this.objects[this.state.frame])) {
                this.objects[this.state.frame][key].setRatio(uiWindow.ratio)
            }
            this.background?.set({scaleX: 1 / uiWindow.ratio, scaleY: 1 / uiWindow.ratio})
            this.canvas.renderAll()
            this.objectsToData()
            this.setState({infoModalShow: false})
        }
    }

    onPropertiesChange(key, info) {
        if (this.state.selectedId[0] === -2) {
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
                modal.warning({
                    title: 'Warning',
                    content: 'Modify UI window width and height may cause unknown error.',
                })
            }
        } else if (this.state.selectedId.length === 1) {
            this.objects[this.state.frame][this.state.selectedId[0]].fromObject(info)
            this.canvas.renderAll()
            this.objectsToData()
            this.updateHistory()
        }
    }

    setBackground(url) {
        const that = this
        fabric.Image.fromURL(url, (image, _) => {
            that.background = image
            const ratio = that.state.uiWindow.ratio
            that.background?.set({scaleX: 1 / ratio, scaleY: -1 / ratio})
            if (that.state.uiWindow.backgroundImage) {
                that.canvas.setBackgroundImage(that.background)
                that.canvas.renderAll()
            }
        })
    }

    componentDidMount() {
        const that = this
        this.canvas = new fabric.Canvas('ui')
        this.setBackground(require("../../assets/background.png"))
        this.canvas.backgroundColor = '#fff'

        window.addEventListener('resize', () => {
            this.resetCanvasSize();
        }, false);
        window.addEventListener('copy', e => {
            let info = null
            if (e.target.localName !== 'input' && that.state.selectedId.length !== 0 && that.state.selectedId[0] !== -2) {
                e.preventDefault()
                info = JSON.stringify(that.state.selectedId.map(id => that.state.data[id]))
                e.clipboardData.setData('text', info)
            }
        })
        window.addEventListener("paste", e => {
            let findImage = false
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    e.preventDefault()
                    findImage = true
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        that.setBackground(e.target.result)
                    };
                    reader.readAsDataURL(blob);
                }
            }
            if (!findImage) {
                if (e.target.localName !== 'input') {
                    try {
                        e.preventDefault()
                        let str = e.clipboardData.getData('text')
                        let data = JSON.parse(str)
                        if (!Array.isArray(data)) {
                            data = [data]
                        }
                        let ids = []
                        let times = 20
                        for (const obj of data) {
                            setTimeout(() => {
                                obj.id = that.getNewDataId()
                                ids.push(obj.id)
                                that.onObjectEvent('_update', obj)
                            }, times)
                            times += 20
                        }
                        setTimeout(() => {
                            that.select(ids)
                            this.updateHistory()
                        }, times)
                    } catch (e) {
                        message.warning('Invalid data')
                    }
                }
            }
        })
        window.addEventListener('keyup', e => {
            if (e.key === "Delete" && that.state.selectedId.length !== 0 && that.state.selectedId[0] !== -2) {
                for (let id of that.state.selectedId) {
                    that.onObjectEvent('remove', { id })
                }
                this.updateHistory()
            }
        })
        this.canvas.on({
            "mouse:up": () => {
                for (const key of Object.keys(that.objects[that.state.frame])) {
                    that.objects[that.state.frame][key].resizeScale()
                }
                that.canvas.renderAll()
                that.objectsToData()
                this.updateHistory()
                const active = that.canvas.getActiveObject()
                setTimeout(()=>{
                    if (active) {
                        if (active instanceof fabric.ActiveSelection) {
                            let ids = active.getObjects().map(obj => obj.id);
                            that.select(ids, true);
                        } else {
                            that.select([active.id]);
                        }
                    } else {
                        that.select([])
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
            }
        })

        const state = this.his.get()
        this.props.setCouldDo(state)
        readUiFile(
            state.now,
            (t, e) => this.onObjectEvent(t, e),
            frame => that.onFrameEvent('change', frame),
            () => this.canvas.renderAll()
        )
        this.his.cancelUpdate()
        this.resetCanvasSize()
    }

    upload() {
        const that = this
        uploadFile('.rmui').then(file => {
            const reader = new FileReader()
            reader.onload = async e => {
                await that.reset()
                await readUiFile(
                    JSON.parse(e.target.result),
                    (t, e) => that.onObjectEvent(t, e),
                    frame => that.onFrameEvent('change', frame),
                    () => that.canvas.renderAll()
                )
                that.objectsToData()
                that.his.reset({version: 2, data: this.data, selected: this.state.frame})
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
        this.data = data
        this.setState({data: data[this.state.frame]})
        if (this.state.selectedId.length === 1) {
            let _d
            if (this.state.selectedId[0] === -2) {
                _d = this.state.uiWindow
            } else {
                _d = data[this.state.frame][this.state.selectedId[0]]
            }
            this.setState({
                properties: { ..._d }
            }, () => {
                this.propertiesRef.current?.reload()
            })
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
                this.select([])
                this.canvas.remove(this.objects[this.state.frame][id])
                this.canvas.renderAll()
                delete this.objects[this.state.frame][id]
                this.objectsToData()
            }
        } else if (type === 'setAttr') {
            if (this.objects[this.state.frame][obj.id]) {
                this.objects[this.state.frame][obj.id].set(obj.payload)
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
                that.select([])
                that.canvas.renderAll()
                resolve()
            })
        })
    }

    async onHistoryEvent(type) {
        if (type === 'update') {
            this.updateHistory()
            return
        } else if (type === 'reset') {
            this.his.reset({version: 2, data: {default: {}}, selected: 'default'})
            return
        }
        let state
        if (type === 'previous') {
            state = this.his.previous()
        } else if (type === 'next') {
            state = this.his.next()
        }
        console.log(state)
        this.props.setCouldDo(state)
        await this.reset()
        await readUiFile(
            state.now,
            (t, e) => this.onObjectEvent(t, e),
            frame => this.onFrameEvent('change', frame),
            () => this.canvas.renderAll()
        )
        this.his.cancelUpdate()
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
            if (this.state.frame === frame) {
                frame = Object.keys(this.objects)[0]
                if (frame === _frame) {
                    frame = Object.keys(this.objects)[1]
                }
                await this.setFrame(frame)
            }
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
            const old_frame = this.state.frame
            await this.onFrameEvent('copy', frame)
            await this.onFrameEvent('remove', old_frame)
        }
        this.props.onFrameChange({frames: Object.keys(this.objects), selected: frame})
        this.objectsToData()
        this.updateHistory()
    }

    render() {
        this.canvas?.renderAll()
        return (
            <div style={{width: '100vw', height: 'calc(100% - 20px)', padding: 10}}>
                <PanelGroup autoSaveId="container_h" className="container" direction="horizontal">
                    <Panel defaultSize={25} minSize={15} maxSize={45} order={1}>
                        <PanelGroup autoSaveId="card_v" className="full" direction="vertical">
                            <Panel defaultSize={50} minSize={25} maxSize={75}>
                                <Elements
                                    onSelect={e => this.select(e)}
                                    onObjectEvent={(t, e) => this.onObjectEvent(t, e)}
                                    onReset={() => this.reset()}
                                    data={this.state.data}
                                    editable={this.props.editable}
                                    selectedId={this.state.selectedId}
                                />
                            </Panel>
                            <PanelResizeHandle className="panel-resize-handle" style={{height: 6}} />
                            <Panel defaultSize={50}>
                                <Card size="small" title="Properties" style={{height: "100%"}}>
                                    <div className="card-body">
                                        {
                                            this.state.properties ?
                                                <ProDescriptions
                                                    dataSource={this.state.properties}
                                                    columns={getColumnsFromData(this.state.properties)}
                                                    ref={this.propertiesRef}
                                                    key={this.state.selectedId[0]}
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
                                            this.state.selectedId[0] === -2 ?
                                                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                                                    <Button onClick={() =>
                                                        uploadFile(
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
                                                        this.setBackground(require("../../assets/background.png"))
                                                    }>
                                                        Reset Background
                                                    </Button>
                                                </Space> :
                                                <div/>
                                        }
                                    </div>
                                </Card>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle className="panel-resize-handle" style={{width: 6}} />
                    <Panel defaultSize={75} order={2} onResize={(_)=>setTimeout(()=>this.resetCanvasSize(), 100)}>
                        <div className="full" ref={this.canvasRef}>
                            <canvas className="full" id="ui"/>
                            <div id="coordinateDisplay" style={{bottom: 0, right: 0, display: 'none', padding: "1px 6px 1px 6px"}}/>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        );
    }
}

export default Render;
