import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Card, Empty, Space } from "antd";
import {message, modal, rid, setRid} from "@/utils/app";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ProDescriptions } from '@ant-design/pro-components';
import Elements from "./elements";

import {fabric} from 'fabric'
import {getColumnsFromData} from "@/utils/columns";
import {createObjUrl, saveObj, uploadFile, isEditable} from "@/utils/utils";
import {createUiElement} from "@/utils/fabricObjects";
import {readUiFile} from "@/utils/rmuiReader";
import type { UiFile } from "@/utils/rmuiReader";
import History from "@/utils/history";
import lodash from 'lodash'
import backgroundUrl from '@/assets/background.png?url'

type UiElement = fabric.Object & {
    id: number | string;
    layer: number;
    setRatio: (ratio: number) => void;
    setTeam: (team: string) => void;
    resizeScale: () => void;
    fromObject: (obj: unknown) => void;
    toObject: () => Record<string, unknown> & { id: number | string };
};

type RenderProps = {
    style?: React.CSSProperties;
    editable?: boolean;
    onFrameChange: (payload: { frames: string[]; selected: string }) => void;
    setCouldDo: (payload: { couldNext: boolean; couldPrevious: boolean }) => void;
    setRobotId: (id: number) => void;
};

export type RenderRefApi = {
    save: () => void;
    onObjectEvent: (type: string, payload: unknown) => string;
    onHistoryEvent: (type: string) => Promise<void>;
    reset: (noBackgroundUpdate?: boolean) => Promise<void>;
    onFrameEvent: (type: string, frame: string) => Promise<void>;
    upload: (file: File) => void;
    getData: () => Record<string, Record<string | number, unknown>>;
    setEditable: (editable: boolean) => Promise<void>;
};

type RenderState = {
    properties: Record<string, unknown> | null;
    selectedId: Array<number | string>;
    frame: string;
    uiWindow: {
        height: number;
        width: number;
        ratio: number;
        team: string;
        role: number;
        backgroundImage: boolean;
    };
    infoModalShow: boolean;
    data: Record<string | number, unknown>;
    editable: boolean;
    imageUploadShow?: boolean;
};

type UiWindow = RenderState['uiWindow'];
type UiObjectPayload = Record<string, unknown> & { id?: number | string; layer?: number; payload?: Record<string, unknown> };

class RenderController {
    props: RenderProps
    notify: () => void
    objects: Record<string, Record<string | number, UiElement>> = {default: {}}
    data: Record<string, Record<string | number, unknown>> = {}
    state: RenderState = {
        properties: null,
        selectedId: [],
        frame: "default",
        uiWindow: {
            height: 1080,
            width: 1920,
            ratio: 1,
            team: 'red',
            role: 1,
            backgroundImage: true
        },
        infoModalShow: false,
        data: {},
        editable: true,
        imageUploadShow: false
    }
    canvas!: fabric.Canvas
    canvasRef = createRef<HTMLDivElement>()
    background: fabric.Image | null = null
    his = new History()
    moveTimer: ReturnType<typeof setInterval> | null = null
    moveTimeout: ReturnType<typeof setTimeout> | null = null

    constructor(props: RenderProps, notify: () => void) {
        this.props = props
        this.notify = notify
    }

    setState(update: Partial<RenderState> | ((prev: RenderState) => Partial<RenderState>), cb?: () => void) {
        const next = typeof update === 'function' ? update(this.state) : update
        this.state = {...this.state, ...next}
        this.notify()
        cb && cb()
    }

    getNewDataId() {
        if (Object.keys(this.state.data).length === 0) {
            return 0
        }
        return Math.max(...Object.keys(this.state.data).map((key) => Number(key))) + 1
    }

    async setEditable(editable: boolean) {
        this.setState({editable})
        this.his.catchUpdate = editable
        this.canvas.selection = editable
        fabric.Object.prototype.selectable = editable

        if (editable) {
            await this.onHistoryEvent('refresh')
        } else {
            const rid = this.state.uiWindow.role
            await this.reset(true)
            this.cancelHistoryUpdate()
            this.props.setCouldDo({couldNext: false, couldPrevious: false})
            this.setRobotId(rid)
        }

        const objs = this.canvas.getObjects()
        for (const obj of objs) {
            obj.set('selectable', editable)
        }

        this.select([])
    }

    setRobotId(id = 0) {
        if (id === 0) {
            id = this.state.uiWindow.role
        }
        if (typeof id === 'string') {
            id = parseInt(id)
        }
        if (this.state.uiWindow.team === 'blue') {
            id += 100
        }
        setRid(id)
    }

