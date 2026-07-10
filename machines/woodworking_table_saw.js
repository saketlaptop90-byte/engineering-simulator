import { steel, iron, wood, redAccent, blackPlastic } from '../utils/materials.js';

export function createTableSaw(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 1.8, 2);
    const base = new THREE.Mesh(baseGeo, iron);
    base.position.y = 0.9;
    group.add(base);

    // Table
    const tableGeo = new THREE.BoxGeometry(3, 0.1, 2.5);
    const table = new THREE.Mesh(tableGeo, steel);
    table.position.y = 1.85;
    group.add(table);

    // Fence
    const fenceGeo = new THREE.BoxGeometry(0.2, 0.3, 2.5);
    const fence = new THREE.Mesh(fenceGeo, blackPlastic);
    fence.position.set(0.8, 2.0, 0);
    group.add(fence);

    // Blade
    const bladeGroup = new THREE.Group();
    bladeGroup.position.set(0, 1.85, 0);
    bladeGroup.name = "bladeGroup";

    const bladeGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32);
    const blade = new THREE.Mesh(bladeGeo, steel);
    blade.rotation.z = Math.PI / 2; 
    bladeGroup.add(blade);
    group.add(bladeGroup);

    // Guard
    const guardGeo = new THREE.BoxGeometry(0.1, 0.5, 0.9);
    const guard = new THREE.Mesh(guardGeo, redAccent);
    guard.position.set(0, 2.3, 0);
    group.add(guard);

    // Animation: Blade spin
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const qTrack = new THREE.QuaternionKeyframeTrack(
        `${bladeGroup.name}.quaternion`,
        [0, 0.1, 0.2],
        [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w
        ]
    );

    const clip = new THREE.AnimationClip('TableSawAction', 0.2, [qTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
