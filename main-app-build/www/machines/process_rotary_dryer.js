import { materials } from '../utils/materials.js';

export function createRotaryDryer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Rotary drum
    const drumGeom = new THREE.CylinderGeometry(3, 3, 20, 32);
    drumGeom.rotateZ(Math.PI / 2); // Align with X axis
    const drum = new THREE.Mesh(drumGeom, materials.steel);
    
    // Tilt slightly
    const drumGroup = new THREE.Group();
    drumGroup.add(drum);
    drumGroup.rotation.z = 0.1; // slight incline
    group.add(drumGroup);

    // Support rollers
    for(let i of [-6, 6]) {
        for(let j of [-1.5, 1.5]) {
            const rollerGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
            rollerGeom.rotateX(Math.PI / 2);
            const roller = new THREE.Mesh(rollerGeom, materials.iron);
            roller.position.set(i, -3, j);
            group.add(roller);
        }
    }

    // Material falling inside (just a few particles for visual)
    const particleGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const pGeom = new THREE.SphereGeometry(0.2, 8, 8);
        const pMat = new THREE.MeshStandardMaterial({color: 0x8b4513});
        const p = new THREE.Mesh(pGeom, pMat);
        p.position.set((Math.random()-0.5)*18, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
        particleGroup.add(p);
    }
    drumGroup.add(particleGroup);

    // Drum rotation animation (rotate around X axis)
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 2*Math.PI);
    
    const rotTrack = new THREE.QuaternionKeyframeTrack(
        `${drum.uuid}.quaternion`,
        [0, 2, 4],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );
    const clip = new THREE.AnimationClip('RotateDrum', 4, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
