import { fabric } from "fabric";
import { ColorMap } from "./utils";

const Controller = {
    Rect: fabric.util.createClass(fabric.Rect, {
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
        },
        resizeScale: function() {
            this.set('width', Math.round(this.width * this.scaleX * this.ratio) / this.ratio)
            this.set('height', Math.round(this.height * this.scaleY * this.ratio) / this.ratio)
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
                width: this.width * this.ratio,
                height: this.height * this.ratio,
                x: this.left * this.ratio,
                y: this.top * this.ratio,
                color: this._color,
                lineWidth: this.strokeWidth * this.ratio,
                _team: this.team
            }
        },
        fromObject: function (options) {
            this._color = options.color
            this.id = options.id
            this.name = options.name
            this.layer = options.layer
            this.groupName = options.group
            this.team = options._team
            this.set('width', options.width / this.ratio)
            this.set('height', options.height / this.ratio)
            this.set('left', options.x / this.ratio)
            this.set('top', options.y / this.ratio)
            this.set('strokeWidth', options.lineWidth / this.ratio)
            if (this._color === 'main') {
                this.set('stroke', ColorMap[this.team])
            } else {
                this.set('stroke', ColorMap[this._color])
            }
            this.moveTo(options.layer)
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
    }),
    Line: fabric.util.createClass(fabric.Line, {
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
            const l = this.left
            const t = this.top
            const w = Math.round((this.x2 - this.x1) * this.scaleX)
            const h = Math.round((this.y2 - this.y1) * this.scaleY)
            this.set('x1', Math.round(l * this.ratio) / this.ratio)
            this.set('y1', Math.round(t * this.ratio) / this.ratio)
            this.set('x2', Math.round((l + w) * this.ratio) / this.ratio)
            this.set('y2', Math.round((t + h) * this.ratio) / this.ratio)
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
                _team: this.team
            }
        },
        fromObject: function (options) {
            this._color = options.color
            this.id = options.id
            this.name = options.name
            this.layer = options.layer
            this.groupName = options.group
            this.team = options._team
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
}

export function createUiElement(options) {
    let obj = {
        id: options.id,
        name: options.name,
        layer: options.layer,
        groupName: options.group,
        ratio: options.ratio,
        team: options.team
    }
    return new Controller[options.type.slice(2)](obj)
}

export function getMenuProps() {
    let info = []
    for (let key of Object.keys(Controller)) {
        info.push({key: `D1-add-${key}`, label: key})
    }
    return info
}
