import * as THREE from 'three';
export function createCarbonChaoite(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    for(let i=0; i<10; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*2, 0, (Math.random()-0.5)*2);
        mesh.rotation.z = Math.random()*0.1;
        group.add(mesh);
    }
    return { group, update: () => { group.rotation.y += 0.01; } };
}
