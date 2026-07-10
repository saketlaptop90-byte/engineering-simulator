import { materials } from '../utils/materials.js';

export function createShoreDurometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stand base
    const baseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const base = new THREE.Mesh(baseGeo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    base.position.set(0, 0.05, 0);
    group.add(base);

    // Column
    const columnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
    const column = new THREE.Mesh(columnGeo, materials.metal_light || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    column.position.set(0, 0.45, -0.2);
    group.add(column);

    // Lever arm
    const leverGeo = new THREE.BoxGeometry(0.05, 0.05, 0.3);
    const lever = new THREE.Mesh(leverGeo, materials.metal_dark || new THREE.MeshStandardMaterial({color: 0x333333}));
    lever.position.set(0, 0.7, -0.15);
    group.add(lever);

    // Durometer Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.6, 0);
    group.add(headGroup);

    // Durometer body
    const bodyGeo = new THREE.BoxGeometry(0.15, 0.2, 0.1);
    const body = new THREE.Mesh(bodyGeo, materials.plastic_grey || new THREE.MeshStandardMaterial({color: 0x888888}));
    headGroup.add(body);

    // Dial face
    const dialGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 32);
    const dial = new THREE.Mesh(dialGeo, materials.glass || new THREE.MeshPhysicalMaterial({transmission: 0.9, opacity: 1, transparent: true}));
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, 0.05, 0.05);
    headGroup.add(dial);

    // Indenter
    const indenterGeo = new THREE.ConeGeometry(0.01, 0.05, 16);
    const indenter = new THREE.Mesh(indenterGeo, materials.metal_light || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    indenter.rotation.x = Math.PI;
    indenter.position.set(0, -0.125, 0);
    headGroup.add(indenter);

    // Test Material (Rubber)
    const matGeo = new THREE.BoxGeometry(0.2, 0.05, 0.2);
    const testMat = new THREE.Mesh(matGeo, materials.rubber || new THREE.MeshStandardMaterial({color: 0x111111}));
    testMat.position.set(0, 0.125, 0);
    group.add(testMat);

    // Animation: Head comes down, indents
    const times = [0, 1, 2, 3, 4];
    const headTrack = new THREE.VectorKeyframeTrack(headGroup.uuid + '.position', times, [
        0, 0.6, 0,
        0, 0.2, 0,
        0, 0.18, 0, // press in
        0, 0.2, 0,
        0, 0.6, 0
    ]);

    const clip = new THREE.AnimationClip('TestHardness', 4, [headTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
