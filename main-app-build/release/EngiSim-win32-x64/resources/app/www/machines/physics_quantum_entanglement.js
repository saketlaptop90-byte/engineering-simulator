import { materials } from '../utils/materials.js';

export function createQuantumEntanglement(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Apparatus Base
    const baseGeometry = new THREE.BoxGeometry(8, 1, 3);
    const base = new THREE.Mesh(baseGeometry, materials.darkSteel);
    group.add(base);

    // Quantum Crystals
    const crystalGeometry = new THREE.OctahedronGeometry(0.6, 0);
    const crystalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0x550055, 
        transparent: true, 
        opacity: 0.9 
    });
    
    const crystal1 = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal1.position.set(-3, 1.5, 0);
    crystal1.name = 'Crystal1';
    group.add(crystal1);

    const crystal2 = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal2.position.set(3, 1.5, 0);
    crystal2.name = 'Crystal2';
    group.add(crystal2);

    // Entanglement Beam Connecting the Crystals
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        transparent: true, 
        opacity: 0.5 
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, 1.5, 0);
    beam.rotation.z = Math.PI / 2;
    beam.name = 'EntanglementBeam';
    group.add(beam);

    // Animation: Crystals rotating synchronously and beam fluctuating
    const times = [0, 1, 2];
    
    const qInitial = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const qFinal = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    // Crystal 1 rotates forward
    const track1 = new THREE.QuaternionKeyframeTrack('Crystal1.quaternion', times, [
        qInitial.x, qInitial.y, qInitial.z, qInitial.w,
        qMid.x, qMid.y, qMid.z, qMid.w,
        qFinal.x, qFinal.y, qFinal.z, qFinal.w
    ]);

    // Crystal 2 rotates backward (entangled state reflection)
    const qMidInverse = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI);
    const qFinalInverse = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI * 2);
    const track2 = new THREE.QuaternionKeyframeTrack('Crystal2.quaternion', times, [
        qInitial.x, qInitial.y, qInitial.z, qInitial.w,
        qMidInverse.x, qMidInverse.y, qMidInverse.z, qMidInverse.w,
        qFinalInverse.x, qFinalInverse.y, qFinalInverse.z, qFinalInverse.w
    ]);

    // Beam Opacity fluctuation
    const beamTimes = [0, 0.5, 1, 1.5, 2];
    const beamOpacities = [0.2, 0.9, 0.2, 0.9, 0.2];
    const track3 = new THREE.NumberKeyframeTrack('EntanglementBeam.material.opacity', beamTimes, beamOpacities);

    const clip = new THREE.AnimationClip('Entangle', 2, [track1, track2, track3]);
    animationClips.push(clip);

    return { group, animationClips };
}
