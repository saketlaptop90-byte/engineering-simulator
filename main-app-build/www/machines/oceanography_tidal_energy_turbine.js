import { steel, blueAccent, whitePlastic, darkSteel, copper } from '../utils/materials.js';

export function createTidalEnergyTurbine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1, 10, 32);
    const pillar = new THREE.Mesh(pillarGeo, darkSteel);
    pillar.position.y = -5;
    group.add(pillar);

    // Nacelle (Main turbine body)
    const nacelleGeo = new THREE.CapsuleGeometry(1, 3, 16, 32);
    const nacelle = new THREE.Mesh(nacelleGeo, blueAccent);
    nacelle.rotation.z = Math.PI / 2;
    nacelle.position.y = 0;
    group.add(nacelle);

    // Rotor Hub
    const hubGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const hub = new THREE.Mesh(hubGeo, whitePlastic);
    hub.position.x = -2;
    
    const rotorGroup = new THREE.Group();
    rotorGroup.position.x = -2;
    rotorGroup.add(hub);

    // Blades
    for(let i=0; i<3; i++) {
        const bladeGroup = new THREE.Group();
        bladeGroup.rotation.x = i * (Math.PI * 2 / 3);
        
        const bladeGeo = new THREE.BoxGeometry(0.2, 5, 0.8);
        const blade = new THREE.Mesh(bladeGeo, whitePlastic);
        blade.position.y = 3; // offset from center
        
        // twist blade slightly
        blade.rotation.y = Math.PI / 6;
        
        bladeGroup.add(blade);
        rotorGroup.add(bladeGroup);
    }
    group.add(rotorGroup);

    // Generator housing inside nacelle (exposed part for visual detail)
    const genGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const gen = new THREE.Mesh(genGeo, copper);
    gen.rotation.z = Math.PI / 2;
    gen.position.x = 0;
    group.add(gen);

    // Rotor animation
    const times = [0, 4];
    const rotTrack = new THREE.NumberKeyframeTrack(
        `${rotorGroup.uuid}.rotation[x]`,
        times,
        [0, Math.PI * 2]
    );

    const clip = new THREE.AnimationClip('TurbineSpin', 4, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
