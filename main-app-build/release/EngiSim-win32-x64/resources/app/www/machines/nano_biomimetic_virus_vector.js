import { gold, carbon } from '../utils/materials.js';

export function createBiomimeticVirusVector(THREE) {
    const group = new THREE.Group();
    group.name = "BiomimeticVirusVector";
    const animationClips = [];

    // Capsid (head)
    const customMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x44aa44, 
        metalness: 0.1, 
        roughness: 0.2, 
        transmission: 0.8, 
        ior: 1.5 
    });
    const capsidGeo = new THREE.IcosahedronGeometry(2, 0);
    const capsid = new THREE.Mesh(capsidGeo, customMat);
    capsid.name = "VirusCapsid";
    capsid.position.y = 4;
    group.add(capsid);

    // Tail
    const tailMat = carbon || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const tailGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.name = "VirusTail";
    tail.position.y = 1;
    group.add(tail);

    // Legs
    const legMat = gold || new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const legGeo = new THREE.CylinderGeometry(0.1, 0.05, 3, 8);
    
    const legsGroup = new THREE.Group();
    legsGroup.position.y = -1;
    for(let i = 0; i < 6; i++) {
        const leg = new THREE.Mesh(legGeo, legMat);
        const angle = (i / 6) * Math.PI * 2;
        leg.position.x = Math.cos(angle) * 1.5;
        leg.position.z = Math.sin(angle) * 1.5;
        leg.rotation.x = Math.sin(angle) * 0.5;
        leg.rotation.z = -Math.cos(angle) * 0.5;
        legsGroup.add(leg);
    }
    group.add(legsGroup);

    // Animation: Injection (Tail compresses and Capsid moves down)
    const times = [0, 1, 2];
    const tailScaleValues = [1, 1, 1,  1, 0.5, 1,  1, 1, 1];
    const capsidPosValues = [0, 4, 0,  0, 2, 0,  0, 4, 0];

    const tailTrack = new THREE.VectorKeyframeTrack("VirusTail.scale", times, tailScaleValues);
    const capsidTrack = new THREE.VectorKeyframeTrack("VirusCapsid.position", times, capsidPosValues);

    const clip = new THREE.AnimationClip('Inject', 2, [tailTrack, capsidTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
