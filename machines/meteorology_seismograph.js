import { aluminum, glass, steel, copper } from '../utils/materials.js';

export function createSeismograph(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base plate
    const baseGeo = new THREE.BoxGeometry(3, 0.2, 1.5);
    const base = new THREE.Mesh(baseGeo, steel);
    group.add(base);

    // Drum (Rotates continuously)
    const drumGroup = new THREE.Group();
    drumGroup.position.set(0.5, 0.6, 0);
    group.add(drumGroup);

    const drumGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const drum = new THREE.Mesh(drumGeo, aluminum);
    drum.rotation.x = Math.PI / 2;
    drumGroup.add(drum);

    // Support pillars for drum
    const pillarGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
    const p1 = new THREE.Mesh(pillarGeo, steel);
    p1.position.set(0.5, 0.3, 0.6);
    group.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, steel);
    p2.position.set(0.5, 0.3, -0.6);
    group.add(p2);

    // Pen arm assembly (Jitters)
    const armGroup = new THREE.Group();
    armGroup.position.set(-1, 0.6, 0);
    group.add(armGroup);

    const armGeo = new THREE.BoxGeometry(1.5, 0.05, 0.05);
    const arm = new THREE.Mesh(armGeo, copper);
    arm.position.x = 0.75;
    armGroup.add(arm);

    // Heavy mass on arm
    const massGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const mass = new THREE.Mesh(massGeo, steel);
    mass.position.x = 0.5;
    armGroup.add(mass);

    // Animation Drum Rotation
    const dq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const dq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 0.5);
    const dq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const dq4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 1.5);
    const dq5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const dTimes = [0, 2, 4, 6, 8];
    const dVals = [
        dq1.x, dq1.y, dq1.z, dq1.w,
        dq2.x, dq2.y, dq2.z, dq2.w,
        dq3.x, dq3.y, dq3.z, dq3.w,
        dq4.x, dq4.y, dq4.z, dq4.w,
        dq5.x, dq5.y, dq5.z, dq5.w
    ];
    const drumTrack = new THREE.QuaternionKeyframeTrack(`${drumGroup.uuid}.quaternion`, dTimes, dVals);

    // Animation Pen Arm Jitter
    const jTimes = [0, 0.5, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8];
    const jVals = [];
    for(let t of jTimes) {
        const jitter = (Math.random() - 0.5) * 0.2;
        const jq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), jitter);
        jVals.push(jq.x, jq.y, jq.z, jq.w);
    }
    const penTrack = new THREE.QuaternionKeyframeTrack(`${armGroup.uuid}.quaternion`, jTimes, jVals);

    const eqClip = new THREE.AnimationClip('record', 8, [drumTrack, penTrack]);
    animationClips.push(eqClip);

    return { group, animationClips };
}
