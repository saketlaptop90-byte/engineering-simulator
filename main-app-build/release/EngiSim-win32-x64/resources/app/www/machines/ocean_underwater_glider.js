import * as materials from '../utils/materials.js';

export function createUnderwaterGlider(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Hull
    const hullGeometry = new THREE.CapsuleGeometry(0.3, 2, 16, 16);
    const hull = new THREE.Mesh(hullGeometry, materials.composite);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.1, 0.8, 2.5);
    const wings = new THREE.Mesh(wingGeometry, materials.metal);
    group.add(wings);

    // Tail rudder
    const rudderGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.05);
    const rudder = new THREE.Mesh(rudderGeometry, materials.accent);
    rudder.position.x = -1.2;
    rudder.position.y = 0.3;
    group.add(rudder);

    // Pitch animation
    const times = [0, 2, 4, 6];

    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.3));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.3));

    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const pitchTrack = new THREE.QuaternionKeyframeTrack(`${group.uuid}.quaternion`, times, values);
    const clip = new THREE.AnimationClip('GliderPitch', 6, [pitchTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
