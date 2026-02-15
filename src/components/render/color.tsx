import React from 'react';
import { ColorMap } from "../../utils/utils";

const Color = (props: any) => {
    if (props.color === 'Main') {
        return (
            <div>
                <div style={{
                    border: "1px solid #aaa",
                    height: 16,
                    width: 16,
                    borderRadius: '20%',
                    display: "inline-flex"
                }}>
                    <div style={{
                        backgroundColor: 'red',
                        height: 12,
                        width: 6,
                        margin: "1px 0 1px 1px",
                        borderTopLeftRadius: '20%',
                        borderBottomLeftRadius: '20%',
                        display: "inline-flex"
                    }} />
                    <div style={{
                        backgroundColor: 'blue',
                        height: 12,
                        width: 6,
                        margin: "1px 1px 1px 0",
                        borderTopRightRadius: '20%',
                        borderBottomRightRadius: '20%',
                        display: "inline-flex"
                    }} />
                </div>
                &nbsp; Main
            </div>
        );
    }
    return (
        <div>
            <div>
                <div style={{
                    border: "1px solid #aaa",
                    height: 16,
                    width: 16,
                    borderRadius: '20%',
                    display: "inline-flex"
                }}>
                    <div style={{
                        backgroundColor: ColorMap[props.color.toLowerCase()],
                        height: 12,
                        width: 12,
                        margin: 1,
                        borderRadius: '20%',
                        display: "inline-flex"
                    }} />
                </div>
                &nbsp; {props.color}
            </div>
        </div>
    );
}

export default Color;
