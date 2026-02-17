import { fabric } from "fabric";
import { ColorMap } from "../utils";

const scale = 1.25;

type ColorKey = keyof typeof ColorMap;

type TextOptions = {
    id: number;
    name: string;
    layer: number;
    groupName: string;
    ratio: number;
    color: ColorKey | 'main';
    team: ColorKey;
    text: string;
    fontSize: number;
    fontFamily: string;
    left: number;
    top: number;
    width: number;
    fill?: string;
    flipY?: boolean;
    group?: string;
    x?: number;
    y?: number;
};

type GetTextWidthFn = ((text: string, font: string) => number) & {
    canvas?: HTMLCanvasElement;
};

const getTextWidth: GetTextWidthFn = (text, font) => {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    if (!context) {
        return 0;
    }
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width * scale;
}

export const Text = fabric.util.createClass(fabric.Text, {
    type: 'UiText',
    id: 0,
    name: '',
    layer: 0,
    groupName: '',
    ratio: 1,
    _color: '',
    team: 'red',
    rawFontSize: 0,
    initialize: function(options: Partial<TextOptions>) {
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
        options.top -= options.fontSize
        options.width || (options.width = getTextWidth(options.text, options.fontSize + 'px ' + options.fontFamily) * this.ratio);
        this.rawFontSize = options.fontSize;
        if (this._color && this._color !== 'main') {
            options.fill = ColorMap[this._color as ColorKey];
        } else {
            options.fill = ColorMap[options.team as ColorKey];
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
            this.set('width', getTextWidth(options.text ?? 'Text', `${options.fontSize ?? this.fontSize}px ${options.fontFamily ?? this.fontFamily}`) / this.ratio)
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
            y: (this.top + this.fontSize) * this.ratio,
            text: this.text,
            color: this._color,
        };
    },
    fromObject: function(options: TextOptions) {
        this._color = options.color
        this.id = options.id
        this.name = options.name
        this.layer = options.layer
        this.groupName = options.group
        this.set('fontSize', options.fontSize / this.ratio * scale)
        this.set('left', (options.x ?? 0) / this.ratio)
        this.set('top', (options.y ?? 0) / this.ratio - this.fontSize)
        this.text = options.text
        this.set('width', getTextWidth(options.text, options.fontSize + 'px ' + this.fontFamily) / this.ratio)
        this.rawFontSize = options.fontSize
        setTimeout(()=>{
            this.set('width', getTextWidth(options.text, options.fontSize + 'px ' + this.fontFamily) / this.ratio)
        }, 100)
        if (this._color === 'main') {
            this.set('fill', ColorMap[this.team as ColorKey])
        } else {
            this.set('fill', ColorMap[this._color as ColorKey])
        }
        this.moveTo(options.layer)
        this.set('fontFamily', 'ds-digitalnormal')
    },
    setRatio: function (ratio: number) {
        this.set('width', this.width * this.ratio / ratio)
        this.set('left', this.left * this.ratio / ratio)
        this.set('fontSize', this.fontSize * this.ratio / ratio)
        this.set('top', this.top * this.ratio / ratio)
        this.set('width', getTextWidth(this.text, this.rawFontSize + 'px ' + this.fontFamily) / ratio)
        this.ratio = ratio
    },
    resizeScale: function() {
    },
    setTeam: function (team: ColorKey) {
        this.team = team
        if (this._color === 'main') {
            this.set('fill', ColorMap[this.team as ColorKey])
        }
    }
})
