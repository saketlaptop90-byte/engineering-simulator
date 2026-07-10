import { darkSteel, titanium, copper, glass } from '../utils/materials.js';

export function createPlasmaRefiner(THREE) {
    const group = new THREE.Group();
    group.name = "RegolithPlasmaRefiner";

    // Main Furnace Body
    const bodyGeo = new THREE.CylinderGeometry(2.5, 3.5, 6, 32);
    const body = new THREE.Mesh(bodyGeo, darkSteel);
    body.position.y = 3;
    group.add(body);

    // Plasma Containment Field Chamber
    const chamberGeo = new THREE.SphereGeometry(2, 32, 32);
    const chamber = new THREE.Mesh(chamberGeo, glass);
    chamber.position.y = 4;
    group.add(chamber);

    // Magnetic Containment Rings
    const ringsGroup = new THREE.Group();
    ringsGroup.name = "MagneticRings";
    ringsGroup.position.y = 4;
    
    for(let i = 0; i < 4; i++) {
        const ringGeo = new THREE.TorusGeometry(2.2, 0.15, 16, 64);
        const ring = new THREE.Mesh(ringGeo, titanium);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = (i - 1.5) * 0.8;
        ringsGroup.add(ring);
    }
    group.add(ringsGroup);

    // Plasma Core
    const coreGeo = new THREE.SphereGeometry(1, 32, 32);
    const core = new THREE.Mesh(coreGeo, copper);
    core.name = "PlasmaCore";
    core.position.y = 4;
    group.add(core);

    // Exhaust Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, titanium);
    pipe1.position.set(2.8, 3, 0);
    group.add(pipe1);
    
    const pipe2 = new THREE.Mesh(pipeGeo, titanium);
    pipe2.position.set(-2.8, 3, 0);
    group.add(pipe2);

    // Animation: Pulsing Plasma Core and Rotating Magnetic Rings
    const times = [0, 1, 2];
    
    // Core Pulse
    const coreScale = [
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1
    ];
    const coreTrack = new THREE.VectorKeyframeTrack('PlasmaCore.scale', times, coreScale);

    // Ring Rotation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const ringValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const ringTrack = new THREE.QuaternionKeyframeTrack('MagneticRings.quaternion', times, ringValues);

    const clip = new THREE.AnimationClip('RefinePlasma', 2, [coreTrack, ringTrack]);

    return { group, animationClips: [clip] };
}
