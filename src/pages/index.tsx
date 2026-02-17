import React, {useEffect, useRef, useState} from 'react';
import { ConfigProvider, App, theme, Watermark } from "antd";
import Render from "@/components/render/render";
import type { RenderRefApi } from "@/components/render/render";
import UpdateModal from "@/components/modals/updateModal";
import EulaModal from "@/components/modals/eulaModal";
import Loading from "@/loading";
import Menu from "@/components/menu/menu";
import type { MenuRefApi } from "@/components/menu/menu";
import AppHelper from "@/components/appHelper";
import { modal } from "@/utils/app"
import enUS from "antd/locale/en_US";

const { darkAlgorithm, compactAlgorithm } = theme;

function isBrowserDarkMode() {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (_) {
        return false
    }
}

const Index = () => {
    const [darkMode, setDarkMode] = useState(isBrowserDarkMode())
    const [isMounted, setIsMounted] = useState(false)
    const modalRef = useRef<{ destroy: () => void } | null>(null)
    const renderRef = useRef<RenderRefApi | null>(null);
    const menuRef = useRef<MenuRefApi | null>(null);

    useEffect(() => {
        let lastWidth = 0;

        window.addEventListener("drop", (e) => e.preventDefault(), false);
        window.addEventListener("dragover", (e) => e.preventDefault(), false);
        window.addEventListener("contextmenu", (e) => {
            if ((e.target as HTMLElement).tagName.toLowerCase() !== 'input') {
                e.preventDefault();
            }
        }, false);

        function resizeHandle(width: number) {
            if (!modalRef.current && width < 880 && width !== lastWidth) {
                lastWidth = width;
                modalRef.current = modal.warning({
                    title: 'Display Area too Small',
                    content: 'Cannot show all contents on this window. Please resize this window or rotate your phone.',
                    footer: null,
                    zIndex: 2500
                });
            }
            if (modalRef.current && width >= 880) {
                modalRef.current.destroy()
                modalRef.current = null
            }
        }

        setTimeout(()=>resizeHandle(window.innerWidth), 500)

        window.addEventListener('resize', () => {
            resizeHandle(window.innerWidth);
        }, false);

        const mqList = window.matchMedia('(prefers-color-scheme: dark)');

        mqList.addEventListener('change', (event) => {
            setDarkMode(event.matches)
        });

        setTimeout(() => {
            setIsMounted(true)
        }, 500)
    }, [])

    if (!isMounted) {
        return <Loading/>
    }
    return (
        <ConfigProvider
            locale={enUS}
            theme={{
                cssVar: {key: 'rmui'}, hashed: false,
                algorithm: darkMode ? [darkAlgorithm, compactAlgorithm] : compactAlgorithm
            }}
        >
            <App>
                <div className="rmui">
                    <div className="container background-color"
                         style={{height: '100vh', paddingBottom: 12, overflow: 'hidden'}}>
                        <Menu
                            save={() => renderRef.current?.save()}
                            onObjectEvent={(t: string, e: unknown) => renderRef.current?.onObjectEvent(t, e) ?? 'S'}
                            onHistoryEvent={(t: string) => renderRef.current?.onHistoryEvent(t)}
                            reset={() => renderRef.current?.reset()}
                            setFrame={(t: string, f: string) => renderRef.current?.onFrameEvent(t, f)}
                            upload={(e: File) => renderRef.current?.upload(e)}
                            getData={() => renderRef.current?.getData()}
                            setEditable={(e: boolean) => renderRef.current?.setEditable(e)}
                            setDarkMode={(e: boolean) => setDarkMode(e)}
                            ref={menuRef}
                            darkMode={darkMode}
                        />
                        <Watermark content={['RM Ui Designer', process.env.VERSION]} zIndex={0} style={{height: 'calc(100% - 30px)', width: '100vw'}} gap={[30, 30]}>
                            <div id="content-in" style={{width: '100vw', height: '100%', zIndex: 2, position: 'relative'}}>
                                <Render
                                    style={{width: '100vw', height: '100%'}}
                                    editable={true}
                                    ref={renderRef}
                                    onFrameChange={(e: { frames: string[]; selected: string }) => menuRef.current?.setFrames(e)}
                                    setCouldDo={(e: { couldPrevious: boolean; couldNext: boolean }) => {menuRef.current?.setCouldDo(e)}}
                                    setRobotId={(e: number) => {menuRef.current?.setRobotId(e)}}
                                />
                            </div>
                        </Watermark>
                    </div>
                </div>
                <AppHelper/>
                <UpdateModal/>
                <EulaModal/>
            </App>
        </ConfigProvider>
    );
}

export default Index;
