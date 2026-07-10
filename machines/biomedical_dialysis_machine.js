import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        transmission: 0.5,
        roughness: 0.2
    });

    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        transmission: 0.5,
        roughness: 0.2
    });

    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1
    });

    const dialyzerGlow = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xaa22ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3
    });

    const displayGlow = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.4
    });

    // 1. Chassis
    const chassisGeo = new THREE.BoxGeometry(3, 8, 2.5);
    const chassisMesh = new THREE.Mesh(chassisGeo, plastic);
    chassisMesh.position.set(0, 4, 0);
    group.add(chassisMesh);
    parts.push({
        name: "Main Chassis",
        description: "Housing for the internal electronics, fluid balancing systems, and monitoring units.",
        material: "plastic",
        function: "Supports external components and houses internal circuitry and fluid management systems.",
        assemblyOrder: 1,
        connections: ["Control Panel", "Blood Pump", "Dialysate Jugs"],
        failureEffect: "Machine physical instability or internal component exposure.",
        cascadeFailures: ["Component detachment", "Fluid leakage"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -5 },
        mesh: chassisMesh
    });

    // 2. Control Panel
    const panelGeo = new THREE.BoxGeometry(2.5, 1.5, 0.5);
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    panelMesh.position.set(0, 7.5, 1.3);
    panelMesh.rotation.x = -Math.PI / 8;
    group.add(panelMesh);
    
    const screenGeo = new THREE.PlaneGeometry(2.2, 1.2);
    const screenMesh = new THREE.Mesh(screenGeo, displayGlow);
    screenMesh.position.set(0, 0, 0.26);
    panelMesh.add(screenMesh);
    
    parts.push({
        name: "Control Panel & UI",
        description: "Touchscreen interface for setting treatment parameters and monitoring alarms.",
        material: "darkSteel, displayGlow",
        function: "Allows operator to set ultrafiltration rate, dialysate flow, and responds to alarms.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Sensor Network"],
        failureEffect: "Inability to monitor or adjust treatment.",
        cascadeFailures: ["Unnoticed alarms", "Treatment parameter drift"],
        originalPosition: { x: 0, y: 7.5, z: 1.3 },
        explodedPosition: { x: 0, y: 9, z: 3 },
        mesh: panelMesh
    });

    // 3. Blood Pump (Peristaltic)
    const pumpGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);
    const pumpMesh = new THREE.Mesh(pumpGeo, aluminum);
    pumpMesh.rotation.x = Math.PI / 2;
    pumpMesh.position.set(-1, 5, 1.4);
    group.add(pumpMesh);

    // Pump Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.7, 16);
    const roller1 = new THREE.Mesh(rollerGeo, steel);
    roller1.position.set(0, 0.5, 0);
    const roller2 = new THREE.Mesh(rollerGeo, steel);
    roller2.position.set(0, -0.5, 0);
    pumpMesh.add(roller1, roller2);

    parts.push({
        name: "Peristaltic Blood Pump",
        description: "Rotary pump that milks the blood tubing to circulate blood through the extracorporeal circuit.",
        material: "aluminum, steel",
        function: "Drives patient blood through the dialyzer and back safely.",
        assemblyOrder: 3,
        connections: ["Arterial Line", "Dialyzer"],
        failureEffect: "Blood circulation stops, leading to clotting in the circuit.",
        cascadeFailures: ["Dialyzer clotting", "Patient blood loss if circuit discarded"],
        originalPosition: { x: -1, y: 5, z: 1.4 },
        explodedPosition: { x: -3, y: 5, z: 3 },
        mesh: pumpMesh
    });

    // 4. Dialyzer (Artificial Kidney)
    const dialyzerGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    const dialyzerMesh = new THREE.Mesh(dialyzerGeo, glass);
    dialyzerMesh.position.set(1.5, 5.5, 1.5);
    group.add(dialyzerMesh);

    const dialyzerCoreGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.9, 32);
    const dialyzerCore = new THREE.Mesh(dialyzerCoreGeo, dialyzerGlow);
    dialyzerMesh.add(dialyzerCore);

    parts.push({
        name: "Dialyzer (Filter)",
        description: "Cylindrical filter containing thousands of hollow semi-permeable fibers.",
        material: "glass, dialyzerGlow",
        function: "Removes toxins and excess fluid from blood via diffusion and ultrafiltration.",
        assemblyOrder: 4,
        connections: ["Blood Pump", "Venous Line", "Dialysate Circuit"],
        failureEffect: "Ineffective clearance of toxins or blood leak into dialysate.",
        cascadeFailures: ["Uremia", "Blood loss", "Contamination"],
        originalPosition: { x: 1.5, y: 5.5, z: 1.5 },
        explodedPosition: { x: 4, y: 6, z: 3 },
        mesh: dialyzerMesh
    });

    // 5. Arterial Line (Red)
    const artLineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.5, 3, 2),
            new THREE.Vector3(-1.5, 4, 2),
            new THREE.Vector3(-1, 4.5, 1.8),
            new THREE.Vector3(-1, 5, 1.4) // connects to pump
        ]),
        20, 0.1, 8, false
    );
    const artLineMesh = new THREE.Mesh(artLineGeo, neonRed);
    group.add(artLineMesh);

    parts.push({
        name: "Arterial Blood Line",
        description: "Tubing carrying untreated blood from the patient to the pump.",
        material: "neonRed",
        function: "Transports blood from patient access to the machine.",
        assemblyOrder: 5,
        connections: ["Patient Access", "Blood Pump"],
        failureEffect: "Air embolism or blood leakage.",
        cascadeFailures: ["Pump airlock", "Patient exsanguination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 3, z: 4 },
        mesh: artLineMesh
    });

    // 6. Venous Line (Blue)
    const venLineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.5, 4.5, 1.5), // from dialyzer bottom
            new THREE.Vector3(1.5, 3, 2),
            new THREE.Vector3(0.5, 2, 2.5) // to patient
        ]),
        20, 0.1, 8, false
    );
    const venLineMesh = new THREE.Mesh(venLineGeo, neonBlue);
    group.add(venLineMesh);

    parts.push({
        name: "Venous Blood Line & Bubble Trap",
        description: "Tubing returning clean blood to the patient, includes an air detector.",
        material: "neonBlue",
        function: "Returns filtered blood to the patient and traps any air bubbles.",
        assemblyOrder: 6,
        connections: ["Dialyzer", "Patient Access"],
        failureEffect: "Air infused into patient or excessive venous pressure.",
        cascadeFailures: ["Air embolism", "Line rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 2, z: 4 },
        mesh: venLineMesh
    });

    // 7. Dialysate Jugs
    const jugGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16);
    const jug1 = new THREE.Mesh(jugGeo, plastic);
    jug1.position.set(-0.8, 0.75, 1.5);
    group.add(jug1);
    
    const jugLiquidGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.3, 16);
    const jugLiquid1 = new THREE.Mesh(jugLiquidGeo, neonCyan);
    jug1.add(jugLiquid1);

    const jug2 = new THREE.Mesh(jugGeo, plastic);
    jug2.position.set(0.8, 0.75, 1.5);
    group.add(jug2);

    parts.push({
        name: "Dialysate Concentrates",
        description: "Acid and Bicarbonate jugs used to mix the final dialysate fluid.",
        material: "plastic, neonCyan",
        function: "Provides essential electrolytes and buffers for the dialysis fluid.",
        assemblyOrder: 7,
        connections: ["Proportioning System"],
        failureEffect: "Incorrect electrolyte balance in patient.",
        cascadeFailures: ["Cardiac arrhythmias", "Severe hypotension"],
        originalPosition: { x: -0.8, y: 0.75, z: 1.5 },
        explodedPosition: { x: -2, y: 0.75, z: 4 },
        mesh: jug1 // simplifying visual mapping
    });

    const description = "A high-tech hemodialysis machine that acts as an artificial kidney. It draws blood from the patient, pumps it through a dialyzer to remove waste and excess fluid, and mixes pure water with concentrates to form dialysate. The machine is heavily equipped with safety sensors for pressure, air, and blood leaks.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Dialyzer in a Hemodialysis Machine?",
            options: [
                "To pump blood out of the patient's body",
                "To mix acid and bicarbonate",
                "To filter toxins and remove excess fluid from the blood",
                "To detect air bubbles in the venous line"
            ],
            correct: 2,
            explanation: "The dialyzer is often called the 'artificial kidney'. It uses thousands of hollow fibers to filter waste and fluid from the blood.",
            difficulty: "easy"
        },
        {
            question: "Why is a peristaltic pump used for the blood circuit?",
            options: [
                "It is the cheapest pump available",
                "It milks the tubing without the pump components touching the blood",
                "It spins at 10,000 RPM",
                "It adds oxygen to the blood"
            ],
            correct: 1,
            explanation: "Peristaltic pumps compress the external tubing, meaning the internal blood remains sterile and undamaged by moving mechanical parts.",
            difficulty: "medium"
        },
        {
            question: "What happens if the dialysate concentrate ratio is incorrect?",
            options: [
                "The patient's blood is safely filtered faster",
                "The dialyzer clogs immediately",
                "Electrolyte imbalance occurs, potentially causing cardiac arrhythmias",
                "The peristaltic pump spins backwards"
            ],
            correct: 2,
            explanation: "Incorrect dialysate conductivity/composition directly affects the patient's blood electrolytes, which can be fatal. The machine constantly monitors this via conductivity cells.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate blood pump rollers
        const pump = parts.find(p => p.name === "Peristaltic Blood Pump").mesh;
        if (pump) {
            pump.rotation.y = time * 2 * speed;
        }

        // Pulse dialyzer glow to simulate diffusion
        const dialyzer = parts.find(p => p.name === "Dialyzer (Filter)").mesh;
        if (dialyzer && dialyzer.children[0]) {
            dialyzer.children[0].material.emissiveIntensity = 0.6 + Math.sin(time * 3 * speed) * 0.3;
        }

        // Simulate screen UI updating
        const panel = parts.find(p => p.name === "Control Panel & UI").mesh;
        if (panel && panel.children[0]) {
            panel.children[0].material.emissiveIntensity = 0.4 + Math.random() * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDialysisMachine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
