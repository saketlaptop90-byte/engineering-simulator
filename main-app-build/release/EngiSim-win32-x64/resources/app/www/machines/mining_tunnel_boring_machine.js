import * as materials from '../utils/materials.js';

export function createTunnelBoringMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.8 });
    const matYellow = materials.yellowMaterial || new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.5, metalness: 0.2 });
    const matDark = materials.darkMaterial || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.5 });

    // Main Body
    const bodyGeo = new THREE.CylinderGeometry(4.8, 5, 20, 32);
    bodyGeo.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, matYellow);
    group.add(body);

    // Cutter Head
    const headGroup = new THREE.Group();
    headGroup.name = "CutterHead";
    const headGeo = new THREE.CylinderGeometry(5.2, 5.2, 2, 32);
    headGeo.rotateZ(Math.PI / 2);
    const head = new THREE.Mesh(headGeo, matMetal);
    headGroup.add(head);

    // Cutter Teeth
    const toothGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const radius = i % 2 === 0 ? 4.5 : 2.5;
        const tooth = new THREE.Mesh(toothGeo, matDark);
        tooth.position.set(1.2, Math.cos(angle) * radius, Math.sin(angle) * radius);
        tooth.rotation.x = angle;
        headGroup.add(tooth);
    }
    
    headGroup.position.set(11, 0, 0);
    group.add(headGroup);

    // Conveyor inside TBM
    const conveyorGeo = new THREE.BoxGeometry(40, 0.5, 2);
    const conveyor = new THREE.Mesh(conveyorGeo, matDark);
    conveyor.position.set(-9, -2, 0);
    group.add(conveyor);

    // Trailing Gear (Backup)
    const trailingGeo = new THREE.BoxGeometry(30, 6, 6);
    const trailing = new THREE.Mesh(trailingGeo, matMetal);
    trailing.position.set(-25, -1, 0);
    group.add(trailing);

    // Animation: Spinning Cutter Head
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 2);
    const values = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    
    const rotationTrack = new THREE.QuaternionKeyframeTrack('CutterHead.quaternion', times, values);
    const clip = new THREE.AnimationClip('TBM_Operation', 2, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
