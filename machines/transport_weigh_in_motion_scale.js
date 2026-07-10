import { metalMaterial, plasticMaterial } from '../utils/materials.js';

export function createWeighInMotionScale(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Roadbed/Foundation
    const bedGeo = new THREE.BoxGeometry(4, 0.2, 6);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x555555 }); // fallback concrete
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, -0.1, 0);
    group.add(bed);

    // Sensor plates
    const plateGeo = new THREE.BoxGeometry(3.5, 0.05, 1);
    const plateMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const plate1 = new THREE.Mesh(plateGeo, plateMat);
    plate1.position.set(0, 0.025, -1.5);
    const plate2 = new THREE.Mesh(plateGeo, plateMat);
    plate2.position.set(0, 0.025, 1.5);
    group.add(plate1, plate2);

    // Display / Control Box
    const boxGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const boxMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(-2.5, 0.5, 0);
    group.add(box);

    // Weight reading display (flashing when vehicle passes)
    const displayGeo = new THREE.PlaneGeometry(0.4, 0.2);
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(-2.24, 0.8, 0);
    display.rotation.y = Math.PI / 2;
    group.add(display);

    // Animation: Plates depress slightly, display lights up
    const times = [0, 0.5, 1, 2, 2.5, 3];
    const plateYValues = [0.025, -0.01, 0.025, 0.025, -0.01, 0.025];
    const p1Track = new THREE.NumberKeyframeTrack(`${plate1.uuid}.position[y]`, times, plateYValues);
    const p2Track = new THREE.NumberKeyframeTrack(`${plate2.uuid}.position[y]`, times, plateYValues);

    const colorTimes = [0, 0.5, 1.5, 2.5, 3.5];
    const colorValues = [
        0, 0, 0,
        0, 1, 0, // Green reading
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ];
    const dispTrack = new THREE.ColorKeyframeTrack(`${display.uuid}.material.color`, colorTimes, colorValues);

    const clip = new THREE.AnimationClip('WeighVehicle', 4, [p1Track, p2Track, dispTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
