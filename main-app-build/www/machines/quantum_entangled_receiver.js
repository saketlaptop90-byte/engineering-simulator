import { aluminum, copper, darkSteel } from '../utils/materials.js';

export function createEntangledPhotonReceiver(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Containment Base
    const baseGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    group.add(base);

    // Stabilizer Stand
    const standGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 16);
    const stand = new THREE.Mesh(standGeo, aluminum);
    stand.position.set(0, 1, 0);
    group.add(stand);

    // Electromagnetic Containment Rings
    const ringGeo1 = new THREE.TorusGeometry(1, 0.05, 32, 100);
    const ring1 = new THREE.Mesh(ringGeo1, copper);
    ring1.position.set(0, 2.5, 0);
    ring1.name = "containmentRing1";
    group.add(ring1);
    
    const ringGeo2 = new THREE.TorusGeometry(0.8, 0.05, 32, 100);
    const ring2 = new THREE.Mesh(ringGeo2, aluminum);
    ring2.position.set(0, 2.5, 0);
    ring2.name = "containmentRing2";
    group.add(ring2);

    // Trapped Quantum Crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.4);
    const crystalMat = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0xaa00aa, 
        emissiveIntensity: 2, 
        wireframe: true 
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(0, 2.5, 0);
    crystal.name = "quantumCrystal";
    group.add(crystal);

    // Animations: Multi-axis rotation simulating quantum state alignment
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const r1Track = new THREE.QuaternionKeyframeTrack(
        'containmentRing1.quaternion', 
        [0, 1, 2], 
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );
    
    const qy1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const qy2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const qy3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const r2Track = new THREE.QuaternionKeyframeTrack(
        'containmentRing2.quaternion', 
        [0, 1, 2], 
        [...qy1.toArray(), ...qy2.toArray(), ...qy3.toArray()]
    );
    const crystalTrack = new THREE.QuaternionKeyframeTrack(
        'quantumCrystal.quaternion', 
        [0, 1, 2], 
        [...qy1.toArray(), ...qy2.toArray(), ...qy3.toArray()]
    );

    const clip = new THREE.AnimationClip('Receiver_Spin', 2, [r1Track, r2Track, crystalTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
