import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        waterDrops: [],
        fans: [],
        uvLights: [],
        pumpImpeller: null,
        leaves: []
    };

    // Custom Materials for organic/specialized parts
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.05,
        ior: 1.33,
        thickness: 0.5,
        transparent: true
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x22aa33,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
        emissive: 0x052205
    });

    const rootMaterial = new THREE.MeshStandardMaterial({
        color: 0xddccaa,
        roughness: 0.9,
        metalness: 0.0,
        bumpScale: 0.05
    });

    const uvLedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 2.5,
        toneMapped: false
    });

    const sensorDisplayMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.5
    });

    // ==========================================
    // 1. BASE RESERVOIR TANK (LatheGeometry)
    // ==========================================
    const reservoirPoints = [];
    for (let i = 0; i <= 20; i++) {
        const y = i * 0.5;
        const x = 12 + Math.sin(i * 0.3) * 1.5 - (i * 0.1);
        reservoirPoints.push(new THREE.Vector2(x, y));
    }
    const reservoirGeo = new THREE.LatheGeometry(reservoirPoints, 64);
    const reservoir = new THREE.Mesh(reservoirGeo, plastic);
    reservoir.position.set(0, -10, 0);
    reservoir.castShadow = true;
    reservoir.receiveShadow = true;
    group.add(reservoir);

    parts.push({
        name: "Base Reservoir Tank",
        description: "A large capacity, UV-stabilized polymer tank that holds the primary nutrient solution. Features a curved dynamic flow design to prevent nutrient stagnation.",
        material: "High-Density Polyethylene (Plastic)",
        function: "Stores water and nutrients, acting as the foundation and anchor for the vertical tower.",
        assemblyOrder: 1,
        connections: ["Submersible Water Pump", "Nutrient Mixing Chamber", "Vertical Support Extrusion"],
        failureEffect: "Loss of primary water supply leading to rapid desiccation of the entire crop.",
        cascadeFailures: ["Submersible Water Pump", "Leaf & Root Biomass System"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ==========================================
    // 2. SUBMERSIBLE WATER PUMP (Cylinders & Torus)
    // ==========================================
    const pumpGroup = new THREE.Group();
    const pumpBodyGeo = new THREE.CylinderGeometry(2, 2.5, 5, 32);
    const pumpBody = new THREE.Mesh(pumpBodyGeo, darkSteel);
    pumpGroup.add(pumpBody);

    const impellerGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
    const impeller = new THREE.Mesh(impellerGeo, aluminum);
    impeller.position.y = 2.5;
    meshes.pumpImpeller = impeller;
    pumpGroup.add(impeller);
    
    pumpGroup.position.set(0, -8, 0);
    reservoir.add(pumpGroup);

    parts.push({
        name: "Submersible Water Pump",
        description: "High-torque, magnetically driven impeller pump designed for continuous flow against high head pressure.",
        material: "Dark Steel & Aluminum",
        function: "Pumps nutrient-rich water from the base reservoir up to the top distribution manifold.",
        assemblyOrder: 2,
        connections: ["Base Reservoir Tank", "Primary Delivery Pipe"],
        failureEffect: "Water flow ceases, stopping the trickle system and aeroponic misting.",
        cascadeFailures: ["Aeroponic Misting Nozzles", "Hydraulic Trickle Lines"],
        originalPosition: { x: 0, y: -18, z: 0 },
        explodedPosition: { x: 0, y: -18, z: 15 }
    });

    // ==========================================
    // 3. VERTICAL SUPPORT EXTRUSION (Custom Shape)
    // ==========================================
    const colShape = new THREE.Shape();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const r = i % 2 === 0 ? 3.5 : 2.5;
        if(i===0) colShape.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
        else colShape.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
    }
    colShape.closePath();

    const extrudeSettings = { depth: 40, bevelEnabled: false, curveSegments: 24 };
    const columnGeo = new THREE.ExtrudeGeometry(colShape, extrudeSettings);
    // Rotate to stand upright
    columnGeo.rotateX(Math.PI / 2);
    
    const centralColumn = new THREE.Mesh(columnGeo, aluminum);
    centralColumn.position.set(0, 30, 0); // Spans from -10 to +30
    centralColumn.castShadow = true;
    centralColumn.receiveShadow = true;
    group.add(centralColumn);

    parts.push({
        name: "Vertical Support Extrusion",
        description: "A precisely extruded aerospace-grade aluminum spar. Its fluted profile increases structural rigidity and houses internal wiring.",
        material: "Aerospace Aluminum",
        function: "Provides the main structural backbone for the modular grow pods and lighting systems.",
        assemblyOrder: 3,
        connections: ["Base Reservoir Tank", "Distribution Manifold (Top)", "Grow Pod Matrix"],
        failureEffect: "Structural collapse of the tower.",
        cascadeFailures: ["Grow Pod Matrix", "UV LED Grow Light Strip (Left)"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // ==========================================
    // 4. PRIMARY DELIVERY PIPE (TubeGeometry)
    // ==========================================
    class PipeCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = Math.sin(t * Math.PI * 2) * 0.5;
            const y = t * 40; // From bottom to top
            const z = Math.cos(t * Math.PI * 2) * 0.5 - 1.5;
            return optionalTarget.set(x, y, z);
        }
    }
    const pipeGeo = new THREE.TubeGeometry(new PipeCurve(), 100, 0.6, 16, false);
    const mainPipe = new THREE.Mesh(pipeGeo, glass);
    mainPipe.position.set(0, -9, 0);
    group.add(mainPipe);

    parts.push({
        name: "Primary Delivery Pipe",
        description: "A transparent borosilicate glass tube that allows visual inspection of nutrient flow to the manifold.",
        material: "Borosilicate Glass",
        function: "Transports pressurized water from the pump to the peak of the tower.",
        assemblyOrder: 4,
        connections: ["Submersible Water Pump", "Distribution Manifold (Top)"],
        failureEffect: "Nutrient flow interruption due to pressure leaks.",
        cascadeFailures: ["Hydraulic Trickle Lines"],
        originalPosition: { x: 0, y: -9, z: 0 },
        explodedPosition: { x: -10, y: -9, z: -10 }
    });

    // ==========================================
    // 5. DISTRIBUTION MANIFOLD (Torus & Lathe)
    // ==========================================
    const manifoldGroup = new THREE.Group();
    const manifoldBaseGeo = new THREE.CylinderGeometry(5, 5, 2, 32);
    const manifoldBase = new THREE.Mesh(manifoldBaseGeo, darkSteel);
    manifoldGroup.add(manifoldBase);

    const manifoldTorusGeo = new THREE.TorusGeometry(5, 0.8, 16, 64);
    const manifoldRing = new THREE.Mesh(manifoldTorusGeo, chrome);
    manifoldRing.rotation.x = Math.PI / 2;
    manifoldGroup.add(manifoldRing);

    // Drip nodes
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const nodeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
        const node = new THREE.Mesh(nodeGeo, copper);
        node.position.set(Math.cos(angle)*5, -1, Math.sin(angle)*5);
        manifoldGroup.add(node);
    }
    
    manifoldGroup.position.set(0, 31, 0);
    group.add(manifoldGroup);

    parts.push({
        name: "Distribution Manifold (Top)",
        description: "A complex chrome and steel manifold that equalizes pressure and splits the fluid flow into precise trickle streams.",
        material: "Dark Steel, Chrome & Copper",
        function: "Divides the main hydraulic line into multiple independent trickles for 360-degree coverage.",
        assemblyOrder: 5,
        connections: ["Primary Delivery Pipe", "Vertical Support Extrusion", "Hydraulic Trickle Lines"],
        failureEffect: "Uneven water distribution causing dry spots in the grow pods.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: 0, y: 31, z: 0 },
        explodedPosition: { x: 0, y: 55, z: 0 }
    });

    // ==========================================
    // 6 & 7 & 8: GROW POD MATRIX, ROOTS, LEAVES, MISTING
    // ==========================================
    const levels = 6;
    const podsPerLevel = 6;
    
    const podShape = new THREE.Shape();
    podShape.absarc(0, 0, 1.8, 0, Math.PI * 2, false);
    
    const podGeo = new THREE.CylinderGeometry(2, 1.2, 3, 16);
    podGeo.translate(0, 1.5, 0);
    podGeo.rotateX(Math.PI / 4); // Angle outward

    // Leaf generator
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(1, 1.5, 0.2, 4);
    leafShape.quadraticCurveTo(-1, 1.5, 0, 0);
    const leafExtrude = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, curveSegments: 12 };
    const singleLeafGeo = new THREE.ExtrudeGeometry(leafShape, leafExtrude);
    singleLeafGeo.translate(0, 0, 0);

    // Root generator (CatmullRomCurve)
    function createRoot() {
        const pts = [];
        let curX = 0, curY = 0, curZ = 0;
        for(let i=0; i<6; i++) {
            pts.push(new THREE.Vector3(curX, curY, curZ));
            curX += (Math.random() - 0.5) * 0.8;
            curY -= (Math.random() * 0.8 + 0.4);
            curZ += (Math.random() - 0.5) * 0.8;
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return new THREE.TubeGeometry(curve, 16, 0.08, 8, false);
    }

    for(let l=0; l<levels; l++) {
        const yPos = l * 6 - 2;
        for(let p=0; p<podsPerLevel; p++) {
            const angle = (p/podsPerLevel) * Math.PI * 2 + (l % 2 === 0 ? 0 : Math.PI/podsPerLevel);
            
            const podGroup = new THREE.Group();
            
            // The Pod Holder
            const podMesh = new THREE.Mesh(podGeo, plastic);
            podGroup.add(podMesh);

            // Net Cup (Torus)
            const cupGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
            const cup = new THREE.Mesh(cupGeo, rubber);
            cup.position.set(0, 2.5, 2.5);
            cup.rotation.x = -Math.PI / 4;
            podGroup.add(cup);

            // Biomass (Leaves)
            const foliageGroup = new THREE.Group();
            const numLeaves = 3 + Math.floor(Math.random() * 3);
            for(let i=0; i<numLeaves; i++) {
                const leaf = new THREE.Mesh(singleLeafGeo, leafMaterial);
                leaf.rotation.y = (i/numLeaves) * Math.PI * 2;
                leaf.rotation.x = Math.random() * 0.5 + 0.2;
                // Save base rotation for wind animation
                leaf.userData.baseRot = leaf.rotation.clone();
                meshes.leaves.push(leaf);
                foliageGroup.add(leaf);
            }
            foliageGroup.position.set(0, 2.8, 2.8);
            podGroup.add(foliageGroup);

            // Biomass (Roots)
            const rootMesh1 = new THREE.Mesh(createRoot(), rootMaterial);
            const rootMesh2 = new THREE.Mesh(createRoot(), rootMaterial);
            rootMesh1.position.set(0, 1.5, 1.5);
            rootMesh2.position.set(0, 1.5, 1.5);
            podGroup.add(rootMesh1);
            podGroup.add(rootMesh2);

            // Aeroponic Misting Nozzle
            const nozzleGeo = new THREE.SphereGeometry(0.3, 16, 16);
            const nozzle = new THREE.Mesh(nozzleGeo, steel);
            nozzle.position.set(0, -0.5, 0);
            podGroup.add(nozzle);

            const distance = 4;
            podGroup.position.set(Math.cos(angle)*distance, yPos, Math.sin(angle)*distance);
            podGroup.rotation.y = -angle + Math.PI/2;
            group.add(podGroup);
        }
    }

    parts.push({
        name: "Grow Pod Matrix",
        description: "36 high-density engineered growth chambers angled optimally to capture vertical UV light while directing roots into the mist zone.",
        material: "Polypropylene Plastic",
        function: "Supports the net cups and houses the root systems in a perfectly humid environment.",
        assemblyOrder: 6,
        connections: ["Vertical Support Extrusion", "Plant Support Net Cups"],
        failureEffect: "Pod cracking causes nutrient leakage and exposes roots to air.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: 0, y: 14, z: 0 },
        explodedPosition: { x: 20, y: 14, z: 20 }
    });

    parts.push({
        name: "Plant Support Net Cups",
        description: "Flexible rubberized cups with vast open matrices, permitting unimpeded root proliferation while supporting stem weight.",
        material: "Vulcanized Rubber",
        function: "Physically anchors the plants without choking the vascular cambium.",
        assemblyOrder: 7,
        connections: ["Grow Pod Matrix", "Leaf & Root Biomass System"],
        failureEffect: "Stem collapse, reducing foliar light interception.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 14, z: 0 },
        explodedPosition: { x: 30, y: 14, z: 30 }
    });

    parts.push({
        name: "Leaf & Root Biomass System",
        description: "The organic living component of the tower. Features highly efficient phyllotaxis for light absorption and deeply interlaced roots.",
        material: "Organic Tissue (Simulated)",
        function: "Transpires water, performs photosynthesis, and generates the harvestable crop yield.",
        assemblyOrder: 8,
        connections: ["Plant Support Net Cups"],
        failureEffect: "Total crop failure; zero yield.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 14, z: 0 },
        explodedPosition: { x: 40, y: 14, z: 40 }
    });

    parts.push({
        name: "Aeroponic Misting Nozzles",
        description: "Ultrasonic, steel-tipped nozzles that atomize nutrient solution into 5-micron droplets for maximum root absorption.",
        material: "Stainless Steel",
        function: "Delivers highly oxygenated nutrient fog directly to the root zone.",
        assemblyOrder: 9,
        connections: ["Grow Pod Matrix", "Hydraulic Trickle Lines"],
        failureEffect: "Nozzle clogging leading to root dehydration.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: 0, y: 14, z: 0 },
        explodedPosition: { x: 15, y: 14, z: 15 }
    });

    // ==========================================
    // 9 & 10. UV LED GROW LIGHT STRIPS
    // ==========================================
    const ledProfile = new THREE.Shape();
    ledProfile.moveTo(-0.5, 0);
    ledProfile.lineTo(0.5, 0);
    ledProfile.lineTo(0.5, 1);
    ledProfile.absarc(0, 1, 0.5, 0, Math.PI, false);
    ledProfile.lineTo(-0.5, 0);
    const ledExtrude = { depth: 36, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const ledGeo = new THREE.ExtrudeGeometry(ledProfile, ledExtrude);
    ledGeo.rotateX(Math.PI / 2); // vertical

    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const ledGroup = new THREE.Group();
        
        // Strip housing
        const housing = new THREE.Mesh(ledGeo, aluminum);
        ledGroup.add(housing);

        // Glowing element (a thinner cylinder inside)
        const glowGeo = new THREE.CylinderGeometry(0.3, 0.3, 35, 16);
        const glow = new THREE.Mesh(glowGeo, uvLedMaterial);
        glow.position.z = 0.5;
        glow.position.y = -18;
        meshes.uvLights.push(glow);
        ledGroup.add(glow);

        const dist = 8;
        ledGroup.position.set(Math.cos(angle)*dist, 30, Math.sin(angle)*dist);
        // Face inward
        ledGroup.rotation.y = -angle - Math.PI/2;
        group.add(ledGroup);
    }

    parts.push({
        name: "UV LED Grow Light Strip (Left)",
        description: "A precision-tuned photosynthetic active radiation (PAR) array. Emits specialized wavelengths to stimulate compact, vegetative growth.",
        material: "Aluminum Housing, Polycarbonate Lens, LED Core",
        function: "Supplies the photon energy required for carbohydrate synthesis in the biomass.",
        assemblyOrder: 10,
        connections: ["Vertical Support Extrusion", "Control Unit & Display"],
        failureEffect: "Etiolation (stretching) of plants and halted development.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: 8, y: 30, z: 0 },
        explodedPosition: { x: 25, y: 30, z: 0 }
    });

    parts.push({
        name: "UV LED Grow Light Strip (Right)",
        description: "Secondary photon cannon identical to the left strip, ensuring complete 360-degree canopy penetration with overlapping light cones.",
        material: "Aluminum Housing, Polycarbonate Lens, LED Core",
        function: "Maintains balanced irradiance across all grow pod sectors.",
        assemblyOrder: 11,
        connections: ["Vertical Support Extrusion", "Control Unit & Display"],
        failureEffect: "Asymmetrical phototropism, causing plants to lean and break.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: -4, y: 30, z: -6.9 },
        explodedPosition: { x: -20, y: 30, z: -25 }
    });


    // ==========================================
    // 11, 12, 13. SENSORS & CONTROL UNIT
    // ==========================================
    const controlPanelGroup = new THREE.Group();
    
    // Main Box
    const panelShape = new THREE.Shape();
    panelShape.moveTo(-2, -3);
    panelShape.lineTo(2, -3);
    panelShape.lineTo(2, 3);
    panelShape.lineTo(-2, 3);
    const panelGeo = new THREE.ExtrudeGeometry(panelShape, { depth: 1, bevelEnabled: true, bevelThickness: 0.2 });
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    controlPanelGroup.add(panelMesh);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(3, 2);
    const screenMesh = new THREE.Mesh(screenGeo, sensorDisplayMat);
    screenMesh.position.set(0, 1, 1.05);
    controlPanelGroup.add(screenMesh);

    // Dials/Knobs
    const knobGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    knobGeo.rotateX(Math.PI/2);
    const knob1 = new THREE.Mesh(knobGeo, chrome);
    knob1.position.set(-1, -1.5, 1);
    controlPanelGroup.add(knob1);
    const knob2 = new THREE.Mesh(knobGeo, chrome);
    knob2.position.set(1, -1.5, 1);
    controlPanelGroup.add(knob2);

    controlPanelGroup.position.set(0, 0, 4);
    group.add(controlPanelGroup);

    // Probes dipped into reservoir
    const probeGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const probe = new THREE.Mesh(probeGeo, copper);
    probe.position.set(3, -6, 3);
    group.add(probe);

    parts.push({
        name: "pH & EC Sensor Array",
        description: "Industrial-grade titanium-tipped probes measuring Electrical Conductivity and Hydrogen ion concentration 10 times a second.",
        material: "Copper, Titanium & Plastic",
        function: "Feeds real-time chemical state data to the primary control unit.",
        assemblyOrder: 12,
        connections: ["Base Reservoir Tank", "Control Unit & Display"],
        failureEffect: "Nutrient lockout or toxic overdosing due to unregulated chemical injection.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: 3, y: -6, z: 3 },
        explodedPosition: { x: 10, y: -6, z: 10 }
    });

    parts.push({
        name: "Control Unit & Display",
        description: "A centralized micro-PLC brain wrapped in a ruggedized dark steel casing. Features a holographic UI display.",
        material: "Dark Steel, Silicon & Glass",
        function: "Orchestrates pump timing, LED dimming cycles, and nutrient dosing algorithms.",
        assemblyOrder: 13,
        connections: ["Submersible Water Pump", "UV LED Grow Light Strip (Left)", "pH & EC Sensor Array"],
        failureEffect: "Total system paralysis.",
        cascadeFailures: ["Submersible Water Pump", "UV LED Grow Light Strip (Left)"],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 0, y: 0, z: 15 }
    });

    parts.push({
        name: "Nutrient Mixing Chamber",
        description: "An internal baffle system hidden within the reservoir, designed to induce vortex mixing of concentrated fertilizers.",
        material: "Plastic",
        function: "Ensures homogeneous distribution of A/B nutrient solutions.",
        assemblyOrder: 14,
        connections: ["Base Reservoir Tank"],
        failureEffect: "Stratification of fluid, causing chemical burns on lower roots.",
        cascadeFailures: ["Leaf & Root Biomass System"],
        originalPosition: { x: -3, y: -9, z: -3 },
        explodedPosition: { x: -15, y: -9, z: -15 }
    });


    // ==========================================
    // 14 & 15. HYDRAULIC TRICKLE LINES & WATER PARTICLES
    // ==========================================
    // We'll model the trickle lines as thin extruded tubes wrapping slightly around the column
    const lineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 31, 0),
        new THREE.Vector3(2, 20, 2),
        new THREE.Vector3(-2, 10, 2),
        new THREE.Vector3(2, 0, -2),
        new THREE.Vector3(0, -5, 0)
    ]);
    const lineGeo = new THREE.TubeGeometry(lineCurve, 64, 0.15, 8, false);
    const trickleLine1 = new THREE.Mesh(lineGeo, rubber);
    group.add(trickleLine1);

    parts.push({
        name: "Hydraulic Trickle Lines",
        description: "High-pressure, chemical-resistant elastomeric lines directing bypass flow to secondary misting arrays.",
        material: "Vulcanized Rubber",
        function: "Bypasses the main column to provide supplemental irrigation to high-demand clusters.",
        assemblyOrder: 15,
        connections: ["Distribution Manifold (Top)", "Aeroponic Misting Nozzles"],
        failureEffect: "Burst lines cause catastrophic fluid loss and electrical hazards.",
        cascadeFailures: ["Control Unit & Display"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: -15 }
    });

    // Generate water drops for animation
    const dropGeo = new THREE.IcosahedronGeometry(0.2, 1);
    for(let i=0; i<100; i++) {
        const drop = new THREE.Mesh(dropGeo, waterMaterial);
        const radius = 3 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        drop.position.set(
            Math.cos(theta) * radius,
            30 - Math.random() * 40,
            Math.sin(theta) * radius
        );
        // Store properties for falling animation
        drop.userData = {
            speed: 0.1 + Math.random() * 0.3,
            radius: radius,
            theta: theta
        };
        meshes.waterDrops.push(drop);
        group.add(drop);
    }

    const description = "A massive, hyper-realistic, vertically integrated Hydroponic and Aeroponic farming tower. It combines precision fluid dynamics, optimized photon delivery via UV LEDs, and automated micro-controller management to maximize biomass production in zero-gravity or terrestrial enclosed environments.";

    const quizQuestions = [
        {
            question: "What is the primary function of the pH & EC Sensor Array in the hydroponic tower?",
            options: [
                "To measure atmospheric pressure",
                "To regulate light intensity",
                "To measure Electrical Conductivity and Hydrogen ion concentration",
                "To control the water pump speed"
            ],
            correctAnswer: 2,
            explanation: "The pH & EC Sensor Array ensures the nutrient solution remains perfectly balanced by constantly tracking chemical state data."
        },
        {
            question: "Why does the tower utilize UV LED Grow Light Strips alongside standard lighting?",
            options: [
                "To heat the nutrient solution",
                "To provide specific photosynthetic active radiation (PAR) wavelengths",
                "To sterilize the outer plastic hull",
                "To make the tower aesthetically pleasing"
            ],
            correctAnswer: 1,
            explanation: "UV LEDs provide targeted wavelengths that stimulate complex carbohydrate synthesis, preventing etiolation."
        },
        {
            question: "Which component is directly responsible for splitting the high-pressure fluid flow equally to all sides of the tower?",
            options: [
                "Submersible Water Pump",
                "Nutrient Mixing Chamber",
                "Distribution Manifold",
                "Vertical Support Extrusion"
            ],
            correctAnswer: 2,
            explanation: "The Distribution Manifold at the very top of the tower equalizes pressure and divides the water into precise trickle streams."
        },
        {
            question: "What immediate consequence follows a failure of the Aeroponic Misting Nozzles?",
            options: [
                "The reservoir overflows",
                "Root dehydration due to lack of 5-micron atomized mist",
                "The LED lights overheat",
                "The primary pipe bursts"
            ],
            correctAnswer: 1,
            explanation: "The misting nozzles deliver highly oxygenated fog; clogging leads to rapid root dehydration."
        },
        {
            question: "What structural design allows the Plant Support Net Cups to anchor plants effectively?",
            options: [
                "Solid titanium walls",
                "A vast open rubberized matrix",
                "Magnetic levitation bands",
                "Pressurized glass enclosures"
            ],
            correctAnswer: 1,
            explanation: "The open matrix design permits unimpeded root proliferation without choking the plant stem's vascular cambium."
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Animate water drops falling
        activeMeshes.waterDrops.forEach(drop => {
            drop.position.y -= drop.userData.speed * speed * 2;
            // Add a slight spiral to the fall
            drop.userData.theta += 0.02 * speed;
            drop.position.x = Math.cos(drop.userData.theta) * drop.userData.radius;
            drop.position.z = Math.sin(drop.userData.theta) * drop.userData.radius;
            
            if(drop.position.y < -8) {
                drop.position.y = 31; // Reset to manifold height
                drop.userData.radius = 3 + Math.random() * 2;
            }
        });

        // Spin the pump impeller rapidly
        if (activeMeshes.pumpImpeller) {
            activeMeshes.pumpImpeller.rotation.y += 0.5 * speed;
        }

        // Pulse the UV LED strips
        const pulse = (Math.sin(time * 0.005) * 0.5) + 2.0;
        activeMeshes.uvLights.forEach(light => {
            light.material.emissiveIntensity = pulse;
        });

        // Simulate biological micro-movements (leaves swaying slightly towards lights)
        activeMeshes.leaves.forEach((leaf, idx) => {
            const swayX = Math.sin(time * 0.002 + idx) * 0.05;
            const swayZ = Math.cos(time * 0.0015 + idx) * 0.05;
            leaf.rotation.x = leaf.userData.baseRot.x + swayX * speed;
            leaf.rotation.z = leaf.userData.baseRot.z + swayZ * speed;
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createHydroponicTower() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
