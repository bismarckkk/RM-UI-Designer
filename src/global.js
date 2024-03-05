import { fabric } from "fabric";

fabric.Object.prototype.isOnScreen = () => true
fabric.ActiveSelection.prototype.hasControls = false

function findCornerQuadrant(fabricObject, control) {
    const cornerAngle = fabricObject.angle + fabric.util.radiansToDegrees(Math.atan2(control.y, control.x)) + 360;
    return Math.round((cornerAngle % 360) / 45);
}

fabric.controlsUtils.skewCursorStyleHandler = (eventData, control, fabricObject) => {
    const notAllowed = 'not-allowed';
    const skewMap = ['ns', 'nesw', 'ew', 'nwse']
    if (control.x !== 0 && fabricObject.lockSkewingY) {
        return notAllowed;
    }
    if (control.y !== 0 && fabricObject.lockSkewingX) {
        return notAllowed;
    }
    const n = findCornerQuadrant(fabricObject, control) % 4;
    return skewMap[n] + '-resize';
}

for(let corner in fabric.Object.prototype.controls) {
    const control = fabric.Object.prototype.controls[corner]
    control.cursorStyleHandler = fabric.controlsUtils.skewCursorStyleHandler
}


if ('serviceWorker' in navigator) {
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
