import { steel, copper, darkSteel, glass } from '../utils/materials.js';

export function createOtecPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main platform
    const platformGeom = new THREE.BoxGeometry(12, 1, 12);
    const platform = new THREE.Mesh(platformGeom, darkSteel);
    platform.position.y = 0.5;
    group.add(platform);

    // Central Condenser
    const condenserGeom = new THREE.CylinderGeometry(2, 2, 6, 32);
    const condenser = new THREE.Mesh(condenserGeom, glass);
    condenser.position.y = 4;
    group.add(condenser);

    // Evaporator (Hot Surface Seawater)
    const evaporatorGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const evaporator = new THREE.Mesh(evaporatorGeom, copper);
    evaporator.position.set(-4, 3, 0);
    group.add(evaporator);

    // Cold Water Pipe (Deep Seawater)
    const coldPipeGeom = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);
    const coldPipe = new THREE.Mesh(coldPipeGeom, steel);
    coldPipe.position.set(4, -7, 0);
    group.add(coldPipe);

    // Pipes connecting Evaporator -> Condenser
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4), steel);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(-2, 4, 0);
    group.add(pipe1);

    // Turbine between evaporator and condenser
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(-2, 4, 0);
    turbineGroup.rotation.z = Math.PI / 2;
    group.add(turbineGroup);

    const turbineGeom = new THREE.CylinderGeometry(1, 1, 1, 16);
    const turbine = new THREE.Mesh(turbineGeom, darkSteel);
    turbine.name = "otecTurbine";
    turbineGroup.add(turbine);

    // Turbine Blades
    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, 0.5), copper);
        blade.rotation.x = i * Math.PI / 2;
        turbine.add(blade);
    }

    // Animation (Turbine spinning)
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const qValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const turbineTrack = new THREE.QuaternionKeyframeTrack(`${turbine.name}.quaternion`, times, qValues);
    const clip = new THREE.AnimationClip('Spin', 2, [turbineTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
