import { darkSteel, aluminum, copper } from '../utils/materials.js';

export function createVocalCordSynth(THREE) {
    const group = new THREE.Group();
    group.name = "VocalCordSynth";

    const frameGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    group.add(frame);

    const cordL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 8), copper);
    cordL.name = "CordL";
    cordL.position.set(-0.2, 0, 0);
    group.add(cordL);

    const cordR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 8), aluminum);
    cordR.name = "CordR";
    cordR.position.set(0.2, 0, 0);
    group.add(cordR);

    const times = [0, 0.1, 0.2, 0.3, 0.4];
    const posL = [
        -0.2, 0, 0,
        -0.1, 0, 0,
        -0.2, 0, 0,
        -0.15, 0, 0,
        -0.2, 0, 0
    ];
    const posR = [
        0.2, 0, 0,
        0.1, 0, 0,
        0.2, 0, 0,
        0.15, 0, 0,
        0.2, 0, 0
    ];

    const trackL = new THREE.VectorKeyframeTrack('CordL.position', times, posL);
    const trackR = new THREE.VectorKeyframeTrack('CordR.position', times, posR);
    const clip = new THREE.AnimationClip('Vibrate', 0.4, [trackL, trackR]);

    return { group, animationClips: [clip] };
}
