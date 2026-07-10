import * as CustomMaterials from '../utils/materials.js';

export function createDNANanobot(THREE) {
    const group = new THREE.Group();
    group.name = "DNANanobot";
    const animationClips = [];

    // Use custom materials or fallbacks
    const goldMat = CustomMaterials.goldMaterial || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.3 });
    const dnaMat = new THREE.MeshPhysicalMaterial({
        color: 0x8822cc,
        metalness: 0.1,
        roughness: 0.4,
        transmission: 0.8,
        thickness: 0.5,
        transparent: true
    });

    // DNA Origami Structure
    const helixGeo = new THREE.TorusKnotGeometry(1.5, 0.3, 128, 16, 2, 5);
    const helix = new THREE.Mesh(helixGeo, dnaMat);
    helix.name = "helix";
    group.add(helix);

    // Payload (Gold Nanoparticle)
    const payloadGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const payload = new THREE.Mesh(payloadGeo, goldMat);
    payload.name = "payload";
    group.add(payload);

    // Animation: Folding/Unfolding & Spinning
    const times = [0, 2, 4];
    const scaleValues = [
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1
    ];
    const rotValues = [
        0, 0, 0,
        0, Math.PI, 0,
        0, Math.PI * 2, 0
    ];

    const scaleTrack = new THREE.VectorKeyframeTrack(`${helix.name}.scale`, times, scaleValues);
    const rotTrack = new THREE.VectorKeyframeTrack(`${helix.name}.rotation`, times, rotValues);
    
    const clip = new THREE.AnimationClip('DNA_Fold_Spin', 4, [scaleTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
