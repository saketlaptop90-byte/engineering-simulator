import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Tornado Dissipation Array (TDA) is an atmospheric mega-structure designed to neutralize extreme weather phenomena. Utilizing high-frequency acoustic disruptors and localized barometric manipulation fields, it disperses cyclonic energy before tornadic funnels can touch down.";

    // Custom glowing/neon materials for visual flair
    const cyanGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
    });

    const purpleGlow = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
    });
    
    const coreGlow = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 2.0,
    });

    // Object to track meshes for animation
    const meshes = {};

    // 1. Foundation Matrix (Base)
    const baseGeo = new THREE.CylinderGeometry(15, 18, 2, 8);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Foundation Matrix",
        description: "A massive octagonal platform housing subterranean anchoring spikes and power conduits.",
        material: "darkSteel",
        function: "Provides structural stability against F5-level wind shear.",
        assemblyOrder: 1,
        connections: ["Core Reactor", "Ground"],
        failureEffect: "Structural collapse under extreme lateral wind loads.",
        cascadeFailures: ["Tower Array", "Emitter Rings"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Antimatter Core Reactor (Center tower)
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.CylinderGeometry(4, 5, 20, 16);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    
    // Core energy column
    const energyGeo = new THREE.CylinderGeometry(3.5, 3.5, 21, 16);
    const energyMesh = new THREE.Mesh(energyGeo, coreGlow);
    
    coreGroup.add(coreMesh);
    coreGroup.add(energyMesh);
    coreGroup.position.set(0, 12, 0);
    group.add(coreGroup);
    meshes.core = coreGroup;
    meshes.energyCore = energyMesh;
    
    parts.push({
        name: "Antimatter Core Reactor",
        description: "The primary energy source powering the localized barometric manipulation fields.",
        material: "chrome / coreGlow",
        function: "Generates the massive terawatts needed for atmospheric manipulation.",
        assemblyOrder: 2,
        connections: ["Foundation Matrix", "Barometric Emitter Rings"],
        failureEffect: "Total power loss; unable to sustain dissipation fields.",
        cascadeFailures: ["Barometric Emitter Rings", "Dissipation Pylons"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 3. Spinning Emitter Rings
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 20, 0);
    
    const ring1Geo = new THREE.TorusGeometry(8, 0.5, 16, 32);
    const ring1 = new THREE.Mesh(ring1Geo, cyanGlow);
    ring1.rotation.x = Math.PI / 2;
    ringGroup.add(ring1);
    
    const ring2Geo = new THREE.TorusGeometry(12, 0.5, 16, 32);
    const ring2 = new THREE.Mesh(ring2Geo, purpleGlow);
    ring2.rotation.x = Math.PI / 2;
    ringGroup.add(ring2);

    group.add(ringGroup);
    meshes.ringGroup = ringGroup;

    parts.push({
        name: "Barometric Emitter Rings",
        description: "Superconducting toroids that project acoustic and thermal disruption fields into the upper atmosphere.",
        material: "cyanGlow / purpleGlow",
        function: "Disrupts cyclonic rotation by altering local atmospheric pressure.",
        assemblyOrder: 3,
        connections: ["Antimatter Core Reactor"],
        failureEffect: "Loss of pressure control, resulting in unchecked tornado formation.",
        cascadeFailures: ["Atmospheric Grid"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 4. Dissipation Pylons (around the base)
    const pylonGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const pGeo = new THREE.CylinderGeometry(1, 2, 12, 8);
        const pMesh = new THREE.Mesh(pGeo, steel);
        
        // Pylon energy caps
        const capGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const capMesh = new THREE.Mesh(capGeo, cyanGlow);
        capMesh.position.y = 6;
        pMesh.add(capMesh);

        const angle = (Math.PI / 2) * i;
        const radius = 10;
        pMesh.position.set(Math.cos(angle) * radius, 6, Math.sin(angle) * radius);
        
        // Tilt outwards slightly
        pMesh.rotation.x = Math.sin(angle) * 0.2;
        pMesh.rotation.z = Math.cos(angle) * -0.2;
        
        pylonGroup.add(pMesh);
    }
    group.add(pylonGroup);
    meshes.pylons = pylonGroup;

    parts.push({
        name: "Dissipation Pylons",
        description: "Auxiliary towers arrayed around the main core, generating counter-rotational wind shear.",
        material: "steel / cyanGlow",
        function: "Creates a physical buffer zone of chaotic wind currents.",
        assemblyOrder: 4,
        connections: ["Foundation Matrix"],
        failureEffect: "Reduced efficiency; array can only handle lower category storms.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 25, y: 6, z: 25 }
    });

    // Quiz Questions
    const quizQuestions = [
        {
            question: "What is the primary function of the Barometric Emitter Rings?",
            options: [
                "To generate the power for the structure",
                "To project acoustic and thermal disruption fields",
                "To anchor the array to the ground",
                "To absorb water from the atmosphere"
            ],
            correct: 1,
            explanation: "The Barometric Emitter Rings project fields that disrupt cyclonic rotation by altering local atmospheric pressure.",
            difficulty: "Medium"
        },
        {
            question: "Which component generates the terawatts needed for atmospheric manipulation?",
            options: [
                "Dissipation Pylons",
                "Foundation Matrix",
                "Antimatter Core Reactor",
                "Barometric Emitter Rings"
            ],
            correct: 2,
            explanation: "The Antimatter Core Reactor is the primary energy source that powers the massive manipulation fields.",
            difficulty: "Easy"
        },
        {
            question: "What is the consequence of the Foundation Matrix failing?",
            options: [
                "Structural collapse under extreme lateral wind loads",
                "Total power loss",
                "Reduced efficiency against higher category storms",
                "Nothing, it is redundant"
            ],
            correct: 0,
            explanation: "The Foundation Matrix anchors the array. If it fails, the entire structure will collapse under the wind loads it is trying to dissipate.",
            difficulty: "Hard"
        }
    ];

    // Animation loop
    function animate(time, speed) {
        if (meshes.ringGroup) {
            // Counter-rotating rings
            meshes.ringGroup.children[0].rotation.z = time * speed * 2;
            meshes.ringGroup.children[1].rotation.z = -time * speed * 1.5;
            
            // Pulse the glow
            meshes.ringGroup.children[0].material.emissiveIntensity = 1.5 + Math.sin(time * speed * 4) * 0.5;
            meshes.ringGroup.children[1].material.emissiveIntensity = 1.2 + Math.cos(time * speed * 3) * 0.4;
        }
        
        if (meshes.core) {
            // Rotate the core slowly
            meshes.core.rotation.y = time * speed * 0.5;
        }
        
        if (meshes.energyCore) {
            // Pulse the core energy
            meshes.energyCore.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 8) * 1.0;
        }
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
export function createTornadoDissipationArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
