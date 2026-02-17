import { fabric } from "fabric";
import { Text } from "./text";

type FloatOptions = {
    float: number;
    text?: string;
    [key: string]: unknown;
};

export const Float = fabric.util.createClass(Text, {
    type: 'UiFloat',
    float: 12.345,
    initialize: function(options: Partial<FloatOptions>) {
        options || (options = {});
        const parsed = globalThis.Number(options.float);
        this.float = globalThis.Number.isFinite(parsed) ? parsed : 12.345;
        options.text = this.float.toString();
        this.callSuper('initialize', options);
    },
    toObject: function() {
        let obj = this.callSuper('toObject');
        obj.float = this.float;
        delete obj.text
        return obj;
    },
    fromObject: function(options: FloatOptions) {
        const parsed = globalThis.Number(options.float);
        this.float = globalThis.Number.isFinite(parsed) ? parsed : 12.345;
        options.text = this.float.toString();
        this.callSuper('fromObject', options);
    }
})
