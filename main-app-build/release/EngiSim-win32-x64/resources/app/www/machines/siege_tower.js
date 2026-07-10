import { wood, iron, steel } from '../utils/materials.js';

export function createSiegeTower(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(8, 1, 8);
    const base = new THREE.Mesh(baseGeo, wood);
    base.position.y = 1;
    group.add(base);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
    const wheelPositions = [
        [-4.5, 1.5, 3], [4.5, 1.5, 3],
        [-4.5, 1.5, -3], [4.5, 1.5, -3]
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, wood);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
    });

    // Structure
    const towerGeo = new THREE.BoxGeometry(7, 24, 7);
    const tower = new THREE.Mesh(towerGeo, wood);
    tower.position.y = 13.5;
    group.add(tower);

    // Drawbridge
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = 'bridgeGroup';
    bridgeGroup.position.set(0, 22, -3.5); // pivot at top front
    
    const bridgeGeo = new THREE.BoxGeometry(4, 8, 0.5);
    bridgeGeo.translate(0, 4, 0); // shift center to pivot
    const bridge = new THREE.Mesh(bridgeGeo, wood);
    bridgeGroup.add(bridge);
    group.add(bridgeGroup);

    // Front protection shield
    const shieldGeo = new THREE.BoxGeometry(7.2, 24, 0.2);
    const shield = new THREE.Mesh(shieldGeo, iron);
    shield.position.set(0, 13.5, -3.6);
    group.add(shield);

    // Animation: Bridge dropping
    const times = [0, 1.5, 3];
    const bridgeRot = [0, Math.PI / 2, 0]; // 0 = upright, PI/2 = flat forward
    
    const bridgeTrack = new THREE.NumberKeyframeTrack('bridgeGroup.rotation[x]', times, bridgeRot);
    const clip = new THREE.AnimationClip('Deploy', 3, [bridgeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
