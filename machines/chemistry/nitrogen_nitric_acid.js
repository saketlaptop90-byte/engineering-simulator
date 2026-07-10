import * as THREE from 'three';
export function createNitrogenNitricAcid(scene, renderer, camera) {
    const group = new THREE.Group();
    // HNO3
    const oGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const oMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const nGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const nMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const hGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const hMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const n = new THREE.Mesh(nGeo, nMat); group.add(n);
    const o1 = new THREE.Mesh(oGeo, oMat); o1.position.set(1.5, 1, 0); group.add(o1);
    const o2 = new THREE.Mesh(oGeo, oMat); o2.position.set(-1.5, 1, 0); group.add(o2);
    const o3 = new THREE.Mesh(oGeo, oMat); o3.position.set(0, -1.5, 0); group.add(o3);
    
    const h = new THREE.Mesh(hGeo, hMat); h.position.set(0, -2.5, 0); group.add(h);
    
    return { group, update: () => { group.rotation.y += 0.02; group.rotation.z += 0.01; } };
}
