import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials for Airflow / Neon Vectors
    const glowMaterialRed = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xff0000,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const glowMaterialBlue = new THREE.MeshStandardMaterial({
        color: 0x1188ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    // 1. Rotor Hub
    const hubGeometry = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
    const hubMesh = new THREE.Mesh(hubGeometry, chrome);
    hubMesh.position.set(0, 0, 0);
    group.add(hubMesh);
    meshes.hub = hubMesh;

    parts.push({
        name: "Rotor Hub",
        description: "The central mounting structure connecting the aerodynamic blades to the rotational mast.",
        material: "Chrome / Forged Steel",
        function: "Transmits engine torque to the rotor blades while withstanding immense centrifugal forces.",
        assemblyOrder: 1,
        connections: ["Engine Mast", "Blade Grips"],
        failureEffect: "Catastrophic structural disintegration and immediate loss of flight.",
        cascadeFailures: ["Blade Grips", "Blades"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Pitch Link Assembly
    const pitchLinkGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.0, 16);
    const pitchLinkMesh = new THREE.Mesh(pitchLinkGeo, darkSteel);
    pitchLinkMesh.position.set(1.0, 0.8, 0);
    pitchLinkMesh.rotation.z = Math.PI / 6;
    hubMesh.add(pitchLinkMesh);
    meshes.pitchLink = pitchLinkMesh;
    
    parts.push({
        name: "Pitch Link Assembly",
        description: "Precision actuator arm controlling the pitch angle of individual blades.",
        material: "Dark Steel / Titanium",
        function: "Adjusts the blade angle of attack to modulate lift and direct thrust.",
        assemblyOrder: 2,
        connections: ["Swashplate", "Blade Grip"],
        failureEffect: "Uncontrollable pitch variations and extreme dynamic instability.",
        cascadeFailures: ["Flight Trajectory", "Rotor Balance"],
        originalPosition: { x: 1.0, y: 0.8, z: 0 },
        explodedPosition: { x: 2, y: 8, z: 3 }
    });

    // 3. Aerodynamic Rotor Blade
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    // Asymmetrical Airfoil shape
    bladeShape.bezierCurveTo(2, 0.6, 6, 0.35, 10, 0.05); // Upper curve
    bladeShape.bezierCurveTo(6, -0.1, 2, -0.15, 0, 0);    // Lower curve
    
    const extrudeSettings = { 
        depth: 0.2, 
        bevelEnabled: true, 
        bevelSegments: 3, 
        steps: 2, 
        bevelSize: 0.05, 
        bevelThickness: 0.05 
    };
    const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    bladeGeometry.center();
    
    const bladeMesh = new THREE.Mesh(bladeGeometry, aluminum);
    // Position it radiating outward from the hub
    bladeMesh.position.set(6, 0, 0);
    bladeMesh.rotation.x = Math.PI / 2; // Lie flat
    hubMesh.add(bladeMesh);
    meshes.blade = bladeMesh;

    parts.push({
        name: "Aerodynamic Rotor Blade",
        description: "Primary lift-generating surface engineered with a high-efficiency asymmetrical airfoil profile.",
        material: "Aeronautical Aluminum / Carbon Composite",
        function: "Generates upward lift by manipulating fluid dynamics and creating pressure differentials.",
        assemblyOrder: 3,
        connections: ["Blade Grip"],
        failureEffect: "Asymmetric lift, catastrophic vibration, and stall.",
        cascadeFailures: ["Hub Integrity", "Mast Alignment"],
        originalPosition: { x: 6, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    // 4. High-Pressure Airflow Vectors (Under blade)
    const vectorGeoHigh = new THREE.ConeGeometry(0.2, 1.2, 16);
    const flowHigh = new THREE.Group();
    for(let i=0; i<4; i++) {
        const arrow = new THREE.Mesh(vectorGeoHigh, glowMaterialRed);
        // Point upwards towards the blade bottom
        arrow.rotation.x = Math.PI; 
        arrow.position.set(i * 2 - 3, -1.5, 0);
        flowHigh.add(arrow);
    }
    bladeMesh.add(flowHigh);
    meshes.flowHigh = flowHigh;

    parts.push({
        name: "High Pressure Air Vectors",
        description: "Neon red visualization of slower-moving, high-pressure air mass beneath the airfoil.",
        material: "Neon Red Energy",
        function: "Demonstrates the upward pushing force contributing to total aerodynamic lift.",
        assemblyOrder: 4,
        connections: ["Airfoil Lower Surface"],
        failureEffect: "Disruption leads to sink rate increase.",
        cascadeFailures: ["Lift Loss"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 5. Low-Pressure Airflow Vectors (Over blade)
    const vectorGeoLow = new THREE.ConeGeometry(0.15, 1.0, 16);
    const flowLow = new THREE.Group();
    for(let i=0; i<6; i++) {
        const arrow = new THREE.Mesh(vectorGeoLow, glowMaterialBlue);
        // Point upwards away from top surface
        arrow.position.set(i * 1.5 - 3.5, 1.5, 0);
        flowLow.add(arrow);
    }
    bladeMesh.add(flowLow);
    meshes.flowLow = flowLow;

    parts.push({
        name: "Low Pressure Air Vectors",
        description: "Neon blue visualization of accelerated, low-pressure air over the curved upper camber.",
        material: "Neon Blue Energy",
        function: "Illustrates the vacuum effect that pulls the blade upwards, governed by Bernoulli's Principle.",
        assemblyOrder: 5,
        connections: ["Airfoil Upper Surface"],
        failureEffect: "Boundary layer separation resulting in aerodynamic stall.",
        cascadeFailures: ["Vortex Ring State", "Loss of Altitude"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    const description = "The Ultra High-Tech Aerodynamic Rotor Blade demonstrates fluid mechanics and lift generation. Its asymmetrical airfoil profile utilizes Bernoulli's Principle—faster air over the curved top yields low pressure (Neon Blue), while slower air underneath creates high pressure (Neon Red). Together, these forces generate the upward lift required for sustained flight.";

    const quizQuestions = [
        {
            question: "According to Bernoulli's principle, how is lift generated across this rotor blade?",
            options: [
                "High pressure air moves faster over the top surface",
                "Fast moving air over the upper camber creates a low-pressure zone, pulling the blade up",
                "Air density increases on top of the blade",
                "The blade pushes the air downwards solely through Newton's third law"
            ],
            correct: 1,
            explanation: "Bernoulli's principle establishes that an increase in fluid velocity causes a decrease in pressure. The upper curvature accelerates air, creating low pressure and upward lift.",
            difficulty: "Medium"
        },
        {
            question: "What aerodynamic phenomenon occurs if the blade's 'Angle of Attack' becomes too extreme?",
            options: [
                "Lift generation increases infinitely",
                "Smooth airflow separates from the upper surface, causing an aerodynamic stall",
                "The rotor RPM increases dramatically",
                "Pressure on the bottom surface drops to an absolute vacuum"
            ],
            correct: 1,
            explanation: "Exceeding the critical angle of attack causes the boundary layer to detach from the upper surface, replacing smooth lift with turbulent eddies and causing an abrupt stall.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the Pitch Link Assembly in the rotor system?",
            options: [
                "To rotate the central hub assembly",
                "To dynamically adjust the blade's angle of attack to modulate lift",
                "To structurally secure the blade to the engine mast",
                "To cool the aerodynamic surfaces during high-speed rotation"
            ],
            correct: 1,
            explanation: "The pitch link connects the flight controls to the blade grip, allowing precise adjustments to the pitch angle, which directly controls the lift vector.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, m) {
        // High-speed rotor rotation
        m.hub.rotation.y = -time * speed * 3.0;
        
        // Cyclic pitch oscillation (simulating forward flight physics)
        const pitchAngle = Math.sin(time * speed * 3.0) * 0.15;
        m.blade.rotation.x = (Math.PI / 2) + pitchAngle;
        
        // Pulsating high-pressure vectors
        m.flowHigh.children.forEach((arrow, i) => {
            arrow.position.y = -1.5 - Math.sin(time * speed * 8 + i) * 0.2;
            arrow.scale.y = 1 + Math.sin(time * speed * 8 + i) * 0.2;
        });

        // Pulsating low-pressure vectors
        m.flowLow.children.forEach((arrow, i) => {
            arrow.position.y = 1.5 + Math.sin(time * speed * 8 + i + Math.PI) * 0.2;
            arrow.scale.y = 1 + Math.sin(time * speed * 8 + i + Math.PI) * 0.2;
        });
    }

    return { 
        group, 
        parts, 
        description, 
        quizQuestions, 
        animate: (t, s) => animate(t, s, meshes) 
    };
}

// Auto-generated missing stub
export function createRotorBlade() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
