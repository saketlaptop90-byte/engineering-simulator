import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const titaniumBlade = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.3 });
    const casingAluminum = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.7, roughness: 0.4 });
    const combustionInconel = new THREE.MeshPhysicalMaterial({ color: 0x554433, metalness: 0.8, roughness: 0.6 }); // Heat resistant superalloy
    const exhaustSteel = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.8 });
    const blueFlameMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const orangeFlameMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.rotors = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Engine Casing (Cutaway)
    // ==========================================
    const casingGroup = new THREE.Group();
    
    // We create a cutaway casing by using a cylinder and only rendering a partial sweep (e.g. 180 degrees)
    // To do this simply without complex booleans, we use LatheGeometry with a partial sweep (Math.PI)
    const casingPoints = [
        new THREE.Vector2(1.6, -2.5), new THREE.Vector2(1.6, -1.0),
        new THREE.Vector2(1.2, 0.0), new THREE.Vector2(1.0, 1.5),
        new THREE.Vector2(0.8, 2.5)
    ];
    // Create half a shell to see inside
    const casingGeo = new THREE.LatheGeometry(casingPoints, 32, -Math.PI/2, Math.PI);
    const casing = new THREE.Mesh(casingGeo, casingAluminum);
    // Rotate to face forward along Z
    casing.rotation.x = Math.PI / 2;
    casingGroup.add(casing);
    group.add(casingGroup);
    
    parts.push({ mesh: casing, name: "Turbofan Casing (Cutaway)", description: "Aerodynamic bypass duct.", function: "Channels bypass air for thrust and houses the core engine."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Massive Turbofan (N1 Spool)
    // ==========================================
    const n1Spool = new THREE.Group();
    
    // Fan Hub
    const hubGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32).rotateX(Math.PI/2);
    const hub = new THREE.Mesh(hubGeo, titaniumBlade);
    
    // Nose Cone (Spinner)
    const spinnerGeo = new THREE.CylinderGeometry(0, 0.4, 0.6, 32).rotateX(Math.PI/2);
    const spinner = new THREE.Mesh(spinnerGeo, titaniumBlade);
    spinner.position.set(0, 0, 0.6);
    n1Spool.add(hub, spinner);
    
    // 24 Titanium Fan Blades
    const fanBladeCount = 24;
    for (let i = 0; i < fanBladeCount; i++) {
        // Blade geometry with aerodynamic twist
        const bladeGeo = new THREE.BoxGeometry(1.1, 0.05, 0.3);
        const blade = new THREE.Mesh(bladeGeo, titaniumBlade);
        blade.position.set(0.95, 0, 0); // Offset from center
        // Twist the blade
        blade.rotation.x = Math.PI / 6;
        
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI * 2) / fanBladeCount;
        pivot.add(blade);
        n1Spool.add(pivot);
    }
    
    // The central drive shaft for N1
    const n1Shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5.0, 16).rotateX(Math.PI/2), steel);
    n1Shaft.position.set(0, 0, -2.0);
    n1Spool.add(n1Shaft);
    
    n1Spool.position.set(0, 0, 2.0);
    group.add(n1Spool);
    group.userData.animatedMeshes.rotors.push({ mesh: n1Spool, speedMult: 1.0 }); // N1 spins slower but moves massive air
    
    parts.push({ mesh: n1Spool, name: "N1 Turbofan & Shaft", description: "24 twisted titanium fan blades and low-pressure shaft.", function: "Provides 80% of the engine's total thrust via bypass air."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Compressor (N2 Spool)
    // ==========================================
    const n2Spool = new THREE.Group();
    
    // Compressor stages (multiple discs with hundreds of tiny blades)
    const stageCount = 7;
    for (let s = 0; s < stageCount; s++) {
        const radius = 0.8 - (s * 0.05); // tapers down
        const stageGroup = new THREE.Group();
        
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.7, radius*0.7, 0.1, 32).rotateX(Math.PI/2), steel);
        stageGroup.add(disc);
        
        const compBladeCount = 36;
        for (let b = 0; b < compBladeCount; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(radius*0.3, 0.02, 0.08), titaniumBlade);
            blade.position.set(radius * 0.85, 0, 0);
            blade.rotation.x = Math.PI / 4; // High pitch for compression
            
            const pivot = new THREE.Group();
            pivot.rotation.z = (b * Math.PI * 2) / compBladeCount;
            pivot.add(blade);
            stageGroup.add(pivot);
        }
        stageGroup.position.set(0, 0, 0.8 - (s * 0.25));
        n2Spool.add(stageGroup);
    }
    
    // N2 hollow shaft (spins around N1 shaft)
    const n2Shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.0, 16).rotateX(Math.PI/2), steel);
    n2Shaft.position.set(0, 0, -0.5);
    n2Spool.add(n2Shaft);
    
    group.add(n2Spool);
    group.userData.animatedMeshes.rotors.push({ mesh: n2Spool, speedMult: 2.5 }); // N2 spins much faster
    
    parts.push({ mesh: n2Spool, name: "N2 High-Pressure Compressor", description: "7-stage axial compressor with 252 blades.", function: "Squeezes incoming air to extreme pressures before combustion."});

    // ==========================================
    // 4. PROCEDURAL CAD: Combustion Chamber & Turbine
    // ==========================================
    // Combustion annular chamber
    const combustorGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 64);
    const combustor = new THREE.Mesh(combustorGeo, combustionInconel);
    combustor.position.set(0, 0, -1.2);
    group.add(combustor);
    
    // Flame VFX inside the combustor
    const flameGeo = new THREE.TorusGeometry(0.5, 0.15, 16, 64);
    const internalFlame = new THREE.Mesh(flameGeo, blueFlameMat);
    internalFlame.position.set(0, 0, -1.2);
    group.add(internalFlame);
    
    // High-Pressure Turbine (drives N2) attached to N2 Spool
    const hpTurbine = new THREE.Group();
    for (let b = 0; b < 40; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.1), combustionInconel);
        blade.position.set(0.65, 0, 0);
        blade.rotation.x = -Math.PI / 4; // Reverse pitch to extract energy
        const pivot = new THREE.Group();
        pivot.rotation.z = (b * Math.PI * 2) / 40;
        pivot.add(blade);
        hpTurbine.add(pivot);
    }
    hpTurbine.position.set(0, 0, -1.6);
    n2Spool.add(hpTurbine);
    
    // Low-Pressure Turbine (drives N1) attached to N1 Spool
    const lpTurbine = new THREE.Group();
    for (let b = 0; b < 48; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.1), combustionInconel);
        blade.position.set(0.7, 0, 0);
        blade.rotation.x = -Math.PI / 6;
        const pivot = new THREE.Group();
        pivot.rotation.z = (b * Math.PI * 2) / 48;
        pivot.add(blade);
        lpTurbine.add(pivot);
    }
    lpTurbine.position.set(0, 0, -2.1);
    n1Spool.add(lpTurbine); // It's part of N1 spool so it spins with N1
    
    // Exhaust Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.8, 0.6, 1.0, 32).rotateX(Math.PI/2);
    const nozzle = new THREE.Mesh(nozzleGeo, exhaustSteel);
    nozzle.position.set(0, 0, -2.8);
    group.add(nozzle);
    
    // Afterburner / Exhaust Flame VFX
    const exhaustFlame = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 4.0, 32).rotateX(Math.PI/2), orangeFlameMat);
    exhaustFlame.position.set(0, 0, -5.0);
    group.add(exhaustFlame);
    
    group.userData.animatedMeshes['internalFlame'] = blueFlameMat;
    group.userData.animatedMeshes['exhaustFlame'] = orangeFlameMat;

    parts.push({ mesh: combustor, name: "Annular Combustion Chamber", description: "Inconel superalloy burn chamber.", function: "Mixes compressed air and Jet-A fuel, igniting at 2,000°C."});
    parts.push({ mesh: lpTurbine, name: "High & Low Pressure Turbines", description: "Extreme-heat turbine blades.", function: "Extracts energy from the exhaust to drive the N1 and N2 compressors."});

    // ==========================================
    // 5. Factual Fasteners (12,500 parts)
    // ==========================================
    const boltCount = 12500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6).rotateX(Math.PI/2);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, titaniumBlade, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute in circular rings around the casing flanges
        const ringZ = (Math.random() - 0.5) * 5;
        const ringR = 1.0 + (Math.random() * 0.6);
        const theta = Math.random() * Math.PI * 2;
        dummy.position.set(ringR * Math.cos(theta), ringR * Math.sin(theta), ringZ);
        dummy.rotation.set(0, 0, theta);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "12,500 Aerospace Fasteners", description: "Factual quantity of instanced titanium bolts.", function: "Secures the engine casing segments to contain explosive pressures." });
    
    // Scale adjustment
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        
        // Simulating twin-spool turbofan rotation
        if (state.throttle > 0.0) {
            const baseRpm = state.throttle * 0.5;
            
            group.userData.animatedMeshes.rotors.forEach(spool => {
                // Spin on Z axis
                spool.mesh.rotation.z -= baseRpm * spool.speedMult;
            });
            
            // Combustion VFX (Blue core, Orange exhaust based on throttle)
            group.userData.animatedMeshes['internalFlame'].opacity = 0.5 + (state.throttle * 0.5);
            
            // Afterburner kicks in at max throttle
            if (state.throttle > 0.8) {
                group.userData.animatedMeshes['exhaustFlame'].opacity = (state.throttle - 0.8) * 4.0;
                group.userData.animatedMeshes['exhaustFlame'].color.setHSL(0.05 + (Math.random()*0.05), 1.0, 0.5); // Flickering
            } else {
                group.userData.animatedMeshes['exhaustFlame'].opacity = 0.0;
            }
        } else {
             group.userData.animatedMeshes['internalFlame'].opacity = 0.0;
             group.userData.animatedMeshes['exhaustFlame'].opacity = 0.0;
        }
    };

    group.userData.parts = parts;
    return group;
}
