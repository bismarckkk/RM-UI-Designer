import { dialog, fs } from '@tauri-apps/api';

const a = document.createElement('a')

export const ColorMap = {
    'yellow': 'rgb(255, 238, 70)',
    'green': 'rgb(168, 255, 45)',
    'orange': 'rgb(255, 163, 8)',
    'purple': 'rgb(240, 41, 246)',
    'pink': 'rgb(255, 100, 142)',
    'cyan': 'rgb(69, 255, 242)',
    'white': '#fff',
    'black': '#000',
    'blue': 'rgb(47, 168, 223)',
    'red': 'rgb(255, 69, 70)',
}

export function saveObj(data, fileName, selected) {
    let _data = {version: 2, data: data, selected}
    const str = JSON.stringify(_data)
    if (isTauri()) {
        (async ()=> {
            const path = await dialog.save({
                filters: [{
                    name: 'rmui file',
                    extensions: ['rmui']
                }]
            });
            if (path !== null && path.length > 0) {
                await fs.writeTextFile(path, str)
            }
        })()
    } else {
        a.href = `data:,${str}`
        a.download = fileName
        a.click()
    }
}

export function createObjUrl(file) {
    let url = null;
    if (window.createObjcectURL !== undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url
}

export function isTauri() {
    return window !== undefined && window.__TAURI__ !== undefined
}
