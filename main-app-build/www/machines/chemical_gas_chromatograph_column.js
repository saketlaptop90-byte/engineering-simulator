import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingCarrierGas = new THREE.MeshPhysicalMaterial({
        color: 0xcccccc, emissive: 0xaaaaaa, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.3
    });

    const glowingComponentA = new THREE.MeshPhysicalMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2
    });
    const glowingComponentB = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 2
    });

    const ovenGeo = new THREE.BoxGeometry(6, 6, 6);
    const ovenMesh = new THREE.Mesh(ovenGeo, darkSteel);
    ovenMesh.position.set(0, 3, 0);
    // Open the front of the oven
    ovenMesh.material = tinted;
    group.add(ovenMesh);
    parts.push({
        name: "Temperature-Controlled Oven",
        description: "Highly precise thermal enclosure.",
        material: "Steel / Glass",
        function: "Maintains exact temperatures to keep the chemical sample in a vapor state.",
        assemblyOrder: 1,
        connections: ["Capillary Column"],
        failureEffect: "Temperature fluctuation.",
        cascadeFailures: ["Unreliable separation times"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:3, z:-8}
    });

    const columnGeo = new THREE.TorusKnotGeometry(1.5, 0.1, 200, 16, 3, 11);
    const columnMesh = new THREE.Mesh(columnGeo, copper);
    columnMesh.position.set(0, 3, 0);
    group.add(columnMesh);
    parts.push({
        name: "Capillary Column",
        description: "Extremely long, microscopic coiled tube coated with stationary phase.",
        material: "Fused Silica / Copper",
        function: "Separates the chemical mixture based on how strongly each molecule interacts with the internal coating.",
        assemblyOrder: 2,
        connections: ["Injector", "Detector", "Oven"],
        failureEffect: "Column bleeding (coating burns off).",
        cascadeFailures: ["Ghost peaks on chromatogram"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:10, z:0}
    });

    const compAGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const compAMesh = new THREE.Mesh(compAGeo, glowingComponentA);
    compAMesh.position.set(-1.5, 3, 1.5);
    group.add(compAMesh);
    parts.push({
        name: "Fast-Moving Component (Neon Red)",
        description: "Chemical species with low affinity for the column.",
        material: "Glowing Red Vapor",
        function: "Travels quickly through the column and reaches the detector first.",
        assemblyOrder: 3,
        connections: ["Carrier Gas"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:-1.5, y:3, z:1.5},
        explodedPosition: {x:-5, y:3, z:1.5}
    });

    const compBGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const compBMesh = new THREE.Mesh(compBGeo, glowingComponentB);
    compBMesh.position.set(-1.5, 3, 1.5);
    group.add(compBMesh);
    parts.push({
        name: "Slow-Moving Component (Neon Blue)",
        description: "Chemical species with high affinity for the column.",
        material: "Glowing Blue Vapor",
        function: "Interacts strongly with the stationary phase, traveling slowly and reaching the detector later.",
        assemblyOrder: 4,
        connections: ["Carrier Gas"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:-1.5, y:3, z:1.5},
        explodedPosition: {x:5, y:3, z:1.5}
    });

    const description = "Gas Chromatograph Column: An analytical chemistry instrument that vaporizes a mixture and flows it through a microscopic coiled tube. Different molecules travel at different speeds, separating them perfectly for analysis.";

    const quizQuestions = [
        {
            question: "What makes the different chemicals in the mixture separate from each other?",
            options: ["They interact differently with the stationary phase coating inside the column", "They are separated by gravity", "A centrifuge spins them apart", "They are filtered by size through a mesh"],
            correct: 0,
            explanation: "Separation occurs because some molecules stick (have higher affinity) to the microscopic liquid/solid coating inside the column (stationary phase) more than others, slowing them down.",
            difficulty: "Hard"
        },
        {
            question: "What is the purpose of the 'Carrier Gas' (Mobile Phase) like Helium or Hydrogen?",
            options: ["To push the vaporized sample through the column without reacting with it", "To burn the sample", "To cool the oven down", "To clean the column"],
            correct: 0,
            explanation: "The carrier gas acts as an inert transport vehicle, constantly pushing the vaporized molecules forward through the column without chemically altering them.",
            difficulty: "Medium"
        },
        {
            question: "Why is the capillary column coiled into loops?",
            options: ["To fit a very long column (up to 100 meters) inside a small temperature-controlled oven", "To create a vortex effect", "To prevent the gas from escaping", "Because straight tubes don't work"],
            correct: 0,
            explanation: "Capillary columns need to be very long (10m to 100m) to achieve high-resolution separation. Coiling it allows it to fit neatly inside a small, precisely heated oven.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Orbit the components around the TorusKnot to simulate traveling through the coil
        // Since tracing a TorusKnot exactly in 3D without a curve path is complex math, we approximate it with an orbit
        if (meshes[2]) {
            meshes[2].position.x = Math.sin(time * speed * 3) * 1.5;
            meshes[2].position.z = Math.cos(time * speed * 3) * 1.5;
            meshes[2].position.y = 3 + Math.sin(time * speed * 12) * 0.5; // Up/down bob to simulate coiling
        }
        if (meshes[3]) {
            // Blue moves slower
            meshes[3].position.x = Math.sin(time * speed * 1.5) * 1.5;
            meshes[3].position.z = Math.cos(time * speed * 1.5) * 1.5;
            meshes[3].position.y = 3 + Math.sin(time * speed * 6) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGasChromatographColumn() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
