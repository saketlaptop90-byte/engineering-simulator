import * as THREE from 'three';
export function createCarbonDiamond(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.OctahedronGeometry(3, 1);
    const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 2.4,
        thickness: 2.0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return {
        group,
        update: () => {
            group.rotation.y += 0.01;
        }
    };
}
