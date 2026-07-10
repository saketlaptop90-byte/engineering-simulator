import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        drumGroup: new THREE.Group(),
        motorShaft: null,
        balls: [],
        minerals: []
    };

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95
    });

    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 1.5,
        roughness: 0.6,
        metalness: 0.1
    });

    const holoGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.4,
        emissive: 0x001133,
        emissiveIntensity: 0.2
    });

    // 1. Base Frame
    const baseGeo = new THREE.BoxGeometry(10, 1.5, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -3.75, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Frame",
        description: "Heavy-duty dark steel base providing stability against massive rotational forces.",
        material: "Dark Steel",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Motor Assembly", "Drum Supports"],
        failureEffect: "Machine collapse",
        cascadeFailures: ["Drum", "Motor", "Gears"],
        originalPosition: {x: 0, y: -3.75, z: 0},
        explodedPosition: {x: 0, y: -8, z: 0}
    });

    // 2. Supports
    const supportGeo = new THREE.BoxGeometry(1.5, 5, 4);
    const supportLeft = new THREE.Mesh(supportGeo, steel);
    supportLeft.position.set(-4.25, -0.5, 0);
    const supportRight = new THREE.Mesh(supportGeo, steel);
    supportRight.position.set(4.25, -0.5, 0);
    group.add(supportLeft, supportRight);
    parts.push({
        name: "Bearing Supports",
        description: "Steel pillars housing the main bearings for the drum shaft.",
        material: "Steel",
        function: "Load distribution and low-friction rotation support",
        assemblyOrder: 2,
        connections: ["Base Frame", "Drum Shaft"],
        failureEffect: "Drum misalignment",
        cascadeFailures: ["Drum Shaft", "Gears"],
        originalPosition: {x: 0, y: -0.5, z: 0},
        explodedPosition: {x: 0, y: -0.5, z: 6}
    });

    // 3. Drum Group (Rotates)
    group.add(meshes.drumGroup);

    // 3a. Drum Body (Transparent HoloGlass)
    const drumGeo = new THREE.CylinderGeometry(3, 3, 7, 32, 1, true);
    // Rotate to lie horizontally
    drumGeo.rotateZ(Math.PI / 2);
    const drumBody = new THREE.Mesh(drumGeo, holoGlass);
    meshes.drumGroup.add(drumBody);
    
    // 3b. Drum Ends
    const drumEndGeo = new THREE.CylinderGeometry(3, 3, 0.4, 32);
    drumEndGeo.rotateZ(Math.PI / 2);
    const drumEndLeft = new THREE.Mesh(drumEndGeo, chrome);
    drumEndLeft.position.set(-3.5, 0, 0);
    const drumEndRight = new THREE.Mesh(drumEndGeo, chrome);
    drumEndRight.position.set(3.5, 0, 0);
    meshes.drumGroup.add(drumEndLeft, drumEndRight);

    // 3c. Main Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 16);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, chrome);
    meshes.drumGroup.add(shaft);

    parts.push({
        name: "Grinding Drum",
        description: "Massive transparent containment vessel rotating to tumble the grinding media.",
        material: "Holographic Glass & Chrome",
        function: "Contains raw materials and grinding balls during the milling process",
        assemblyOrder: 3,
        connections: ["Bearing Supports", "Motor Gear"],
        failureEffect: "Material spill and grinding halt",
        cascadeFailures: ["Raw Materials"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 4. Motor & Gearbox
    const motorGroup = new THREE.Group();
    const motorGeo = new THREE.CylinderGeometry(1, 1, 2.5, 32);
    motorGeo.rotateX(Math.PI / 2);
    const motorBody = new THREE.Mesh(motorGeo, aluminum);
    motorBody.position.set(4, -2.5, 3.5);
    
    const gearGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
    gearGeo.rotateZ(Math.PI / 2);
    const gearMesh = new THREE.Mesh(gearGeo, copper);
    gearMesh.position.set(4.5, 0, 0); // connected to shaft
    
    meshes.motorShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), steel);
    meshes.motorShaft.rotateX(Math.PI/2);
    meshes.motorShaft.position.set(4.5, -2.5, 2);

    motorGroup.add(motorBody, gearMesh, meshes.motorShaft);
    group.add(motorGroup);

    parts.push({
        name: "Drive Motor & Gearbox",
        description: "High-torque electric motor and copper gearing system providing rotational force.",
        material: "Aluminum & Copper",
        function: "Converts electrical energy into mechanical rotation",
        assemblyOrder: 4,
        connections: ["Base Frame", "Drum Shaft"],
        failureEffect: "Rotation ceases",
        cascadeFailures: ["Grinding Drum"],
        originalPosition: {x: 4.5, y: -2.5, z: 2},
        explodedPosition: {x: 8, y: -2.5, z: 8}
    });

    // 5. Grinding Balls (Neon Blue)
    const ballGeo = new THREE.SphereGeometry(0.3, 16, 16);
    for (let i = 0; i < 40; i++) {
        const ball = new THREE.Mesh(ballGeo, neonBlue);
        meshes.balls.push({
            mesh: ball,
            offset: Math.random() * Math.PI * 2,
            radius: 1.5 + Math.random() * 1.2,
            zPos: (Math.random() - 0.5) * 6
        });
        meshes.drumGroup.add(ball);
    }
    parts.push({
        name: "Ceramic Grinding Balls",
        description: "Ultra-hard, neon-glowing ceramic spheres acting as the grinding media.",
        material: "Neon Ceramic",
        function: "Crushes materials through kinetic impact and attrition",
        assemblyOrder: 5,
        connections: ["Grinding Drum"],
        failureEffect: "Inefficient or halted grinding",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -1.5, z: 0},
        explodedPosition: {x: -6, y: 0, z: -6}
    });

    // 6. Raw Minerals (Neon Orange)
    const mineralGeo = new THREE.DodecahedronGeometry(0.2, 0);
    for (let i = 0; i < 60; i++) {
        const mineral = new THREE.Mesh(mineralGeo, neonOrange);
        meshes.minerals.push({
            mesh: mineral,
            offset: Math.random() * Math.PI * 2,
            radius: 1.0 + Math.random() * 1.8,
            zPos: (Math.random() - 0.5) * 6.5,
            rotationSpeed: Math.random() * 0.2
        });
        meshes.drumGroup.add(mineral);
    }
    parts.push({
        name: "Raw Minerals",
        description: "Unprocessed ore and minerals glowing brightly before pulverization.",
        material: "Neon Plasma Ore",
        function: "The feedstock material being processed into fine powder",
        assemblyOrder: 6,
        connections: ["Grinding Drum"],
        failureEffect: "Product loss",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 6, y: 0, z: -6}
    });

    const description = "Ceramics Ball Mill - A heavy-duty industrial grinder used to crush raw materials into fine powders for ceramic production. Features a transparent reinforced drum displaying the high-energy kinetic impact of neon ceramic grinding balls.";

    const quizQuestions = [
        {
            question: "What is the primary function of the heavy ceramic or steel balls inside the mill?",
            options: [
                "To generate heat for drying",
                "To crush and grind raw materials through impact and friction",
                "To prevent the drum from spinning too fast",
                "To polish the inner walls of the drum"
            ],
            correct: 1,
            explanation: "As the drum rotates, the balls are lifted and dropped, crushing the materials underneath them through kinetic impact and friction.",
            difficulty: "easy"
        },
        {
            question: "What happens if a ball mill rotates significantly faster than its critical speed?",
            options: [
                "Grinding efficiency increases exponentially",
                "The balls stick to the inner wall due to centrifugal force, stopping grinding",
                "The drum shatters from excess pressure",
                "The raw materials melt into glass"
            ],
            correct: 1,
            explanation: "At supercritical speeds, centrifugal force pins the grinding media against the wall, preventing them from falling and effectively stopping the grinding process.",
            difficulty: "medium"
        },
        {
            question: "Which component transfers power from the motor to rotate the massive drum?",
            options: [
                "The Drive Shaft and Gear System",
                "The Inlet Pipe",
                "The Ceramic Balls",
                "The Base Frame"
            ],
            correct: 0,
            explanation: "The motor rotates a drive shaft that connects to a gear system, providing the immense torque needed to turn the heavy, loaded drum.",
            difficulty: "easy"
        }
    ];

    const animate = (time, speed, externalMeshes) => {
        // Rotate Drum
        if (meshes.drumGroup) {
            meshes.drumGroup.rotation.x = time * speed;
        }
        
        // Rotate Motor Shaft
        if (meshes.motorShaft) {
            meshes.motorShaft.rotation.y = time * speed * 5;
        }

        // Tumble balls inside the rotating drum
        meshes.balls.forEach(b => {
            const angle = time * speed * -0.5 + b.offset; // Counter-rotate relative to drum
            b.mesh.position.y = Math.sin(angle) * b.radius;
            b.mesh.position.z = Math.cos(angle) * b.radius;
            b.mesh.position.x = b.zPos;
            b.mesh.rotation.x += speed * 0.1;
            b.mesh.rotation.y += speed * 0.05;
        });

        // Tumble and pulse minerals
        meshes.minerals.forEach(m => {
            const angle = time * speed * -0.6 + m.offset;
            m.mesh.position.y = Math.sin(angle) * m.radius;
            m.mesh.position.z = Math.cos(angle) * m.radius;
            m.mesh.position.x = m.zPos;
            m.mesh.rotation.x += m.rotationSpeed * speed;
            m.mesh.rotation.y += m.rotationSpeed * speed;
            
            // Pulse effect
            const scale = 0.8 + Math.sin(time * 5 + m.offset) * 0.2;
            m.mesh.scale.setScalar(scale);
        });
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBallMill() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
