import { darkSteel, steel, brass, aluminum, chrome } from '../utils/materials.js';

export function createGyroscopicGimbalStabilizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base frame
    const baseGeo = new THREE.CylinderGeometry(2, 2.5, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    group.add(base);

    const pillarGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
    const pillar1 = new THREE.Mesh(pillarGeo, steel);
    pillar1.position.set(-2, 3, 0);
    group.add(pillar1);
    
    const pillar2 = new THREE.Mesh(pillarGeo, steel);
    pillar2.position.set(2, 3, 0);
    group.add(pillar2);

    // Outer Gimbal (rotates around X axis)
    const outerGimbal = new THREE.Group();
    outerGimbal.name = 'OuterGimbal';
    outerGimbal.position.set(0, 5, 0);
    group.add(outerGimbal);

    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.15, 16, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, brass);
    outerRing.rotation.x = Math.PI / 2;
    outerGimbal.add(outerRing);

    // Inner Gimbal (rotates around Z axis)
    const innerGimbal = new THREE.Group();
    innerGimbal.name = 'InnerGimbal';
    outerGimbal.add(innerGimbal);

    const innerRingGeo = new THREE.TorusGeometry(1.4, 0.15, 16, 64);
    const innerRing = new THREE.Mesh(innerRingGeo, aluminum);
    innerRing.rotation.y = Math.PI / 2;
    innerRing.rotation.x = Math.PI / 2;
    innerGimbal.add(innerRing);

    // Rotor (rotates around Y axis, very fast)
    const rotor = new THREE.Group();
    rotor.name = 'Rotor';
    innerGimbal.add(rotor);

    const flywheelGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.4, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, chrome);
    rotor.add(flywheel);
    
    const axisGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.8, 16);
    const axis = new THREE.Mesh(axisGeo, steel);
    rotor.add(axis);

    // Animations
    // 1. Rotor spinning fast
    const times = [0, 1, 2, 3, 4];
    const rQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const rQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const rQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const rQ4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 3);
    const rQ5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 4);
    const rotorTrack = new THREE.QuaternionKeyframeTrack('Rotor.quaternion', times, [
        ...rQ1.toArray(), ...rQ2.toArray(), ...rQ3.toArray(), ...rQ4.toArray(), ...rQ5.toArray()
    ]);

    // 2. Outer Gimbal oscillating
    const oQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const oQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.5);
    const oQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.3);
    const outerTrack = new THREE.QuaternionKeyframeTrack('OuterGimbal.quaternion', [0, 1.5, 3, 4], [
        ...oQ1.toArray(), ...oQ2.toArray(), ...oQ3.toArray(), ...oQ1.toArray()
    ]);

    // 3. Inner Gimbal oscillating
    const iQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const iQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.6);
    const iQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.4);
    const innerTrack = new THREE.QuaternionKeyframeTrack('InnerGimbal.quaternion', [0, 1.2, 2.8, 4], [
        ...iQ1.toArray(), ...iQ2.toArray(), ...iQ3.toArray(), ...iQ1.toArray()
    ]);

    const clip = new THREE.AnimationClip('StabilizerAction', 4, [rotorTrack, outerTrack, innerTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
