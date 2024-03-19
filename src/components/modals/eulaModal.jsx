import React, {Component} from 'react';
import { Modal } from "antd";
import Loading from "../../loading";
import Markdown from "react-markdown";

class EulaModal extends Component {
    state = {open: false, content: null}

    componentDidMount() {
        if (!localStorage.getItem('eula')) {
            this.setState({open: true})
            fetch(require('../../assets/eula.md')).then(e=>e.text()).then(e=>{
                this.setState({content: e})
            })
            localStorage.setItem('eula', 'true')
        }
    }

    render() {
        return (
            <Modal
                title="Welcome to RM UI Designer!"
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

export default EulaModal;