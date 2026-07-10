import { materials } from '../utils/materials.js';

export function createRTG(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.3 });
    const darkMetalMat = materials?.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.5 });
    const glowMat = (materials?.glowOrange || new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.8 })).clone();

    // Main body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 32), metalMat);
    group.add(body);

    // Radiator fins
    for (let i = 0; i < 8; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.5, 2.5), darkMetalMat);
        fin.rotation.y = (i * Math.PI) / 4;
        group.add(fin);
    }

    // Inner core
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 16), glowMat);
    core.name = "rtgCore";
    group.add(core);

    // Heat pulsing animation
    const times = [0, 1, 2];
    const values = [0.5, 1.0, 0.5];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${core.name}.material.opacity`, times, values);
    const clip = new THREE.AnimationClip('HeatPulse', 2, [opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
