import { metalMaterial, plasticMaterial, glassMaterial } from '../utils/materials.js';

export function createAutomatedTollGate(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base cabinet
    const cabinetGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const cabinetMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.position.set(-2, 0.6, 0);
    group.add(cabinet);

    // Boom barrier arm
    const boomGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    // Rotate to lay flat initially
    boomGeo.translate(0, 2, 0); 
    const boomMat = plasticMaterial || new THREE.MeshStandardMaterial({ color: 0xffffff });
    const boom = new THREE.Mesh(boomGeo, boomMat);
    boom.rotation.z = Math.PI / 2; // horizontal
    boom.position.set(-1.6, 1, 0); // pivot point
    group.add(boom);

    // Light on boom
    const lightGeo = new THREE.SphereGeometry(0.1);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(0, 4, 0); // at the end of the boom
    boom.add(light);

    // Toll Reader
    const readerGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const readerMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const reader = new THREE.Mesh(readerGeo, readerMat);
    reader.position.set(-2, 1.5, 0.5);
    group.add(reader);

    // Animation: Open and Close boom
    // We animate boom.rotation.z from Math.PI/2 to 0 and back
    const times = [0, 2, 4, 6];
    const values = [Math.PI / 2, 0, 0, Math.PI / 2];
    const rotTrack = new THREE.NumberKeyframeTrack(`${boom.uuid}.rotation[z]`, times, values);

    // Change light color
    const colorTimes = [0, 1.9, 2, 4, 4.1, 6];
    const colorValues = [
        1, 0, 0, // red
        1, 0, 0, 
        0, 1, 0, // green when open
        0, 1, 0,
        1, 0, 0, // red
        1, 0, 0
    ];
    const colorTrack = new THREE.ColorKeyframeTrack(`${light.uuid}.material.color`, colorTimes, colorValues);

    const clip = new THREE.AnimationClip('GateCycle', 6, [rotTrack, colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
