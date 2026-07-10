import { materials } from '../utils/materials.js';

export function createMolecularSimulationNode(THREE) {
    const group = new THREE.Group();
    group.name = 'MolecularSimulationNode';

    // Core node
    const coreGeo = new THREE.IcosahedronGeometry(1, 1);
    const coreMat = materials.metallic || new THREE.MeshStandardMaterial({color: 0x333333, metalness: 0.9, roughness: 0.1});
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'Core';
    group.add(core);

    // Electron Orbits
    for(let i=0; i<3; i++) {
        const orbitGeo = new THREE.TorusGeometry(2, 0.05, 16, 100);
        const orbitMat = materials.accent || new THREE.MeshBasicMaterial({color: 0x00aaff, transparent: true, opacity: 0.7});
        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.rotation.x = Math.PI / 2;
        orbit.rotation.y = (Math.PI / 3) * i;
        
        // Add a small electron
        const electronGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const electronMat = materials.highlight || new THREE.MeshBasicMaterial({color: 0xffffff});
        const electron = new THREE.Mesh(electronGeo, electronMat);
        electron.position.x = 2;
        orbit.add(electron);
        
        orbit.name = `OrbitRing${i}`;
        group.add(orbit);
    }

    // Animation: core spinning
    const tracks = [];
    
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*1.5);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    
    const rotValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ];
    
    const coreRotTrack = new THREE.QuaternionKeyframeTrack('Core.quaternion', [0, 0.5, 1.0, 1.5, 2.0], rotValues);
    tracks.push(coreRotTrack);

    const clip = new THREE.AnimationClip('SpinSimulation', 2, tracks);

    return { group, animationClips: [clip] };
}
