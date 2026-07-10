import { metals, plastics, lights } from '../utils/materials.js';

export function createVariableMessageSign(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main pole
    const poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const pole = new THREE.Mesh(poleGeometry, metals?.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    pole.position.y = 5;
    group.add(pole);

    // Sign frame
    const frameGeometry = new THREE.BoxGeometry(10, 4, 1);
    const frame = new THREE.Mesh(frameGeometry, metals?.darkAluminum || new THREE.MeshStandardMaterial({ color: 0x333333 }));
    frame.position.y = 10;
    group.add(frame);

    // Sign display
    const displayGeometry = new THREE.PlaneGeometry(9.5, 3.5);
    const display = new THREE.Mesh(displayGeometry, lights?.orange || new THREE.MeshBasicMaterial({ color: 0xffa500 }));
    display.position.set(0, 10, 0.51);
    group.add(display);

    // Animation: Flashing text simulation
    const times = [0, 0.5, 1, 1.5, 2];
    const values = [0, 1, 0, 1, 0];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${display.uuid}.material.opacity`, times, values);
    display.material.transparent = true;
    
    const clip = new THREE.AnimationClip('FlashMessage', 2, [opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
