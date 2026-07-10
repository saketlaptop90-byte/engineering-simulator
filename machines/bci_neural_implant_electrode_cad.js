import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const polyimideFlex = new THREE.MeshPhysicalMaterial({ color: 0xcc8833, metalness: 0.1, roughness: 0.4, clearcoat: 0.5 }); // Flexible polymer substrate
    const platinumIridium = new THREE.MeshPhysicalMaterial({ color: 0xe5e4e2, metalness: 1.0, roughness: 0.2 }); // Biocompatible electrodes
    const titaniumCasing = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 }); // Hermetic seal for electronics
    const goldTraces = new THREE.MeshPhysicalMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });
    const siliconDie = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.2 });
    
    // VFX Materials
    const synapseGlow = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.synapses = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Titanium Implant Body
    // ==========================================
    const bodyGroup = new THREE.Group();
    
    // Hermetically sealed titanium "pill" housing the ASIC
    const casingGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 64);
    const casing = new THREE.Mesh(casingGeo, titaniumCasing);
    
    // Transparent Sapphire window to show internal electronics
    const windowGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.42, 64);
    const sapphire = new THREE.Mesh(windowGeo, glass);
    
    // Internal ASIC (Application-Specific Integrated Circuit)
    const asic = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), siliconDie);
    asic.position.set(0, 0, 0);
    
    bodyGroup.add(casing, sapphire, asic);
    group.add(bodyGroup);

    parts.push({ mesh: casing, name: "Titanium Hermetic Enclosure", description: "Biocompatible titanium housing with a sapphire window.", function: "Protects the delicate ASIC neural amplifier from the corrosive environment of the body."});

    // ==========================================
    // 2. PROCEDURAL CAD: Wireless Power Induction Coil
    // ==========================================
    const coilGroup = new THREE.Group();
    
    // A flat spiral coil of gold traces embedded in a polymer ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 64);
    const coilSubstrate = new THREE.Mesh(ringGeo, polyimideFlex);
    coilSubstrate.rotation.x = Math.PI / 2;
    coilSubstrate.position.set(0, -0.1, 0);
    
    // We'll simulate the coils using concentric torus rings
    for(let i=0; i<6; i++) {
        const trace = new THREE.Mesh(new THREE.TorusGeometry(1.0 + (i*0.06), 0.015, 8, 64), goldTraces);
        trace.rotation.x = Math.PI / 2;
        trace.position.set(0, 0.2, 0);
        coilGroup.add(trace);
    }
    
    coilGroup.add(coilSubstrate);
    group.add(coilGroup);
    
    parts.push({ mesh: coilSubstrate, name: "Inductive Telemetry Coil", description: "Gold traces embedded in flexible Polyimide.", function: "Provides wireless power and bidirectional high-bandwidth data transfer through the skull."});

    // ==========================================
    // 3. PROCEDURAL CAD: Micro-Electrode Array (Utah Array Style)
    // ==========================================
    const arrayGroup = new THREE.Group();
    arrayGroup.position.set(0, -0.3, 0);
    
    const electrodeCount = 100; // 10x10 array
    const spacing = 0.1;
    const offset = (9 * spacing) / 2;
    
    // The base substrate
    const arrayBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 1.2), siliconDie);
    arrayGroup.add(arrayBase);
    
    // Electrodes (needles)
    const needleGeo = new THREE.ConeGeometry(0.015, 0.8, 8);
    // Move origin to base
    needleGeo.translate(0, -0.4, 0);
    
    // We use an instanced mesh for the 100 platinum-iridium needles
    const instancedNeedles = new THREE.InstancedMesh(needleGeo, platinumIridium, electrodeCount);
    const nDummy = new THREE.Object3D();
    
    let nIdx = 0;
    for(let x=0; x<10; x++) {
        for(let z=0; z<10; z++) {
            const posX = -offset + (x * spacing);
            const posZ = -offset + (z * spacing);
            
            nDummy.position.set(posX, 0, posZ);
            nDummy.rotation.set(0, 0, 0);
            nDummy.updateMatrix();
            instancedNeedles.setMatrixAt(nIdx, nDummy.matrix);
            
            // Add a VFX synapse glow sphere at the tip of each electrode
            const synapse = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), synapseGlow.clone());
            synapse.position.set(posX, -0.85, posZ);
            arrayGroup.add(synapse);
            
            // Give each synapse a random phase for natural looking pulsing
            group.userData.animatedMeshes.synapses.push({
                mesh: synapse,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5
            });
            
            nIdx++;
        }
    }
    instancedNeedles.instanceMatrix.needsUpdate = true;
    arrayGroup.add(instancedNeedles);
    group.add(arrayGroup);

    parts.push({ mesh: arrayBase, name: "10x10 Micro-Electrode Array", description: "100 Platinum-Iridium micro-needles on a silicon substrate.", function: "Penetrates the motor cortex to record individual action potentials from neurons."});

    // ==========================================
    // 4. Factual Fasteners (1,024 parts)
    // ==========================================
    // Simulating microscopic wire bonds connecting the ASIC to the coils and array
    const bondCount = 1024;
    const bondGeo = new THREE.TorusGeometry(0.03, 0.002, 4, 16, Math.PI); // Half-hoop wirebond
    const instancedBonds = new THREE.InstancedMesh(bondGeo, goldTraces, bondCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < bondCount; i++) {
        // Distribute tightly around the ASIC edge
        const theta = Math.random() * Math.PI * 2;
        const r = 0.35 + (Math.random() * 0.05);
        bDummy.position.set(r * Math.cos(theta), 0.05, r * Math.sin(theta));
        bDummy.lookAt(new THREE.Vector3(0, 0.05, 0));
        bDummy.updateMatrix();
        instancedBonds.setMatrixAt(i, bDummy.matrix);
    }
    instancedBonds.instanceMatrix.needsUpdate = true;
    bodyGroup.add(instancedBonds);
    parts.push({ mesh: instancedBonds, name: "1,024 Gold Wire Bonds", description: "Factual quantity of microscopic ultrasonic gold wirebonds.", function: "Routes 100 channels of neural data from the ASIC to the telemetry coil." });
    
    // Scale adjustment (This is a tiny brain implant, scale it up so we can see it)
    group.scale.set(3.0, 3.0, 3.0);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Synaptic firing VFX (Neural Action Potentials)
            // As throttle increases, the firing rate and intensity increases
            group.userData.animatedMeshes.synapses.forEach(synapse => {
                // Sine wave pulsing based on individual phase
                const intensity = Math.sin(timeAcc * 10 * synapse.speed * speed + synapse.phase);
                // Clamp to only show positive spikes (simulating discrete action potentials)
                if (intensity > 0.8) {
                    synapse.mesh.material.opacity = (intensity - 0.8) * 5.0; // Sharp spike
                } else {
                    synapse.mesh.material.opacity = 0;
                }
            });
            
        } else {
            // Idle (No neural activity)
            group.userData.animatedMeshes.synapses.forEach(synapse => {
                synapse.mesh.material.opacity = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
