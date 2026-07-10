import { titanium, darkSteel, gold, glass } from '../utils/materials.js';

export function createCoreSamplingMantleDrill(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    group.add(base);

    const drillAssembly = new THREE.Group();
    drillAssembly.name = "drillAssembly";
    
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
    const shaft = new THREE.Mesh(shaftGeo, titanium);
    shaft.position.y = 2.5;
    drillAssembly.add(shaft);

    const bitGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
    const bit = new THREE.Mesh(bitGeo, gold);
    bit.position.y = -0.75;
    bit.rotation.x = Math.PI;
    drillAssembly.add(bit);

    drillAssembly.position.y = 1;
    group.add(drillAssembly);

    // Animation: spinning and plunging
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w
    ];
    
    const spinTrack = new THREE.QuaternionKeyframeTrack('drillAssembly.quaternion', times, values);

    // Plunge animation
    const plungeTrack = new THREE.VectorKeyframeTrack('drillAssembly.position', times, [
        0, 1, 0,
        0, 0.25, 0,
        0, -0.5, 0,
        0, 0.25, 0,
        0, 1, 0
    ]);

    const clip = new THREE.AnimationClip('DrillOperation', 2, [spinTrack, plungeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
