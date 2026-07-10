import { materials } from '../utils/materials.js';

export function createSteadicamGimbal(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Post
    const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const post = new THREE.Mesh(postGeo, materials.aluminum);

    // Camera Top Stage
    const stageGeo = new THREE.BoxGeometry(1, 0.2, 2);
    const stage = new THREE.Mesh(stageGeo, materials.darkSteel);
    stage.position.set(0, 2, 0);

    const cameraGeo = new THREE.BoxGeometry(0.8, 1, 1.5);
    const camera = new THREE.Mesh(cameraGeo, materials.darkSteel);
    camera.position.set(0, 2.6, 0);

    // Monitor
    const monitorGeo = new THREE.BoxGeometry(0.8, 0.6, 0.1);
    const monitor = new THREE.Mesh(monitorGeo, materials.glass);
    monitor.position.set(0, -1.8, 1);
    monitor.rotation.x = -Math.PI / 4;

    // Battery
    const batteryGeo = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const battery = new THREE.Mesh(batteryGeo, materials.darkSteel);
    battery.position.set(0, -1.8, -1);

    // Gimbal Rings
    const outerRingGroup = new THREE.Group();
    outerRingGroup.position.set(0, 1, 0);
    outerRingGroup.name = "outerRing";
    group.add(outerRingGroup);

    const outerRingGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
    const outerRing = new THREE.Mesh(outerRingGeo, materials.brass);
    outerRing.rotation.x = Math.PI / 2;
    outerRingGroup.add(outerRing);

    const innerRingGroup = new THREE.Group();
    innerRingGroup.name = "innerRing";
    outerRingGroup.add(innerRingGroup);

    const innerRingGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
    const innerRing = new THREE.Mesh(innerRingGeo, materials.aluminum);
    innerRing.rotation.y = Math.PI / 2;
    innerRingGroup.add(innerRing);

    // Sled Group
    const sledGroup = new THREE.Group();
    sledGroup.name = "sled";
    sledGroup.add(post);
    sledGroup.add(stage);
    sledGroup.add(camera);
    sledGroup.add(monitor);
    sledGroup.add(battery);
    sledGroup.position.set(0, -1, 0); // Offset so gimbal is at post height 1
    
    // Attach sled to inner gimbal ring
    innerRingGroup.add(sledGroup);

    // Gimbal Animation using Quaternions
    const times = [0, 1, 2, 3, 4];

    const xAxis = new THREE.Vector3(1, 0, 0);
    const zAxis = new THREE.Vector3(0, 0, 1);

    const qInner0 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const qInner1 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0.2);
    const qInner2 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const qInner3 = new THREE.Quaternion().setFromAxisAngle(xAxis, -0.2);
    const qInner4 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);

    const innerValues = [
        ...qInner0.toArray(), ...qInner1.toArray(), ...qInner2.toArray(), ...qInner3.toArray(), ...qInner4.toArray()
    ];

    const qOuter0 = new THREE.Quaternion().setFromAxisAngle(zAxis, 0);
    const qOuter1 = new THREE.Quaternion().setFromAxisAngle(zAxis, -0.1);
    const qOuter2 = new THREE.Quaternion().setFromAxisAngle(zAxis, 0);
    const qOuter3 = new THREE.Quaternion().setFromAxisAngle(zAxis, 0.1);
    const qOuter4 = new THREE.Quaternion().setFromAxisAngle(zAxis, 0);

    const outerValues = [
        ...qOuter0.toArray(), ...qOuter1.toArray(), ...qOuter2.toArray(), ...qOuter3.toArray(), ...qOuter4.toArray()
    ];

    const innerTrack = new THREE.QuaternionKeyframeTrack('innerRing.quaternion', times, innerValues);
    const outerTrack = new THREE.QuaternionKeyframeTrack('outerRing.quaternion', times, outerValues);

    const clip = new THREE.AnimationClip('GimbalBalance', 4, [innerTrack, outerTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
