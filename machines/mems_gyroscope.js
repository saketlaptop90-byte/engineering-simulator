import { titanium, carbonFiber, ghostMaterial } from '../utils/materials.js';

export function createMEMSGyroscope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base frame
    const frameGeo = new THREE.BoxGeometry(2, 0.1, 2);
    const frame = new THREE.Mesh(frameGeo, titanium);
    group.add(frame);

    // Outer gimbal
    const outerGimbalGeo = new THREE.TorusGeometry(0.8, 0.05, 16, 64);
    const outerGimbal = new THREE.Mesh(outerGimbalGeo, carbonFiber);
    outerGimbal.rotation.x = Math.PI / 2;
    outerGimbal.position.y = 0.5;
    group.add(outerGimbal);

    // Inner gimbal
    const innerGimbalGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 64);
    const innerGimbal = new THREE.Mesh(innerGimbalGeo, titanium);
    outerGimbal.add(innerGimbal);

    // Rotor
    const rotorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const rotor = new THREE.Mesh(rotorGeo, ghostMaterial);
    innerGimbal.add(rotor);

    // Animation: Gimbals rotating and rotor spinning rapidly
    const times = [0, 1, 2, 3, 4];

    // Rotor spin (rapid)
    const rotorSpinTrack = new THREE.QuaternionKeyframeTrack(
        `${rotor.uuid}.quaternion`,
        [0, 1],
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 10, 0)).toArray(),
        ].flat()
    );

    // Inner gimbal wobble
    const innerTrack = new THREE.QuaternionKeyframeTrack(
        `${innerGimbal.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0.5, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
        ].flat()
    );

    // Outer gimbal rotate
    const outerTrack = new THREE.QuaternionKeyframeTrack(
        `${outerGimbal.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI * 1.5)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI * 2)).toArray(),
        ].flat()
    );

    const clip = new THREE.AnimationClip('gyro_motion', 4, [rotorSpinTrack, innerTrack, outerTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
