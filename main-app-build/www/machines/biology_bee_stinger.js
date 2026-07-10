import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonVenom = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00aa88,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const bioSteel = new THREE.MeshStandardMaterial({
        color: 0x223344,
        metalness: 0.9,
        roughness: 0.3,
        emissive: 0x001122
    });

    const energyCore = new THREE.MeshBasicMaterial({
        color: 0xff3366,
        wireframe: true
    });

    const muscleFiber = new THREE.MeshStandardMaterial({
        color: 0xcc3333,
        roughness: 0.8,
        metalness: 0.1
    });

    // 1. Venom Bulb (Sac)
    const bulbGeometry = new THREE.SphereGeometry(2, 32, 32);
    bulbGeometry.scale(1, 1.5, 1);
    const venomBulb = new THREE.Mesh(bulbGeometry, neonVenom);
    venomBulb.position.set(0, 5, 0);
    group.add(venomBulb);
    meshes.venomBulb = venomBulb;

    parts.push({
        name: "Venom Bulb Reservoir",
        description: "The primary containment sac for apitoxin, glowing with high-energy bio-luminescence.",
        material: "neonVenom",
        function: "Stores and pumps venom into the victim through muscular contraction.",
        assemblyOrder: 1,
        connections: ["Muscular Pump", "Venom Canal"],
        failureEffect: "Venom leakage, halting the offensive mechanism.",
        cascadeFailures: ["Loss of stinging lethality", "Autointoxication"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Muscular Pump
    const pumpGeometry = new THREE.TorusGeometry(2.1, 0.4, 16, 50);
    const pump1 = new THREE.Mesh(pumpGeometry, muscleFiber);
    pump1.position.set(0, 4.5, 0);
    pump1.rotation.x = Math.PI / 2;
    group.add(pump1);
    meshes.pump1 = pump1;

    const pump2 = new THREE.Mesh(pumpGeometry, muscleFiber);
    pump2.position.set(0, 5.5, 0);
    pump2.rotation.x = Math.PI / 2;
    group.add(pump2);
    meshes.pump2 = pump2;

    parts.push({
        name: "Contractile Muscle Network",
        description: "Striated muscular bands wrapping the venom sac.",
        material: "muscleFiber",
        function: "Contracts rhythmically to force venom down the canal, even after detachment.",
        assemblyOrder: 2,
        connections: ["Venom Bulb Reservoir", "Motor Ganglion"],
        failureEffect: "Inability to inject venom.",
        cascadeFailures: ["Venom stagnation"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 4 }
    });

    // 3. Motor Ganglion
    const ganglionGeom = new THREE.IcosahedronGeometry(0.8, 1);
    const ganglion = new THREE.Mesh(ganglionGeom, energyCore);
    ganglion.position.set(0, 6.5, 1.5);
    group.add(ganglion);
    meshes.ganglion = ganglion;

    parts.push({
        name: "Autonomous Motor Ganglion",
        description: "A centralized nerve cluster acting as a standalone control unit.",
        material: "energyCore",
        function: "Drives the muscular contractions to pump venom and work the lancets independently.",
        assemblyOrder: 3,
        connections: ["Contractile Muscle Network", "Lancet Actuators"],
        failureEffect: "Stinger mechanism paralyzes.",
        cascadeFailures: ["Muscular Pump failure", "Lancet paralysis"],
        originalPosition: { x: 0, y: 6.5, z: 1.5 },
        explodedPosition: { x: 0, y: 8, z: 5 }
    });

    // 4. Stylet (Main Shaft)
    const styletGeom = new THREE.CylinderGeometry(0.2, 0.05, 8, 16);
    const stylet = new THREE.Mesh(styletGeom, bioSteel);
    stylet.position.set(0, 0, 0);
    group.add(stylet);
    meshes.stylet = stylet;

    parts.push({
        name: "Central Stylet Guide",
        description: "The main rigid rail of the stinger structure.",
        material: "bioSteel",
        function: "Provides structural support and tracks for the lancets to slide along.",
        assemblyOrder: 4,
        connections: ["Venom Bulb Reservoir", "Barbed Lancets"],
        failureEffect: "Stinger bends or snaps upon impact.",
        cascadeFailures: ["Lancets derail", "Complete mechanical jam"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: -3 }
    });

    // 5. Left Lancet
    const lancetGeom = new THREE.ConeGeometry(0.15, 8.2, 8);
    const leftLancet = new THREE.Mesh(lancetGeom, chrome);
    leftLancet.position.set(-0.25, 0, 0.1);
    group.add(leftLancet);
    meshes.leftLancet = leftLancet;

    // Left Barbs
    const barbGeom = new THREE.ConeGeometry(0.08, 0.4, 4);
    for (let i = 0; i < 6; i++) {
        const barb = new THREE.Mesh(barbGeom, chrome);
        barb.position.set(-0.35, -3 + i * 0.8, 0.1);
        barb.rotation.z = Math.PI / 4;
        group.add(barb);
        if (!meshes.leftBarbs) meshes.leftBarbs = [];
        meshes.leftBarbs.push(barb);
    }

    parts.push({
        name: "Left Barbed Lancet",
        description: "A razor-sharp sliding blade equipped with backward-facing barbs.",
        material: "chrome",
        function: "Slides reciprocally to dig deeper into the target and acts as a one-way anchor.",
        assemblyOrder: 5,
        connections: ["Central Stylet Guide", "Motor Ganglion"],
        failureEffect: "Inability to anchor or dig deeper.",
        cascadeFailures: ["Stinger dislodges prematurely"],
        originalPosition: { x: -0.25, y: 0, z: 0.1 },
        explodedPosition: { x: -5, y: 0, z: 2 }
    });

    // 6. Right Lancet
    const rightLancet = new THREE.Mesh(lancetGeom, chrome);
    rightLancet.position.set(0.25, 0, 0.1);
    group.add(rightLancet);
    meshes.rightLancet = rightLancet;

    // Right Barbs
    for (let i = 0; i < 6; i++) {
        const barb = new THREE.Mesh(barbGeom, chrome);
        barb.position.set(0.35, -3 + i * 0.8, 0.1);
        barb.rotation.z = -Math.PI / 4;
        group.add(barb);
        if (!meshes.rightBarbs) meshes.rightBarbs = [];
        meshes.rightBarbs.push(barb);
    }

    parts.push({
        name: "Right Barbed Lancet",
        description: "The mirrored sliding blade to the left lancet.",
        material: "chrome",
        function: "Alternates sliding with the left lancet to ratchet the stinger deeper into tissue.",
        assemblyOrder: 6,
        connections: ["Central Stylet Guide", "Motor Ganglion"],
        failureEffect: "Stinger digs in asymmetrically, losing penetration power.",
        cascadeFailures: ["Stinger dislodges prematurely"],
        originalPosition: { x: 0.25, y: 0, z: 0.1 },
        explodedPosition: { x: 5, y: 0, z: 2 }
    });

    const description = "The honey bee stinger is a sophisticated bio-mechanical apparatus designed for defense. Featuring a self-contained motor ganglion and venom reservoir, it can continue to pump venom long after detaching from the bee. Its reciprocating barbed lancets act like a ratchet, pulling the stinger deeper into tissue autonomously.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Autonomous Motor Ganglion in the bee stinger?",
            options: [
                "To detect incoming threats via sensory inputs",
                "To continue pumping venom and actuating lancets after detachment",
                "To regenerate venom inside the sac",
                "To guide the bee's flight towards a target"
            ],
            correct: 1,
            explanation: "The stinger has its own nerve center (ganglion) allowing it to function autonomously—pumping venom and digging deeper—even after tearing away from the bee's body.",
            difficulty: "Medium"
        },
        {
            question: "How do the Barbed Lancets facilitate deeper penetration into tissue?",
            options: [
                "They spin rapidly like a drill bit",
                "They heat up to melt through tissue",
                "They alternate sliding in a reciprocal ratcheting motion",
                "They expand explosively upon impact"
            ],
            correct: 2,
            explanation: "The two lancets slide back and forth alternatingly. The backward-facing barbs catch the tissue, ratcheting the entire stinger deeper with each slide.",
            difficulty: "Hard"
        },
        {
            question: "What ultimately happens to the honey bee after deploying its stinger into a mammal?",
            options: [
                "It retracts the stinger and flies away unharmed",
                "It regenerates a new stinger within 24 hours",
                "It undergoes a fatal abdominal rupture as the stinger detaches",
                "It falls into a dormant state to recover energy"
            ],
            correct: 2,
            explanation: "The barbs firmly anchor the stinger in thick mammalian skin. When the bee tries to fly away, a portion of its abdomen tears off with the stinger, resulting in death.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, partsMeshes) {
        // time in seconds
        const t = time * speed * 5;

        // Venom bulb pulsating
        const scalePulse = 1 + Math.sin(t * 2) * 0.05;
        meshes.venomBulb.scale.set(1 * scalePulse, 1.5 * scalePulse, 1 * scalePulse);
        
        // Muscle pump contracting
        const musclePulse = 1 - Math.sin(t * 2) * 0.1;
        meshes.pump1.scale.set(musclePulse, musclePulse, musclePulse);
        meshes.pump2.scale.set(musclePulse, musclePulse, musclePulse);

        // Ganglion rotating & floating
        meshes.ganglion.rotation.y = t * 0.5;
        meshes.ganglion.position.y = 6.5 + Math.sin(t * 3) * 0.1;

        // Lancets sliding reciprocally
        const leftSlide = Math.sin(t * 4) * 0.5;
        meshes.leftLancet.position.y = leftSlide;
        meshes.leftBarbs.forEach((barb, i) => {
            barb.position.y = -3 + i * 0.8 + leftSlide;
        });

        const rightSlide = Math.sin(t * 4 + Math.PI) * 0.5; // Out of phase
        meshes.rightLancet.position.y = rightSlide;
        meshes.rightBarbs.forEach((barb, i) => {
            barb.position.y = -3 + i * 0.8 + rightSlide;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHoneybeeStinger() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
