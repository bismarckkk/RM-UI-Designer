import React, {Component, createRef} from 'react';
import { Drawer, Button } from "antd";
import CheckPanel from "@/components/generator/checkPanel";
import DownloadPanel from "@/components/generator/downloadPanel";

import GeneratorHelper from "@/utils/generator/generatorHelper";

class Generator extends Component {
    state = {show: false, step: 'check'}
    downloadRef = createRef()
    data = {}
    errors = []

    gen(data) {
        this.helper = new GeneratorHelper(data)
        this.data = data
        this.code = {ui: {h: this.helper.toUiH()}}
        for (let frame of this.helper.frames) {
            for (let group of frame.groups) {
                for (let split of group.splits) {
                    this.code[`ui_${frame.name}_${group.group_name}_${split.split_id}`] = {
                        c: split.toSplitC(),
                        h: split.toSplitH()
                    }
                }
            }
        }
        this.errors = this.helper.check()
        this.setState({show: true, step: 'check'})
    }

    onClose() {
        this.setState({show: false})
    }

    render() {
        let generateButton = <Button
            type="primary"
            onClick={() => this.setState({step: 'generate'})}
            disabled={this.errors.filter(error => error.level === 'error').length > 0}
        >
            Generate
        </Button>
        let downloadButton = <Button
            type="primary"
            onClick={() => this.downloadRef?.current?.downloadChecked()}
        >
            Download
        </Button>
        return (
            <div>
                <Drawer
                    title="C Code Generator"
                    placement="right"
                    onClose={() => this.onClose()}
                    open={this.state.show}
                    size="large"
                    getContainer={document.getElementById('content-in')}
                    rootStyle={{position: 'absolute'}}
                >
                    {
                        this.state.step === 'check' ?
                            <CheckPanel errors={this.errors} /> :
                            <DownloadPanel code={this.code} ref={this.downloadRef} />
                    }
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        height: '50px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '5px 24px 5px 5px',
                        borderTop: 'var(--ant-line-width) var(--ant-line-type) var(--ant-color-split)'
                    }}>
                        {this.state.step === 'check' ? generateButton : downloadButton}
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default Generator;