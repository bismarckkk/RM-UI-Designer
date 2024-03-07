import {dialog, fs} from '@tauri-apps/api';
import JSZip from 'jszip';

const a = document.createElement('a')
const input = document.createElement('input')

input.type = 'file'

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

function getFilter(name) {
    let suffix = name.split('.').pop()
    return {
        name: suffix + ' file',
        extensions: [suffix]
    }
}

export function saveText(text, fileName) {
    if (isTauri()) {
        (async ()=> {
            const path = await dialog.save({
                filters: [getFilter(fileName)],
                defaultPath: fileName
            });
            if (path !== null && path.length > 0) {
                await fs.writeTextFile(path, text)
            }
        })()
    } else {
        const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        // 释放创建的URL，以节省内存
        URL.revokeObjectURL(url);
    }
}

export function saveBlob(blob, fileName) {
    if (isTauri()) {
        (async ()=> {
            const path = await dialog.save({
                filters: [getFilter(fileName)],
                defaultPath: fileName
            });
            if (path !== null && path.length > 0) {
                const arrayBuffer = await blob.arrayBuffer();
                await fs.writeBinaryFile(path, arrayBuffer);
            }
        })()
    } else {
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
}

export function saveObj(data, fileName, selected) {
    let _data = {version: 2, data: data, selected}
    const str = JSON.stringify(_data)
    saveText(str, fileName)
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

async function createZip(files) {
    let zip = new JSZip();

    files.forEach(file => {
        zip.file(file.fileName, file.content);
    });

    return await zip.generateAsync({type: "blob"});
}

export async function code2zip(code) {
    let files = []
    for (let key in code) {
        for (let suffix in code[key]) {
            files.push({fileName: `${key}.${suffix}`, content: code[key][suffix]})
        }
    }
    return await createZip(files)
}

export function uploadFile(accept) {
    return new Promise((resolve, reject) => {
        if (isTauri()) {
            let _accept = [accept.slice(1)]
            let _acceptType = `${_accept} file`
            if (accept === 'image/*') {
                _accept = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg']
                _acceptType = 'image'
            }
            (async ()=> {
                const path = await dialog.open({
                    multiple: false,
                    directory: false,
                    filters: [{ name: _acceptType, extensions: _accept }]
                })
                if (path !== null && path.length > 0) {
                    const _path = path.replace(/\\/g, '/')
                    const fileName = _path.split('/').pop()
                    const blob = new Blob([await fs.readBinaryFile(path)]);
                    const file = new File([blob], fileName);
                    resolve(file)
                } else {
                    reject();
                }
            })()
        } else {
            input.accept = accept;
            input.value = '';
            input.onchange = () => {
                if (input.files.length > 0) {
                    const file = input.files[0];
                    resolve(file);
                } else {
                    reject(new Error('No file selected'));
                }
            };
            input.click();
        }
    })
}

export function isEditable(element) {
    if (element.getAttribute('contentEditable') === "true") {
        return true;
    }

    return element.tagName === "INPUT" || element.tagName === "TEXTAREA";
}
