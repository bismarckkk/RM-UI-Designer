import { fabric } from "fabric";
import { ColorMap } from "../utils";


function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

const scale = 1.25;


export const Text = fabric.util.createClass(fabric.Text, {
    type: 'UiText',
    id: 0,
    name: '',
    layer: 0,
    groupName: '',
    ratio: 1,
    _color: '',
    team: 'red',
    initialize: function(options) {
        options || (options = {});
        options.color || (options.color = 'main');
        this.id = options.id;
        this.name = options.name;
        this.layer = options.layer;
        this.groupName = options.groupName;
        this.ratio = options.ratio;
        this._color = options.color;
        this.team = options.team;
        options.flipY = true;
        options.fontSize || (options.fontSize = 20 / this.ratio);
        options.fontSize *= scale;
        options.fontFamily || (options.fontFamily = 'ds-digitalnormal');
        options.text || (options.text = 'Text');
        options.left || (options.left = 50 / this.ratio);
        options.top || (options.top = 50 / this.ratio);
        options.top -= options.fontSize / this.ratio * 2
        options.width || (options.width = getTextWidth(options.text, options.fontSize + 'px ' + options.fontFamily) * this.ratio);
        console.log(options.width, this.ratio)
        if (this._color && this._color !== 'main') {
            options.fill = ColorMap[this._color];
        } else {
            options.fill = ColorMap[options.team];
            this._color = 'main';
        }
        this.callSuper('initialize', options.text, options);
        this.moveTo(options.layer);
        this.setControlsVisibility({
            tl: false, // top left
            tr: false, // top right
            bl: false, // bottom left
            br: false, // bottom right
            ml: false, // middle left
            mt: false, // middle top
            mr: false, // middle right
            mb: false, // middle bottom
            mtr: false, // rotate point
        });
        setTimeout(()=>{
            this.set('width', getTextWidth(options.text, options.fontSize + 'px ' + options.fontFamily) * this.ratio)
        }, 100)
    },
    toObject: function() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            layer: this.layer,
            group: this.groupName,
            fontSize: this.fontSize * this.ratio / scale,
            x: this.left * this.ratio,
            y: this.top * this.ratio + this.fontSize * 2,
            text: this.text,
            color: this._color,
        };
    },
    fromObject: function(options) {
        this._color = options.color
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.group
        this.set('fontSize', options.fontSize / this.ratio * scale)
        this.set('left', options.x / this.ratio)
        this.set('top', options.y / this.ratio - this.fontSize  / this.ratio * 2)
        this.text = options.text
        this.set('width', getTextWidth(options.text, options.fontSize * scale + 'px ' + this.fontFamily) * this.ratio)
        if (this._color === 'main') {
            this.set('fill', ColorMap[this.team])
        } else {
            this.set('fill', ColorMap[this._color])
        }
        this.moveTo(options.layer)
        this.set('fontFamily', 'ds-digitalnormal')
    },
    setRatio: function (ratio) {
        this.set('width', this.width * this.ratio / ratio)
        this.set('left', this.left * this.ratio / ratio)
        this.set('top', this.top * this.ratio / ratio)
        this.set('fontSize', this.fontSize * this.ratio / ratio)
        this.ratio = ratio
    },
    resizeScale: function() {
    },
    setTeam: function (team) {
        this.team = team
        if (this._color === 'main') {
            this.set('fill', ColorMap[this.team])
        }
    }
})
