import { fabric } from "fabric";
import { ColorMap } from "../utils";

type ColorKey = keyof typeof ColorMap;
type EllipseOptions = {
    id: number;
    name: string;
    layer: number;
    groupName: string;
    ratio: number;
    color: ColorKey | 'main';
    team: ColorKey;
    rx: number;
    ry: number;
    x: number;
    y: number;
    lineWidth: number;
    strokeWidth: number;
    left: number;
    top: number;
    group?: string;
    stroke?: string;
    fill?: string | null;
    lockRotation?: boolean;
    lockScalingFlip?: boolean;
    hasRotatingPoint?: boolean;
};


export const Ellipse = fabric.util.createClass(fabric.Ellipse, {
    type: 'UiEllipse',
    id: 0,
    name: '',
    layer: 0,
    groupName: '',
    ratio: 1,
    _color: '',
    team: 'red',
    initialize: function(options: Partial<EllipseOptions>) {
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
        options.rx || (options.rx = 50 / this.ratio)
        options.ry || (options.ry = 50 / this.ratio)
        options.left || (options.left = 50 / this.ratio)
        options.top || (options.top = 50 / this.ratio)
        options.strokeWidth || (options.strokeWidth = 1 / this.ratio)
        if (this._color && this._color !== 'main') {
            options.stroke = ColorMap[this._color as ColorKey]
        } else {
            options.stroke = ColorMap[options.team as ColorKey]
            this._color = 'main'
        }
        options.fill = null
        this.callSuper('initialize', options)
        this.moveTo(options.layer)
        this.setControlVisible('mtr', false)
        this.transparentCorners = false
    },
    resizeScale: function() {
        this.set('rx', Math.round(this.rx * this.scaleX * this.ratio) / this.ratio)
        this.set('ry', Math.round(this.ry * this.scaleY * this.ratio) / this.ratio)
        this.set('left', Math.round(this.left * this.ratio) / this.ratio)
        this.set('top', Math.round(this.top * this.ratio) / this.ratio)
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
            rx: this.rx * this.ratio,
            ry: this.ry * this.ratio,
            x: (this.left + this.rx) * this.ratio,
            y: (this.top + this.ry) * this.ratio,
            color: this._color,
            lineWidth: this.strokeWidth * this.ratio,
        }
    },
    fromObject: function (options: EllipseOptions) {
        this._color = options.color
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.group
        this.set('rx', options.rx / this.ratio)
        this.set('ry', options.ry / this.ratio)
        this.set('left', (options.x - options.rx) / this.ratio)
        this.set('top', (options.y - options.ry) / this.ratio)
        this.set('strokeWidth', options.lineWidth / this.ratio)
        if (this._color === 'main') {
            this.set('stroke', ColorMap[this.team as ColorKey])
        } else {
            this.set('stroke', ColorMap[this._color as ColorKey])
        }
        this.moveTo(options.layer)
    },
    setRatio: function (ratio: number) {
        this.set('rx', this.rx * this.ratio / ratio)
        this.set('ry', this.ry * this.ratio / ratio)
        this.set('left', this.left * this.ratio / ratio)
        this.set('top', this.top * this.ratio / ratio)
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
