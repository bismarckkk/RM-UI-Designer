import { fabric } from "fabric";
import { Ellipse } from "./ellipse";

type ArcOptions = {
    startAngle: number;
    endAngle: number;
    [key: string]: unknown;
};

type UiArc = fabric.Ellipse & {
    startAngle: number;
    endAngle: number;
    rx: number;
    ry: number;
    left: number;
    top: number;
    controls: { [key: string]: fabric.Control };
};

const normalizeAngle = (angle: number) => {
    return ((angle % 360) + 360) % 360
}

const angleToLocalPoint = (arc: UiArc, angle: number) => {
    const radians = (90 - angle) * (Math.PI / 180)
    return new fabric.Point(
        arc.rx * Math.cos(radians),
        arc.ry * Math.sin(radians)
    )
}

const localPointToAngle = (arc: UiArc, localX: number, localY: number) => {
    const rx = arc.rx || 1
    const ry = arc.ry || 1
    const normalizedX = localX / rx
    const normalizedY = localY / ry
    const radians = Math.atan2(normalizedY, normalizedX)
    return normalizeAngle(90 - fabric.util.radiansToDegrees(radians))
}

const angleControlPositionHandler = (which: 'start' | 'end') => {
    return (
        _dim: fabric.Point,
        finalMatrix: number[],
        fabricObject: fabric.Object
    ) => {
        const arc = fabricObject as UiArc
        const angle = which === 'start' ? arc.startAngle : arc.endAngle
        const local = angleToLocalPoint(arc, angle)
        return fabric.util.transformPoint(new fabric.Point(local.x, -local.y), finalMatrix)
    }
}

const angleControlActionHandler = (which: 'start' | 'end') => {
    return (
        eventData: MouseEvent,
        transform: fabric.Transform,
        x: number,
        y: number
    ) => {
        const arc = transform.target as UiArc
        const canvasPointer = arc.canvas?.getPointer(eventData)
        const pointerX = canvasPointer?.x ?? x
        const pointerY = canvasPointer?.y ?? y
        const centerX = arc.left + arc.rx
        const centerY = arc.top + arc.ry
        const angle = localPointToAngle(arc, pointerX - centerX, pointerY - centerY)

        if (which === 'start') {
            arc.set('startAngle', angle)
        } else {
            arc.set('endAngle', angle)
        }
        arc.set('dirty', true)
        arc.setCoords()
        arc.canvas?.requestRenderAll()
        return true
    }
}

const createArcAngleControls = () => {
    const controlsUtils = (fabric as typeof fabric & {
        controlsUtils?: {
            renderCircleControl?: fabric.Control['render'];
        }
    }).controlsUtils
    const circleRender = controlsUtils?.renderCircleControl

    return {
        startAngle: new fabric.Control({
            positionHandler: angleControlPositionHandler('start'),
            actionHandler: angleControlActionHandler('start'),
            actionName: 'modifyArcStartAngle',
            cursorStyle: 'crosshair',
            render: circleRender,
        }),
        endAngle: new fabric.Control({
            positionHandler: angleControlPositionHandler('end'),
            actionHandler: angleControlActionHandler('end'),
            actionName: 'modifyArcEndAngle',
            cursorStyle: 'crosshair',
            render: circleRender,
        }),
    }
}

export const Arc = fabric.util.createClass(Ellipse, {
    type: 'UiArc',
    startAngle: 0,
    endAngle: 90,
    initialize: function(options: Partial<ArcOptions>) {
        options || (options = {});
        options.startAngle || (options.startAngle = 0);
        options.endAngle || (options.endAngle = 90);
        this.callSuper('initialize', options);
        this.startAngle = options.startAngle;
        this.endAngle = options.endAngle;
        this.controls = {
            ...this.controls,
            ...createArcAngleControls(),
        }
        this.set('dirty', true)
    },
    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            startAngle: this.startAngle,
            endAngle: this.endAngle
        });
    },
    _render: function(ctx: CanvasRenderingContext2D) {
        var startAngle = -(this.endAngle - 90) * (Math.PI / 180);
        var endAngle = -(this.startAngle - 90) * (Math.PI / 180);

        ctx.beginPath()
        ctx.ellipse(0, 0, this.rx, this.ry, 0, startAngle, endAngle, false)
        ctx.strokeStyle = this.stroke
        ctx.lineWidth = this.strokeWidth
        ctx.stroke()
    },
    fromObject: function (options: ArcOptions) {
        this.set('startAngle', options.startAngle);
        this.set('endAngle', options.endAngle);
        // without this line, this will not update
        this.set('ry', 1)
        this.callSuper('fromObject', options);
    }
});