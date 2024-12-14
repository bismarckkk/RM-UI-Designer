import React, { Component, createRef } from 'react';
import { Flex, Button, Dropdown, Badge } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, ThunderboltOutlined,
    GithubOutlined, CloseOutlined, MinusOutlined } from "@ant-design/icons";
import Icon from '@ant-design/icons';
import FormModal from "@/components/modals/formModal";
import { getMenuProps } from "@/utils/fabricObjects";
import AboutModal from "@/components/modals/aboutModal";
import ModeModal from "@/components/modals/modeModal";
import { ReactComponent as MoonSvg } from "@/assets/moon.svg"
import { ReactComponent as SunSvg } from "@/assets/sun.svg"
import SerialModal from "@/components/modals/serialModal";
import LogDrawer from "@/components/modals/logDrawer";
import RxDrawer from "@/components/modals/rxDrawer";
import CheckedItem from "@/components/menu/checkedItem";
import { message } from "@/utils/app";
import { appWindow } from '@tauri-apps/api/window';
import { exit } from '@tauri-apps/api/process';
import {isTauri, saveObj, uploadFile} from "@/utils/utils";
import Generator from "@/components/generator";
import SerialFrom from "@/utils/serial/webSerialFromDriver";
import SerialTo from "@/utils/serial/webSerialToDriver";
import { FileHandler } from "@/utils/autoSaver";


const fileItems = [
    {
        key: 'File-new',
        label: "New"
    },
    {
        key: 'File-open',
        label: "Open"
    },
    {
        key: 'File-save',
        label: "Save"
    },
    {
        key: 'File-saveAs',
        label: "Save as"
    },
    {
        key: 'File-autoSave',
        label: "Auto Save"
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
        key: 'Simulate-from',
        label: 'From Robot',
        children: [
            {
                key: 'Simulate-from-start',
                label: "Start"
            },
            {
                key: 'Simulate-from-stop',
                label: "Stop"
            },
            {
                key: 'Simulate-from-log',
                label: "Debug Log"
            },
            {
                key: 'Simulate-from-rx',
                label: "Rx History"
            },
        ]
    },
    {
        key: 'Simulate-to',
        label: 'To Referee',
        children: [
            {
                key: 'Simulate-to-start',
                label: "Start"
            },
            {
                key: 'Simulate-to-stop',
                label: "Stop"
            },
            {
                key: 'Simulate-to-update',
                label: "Update"
            },
        ]
    },
    {
        key: 'Simulate-settings',
        label: "Settings"
    }
]

class Menu extends Component {
    state = {
        fullscreen: false,
        frames: ['default'],
        selectedFrame: 'default',
        darkMode: false,
        couldUndo: false,
        couldRedo: false,
        serialStart: false,
        serialToStart: false,
        autoSave: true,
    }
    formRef = createRef()
    aboutRef = createRef()
    generatorRef = createRef()
    logDrawerRef = createRef()
    rxDrawerRef = createRef()
    serialModalRef = createRef()
    modeModalRef = createRef()
    tauri = isTauri()
    serial = new SerialFrom(e => this.onSerialEvent(e), e => this.onSerialError(e))
    serialTo = new SerialTo()
    fileHandler = null


    onSerialEvent(e) {
        const res = []
        for (let event of e.events) {
            const rr = this.props.onObjectEvent(event.type, event.obj)
            if (rr[0] === 'W' || rr[0] === 'E') {
                res.push(rr)
            }
        }
        return res
    }

    onSerialError(e) {
        this.props.setEditable(true)
        this.setState({serialStart: false})
        message.error(e.text)
    }

