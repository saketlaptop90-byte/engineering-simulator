import { titanium, gold, glass } from '../utils/materials.js';

export function createPhotonicLaserThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Laser housing
    const housingGeo = new THREE.BoxGeometry(4, 4, 10);
    const housing = new THREE.Mesh(housingGeo, titanium);
    group.add(housing);

    // Mirrors
    const mirrorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const mirror = new THREE.Mesh(mirrorGeo, gold);
    mirror.rotation.x = Math.PI / 2;
    mirror.position.z = 5;
    group.add(mirror);

    // Laser beam
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 50, 16);
    const beam = new THREE.Mesh(beamGeo, glass);
    beam.rotation.x = Math.PI / 2;
    beam.position.z = 30;
    group.add(beam);

    // Animation: Beam pulsing
    const scaleTrack = new THREE.VectorKeyframeTrack(
        beam.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1,  2, 2, 1,  1, 1, 1]
    );

    const clip = new THREE.AnimationClip('LaserPulse', -1, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
