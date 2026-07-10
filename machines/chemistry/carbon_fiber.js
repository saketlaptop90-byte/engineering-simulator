import * as THREE from 'three';
export function createCarbonFiber(scene, renderer, camera) {
    const group = new THREE.Group();
    // Carbon Fiber thread
    const geo = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*2, 0, (Math.random()-0.5)*2);
        group.add(mesh);
    }
    return { group, update: () => { group.rotation.x += 0.005; } };
}
