import { whitePlastic, steel, aluminum, concrete } from '../utils/materials.js';

export function createGeothermalHeatPump(THREE) {
    const group = new THREE.Group();

    // Ground platform
    const platformGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const platform = new THREE.Mesh(platformGeo, concrete);
    platform.position.y = 0.1;
    group.add(platform);

    // Main heat exchanger unit
    const unitGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const unit = new THREE.Mesh(unitGeo, steel);
    unit.position.set(0, 1.2, 0);
    group.add(unit);

    // Cooling fan on top
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 2.25, 0);
    fanGroup.name = 'HeatPumpFan';
    group.add(fanGroup);

    const fanHubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const fanHub = new THREE.Mesh(fanHubGeo, aluminum);
    fanGroup.add(fanHub);

    const fanBladeGeo = new THREE.BoxGeometry(1.2, 0.05, 0.2);
    const fanBlade = new THREE.Mesh(fanBladeGeo, whitePlastic);
    fanGroup.add(fanBlade);

    const fanBlade2 = new THREE.Mesh(fanBladeGeo, whitePlastic);
    fanBlade2.rotation.y = Math.PI / 2;
    fanGroup.add(fanBlade2);

    // Ground loop pipes (going deep into the ground)
    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const pipe1 = new THREE.Mesh(pipeGeo, whitePlastic);
    pipe1.position.set(-0.5, -1, 0);
    const pipe2 = new THREE.Mesh(pipeGeo, whitePlastic);
    pipe2.position.set(0.5, -1, 0);
    group.add(pipe1, pipe2);

    // Connect pipes to unit
    const topPipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const topPipe1 = new THREE.Mesh(topPipeGeo, whitePlastic);
    topPipe1.position.set(-0.5, 0.75, 0);
    const topPipe2 = new THREE.Mesh(topPipeGeo, whitePlastic);
    topPipe2.position.set(0.5, 0.75, 0);
    group.add(topPipe1, topPipe2);

    // Animation: Fan spinning
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 2 * Math.PI);
    
    const times = [0, 0.5, 1.0];
    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('HeatPumpFan.quaternion', times, values);
    const clip = new THREE.AnimationClip('SpinFan', 1, [track]);

    return { group, animationClips: [clip] };
}
