import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const heavySteel = new THREE.MeshPhysicalMaterial({ color: 0x334444, metalness: 0.8, roughness: 0.6 }); // Weathered industrial steel
    const heatExchangerMat = new THREE.MeshPhysicalMaterial({ color: 0x554433, metalness: 0.9, roughness: 0.2 }); // Corrugated thermal plates
    const titaniumBlades = new THREE.MeshPhysicalMaterial({ color: 0xaabbcc, metalness: 0.7, roughness: 0.3 }); // Intake fans
    const ceramicLining = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.0, roughness: 0.9 }); // Reaction chamber lining
    
    // VFX Materials
    const toxicIntakeVFX = new THREE.MeshBasicMaterial({ color: 0x88bb44, transparent: true, opacity: 0.0 }); // Incoming smog/CO2
    const pureExhaustVFX = new THREE.MeshBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Clean oxygen/nitrogen mix
    const thermalGlowVFX = new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Extreme heat in the reactor

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.turbines = [];
    group.userData.animatedMeshes.centrifuges = [];
    group.userData.animatedMeshes.intakeClouds = [];
    group.userData.animatedMeshes.exhaustPlumes = [];
    group.userData.animatedMeshes.reactors = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Massive Intake Turbines
    // ==========================================
    const intakeGroup = new THREE.Group();
    
    // Create 4 massive intake cowlings
    for(let i=0; i<4; i++) {
        const cowelGroup = new THREE.Group();
        const angle = (i * Math.PI) / 2;
        cowelGroup.position.set(2.5 * Math.cos(angle), -1.0, 2.5 * Math.sin(angle));
        cowelGroup.rotation.y = -angle; // Face outward
        
        // The cowling shroud
        const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 1.5, 32, 1, true), heavySteel);
        shroud.rotation.x = Math.PI/2;
        cowelGroup.add(shroud);
        
        // Multi-stage compressor turbine
        const turbine = new THREE.Group();
        for(let j=0; j<3; j++) {
            const stage = new THREE.Group();
            stage.position.z = 0.2 - (j * 0.3); // Staged backwards
            const bladeCount = 12 + (j*4);
            const r = 0.75 + (j*0.1);
            
            for(let b=0; b<bladeCount; b++) {
                const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, r*2, 0.1), titaniumBlades);
                blade.rotation.z = (b * Math.PI * 2) / bladeCount;
                blade.rotation.y = Math.PI/6; // Pitch
                stage.add(blade);
            }
            turbine.add(stage);
        }
        cowelGroup.add(turbine);
        group.userData.animatedMeshes.turbines.push(turbine);
        
        // Intake Smog VFX
        for(let k=0; k<5; k++) {
            const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), toxicIntakeVFX);
            cloud.userData = { t: Math.random(), zBase: 2.0 };
            cowelGroup.add(cloud);
            group.userData.animatedMeshes.intakeClouds.push(cloud);
        }
        
        intakeGroup.add(cowelGroup);
    }
    
    group.add(intakeGroup);
    parts.push({ mesh: intakeGroup.children[0].children[0], name: "Atmospheric Intake Cowling", description: "Massive multi-stage compressor turbines.", function: "Draws in millions of cubic meters of toxic, unbreathable planetary atmosphere per hour."});

    // ==========================================
    // 2. PROCEDURAL CAD: Centrifugal Gas Separators
    // ==========================================
    // These separate heavy CO2 and toxic gasses from usable Nitrogen/Oxygen
    const centrifugeGroup = new THREE.Group();
    centrifugeGroup.position.set(0, -0.5, 0);
    
    // Main hexagonal central hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.0, 6), heavySteel);
    centrifugeGroup.add(hub);
    
    // 6 high-speed spinning drums attached to the hub
    for(let i=0; i<6; i++) {
        const drumGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 6;
        drumGroup.position.set(1.4 * Math.cos(angle), 0, 1.4 * Math.sin(angle));
        
        // Outer containment vessel
        const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16), steel);
        drumGroup.add(vessel);
        
        // Internal spinning mesh (we make the vessel slightly transparent to see it, or cutaway)
        const spinner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.6, 16), heatExchangerMat);
        drumGroup.add(spinner);
        
        centrifugeGroup.add(drumGroup);
        group.userData.animatedMeshes.centrifuges.push(spinner);
    }
    
    group.add(centrifugeGroup);
    parts.push({ mesh: centrifugeGroup.children[1].children[0], name: "Isotope Separation Centrifuges", description: "Ultra-high-speed magnetic bearing drums.", function: "Spins the compressed atmosphere at 100,000 RPM to separate gases by molecular weight."});

    // ==========================================
    // 3. PROCEDURAL CAD: Thermal Catalytic Reactor
    // ==========================================
    // Cracks CO2 into Carbon and Oxygen using extreme heat
    const reactorGroup = new THREE.Group();
    reactorGroup.position.set(0, 1.5, 0);
    
    // Spherical reaction chamber
    const chamberGeo = new THREE.SphereGeometry(1.2, 32, 16);
    const chamber = new THREE.Mesh(chamberGeo, ceramicLining);
    // Cut the top off
    const cutChamber = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI*2, 0, Math.PI/1.5), ceramicLining);
    reactorGroup.add(cutChamber);
    
    // Extreme Heat VFX inside
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), thermalGlowVFX);
    reactorGroup.add(glow);
    group.userData.animatedMeshes.reactors.push(glow);
    
    // Corrugated heat dissipation fins around the chamber
    const fins = new THREE.Group();
    for(let i=0; i<36; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.4), darkSteel);
        const angle = (i * Math.PI * 2) / 36;
        fin.position.set(1.2 * Math.cos(angle), 0, 1.2 * Math.sin(angle));
        fin.rotation.y = -angle;
        fins.add(fin);
    }
    reactorGroup.add(fins);
    
    group.add(reactorGroup);
    parts.push({ mesh: cutChamber, name: "Thermal Catalytic Reactor", description: "Ceramic-lined, plasma-heated cracking chamber.", function: "Heats the toxic gases to 3000°C in the presence of a catalyst to break them down into breathable oxygen and solid carbon waste."});

    // ==========================================
    // 4. PROCEDURAL CAD: Exhaust Tower & Plumes
    // ==========================================
    // The giant stack releasing the clean air
    const stackGroup = new THREE.Group();
    stackGroup.position.set(0, 3.5, 0);
    
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.0, 3.0, 16), heavySteel);
    stackGroup.add(chimney);
    
    // Exhaust Plumes (Clean Air)
    for(let i=0; i<15; i++) {
        const plume = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), pureExhaustVFX);
        plume.userData = { t: Math.random(), speed: 0.5 + Math.random()*0.5 };
        stackGroup.add(plume);
        group.userData.animatedMeshes.exhaustPlumes.push(plume);
    }
    
    group.add(stackGroup);
    parts.push({ mesh: chimney, name: "Atmospheric Exhaust Stack", description: "Massive vertical manifold.", function: "Releases millions of tons of freshly synthesized, breathable O2/N2 mix back into the planetary environment."});

    // Scale adjustment (This is a massive facility, scaled down for viewing)
    group.scale.set(0.2, 0.2, 0.2);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Intake Turbines spinning rapidly
            group.userData.animatedMeshes.turbines.forEach(turbine => {
                turbine.rotation.z += 10.0 * speed; // High speed
            });
            
            // Intake Smog getting sucked in
            group.userData.animatedMeshes.intakeClouds.forEach(cloud => {
                cloud.userData.t -= 0.02 * speed;
                if (cloud.userData.t < 0) {
                    cloud.userData.t = 1.0;
                    cloud.position.x = (Math.random()-0.5) * 1.5;
                    cloud.position.y = (Math.random()-0.5) * 1.5;
                }
                // Move towards z=0 (into the turbine)
                cloud.position.z = cloud.userData.zBase * cloud.userData.t;
                // Fade out as it enters
                cloud.material.opacity = cloud.userData.t * 0.6 * speed;
                // Swirl
                cloud.rotation.z += 0.05 * speed;
            });
            
            // Centrifuges spinning incredibly fast (blurred)
            group.userData.animatedMeshes.centrifuges.forEach((spinner, index) => {
                spinner.rotation.y += 20.0 * speed * (index % 2 === 0 ? 1 : -1); // Alternating directions
            });
            
            // Reactor glowing intensely
            const pulse = Math.sin(timeAcc * 15 * speed);
            group.userData.animatedMeshes.reactors.forEach(glow => {
                glow.material.opacity = 0.7 + (pulse * 0.3);
                // Expand/contract slightly
                const s = 1.0 + (pulse * 0.05);
                glow.scale.set(s,s,s);
            });
            
            // Exhaust Plumes rising out of the stack
            group.userData.animatedMeshes.exhaustPlumes.forEach(plume => {
                plume.userData.t += 0.01 * speed * plume.userData.speed;
                if (plume.userData.t > 1.0) plume.userData.t = 0.0;
                
                // Rise up
                plume.position.y = 1.5 + (plume.userData.t * 6.0);
                // Spread out
                const spread = plume.userData.t * 2.0;
                plume.position.x = Math.sin(timeAcc + plume.userData.t * 10) * spread;
                plume.position.z = Math.cos(timeAcc + plume.userData.t * 10) * spread;
                
                // Expand and fade
                const scale = 1.0 + (plume.userData.t * 3.0);
                plume.scale.set(scale, scale, scale);
                plume.material.opacity = (1.0 - plume.userData.t) * 0.8;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.turbines.forEach(turbine => turbine.rotation.z *= 0.95);
            group.userData.animatedMeshes.centrifuges.forEach(spinner => spinner.rotation.y *= 0.95);
            group.userData.animatedMeshes.intakeClouds.forEach(cloud => cloud.material.opacity = 0);
            group.userData.animatedMeshes.reactors.forEach(glow => glow.material.opacity *= 0.9);
            group.userData.animatedMeshes.exhaustPlumes.forEach(plume => plume.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
