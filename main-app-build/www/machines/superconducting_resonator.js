import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createSuperconductingResonator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base chip
    const chipGeom = new THREE.BoxGeometry(2, 0.1, 4);
    const chip = new THREE.Mesh(chipGeom, darkSteel);
    group.add(chip);

    // Resonator trace (coplanar waveguide)
    const traceGeom = new THREE.BoxGeometry(0.2, 0.12, 3.8);
    const trace = new THREE.Mesh(traceGeom, aluminum);
    trace.position.y = 0.01;
    group.add(trace);

    // Coupling capacitors
    const capGeom = new THREE.BoxGeometry(0.5, 0.15, 0.5);
    const cap1 = new THREE.Mesh(capGeom, gold);
    cap1.position.set(0, 0.02, 1.8);
    group.add(cap1);

    const cap2 = new THREE.Mesh(capGeom, gold);
    cap2.position.set(0, 0.02, -1.8);
    group.add(cap2);

    // Animations: RF wave propagating (pulsing color/scale on trace)
    const trackName = trace.uuid + '.scale';
    const times = [0, 1, 2];
    const values = [
        1, 1, 1,
        1.1, 1, 1,
        1, 1, 1
    ];
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('RF_Propagate', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
