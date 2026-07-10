import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials for visual flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.5
    });

    const energyCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x88bbff,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // 1. Engine Core
    const coreGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    coreGeo.rotateZ(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
    group.add(coreMesh);
    parts.push({
        name: "Engine Core",
        description: "The primary gas generator of the turbofan engine.",
        material: "darkSteel",
        function: "Provides thrust and power for the fan.",
        assemblyOrder: 1,
        connections: ["Fan Cowl", "Actuators"],
        failureEffect: "Loss of primary engine thrust.",
        cascadeFailures: ["Hydraulic pressure loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // Inner glowing core
    const innerGeo = new THREE.CylinderGeometry(1.4, 1.4, 8.1, 16);
    innerGeo.rotateZ(Math.PI / 2);
    const innerMesh = new THREE.Mesh(innerGeo, energyCoreMat);
    group.add(innerMesh);

    // 2. Fixed Fan Cowl
    const cowlGeo = new THREE.CylinderGeometry(2.6, 2.6, 3, 32);
    cowlGeo.rotateZ(Math.PI / 2);
    const cowlMesh = new THREE.Mesh(cowlGeo, aluminum);
    cowlMesh.position.x = -2.5;
    group.add(cowlMesh);
    parts.push({
        name: "Fixed Fan Cowl",
        description: "The stationary forward section of the engine nacelle.",
        material: "aluminum",
        function: "Aerodynamic fairing for the fan case.",
        assemblyOrder: 2,
        connections: ["Engine Core", "Cascade Vanes"],
        failureEffect: "Increased aerodynamic drag.",
        cascadeFailures: [],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -4.5, y: 0, z: 0 }
    });

    // 3. Cascade Vanes
    const cascadeGroup = new THREE.Group();
    cascadeGroup.position.x = 0.5;
    for (let i = 0; i < 24; i++) {
        const vaneGeo = new THREE.BoxGeometry(2.8, 0.1, 0.6);
        vaneGeo.rotateY(Math.PI / 6); // Angle the air forward
        vaneGeo.rotateZ(-Math.PI / 12);
        const vane = new THREE.Mesh(vaneGeo, steel);
        const angle = (i / 24) * Math.PI * 2;
        vane.position.set(0, Math.cos(angle) * 2.5, Math.sin(angle) * 2.5);
        vane.rotation.x = angle;
        cascadeGroup.add(vane);
    }
    group.add(cascadeGroup);
    parts.push({
        name: "Cascade Vanes",
        description: "A series of aerodynamic vanes exposed during reverse thrust.",
        material: "steel",
        function: "Directs bypass air forward to slow the aircraft.",
        assemblyOrder: 3,
        connections: ["Fixed Fan Cowl"],
        failureEffect: "Asymmetric reverse thrust.",
        cascadeFailures: ["Aircraft directional control issues"],
        originalPosition: { x: 0.5, y: 0, z: 0 },
        explodedPosition: { x: 0.5, y: 6.0, z: 0 }
    });

    // 4. Translating Sleeve
    const sleeveGeo = new THREE.CylinderGeometry(2.65, 2.65, 3.5, 32, 1, true);
    sleeveGeo.rotateZ(Math.PI / 2);
    const sleeveMesh = new THREE.Mesh(sleeveGeo, chrome);
    
    // Inner thickness of sleeve
    const sleeveInnerGeo = new THREE.CylinderGeometry(2.55, 2.55, 3.5, 32, 1, true);
    sleeveInnerGeo.rotateZ(Math.PI / 2);
    const sleeveInnerMesh = new THREE.Mesh(sleeveInnerGeo, darkSteel);
    
    const sleeveGroup = new THREE.Group();
    sleeveGroup.add(sleeveMesh);
    sleeveGroup.add(sleeveInnerMesh);
    group.add(sleeveGroup);
    
    parts.push({
        name: "Translating Sleeve",
        description: "The rear section of the nacelle that moves aft to expose cascade vanes.",
        material: "chrome",
        function: "Exposes cascades and triggers blocker doors.",
        assemblyOrder: 4,
        connections: ["Actuators", "Blocker Doors"],
        failureEffect: "Inability to deploy thrust reversers.",
        cascadeFailures: ["Increased landing distance"],
        originalPosition: { x: 0.75, y: 0, z: 0 },
        explodedPosition: { x: 5.0, y: 0, z: 0 }
    });
    meshes.sleeve = sleeveGroup;

    // 5. Blocker Doors
    const blockerGroup = new THREE.Group();
    const blockerDoors = [];
    for (let i = 0; i < 8; i++) {
        const doorGeo = new THREE.BoxGeometry(1.8, 0.1, 1.8);
        const door = new THREE.Mesh(doorGeo, neonOrange);
        const pivotGroup = new THREE.Group();
        
        door.position.set(-0.9, -0.9, 0); // Offset so it pivots from the edge
        pivotGroup.add(door);
        
        const angle = (i / 8) * Math.PI * 2;
        pivotGroup.position.set(2.5, Math.cos(angle) * 2.5, Math.sin(angle) * 2.5);
        pivotGroup.rotation.x = angle;
        
        blockerGroup.add(pivotGroup);
        blockerDoors.push(pivotGroup);
    }
    group.add(blockerGroup);
    parts.push({
        name: "Blocker Doors",
        description: "Doors that drop into the bypass duct to block rearward airflow.",
        material: "neonOrange",
        function: "Forces bypass air outward through the cascade vanes.",
        assemblyOrder: 5,
        connections: ["Translating Sleeve", "Linkages"],
        failureEffect: "Loss of reverse thrust capability.",
        cascadeFailures: ["Engine over-temperature"],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 2.5, y: -5.0, z: 0 }
    });
    meshes.blockerDoors = blockerDoors;

    // 6. Hydraulic Actuators
    const actuatorGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
    actuatorGeo.rotateZ(Math.PI / 2);
    const actuatorMeshes = [];
    for(let i = 0; i < 4; i++) {
        const act = new THREE.Mesh(actuatorGeo, neonBlue);
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        act.position.set(-1.0, Math.cos(angle) * 2.6, Math.sin(angle) * 2.6);
        group.add(act);
        actuatorMeshes.push(act);
    }
    parts.push({
        name: "Hydraulic Actuators",
        description: "High-pressure hydraulic rams that move the translating sleeve.",
        material: "neonBlue",
        function: "Provides the mechanical force to deploy and stow the thrust reverser.",
        assemblyOrder: 6,
        connections: ["Translating Sleeve", "Engine Core"],
        failureEffect: "Sleeve jams in current position.",
        cascadeFailures: ["Thrust reverser lockout"],
        originalPosition: { x: -1.0, y: 0, z: 0 },
        explodedPosition: { x: -1.0, y: 0, z: 4 }
    });
    meshes.actuators = actuatorMeshes;

    const description = "The cascade-type aerodynamic thrust reverser is used on high-bypass turbofan engines. When deployed, the translating sleeve moves aft, exposing a set of cascade vanes. Simultaneously, blocker doors pivot into the bypass duct, blocking the fan air from exiting backward and forcing it out through the cascades, which direct it forward to decelerate the aircraft.";

    const quizQuestions = [
        {
            question: "What is the primary function of the blocker doors in a cascade thrust reverser?",
            options: [
                "To direct air outward into the atmosphere",
                "To block the primary exhaust of the engine core",
                "To block the fan bypass air and force it through the cascades",
                "To cool the hydraulic actuators"
            ],
            correct: 2,
            explanation: "The blocker doors pivot down into the bypass duct to block fan air from continuing rearward, forcing it radially outward through the cascade vanes.",
            difficulty: "Medium"
        },
        {
            question: "Which component actually redirects the airflow in a forward direction to create reverse thrust?",
            options: [
                "Translating Sleeve",
                "Cascade Vanes",
                "Hydraulic Actuators",
                "Fixed Fan Cowl"
            ],
            correct: 1,
            explanation: "The cascade vanes are angled specifically to turn the radially exiting bypass air forward, creating the reverse thrust force.",
            difficulty: "Easy"
        },
        {
            question: "What powers the movement of the translating sleeve?",
            options: [
                "Electric motors",
                "Hydraulic or pneumatic actuators",
                "Aerodynamic forces alone",
                "Cables driven by the pilot"
            ],
            correct: 1,
            explanation: "Heavy-duty hydraulic or sometimes pneumatic actuators are used to provide the large forces required to move the translating sleeve against aerodynamic loads.",
            difficulty: "Medium"
        },
        {
            question: "Why are cascade vanes angled forward?",
            options: [
                "To reduce aerodynamic drag",
                "To direct the bypass air forward, opposing the aircraft's motion",
                "To increase the speed of the fan",
                "To prevent debris from entering the engine core"
            ],
            correct: 1,
            explanation: "By directing the high-velocity bypass air forward, the cascade vanes create a thrust force that opposes the aircraft's forward motion, decelerating it.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, externalMeshes) {
        const m = externalMeshes || meshes;
        // deployment oscillates smoothly between 0 (stowed) and 1 (fully deployed)
        const deployment = (Math.sin(time * speed) + 1) / 2; 
        
        // Translate sleeve backward (positive x)
        const sleeveStowedX = 0.75;
        const sleeveDeployedX = 3.5;
        const currentSleeveX = sleeveStowedX + (sleeveDeployedX - sleeveStowedX) * deployment;
        m.sleeve.position.x = currentSleeveX;
        
        // Blocker doors move with the sleeve and pivot inward into the air stream
        m.blockerDoors.forEach(doorGroup => {
            doorGroup.position.x = currentSleeveX + 1.0; 
            // Pivot angle: 0 when stowed, ~80 degrees inwards when deployed
            doorGroup.rotation.z = -(Math.PI / 2.2) * deployment;
        });

        // Extend hydraulic actuators visually
        m.actuators.forEach(act => {
            const length = 1.0 + 2.75 * deployment;
            act.scale.x = length;
            act.position.x = -1.0 + length / 2;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createThrustReverser() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