    async componentDidMount() {
        const that = this
        async function resync() {
            const maximized = await appWindow.isMaximized()
            that.setState({fullscreen: maximized})
        }

        if (this.tauri) {
            await resync()
            await appWindow.onResized(_ => resync())
        }

        while (true) {
            const mode = await this.modeModalRef.current?.open()
            if (mode === 'new') {
                this.fileHandler = new FileHandler(() => {
                    return JSON.stringify({version: 2, data: this.props.getData(), selected: this.state.selectedFrame})
                })
                if (await this.fileHandler.create()) {
                    this.props.upload(await this.fileHandler.read())
                    break
                }
            } else if (mode === 'open') {
                this.fileHandler = new FileHandler(() => {
                    return JSON.stringify({version: 2, data: this.props.getData(), selected: this.state.selectedFrame})
                })
                if (await this.fileHandler.open()) {
                    this.props.upload(await this.fileHandler.read())
                    break
                }
            } else {
                this.setState({autoSave: false})
                break
            }
        }

        window.addEventListener('keydown', async e => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();

                if (this.fileHandler) {
                    await this.fileHandler.save()
                } else {
                    saveObj(this.props.getData(), 'ui.rmui', this.state.selectedFrame)
                }
            }
        });
    }

    setCouldDo(e) {
        this.setState({couldUndo: e.couldPrevious, couldRedo: e.couldNext})
        if (this.fileHandler && this.state.autoSave) {
            this.fileHandler.update()
        }
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
            if (this.fileHandler) {
                await this.fileHandler.disableAutoSave()
                this.setState({autoSave: false})
                if (await this.fileHandler.create()) {
                    this.props.upload(await this.fileHandler.read())
                    this.fileHandler.enableAutoSave()
                    this.setState({autoSave: true})
                }
            } else {
                this.props.reset()
                this.props.onHistoryEvent('reset')
            }
        } else if (first === 'File-save') {
            if (this.fileHandler) {
                await this.fileHandler.save()
            } else {
                saveObj(this.props.getData(), 'ui.rmui', this.state.selectedFrame)
            }
        } else if (first === 'File-saveAs') {
            if (this.fileHandler) {
                await this.fileHandler.disableAutoSave()
                this.setState({autoSave: false})
                if (await this.fileHandler.create()) {
                    await this.fileHandler.save()
                    this.fileHandler.enableAutoSave()
                    this.setState({autoSave: true})
                }
            }
        } else if (first === 'File-autoSave') {
            if (this.fileHandler) {
                if (this.state.autoSave) {
                    await this.fileHandler.disableAutoSave()
                } else {
                    this.fileHandler.enableAutoSave()
                }
                this.setState({autoSave: !this.state.autoSave})
            }
        } else if (first === 'File-open') {
            if (this.fileHandler) {
                await this.fileHandler.disableAutoSave()
                this.setState({autoSave: false})
                if (await this.fileHandler.open()) {
                    this.props.upload(await this.fileHandler.read())
                    this.fileHandler.enableAutoSave()
                    this.setState({autoSave: true})
                }
            } else {
                uploadFile('.rmui').then(file => {
                    this.props.upload(file)
                }).catch(() => {})
            }
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
        } else if (key.key === 'Simulate-from-start') {
            try {
                await this.serial.connect()
                this.props.setEditable(false)
                this.setState({serialStart: true})
            } catch (e) {
                message.error(e.text)
            }
        } else if (key.key === 'Simulate-from-stop') {
            try {
                await this.serial.stop()
                this.props.setEditable(true)
                this.setState({serialStart: false})
            } catch (e) {
                message.error(e.text)
            }
        } else if (key.key === 'Simulate-from-log') {
            this.logDrawerRef.current?.show(this.serial.getLog())
        } else if (key.key === 'Simulate-from-rx') {
            this.rxDrawerRef.current?.show(this.serial.getHistory())
        } else if (key.key === 'Simulate-to-start') {
            try {
                await this.serialTo.connect()
                message.warning('This Module is beta now, maybe not work!')
                this.setState({serialToStart: true})
            } catch (e) {
                message.error(e.text)
            }
        } else if (key.key === 'Simulate-to-stop') {
            try {
                await this.serialTo.stop()
                this.setState({serialToStart: false})
            } catch (e) {
                message.error(e.text)
            }
        } else if (key.key === 'Simulate-to-update') {
            try {
                await this.serialTo.write({data: this.props.getData(), selected: this.state.selectedFrame})
            } catch (e) {
                message.error(e.text)
            }
        }  else if (first === 'Simulate-settings') {
            const options = await this.serialModalRef.current?.getOptions(this.serial.options)
            if (options) {
                this.serial.options = options
            }
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
        simulateItems[0]['disabled'] = this.state.serialToStart
        simulateItems[1]['disabled'] = this.state.serialStart
        simulateItems[2]['disabled'] = this.state.serialStart || this.state.serialToStart
        simulateItems[0].children[0]['disabled'] = this.state.serialStart
        simulateItems[0].children[1]['disabled'] = !this.state.serialStart
        simulateItems[1].children[0]['disabled'] = this.state.serialToStart
        simulateItems[1].children[1]['disabled'] = !this.state.serialToStart
        simulateItems[1].children[2]['disabled'] = !this.state.serialToStart
        fileItems[3]['disabled'] = !this.fileHandler
        fileItems[4]['disabled'] = !this.fileHandler
        fileItems[4]['label'] = <CheckedItem checked={this.state.autoSave}>
            Auto Save
        </CheckedItem>
        return (
            <div style={{width: "100%", height: 32, marginTop: -5, zIndex: 2000, position: 'relative'}} className="solid-color" data-tauri-drag-region>
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
                    <Dropdown menu={{ items: [...fileItems], onClick: e=>this.onMenuClick(e) }}>
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
                    <Dropdown menu={{ items: [...simulateItems], onClick: e=>this.onMenuClick(e) }}>
                        <Button type="text" size="small">
                            Simulate&nbsp;
                            <Badge color={this.state.serialStart || this.state.serialToStart?"green":"red"} />
                        </Button>
                    </Dropdown>
                    <Button type="text" size="small" onClick={()=> {
                        this.aboutRef.current?.show()
                    }}>About</Button>
                    <div
                        style={{marginRight: 5, justifyContent: 'flex-end', marginLeft: 'auto', marginTop: 2}}
                        data-tauri-drag-region
                    >
                        {
                            process.env.VERSION.slice(0, 7) !== 'nightly' && <div
                                style={{
                                    display: 'inline', marginRight: 15, fontSize: 10, cursor: 'default',
                                    color: 'var(--ant-color-text)'
                                }}
                                data-tauri-drag-region
                            >
                                Try&nbsp;
                                <a href="/nightly">
                                    <Button type="link" style={{padding: 0}} size="small" data-tauri-drag-region>
                                        Nightly
                                    </Button>
                                </a>
                            </div>
                        }
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
                                <GithubOutlined style={{color: 'var(--ant-color-text)'}}/>
                            </Button>
                        </a>
                        <Button
                            type="text" size="small"
                            onClick={() => appWindow.minimize()}
                            style={{display: this.tauri ? 'inline' : 'none'}}
                        >
                            <MinusOutlined style={{color: 'var(--ant-color-text)'}}/>
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
                            <CloseOutlined style={{color: 'var(--ant-color-text)'}}/>
                        </Button>
                    </div>
                </Flex>
                <FormModal ref={this.formRef}/>
                <AboutModal ref={this.aboutRef}/>
                <Generator ref={this.generatorRef}/>
                <LogDrawer ref={this.logDrawerRef}/>
                <RxDrawer ref={this.rxDrawerRef}/>
                <SerialModal ref={this.serialModalRef}/>
                <ModeModal ref={this.modeModalRef}/>
            </div>
        );
    }
}

export default Menu;
