import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech/Neon Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff003c,
        emissive: 0xff003c,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9
    });

    const energyPulse = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0,
        wireframe: true
    });
    
    const plasmaCore = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.7
    });

    const meshes = {}; // Map to hold meshes by id for easy animation access
    
    function addPart(mesh, name, desc, mat, func, order, conns, failure, cascade, expPos) {
        group.add(mesh);
        parts.push({
            name,
            description: desc,
            material: mat,
            function: func,
            assemblyOrder: order,
            connections: conns,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: expPos
        });
        if(mesh.userData.id) {
            meshes[mesh.userData.id] = mesh;
        }
    }

    // 1. Rotor Mast
    const mastGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 32);
    const mastMesh = new THREE.Mesh(mastGeo, darkSteel);
    mastMesh.position.set(0, 1, 0);
    mastMesh.userData = { id: 'mast', type: 'rotating' };
    addPart(mastMesh, "Main Rotor Mast", "Primary drive shaft delivering immense torque.", "Dark Steel", "Supports the entire rotor assembly.", 1, ["Hub", "Engine Drive"], "Loss of torque transmission", ["Complete structural collapse"], { x: 0, y: 15, z: 0 });

    // 2. Plasma Core (inside mast)
    const coreGeo = new THREE.CylinderGeometry(0.3, 0.3, 12.1, 16);
    const coreMesh = new THREE.Mesh(coreGeo, plasmaCore);
    coreMesh.position.set(0, 1, 0);
    coreMesh.userData = { id: 'plasmaCore' };
    addPart(coreMesh, "Magnetic Plasma Core", "Central stabilizing plasma vortex.", "Plasma", "Provides magnetic stabilization and active cooling.", 2, ["Mast"], "Thermal runaway", ["Mast melting"], { x: 0, y: 20, z: 0 });

    // 3. Magnetic Field Ring (Visual Flair)
    const magGeo = new THREE.TorusGeometry(3.5, 0.05, 16, 100);
    const magMesh = new THREE.Mesh(magGeo, energyPulse);
    magMesh.rotation.x = Math.PI / 2;
    magMesh.position.set(0, -3, 0);
    magMesh.userData = { id: 'magField' };
    addPart(magMesh, "Magnetic Confinement Ring", "Keeps the plasma core stable during high-G maneuvers.", "Energy Pulse", "Containment of stray energetic particles.", 3, ["Base"], "Radiation leak", ["Avionics interference"], { x: 0, y: -15, z: 0 });

    // 4. Actuators
    const actuatorsGrp = new THREE.Group();
    actuatorsGrp.position.set(0, -3, 0);
    actuatorsGrp.userData = { id: 'actuatorsGrp' };
    group.add(actuatorsGrp);
    meshes['actuatorsGrp'] = actuatorsGrp;
    
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const actGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
        const actMesh = new THREE.Mesh(actGeo, copper);
        actMesh.position.set(Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5);
        actuatorsGrp.add(actMesh);

        const actGlowGeo = new THREE.CylinderGeometry(0.25, 0.25, 1, 16);
        const actGlowMesh = new THREE.Mesh(actGlowGeo, neonRed);
        actGlowMesh.position.set(Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5);
        actGlowMesh.userData = { id: `actGlow_${i}`, phase: angle };
        actuatorsGrp.add(actGlowMesh);
        meshes[`actGlow_${i}`] = actGlowMesh;
    }
    parts.push({
        name: "Hydraulic Servos",
        description: "Three powerful actuators controlling the swashplate height and tilt.",
        material: "Copper / Neon",
        function: "Moves the stationary swashplate for collective and cyclic pitch.",
        assemblyOrder: 4,
        connections: ["Stationary Swashplate"],
        failureEffect: "Loss of directional control.",
        cascadeFailures: ["Pitch-lock"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 5. Swashplate Group (Holds both Stationary and Rotating)
    const swashplateGrp = new THREE.Group();
    swashplateGrp.position.set(0, -1, 0);
    swashplateGrp.userData = { id: 'swashplateGrp' };
    group.add(swashplateGrp);
    meshes['swashplateGrp'] = swashplateGrp;

    // Stationary Swashplate
    const statGeo = new THREE.TorusGeometry(2.5, 0.3, 16, 64);
    const statMesh = new THREE.Mesh(statGeo, steel);
    statMesh.rotation.x = Math.PI / 2;
    swashplateGrp.add(statMesh);
    
    const antiRotGeo = new THREE.BoxGeometry(0.4, 0.4, 1);
    const antiRotMesh = new THREE.Mesh(antiRotGeo, aluminum);
    antiRotMesh.position.set(2.8, 0, 0);
    swashplateGrp.add(antiRotMesh);

    // Rotating Swashplate
    const rotSwashGrp = new THREE.Group();
    swashplateGrp.add(rotSwashGrp);
    meshes['rotSwashGrp'] = rotSwashGrp;

    const rotGeo = new THREE.TorusGeometry(2, 0.25, 16, 64);
    const rotMesh = new THREE.Mesh(rotGeo, chrome);
    rotMesh.rotation.x = Math.PI / 2;
    rotMesh.position.set(0, 0.4, 0);
    rotSwashGrp.add(rotMesh);
    
    // Bearing Ring (between them)
    const bearingGeo = new THREE.TorusGeometry(2.25, 0.1, 16, 64);
    const bearingMesh = new THREE.Mesh(bearingGeo, neonBlue);
    bearingMesh.rotation.x = Math.PI / 2;
    bearingMesh.position.set(0, 0.2, 0);
    swashplateGrp.add(bearingMesh);

    parts.push({
        name: "Swashplate Assembly",
        description: "The core interface between stationary controls and rotating blades. Features a high-speed magnetic bearing ring.",
        material: "Steel / Chrome / Neon Blue Bearing",
        function: "Transmits pilot inputs to the rotating blades.",
        assemblyOrder: 5,
        connections: ["Servos", "Pitch Links"],
        failureEffect: "Uncontrollable pitch variations.",
        cascadeFailures: ["Blade strike"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 6. Holographic Data Rings
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(2.5 + i*0.3, 0.02, 8, 64);
        const ringMesh = new THREE.Mesh(ringGeo, neonBlue);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(0, 2 + i*0.5, 0);
        ringMesh.userData = { id: `dataRing_${i}`, speedMod: 1 + i*0.5 };
        group.add(ringMesh);
        meshes[`dataRing_${i}`] = ringMesh;
    }
    parts.push({
        name: "Telemetry Holograms",
        description: "Projects real-time aerodynamic load data directly onto the rotor mast.",
        material: "Photonic Projection",
        function: "Live monitoring of stress and strain.",
        assemblyOrder: 6,
        connections: ["Sensors"],
        failureEffect: "Loss of visual telemetry.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 10, y: 2, z: 10 }
    });

    // 7. Rotor Hub
    const hubGrp = new THREE.Group();
    hubGrp.position.set(0, 6, 0);
    group.add(hubGrp);
    meshes['hubGrp'] = hubGrp;
    
    const hubGeo = new THREE.CylinderGeometry(1.5, 1.8, 1.2, 32);
    const hubMesh = new THREE.Mesh(hubGeo, darkSteel);
    hubGrp.add(hubMesh);
    
    const hubGlowGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 32);
    const hubGlowMesh = new THREE.Mesh(hubGlowGeo, energyPulse);
    hubGlowMesh.rotation.x = Math.PI / 2;
    hubGrp.add(hubGlowMesh);

    parts.push({
        name: "Main Rotor Hub",
        description: "Central mount for the rotor blades, enclosed in a dark steel casing with energy pulse dissipators.",
        material: "Dark Steel / Amethyst Energy",
        function: "Secures blades and allows them to pitch, flap, and lead/lag.",
        assemblyOrder: 7,
        connections: ["Mast", "Blades"],
        failureEffect: "Blade separation.",
        cascadeFailures: ["Total destruction"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 8. Pitch Links & Blades
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        // Blade assembly
        const bladeAssembly = new THREE.Group();
        bladeAssembly.rotation.y = -angle;
        hubGrp.add(bladeAssembly);
        
        // Pitch Control Horn (attached to hub/blade root)
        const hornGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5);
        const hornMesh = new THREE.Mesh(hornGeo, aluminum);
        hornMesh.rotation.z = Math.PI / 2;
        hornMesh.position.set(2, 0, -0.5);
        bladeAssembly.add(hornMesh);
        
        // Blade Root
        const rootGeo = new THREE.CylinderGeometry(0.4, 0.4, 3);
        const rootMesh = new THREE.Mesh(rootGeo, steel);
        rootMesh.rotation.z = Math.PI / 2;
        rootMesh.position.set(2, 0, 0);
        bladeAssembly.add(rootMesh);

        // Actual Blade
        const bladeGeo = new THREE.BoxGeometry(14, 0.1, 1.5);
        const bladeMesh = new THREE.Mesh(bladeGeo, glass);
        bladeMesh.position.set(10.5, 0, 0);
        bladeAssembly.add(bladeMesh);

        // Blade Edge Glow
        const edgeGeo = new THREE.BoxGeometry(14.2, 0.15, 0.2);
        const edgeMesh = new THREE.Mesh(edgeGeo, energyPulse);
        edgeMesh.position.set(10.5, 0, 0.8);
        bladeAssembly.add(edgeMesh);

        // Pitch Link
        const linkGeo = new THREE.CylinderGeometry(0.1, 0.1, 6.6);
        const linkMesh = new THREE.Mesh(linkGeo, chrome);
        
        linkMesh.userData = { id: `pitchLink_${i}`, phase: angle };
        meshes[`pitchLink_${i}`] = linkMesh;
        group.add(linkMesh); // add to main group so it can span hub and swashplate
    }

    parts.push({
        name: "Pitch Links & Blades",
        description: "Composite glass blades with plasma-infused leading edges for supersonic aerodynamics.",
        material: "Glass / Energy Pulse / Chrome",
        function: "Generate lift and provide directional thrust through pitch modulation.",
        assemblyOrder: 8,
        connections: ["Hub", "Rotating Swashplate"],
        failureEffect: "Asymmetric lift, severe vibration.",
        cascadeFailures: ["Mast snapping"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    const description = "The Helicopter Swashplate is a highly complex mechanism that translates pilot input into motion of the main rotor blades. It seamlessly transmits non-rotating control movements into the rotating rotor system, allowing independent control of both collective (vertical lift) and cyclic (directional) blade pitch using magnetic bearings and plasma dampeners.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Swashplate Assembly?",
            options: [
                "To cool the engine",
                "To convert stationary control inputs into rotating blade pitch changes",
                "To store fuel for the rotor",
                "To generate thrust directly"
            ],
            correct: 1,
            explanation: "The swashplate bridges the non-rotating control linkages from the cockpit to the rapidly spinning rotor blades.",
            difficulty: "Medium"
        },
        {
            question: "How does 'collective' pitch affect the helicopter?",
            options: [
                "It changes the pitch of all blades equally, raising or lowering the aircraft",
                "It tilts the swashplate to move forward",
                "It stops the rotor from spinning",
                "It controls the tail rotor"
            ],
            correct: 0,
            explanation: "Collective pitch raises or lowers the entire swashplate, increasing or decreasing the pitch of all blades simultaneously to change overall lift.",
            difficulty: "Easy"
        },
        {
            question: "What connects the rotating swashplate directly to the rotor blades?",
            options: [
                "The mast",
                "The anti-rotation bracket",
                "Pitch links",
                "Hydraulic servos"
            ],
            correct: 2,
            explanation: "Pitch links are the rods that push or pull the blade roots depending on the tilt of the rotating swashplate.",
            difficulty: "Medium"
        },
        {
            question: "Why does the stationary swashplate have an anti-rotation bracket?",
            options: [
                "To keep the helicopter from spinning",
                "To prevent it from spinning with the mast, ensuring it stays aligned with the servos",
                "To hold the landing gear",
                "To slow down the rotor"
            ],
            correct: 1,
            explanation: "The stationary swashplate must remain fixed relative to the fuselage so the hydraulic servos can actuate it without getting twisted.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Rotate Mast and Hub
        const rotSpeed = time * speed * 5;
        if (meshes['mast']) meshes['mast'].rotation.y = rotSpeed;
        if (meshes['hubGrp']) meshes['hubGrp'].rotation.y = rotSpeed;
        if (meshes['rotSwashGrp']) meshes['rotSwashGrp'].rotation.y = rotSpeed;
        
        if (meshes['plasmaCore']) {
            meshes['plasmaCore'].rotation.y = -rotSpeed * 2;
            meshes['plasmaCore'].material.opacity = 0.5 + Math.sin(time * speed * 10) * 0.3;
        }

        if (meshes['magField']) {
            meshes['magField'].rotation.z = -rotSpeed * 0.5;
            meshes['magField'].scale.setScalar(1 + Math.sin(time * speed * 2) * 0.05);
        }

        for(let i=0; i<3; i++) {
            if (meshes[`dataRing_${i}`]) {
                const spdMod = meshes[`dataRing_${i}`].userData.speedMod;
                meshes[`dataRing_${i}`].rotation.z = rotSpeed * spdMod;
                meshes[`dataRing_${i}`].position.y = 2 + i*0.5 + Math.sin(time * speed * 3 + i) * 0.2;
            }
        }

        // Swashplate Collective & Cyclic Oscillation
        // Simulate a pilot moving the cyclic and collective
        const collectiveH = Math.sin(time * speed * 0.5) * 0.5; // Up and down
        const cyclicTiltX = Math.sin(time * speed * 1.2) * 0.15;
        const cyclicTiltZ = Math.cos(time * speed * 0.8) * 0.15;

        if (meshes['swashplateGrp']) {
            meshes['swashplateGrp'].position.y = -1 + collectiveH;
            meshes['swashplateGrp'].rotation.x = cyclicTiltX;
            meshes['swashplateGrp'].rotation.z = cyclicTiltZ;
        }

        // Actuators glow pulsing
        for (let i = 0; i < 3; i++) {
            if (meshes[`actGlow_${i}`]) {
                const phase = meshes[`actGlow_${i}`].userData.phase;
                meshes[`actGlow_${i}`].position.y = collectiveH * 0.5 + Math.sin(time * speed * 5 + phase) * 0.2;
                meshes[`actGlow_${i}`].material.emissiveIntensity = 1 + Math.sin(time * speed * 8 + phase) * 0.5;
            }
        }

        // Pitch Links Dynamic Inverse Kinematics (Simplified)
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const link = meshes[`pitchLink_${i}`];
            if (!link) continue;

            const swashAngle = angle + rotSpeed;
            const swashR = 2.0;
            const swashX = Math.cos(swashAngle) * swashR;
            const swashZ = Math.sin(swashAngle) * swashR;
            
            const swashPoint = new THREE.Vector3(swashX, 0.4, swashZ);
            swashPoint.applyEuler(new THREE.Euler(cyclicTiltX, 0, cyclicTiltZ));
            swashPoint.y += (-1 + collectiveH); // add base height

            const hubR = 2.0;
            const hornOffset = -0.5; // Z offset local to blade
            const hubPoint = new THREE.Vector3(
                Math.cos(swashAngle) * hubR - Math.sin(swashAngle) * hornOffset,
                6, // Hub height
                Math.sin(swashAngle) * hubR + Math.cos(swashAngle) * hornOffset
            );

            const midPoint = new THREE.Vector3().addVectors(swashPoint, hubPoint).multiplyScalar(0.5);
            link.position.copy(midPoint);
            
            const dir = new THREE.Vector3().subVectors(hubPoint, swashPoint).normalize();
            const defaultUp = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultUp, dir);
            link.setRotationFromQuaternion(quaternion);
            
            const dist = swashPoint.distanceTo(hubPoint);
            link.scale.y = dist / 6.6; // 6.6 is original geometry height
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHelicopterSwashplate() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
