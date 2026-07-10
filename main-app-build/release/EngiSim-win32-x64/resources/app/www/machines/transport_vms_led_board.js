import { metalMaterial, glassMaterial } from '../utils/materials.js';

export function createVMSLEDBoard(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Support pillars
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
    const pillarMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x555555 });
    const pillar1 = new THREE.Mesh(pillarGeo, pillarMat);
    pillar1.position.set(-3, 2.5, 0);
    const pillar2 = new THREE.Mesh(pillarGeo, pillarMat);
    pillar2.position.set(3, 2.5, 0);
    group.add(pillar1, pillar2);

    // Board housing
    const boardGeo = new THREE.BoxGeometry(6.5, 2, 0.5);
    const board = new THREE.Mesh(boardGeo, pillarMat);
    board.position.set(0, 4, 0);
    group.add(board);

    // LED Screen Base
    const screenGeo = new THREE.PlaneGeometry(6, 1.5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 4, 0.26);
    group.add(screen);

    // Simulated LED text flashing/scrolling by modulating opacity
    const msgGeo = new THREE.PlaneGeometry(5, 1);
    const msgMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 1 });
    const msg = new THREE.Mesh(msgGeo, msgMat);
    msg.position.set(0, 0, 0.01);
    screen.add(msg);

    // Animation: Flashing message
    const times = [0, 0.5, 1, 1.5, 2];
    const values = [1, 0.2, 1, 0.2, 1];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${msg.uuid}.material.opacity`, times, values);

    const clip = new THREE.AnimationClip('FlashMessage', 2, [opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
