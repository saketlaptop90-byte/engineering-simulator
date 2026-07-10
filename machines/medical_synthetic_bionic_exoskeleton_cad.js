import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const carbonFiber = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.8, clearcoat: 0.5 }); // Lightweight chassis
    const titaniumJoints = new THREE.MeshPhysicalMaterial({ color: 0xaabbcc, metalness: 0.8, roughness: 0.3 }); // Articulation points
    const hydraulicFluid = new THREE.MeshPhysicalMaterial({ color: 0xff0000, metalness: 0.1, roughness: 0.1, transmission: 0.8, thickness: 0.1 }); // Synthetic blood/fluid
    const syntheticMuscle = new THREE.MeshPhysicalMaterial({ color: 0x882222, metalness: 0.0, roughness: 0.9 }); // Electroactive polymers
    const neuralGlass = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.2, roughness: 0.1, transmission: 0.9 }); // Helmet visor
    
    // VFX Materials
    const neuralSyncVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Brain-machine sync
    const powerSurgeVFX = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Actuator power

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.muscles = [];
    group.userData.animatedMeshes.syncLeds = [];
    group.userData.animatedMeshes.powerLines = [];

    // ==========================================
    // 1. PROCEDURAL CAD: Carbon Fiber Exoskeleton Frame
    // ==========================================
    const frameGroup = new THREE.Group();
    
    // Spine (Articulated vertebrae)
    for(let i=0; i<8; i++) {
        const vertebra = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.2), titaniumJoints);
        vertebra.position.set(0, 1.2 - (i*0.2), -0.2);
        frameGroup.add(vertebra);
    }
    
    // Ribcage / Torso harness
    const ribcage = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16, 1, false, 0, Math.PI), carbonFiber);
    ribcage.position.set(0, 0.8, -0.2);
    ribcage.rotation.z = Math.PI/2;
    frameGroup.add(ribcage);
    
    // Shoulder joints & Arms
    for(let side of [-1, 1]) {
        // Shoulder
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), titaniumJoints);
        shoulder.position.set(side * 0.5, 1.1, 0);
        frameGroup.add(shoulder);
        
        // Upper Arm
        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.6), carbonFiber);
        upperArm.position.set(side * 0.6, 0.7, 0);
        upperArm.rotation.z = side * 0.2;
        frameGroup.add(upperArm);
        
        // Lower Arm
        const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.6), carbonFiber);
        lowerArm.position.set(side * 0.7, 0.1, 0.1);
        lowerArm.rotation.x = 0.2;
        frameGroup.add(lowerArm);
    }
    
    // Legs
    for(let side of [-1, 1]) {
        // Hip joint
        const hip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), titaniumJoints);
        hip.position.set(side * 0.3, -0.4, 0);
        frameGroup.add(hip);
        
        // Thigh
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8), carbonFiber);
        thigh.position.set(side * 0.3, -0.8, 0);
        frameGroup.add(thigh);
        
        // Calf
        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.8), carbonFiber);
        calf.position.set(side * 0.3, -1.6, -0.1);
        calf.rotation.x = -0.1;
        frameGroup.add(calf);
    }
    
    group.add(frameGroup);
    parts.push({ mesh: ribcage, name: "Carbon Fiber Harness", description: "Ultra-lightweight load-bearing chassis.", function: "Supports the wearer's weight and transfers immense mechanical loads to the ground instead of the human skeleton."});

    // ==========================================
    // 2. PROCEDURAL CAD: Synthetic Hydraulic Muscles
    // ==========================================
    // Electroactive polymer bundles that contract like human muscle
    const muscleGroup = new THREE.Group();
    
    // Attach muscles to the thighs and biceps
    for(let side of [-1, 1]) {
        // Bicep muscle
        const bicep = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.4, 8, 8), syntheticMuscle);
        bicep.position.set(side * 0.65, 0.7, 0.05);
        bicep.rotation.z = side * 0.2;
        muscleGroup.add(bicep);
        group.userData.animatedMeshes.muscles.push(bicep);
        
        // Quad muscle (thigh)
        const quad = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.6, 8, 8), syntheticMuscle);
        quad.position.set(side * 0.3, -0.8, 0.1);
        muscleGroup.add(quad);
        group.userData.animatedMeshes.muscles.push(quad);
        
        // Hydraulic / Power lines running alongside
        class LineCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = side * 0.3;
                const y = -0.4 - (t * 1.2);
                const z = 0.15;
                return optionalTarget.set(x, y, z);
            }
        }
        const lineGeo = new THREE.TubeGeometry(new LineCurve(), 16, 0.015, 6, false);
        const line = new THREE.Mesh(lineGeo, hydraulicFluid);
        muscleGroup.add(line);
        
        // VFX power surge running through the line
        const surge = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), powerSurgeVFX);
        surge.userData = { t: Math.random(), side: side };
        muscleGroup.add(surge);
        group.userData.animatedMeshes.powerLines.push(surge);
    }
    
    group.add(muscleGroup);
    parts.push({ mesh: muscleGroup.children[1], name: "Electroactive Polymer Actuators", description: "Synthetic hydraulic muscle bundles.", function: "Contracts instantly when subjected to an electric current, providing 10x the strength-to-weight ratio of human muscle."});

    // ==========================================
    // 3. PROCEDURAL CAD: Neural Induction Helmet
    // ==========================================
    // Non-invasive BCI (Brain-Computer Interface)
    const helmetGroup = new THREE.Group();
    helmetGroup.position.set(0, 1.5, 0);
    
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI*2, 0, Math.PI/1.8), carbonFiber);
    helmetGroup.add(dome);
    
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI, Math.PI/3, Math.PI/3), neuralGlass);
    helmetGroup.add(visor);
    
    // Internal neural induction coils (Non-invasive EEG sensors)
    const coilGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05).rotateX(Math.PI/2), copper);
        const angle = (i * Math.PI * 2) / 6;
        coil.position.set(0.2 * Math.cos(angle), 0.1, 0.2 * Math.sin(angle));
        coil.lookAt(0,0,0);
        coilGroup.add(coil);
        
        // Sync VFX
        const syncLED = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), neuralSyncVFX);
        syncLED.position.copy(coil.position);
        syncLED.position.multiplyScalar(0.9); // Inside slightly
        helmetGroup.add(syncLED);
        group.userData.animatedMeshes.syncLeds.push(syncLED);
    }
    helmetGroup.add(coilGroup);
    
    group.add(helmetGroup);
    parts.push({ mesh: dome, name: "Neural Induction Helmet", description: "Carbon fiber cranial unit with EEG arrays.", function: "Reads the wearer's motor cortex intentions before the human muscles even twitch, allowing the exoskeleton to move with zero perceived latency."});

    // Scale adjustment
    group.scale.set(0.8, 0.8, 0.8);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Neural Sync LEDs flash rapidly (Reading motor cortex)
            group.userData.animatedMeshes.syncLeds.forEach((led, index) => {
                const isReading = Math.sin(timeAcc * 30 * speed + index) > 0.0;
                led.material.opacity = isReading ? 0.8 : 0.2;
            });
            
            // 2. Synthetic Muscles flex/bulge
            // We simulate contraction by making them shorter and wider
            const flex = Math.abs(Math.sin(timeAcc * 2.0 * speed)); // 0 to 1
            group.userData.animatedMeshes.muscles.forEach(muscle => {
                const lengthScale = 1.0 - (flex * 0.1); // Contract 10%
                const widthScale = 1.0 + (flex * 0.2);  // Bulge 20%
                muscle.scale.set(widthScale, lengthScale, widthScale);
            });
            
            // 3. Power Surges travel down the hydraulic lines
            group.userData.animatedMeshes.powerLines.forEach(surge => {
                surge.userData.t += 0.05 * speed;
                if (surge.userData.t > 1.0) surge.userData.t = 0.0;
                
                // Manual curve evaluation matching the LineCurve
                const x = surge.userData.side * 0.3;
                const y = -0.4 - (surge.userData.t * 1.2);
                const z = 0.15;
                surge.position.set(x, y, z);
                
                surge.material.opacity = flex > 0.5 ? 1.0 : 0.2; // Brighter during flex
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.syncLeds.forEach(led => led.material.opacity = 0);
            group.userData.animatedMeshes.muscles.forEach(muscle => muscle.scale.set(1,1,1));
            group.userData.animatedMeshes.powerLines.forEach(surge => surge.material.opacity = 0);
        }
    };

    group.userData.parts = parts;
    return group;
}
