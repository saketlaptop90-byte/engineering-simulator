import { metalMaterial, plasticMaterial } from '../utils/materials.js';

export function createTrafficSignalController(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base box
    const boxGeo = new THREE.BoxGeometry(1, 2, 0.8);
    const boxMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    // Door
    const doorGeo = new THREE.BoxGeometry(0.9, 1.8, 0.05);
    const door = new THREE.Mesh(doorGeo, boxMat);
    door.position.set(0, 0, 0.425);
    group.add(door);

    // Blinking indicator light
    const lightGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(0, 1.05, 0);
    group.add(light);

    // Control panel details
    const panelGeo = new THREE.PlaneGeometry(0.8, 1.6);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 0, 0.455);
    group.add(panel);

    // Animation: Blinking light
    const times = [0, 0.5, 1];
    const values = [1, 0, 0,  0, 0, 0,  1, 0, 0]; // Red toggle
    const colorTrack = new THREE.ColorKeyframeTrack(`${light.uuid}.material.emissive`, times, values);
    
    const clip = new THREE.AnimationClip('Blink', 1, [colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
