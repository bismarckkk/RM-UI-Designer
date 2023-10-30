import React, {Component} from 'react';
import { Modal } from "antd";
import Render from "@/components/render";
import Menu from "@/components/menu";

class Index extends Component {
    state = { simulate: false }
    modal = null;
    renderRef = React.createRef();

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

    render() {
        return (
            <div className="container" style={{backgroundColor: '#f5f5f5', height: '100vh', paddingBottom: 12, overflow: 'hidden'}}>
                {/*<p className="ds-font">*/}
                {/*    Designer*/}
                {/*</p>*/}
                <Menu
                    save={()=>this.renderRef.current.save()}
                    onObjectEvent={(t, e)=>this.renderRef.current.onObjectEvent(t, e)}
                    generate={()=>this.renderRef.current.generate()}
                    reset={()=>this.renderRef.current.reset()}
                    getFrames={()=>['default']}
                    selectedFrame={'default'}
                />
                <Render className="full" editable={true} ref={this.renderRef} />
            </div>
        );
    }
}

export default Index;
