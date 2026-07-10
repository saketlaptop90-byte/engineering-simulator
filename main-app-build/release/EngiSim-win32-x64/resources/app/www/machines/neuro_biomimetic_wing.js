import { darkSteel, aluminum, copper } from '../utils/materials.js';

export function createBiomimeticWing(THREE) {
    const group = new THREE.Group();
    group.name = "BiomimeticWing";

    // Main Body
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const body = new THREE.Mesh(bodyGeo, darkSteel);
    group.add(body);

    // Left Wing Pivot
    const leftPivot = new THREE.Group();
    leftPivot.name = "LeftWingPivot";
    leftPivot.position.set(-0.2, 0, 0);
    group.add(leftPivot);

    const leftWingGeo = new THREE.BoxGeometry(1.5, 0.05, 0.5);
    leftWingGeo.translate(-0.75, 0, 0); // pivot at edge
    const leftWing = new THREE.Mesh(leftWingGeo, aluminum);
    leftPivot.add(leftWing);

    // Right Wing Pivot
    const rightPivot = new THREE.Group();
    rightPivot.name = "RightWingPivot";
    rightPivot.position.set(0.2, 0, 0);
    group.add(rightPivot);

    const rightWingGeo = new THREE.BoxGeometry(1.5, 0.05, 0.5);
    rightWingGeo.translate(0.75, 0, 0);
    const rightWing = new THREE.Mesh(rightWingGeo, copper);
    rightPivot.add(rightWing);

    // Animation Clips: Flapping
    const qStartL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qMidL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/4));
    const qStartR = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qMidR = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/4));

    const times = [0, 0.5, 1.0];
    const valuesL = [
        ...qStartL.toArray(),
        ...qMidL.toArray(),
        ...qStartL.toArray()
    ];
    const valuesR = [
        ...qStartR.toArray(),
        ...qMidR.toArray(),
        ...qStartR.toArray()
    ];

    const trackL = new THREE.QuaternionKeyframeTrack('LeftWingPivot.quaternion', times, valuesL);
    const trackR = new THREE.QuaternionKeyframeTrack('RightWingPivot.quaternion', times, valuesR);

    const clip = new THREE.AnimationClip('FlapAnimation', 1.0, [trackL, trackR]);

    return { group, animationClips: [clip] };
}
