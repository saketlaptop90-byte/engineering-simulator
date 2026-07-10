import { aluminum, titanium, glass } from '../utils/materials.js';

export function createOceanAlkalinityVessel(THREE) {
    const group = new THREE.Group();
    group.name = 'OceanAlkalinityVessel';

    // Hull
    const hullGeo = new THREE.BoxGeometry(6, 3, 15);
    const hull = new THREE.Mesh(hullGeo, titanium);
    hull.position.y = 1.5;
    group.add(hull);

    // Deck Superstructure
    const deckGeo = new THREE.BoxGeometry(4, 2, 4);
    const deck = new THREE.Mesh(deckGeo, aluminum);
    deck.position.set(0, 4, -4);
    group.add(deck);
    
    // Bridge (Glass)
    const bridgeGeo = new THREE.BoxGeometry(3, 1, 2);
    const bridge = new THREE.Mesh(bridgeGeo, glass);
    bridge.position.set(0, 5.5, -4);
    group.add(bridge);

    // Dispersion Arm (animated)
    const armGeo = new THREE.BoxGeometry(10, 0.5, 0.5);
    const arm = new THREE.Mesh(armGeo, aluminum);
    arm.position.set(0, 3, 5);
    arm.name = 'DispersionArm';
    group.add(arm);
    
    // Radar spinning
    const radarGeo = new THREE.CylinderGeometry(1, 1, 0.2, 16);
    const radar = new THREE.Mesh(radarGeo, titanium);
    radar.position.set(0, 6.5, -4);
    radar.name = 'Radar';
    group.add(radar);

    // Animations
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const radarTrack = new THREE.QuaternionKeyframeTrack('Radar.quaternion', [0, 2, 4], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    
    const p1 = new THREE.Vector3(0, 3, 5);
    const p2 = new THREE.Vector3(0, 3, 7);
    const armTrack = new THREE.VectorKeyframeTrack('DispersionArm.position', [0, 2, 4], [
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p1.x, p1.y, p1.z
    ]);

    const clip = new THREE.AnimationClip('VesselOperations', 4, [radarTrack, armTrack]);

    return { group, animationClips: [clip] };
}
