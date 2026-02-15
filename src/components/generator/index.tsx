import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { Drawer, Button } from "antd";
import CheckPanel from "@/components/generator/checkPanel";
import DownloadPanel from "@/components/generator/downloadPanel";

import GeneratorHelper from "@/utils/generator/generatorHelper";

const Generator = forwardRef((props, ref: any) => {
    const [show, setShow] = useState(false)
    const [step, setStep] = useState('check')
    const [errors, setErrors] = useState<any[]>([])
    const [code, setCode] = useState<any>({})
    const downloadRef = useRef<any>(null)
    const helperRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
        gen: (data: any, mode: string) => {
            helperRef.current = new GeneratorHelper(data, mode !== 'dynamic')
            setCode(helperRef.current.gen())
            setErrors(helperRef.current.check())
            setShow(true)
            setStep('check')
        }
    }))

    let generateButton = <Button
        type="primary"
        onClick={() => setStep('generate')}
        disabled={errors.some(error => error.level === 'Error')}
    >
        Generate
    </Button>
    let downloadButton = <Button
        type="primary"
        onClick={() => downloadRef?.current?.downloadChecked()}
    >
        Download
    </Button>
    return (
        <div>
            <Drawer
                title="C Code Generator"
                placement="right"
                onClose={() => setShow(false)}
                open={show}
                size="large"
                getContainer={document.getElementById('content-in')}
                rootStyle={{inset: '25px 0 0 0'}}
                style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
                footer={
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: 5
                    }}>
                        {step === 'check' ? generateButton : downloadButton}
                    </div>
                }
            >
                {
                    step === 'check' ?
                        <CheckPanel errors={errors}/> :
                        <DownloadPanel code={code} getUiBase={helperRef.current.getUiBase()} ref={downloadRef}/>
                }
            </Drawer>
        </div>
    );
});

export default Generator;
