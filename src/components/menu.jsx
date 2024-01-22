import React, { Component, createRef } from 'react';
import { Flex, Button, Dropdown } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, ThunderboltOutlined, GithubOutlined } from "@ant-design/icons";
import Icon from '@ant-design/icons';
import FormModal from "@/components/modals/formModal";
import { getMenuProps } from "@/utils/fabricObjects";
import AboutModal from "@/components/modals/aboutModal";
import { ReactComponent as MoonSvg } from "@/assets/moon.svg"
import { ReactComponent as SunSvg } from "@/assets/sun.svg"

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
    state = {fullscreen: false, frames: ['default'], selectedFrame: 'default', darkMode: false}
    formRef = createRef()
    aboutRef = createRef()

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

    setFrames(info) {
        this.setState({frames: info.frames, selectedFrame: info.selected})
    }

    async onMenuClick(key) {
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
            this.props.upload()
        } else if (first === "File-generate") {
            this.props.generate(this.data)
        } else if (first === 'FrameOp-add') {
            const name = await this.formRef.current.open('New Frame', this.state.frames)
            this.props.setFrame('add', name)
        } else if (first === 'FrameOp-remove') {
            this.props.setFrame('remove', this.state.selectedFrame)
        } else if (first === 'FrameOp-copy') {
            const name = await this.formRef.current.open('Copy Frame To', this.state.frames)
            this.props.setFrame('copy', name)
        } else if (first === 'FrameOp-change') {
            const name = key.key.slice(7)
            this.props.setFrame('change', name)
        }
    }

    getFramesMenu() {
        const menu = [
            {
                key: 'FrameOp-add',
                label: "New Frame"
            },
            {
                key: 'FrameOp-remove',
                label: "Remove This Frame"
            },
            {
                key: 'FrameOp-copy',
                label: "Copy This Frame"
            },
            {
                key: 'FrameOp-change',
                label: 'Change to',
                selectable: 'true',
                children: []
            },
        ]
        for (const frame of this.state.frames) {
            menu[3].children.push({
                key: `Frames-${frame}`,
                label: frame
            })
        }
        return menu
    }

    render() {
        const fullButton = (
            <Button type='text' onClick={() => this.fullScreen()}>
                <FullscreenOutlined style={{ color: 'var(--text-color)' }} />
            </Button>
        );
        const unFullButton = (
            <Button type='text' onClick={() => this.exitFullscreen()}>
                <FullscreenExitOutlined style={{ color: 'var(--text-color)' }} />
            </Button>
        );
        const moonButton = (
            <Button type='text' onClick={() => this.props.setDarkMode(true)}>
                <Icon component={MoonSvg} />
            </Button>
        )
        const sunButton = (
            <Button type='text' onClick={() => this.props.setDarkMode(false)}>
                <Icon component={SunSvg} />
            </Button>
        )
        return (
            <div style={{width: "100%", height: 30, padding: 5}} className="solid-color">
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
                        selectedKeys: [`Frames-${this.state.selectedFrame}`]
                    }}>
                        <Button type="text" size="small">Frames</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: simulateItems, onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">Simulate🚧</Button>
                    </Dropdown>
                    <Button type="text" size="small" onClick={()=> {
                        this.aboutRef.current?.show()
                    }}>About</Button>
                </Flex>
                <div style={{ alignItems: 'right', float: 'right', marginRight: 5, marginTop: -4}}>
                    <div style={{ display: 'inline', marginRight: 15, fontSize: 10, color: 'var(--text-color)' }}>Created by&nbsp;
                        <a href="https://github.com/bismarckkk"><Button type="link" style={{padding: 0}}>
                            Bismarckkk
                        </Button></a>
                    </div>
                    {
                        this.props.darkMode ?
                            sunButton :
                            moonButton
                    }
                    <a href="https://github.com/bismarckkk/RM-UI-Designer"><Button type="text">
                        <GithubOutlined style={{ color: 'var(--text-color)' }} />
                    </Button></a>
                    {
                        this.state.fullscreen ?
                            unFullButton :
                            fullButton
                    }
                </div>
                <FormModal ref={this.formRef} />
                <AboutModal ref={this.aboutRef} />
            </div>
        );
    }
}

export default Menu;
