import * as materials from '../utils/materials.js';

export function createSquirrelCageRotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const aluminumMaterial = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xa8a8a8, metalness: 0.8, roughness: 0.3 });
    const steelMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const ironMaterial = materials.iron || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.7 });

    const rotorGroup = new THREE.Group();

    // Laminated core
    const coreGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const core = new THREE.Mesh(coreGeo, ironMaterial);
    rotorGroup.add(core);

    // End rings
    const ringGeo = new THREE.TorusGeometry(1.8, 0.2, 16, 32);
    const topRing = new THREE.Mesh(ringGeo, aluminumMaterial);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 2;
    rotorGroup.add(topRing);

    const bottomRing = new THREE.Mesh(ringGeo, aluminumMaterial);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = -2;
    rotorGroup.add(bottomRing);

    // Rotor bars (skewed slightly)
    const barGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.2, 8);
    const numBars = 24;
    for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2;
        const bar = new THREE.Mesh(barGeo, aluminumMaterial);
        
        // Position on the edge
        bar.position.x = Math.cos(angle) * 1.8;
        bar.position.z = Math.sin(angle) * 1.8;
        
        // Skew
        bar.rotation.y = 0.1;
        
        rotorGroup.add(bar);
    }

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
    const shaft = new THREE.Mesh(shaftGeo, steelMaterial);
    rotorGroup.add(shaft);

    group.add(rotorGroup);

    // Spin animation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const spinTrack = new THREE.QuaternionKeyframeTrack(
        rotorGroup.uuid + '.quaternion',
        [0, 0.5, 1],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const clip = new THREE.AnimationClip('RotorSpin', 1, [spinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
