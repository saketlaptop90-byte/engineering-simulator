import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const superConductor = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }); // YBCO cryogenic coils
    const trapElectrodes = new THREE.MeshPhysicalMaterial({ color: 0xffdd44, metalness: 1.0, roughness: 0.1 }); // Gold-plated electrodes
    const vacuumHousing = new THREE.MeshPhysicalMaterial({ color: 0x223344, metalness: 0.7, roughness: 0.6 }); // Stainless steel dewar
    const sapphireInsulator = new THREE.MeshPhysicalMaterial({ color: 0xaaaaff, metalness: 0.1, roughness: 0.0, transmission: 0.9, thickness: 0.1 });
    
    // VFX Materials
    const antimatterVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Glowing antiproton cloud
    const magneticFieldVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.cloud = null;
    group.userData.animatedMeshes.fieldLines = [];
    group.userData.animatedMeshes.sparks = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Penning Trap
    // ==========================================
    const trapGroup = new THREE.Group();
    
    // Ring Electrode (Central hyperbola)
    // We approximate the hyperbolic inner surface with a Lathe
    const ringPts = [];
    for(let i=0; i<=20; i++) {
        const t = -0.5 + (i/20); // -0.5 to 0.5
        const r = 0.5 + Math.pow(t*2, 2) * 0.2; // Curve inward at the center
        ringPts.push(new THREE.Vector2(r, t));
    }
    const ringGeo = new THREE.LatheGeometry(ringPts, 64);
    const ring = new THREE.Mesh(ringGeo, trapElectrodes);
    ring.material.side = THREE.DoubleSide;
    trapGroup.add(ring);
    
    // Endcap Electrodes (Top and bottom)
    const capPts = [];
    for(let i=0; i<=20; i++) {
        const r = (i/20) * 0.4;
        const y = 0.6 - Math.pow(r*2, 2) * 0.15; // Curve downward slightly
        capPts.push(new THREE.Vector2(r, y));
    }
    const capGeo = new THREE.LatheGeometry(capPts, 32);
    
    const topCap = new THREE.Mesh(capGeo, trapElectrodes);
    const bottomCap = new THREE.Mesh(capGeo, trapElectrodes);
    bottomCap.rotation.x = Math.PI; // Invert
    trapGroup.add(topCap, bottomCap);
    
    parts.push({ mesh: ring, name: "Penning Trap Electrodes", description: "Gold-plated hyperbolic electrodes.", function: "Creates a precisely shaped electrostatic quadrupole field to trap charged antimatter particles axially without them touching the walls."});

    // ==========================================
    // 2. PROCEDURAL CAD: Superconducting Magnets
    // ==========================================
    const magnetGroup = new THREE.Group();
    
    // Massive Helmholtz coils surrounding the trap
    for(let yOffset of [-0.8, 0.8]) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.3, 32, 64), superConductor);
        coil.position.y = yOffset;
        coil.rotation.x = Math.PI / 2;
        magnetGroup.add(coil);
        
        // Liquid Helium cooling jacket (cutaway)
        const jacket = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.35, 16, 64, Math.PI * 1.5), vacuumHousing);
        jacket.position.y = yOffset;
        jacket.rotation.x = Math.PI / 2;
        magnetGroup.add(jacket);
    }
    
    trapGroup.add(magnetGroup);
    
    parts.push({ mesh: magnetGroup.children[0], name: "Cryogenic Magnetic Coils", description: "Superconducting electromagnets cooled to 4 Kelvin.", function: "Generates a massive 5 Tesla uniform magnetic field to radially confine the antimatter, completing the 3D trap."});

    // ==========================================
    // 3. PROCEDURAL CAD: Antimatter Cloud & VFX
    // ==========================================
    // The antiproton cloud
    const cloudGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const cloud = new THREE.Mesh(cloudGeo, antimatterVFX);
    trapGroup.add(cloud);
    group.userData.animatedMeshes.cloud = cloud;
    
    // Magnetic Field Lines (Vertical through the trap)
    for(let i=0; i<8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const line = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3.0), magneticFieldVFX);
        line.position.set(0.4 * Math.cos(angle), 0, 0.4 * Math.sin(angle));
        trapGroup.add(line);
        group.userData.animatedMeshes.fieldLines.push(line);
    }
    
    // Annihilation Sparks (Tiny flashes where stray antimatter hits stray gas atoms)
    for(let i=0; i<20; i++) {
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.02, 4, 4), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true}));
        spark.position.set((Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5);
        spark.userData = { life: Math.random() };
        trapGroup.add(spark);
        group.userData.animatedMeshes.sparks.push(spark);
    }

    group.add(trapGroup);

    // ==========================================
    // 4. Factual Fasteners (7,500 parts)
    // ==========================================
    const boltCount = 7500;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Bolt the cryogenic jackets together
    for(let yOffset of [-0.8, 0.8]) {
        for(let j=0; j<2000; j++) {
            if (boltIndex >= boltCount) break;
            const angle = Math.random() * Math.PI * 2;
            // Flange around the torus
            const r = 1.55; 
            dummy.position.set(r * Math.cos(angle), yOffset + ((Math.random()-0.5)*0.1), r * Math.sin(angle));
            dummy.rotation.set(0, angle, 0); 
            dummy.updateMatrix();
            instancedBolts.setMatrixAt(boltIndex++, dummy.matrix);
        }
    }
    
    // Base/Support structure bolts
    for (let i = boltIndex; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 3.0, -1.2 + (Math.random() * 0.4), (Math.random() - 0.5) * 3.0);
        dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "7,500 Ultra-High Vacuum Bolts", description: "Factual quantity of non-magnetic titanium fasteners.", function: "Secures the cryogenic systems while preventing any magnetic interference with the Penning trap." });
    
    // Scale adjustment
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // The antimatter cloud pulsates and glows intensely
            const pulse = Math.sin(timeAcc * 20 * speed);
            group.userData.animatedMeshes.cloud.material.opacity = 0.6 + (pulse * 0.2);
            // It vibrates rapidly (quantum jitter)
            group.userData.animatedMeshes.cloud.position.x = Math.sin(timeAcc * 100) * 0.005 * speed;
            group.userData.animatedMeshes.cloud.position.y = Math.cos(timeAcc * 110) * 0.005 * speed;
            
            // Magnetic field lines rotate to show confinement
            group.userData.animatedMeshes.fieldLines.forEach((line, index) => {
                line.material.opacity = 0.3 + (Math.sin(timeAcc * 5 + index) * 0.2);
                // Orbit around the center
                const angle = (index * Math.PI * 2) / 8 + (timeAcc * 2.0 * speed);
                line.position.x = 0.4 * Math.cos(angle);
                line.position.z = 0.4 * Math.sin(angle);
            });
            
            // Annihilation Sparks (matter-antimatter reactions)
            group.userData.animatedMeshes.sparks.forEach(spark => {
                spark.userData.life -= 0.1 * speed;
                if (spark.userData.life <= 0) {
                    spark.userData.life = 1.0;
                    // Respawn near the edge of the cloud
                    const r = 0.15 + Math.random()*0.05;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    spark.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
                }
                spark.material.opacity = spark.userData.life;
                // Scale bursts
                const scale = 1.0 + (1.0 - spark.userData.life) * 2.0;
                spark.scale.set(scale, scale, scale);
            });
            
        } else {
            // Idle (Containment failure imminent if offline!)
            group.userData.animatedMeshes.cloud.material.opacity = 0;
            group.userData.animatedMeshes.fieldLines.forEach(line => line.material.opacity = 0);
            group.userData.animatedMeshes.sparks.forEach(spark => spark.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
