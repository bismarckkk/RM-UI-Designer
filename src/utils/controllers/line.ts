import { fabric } from "fabric";
import { ColorMap } from "../utils";

type ColorKey = keyof typeof ColorMap;
type LineOptions = {
    id: number;
    name: string;
    layer: number;
    groupName: string;
    ratio: number;
    color: ColorKey | 'main';
    team: ColorKey;
    x: number;
    y: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    lineWidth: number;
    strokeWidth: number;
    stroke?: string;
    fill?: string | null;
    lockRotation?: boolean;
    lockScalingFlip?: boolean;
    hasRotatingPoint?: boolean;
    group?: string;
};

type UiLine = fabric.Line & {
    ratio: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    pathOffset?: fabric.Point;
    controls: { [key: string]: fabric.Control };
};

type ControlTransform = fabric.Transform & {
    lineRotateDelta?: number;
};

const getLinePathOffset = (line: UiLine) => {
    if (line.pathOffset) {
        return line.pathOffset
    }
    return new fabric.Point((line.x1 + line.x2) / 2, (line.y1 + line.y2) / 2)
}

const endpointPositionHandler = (which: 'start' | 'end') => {
    return (
        _dim: fabric.Point,
        finalMatrix: number[],
        fabricObject: fabric.Object
    ) => {
        const line = fabricObject as UiLine & { calcLinePoints?: () => { x1: number; y1: number; x2: number; y2: number } }
        const localLinePoints = line.calcLinePoints ? line.calcLinePoints() : null
        const pathOffset = getLinePathOffset(line)
        const localX = which === 'start'
            ? (localLinePoints ? localLinePoints.x1 : line.x1 - pathOffset.x)
            : (localLinePoints ? localLinePoints.x2 : line.x2 - pathOffset.x)
        const localY = which === 'start'
            ? (localLinePoints ? localLinePoints.y1 : line.y1 - pathOffset.y)
            : (localLinePoints ? localLinePoints.y2 : line.y2 - pathOffset.y)
        return fabric.util.transformPoint(new fabric.Point(localX, -localY), finalMatrix)
    }
}

const endpointActionHandler = (which: 'start' | 'end') => {
    return (
        eventData: MouseEvent,
        transform: ControlTransform,
        x: number,
        y: number
    ) => {
        const line = transform.target as UiLine
        const canvasPointer = line.canvas?.getPointer(eventData)
        const targetX = Math.round(((canvasPointer?.x ?? x) * line.ratio)) / line.ratio
        const targetY = Math.round(((canvasPointer?.y ?? y) * line.ratio)) / line.ratio

        if (which === 'start') {
            line.set('x1', targetX)
            line.set('y1', targetY)
        } else {
            line.set('x2', targetX)
            line.set('y2', targetY)
        }

        line.setCoords()
        if (line.canvas) {
            line.canvas.requestRenderAll()
        }
        return true
    }
}

const rotatePositionHandler = (
    _dim: fabric.Point,
    finalMatrix: number[],
    fabricObject: fabric.Object
) => {
    const line = fabricObject as UiLine & { calcLinePoints?: () => { x1: number; y1: number; x2: number; y2: number } }
    const localLinePoints = line.calcLinePoints ? line.calcLinePoints() : null
    const pathOffset = getLinePathOffset(line)
    const x1 = localLinePoints ? localLinePoints.x1 : line.x1 - pathOffset.x
    const y1 = localLinePoints ? localLinePoints.y1 : line.y1 - pathOffset.y
    const x2 = localLinePoints ? localLinePoints.x2 : line.x2 - pathOffset.x
    const y2 = localLinePoints ? localLinePoints.y2 : line.y2 - pathOffset.y
    const centerX = (x1 + x2) / 2
    const centerY = (y1 + y2) / 2
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.hypot(dx, dy)
    const offset = 28 / line.ratio
    const nx = length === 0 ? 0 : -dy / length
    const ny = length === 0 ? 1 : dx / length
    return fabric.util.transformPoint(new fabric.Point(centerX + nx * offset, -(centerY + ny * offset)), finalMatrix)
}

const rotateActionHandler = (
    eventData: MouseEvent,
    transform: ControlTransform,
    x: number,
    y: number
) => {
    const line = transform.target as UiLine
    const canvasPointer = line.canvas?.getPointer(eventData)
    const pointerX = canvasPointer?.x ?? x
    const pointerY = canvasPointer?.y ?? y
    const centerX = (line.x1 + line.x2) / 2
    const centerY = (line.y1 + line.y2) / 2
    const halfLength = Math.hypot(line.x2 - line.x1, line.y2 - line.y1) / 2
    const pointerAngle = Math.atan2(pointerY - centerY, pointerX - centerX)
    const currentAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1)
    if (typeof transform.lineRotateDelta !== 'number') {
        transform.lineRotateDelta = currentAngle - pointerAngle
    }
    const angle = pointerAngle + transform.lineRotateDelta
    const cosValue = Math.cos(angle)
    const sinValue = Math.sin(angle)

    const newX1 = Math.round((centerX - cosValue * halfLength) * line.ratio) / line.ratio
    const newY1 = Math.round((centerY - sinValue * halfLength) * line.ratio) / line.ratio
    const newX2 = Math.round((centerX + cosValue * halfLength) * line.ratio) / line.ratio
    const newY2 = Math.round((centerY + sinValue * halfLength) * line.ratio) / line.ratio

    line.set('x1', newX1)
    line.set('y1', newY1)
    line.set('x2', newX2)
    line.set('y2', newY2)
    line.setCoords()
    line.canvas?.requestRenderAll()
    return true
}

