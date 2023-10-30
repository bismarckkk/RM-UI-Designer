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

export function saveObj(data, fileName) {
    const str = JSON.stringify(data)
    a.href = `data:,${str}`
    a.download = fileName
    a.click()
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
