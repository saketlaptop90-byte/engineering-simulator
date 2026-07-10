import { aluminum, carbonFiber, blackPlastic, yellowAccent } from '../utils/materials.js';

export function createIndustrialWeldingArm(THREE) {
    const group = new THREE.Group();
    group.name = "IndustrialWeldingArm";

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, carbonFiber);
    group.add(base);

    // Base Pivot (Swivel)
    const swivelPivot = new THREE.Group();
    swivelPivot.name = "SwivelPivot";
    swivelPivot.position.set(0, 0.25, 0);
    base.add(swivelPivot);

    const lowerArmGeo = new THREE.BoxGeometry(0.8, 3, 0.8);
    const lowerArm = new THREE.Mesh(lowerArmGeo, yellowAccent);
    lowerArm.position.set(0, 1.5, 0);
    swivelPivot.add(lowerArm);

    // Elbow Pivot
    const elbowPivot = new THREE.Group();
    elbowPivot.name = "ElbowPivot";
    elbowPivot.position.set(0, 1.5, 0);
    lowerArm.add(elbowPivot);

    const upperArmGeo = new THREE.BoxGeometry(0.6, 2.5, 0.6);
    const upperArm = new THREE.Mesh(upperArmGeo, aluminum);
    upperArm.position.set(0, 1.25, 0);
    elbowPivot.add(upperArm);

    // Wrist Pivot
    const wristPivot = new THREE.Group();
    wristPivot.name = "WristPivot";
    wristPivot.position.set(0, 1.25, 0);
    upperArm.add(wristPivot);

    const welderGeo = new THREE.CylinderGeometry(0.2, 0.1, 1);
    const welder = new THREE.Mesh(welderGeo, blackPlastic);
    welder.position.set(0, 0.5, 0);
    wristPivot.add(welder);

    // Welding tip
    const tipGeo = new THREE.ConeGeometry(0.05, 0.2);
    const tip = new THREE.Mesh(tipGeo, aluminum);
    tip.position.set(0, 0.5, 0);
    welder.add(tip);

    // Animation (Welding Motion)
    const duration = 4;
    const qCenter = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    // Swivel motion
    const sLeft = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0));
    const sRight = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 4, 0));
    const swivelTrack = new THREE.QuaternionKeyframeTrack('SwivelPivot.quaternion', [0, 1, 2, 3, 4], [
        ...qCenter.toArray(), ...sLeft.toArray(), ...qCenter.toArray(), ...sRight.toArray(), ...qCenter.toArray()
    ]);

    // Elbow motion
    const eDown = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 3, 0, 0));
    const eUp = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 6, 0, 0));
    const elbowTrack = new THREE.QuaternionKeyframeTrack('ElbowPivot.quaternion', [0, 1, 2, 3, 4], [
        ...eUp.toArray(), ...eDown.toArray(), ...eUp.toArray(), ...eDown.toArray(), ...eUp.toArray()
    ]);

    // Wrist motion
    const wTwist = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
    const wristTrack = new THREE.QuaternionKeyframeTrack('WristPivot.quaternion', [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], [
        ...qCenter.toArray(), ...wTwist.toArray(), ...qCenter.toArray(), ...wTwist.toArray(),
        ...qCenter.toArray(), ...wTwist.toArray(), ...qCenter.toArray(), ...wTwist.toArray(), ...qCenter.toArray()
    ]);

    const weldClip = new THREE.AnimationClip('Weld', duration, [swivelTrack, elbowTrack, wristTrack]);

    return { group, animationClips: [weldClip] };
}
