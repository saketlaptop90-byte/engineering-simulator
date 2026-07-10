import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        metalness: 0.2,
        roughness: 0.1,
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 2.0,
        metalness: 0.2,
        roughness: 0.1,
    });
    
    const glowingMagneticMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.2,
    });

    const bloodMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8a0303,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
    });

    const meshes = {};

    // 1. Inflow Cannula (connects to Left Ventricle)
    const inflowGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const inflowMesh = new THREE.Mesh(inflowGeometry, chrome);
    inflowMesh.position.set(0, 4, 0);
    group.add(inflowMesh);
    meshes.inflow = inflowMesh;
    parts.push({
        name: 'Inflow Cannula',
        description: 'Titanium tube that draws blood directly from the left ventricle of the heart.',
        material: 'chrome',
        function: 'Extracts oxygenated blood from the failing heart and channels it into the pump.',
        assemblyOrder: 1,
        connections: ['Left Ventricle', 'Pump Housing'],
        failureEffect: 'Reduced blood flow, potential clot formation or suction events.',
        cascadeFailures: ['Pump cavitation', 'Hemolysis'],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });
    
    // 2. Pump Housing (Main body)
    const housingGeometry = new THREE.SphereGeometry(2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const housingMesh = new THREE.Mesh(housingGeometry, darkSteel);
    housingMesh.position.set(0, 2, 0);
    housingMesh.rotation.x = Math.PI;
    group.add(housingMesh);
    meshes.housing = housingMesh;
    parts.push({
        name: 'Pump Housing',
        description: 'Durable, bio-compatible casing holding the internal rotor and stator.',
        material: 'darkSteel',
        function: 'Houses the vital blood-pumping mechanism and protects it from body fluids.',
        assemblyOrder: 2,
        connections: ['Inflow Cannula', 'Outflow Graft', 'Driveline'],
        failureEffect: 'Pump failure due to fluid ingress or mechanical obstruction.',
        cascadeFailures: ['Complete cessation of circulatory support'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -5 }
    });
    
    // 3. Magnetic Bearings / Stator (Glowing)
    const bearingGeometry = new THREE.TorusGeometry(1.2, 0.3, 32, 64);
    const bearingMesh = new THREE.Mesh(bearingGeometry, glowingMagneticMaterial);
    bearingMesh.position.set(0, 1.5, 0);
    bearingMesh.rotation.x = Math.PI / 2;
    group.add(bearingMesh);
    meshes.bearings = bearingMesh;
    parts.push({
        name: 'Magnetic Bearings',
        description: 'Advanced electromagnetic levitation system that suspends the rotor.',
        material: 'glowingMagneticMaterial',
        function: 'Levitates the rotor to eliminate mechanical friction and minimize blood cell damage (hemolysis).',
        assemblyOrder: 3,
        connections: ['Pump Housing', 'Rotor'],
        failureEffect: 'Rotor touches housing, causing friction, heat, and destruction of red blood cells.',
        cascadeFailures: ['Thrombosis', 'Rotor seizure'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: -4, y: 1.5, z: 0 }
    });

    // 4. Centrifugal Impeller (Rotor)
    const rotorGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 6); // Hexagonal base for high-tech look
    const rotorMesh = new THREE.Mesh(rotorGeometry, chrome);
    rotorMesh.position.set(0, 1.5, 0);
    
    // Add blades to rotor
    for (let i = 0; i < 4; i++) {
        const bladeGeom = new THREE.BoxGeometry(0.2, 0.5, 2.5);
        const blade = new THREE.Mesh(bladeGeom, aluminum);
        blade.position.y = 0.25;
        blade.rotation.y = (Math.PI / 2) * i + Math.PI / 4;
        rotorMesh.add(blade);
    }
    
    group.add(rotorMesh);
    meshes.rotor = rotorMesh;
    parts.push({
        name: 'Centrifugal Impeller',
        description: 'The sole moving part, magnetically levitated and spinning at high speeds.',
        material: 'chrome/aluminum',
        function: 'Generates centrifugal force to push blood continuously through the device.',
        assemblyOrder: 4,
        connections: ['Magnetic Bearings'],
        failureEffect: 'Loss of pumping ability, leading to immediate heart failure.',
        cascadeFailures: ['Device shutdown'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 5 }
    });

    // 5. Outflow Graft
    const outflowCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(4, 3, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(4, 7, 0)
    ]);
    const outflowGeometry = new THREE.TubeGeometry(outflowCurve, 64, 0.6, 16, false);
    const outflowMesh = new THREE.Mesh(outflowGeometry, rubber);
    group.add(outflowMesh);
    meshes.outflow = outflowMesh;
    parts.push({
        name: 'Outflow Graft',
        description: 'Dacron artificial blood vessel routing blood back into the body.',
        material: 'rubber',
        function: 'Carries high-pressure, oxygenated blood from the pump to the ascending aorta.',
        assemblyOrder: 5,
        connections: ['Pump Housing', 'Aorta'],
        failureEffect: 'Kinking or twisting blocks blood flow, or graft tearing causes severe internal bleeding.',
        cascadeFailures: ['Hypoperfusion', 'Pump over-speed'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 6. Percutaneous Driveline (Power/Data cable)
    const drivelineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(1, -4, 1),
        new THREE.Vector3(3, -6, 2)
    ]);
    const drivelineGeometry = new THREE.TubeGeometry(drivelineCurve, 64, 0.15, 8, false);
    const drivelineMesh = new THREE.Mesh(drivelineGeometry, plastic);
    group.add(drivelineMesh);
    meshes.driveline = drivelineMesh;
    parts.push({
        name: 'Percutaneous Driveline',
        description: 'Cable passing through the skin to connect the internal pump to external controllers.',
        material: 'plastic',
        function: 'Transmits electrical power and operating data between the VAD and the external controller.',
        assemblyOrder: 6,
        connections: ['Pump Housing', 'External Controller'],
        failureEffect: 'Loss of power or control signals, immediate pump stop.',
        cascadeFailures: ['Infection at exit site', 'Cable fracture'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 7. Electronic Controller (External)
    const controllerGeometry = new THREE.BoxGeometry(2, 3, 0.8);
    const controllerMesh = new THREE.Mesh(controllerGeometry, plastic);
    controllerMesh.position.set(3.5, -7, 2);
    
    // Controller Screen (Glowing Blue)
    const screenGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    const screenMesh = new THREE.Mesh(screenGeometry, neonBlue);
    screenMesh.position.set(0, 0.5, 0.41);
    controllerMesh.add(screenMesh);
    
    // Status Indicator (Glowing Red/Green/Blue)
    const indicatorGeometry = new THREE.CircleGeometry(0.2, 32);
    const indicatorMesh = new THREE.Mesh(indicatorGeometry, neonRed);
    indicatorMesh.position.set(0, -0.8, 0.41);
    controllerMesh.add(indicatorMesh);
    
    group.add(controllerMesh);
    meshes.controller = controllerMesh;
    meshes.controllerScreen = screenMesh;
    meshes.controllerIndicator = indicatorMesh;
    
    parts.push({
        name: 'External System Controller',
        description: 'Microprocessor unit worn by the patient, monitoring pump status and batteries.',
        material: 'plastic / neonBlue',
        function: 'Regulates pump speed, logs operational data, and alerts the patient to any faults.',
        assemblyOrder: 7,
        connections: ['Driveline', 'Batteries'],
        failureEffect: 'Loss of pump regulation, potential hardware malfunction.',
        cascadeFailures: ['Total system failure if backup controller is not swapped.'],
        originalPosition: { x: 3.5, y: -7, z: 2 },
        explodedPosition: { x: 8, y: -7, z: 2 }
    });

    const description = "A Continuous-Flow Ventricular Assist Device (VAD) is a highly advanced electromechanical pump used to support failing hearts. Unlike natural hearts, it uses a rapidly spinning magnetically levitated impeller to push blood continuously, meaning patients often have no detectable pulse.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Magnetic Bearings in this VAD design?",
            options: [
                "To generate the electrical power required for the pump",
                "To levitate the rotor, eliminating physical friction and reducing blood cell damage",
                "To filter clots out of the blood before it enters the aorta",
                "To transmit data wirelessly to the external controller"
            ],
            correct: 1,
            explanation: "Magnetic levitation suspends the spinning impeller in mid-air. Without physical bearings, there is no mechanical wear, and shear stress on delicate red blood cells (which causes hemolysis) is vastly reduced.",
            difficulty: "Medium"
        },
        {
            question: "Why do patients with continuous-flow VADs often lack a palpable pulse?",
            options: [
                "The pump bypasses the heart entirely, so the heart stops beating.",
                "The blood flow is perfectly smooth and continuous rather than pulsatile.",
                "The VAD slows down the patient's natural heart rate.",
                "The outflow graft acts as a shock absorber."
            ],
            correct: 1,
            explanation: "Because the VAD uses a centrifugal or axial rotor that spins constantly, it pushes blood continuously. The natural heart may still beat weakly, but the continuous pressure wave overrides the pulsatile pulse, making it unfeelable.",
            difficulty: "Medium"
        },
        {
            question: "What is the most vulnerable point for infection in a VAD system?",
            options: [
                "The Magnetic Bearings inside the pump housing",
                "The Outflow Graft connected to the aorta",
                "The Inflow Cannula in the left ventricle",
                "The percutaneous driveline exit site on the skin"
            ],
            correct: 3,
            explanation: "The driveline must pass through the patient's skin to connect the internal pump to the external power source. This permanent break in the skin barrier is highly susceptible to severe, hard-to-treat infections.",
            difficulty: "Easy"
        },
        {
            question: "If a patient experiences a 'suction event', what has likely occurred?",
            options: [
                "The controller battery died.",
                "The pump speed is too high relative to the volume of blood in the left ventricle.",
                "The outflow graft has kinked.",
                "The magnetic bearings have failed."
            ],
            correct: 1,
            explanation: "A suction event happens when the pump attempts to pull more blood than is available in the ventricle, causing the ventricular walls to collapse around the inflow cannula.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes || !activeMeshes.rotor) return;
        
        // Rotor spins extremely fast (thousands of RPM translated to animation speed)
        activeMeshes.rotor.rotation.y = time * speed * 20;
        
        // Pulsating glow on magnetic bearings
        if (activeMeshes.bearings && activeMeshes.bearings.material.emissiveIntensity !== undefined) {
            activeMeshes.bearings.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 5) * 0.5;
        }

        // Controller indicator blinking like a heartbeat or status ping
        if (activeMeshes.controllerIndicator) {
            const blink = Math.sin(time * speed * 3) > 0 ? 1 : 0;
            activeMeshes.controllerIndicator.material.emissiveIntensity = 2.0 * blink;
            
            // Occasionally change color to simulate processing/status check
            if (Math.random() < 0.01) {
                const colors = [0xff0044, 0x00ff00, 0x0088ff];
                activeMeshes.controllerIndicator.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
                activeMeshes.controllerIndicator.material.emissive.setHex(colors[Math.floor(Math.random() * colors.length)]);
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVentricularAssistDevice() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
