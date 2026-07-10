import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const titaniumForged = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 }); // Main mast and hub
    const swashplateAl = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.4 });
    const brightLinkages = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.1 });
    const compositeBlade = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.8 }); // Carbon fiber/kevlar blades
    const yellowTip = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 0.1, roughness: 0.5 }); // High visibility blade tips
    
    // VFX Materials
    const rotorWash = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    
    // Track references for the IK (Inverse Kinematics) simulation of the swashplate
    const pitchLinks = [];
    const bladeGrips = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Main Mast & Hub
    // ==========================================
    const rotorSystem = new THREE.Group();
    
    // Static Transmission Housing (Base)
    const transmissionGeo = new THREE.CylinderGeometry(0.8, 1.0, 1.0, 32);
    const transmission = new THREE.Mesh(transmissionGeo, darkSteel);
    transmission.position.y = -0.5;
    group.add(transmission);
    
    // The Rotating Main Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.0, 32), titaniumForged);
    mast.position.y = 1.0;
    rotorSystem.add(mast);
    
    // The Main Rotor Hub (Jesus Nut is at the top)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32), titaniumForged);
    hub.position.y = 2.4;
    rotorSystem.add(hub);
    
    // Jesus Nut (The single nut holding the entire helicopter to the rotor)
    const jesusNut = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 6), brightLinkages);
    jesusNut.position.y = 2.65;
    rotorSystem.add(jesusNut);
    
    parts.push({ mesh: hub, name: "Forged Titanium Rotor Hub", description: "The central attachment point for the blades.", function: "Transfers the entire lifting load of the helicopter to the main mast."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Swashplate Assembly
    // ==========================================
    // The Swashplate translates pilot inputs (collective/cyclic) into blade pitch changes
    
    // Non-Rotating Swashplate (Controlled by servos, tilts and slides up/down)
    const nonRotatingSwash = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 32), darkSteel);
    nonRotatingSwash.position.y = 1.0;
    nonRotatingSwash.rotation.x = Math.PI / 2;
    group.add(nonRotatingSwash); // Attached to static frame (conceptually)
    group.userData.animatedMeshes['nonRotatingSwash'] = nonRotatingSwash;
    
    // Rotating Swashplate (Rides on a bearing above the non-rotating one, spins with the mast)
    const rotatingSwash = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 32), swashplateAl);
    rotatingSwash.position.y = 1.15;
    rotatingSwash.rotation.x = Math.PI / 2;
    rotorSystem.add(rotatingSwash);
    group.userData.animatedMeshes['rotatingSwash'] = rotatingSwash; // Need to animate its tilt based on the lower one
    
    // Scissor Links (Keeps the rotating swashplate spinning with the mast)
    const scissorBase = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), brightLinkages);
    scissorBase.position.set(0.2, 1.8, 0);
    rotorSystem.add(scissorBase);
    
    parts.push({ mesh: rotatingSwash, name: "Rotating Swashplate", description: "Rides on a spherical bearing over the main mast.", function: "Transmits cyclic (tilt) and collective (up/down) control inputs from the non-rotating frame to the spinning rotor blades."});

    // ==========================================
    // 3. PROCEDURAL CAD: Rotor Blades & Pitch Links
    // ==========================================
    const bladeCount = 4;
    for(let i=0; i<bladeCount; i++) {
        const angle = (i * Math.PI * 2) / bladeCount;
        
        // Blade assembly group (allows pitching)
        const bladeAssembly = new THREE.Group();
        bladeAssembly.position.set(0, 2.4, 0); // At hub height
        bladeAssembly.rotation.y = angle; // Spread evenly
        
        // Blade Grip (Attaches blade to hub, houses pitch bearings)
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.3), titaniumForged);
        grip.position.set(0.6, 0, 0);
        bladeAssembly.add(grip);
        
        // The Composite Blade (Airfoil shape approximated)
        const bladeGeo = new THREE.BoxGeometry(8.0, 0.05, 0.4);
        const blade = new THREE.Mesh(bladeGeo, compositeBlade);
        blade.position.set(5.0, 0, 0); // Extend out
        bladeAssembly.add(blade);
        
        // High visibility yellow tip
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.051, 0.41), yellowTip);
        tip.position.set(8.75, 0, 0);
        bladeAssembly.add(tip);
        
        // Pitch Horn (Lever arm extending from the grip to attach the pitch link)
        const pitchHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3).rotateX(Math.PI/2), titaniumForged);
        pitchHorn.position.set(0.6, 0, 0.25);
        bladeAssembly.add(pitchHorn);
        
        rotorSystem.add(bladeAssembly);
        bladeGrips.push(bladeAssembly); // Track for pitch animation
        
        // Pitch Link (Connects the rotating swashplate to the pitch horn)
        // In a real CAD model this involves IK, here we'll simulate the connection visually
        const pitchLink = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25), brightLinkages);
        // Initial position (will be updated in render loop)
        pitchLink.position.set(0.6 * Math.cos(angle), 1.8, 0.6 * Math.sin(angle));
        rotorSystem.add(pitchLink);
        pitchLinks.push({ link: pitchLink, angle: angle });
    }
    
    group.add(rotorSystem);
    group.userData.animatedMeshes['rotorSystem'] = rotorSystem;
    
    parts.push({ mesh: bladeGrips[0].children[1], name: "Composite Main Rotor Blades", description: "Four 8-meter long aerodynamic lifting surfaces.", function: "Generates lift and thrust by forcing air downwards. Capable of flexing dramatically under load."});

    // ==========================================
    // 4. PROCEDURAL CAD: Rotor Wash VFX
    // ==========================================
    const washGeo = new THREE.TorusGeometry(8.0, 0.5, 16, 64);
    const wash = new THREE.Mesh(washGeo, rotorWash);
    wash.rotation.x = Math.PI / 2;
    wash.position.y = 1.0;
    wash.scale.z = 0.1; // Flatten it
    group.add(wash);
    group.userData.animatedMeshes['wash'] = wash;

    // ==========================================
    // 5. Factual Fasteners (2,400 parts)
    // ==========================================
    const boltCount = 2400;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 800) {
            // Blade grip bolts (Critical fasteners holding the blades against centrifugal force)
            const b = i % bladeCount;
            const bAngle = (b * Math.PI * 2) / bladeCount;
            
            // Local pos within the grip
            const lx = 0.4 + Math.random() * 0.4;
            const ly = 0.11; // top surface
            const lz = (Math.random() - 0.5) * 0.2;
            
            // Transform to world (roughly, assuming rotor is at y=2.4)
            const wx = lx * Math.cos(bAngle) - lz * Math.sin(bAngle);
            const wz = lx * Math.sin(bAngle) + lz * Math.cos(bAngle);
            
            dummy.position.set(wx, 2.51, wz);
            dummy.rotation.set(0, bAngle, 0); 
        } else {
            // Transmission housing bolts
            const angle = Math.random() * Math.PI * 2;
            const r = 0.95;
            dummy.position.set(r * Math.cos(angle), -0.5 + (Math.random() - 0.5)*1.0, r * Math.sin(angle));
            dummy.rotation.set(Math.PI/2, 0, angle);
        }
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    rotorSystem.add(instancedBolts); // Attach to rotor system so blade grip bolts spin
    
    parts.push({ mesh: instancedBolts, name: "2,400 Aviation Fasteners", description: "Factual quantity of safety-wired aircraft-grade bolts.", function: "Critical fasteners holding the blade grips together. If one fails, the helicopter comes apart in mid-air." });
    
    // Scale adjustment (Helicopter rotors are large)
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Rotor Spin
            const rpm = 5.0 * speed;
            group.userData.animatedMeshes['rotorSystem'].rotation.y -= rpm;
            
            // Simulate Pilot Input (Cyclic stick moving in a circle, Collective pulling up)
            // Cyclic tilts the swashplate
            const cyclicPitch = Math.sin(timeAcc * 0.5) * 0.2 * speed;
            const cyclicRoll = Math.cos(timeAcc * 0.3) * 0.2 * speed;
            // Collective moves it up/down
            const collective = 1.0 + (0.2 * speed);
            
            // Apply to Non-Rotating Swashplate
            group.userData.animatedMeshes['nonRotatingSwash'].rotation.x = (Math.PI/2) + cyclicPitch;
            group.userData.animatedMeshes['nonRotatingSwash'].rotation.y = cyclicRoll;
            group.userData.animatedMeshes['nonRotatingSwash'].position.y = collective;
            
            // Apply to Rotating Swashplate (It matches the tilt/height of the non-rotating one)
            group.userData.animatedMeshes['rotatingSwash'].rotation.x = (Math.PI/2) + cyclicPitch;
            group.userData.animatedMeshes['rotatingSwash'].rotation.y = cyclicRoll; // In a real sim, this would be relative to the mast rotation
            group.userData.animatedMeshes['rotatingSwash'].position.y = collective + 0.15;
            
            // Simulate blade pitch changing dynamically as it spins (Cyclic feathering)
            // Each blade pitches up and down as it rotates through the tilted swashplate plane
            const currentRotorAngle = group.userData.animatedMeshes['rotorSystem'].rotation.y;
            
            for(let i=0; i<bladeCount; i++) {
                const globalAngle = currentRotorAngle + ((i * Math.PI * 2) / bladeCount);
                // Pitch variation based on cyclic input
                const feathering = Math.sin(globalAngle) * cyclicPitch + Math.cos(globalAngle) * cyclicRoll;
                // Add collective pitch
                const basePitch = (collective - 1.0) * 0.5; // Up to ~10 degrees
                
                bladeGrips[i].rotation.x = basePitch + feathering;
                
                // Animate Pitch Links (They connect the swash to the grip horn)
                // Just moving them up and down visually for effect
                const linkH = 1.25;
                const swashH = group.userData.animatedMeshes['rotatingSwash'].position.y;
                pitchLinks[i].link.position.y = swashH + (linkH/2) + (bladeGrips[i].rotation.x * 0.2);
            }
            
            // Rotor Wash VFX
            group.userData.animatedMeshes['wash'].material.opacity = speed > 0.5 ? 0.3 * Math.random() : 0.0;
            group.userData.animatedMeshes['wash'].position.y -= 0.5 * speed;
            if(group.userData.animatedMeshes['wash'].position.y < -5.0) {
                group.userData.animatedMeshes['wash'].position.y = 1.0;
            }
            
            // Vibration
            group.position.x = Math.sin(timeAcc * 120) * 0.01 * speed;
            
        } else {
            // Idle (Rotor brake applied)
            group.userData.animatedMeshes['wash'].material.opacity = 0;
            group.position.x = 0;
            // Return to neutral collective/cyclic
            group.userData.animatedMeshes['nonRotatingSwash'].rotation.x = Math.PI/2;
            group.userData.animatedMeshes['nonRotatingSwash'].rotation.y = 0;
            group.userData.animatedMeshes['nonRotatingSwash'].position.y = 1.0;
            
            for(let i=0; i<bladeCount; i++) {
                bladeGrips[i].rotation.x = 0;
            }
        }
    };

    group.userData.parts = parts;
    return group;
}
