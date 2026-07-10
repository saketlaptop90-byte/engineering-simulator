import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ---------------- Custom High-Tech Materials ----------------
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.8
    });
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.6
    });
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.5
    });
    const gripMat = darkSteel.clone();
    gripMat.roughness = 0.9;
    gripMat.metalness = 0.3;
    
    const strutMat = new THREE.MeshStandardMaterial({
        color: 0x222222, roughness: 0.6, metalness: 0.4
    });
    const nodeMat = neonOrange.clone();

    // ---------------- 1. Base Assembly ----------------
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(36, 4, 16);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 2, 0);
    baseGroup.add(baseMesh);

    // Vibration-damping Base feet
    const footGeo = new THREE.CylinderGeometry(2, 2.5, 1, 16);
    const footPositions = [
        [-16, 0.5, -6], [-16, 0.5, 6], [16, 0.5, -6], [16, 0.5, 6]
    ];
    footPositions.forEach(pos => {
        const foot = new THREE.Mesh(footGeo, rubber);
        foot.position.set(...pos);
        baseGroup.add(foot);
    });

    // Servo-Valve Manifold
    const manifoldGeo = new THREE.BoxGeometry(4, 3, 4);
    const manifold = new THREE.Mesh(manifoldGeo, copper);
    manifold.position.set(0, 3, -6);
    baseGroup.add(manifold);

    group.add(baseGroup);

    parts.push({
        name: "Testing Frame Base",
        description: "Massive vibration-damped foundation for the mechanical testing rig. Contains fluid reservoirs and leveling mounts.",
        material: "Dark Steel & Rubber",
        function: "Anchors the apparatus to prevent dynamic oscillation during metamaterial fracturing.",
        assemblyOrder: 1,
        connections: ["Left Column", "Right Column", "Hydraulic Pumps"],
        failureEffect: "Machine destabilizes, catastrophic test misalignment.",
        cascadeFailures: ["Hydraulic Lines", "Columns"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    parts.push({
        name: "Proportional Servo-Valve Manifold",
        description: "Ultra-fast response fluid control block with spool valves.",
        material: "Brass and Copper Alloy",
        function: "Meters high-pressure hydraulic fluid to precisely control crosshead displacement.",
        assemblyOrder: 2,
        connections: ["Base", "Hoses"],
        failureEffect: "Valve stick, uncontrolled pressure spike causing crosshead crash.",
        cascadeFailures: ["Hydraulic Cylinders"],
        originalPosition: { x: 0, y: 5, z: -6 },
        explodedPosition: { x: 0, y: 5, z: -15 }
    });

    // ---------------- 2. Guide Columns ----------------
    const colHeight = 36;
    const colGeo = new THREE.CylinderGeometry(2, 2, colHeight, 32);
    
    const colL = new THREE.Mesh(colGeo, chrome);
    colL.position.set(-14, colHeight / 2 + 4, 0);
    group.add(colL);

    const colR = new THREE.Mesh(colGeo, chrome);
    colR.position.set(14, colHeight / 2 + 4, 0);
    group.add(colR);

    parts.push({
        name: "Left Guide Column",
        description: "Precision-machined hard-chrome column, 4 inches in diameter.",
        material: "Hard Chrome",
        function: "Maintains absolute vertical alignment of the crosshead under extreme tensile loads.",
        assemblyOrder: 3,
        connections: ["Base", "Fixed Crosshead", "Moving Crosshead"],
        failureEffect: "Buckling under load, crosshead jamming and specimen shearing.",
        cascadeFailures: ["Moving Crosshead", "Extensometer"],
        originalPosition: { x: -14, y: 22, z: 0 },
        explodedPosition: { x: -25, y: 22, z: 0 }
    });
    
    parts.push({
        name: "Right Guide Column",
        description: "Symmetrical counterpart to the left guide column with laser-etched gradations.",
        material: "Hard Chrome",
        function: "Provides parallel guidance for hydraulic actuation, eliminating lateral drift.",
        assemblyOrder: 4,
        connections: ["Base", "Fixed Crosshead", "Moving Crosshead"],
        failureEffect: "Asymmetric loading, twisting the metamaterial specimen.",
        cascadeFailures: ["Moving Crosshead", "Load Cell"],
        originalPosition: { x: 14, y: 22, z: 0 },
        explodedPosition: { x: 25, y: 22, z: 0 }
    });

    // ---------------- 3. Fixed Crosshead (Top) ----------------
    const topCrossGroup = new THREE.Group();
    topCrossGroup.position.set(0, 36, 0);
    const topCrossheadGeo = new THREE.BoxGeometry(34, 4, 8);
    const topCrosshead = new THREE.Mesh(topCrossheadGeo, steel);
    topCrossGroup.add(topCrosshead);

    // Add heavy bolts
    const boltGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    for(let i=0; i<4; i++) {
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(-12 + (i%2)*24, 2, -2 + Math.floor(i/2)*4);
        topCrossGroup.add(bolt);
    }

    // Load Cell
    const loadCellGeo = new THREE.CylinderGeometry(3, 3, 2, 32);
    const loadCell = new THREE.Mesh(loadCellGeo, aluminum);
    loadCell.position.set(0, -3, 0);
    topCrossGroup.add(loadCell);

    // Indicator ring on load cell
    const ringGeo = new THREE.TorusGeometry(3.1, 0.2, 8, 32);
    const ring = new THREE.Mesh(ringGeo, neonBlue);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, -3, 0);
    topCrossGroup.add(ring);
    meshes.loadCellRing = ring;

    group.add(topCrossGroup);
    
    parts.push({
        name: "Fixed Crosshead",
        description: "Upper massive bridge forged from high-carbon steel.",
        material: "Forged Steel",
        function: "Locks the upper boundary of the test area, reacting against hydraulic pull.",
        assemblyOrder: 5,
        connections: ["Columns", "Load Cell"],
        failureEffect: "Catastrophic structural yield.",
        cascadeFailures: ["Columns", "Specimen"],
        originalPosition: { x: 0, y: 36, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });

    parts.push({
        name: "100kN Strain-Gauge Load Cell",
        description: "Piezoelectric and strain-gauge hybrid force transducer.",
        material: "Aerospace Aluminum",
        function: "Measures the exact tension applied to the metamaterial in real time.",
        assemblyOrder: 6,
        connections: ["Fixed Crosshead", "Top Grip"],
        failureEffect: "Loss of force data, invalidating the entire test.",
        cascadeFailures: ["Control Console"],
        originalPosition: { x: 0, y: 33, z: 0 },
        explodedPosition: { x: 0, y: 33, z: -15 }
    });

    // ---------------- 4. Moving Crosshead & Hydraulics ----------------
    const botCrossGroup = new THREE.Group();
    botCrossGroup.position.set(0, 10, 0);
    meshes.botCrossGroup = botCrossGroup;
    
    const botCrossGeo = new THREE.BoxGeometry(34, 4, 8);
    const botCross = new THREE.Mesh(botCrossGeo, steel);
    botCrossGroup.add(botCross);
    
    // Bushings
    const bushingGeo = new THREE.CylinderGeometry(2.5, 2.5, 4.2, 32);
    const bushL = new THREE.Mesh(bushingGeo, copper);
    bushL.position.set(-14, 0, 0);
    botCrossGroup.add(bushL);
    
    const bushR = new THREE.Mesh(bushingGeo, copper);
    bushR.position.set(14, 0, 0);
    botCrossGroup.add(bushR);
    
    // Pistons
    const hydPistonGeo = new THREE.CylinderGeometry(1.5, 1.5, 18, 32);
    const leftPiston = new THREE.Mesh(hydPistonGeo, chrome);
    leftPiston.position.set(-8, -4, 0); 
    botCrossGroup.add(leftPiston);
    
    const rightPiston = new THREE.Mesh(hydPistonGeo, chrome);
    rightPiston.position.set(8, -4, 0);
    botCrossGroup.add(rightPiston);
    
    group.add(botCrossGroup);

    // Cylinders attached to base
    const hydCylGeo = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);
    const leftHydCyl = new THREE.Mesh(hydCylGeo, darkSteel);
    leftHydCyl.position.set(-8, 10, 0);
    group.add(leftHydCyl);
    
    const rightHydCyl = new THREE.Mesh(hydCylGeo, darkSteel);
    rightHydCyl.position.set(8, 10, 0);
    group.add(rightHydCyl);

    parts.push({
        name: "Actuated Crosshead",
        description: "Dynamically driven heavy-duty crosshead featuring low-friction copper-beryllium bushings.",
        material: "Steel & Copper Alloy",
        function: "Transfers hydraulic force to stretch the specimen downwards.",
        assemblyOrder: 7,
        connections: ["Columns", "Bottom Grip", "Hydraulic Pistons"],
        failureEffect: "Bushing seizure, stick-slip vibration ruining data.",
        cascadeFailures: ["Specimen", "Extensometer"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 15 }
    });

    parts.push({
        name: "Twin Hydraulic Actuators",
        description: "High-displacement dual hydraulic cylinders and chrome pistons.",
        material: "Dark Steel & Chrome",
        function: "Provides up to 200kN of downward pulling force with sub-millimeter precision.",
        assemblyOrder: 8,
        connections: ["Base", "Actuated Crosshead", "Hoses"],
        failureEffect: "Fluid leak, loss of pressure, uncontrolled crosshead drop.",
        cascadeFailures: ["Specimen", "Sensors"],
        originalPosition: { x: -8, y: 10, z: 0 },
        explodedPosition: { x: -15, y: 10, z: 10 }
    });

    // ---------------- 5. Pneumatic Grips ----------------
    const gripBaseGeo = new THREE.CylinderGeometry(2, 2, 3, 16);
    const jawGeo = new THREE.BoxGeometry(16, 2, 3);
    
    // Top Grip
    const topGripGroup = new THREE.Group();
    topGripGroup.position.set(0, 31.5, 0);
    const topGripBase = new THREE.Mesh(gripBaseGeo, gripMat);
    topGripBase.position.set(0, 1.5, 0);
    topGripGroup.add(topGripBase);
    
    const topJaw1 = new THREE.Mesh(jawGeo, gripMat);
    topJaw1.position.set(0, -1, 1.5);
    topGripGroup.add(topJaw1);
    
    const topJaw2 = new THREE.Mesh(jawGeo, gripMat);
    topJaw2.position.set(0, -1, -1.5);
    topGripGroup.add(topJaw2);
    
    group.add(topGripGroup);
    
    // Bottom Grip
    const botGripGroup = new THREE.Group();
    botGripGroup.position.set(0, 4.5, 0);
    
    const botGripBase = new THREE.Mesh(gripBaseGeo, gripMat);
    botGripBase.position.set(0, -1.5, 0);
    botGripGroup.add(botGripBase);
    
    const botJaw1 = new THREE.Mesh(jawGeo, gripMat);
    botJaw1.position.set(0, 1, 1.5);
    botGripGroup.add(botJaw1);
    
    const botJaw2 = new THREE.Mesh(jawGeo, gripMat);
    botJaw2.position.set(0, 1, -1.5);
    botGripGroup.add(botJaw2);
    
    botCrossGroup.add(botGripGroup);

    parts.push({
        name: "Top Pneumatic Grip",
        description: "Ultra-wide serrated jaws clamping the upper width of the metamaterial.",
        material: "Hardened Tool Steel",
        function: "Prevents specimen slippage. The wide grip enforces uniform boundary conditions.",
        assemblyOrder: 9,
        connections: ["Load Cell", "Specimen"],
        failureEffect: "Specimen slips, producing artificial strain readings.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 31.5, z: 0 },
        explodedPosition: { x: 0, y: 31.5, z: -10 }
    });

    parts.push({
        name: "Bottom Pneumatic Grip",
        description: "Mobile clamping interface connecting the moving crosshead to the sample.",
        material: "Hardened Tool Steel",
        function: "Applies the downward stretch uniformly across the specimen's bottom edge.",
        assemblyOrder: 10,
        connections: ["Moving Crosshead", "Specimen"],
        failureEffect: "Jaw fracture under high lateral expansion loads.",
        cascadeFailures: ["Specimen"],
        originalPosition: { x: 0, y: 14.5, z: 0 },
        explodedPosition: { x: 0, y: 14.5, z: -10 }
    });

    // ---------------- 6. Console & DAQ ----------------
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(22, 0, 10);
    consoleGroup.rotation.y = -Math.PI / 4;
    
    const pedestalGeo = new THREE.CylinderGeometry(1, 1, 12, 16);
    const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestal.position.set(0, 6, 0);
    consoleGroup.add(pedestal);
    
    const panelGeo = new THREE.BoxGeometry(10, 8, 2);
    const panel = new THREE.Mesh(panelGeo, aluminum);
    panel.position.set(0, 14, 0);
    panel.rotation.x = -Math.PI / 6;
    consoleGroup.add(panel);
    
    const screenGeo = new THREE.BoxGeometry(8, 5, 0.2);
    const screen = new THREE.Mesh(screenGeo, neonBlue);
    screen.position.set(0, 1, 1.1);
    panel.add(screen);
    meshes.screen = screen;
    
    const daqGeo = new THREE.BoxGeometry(8, 6, 4);
    const daq = new THREE.Mesh(daqGeo, darkSteel);
    daq.position.set(0, 3, 0);
    consoleGroup.add(daq);

    group.add(consoleGroup);

    parts.push({
        name: "Telemetry Control Console",
        description: "Advanced operator interface showing real-time stress-strain curves.",
        material: "Aluminum & OLED",
        function: "Processes sensor data and controls servo-valves.",
        assemblyOrder: 11,
        connections: ["DAQ", "Sensors"],
        failureEffect: "Loss of control, automatic emergency shutdown triggered.",
        cascadeFailures: ["None"],
        originalPosition: { x: 22, y: 14, z: 10 },
        explodedPosition: { x: 35, y: 14, z: 20 }
    });

    parts.push({
        name: "Data Acquisition System (DAQ)",
        description: "High-speed multi-channel DAQ sampling strain and load at 100 kHz.",
        material: "Anodized Aluminum",
        function: "Synchronizes force readings from the load cell with visual strain fields.",
        assemblyOrder: 12,
        connections: ["Console", "Sensors"],
        failureEffect: "Data corruption or temporal misalignment.",
        cascadeFailures: ["None"],
        originalPosition: { x: 22, y: 3, z: 10 },
        explodedPosition: { x: 22, y: 3, z: 30 }
    });

    // ---------------- 7. Hoses & Shield ----------------
    const curve1 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(8, 6, 2),
        new THREE.Vector3(15, 2, 5),
        new THREE.Vector3(22, 4, 10)
    );
    const hoseGeo1 = new THREE.TubeGeometry(curve1, 20, 0.4, 8, false);
    const hose1 = new THREE.Mesh(hoseGeo1, rubber);
    group.add(hose1);

    parts.push({
        name: "High-Pressure Hydraulic Lines",
        description: "Braided steel-reinforced rubber hoses rated for 10,000 PSI.",
        material: "Rubber & Kevlar",
        function: "Transmits hydraulic fluid from the manifold to the cylinders.",
        assemblyOrder: 13,
        connections: ["Hydraulic Cylinders", "Manifold"],
        failureEffect: "Explosive decompression of fluid.",
        cascadeFailures: ["Hydraulic Cylinders"],
        originalPosition: { x: 15, y: 4, z: 5 },
        explodedPosition: { x: 15, y: 4, z: 25 }
    });

    const shieldGeo = new THREE.BoxGeometry(32, 28, 12);
    const shield = new THREE.Mesh(shieldGeo, tinted);
    shield.position.set(0, 22, 0);
    shield.material.transparent = true;
    shield.material.opacity = 0.2;
    group.add(shield);

    parts.push({
        name: "Polycarbonate Safety Shield",
        description: "1-inch thick transparent blast shield enclosing the test area.",
        material: "Tinted Polycarbonate",
        function: "Protects the operator from high-velocity shrapnel.",
        assemblyOrder: 14,
        connections: ["Base"],
        failureEffect: "Operator exposure to debris.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 0, y: 22, z: -30 }
    });

    // ---------------- 8. Extensometer ----------------
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, 22, 15);
    
    const camBodyGeo = new THREE.BoxGeometry(4, 3, 6);
    const camBody = new THREE.Mesh(camBodyGeo, aluminum);
    cameraGroup.add(camBody);
    
    const lensGeo = new THREE.CylinderGeometry(1, 1.5, 3, 32);
    const lens = new THREE.Mesh(lensGeo, chrome);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, -3.5);
    cameraGroup.add(lens);

    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 20, 8);
    laserGeo.translate(0, -10, 0);
    laserGeo.rotateX(Math.PI / 2);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.6 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(0, 0, -4);
    cameraGroup.add(laser);
    meshes.laser = laser;
    
    group.add(cameraGroup);

    parts.push({
        name: "Optical Extensometer (DIC)",
        description: "Digital Image Correlation system using dual 4K cameras and structured laser light.",
        material: "Aluminum & Glass",
        function: "Measures 3D surface strain fields of the metamaterial without physical contact.",
        assemblyOrder: 15,
        connections: ["Console"],
        failureEffect: "Loss of localized strain data, fallback to crosshead displacement.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 22, z: 15 },
        explodedPosition: { x: 0, y: 40, z: 25 }
    });

    // ---------------- 9. AUXETIC METAMATERIAL LATTICE ----------------
    // Generates a massive Re-entrant Honeycomb structure
    const numCols = 16;
    const numRows = 8;
    const strutRadius = 0.15;
    
    const numNodes = (numCols + 1) * (numRows + 1) * 2;
    const nodeGeo = new THREE.SphereGeometry(strutRadius * 1.6, 16, 16);
    const nodeMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, numNodes);
    nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(nodeMesh);
    meshes.nodeMesh = nodeMesh;
    
    const numVertStruts = (numCols + 1) * (numRows + 1);
    const vertGeo = new THREE.CylinderGeometry(strutRadius, strutRadius, 1, 8);
    vertGeo.translate(0, 0.5, 0);
    const vertMesh = new THREE.InstancedMesh(vertGeo, strutMat, numVertStruts);
    vertMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(vertMesh);
    meshes.vertMesh = vertMesh;
    
    const numDiagStruts = numCols * (numRows + 1) * 2;
    const diagGeo = new THREE.CylinderGeometry(strutRadius, strutRadius, 1, 8);
    diagGeo.translate(0, 0.5, 0);
    const diagMesh = new THREE.InstancedMesh(diagGeo, strutMat, numDiagStruts);
    diagMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(diagMesh);
    meshes.diagMesh = diagMesh;

    meshes.latticeParams = { numCols, numRows, h: 1.2, l: 0.9, topPinY: 30.5 };

    parts.push({
        name: "Auxetic Metamaterial Nodes",
        description: "Hyper-elastic polymer joints serving as hinging points for the re-entrant honeycomb.",
        material: "Neon Orange Elastomer",
        function: "Enables extreme rotational compliance required for the auxetic unfolding mechanism.",
        assemblyOrder: 16,
        connections: ["Struts"],
        failureEffect: "Node rupture, localized structural collapse.",
        cascadeFailures: ["Surrounding Struts"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: -10, y: 20, z: 0 }
    });

    parts.push({
        name: "Auxetic Metamaterial Struts",
        description: "Rigid carbon-fiber micro-struts arranged in a re-entrant (bowtie) topological lattice.",
        material: "Carbon Fiber Composite",
        function: "Transfers loads and converts longitudinal tension into lateral expansion.",
        assemblyOrder: 17,
        connections: ["Nodes", "Grips"],
        failureEffect: "Strut buckling or tensile snapping.",
        cascadeFailures: ["Complete Specimen Failure"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 10, y: 20, z: 0 }
    });

    const description = "A massive 200kN servo-hydraulic universal testing machine characterizing an advanced auxetic (negative Poisson's ratio) metamaterial. As the machine stretches the specimen longitudinally, the re-entrant honeycomb geometry causes it to physically expand laterally—defying conventional material behavior and visually demonstrating metamaterial mechanics.";

    const quizQuestions = [
        {
            question: "What unique property does this auxetic metamaterial demonstrate when stretched?",
            options: [
                "It gets thinner in the middle",
                "It becomes completely transparent",
                "It expands laterally (gets wider)",
                "It instantly shatters"
            ],
            correctAnswer: 2,
            explanation: "Auxetic materials have a negative Poisson's ratio, meaning they expand transversely when stretched longitudinally, due to their internal hinging geometry."
        },
        {
            question: "How does the structural geometry achieve this auxetic effect?",
            options: [
                "Using simple rigid cubes",
                "Using a re-entrant (bowtie) honeycomb structure",
                "Using randomly distributed bubbles",
                "By heating the material"
            ],
            correctAnswer: 1,
            explanation: "The re-entrant honeycomb features diagonal struts that fold inwards. When stretched, these diagonals hinge outwards, increasing the overall width."
        },
        {
            question: "What is the function of the Optical Extensometer?",
            options: [
                "To shoot lasers that heat the specimen",
                "To physically hold the specimen",
                "To measure 3D surface strain fields without contact",
                "To pump hydraulic fluid"
            ],
            correctAnswer: 2,
            explanation: "Digital Image Correlation (DIC) uses cameras and structured light to precisely track the surface deformation of complex materials without interfering with their delicate movement."
        },
        {
            question: "Why are the testing machine's grips pneumatically actuated and extremely wide?",
            options: [
                "To look more intimidating",
                "To clamp the entire width and prevent slipping or non-uniform edge effects",
                "To crush the material before testing",
                "Because they were cheaper to manufacture"
            ],
            correctAnswer: 1,
            explanation: "Testing metamaterials requires uniform boundary conditions across the entire width, preventing artificial stress concentrations or slippage."
        },
        {
            question: "If a conventional material (like rubber) was tested instead, what would happen to its width?",
            options: [
                "It would remain exactly the same",
                "It would expand immensely",
                "It would contract (necking)",
                "It would melt"
            ],
            correctAnswer: 2,
            explanation: "Conventional materials have a positive Poisson's ratio. Due to volume conservation, stretching them longitudinally forces them to contract laterally."
        }
    ];

    const animate = (time, speed, meshes) => {
        const { numCols, numRows, h, l, topPinY } = meshes.latticeParams;

        // Oscillating alpha from 0.6 (relaxed, re-entrant) to 0.05 (highly stretched)
        const alpha0 = 0.6;
        const alpha1 = 0.05;
        const cycle = (Math.sin(time * speed * 1.5) + 1) / 2;
        const alpha = alpha0 - cycle * (alpha0 - alpha1);

        const S = h - l * Math.sin(alpha);
        const dx = l * Math.cos(alpha);
        // Calculate exact mathematical grid for the auxetic behavior
        const refC = Math.floor(numCols / 2);
        const refR = numRows;
        const origX = refC * dx;
        const origY = (2 * refR + refC) * S + h / 2;

        const dummy = new THREE.Object3D();
        const pT = new THREE.Vector3();
        const pB = new THREE.Vector3();
        const pT_next = new THREE.Vector3();
        const pB_next = new THREE.Vector3();
        const axis = new THREE.Vector3(0, 1, 0);

        let nodeIdx = 0;
        let vertIdx = 0;
        let diagIdx = 0;

        // Reconstruct the 3D Lattice in real-time
        for (let c = 0; c <= numCols; c++) {
            for (let r = 0; r <= numRows; r++) {
                let x = c * dx - origX;
                let yT = (2 * r + c) * S + h / 2 - origY + topPinY;
                let yB = (2 * r + c) * S - h / 2 - origY + topPinY;
                
                pT.set(x, yT, 0);
                pB.set(x, yB, 0);
                
                // Update Top Node
                dummy.position.copy(pT);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                meshes.nodeMesh.setMatrixAt(nodeIdx++, dummy.matrix);
                
                // Update Bottom Node
                dummy.position.copy(pB);
                dummy.updateMatrix();
                meshes.nodeMesh.setMatrixAt(nodeIdx++, dummy.matrix);
                
                // Update Vertical Strut
                dummy.position.copy(pB);
                dummy.quaternion.identity();
                dummy.scale.set(1, h, 1);
                dummy.updateMatrix();
                meshes.vertMesh.setMatrixAt(vertIdx++, dummy.matrix);
                
                if (c < numCols) {
                    let x_next = (c + 1) * dx - origX;
                    let yB_next = (2 * r + c + 1) * S - h / 2 - origY + topPinY;
                    pB_next.set(x_next, yB_next, 0);
                    
                    let dir = pB_next.clone().sub(pT);
                    let len = dir.length();
                    
                    // Diagonal 1
                    dummy.position.copy(pT);
                    dummy.quaternion.setFromUnitVectors(axis, dir.normalize());
                    dummy.scale.set(1, len, 1);
                    dummy.updateMatrix();
                    meshes.diagMesh.setMatrixAt(diagIdx++, dummy.matrix);
                    
                    if (r > 0) {
                        let yT_next = (2 * (r - 1) + c + 1) * S + h / 2 - origY + topPinY;
                        pT_next.set(x_next, yT_next, 0);
                        
                        dir.copy(pT_next).sub(pB);
                        len = dir.length();
                        
                        // Diagonal 2
                        dummy.position.copy(pB);
                        dummy.quaternion.setFromUnitVectors(axis, dir.normalize());
                        dummy.scale.set(1, len, 1);
                        dummy.updateMatrix();
                        meshes.diagMesh.setMatrixAt(diagIdx++, dummy.matrix);
                    }
                }
            }
        }

        meshes.nodeMesh.instanceMatrix.needsUpdate = true;
        meshes.vertMesh.instanceMatrix.needsUpdate = true;
        meshes.diagMesh.instanceMatrix.needsUpdate = true;

        // Actuate Bottom Crosshead to perfectly track the lowest edge of the expanding lattice
        const botOrigY = (0 + refC) * S - h / 2;
        const botWorldY = botOrigY - origY + topPinY;
        meshes.botCrossGroup.position.y = botWorldY - 5;
        
        // Dynamic Console Screen Effects
        const screenPulse = (Math.sin(time * speed * 10) + 1) / 2;
        meshes.screen.material.emissiveIntensity = 1.0 + screenPulse * 1.5;
        
        // Extensometer Laser Scanning Effect
        meshes.laser.position.y = Math.sin(time * speed * 3) * 5;
        
        // Load Cell ring glowing color mapping (Blue -> Red as load increases)
        meshes.loadCellRing.material.emissiveIntensity = 0.5 + cycle * 3.0;
        meshes.loadCellRing.material.color.setHSL(0.6 - cycle * 0.6, 1, 0.5);
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAuxeticStructure() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
