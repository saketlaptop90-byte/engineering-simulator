import { ceramics, metals } from '../utils/materials.js';

export function createPiezoelectricHarvester(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cantilever beam
    const beamGeo = new THREE.BoxGeometry(4, 0.1, 1);
    const beamMat = metals ? metals.aluminum : new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(2, 0, 0);
    
    // Beam Pivot (to make rotation look like bending)
    const pivot = new THREE.Group();
    pivot.position.set(-2, 0, 0);
    pivot.add(beam);
    pivot.name = 'beamPivot';
    group.add(pivot);

    // Piezoelectric patch
    const patchGeo = new THREE.BoxGeometry(1, 0.12, 1.02);
    const patchMat = ceramics ? ceramics.pzt : new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.8 });
    const patch = new THREE.Mesh(patchGeo, patchMat);
    patch.position.set(0, 0, 0);
    patch.name = 'piezoPatch';
    beam.add(patch);

    // Proof mass
    const massGeo = new THREE.BoxGeometry(0.5, 0.5, 1);
    const massMat = metals ? metals.brass : new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.9 });
    const mass = new THREE.Mesh(massGeo, massMat);
    mass.position.set(1.75, 0.3, 0);
    beam.add(mass);

    // Base Support
    const supportGeo = new THREE.BoxGeometry(1, 4, 1.5);
    const supportMat = metals ? metals.steel : new THREE.MeshStandardMaterial({ color: 0x555555 });
    const support = new THREE.Mesh(supportGeo, supportMat);
    support.position.set(-2, -1.95, 0);
    group.add(support);

    // Animation: Vibration and voltage generation (color pulse)
    const rotationTrack = new THREE.NumberKeyframeTrack(
        'beamPivot.rotation[z]',
        [0, 0.5, 1, 1.5, 2],
        [0, 0.2, 0, -0.2, 0]
    );
    const voltageColorTrack = new THREE.ColorKeyframeTrack(
        'piezoPatch.material.color',
        [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        [0.2, 0.2, 1,  1, 1, 0,  0.2, 0.2, 1,  1, 1, 0,  0.2, 0.2, 1, 1, 1, 0, 0.2, 0.2, 1, 1, 1, 0, 0.2, 0.2, 1] // Blue to Yellow pulsing
    );

    const clip = new THREE.AnimationClip('VibrateAndHarvest', 2, [rotationTrack, voltageColorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
