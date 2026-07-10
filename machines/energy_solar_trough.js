import { whitePlastic, steel, aluminum, concrete } from '../utils/materials.js';

export function createSolarTrough(THREE) {
    const group = new THREE.Group();

    // Base supports
    const supportGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
    const support1 = new THREE.Mesh(supportGeo, concrete);
    support1.position.set(-3.5, 1, 0);
    const support2 = new THREE.Mesh(supportGeo, concrete);
    support2.position.set(3.5, 1, 0);
    group.add(support1, support2);

    // Trough assembly (rotates to track sun)
    const troughAssembly = new THREE.Group();
    troughAssembly.position.y = 2;
    troughAssembly.name = 'TroughAssembly';
    group.add(troughAssembly);

    // Parabolic mirror (approximated by an open half-cylinder)
    const mirrorGeo = new THREE.CylinderGeometry(2, 2, 8, 32, 1, true, 0, Math.PI);
    const mirror = new THREE.Mesh(mirrorGeo, aluminum);
    mirror.material.side = THREE.DoubleSide; // Ensure both sides are visible
    mirror.rotation.z = Math.PI / 2;
    mirror.rotation.x = Math.PI / 2;
    troughAssembly.add(mirror);

    // Central receiver tube (where heat transfer fluid runs)
    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const tube = new THREE.Mesh(tubeGeo, steel);
    tube.rotation.z = Math.PI / 2;
    // Positioned at the focal point roughly
    tube.position.z = 1; 
    troughAssembly.add(tube);

    // Supports for receiver tube
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const arm1 = new THREE.Mesh(armGeo, steel);
    arm1.position.set(-3.5, 0, 0.5);
    arm1.rotation.x = Math.PI / 2;
    const arm2 = new THREE.Mesh(armGeo, steel);
    arm2.position.set(3.5, 0, 0.5);
    arm2.rotation.x = Math.PI / 2;
    troughAssembly.add(arm1, arm2);

    // Tracking animation (rotate slightly back and forth along longitudinal axis)
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/6);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/6);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/6);
    
    const times = [0, 5, 10];
    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('TroughAssembly.quaternion', times, values);
    const clip = new THREE.AnimationClip('TrackSun', 10, [track]);

    return { group, animationClips: [clip] };
}
