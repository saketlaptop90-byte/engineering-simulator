import { materials } from '../utils/materials.js';

export function createTourbillon(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cage (Gold)
    const cage = new THREE.Group();
    cage.name = "Cage";
    
    const cageRingGeom = new THREE.TorusGeometry(1, 0.05, 16, 100);
    const cageRing = new THREE.Mesh(cageRingGeom, materials.gold);
    cage.add(cageRing);
    
    // Balance Wheel (Brass)
    const balance = new THREE.Group();
    balance.name = "Balance";

    const balanceRingGeom = new THREE.TorusGeometry(0.8, 0.05, 16, 100);
    const balanceRing = new THREE.Mesh(balanceRingGeom, materials.brass);
    balance.add(balanceRing);
    
    const spokeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.6);
    const spoke1 = new THREE.Mesh(spokeGeometry, materials.brass);
    const spoke2 = new THREE.Mesh(spokeGeometry, materials.brass);
    spoke2.rotation.z = Math.PI / 2;
    balance.add(spoke1);
    balance.add(spoke2);

    cage.add(balance);
    group.add(cage);

    // Animation: Cage rotating slowly, Balance wheel oscillating quickly
    const cageTrack = new THREE.NumberKeyframeTrack(
        'Cage.rotation[y]',
        [0, 60],
        [0, Math.PI * 2]
    );

    const balanceTrack = new THREE.NumberKeyframeTrack(
        'Balance.rotation[z]',
        [0, 0.25, 0.5],
        [Math.PI/4, -Math.PI/4, Math.PI/4]
    );

    const cageClip = new THREE.AnimationClip('CageRotation', 60, [cageTrack]);
    const balanceClip = new THREE.AnimationClip('BalanceOscillation', 0.5, [balanceTrack]);
    animationClips.push(cageClip, balanceClip);

    return { group, animationClips };
}
