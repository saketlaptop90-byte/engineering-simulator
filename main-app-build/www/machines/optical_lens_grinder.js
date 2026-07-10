import * as materials from '../utils/materials.js';

export function createOpticalLensGrinder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const machineMetal = materials.machineMetal || new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.5, roughness: 0.6 });
    const brightMetal = materials.brightMetal || new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.1 });
    const diamondWheel = materials.diamondWheel || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.2 });
    const lensMat = materials.lens || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, opacity: 1, transparent: true, roughness: 0.0, ior: 1.5 });

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), machineMetal);
    base.position.set(0, 1, 0);
    group.add(base);

    // Lens Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 1), brightMetal);
    mount.position.set(0, 2.5, 0);
    mount.name = 'LensMount';
    group.add(mount);

    // Lens
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4), lensMat);
    lens.position.set(0, 0.5, 0);
    mount.add(lens);

    // Grinding Arm
    const arm = new THREE.Group();
    arm.position.set(2, 3, 0);
    arm.name = 'GrindingArm';
    group.add(arm);

    const armBase = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 2), machineMetal);
    arm.add(armBase);

    // Grinding Wheel
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32), diamondWheel);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(-1, 0, 0);
    wheel.name = 'Wheel';
    arm.add(wheel);

    // Animations
    const axisY = new THREE.Vector3(0, 1, 0);
    const mountTrack = new THREE.QuaternionKeyframeTrack(
        'LensMount.quaternion',
        [0, 0.5, 1, 1.5, 2],
        [
            ...new THREE.Quaternion().setFromAxisAngle(axisY, 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisY, Math.PI / 2).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisY, Math.PI).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisY, Math.PI * 1.5).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisY, Math.PI * 2).toArray()
        ]
    );
    animationClips.push(new THREE.AnimationClip('SpinMount', 2, [mountTrack]));

    const axisX = new THREE.Vector3(1, 0, 0);
    const wheelTrack = new THREE.QuaternionKeyframeTrack(
        'Wheel.quaternion',
        [0, 0.05, 0.1, 0.15, 0.2],
        [
            ...new THREE.Quaternion().setFromAxisAngle(axisX, 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisX, Math.PI / 2).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisX, Math.PI).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisX, Math.PI * 1.5).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(axisX, Math.PI * 2).toArray()
        ]
    );
    animationClips.push(new THREE.AnimationClip('SpinWheel', 0.2, [wheelTrack]));

    const armTrack = new THREE.VectorKeyframeTrack('GrindingArm.position', [0, 1, 2], [2, 3, -1, 2, 3, 1, 2, 3, -1]);
    animationClips.push(new THREE.AnimationClip('OscillateArm', 2, [armTrack]));

    return { group, animationClips };
}
