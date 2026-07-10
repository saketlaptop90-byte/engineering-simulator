import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material for high-tech look
    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0077ff,
        emissiveIntensity: 1.0,
        roughness: 0.1,
        metalness: 0.8
    });

    // 1. Tractor Spline Yoke (Input)
    const yoke1Geo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const yoke1 = new THREE.Mesh(yoke1Geo, steel);
    yoke1.position.set(0, 0, -4);
    yoke1.rotation.x = Math.PI / 2;
    group.add(yoke1);
    parts.push({
        name: "Tractor Spline Yoke",
        description: "Connects to the tractor's PTO stub shaft, transmitting rotational power.",
        material: "Steel",
        function: "Input connection from tractor",
        assemblyOrder: 1,
        connections: ["Input Universal Joint"],
        failureEffect: "Loss of power transmission from tractor.",
        cascadeFailures: ["Input Universal Joint stress", "Total system stall"],
        originalPosition: { x: 0, y: 0, z: -4 },
        explodedPosition: { x: 0, y: 0, z: -6 }
    });

    // 2. Input Universal Joint (U-Joint 1)
    const ujoint1Geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const ujoint1 = new THREE.Mesh(ujoint1Geo, neonOrange);
    ujoint1.position.set(0, 0, -3);
    group.add(ujoint1);
    parts.push({
        name: "Input Universal Joint",
        description: "Allows the drive shaft to operate at variable angles relative to the tractor.",
        material: "High-Strength Alloy",
        function: "Angular articulation",
        assemblyOrder: 2,
        connections: ["Tractor Spline Yoke", "Telescopic Tube Inner"],
        failureEffect: "Severe vibration, inability to operate at angles.",
        cascadeFailures: ["Yoke fracture", "Shaft separation"],
        originalPosition: { x: 0, y: 0, z: -3 },
        explodedPosition: { x: 0, y: 2, z: -4 }
    });

    // 3. Telescopic Tube - Inner
    const innerTubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const innerTube = new THREE.Mesh(innerTubeGeo, darkSteel);
    innerTube.position.set(0, 0, -1);
    innerTube.rotation.x = Math.PI / 2;
    group.add(innerTube);
    parts.push({
        name: "Inner Telescopic Tube",
        description: "Slides inside the outer tube to allow length adjustment during turns and uneven terrain.",
        material: "Carbon Steel",
        function: "Variable length power transmission",
        assemblyOrder: 3,
        connections: ["Input Universal Joint", "Outer Telescopic Tube"],
        failureEffect: "Shaft buckling or pulling apart.",
        cascadeFailures: ["Outer tube warping", "U-Joint destruction"],
        originalPosition: { x: 0, y: 0, z: -1 },
        explodedPosition: { x: 0, y: -2, z: -1 }
    });

    // 4. Telescopic Tube - Outer
    const outerTubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const outerTube = new THREE.Mesh(outerTubeGeo, steel);
    outerTube.position.set(0, 0, 1);
    outerTube.rotation.x = Math.PI / 2;
    group.add(outerTube);
    parts.push({
        name: "Outer Telescopic Tube",
        description: "Receives the inner tube and transmits power to the implement.",
        material: "Carbon Steel",
        function: "Variable length housing",
        assemblyOrder: 4,
        connections: ["Inner Telescopic Tube", "Implement Universal Joint"],
        failureEffect: "Seizing or binding of the telescopic function.",
        cascadeFailures: ["Inner tube scoring", "Tractor PTO bearing damage"],
        originalPosition: { x: 0, y: 0, z: 1 },
        explodedPosition: { x: 0, y: 2, z: 1 }
    });

    // 5. Implement Universal Joint (U-Joint 2)
    const ujoint2Geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const ujoint2 = new THREE.Mesh(ujoint2Geo, neonOrange);
    ujoint2.position.set(0, 0, 3);
    group.add(ujoint2);
    parts.push({
        name: "Implement Universal Joint",
        description: "Allows the drive shaft to articulate at the implement connection.",
        material: "High-Strength Alloy",
        function: "Angular articulation",
        assemblyOrder: 5,
        connections: ["Outer Telescopic Tube", "Implement Spline Yoke"],
        failureEffect: "Severe vibration at the implement.",
        cascadeFailures: ["Implement gearbox damage", "Yoke fracture"],
        originalPosition: { x: 0, y: 0, z: 3 },
        explodedPosition: { x: 0, y: -2, z: 4 }
    });

    // 6. Implement Spline Yoke (Output)
    const yoke2Geo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const yoke2 = new THREE.Mesh(yoke2Geo, chrome);
    yoke2.position.set(0, 0, 4);
    yoke2.rotation.x = Math.PI / 2;
    group.add(yoke2);
    parts.push({
        name: "Implement Spline Yoke",
        description: "Connects to the implement's input shaft.",
        material: "Chrome Plated Steel",
        function: "Output connection to implement",
        assemblyOrder: 6,
        connections: ["Implement Universal Joint"],
        failureEffect: "Loss of power to the implement.",
        cascadeFailures: ["Implement stall"],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 0, y: 0, z: 6 }
    });

    // 7. Safety Shield (Guard)
    const shieldGeo = new THREE.CylinderGeometry(0.8, 0.8, 7, 32, 1, true);
    const shield = new THREE.Mesh(shieldGeo, rubber);
    // Add neon blue rings to the shield
    shield.material = neonBlue;
    shield.material.wireframe = true;
    shield.position.set(0, 0, 0);
    shield.rotation.x = Math.PI / 2;
    group.add(shield);
    parts.push({
        name: "Safety Shield",
        description: "A free-spinning plastic or rubber guard protecting operators from the rotating shaft.",
        material: "High-Impact Polymer",
        function: "Operator safety",
        assemblyOrder: 7,
        connections: ["None (Freewheeling)"],
        failureEffect: "Extreme entanglement hazard for operators.",
        cascadeFailures: ["Lethal accidents", "Equipment contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 }
    });

    // Meshes for animation mapping
    const meshes = {
        yoke1,
        ujoint1,
        innerTube,
        outerTube,
        ujoint2,
        yoke2,
        shield
    };

    const description = "A high-tech, animated representation of an Agricultural Tractor Power Take-Off (PTO) Drive Shaft. Key features include telescopic sliding action, dual articulating universal joints, and a freewheeling safety shield.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Telescopic Tubes in a PTO shaft?",
            options: [
                "To increase rotational speed",
                "To allow the shaft length to adjust dynamically as the tractor turns",
                "To cool down the universal joints",
                "To reverse the direction of rotation"
            ],
            correct: 1,
            explanation: "Telescopic tubes slide inside one another to accommodate changes in distance between the tractor and implement, especially during turns and over uneven terrain.",
            difficulty: "Medium"
        },
        {
            question: "Why are Universal Joints (U-Joints) critical in a PTO shaft?",
            options: [
                "They increase the horsepower output",
                "They lock the shaft in a perfectly straight line",
                "They allow power transmission at variable angles",
                "They act as the main safety shield"
            ],
            correct: 2,
            explanation: "U-Joints permit the shaft to bend and operate at various angles, essential since the tractor and implement are rarely perfectly aligned.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Safety Shield fails or is removed?",
            options: [
                "The shaft will spin faster",
                "The tractor engine will stall",
                "It creates a severe entanglement hazard for operators",
                "The telescopic tubes will lock in place"
            ],
            correct: 2,
            explanation: "The safety shield is freewheeling. If it's missing or damaged, clothes or limbs can easily get caught in the rotating shaft, causing catastrophic injuries.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;
        const rpm = speed * 10;
        
        // Base rotation
        activeMeshes.yoke1.rotation.y = time * rpm;
        activeMeshes.ujoint1.rotation.z = time * rpm;
        activeMeshes.innerTube.rotation.y = time * rpm;
        activeMeshes.outerTube.rotation.y = time * rpm;
        activeMeshes.ujoint2.rotation.z = time * rpm;
        activeMeshes.yoke2.rotation.y = time * rpm;

        // Simulate U-Joint articulation and telescopic motion
        const articulationAngle = Math.sin(time) * 0.2;
        
        activeMeshes.ujoint1.rotation.x = articulationAngle;
        activeMeshes.innerTube.rotation.z = articulationAngle;
        activeMeshes.outerTube.rotation.z = articulationAngle;
        activeMeshes.ujoint2.rotation.x = -articulationAngle;
        
        // Telescopic action
        const stretch = Math.sin(time * 2) * 0.5;
        activeMeshes.innerTube.position.z = -1 - stretch;
        activeMeshes.outerTube.position.z = 1 + stretch;
        
        // Make the shield freewheel (rotate much slower or randomly)
        activeMeshes.shield.rotation.y = time * (rpm * 0.05);
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createTractorPTOShaft() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
