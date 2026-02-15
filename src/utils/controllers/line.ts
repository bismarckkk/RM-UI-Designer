import { fabric } from "fabric";
import { ColorMap } from "../utils";

export const Line = fabric.util.createClass(fabric.Line, {
    type: 'UiLine',
    id: 0,
    name: '',
    layer: 0,
    groupName: '',
    ratio: 1,
    _color: '',
    team: 'red',
    initialize: function(options) {
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
            options.stroke = ColorMap[this._color]
        } else {
            options.stroke = ColorMap[options.team]
            this._color = 'main'
        }
        options.fill = null
        this.callSuper('initialize', [options.x1, options.y1, options.x2, options.y2], options)
        this.moveTo(options.layer)
        this.setControlVisible('mtr', false)
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
    fromObject: function (options) {
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
            this.set('stroke', ColorMap[this.team])
        } else {
            this.set('stroke', ColorMap[this._color])
        }
        this.moveTo(options.layer)
    },
    setRatio: function (ratio) {
        this.set('x1', this.x1 * this.ratio / ratio)
        this.set('y1', this.y1 * this.ratio / ratio)
        this.set('x2', this.x2 * this.ratio / ratio)
        this.set('y2', this.y2 * this.ratio / ratio)
        this.set('strokeWidth', this.strokeWidth * this.ratio / ratio)
        this.ratio = ratio
    },
    setTeam: function (team) {
        this.team = team
        if (this._color === 'main') {
            this.set('stroke', ColorMap[this.team])
        }
    }
})
