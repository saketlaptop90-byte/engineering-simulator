import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const semiPermeable = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.5, side: THREE.DoubleSide
    });

    const saltyWater = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, transparent: true, opacity: 0.7 // Green = salty/impure
    });
    
    const pureWater = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff, transparent: true, opacity: 0.7 // Blue = pure
    });

    const vesselGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const vesselMesh = new THREE.Mesh(vesselGeo, chrome);
    vesselMesh.rotation.z = Math.PI / 2;
    vesselMesh.position.set(0, 2, 0);
    // Make outer shell slightly transparent
    vesselMesh.material = tinted;
    group.add(vesselMesh);
    parts.push({
        name: "Pressure Vessel",
        description: "Fiberglass or steel outer tube.",
        material: "Fiberglass / Steel",
        function: "Contains the high pressure required to overcome natural osmotic pressure (up to 1200 psi).",
        assemblyOrder: 1,
        connections: ["High Pressure Pump", "Membrane"],
        failureEffect: "Explosive rupture.",
        cascadeFailures: ["Catastrophic plant flooding"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:8, z:0}
    });

    const membraneGrp = new THREE.Group();
    // Spiral wound membrane representation
    for(let i=0.5; i<1.8; i+=0.3) {
        const memGeo = new THREE.CylinderGeometry(i, i, 9.8, 32, 1, true);
        const memMesh = new THREE.Mesh(memGeo, semiPermeable);
        memMesh.rotation.z = Math.PI / 2;
        membraneGrp.add(memMesh);
    }
    membraneGrp.position.set(0, 2, 0);
    group.add(membraneGrp);
    parts.push({
        name: "Spiral Wound RO Membrane",
        description: "Layers of semi-permeable thin-film composite wrapped around a central tube.",
        material: "Polyamide Polymer",
        function: "Allows tiny water molecules to pass through while blocking large salt ions.",
        assemblyOrder: 2,
        connections: ["Pressure Vessel", "Central Tube"],
        failureEffect: "Membrane fouling or tearing.",
        cascadeFailures: ["Salty product water"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:2, z:5}
    });

    const feedGeo = new THREE.CylinderGeometry(1.9, 1.9, 4, 32);
    const feedMesh = new THREE.Mesh(feedGeo, saltyWater);
    feedMesh.rotation.z = Math.PI / 2;
    feedMesh.position.set(-3, 2, 0);
    group.add(feedMesh);
    parts.push({
        name: "High-Pressure Feed / Brine",
        description: "Salty feed water pushed at extreme pressure.",
        material: "Salty Water (Green)",
        function: "Flows axially across the membrane surface.",
        assemblyOrder: 3,
        connections: ["Membrane"],
        failureEffect: "Loss of pressure.",
        cascadeFailures: ["Osmosis reverses, drying out the product line"],
        originalPosition: {x:-3, y:2, z:0},
        explodedPosition: {x:-8, y:2, z:0}
    });

    const permeateGeo = new THREE.CylinderGeometry(0.3, 0.3, 11, 32);
    const permeateMesh = new THREE.Mesh(permeateGeo, pureWater);
    permeateMesh.rotation.z = Math.PI / 2;
    permeateMesh.position.set(0, 2, 0);
    group.add(permeateMesh);
    parts.push({
        name: "Permeate (Pure Water) Tube",
        description: "The perforated central collection tube.",
        material: "Pure Water (Blue)",
        function: "Collects the pure water that successfully spiraled through the membrane layers.",
        assemblyOrder: 4,
        connections: ["Membrane"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:8, y:2, z:0}
    });

    const description = "Reverse Osmosis Array: A high-tech filtration system that uses extreme pressure to force salty or impure water through a semi-permeable membrane at the molecular level, leaving pure water on one side and concentrated brine on the other.";

    const quizQuestions = [
        {
            question: "Why is extreme pressure required for Reverse Osmosis (RO)?",
            options: ["To overcome the natural osmotic pressure that makes pure water want to flow INTO salty water", "To crush the salt crystals", "To heat the water", "To make the water move faster"],
            correct: 0,
            explanation: "Naturally, osmosis causes pure water to dilute salty water. To 'reverse' this and squeeze pure water OUT of salty water, massive mechanical pressure (often 800-1200 psi for seawater) must be applied.",
            difficulty: "Hard"
        },
        {
            question: "What is the most common geometry for industrial RO membranes?",
            options: ["Spiral wound (sheets wrapped around a central tube)", "Flat plate", "Hollow fiber", "Spherical balls"],
            correct: 0,
            explanation: "Spiral wound membranes pack the maximum possible surface area into a standard cylindrical pressure vessel, making them highly efficient.",
            difficulty: "Medium"
        },
        {
            question: "What happens to the salt that gets rejected by the membrane?",
            options: ["It becomes highly concentrated 'brine' and flows out a separate exhaust port", "It evaporates", "It turns into solid rocks inside the tube", "It is destroyed atomically"],
            correct: 0,
            explanation: "RO doesn't destroy salt; it splits the incoming stream into a pure 'permeate' stream and a highly concentrated 'brine' or 'retentate' stream that is discharged.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate pure water flowing out
        if (meshes[3]) meshes[3].position.x = Math.sin(time * speed) * 0.5;
        // Pulse membrane to simulate pressure
        if (meshes[1]) {
            const scale = 1 + Math.sin(time*speed*10)*0.01;
            meshes[1].scale.set(scale, scale, scale);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createReverseOsmosisArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
