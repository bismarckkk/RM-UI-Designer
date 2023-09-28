import { fabric } from "fabric";
import { ColorMap } from "./utils";

export const Rect = fabric.util.createClass(fabric.Rect, {
    type: 'UiRect',
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
        options.width || (options.width = 50 / this.ratio)
        options.height || (options.height = 50 / this.ratio)
        options.left || (options.left = 50 / this.ratio)
        options.top || (options.top = 50 / this.ratio)
        options.strokeWidth || (options.strokeWidth = 1 / this.ratio)
        if (this._color && this._color !== 'main') {
            options.stroke = ColorMap[this._color]
        } else {
            options.stroke = ColorMap[options.team]
            this._color = 'main'
        }
        options.fill = null
        this.callSuper('initialize', options)
        this.moveTo(options.layer)
        this.setControlVisible('mtr', false)
        this.transparentCorners = false
        console.log(options)
    },
    resizeScale: function() {
        this.set('width', this.width * this.scaleX)
        this.set('height', this.height * this.scaleY)
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
            width: this.width * this.ratio,
            height: this.height * this.ratio,
            x: this.left * this.ratio,
            y: this.top * this.ratio,
            color: this._color,
            lineWidth: this.strokeWidth * this.ratio,
            team: this.team
        }
    },
    fromObject: function (options) {
        this._color = options.color
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.group
        this.team = options.team
        this.set('width', options.width / this.ratio)
        this.set('height', options.height / this.ratio)
        this.set('left', options.x / this.ratio)
        this.set('top', options.y / this.ratio)
        this.set('strokeWidth', options.lineWidth / this.ratio)
        console.log(options)
        if (this._color === 'main') {
            this.set('stroke', ColorMap[this.team])
        } else {
            this.set('stroke', ColorMap[this._color])
        }
    },
    setRatio: function (ratio) {
        this.set('width', this.width * this.ratio / ratio)
        this.set('height', this.height * this.ratio / ratio)
        this.set('left', this.left * this.ratio / ratio)
        this.set('top', this.top * this.ratio / ratio)
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