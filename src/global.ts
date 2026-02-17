import { fabric } from "fabric";
import {isNightly} from "./utils/utils";
import generatorWasmUrl from './assets/rm_ui_generator.wasm?url'

fabric.Object.prototype.isOnScreen = () => true
fabric.ActiveSelection.prototype.hasControls = false

type FabricWithControls = typeof fabric & { controlsUtils: { skewCursorStyleHandler: (eventData: MouseEvent, control: fabric.Control, fabricObject: fabric.Object) => string } };
const fabricControls = (fabric as FabricWithControls).controlsUtils

function findCornerQuadrant(fabricObject: fabric.Object, control: fabric.Control) {
    const cornerAngle = (fabricObject.angle ?? 0) + fabric.util.radiansToDegrees(Math.atan2(control.y, control.x)) + 360;
    return Math.round((cornerAngle % 360) / 45);
}

fabricControls.skewCursorStyleHandler = (eventData: MouseEvent, control: fabric.Control, fabricObject: fabric.Object) => {
    void eventData
    const notAllowed = 'not-allowed';
    const skewMap = ['ew', 'nesw', 'ns', 'nwse']
    if (control.x !== 0 && (fabricObject as fabric.Object & { lockSkewingY?: boolean }).lockSkewingY) {
        return notAllowed;
    }
    if (control.y !== 0 && (fabricObject as fabric.Object & { lockSkewingX?: boolean }).lockSkewingX) {
        return notAllowed;
    }
    const n = findCornerQuadrant(fabricObject, control) % 4;
    return skewMap[n] + '-resize';
}

const controls = fabric.Object.prototype.controls
for(let corner in controls) {
    const control = controls[corner]
    control.cursorStyleHandler = fabricControls.skewCursorStyleHandler
}


if ('serviceWorker' in navigator && process.env.VERSION !== 'development' && process.env.VERSION.slice(0, 7) !== 'nightly') {
    navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
            for(let registration of registrations) {
                if(registration && registration.scope === 'https://ui.bismarck.xyz/'){
                    registration.unregister();
                }
            }
        });
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

if (process.env.VERSION !== 'development') {
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {window.dataLayer!.push(args);}
    gtag('js', new Date());

    gtag('config', 'G-4PDL1SSV9H');
}

var Module = {
    locateFile: (file: string) => {
        if (file === 'rm_ui_generator.wasm') {
            return generatorWasmUrl;
        }
        return file;
    }
}
window.Module = Module

const generatorScript = document.createElement('script')
if (isNightly()) {
    generatorScript.src = '/nightly/rm_ui_generator.js'
} else {
    generatorScript.src = '/rm_ui_generator.js'
}
document.head.appendChild(generatorScript);
