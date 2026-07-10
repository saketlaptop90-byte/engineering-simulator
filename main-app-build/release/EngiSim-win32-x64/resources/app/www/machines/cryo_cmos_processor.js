import { siliconMaterial, goldMaterial, dielectricMaterial } from '../utils/materials.js';

export function createCryoCMOSProcessor(THREE) {
    const group = new THREE.Group();
    group.name = "CryoCMOSProcessor";
    const animationClips = [];

    // Chip base
    const chipGeo = new THREE.BoxGeometry(6, 0.2, 6);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const chip = new THREE.Mesh(chipGeo, siliconMaterial || chipMat);
    group.add(chip);

    // Core regions
    const coreCount = 4;
    const coresGroup = new THREE.Group();
    coresGroup.name = "Cores";
    for(let i=0; i<coreCount; i++) {
        const coreGeo = new THREE.BoxGeometry(2, 0.3, 2);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x0055ff, emissiveIntensity: 0.5 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set((i%2===0?-1.2:1.2), 0.1, (i<2?-1.2:1.2));
        core.name = `core_${i}`;
        coresGroup.add(core);
    }
    group.add(coresGroup);

    // Wirebonds
    for(let i=0; i<20; i++) {
        const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, 2);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
        const wire = new THREE.Mesh(wireGeo, goldMaterial || wireMat);
        wire.position.set(3.1, 0, -2.8 + i*0.3);
        wire.rotation.z = Math.PI / 4;
        group.add(wire);
    }

    // Animation: Core processing pulses
    const times = [0, 0.5, 1, 1.5, 2];
    const tracks = [];
    for(let i=0; i<coreCount; i++) {
        const values = [0.2, (i%2===0?1.0:0.2), (i%2!==0?1.0:0.2), 0.2, 0.2];
        const track = new THREE.NumberKeyframeTrack(`core_${i}.material.emissiveIntensity`, times, values);
        tracks.push(track);
    }
    const clip = new THREE.AnimationClip('ProcessingPulse', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
