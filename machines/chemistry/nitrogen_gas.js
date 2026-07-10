import * as THREE from 'three';
export function createNitrogenGas(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(1, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    for(let i=0; i<15; i++) {
        const m1 = new THREE.Mesh(geo, mat);
        const m2 = new THREE.Mesh(geo, mat);
        m1.position.x = -0.8; m2.position.x = 0.8;
        const molecule = new THREE.Group();
        molecule.add(m1, m2);
        molecule.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
        molecule.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        group.add(molecule);
    }
    return { group, update: () => { 
        group.children.forEach(m => {
            m.rotation.x += 0.02;
            m.rotation.y += 0.02;
        });
        group.rotation.y += 0.002;
    }};
}
