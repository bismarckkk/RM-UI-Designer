type UiFrames = Record<string, Record<string, unknown>>;
export type UiFile = { version?: number; selected?: string; data: UiFrames } & Record<string, unknown>;

function normalizeTempFrameName(data: UiFile) {
    if (!data || !data.data || typeof data.data !== 'object') {
        return data
    }

    const frameData = data.data
    const frames = Object.keys(frameData)
    if (!frames.includes('g')) {
        return data
    }

    const isEmptyFrame = (frame: Record<string, unknown> | undefined) => !frame || Object.keys(frame).length === 0
    const normalized = {
        ...data,
        data: {...frameData}
    }

    if (frames.length === 1 && frames[0] === 'g') {
        normalized.data = {default: frameData.g}
        if (normalized.selected === 'g') {
            normalized.selected = 'default'
        }
        return normalized
    }

    if (frames.length === 2 && normalized.data.default !== undefined && isEmptyFrame(normalized.data.default)) {
        normalized.data.default = normalized.data.g
        delete normalized.data.g
        if (normalized.selected === 'g') {
            normalized.selected = 'default'
        }
    }

    return normalized
}

export async function readUiFile(
    data: UiFile,
    onEvent: (type: string, payload: unknown) => void,
    setFrame: (frame: string) => Promise<void> | void,
    render: () => void,
) {
    if (!data) {
        return
    }
    data = normalizeTempFrameName(data)
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
        await setFrame(data.selected ?? 'default')
    }
    render()
}