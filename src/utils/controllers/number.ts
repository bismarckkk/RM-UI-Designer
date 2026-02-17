import { fabric } from "fabric";
import { Text } from "./text";

type NumberOptions = {
    number: number;
    text?: string;
    [key: string]: unknown;
};

export const Number = fabric.util.createClass(Text, {
    type: 'UiNumber',
    number: 12345,
    initialize: function(options: Partial<NumberOptions>) {
        options || (options = {});
        this.number = options.number || 12345;
        options.text = this.number.toString();
        this.callSuper('initialize', options);
    },
    toObject: function() {
        let obj = this.callSuper('toObject');
        obj.number = this.number;
        delete obj.text
        return obj;
    },
    fromObject: function(options: NumberOptions) {
        this.number = Number(options.number);
        options.text = this.number.toString();
        this.callSuper('fromObject', options);
    }
})
