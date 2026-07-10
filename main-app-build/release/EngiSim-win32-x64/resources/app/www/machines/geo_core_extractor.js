import { titanium, darkSteel, gold, glass } from '../utils/materials.js';

export function createIronNickelCoreExtractor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Tube
    const tubeGroup = new THREE.Group();
    tubeGroup.name = "mainTube";
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const tube = new THREE.Mesh(tubeGeo, titanium);
    tube.rotation.x = Math.PI / 2;
    tubeGroup.add(tube);
    group.add(tubeGroup);

    // Magnetic coils
    const coilGroup = new THREE.Group();
    coilGroup.name = "coils";
    
    for (let i=0; i<3; i++) {
        const coilGeo = new THREE.TorusGeometry(2, 0.3, 16, 64);
        const coil = new THREE.Mesh(coilGeo, gold);
        coil.rotation.y = Math.PI / 2;
        coil.position.z = -2 + i * 2;
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // Extractor claw
    const clawGeo = new THREE.ConeGeometry(1.4, 2, 8);
    const claw = new THREE.Mesh(clawGeo, darkSteel);
    claw.rotation.x = -Math.PI / 2;
    claw.position.z = 5;
    tubeGroup.add(claw); // attached to tube

    // Animations: coils spin, tube extends and retracts
    const c0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const c1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    const c2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const c3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*1.5);
    const c4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*2);
    const coilTimes = [0, 1, 2, 3, 4];
    const coilVals = [
        c0.x, c0.y, c0.z, c0.w,
        c1.x, c1.y, c1.z, c1.w,
        c2.x, c2.y, c2.z, c2.w,
        c3.x, c3.y, c3.z, c3.w,
        c4.x, c4.y, c4.z, c4.w
    ];
    const coilTrack = new THREE.QuaternionKeyframeTrack('coils.quaternion', coilTimes, coilVals);

    // Tube extending along Z axis
    const tubePosVals = [
        0, 0, 0,
        0, 0, 3,
        0, 0, 0
    ];
    const tubeTrack = new THREE.VectorKeyframeTrack('mainTube.position', [0, 2, 4], tubePosVals);

    const clip = new THREE.AnimationClip('Extract', 4, [coilTrack, tubeTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
