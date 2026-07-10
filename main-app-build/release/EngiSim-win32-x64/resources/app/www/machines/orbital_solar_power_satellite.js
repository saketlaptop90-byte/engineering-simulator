import { aluminum, titanium, glass } from '../utils/materials.js';

export function createSolarPowerSatellite(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Truss
    const trussGeo = new THREE.BoxGeometry(200, 5, 5);
    const truss = new THREE.Mesh(trussGeo, titanium);
    group.add(truss);

    // Solar Arrays
    const arrayGeo = new THREE.PlaneGeometry(180, 50);
    
    const array1 = new THREE.Mesh(arrayGeo, glass);
    array1.position.set(0, 30, 0);
    array1.name = "SolarArrayTop";
    group.add(array1);

    const array2 = new THREE.Mesh(arrayGeo, glass);
    array2.position.set(0, -30, 0);
    array2.name = "SolarArrayBottom";
    group.add(array2);

    // Microwave Transmitter
    const transmitterGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const transmitter = new THREE.Mesh(transmitterGeo, aluminum);
    transmitter.rotation.x = Math.PI / 2;
    transmitter.position.set(0, 0, 10);
    group.add(transmitter);

    // Animation: Solar arrays rotating to face sun
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 3*Math.PI/2);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI*2);

    const topTrack = new THREE.QuaternionKeyframeTrack(
        'SolarArrayTop.quaternion',
        [0, 5, 10, 15, 20],
        [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w
        ]
    );

    const bottomTrack = new THREE.QuaternionKeyframeTrack(
        'SolarArrayBottom.quaternion',
        [0, 5, 10, 15, 20],
        [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w
        ]
    );

    const arrayClip = new THREE.AnimationClip('ArrayRotate', 20, [topTrack, bottomTrack]);
    animationClips.push(arrayClip);

    return { group, animationClips };
}
