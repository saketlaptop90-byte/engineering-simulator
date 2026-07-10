import * as THREE from 'three';
export function createCarbonGlassy(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.IcosahedronGeometry(3, 2);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8, clearcoat: 1.0 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return { group, update: () => { group.rotation.x += 0.01; group.rotation.y += 0.01; } };
}
