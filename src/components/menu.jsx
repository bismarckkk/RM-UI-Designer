import React, { Component, createRef } from 'react';
import { Flex, Button, Dropdown, Modal } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, ThunderboltOutlined, GithubOutlined } from "@ant-design/icons";
import { Link } from 'umi'
import Markdown from 'react-markdown'
import UpdateModal from "@/components/updateModal";
import { getMenuProps } from "@/utils/fabricObjects";

const fileItems = [
    {
        key: 'File-open',
        label: "Open .rmui"
    },
    {
        key: 'File-save',
        label: "Save as .rmui"
    },
    {type: 'divider'},
    {
        key: 'File-generate',
        label: "Generate Code",
        icon: <ThunderboltOutlined />
    }
]

const editItems = [
    {
        key: 'Edit-reset',
        label: "Reset Designer"
    },
    {
        key: 'Edit-undo',
        label: "Undo 🚧"
    },
    {
        key: 'Edit-redo',
        label: "Redo 🚧"
    },
]

const simulateItems = [
    {
        key: 'Simulate-start',
        label: "Start"
    },
    {
        key: 'Simulate-settings',
        label: "Settings"
    }
]

class Menu extends Component {
    state = {fullscreen: false}
    uploadRef = createRef()

    fullScreen() {
        let element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        this.setState({
            fullscreen: true,
        });
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        this.setState({
            fullscreen: false,
        });
    }

    onMenuClick(key) {
        const first = key.keyPath[key.keyPath.length - 1]
        if (first.slice(0, 6) === 'Insert') {
            const type = key.key.slice(7)
            const options = {
                id: -1,
                name: `New${type}`,
                layer: 0,
                group: 'Ungroup',
                type: `Ui${type}`
            }
            this.props.onObjectEvent('_add', options)
        } else if (first === 'Edit-reset') {
            this.props.reset()
        } else if (first === 'File-save') {
            this.props.save()
        } else if (first === 'File-open') {
            this.uploadRef.current.upload('Upload Your .rmui File', '.rmui').then(file=>{
                const reader = new FileReader()
                reader.onload = e => {
                    let str = e.target.result
                    const data = JSON.parse(str)
                    this.props.reset()
                    for (const key of Object.keys(data)) {
                        this.props.onObjectEvent('_update', data[key])
                    }
                }
                reader.readAsText(file)
            })
        } else if (first === "File-generate") {
            this.props.generate(this.data)
        }
    }

    getFramesMenu() {
        const frames = this.props.getFrames()
        const menu = []
        for (const frame of frames) {
            menu.push({
                key: `Frames-${frame}`,
                label: frame
            })
        }
        return menu
    }

    async about() {
        Modal.info({
            title: 'About',
            content: <Markdown>
                {await (await fetch(require('../assets/about.md'))).text()}
            </Markdown>
        })
    }

    render() {
        const fullButton = (
            <Button type='text' onClick={() => this.fullScreen()} style={{padding: 5}}>
                <FullscreenOutlined style={{ color: 'black' }} />
            </Button>
        );
        const unFullButton = (
            <Button type='text' onClick={() => this.exitFullscreen()} style={{padding: 5}}>
                <FullscreenExitOutlined style={{ color: 'black' }} />
            </Button>
        );
        return (
            <div style={{width: "100%", height: 30, backgroundColor: '#fff', padding: 5}}>
                <Flex style={{width: "calc(100% - 200px)", display: 'inline'}} justify="flex-start" align="center">
                    <img
                        style={{display: 'inline', paddingLeft: 12, paddingRight: 6, height: 22, marginTop: -4}}
                        src={require('../../public/logo.png')}
                        alt="logo"
                    />
                    <Dropdown menu={{ items: fileItems, onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">File</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: editItems, onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">Edit</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: getMenuProps(), onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">Insert</Button>
                    </Dropdown>
                    <Dropdown menu={{
                        items: this.getFramesMenu(),
                        onClick: e=>this.onMenuClick(e),
                        selectable: true,
                        selectedKeys: [`Frames-${this.props.selectedFrame}`]
                    }}>
                        <Button type="text" size="small">Frames</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: simulateItems, onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">Simulate🚧</Button>
                    </Dropdown>
                    <Button type="text" size="small" onClick={this.about}>About</Button>
                </Flex>
                <div style={{ alignItems: 'right', float: 'right', marginRight: 5, marginTop: -4}}>
                    <div style={{ display: 'inline', marginRight: 15, fontSize: 10 }}>Created by&nbsp;
                        <Link to="https://github.com/bismarckkk"><Button type="link" style={{padding: 0}}>
                            Bismarckkk
                        </Button></Link>
                    </div>
                    <Link to="https://github.com/bismarckkk/RM-UI-Designer"><Button type="text" style={{padding: 5}}>
                        <GithubOutlined style={{ color: 'black' }} />
                    </Button></Link>
                    {
                        this.state.fullscreen ?
                            unFullButton :
                            fullButton
                    }
                </div>
                <UpdateModal ref={this.uploadRef}/>
            </div>
        );
    }
}

export default Menu;