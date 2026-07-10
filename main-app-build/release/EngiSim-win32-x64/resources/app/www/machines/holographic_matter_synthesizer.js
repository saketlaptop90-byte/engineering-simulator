import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "The Holographic Matter Synthesizer is an ultra-futuristic device that converts pure photon energy and raw plasma into structured physical matter through advanced quantum holographic projection.";

    // Custom Glowing Materials
    const hologramMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9,
    });

    const energyRingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        wireframe: true,
    });

    const neonWhiteMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    // 1. Base Platform
    const baseGeom = new THREE.CylinderGeometry(8, 9, 2, 64);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, -5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Quantum Containment Base",
        description: "A heavy-duty containment platform that stabilizes the localized spacetime fabric for matter synthesis.",
        material: "darkSteel",
        function: "Provides the foundational energy grounding and dimensional stability.",
        assemblyOrder: 1,
        connections: ["Photon Accelerator Ring", "Plasma Core"],
        failureEffect: "Spacetime localized anomalies leading to synthesis collapse.",
        cascadeFailures: ["Matter conversion failure", "Complete system meltdown"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // Decorative inner base
    const innerBaseGeom = new THREE.CylinderGeometry(6, 6.5, 2.5, 32);
    const innerBaseMesh = new THREE.Mesh(innerBaseGeom, chrome);
    innerBaseMesh.position.set(0, -4.8, 0);
    group.add(innerBaseMesh);

    // 2. Plasma Core
    const coreGeom = new THREE.IcosahedronGeometry(2, 2);
    const coreMesh = new THREE.Mesh(coreGeom, plasmaMaterial);
    coreMesh.position.set(0, -2, 0);
    group.add(coreMesh);
    parts.push({
        name: "Pulsing Plasma Core",
        description: "The primary energy source that feeds raw, unstructured exotic matter into the synthesis stream.",
        material: "Neon Magenta (Custom)",
        function: "Supplies the raw building blocks for molecular construction.",
        assemblyOrder: 2,
        connections: ["Quantum Containment Base", "Synthesis Chamber"],
        failureEffect: "Loss of matter generation capability.",
        cascadeFailures: ["Photon accelerator stall"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 12 }
    });

    // 3. Photon Accelerator Rings
    const ringGroup = new THREE.Group();
    const ringGeom = new THREE.TorusGeometry(6, 0.3, 16, 64);
    
    const ring1 = new THREE.Mesh(ringGeom, chrome);
    ring1.rotation.x = Math.PI / 2;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeom, energyRingMaterial);
    ring2.rotation.x = Math.PI / 2;
    ring2.scale.set(0.9, 0.9, 0.9);
    ringGroup.add(ring2);

    ringGroup.position.set(0, 3, 0);
    group.add(ringGroup);
    parts.push({
        name: "Photon Accelerator Ring",
        description: "A super-cooled magnetic torus that accelerates photons to light speed to form the holographic framework.",
        material: "chrome / Glowing Blue",
        function: "Generates the binding energy field for the holographic projection.",
        assemblyOrder: 3,
        connections: ["Plasma Core", "Holographic Emitters"],
        failureEffect: "Holographic blueprint destabilization.",
        cascadeFailures: ["Object deformation"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 15, y: 3, z: 0 }
    });

    // 4. Synthesis Chamber (Glass containment)
    const chamberGeom = new THREE.CylinderGeometry(5, 5, 8, 32, 1, true);
    const chamberMesh = new THREE.Mesh(chamberGeom, tinted);
    chamberMesh.position.set(0, 3, 0);
    group.add(chamberMesh);
    parts.push({
        name: "Synthesis Chamber",
        description: "A hardened transparent enclosure that isolates the matter-generation environment.",
        material: "tinted",
        function: "Maintains a perfect vacuum to prevent atmospheric interference during synthesis.",
        assemblyOrder: 4,
        connections: ["Photon Accelerator Ring", "Quantum Containment Base"],
        failureEffect: "Atmospheric contamination of synthesized matter.",
        cascadeFailures: ["Explosive decompression"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 3, z: -15 }
    });

    // 5. Holographic Projector Emitters (Top array)
    const topArray = new THREE.Group();
    const topBaseGeom = new THREE.CylinderGeometry(5.5, 6, 1, 32);
    const topBaseMesh = new THREE.Mesh(topBaseGeom, aluminum);
    topArray.add(topBaseMesh);

    // Emitter nozzles
    const emitterMeshes = [];
    for (let i = 0; i < 4; i++) {
        const emitterGeom = new THREE.ConeGeometry(0.8, 2, 16);
        const emitterMesh = new THREE.Mesh(emitterGeom, copper);
        emitterMesh.position.set(
            Math.cos((i * Math.PI) / 2) * 3,
            -1,
            Math.sin((i * Math.PI) / 2) * 3
        );
        emitterMesh.rotation.x = Math.PI;
        topArray.add(emitterMesh);

        // Beam
        const beamGeom = new THREE.CylinderGeometry(0.1, 0.3, 4, 16);
        const beamMesh = new THREE.Mesh(beamGeom, neonWhiteMaterial);
        beamMesh.position.set(
            Math.cos((i * Math.PI) / 2) * 3,
            -3,
            Math.sin((i * Math.PI) / 2) * 3
        );
        emitterMeshes.push(beamMesh);
        topArray.add(beamMesh);
    }

    topArray.position.set(0, 7.5, 0);
    group.add(topArray);
    parts.push({
        name: "Holographic Emitters",
        description: "High-precision laser emitters that project the quantum blueprint into the chamber.",
        material: "aluminum / copper",
        function: "Guides the plasma into the correct molecular structure.",
        assemblyOrder: 5,
        connections: ["Synthesis Chamber"],
        failureEffect: "Incomplete or mutated matter generation.",
        cascadeFailures: ["Blueprint corruption"],
        originalPosition: { x: 0, y: 7.5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 6. The Synthesized Object (Hologram turning into solid)
    const objectGroup = new THREE.Group();
    const objectGeom = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    
    // Wireframe hologram
    const objectHolo = new THREE.Mesh(objectGeom, hologramMaterial);
    objectGroup.add(objectHolo);
    
    // Solid core forming inside
    const objectSolid = new THREE.Mesh(objectGeom, steel);
    objectSolid.scale.set(0.9, 0.9, 0.9);
    objectGroup.add(objectSolid);

    objectGroup.position.set(0, 3, 0);
    group.add(objectGroup);
    parts.push({
        name: "Synthesizing Object",
        description: "The target item currently undergoing matter synthesis.",
        material: "Hologram / Steel",
        function: "The final product of the synthesis process.",
        assemblyOrder: 6,
        connections: ["Synthesis Chamber"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // Mesh Dictionary for Animation
    const meshes = {
        coreMesh,
        ringGroup,
        ring2,
        topArray,
        emitterMeshes,
        objectGroup,
        objectHolo,
        objectSolid
    };

    const quizQuestions = [
        {
            question: "What is the primary function of the Photon Accelerator Ring?",
            options: [
                "To cool down the plasma core",
                "To generate the binding energy field for the holographic projection",
                "To extract the finished object",
                "To provide an atmosphere in the chamber"
            ],
            correct: 1,
            explanation: "The Photon Accelerator Ring spins to accelerate photons, creating the energetic binding field needed to hold the holographic blueprint together.",
            difficulty: "Medium"
        },
        {
            question: "Why must the Synthesis Chamber maintain a perfect vacuum?",
            options: [
                "To make the machine lighter",
                "To prevent atmospheric interference and contamination of synthesized matter",
                "To increase the speed of the spinning ring",
                "To keep the glass from shattering"
            ],
            correct: 1,
            explanation: "Any atmospheric gases inside the chamber could become trapped in the molecular structure of the newly formed matter, contaminating it.",
            difficulty: "Easy"
        },
        {
            question: "Which component supplies the raw building blocks for molecular construction?",
            options: [
                "Holographic Emitters",
                "Base Platform",
                "Pulsing Plasma Core",
                "Photon Accelerator Ring"
            ],
            correct: 2,
            explanation: "The Pulsing Plasma Core feeds raw, unstructured exotic matter (plasma) into the stream, which is then shaped by the holograms.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsing Plasma Core
        const scalePhase = Math.sin(time * 3 * speed) * 0.1 + 1;
        meshes.coreMesh.scale.set(scalePhase, scalePhase, scalePhase);
        meshes.coreMesh.rotation.y += 0.02 * speed;
        meshes.coreMesh.rotation.x += 0.01 * speed;

        // Rotating Photon Accelerator Rings
        meshes.ringGroup.rotation.y += 0.05 * speed;
        meshes.ring2.rotation.z -= 0.1 * speed;

        // Holographic Emitters pulsing beams
        const beamOpacity = (Math.sin(time * 10 * speed) + 1) / 2 * 0.5 + 0.3;
        meshes.emitterMeshes.forEach(beam => {
            beam.material.opacity = beamOpacity;
        });

        // The Synthesized Object spinning and pulsing
        meshes.objectGroup.rotation.y += 0.03 * speed;
        meshes.objectGroup.rotation.x += 0.015 * speed;
        
        // Hologram opacity fluctuates
        const holoOpacity = (Math.sin(time * 5 * speed) + 1) / 2 * 0.4 + 0.4;
        meshes.objectHolo.material.opacity = holoOpacity;
        
        // Solid object scaling up and down slightly to simulate formation
        const solidScale = (Math.sin(time * speed) + 1) / 2 * 0.1 + 0.85;
        meshes.objectSolid.scale.set(solidScale, solidScale, solidScale);
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
