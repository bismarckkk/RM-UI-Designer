import React, {Component} from 'react';
import { Modal } from "antd";
import Loading from "../../loading";
import Markdown from "react-markdown";

class AboutModal extends Component {
    state = {open: false, content: null}

    show() {
        this.setState({open: true})
    }

    componentDidMount() {
        fetch(require('../../assets/about.md')).then(e=>e.text()).then(e=>{
            this.setState({content: e})
        })
    }

    render() {
        return (
            <Modal
                title="About"
                onOk={()=>this.setState({open: false})}
                onCancel={()=>this.setState({open: false})}
                footer={null}
                open={this.state.open}
            >
                {
                    this.state.content ?
                        <Markdown
                            components={{
                                a: ({node, ...props}) => <a {...props} target="_blank" />
                            }}
                        >
                            {this.state.content}
                        </Markdown> :
                        <Loading />
                }
            </Modal>
        );
    }
}

export default AboutModal;