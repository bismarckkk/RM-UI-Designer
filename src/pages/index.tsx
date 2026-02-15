import React, {Component} from 'react';
import { ConfigProvider, App, theme, Watermark } from "antd";
import Render from "@/components/render/render";
import UpdateModal from "@/components/modals/updateModal";
import EulaModal from "@/components/modals/eulaModal";
import Loading from "@/loading";
import Menu from "@/components/menu/menu";
import AppHelper from "@/components/appHelper";
import { modal } from "@/utils/app"
import enUS from "antd/locale/en_US";

const { darkAlgorithm, compactAlgorithm } = theme;

class Index extends Component {
    state = { simulate: false, darkMode: this.isBrowserDarkMode(), isMounted: false }
    modal = null
    renderRef = React.createRef();
    menuRef = React.createRef();

    isBrowserDarkMode() {
        try {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        } catch (_) {
            return false
        }
    }

    componentDidMount() {
        const that = this;
        let lastWidth = 0;

        window.addEventListener("drop", (e) => e.preventDefault(), false);
        window.addEventListener("dragover", (e) => e.preventDefault(), false);
        window.addEventListener("contextmenu", (e) => {
            if (e.target.tagName.toLowerCase() !== 'input') {
                e.preventDefault();
            }
        }, false);

        function resizeHandle(width) {
            if (!that.modal && width < 880 && width !== lastWidth) {
                lastWidth = width;
                that.modal = modal.warning({
                    title: 'Display Aera too Small',
                    content: 'Cannot show all contents on this window. Please resize this window or rotate your phone.',
                    footer: null,
                    zIndex: 2500
                });
            }
            if (that.modal && width >= 880) {
                that.modal.destroy()
                that.modal = null
            }
        }

        setTimeout(()=>resizeHandle(window.innerWidth), 500)

        window.addEventListener('resize', () => {
            resizeHandle(window.innerWidth);
        }, false);

        const mqList = window.matchMedia('(prefers-color-scheme: dark)');

        mqList.addEventListener('change', (event) => {
            that.setState({darkMode: event.matches})
        });

        setTimeout(() => {
            this.setState({isMounted: true})
        }, 500)
    }

    setDarkMode(dark) {
        this.setState({darkMode: dark})
    }

    render() {
        if (!this.state.isMounted) {
            return <Loading/>
        }
        return (
            <ConfigProvider
                locale={enUS}
                theme={{
                    cssVar: {key: 'rmui'}, hashed: false,
                    algorithm: this.state.darkMode ? [darkAlgorithm, compactAlgorithm] : compactAlgorithm
                }}
            >
                <App>
                    <div className="rmui">
                        <div className="container background-color"
                             style={{height: '100vh', paddingBottom: 12, overflow: 'hidden'}}>
                            <Menu
                                save={() => this.renderRef.current.save()}
                                onObjectEvent={(t, e) => this.renderRef.current.onObjectEvent(t, e)}
                                onHistoryEvent={(t) => this.renderRef.current.onHistoryEvent(t)}
                                reset={() => this.renderRef.current.reset()}
                                setFrame={(t, f) => this.renderRef.current.onFrameEvent(t, f)}
                                upload={(e) => this.renderRef.current.upload(e)}
                                getData={() => this.renderRef.current.getData()}
                                setEditable={(e) => this.renderRef.current.setEditable(e)}
                                setDarkMode={(e) => this.setDarkMode(e)}
                                ref={this.menuRef}
                                darkMode={this.state.darkMode}
                            />
                            <Watermark content={['RM Ui Designer', process.env.VERSION]} zIndex={0} style={{height: '100%'}} gap={[30, 30]}>
                                <div id="content-in" style={{width: '100vw', height: '100%', zIndex: 2, position: 'relative'}}>
                                    <Render
                                        style={{width: '100vw', height: '100%'}}
                                        editable={true}
                                        ref={this.renderRef}
                                        onFrameChange={e => this.menuRef.current?.setFrames(e)}
                                        setCouldDo={e => {this.menuRef.current?.setCouldDo(e)}}
                                        setRobotId={e => {this.menuRef.current?.setRobotId(e)}}
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
}

export default Index;
