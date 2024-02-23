import React, {Component} from 'react';
import { ConfigProvider, App, theme } from "antd";
import Render from "@/components/render";
import Menu from "@/components/menu";
import AppHelper from "@/components/appHelper";
import { modal } from "@/utils/app"
import enUS from "antd/locale/en_US";

const { darkAlgorithm, compactAlgorithm } = theme;

class Index extends Component {
    state = { simulate: false, darkMode: this.isBrowserDarkMode() }
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
            if (!that.modal && width < 842 && width !== lastWidth) {
                lastWidth = width;
                that.modal = modal.warning({
                    title: 'Display Aera too Small',
                    content: 'Cannot show all contents on this window. Please resize this window or rotate your phone.',
                    footer: null
                });
            }
            if (that.modal && width >= 842) {
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
    }

    setDarkMode(dark) {
        this.setState({darkMode: dark})
    }

    render() {
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
                        <div className="container background-color" style={{height: '100vh', paddingBottom: 12, overflow: 'hidden'}}>
                            <Menu
                                save={()=>this.renderRef.current.save()}
                                onObjectEvent={(t, e)=>this.renderRef.current.onObjectEvent(t, e)}
                                generate={()=>this.renderRef.current.generate()}
                                reset={()=>this.renderRef.current.reset()}
                                setFrame={(t, f)=>this.renderRef.current.onFrameEvent(t, f)}
                                upload={(e)=>this.renderRef.current.upload(e)}
                                ref={this.menuRef}
                                setDarkMode={(e)=>this.setDarkMode(e)}
                                darkMode={this.state.darkMode}
                            />
                            <div id="content-in" style={{width: '100vw', height: '100%'}}>
                                <Render
                                    style={{width: '100vw', height: '100%'}}
                                    editable={true}
                                    ref={this.renderRef}
                                    onFrameChange={e=>this.menuRef.current.setFrames(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <AppHelper />
                </App>
            </ConfigProvider>
        );
    }
}

export default Index;
