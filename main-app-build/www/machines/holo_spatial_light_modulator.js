import { glass, aluminum, gold } from '../utils/materials.js';

export function createSpatialLightModulator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const casingGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const casing = new THREE.Mesh(casingGeo, aluminum);
    casing.position.y = 0.25;
    group.add(casing);

    const arrayGroup = new THREE.Group();
    arrayGroup.position.y = 0.55;
    arrayGroup.name = 'ModulatorArray';
    
    const pixelGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const pixel = new THREE.Mesh(pixelGeo, gold);
            pixel.position.set(i * 0.3 - 1.35, 0, j * 0.3 - 1.35);
            arrayGroup.add(pixel);
        }
    }
    group.add(arrayGroup);

    const beamGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 2, 0);
    beam.name = 'IncidentBeam';
    group.add(beam);

    const times = [0, 1.5, 3];
    const opacities = [0.1, 0.6, 0.1];
    const beamTrack = new THREE.NumberKeyframeTrack('IncidentBeam.material.opacity', times, opacities);
    
    const clip = new THREE.AnimationClip('Modulate', 3, [beamTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
