import React from 'react';
import { Flex } from "antd";
import { CheckOutlined } from "@ant-design/icons";

interface CheckedItemProps {
    checked?: boolean;
    children?: React.ReactNode;
}

const CheckedItem = (props: CheckedItemProps) => (
    <Flex style={{width: '100%'}} justify="space-between">
        {props.children}
        <div>
            {
                props.checked &&
                <CheckOutlined />
            }
        </div>
    </Flex>
);

export default CheckedItem;
