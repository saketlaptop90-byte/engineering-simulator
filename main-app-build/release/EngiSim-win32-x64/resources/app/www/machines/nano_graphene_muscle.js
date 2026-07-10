import { gold, carbon } from '../utils/materials.js';

export function createGrapheneMuscle(THREE) {
    const group = new THREE.Group();
    group.name = "GrapheneMuscle";
    const animationClips = [];

    const muscleMat = carbon || new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, clearcoat: 1.0 });
    
    const sheetsCount = 10;
    const sheetsGroup = new THREE.Group();
    sheetsGroup.name = "SheetsGroup";

    for(let i = 0; i < sheetsCount; i++) {
        const sheetGeo = new THREE.BoxGeometry(4, 0.05, 2);
        const sheet = new THREE.Mesh(sheetGeo, muscleMat);
        sheet.position.y = (i - sheetsCount / 2) * 0.2;
        sheetsGroup.add(sheet);
    }
    group.add(sheetsGroup);

    const connectorMat = gold || new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const leftCap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 2.2), connectorMat);
    leftCap.position.x = -2.25;
    leftCap.name = "LeftCap";
    group.add(leftCap);

    const rightCap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 2.2), connectorMat);
    rightCap.position.x = 2.25;
    rightCap.name = "RightCap";
    group.add(rightCap);

    // Animation: Muscle contracting
    const times = [0, 1, 2];
    const sheetsScaleValues = [1, 1, 1,  0.5, 1.5, 1,  1, 1, 1];
    const leftCapPosValues = [-2.25, 0, 0,  -1.25, 0, 0,  -2.25, 0, 0];
    const rightCapPosValues = [2.25, 0, 0,  1.25, 0, 0,  2.25, 0, 0];

    const sheetsTrack = new THREE.VectorKeyframeTrack("SheetsGroup.scale", times, sheetsScaleValues);
    const leftCapTrack = new THREE.VectorKeyframeTrack("LeftCap.position", times, leftCapPosValues);
    const rightCapTrack = new THREE.VectorKeyframeTrack("RightCap.position", times, rightCapPosValues);

    const clip = new THREE.AnimationClip('Contract', 2, [sheetsTrack, leftCapTrack, rightCapTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
