import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const titaniumFan = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.2 }); // Wide chord titanium fan blades
    const inconelHot = new THREE.MeshPhysicalMaterial({ color: 0x332222, metalness: 0.6, roughness: 0.8 }); // High temp superalloy
    const casingAl = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.4 });
    const brightSteel = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.1 }); // Shafts
    const spinnerSpiral = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.8 }); // The painted spiral on the nose cone
    
    // VFX Materials
    const combustorGlow = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const afterburnerBlue = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Bypass Casing & Core
    // ==========================================
    const engineBody = new THREE.Group();
    
    // Engine Nacelle/Cowl (Cutaway on one side)
    const cowlGeo = new THREE.CylinderGeometry(2.2, 2.2, 6.0, 64, 1, true, 0, Math.PI * 1.5).rotateX(Math.PI/2);
    const cowl = new THREE.Mesh(cowlGeo, casingAl);
    cowl.material.side = THREE.DoubleSide;
    engineBody.add(cowl);
    
    // Inner Core Casing (Houses the compressor and turbine)
    const coreGeo = new THREE.CylinderGeometry(1.0, 0.8, 5.0, 32).rotateX(Math.PI/2);
    const core = new THREE.Mesh(coreGeo, inconelHot);
    core.position.set(0, 0, 0.5);
    engineBody.add(core);
    
    // Stator Vanes (Bypass duct structural supports)
    for(let i=0; i<12; i++) {
        const vane = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.5), casingAl);
        const angle = (i * Math.PI * 2) / 12;
        vane.position.set(1.5 * Math.cos(angle), 1.5 * Math.sin(angle), -1.0);
        vane.rotation.z = angle;
        engineBody.add(vane);
    }
    
    group.add(engineBody);
    
    parts.push({ mesh: cowl, name: "Bypass Nacelle & Outer Cowl", description: "Aerodynamic carbon composite and aluminum shroud (cutaway view).", function: "Directs bypass air around the core, providing 80% of the engine's total thrust."});

    // ==========================================
    // 2. PROCEDURAL CAD: The LP & HP Spools (Rotating mass)
    // ==========================================
    // Low Pressure (LP) Spool (Fan and LP Turbine)
    const lpSpool = new THREE.Group();
    
    // Central Shaft (LP)
    const lpShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6.5, 32).rotateX(Math.PI/2), brightSteel);
    lpSpool.add(lpShaft);
    
    // Front Fan (The huge blades you see in the front)
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32).rotateX(Math.PI/2), titaniumFan);
    fanHub.position.set(0, 0, -2.5);
    
    // Nose Cone (Spinner)
    const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 32).rotateX(Math.PI/2), spinnerSpiral);
    spinner.position.set(0, 0, -3.2);
    lpSpool.add(spinner);
    
    // 24 Wide-Chord Titanium Fan Blades
    for(let i=0; i<24; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.05), titaniumFan);
        const angle = (i * Math.PI * 2) / 24;
        blade.position.set(1.2 * Math.cos(angle), 1.2 * Math.sin(angle), -2.5);
        blade.rotation.z = angle;
        blade.rotation.x = Math.PI / 6; // Pitch angle
        
        // Twist the blade slightly (simulate aerodynamic twist)
        // Just rotating it works well enough for CAD visuals
        lpSpool.add(blade);
    }
    lpSpool.add(fanHub);
    
    // Low Pressure Turbine (LPT) at the very back
    for(let stage=0; stage<4; stage++) {
        const lptHub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32).rotateX(Math.PI/2), inconelHot);
        lptHub.position.set(0, 0, 2.0 + (stage * 0.3));
        for(let i=0; i<40; i++) {
            const lptBlade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.02), inconelHot);
            const angle = (i * Math.PI * 2) / 40;
            lptBlade.position.set(0.55 * Math.cos(angle), 0.55 * Math.sin(angle), 2.0 + (stage * 0.3));
            lptBlade.rotation.z = angle;
            lptBlade.rotation.x = Math.PI / 4;
            lpSpool.add(lptBlade);
        }
        lpSpool.add(lptHub);
    }
    
    group.add(lpSpool);
    group.userData.animatedMeshes['lpSpool'] = lpSpool;
    
    parts.push({ mesh: fanHub, name: "Low-Pressure Spool (N1)", description: "Massive titanium fan driven by the rear LP turbine.", function: "Sucks in massive amounts of air, compressing it slightly and accelerating it out the back."});

    // High Pressure (HP) Spool (Compressor and HP Turbine)
    const hpSpool = new THREE.Group();
    
    // Hollow outer shaft (spins over the LP shaft)
    const hpShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.0, 32).rotateX(Math.PI/2), brightSteel);
    hpShaft.position.set(0, 0, 0);
    hpSpool.add(hpShaft);
    
    // High Pressure Compressor (HPC) Stages
    for(let stage=0; stage<8; stage++) {
        // Radius decreases as pressure increases
        const rOuter = 0.9 - (stage * 0.04);
        const rInner = 0.35 + (stage * 0.03);
        const hpcHub = new THREE.Mesh(new THREE.CylinderGeometry(rInner, rInner, 0.1, 32).rotateX(Math.PI/2), titaniumFan);
        const zPos = -1.2 + (stage * 0.2);
        hpcHub.position.set(0, 0, zPos);
        
        for(let i=0; i<60; i++) {
            const hpcBlade = new THREE.Mesh(new THREE.BoxGeometry(0.1, rOuter - rInner, 0.02), titaniumFan);
            const angle = (i * Math.PI * 2) / 60;
            const midR = rInner + (rOuter - rInner)/2;
            hpcBlade.position.set(midR * Math.cos(angle), midR * Math.sin(angle), zPos);
            hpcBlade.rotation.z = angle;
            hpcBlade.rotation.x = Math.PI / 4;
            hpSpool.add(hpcBlade);
        }
        hpSpool.add(hpcHub);
    }
    
    // High Pressure Turbine (HPT)
    // Runs incredibly hot, extracts energy to drive the compressor
    for(let stage=0; stage<2; stage++) {
        const hptHub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32).rotateX(Math.PI/2), inconelHot);
        const zPos = 1.2 + (stage * 0.2);
        hptHub.position.set(0, 0, zPos);
        
        for(let i=0; i<50; i++) {
            const hptBlade = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.02), inconelHot);
            const angle = (i * Math.PI * 2) / 50;
            hptBlade.position.set(0.55 * Math.cos(angle), 0.55 * Math.sin(angle), zPos);
            hptBlade.rotation.z = angle;
            hptBlade.rotation.x = Math.PI / 4;
            hpSpool.add(hptBlade);
        }
        hpSpool.add(hptHub);
    }

    group.add(hpSpool);
    group.userData.animatedMeshes['hpSpool'] = hpSpool;
    
    parts.push({ mesh: hpShaft, name: "High-Pressure Spool (N2)", description: "Multi-stage axial compressor and HPT.", function: "Squeezes the core air to 40x atmospheric pressure before injecting fuel."});

    // ==========================================
    // 3. PROCEDURAL CAD: Combustor & Afterburner VFX
    // ==========================================
    // Annular Combustion Chamber
    const combustorGeo = new THREE.TorusGeometry(0.7, 0.15, 16, 64);
    const combustor = new THREE.Mesh(combustorGeo, inconelHot);
    combustor.position.set(0, 0, 0.7);
    group.add(combustor);
    
    // Fuel Injectors
    for(let i=0; i<16; i++) {
        const inj = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), chrome);
        const angle = (i * Math.PI * 2) / 16;
        inj.position.set(0.7 * Math.cos(angle), 0.7 * Math.sin(angle), 0.5);
        inj.rotation.x = Math.PI/2;
        group.add(inj);
    }
    
    // Combustor Glow (Internal flame)
    const combGlow = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 16, 64), combustorGlow);
    combGlow.position.set(0, 0, 0.7);
    group.add(combGlow);
    group.userData.animatedMeshes['combustorGlow'] = combGlow;
    
    // Exhaust Plume (Core jet exhaust)
    const exhaustGeo = new THREE.CylinderGeometry(0.5, 1.2, 5.0, 32, 1, true).rotateX(Math.PI/2);
    const exhaust = new THREE.Mesh(exhaustGeo, afterburnerBlue);
    exhaust.position.set(0, 0, 5.5);
    exhaust.material.side = THREE.DoubleSide;
    group.add(exhaust);
    group.userData.animatedMeshes['exhaust'] = exhaust;
    
    parts.push({ mesh: combustor, name: "Annular Combustor", description: "Continuous ring of 16 fuel atomizing nozzles.", function: "Burns Jet-A fuel continuously at temperatures exceeding the melting point of the metal itself (cooled by film cooling)."});

    // ==========================================
    // 4. Factual Fasteners (9,000 parts)
    // ==========================================
    const boltCount = 9000;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 4000) {
            // Fan containment case bolts (Outer cowl)
            const angle = Math.random() * Math.PI * 2;
            const r = 2.22;
            const z = (Math.random() - 0.5) * 6.0;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), z);
            // Align to normal
            dummy.rotation.set(0, 0, angle); 
        } else {
            // Core casing flanges
            const angle = Math.random() * Math.PI * 2;
            const r = 0.95;
            const z = (Math.random() - 0.5) * 4.0;
            dummy.position.set(r * Math.cos(angle), r * Math.sin(angle), z);
            dummy.rotation.set(0, 0, angle);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "9,000 Aerospace Fasteners", description: "Factual quantity of instanced titanium aircraft bolts.", function: "Secures the Kevlar containment ring which prevents catastrophic blade-out events." });
    
    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // In a real turbofan, N1 (LP spool) spins slower than N2 (HP spool)
            // N1 might be 3,000 RPM, N2 might be 15,000 RPM
            group.userData.animatedMeshes['lpSpool'].rotation.z += 0.2 * speed;
            group.userData.animatedMeshes['hpSpool'].rotation.z += 1.0 * speed; // 5x faster!
            
            // Combustor intensity
            group.userData.animatedMeshes['combustorGlow'].material.opacity = 0.5 + Math.random() * 0.5 * speed;
            
            // Exhaust Plume (At high throttle, it kicks into afterburner/max thrust)
            group.userData.animatedMeshes['exhaust'].material.opacity = speed > 0.7 ? (speed * 0.5) : (speed * 0.2);
            group.userData.animatedMeshes['exhaust'].scale.set(1.0, 1.0, 1.0 + speed * 2.0);
            
            // Entire engine vibrates under 100,000 lbs of thrust
            const vibe = Math.sin(timeAcc * 150) * 0.02 * speed;
            group.position.x = vibe;
            
        } else {
            // Idle (Windmilling on the tarmac)
            group.userData.animatedMeshes['lpSpool'].rotation.z += 0.01;
            group.userData.animatedMeshes['hpSpool'].rotation.z += 0.01;
            
            group.userData.animatedMeshes['combustorGlow'].material.opacity = 0;
            group.userData.animatedMeshes['exhaust'].material.opacity = 0;
            group.position.x = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
