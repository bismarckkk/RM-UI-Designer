import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Menu, Button, Modal } from 'antd';
import React, { Component } from 'react';
import { Link, Outlet } from 'umi'

const { Header, Content, Footer } = Layout;

class Index extends Component {
    state = { fullscreen: false, path: '/' };
    modal = false;

    componentDidMount() {
        const that = this;
        let lastWidth = 0;

        function resizeHandle(width) {
            if (!that.modal && width < 576 && width !== lastWidth) {
                that.modal = true;
                lastWidth = width;
                Modal.warning({
                    title: '显示窗口过窄',
                    content: '部分内容可能无法完美显示，请调整窗口大小或者将手机转为横屏',
                    onOk: () => {
                        that.modal = false;
                    },
                });
            }
            if (that.modal && width >= 576) {
                Modal.destroyAll();
            }
        }

        resizeHandle(window.innerWidth);

        window.addEventListener('resize', () => {
            resizeHandle(window.innerWidth);
        }, false);
    }

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

    onChange(path) {
        this.setState({ path })
    }

    render() {
        const fullButton = (
            <Button type='link' onClick={() => this.fullScreen()} size={'large'}>
                <FullscreenOutlined style={{ color: 'black' }} />
            </Button>
        );
        const unFullButton = (
            <Button type='link' onClick={() => this.exitFullscreen()} size={'large'}>
                <FullscreenExitOutlined style={{ color: 'black' }} />
            </Button>
        );
        return (
            <div style={{overflow: 'hidden'}}>
                <Layout>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff', paddingRight: 10 }}>
                        <Row>
                            <Col lg={4} md={5} sm={7} xs={14}>
                                <div>
                                    <h3>RoboMaster UI Designer</h3>
                                </div>
                            </Col>
                            <Col lg={17} md={16} sm={13} xs={3}>
                                <Menu theme='light' mode='horizontal' selectedKeys={[this.state.path]}>
                                    <Menu.Item key='/'>
                                        <Link to='/' onClick={()=>this.onChange('/')}>Designer</Link>
                                    </Menu.Item>
                                    <Menu.Item key='/sim' disabled={false}>
                                        <Link to='/sim' onClick={()=>this.onChange('/sim')}>Simulator</Link>
                                    </Menu.Item>
                                </Menu>
                            </Col>
                            <Col md={3} sm={4} xs={7}>
                                <div style={{ alignItems: 'right', float: 'right', marginRight: '5%' }}>
                                    {
                                        this.state.fullscreen ?
                                            unFullButton :
                                            fullButton
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Header>
                    <Content className='site-layout' style={{ marginTop: 20 }}>
                        <div className='site-layout-background'
                             style={{ padding: 24, paddingTop: 56, paddingBottom: 0, minHeight: 'calc(100vh - 84px)' }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>RM UI Designer ©2023 Created by
                        <a href={'https://github.com/bismarckkk'}>Bismarckkk</a>
                    </Footer>
                </Layout>
            </div>
        );
    }
}

export default Index;