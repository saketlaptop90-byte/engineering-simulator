import * as THREE from 'three';
export function createCarbonFullerite(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true });
    for(let x=-1; x<=1; x++) {
        for(let y=-1; y<=1; y++) {
            for(let z=-1; z<=1; z++) {
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(x*3, y*3, z*3);
                group.add(mesh);
            }
        }
    }
    return { group, update: () => { group.rotation.y += 0.005; } };
}
