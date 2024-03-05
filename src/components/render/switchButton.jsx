import React, {Component} from 'react';
import { Button } from "antd";

class SwitchButton extends Component {
    state = { status: this.props.defaultStatus || false }

    render() {
        return (
            <Button
                size="small" type="text"
                onClick={()=>{
                    this.props.onChange&&this.props.onChange(!this.state.status)
                    this.setState({status: !this.state.status})
                }}
            >
                {
                    this.state.status ?
                    this.props.onNode || "ON" :
                    this.props.offNode || "OFF"
                }
            </Button>
        );
    }
}

export default SwitchButton;