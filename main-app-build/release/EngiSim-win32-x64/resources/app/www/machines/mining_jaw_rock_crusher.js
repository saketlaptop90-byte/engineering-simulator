import { materials } from '../utils/materials.js';

export function createJawRockCrusher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.BoxGeometry(12, 4, 16);
    const base = new THREE.Mesh(baseGeo, materials.darkSteel);
    base.position.y = 2;
    group.add(base);

    // Hopper
    const hopperGeo = new THREE.CylinderGeometry(8, 4, 8, 4, 1, true);
    const hopper = new THREE.Mesh(hopperGeo, materials.yellowAccent);
    hopper.rotation.y = Math.PI / 4;
    hopper.position.set(0, 8, 0);
    hopperGeo.groups.push({ start: 0, count: Infinity, materialIndex: 0 }); 
    group.add(hopper);

    // Fixed Jaw
    const fixedJawGeo = new THREE.BoxGeometry(6, 6, 1);
    fixedJawGeo.translate(0, -3, 0); // pivot at top
    const fixedJaw = new THREE.Mesh(fixedJawGeo, materials.iron);
    fixedJaw.position.set(0, 9, -1);
    fixedJaw.rotation.x = Math.PI / 12; // slants backward
    group.add(fixedJaw);

    // Moving Jaw
    const movingJawGroup = new THREE.Group();
    movingJawGroup.name = "MovingJaw";
    movingJawGroup.position.set(0, 9, 1);
    
    const movingJawGeo = new THREE.BoxGeometry(6, 6, 1);
    movingJawGeo.translate(0, -3, 0); // pivot at top
    const movingJaw = new THREE.Mesh(movingJawGeo, materials.iron);
    movingJawGroup.add(movingJaw);
    
    group.add(movingJawGroup);

    // Conveyor belt at bottom
    const beltGeo = new THREE.BoxGeometry(4, 0.5, 20);
    const belt = new THREE.Mesh(beltGeo, materials.rubber);
    belt.position.set(0, 1, 8);
    group.add(belt);

    // Chomping animation
    const times = [0, 0.25, 0.5];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 6);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 12);
    const values = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w
    ];
    
    const chompTrack = new THREE.QuaternionKeyframeTrack('MovingJaw.quaternion', times, values);
    const clip = new THREE.AnimationClip('Chomp', 0.5, [chompTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
