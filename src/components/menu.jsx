import React, { Component, createRef } from 'react';
import { Flex, Button, Dropdown } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, ThunderboltOutlined,
    GithubOutlined, CloseOutlined, MinusOutlined } from "@ant-design/icons";
import Icon from '@ant-design/icons';
import FormModal from "@/components/modals/formModal";
import { getMenuProps } from "@/utils/fabricObjects";
import AboutModal from "@/components/modals/aboutModal";
import { ReactComponent as MoonSvg } from "@/assets/moon.svg"
import { ReactComponent as SunSvg } from "@/assets/sun.svg"
import { appWindow } from '@tauri-apps/api/window';
import { exit } from '@tauri-apps/api/process';
import { isTauri } from "@/utils/utils";
import Generator from "@/components/generator";

const fileItems = [
    {
        key: 'File-new',
        label: "New Project"
    },
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

let editItems = [
    {
        key: 'Edit-undo',
        label: "Undo"
    },
    {
        key: 'Edit-redo',
        label: "Redo"
    },
    {
        key: 'Edit-reset',
        label: "Reset History"
    },
]

const simulateItems = [
    {
        key: 'Simulate-start',
        label: "Start",
        disable: true
    },
    {
        key: 'Simulate-settings',
        label: "Settings",
        disable: true
    }
]

class Menu extends Component {
    state = { fullscreen: false, frames: ['default'], selectedFrame: 'default', darkMode: false, couldUndo: false, couldRedo: false }
    formRef = createRef()
    aboutRef = createRef()
    generatorRef = createRef()
    tauri = isTauri()

    async componentDidMount() {
        if (this.tauri) {
            const maximized = await appWindow.isMaximized()
            this.setState({fullscreen: maximized})
        }
    }

    setCouldDo(e) {
        this.setState({couldUndo: e.couldPrevious, couldRedo: e.couldNext})
    }

    fullScreen() {
        if (this.tauri) {
            appWindow.maximize()
        } else {
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
        }
        this.setState({
            fullscreen: true,
        });
    }

    exitFullscreen() {
        if (this.tauri) {
            appWindow.unmaximize()
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
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
            this.props.onHistoryEvent('resetNow')
        } else if (first === 'Edit-undo') {
            this.props.onHistoryEvent('previous')
        } else if (first === 'Edit-redo') {
            this.props.onHistoryEvent('next')
        } else if (first === 'File-new') {
            this.props.reset()
            this.props.onHistoryEvent('reset')
        } else if (first === 'File-save') {
            this.props.save()
        } else if (first === 'File-open') {
            this.props.upload()
        } else if (first === "File-generate") {
            this.generatorRef.current?.gen(this.props.getData())
        } else if (first === 'FrameOp-add') {
            const name = await this.formRef.current.open('New Frame', this.state.frames)
            this.props.setFrame('add', name)
        } else if (first === 'FrameOp-remove') {
            this.props.setFrame('remove', this.state.selectedFrame)
        } else if (first === 'FrameOp-copy') {
            const name = await this.formRef.current.open('Copy Frame To', this.state.frames)
            this.props.setFrame('copy', name)
        } else if (first === 'FrameOp-rename') {
            const name = await this.formRef.current.open('Rename Frame To', this.state.frames)
            this.props.setFrame('rename', name)
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
                key: 'FrameOp-copy',
                label: "Copy This Frame"
            },
            {
                key: 'FrameOp-rename',
                label: "Rename This Frame"
            },
            {
                key: 'FrameOp-remove',
                label: "Remove This Frame"
            },
            {
                key: 'FrameOp-change',
                label: 'Change to',
                selectable: 'true',
                children: []
            },
        ]
        for (const frame of this.state.frames) {
            menu[4].children.push({
                key: `Frames-${frame}`,
                label: frame
            })
        }
        return menu
    }

    render() {
        const fullButton = (
            <Button type='text' onClick={() => this.fullScreen()} size="small" >
                <FullscreenOutlined style={{ color: 'var(--ant-color-text)' }}/>
            </Button>
        );
        const unFullButton = (
            <Button type='text' onClick={() => this.exitFullscreen()} size="small" >
                <FullscreenExitOutlined style={{ color: 'var(--ant-color-text)' }}/>
            </Button>
        );
        const moonButton = (
            <Button type='text' onClick={() => this.props.setDarkMode(true)} size="small">
                <Icon component={MoonSvg} />
            </Button>
        )
        const sunButton = (
            <Button type='text' onClick={() => this.props.setDarkMode(false)} size="small">
                <Icon component={SunSvg} />
            </Button>
        )
        editItems[0]['disabled'] = !this.state.couldUndo
        editItems[1]['disabled'] = !this.state.couldRedo
        return (
            <div style={{width: "100%", height: 32, marginTop: -5}} className="solid-color" data-tauri-drag-region>
                <Flex
                    style={{width: "100vw", display: 'flex', paddingTop: -5}}
                    justify="flex-start" align="center" data-tauri-drag-region
                >
                    <div
                        style={{
                            fontFamily: 'YouSheBiaoTiHei',
                            fontSize: 20,
                            paddingLeft: 6, paddingRight: 6, paddingTop: 3,
                            display: 'flex',
                            color: 'var(--ant-color-text)',
                            cursor: 'default'
                        }}
                        data-tauri-drag-region
                    >
                        RoboMaster UI Designer
                    </div>
                    <Dropdown menu={{ items: fileItems, onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">File</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: [...editItems], onClick: e=>this.onMenuClick(e) }}>
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
                    <div
                        style={{ marginRight: 5, justifyContent: 'flex-end', marginLeft: 'auto', marginTop: 2}}
                        data-tauri-drag-region
                    >
                        <div
                            style={{
                                display: 'inline', marginRight: 15, fontSize: 10, cursor: 'default',
                                color: 'var(--ant-color-text)'
                            }}
                            data-tauri-drag-region
                        >
                            Created by&nbsp;
                            <a href="https://github.com/bismarckkk" target="_blank">
                                <Button type="link" style={{padding: 0}} size="small" data-tauri-drag-region>
                                    Bismarckkk
                                </Button>
                            </a>
                        </div>
                        {
                            this.props.darkMode ?
                                sunButton :
                                moonButton
                        }
                        <a href="https://github.com/bismarckkk/RM-UI-Designer" target="_blank">
                            <Button type="text" size="small">
                                <GithubOutlined style={{ color: 'var(--ant-color-text)' }} />
                            </Button>
                        </a>
                        <Button
                            type="text" size="small"
                            onClick={() => appWindow.minimize()}
                            style={{display: this.tauri ? 'inline' : 'none'}}
                        >
                            <MinusOutlined style={{ color: 'var(--ant-color-text)' }} />
                        </Button>
                        {
                            this.state.fullscreen ?
                                unFullButton :
                                fullButton
                        }

                        <Button
                            type="text" size="small"
                            onClick={() => exit()}
                            style={{display: this.tauri ? 'inline' : 'none'}}
                        >
                            <CloseOutlined style={{ color: 'var(--ant-color-text)' }} />
                        </Button>
                    </div>
                </Flex>
                <FormModal ref={this.formRef} />
                <AboutModal ref={this.aboutRef} />
                <Generator ref={this.generatorRef}/>
            </div>
        );
    }
}

export default Menu;
