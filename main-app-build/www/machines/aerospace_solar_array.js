import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -----------------------------------------
    // Custom High-Tech Materials
    // -----------------------------------------
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.9
    });
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 1.5, transparent: true, opacity: 0.8, wireframe: true
    });
    const pvGridMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 1.0, wireframe: true, transparent: true, opacity: 0.3
    });
    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00, roughness: 0.4, metalness: 0.8, bumpScale: 0.05
    });

    // -----------------------------------------
    // Geometries & Meshes
    // -----------------------------------------

    // 1. Base Mount
    const baseMount = new THREE.Group();
    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 1, 32), darkSteel);
    baseMount.add(baseCyl);
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.1, 16, 64), neonBlue);
    baseRing.position.y = 0.3;
    baseMount.add(baseRing);
    for(let i=0; i<8; i++) {
        const support = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), chrome);
        support.position.set(Math.cos(i * Math.PI / 4) * 1.6, 0, Math.sin(i * Math.PI / 4) * 1.6);
        support.lookAt(0, 0, 0);
        baseMount.add(support);
    }
    baseMount.position.set(0, 0, 0);
    group.add(baseMount);
    meshes.baseMount = baseMount;
    parts.push({
        name: 'S/C Interface Hub',
        description: 'Primary structural and electrical interface to the spacecraft bus.',
        material: 'Dark Steel & Titanium',
        function: 'Anchors the array and routes generated power into the spacecraft power conditioning unit.',
        assemblyOrder: 1,
        connections: ['driveMechanism'],
        failureEffect: 'Total loss of structural integrity.',
        cascadeFailures: ['Array detachment', 'Complete power loss'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: baseMount
    });

    // 2. Solar Array Drive Mechanism (SADM)
    const sadm = new THREE.Group();
    sadm.position.set(0, 1.5, 0);
    const sadmCore = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), copper);
    sadm.add(sadmCore);
    const sadmMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32), aluminum);
    sadmMotor.rotation.x = Math.PI / 2;
    sadm.add(sadmMotor);
    const sadmGlow = new THREE.Mesh(new THREE.SphereGeometry(1.25, 16, 16), neonPurple);
    sadm.add(sadmGlow);
    group.add(sadm);
    meshes.sadm = sadm;
    meshes.sadmGlow = sadmGlow;
    parts.push({
        name: 'SADM (Solar Array Drive Mechanism)',
        description: 'Continuously rotates the array to track the sun.',
        material: 'Copper & Aluminum',
        function: 'Uses stepper motors and slip rings to allow 360-degree rotation without tangling cables.',
        assemblyOrder: 2,
        connections: ['baseMount', 'articulatedArm'],
        failureEffect: 'Inability to track the sun.',
        cascadeFailures: ['Reduced power generation', 'Battery depletion'],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 0, z: -5},
        mesh: sadm
    });

    // 3. Articulated Arm (Truss)
    const arm = new THREE.Group();
    arm.position.set(0, 0, 1.5);
    const trussLength = 6;
    const truss = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, trussLength), steel);
    truss.position.z = trussLength / 2;
    arm.add(truss);
    const conduit1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, trussLength, 8), neonBlue);
    conduit1.rotation.x = Math.PI / 2;
    conduit1.position.set(0.5, 0.5, trussLength / 2);
    arm.add(conduit1);
    const conduit2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, trussLength, 8), neonBlue);
    conduit2.rotation.x = Math.PI / 2;
    conduit2.position.set(-0.5, -0.5, trussLength / 2);
    arm.add(conduit2);
    
    const movingRings = [];
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 16, 32), neonBlue);
        ring.rotation.x = Math.PI / 2;
        arm.add(ring);
        movingRings.push(ring);
    }
    meshes.movingRings = movingRings;
    sadm.add(arm); // Child of SADM
    meshes.arm = arm;
    parts.push({
        name: 'Deployment Truss Arm',
        description: 'Rigid deployable boom extending panels away from the spacecraft body.',
        material: 'Steel & Composite',
        function: 'Prevents shadowing of the panels by the spacecraft body and accommodates high-voltage conduits.',
        assemblyOrder: 3,
        connections: ['sadm', 'yoke'],
        failureEffect: 'Incomplete deployment.',
        cascadeFailures: ['Thermal constraints violated', 'Shadowing power loss'],
        originalPosition: {x: 0, y: 0, z: 1.5},
        explodedPosition: {x: 5, y: 0, z: 1.5},
        mesh: arm
    });

    // 4. Yoke Assembly
    const yoke = new THREE.Group();
    yoke.position.set(0, 0, 6.0); // End of truss (trussLength = 6)
    const yokeMain = new THREE.Mesh(new THREE.BoxGeometry(4, 0.6, 0.6), chrome);
    yoke.add(yokeMain);
    const yokeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.8, 32), goldFoil);
    yokeHub.rotation.x = Math.PI / 2;
    yoke.add(yokeHub);
    const yokeGlow = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 16, 64), neonBlue);
    yokeGlow.rotation.x = Math.PI / 2;
    yoke.add(yokeGlow);
    arm.add(yoke);
    meshes.yoke = yoke;
    meshes.yokeGlow = yokeGlow;
    parts.push({
        name: 'Tension Yoke Assembly',
        description: 'T-shaped interface distributing tension across the solar panel blankets.',
        material: 'Chrome & Gold Foil',
        function: 'Maintains planar tension on the arrays to prevent warping and micro-vibrations.',
        assemblyOrder: 4,
        connections: ['articulatedArm', 'panelInner'],
        failureEffect: 'Panel warping or misalignment.',
        cascadeFailures: ['Micro-fractures in PV cells', 'Power degradation'],
        originalPosition: {x: 0, y: 0, z: 6.0},
        explodedPosition: {x: 0, y: 5, z: 6.0},
        mesh: yoke
    });

    // 5. Panels Group
    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, 0, 0.5); // Just ahead of the Yoke center
    yoke.add(panelGroup);
    meshes.panelGroup = panelGroup;

    const createPanel = (yOffset, name, desc) => {
        const panel = new THREE.Group();
        panel.position.y = yOffset;
        
        // Frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 0.2), darkSteel);
        panel.add(frame);
        
        // Glass substrate
        const substrate = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.8, 0.21), tinted);
        panel.add(substrate);
        
        // PV Grid (glowing wireframe layer)
        const pvGrid = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.8, 12, 8), pvGridMaterial);
        pvGrid.position.z = 0.11;
        panel.add(pvGrid);
        
        const pvGridBack = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.8, 12, 8), pvGridMaterial);
        pvGridBack.rotation.y = Math.PI;
        pvGridBack.position.z = -0.11;
        panel.add(pvGridBack);

        return { panel, pvGrid, pvGridBack };
    };

    // Inner Panel
    const innerP = createPanel(0, 'Inner', 'First deployable segment of the solar blanket.');
    panelGroup.add(innerP.panel);
    meshes.innerGrid1 = innerP.pvGrid;
    meshes.innerGrid2 = innerP.pvGridBack;
    parts.push({
        name: 'Inner PV Array',
        description: 'Primary photovoltaic segment closest to the yoke.',
        material: 'Monocrystalline Silicon & Glass',
        function: 'Converts solar photons into electrical current via the photoelectric effect.',
        assemblyOrder: 5,
        connections: ['yoke', 'middlePanel'],
        failureEffect: '33% loss of array power generation.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -8, y: 0, z: 0},
        mesh: innerP.panel
    });

    // Middle Panel
    const middleP = createPanel(4.2, 'Middle', 'Second deployable segment of the solar blanket.');
    panelGroup.add(middleP.panel);
    meshes.middleGrid1 = middleP.pvGrid;
    meshes.middleGrid2 = middleP.pvGridBack;
    parts.push({
        name: 'Middle PV Array',
        description: 'Intermediate photovoltaic segment.',
        material: 'Monocrystalline Silicon & Glass',
        function: 'Expands the active generation area.',
        assemblyOrder: 6,
        connections: ['innerPanel', 'outerPanel'],
        failureEffect: '33% loss of array power generation.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 4.2, z: 0},
        explodedPosition: {x: -16, y: 4.2, z: 0},
        mesh: middleP.panel
    });

    // Outer Panel
    const outerP = createPanel(8.4, 'Outer', 'Final deployable segment of the solar blanket.');
    panelGroup.add(outerP.panel);
    meshes.outerGrid1 = outerP.pvGrid;
    meshes.outerGrid2 = outerP.pvGridBack;
    parts.push({
        name: 'Outer PV Array',
        description: 'Distal photovoltaic segment equipped with sun sensors.',
        material: 'Monocrystalline Silicon & Glass',
        function: 'Maximizes power generation and provides angular tracking feedback.',
        assemblyOrder: 7,
        connections: ['middlePanel'],
        failureEffect: '33% loss of array power generation.',
        cascadeFailures: ['Tracking sensor failure'],
        originalPosition: {x: 0, y: 8.4, z: 0},
        explodedPosition: {x: -24, y: 8.4, z: 0},
        mesh: outerP.panel
    });

    // -----------------------------------------
    // Description & Quiz
    // -----------------------------------------
    const description = "The Deployable Solar Array is an ultra high-tech spacecraft power generation system. It utilizes a centralized Solar Array Drive Mechanism (SADM) with slip rings and stepper motors for continuous sun-tracking. The array unfolds via a rigid telescopic truss terminating in a tension yoke, which suspends advanced monocrystalline silicon photovoltaic blankets. Glowing plasma conduits handle high-voltage direct current transfer, while an embedded neon-blue tracking grid on the panels maximizes photon capture efficiency.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Solar Array Drive Mechanism (SADM)?",
            options: [
                "To store excess electrical energy.",
                "To continuously rotate the array for sun tracking.",
                "To cool the photovoltaic cells.",
                "To fold the panels during atmospheric reentry."
            ],
            correct: 1,
            explanation: "The SADM uses motors and slip rings to rotate the entire array, keeping it pointed at the sun without tangling power cables.",
            difficulty: "Medium"
        },
        {
            question: "Why is a truss arm used between the spacecraft bus and the solar panels?",
            options: [
                "To prevent the spacecraft body from casting shadows on the panels.",
                "To act as a communications antenna.",
                "To increase the spacecraft's aerodynamic lift.",
                "To provide structural mass for gravity stabilization."
            ],
            correct: 0,
            explanation: "The deployment truss boom extends the panels away from the main spacecraft body to minimize shadowing, which would drastically reduce power output.",
            difficulty: "Medium"
        },
        {
            question: "Which component maintains planar tension across the solar array blankets?",
            options: [
                "S/C Interface Hub",
                "Tension Yoke Assembly",
                "Plasma Conduits",
                "Outer PV Array"
            ],
            correct: 1,
            explanation: "The Tension Yoke Assembly acts as the main bracket and tensioning interface, ensuring the solar blankets remain flat and taught in microgravity.",
            difficulty: "Hard"
        }
    ];

    // -----------------------------------------
    // Animation Loop
    // -----------------------------------------
    const animate = (time, speed, animMeshes) => {
        const t = time * speed;
        const m = animMeshes || meshes;

        // SADM Core Rotation (tracking the sun)
        if (m.sadm) {
            m.sadm.rotation.y = t * 0.2; // Slowly rotate the entire array mechanism
        }
        
        if (m.sadmGlow) {
            m.sadmGlow.rotation.x = -t;
            m.sadmGlow.scale.setScalar(1.0 + Math.sin(t * 3) * 0.05);
        }

        // Yoke pulsing
        if (m.yokeGlow) {
            m.yokeGlow.scale.setScalar(1.0 + Math.sin(t * 5) * 0.1);
            m.yokeGlow.rotation.z = t;
        }

        // Panel slight adjustments (simulating micro-tracking or flexibility)
        if (m.panelGroup) {
            m.panelGroup.rotation.x = Math.sin(t * 0.5) * 0.05;
        }

        // Moving rings along the truss
        if (m.movingRings) {
            m.movingRings.forEach((ring, idx) => {
                const zPos = (t * 2 + idx * 2) % 6; // trussLength is 6
                ring.position.set(0, 0, zPos);
            });
        }

        // Pulse the photovoltaic grids to simulate energy flow
        const pulse = (Math.sin(t * 4) + 1) / 2; // 0 to 1
        const opacityVal = 0.2 + pulse * 0.4;
        const emissiveVal = 0.5 + pulse * 1.5;
        
        const grids = [m.innerGrid1, m.innerGrid2, m.middleGrid1, m.middleGrid2, m.outerGrid1, m.outerGrid2];
        grids.forEach(grid => {
            if (grid && grid.material) {
                grid.material.opacity = opacityVal;
                grid.material.emissiveIntensity = emissiveVal;
            }
        });
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createSolarArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
