import { materials } from '../utils/materials.js';

export function createHallEffectThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.5 });
    const ceramicMat = materials?.ceramic || new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });
    const plumeMat = materials?.plasma_blue || new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });

    // Thruster Body
    const bodyGeo = new THREE.CylinderGeometry(2, 2.5, 2, 32);
    const body = new THREE.Mesh(bodyGeo, metalMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Discharge Channel
    const channelGeo = new THREE.TorusGeometry(1.5, 0.3, 16, 64);
    const channel = new THREE.Mesh(channelGeo, ceramicMat);
    channel.position.z = 1;
    group.add(channel);

    // Central magnetic pole
    const poleGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 32);
    const pole = new THREE.Mesh(poleGeo, metalMat);
    pole.rotation.x = Math.PI / 2;
    group.add(pole);

    // Plasma Plume
    const plumeGeo = new THREE.ConeGeometry(3, 10, 32, 1, true);
    // Translate geometry to pivot at the base
    plumeGeo.translate(0, 5, 0);
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.rotation.x = Math.PI / 2;
    plume.position.z = 1;
    plume.name = "plasmaPlume";
    group.add(plume);

    // Animations
    const thrustClip = new THREE.AnimationClip('ThrustPulse', 0.5, [
        new THREE.VectorKeyframeTrack('plasmaPlume.scale', [0, 0.25, 0.5], [1, 1, 1,  1.1, 1.2, 1.1,  1, 1, 1])
    ]);
    animationClips.push(thrustClip);

    return { group, animationClips };
}
