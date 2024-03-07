import { fabric } from "fabric";
import { ColorMap } from "../utils";

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
        options.fontFamily || (options.fontFamily = 'ds-digitalnormal');
        options.text || (options.text = 'Text');
        options.left || (options.left = 50 / this.ratio);
        options.top || (options.top = 50 / this.ratio);
        options.width || (options.width = options.fontSize * options.text.length / this.ratio);
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
    },
    toObject: function() {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            layer: this.layer,
            group: this.groupName,
            fontSize: this.fontSize * this.ratio,
            x: this.left * this.ratio,
            y: this.top * this.ratio,
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
        this.set('left', options.x / this.ratio)
        this.set('top', options.y / this.ratio)
        this.set('fontSize', options.fontSize / this.ratio)
        this.text = options.text
        this.set('width', this.fontSize * this.text.length / this.ratio)
        if (this._color === 'main') {
            this.set('fill', ColorMap[this.team])
        } else {
            this.set('fill', ColorMap[this._color])
        }
        this.moveTo(options.layer)
        this.team = options.team
    },
    setRatio: function (ratio) {
        this.set('width', this.width * this.ratio / ratio)
        this.set('left', this.left * this.ratio / ratio)
        this.set('top', this.top * this.ratio / ratio)
        this.set('fontSize', this.fontSize * this.ratio / ratio)
        this.ratio = ratio
    },
    resizeScale: function() {
        this.set('width', Math.round(this.width * this.scaleX * this.ratio) / this.ratio)
        this.set('left', Math.round(this.left * this.ratio) / this.ratio)
        this.set('top', Math.round(this.top * this.ratio) / this.ratio)
        this.set('scaleX', 1)
        this.set('scaleY', 1)
    },
    setTeam: function (team) {
        this.team = team
        if (this._color === 'main') {
            this.set('fill', ColorMap[this.team])
        }
    }
})
