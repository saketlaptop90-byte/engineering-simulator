import * as THREE from 'three';
export function createNitrogenLiquid(scene, renderer, camera) {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(1, 8, 8);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x8888ff, transmission: 0.8, opacity: 1, roughness: 0.1 });
    for(let i=0; i<30; i++) {
        const m1 = new THREE.Mesh(geo, mat);
        const m2 = new THREE.Mesh(geo, mat);
        m1.position.x = -0.8; m2.position.x = 0.8;
        const molecule = new THREE.Group();
        molecule.add(m1, m2);
        // closely packed
        molecule.position.set((Math.random()-0.5)*5, -2 + Math.random()*4, (Math.random()-0.5)*5);
        molecule.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        group.add(molecule);
    }
    return { group, update: () => { group.rotation.y += 0.01; } };
}
