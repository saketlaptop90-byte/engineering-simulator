import * as THREE from 'three';
export function createCarbonNanotube(scene, renderer, camera) {
    const group = new THREE.Group();
    const length = 10;
    const radius = 2;
    const segments = 12;
    const geo = new THREE.CylinderGeometry(radius, radius, length, segments, 10, true);
    const mat = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.z = Math.PI / 2;
    group.add(mesh);
    return {
        group,
        update: () => {
            group.rotation.x += 0.01;
            group.rotation.y += 0.005;
        }
    };
}
