import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import type { HookAPI } from 'antd/es/modal/useModal';

let message: MessageInstance = {} as MessageInstance;
let notification: NotificationInstance = {} as NotificationInstance;
let modal: HookAPI = {} as HookAPI;
let rid = 1;

export default () => {
    const staticFunction = App.useApp();
    message = staticFunction.message;
    modal = staticFunction.modal;
    notification = staticFunction.notification;
    return null;
};

export function setRid(newRid: number | string) {
    rid = parseInt(String(newRid), 10);
}

export { message, notification, modal, rid };
