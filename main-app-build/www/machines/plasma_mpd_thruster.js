import * as materials from '../utils/materials.js';

export function createMPDThruster(THREE) {
    const group = new THREE.Group();
    
    // Materials fallback setup ensuring robustness
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const matCopper = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });
    const matPlasma = materials.plasma || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });

    // Center Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
    const cathode = new THREE.Mesh(cathodeGeo, matMetal);
    cathode.rotation.z = Math.PI / 2;
    group.add(cathode);

    // Outer Anode Nozzle
    const anodeGeo = new THREE.CylinderGeometry(1.5, 0.5, 3, 32, 1, true);
    const anode = new THREE.Mesh(anodeGeo, matMetal);
    anode.rotation.z = Math.PI / 2;
    group.add(anode);

    // Magnetic Coils
    for (let i = 0; i < 4; i++) {
        const coilGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 64);
        const coil = new THREE.Mesh(coilGeo, matCopper);
        coil.rotation.y = Math.PI / 2;
        coil.position.x = -1 + i * 0.8;
        group.add(coil);
    }

    // Propellant Injectors
    const injectorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
    for(let a=0; a < Math.PI * 2; a += Math.PI / 3) {
        const injector = new THREE.Mesh(injectorGeo, matMetal);
        injector.position.set(-1.2, Math.cos(a)*0.4, Math.sin(a)*0.4);
        injector.rotation.z = Math.PI / 2;
        group.add(injector);
    }

    // Plasma Plume Exhaust
    const plumeGeo = new THREE.ConeGeometry(1.4, 6, 32);
    const plume = new THREE.Mesh(plumeGeo, matPlasma);
    plume.position.x = 4.5;
    plume.rotation.z = -Math.PI / 2;
    plume.name = "plasmaPlume";
    group.add(plume);

    // Animations
    const animationClips = [];
    const scaleTrack = new THREE.VectorKeyframeTrack(
        plume.uuid + '.scale',
        [0, 0.25, 0.5, 0.75, 1],
        [1, 1, 1,  1.1, 1.2, 1.5,  1, 1, 1,  1.05, 1.1, 1.3,  1, 1, 1]
    );
    
    // Sub-animation for glowing cathode
    const cathodeTrack = new THREE.VectorKeyframeTrack(
        cathode.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1,  1.02, 1, 1.02,  1, 1, 1]
    );

    const clip = new THREE.AnimationClip('Fire_MPD', 1, [scaleTrack, cathodeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