const createEndpointControls = () => {
    const controlsUtils = (fabric as typeof fabric & {
        controlsUtils?: {
            renderCircleControl?: fabric.Control['render'];
        }
    }).controlsUtils
    const circleRender = controlsUtils?.renderCircleControl

    return {
        start: new fabric.Control({
            positionHandler: endpointPositionHandler('start'),
            actionHandler: endpointActionHandler('start'),
            actionName: 'modifyLineEndpoint',
            cursorStyle: 'crosshair',
            render: circleRender,
        }),
        end: new fabric.Control({
            positionHandler: endpointPositionHandler('end'),
            actionHandler: endpointActionHandler('end'),
            actionName: 'modifyLineEndpoint',
            cursorStyle: 'crosshair',
            render: circleRender,
        }),
        rotate: new fabric.Control({
            positionHandler: rotatePositionHandler,
            actionHandler: rotateActionHandler,
            actionName: 'rotateLineAroundCenter',
            cursorStyle: 'crosshair',
        }),
    }
}

export const Line = fabric.util.createClass(fabric.Line, {
    type: 'UiLine',
    id: 0,
    name: '',
    layer: 0,
    groupName: '',
    ratio: 1,
    _color: '',
    team: 'red',
    initialize: function(options: Partial<LineOptions>) {
        options || (options = {})
        options.color || (options.color = 'main')
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.groupName
        this.ratio = options.ratio
        this._color = options.color
        this.team = options.team
        options.lockRotation = true
        options.lockScalingFlip = true
        options.hasRotatingPoint = false
        options.x1 || (options.x1 = 50 / this.ratio)
        options.y1 || (options.y1 = 50 / this.ratio)
        options.x2 || (options.x2 = 100 / this.ratio)
        options.y2 || (options.y2 = 100 / this.ratio)
        options.strokeWidth || (options.strokeWidth = 1 / this.ratio)
        if (this._color && this._color !== 'main') {
            options.stroke = ColorMap[this._color as ColorKey]
        } else {
            options.stroke = ColorMap[options.team as ColorKey]
            this._color = 'main'
        }
        options.fill = null
        this.callSuper('initialize', [options.x1, options.y1, options.x2, options.y2], options)
        this.controls = createEndpointControls()
        this.moveTo(options.layer)
        this.transparentCorners = false
    },
    resizeScale: function() {
        let raw_l = Math.min(this.x1, this.x2)
        let raw_t = Math.min(this.y1, this.y2)

        let moveX = this.left - raw_l
        let moveY = this.top - raw_t

        if (this.x1 < this.x2) {
            let w = Math.round((this.x2 - this.x1) * this.scaleX)
            this.set('x1', Math.round((this.x1 + moveX) * this.ratio) / this.ratio)
            this.set('x2', Math.round((this.x1 + w) * this.ratio) / this.ratio)
        } else {
            let w = Math.round((this.x1 - this.x2) * this.scaleX)
            this.set('x2', Math.round((this.x2 + moveX) * this.ratio) / this.ratio)
            this.set('x1', Math.round((this.x2 + w) * this.ratio) / this.ratio)
        }
        if (this.y1 < this.y2) {
            let h = Math.round((this.y2 - this.y1) * this.scaleY)
            this.set('y1', Math.round((this.y1 + moveY) * this.ratio) / this.ratio)
            this.set('y2', Math.round((this.y1 + h) * this.ratio) / this.ratio)
        } else {
            let h = Math.round((this.y1 - this.y2) * this.scaleY)
            this.set('y2', Math.round((this.y2 + moveY) * this.ratio) / this.ratio)
            this.set('y1', Math.round((this.y2 + h) * this.ratio) / this.ratio)
        }

        this.set('scaleX', 1)
        this.set('scaleY', 1)
    },
    toObject: function() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            layer: this.layer,
            group: this.groupName,
            x: this.x1 * this.ratio,
            y: this.y1 * this.ratio,
            x2: this.x2 * this.ratio,
            y2: this.y2 * this.ratio,
            color: this._color,
            lineWidth: this.strokeWidth * this.ratio,
        }
    },
    fromObject: function (options: LineOptions) {
        this._color = options.color
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.group
        this.set('x2', options.x2 / this.ratio)
        this.set('y2', options.y2 / this.ratio)
        this.set('x1', options.x / this.ratio)
        this.set('y1', options.y / this.ratio)
        this.set('strokeWidth', options.lineWidth / this.ratio)
        if (this._color === 'main') {
            this.set('stroke', ColorMap[this.team as ColorKey])
        } else {
            this.set('stroke', ColorMap[this._color as ColorKey])
        }
        this.moveTo(options.layer)
    },
    setRatio: function (ratio: number) {
        this.set('x1', this.x1 * this.ratio / ratio)
        this.set('y1', this.y1 * this.ratio / ratio)
        this.set('x2', this.x2 * this.ratio / ratio)
        this.set('y2', this.y2 * this.ratio / ratio)
        this.set('strokeWidth', this.strokeWidth * this.ratio / ratio)
        this.ratio = ratio
    },
    setTeam: function (team: ColorKey) {
        this.team = team
        if (this._color === 'main') {
            this.set('stroke', ColorMap[this.team as ColorKey])
        }
    }
})
