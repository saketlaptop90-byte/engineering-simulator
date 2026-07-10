import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const opticalBreadboard = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }); // Black anodized aluminum with M6 tapped holes
    const vacuumChamberMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.4 }); // 316L Stainless steel
    const viewPortGlass = new THREE.MeshPhysicalMaterial({ color: 0x88bbff, metalness: 0.1, roughness: 0.0, transmission: 0.9, thickness: 0.5 }); // Fused silica window
    const mirrorMountMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.5 }); // Kinematic mounts
    const copperCoil = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.3 }); // MOT coils
    
    // VFX Materials
    const trappingLaserVFX = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // 780nm Rubidium trap lasers
    const BECCloudVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Ultra-cold atom cloud
    const interferometryPulseVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Raman pulses

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.trapLasers = [];
    group.userData.animatedMeshes.cloud = null;
    group.userData.animatedMeshes.ramanPulses = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Optical Table & Routing
    // ==========================================
    const tableGroup = new THREE.Group();
    
    // The main vibration-isolated optical breadboard
    const breadboard = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 4.0), opticalBreadboard);
    breadboard.position.y = -1.0;
    tableGroup.add(breadboard);
    
    // Laser diodes and kinematic mirror mounts routing the beams
    for(let i=0; i<6; i++) {
        const mountGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 6;
        const r = 1.6;
        mountGroup.position.set(r * Math.cos(angle), -0.8, r * Math.sin(angle));
        mountGroup.rotation.y = -angle; // Point towards center
        
        // Base pillar
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3), mirrorMountMat);
        mountGroup.add(pillar);
        
        // Kinematic Mirror
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.02), chrome);
        mirror.position.y = 0.15;
        // Angle it to bounce light into the chamber
        mirror.rotation.x = Math.PI/4;
        mountGroup.add(mirror);
        
        // The Trapping Laser Beam VFX
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.5).rotateX(Math.PI/2), trappingLaserVFX);
        laser.position.set(0, 0.15, -0.75);
        mountGroup.add(laser);
        group.userData.animatedMeshes.trapLasers.push(laser);
        
        tableGroup.add(mountGroup);
    }
    
    group.add(tableGroup);
    parts.push({ mesh: breadboard, name: "Active Vibration Isolation Table", description: "Pneumatically supported optical breadboard.", function: "Isolates the fragile quantum state of the atoms from seismic and acoustic vibrations down to the nanometer scale."});

    // ==========================================
    // 2. PROCEDURAL CAD: Ultra-High Vacuum Chamber (UHV)
    // ==========================================
    const chamberGroup = new THREE.Group();
    
    // The main spherical octagon chamber
    const uhvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.6, 8), vacuumChamberMat);
    chamberGroup.add(uhvBody);
    
    // 6 Fused Silica Viewports (where the lasers enter)
    for(let i=0; i<6; i++) {
        const port = new THREE.Group();
        const angle = (i * Math.PI * 2) / 6;
        port.rotation.y = angle;
        
        // Flange
        const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1).rotateZ(Math.PI/2), vacuumChamberMat);
        flange.position.x = 0.6;
        port.add(flange);
        
        // Glass window
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.11).rotateZ(Math.PI/2), viewPortGlass);
        glass.position.x = 0.6;
        port.add(glass);
        
        chamberGroup.add(port);
    }
    
    // Ion pump attached to the bottom (maintains vacuum)
    const ionPump = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8), vacuumChamberMat);
    ionPump.position.y = -0.7;
    chamberGroup.add(ionPump);
    
    group.add(chamberGroup);
    parts.push({ mesh: uhvBody, name: "UHV Science Chamber", description: "Stainless steel chamber maintained at 10^-11 Torr.", function: "Provides a perfectly empty environment so background gas molecules do not collide with and destroy the ultra-cold atom cloud."});

    // ==========================================
    // 3. PROCEDURAL CAD: Magneto-Optical Trap (MOT) Coils
    // ==========================================
    // Anti-Helmholtz configuration to create a magnetic field zero in the center
    const coilGroup = new THREE.Group();
    
    for(let yOffset of [-0.35, 0.35]) {
        // Copper winding
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 16, 64), copperCoil);
        coil.position.y = yOffset;
        coil.rotation.x = Math.PI/2;
        coilGroup.add(coil);
        
        // Water cooling blocks on the coils
        const block = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.2), aluminum);
        block.position.y = yOffset;
        block.position.x = 0.6;
        coilGroup.add(block);
    }
    
    group.add(coilGroup);
    parts.push({ mesh: coilGroup.children[0], name: "Anti-Helmholtz MOT Coils", description: "Water-cooled electromagnetic coils.", function: "Generates a steep magnetic field gradient. When combined with the 6 lasers, it creates a restoring force that traps and cools Rubidium atoms to within a micro-Kelvin of absolute zero."});

    // ==========================================
    // 4. PROCEDURAL CAD: Bose-Einstein Condensate & Interferometry
    // ==========================================
    // The actual quantum sensor
    const quantumGroup = new THREE.Group();
    
    // The ultra-cold atom cloud (BEC) suspended in the absolute center
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), BECCloudVFX);
    quantumGroup.add(cloud);
    group.userData.animatedMeshes.cloud = cloud;
    
    // Atom Interferometry Raman Lasers (Firing vertically to measure gravity)
    // We'll create a top and bottom emitter
    const ramanTop = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2), aluminum);
    ramanTop.position.y = 1.0;
    quantumGroup.add(ramanTop);
    
    for(let i=0; i<3; i++) {
        // Pulses of light that split and recombine the atom's wavefunction
        const pulse = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1), interferometryPulseVFX);
        pulse.userData = { phase: i / 3.0 };
        quantumGroup.add(pulse);
        group.userData.animatedMeshes.ramanPulses.push(pulse);
    }
    
    group.add(quantumGroup);
    parts.push({ mesh: cloud, name: "Bose-Einstein Condensate (BEC)", description: "A cloud of Rubidium atoms cooled to a billionth of a degree above absolute zero.", function: "At this temperature, the atoms lose their individual identities and merge into a single macroscopic quantum wave, acting as a hyper-sensitive pendulum to measure local gravitational anomalies."});

    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. MOT Trapping Lasers fire continuously
            group.userData.animatedMeshes.trapLasers.forEach(laser => {
                // Slight intensity flicker representing frequency stabilization locks
                laser.material.opacity = 0.6 + (Math.random() * 0.2 * speed);
            });
            
            // 2. The BEC Cloud forms and pulses
            group.userData.animatedMeshes.cloud.material.opacity = 0.8 + (Math.sin(timeAcc * 20 * speed) * 0.2);
            // It gets smaller and denser as it cools (throttle increases)
            const scale = Math.max(0.2, 1.0 - (speed * 0.8)); // Shrinks to a tiny dot
            group.userData.animatedMeshes.cloud.scale.set(scale, scale, scale);
            
            // 3. Atom Interferometry Sequence (Raman Pulses)
            // Three pulses (pi/2, pi, pi/2) are fired vertically to split, reflect, and recombine the atom wavefunction
            group.userData.animatedMeshes.ramanPulses.forEach((pulse, index) => {
                pulse.userData.phase += 0.05 * speed;
                if (pulse.userData.phase > 1.0) pulse.userData.phase = 0.0;
                
                // Fire downwards from the top emitter towards the cloud
                pulse.position.y = 1.0 - (pulse.userData.phase * 2.0); // 1.0 to -1.0
                
                // Only visible when passing through the center region
                if (pulse.position.y > -0.5 && pulse.position.y < 1.0) {
                    pulse.material.opacity = 1.0;
                } else {
                    pulse.material.opacity = 0.0;
                }
            });
            
        } else {
            // Idle (Vacuum maintained, but no atoms trapped)
            group.userData.animatedMeshes.trapLasers.forEach(laser => laser.material.opacity = 0);
            group.userData.animatedMeshes.cloud.material.opacity = 0;
            group.userData.animatedMeshes.cloud.scale.set(1,1,1);
            group.userData.animatedMeshes.ramanPulses.forEach(pulse => pulse.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
