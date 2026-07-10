import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing/High-Tech Materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0x9900ff,
        emissiveIntensity: 2
    });
    
    const plasmaGlow = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 3,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    
    const hotExhaust = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    // 1. Nacelle Housing
    const nacelleGeo = new THREE.CylinderGeometry(6, 6, 8, 32, 1, true);
    nacelleGeo.rotateX(Math.PI / 2);
    const nacelle = new THREE.Mesh(nacelleGeo, darkSteel);
    nacelle.position.set(0, 0, -4);
    group.add(nacelle);
    meshes.nacelle = nacelle;

    parts.push({
        name: "Nacelle Housing",
        description: "The aerodynamic outer casing of the jet engine. Made of advanced composite materials.",
        material: "darkSteel",
        function: "Houses all internal components and provides a sleek aerodynamic profile for minimal drag.",
        assemblyOrder: 1,
        connections: ["Engine Core", "Translating Cowl"],
        failureEffect: "Increased drag and potential internal component damage.",
        cascadeFailures: ["Loss of aerodynamic efficiency", "Structural fatigue"],
        originalPosition: { x: 0, y: 0, z: -4 },
        explodedPosition: { x: 0, y: 15, z: -4 }
    });

    // 2. Engine Core (Turbine and Shaft)
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.CylinderGeometry(2.5, 2.5, 16, 32);
    coreGeo.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreGroup.add(coreMesh);
    
    // Add pulsing plasma rings for visual flair
    for(let i=0; i<6; i++) {
        const ringGeo = new THREE.TorusGeometry(2.55, 0.1, 16, 32);
        const ring = new THREE.Mesh(ringGeo, plasmaGlow);
        ring.position.set(0, 0, -6 + i*2);
        coreGroup.add(ring);
    }
    
    group.add(coreGroup);
    meshes.coreGroup = coreGroup;
    meshes.plasmaRings = coreGroup.children.slice(1);

    parts.push({
        name: "Plasma Turbine Core",
        description: "High-temperature rotating core that provides primary thrust, augmented with a magnetic plasma containment field.",
        material: "chrome / plasma",
        function: "Compresses and ignites the air/fuel mixture, driving the fan and generating main thrust.",
        assemblyOrder: 2,
        connections: ["Nacelle Housing", "Exhaust Nozzle"],
        failureEffect: "Loss of primary thrust.",
        cascadeFailures: ["Engine stall", "Catastrophic uncontained failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 3. Translating Cowl
    const cowlGeo = new THREE.CylinderGeometry(6.1, 6.1, 6, 32, 1, true);
    cowlGeo.rotateX(Math.PI / 2);
    const cowl = new THREE.Mesh(cowlGeo, aluminum);
    cowl.position.set(0, 0, 3);
    group.add(cowl);
    meshes.cowl = cowl;

    // Glowing rim for the cowl
    const cowlRimGeo = new THREE.TorusGeometry(6.1, 0.15, 16, 32);
    const cowlRim = new THREE.Mesh(cowlRimGeo, neonCyan);
    cowlRim.position.set(0, 0, 3);
    cowl.add(cowlRim);

    parts.push({
        name: "Translating Cowl",
        description: "The movable rear section of the nacelle, guided by a sophisticated rail system.",
        material: "aluminum",
        function: "Slides backward to expose the cascade vanes and deploy blocker doors.",
        assemblyOrder: 3,
        connections: ["Hydraulic Actuators", "Blocker Doors"],
        failureEffect: "Inability to deploy thrust reverser.",
        cascadeFailures: ["Runway overrun on landing", "Brake overheating"],
        originalPosition: { x: 0, y: 0, z: 3 },
        explodedPosition: { x: 0, y: 0, z: 20 }
    });

    // 4. Cascade Vanes
    const cascadeGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const vaneGeo = new THREE.CylinderGeometry(5.9, 5.9, 0.4, 32, 1, true);
        vaneGeo.rotateX(Math.PI / 2);
        const vane = new THREE.Mesh(vaneGeo, steel);
        vane.position.set(0, 0, 0.5 + i * 0.8);
        cascadeGroup.add(vane);
    }
    // Vertical supports for cascade
    for(let i=0; i<12; i++) {
        const supportGeo = new THREE.BoxGeometry(0.2, 1.8, 5);
        const support = new THREE.Mesh(supportGeo, darkSteel);
        const angle = (i / 12) * Math.PI * 2;
        support.position.set(Math.cos(angle) * 5.8, Math.sin(angle) * 5.8, 2.5);
        support.rotation.z = angle;
        cascadeGroup.add(support);
    }
    group.add(cascadeGroup);
    meshes.cascadeGroup = cascadeGroup;

    parts.push({
        name: "Cascade Vanes",
        description: "Aerodynamic grids exposed during reverser deployment, made of titanium alloys.",
        material: "steel",
        function: "Redirects bypass airflow forward to create immense reverse thrust.",
        assemblyOrder: 4,
        connections: ["Nacelle Housing"],
        failureEffect: "Inefficient or asymmetric reverse thrust.",
        cascadeFailures: ["Aircraft yawing during rollout", "Loss of directional control"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    // 5. Blocker Doors
    const blockerGroup = new THREE.Group();
    const doorCount = 8;
    meshes.doors = [];
    for(let i=0; i<doorCount; i++) {
        const doorGeo = new THREE.BoxGeometry(2.5, 0.2, 3);
        const door = new THREE.Mesh(doorGeo, chrome);
        
        // Pivot point at the rear of the door
        const doorPivot = new THREE.Group();
        const angle = (i / doorCount) * Math.PI * 2;
        doorPivot.position.set(Math.cos(angle) * 5.8, Math.sin(angle) * 5.8, 2);
        doorPivot.rotation.z = angle;
        
        door.position.set(0, -0.1, -1.5);
        
        // Glowing inner surface
        const glowPadGeo = new THREE.PlaneGeometry(2.3, 2.8);
        const glowPad = new THREE.Mesh(glowPadGeo, neonPurple);
        glowPad.rotation.x = Math.PI / 2;
        glowPad.position.set(0, -0.11, -1.5);
        doorPivot.add(door);
        doorPivot.add(glowPad);
        
        blockerGroup.add(doorPivot);
        meshes.doors.push(doorPivot);
    }
    cowl.add(blockerGroup);
    // offset so they start at correct position inside cowl
    blockerGroup.position.set(0, 0, 0);

    parts.push({
        name: "Blocker Doors",
        description: "Foldable doors located inside the bypass duct lined with energetic purple kinetic dampeners.",
        material: "chrome / neonPurple",
        function: "Deploys to block rearward bypass air, forcing it through the cascade vanes.",
        assemblyOrder: 5,
        connections: ["Translating Cowl", "Engine Core"],
        failureEffect: "Loss of reverse thrust efficiency.",
        cascadeFailures: ["Overheating of cascades", "Thrust asymmetry"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    // 6. Hydraulic Actuators
    const actuatorGroup = new THREE.Group();
    meshes.actuators = [];
    for(let i=0; i<4; i++) {
        const actAngle = (i / 4) * Math.PI * 2 + Math.PI/4;
        const actuator = new THREE.Group();
        
        const cylinderGeo = new THREE.CylinderGeometry(0.3, 0.3, 4);
        cylinderGeo.rotateX(Math.PI / 2);
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        cylinder.position.set(Math.cos(actAngle)*6.3, Math.sin(actAngle)*6.3, 0);
        
        const pistonGeo = new THREE.CylinderGeometry(0.15, 0.15, 4);
        pistonGeo.rotateX(Math.PI/2);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.set(Math.cos(actAngle)*6.3, Math.sin(actAngle)*6.3, 2);
        
        actuator.add(cylinder);
        actuator.add(piston);
        
        actuatorGroup.add(actuator);
        meshes.actuators.push(piston);
    }
    group.add(actuatorGroup);

    parts.push({
        name: "Hydraulic Actuators",
        description: "High-pressure, dual-redundant hydraulic pistons.",
        material: "darkSteel / chrome",
        function: "Provides the immense mechanical force to move the translating cowl against aerodynamic pressure.",
        assemblyOrder: 6,
        connections: ["Nacelle Housing", "Translating Cowl"],
        failureEffect: "Cowl jammed in transit.",
        cascadeFailures: ["Uncommanded deployment in flight", "Total system lock"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    // 7. Exhaust Nozzle
    const exhaustGeo = new THREE.CylinderGeometry(2.5, 1.8, 4, 32, 1, true);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaust = new THREE.Mesh(exhaustGeo, darkSteel);
    exhaust.position.set(0, 0, 10);
    group.add(exhaust);

    const exhaustGlowGeo = new THREE.CylinderGeometry(2.3, 1.6, 4.2, 32, 1, true);
    exhaustGlowGeo.rotateX(Math.PI / 2);
    const exhaustGlow = new THREE.Mesh(exhaustGlowGeo, hotExhaust);
    exhaustGlow.position.set(0, 0, 10.1);
    group.add(exhaustGlow);
    meshes.exhaustGlow = exhaustGlow;

    parts.push({
        name: "Exhaust Nozzle",
        description: "Rearmost section of the engine core, capable of withstanding extreme thermal loads.",
        material: "darkSteel",
        function: "Accelerates hot exhaust gases to generate forward thrust.",
        assemblyOrder: 7,
        connections: ["Engine Core"],
        failureEffect: "Loss of thrust efficiency.",
        cascadeFailures: ["Overheating", "Engine fire"],
        originalPosition: { x: 0, y: 0, z: 10 },
        explodedPosition: { x: 0, y: 0, z: 30 }
    });

    const description = "The Aerospace Thrust Reverser is a highly critical braking system used on modern jet engines. By deploying blocker doors and a translating cowl, it temporarily redirects engine bypass airflow forward, significantly reducing the aircraft's landing rollout distance. This ultra-high-tech model showcases a cascade-type reverser driven by hydraulic actuators and featuring glowing plasma elements.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Blocker Doors?",
            options: [
                "To increase forward thrust",
                "To block rearward bypass air and force it through the cascade vanes",
                "To cool the engine core",
                "To protect the engine from bird strikes"
            ],
            correct: 1,
            explanation: "When deployed, the blocker doors swing into the bypass duct to stop rearward airflow, redirecting it outwards and forwards through the cascade vanes to create reverse thrust.",
            difficulty: "Medium"
        },
        {
            question: "Which component mechanically moves the Translating Cowl?",
            options: [
                "Cascade Vanes",
                "Plasma Turbine",
                "Hydraulic Actuators",
                "Exhaust Nozzle"
            ],
            correct: 2,
            explanation: "Hydraulic (or sometimes pneumatic/electric) actuators provide the high force required to slide the massive translating cowl backward against aerodynamic forces.",
            difficulty: "Easy"
        },
        {
            question: "What type of thrust reverser is depicted in this model?",
            options: [
                "Target-type (Clamshell)",
                "Cascade-type",
                "Pivot-door type",
                "Propeller pitch-reversal"
            ],
            correct: 1,
            explanation: "This model features a Translating Cowl and Cascade Vanes, which define a Cascade-type thrust reverser, commonly used on high-bypass turbofan engines.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, extMeshes) {
        // Core rotation
        meshes.coreGroup.rotation.z = time * speed * 5;
        
        // Plasma pulsing
        meshes.plasmaRings.forEach((ring, idx) => {
            ring.scale.setScalar(1 + Math.sin(time * 10 + idx) * 0.02);
            ring.material.emissiveIntensity = 2 + Math.sin(time * 15 + idx);
        });

        meshes.exhaustGlow.material.opacity = 0.5 + Math.sin(time * 20) * 0.2;

        // Deployment Logic (Cycle every few seconds based on time*speed)
        const cycle = (time * speed * 0.5) % (Math.PI * 2);
        // Map sine wave to 0..1 smooth step
        let deployState = (Math.sin(cycle) + 1) / 2;
        
        // Sharpen the curve so it stays stowed or deployed longer
        deployState = Math.max(0, Math.min(1, (deployState - 0.2) * 1.6));

        // 1. Translating cowl moves back
        meshes.cowl.position.z = 3 + (deployState * 5); // moves back 5 units

        // 2. Actuators extend
        meshes.actuators.forEach(piston => {
            piston.position.z = 2 + (deployState * 2.5); // piston extends
        });

        // 3. Blocker doors rotate down
        // When stowed (deployState=0), angle = 0.
        // When deployed (deployState=1), angle folds inward
        meshes.doors.forEach(doorPivot => {
            doorPivot.rotation.x = -deployState * (Math.PI / 2.2);
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createThrustReverserMechanism() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
