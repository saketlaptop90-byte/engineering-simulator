import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const neutroniumMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 }); // The hyper-dense core material
    const gravityPlatingMat = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.8, roughness: 0.4 }); // Heavy tungsten grav-plates
    const magConfinementMat = new THREE.MeshPhysicalMaterial({ color: 0x7788aa, metalness: 0.9, roughness: 0.2 }); // Superconducting containment coils
    const extractionArmMat = new THREE.MeshPhysicalMaterial({ color: 0xaa6622, metalness: 0.7, roughness: 0.6 }); // Heat-resistant alloy arms
    
    // VFX Materials
    const plasmaSheathVFX = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Accretion disk plasma
    const gravWaveVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Ripples in spacetime
    const laserCutterVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Neutronium cutting beam

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.core = null;
    group.userData.animatedMeshes.plasma = null;
    group.userData.animatedMeshes.gravWaves = [];
    group.userData.animatedMeshes.magCoils = [];
    group.userData.animatedMeshes.arms = [];
    group.userData.animatedMeshes.lasers = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Neutron Star Core & Confinement
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The captive macroscopic piece of neutron star matter
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), neutroniumMat);
    coreGroup.add(core);
    group.userData.animatedMeshes.core = core;
    
    // Swirling accretion plasma sheath around it
    const plasma = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 64), plasmaSheathVFX);
    plasma.rotation.x = Math.PI/2;
    coreGroup.add(plasma);
    group.userData.animatedMeshes.plasma = plasma;
    
    // Massive spherical magnetic confinement coils (nested rings)
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 16, 64), magConfinementMat);
        if (i===0) ring.rotation.x = Math.PI/2;
        if (i===1) ring.rotation.y = Math.PI/2;
        if (i===2) ring.rotation.z = Math.PI/2;
        coreGroup.add(ring);
        group.userData.animatedMeshes.magCoils.push(ring);
    }
    
    // Gravitational wave ripples (expanding concentric spheres)
    for(let i=0; i<3; i++) {
        const wave = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), gravWaveVFX);
        wave.material.side = THREE.DoubleSide; // To see it expanding outwards
        wave.userData = { phase: i / 3.0 };
        coreGroup.add(wave);
        group.userData.animatedMeshes.gravWaves.push(wave);
    }
    
    group.add(coreGroup);
    parts.push({ mesh: core, name: "Captive Neutronium Droplet", description: "Hyper-dense degenerate matter.", function: "Weighing billions of tons despite its tiny size, this captive star-stuff provides exotic materials and intense gravitational fields for research."});
    parts.push({ mesh: coreGroup.children[2], name: "Magnetic Confinement Sphere", description: "Nested superconducting rings.", function: "Generates quadrillions of Gauss to keep the hyper-dense core suspended and prevent it from instantly plummeting through the crust of the planet."});

    // ==========================================
    // 2. PROCEDURAL CAD: Heavy Grav-Plating Base
    // ==========================================
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -1.8, 0);
    
    // Tiered grav-plating foundation
    for(let i=0; i<3; i++) {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(2.0 - i*0.4, 2.2 - i*0.4, 0.4, 32), gravityPlatingMat);
        base.position.y = i * 0.4;
        baseGroup.add(base);
    }
    
    // Heavy support struts holding the confinement sphere
    for(let i=0; i<4; i++) {
        const angle = (i * Math.PI) / 2;
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 2.0), gravityPlatingMat);
        strut.position.set(1.5 * Math.cos(angle), 1.5, 1.5 * Math.sin(angle));
        strut.lookAt(0, 0, 0); // Point towards the core
        strut.rotation.x -= Math.PI/2; // Adjust after lookAt
        baseGroup.add(strut);
    }
    
    group.add(baseGroup);
    parts.push({ mesh: baseGroup.children[0], name: "Artificial Gravity Foundation", description: "Multi-layered tungsten mass-dampeners.", function: "Counteracts the extreme localized gravity well of the captive neutronium, preventing it from crushing the surrounding facility."});

    // ==========================================
    // 3. PROCEDURAL CAD: Extraction Arms
    // ==========================================
    const armGroup = new THREE.Group();
    
    // Four massive robotic arms designed to slice off single atoms of neutronium
    for(let i=0; i<4; i++) {
        const angle = (i * Math.PI * 2) / 4 + Math.PI/4;
        const arm = new THREE.Group();
        arm.position.set(2.0 * Math.cos(angle), 0, 2.0 * Math.sin(angle));
        arm.lookAt(0,0,0);
        
        // Base piston
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.0).rotateX(Math.PI/2), gravityPlatingMat);
        piston.position.set(0, 0, 0.5);
        arm.add(piston);
        
        // Extending rod
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0).rotateX(Math.PI/2), extractionArmMat);
        rod.position.set(0, 0, 1.0);
        arm.add(rod);
        
        // Cutter head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.3), extractionArmMat);
        head.position.set(0, 0, 1.5);
        arm.add(head);
        
        // Gamma-Ray Laser (for cutting)
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.8).rotateX(Math.PI/2), laserCutterVFX);
        laser.position.set(0, 0, 1.9); // Shoots forward from head
        arm.add(laser);
        
        group.userData.animatedMeshes.lasers.push(laser);
        group.userData.animatedMeshes.arms.push({ group: arm, rod: rod, head: head, laser: laser });
        
        armGroup.add(arm);
    }
    
    group.add(armGroup);
    parts.push({ mesh: armGroup.children[0].children[2], name: "Exotic Matter Harvester", description: "Gamma-ray laser ablation tools.", function: "Carefully slices sub-microscopic flakes of degenerate matter off the core to be used in hyper-advanced manufacturing."});

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Confinement rings always spin
        group.userData.animatedMeshes.magCoils[0].rotation.z += 0.02;
        group.userData.animatedMeshes.magCoils[1].rotation.x += 0.015;
        group.userData.animatedMeshes.magCoils[2].rotation.y += 0.01;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Neutronium core pulses slightly (though it shouldn't realistically)
            group.userData.animatedMeshes.core.scale.setScalar(1.0 + (Math.sin(timeAcc * 20 * speed) * 0.02));
            
            // 2. Accretion plasma flares up and spins rapidly
            group.userData.animatedMeshes.plasma.material.opacity = 0.8 * speed;
            group.userData.animatedMeshes.plasma.rotation.z -= 0.1 * speed;
            group.userData.animatedMeshes.plasma.scale.set(1.0 + Math.sin(timeAcc*5)*0.1, 1.0 + Math.sin(timeAcc*5)*0.1, 1.0);
            
            // 3. Gravitational Waves pulse outward
            group.userData.animatedMeshes.gravWaves.forEach(wave => {
                wave.userData.phase += 0.01 * speed;
                if (wave.userData.phase > 1.0) wave.userData.phase = 0.0;
                
                // Scale from 0.3 (core) to 3.0
                const scale = 0.3 + (wave.userData.phase * 2.7);
                wave.scale.setScalar(scale);
                
                // Fade out as they expand
                wave.material.opacity = (1.0 - wave.userData.phase) * 0.4 * speed;
            });
            
            // 4. Extraction arms actuate inwards and lasers fire
            group.userData.animatedMeshes.arms.forEach((arm, i) => {
                // Out of phase with each other
                const cycle = Math.sin(timeAcc * 2 * speed + i * Math.PI/2);
                // Positive cycle means extracting
                if (cycle > 0) {
                    arm.rod.position.z = 1.0 - (cycle * 0.2); // Push in
                    arm.head.position.z = 1.5 - (cycle * 0.2);
                    arm.laser.position.z = 1.9 - (cycle * 0.2);
                    
                    // Fire laser when fully extended
                    if (cycle > 0.8) {
                        arm.laser.material.opacity = 0.8 * speed + (Math.random()*0.2);
                        arm.laser.scale.y = 1.0 + (Math.random()*0.5);
                    } else {
                        arm.laser.material.opacity = 0.0;
                    }
                } else {
                    // Retracted
                    arm.rod.position.z = 1.0;
                    arm.head.position.z = 1.5;
                    arm.laser.material.opacity = 0.0;
                }
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.plasma.material.opacity = 0.0;
            group.userData.animatedMeshes.gravWaves.forEach(wave => wave.material.opacity = 0.0);
            group.userData.animatedMeshes.lasers.forEach(laser => laser.material.opacity = 0.0);
            group.userData.animatedMeshes.arms.forEach(arm => {
                arm.rod.position.z = 1.0;
                arm.head.position.z = 1.5;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
