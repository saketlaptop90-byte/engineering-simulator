import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const stainlessVacuum = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 }); // Vacuum vessel
    const tungstenTiles = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.6 }); // Divertor/First wall
    const tfCoilCasing = new THREE.MeshPhysicalMaterial({ color: 0x2233aa, metalness: 0.5, roughness: 0.4 }); // Toroidal Field Coil casing (ITER blue)
    const pfCoilSilver = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.3 }); // Poloidal Field coils
    const centralSolenoid = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.8 }); 
    
    // VFX Materials (100 Million Degree Plasma)
    const plasmaCore = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const plasmaHalo = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Pinkish/Purple Deuterium/Tritium glow

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: The Vacuum Vessel & First Wall
    // ==========================================
    const vesselGroup = new THREE.Group();
    
    // Donut shaped vacuum vessel (Torus). We'll leave it partially open so we can see inside!
    // We use a TorusGeometry but we'll slice a section out of the outer coils to see in.
    const vesselGeo = new THREE.TorusGeometry(3.0, 1.2, 32, 64);
    const vessel = new THREE.Mesh(vesselGeo, stainlessVacuum);
    vessel.rotation.x = Math.PI / 2;
    vesselGroup.add(vessel);
    
    // The inner Tungsten Divertor (where exhaust heat hits)
    const divertorGeo = new THREE.TorusGeometry(3.0, 1.1, 16, 64);
    const divertor = new THREE.Mesh(divertorGeo, tungstenTiles);
    divertor.rotation.x = Math.PI / 2;
    divertor.position.y = -0.1; // Slightly offset to form the bottom V shape visually
    // Cut the top off
    divertor.scale.set(1, 1, 0.4); 
    vesselGroup.add(divertor);

    group.add(vesselGroup);
    parts.push({ mesh: vessel, name: "Ultra-High Vacuum Vessel & Tungsten Divertor", description: "Massive stainless steel donut lined with heat-resistant tungsten armor.", function: "Provides the vacuum environment for the plasma and exhausts the immense helium 'ash' heat."});

    // ==========================================
    // 2. PROCEDURAL CAD: Magnetic Confinement Coils
    // ==========================================
    const magnetGroup = new THREE.Group();
    
    // Central Solenoid (The massive electromagnet column in the center of the donut)
    const solenoidGeo = new THREE.CylinderGeometry(0.8, 0.8, 6.0, 32);
    const solenoid = new THREE.Mesh(solenoidGeo, centralSolenoid);
    magnetGroup.add(solenoid);
    
    // Toroidal Field (TF) Coils (The big D-shaped vertical coils wrapping the vessel)
    const tfCount = 18;
    for(let i=0; i<tfCount; i++) {
        // D-Shape using a stretched torus
        const tfGeo = new THREE.TorusGeometry(3.0, 0.4, 16, 32);
        const tfCoil = new THREE.Mesh(tfGeo, tfCoilCasing);
        
        // Stretch it vertically into a D shape
        tfCoil.scale.set(1.0, 1.5, 1.0);
        
        // Rotate into place
        tfCoil.rotation.y = (i * Math.PI * 2) / tfCount;
        tfCoil.position.y = 0;
        
        // Remove 2 coils so the user can look inside the machine
        if (i !== 0 && i !== 1) { 
            magnetGroup.add(tfCoil);
        }
    }
    
    // Poloidal Field (PF) Coils (The horizontal rings wrapping the outside of the TF coils)
    const pfRadii = [4.8, 4.5, 4.0, 4.5, 4.8];
    const pfHeights = [2.5, 1.2, 0, -1.2, -2.5];
    for(let i=0; i<pfRadii.length; i++) {
        const pfGeo = new THREE.TorusGeometry(pfRadii[i], 0.2, 16, 64);
        const pfCoil = new THREE.Mesh(pfGeo, pfCoilSilver);
        pfCoil.rotation.x = Math.PI / 2;
        pfCoil.position.y = pfHeights[i];
        
        // Remove a slice for visibility (Use a trick: we'll just leave them full rings for structure, they are thin enough)
        magnetGroup.add(pfCoil);
    }

    group.add(magnetGroup);
    parts.push({ mesh: solenoid, name: "Superconducting Magnetic Coils (TF, PF, CS)", description: "D-shaped Toroidal Field coils, Poloidal rings, and a Central Solenoid.", function: "Generates an intricately shaped 'magnetic bottle' to confine and squeeze the 100-million-degree plasma without it touching the walls."});

    // ==========================================
    // 3. PROCEDURAL CAD: 100 Million Degree Plasma VFX
    // ==========================================
    const plasmaGroup = new THREE.Group();
    
    // Outer diffuse pink/magenta halo
    const haloGeo = new THREE.TorusGeometry(3.0, 0.8, 32, 64);
    const halo = new THREE.Mesh(haloGeo, plasmaHalo);
    halo.rotation.x = Math.PI / 2;
    plasmaGroup.add(halo);
    group.userData.animatedMeshes['halo'] = halo;
    
    // Inner searing white/pink core
    const coreGeo = new THREE.TorusGeometry(3.0, 0.3, 32, 64);
    const core = new THREE.Mesh(coreGeo, plasmaCore);
    core.rotation.x = Math.PI / 2;
    plasmaGroup.add(core);
    group.userData.animatedMeshes['core'] = core;

    group.add(plasmaGroup);

    // ==========================================
    // 4. Factual Fasteners (18,000 parts)
    // ==========================================
    // This is the largest bolt count yet, but well within Three.js InstancedMesh limits
    const boltCount = 18000;
    const boltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 12000) {
            // Divertor tungsten tile fasteners (Thousands of tiles lining the bottom)
            const angle = Math.random() * Math.PI * 2;
            const r = 3.0 + (Math.random() - 0.5) * 2.0;
            const y = -1.2 + Math.random() * 0.4; // Bottom of vessel
            dummy.position.set(r * Math.cos(angle), y, r * Math.sin(angle));
            dummy.rotation.set(0, angle, 0); // Point towards center
        } else {
            // TF coil casing structural bolts
            const tfIndex = Math.floor(Math.random() * tfCount);
            const tfAngle = (tfIndex * Math.PI * 2) / tfCount;
            // Place along the D-shape (roughly)
            const dAngle = Math.random() * Math.PI * 2;
            const xLocal = 3.0 + Math.cos(dAngle) * 0.4;
            const yLocal = Math.sin(dAngle) * 0.4 * 1.5; // Account for vertical stretch
            
            dummy.position.set(xLocal * Math.cos(tfAngle), yLocal, xLocal * Math.sin(tfAngle));
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "18,000 Precision Fasteners", description: "Factual quantity of instanced Inconel fasteners.", function: "Secures thousands of individual tungsten divertor tiles and structural coil casings against immense magnetic forces." });
    
    // Scale adjustment (Tokamaks are massive, ITER is 30m tall)
    group.scale.set(0.25, 0.25, 0.25);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Plasma Ignition!
            // The opacity increases as we throttle up
            group.userData.animatedMeshes['halo'].material.opacity = 0.4 + Math.random() * 0.4 * speed;
            group.userData.animatedMeshes['core'].material.opacity = 0.6 + Math.random() * 0.4 * speed;
            
            // Plasma instability simulation (it writhes and pulses within the magnetic bottle)
            const writhing = 1.0 + Math.sin(timeAcc * 40) * 0.05 * speed;
            group.userData.animatedMeshes['halo'].scale.set(writhing, writhing, writhing);
            
            // The central solenoid is basically a massive transformer primary winding.
            // In a real Tokamak, ramping the current in the CS drives the plasma current.
            // We can vibrate the whole machine slightly to simulate the terrifying immense magnetic forces.
            const forceVibe = Math.sin(timeAcc * 100) * 0.005 * speed;
            magnetGroup.position.x = forceVibe;
            
        } else {
            // Idle (Vacuum, coils chilled but no plasma)
            group.userData.animatedMeshes['halo'].material.opacity = 0;
            group.userData.animatedMeshes['core'].material.opacity = 0;
            group.userData.animatedMeshes['halo'].scale.set(1,1,1);
            magnetGroup.position.x = 0;
        }
    };

    group.userData.parts = parts;
    return group;
}
