import { metals, plastics, lights } from '../utils/materials.js';

export function createRadarSpeedCamera(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pole
    const poleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const pole = new THREE.Mesh(poleGeometry, metals?.galvanizedSteel || new THREE.MeshStandardMaterial({ color: 0x999999 }));
    pole.position.y = 3;
    group.add(pole);

    // Camera box
    const boxGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const box = new THREE.Mesh(boxGeometry, metals?.yellowPainted || new THREE.MeshStandardMaterial({ color: 0xffff00 }));
    box.position.set(0, 6, 0.5);
    group.add(box);

    // Lens
    const lensGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    lensGeometry.rotateX(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeometry, plastics?.black || new THREE.MeshStandardMaterial({ color: 0x111111 }));
    lens.position.set(0, 6.2, 1);
    group.add(lens);

    // Flash
    const flashGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const flash = new THREE.Mesh(flashGeometry, lights?.white || new THREE.MeshBasicMaterial({ color: 0xffffff }));
    flash.position.set(0, 5.7, 1.01);
    group.add(flash);

    // Animation: Flash trigger
    const times = [0, 0.1, 0.2, 3];
    const values = [0, 1, 0, 0];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${flash.uuid}.material.opacity`, times, values);
    flash.material.transparent = true;

    const clip = new THREE.AnimationClip('CameraFlash', 3, [opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
