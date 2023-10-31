export function readUiFile(str, onEvent, setFrame, render) {
    const data = JSON.parse(str)
    if (!data) {
        return
    }
    let version = 1
    if (data['version']) {
        version = data['version']
    }
    if (version === 1) {
        setFrame('default')
        for (const key of Object.keys(data)) {
            onEvent('_update', data[key])
        }
    } else if (version === 2) {
        for (const frame of Object.keys(data.data)) {
            setFrame(frame)
            for (const key of Object.keys(data.data[frame])) {
                onEvent('_update', data.data[frame][key])
            }
        }
        setFrame(data.selected)
    }
    render()
}