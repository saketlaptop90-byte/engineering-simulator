import { gold, carbon } from '../utils/materials.js';

export function createDNADataStorageCrystal(THREE) {
    const group = new THREE.Group();
    group.name = "DNADataStorage";
    const animationClips = [];

    const crystalGeo = new THREE.OctahedronGeometry(3, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff, 
        transmission: 0.9, 
        opacity: 1, 
        transparent: true, 
        roughness: 0, 
        ior: 1.5 
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.name = "Crystal";
    group.add(crystal);

    const dnaGroup = new THREE.Group();
    dnaGroup.name = "DNAGroup";
    
    const baseMat1 = gold || new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const baseMat2 = carbon || new THREE.MeshStandardMaterial({ color: 0x222222 });
    
    for(let i = 0; i < 20; i++) {
        const y = (i - 10) * 0.2;
        const angle = i * 0.5;
        
        const pair = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), baseMat1);
        pair.position.y = y;
        pair.rotation.y = angle;
        pair.rotation.z = Math.PI / 2;
        dnaGroup.add(pair);

        const node1 = new THREE.Mesh(new THREE.SphereGeometry(0.15), baseMat2);
        node1.position.set(Math.cos(angle) * 0.75, y, -Math.sin(angle) * 0.75);
        dnaGroup.add(node1);

        const node2 = new THREE.Mesh(new THREE.SphereGeometry(0.15), baseMat2);
        node2.position.set(-Math.cos(angle) * 0.75, y, Math.sin(angle) * 0.75);
        dnaGroup.add(node2);
    }
    group.add(dnaGroup);

    // Animation: DNA spinning and crystal pulsating
    const times = [0, 0.5, 1, 1.5, 2];
    const dnaRot = [];
    for(let i = 0; i < 5; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (i / 4) * Math.PI * 2);
        dnaRot.push(...q.toArray());
    }
    const dnaRotTrack = new THREE.QuaternionKeyframeTrack("DNAGroup.quaternion", times, dnaRot);

    const crystalScale = [1, 1, 1,  1.1, 1.1, 1.1,  1, 1, 1,  1.1, 1.1, 1.1,  1, 1, 1];
    const crystalScaleTrack = new THREE.VectorKeyframeTrack("Crystal.scale", times, crystalScale);

    const clip = new THREE.AnimationClip('Store', 2, [dnaRotTrack, crystalScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
