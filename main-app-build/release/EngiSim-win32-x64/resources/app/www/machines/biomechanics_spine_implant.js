import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const titaniumMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xa0a0a0,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
    });

    const boneMaterial = new THREE.MeshStandardMaterial({
        color: 0xefdfc8,
        roughness: 0.6,
        metalness: 0.1
    });

    const glowingDiscMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const rodMaterial = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0x000022
    });

    // We'll create a section of the spine: 2 vertebrae, 1 glowing artificial disc, pedicle screws, and connecting rods.

    // 1. Vertebra L4 (Top)
    const vertebraGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 32);
    // Make it look a bit more organic
    vertebraGeometry.scale(1, 1, 0.8);
    
    const l4Vertebra = new THREE.Mesh(vertebraGeometry, boneMaterial);
    l4Vertebra.position.set(0, 1.5, 0);
    group.add(l4Vertebra);
    
    parts.push({
        name: "L4 Vertebra (Host Bone)",
        description: "The upper vertebral body in this lumbar segment. It provides the upper anchor point for the pedicle screws.",
        material: "Cortical & Cancellous Bone",
        function: "Supports weight and protects the spinal cord.",
        assemblyOrder: 1,
        connections: ["Artificial Disc", "L4 Pedicle Screws"],
        failureEffect: "Osteoporosis or fracture could cause pedicle screw pull-out.",
        cascadeFailures: ["Implant loosening", "Segmental instability"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4.0, z: 0 }
    });

    // 2. Glowing Artificial Intervertebral Disc
    const discGeometry = new THREE.CylinderGeometry(1.4, 1.4, 0.6, 32);
    discGeometry.scale(1, 1, 0.8);
    const artificialDisc = new THREE.Mesh(discGeometry, glowingDiscMaterial);
    artificialDisc.position.set(0, 0.6, 0);
    group.add(artificialDisc);

    parts.push({
        name: "Cybernetic Intervertebral Disc",
        description: "A high-tech glowing replacement for a degenerated disc, maintaining disc height and shock absorption.",
        material: "Hydrogel and Bio-compatible Polymers",
        function: "Shock absorption and flexibility preservation.",
        assemblyOrder: 2,
        connections: ["L4 Vertebra", "L5 Vertebra"],
        failureEffect: "Loss of disc height and increased stress on adjacent segments.",
        cascadeFailures: ["Adjacent segment disease", "Hardware stress"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: -3, y: 0.6, z: 0 }
    });

    // 3. Vertebra L5 (Bottom)
    const l5Vertebra = new THREE.Mesh(vertebraGeometry, boneMaterial);
    l5Vertebra.position.set(0, -0.3, 0);
    group.add(l5Vertebra);

    parts.push({
        name: "L5 Vertebra (Host Bone)",
        description: "The lower vertebral body in this segment, anchoring the lower pedicle screws.",
        material: "Cortical & Cancellous Bone",
        function: "Base support for the spinal segment.",
        assemblyOrder: 3,
        connections: ["Artificial Disc", "L5 Pedicle Screws"],
        failureEffect: "Fracture or screw pull-out.",
        cascadeFailures: ["Construct collapse", "Nerve compression"],
        originalPosition: { x: 0, y: -0.3, z: 0 },
        explodedPosition: { x: 0, y: -3.0, z: 0 }
    });

    // 4. Pedicle Screws (4 total: 2 on L4, 2 on L5)
    const screwHeadGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const screwShaftGeo = new THREE.CylinderGeometry(0.1, 0.05, 1.2, 16);
    
    // Function to create a screw
    const createScrew = (x, y, z, rotX, rotZ, namePrefix, id) => {
        const screwGroup = new THREE.Group();
        
        const head = new THREE.Mesh(screwHeadGeo, titaniumMaterial);
        const shaft = new THREE.Mesh(screwShaftGeo, titaniumMaterial);
        
        shaft.position.y = -0.6;
        
        screwGroup.add(head);
        screwGroup.add(shaft);
        
        screwGroup.position.set(x, y, z);
        screwGroup.rotation.x = rotX;
        screwGroup.rotation.z = rotZ;
        
        group.add(screwGroup);
        
        parts.push({
            name: `${namePrefix} Pedicle Screw ${id}`,
            description: `Titanium pedicle screw inserted into the ${namePrefix} pedicle to anchor the connecting rod.`,
            material: "Medical Grade Titanium Alloy",
            function: "Anchors the fixation construct to the bone.",
            assemblyOrder: 4 + id,
            connections: ["Connecting Rod", `${namePrefix} Vertebra`],
            failureEffect: "Screw loosening or breakage under cyclical loading.",
            cascadeFailures: ["Loss of fixation", "Pseudoarthrosis"],
            originalPosition: { x, y, z },
            explodedPosition: { x: x * 3, y: y, z: z * 3 }
        });
        
        return screwGroup;
    };

    const l4ScrewL = createScrew(-1.2, 1.5, -0.8, Math.PI/2, Math.PI/8, "L4", 1);
    const l4ScrewR = createScrew(1.2, 1.5, -0.8, Math.PI/2, -Math.PI/8, "L4", 2);
    const l5ScrewL = createScrew(-1.2, -0.3, -0.8, Math.PI/2, Math.PI/8, "L5", 3);
    const l5ScrewR = createScrew(1.2, -0.3, -0.8, Math.PI/2, -Math.PI/8, "L5", 4);

    // 5. Connecting Rods (2 total: Left and Right)
    const rodGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.0, 16);
    
    const rodLeft = new THREE.Mesh(rodGeo, rodMaterial);
    rodLeft.position.set(-1.2, 0.6, -1.0);
    group.add(rodLeft);
    
    parts.push({
        name: "Left Connecting Rod",
        description: "High-strength rod connecting the left pedicle screws.",
        material: "Cobalt Chrome or Titanium",
        function: "Provides rigidity and maintains alignment between vertebrae.",
        assemblyOrder: 8,
        connections: ["L4 Pedicle Screw 1", "L5 Pedicle Screw 3"],
        failureEffect: "Rod fracture due to metal fatigue.",
        cascadeFailures: ["Complete construct failure", "Pain and instability"],
        originalPosition: { x: -1.2, y: 0.6, z: -1.0 },
        explodedPosition: { x: -4, y: 0.6, z: -2.0 }
    });

    const rodRight = new THREE.Mesh(rodGeo, rodMaterial);
    rodRight.position.set(1.2, 0.6, -1.0);
    group.add(rodRight);

    parts.push({
        name: "Right Connecting Rod",
        description: "High-strength rod connecting the right pedicle screws.",
        material: "Cobalt Chrome or Titanium",
        function: "Provides rigidity and maintains alignment between vertebrae.",
        assemblyOrder: 9,
        connections: ["L4 Pedicle Screw 2", "L5 Pedicle Screw 4"],
        failureEffect: "Rod fracture due to metal fatigue.",
        cascadeFailures: ["Complete construct failure", "Pain and instability"],
        originalPosition: { x: 1.2, y: 0.6, z: -1.0 },
        explodedPosition: { x: 4, y: 0.6, z: -2.0 }
    });

    const description = "An advanced biomechanical spine implant featuring titanium pedicle screws, high-strength connecting rods, and a cybernetic glowing artificial disc for optimal shock absorption and motion preservation.";

    const quizQuestions = [
        {
            question: "What is the primary function of a pedicle screw in spinal fixation?",
            options: [
                "To replace the intervertebral disc",
                "To anchor the connecting rods securely to the vertebral body",
                "To provide electrical stimulation to the spinal cord",
                "To lubricate the spinal joints"
            ],
            correct: 1,
            explanation: "Pedicle screws are threaded into the pedicles of the vertebrae to serve as strong anchor points for the rods that stabilize the spine.",
            difficulty: "Beginner"
        },
        {
            question: "Why might a surgeon choose Titanium over Stainless Steel for spinal implants?",
            options: [
                "Titanium is magnetic and helps with MRIs",
                "Titanium has better biocompatibility and is more MRI-friendly (less artifact)",
                "Titanium is significantly heavier, providing more stability",
                "Stainless steel dissolves over time"
            ],
            correct: 1,
            explanation: "Titanium is highly biocompatible, strong, lightweight, and produces much less artifact on MRI scans compared to stainless steel.",
            difficulty: "Intermediate"
        },
        {
            question: "What is 'adjacent segment disease' in the context of spinal fusion?",
            options: [
                "An infection that spreads to the nearest bone",
                "Accelerated degeneration of the intervertebral discs immediately above or below the fused segment",
                "A disease where the patient develops extra vertebrae",
                "The rejection of the titanium implant"
            ],
            correct: 1,
            explanation: "Because a fused segment is rigid, the adjacent mobile segments must compensate with increased motion and stress, often leading to accelerated wear and tear (adjacent segment disease).",
            difficulty: "Advanced"
        }
    ];

    function animate(time, speed, meshes) {
        // Subtle breathing/pulsing effect on the glowing disc
        if (meshes.length > 1) {
            const disc = meshes[1]; // artificialDisc is index 1 in the group
            const scalePulse = 1 + Math.sin(time * speed * 2) * 0.05;
            disc.scale.set(scalePulse, 1, scalePulse);
            
            if (disc.material.emissiveIntensity !== undefined) {
                disc.material.emissiveIntensity = 0.6 + Math.sin(time * speed * 4) * 0.4;
            }
        }
        
        // Slight flexion/extension simulation of the spine segment
        group.rotation.x = Math.sin(time * speed) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpineImplant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
