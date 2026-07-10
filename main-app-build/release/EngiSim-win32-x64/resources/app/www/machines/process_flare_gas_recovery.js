import { materials } from '../utils/materials.js';

export function createFlareGasRecoverySystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main compressor
    const compressorGeom = new THREE.BoxGeometry(4, 4, 6);
    const compressor = new THREE.Mesh(compressorGeom, materials.iron);
    compressor.position.set(-5, 2, 0);
    group.add(compressor);

    // Scrubber / Separator
    const scrubberGeom = new THREE.CylinderGeometry(2, 2, 8, 32);
    const scrubber = new THREE.Mesh(scrubberGeom, materials.steel);
    scrubber.position.set(5, 4, 0);
    group.add(scrubber);

    // Connecting pipe
    const pipeGeom = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    pipeGeom.rotateZ(Math.PI / 2);
    const pipe = new THREE.Mesh(pipeGeom, materials.aluminum);
    pipe.position.set(0, 4, 0);
    group.add(pipe);

    // Flare stack (for bypass/excess)
    const flareGeom = new THREE.CylinderGeometry(0.5, 0.5, 20, 16);
    const flare = new THREE.Mesh(flareGeom, materials.steel);
    flare.position.set(-10, 10, -5);
    group.add(flare);

    // Flame on top of flare
    const flameGeom = new THREE.ConeGeometry(1.5, 4, 16);
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff4500 });
    const flame = new THREE.Mesh(flameGeom, flameMat);
    flame.position.set(-10, 22, -5);
    group.add(flame);

    // Flame flicker animation
    const scaleTrack = new THREE.VectorKeyframeTrack(
        `${flame.uuid}.scale`,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        [
            1, 1, 1,
            1.2, 0.8, 1.2,
            0.9, 1.3, 0.9,
            1.1, 0.9, 1.1,
            0.8, 1.2, 0.8,
            1, 1, 1
        ]
    );
    const clip = new THREE.AnimationClip('Flicker', 1, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
