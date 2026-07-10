import * as THREE from 'three';
import {
    steel, concrete, blueAccent, redAccent, greenAccent, darkSteel, fire, tinted, copper
} from '../utils/materials.js';

export function createGeothermalPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ground layer
    const groundGeo = new THREE.BoxGeometry(40, 2, 40);
    const ground = new THREE.Mesh(groundGeo, tinted(concrete, 0x8b7355));
    ground.position.set(0, -1, 0);
    group.add(ground);

    // Underground Reservoir (Magma/Heat)
    const magmaGeo = new THREE.BoxGeometry(30, 5, 30);
    const magma = new THREE.Mesh(magmaGeo, fire);
    magma.position.set(0, -20, 0);
    group.add(magma);

    // Production Well (Hot water coming up)
    const prodWellGeo = new THREE.CylinderGeometry(1, 1, 25, 16);
    const prodWell = new THREE.Mesh(prodWellGeo, redAccent);
    prodWell.position.set(-10, -8, 0);
    group.add(prodWell);

    // Injection Well (Cold water going down)
    const injWellGeo = new THREE.CylinderGeometry(1, 1, 25, 16);
    const injWell = new THREE.Mesh(injWellGeo, blueAccent);
    injWell.position.set(10, -8, 0);
    group.add(injWell);

    // Flash Tank (Separator)
    const flashTankGeo = new THREE.CylinderGeometry(3, 3, 10, 16);
    const flashTank = new THREE.Mesh(flashTankGeo, steel);
    flashTank.position.set(-10, 8, 0);
    group.add(flashTank);

    // Pipe from well to tank
    const pipe1Geo = new THREE.CylinderGeometry(0.8, 0.8, 5, 16);
    const pipe1 = new THREE.Mesh(pipe1Geo, redAccent);
    pipe1.position.set(-10, 2.5, 0);
    group.add(pipe1);

    // Pipe from tank to Turbine (Steam)
    const steamPipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 16);
    const steamPipe = new THREE.Mesh(steamPipeGeo, tinted(whitePlastic, 0xdddddd));
    steamPipe.rotation.z = Math.PI / 2;
    steamPipe.position.set(-5, 12, 0);
    group.add(steamPipe);

    // Turbine
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(0, 12, 0);
    
    const casingGeo = new THREE.CylinderGeometry(2, 4, 8, 16);
    const casing = new THREE.Mesh(casingGeo, steel);
    casing.rotation.z = Math.PI / 2;
    turbineGroup.add(casing);

    // Shaft & Blades visible
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    shaft.rotation.z = Math.PI / 2;
    turbineGroup.add(shaft);

    const bladeGeo = new THREE.BoxGeometry(0.1, 3, 3);
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladeGeo, copper);
        blade.position.x = -2 + i * 2;
        turbineGroup.add(blade);
    }
    group.add(turbineGroup);

    // Generator
    const genGeo = new THREE.CylinderGeometry(3, 3, 6, 16);
    const generator = new THREE.Mesh(genGeo, greenAccent);
    generator.rotation.z = Math.PI / 2;
    generator.position.set(10, 12, 0);
    group.add(generator);

    // Cooling Tower
    const ctGeo = new THREE.CylinderGeometry(4, 6, 10, 16);
    const coolingTower = new THREE.Mesh(ctGeo, concrete);
    coolingTower.position.set(0, 5, -15);
    group.add(coolingTower);

    // Steam particles
    const steamGroup = new THREE.Group();
    steamGroup.position.set(0, 10, -15);
    const steamParticleGeo = new THREE.SphereGeometry(1, 8, 8);
    const steamParticleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, transparent: true, opacity: 0.5
    });

    const particles = [];
    for (let i = 0; i < 15; i++) {
        const p = new THREE.Mesh(steamParticleGeo, steamParticleMat);
        p.position.set((Math.random() - 0.5) * 4, Math.random() * 10, (Math.random() - 0.5) * 4);
        p.userData = { speed: 1 + Math.random() };
        steamGroup.add(p);
        particles.push(p);
    }
    group.add(steamGroup);

    group.userData.update = function(delta) {
        turbineGroup.rotation.x += delta * 8;
        
        const time = Date.now() * 0.001;
        magma.material.emissiveIntensity = 0.8 + Math.sin(time * 3) * 0.4;
        
        particles.forEach(p => {
            p.position.y += delta * p.userData.speed * 4;
            p.scale.setScalar(1 + (p.position.y / 10));
            p.material.opacity = 0.5 * (1 - (p.position.y / 15));
            if (p.position.y > 15) {
                p.position.y = 0;
                p.scale.setScalar(1);
            }
        });
    };

    return { group, animationClips };
}

// Ensure whitePlastic is available via a local fallback or import it properly
const whitePlastic = tinted(steel, 0xffffff); // fallback if missing
