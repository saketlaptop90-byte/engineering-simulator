import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.0, metalness: 0.9, roughness: 0.1, clearcoat: 1.0
    });
    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.2
    });
    const neonGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0, metalness: 0.2, roughness: 0.8
    });

    const angle = Math.PI / 6; // 30 degrees inclination
    const length = 24;
    const radius = 1.2;
    const turns = 12;
    
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // 1. Main Tube (Transparent/Glass)
    const tubeGeom = new THREE.CylinderGeometry(radius, radius, length, 32);
    const tubeMesh = new THREE.Mesh(tubeGeom, glass);
    tubeMesh.rotation.z = -Math.PI / 2 + angle;
    group.add(tubeMesh);
    
    parts.push({
        name: "Transparent Housing Tube",
        description: "Encloses the helical screw and channels the grain upwards.",
        material: "Glass",
        function: "Prevents grain spillage and provides a rigid conduit.",
        assemblyOrder: 1,
        connections: ["Helical Screw", "Intake Hopper", "Discharge Spout"],
        failureEffect: "Grain spills out, severely reducing efficiency.",
        cascadeFailures: ["Dust explosion risk due to escaped particles"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 5, z: 5 }
    });

    // 2. Helical Screw (Flighting)
    const screwGroup = new THREE.Group();
    const shaftGeom = new THREE.CylinderGeometry(0.3, 0.3, length, 16);
    const shaftMesh = new THREE.Mesh(shaftGeom, steel);
    screwGroup.add(shaftMesh);

    const flightPoints = [];
    for(let i=0; i<=turns*32; i++) {
        const t = i / (turns*32);
        const y = -length/2 + t * length;
        const rad = i * Math.PI / 16;
        flightPoints.push(new THREE.Vector3(Math.cos(rad)*radius*0.85, y, Math.sin(rad)*radius*0.85));
    }
    const flightCurve = new THREE.CatmullRomCurve3(flightPoints);
    const flightGeom = new THREE.TubeGeometry(flightCurve, turns*64, 0.15, 8, false);
    const flightMesh = new THREE.Mesh(flightGeom, neonBlue);
    screwGroup.add(flightMesh);
    
    screwGroup.rotation.z = -Math.PI / 2 + angle;
    group.add(screwGroup);
    
    parts.push({
        name: "Helical Flighting (Screw)",
        description: "The rotating Archimedes' screw that moves the material.",
        material: "Neon Blue / Steel",
        function: "Pushes grain up the tube via rotational mechanical work.",
        assemblyOrder: 2,
        connections: ["Housing Tube", "Drive Motor", "Bearings"],
        failureEffect: "Conveying stops completely.",
        cascadeFailures: ["Motor overload if jammed"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -5, z: -5 }
    });

    // 3. Intake Hopper
    const hopperGeom = new THREE.ConeGeometry(3, 3, 4, 16, true);
    const hopperMesh = new THREE.Mesh(hopperGeom, darkSteel);
    hopperMesh.rotation.x = Math.PI;
    hopperMesh.position.set(-length/2 * dx, -length/2 * dy + 1, 0);
    group.add(hopperMesh);
    
    parts.push({
        name: "Intake Hopper",
        description: "A funnel-shaped intake to guide grain into the auger.",
        material: "Dark Steel",
        function: "Gathers loose grain and directs it into the flighting.",
        assemblyOrder: 3,
        connections: ["Housing Tube", "Safety Guard"],
        failureEffect: "Grain clogs or spills at the intake point.",
        cascadeFailures: [],
        originalPosition: { x: -length/2 * dx, y: -length/2 * dy + 1, z: 0 },
        explodedPosition: { x: -length/2 * dx - 3, y: -length/2 * dy + 4, z: 0 }
    });

    // 4. Drive Motor
    const motorGeom = new THREE.BoxGeometry(2, 2, 2);
    const motorMesh = new THREE.Mesh(motorGeom, chrome);
    motorMesh.position.set(length/2 * dx, length/2 * dy + 1.5, 0);
    group.add(motorMesh);
    
    const coilGeom = new THREE.TorusGeometry(1, 0.2, 16, 32);
    const coilMesh = new THREE.Mesh(coilGeom, neonOrange);
    coilMesh.rotation.y = Math.PI / 2;
    motorMesh.add(coilMesh);

    parts.push({
        name: "Electric Drive Motor",
        description: "High-torque electric motor powering the screw.",
        material: "Chrome / Neon Orange",
        function: "Provides the rotational energy required to move the grain mass.",
        assemblyOrder: 4,
        connections: ["Helical Screw", "Power Supply", "Mounting Bracket"],
        failureEffect: "Auger cannot run. No power.",
        cascadeFailures: ["Electrical shorts", "Control board burnout"],
        originalPosition: { x: length/2 * dx, y: length/2 * dy + 1.5, z: 0 },
        explodedPosition: { x: length/2 * dx + 4, y: length/2 * dy + 4, z: 0 }
    });

    // 5. Discharge Spout
    const spoutGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 16);
    const spoutMesh = new THREE.Mesh(spoutGeom, aluminum);
    spoutMesh.rotation.z = Math.PI / 2;
    spoutMesh.position.set(length/2 * dx, length/2 * dy - 1.5, 0);
    group.add(spoutMesh);
    
    parts.push({
        name: "Discharge Spout",
        description: "The exit chute for the transported grain.",
        material: "Aluminum",
        function: "Directs the output flow of grain into bins or trucks.",
        assemblyOrder: 5,
        connections: ["Housing Tube"],
        failureEffect: "Grain scatters at the exit, missing the target bin.",
        cascadeFailures: [],
        originalPosition: { x: length/2 * dx, y: length/2 * dy - 1.5, z: 0 },
        explodedPosition: { x: length/2 * dx + 2, y: length/2 * dy - 4, z: 0 }
    });

    // 6. Grain Particles (Animated system)
    const particleGroup = new THREE.Group();
    const particleCount = 120;
    const particleGeom = new THREE.SphereGeometry(0.15, 8, 8);
    for(let i=0; i<particleCount; i++) {
        const pMesh = new THREE.Mesh(particleGeom, neonGreen);
        const t = Math.random();
        pMesh.userData = { 
            t: t, 
            radiusOffset: (Math.random()-0.5)*radius*1.1, 
            angleOffset: Math.random()*Math.PI*2 
        };
        particleGroup.add(pMesh);
    }
    group.add(particleGroup);
    
    parts.push({
        name: "Grain Flow Simulation",
        description: "Glowing particles representing the grain or payload.",
        material: "Neon Green",
        function: "Visualizes the flow and throughput of the auger conveyor.",
        assemblyOrder: 6,
        connections: [],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    const description = "The Agricultural Grain Auger Conveyor is a high-tech visualization of an Archimedes' screw in action. It demonstrates how rotational energy is converted into linear motion to lift bulk materials efficiently over a steep incline. Features transparent housings, a glowing helical flighting, and particle flow simulation to clearly map out the kinematics and dynamics of bulk material handling.";

    const quizQuestions = [
        {
            question: "What ancient principle does the grain auger utilize to move material?",
            options: [
                "Bernoulli's principle",
                "Archimedes' screw",
                "Venturi effect",
                "Newton's third law"
            ],
            correct: 1,
            explanation: "The grain auger uses the Archimedes' screw mechanism, consisting of a helical surface surrounding a central cylindrical shaft, to push material upwards as it rotates.",
            difficulty: "easy"
        },
        {
            question: "If the auger jams while the motor continues applying torque, what is the most likely immediate failure?",
            options: [
                "The hopper detaches",
                "The electric motor overloads and burns out, or the shear pin breaks",
                "The grain particles explode immediately",
                "The housing tube shatters"
            ],
            correct: 1,
            explanation: "In a jam scenario, the mechanical resistance spikes. Unless protected by a shear pin that breaks to save the system, the motor will draw excessive current and burn out due to thermal overload.",
            difficulty: "medium"
        },
        {
            question: "Why is the housing tube typically completely sealed in a real grain auger (unlike our transparent visualization)?",
            options: [
                "To prevent grain spillage and reduce airborne dust",
                "To increase the weight of the machine",
                "To hide proprietary technology",
                "To keep the grain warm"
            ],
            correct: 0,
            explanation: "A sealed tube contains the grain preventing spillage, and crucially, contains agricultural dust which poses severe respiratory and explosive hazards in enclosed spaces.",
            difficulty: "easy"
        },
        {
            question: "How does the angle of inclination affect the capacity of the auger?",
            options: [
                "It has no effect",
                "As the angle increases, capacity increases",
                "As the angle increases, capacity decreases",
                "Capacity fluctuates randomly with angle"
            ],
            correct: 2,
            explanation: "As the incline angle becomes steeper, the auger must fight gravity more directly, and material tends to slip backward over the flights, reducing the overall volumetric capacity per rotation.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        const dt = speed * 0.05;
        
        screwGroup.children[0].rotation.y -= dt * 2; 
        screwGroup.children[1].rotation.y -= dt * 2; 
        
        motorMesh.children[0].rotation.z += dt * 5;

        particleGroup.children.forEach(p => {
            p.userData.t += dt * 0.15; 
            if(p.userData.t > 1) p.userData.t = 0;
            
            const t = p.userData.t;
            const localY = -length/2 + t * length;
            
            const helixRad = p.userData.angleOffset + t * turns * Math.PI * 2;
            const r = radius * 0.5 + p.userData.radiusOffset;
            
            const localX = Math.cos(helixRad) * r;
            const localZ = Math.sin(helixRad) * r;
            
            const worldX = localX * Math.cos(-Math.PI/2 + angle) - localY * Math.sin(-Math.PI/2 + angle);
            const worldY = localX * Math.sin(-Math.PI/2 + angle) + localY * Math.cos(-Math.PI/2 + angle);
            
            p.position.set(worldX, worldY, localZ);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGrainAugerConveyor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
