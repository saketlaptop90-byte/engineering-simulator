import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const shellMat = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.3 }); // Heavy beryllium-tungsten tamper
    const explosiveLensMat = new THREE.MeshPhysicalMaterial({ color: 0xaa2222, metalness: 0.2, roughness: 0.8 }); // Conventional implosion lenses
    const penningTrapMat = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.9, roughness: 0.1 }); // Superconducting containment
    const cryoLineMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.5, roughness: 0.5 }); // Liquid helium lines
    
    // VFX Materials
    const antimatterCoreVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Anti-hydrogen droplet
    const containmentFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, wireframe: true }); // Electromagnetic field
    const implosionVFX = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Trigger explosion

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.antimatter = null;
    group.userData.animatedMeshes.field = null;
    group.userData.animatedMeshes.lenses = [];
    group.userData.animatedMeshes.implosion = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Outer Shell & Lenses
    // ==========================================
    const casingGroup = new THREE.Group();
    
    // The massive outer bomb casing (cut open to see inside)
    const shellGeo = new THREE.SphereGeometry(2.0, 32, 16, 0, Math.PI * 1.5);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    // Reverse normals for hollow look
    shell.material.side = THREE.DoubleSide;
    casingGroup.add(shell);
    
    // Explosive implosion lenses (arrayed around the inner core)
    // Modeled as truncated pyramids pointing inward
    for(let i=0; i<12; i++) {
        // Distribute points roughly on a sphere
        const phi = Math.acos(1 - 2 * (i + 0.5) / 12);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Skip lenses in the cutaway section
        if (theta % (Math.PI*2) > Math.PI*1.5 && phi > Math.PI/4 && phi < Math.PI*0.75) continue;
        
        const lensGroup = new THREE.Group();
        // Position at radius 1.2
        const r = 1.2;
        lensGroup.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi));
        lensGroup.lookAt(0,0,0);
        
        // The lens block
        const lensGeo = new THREE.CylinderGeometry(0.1, 0.3, 0.4, 4);
        const lens = new THREE.Mesh(lensGeo, explosiveLensMat);
        lens.rotation.x = Math.PI/2;
        lensGroup.add(lens);
        
        // Implosion VFX (hidden inside the lens)
        const blast = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 8).rotateX(Math.PI/2), implosionVFX);
        blast.position.set(0, 0, -0.2); // Point inward
        lensGroup.add(blast);
        group.userData.animatedMeshes.implosion.push(blast);
        
        group.userData.animatedMeshes.lenses.push(lensGroup);
        casingGroup.add(lensGroup);
    }
    
    group.add(casingGroup);
    parts.push({ mesh: shell, name: "Beryllium-Tungsten Tamper Shell", description: "Massive ablative casing.", function: "Reflects initial gamma rays inward to momentarily compress the containment trap and boost the yield before vaporization."});
    parts.push({ mesh: casingGroup.children[1].children[0], name: "Implosion Lenses", description: "Conventional shaped charges.", function: "Fires synchronously to crush the containment trap, forcibly mixing the antimatter payload with the surrounding heavy metals."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Penning Trap (Core)
    // ==========================================
    const trapGroup = new THREE.Group();
    
    // Cryogenic cooling lines feeding the center
    for(let i=0; i<6; i++) {
        const angle = (i * Math.PI*2)/6;
        const line = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0).rotateX(Math.PI/2), cryoLineMat);
        line.position.set(0.5 * Math.cos(angle), 0.5 * Math.sin(angle), 0);
        line.lookAt(0,0,0);
        trapGroup.add(line);
    }
    
    // Superconducting electrodes (The Trap)
    const topElectrode = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.3), penningTrapMat);
    topElectrode.position.y = 0.2;
    const botElectrode = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.3), penningTrapMat);
    botElectrode.position.y = -0.2;
    botElectrode.rotation.x = Math.PI; // point up
    trapGroup.add(topElectrode, botElectrode);
    
    const ringElectrode = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 16, 32), penningTrapMat);
    trapGroup.add(ringElectrode);
    
    // The Antimatter Core (Anti-Hydrogen droplet)
    const antimatter = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), antimatterCoreVFX);
    trapGroup.add(antimatter);
    group.userData.animatedMeshes.antimatter = antimatter;
    
    // Electromagnetic containment field visualization
    const field = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), containmentFieldVFX);
    trapGroup.add(field);
    group.userData.animatedMeshes.field = field;
    
    group.add(trapGroup);
    parts.push({ mesh: ringElectrode, name: "Superconducting Penning Trap", description: "Ultra-high vacuum magnetic containment vessel.", function: "Suspends a macroscopic droplet of anti-hydrogen in a perfect vacuum using oscillating electromagnetic fields, preventing premature annihilation."});

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    group.rotation.x = 0.2;
    group.rotation.y = 0.4;
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    let detonating = false;
    let detonationTimer = 0;
    
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Arming sequence (Throttle > 0)
            group.userData.animatedMeshes.antimatter.material.opacity = 0.8 + Math.sin(timeAcc*40)*0.2;
            group.userData.animatedMeshes.field.material.opacity = 0.5 * speed;
            // Field spins
            group.userData.animatedMeshes.field.rotation.y += 0.1 * speed;
            group.userData.animatedMeshes.field.rotation.z += 0.05 * speed;
            
            // 2. Trigger Detonation at max throttle
            if (state.throttle > 0.9) {
                detonating = true;
            }
            
            if (detonating) {
                detonationTimer += 0.016;
                
                // Implosion lenses fire!
                if (detonationTimer < 0.2) {
                    group.userData.animatedMeshes.implosion.forEach(blast => {
                        blast.material.opacity = 1.0;
                        blast.scale.z = 2.0;
                    });
                    group.userData.animatedMeshes.field.material.opacity = 0.0; // Field collapses
                } else if (detonationTimer < 0.5) {
                    // Core begins to expand violently (annihilation event starts)
                    group.userData.animatedMeshes.implosion.forEach(blast => blast.material.opacity = 0.0);
                    group.userData.animatedMeshes.antimatter.scale.setScalar(1.0 + (detonationTimer - 0.2) * 50.0);
                    // Fade to pure white
                    group.userData.animatedMeshes.antimatter.material.color.setHex(0xffffff);
                } else {
                    // Loop the detonation for simulator purposes
                    detonating = false;
                    detonationTimer = 0;
                    group.userData.animatedMeshes.antimatter.scale.setScalar(1.0);
                    group.userData.animatedMeshes.antimatter.material.color.setHex(0xff00ff);
                    state.throttle = 0.5; // Auto-throttle down to prevent constant blinding flash
                }
            } else {
                group.userData.animatedMeshes.implosion.forEach(blast => blast.material.opacity = 0.0);
            }
            
        } else {
            // Idle (Safe)
            detonating = false;
            detonationTimer = 0;
            group.userData.animatedMeshes.antimatter.material.opacity = 0.0;
            group.userData.animatedMeshes.antimatter.scale.setScalar(1.0);
            group.userData.animatedMeshes.field.material.opacity = 0.0;
            group.userData.animatedMeshes.implosion.forEach(blast => blast.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
