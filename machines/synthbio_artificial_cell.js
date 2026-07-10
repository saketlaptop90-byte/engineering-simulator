import { materials } from '../utils/materials.js';

export function createArtificialCell(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cell membrane
    const membraneGeo = new THREE.SphereGeometry( 5, 32, 32 );
    const membraneMat = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, roughness: 0.1 });
    const membrane = new THREE.Mesh( membraneGeo, membraneMat );
    group.add( membrane );

    // Nucleus / Synthetic core
    const coreGeo = new THREE.IcosahedronGeometry( 1.5, 2 );
    const coreMat = materials.glowingBlue || new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x002288 });
    const core = new THREE.Mesh( coreGeo, coreMat );
    group.add( core );

    // Synthetic organelles
    const organelleGeo = new THREE.CapsuleGeometry( 0.3, 0.8, 8, 16 );
    const organelleMat = materials.metallic || new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.8, roughness: 0.2 });
    
    const organelles = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const organelle = new THREE.Mesh( organelleGeo, organelleMat );
        organelle.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        );
        organelle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        organelles.add(organelle);
    }
    group.add(organelles);

    // Animation: core pulsing and organelles rotating
    const times = [0, 2, 4];
    const scales = [1, 1.2, 1, 1, 1.2, 1, 1, 1.2, 1];
    const coreScaleTrack = new THREE.VectorKeyframeTrack(`${core.uuid}.scale`, times, scales);
    
    const rotValues = [0,0,0, 0, Math.PI, 0, 0, Math.PI*2, 0];
    const organelleRotTrack = new THREE.VectorKeyframeTrack(`${organelles.uuid}.rotation`, times, rotValues);

    const clip = new THREE.AnimationClip('CellActivity', 4, [coreScaleTrack, organelleRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
