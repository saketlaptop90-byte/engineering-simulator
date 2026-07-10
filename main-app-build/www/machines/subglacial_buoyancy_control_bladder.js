import { materials } from '../utils/materials.js';

export function createBuoyancyControlBladder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Internal rigid tank
    const tankGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const tank = new THREE.Mesh(tankGeo, materials.titanium || new THREE.MeshStandardMaterial({color: 0x777777}));
    group.add(tank);

    // Expandable bladder (sphere)
    const bladderGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const bladder = new THREE.Mesh(bladderGeo, materials.rubber || new THREE.MeshStandardMaterial({color: 0xcccc00, transparent: true, opacity: 0.8}));
    bladder.position.y = -1;
    group.add(bladder);

    // Pumps and valves
    const pumpGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const pump = new THREE.Mesh(pumpGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x222222}));
    pump.position.y = 0.9;
    group.add(pump);

    // Animation: Bladder expanding and contracting
    const times = [0, 2, 4];
    const scaleValues = [0.5,0.5,0.5, 1.2,1.2,1.2, 0.5,0.5,0.5];
    const scaleTrack = new THREE.VectorKeyframeTrack(`${bladder.uuid}.scale`, times, scaleValues);
    
    const clip = new THREE.AnimationClip('InflateDeflate', 4, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
