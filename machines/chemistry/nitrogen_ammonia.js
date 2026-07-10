import * as THREE from 'three';
export function createNitrogenAmmonia(scene, renderer, camera) {
    const group = new THREE.Group();
    // NH3
    const nGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const nMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const nMesh = new THREE.Mesh(nGeo, nMat);
    group.add(nMesh);
    
    const hGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const hMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const h1 = new THREE.Mesh(hGeo, hMat); h1.position.set(0, -1, 1.5); group.add(h1);
    const h2 = new THREE.Mesh(hGeo, hMat); h2.position.set(1.3, -1, -0.75); group.add(h2);
    const h3 = new THREE.Mesh(hGeo, hMat); h3.position.set(-1.3, -1, -0.75); group.add(h3);
    
    return { group, update: () => { group.rotation.x += 0.01; group.rotation.y += 0.01; } };
}
