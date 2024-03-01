import {
    checkUpdate,
    installUpdate,
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { isTauri } from "./utils";


async function _checkUpdate() {
    if (isTauri()) {
        return await checkUpdate()
    } else {
        const timestamp = Date.now();
        const rep = await fetch(`https://ui.bismarck.xyz/update.json?${timestamp}`)
        const data = await rep.json()
        const notes = data.notes
        const version = data.version.slice(1).split('.').map(Number)
        let nowVersion = process.env.VERSION!.slice(1).split('.').map(Number)
        const shouldUpdate = version[0] > nowVersion[0] || version[1] > nowVersion[1] || version[2] > nowVersion[2]
        return {
            shouldUpdate,
            manifest: { body: notes }
        }
    }
}

async function _installUpdate() {
    if (isTauri()) {
        return await installUpdate()
    } else {
        window.location.reload()
    }
}

export default {
    checkUpdate: _checkUpdate,
    installUpdate: _installUpdate,
    relaunch,
}
