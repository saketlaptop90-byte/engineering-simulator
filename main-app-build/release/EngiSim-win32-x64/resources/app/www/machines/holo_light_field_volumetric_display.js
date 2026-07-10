import { glass, aluminum, gold } from '../utils/materials.js';

export function createLightFieldVolumetricDisplay(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.CylinderGeometry(2, 2.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, aluminum);
    base.position.y = 0.25;
    group.add(base);

    const domeGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, glass);
    dome.position.y = 0.5;
    group.add(dome);

    const holoGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const holoMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.8 });
    const hologram = new THREE.Mesh(holoGeo, holoMat);
    hologram.position.y = 1.5;
    hologram.name = 'Hologram';
    group.add(hologram);

    const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const holoRotTrack = new THREE.QuaternionKeyframeTrack('Hologram.quaternion', [0, 2, 4], [
        ...qStart.toArray(),
        ...qMid.toArray(),
        ...qEnd.toArray()
    ]);
    const holoPosTrack = new THREE.VectorKeyframeTrack('Hologram.position', [0, 2, 4], [
        0, 1.3, 0,
        0, 1.7, 0,
        0, 1.3, 0
    ]);

    const clip = new THREE.AnimationClip('HoloSpin', 4, [holoRotTrack, holoPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
