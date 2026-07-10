import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const stellarCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // The captive dwarf star
    const computroniumMat = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.9, roughness: 0.1 }); // Nano-scale computing substrate
    const heatSinkMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.9 }); // Outer radiating layers
    const energyTetherMat = new THREE.MeshPhysicalMaterial({ color: 0xffffaa, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 }); // Plasma conduits
    
    // VFX Materials
    const dataStreamVFX = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Inter-shell quantum data links
    const thermalExhaustVFX = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Waste heat radiating into deep space

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.core = null;
    group.userData.animatedMeshes.shells = [];
    group.userData.animatedMeshes.dataStreams = [];
    group.userData.animatedMeshes.exhausts = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Stellar Core
    // ==========================================
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), stellarCoreMat);
    group.add(core);
    group.userData.animatedMeshes.core = core;
    parts.push({ mesh: core, name: "Captive White Dwarf", description: "Ultra-compact stellar energy source.", function: "Provides exawatts of power to drive the surrounding computational shells."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Nested Shells (Matrioshka)
    // ==========================================
    const shellGroup = new THREE.Group();
    
    // We will build 3 nested shells (inner, middle, outer)
    // Each shell is an icosahedron with cutouts so we can see inside
    for(let i=0; i<3; i++) {
        const radius = 1.2 + (i * 0.8);
        const sGroup = new THREE.Group();
        
        // The main computational substrate (a wireframe/lattice structure to represent massive surface area)
        const shellGeo = new THREE.IcosahedronGeometry(radius, 2);
        
        // Instead of a solid sphere, we'll make it out of thousands of overlapping panels
        // For CAD performance, we'll use a solid sphere with a wireframe overlay, and cut a hole in it
        
        // Create a solid sphere but clip it so we can see inside
        // To do this simply, we'll use a cylinder with large radius and small height to represent an equatorial ring of computing nodes
        const ringGeo = new THREE.CylinderGeometry(radius, radius, 0.4 + (i*0.2), 64, 1, true);
        const ring = new THREE.Mesh(ringGeo, i === 2 ? heatSinkMat : computroniumMat);
        
        // Rotate rings differently so they form a cage
        if(i===0) ring.rotation.x = Math.PI/4;
        if(i===1) ring.rotation.z = Math.PI/3;
        if(i===2) ring.rotation.x = -Math.PI/6;
        
        sGroup.add(ring);
        
        // Add vertical polar struts to complete the sphere suggestion
        const strutRing = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.1, 64, 1, true), computroniumMat);
        strutRing.rotation.x = Math.PI/2;
        sGroup.add(strutRing);
        
        shellGroup.add(sGroup);
        group.userData.animatedMeshes.shells.push(sGroup);
        
        // Energy Tethers (Connecting shells)
        if (i < 2) {
            for(let j=0; j<8; j++) {
                const angle = (j * Math.PI*2) / 8;
                const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), energyTetherMat);
                tether.position.set( (radius+0.4) * Math.cos(angle), 0, (radius+0.4) * Math.sin(angle) );
                tether.lookAt(0,0,0);
                tether.rotation.x = Math.PI/2;
                shellGroup.add(tether);
                
                // Data Stream VFX running along the tether
                const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8).rotateX(Math.PI/2), dataStreamVFX);
                stream.position.copy(tether.position);
                stream.lookAt(0,0,0);
                shellGroup.add(stream);
                group.userData.animatedMeshes.dataStreams.push(stream);
            }
        } else {
            // Outer shell (i==2) has thermal exhausts radiating outward
            for(let j=0; j<16; j++) {
                const angle = (j * Math.PI*2) / 16;
                const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 1.5).rotateX(Math.PI/2), thermalExhaustVFX);
                exhaust.position.set( (radius+0.7) * Math.cos(angle), 0, (radius+0.7) * Math.sin(angle) );
                exhaust.lookAt(0,0,0);
                shellGroup.add(exhaust);
                group.userData.animatedMeshes.exhausts.push(exhaust);
            }
        }
    }
    
    group.add(shellGroup);
    parts.push({ mesh: shellGroup.children[0].children[0], name: "Computronium Substrate", description: "Programmable matter shell.", function: "Dyson-scale layers of nanoscale computers. The inner shell runs scorching hot, passing waste heat to power the outer shells."});
    parts.push({ mesh: shellGroup.children[2].children[0], name: "Deep Space Heat Sinks", description: "Outer cryogenic layer.", function: "Radiates the final, lowest-grade waste heat away from the megastructure, operating near absolute zero to maximize thermodynamic efficiency."});

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Core pulses with intense energy
            const coreScale = 1.0 + (Math.sin(timeAcc * 20 * speed) * 0.05);
            group.userData.animatedMeshes.core.scale.setScalar(coreScale);
            
            // 2. Nested shells rotate in opposite directions
            group.userData.animatedMeshes.shells[0].rotation.y = timeAcc * 0.5 * speed;
            group.userData.animatedMeshes.shells[1].rotation.x = -timeAcc * 0.3 * speed;
            group.userData.animatedMeshes.shells[2].rotation.z = timeAcc * 0.1 * speed; // Outer shell moves slowest
            
            // 3. Quantum data streams pulse violently between layers
            group.userData.animatedMeshes.dataStreams.forEach((stream, idx) => {
                const pulse = Math.sin(timeAcc * 40 * speed + idx);
                if (pulse > 0.8) {
                    stream.material.opacity = 0.9 * speed;
                    stream.scale.setScalar(1.0 + (Math.random() * 0.5));
                } else {
                    stream.material.opacity = 0.2 * speed;
                    stream.scale.setScalar(1.0);
                }
            });
            
            // 4. Thermal exhaust radiates from the outer shell
            group.userData.animatedMeshes.exhausts.forEach((exhaust, idx) => {
                exhaust.material.opacity = 0.5 * speed + (Math.sin(timeAcc * 5 * speed + idx) * 0.2);
                // Wiggle slightly
                exhaust.scale.x = 1.0 + Math.sin(timeAcc * 15 * speed + idx) * 0.1;
                exhaust.scale.y = 1.0 + Math.cos(timeAcc * 15 * speed + idx) * 0.1;
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.core.scale.setScalar(1.0);
            group.userData.animatedMeshes.dataStreams.forEach(stream => stream.material.opacity = 0.0);
            group.userData.animatedMeshes.exhausts.forEach(exhaust => exhaust.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
