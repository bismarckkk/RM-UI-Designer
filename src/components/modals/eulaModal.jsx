import React, {Component} from 'react';
import {Button, Modal, Space} from "antd";
import Loading from "../../loading";
import Markdown from "react-markdown";

class EulaModal extends Component {
    state = {open: false, content: null}

    componentDidMount() {
        const text = localStorage.getItem('eula')
        if (!text || !JSON.parse(text)){
            this.setState({open: true})
            fetch(require('../../assets/eula.md')).then(e=>e.text()).then(e=>{
                this.setState({content: e})
            })
        }
    }

    dontShow() {
        localStorage.setItem('eula', 'true')
        this.setState({open: false})
    }

    render() {
        return (
            <Modal
                title="Welcome to RM UI Designer!"
                onOk={()=>this.setState({open: false})}
                onCancel={()=>this.setState({open: false})}
                footer={<Space>
                    <Button onClick={this.dontShow.bind(this)}>Don't show</Button>
                    <Button type="primary" onClick={()=>this.setState({open: false})}>OK</Button>
                </Space>}
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

export default EulaModal;