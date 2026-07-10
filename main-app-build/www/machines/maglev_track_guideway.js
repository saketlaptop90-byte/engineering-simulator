import { materials } from '../utils/materials.js';

export function createMaglevGuideway(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Track base
    const baseGeometry = new THREE.BoxGeometry(10, 0.5, 4);
    const base = new THREE.Mesh(baseGeometry, materials.concrete || new THREE.MeshStandardMaterial({color: 0x999999}));
    group.add(base);

    // Electromagnetic coils (Stators)
    const coilGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.8);
    const coilMaterialOff = materials.metalLight || new THREE.MeshStandardMaterial({color: 0xaaaaaa});

    const coils = [];
    for (let x = -4.8; x <= 4.8; x += 0.4) {
        for (let z of [-1.5, 1.5]) {
            const coil = new THREE.Mesh(coilGeometry, coilMaterialOff.clone());
            coil.name = `coil_${x.toFixed(1)}_${z}`;
            coil.position.set(x, 0.3, z);
            group.add(coil);
            coils.push({mesh: coil, xPos: x});
        }
    }

    // Animation: Magnetic wave indicator
    const waveGeometry = new THREE.BoxGeometry(1.5, 0.2, 3.8);
    const waveMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.4});
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.name = 'magneticWave';
    wave.position.set(-5, 0.4, 0);
    group.add(wave);

    const times = [0, 2];
    const posValues = [
        -5, 0.4, 0,
        5, 0.4, 0
    ];
    const waveTrack = new THREE.VectorKeyframeTrack('magneticWave.position', times, posValues);
    
    const clip = new THREE.AnimationClip('MagneticPropulsion', 2, [waveTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
