import * as THREE from 'three';
import {
    concrete, steel, blueAccent, copper, darkSteel, tinted
} from '../utils/materials.js';

export function createHydroelectricDam(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Water material
    const waterMat = new THREE.MeshStandardMaterial({
        color: 0x0055ff, transparent: true, opacity: 0.8, metalness: 0.1, roughness: 0.1
    });

    // Dam Wall (Arch Shape)
    const damGeo = new THREE.CylinderGeometry(50, 50, 40, 32, 1, false, Math.PI * 0.25, Math.PI * 0.5);
    const damMat = tinted(concrete, 0xaaaaaa);
    const dam = new THREE.Mesh(damGeo, damMat);
    dam.position.set(0, 0, 30);
    group.add(dam);

    // Reservoir Water
    const resGeo = new THREE.BoxGeometry(60, 35, 40);
    const reservoir = new THREE.Mesh(resGeo, waterMat);
    reservoir.position.set(0, 2.5, 30);
    group.add(reservoir);

    // Tailwater
    const tailGeo = new THREE.BoxGeometry(60, 5, 40);
    const tailwater = new THREE.Mesh(tailGeo, waterMat);
    tailwater.position.set(0, -12.5, -15);
    group.add(tailwater);

    // Penstock (Pipe)
    const penstockGeo = new THREE.CylinderGeometry(2, 2, 25, 16);
    const penstock = new THREE.Mesh(penstockGeo, steel);
    penstock.rotation.x = Math.PI / 4;
    penstock.position.set(0, -5, 5);
    group.add(penstock);

    // Powerhouse
    const houseGeo = new THREE.BoxGeometry(20, 15, 15);
    const powerhouse = new THREE.Mesh(houseGeo, concrete);
    powerhouse.position.set(0, -15, -10);
    group.add(powerhouse);

    // Turbine inside powerhouse
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(0, -15, -10);
    
    // Spiral casing
    const casingGeo = new THREE.TorusGeometry(3, 1, 16, 32);
    const casing = new THREE.Mesh(casingGeo, steel);
    casing.rotation.x = Math.PI / 2;
    turbineGroup.add(casing);

    // Runner
    const runnerGeo = new THREE.CylinderGeometry(2, 2, 2, 16);
    const runner = new THREE.Mesh(runnerGeo, copper);
    turbineGroup.add(runner);

    // Generator Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    shaft.position.y = 6;
    turbineGroup.add(shaft);

    // Generator Rotor
    const genGeo = new THREE.CylinderGeometry(4, 4, 4, 16);
    const generator = new THREE.Mesh(genGeo, blueAccent);
    generator.position.y = 9;
    turbineGroup.add(generator);

    group.add(turbineGroup);

    // Water particles flowing out
    const flowGroup = new THREE.Group();
    flowGroup.position.set(0, -15, -20);
    const particleGeo = new THREE.SphereGeometry(0.5, 8, 8);
    
    const particles = [];
    for (let i = 0; i < 30; i++) {
        const p = new THREE.Mesh(particleGeo, waterMat);
        p.position.set((Math.random() - 0.5) * 6, Math.random() * 2, -Math.random() * 10);
        p.userData = { speed: 2 + Math.random() * 2, baseZ: p.position.z };
        flowGroup.add(p);
        particles.push(p);
    }
    group.add(flowGroup);

    group.userData.update = function(delta) {
        turbineGroup.rotation.y += delta * 4;
        
        particles.forEach(p => {
            p.position.z -= delta * p.userData.speed * 5;
            if (p.position.z < -20) {
                p.position.z = 0;
            }
        });
    };

    return { group, animationClips };
}
