import { titanium, carbonFiber, ghostMaterial } from '../utils/materials.js';

export function createNanoBloodSwimmer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main body
    const bodyGeo = new THREE.CapsuleGeometry(0.2, 0.8, 16, 32);
    const body = new THREE.Mesh(bodyGeo, titanium);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Flagella (tail for swimming)
    const flagellaGeo = new THREE.CylinderGeometry(0.02, 0.05, 1.0, 8);
    const flagella = new THREE.Mesh(flagellaGeo, carbonFiber);
    flagella.position.set(-0.9, 0, 0);
    flagella.rotation.z = Math.PI / 2;
    group.add(flagella);

    // Sensors
    const sensorGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const sensor1 = new THREE.Mesh(sensorGeo, ghostMaterial);
    sensor1.position.set(0.6, 0.15, 0);
    const sensor2 = new THREE.Mesh(sensorGeo, ghostMaterial);
    sensor2.position.set(0.6, -0.15, 0);
    group.add(sensor1, sensor2);

    // Animation: Flagella whipping and body rolling
    const times = [0, 0.5, 1, 1.5, 2];
    
    // Flagella wagging
    const tailRotTrack = new THREE.QuaternionKeyframeTrack(
        `${flagella.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.2, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.2, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)).toArray(),
        ].flat()
    );

    // Body spinning
    const bodySpinTrack = new THREE.QuaternionKeyframeTrack(
        `${body.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*1.5, 0, Math.PI / 2)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, 0, Math.PI / 2)).toArray(),
        ].flat()
    );

    const clip = new THREE.AnimationClip('swim', 2, [tailRotTrack, bodySpinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
