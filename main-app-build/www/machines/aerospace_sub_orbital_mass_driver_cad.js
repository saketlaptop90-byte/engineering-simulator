import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const trackRailMat = new THREE.MeshPhysicalMaterial({ color: 0x99aacc, metalness: 0.9, roughness: 0.2 }); // Superconducting mag-lev rails
    const supportPillarMat = new THREE.MeshPhysicalMaterial({ color: 0x445566, metalness: 0.5, roughness: 0.8 }); // Reinforced concrete/steel pillars
    const sabotMat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 0.8, roughness: 0.4 }); // Heat-resistant payload sabot
    const capacitorMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.6 }); // Energy storage modules
    
    // VFX Materials
    const railgunArcVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Electromagnetic plasma trail
    const sonicBoomVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, wireframe: true }); // Mach cone
    const plasmaSheathVFX = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Atmospheric friction

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.sabot = null;
    group.userData.animatedMeshes.trail = null;
    group.userData.animatedMeshes.machCone = null;
    group.userData.animatedMeshes.plasma = null;
    group.userData.animatedMeshes.capacitors = [];
    group.userData.animatedMeshes.coils = []; // Induction rings

    // ==========================================
    // 1. PROCEDURAL CAD: The Mass Driver Track & Support
    // ==========================================
    const trackGroup = new THREE.Group();
    
    const trackLength = 10.0; // Scaled down representation of a multi-kilometer track
    const inclineAngle = Math.PI / 6; // 30 degree incline up the side of a mountain
    trackGroup.rotation.z = inclineAngle;
    
    // Left and Right Superconducting Rails
    const railL = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.2, 0.2), trackRailMat);
    railL.position.set(0, 0, 0.4);
    const railR = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 0.2, 0.2), trackRailMat);
    railR.position.set(0, 0, -0.4);
    trackGroup.add(railL, railR);
    
    // Electromagnetic Induction Rings (Staters)
    const numRings = 20;
    for(let i=0; i<numRings; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 16, 32), copper);
        ring.rotation.y = Math.PI/2;
        // Distribute along the track (-length/2 to +length/2)
        const xPos = (i / (numRings - 1)) * trackLength - (trackLength / 2);
        ring.position.set(xPos, 0, 0);
        trackGroup.add(ring);
        group.userData.animatedMeshes.coils.push(ring);
    }
    
    group.add(trackGroup);
    parts.push({ mesh: railL, name: "Superconducting Mag-Lev Track", description: "Multi-kilometer electromagnetic linear accelerator.", function: "Uses precisely timed magnetic pulses to accelerate heavy payloads to orbital velocities (Mach 25+) without the need for chemical rocket fuel."});

    // Support Pillars (stretching down to the ground)
    const supportGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const xPos = (i / 4) * trackLength * Math.cos(inclineAngle) - (trackLength * Math.cos(inclineAngle) / 2);
        const yPosTrack = (i / 4) * trackLength * Math.sin(inclineAngle) - (trackLength * Math.sin(inclineAngle) / 2);
        
        // Calculate height down to a baseline (e.g., y = -2.0)
        const groundY = -2.0;
        const pHeight = yPosTrack - groundY;
        
        if (pHeight > 0) {
            const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, pHeight, 0.4), supportPillarMat);
            pillar.position.set(xPos, groundY + pHeight/2, 0);
            supportGroup.add(pillar);
            
            // Add capacitor banks at the base of each pillar
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.0), capacitorMat);
            cap.position.set(xPos, groundY + 0.3, 0);
            supportGroup.add(cap);
            group.userData.animatedMeshes.capacitors.push(cap);
        }
    }
    group.add(supportGroup);
    parts.push({ mesh: supportGroup.children[0], name: "Structural Trusses & Capacitor Banks", description: "Reinforced support pylons housing massive energy storage.", function: "Provides absolute rigidity against the massive recoil forces, while the capacitors dump gigajoules of energy into the track in milliseconds."});

    // ==========================================
    // 2. PROCEDURAL CAD: Payload Sabot & Launch VFX
    // ==========================================
    const payloadGroup = new THREE.Group();
    // Align with the track
    payloadGroup.rotation.z = inclineAngle;
    
    // The Sabot (aerodynamic casing holding the payload)
    const sabotGeo = new THREE.ConeGeometry(0.25, 0.8, 16);
    sabotGeo.rotateZ(-Math.PI/2); // Point forward along X
    const sabot = new THREE.Mesh(sabotGeo, sabotMat);
    payloadGroup.add(sabot);
    group.userData.animatedMeshes.sabot = payloadGroup; // Animate the whole group
    
    // Electromagnetic Plasma Trail VFX (behind the sabot)
    const trail = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.05, 3.0).rotateZ(Math.PI/2), railgunArcVFX);
    trail.position.set(-1.5, 0, 0);
    payloadGroup.add(trail);
    group.userData.animatedMeshes.trail = trail;
    
    // Atmospheric Plasma Sheath VFX (friction on the nose)
    const plasma = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), plasmaSheathVFX);
    plasma.position.set(0.3, 0, 0); // At the nose
    plasma.scale.x = 0.5; // Flattened against the nose
    payloadGroup.add(plasma);
    group.userData.animatedMeshes.plasma = plasma;
    
    // Sonic Boom Mach Cone VFX
    const machCone = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.0, 16, 4, true).rotateZ(-Math.PI/2), sonicBoomVFX);
    machCone.position.set(-0.5, 0, 0);
    payloadGroup.add(machCone);
    group.userData.animatedMeshes.machCone = machCone;
    
    group.add(payloadGroup);
    parts.push({ mesh: sabot, name: "Aerodynamic Launch Sabot", description: "Titanium-Tungsten heat shield and armature.", function: "Protects the fragile cargo from extreme atmospheric friction and aerodynamic stress during the hypersonic ascent through the lower atmosphere."});

    // Scale adjustment
    group.scale.set(0.3, 0.3, 0.3);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    let launchProgress = -trackLength/2; // Start at bottom of track
    
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Sabot accelerates up the track
            // Simulated as a repeating launch loop for visualization
            launchProgress += 20.0 * speed * 0.016; // Extremely fast
            if (launchProgress > trackLength/2 + 5.0) {
                launchProgress = -trackLength/2; // Reset to bottom
            }
            
            // Update sabot position along the track's local X axis
            group.userData.animatedMeshes.sabot.position.x = launchProgress * Math.cos(inclineAngle);
            group.userData.animatedMeshes.sabot.position.y = launchProgress * Math.sin(inclineAngle);
            
            // 2. VFX turn on during the upper portion of the launch (high velocity)
            const isHighSpeed = launchProgress > -trackLength/4;
            
            group.userData.animatedMeshes.trail.material.opacity = isHighSpeed ? 0.8 : 0.0;
            // Flicker the trail length
            group.userData.animatedMeshes.trail.scale.x = 1.0 + (Math.random() * 0.5);
            
            group.userData.animatedMeshes.plasma.material.opacity = isHighSpeed ? 0.9 : 0.0;
            // Flare the nose plasma
            group.userData.animatedMeshes.plasma.scale.y = 1.0 + (Math.random() * 0.2);
            group.userData.animatedMeshes.plasma.scale.z = 1.0 + (Math.random() * 0.2);
            
            group.userData.animatedMeshes.machCone.material.opacity = isHighSpeed ? 0.4 : 0.0;
            
            // 3. Induction coils flash as the sabot passes through them
            group.userData.animatedMeshes.coils.forEach(coil => {
                const coilX = coil.position.x; // local track coordinates
                // If Sabot is near the coil, light it up
                if (Math.abs(launchProgress - coilX) < 1.0) {
                    coil.material.emissive = new THREE.Color(0x00ffff);
                    coil.scale.set(1.1, 1.1, 1.1);
                } else {
                    coil.material.emissive = new THREE.Color(0x000000);
                    coil.scale.set(1, 1, 1);
                }
            });
            
            // 4. Capacitor banks pulse rapidly
            group.userData.animatedMeshes.capacitors.forEach(cap => {
                // Flash white rapidly
                const flash = Math.sin(timeAcc * 50 * speed) > 0 ? 0.3 : 0.0;
                cap.material.emissive = new THREE.Color(0xffffff).multiplyScalar(flash);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.sabot.position.set((-trackLength/2)*Math.cos(inclineAngle), (-trackLength/2)*Math.sin(inclineAngle), 0);
            launchProgress = -trackLength/2;
            group.userData.animatedMeshes.trail.material.opacity = 0;
            group.userData.animatedMeshes.plasma.material.opacity = 0;
            group.userData.animatedMeshes.machCone.material.opacity = 0;
            group.userData.animatedMeshes.coils.forEach(coil => {
                coil.material.emissive = new THREE.Color(0x000000);
                coil.scale.set(1, 1, 1);
            });
            group.userData.animatedMeshes.capacitors.forEach(cap => cap.material.emissive = new THREE.Color(0x000000));
        }
    };

    group.userData.parts = parts;
    return group;
}
