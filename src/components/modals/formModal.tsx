import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { ModalForm, ProFormText } from "@ant-design/pro-components";

type Deferred<T> = {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};

type FormValues = { frame: string };

export type FormModalRef = { open: (title: string, frames: string[]) => Promise<string> };

const FormModal = forwardRef<FormModalRef>((_props, ref) => {
    const [title, setTitle] = useState('')
    const [open, setOpen] = useState(false)
    const [frames, setFrames] = useState<string[]>([])
    const promiseRef = useRef<Deferred<string> | null>(null)

    useImperativeHandle(ref, () => ({
        open: (_title: string, _frames: string[]) => {
            return new Promise((resolve, reject) => {
                setTitle(_title)
                setOpen(true)
                setFrames(_frames)
                if (promiseRef.current) {
                    promiseRef.current.reject()
                }
                promiseRef.current = {resolve, reject}
            })
        }
    }))

    return (
        <ModalForm
            title={title}
            autoFocusFirstInput
            width={240}
            open={open}
            onOpenChange={(e)=>{
                if (promiseRef.current && !e && open) {
                    promiseRef.current.reject()
                }
                setOpen(e)
            }}
            onFinish={async (e: FormValues)=>{
                promiseRef.current?.resolve(e.frame)
                promiseRef.current = null
                return true
            }}
        >
            <ProFormText
                name="frame"
                label="New Frame Name"
                width="sm"
                rules={[
                    { required: true, message: 'Please input frame name!' },
                    ({ getFieldValue }) => {
                        return {
                            validator: ()=>{
                                let ok = true
                                const frame = getFieldValue('frame')
                                for (const it of frames) {
                                    if (it === frame) {
                                        ok = false
                                        break
                                    }
                                }
                                if (ok) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Cannot create same name frame!'));
                            }
                        }
                    }
                ]}
            />
        </ModalForm>
    );
});

export default FormModal;
