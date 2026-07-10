import { steelMaterial, ironMaterial, aluminumMaterial } from '../utils/materials.js';

export function createInternalCombustionBlock(THREE) {
    const group = new THREE.Group();
    group.name = "CombustionBlock";

    // Engine block housing
    const blockGeometry = new THREE.BoxGeometry(4, 3, 2);
    const block = new THREE.Mesh(blockGeometry, ironMaterial || new THREE.MeshStandardMaterial({ color: 0x555555 }));
    group.add(block);

    // Crankshaft
    const crankGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4.5, 16);
    const crankshaft = new THREE.Mesh(crankGeometry, steelMaterial || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    crankshaft.rotation.z = Math.PI / 2;
    crankshaft.position.y = -1;
    crankshaft.name = "Crankshaft";
    
    // In THREE.js, if we animate rotation via QuaternionKeyframeTrack, it replaces the base rotation. 
    // We add an inner group to preserve the 90 degree tilt while allowing simple spinning.
    const crankWrapper = new THREE.Group();
    crankWrapper.position.y = -1;
    crankshaft.position.y = 0;
    crankWrapper.add(crankshaft);
    crankWrapper.name = "CrankWrapper";
    group.add(crankWrapper);

    // Pistons
    const pistonGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const piston1 = new THREE.Mesh(pistonGeometry, aluminumMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    piston1.position.set(-1.5, 1, 0);
    piston1.name = "Piston1";
    group.add(piston1);

    const piston2 = new THREE.Mesh(pistonGeometry, aluminumMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    piston2.position.set(1.5, 1, 0);
    piston2.name = "Piston2";
    group.add(piston2);

    // Animations
    const piston1Track = new THREE.VectorKeyframeTrack('Piston1.position', [0, 0.5, 1], [-1.5, 1.5, 0, -1.5, 0.5, 0, -1.5, 1.5, 0]);
    const piston2Track = new THREE.VectorKeyframeTrack('Piston2.position', [0, 0.5, 1], [1.5, 0.5, 0, 1.5, 1.5, 0, 1.5, 0.5, 0]);
    
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    const crankTrack = new THREE.QuaternionKeyframeTrack('CrankWrapper.quaternion', [0, 0.5, 1], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const clip = new THREE.AnimationClip("EngineRun", 1, [piston1Track, piston2Track, crankTrack]);
    
    return { group, animationClips: [clip] };
}
