import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.2,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.5
    });

    // 1. Main Base Ring
    const baseGeometry = new THREE.CylinderGeometry(2, 2.2, 0.5, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    group.add(baseMesh);
    parts.push({
        name: "Structural Base Ring",
        description: "The primary load-bearing structure of the docking mechanism, attaching the system to the spacecraft hull.",
        material: "darkSteel",
        function: "Transfers structural loads between docked spacecraft and provides a mounting platform for other components.",
        assemblyOrder: 1,
        connections: ["Spacecraft Hull", "Guide Petals", "Structural Hooks"],
        failureEffect: "Catastrophic loss of structural integrity between docked spacecraft.",
        cascadeFailures: ["Depressurization", "Umbilical Disconnect"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Guide Petals (3 petals)
    for(let i=0; i<3; i++) {
        const petalGroup = new THREE.Group();
        // Shape for petal
        const petalShape = new THREE.Shape();
        petalShape.moveTo(-0.4, 0);
        petalShape.lineTo(0.4, 0);
        petalShape.lineTo(0.2, 1.2);
        petalShape.lineTo(-0.2, 1.2);
        petalShape.lineTo(-0.4, 0);

        const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
        petalGeometry.center();

        const petalMesh = new THREE.Mesh(petalGeometry, aluminum);
        petalMesh.position.y = 0.6;
        petalMesh.rotation.x = -Math.PI / 6; // Angled outwards initially
        petalGroup.add(petalMesh);
        
        petalGroup.rotation.z = (i * Math.PI * 2) / 3;
        petalGroup.position.z = 0.25; 
        
        group.add(petalGroup);
        
        parts.push({
            name: `Guide Petal ${i+1}`,
            description: "Angled metal plates that provide initial soft capture alignment by interacting with corresponding petals on the target vehicle.",
            material: "aluminum",
            function: "Aligns the two spacecraft during the initial soft docking phase.",
            assemblyOrder: 2 + i,
            connections: ["Structural Base Ring"],
            failureEffect: "Inability to align spacecraft properly for capture.",
            cascadeFailures: ["Capture Latches Fail to Engage"],
            originalPosition: {x: petalGroup.position.x, y: petalGroup.position.y, z: petalGroup.position.z},
            explodedPosition: {x: Math.cos((i * Math.PI * 2) / 3)*3, y: Math.sin((i * Math.PI * 2) / 3)*3, z: 2}
        });
    }

    // 3. Shock Absorbers / Dampers
    for(let i=0; i<6; i++) {
        const damperGroup = new THREE.Group();
        const damperGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16);
        const damperMesh = new THREE.Mesh(damperGeo, chrome);
        const pistonGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16);
        const pistonMesh = new THREE.Mesh(pistonGeo, steel);
        pistonMesh.position.y = 0.5;
        
        damperGroup.add(damperMesh);
        damperGroup.add(pistonMesh);

        const angle = (i * Math.PI * 2) / 6 + Math.PI/6;
        damperGroup.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0.2);
        damperGroup.rotation.x = Math.PI / 2;
        group.add(damperGroup);
        
        parts.push({
            name: `Electromagnetic Damper ${i+1}`,
            description: "High-tech shock absorbers that dissipate the kinetic energy of the approaching spacecraft.",
            material: "chrome",
            function: "Prevents damage to the docking ring and spacecraft structure upon contact by absorbing impact forces.",
            assemblyOrder: 5 + i,
            connections: ["Structural Base Ring", "Soft Capture Ring"],
            failureEffect: "Excessive impact force transferred to spacecraft hull, potential damage.",
            cascadeFailures: ["Structural Ring Fracture", "Crew Injury"],
            originalPosition: {x: damperGroup.position.x, y: damperGroup.position.y, z: damperGroup.position.z},
            explodedPosition: {x: Math.cos(angle) * 4, y: Math.sin(angle) * 4, z: 0}
        });
    }

    // 4. Capture Latches
    for(let i=0; i<6; i++) {
        const latchGeo = new THREE.BoxGeometry(0.15, 0.4, 0.2);
        const latchMesh = new THREE.Mesh(latchGeo, steel);
        
        const angle = (i * Math.PI * 2) / 6;
        latchMesh.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0.25);
        latchMesh.rotation.z = angle;
        group.add(latchMesh);
        
        parts.push({
            name: `Capture Latch ${i+1}`,
            description: "Mechanical latches that engage to secure the spacecraft together after initial contact.",
            material: "steel",
            function: "Secures the soft capture ring to the target vehicle, preventing separation before hard docking.",
            assemblyOrder: 11 + i,
            connections: ["Structural Base Ring"],
            failureEffect: "Incomplete soft capture, spacecraft may drift apart.",
            cascadeFailures: ["Hard Docking Failure"],
            originalPosition: {x: latchMesh.position.x, y: latchMesh.position.y, z: latchMesh.position.z},
            explodedPosition: {x: Math.cos(angle) * 3, y: Math.sin(angle) * 3, z: 1}
        });
    }

    // 5. Umbilical Interface Array (Glowing Blue)
    const umbilicalGeo = new THREE.BoxGeometry(0.8, 0.25, 0.15);
    const umbilicalMesh = new THREE.Mesh(umbilicalGeo, glowingBlue);
    umbilicalMesh.position.set(0, 1.5, 0.3);
    group.add(umbilicalMesh);
    parts.push({
        name: "Power & Data Umbilical Array",
        description: "An array of electrical and fiber-optic connectors for transferring power, telemetry, and communications between spacecraft.",
        material: "glowingBlue",
        function: "Establishes a physical data and power link between the docked vessels.",
        assemblyOrder: 17,
        connections: ["Spacecraft Power Bus", "Spacecraft Data Bus"],
        failureEffect: "No power or data transfer between spacecraft.",
        cascadeFailures: ["Systems Desync"],
        originalPosition: {x: umbilicalMesh.position.x, y: umbilicalMesh.position.y, z: umbilicalMesh.position.z},
        explodedPosition: {x: 0, y: 3, z: 1.5}
    });

    // 6. Fluid/Gas Transfer Connectors (Glowing Green)
    const fluidGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 32);
    const fluidMesh = new THREE.Mesh(fluidGeo, glowingGreen);
    fluidMesh.position.set(1.5, 0, 0.3);
    fluidMesh.rotation.x = Math.PI / 2;
    group.add(fluidMesh);
    parts.push({
        name: "Fluid & Life Support Interface",
        description: "Valved connections for equalizing pressure and transferring air, water, or propellants.",
        material: "glowingGreen",
        function: "Allows for resource sharing and atmospheric equalization before hatch opening.",
        assemblyOrder: 18,
        connections: ["Life Support System", "Propellant Tanks"],
        failureEffect: "Inability to transfer resources or equalize pressure.",
        cascadeFailures: ["Hatch Cannot Open Safely"],
        originalPosition: {x: fluidMesh.position.x, y: fluidMesh.position.y, z: fluidMesh.position.z},
        explodedPosition: {x: 3, y: 0, z: 1.5}
    });

    // 7. Hatch Mechanism (Center)
    const hatchGroup = new THREE.Group();
    const hatchBaseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    const hatchBaseMesh = new THREE.Mesh(hatchBaseGeo, darkSteel);
    hatchBaseMesh.rotation.x = Math.PI / 2;
    hatchGroup.add(hatchBaseMesh);
    
    const hatchWindowGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32);
    const hatchWindowMesh = new THREE.Mesh(hatchWindowGeo, glass);
    hatchWindowMesh.rotation.x = Math.PI / 2;
    hatchGroup.add(hatchWindowMesh);

    // Indicator ring around window
    const indicatorGeo = new THREE.TorusGeometry(0.6, 0.05, 32, 64);
    const indicatorMesh = new THREE.Mesh(indicatorGeo, glowingRed);
    hatchGroup.add(indicatorMesh);

    group.add(hatchGroup);
    parts.push({
        name: "Pressure Hatch",
        description: "A heavy, pressure-sealed door containing a small viewport and locking mechanisms.",
        material: "darkSteel",
        function: "Maintains spacecraft atmospheric pressure and provides crew access when open.",
        assemblyOrder: 19,
        connections: ["Structural Base Ring"],
        failureEffect: "Loss of cabin pressure or inability to transfer crew.",
        cascadeFailures: ["Mission Abort", "Crew Asphyxiation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -2}
    });

    const description = "The Androgynous Peripheral Attach System (APAS) is a highly sophisticated spacecraft docking mechanism. Its androgynous nature means any APAS ring can dock with any other APAS ring, removing the need for dedicated 'active' and 'passive' configurations. It features guide petals for soft capture, electromagnetic dampers to absorb kinetic energy, capture latches, structural hooks for a rigid seal, and interfaces for power, data, and fluids. At the center lies a pressure hatch allowing crew transfer.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of an 'androgynous' docking system?",
            options: [
                "It uses less power than standard systems.",
                "Any spacecraft can dock with any other spacecraft equipped with the same system.",
                "It is completely automated and requires no pilot input.",
                "It can withstand higher atmospheric reentry temperatures."
            ],
            correct: 1,
            explanation: "An androgynous system has identical interfaces on both sides, meaning there is no 'probe' and 'drogue' requirement. Any two compatible ports can dock with each other, increasing mission flexibility.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the 'guide petals' on the APAS?",
            options: [
                "To generate solar power during the approach.",
                "To act as communication antennas.",
                "To provide initial alignment and soft capture between the two spacecraft.",
                "To seal the hatch and prevent air leaks."
            ],
            correct: 2,
            explanation: "The guide petals physically interact with the petals on the target vehicle, sliding against each other to perfectly align the two docking rings before latches engage.",
            difficulty: "Easy"
        },
        {
            question: "Why are electromagnetic dampers critical during the docking process?",
            options: [
                "They absorb the kinetic energy of the spacecraft coming together.",
                "They magnetically attract the other spacecraft.",
                "They prevent cosmic radiation from entering the hatch.",
                "They power the data umbilicals."
            ],
            correct: 0,
            explanation: "Spacecraft have immense mass. Even at low relative velocities, the kinetic energy is high. Dampers absorb this shock so the structures aren't damaged upon impact.",
            difficulty: "Medium"
        },
        {
            question: "What must happen before the center pressure hatch can be safely opened?",
            options: [
                "The guide petals must be ejected.",
                "The spacecraft must perform a roll maneuver.",
                "Pressure must be equalized via the fluid/gas interfaces.",
                "The main engine must be fired."
            ],
            correct: 2,
            explanation: "Opening a hatch with a pressure differential can be explosive or impossible. The internal space between hatches must be pressurized, and both sides must equalize via valves first.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const cycle = (time * speed * 0.5) % (Math.PI * 2);
        
        // Guide Petal oscillation (soft capture alignment sequence)
        const petalAngle = Math.sin(cycle) * Math.PI/12;
        for(let i=0; i<3; i++) {
            const pGroup = group.children[1 + i]; // Petals are at indices 1, 2, 3
            if(pGroup && pGroup.children[0]) {
                pGroup.children[0].rotation.x = -Math.PI/6 + petalAngle;
            }
        }
        
        // Piston oscillation in Dampers
        for(let i=0; i<6; i++) {
            const damperGroup = group.children[4 + i]; // Dampers are at indices 4 to 9
            if(damperGroup && damperGroup.children[1]) {
                const pistonOffset = Math.sin(cycle * 2 + i) * 0.1;
                damperGroup.children[1].position.y = 0.5 + pistonOffset;
            }
        }

        // Capture Latches engaging/disengaging
        for(let i=0; i<6; i++) {
            const latch = group.children[10 + i]; // Latches are at 10 to 15
            if(latch) {
                const latchOffset = Math.sin(cycle + Math.PI) * 0.05;
                const angle = (i * Math.PI * 2) / 6;
                latch.position.x = Math.cos(angle) * (2.1 + latchOffset);
                latch.position.y = Math.sin(angle) * (2.1 + latchOffset);
            }
        }

        // Indicator pulsing (Hatch is last child, indicator is 3rd child of hatch)
        const hatchGroupMesh = group.children[group.children.length - 1];
        if(hatchGroupMesh && hatchGroupMesh.children.length >= 3) {
            const indicator = hatchGroupMesh.children[2];
            // Change color and intensity based on cycle
            indicator.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(time * speed * 3));
            if (Math.sin(time * speed) > 0) {
                indicator.material.color.setHex(0x00ff00);
                indicator.material.emissive.setHex(0x00ff00);
            } else {
                indicator.material.color.setHex(0xff3300);
                indicator.material.emissive.setHex(0xff0000);
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpacecraftDockingRing() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