    cancelHistoryUpdate() {
        this.his.cancelUpdate()
        setTimeout(() => {
            this.his.cancelUpdate()
            this.props.setCouldDo(this.his.get())
        }, 200)
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

    select(ids: Array<number | string>, fromCanvas = false) {
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
                this.setState({properties: this.state.data[ids[0]] as Record<string, unknown>, selectedId: [ids[0]]})
                this.canvas.setActiveObject(this.objects[this.state.frame][ids[0]])
                this.canvas.renderAll()
            } else {
                this.setState({properties: null, selectedId: ids})
                if(!fromCanvas) {
                    const objectsToSelect = ids.map((id) => this.objects[this.state.frame][id])
                    let activeSelection = new fabric.ActiveSelection(objectsToSelect, {canvas: this.canvas});
                    this.canvas.setActiveObject(activeSelection)
                    this.canvas.renderAll()
                }
            }
        }
    }

    async reset(noBackgroundUpdate = false) {
        if (noBackgroundUpdate) {
            let objects = this.canvas.getObjects();
            for (let i in objects) {
                this.canvas.remove(objects[i]);
            }
            this.canvas.renderAll();
        } else {
            this.canvas.clear()
            this.setBackground(backgroundUrl)
            this.canvas.backgroundColor = '#fff'
        }
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
        if (this.canvas && this.canvasRef.current) {
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
            const viewportTransform = this.canvas.viewportTransform
            if (viewportTransform) {
                viewportTransform[5] = height;
                viewportTransform[3] = -1;
            }
            const parentWidth = this.canvasRef.current.clientWidth;
            const parentHeight = this.canvasRef.current.clientHeight;
            const right = parentWidth - width;
            const bottom = parentHeight - height;
            const coordinateDisplay = document.getElementById('coordinateDisplay');
            if (coordinateDisplay) {
                coordinateDisplay.style.right = `${right+20}px`;
                coordinateDisplay.style.bottom = `${bottom+12}px`;
            }
            for (const key of Object.keys(this.objects[this.state.frame])) {
                this.objects[this.state.frame][key].setRatio(uiWindow.ratio)
            }
            this.background?.set({scaleX: 1 / uiWindow.ratio, scaleY: 1 / uiWindow.ratio})
            this.canvas.renderAll()
            this.objectsToData()
            this.setState({infoModalShow: false})
        }
    }

    onPropertiesChange(key: React.Key, info: Record<string, unknown>) {
        const uiInfo = info as UiWindow
        if (this.state.selectedId[0] === -2) {
            if (uiInfo.team !== this.state.uiWindow.team) {
                for (const key of Object.keys(this.objects[this.state.frame])) {
                    this.objects[this.state.frame][key].setTeam(uiInfo.team)
                }
                this.canvas.renderAll()
                this.objectsToData()
            }
            this.setState({uiWindow: uiInfo, properties: info}, () => {
                this.resetCanvasSize()
                this.setRobotId()
            })
            if (uiInfo.backgroundImage !== this.state.uiWindow.backgroundImage) {
                if (uiInfo.backgroundImage) {
                    const ratio = this.state.uiWindow.ratio
                    this.background?.set({scaleX: 1 / ratio, scaleY: 1 / ratio})
                    this.canvas.setBackgroundImage(this.background as fabric.Image, this.canvas.renderAll.bind(this.canvas))
                    this.canvas.renderAll()
                } else {
                    this.canvas.backgroundImage = undefined
                    this.canvas.renderAll()
                }
            }
            if (uiInfo.width !== this.state.uiWindow.width || uiInfo.height !== this.state.uiWindow.height) {
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

    setBackground(url: string) {
        const that = this
        fabric.Image.fromURL(url, (image: fabric.Image) => {
            that.background = image
            const ratio = that.state.uiWindow.ratio
            that.background?.set({scaleX: 1 / ratio, scaleY: -1 / ratio})
            if (that.state.uiWindow.backgroundImage) {
                that.canvas.setBackgroundImage(that.background, that.canvas.renderAll.bind(that.canvas))
                that.canvas.renderAll()
            }
        })
    }

    componentDidMount() {
        const that = this
        this.canvas = new fabric.Canvas('ui')
        this.setBackground(backgroundUrl)
        this.canvas.backgroundColor = '#fff'

        window.addEventListener('resize', () => {
            this.resetCanvasSize();
        }, false);
        window.addEventListener('copy', (e: ClipboardEvent) => {
            let info = null
            console.log(e.target,isEditable(e.target as HTMLElement))
            if (!isEditable(e.target as HTMLElement) && that.state.selectedId.length !== 0 && that.state.selectedId[0] !== -2) {
                e.preventDefault()
                info = JSON.stringify(that.state.selectedId.map(id => that.state.data[id]))
                e.clipboardData?.setData('text', info)
            }
        })
        window.addEventListener("paste", (e: ClipboardEvent) => {
            let findImage = false
            if (!e.clipboardData) {
                return
            }
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    e.preventDefault()
                    findImage = true
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const result = e.target?.result
                        if (typeof result === 'string') {
                            that.setBackground(result)
                        }
                    };
                    if (blob) {
                        reader.readAsDataURL(blob);
                    }
                }
            }
            if (!findImage) {
                if (!isEditable(e.target as HTMLElement)) {
                    try {
                        e.preventDefault()
                        const str = e.clipboardData.getData('text')
                        let data: Array<Record<string, unknown>> | Record<string, unknown> = JSON.parse(str)
                        if (!Array.isArray(data)) {
                            data = [data]
                        }
                        const ids: Array<number | string> = []
                        let times = 20
                        for (const obj of data) {
                            setTimeout(() => {
                                obj.id = that.getNewDataId()
                                if (typeof obj.id === 'number' || typeof obj.id === 'string') {
                                    ids.push(obj.id)
                                }
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
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === "Delete" && that.state.selectedId.length !== 0 && that.state.selectedId[0] !== -2) {
                for (let id of that.state.selectedId) {
                    that.onObjectEvent('remove', { id })
                }
                this.updateHistory()
            }
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.onHistoryEvent('previous');
            }
            else if (e.ctrlKey && e.key.toLowerCase() === 'z' && e.shiftKey) {
                e.preventDefault();
                this.onHistoryEvent('next');
            }

            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && !isEditable(e.target as HTMLElement)) {
                const active = that.canvas.getActiveObject()
                if (!active) return;
                const currentActive = active
                e.preventDefault();
                function move(key: string, shiftAmount: number) {
                    shiftAmount *= that.state.uiWindow.ratio
                    const top = currentActive.top ?? 0
                    const left = currentActive.left ?? 0
                    switch (key) {
                        case "ArrowUp":
                            currentActive.top = top + shiftAmount;
                            break;
                        case "ArrowDown":
                            currentActive.top = top - shiftAmount;
                            break;
                        case "ArrowLeft":
                            currentActive.left = left - shiftAmount;
                            break;
                        case "ArrowRight":
                            currentActive.left = left + shiftAmount;
                            break;
                    }
                    if (currentActive instanceof fabric.ActiveSelection) {
                        currentActive.getObjects().forEach(obj => {
                            const uiObj = obj as UiElement
                            obj.setCoords();
                            uiObj.resizeScale()
                        });
                    } else {
                        const uiObj = currentActive as UiElement
                        currentActive.setCoords();
                        uiObj.resizeScale()
                    }
                    that.canvas.renderAll();
                    that.objectsToData()
                    that.updateHistory()
                }
                move(e.key, 2)
                if (this.moveTimeout) clearTimeout(this.moveTimeout);
                if (this.moveTimer) clearInterval(this.moveTimer);
                this.moveTimeout = setTimeout(() => {
                    this.moveTimer = setInterval(() => {
                        move(e.key, 1)
                    }, 500)
                }, 1500)
            }
        })
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                if (this.moveTimeout !== null) {
                    clearTimeout(this.moveTimeout);
                }
                if (this.moveTimer !== null) {
                    clearInterval(this.moveTimer);
                }
            }
        });

        this.canvas.on("mouse:up", () => {
                for (const key of Object.keys(that.objects[that.state.frame])) {
                    that.objects[that.state.frame][key].resizeScale()
                }
                that.canvas.renderAll()
                that.objectsToData()
                that.updateHistory()
                const active = that.canvas.getActiveObject()
                setTimeout(()=>{
                    if (active) {
                        if (active instanceof fabric.ActiveSelection) {
                            const ids = active.getObjects().map(obj => (obj as UiElement).id);
                            that.select(ids, true);
                        } else {
                            that.select([(active as UiElement).id]);
                        }
                    } else {
                        that.select([])
                    }
                }, 100)
        })
        this.canvas.on("mouse:move", (event) => {
                const pointer = this.canvas.getPointer(event.e);
                const ratio = this.state.uiWindow.ratio;
                const x = Math.round(pointer.x * ratio);
                const y = Math.round(pointer.y * ratio);
                const coordinateDisplay = document.getElementById('coordinateDisplay');
                if (coordinateDisplay) {
                    coordinateDisplay.style.display = 'block';
                    coordinateDisplay.textContent = `x: ${x}, y: ${y}`;
                }
        })
        this.canvas.on("mouse:out", () => {
                const coordinateDisplay = document.getElementById('coordinateDisplay');
                if (coordinateDisplay) {
                    coordinateDisplay.style.display = 'none';
                }
        })

        setTimeout(() => {
            const state = this.his.get()
            if (!state.now) {
                return
            }
            this.props.setCouldDo(state)
            readUiFile(
                state.now as UiFile,
                (t: string, e: unknown) => this.onObjectEvent(t, e),
                (frame: string) => that.onFrameEvent('change', frame),
                () => this.canvas.renderAll()
            ).then(() => {
                this.setRobotId()
                this.resetCanvasSize()
            })
            this.cancelHistoryUpdate()
        }, 50)

        setTimeout(() => {
            const state = this.his.get()
            if (!state.now) {
                return
            }
            this.props.setCouldDo(state)
            readUiFile(
                state.now as UiFile,
                (t: string, e: unknown) => this.onObjectEvent(t, e),
                (frame: string) => that.onFrameEvent('change', frame),
                () => this.canvas.renderAll()
            ).then(() => {
                this.setRobotId()
                this.resetCanvasSize()
            })
            this.cancelHistoryUpdate()
        }, 200)

        window.dispatch = (type: string, payload: unknown) => {
            this.onObjectEvent(type, payload)
        }
    }

    upload(file: File) {
        const that = this
        const reader = new FileReader()
        reader.onload = async e => {
            const result = e.target?.result
            if (typeof result !== 'string') {
                return
            }
            await that.reset()
            await readUiFile(
                JSON.parse(result),
                (t: string, e: unknown) => that.onObjectEvent(t, e),
                (frame: string) => that.onFrameEvent('change', frame),
                () => that.canvas.renderAll()
            ).then(() => {
                this.setRobotId()
            })
            that.objectsToData()
            that.his.reset({version: 2, data: this.data, selected: this.state.frame})
        }
        reader.readAsText(file)
    }

    objectsToData() {
        const data: Record<string, Record<string | number, unknown>> = {}
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
            let _d: unknown
            if (this.state.selectedId[0] === -2) {
                _d = this.state.uiWindow
            } else {
                _d = data[this.state.frame][this.state.selectedId[0]]
            }
            this.setState({
                properties: typeof _d === 'object' && _d !== null ? { ...(_d as Record<string, unknown>) } : null
            })
        }
    }

    onObjectEvent(type: string, obj: unknown) {
        const that = this
        const getObjId = (payload: UiObjectPayload): number | string | null => {
            if (typeof payload.id === 'number' || typeof payload.id === 'string') {
                return payload.id
            }
            return null
        }

        function addObject(_obj: UiObjectPayload, complete = true) {
            const objId = getObjId(_obj)
            if (objId === null) {
                return
            }
            let options = {
                id: Number(objId),
                name: _obj.name as string,
                layer: _obj.layer as number,
                group: _obj.group as string,
                type: _obj.type as string,
                ratio: that.state.uiWindow.ratio,
                team: that.state.uiWindow.team,
            }
            const element = createUiElement(options) as UiElement
            that.objects[that.state.frame][objId] = element
            if (complete) {
                element.fromObject(_obj)
            }
            element.setRatio(that.state.uiWindow.ratio)

            that.canvas.add(element)
        }

        const targetObj = obj as UiObjectPayload
        const targetId = getObjId(targetObj)
        if (type === 'add') {
            if (typeof targetId === 'number' && targetId >= 0 && !this.objects[this.state.frame][targetId]) {
                addObject(targetObj, true)
            } else {
                console.log('id exists', targetId)
                return `W: Adding Object ${String(targetId)} exists`
            }
        } else if (type === '_add') {
            targetObj.id = this.getNewDataId()
            targetObj.ratio = this.state.uiWindow.ratio
            targetObj.team = this.state.uiWindow.team
            addObject(targetObj, false)
        } else if (type === 'update') {
            if (targetId !== null && this.objects[this.state.frame][targetId]) {
                this.objects[this.state.frame][targetId].fromObject(targetObj)
            } else {
                return `E: Updating object ${String(targetId)} not exists`
            }
        } else if (type === '_update') {
            if (typeof targetId === 'number' && targetId >= 0 && this.objects[this.state.frame][targetId]) {
                this.objects[this.state.frame][targetId].fromObject(targetObj)
            } else {
                addObject(targetObj)
            }
        } else if (type === 'remove') {
            const id = targetId
            if (id === null) {
                return 'E: Remove object invalid id'
            }
            if (this.objects[this.state.frame][id]) {
                this.select([])
                this.canvas.remove(this.objects[this.state.frame][id])
                this.canvas.renderAll()
                delete this.objects[this.state.frame][id]
                this.objectsToData()
            } else {
                return `E: Remove object ${id} not exists`
            }
        } else if (type === 'setAttr') {
            if (targetId !== null && this.objects[this.state.frame][targetId] && targetObj.payload) {
                this.objects[this.state.frame][targetId].set(targetObj.payload)
            }
        } else if (type === 'removeLayer') {
            for (const key of Object.keys(this.objects[this.state.frame])) {
                if (this.objects[this.state.frame][key].layer === targetObj.layer) {
                    this.onObjectEvent('remove', {id: key})
                }
            }
        } else if (type === 'removeAll') {
            this.reset(true)
        }

        this.objectsToData()
        this.canvas.renderAll()
        return 'S'
    }

    setFrame(frame: string) {
        if (!this.objects[frame]) {
            this.objects[frame] = {}
        }
        for (const it of Object.keys(this.objects[this.state.frame])) {
            this.canvas.remove(this.objects[this.state.frame][it])
        }
        this.canvas.renderAll()
        const that = this
        return new Promise<void>((resolve) => {
            that.setState({frame}, () => {
                const fabricObjs = that.canvas.getObjects()
                for (const it of Object.keys(that.objects[that.state.frame])) {
                    let ok = true
                    for (const fabricObj of fabricObjs) {
                        if ((fabricObj as UiElement).id === that.objects[that.state.frame][it].id) {
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

    async onHistoryEvent(type: string) {
        let state = this.his.get()
        if (type === 'update') {
            this.updateHistory()
            return
        } else if (type === 'reset') {
            state = this.his.reset({version: 2, data: {default: {}}, selected: 'default'})
            this.props.setCouldDo(state)
            return
        } else if (type === 'resetNow') {
            state = this.his.reset({version: 2, data: this.data, selected: this.state.frame})
            this.props.setCouldDo(state)
            return
        }
        if (type === 'previous') {
            state = this.his.previous()
        } else if (type === 'next') {
            state = this.his.next()
        }
        this.props.setCouldDo(state)
        await this.reset(true)
        if (!state.now) {
            return
        }
        await readUiFile(
            state.now as UiFile,
            (t: string, e: unknown) => this.onObjectEvent(t, e),
            (frame: string) => this.onFrameEvent('change', frame),
            () => this.canvas.renderAll()
        ).then(() => {
            this.setRobotId()
        })
        this.cancelHistoryUpdate()
        this.props.setCouldDo(state)
    }

    async onFrameEvent(type: string, frame: string) {
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
            <div style={{width: 'calc(100% - 10px)', height: 'calc(100% - 20px)', padding: 10}}>
                <PanelGroup autoSaveId="container_h" className="container" direction="horizontal" style={{width: 'calc(100% - 10px)'}}>
                    <Panel defaultSize={25} minSize={15} maxSize={45} order={1}>
                        <PanelGroup autoSaveId="card_v" className="full" direction="vertical">
                            <Panel defaultSize={50} minSize={25} maxSize={75}>
                                <Elements
                                    onSelect={(e: Array<number | string>) => this.select(e)}
                                    onObjectEvent={(t: string, e: unknown) => this.onObjectEvent(t, e)}
                                    onReset={() => this.reset()}
                                    data={this.state.data as Record<string, { id: number; name: string; [key: string]: unknown }>}
                                    editable={this.state.editable}
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
                                                    key={this.state.selectedId[0]}
                                                    editable={
                                                        this.props.editable ?
                                                            {
                                                                onSave: async (key, info) => {
                                                                    this.onPropertiesChange(key as React.Key, info)
                                                                    return info
                                                                }
                                                            }
                                                            :
                                                            undefined
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
                                                            const url = createObjUrl(file)
                                                            if (url) {
                                                                this.setBackground(url)
                                                            }
                                                        }).catch(_ => {
                                                        })
                                                    }>
                                                        Upload Background
                                                    </Button>
                                                    <Button onClick={() =>
                                                        this.setBackground(backgroundUrl)
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

const Render = forwardRef<RenderRefApi, RenderProps>((props, ref) => {
    const [, setTick] = useState(0)
    const controllerRef = useRef<RenderController | null>(null)
    if (!controllerRef.current) {
        controllerRef.current = new RenderController(props, () => setTick((x) => x + 1))
    }
    controllerRef.current.props = props

    useImperativeHandle(ref, () => controllerRef.current as RenderRefApi)

    useEffect(() => {
        controllerRef.current?.componentDidMount?.()
    }, [])

    return controllerRef.current?.render() ?? null
})

export default Render;
