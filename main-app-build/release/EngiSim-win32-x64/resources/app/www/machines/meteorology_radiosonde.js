import { aluminum, glass, steel, copper } from '../utils/materials.js';

export function createRadiosonde(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Balloon (pulsates or gently bobs)
    const balloonGroup = new THREE.Group();
    group.add(balloonGroup);

    const balloonGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const balloon = new THREE.Mesh(balloonGeo, glass); // Using glass to look plastic/transparent
    balloonGroup.add(balloon);

    // String
    const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, 3, 8);
    const string = new THREE.Mesh(stringGeo, steel);
    string.position.y = -1.5;
    balloonGroup.add(string);

    // Instrument Box
    const boxGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const box = new THREE.Mesh(boxGeo, aluminum);
    box.position.y = -3;
    balloonGroup.add(box);

    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
    const antenna = new THREE.Mesh(antennaGeo, copper);
    antenna.position.y = -2.5;
    antenna.position.x = 0.2;
    balloonGroup.add(antenna);

    // Animation: bobbing and slight sway
    const times = [0, 2, 4];
    const yVals = [0, 0.5, 0];
    const bobTrack = new THREE.VectorKeyframeTrack(`${balloonGroup.uuid}.position`, times, yVals);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.1);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.1);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    
    const rotTimes = [0, 1.33, 2.66, 4];
    const rotVals = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w
    ];
    const swayTrack = new THREE.QuaternionKeyframeTrack(`${balloonGroup.uuid}.quaternion`, rotTimes, rotVals);

    const flyClip = new THREE.AnimationClip('fly', 4, [bobTrack, swayTrack]);
    animationClips.push(flyClip);

    return { group, animationClips };
}
