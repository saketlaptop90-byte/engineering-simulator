import * as THREE from 'three';
export function createCarbonBuckyball(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.IcosahedronGeometry(3, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return {
        group,
        update: () => {
            group.rotation.x += 0.01;
            group.rotation.y += 0.01;
        }
    };
}
