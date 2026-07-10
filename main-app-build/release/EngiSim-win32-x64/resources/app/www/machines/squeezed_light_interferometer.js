import { copper, gold, glass } from '../utils/materials.js';

export function createSqueezedLightInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base plate
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const base = new THREE.Mesh(baseGeo, copper);
    group.add(base);

    // Beam Splitter
    const splitterGeo = new THREE.BoxGeometry(1, 1, 0.1);
    const splitter = new THREE.Mesh(splitterGeo, glass);
    splitter.position.set(0, 1, 0);
    splitter.rotation.y = Math.PI / 4;
    group.add(splitter);

    // Mirror 1
    const mirrorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const mirror1 = new THREE.Mesh(mirrorGeo, gold);
    mirror1.rotation.x = Math.PI / 2;
    mirror1.position.set(4, 1, 0);
    group.add(mirror1);

    // Mirror 2
    const mirror2 = new THREE.Mesh(mirrorGeo, gold);
    mirror2.rotation.x = Math.PI / 2;
    mirror2.rotation.y = Math.PI / 2;
    mirror2.position.set(0, 1, 4);
    group.add(mirror2);

    // Squeezing Crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.5);
    const crystalMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(-3, 1, 0);
    group.add(crystal);

    // Animation: Mirrors vibrating infinitesimally to simulate gravitational waves
    const m1Track = new THREE.VectorKeyframeTrack(
        '.children[2].position',
        [0, 0.5, 1],
        [4, 1, 0, 4.05, 1, 0, 4, 1, 0]
    );
    const m2Track = new THREE.VectorKeyframeTrack(
        '.children[3].position',
        [0, 0.5, 1],
        [0, 1, 4, 0, 1, 4.05, 0, 1, 4]
    );

    // Crystal pulsing
    const crystalScaleTrack = new THREE.VectorKeyframeTrack(
        '.children[4].scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('Measure', 1, [m1Track, m2Track, crystalScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
