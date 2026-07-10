import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "Biomimetic Polymer Extrusion System (Spider Silk Spinneret): An advanced biomechanical assembly replicating a spider's silk production process. It combines protein-based liquid storage, a micro-fluidic duct system for molecular alignment, and a nano-scale spigot mechanism to extrude high-tensile strength bio-polymers.";

    // Custom glowing material
    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const proteinLiquidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x006622,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });

    const silkMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xaaaaaa,
        emissiveIntensity: 0.2,
        roughness: 0.2,
        metalness: 0.1
    });

    // 1. Primary Ampullate Gland (Reservoir)
    const glandGeometry = new THREE.CapsuleGeometry(2, 4, 32, 32);
    const glandMesh = new THREE.Mesh(glandGeometry, tinted);
    glandMesh.position.set(0, 5, 0);
    group.add(glandMesh);
    meshes.gland = glandMesh;

    // Inside the gland (protein liquid)
    const liquidGeometry = new THREE.CapsuleGeometry(1.8, 3.8, 32, 32);
    const liquidMesh = new THREE.Mesh(liquidGeometry, proteinLiquidMaterial);
    glandMesh.add(liquidMesh);
    meshes.liquid = liquidMesh;

    parts.push({
        name: "Primary Ampullate Gland",
        description: "Stores the concentrated liquid protein dope (spidroin) before it is processed.",
        material: "tinted",
        function: "Storage and initial concentration of silk proteins.",
        assemblyOrder: 1,
        connections: ["Micro-Fluidic Duct"],
        failureEffect: "Protein coagulation inside the reservoir, halting production.",
        cascadeFailures: ["Micro-Fluidic Duct blockage"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 2. Micro-Fluidic Duct (Spinning Duct)
    // A tapering tube where shear forces align proteins
    const ductGeometry = new THREE.CylinderGeometry(1.5, 0.5, 4, 32);
    const ductMesh = new THREE.Mesh(ductGeometry, glass);
    ductMesh.position.set(0, 1, 0);
    group.add(ductMesh);
    meshes.duct = ductMesh;

    // A glowing helix inside the duct representing structural alignment
    const helixCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2, 0),
        new THREE.Vector3(0.5, 1, 0.5),
        new THREE.Vector3(-0.5, 0, -0.5),
        new THREE.Vector3(0.3, -1, 0.3),
        new THREE.Vector3(0, -2, 0)
    ]);
    const helixGeometry = new THREE.TubeGeometry(helixCurve, 64, 0.1, 8, false);
    const helixMesh = new THREE.Mesh(helixGeometry, glowMaterial);
    ductMesh.add(helixMesh);
    meshes.helix = helixMesh;

    parts.push({
        name: "Micro-Fluidic Duct",
        description: "An intricate channel that uses pH gradients and shear forces to align protein molecules.",
        material: "glass",
        function: "Induces a liquid-crystalline phase transition in the protein dope.",
        assemblyOrder: 2,
        connections: ["Primary Ampullate Gland", "Spigot Valve"],
        failureEffect: "Poor molecular alignment resulting in weak, brittle silk.",
        cascadeFailures: ["Spigot Valve rupture"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: -5, y: 1, z: 0}
    });

    // 3. Spigot Valve
    const valveGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 64);
    const valveMesh = new THREE.Mesh(valveGeometry, chrome);
    valveMesh.rotation.x = Math.PI / 2;
    valveMesh.position.set(0, -1, 0);
    group.add(valveMesh);
    meshes.valve = valveMesh;

    parts.push({
        name: "Spigot Valve",
        description: "A dynamic muscular valve that controls the extrusion rate and final fiber diameter.",
        material: "chrome",
        function: "Regulates flow and draws the crystalline protein into a solid nano-fiber.",
        assemblyOrder: 3,
        connections: ["Micro-Fluidic Duct", "Spinneret Spigot"],
        failureEffect: "Inconsistent fiber thickness and flow disruption.",
        cascadeFailures: ["Silk Strand breakage"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 5, y: -1, z: 0}
    });

    // 4. Spinneret Spigot (Nozzle)
    const spigotGeometry = new THREE.CylinderGeometry(0.5, 0.1, 2, 32);
    const spigotMesh = new THREE.Mesh(spigotGeometry, darkSteel);
    spigotMesh.position.set(0, -2, 0);
    group.add(spigotMesh);
    meshes.spigot = spigotMesh;

    parts.push({
        name: "Spinneret Spigot Nozzle",
        description: "The final nano-scale extrusion point where the fiber solidifies completely.",
        material: "darkSteel",
        function: "Extrudes the solid biomimetic polymer fiber.",
        assemblyOrder: 4,
        connections: ["Spigot Valve", "Silk Strand"],
        failureEffect: "Complete failure to extrude solid material; liquid leakage.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 5. Extruded Silk Strand
    const strandGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 16);
    const strandMesh = new THREE.Mesh(strandGeometry, silkMaterial);
    strandMesh.position.set(0, -5, 0);
    group.add(strandMesh);
    meshes.strand = strandMesh;

    parts.push({
        name: "Extruded Silk Strand",
        description: "The final bio-polymer fiber, boasting higher toughness than steel or Kevlar.",
        material: "silk",
        function: "Output product of the spinneret system.",
        assemblyOrder: 5,
        connections: ["Spinneret Spigot Nozzle"],
        failureEffect: "Strand snaps under tension.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -5, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 6. Neuromuscular Actuators (Support Structures)
    const actuatorGeom1 = new THREE.BoxGeometry(0.5, 2, 0.5);
    const actuator1 = new THREE.Mesh(actuatorGeom1, rubber);
    actuator1.position.set(-1.5, -1, 0);
    actuator1.rotation.z = -Math.PI / 6;
    group.add(actuator1);
    
    const actuator2 = new THREE.Mesh(actuatorGeom1, rubber);
    actuator2.position.set(1.5, -1, 0);
    actuator2.rotation.z = Math.PI / 6;
    group.add(actuator2);
    meshes.actuators = [actuator1, actuator2];

    parts.push({
        name: "Neuromuscular Actuators",
        description: "Controls the precise movement and angling of the spigot for directing the silk strand.",
        material: "rubber",
        function: "Provides articulation and spatial orientation for the extrusion nozzle.",
        assemblyOrder: 6,
        connections: ["Spigot Valve"],
        failureEffect: "Inability to aim the silk strand accurately.",
        cascadeFailures: ["Web structure misalignment"],
        originalPosition: {x: -1.5, y: -1, z: 0},
        explodedPosition: {x: -3, y: -2, z: 3}
    });

    const quizQuestions = [
        {
            question: "What primary mechanism causes the liquid protein dope to solidify into a silk fiber?",
            options: [
                "Extreme heat application in the spigot",
                "Evaporation of water into the air",
                "Shear forces and a pH drop aligning the proteins",
                "Mixing with a chemical hardener"
            ],
            correct: 2,
            explanation: "As the protein passes through the micro-fluidic duct, shear forces and a drop in pH trigger a liquid-crystalline phase transition, aligning the molecules to form a solid fiber.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for controlling the extrusion rate and final fiber diameter?",
            options: [
                "Primary Ampullate Gland",
                "Spigot Valve",
                "Neuromuscular Actuators",
                "Silk Strand"
            ],
            correct: 1,
            explanation: "The Spigot Valve is a muscular structure that regulates the flow of the protein dope, effectively controlling the thickness and extrusion rate of the silk.",
            difficulty: "Easy"
        },
        {
            question: "If the Micro-Fluidic Duct fails to properly align the protein molecules, what is the most likely cascade failure?",
            options: [
                "The reservoir will rupture",
                "The neuromuscular actuators will freeze",
                "The spigot valve may rupture due to poor flow or the silk will be incredibly weak",
                "The silk will become too strong and break the nozzle"
            ],
            correct: 2,
            explanation: "Improper alignment means the silk doesn't transition properly, leading to weak, brittle silk or blockages that can rupture the spigot valve.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, explodedOut) {
        if (!explodedOut) {
            // Pulsating glow on the liquid inside the gland
            meshes.liquid.material.emissiveIntensity = 0.5 + Math.sin(time * 2 * speed) * 0.3;
            
            // Helix spinning to represent molecular alignment flow
            meshes.helix.rotation.y = time * 3 * speed;
            meshes.helix.material.emissiveIntensity = 0.8 + Math.cos(time * 4 * speed) * 0.4;
            
            // Valve subtle pulsing
            const scale = 1 + Math.sin(time * 5 * speed) * 0.05;
            meshes.valve.scale.set(scale, scale, scale);

            // Silk strand extrusion effect (moving downward)
            meshes.strand.position.y = -5 - (time * speed * 2) % 1;
            
            // Actuators twitching slightly
            meshes.actuators[0].rotation.z = -Math.PI / 6 + Math.sin(time * speed) * 0.05;
            meshes.actuators[1].rotation.z = Math.PI / 6 - Math.sin(time * speed) * 0.05;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSilkSpinneret() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
