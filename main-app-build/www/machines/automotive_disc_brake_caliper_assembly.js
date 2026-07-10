import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material
    const glowingFluidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        transmission: 0.5,
        roughness: 0.1,
        metalness: 0.1
    });

    const rotorMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.4,
        emissive: 0xff3300,
        emissiveIntensity: 0.0 // controlled by animation
    });

    const transparentBodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.1,
        ior: 1.5,
        thickness: 2.0
    });

    const padMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1
    });

    // 1. Brake Rotor
    const rotorGeom = new THREE.CylinderGeometry(15, 15, 1.5, 64);
    const rotorMesh = new THREE.Mesh(rotorGeom, rotorMaterial);
    rotorMesh.rotation.x = Math.PI / 2;
    group.add(rotorMesh);
    parts.push({
        name: "Brake Rotor",
        description: "A heavy cast-iron disc attached to the wheel hub. It provides the friction surface for the brake pads and dissipates extreme heat.",
        material: "Cast Iron",
        function: "Transforms kinetic energy into thermal energy via friction.",
        assemblyOrder: 1,
        connections: ["Wheel Hub", "Brake Pads"],
        failureEffect: "Brake fade, severe vibrations during braking (warping).",
        cascadeFailures: ["Premature Pad Wear", "Wheel Bearing Damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -30 },
        mesh: rotorMesh
    });

    // 2. Caliper Bracket
    const bracketGeom = new THREE.BoxGeometry(22, 14, 4);
    const bracketMesh = new THREE.Mesh(bracketGeom, darkSteel);
    bracketMesh.position.set(12, 0, 0);
    group.add(bracketMesh);
    parts.push({
        name: "Caliper Bracket",
        description: "The rigid backbone of the brake assembly, mounting directly to the vehicle's suspension.",
        material: "Forged Steel",
        function: "Anchors the brake pads and caliper body against the massive rotational forces of braking.",
        assemblyOrder: 2,
        connections: ["Steering Knuckle", "Guide Pins"],
        failureEffect: "Catastrophic loss of braking alignment.",
        cascadeFailures: ["Uneven Pad Wear", "Rotor Scoring", "Caliper Detachment"],
        originalPosition: { x: 12, y: 0, z: 0 },
        explodedPosition: { x: 25, y: 0, z: -15 },
        mesh: bracketMesh
    });

    // 3. Caliper Body (Transparent High-Tech)
    const bodyGeom = new THREE.BoxGeometry(20, 16, 12);
    const bodyMesh = new THREE.Mesh(bodyGeom, transparentBodyMaterial);
    bodyMesh.position.set(13, 0, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Caliper Body",
        description: "An advanced transparent casing that houses the hydraulic fluid and pistons. It acts as a clamp over the rotor.",
        material: "Transparent Aluminum Alloy",
        function: "Squeezes the brake pads against the rotor using hydraulic pressure.",
        assemblyOrder: 3,
        connections: ["Brake Line", "Pistons", "Guide Pins"],
        failureEffect: "Hydraulic leak, complete loss of braking pressure.",
        cascadeFailures: ["Complete Brake Failure", "Vehicle Collision"],
        originalPosition: { x: 13, y: 0, z: 0 },
        explodedPosition: { x: 45, y: 0, z: 0 },
        mesh: bodyMesh
    });

    // 4. Hydraulic Pistons
    const pistonGeom = new THREE.CylinderGeometry(3.5, 3.5, 4, 32);
    
    const piston1 = new THREE.Mesh(pistonGeom, chrome);
    piston1.rotation.x = Math.PI / 2;
    piston1.position.set(13, 4, 3);
    group.add(piston1);
    
    const piston2 = new THREE.Mesh(pistonGeom, chrome);
    piston2.rotation.x = Math.PI / 2;
    piston2.position.set(13, -4, 3);
    group.add(piston2);
    
    const piston3 = new THREE.Mesh(pistonGeom, chrome);
    piston3.rotation.x = Math.PI / 2;
    piston3.position.set(13, 4, -3);
    group.add(piston3);
    
    const piston4 = new THREE.Mesh(pistonGeom, chrome);
    piston4.rotation.x = Math.PI / 2;
    piston4.position.set(13, -4, -3);
    group.add(piston4);

    const pistonsGroup = new THREE.Group();
    pistonsGroup.add(piston1, piston2, piston3, piston4);
    
    parts.push({
        name: "Hydraulic Pistons",
        description: "Four high-polished chrome cylinders that extend under immense fluid pressure.",
        material: "Chrome-Plated Steel",
        function: "Applies even pressure to the backing plates of the brake pads.",
        assemblyOrder: 4,
        connections: ["Caliper Body", "Brake Pads", "Hydraulic Fluid"],
        failureEffect: "Seized pistons, causing dragging brakes.",
        cascadeFailures: ["Overheating Rotor", "Boiling Brake Fluid", "Pad Glazing"],
        originalPosition: { x: 13, y: 0, z: 0 },
        explodedPosition: { x: 45, y: 0, z: 15 },
        mesh: pistonsGroup,
        pData: { p1: piston1, p2: piston2, p3: piston3, p4: piston4 }
    });

    // 5. Brake Pads
    const padGeom = new THREE.BoxGeometry(16, 12, 1.5);
    const innerPad = new THREE.Mesh(padGeom, padMaterial);
    innerPad.position.set(13, 0, 1.5);
    const outerPad = new THREE.Mesh(padGeom, padMaterial);
    outerPad.position.set(13, 0, -1.5);
    group.add(innerPad);
    group.add(outerPad);
    
    const padGroup = new THREE.Group();
    padGroup.add(innerPad, outerPad);

    parts.push({
        name: "Brake Pads",
        description: "Sacrificial friction material bonded to a steel backing plate.",
        material: "Ceramic Composite",
        function: "Clamps onto the spinning rotor to generate friction.",
        assemblyOrder: 5,
        connections: ["Pistons", "Caliper Bracket", "Rotor"],
        failureEffect: "Loss of friction, increased stopping distance.",
        cascadeFailures: ["Rotor Damage", "Metal-on-Metal Grinding"],
        originalPosition: { x: 13, y: 0, z: 0 },
        explodedPosition: { x: 13, y: 0, z: 20 },
        mesh: padGroup,
        pData: { inner: innerPad, outer: outerPad }
    });

    // 6. Hydraulic Fluid Chamber
    const fluidGeom = new THREE.BoxGeometry(18, 14, 3);
    const fluidMesh1 = new THREE.Mesh(fluidGeom, glowingFluidMaterial);
    fluidMesh1.position.set(13, 0, 4.5);
    const fluidMesh2 = new THREE.Mesh(fluidGeom, glowingFluidMaterial);
    fluidMesh2.position.set(13, 0, -4.5);
    group.add(fluidMesh1);
    group.add(fluidMesh2);
    
    const fluidGroup = new THREE.Group();
    fluidGroup.add(fluidMesh1, fluidMesh2);

    parts.push({
        name: "Hydraulic Fluid",
        description: "Incompressible synthetic fluid represented by a glowing neon field.",
        material: "DOT 4 Synthetic Fluid (Glowing)",
        function: "Transmits force from the master cylinder directly to the pistons.",
        assemblyOrder: 6,
        connections: ["Brake Line", "Caliper Body"],
        failureEffect: "Spongy brake pedal, delayed braking response.",
        cascadeFailures: ["Fluid Boiling", "Complete Brake Fade"],
        originalPosition: { x: 13, y: 0, z: 0 },
        explodedPosition: { x: 65, y: 0, z: 25 },
        mesh: fluidGroup,
        pData: { f1: fluidMesh1, f2: fluidMesh2 }
    });

    const description = "The Ultra High-Tech Automotive Disc Brake Caliper Assembly is a marvel of fluid dynamics and mechanical engineering. Encased in a transparent aluminum body, the glowing hydraulic fluid visually demonstrates the immense forces generated during a braking event. As pressure spikes, four chrome pistons clamp ceramic composite pads onto the cast-iron rotor, converting kinetic energy into blinding thermal radiation.";

    const quizQuestions = [
        {
            question: "What principle allows hydraulic fluid to transmit force from the brake pedal to the caliper pistons?",
            options: [
                "Thermal Expansion",
                "Incompressibility of Liquids",
                "Aerodynamic Drag",
                "Electromagnetic Induction"
            ],
            correct: 1,
            explanation: "Liquids are nearly incompressible, meaning when pressure is applied at one end of a closed system (master cylinder), it is transmitted equally to the other end (caliper pistons).",
            difficulty: "Medium"
        },
        {
            question: "Why does the brake rotor glow red-hot under heavy braking in this simulation?",
            options: [
                "It is fueled by gasoline",
                "Friction converts kinetic energy into thermal energy",
                "The hydraulic fluid is burning",
                "It has built-in neon lights"
            ],
            correct: 1,
            explanation: "The primary function of a braking system is energy conversion. It stops the vehicle by turning kinetic energy (motion) into thermal energy (heat) via friction.",
            difficulty: "Easy"
        },
        {
            question: "What is a potential cascade failure if the brake calipers seize and the pads drag continuously on the rotor?",
            options: [
                "Increased fuel efficiency",
                "The steering wheel detaches",
                "Boiling of the hydraulic fluid due to extreme heat",
                "The engine oil level decreases"
            ],
            correct: 2,
            explanation: "Dragging brakes generate continuous extreme heat. This heat transfers to the caliper and can boil the brake fluid, introducing compressible gas bubbles and causing complete brake failure.",
            difficulty: "Hard"
        },
        {
            question: "What is the purpose of the Caliper Bracket?",
            options: [
                "To hold the hydraulic fluid",
                "To mount the assembly securely to the vehicle's suspension",
                "To cool the rotor",
                "To increase engine horsepower"
            ],
            correct: 1,
            explanation: "The caliper bracket anchors the entire brake assembly to the steering knuckle or suspension, resisting the massive rotational torque generated during braking.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const scaledTime = time * speed;
        // 5 second cycle: 2s idle spinning, 3s braking
        const cycleLength = 5000;
        const cycle = (scaledTime % cycleLength) / cycleLength; 
        
        let spinSpeed = 0.2;
        let pistonExtension = 0;
        let fluidIntensity = 1.0;
        let heatIntensity = 0.0;
        
        if (cycle > 0.4) {
            // Braking phase
            const brakeProgress = (cycle - 0.4) / 0.6; // 0 to 1
            // Smooth clamping action
            pistonExtension = Math.sin(brakeProgress * Math.PI) * 0.8; 
            // Rotor slows down
            spinSpeed = 0.2 * Math.max(0.01, 1 - (pistonExtension * 1.1));
            // Fluid pulses brightly
            fluidIntensity = 2.0 + Math.sin(brakeProgress * Math.PI * 2) * 1.5;
            // Heat builds up and fades
            heatIntensity = pistonExtension;
        }

        parts.forEach(part => {
            if (part.name === "Brake Rotor") {
                part.mesh.rotation.y -= spinSpeed * speed;
                part.mesh.material.emissiveIntensity = heatIntensity * 3.0; // Glows red
            }
            if (part.name === "Hydraulic Pistons") {
                // p1, p2 are outer (z=3), p3, p4 are inner (z=-3)
                part.pData.p1.position.z = 3 - pistonExtension * 0.5;
                part.pData.p2.position.z = 3 - pistonExtension * 0.5;
                part.pData.p3.position.z = -3 + pistonExtension * 0.5;
                part.pData.p4.position.z = -3 + pistonExtension * 0.5;
            }
            if (part.name === "Brake Pads") {
                part.pData.inner.position.z = 1.5 - pistonExtension * 0.6;
                part.pData.outer.position.z = -1.5 + pistonExtension * 0.6;
            }
            if (part.name === "Hydraulic Fluid") {
                part.pData.f1.material.emissiveIntensity = fluidIntensity;
                part.pData.f2.material.emissiveIntensity = fluidIntensity;
                // Subtle pulsation in size
                const pulse = 1 + pistonExtension * 0.05;
                part.pData.f1.scale.set(pulse, pulse, pulse);
                part.pData.f2.scale.set(pulse, pulse, pulse);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDiscBrakeCaliperAssembly() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
