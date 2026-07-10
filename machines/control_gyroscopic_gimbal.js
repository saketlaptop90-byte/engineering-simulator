import * as materials from '../utils/materials.js';

export function createGyroscopicGimbal(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base support
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, materials.castIron);
    group.add(base);

    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const pillar1 = new THREE.Mesh(pillarGeo, materials.steel);
    pillar1.position.set(-2, 1.5, 0);
    group.add(pillar1);
    
    const pillar2 = new THREE.Mesh(pillarGeo, materials.steel);
    pillar2.position.set(2, 1.5, 0);
    group.add(pillar2);

    // Outer Gimbal Ring (Rotates on X axis)
    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.1, 16, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, materials.steel);
    outerRing.position.y = 3;
    outerRing.name = "OuterRing";
    group.add(outerRing);

    // Inner Gimbal Ring (Rotates on Z axis relative to Outer)
    const innerRingGeo = new THREE.TorusGeometry(1.4, 0.1, 16, 64);
    innerRingGeo.rotateY(Math.PI / 2);
    const innerRing = new THREE.Mesh(innerRingGeo, materials.brass);
    innerRing.name = "InnerRing";
    outerRing.add(innerRing);

    // Gyroscope Rotor (Rotates on Y axis relative to Inner)
    const rotorGeo = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const rotor = new THREE.Mesh(rotorGeo, materials.castIron);
    rotor.name = "Rotor";
    innerRing.add(rotor);

    // Rotor shaft
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.8, 16);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, materials.steel);
    innerRing.add(shaft);

    // Animations
    const times = [0, 2, 4];
    
    // Outer ring tilt
    const outerQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const outerQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
    const outerQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4);
    const outerTrack = new THREE.QuaternionKeyframeTrack(
        `OuterRing.quaternion`,
        [0, 1, 3, 4],
        [outerQ1.x, outerQ1.y, outerQ1.z, outerQ1.w, outerQ2.x, outerQ2.y, outerQ2.z, outerQ2.w, outerQ3.x, outerQ3.y, outerQ3.z, outerQ3.w, outerQ1.x, outerQ1.y, outerQ1.z, outerQ1.w]
    );

    // Inner ring tilt
    const innerQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const innerQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 6);
    const innerQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 6);
    const innerTrack = new THREE.QuaternionKeyframeTrack(
        `InnerRing.quaternion`,
        [0, 1.5, 2.5, 4],
        [innerQ1.x, innerQ1.y, innerQ1.z, innerQ1.w, innerQ2.x, innerQ2.y, innerQ2.z, innerQ2.w, innerQ3.x, innerQ3.y, innerQ3.z, innerQ3.w, innerQ1.x, innerQ1.y, innerQ1.z, innerQ1.w]
    );

    // Rotor fast spin
    const rQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const rQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const rQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const rotorTrack = new THREE.QuaternionKeyframeTrack(
        `Rotor.quaternion`,
        [0, 0.5, 1], // Very fast spin, loops 4 times in 4 seconds
        [rQ1.x, rQ1.y, rQ1.z, rQ1.w, rQ2.x, rQ2.y, rQ2.z, rQ2.w, rQ3.x, rQ3.y, rQ3.z, rQ3.w]
    );

    const clip1 = new THREE.AnimationClip('GimbalMotion', 4, [outerTrack, innerTrack]);
    const clip2 = new THREE.AnimationClip('RotorSpin', 1, [rotorTrack]);
    animationClips.push(clip1, clip2);

    return { group, animationClips };
}
