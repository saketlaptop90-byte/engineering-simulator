import * as materials from '../utils/materials.js';

export function createDopplerRadar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
    const matWhite = materials.whitePaint || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });

    // Base
    const baseGeom = new THREE.CylinderGeometry(2, 2.5, 4, 16);
    const base = new THREE.Mesh(baseGeom, matWhite);
    base.position.y = 2;
    group.add(base);

    // Rotating Mount
    const mount = new THREE.Group();
    mount.name = 'radar_mount';
    mount.position.y = 4;
    group.add(mount);

    const mountBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 16), matMetal);
    mountBase.position.y = 0.5;
    mount.add(mountBase);

    // Radar Dish
    const dishGeom = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeom, matWhite);
    dish.position.y = 2;
    dish.rotation.x = Math.PI / 2;
    mount.add(dish);

    const antennaGeom = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const antenna = new THREE.Mesh(antennaGeom, matMetal);
    antenna.position.set(0, 2, 1.5);
    antenna.rotation.x = Math.PI / 2;
    mount.add(antenna);

    // Animation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const track = new THREE.QuaternionKeyframeTrack('radar_mount.quaternion', [0, 2, 4], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const clip = new THREE.AnimationClip('Spin', 4, [track]);
    
    animationClips.push(clip);

    return { group, animationClips };
}
