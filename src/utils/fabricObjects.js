import { fabric } from "fabric";

export const Rect = fabric.util.createClass(fabric.Rect, {
    type: 'UiRect',
    id: 0,
    name: '',
    layer: 0,
    groupName: '',
    ratio: 1,
    initialize: function(options) {
        options || (options = {})
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.groupName
        this.ratio = options.ratio
        options.lockRotation = true
        options.lockScalingFlip = true
        options.hasRotatingPoint = false
        options.width || (options.width = 50 / this.ratio)
        options.height || (options.height = 50 / this.ratio)
        options.left || (options.left = 50 / this.ratio)
        options.top || (options.top = 50 / this.ratio)
        options.stroke || (options.stroke = 'red')
        options.strokeWidth || (options.strokeWidth = 1 / this.ratio)
        options.fill = null
        this.callSuper('initialize', options)
        this.moveTo(options.layer)
        this.setControlVisible('mtr', false)
        this.transparentCorners = false
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
            color: this.stroke,
            lineWidth: this.strokeWidth * this.ratio,
        }
    },
    fromObject: function (options) {
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.group
        this.set('width', options.width / this.ratio)
        this.set('height', options.height / this.ratio)
        this.set('left', options.x / this.ratio)
        this.set('top', options.y / this.ratio)
        this.set('stroke', options.color)
        this.set('strokeWidth', options.lineWidth / this.ratio)
    },
    setRatio: function (ratio) {
        this.set('width', this.width * this.ratio / ratio)
        this.set('height', this.height * this.ratio / ratio)
        this.set('left', this.left * this.ratio / ratio)
        this.set('top', this.top * this.ratio / ratio)
        this.set('strokeWidth', this.strokeWidth * this.ratio / ratio)
        this.ratio = ratio
    }
})