import { carbonFiber, steel, aluminum, yellowAccent, plastic } from '../utils/materials.js';

export function createAutonomousUnderwaterGlider(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main torpedo body
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    const body = new THREE.Mesh(bodyGeo, yellowAccent);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    const noseGeo = new THREE.SphereGeometry(0.4, 32, 16);
    const nose = new THREE.Mesh(noseGeo, carbonFiber);
    nose.position.x = 2;
    group.add(nose);

    const tailGeo = new THREE.ConeGeometry(0.4, 1, 32);
    const tail = new THREE.Mesh(tailGeo, carbonFiber);
    tail.rotation.z = -Math.PI / 2;
    tail.position.x = -2.5;
    group.add(tail);

    // Wings
    const wingGeo = new THREE.BoxGeometry(1, 0.05, 3);
    const wing = new THREE.Mesh(wingGeo, aluminum);
    wing.position.x = 0;
    group.add(wing);

    // Vertical Stabilizer
    const finGeo = new THREE.BoxGeometry(0.5, 1, 0.05);
    const fin = new THREE.Mesh(finGeo, plastic);
    fin.position.set(-2, 0.5, 0);
    group.add(fin);

    // Antenna
    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 1);
    const antenna = new THREE.Mesh(antGeo, steel);
    antenna.position.set(-1, 0.7, 0);
    group.add(antenna);

    // Pitch/Roll animation to simulate gliding through water
    const times = [0, 2, 4, 6, 8];
    const pitchValues = [0, 0.2, 0, -0.2, 0];
    const yValues = [0, -1, 0, 1, 0];
    
    const pitchTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.rotation[z]`,
        times,
        pitchValues
    );

    const posTrack = new THREE.NumberKeyframeTrack(
        `${group.uuid}.position[y]`,
        times,
        yValues
    );

    const clip = new THREE.AnimationClip('Gliding', 8, [pitchTrack, posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
