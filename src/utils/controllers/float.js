import { fabric } from "fabric";
import { Text } from "./text";

export const Float = fabric.util.createClass(Text, {
    type: 'UiFloat',
    float: 12.345,
    initialize: function(options) {
        options || (options = {});
        this.float = options.float || 12.345;
        options.text = this.float.toString();
        this.callSuper('initialize', options);
    },
    toObject: function() {
        let obj = this.callSuper('toObject');
        obj.float = this.float;
        delete obj.text
        console.log(obj)
        return obj;
    },
    fromObject: function(options) {
        this.float = parseFloat(options.float);
        options.text = this.float.toString();
        this.callSuper('fromObject', options);
    }
})
