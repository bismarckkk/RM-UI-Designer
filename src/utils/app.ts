import { App } from 'antd';

let message;
let notification;
let modal;
let rid = 1;

export default () => {
    const staticFunction = App.useApp();
    message = staticFunction.message;
    modal = staticFunction.modal;
    notification = staticFunction.notification;
    return null;
};

export function setRid(newRid: number) {
    rid = newRid;
}

export { message, notification, modal, rid };
