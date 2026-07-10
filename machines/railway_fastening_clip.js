import { materials } from '../utils/materials.js';

export function createFasteningClip(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Rail cross-section (base part)
    const railGeo = new THREE.BoxGeometry(0.6, 0.2, 1);
    const railMat = (materials && materials.metalLight) || new THREE.MeshStandardMaterial({color: 0x777777});
    const rail = new THREE.Mesh(railGeo, railMat);
    group.add(rail);

    // Rubber Pad
    const padGeo = new THREE.BoxGeometry(0.65, 0.05, 1.1);
    const padMat = (materials && materials.rubber) || new THREE.MeshStandardMaterial({color: 0x111111});
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = -0.125;
    group.add(pad);

    // Clip pivot
    const clipPivot = new THREE.Group();
    clipPivot.name = 'ClipPivot';
    clipPivot.position.set(0.35, 0.1, 0);
    group.add(clipPivot);

    // Clip (e-clip shape representation)
    const clipGeo = new THREE.TorusKnotGeometry(0.08, 0.03, 64, 8);
    const clipMat = (materials && materials.metalSteel) || new THREE.MeshStandardMaterial({color: 0x555555});
    const clip = new THREE.Mesh(clipGeo, clipMat);
    clipPivot.add(clip);

    // Animation: Clip vibrating
    const times = [0, 0.05, 0.1, 0.15, 0.2];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05, 0, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const trackValues = [
        q3.x, q3.y, q3.z, q3.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const track = new THREE.QuaternionKeyframeTrack(clipPivot.uuid + '.quaternion', times, trackValues);
    const animClip = new THREE.AnimationClip('VibrateClip', 0.2, [track]);
    animationClips.push(animClip);

    return { group, animationClips };
}
