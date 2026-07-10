import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const neonMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const highTechGlass = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.5,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    // 1. Base / A-Frame Supports
    const baseGroup = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(0.5, 1, 15, 8);
    const leg1 = new THREE.Mesh(legGeo, darkSteel);
    leg1.position.set(-4, 7.5, 3);
    leg1.rotation.z = -0.3;
    leg1.rotation.x = -0.2;
    
    const leg2 = new THREE.Mesh(legGeo, darkSteel);
    leg2.position.set(4, 7.5, 3);
    leg2.rotation.z = 0.3;
    leg2.rotation.x = -0.2;

    const leg3 = new THREE.Mesh(legGeo, darkSteel);
    leg3.position.set(-4, 7.5, -3);
    leg3.rotation.z = -0.3;
    leg3.rotation.x = 0.2;

    const leg4 = new THREE.Mesh(legGeo, darkSteel);
    leg4.position.set(4, 7.5, -3);
    leg4.rotation.z = 0.3;
    leg4.rotation.x = 0.2;

    baseGroup.add(leg1, leg2, leg3, leg4);
    group.add(baseGroup);

    parts.push({
        name: 'support_frame',
        description: 'High-strength A-frame supports that bear the immense weight of the wheel and dynamic loads from wind and rotation.',
        material: 'darkSteel',
        function: 'Provides structural stability and grounds the machine.',
        assemblyOrder: 1,
        connections: ['central_axle', 'ground'],
        failureEffect: 'Catastrophic structural collapse.',
        cascadeFailures: ['central_axle', 'wheel_rim_spokes', 'gondolas'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });
    meshes['support_frame'] = baseGroup;

    // 2. Central Axle & Hub
    const axleGeo = new THREE.CylinderGeometry(1.5, 1.5, 7, 32);
    const axleMesh = new THREE.Mesh(axleGeo, chrome);
    axleMesh.rotation.x = Math.PI / 2;
    axleMesh.position.set(0, 15, 0);
    group.add(axleMesh);

    parts.push({
        name: 'central_axle',
        description: 'The massive central pivot point around which the entire wheel rotates, containing high-tech magnetic bearings.',
        material: 'chrome',
        function: 'Allows smooth rotation of the wheel while transmitting weight to the supports.',
        assemblyOrder: 2,
        connections: ['support_frame', 'wheel_rim_spokes'],
        failureEffect: 'Wheel ceases to rotate or falls from supports.',
        cascadeFailures: ['wheel_rim_spokes'],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 10 }
    });
    meshes['central_axle'] = axleMesh;

    // 3. Rotating Wheel Assembly (Spokes + Rim)
    const wheelAssembly = new THREE.Group();
    wheelAssembly.position.set(0, 15, 0);
    group.add(wheelAssembly);

    const spokesGeo = new THREE.CylinderGeometry(0.2, 0.2, 19.6, 8);
    const spokesGroup = new THREE.Group();
    
    const rimGeo = new THREE.TorusGeometry(10, 0.4, 16, 64);
    const rimMesh = new THREE.Mesh(rimGeo, neonCyan);
    wheelAssembly.add(rimMesh);

    const innerRimGeo = new THREE.TorusGeometry(8, 0.2, 16, 64);
    const innerRimMesh = new THREE.Mesh(innerRimGeo, steel);
    wheelAssembly.add(innerRimMesh);

    const numSpokes = 12;
    for (let i = 0; i < numSpokes; i++) {
        const angle = (i / numSpokes) * Math.PI * 2;
        const spoke = new THREE.Mesh(spokesGeo, aluminum);
        spoke.rotation.z = angle;
        spokesGroup.add(spoke);
    }
    wheelAssembly.add(spokesGroup);

    parts.push({
        name: 'wheel_rim_spokes',
        description: 'The main rotating circular structure combined with tensioned spokes holding its shape.',
        material: 'neonCyan, aluminum',
        function: 'Distributes weight from the gondolas to the central axle and maintains circular geometry.',
        assemblyOrder: 3,
        connections: ['central_axle', 'gondolas'],
        failureEffect: 'Deformation of the wheel leading to clearance issues and jamming.',
        cascadeFailures: ['gondolas'],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: -10 }
    });
    meshes['wheel_rim_spokes'] = wheelAssembly;

    // 4. Gondolas
    const gondolaGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const roofGeo = new THREE.ConeGeometry(1.2, 1, 4);
    
    const gondolaGroup = new THREE.Group();
    gondolaGroup.position.set(0, 15, 0);
    group.add(gondolaGroup);
    
    const gondolas = [];

    for (let i = 0; i < numSpokes; i++) {
        const gContainer = new THREE.Group();
        
        const gondolaBody = new THREE.Mesh(gondolaGeo, highTechGlass);
        const gondolaRoof = new THREE.Mesh(roofGeo, neonMagenta);
        gondolaRoof.position.y = 1.5;
        gondolaRoof.rotation.y = Math.PI / 4;
        
        const mountGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.rotation.x = Math.PI / 2;
        mount.position.y = 2.5;

        gContainer.add(gondolaBody);
        gContainer.add(gondolaRoof);
        gContainer.add(mount);

        const angle = (i / numSpokes) * Math.PI * 2;
        gContainer.position.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 0);
        
        gondolaBody.position.y = -1;
        gondolaRoof.position.y = 0.5;
        mount.position.y = 1;

        gondolaGroup.add(gContainer);
        gondolas.push({ angle, container: gContainer });
    }

    parts.push({
        name: 'gondolas',
        description: 'Passenger cabins featuring high-tech glass and gyroscopic leveling systems.',
        material: 'highTechGlass',
        function: 'Safely holds passengers during the ride.',
        assemblyOrder: 4,
        connections: ['wheel_rim_spokes'],
        failureEffect: 'Gondolas invert, causing passenger injury.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });
    meshes['gondolas'] = gondolaGroup;

    // 5. Drive Motor
    const motorGeo = new THREE.BoxGeometry(2, 2, 4);
    const motorMesh = new THREE.Mesh(motorGeo, copper);
    motorMesh.position.set(-2, 14, -2.5);
    group.add(motorMesh);

    parts.push({
        name: 'drive_motor',
        description: 'A powerful high-torque electric motor with copper coils driving the wheel via friction wheels.',
        material: 'copper',
        function: 'Provides the rotational force to turn the massive wheel against friction and uneven weight distribution.',
        assemblyOrder: 5,
        connections: ['support_frame', 'wheel_rim_spokes'],
        failureEffect: 'Wheel stops moving, trapping passengers.',
        cascadeFailures: [],
        originalPosition: { x: -2, y: 14, z: -2.5 },
        explodedPosition: { x: -10, y: 14, z: -5 }
    });
    meshes['drive_motor'] = motorMesh;

    group.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const description = "A massive, high-tech amusement park ferris wheel utilizing glowing neon rims, a robust dark-steel A-frame, and self-leveling glass gondolas driven by an advanced copper-coil electric motor.";

    const quizQuestions = [
        {
            question: "What is the primary function of the A-frame supports in a Ferris Wheel?",
            options: [
                "To rotate the wheel",
                "To ground the machine and bear the entire weight and dynamic loads",
                "To keep the gondolas perfectly level",
                "To power the glowing neon lights"
            ],
            correct: 1,
            explanation: "The A-frame structure acts as the foundational support, holding the massive weight of the central axle, spokes, rims, gondolas, and passengers, while resisting dynamic wind loads.",
            difficulty: "easy"
        },
        {
            question: "Why must gondolas use a pivoting mount at the top rather than a rigid connection?",
            options: [
                "So they can spin rapidly for thrill-seekers",
                "To save weight in the overall design",
                "To allow gravity (and sometimes gyroscopes) to keep the cabin level as the wheel rotates",
                "To easily detach them for maintenance"
            ],
            correct: 2,
            explanation: "If gondolas were rigidly connected to the wheel, they would flip upside down as the wheel reaches the top. A pivot allows gravity to keep the cabin upright.",
            difficulty: "medium"
        },
        {
            question: "What component is directly responsible for converting electrical energy into the mechanical rotation of the wheel?",
            options: [
                "The Central Axle",
                "The Drive Motor",
                "The Tensioned Spokes",
                "The Magnetic Bearings"
            ],
            correct: 1,
            explanation: "The drive motor, typically using high-torque electric components (like copper coils), converts electrical power into mechanical torque, driving the wheel's rotation.",
            difficulty: "easy"
        },
        {
            question: "In structural terms, how do the 'tensioned spokes' function similarly to a bicycle wheel?",
            options: [
                "They act as brakes",
                "They provide power to the outer rim",
                "They keep the rim perfectly circular by balancing tension forces across the central hub",
                "They expand under heat to make the wheel larger"
            ],
            correct: 2,
            explanation: "Much like a bicycle wheel, thin spokes kept under high tension pull equally on the outer rim, maintaining its structural integrity and circular shape without requiring massive rigid beams.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        const rotationSpeed = speed * 0.5;
        const currentRotation = time * rotationSpeed;

        if (meshesObj && meshesObj['wheel_rim_spokes']) {
            meshesObj['wheel_rim_spokes'].rotation.z = currentRotation;
        }

        gondolas.forEach((gData) => {
            const totalAngle = gData.angle + currentRotation;
            gData.container.position.x = Math.cos(totalAngle) * 10;
            gData.container.position.y = Math.sin(totalAngle) * 10;
            
            // Add a slight swinging effect based on speed, settling to 0
            const swing = Math.sin(time * 3 + gData.angle) * 0.05 * speed;
            gData.container.rotation.z = swing;
        });
        
        if (meshesObj && meshesObj['drive_motor']) {
            // Rotate the motor itself slightly or any specific component
            meshesObj['drive_motor'].rotation.x = time * speed * 2;
        }
    }

    parts.forEach(part => {
        part.mesh = meshes[part.name];
    });

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFerrisWheel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
