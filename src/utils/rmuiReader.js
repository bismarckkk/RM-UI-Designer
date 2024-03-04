export async function readUiFile(data, onEvent, setFrame, render) {
    if (!data) {
        return
    }
    let version = 1
    if (data['version']) {
        version = data['version']
    }
    if (version === 1) {
        await setFrame('default')
        for (const key of Object.keys(data)) {
            onEvent('_update', data[key])
        }
    } else if (version === 2) {
        for (const frame of Object.keys(data.data)) {
            await setFrame(frame)
            for (const key of Object.keys(data.data[frame])) {
                onEvent('_update', data.data[frame][key])
            }
        }
        await setFrame(data.selected)
    }
    render()
}