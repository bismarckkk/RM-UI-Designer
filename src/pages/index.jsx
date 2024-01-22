import React, {Component} from 'react';
import { Modal, ConfigProvider, theme } from "antd";
import Render from "@/components/render";
import Menu from "@/components/menu";
import enUS from "antd/locale/en_US";

const { darkAlgorithm, compactAlgorithm } = theme;

class Index extends Component {
    state = { simulate: false, darkMode: false }
    modal = null;
    renderRef = React.createRef();
    menuRef = React.createRef();

    componentDidMount() {
        const that = this;
        let lastWidth = 0;

        function resizeHandle(width) {
            if (!that.modal && width < 792 && width !== lastWidth) {
                lastWidth = width;
                that.modal = Modal.warning({
                    title: 'Display Aera too Small',
                    content: 'Cannot show all contents on this window. Please resize this window or rotate your phone.',
                    footer: null
                });
            }
            if (that.modal && width >= 792) {
                that.modal.destroy()
                that.modal = null
            }
        }

        resizeHandle(window.innerWidth);

        window.addEventListener('resize', () => {
            resizeHandle(window.innerWidth);
        }, false);
    }

    setDarkMode(dark) {
        let element = document.documentElement;
        if (dark) {
            element.style.setProperty('--solid-gray', '20');
            element.style.setProperty('--background-color', '#090909');
        } else {
            element.style.setProperty('--solid-gray', '255');
            element.style.setProperty('--background-color', '#f5f5f5');
        }
        this.setState({darkMode: dark})
    }

    render() {
        return (
            <ConfigProvider
                locale={enUS}
                theme={{algorithm: this.state.darkMode ? [darkAlgorithm, compactAlgorithm] : compactAlgorithm, cssVar: { key: 'app' }}}
            >
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
            </ConfigProvider>
        );
    }
}

export default Index;
