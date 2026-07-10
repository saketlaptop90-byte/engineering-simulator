import { materials } from '../utils/materials.js';

export function createSputteringDepositionChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32, 1, false, 0, Math.PI); // Half cylinder to see inside
    const chamberMat = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.rotation.x = Math.PI / 2;
    group.add(chamber);

    const baseGeo = new THREE.BoxGeometry(4.5, 0.5, 4.5);
    const metalMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = -1;
    group.add(base);

    const targetGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const targetMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });
    const target = new THREE.Mesh(targetGeo, targetMat);
    target.position.set(0, 0.5, 0);
    group.add(target);

    const substrateGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32);
    const substrateMat = materials.silicon || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.1 });
    const substrate = new THREE.Mesh(substrateGeo, substrateMat);
    substrate.position.set(0, -0.5, 0);
    group.add(substrate);

    // Animation: Plasma glow pulsing
    const plasmaGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.8, 32);
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.4 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.position.set(0, 0, 0);
    group.add(plasma);

    const plasmaTrackName = plasma.uuid + '.scale';
    const times = [0, 0.5, 1];
    const values = [1, 1, 1, 1.1, 1, 1.1, 1, 1, 1];
    const plasmaKF = new THREE.VectorKeyframeTrack(plasmaTrackName, times, values);
    const clip = new THREE.AnimationClip('PlasmaPulse', 1, [plasmaKF]);
    animationClips.push(clip);

    return { group, animationClips };
}

// Auto-generated missing stub
export function createSputteringChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
