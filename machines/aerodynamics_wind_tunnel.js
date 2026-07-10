import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });
    
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.8
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x001133,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5
    });

    // 1. Base Structure
    const baseGeometry = new THREE.BoxGeometry(10, 0.5, 3);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.position.set(0, -1, 0);
    group.add(baseMesh);
    parts.push({
        name: "Main Platform",
        description: "Heavy steel base providing stability to the wind tunnel.",
        material: "darkSteel",
        function: "Supports the entire aerodynamic testing apparatus.",
        assemblyOrder: 1,
        connections: ["Intake", "Test Section", "Diffuser"],
        failureEffect: "Misalignment of tunnel sections causing turbulent airflow.",
        cascadeFailures: ["Inaccurate readings", "Vibration damage"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Contraction Cone (Intake)
    const intakeGeometry = new THREE.CylinderGeometry(1.5, 3, 2, 32);
    intakeGeometry.rotateZ(Math.PI / 2);
    const intakeMesh = new THREE.Mesh(intakeGeometry, aluminum);
    intakeMesh.position.set(-3.5, 1, 0);
    group.add(intakeMesh);
    parts.push({
        name: "Contraction Cone",
        description: "Aerodynamically shaped intake to smoothly accelerate air.",
        material: "aluminum",
        function: "Accelerates air and reduces turbulence before entering the test section.",
        assemblyOrder: 2,
        connections: ["Test Section", "Main Platform"],
        failureEffect: "Turbulent flow entering test section.",
        cascadeFailures: ["Invalid test data"],
        originalPosition: {x: -3.5, y: 1, z: 0},
        explodedPosition: {x: -6, y: 1, z: 0}
    });

    // Flow Straightener inside intake
    const straightenerGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.2, 32);
    straightenerGeometry.rotateZ(Math.PI / 2);
    const straightenerMesh = new THREE.Mesh(straightenerGeometry, chrome);
    straightenerMesh.position.set(-4.4, 1, 0);
    group.add(straightenerMesh);
    parts.push({
        name: "Flow Straightener Grid",
        description: "Honeycomb grid structure.",
        material: "chrome",
        function: "Removes swirling motion from the incoming air.",
        assemblyOrder: 3,
        connections: ["Contraction Cone"],
        failureEffect: "Swirling, inconsistent airflow.",
        cascadeFailures: ["Lift/Drag calculation errors"],
        originalPosition: {x: -4.4, y: 1, z: 0},
        explodedPosition: {x: -8, y: 1, z: 0}
    });

    // 3. Test Section (Glass)
    const testSectionGeometry = new THREE.BoxGeometry(3, 2, 2);
    const testSectionMesh = new THREE.Mesh(testSectionGeometry, tinted);
    testSectionMesh.position.set(-1, 1, 0);
    group.add(testSectionMesh);
    parts.push({
        name: "Test Section",
        description: "Transparent observation chamber where test models are mounted.",
        material: "tinted glass",
        function: "Houses the model and allows visual/optical flow measurements.",
        assemblyOrder: 4,
        connections: ["Contraction Cone", "Diffuser", "Mounting Sting"],
        failureEffect: "Air leaks modifying test pressure.",
        cascadeFailures: ["Sensor calibration failure"],
        originalPosition: {x: -1, y: 1, z: 0},
        explodedPosition: {x: -1, y: 4, z: 0}
    });

    // Test Model (Aerodynamic wing profile)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.2, 0.3, 0.8, 0);
    wingShape.quadraticCurveTo(0.2, -0.1, 0, 0);
    const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    wingGeometry.center();
    const wingMesh = new THREE.Mesh(wingGeometry, neonOrange);
    wingMesh.position.set(-1, 1, 0);
    // slightly angled
    wingMesh.rotation.z = 0.2;
    group.add(wingMesh);
    parts.push({
        name: "Test Model (Airfoil)",
        description: "NACA profile airfoil mounted for aerodynamic testing, highlighted with glowing coating.",
        material: "neonOrange",
        function: "Object under test for lift and drag characteristics.",
        assemblyOrder: 5,
        connections: ["Mounting Sting"],
        failureEffect: "Model detaches at high wind speeds.",
        cascadeFailures: ["Damage to test section and fan blades"],
        originalPosition: {x: -1, y: 1, z: 0},
        explodedPosition: {x: -1, y: 1, z: 3}
    });
    
    // Support sting
    const stingGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const stingMesh = new THREE.Mesh(stingGeometry, steel);
    stingMesh.position.set(-1, 0.3, 0);
    group.add(stingMesh);

    // 4. Diffuser
    const diffuserGeometry = new THREE.CylinderGeometry(2, 1.5, 4, 32);
    diffuserGeometry.rotateZ(Math.PI / 2);
    const diffuserMesh = new THREE.Mesh(diffuserGeometry, steel);
    diffuserMesh.position.set(2.5, 1, 0);
    group.add(diffuserMesh);
    parts.push({
        name: "Diffuser Section",
        description: "Gradually expanding cone.",
        material: "steel",
        function: "Decelerates airflow to minimize power loss and noise.",
        assemblyOrder: 6,
        connections: ["Test Section", "Fan Housing"],
        failureEffect: "Flow separation and excessive energy loss.",
        cascadeFailures: ["Motor overheating due to high load"],
        originalPosition: {x: 2.5, y: 1, z: 0},
        explodedPosition: {x: 2.5, y: -2, z: -3}
    });

    // 5. Fan Housing and Motor
    const fanHousingGeom = new THREE.CylinderGeometry(2.1, 2.1, 1.5, 32);
    fanHousingGeom.rotateZ(Math.PI / 2);
    const fanHousingMesh = new THREE.Mesh(fanHousingGeom, darkSteel);
    fanHousingMesh.position.set(5.25, 1, 0);
    group.add(fanHousingMesh);
    parts.push({
        name: "Fan Housing",
        description: "Protective casing for the axial fan.",
        material: "darkSteel",
        function: "Contains the fan and directs thrust efficiently.",
        assemblyOrder: 7,
        connections: ["Diffuser", "Motor"],
        failureEffect: "Structural failure causing fan blade ejection.",
        cascadeFailures: ["Catastrophic system destruction"],
        originalPosition: {x: 5.25, y: 1, z: 0},
        explodedPosition: {x: 8, y: 1, z: 0}
    });

    const motorGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const motorMesh = new THREE.Mesh(motorGeom, copper);
    motorMesh.position.set(5.25, -0.25, 0);
    group.add(motorMesh);
    parts.push({
        name: "Drive Motor",
        description: "High-torque industrial electric motor.",
        material: "copper",
        function: "Spins the fan blades to generate airflow.",
        assemblyOrder: 8,
        connections: ["Fan Hub", "Main Platform", "Power Supply"],
        failureEffect: "Overheating or winding short.",
        cascadeFailures: ["Loss of airflow", "Electrical fire"],
        originalPosition: {x: 5.25, y: -0.25, z: 0},
        explodedPosition: {x: 8, y: -3, z: 0}
    });

    // Fan Blades
    const fanGroup = new THREE.Group();
    fanGroup.position.set(5.25, 1, 0);

    const hubGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    hubGeom.rotateX(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeom, chrome);
    fanGroup.add(hubMesh);

    const numBlades = 6;
    for (let i = 0; i < numBlades; i++) {
        const bladeGeom = new THREE.BoxGeometry(0.1, 1.5, 0.3);
        const bladeMesh = new THREE.Mesh(bladeGeom, aluminum);
        bladeMesh.position.y = 0.9;
        bladeMesh.rotation.y = 0.4; // Pitch the blade
        
        const pivot = new THREE.Group();
        pivot.rotation.z = (i / numBlades) * Math.PI * 2;
        pivot.add(bladeMesh);
        fanGroup.add(pivot);
    }
    // orient fan group to face Z correctly based on tunnel direction
    fanGroup.rotation.y = Math.PI / 2;
    group.add(fanGroup);
    
    parts.push({
        name: "Axial Fan Assembly",
        description: "Multi-blade fan hub.",
        material: "aluminum",
        function: "Pulls air through the tunnel to create wind speeds.",
        assemblyOrder: 9,
        connections: ["Motor Shaft", "Fan Housing"],
        failureEffect: "Blade fracture.",
        cascadeFailures: ["Housing penetration", "Motor imbalance damage"],
        originalPosition: {x: 5.25, y: 1, z: 0},
        explodedPosition: {x: 8, y: 4, z: 0}
    });

    // Control Panel
    const panelGeom = new THREE.BoxGeometry(0.5, 1.5, 1);
    const panelMesh = new THREE.Mesh(panelGeom, plastic);
    panelMesh.position.set(-1, -0.25, 1.5);
    group.add(panelMesh);
    
    const screenGeom = new THREE.PlaneGeometry(0.8, 0.4);
    const screenDisplay = new THREE.Mesh(screenGeom, screenMaterial);
    screenDisplay.position.set(-1, 0.2, 2.01);
    group.add(screenDisplay);

    parts.push({
        name: "Control & Telemetry Panel",
        description: "Digital readout for wind speed, pressure, and drag forces.",
        material: "plastic",
        function: "Operator interface to control motor speed and read sensors.",
        assemblyOrder: 10,
        connections: ["Main Platform", "Sensors", "Drive Motor"],
        failureEffect: "Loss of telemetry.",
        cascadeFailures: ["Inability to stop motor in emergency"],
        originalPosition: {x: -1, y: -0.25, z: 1.5},
        explodedPosition: {x: -1, y: -0.25, z: 4}
    });

    // Airflow Visualizer Particles
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for(let i=0; i<particleCount; i++) {
        particlePositions[i*3] = -4 + Math.random() * 8; // x
        particlePositions[i*3+1] = 0.5 + Math.random() * 1.0; // y
        particlePositions[i*3+2] = -0.5 + Math.random() * 1.0; // z
        particleVelocities.push(0.05 + Math.random() * 0.05); // speed
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const flowParticles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(flowParticles);

    const meshes = {
        fanGroup,
        flowParticles,
        particleVelocities,
        screenDisplay
    };

    const description = "The Aerodynamics Wind Tunnel is an advanced engineering simulator used to analyze the aerodynamic properties of solid objects. It features a contraction cone to accelerate airflow, a transparent test section for mounting models, a diffuser to recover pressure, and a high-power axial fan. The built-in telemetry system provides real-time data on lift, drag, and fluid dynamics.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the flow straightener (honeycomb grid) in a wind tunnel?",
            options: [
                "To increase the air speed dramatically",
                "To filter out dust particles from the air",
                "To remove swirling motions and create a uniform, laminar airflow",
                "To cool down the motor"
            ],
            correct: 2,
            explanation: "Flow straighteners use honeycomb or mesh structures to break up large turbulent eddies and remove rotational velocity (swirl) from the air before it enters the test section.",
            difficulty: "Medium"
        },
        {
            question: "Why does the contraction cone (intake) narrow down before the test section?",
            options: [
                "To conserve space in the laboratory",
                "To accelerate the airflow and reduce the relative turbulence intensity",
                "To increase the static pressure in the test section",
                "To make the wind tunnel look aerodynamic"
            ],
            correct: 1,
            explanation: "According to the continuity equation (A1V1 = A2V2), reducing the cross-sectional area increases the flow velocity. This acceleration also helps uniformize the velocity profile and reduce turbulence.",
            difficulty: "Hard"
        },
        {
            question: "What is the function of the diffuser section located after the test section?",
            options: [
                "To measure the drag of the test model",
                "To gradually slow down the air, recovering pressure and improving fan efficiency",
                "To produce the wind using fan blades",
                "To inject smoke for flow visualization"
            ],
            correct: 1,
            explanation: "The diffuser gradually increases in cross-sectional area to slow down the high-speed air exiting the test section. This minimizes kinetic energy loss and allows the fan to operate more efficiently.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj) meshesObj = meshes;
        if (!meshesObj || !meshesObj.fanGroup) return;

        // Spin the fan
        meshesObj.fanGroup.rotation.x -= 0.2 * speed;

        // Animate particles
        if (meshesObj.flowParticles && meshesObj.particleVelocities) {
            const positions = meshesObj.flowParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i*3] += meshesObj.particleVelocities[i] * speed * 2;
                
                // If particle passes the fan, reset to intake
                if (positions[i*3] > 6) {
                    positions[i*3] = -4.5;
                    positions[i*3+1] = 0.5 + Math.random() * 1.0; 
                    positions[i*3+2] = -0.5 + Math.random() * 1.0;
                }
                
                // Squeeze particles in the test section (simple simulation of contraction)
                if (positions[i*3] > -2 && positions[i*3] < 2) {
                    positions[i*3+1] += (1 - positions[i*3+1]) * 0.05 * speed;
                    positions[i*3+2] += (0 - positions[i*3+2]) * 0.05 * speed;
                }
            }
            meshesObj.flowParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Pulse the control screen
        if (meshesObj.screenDisplay) {
            const intensity = 0.5 + 0.3 * Math.sin(time * 5);
            meshesObj.screenDisplay.material.emissiveIntensity = intensity;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createWindTunnel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
