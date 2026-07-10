import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const titaniumCasing = new THREE.MeshPhysicalMaterial({ color: 0xaabbcc, metalness: 0.8, roughness: 0.4 }); // Cranial implant
    const polymerMesh = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.7 }); // Neural lace base
    const platinumElectrodes = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.1 }); // Nano-electrodes
    const siliconDie = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.2 }); // Neuromorphic chip
    
    // VFX Materials
    const neuralImpulseVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Firing neurons
    const transmitterVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Wireless data

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.impulses = [];
    group.userData.animatedMeshes.waves = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Cranial Transceiver (The "Puck")
    // ==========================================
    const transceiverGroup = new THREE.Group();
    transceiverGroup.position.set(0, 1.2, 0);
    
    // Titanium housing (sits flush with the skull)
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32), titaniumCasing);
    transceiverGroup.add(housing);
    
    // Internal Neuromorphic ASIC (Cutaway view)
    const asic = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.21, 0.6), siliconDie);
    transceiverGroup.add(asic);
    
    // Inductive charging & Data coil (Copper traces on top)
    const coilGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1 + (i*0.08), 0.01, 8, 32), copper);
        ring.rotation.x = Math.PI/2;
        ring.position.y = 0.11;
        coilGroup.add(ring);
    }
    transceiverGroup.add(coilGroup);
    
    group.add(transceiverGroup);
    
    parts.push({ mesh: housing, name: "Titanium Cranial Transceiver", description: "Implantable housing sitting flush with the skull.", function: "Houses the neuromorphic processing unit, inductive charging coil, and high-bandwidth wireless data transmitter."});
    parts.push({ mesh: asic, name: "Neuromorphic Processing ASIC", description: "Custom silicon mirroring brain architecture.", function: "Decodes the raw analog action potentials from millions of neurons into a compressed digital stream."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Neural Lace (Flexible Electrode Array)
    // ==========================================
    // A massive web of microscopic polymer threads descending into the cortex
    const laceGroup = new THREE.Group();
    laceGroup.position.set(0, 1.0, 0); // Connects to the bottom of the transceiver
    
    // Main ribbon cables leaving the transceiver
    for(let i=0; i<4; i++) {
        const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.02), polymerMesh);
        ribbon.position.set( (i%2 === 0 ? -0.3 : 0.3), -0.15, (i<2 ? -0.3 : 0.3) );
        laceGroup.add(ribbon);
    }
    
    // The branching mesh of threads (simulated as curved tubes)
    const numThreads = 120;
    for(let i=0; i<numThreads; i++) {
        // Start near the center top
        const startX = (Math.random()-0.5)*0.8;
        const startZ = (Math.random()-0.5)*0.8;
        
        // Fan out downwards into a hemisphere shape (the brain cortex)
        const endR = 1.0 + Math.random()*0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() * Math.PI / 2); // Downwards hemisphere
        
        const endX = endR * Math.sin(phi) * Math.cos(theta);
        const endY = -1.5 - (endR * Math.cos(phi)); 
        const endZ = endR * Math.sin(phi) * Math.sin(theta);
        
        // Midpoint for a nice organic bezier curve
        const midX = startX + (endX - startX)*0.5 + (Math.random()-0.5)*0.5;
        const midY = (endY)*0.5;
        const midZ = startZ + (endZ - startZ)*0.5 + (Math.random()-0.5)*0.5;
        
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(startX, 0, startZ),
            new THREE.Vector3(midX, midY, midZ),
            new THREE.Vector3(endX, endY, endZ)
        );
        
        const threadGeo = new THREE.TubeGeometry(curve, 16, 0.01, 4, false);
        const thread = new THREE.Mesh(threadGeo, polymerMesh);
        laceGroup.add(thread);
        
        // Add Platinum electrodes along the thread
        for(let j=1; j<=4; j++) {
            const t = j / 4;
            const pt = curve.getPoint(t);
            const electrode = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), platinumElectrodes);
            electrode.position.copy(pt);
            laceGroup.add(electrode);
            
            // Add a hidden VFX sphere for neural impulses firing
            const impulse = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), neuralImpulseVFX);
            impulse.position.copy(pt);
            laceGroup.add(impulse);
            group.userData.animatedMeshes.impulses.push(impulse);
        }
    }
    
    group.add(laceGroup);
    
    parts.push({ mesh: laceGroup.children[4], name: "Flexible Polymer Mesh", description: "Ultra-thin, bio-compatible polymer threads.", function: "Injected into the vascular system or cortex to physically conform to the brain's folding structure without causing scar tissue."});
    parts.push({ mesh: laceGroup.children[5], name: "Platinum Nano-Electrodes", description: "Microscopic recording and stimulating nodes.", function: "Directly reads the analog electrical action potentials of individual neurons across a vast volume of the brain."});

    // ==========================================
    // 3. PROCEDURAL CAD: Wireless Transmission VFX
    // ==========================================
    for(let i=0; i<3; i++) {
        // Expanding rings from the top of the transceiver
        const wave = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 16, 64), transmitterVFX);
        wave.rotation.x = Math.PI/2;
        wave.position.y = 1.3;
        wave.userData = { phase: i / 3.0 };
        group.add(wave);
        group.userData.animatedMeshes.waves.push(wave);
    }

    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Neural Impulses (Action Potentials firing across the network)
            group.userData.animatedMeshes.impulses.forEach((impulse, index) => {
                // Creates a cascading, chaotic firing pattern similar to actual brain activity
                const fire = Math.sin(timeAcc * 15 * speed + (index * 1.34)) * Math.cos(timeAcc * 8 * speed - index);
                if (fire > 0.8) {
                    impulse.material.opacity = 1.0;
                } else {
                    impulse.material.opacity *= 0.8; // Fast fade out
                }
            });
            
            // 2. Wireless Data Transmission (Concentric waves radiating upwards)
            group.userData.animatedMeshes.waves.forEach(wave => {
                wave.userData.phase += 0.02 * speed;
                if (wave.userData.phase > 1.0) wave.userData.phase = 0.0;
                
                // Expand outward and upward
                const scale = 1.0 + (wave.userData.phase * 2.0);
                wave.scale.set(scale, scale, scale);
                wave.position.y = 1.3 + (wave.userData.phase * 1.5);
                
                // Fade out
                wave.material.opacity = (1.0 - wave.userData.phase) * 0.8;
            });
            
        } else {
            // Idle (Device powered down / sleeping)
            group.userData.animatedMeshes.impulses.forEach(impulse => impulse.material.opacity = 0);
            group.userData.animatedMeshes.waves.forEach(wave => {
                wave.material.opacity = 0;
                wave.userData.phase = 0;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
