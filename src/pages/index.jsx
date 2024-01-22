import React, {Component} from 'react';
import { Modal, ConfigProvider, Space, theme } from "antd";
import { WarningFilled } from '@ant-design/icons'
import Render from "@/components/render";
import Menu from "@/components/menu";
import enUS from "antd/locale/en_US";

const { darkAlgorithm, compactAlgorithm } = theme;

class Index extends Component {
    state = { simulate: false, darkMode: this.isBrowserDarkMode(), tooSmall: false }
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

        function resizeHandle(width) {
            if (!that.state.tooSmall && width < 792 && width !== lastWidth) {
                lastWidth = width;
                that.setState({tooSmall: true})
            }
            if (that.state.tooSmall && width >= 792) {
                that.setState({tooSmall: false})
            }
        }

        resizeHandle(window.innerWidth);

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
                        <Render
                            className="full"
                            editable={true}
                            ref={this.renderRef}
                            onFrameChange={e=>this.menuRef.current.setFrames(e)}
                        />
                    </div>
                </div>
                <Modal
                    title={
                        <Space size="large" style={{display: 'flex', alignItems: 'center'}}>
                            <WarningFilled style={{color: "orange", fontSize: 25}} />
                            <h3>Display Aera too Small</h3>
                        </Space>}
                    open={this.state.tooSmall}
                    closeIcon={null}
                    footer={null}
                    keyboard={false}
                    maskClosable={false}
                    style={{padding: 50}}
                    zIndex={20}
                >
                    <div style={{marginLeft: 40}}>
                        Cannot show all contents on this window. Please resize this window or rotate your phone.
                    </div>
                </Modal>
            </ConfigProvider>
        );
    }
}

export default Index;
