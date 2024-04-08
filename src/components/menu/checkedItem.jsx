import React, {Component} from 'react';
import { Flex } from "antd";
import { CheckOutlined } from "@ant-design/icons";

class CheckedItem extends Component {
    render() {
        return (
            <Flex style={{width: '100%'}} justify="space-between">
                {this.props.children}
                <div>
                    {
                        this.props.checked &&
                        <CheckOutlined />
                    }
                </div>
            </Flex>
        );
    }
}

export default CheckedItem;