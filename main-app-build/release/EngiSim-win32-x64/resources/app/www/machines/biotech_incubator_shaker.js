import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for glowing neon elements
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00d0ff,
        emissive: 0x00d0ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x39ff14,
        emissive: 0x39ff14,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff003c,
        emissive: 0xff003c,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7
    });

    // Outer Enclosure (Base + Walls)
    const enclosureGeo = new THREE.BoxGeometry(10, 8, 8);
    const enclosureMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.8, transparent: true, opacity: 0.1 });
    const enclosureMesh = new THREE.Mesh(enclosureGeo, enclosureMaterial);
    
    // Using a more solid frame for the actual part that will be interactive
    const frameGeo = new THREE.BoxGeometry(10.2, 0.5, 8.2);
    const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
    frameMesh.position.set(0, -3.75, 0);
    group.add(frameMesh);
    
    parts.push({
        name: "Incubator Base Chassis",
        description: "The sturdy steel base containing the heavy-duty drive mechanisms and power supplies.",
        material: "Dark Steel",
        function: "Provides structural stability and houses the motor assembly, preventing vibration transfer.",
        assemblyOrder: 1,
        connections: ["Motor Assembly", "Control Panel", "Outer Chamber"],
        failureEffect: "Excessive vibration, loud operational noise.",
        cascadeFailures: ["Motor Shaft", "Orbital Platform"],
        originalPosition: { x: 0, y: -3.75, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: frameMesh
    });

    // Control Panel
    const panelGeo = new THREE.BoxGeometry(10.2, 2, 1);
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    panelMesh.position.set(0, -2.5, 4.1);
    
    // Screen on panel
    const screenGeo = new THREE.PlaneGeometry(6, 1.2);
    const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
    screenMesh.position.set(0, 0, 0.51);
    panelMesh.add(screenMesh);
    
    group.add(panelMesh);

    parts.push({
        name: "Touchscreen Interface",
        description: "A high-resolution interface for controlling temperature, CO2 levels, and RPM.",
        material: "Plastic/Glass",
        function: "User input and monitoring of internal environmental parameters.",
        assemblyOrder: 2,
        connections: ["Incubator Base Chassis", "Microcontroller"],
        failureEffect: "Inability to set parameters; loss of monitoring.",
        cascadeFailures: ["Thermal Sensors"],
        originalPosition: { x: 0, y: -2.5, z: 4.1 },
        explodedPosition: { x: 0, y: -2.5, z: 8 },
        mesh: panelMesh
    });

    // Motor Assembly
    const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const motorMesh = new THREE.Mesh(motorGeo, copper);
    motorMesh.position.set(0, -2.5, 0);
    motorMesh.rotation.x = Math.PI / 2;
    group.add(motorMesh);

    parts.push({
        name: "Brushless DC Motor",
        description: "High-torque, low-heat brushless motor driving the orbital shaking platform.",
        material: "Copper/Steel",
        function: "Generates the orbital motion required for cell aeration.",
        assemblyOrder: 3,
        connections: ["Incubator Base Chassis", "Eccentric Drive Shaft"],
        failureEffect: "Platform stops shaking, resulting in cell settling and death.",
        cascadeFailures: ["Drive Belt"],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: motorMesh
    });

    // Eccentric Drive Shaft (Creates the orbital motion)
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.position.set(0, -1, 0);
    group.add(shaftMesh);

    parts.push({
        name: "Eccentric Drive Shaft",
        description: "Offset rotary shaft that translates motor rotation into an orbital path.",
        material: "Chrome",
        function: "Converts standard rotational motion into smooth, circular shaking motion.",
        assemblyOrder: 4,
        connections: ["Brushless DC Motor", "Orbital Platform"],
        failureEffect: "Jerky or irregular shaking motion.",
        cascadeFailures: ["Bearings", "Flask Clamps"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 5 },
        mesh: shaftMesh
    });

    // Orbital Platform
    const platformGeo = new THREE.BoxGeometry(8, 0.3, 6);
    const platformMesh = new THREE.Mesh(platformGeo, aluminum);
    platformMesh.position.set(0, -0.1, 0);
    group.add(platformMesh);

    parts.push({
        name: "Orbital Platform",
        description: "Vibration-dampened aluminum platform where culture flasks are mounted.",
        material: "Aluminum",
        function: "Holds vessels and agitates liquid media to maximize oxygen transfer.",
        assemblyOrder: 5,
        connections: ["Eccentric Drive Shaft", "Erlenmeyer Flasks"],
        failureEffect: "Spillage or failure to shake cultures.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.1, z: 0 },
        explodedPosition: { x: -8, y: -0.1, z: 0 },
        mesh: platformMesh
    });

    // Heating Element
    const heaterGeo = new THREE.TorusGeometry(3.5, 0.1, 16, 100);
    const heaterMesh = new THREE.Mesh(heaterGeo, neonRed);
    heaterMesh.position.set(0, 3.5, 0);
    heaterMesh.rotation.x = Math.PI / 2;
    group.add(heaterMesh);

    parts.push({
        name: "Infrared Heating Loop",
        description: "Precision heating coil that maintains a constant 37°C environment.",
        material: "Heating Element",
        function: "Provides evenly distributed thermal energy for optimal cell growth.",
        assemblyOrder: 6,
        connections: ["Incubator Base Chassis"],
        failureEffect: "Temperature drops; cell growth slows or halts.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: heaterMesh
    });

    // Erlenmeyer Flasks
    const flasksGroup = new THREE.Group();
    flasksGroup.position.set(0, 1.4, 0);
    
    const positions = [
        [-2, 0, -1.5], [2, 0, -1.5],
        [-2, 0, 1.5], [2, 0, 1.5],
        [0, 0, 0]
    ];
    
    positions.forEach(pos => {
        // Flask body
        const flaskGeo = new THREE.CylinderGeometry(0.2, 1, 1.5, 16);
        const flaskMesh = new THREE.Mesh(flaskGeo, tinted);
        flaskMesh.position.set(pos[0], pos[1], pos[2]);
        
        // Flask neck
        const neckGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
        const neckMesh = new THREE.Mesh(neckGeo, tinted);
        neckMesh.position.set(0, 1.25, 0);
        flaskMesh.add(neckMesh);
        
        // Liquid inside
        const liquidGeo = new THREE.CylinderGeometry(0.18, 0.9, 0.8, 16);
        const liquidMesh = new THREE.Mesh(liquidGeo, neonGreen);
        liquidMesh.position.set(0, -0.3, 0);
        flaskMesh.add(liquidMesh);

        flasksGroup.add(flaskMesh);
    });

    group.add(flasksGroup);

    parts.push({
        name: "Cell Culture Flasks",
        description: "Glass Erlenmeyer flasks containing growth media and biological cells.",
        material: "Glass/Liquid",
        function: "Sterile vessels for growing mammalian or bacterial cells in suspension.",
        assemblyOrder: 7,
        connections: ["Orbital Platform"],
        failureEffect: "Contamination or cell death.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.4, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 5 },
        mesh: flasksGroup
    });
    
    // Glass Door
    const doorGeo = new THREE.BoxGeometry(10, 7.5, 0.2);
    const doorMesh = new THREE.Mesh(doorGeo, tinted);
    doorMesh.position.set(0, 0.25, 4);
    group.add(doorMesh);

    parts.push({
        name: "Heated Glass Door",
        description: "Double-paned tinted glass door with embedded heating wires to prevent condensation.",
        material: "Tinted Glass",
        function: "Maintains internal atmosphere (temperature/CO2) while allowing visual inspection.",
        assemblyOrder: 8,
        connections: ["Incubator Base Chassis"],
        failureEffect: "Loss of CO2 and temperature, condensation blocking view.",
        cascadeFailures: ["Heating Element"],
        originalPosition: { x: 0, y: 0.25, z: 4 },
        explodedPosition: { x: 0, y: 0.25, z: 10 },
        mesh: doorMesh
    });

    const description = "The Biotech Incubator Shaker provides a controlled environment (temperature, humidity, CO2) while simultaneously agitating the cell cultures. This orbital shaking increases the surface area of the liquid, dramatically enhancing oxygen transfer which is essential for dense bacterial or mammalian cell cultures.";

    const quizQuestions = [
        {
            question: "Why is orbital shaking important in cell culture?",
            options: [
                "It prevents cells from sticking to the glass.",
                "It maximizes oxygen transfer by increasing the surface area of the liquid.",
                "It keeps the liquid warm.",
                "It sterilizes the culture medium."
            ],
            correct: 1,
            explanation: "Orbital shaking agitates the liquid, spreading it across the walls of the flask. This greatly increases the surface area exposed to the air/CO2, allowing for much higher oxygen transfer rates needed by growing cells.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Eccentric Drive Shaft?",
            options: [
                "To heat the incubator.",
                "To control the CO2 levels.",
                "To convert standard rotational motion from the motor into an orbital (circular) shaking path.",
                "To measure the RPM of the platform."
            ],
            correct: 2,
            explanation: "An eccentric drive shaft has an offset axis of rotation. When the motor turns it, it pushes the platform in a smooth, circular, orbital motion rather than just spinning it in place.",
            difficulty: "Hard"
        },
        {
            question: "Why is the glass door typically heated in an incubator shaker?",
            options: [
                "To provide the main heat source for the cells.",
                "To prevent condensation from forming, allowing clear visibility without opening the door.",
                "To sterilize the glass.",
                "To keep the handle warm for the operator."
            ],
            correct: 1,
            explanation: "Because incubators maintain a warm, highly humid environment, a cooler glass door would cause immediate condensation, blocking the view. A heated door prevents this.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes) return;
        
        // Orbital motion radius
        const orbitRadius = 0.5;
        // Rotation speed
        const currentSpeed = speed || 1;
        const angularPos = time * currentSpeed * 2;
        
        // Find meshes by name and animate them
        meshes.forEach(part => {
            if (part.name === "Orbital Platform" || part.name === "Cell Culture Flasks") {
                // Orbital translation (not rotation)
                part.mesh.position.x = part.originalPosition.x + Math.cos(angularPos) * orbitRadius;
                part.mesh.position.z = part.originalPosition.z + Math.sin(angularPos) * orbitRadius;
            }
            if (part.name === "Eccentric Drive Shaft") {
                // The shaft rotates
                part.mesh.rotation.y = -angularPos;
            }
            if (part.name === "Brushless DC Motor") {
                // Visual indication of motor running
                part.mesh.rotation.y = time * currentSpeed * 5;
            }
            if (part.name === "Infrared Heating Loop") {
                // Pulse the emissive intensity of the heater based on time
                const intensity = 0.6 + Math.sin(time * 2) * 0.2;
                part.mesh.material.emissiveIntensity = intensity;
            }
            if (part.name === "Cell Culture Flasks") {
                // Swirling liquid effect (target the liquid meshes)
                part.mesh.children.forEach((flaskMesh) => {
                    if (flaskMesh.children.length > 0) {
                        const liquidMesh = flaskMesh.children[1];
                        if (liquidMesh) {
                            liquidMesh.rotation.y = -angularPos * 2;
                            liquidMesh.rotation.x = Math.sin(angularPos) * 0.1;
                            liquidMesh.rotation.z = Math.cos(angularPos) * 0.1;
                        }
                    }
                });
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createIncubatorShaker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
