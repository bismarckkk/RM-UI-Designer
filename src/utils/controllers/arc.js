import { fabric } from "fabric";
import { Ellipse } from "./ellipse";

export const Arc = fabric.util.createClass(Ellipse, {
    type: 'UiArc',
    startAngle: 0,
    endAngle: 90,
    initialize: function(options) {
        options || (options = {});
        options.startAngle || (options.startAngle = 0);
        options.endAngle || (options.endAngle = 90);
        this.callSuper('initialize', options);
        this.startAngle = options.startAngle;
        this.endAngle = options.endAngle;
        this.set('dirty', true)
    },
    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            startAngle: this.startAngle,
            endAngle: this.endAngle
        });
    },
    _render: function(ctx) {
        var startAngle = (this.startAngle - 90) * (Math.PI / 180);
        var endAngle = (this.endAngle - 90) * (Math.PI / 180);

        ctx.beginPath()
        ctx.ellipse(0, 0, this.rx, this.ry, 0, startAngle, endAngle, false)
        ctx.strokeStyle = this.stroke
        ctx.lineWidth = this.strokeWidth
        ctx.stroke()
    },
    fromObject: function (options) {
        this.set('startAngle', options.startAngle);
        this.set('endAngle', options.endAngle);
        // without this line, this will not update
        this.set('ry', 1)
        this.callSuper('fromObject', options);
    }
});