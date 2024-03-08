import { fabric } from "fabric";
import { Text } from "./text";

export const Number = fabric.util.createClass(Text, {
    type: 'UiNumber',
    number: 12345,
    initialize: function(options) {
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
    fromObject: function(options) {
        this.number = parseInt(options.number);
        options.text = this.number.toString();
        this.callSuper('fromObject', options);
    }
})
