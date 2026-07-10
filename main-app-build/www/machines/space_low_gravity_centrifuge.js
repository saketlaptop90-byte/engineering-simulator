import { aluminum, gold, glass } from '../utils/materials.js';

export function createLowGravityCentrifuge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central Hub
    const hubGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    hub.position.y = 5;
    group.add(hub);

    // Rotating Section
    const rotor = new THREE.Group();
    rotor.position.y = 5;
    group.add(rotor);

    // Arms
    const armGeo = new THREE.BoxGeometry(20, 1, 1);
    const arm1 = new THREE.Mesh(armGeo, aluminum);
    rotor.add(arm1);
    const arm2 = new THREE.Mesh(armGeo, aluminum);
    arm2.rotation.y = Math.PI / 2;
    rotor.add(arm2);

    // Habitats (attached to arms)
    const habGeo = new THREE.TorusGeometry(10, 2, 16, 64);
    const hab = new THREE.Mesh(habGeo, glass);
    hab.rotation.x = Math.PI / 2;
    rotor.add(hab);

    // Connectors
    const connectorGeo = new THREE.SphereGeometry(1.5, 16, 16);
    for (let i = 0; i < 4; i++) {
        const connector = new THREE.Mesh(connectorGeo, gold);
        connector.position.set(10 * Math.cos(i * Math.PI / 2), 0, 10 * Math.sin(i * Math.PI / 2));
        rotor.add(connector);
    }

    // Animation: Centrifuge spinning
    const rotTrack = `${rotor.uuid}.quaternion`;
    const times = [0, 5, 10];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const rotKF = new THREE.QuaternionKeyframeTrack(rotTrack, times, values);
    const clip = new THREE.AnimationClip('Spin', 10, [rotKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
