import * as THREE from 'three';
export function createCarbonAerogel(scene, renderer, camera) {
    const group = new THREE.Group();
    // Aerogel structure
    const geo = new THREE.DodecahedronGeometry(2, 2);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x111111, wireframe: true, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return { group, update: () => { group.rotation.x += 0.005; group.rotation.y += 0.005; } };
}
