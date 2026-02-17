import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { Drawer, Button } from "antd";
import CheckPanel from "@/components/generator/checkPanel";
import DownloadPanel from "@/components/generator/downloadPanel";

import GeneratorHelper from "@/utils/generator/generatorHelper";
import type { GeneratorData } from "@/utils/generator/generatorHelper";

type GeneratorError = { level: string; message: string };
type CodeEntry = { h?: string; c?: string };
type CodeMap = Record<string, CodeEntry>;
type GeneratorRef = { gen: (data: unknown, mode: string) => void };
type DownloadPanelRef = { downloadChecked: () => Promise<void> };
type GeneratorProps = {};

const Generator = forwardRef<GeneratorRef, GeneratorProps>((_props, ref) => {
    const [show, setShow] = useState(false)
    const [step, setStep] = useState('check')
    const [errors, setErrors] = useState<GeneratorError[]>([])
    const [code, setCode] = useState<CodeMap>({})
    const [isStaticMode, setIsStaticMode] = useState(true)
    const downloadRef = useRef<DownloadPanelRef | null>(null)
    const helperRef = useRef<GeneratorHelper | null>(null)

    useImperativeHandle(ref, () => ({
        gen: (data: unknown, mode: string) => {
            const isStatic = mode !== 'dynamic'
            setIsStaticMode(isStatic)
            helperRef.current = new GeneratorHelper(data as GeneratorData, isStatic)
            setCode(helperRef.current.gen() as CodeMap)
            setErrors(helperRef.current.check() as GeneratorError[])
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
                getContainer={() => document.getElementById('content-in') ?? document.body}
                rootStyle={{inset: '25px 0 0 0'}}
                style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
                footer={
                    <div style={{
                        width: 'calc(100% - 10px)',
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
                        <DownloadPanel
                            code={code}
                            getUiBase={() => helperRef.current ? helperRef.current.getUiBase(isStaticMode)() as Promise<CodeMap> : Promise.resolve({})}
                            ref={downloadRef}
                        />
                }
            </Drawer>
        </div>
    );
});

export default Generator;
