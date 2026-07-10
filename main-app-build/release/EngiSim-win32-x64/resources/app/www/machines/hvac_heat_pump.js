import { aluminum, copper, steel, plastic, darkSteel, brass } from '../utils/materials.js';

export function createHeatPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 3), darkSteel);
    base.position.y = -1.5;
    group.add(base);

    // Compressor
    const compressor = new THREE.Group();
    compressor.position.set(0, -0.8, 0);
    const compBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16), darkSteel);
    compressor.add(compBody);
    group.add(compressor);

    // Reversing Valve
    const revValve = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16), brass);
    revValve.rotation.z = Math.PI / 2;
    revValve.position.set(0, 0.2, 0);
    group.add(revValve);

    // Coils
    const coilGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 32);
    for(let i=0; i<10; i++) {
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.rotation.x = Math.PI / 2;
        coil.position.y = -1.2 + i * 0.2;
        group.add(coil);
    }

    // Top Fan
    const fanGroup = new THREE.Group();
    fanGroup.name = "HeatPumpFan";
    fanGroup.position.set(0, 1.0, 0);
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), plastic);
    fanGroup.add(fanHub);

    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.3), plastic);
        blade.position.x = 0.7;
        const pivot = new THREE.Group();
        pivot.rotation.y = (i * Math.PI * 2) / 4;
        pivot.add(blade);
        fanGroup.add(pivot);
    }
    group.add(fanGroup);

    // Animations
    const times = [0, 0.5, 1.0];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const fanTrack = new THREE.QuaternionKeyframeTrack(
        'HeatPumpFan.quaternion', times, [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const clip = new THREE.AnimationClip('heat_pump_run', 1, [fanTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
