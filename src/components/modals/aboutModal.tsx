import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Modal } from "antd";
import Loading from "../../loading";
import Markdown from "react-markdown";
import aboutMdUrl from '../../assets/about.md?url'

export type AboutModalRef = { show: () => void };

const AboutModal = forwardRef<AboutModalRef>((_props, ref) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
        show: () => setOpen(true)
    }))

    useEffect(() => {
        fetch(aboutMdUrl).then(e=>e.text()).then(e=>{
            setContent(e)
        })
    }, [])

    return (
        <Modal
            title="About"
            onOk={()=>setOpen(false)}
            onCancel={()=>setOpen(false)}
            footer={null}
            open={open}
        >
            {
                content ?
                    <Markdown
                        components={{
                            a: ({node, ...rest}) => <a {...rest} target="_blank" />
                        }}
                    >
                        {content}
                    </Markdown> :
                    <Loading />
            }
        </Modal>
    );
});

export default AboutModal;
