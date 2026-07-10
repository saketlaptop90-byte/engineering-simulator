import { carbonFiber, titanium, wireCoil, redAccent } from '../utils/materials.js';

export function createExoskeletonLeg(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const hipGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const hip = new THREE.Mesh(hipGeo, carbonFiber);
    hip.position.y = 5;
    group.add(hip);

    const thighGeo = new THREE.CylinderGeometry(0.4, 0.3, 2.5, 32);
    const thigh = new THREE.Mesh(thighGeo, titanium);
    thigh.position.y = -1.5;
    hip.add(thigh);

    const kneeGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const knee = new THREE.Mesh(kneeGeo, carbonFiber);
    knee.position.y = -1.25;
    knee.name = "Knee";
    thigh.add(knee);

    const calfGeo = new THREE.CylinderGeometry(0.3, 0.2, 2.5, 32);
    const calf = new THREE.Mesh(calfGeo, titanium);
    calf.position.y = -1.25;
    knee.add(calf);

    const ankleGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const ankle = new THREE.Mesh(ankleGeo, carbonFiber);
    ankle.position.y = -1.25;
    ankle.name = "Ankle";
    calf.add(ankle);

    const footGeo = new THREE.BoxGeometry(0.8, 0.4, 1.5);
    const foot = new THREE.Mesh(footGeo, titanium);
    foot.position.set(0, -0.2, 0.3);
    ankle.add(foot);

    const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32);
    const motor = new THREE.Mesh(motorGeo, wireCoil);
    motor.rotation.z = Math.PI / 2;
    knee.add(motor);

    const statusLightGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1);
    const statusLightMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true });
    const statusLight = new THREE.Mesh(statusLightGeo, statusLightMat);
    statusLight.position.set(0.6, 0, 0);
    statusLight.rotation.z = Math.PI / 2;
    statusLight.name = "StatusLight";
    hip.add(statusLight);

    const kneeTrack = new THREE.NumberKeyframeTrack(
        'Knee.rotation[x]',
        [0, 0.5, 1, 1.5, 2],
        [0, -Math.PI / 4, 0, -Math.PI / 4, 0]
    );

    const ankleTrack = new THREE.NumberKeyframeTrack(
        'Ankle.rotation[x]',
        [0, 0.5, 1, 1.5, 2],
        [0, Math.PI / 8, 0, Math.PI / 8, 0]
    );

    const blinkTrack = new THREE.NumberKeyframeTrack(
        'StatusLight.material.opacity',
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        [1, 0, 1, 0, 1, 0]
    );

    const clip = new THREE.AnimationClip('WalkCycle', 2, [kneeTrack, ankleTrack, blinkTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
