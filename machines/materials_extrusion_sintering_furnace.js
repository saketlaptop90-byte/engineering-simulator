import { materials as sharedMaterials } from '../utils/materials.js';

export function createExtrusionSinteringFurnace(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const materials = sharedMaterials || {
        metal: new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.3 }),
        darkMetal: new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 }),
        heater: new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.8, emissive: 0xff3300, emissiveIntensity: 0 }),
        hopper: new THREE.MeshStandardMaterial({ color: 0x2255aa, metalness: 0.3, roughness: 0.6 })
    };

    // Frame
    const frameGeo = new THREE.BoxGeometry(8, 0.5, 1.5);
    const frame = new THREE.Mesh(frameGeo, materials.darkMetal);
    frame.position.set(0, 0.25, 0);
    group.add(frame);

    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    for(let i=0; i<4; i++) {
        const leg = new THREE.Mesh(legGeo, materials.darkMetal);
        leg.position.set((i%2===0? 3.5 : -3.5), 0.5, (i<2? 0.6 : -0.6));
        group.add(leg);
    }

    // Extruder Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const barrel = new THREE.Mesh(barrelGeo, materials.metal);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(-2, 1.5, 0);
    group.add(barrel);

    // Hopper
    const hopperGeo = new THREE.ConeGeometry(0.6, 1, 16);
    const hopper = new THREE.Mesh(hopperGeo, materials.hopper);
    hopper.position.set(-2.5, 2.3, 0);
    hopper.rotation.z = Math.PI; // Point down
    group.add(hopper);

    // Furnace Tube
    const furnaceGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
    const furnace = new THREE.Mesh(furnaceGeo, materials.darkMetal);
    furnace.rotation.z = Math.PI / 2;
    furnace.position.set(1, 1.5, 0);
    group.add(furnace);

    // Heating Elements (Glow inside)
    const heaterMat = materials.heater.clone();
    const heaterGeo = new THREE.CylinderGeometry(0.61, 0.61, 2.5, 32);
    const heater = new THREE.Mesh(heaterGeo, heaterMat);
    heater.rotation.z = Math.PI / 2;
    heater.position.set(1, 1.5, 0);
    group.add(heater);

    // Material flow (cylinder that moves through)
    const materialGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const matExtrude = new THREE.Mesh(materialGeo, new THREE.MeshStandardMaterial({color: 0xdddddd}));
    matExtrude.rotation.z = Math.PI / 2;
    matExtrude.position.set(-1, 1.5, 0);
    group.add(matExtrude);

    // Animation
    const times = [0, 2, 4, 6];
    
    // Material moves through
    const matPosTrack = new THREE.VectorKeyframeTrack(
        matExtrude.uuid + '.position',
        times,
        [
            -1, 1.5, 0,
            1, 1.5, 0, // Inside heater
            3, 1.5, 0, // Exiting
            4, 1.5, 0
        ]
    );

    // Material heats up (color change)
    const matColorTrack = new THREE.ColorKeyframeTrack(
        matExtrude.material.uuid + '.color',
        times,
        [
            0.86, 0.86, 0.86, // #dddddd
            1, 0.2, 0, // red hot
            0.5, 0.5, 0.5, // cooling
            0.3, 0.3, 0.3
        ]
    );

    // Furnace glows
    const heaterGlowTrack = new THREE.NumberKeyframeTrack(
        heaterMat.uuid + '.emissiveIntensity',
        times,
        [
            0.2, 1.0, 1.0, 0.2
        ]
    );

    const clip = new THREE.AnimationClip('ExtrusionSinter', 6, [matPosTrack, matColorTrack, heaterGlowTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
