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

    gen(data, mode) {
        this.helper = new GeneratorHelper(data, mode !== 'dynamic')
        this.data = data
        this.code = this.helper.gen()
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
            disabled={this.errors.some(error => error.level === 'Error')}
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
                    rootStyle={{inset: '25px 0 0 0'}}
                    style={{borderTop: '3px var(--ant-line-type) var(--ant-color-split)'}}
                    footer={
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: 5
                        }}>
                            {this.state.step === 'check' ? generateButton : downloadButton}
                        </div>
                    }
                >
                    {
                        this.state.step === 'check' ?
                            <CheckPanel errors={this.errors}/> :
                            <DownloadPanel code={this.code} getUiBase={this.helper.getUiBase()} ref={this.downloadRef}/>
                    }
                </Drawer>
            </div>
        );
    }
}

export default Generator;