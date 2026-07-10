import { getMaterials } from '../utils/materials.js';

export function createRockMeltExtruder(THREE) {
    const group = new THREE.Group();
    group.name = "RockMeltExtruder";

    let materials = {};
    try {
        materials = getMaterials(THREE) || {};
    } catch (e) {
        console.warn("Could not load materials, using fallbacks.", e);
    }
    
    // Main Body
    const bodyGeometry = new THREE.CylinderGeometry(3, 2, 6, 32);
    const bodyMaterial = materials.heavyMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 3;
    group.add(body);

    // Archimedes Screw (Auger)
    const augerGroup = new THREE.Group();
    
    // Auger Shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.8, 0.4, 8, 16);
    const shaftMaterial = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    augerGroup.add(shaft);

    // Helix Thread for Auger
    const points = [];
    const radius = 1.8;
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 8; // 4 turns
        const r = radius * (1 - t * 0.3); // Tapers down
        const y = 4 - t * 8; // From y=4 to y=-4
        points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    
    const threadPath = new THREE.CatmullRomCurve3(points);
    const threadGeometry = new THREE.TubeGeometry(threadPath, 100, 0.3, 8, false);
    const threadMaterial = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7 });
    const thread = new THREE.Mesh(threadGeometry, threadMaterial);
    augerGroup.add(thread);
    
    augerGroup.position.y = -4;
    group.add(augerGroup);

    // Molten Rock / Slag output
    const meltGeometry = new THREE.CylinderGeometry(2.5, 3, 3, 32);
    meltGeometry.translate(0, -1.5, 0); // Origin at top
    const meltMaterial = materials.lava || new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0x881100, metalness: 0.1, roughness: 0.8 });
    const melt = new THREE.Mesh(meltGeometry, meltMaterial);
    melt.position.y = -8;
    group.add(melt);

    // Animations
    const animationClips = [];
    
    // Spin auger
    const spinTrack = new THREE.NumberKeyframeTrack(`${augerGroup.uuid}.rotation[y]`, [0, 2], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('Extrude', 2, [spinTrack]));
    
    // Pulse molten rock (simulating extrusion flow)
    const meltScaleTrack = new THREE.NumberKeyframeTrack(`${melt.uuid}.scale[y]`, [0, 1, 2], [0.8, 1.2, 0.8]);
    const meltScaleXTrack = new THREE.NumberKeyframeTrack(`${melt.uuid}.scale[x]`, [0, 1, 2], [1, 1.1, 1]);
    const meltScaleZTrack = new THREE.NumberKeyframeTrack(`${melt.uuid}.scale[z]`, [0, 1, 2], [1, 1.1, 1]);
    animationClips.push(new THREE.AnimationClip('Flow', 2, [meltScaleTrack, meltScaleXTrack, meltScaleZTrack]));

    return { group, animationClips };
}
