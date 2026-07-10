import { brass, gold, wood, steel } from '../utils/materials.js';

export function createMetronome(THREE) {
    const group = new THREE.Group();

    // Base body
    const bodyGeo = new THREE.ConeGeometry(2, 8, 4);
    const body = new THREE.Mesh(bodyGeo, wood);
    body.position.y = 4;
    group.add(body);

    // Pendulum rod
    const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 6);
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.position.y = 3;

    // Weight
    const weightGeo = new THREE.BoxGeometry(0.8, 0.8, 0.4);
    const weight = new THREE.Mesh(weightGeo, brass);
    weight.position.y = 1;
    rod.add(weight);

    // Pivot for pendulum
    const pivot = new THREE.Group();
    pivot.position.set(0, 2, 1);
    pivot.add(rod);
    group.add(pivot);

    // Animation: Pendulum Swing
    const times = [0, 0.5, 1, 1.5, 2];
    const maxAngle = Math.PI / 4;
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), maxAngle);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -maxAngle);
    
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w
    ];

    pivot.name = "PendulumPivot";
    const namedTrack = new THREE.QuaternionKeyframeTrack('PendulumPivot.quaternion', times, values);
    const namedClip = new THREE.AnimationClip('swing', 2, [namedTrack]);

    return { group, animationClips: [namedClip] };
}
