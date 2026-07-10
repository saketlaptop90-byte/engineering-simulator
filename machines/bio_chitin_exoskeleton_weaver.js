import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials
    const neonGreenGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const bioGelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00aa88,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
    });

    const chitinMaterial = new THREE.MeshStandardMaterial({
        color: 0x332211,
        roughness: 0.7,
        metalness: 0.1,
        bumpScale: 0.05,
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5.5, 1, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -0.5, 0);
    group.add(base);
    parts.push({
        name: "Base Platform",
        description: "Heavy dark steel foundation stabilizing the high-frequency micro-weaving process.",
        material: "darkSteel",
        function: "Structural support and vibration dampening",
        assemblyOrder: 1,
        connections: ["Support Pillars", "Energy Core"],
        failureEffect: "Machine vibration exceeds tolerances, causing misaligned weaving.",
        cascadeFailures: ["Spinneret Array", "Weaver Arms"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: base
    });

    // 2. Energy Core
    const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const core = new THREE.Mesh(coreGeo, neonGreenGlow);
    core.position.set(0, 1.5, -2);
    group.add(core);
    parts.push({
        name: "Biomimetic Energy Core",
        description: "Pulsing power source driving the synthetic polymerization of chitin.",
        material: "neonGreenGlow",
        function: "Supplies bio-electric power to the extrusion heads.",
        assemblyOrder: 2,
        connections: ["Base Platform", "Power Conduits"],
        failureEffect: "Polymerization halts, resulting in weak, brittle armor.",
        cascadeFailures: ["Chitin Plate"],
        originalPosition: { x: 0, y: 1.5, z: -2 },
        explodedPosition: { x: 0, y: 1.5, z: -10 },
        mesh: core
    });

    // 3. Matrix Vat
    const vatGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const vat = new THREE.Mesh(vatGeo, glass);
    vat.position.set(0, 3, -2);
    const vatLiquid = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.8, 16), bioGelMaterial);
    vatLiquid.position.set(0, 3, -2);
    group.add(vat);
    group.add(vatLiquid);
    parts.push({
        name: "Biopolymer Vat",
        description: "Glass containment vessel holding the raw synthetic chitin gel.",
        material: "glass/bioGelMaterial",
        function: "Stores and preconditions the raw material before extrusion.",
        assemblyOrder: 3,
        connections: ["Energy Core", "Feed Tubes"],
        failureEffect: "Gel solidifies prematurely.",
        cascadeFailures: ["Spinneret Array"],
        originalPosition: { x: 0, y: 3, z: -2 },
        explodedPosition: { x: 0, y: 10, z: -5 },
        mesh: vat
    });

    // 4. Weaver Arms
    const armGeo = new THREE.BoxGeometry(0.5, 4, 0.5);
    const leftArm = new THREE.Mesh(armGeo, aluminum);
    leftArm.position.set(-3, 3, 0);
    leftArm.rotation.z = -0.2;
    group.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, aluminum);
    rightArm.position.set(3, 3, 0);
    rightArm.rotation.z = 0.2;
    group.add(rightArm);
    
    parts.push({
        name: "Left Weaver Arm",
        description: "Precision manipulator that guides the extruded chitin fibers.",
        material: "aluminum",
        function: "Interlocks fibers into a high-tensile matrix.",
        assemblyOrder: 4,
        connections: ["Base Platform", "Spinneret Array"],
        failureEffect: "Asymmetric weaving pattern.",
        cascadeFailures: ["Chitin Plate structural integrity"],
        originalPosition: { x: -3, y: 3, z: 0 },
        explodedPosition: { x: -8, y: 3, z: 0 },
        mesh: leftArm
    });

    parts.push({
        name: "Right Weaver Arm",
        description: "Precision manipulator that guides the extruded chitin fibers.",
        material: "aluminum",
        function: "Interlocks fibers into a high-tensile matrix.",
        assemblyOrder: 5,
        connections: ["Base Platform", "Spinneret Array"],
        failureEffect: "Asymmetric weaving pattern.",
        cascadeFailures: ["Chitin Plate structural integrity"],
        originalPosition: { x: 3, y: 3, z: 0 },
        explodedPosition: { x: 8, y: 3, z: 0 },
        mesh: rightArm
    });

    // 5. Spinneret Array
    const spinneretGeo = new THREE.ConeGeometry(0.5, 1, 16);
    const spinneret = new THREE.Mesh(spinneretGeo, chrome);
    spinneret.position.set(0, 4.5, 0);
    spinneret.rotation.x = Math.PI;
    group.add(spinneret);
    parts.push({
        name: "Spinneret Array",
        description: "Micro-extrusion head that spins the bio-gel into microfibers.",
        material: "chrome",
        function: "Fiber extrusion",
        assemblyOrder: 6,
        connections: ["Weaver Arms", "Matrix Vat"],
        failureEffect: "Fibers are too thick or thin, ruining tensile strength.",
        cascadeFailures: ["Chitin Plate"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: spinneret
    });

    // 6. Chitin Plate
    const plateGeo = new THREE.BoxGeometry(3, 0.2, 2);
    const plate = new THREE.Mesh(plateGeo, chitinMaterial);
    plate.position.set(0, 1.5, 0);
    group.add(plate);
    parts.push({
        name: "Chitin Plate Matrix",
        description: "The biomimetic armor plate currently being woven.",
        material: "chitinMaterial",
        function: "Final product: lightweight, hyper-durable armor.",
        assemblyOrder: 7,
        connections: ["Weaver Arms", "Base Platform"],
        failureEffect: "Plate shatters under ballistic impact.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 8 },
        mesh: plate
    });

    // 7. Laser Curing Grid
    const laserGeo = new THREE.TorusGeometry(2.5, 0.1, 16, 64);
    const laserGrid = new THREE.Mesh(laserGeo, neonGreenGlow);
    laserGrid.position.set(0, 2, 0);
    laserGrid.rotation.x = Math.PI / 2;
    group.add(laserGrid);
    parts.push({
        name: "Laser Curing Grid",
        description: "Emits high-frequency UV-like energy to cure the chitin fibers instantly.",
        material: "neonGreenGlow",
        function: "Solidifies the flexible fibers into rigid armor.",
        assemblyOrder: 8,
        connections: ["Base Platform"],
        failureEffect: "Armor remains soft and gel-like.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: laserGrid
    });

    const description = "The Bio-Chitin Exoskeleton Weaver is an advanced biomimetic manufacturing unit. It synthesizes a proprietary bio-polymer gel into ultra-high-tensile microfibers, weaving them into lightweight armor plating that mimics the durability of insectoid exoskeletons but scaled for heavy industrial or combat use. The system features multi-axis weaving arms and a high-frequency laser curing grid.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Laser Curing Grid?",
            options: [
                "To melt the chitin for easier weaving",
                "To emit high-frequency energy to solidify the chitin fibers",
                "To project a holographic blueprint of the armor",
                "To sterilize the biomaterial"
            ],
            correct: 1,
            explanation: "The Laser Curing Grid emits specific frequencies of energy that cause the bio-polymer fibers to instantly harden from a flexible state into rigid, high-tensile armor plating.",
            difficulty: "easy"
        },
        {
            question: "What happens if the Weaver Arms fail to maintain perfect synchronization?",
            options: [
                "The machine speeds up to compensate",
                "The energy core overheats",
                "The armor develops an asymmetric weave, compromising structural integrity",
                "The bio-gel solidifies in the vat"
            ],
            correct: 2,
            explanation: "The Weaver Arms must interlock the fibers in a precise mathematical pattern. Asymmetry causes weak points in the tensile matrix, leading to catastrophic failure under impact.",
            difficulty: "medium"
        },
        {
            question: "Why is a Biomimetic Energy Core required instead of a standard electrical power supply?",
            options: [
                "It looks cooler",
                "The synthetic polymerization process requires bio-electric impulses to align the polymer chains",
                "Standard electricity would electrocute the organic components",
                "It is a legal requirement for biomimetic devices"
            ],
            correct: 1,
            explanation: "The bio-gel relies on specific bio-electric impulses to properly align its molecular structure during extrusion. Standard electricity cannot replicate these complex waveforms.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // time is time in ms
        const t = time * 0.001 * speed;
        
        // Spin the curing grid
        if (meshes["Laser Curing Grid"]) {
            meshes["Laser Curing Grid"].rotation.z = t * 2;
            // Pulsing glow
            meshes["Laser Curing Grid"].scale.setScalar(1 + Math.sin(t * 10) * 0.05);
        }

        // Animate weaver arms (weaving motion)
        if (meshes["Left Weaver Arm"]) {
            meshes["Left Weaver Arm"].rotation.x = Math.sin(t * 5) * 0.5;
            meshes["Left Weaver Arm"].rotation.z = -0.2 + Math.cos(t * 3) * 0.1;
        }
        if (meshes["Right Weaver Arm"]) {
            meshes["Right Weaver Arm"].rotation.x = Math.cos(t * 5) * 0.5;
            meshes["Right Weaver Arm"].rotation.z = 0.2 + Math.sin(t * 3) * 0.1;
        }

        // Pulse the energy core
        if (meshes["Biomimetic Energy Core"]) {
            meshes["Biomimetic Energy Core"].scale.setScalar(1 + Math.sin(t * 8) * 0.1);
            meshes["Biomimetic Energy Core"].rotation.y = t;
        }

        // Spinneret subtle vibration
        if (meshes["Spinneret Array"]) {
            meshes["Spinneret Array"].position.y = 4.5 + Math.sin(t * 20) * 0.05;
        }

        // Chitin plate slowly rising (simulating build process)
        if (meshes["Chitin Plate Matrix"]) {
            const cycle = (t % 10) / 10;
            meshes["Chitin Plate Matrix"].scale.y = 0.1 + cycle * 2;
            meshes["Chitin Plate Matrix"].position.y = 1.0 + meshes["Chitin Plate Matrix"].scale.y * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createChitinWeaver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
