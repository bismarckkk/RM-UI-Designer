import { fabric } from "fabric";
import { Ellipse } from "./ellipse";

export const Round = fabric.util.createClass(Ellipse, {
    type: 'UiRound',
    r: 50,
    initialize: function(options) {
        options || (options = {})
        options.r || (options.r = 50 / this.ratio)
        options.rx = options.r
        options.ry = options.r
        this.callSuper('initialize', options)
        this.setControlVisible('ml', false)
        this.setControlVisible('mb', false)
        this.setControlVisible('mr', false)
        this.setControlVisible('mt', false)
    },
    toObject: function() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            layer: this.layer,
            group: this.groupName,
            r: this.rx * this.ratio,
            x: (this.left + this.rx) * this.ratio,
            y: (this.top + this.ry) * this.ratio,
            color: this._color,
            lineWidth: this.strokeWidth * this.ratio,
        }
    },
    fromObject: function (options) {
        options.rx = options.r
        options.ry = options.r
        this.callSuper('fromObject', options)
    }
})
