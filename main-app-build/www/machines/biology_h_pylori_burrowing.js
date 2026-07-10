import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Materials
    const cellBodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x88ff88,
        emissive: 0x228822,
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
    });

    const flagellaMaterial = new THREE.MeshPhongMaterial({
        color: 0x44cc44,
        emissive: 0x116611,
        shininess: 50,
        wireframe: false
    });

    const mucusMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaaaa,
        emissive: 0x441111,
        transmission: 0.8,
        opacity: 0.6,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1
    });

    const ureaseMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0x888800,
        roughness: 0.4
    });

    // 1. Cell Body (Corkscrew shape)
    class HelicalCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const a = 1.5; // radius
            const b = 6;  // height factor
            const t2 = (t - 0.5) * Math.PI * 4; // 2 turns
            const x = Math.cos(t2) * a;
            const y = t2 * (b / (Math.PI * 4));
            const z = Math.sin(t2) * a;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    const path = new HelicalCurve(1);
    const bodyGeometry = new THREE.TubeGeometry(path, 64, 0.8, 16, false);
    const bodyMesh = new THREE.Mesh(bodyGeometry, cellBodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);
    meshes.body = bodyMesh;

    parts.push({
        name: "Helical Cell Body",
        description: "The corkscrew-shaped main body of H. pylori, evolved to penetrate the viscous mucous lining of the stomach.",
        material: cellBodyMaterial,
        function: "Enables drilling-like motion through dense gastric mucus.",
        assemblyOrder: 1,
        connections: ["Flagella", "Urease Enzymes"],
        failureEffect: "Inability to penetrate mucus, leading to clearance by stomach acid.",
        cascadeFailures: ["Gastric colonization failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Flagella (Multiple at one end)
    const flagellaGroup = new THREE.Group();
    flagellaGroup.position.set(Math.cos(-2*Math.PI)*1.5, -3, Math.sin(-2*Math.PI)*1.5);
    
    const flagellaCurves = [];
    for(let i=0; i<5; i++) {
        class FlagellumCurve extends THREE.Curve {
            constructor(offsetAngle) {
                super();
                this.offsetAngle = offsetAngle;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const len = 8;
                const freq = 4 * Math.PI;
                const amp = 0.5;
                const y = -t * len;
                const x = Math.cos(t * freq + this.offsetAngle) * amp;
                const z = Math.sin(t * freq + this.offsetAngle) * amp;
                return optionalTarget.set(x, y, z);
            }
        }
        const curve = new FlagellumCurve((i / 5) * Math.PI * 2);
        const geo = new THREE.TubeGeometry(curve, 32, 0.1, 8, false);
        const mesh = new THREE.Mesh(geo, flagellaMaterial);
        flagellaGroup.add(mesh);
        flagellaCurves.push(mesh);
    }
    
    bodyMesh.add(flagellaGroup);
    meshes.flagellaGroup = flagellaGroup;
    meshes.flagella = flagellaCurves;

    parts.push({
        name: "Lophotrichous Flagella",
        description: "A tuft of flagella at one pole of the bacterium acting as a powerful propeller.",
        material: flagellaMaterial,
        function: "Generates thrust to push the helical body forward like a screw.",
        assemblyOrder: 2,
        connections: ["Helical Cell Body"],
        failureEffect: "Loss of motility.",
        cascadeFailures: ["Inability to reach the protective epithelial layer"],
        originalPosition: { x: 1.5, y: -3, z: 0 },
        explodedPosition: { x: 5, y: -8, z: 5 }
    });

    // 3. Gastric Mucus Environment
    const mucusGeo = new THREE.BoxGeometry(15, 20, 15);
    const mucusMesh = new THREE.Mesh(mucusGeo, mucusMaterial);
    mucusMesh.position.set(0, 0, 0);
    group.add(mucusMesh);
    meshes.mucus = mucusMesh;

    parts.push({
        name: "Gastric Mucus Layer",
        description: "The thick, viscous, and acidic protective layer lining the stomach.",
        material: mucusMaterial,
        function: "Protects stomach lining from acid; presents a formidable physical barrier to most bacteria.",
        assemblyOrder: 3,
        connections: [],
        failureEffect: "Ulceration of stomach lining (host failure).",
        cascadeFailures: ["Gastric tissue damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -20 }
    });

    // 4. Urease Enzyme Cloud (Glowing Particles)
    const particleCount = 200;
    const ureaseGeo = new THREE.BufferGeometry();
    const ureasePositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        ureasePositions[i] = (Math.random() - 0.5) * 8;
    }
    ureaseGeo.setAttribute('position', new THREE.BufferAttribute(ureasePositions, 3));
    const ureaseMat = new THREE.PointsMaterial({
        color: 0xffff00,
        size: 0.3,
        transparent: true,
        opacity: 0.8
    });
    const ureaseParticles = new THREE.Points(ureaseGeo, ureaseMat);
    bodyMesh.add(ureaseParticles);
    meshes.urease = ureaseParticles;

    parts.push({
        name: "Urease Enzyme Secretion",
        description: "Enzymes secreted to convert urea into ammonia and CO2, neutralizing local stomach acid.",
        material: ureaseMaterial,
        function: "Liquefies the mucus (reduces viscosity) and neutralizes acidity, creating a safe micro-environment.",
        assemblyOrder: 4,
        connections: ["Helical Cell Body"],
        failureEffect: "Bacterium is destroyed by stomach acid before penetrating mucus.",
        cascadeFailures: ["Colonization failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 }
    });

    const description = "Helicobacter pylori (H. pylori) is an extraordinary bacterium that colonizes the human stomach. It utilizes a highly specialized biomechanical approach: a corkscrew-shaped body driven by a tuft of flagella, allowing it to drill into the thick gastric mucus. Simultaneously, it secretes urease to neutralize acid and lower mucus viscosity, ensuring its survival in one of the body's harshest environments.";

    const quizQuestions = [
        {
            question: "What is the primary function of the corkscrew (helical) shape of H. pylori?",
            options: [
                "To evade the immune system",
                "To drill through the viscous gastric mucus",
                "To store more nutrients",
                "To attach to red blood cells"
            ],
            correct: 1,
            explanation: "The helical shape allows H. pylori to move in a corkscrew fashion, which is highly efficient for penetrating dense, viscous fluids like gastric mucus.",
            difficulty: "Medium"
        },
        {
            question: "How does H. pylori survive the extremely acidic environment of the stomach?",
            options: [
                "It has an acid-resistant diamond-like shell",
                "It rapidly divides to replace dead cells",
                "It secretes urease to neutralize the acid around it",
                "It lives inside stomach acid cells"
            ],
            correct: 2,
            explanation: "H. pylori secretes the enzyme urease, which converts urea into ammonia and CO2. This creates a localized neutral cloud around the bacterium, protecting it from the acid.",
            difficulty: "Medium"
        },
        {
            question: "What term describes the arrangement of flagella found on H. pylori?",
            options: [
                "Peritrichous",
                "Monotrichous",
                "Lophotrichous",
                "Amphitrichous"
            ],
            correct: 2,
            explanation: "H. pylori has a tuft of flagella at one pole, which is termed 'lophotrichous'. This arrangement acts as a powerful propeller to drive its corkscrew motion.",
            difficulty: "Hard"
        }
    ];

    let tAccum = 0;
    function animate(time, speed, activeMeshes) {
        const currentSpeed = speed * 2;
        tAccum += currentSpeed * 0.05;

        if (activeMeshes.body) {
            activeMeshes.body.rotation.y = -tAccum * 5;
            activeMeshes.body.position.y = Math.sin(tAccum) * 2;
        }

        if (activeMeshes.flagellaGroup) {
            activeMeshes.flagellaGroup.rotation.y = tAccum * 15;
        }

        if (activeMeshes.urease) {
            activeMeshes.urease.rotation.y = tAccum;
            activeMeshes.urease.rotation.x = tAccum * 0.5;
            const scale = 1 + Math.sin(tAccum * 3) * 0.1;
            activeMeshes.urease.scale.set(scale, scale, scale);
        }

        if (activeMeshes.mucus) {
            const phase = (Math.sin(tAccum * 0.5) + 1) / 2;
            activeMeshes.mucus.material.opacity = 0.4 + phase * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createHPyloriBurrowing() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
