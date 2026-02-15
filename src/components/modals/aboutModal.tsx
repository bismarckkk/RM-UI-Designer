import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Modal } from "antd";
import Loading from "../../loading";
import Markdown from "react-markdown";

const AboutModal = forwardRef((props, ref: any) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
        show: () => setOpen(true)
    }))

    useEffect(() => {
        fetch(new URL('../../assets/about.md', import.meta.url).href).then(e=>e.text()).then(e=>{
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
