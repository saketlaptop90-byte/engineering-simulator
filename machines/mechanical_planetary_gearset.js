import * as materials from '../utils/materials.js';

export function createPlanetaryGearset(THREE) {
    const group = new THREE.Group();
    group.name = "Planetary Gearset";
    
    const steel = materials.steel || materials.default?.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const brass = materials.brass || materials.default?.brass || new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.9, roughness: 0.3 });

    // Sun gear
    const sunGeom = new THREE.CylinderGeometry(1, 1, 1, 32);
    const sunGear = new THREE.Mesh(sunGeom, brass);
    sunGear.name = 'sunGear';
    group.add(sunGear);

    // Planet carrier
    const carrierGroup = new THREE.Group();
    carrierGroup.name = 'carrier';
    
    const carrierMeshGeom = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const carrierMesh = new THREE.Mesh(carrierMeshGeom, steel);
    carrierMesh.position.y = -0.6;
    carrierGroup.add(carrierMesh);
    
    // Planet gears
    const numPlanets = 3;
    for (let i = 0; i < numPlanets; i++) {
        const planetGeom = new THREE.CylinderGeometry(1, 1, 1, 16);
        const planet = new THREE.Mesh(planetGeom, steel);
        const angle = (i / numPlanets) * Math.PI * 2;
        planet.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
        
        // Use a wrapper to easily rotate planet around its own axis while carrier rotates
        const planetWrapper = new THREE.Group();
        planetWrapper.position.copy(planet.position);
        planet.position.set(0, 0, 0); // Reset local pos
        planet.name = `planet_${i}`;
        
        planetWrapper.add(planet);
        carrierGroup.add(planetWrapper);
    }
    group.add(carrierGroup);

    // Ring gear
    const ringGeom = new THREE.TorusGeometry(3.5, 0.5, 16, 64);
    const ringGear = new THREE.Mesh(ringGeom, brass);
    ringGear.rotation.x = Math.PI / 2;
    ringGear.name = 'ringGear';
    group.add(ringGear);

    // Animations
    const tracks = [];
    // Sun gear spinning
    tracks.push(new THREE.NumberKeyframeTrack('sunGear.rotation[y]', [0, 2], [0, Math.PI * 2]));
    // Carrier spinning
    tracks.push(new THREE.NumberKeyframeTrack('carrier.rotation[y]', [0, 2], [0, Math.PI]));
    // Planets spinning on their axes
    for (let i = 0; i < numPlanets; i++) {
        tracks.push(new THREE.NumberKeyframeTrack(`planet_${i}.rotation[y]`, [0, 2], [0, -Math.PI * 2]));
    }
    const clip = new THREE.AnimationClip('Operate', 2, tracks);

    return { group, animationClips: [clip] };
}
