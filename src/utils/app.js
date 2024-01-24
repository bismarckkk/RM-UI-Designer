import { App } from 'antd';

let message;
let notification;
let modal;

export default () => {
    const staticFunction = App.useApp();
    message = staticFunction.message;
    modal = staticFunction.modal;
    notification = staticFunction.notification;
    console.log(message)
    return null;
};

export { message, notification, modal };
