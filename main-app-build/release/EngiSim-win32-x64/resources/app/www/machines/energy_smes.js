import { copper, aluminum, glass, gold } from '../utils/materials.js';

export function createSMES(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const vesselGeom = new THREE.CylinderGeometry(2, 2, 3, 32);
    const vessel = new THREE.Mesh(vesselGeom, glass);
    group.add(vessel);

    const coilGroup = new THREE.Group();
    const torusGeom = new THREE.TorusGeometry(1.2, 0.2, 16, 100);
    for (let i = -3; i <= 3; i++) {
        const torus = new THREE.Mesh(torusGeom, copper);
        torus.position.y = i * 0.4;
        torus.rotation.x = Math.PI / 2;
        coilGroup.add(torus);
    }
    coilGroup.name = "superconducting_coil";
    group.add(coilGroup);

    const coreGeom = new THREE.CylinderGeometry(0.5, 0.5, 2.8, 16);
    const core = new THREE.Mesh(coreGeom, gold);
    group.add(core);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const times = [0, 1, 2];
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('superconducting_coil.quaternion', times, values);
    const clip = new THREE.AnimationClip('magnetic_pulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
