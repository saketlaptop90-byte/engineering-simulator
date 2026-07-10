import * as THREE from 'three';
import {
    steel, concrete, glass, blueAccent, redAccent, greenAccent, yellowAccent, darkSteel, whitePlastic, tinted, copper
} from '../utils/materials.js';

export function createNuclearPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Containment Building (Dome)
    const domeGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = tinted(whitePlastic, 0xd0d0d0);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(-20, 0, 0);
    group.add(dome);

    const cylinderGeo = new THREE.CylinderGeometry(15, 15, 20, 32);
    const cylinder = new THREE.Mesh(cylinderGeo, domeMat);
    cylinder.position.set(-20, -10, 0);
    group.add(cylinder);

    // Reactor Core
    const coreGeo = new THREE.CylinderGeometry(4, 4, 12, 16);
    const core = new THREE.Mesh(coreGeo, darkSteel);
    core.position.set(-20, -10, 0);
    group.add(core);

    // Glowing rods inside core
    const rodGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
    const glowMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2
    });
    const rod1 = new THREE.Mesh(rodGeo, glowMat);
    rod1.position.set(-18.5, -10, 0);
    group.add(rod1);
    
    const rod2 = new THREE.Mesh(rodGeo, glowMat);
    rod2.position.set(-21.5, -10, 0);
    group.add(rod2);

    // Steam Generator
    const sgGeo = new THREE.CylinderGeometry(3, 3, 14, 16);
    const steamGen = new THREE.Mesh(sgGeo, steel);
    steamGen.position.set(-5, -7, 0);
    group.add(steamGen);

    // Piping
    const pipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, redAccent);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(-12.5, -5, 0);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeo, blueAccent);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(-12.5, -9, 0);
    group.add(pipe2);

    // Turbine Hall
    const hallGeo = new THREE.BoxGeometry(25, 15, 15);
    const hall = new THREE.Mesh(hallGeo, steel);
    hall.position.set(15, -12.5, 0);
    group.add(hall);

    // Turbine inside Hall
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(15, -10, 0);
    
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
    generator.position.set(32, -10, 0);
    group.add(generator);

    // Cooling Tower
    const ctPoints = [];
    for (let i = 0; i <= 10; i++) {
        const y = i * 4;
        const r = 12 - Math.sin((i / 10) * Math.PI) * 4;
        ctPoints.push(new THREE.Vector2(r, y));
    }
    const ctGeo = new THREE.LatheGeometry(ctPoints, 32);
    const coolingTower = new THREE.Mesh(ctGeo, tinted(whitePlastic, 0xdddddd));
    coolingTower.position.set(0, -20, -30);
    group.add(coolingTower);

    // Steam particles
    const steamGroup = new THREE.Group();
    steamGroup.position.set(0, 20, -30);
    const steamParticleGeo = new THREE.SphereGeometry(3, 8, 8);
    const steamParticleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, transparent: true, opacity: 0.5
    });

    const particles = [];
    for (let i = 0; i < 15; i++) {
        const p = new THREE.Mesh(steamParticleGeo, steamParticleMat);
        p.position.set((Math.random() - 0.5) * 10, Math.random() * 20, (Math.random() - 0.5) * 10);
        p.userData = { offset: Math.random() * Math.PI * 2, speed: 1 + Math.random() };
        steamGroup.add(p);
        particles.push(p);
    }
    group.add(steamGroup);

    group.userData.update = function(delta) {
        turbineGroup.rotation.x += delta * 5;
        
        const time = Date.now() * 0.001;
        particles.forEach(p => {
            p.position.y += delta * p.userData.speed * 5;
            p.scale.setScalar(1 + (p.position.y / 20));
            p.material.opacity = 1 - (p.position.y / 25);
            if (p.position.y > 25) {
                p.position.y = 0;
                p.scale.setScalar(1);
            }
        });
        
        glowMat.emissiveIntensity = 1 + Math.sin(time * 2) * 0.5;
    };

    return { group, animationClips };
}
