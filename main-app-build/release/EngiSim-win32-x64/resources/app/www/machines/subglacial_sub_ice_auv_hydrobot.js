import { materials } from '../utils/materials.js';

export function createSubIceAUVHydrobot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Torpedo-like body
    const bodyGeo = new THREE.CapsuleGeometry(0.4, 2, 16, 32);
    const body = new THREE.Mesh(bodyGeo, materials.carbonFiber || new THREE.MeshStandardMaterial({color: 0x222222}));
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Propeller
    const propGroup = new THREE.Group();
    propGroup.position.x = -1.2;
    const propCenterGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const propCenter = new THREE.Mesh(propCenterGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    propCenter.rotation.z = Math.PI / 2;
    propGroup.add(propCenter);

    for(let i=0; i<3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.05, 0.6, 0.1);
        const blade = new THREE.Mesh(bladeGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
        blade.rotation.x = i * (Math.PI * 2 / 3);
        blade.position.z = Math.cos(i * (Math.PI * 2 / 3)) * 0.1;
        blade.position.y = Math.sin(i * (Math.PI * 2 / 3)) * 0.1;
        propGroup.add(blade);
    }
    group.add(propGroup);

    // Sonar Dome
    const domeGeo = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeo, materials.glass || new THREE.MeshStandardMaterial({color: 0x88ccff, transparent: true, opacity: 0.5}));
    dome.position.x = 1.2;
    dome.rotation.z = -Math.PI / 2;
    group.add(dome);

    // Sonar Ping animation
    const times = [0, 0.5, 1];
    const pingScale = [1,1,1, 1.5,1.5,1.5, 1,1,1];
    const pingTrack = new THREE.VectorKeyframeTrack(`${dome.uuid}.scale`, times, pingScale);

    // Propeller rotation
    const propTimes = [0, 1];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI);
    const propRot = [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w];
    const propTrack = new THREE.QuaternionKeyframeTrack(`${propGroup.uuid}.quaternion`, propTimes, propRot);

    const clip = new THREE.AnimationClip('SwimAndPing', 1, [pingTrack, propTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
