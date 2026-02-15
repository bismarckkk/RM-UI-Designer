import React, {useEffect, useState} from 'react';
import {Button, Modal, Space} from "antd";
import Loading from "../../loading";
import Markdown from "react-markdown";

const EulaModal = () => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState<string | null>(null)

    useEffect(() => {
        const text = localStorage.getItem('eula')
        if (!text || !JSON.parse(text)){
            setOpen(true)
            fetch(new URL('../../assets/eula.md', import.meta.url).href).then(e=>e.text()).then(e=>{
                setContent(e)
            })
        }
    }, [])

    const dontShow = () => {
        localStorage.setItem('eula', 'true')
        setOpen(false)
    }

    return (
        <Modal
            title="Welcome to RM UI Designer!"
            onOk={()=>setOpen(false)}
            onCancel={()=>setOpen(false)}
            footer={<Space>
                <Button onClick={dontShow}>Don't show</Button>
                <Button type="primary" onClick={()=>setOpen(false)}>OK</Button>
            </Space>}
            open={open}
            zIndex={2200}
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
}

export default EulaModal;
