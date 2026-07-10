import { getMaterials } from '../utils/materials.js';

export function createAxialPistonPump(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const mMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const mSteel = materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
    const mBrass = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.3 });
    const mIron = materials.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.6 });
    
    const casingGeometry = new THREE.CylinderGeometry(2, 2, 6, 32);
    const casingMaterial = mMetal.clone();
    casingMaterial.transparent = true;
    casingMaterial.opacity = 0.3;
    const casing = new THREE.Mesh(casingGeometry, casingMaterial);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);

    const shaftGroup = new THREE.Group();
    shaftGroup.name = 'shaftGroup';
    
    const shaftGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const shaft = new THREE.Mesh(shaftGeometry, mSteel);
    shaft.rotation.x = Math.PI / 2;
    shaftGroup.add(shaft);

    const swashplateGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const swashplate = new THREE.Mesh(swashplateGeometry, mBrass);
    swashplate.rotation.x = Math.PI / 6; 
    swashplate.position.z = -1;
    shaftGroup.add(swashplate);

    const cylinderBlockGeometry = new THREE.CylinderGeometry(1.6, 1.6, 3, 32);
    const cylinderBlock = new THREE.Mesh(cylinderBlockGeometry, mIron);
    cylinderBlock.rotation.x = Math.PI / 2;
    cylinderBlock.position.z = 1.5;
    shaftGroup.add(cylinderBlock);

    for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const pistonGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
        const piston = new THREE.Mesh(pistonGeometry, mSteel);
        piston.rotation.x = Math.PI / 2;
        piston.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, 1.5);
        shaftGroup.add(piston);
    }
    
    group.add(shaftGroup);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2 - 0.01);
    const shaftTrack = new THREE.QuaternionKeyframeTrack(`shaftGroup.quaternion`, [0, 1, 2], [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]);

    const clip = new THREE.AnimationClip('PumpOperation', 2, [shaftTrack]);

    return { group, animationClips: [clip] };
}
