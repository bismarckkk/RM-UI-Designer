import React, {useRef, useState} from 'react';
import {Card, Dropdown, Tree, Space, Flex} from "antd";
import type { MenuProps } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { DownOutlined, EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import SwitchButton from "./switchButton";

type ElementNode = {
    id: number;
    name: string;
    layer?: string | number;
    group?: string | number;
    [key: string]: unknown;
};

type ElementsProps = {
    data: Record<string, ElementNode>;
    selectedId: Array<number | string>;
    editable: boolean;
    onSelect: (ids: number[]) => void;
    onObjectEvent: (type: string, payload: unknown) => void;
    onReset: () => Promise<void>;
};

type TreeLeaf = { title: React.ReactNode; key: string };
type TreeGroup = { title: React.ReactNode; key: string; children: TreeLeaf[]; isLeaf?: boolean };
type TreeNode = TreeLeaf | TreeGroup;

function selectId2Key(ids: Array<number | string>) {
    return ids.map((id: number | string) => id === -2 ? 'window' : `E-${id}`)
}

const items = [
    {key: 'D1-group-layer', label: 'layer'},
    {key: 'D1-group-group', label: 'group'}
]

const Elements = (props: ElementsProps) => {
    const [rightClickMenuOpen, setRightClickMenuOpen] = useState(false)
    const [groupKey, setGroupKey] = useState('layer')
    const treeDataRef = useRef<TreeNode[]>([])

    const selectKey2id = (keys: React.Key[]) => {
        const res: number[] = []
        for (const key of keys) {
            const keyStr = String(key)
            if (keyStr === 'window') {
                res.push(-2)
            } else {
                if (keyStr.startsWith('E-')) {
                    res.push(parseInt(keyStr.slice(2)))
                } else {
                    const group = treeDataRef.current.find((e) => e.key === keyStr) as TreeGroup | undefined
                    const ids = group?.children.map((e: TreeLeaf) => parseInt(e.key.slice(2))) ?? []
                    for (const id of ids) {
                        if (!res.includes(id)) {
                            res.push(id)
                        }
                    }
                }
            }
        }
        return res
    }

    const onElementMenuContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        if (target.classList.value.includes('ant-dropdown-menu')) {
            return;
        }
        console.log(target.className)
        setRightClickMenuOpen(false)
        if (target.classList.contains('ant-tree') || (!e.ctrlKey && !e.shiftKey)) {
            props.onSelect([])
        }
    }

    const onElementMenuClick = (e: MenuInfo) => {
        setRightClickMenuOpen(false)
        if (e.key === 'D2-copy') {
            let info = null
            const target = e.domEvent.target as HTMLElement | null
            if (target?.localName !== 'input' && props.selectedId.length !== 0 &&props.selectedId[0] !== -2) {
                e.domEvent.preventDefault()
                info = JSON.stringify(props.selectedId.map((id) => props.data[String(id)]))
            }
        } else if (e.key === 'D2-delete') {
            for (let id of props.selectedId) {
                console.log(id)
                console.log(props.onObjectEvent('remove', {id}))
            }
        }
    }

    const onElementRightClick = (e: { node: { key: React.Key } }) => {
        let id = selectKey2id([e.node.key])
        if (!(id[0] in props.selectedId)) {
            props.onSelect(id)
        }
    }

    const onSelect = (nodes: React.Key[]) => {
        if (nodes.length === 0) {
            return
        }
        let ids = selectKey2id(nodes)
        if (ids.includes(-2)) {
            ids = [ids[ids.length - 1]]
        }
        props.onSelect(ids)
    }

    const onMenuOpenChange = (e: boolean) => {
        if (e) {
            setTimeout(()=>{
                if (props.selectedId.length !== 0 && props.selectedId[0] !== -2) {
                    setRightClickMenuOpen(true)
                } else {
                    setRightClickMenuOpen(false)
                }
            }, 100)
        } else {
            setRightClickMenuOpen(false)
        }
    }

    const elementsMenuOnClick = (key: { key: string }) => {
        setGroupKey(key.key.slice(9))
    }

    const updateTree = () => {
        const key = groupKey
        let treeDataList: TreeGroup[] = []
        const keys = Object.keys(props.data)
        for (let i = 0; i < keys.length; i++) {
            const node = props.data[keys[i]]

            let pos = -1
            for (let j = 0; j < treeDataList.length; j++) {
                if (treeDataList[j].key === `${key}-${node[key]}`) {
                    pos = j
                    break
                }
            }
            if (pos === -1) {
                treeDataList.push({
                    title: `${key} ${node[key]}`, key: `${key}-${node[key]}`, children: [], isLeaf: false
                })
                pos = treeDataList.length - 1
            }

            treeDataList[pos].children.push({
                title: <Flex justify="space-between" style={{width: '100%'}}>
                    {node.name}
                    <Space>
                        <SwitchButton
                            onChange={(e)=>props.onObjectEvent('setAttr', {id: node.id, payload: {visible: e}})}
                            defaultStatus={true}
                            offNode={<EyeInvisibleOutlined/>}
                            onNode={<EyeOutlined/>}
                        />
                        <SwitchButton
                            onChange={(e)=>props.onObjectEvent('setAttr', {id: node.id, payload: {selectable: e}})}
                            defaultStatus={true}
                            offNode={<LockOutlined/>}
                            onNode={<UnlockOutlined style={{transform: 'scaleX(-1)'}}/>}
                        />
                    </Space>
                </Flex>,
                key: `E-${keys[i]}`
            })
        }

        treeDataList = treeDataList.sort((a, b) => a.key.toString().localeCompare(b.key.toString()))

        const result: TreeNode[] = [...treeDataList]
        result.unshift({title: "UI Window", key: 'window'})

        treeDataRef.current = result
        return result
    }

    return (
            <Card
                size="small"
                title="Elements"
                style={{height: "100%"}}
                extra={
                    <Dropdown
                        menu={{
                            items,
                            onClick: (e)=>elementsMenuOnClick(e as { key: string }),
                            selectable: true,
                            selectedKeys: [`D1-group-${groupKey}`]
                        }}
                    >
                        <Space style={{fontSize: 11}}>
                            Group by
                            <DownOutlined size={12} />
                        </Space>
                    </Dropdown>
                }
            >
                <div
                    className="card-body"
                    onMouseUp={(e)=>onElementMenuContainerClick(e)}
                >
                    <Dropdown
                        menu={{
                            items: [
                                {key: 'D2-copy', label: 'Copy'},
                                {key: 'D2-delete', label: 'Delete', danger: true}
                            ],
                            onClick: (e)=>{onElementMenuClick(e)}
                        }}
                        trigger={['contextMenu']}
                        open={rightClickMenuOpen}
                        onOpenChange={(e)=>{onMenuOpenChange(e)}}
                    >
                        <Tree
                            className="full"
                            treeData={updateTree()}
                            onSelect={(e)=>onSelect(e)}
                            selectedKeys={selectId2Key(props.selectedId)}
                            onRightClick={(e)=>onElementRightClick(e)}
                            defaultExpandAll={true}
                            showLine={true}
                            blockNode={true}
                            multiple={true}
                            selectable={props.editable}
                        />
                    </Dropdown>
                </div>
            </Card>
    );
}

export default Elements;
