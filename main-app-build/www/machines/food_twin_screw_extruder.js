import { materials } from '../utils/materials.js';

export function createTwinScrewExtruder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(6, 1, 2);
    const base = new THREE.Mesh(baseGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    base.position.y = 0.5;
    group.add(base);

    const barrelGeo = new THREE.CylinderGeometry(0.6, 0.6, 5, 32);
    const barrel = new THREE.Mesh(barrelGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    barrel.rotation.z = Math.PI / 2;
    barrel.position.y = 1.5;
    group.add(barrel);

    const hopperGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
    const hopper = new THREE.Mesh(hopperGeo, materials.plastic || new THREE.MeshStandardMaterial({ color: 0xffffff }));
    hopper.rotation.x = Math.PI;
    hopper.position.set(-2, 2.8, 0);
    group.add(hopper);

    const screw1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 16), materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    screw1.name = "screw1";
    screw1.rotation.z = Math.PI / 2;
    screw1.position.set(0, 1.5, 0.25);
    group.add(screw1);

    const screw2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 16), materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    screw2.name = "screw2";
    screw2.rotation.z = Math.PI / 2;
    screw2.position.set(0, 1.5, -0.25);
    group.add(screw2);

    const clip = new THREE.AnimationClip('Extrude', 2, [
        new THREE.NumberKeyframeTrack('screw1.rotation[x]', [0, 2], [0, Math.PI * 2]),
        new THREE.NumberKeyframeTrack('screw2.rotation[x]', [0, 2], [0, -Math.PI * 2])
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
