import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const energyCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        transmission: 0.9,
        ior: 1.5,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const magneticCoilMat = new THREE.MeshStandardMaterial({
        color: 0x221144,
        metalness: 0.9,
        roughness: 0.4,
        emissive: 0x442288,
        emissiveIntensity: 0.5
    });
    
    const energyRingMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.5,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const plateMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 2.0
    });

    // 1. Quantum Containment Vessel (Core)
    const coreGeo = new THREE.IcosahedronGeometry(2, 4);
    const coreMesh = new THREE.Mesh(coreGeo, energyCoreMat);
    coreMesh.position.set(0, 0, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;
    
    // Core Inner pulsing star
    const innerStarGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerStarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0 });
    const innerStarMesh = new THREE.Mesh(innerStarGeo, innerStarMat);
    coreMesh.add(innerStarMesh);
    meshes.innerStar = innerStarMesh;

    parts.push({
        name: "Quantum Containment Vessel",
        description: "The central core where vacuum fluctuations are isolated and harvested. It maintains an absolute zero localized vacuum field.",
        material: "Energy/Plasma",
        function: "Isolates a pocket of spacetime to exploit zero-point energy.",
        assemblyOrder: 1,
        connections: ["Casimir Plate Arrays", "Energy Transduction Rings"],
        failureEffect: "Uncontrolled quantum tunneling and catastrophic energy release.",
        cascadeFailures: ["Vaporizes surrounding containment structures.", "Creates localized micro-singularities."],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 2. Casimir Plate Arrays
    const plateCount = 12;
    meshes.plates = [];
    for (let i = 0; i < plateCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / plateCount);
        const theta = Math.sqrt(plateCount * Math.PI) * phi;
        
        const plateGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const plate = new THREE.Mesh(plateGeo, plateMat);
        
        const r = 3.5;
        plate.position.set(
            r * Math.cos(theta) * Math.sin(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(phi)
        );
        plate.lookAt(0, 0, 0);
        
        group.add(plate);
        meshes.plates.push(plate);
    }

    parts.push({
        name: "Casimir Plate Arrays",
        description: "Nanoscale-engineered plates configured to maximize the Casimir effect, creating negative energy density regions.",
        material: "Ultra-dense reflective alloy",
        function: "Amplifies vacuum fluctuations to extract macroscopic usable energy.",
        assemblyOrder: 2,
        connections: ["Quantum Containment Vessel", "Vacuum Resonance Chamber"],
        failureEffect: "Drop in energy extraction efficiency, thermal runaway.",
        cascadeFailures: ["Loss of negative energy density.", "Meltdown of the resonance chamber."],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 10, z: 10 }
    });

    // 3. Superconducting Magnetic Coils
    meshes.coils = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const torusGeo = new THREE.TorusGeometry(5 + i * 1.5, 0.3, 32, 100);
        const coilMesh = new THREE.Mesh(torusGeo, magneticCoilMat);
        coilMesh.rotation.x = Math.PI / 2;
        coilMesh.rotation.y = (i * Math.PI) / 3;
        meshes.coils.add(coilMesh);
    }
    group.add(meshes.coils);

    parts.push({
        name: "Superconducting Magnetic Coils",
        description: "Massive electromagnetic toroids operating at cryogenic temperatures.",
        material: "Superconducting Copper/Niobium-Titanium",
        function: "Shapes and directs the turbulent quantum energy into a stable extractable flow.",
        assemblyOrder: 3,
        connections: ["Vacuum Resonance Chamber", "Energy Transduction Rings"],
        failureEffect: "Magnetic field collapse, releasing erratic plasma arcs.",
        cascadeFailures: ["Destroys transduction rings.", "Breaches containment vessel."],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: -5, z: 15 }
    });

    // 4. Energy Transduction Rings
    meshes.transductionRings = new THREE.Group();
    for (let i = 0; i < 2; i++) {
        const ringGeo = new THREE.TorusGeometry(8 + i * 2, 0.5, 16, 64);
        const ringMesh = new THREE.Mesh(ringGeo, energyRingMat);
        ringMesh.rotation.x = Math.PI / (i + 2);
        meshes.transductionRings.add(ringMesh);
    }
    group.add(meshes.transductionRings);

    parts.push({
        name: "Energy Transduction Rings",
        description: "Rotating wireframe rings that capture the directed vacuum energy.",
        material: "Photonic Metamaterial",
        function: "Converts raw zero-point field energy into usable high-voltage plasma/electrical power.",
        assemblyOrder: 4,
        connections: ["Superconducting Magnetic Coils", "Power Grid Output"],
        failureEffect: "Inability to offload power, causing severe energy backlog.",
        cascadeFailures: ["Overloads magnetic coils.", "Triggers a core implosion."],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: -10, z: -15 }
    });

    // 5. Vacuum Resonance Chamber (Outer Frame)
    const frameGeo = new THREE.DodecahedronGeometry(11, 1);
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    group.add(frameMesh);
    meshes.frame = frameMesh;

    parts.push({
        name: "Vacuum Resonance Chamber",
        description: "The imposing outer scaffold that structurally supports all high-stress components.",
        material: "Dark Steel / Chrome",
        function: "Provides structural integrity against intense gravitational and magnetic shearing forces.",
        assemblyOrder: 5,
        connections: ["Superconducting Magnetic Coils", "Casimir Plate Arrays"],
        failureEffect: "Structural collapse under extreme localized gravity.",
        cascadeFailures: ["Total system destruction.", "Black hole formation."],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });
    
    // Add glowing particle nodes at frame vertices
    const posAttribute = frameGeo.getAttribute('position');
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = [];
    for(let i=0; i<posAttribute.count; i++) {
        particlePositions.push(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
    }
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x00ffcc, size: 0.4, transparent: true, opacity: 0.8 });
    meshes.particles = new THREE.Points(particleGeo, particleMat);
    frameMesh.add(meshes.particles);

    const description = "The Zero-Point Energy Extractor, also known as a Vacuum Fluctuation Harvester, is a pinnacle of Type II civilization technology. By manipulating the Casimir effect and stabilizing localized regions of absolute zero vacuum, it extracts limitless energy directly from the quantum foam of spacetime. Its operation involves balancing extreme magnetic fields, quantum containment, and energy transduction to prevent catastrophic localized singularity events.";

    const quizQuestions = [
        {
            question: "What physical phenomenon does the Casimir Plate Array exploit to harvest energy?",
            options: [
                "Nuclear fusion",
                "The Casimir effect and vacuum fluctuations",
                "Magnetic induction",
                "Photoelectric effect"
            ],
            correct: 1,
            explanation: "The Casimir Plate Array uses the Casimir effect, which arises from quantized vacuum fluctuations, to create negative energy density regions for extraction.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for converting raw zero-point energy into usable power?",
            options: [
                "Vacuum Resonance Chamber",
                "Superconducting Magnetic Coils",
                "Quantum Containment Vessel",
                "Energy Transduction Rings"
            ],
            correct: 3,
            explanation: "The Energy Transduction Rings capture the directed vacuum energy and convert it into high-voltage electrical or plasma power.",
            difficulty: "Easy"
        },
        {
            question: "What is a potential catastrophic consequence of the Vacuum Resonance Chamber failing?",
            options: [
                "Mild overheating",
                "Loss of electrical grounding",
                "Total system destruction and potential black hole formation",
                "Coolant leakage"
            ],
            correct: 2,
            explanation: "Because the machine handles extreme gravitational and magnetic shearing forces, a failure in structural integrity can lead to total destruction and localized micro-singularity (black hole) formation.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed) {
        // Pulse the core
        const coreScale = 1 + 0.05 * Math.sin(time * 3 * speed);
        meshes.core.scale.set(coreScale, coreScale, coreScale);
        meshes.core.rotation.y += 0.02 * speed;
        meshes.core.rotation.z += 0.01 * speed;
        
        meshes.innerStar.rotation.x -= 0.05 * speed;
        meshes.innerStar.rotation.y -= 0.04 * speed;
        
        // Pulse energy core emission
        meshes.core.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(time * 5 * speed);

        // Rotate and pulsate Casimir plates
        meshes.plates.forEach((plate, index) => {
            const offset = index * 0.5;
            plate.position.setLength(3.5 + 0.3 * Math.sin(time * 2 * speed + offset));
            // Slight jitter
            plate.rotation.z = 0.1 * Math.sin(time * 10 * speed + index);
        });

        // Rotate magnetic coils on multiple axes
        meshes.coils.rotation.x = Math.sin(time * 0.5 * speed) * 0.5;
        meshes.coils.rotation.y += 0.01 * speed;
        meshes.coils.rotation.z += 0.005 * speed;
        
        // Rapid rotation of transduction rings
        meshes.transductionRings.children[0].rotation.y += 0.05 * speed;
        meshes.transductionRings.children[1].rotation.x += 0.07 * speed;
        
        meshes.transductionRings.children.forEach(ring => {
            ring.material.opacity = 0.5 + 0.5 * Math.sin(time * 10 * speed);
        });

        // Slow rotation of outer frame
        meshes.frame.rotation.y -= 0.005 * speed;
        meshes.frame.rotation.x -= 0.002 * speed;
        
        // Blink particles
        meshes.particles.material.size = 0.4 + 0.2 * Math.sin(time * 8 * speed);
    }

    return { group, parts, description, quizQuestions, animate };
}
