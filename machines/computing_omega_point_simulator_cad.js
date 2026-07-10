import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const hyperStructureMat = new THREE.MeshPhysicalMaterial({ color: 0xaa22ff, metalness: 0.9, roughness: 0.1, clearcoat: 1.0 }); // Glossy purple/black exotic alloy
    const temporalShieldMat = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 1.0, roughness: 0.4 }); // Absorptive shielding
    const realityEngineMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 }); // Silver/white compute cores
    
    // VFX Materials
    const omegaCoreVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }); // Blinding singularity
    const timelineBranchVFX = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, wireframe: true }); // Simulated realities
    const dataVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Pure information transfer

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.core = null;
    group.userData.animatedMeshes.engines = [];
    group.userData.animatedMeshes.timelines = [];
    group.userData.animatedMeshes.dataStreams = [];
    group.userData.animatedMeshes.shields = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Omega Core (Singularity)
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The central processing singularity (Planck-density data)
    const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 2), omegaCoreVFX);
    coreGroup.add(core);
    group.userData.animatedMeshes.core = core;
    
    // Surrounding data streams (Information falling in/out)
    for(let i=0; i<3; i++) {
        const streamGeo = new THREE.TorusGeometry(0.8 + i*0.2, 0.05, 16, 64);
        const stream = new THREE.Mesh(streamGeo, dataVFX);
        if(i===0) stream.rotation.x = Math.PI/2;
        if(i===1) stream.rotation.y = Math.PI/2;
        if(i===2) stream.rotation.z = Math.PI/2;
        coreGroup.add(stream);
        group.userData.animatedMeshes.dataStreams.push(stream);
    }
    
    group.add(coreGroup);
    parts.push({ mesh: core, name: "Omega Point Singularity", description: "Ultimate cosmological computer.", function: "Harnesses the energy of a collapsing universe to provide infinite computational power in the final moments of time."});

    // ==========================================
    // 2. PROCEDURAL CAD: Reality Rendering Engines
    // ==========================================
    const engineGroup = new THREE.Group();
    
    // Six massive pillars that "render" simulations of entire universes
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI*2) / 6;
        const engine = new THREE.Group();
        // Position them pointing inwards
        engine.position.set(2.5 * Math.cos(angle), 0, 2.5 * Math.sin(angle));
        engine.lookAt(0,0,0);
        
        // Base block
        const block = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 1.0), realityEngineMat);
        engine.add(block);
        
        // Focal lens (points at core)
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.5).rotateX(Math.PI/2), hyperStructureMat);
        lens.position.set(0, 0, -0.75);
        engine.add(lens);
        
        // Emitting timeline branches (VFX)
        const timeline = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 4).rotateX(Math.PI/2), timelineBranchVFX);
        timeline.position.set(0, 0, 1.2); // Pointing outward (away from core)
        engine.add(timeline);
        
        engineGroup.add(engine);
        group.userData.animatedMeshes.engines.push(engine);
        group.userData.animatedMeshes.timelines.push(timeline);
    }
    
    group.add(engineGroup);
    parts.push({ mesh: engineGroup.children[0].children[0], name: "Reality Rendering Engine", description: "Hyper-dimensional processor.", function: "Simulates exact physical duplicates of extinct universes down to the quantum state of every particle."});

    // ==========================================
    // 3. PROCEDURAL CAD: Temporal Shielding & Structure
    // ==========================================
    const shieldGroup = new THREE.Group();
    
    // Massive floating rings holding everything together
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.1, 16, 64), hyperStructureMat);
    ring1.rotation.x = Math.PI/2;
    ring1.position.y = 1.0;
    
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.1, 16, 64), hyperStructureMat);
    ring2.rotation.x = Math.PI/2;
    ring2.position.y = -1.0;
    
    shieldGroup.add(ring1, ring2);
    
    // Shield plates that orbit the structure to protect it from the Big Crunch
    for(let i=0; i<8; i++) {
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.5, 32, 1, false, 0, Math.PI/4), temporalShieldMat);
        plate.rotation.y = (i * Math.PI*2) / 8;
        plate.position.y = (i%2===0) ? 0.5 : -0.5;
        shieldGroup.add(plate);
        group.userData.animatedMeshes.shields.push(plate);
    }
    
    group.add(shieldGroup);
    parts.push({ mesh: shieldGroup.children[2], name: "Temporal Shielding Plates", description: "Causality barriers.", function: "Deflects the extreme gravitational and temporal shearing forces of the collapsing universe."});

    // Scale adjustment
    group.scale.set(0.35, 0.35, 0.35);
    group.rotation.x = 0.2;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        // Ambient rotation of shields
        group.userData.animatedMeshes.shields.forEach((shield, idx) => {
            shield.rotation.y += (idx % 2 === 0 ? 0.005 : -0.005);
        });
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Singularity pulses intensely
            group.userData.animatedMeshes.core.scale.setScalar(1.0 + (Math.sin(timeAcc * 50 * speed) * 0.1 * speed));
            
            // 2. Data Streams spin rapidly around the core
            group.userData.animatedMeshes.dataStreams.forEach((stream, idx) => {
                stream.material.opacity = 0.8 * speed;
                stream.rotation.x += (idx === 0 ? 0.2 * speed : 0);
                stream.rotation.y += (idx === 1 ? 0.2 * speed : 0);
                stream.rotation.z += (idx === 2 ? 0.2 * speed : 0);
            });
            
            // 3. Reality Engines vibrate and output simulated timelines
            group.userData.animatedMeshes.engines.forEach((engine, idx) => {
                // Micro-vibrations
                engine.position.y = Math.sin(timeAcc * 40 * speed + idx) * 0.02;
            });
            
            group.userData.animatedMeshes.timelines.forEach((timeline, idx) => {
                // Flashing and stretching out
                timeline.material.opacity = 0.5 * speed + (Math.sin(timeAcc * 20 * speed + idx) * 0.5);
                timeline.scale.z = 1.0 + (Math.sin(timeAcc * 10 * speed + idx) * 0.5);
                // Rotate the wireframe cone to look like branches
                timeline.rotation.y += 0.1 * speed;
            });
            
            // 4. Temporal Shields spin up defensively
            group.userData.animatedMeshes.shields.forEach((shield, idx) => {
                shield.rotation.y += (idx % 2 === 0 ? 0.05 * speed : -0.05 * speed);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.core.scale.setScalar(1.0);
            group.userData.animatedMeshes.dataStreams.forEach(stream => stream.material.opacity = 0.0);
            group.userData.animatedMeshes.timelines.forEach(timeline => timeline.material.opacity = 0.0);
            group.userData.animatedMeshes.engines.forEach(engine => engine.position.y = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
