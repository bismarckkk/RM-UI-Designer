import React, {useState} from 'react';
import { Button } from "antd";

interface SwitchButtonProps {
    defaultStatus?: boolean;
    onChange?: (value: boolean) => void;
    onNode?: React.ReactNode;
    offNode?: React.ReactNode;
}

const SwitchButton = (props: SwitchButtonProps) => {
    const [status, setStatus] = useState(props.defaultStatus || false)
    return (
        <Button
            size="small" type="text"
            onClick={()=>{
                props.onChange&&props.onChange(!status)
                setStatus(!status)
            }}
        >
            {
                status ?
                props.onNode || "ON" :
                props.offNode || "OFF"
            }
        </Button>
    );
}

export default SwitchButton;
