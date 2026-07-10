import * as THREE from 'three';
import {
    steel, concrete, glass, darkSteel, fire, copper, redAccent, blueAccent, tinted
} from '../utils/materials.js';

export function createCoalPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Boiler Building
    const boilerGeo = new THREE.BoxGeometry(20, 30, 20);
    const boilerMat = tinted(steel, 0x555555);
    const boiler = new THREE.Mesh(boilerGeo, boilerMat);
    boiler.position.set(-20, 5, 0);
    group.add(boiler);

    // Furnace / Fire
    const furnaceGeo = new THREE.BoxGeometry(18, 5, 18);
    const furnace = new THREE.Mesh(furnaceGeo, fire);
    furnace.position.set(-20, -8, 0);
    group.add(furnace);

    // Smokestack
    const stackGeo = new THREE.CylinderGeometry(2, 4, 40, 16);
    const stack = new THREE.Mesh(stackGeo, concrete);
    stack.position.set(-20, 40, -15);
    group.add(stack);

    // Smoke particles
    const smokeGroup = new THREE.Group();
    smokeGroup.position.set(-20, 60, -15);
    const smokeGeo = new THREE.SphereGeometry(2, 8, 8);
    const smokeMat = new THREE.MeshStandardMaterial({
        color: 0x333333, transparent: true, opacity: 0.6
    });

    const particles = [];
    for (let i = 0; i < 20; i++) {
        const p = new THREE.Mesh(smokeGeo, smokeMat);
        p.position.set((Math.random() - 0.5) * 4, Math.random() * 30, (Math.random() - 0.5) * 4);
        p.userData = { speed: 1 + Math.random() };
        smokeGroup.add(p);
        particles.push(p);
    }
    group.add(smokeGroup);

    // Pipes
    const pipeGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
    const pipe = new THREE.Mesh(pipeGeo, redAccent);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-5, 10, 0);
    group.add(pipe);

    // Turbine Hall
    const hallGeo = new THREE.BoxGeometry(25, 15, 15);
    const hall = new THREE.Mesh(hallGeo, steel);
    hall.position.set(15, -2.5, 0);
    group.add(hall);

    // Turbine
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(15, 0, 0);
    
    const shaftGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    shaft.rotation.z = Math.PI / 2;
    turbineGroup.add(shaft);

    const bladesGeo = new THREE.BoxGeometry(0.2, 8, 8);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladesGeo, copper);
        blade.position.x = -6 + i * 4;
        turbineGroup.add(blade);
    }
    group.add(turbineGroup);

    // Generator
    const genGeo = new THREE.CylinderGeometry(4, 4, 10, 16);
    const generator = new THREE.Mesh(genGeo, blueAccent);
    generator.rotation.z = Math.PI / 2;
    generator.position.set(32, 0, 0);
    group.add(generator);

    group.userData.update = function(delta) {
        turbineGroup.rotation.x += delta * 6;
        
        const time = Date.now() * 0.001;
        furnace.scale.y = 1 + Math.sin(time * 10) * 0.1;
        furnace.material.emissiveIntensity = 0.8 + Math.sin(time * 5) * 0.4;
        
        particles.forEach(p => {
            p.position.y += delta * p.userData.speed * 5;
            p.position.x += Math.sin(time + p.position.y) * 0.05;
            p.scale.setScalar(1 + (p.position.y / 10));
            p.material.opacity = 0.6 * (1 - (p.position.y / 30));
            if (p.position.y > 30) {
                p.position.y = 0;
                p.scale.setScalar(1);
            }
        });
    };

    return { group, animationClips };
}
