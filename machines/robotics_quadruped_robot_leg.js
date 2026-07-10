import { aluminum, carbonFiber, blackPlastic, yellowAccent } from '../utils/materials.js';

export function createQuadrupedRobotLeg(THREE) {
    const group = new THREE.Group();
    group.name = "QuadrupedRobotLeg";

    // Shoulder mount
    const mountGeo = new THREE.BoxGeometry(0.8, 0.8, 1.2);
    const mount = new THREE.Mesh(mountGeo, carbonFiber);
    group.add(mount);

    // Hip Pivot (Abduction/Adduction)
    const hipPivot = new THREE.Group();
    hipPivot.name = "HipPivot";
    hipPivot.position.set(0.5, 0, 0);
    mount.add(hipPivot);

    const hipMotorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
    hipMotorGeo.rotateX(Math.PI / 2);
    const hipMotor = new THREE.Mesh(hipMotorGeo, aluminum);
    hipPivot.add(hipMotor);

    // Thigh Pivot (Flexion/Extension)
    const thighPivot = new THREE.Group();
    thighPivot.name = "ThighPivot";
    thighPivot.position.set(0.4, 0, 0);
    hipPivot.add(thighPivot);

    const thighGeo = new THREE.BoxGeometry(0.3, 2, 0.4);
    const thigh = new THREE.Mesh(thighGeo, yellowAccent);
    thigh.position.set(0, -1, 0);
    thighPivot.add(thigh);

    // Knee Pivot
    const kneePivot = new THREE.Group();
    kneePivot.name = "KneePivot";
    kneePivot.position.set(0, -1, 0);
    thigh.add(kneePivot);

    const calfGeo = new THREE.CylinderGeometry(0.15, 0.1, 2, 16);
    const calf = new THREE.Mesh(calfGeo, blackPlastic);
    calf.position.set(0, -1, 0);
    kneePivot.add(calf);

    // Foot
    const footGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const foot = new THREE.Mesh(footGeo, carbonFiber);
    foot.position.set(0, -1, 0);
    calf.add(foot);

    // Animation (Stepping sequence)
    const duration = 2;
    const qCenter = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    // Hip (Swing outwards/inwards)
    const hOut = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 8));
    const hIn = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 16));
    const hipTrack = new THREE.QuaternionKeyframeTrack('HipPivot.quaternion', [0, 0.5, 1, 1.5, 2], [
        ...qCenter.toArray(), ...hOut.toArray(), ...qCenter.toArray(), ...hIn.toArray(), ...qCenter.toArray()
    ]);

    // Thigh (Forward/Backward)
    const tForward = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 4, 0, 0));
    const tBackward = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 6, 0, 0));
    const thighTrack = new THREE.QuaternionKeyframeTrack('ThighPivot.quaternion', [0, 0.5, 1, 1.5, 2], [
        ...qCenter.toArray(), ...tForward.toArray(), ...qCenter.toArray(), ...tBackward.toArray(), ...qCenter.toArray()
    ]);

    // Knee (Bending)
    const kBent = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const kneeTrack = new THREE.QuaternionKeyframeTrack('KneePivot.quaternion', [0, 0.5, 1, 1.5, 2], [
        ...qCenter.toArray(), ...kBent.toArray(), ...qCenter.toArray(), ...qCenter.toArray(), ...qCenter.toArray()
    ]);

    const stepClip = new THREE.AnimationClip('Step', duration, [hipTrack, thighTrack, kneeTrack]);

    return { group, animationClips: [stepClip] };
}
