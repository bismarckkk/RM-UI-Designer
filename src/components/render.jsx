import React, {Component} from 'react';
import { Tree, Card, Col, Row } from "antd";

class Render extends Component {
    data = [[], [], [], [], [], [], [], [], [], []]
    state = {treeData: []}

    updateTree() {
        let treeData = [{title: "UI Window", key: 'window'}]
        for (let i = 0; i < 10; i++) {
            treeData.push({
                title: `Layer${i}`,
                key: `L${i}`,
                children: [],
                isLeaf: false
            })
            for (let j = 0; j < this.data[i].length; j++) {
                treeData[i].children.push({
                    title: this.data[i][j].name,
                    key: `L${i}-${j}`,
                })
            }
        }
        this.setState({treeData})
    }

    componentDidMount() {
        this.updateTree()
    }

    render() {
        return (
            <div className="full">
                <Row warp={false} className="full" gutter={12}>
                    <Col flex="300px">
                        <div style={{height: "50%", paddingBottom: 12}}>
                            <Card size="small" title="Items" style={{height: "100%"}}>
                                <Tree className="card-body" treeData={this.state.treeData} />
                            </Card>
                        </div>
                        <Card size="small" title="Properties" style={{height: "50%"}}>
                            <div className="card-body">
                                Properties
                            </div>
                        </Card>
                    </Col>
                    <Col flex="auto">
                        <div className="full" id="ui" style={{backgroundColor: "#FFF"}} >
                            <h1 className="ds-font" style={{padding: 40}}>
                                UI Panel
                            </h1>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Render;