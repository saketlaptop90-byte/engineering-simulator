import * as THREE from 'three';
export function createNitrogenNitrousOxide(scene, renderer, camera) {
    const group = new THREE.Group();
    // N2O (laughing gas)
    const nGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const nMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const oGeo = new THREE.SphereGeometry(1.4, 16, 16);
    const oMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    
    const n1 = new THREE.Mesh(nGeo, nMat); n1.position.set(-1.5, 0, 0); group.add(n1);
    const n2 = new THREE.Mesh(nGeo, nMat); n2.position.set(0, 0, 0); group.add(n2);
    const o1 = new THREE.Mesh(oGeo, oMat); o1.position.set(1.7, 0, 0); group.add(o1);
    
    return { group, update: () => { group.rotation.x += 0.01; group.rotation.y += 0.02; } };
}
