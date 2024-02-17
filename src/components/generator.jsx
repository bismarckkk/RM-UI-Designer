import React, {Component} from 'react';
import { Drawer } from "antd";

import GeneratorHelper from "@/utils/generator/generator";

class Generator extends Component {
    state = {show: false}
    data = {}

    gen(data) {
        this.helper = new GeneratorHelper(data)
        this.data = data
        console.log("ui.h")
        console.log(this.helper.toUiH())
        for (let frame of this.helper.frames) {
            for (let group of frame.groups) {
                for (let split of group.splits) {
                    console.log(`ui_${frame.name}_${group.group_name}_${split.split_id}.h`)
                    console.log(split.toSplitH())
                    console.log(`ui_${frame.name}_${group.group_name}_${split.split_id}.c`)
                    console.log(split.toSplitC())
                }
            }
        }
        this.setState({show: true})
    }

    onClose() {
        this.setState({show: false})
    }

    render() {
        return (
            <div>
                <Drawer
                    title="C Code Generator"
                    placement="right"
                    onClose={()=>this.onClose()}
                    open={this.state.show}
                    size="large"
                >
                    <h1>Not yet completed</h1>
                    <p>{JSON.stringify(this.data)}</p>
                </Drawer>
            </div>
        );
    }
}

export default Generator;