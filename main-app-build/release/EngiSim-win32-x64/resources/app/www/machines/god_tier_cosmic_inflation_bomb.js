import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "The God Tier Cosmic Inflation Bomb. A theoretical doomsday device designed to trigger a localized false-vacuum decay, initiating a secondary Big Bang. Its monolithic casing barely contains the cosmic energies churning within. Warning runes pulse with the destabilization of spacetime itself, while massive off-road tires and an operator cabin allow this planetary-scale weapon to be transported across the wastes.";

    const quizQuestions = [
        {
            question: "In the context of cosmic inflation, what is the role of the inflaton field's potential energy?",
            options: [
                "It drives the exponential expansion of space",
                "It causes the immediate collapse of the universe",
                "It generates dark matter",
                "It counteracts the strong nuclear force"
            ],
            correctAnswer: 0
        },
        {
            question: "What is false vacuum decay?",
            options: [
                "A transition from a metastable state to a lower-energy true vacuum",
                "The evaporation of a black hole via Hawking radiation",
                "The loss of coherence in a quantum computer",
                "The expansion of space pushing galaxies apart"
            ],
            correctAnswer: 0
        },
        {
            question: "Which fluctuation spectrum is generally predicted by inflationary models?",
            options: [
                "A nearly scale-invariant spectrum of adiabatic perturbations",
                "A completely random, scale-dependent spectrum",
                "Only tensor perturbations with no scalar components",
                "A spectrum consisting solely of massive primordial black holes"
            ],
            correctAnswer: 0
        },
        {
            question: "During inflation, what happens to the apparent horizon?",
            options: [
                "The Hubble radius remains nearly constant while physical scales grow exponentially",
                "The Hubble radius shrinks to the Planck length",
                "The apparent horizon expands faster than the speed of light",
                "The apparent horizon vanishes entirely"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the 'graceful exit' problem in early models of inflation?",
            options: [
                "The difficulty of stopping inflation and thermalizing the universe (reheating) smoothly",
                "The problem of photons escaping the cosmic microwave background",
                "The inability of matter to exit black holes",
                "The rapid decay of protons over long cosmological timescales"
            ],
            correctAnswer: 0
        }
    ];

    // --- Custom Materials ---
    const glowingCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    meshes.coreMaterial = glowingCoreMat;

    const singularityMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.95
    });
    meshes.singularityMaterial = singularityMat;

    const runeMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });
    meshes.runeMaterial = runeMat;

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    const flashMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.0,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide
    });
    meshes.flashMaterial = flashMat;

    // --- Geometries & Helpers ---

    function createRuneShape(type) {
        const shape = new THREE.Shape();
        if (type === 1) {
            shape.moveTo(0, 0);
            shape.lineTo(10, 0);
            shape.lineTo(12, 10);
            shape.quadraticCurveTo(6, 15, 0, 10);
            shape.lineTo(0, 0);
            const hole = new THREE.Path();
            hole.moveTo(4, 4);
            hole.lineTo(6, 4);
            hole.lineTo(6, 6);
            hole.lineTo(4, 6);
            hole.lineTo(4, 4);
            shape.holes.push(hole);
        } else if (type === 2) {
            shape.moveTo(0, 5);
            shape.lineTo(5, 15);
            shape.lineTo(10, 5);
            shape.lineTo(7, 0);
            shape.lineTo(3, 0);
            shape.lineTo(0, 5);
        } else {
            shape.moveTo(0, 0);
            shape.lineTo(20, 0);
            shape.lineTo(20, 2);
            shape.lineTo(12, 2);
            shape.lineTo(12, 15);
            shape.lineTo(8, 15);
            shape.lineTo(8, 2);
            shape.lineTo(0, 2);
            shape.lineTo(0, 0);
        }
        return shape;
    }

    const runeExtrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };

    // ==========================================
    // 1. False Vacuum Core & Singularity
    // ==========================================
    const coreGroup = new THREE.Group();
    
    const coreGeo = new THREE.IcosahedronGeometry(40, 4);
    const coreMesh = new THREE.Mesh(coreGeo, glowingCoreMat);
    coreGroup.add(coreMesh);
    meshes.vacuumCore = coreMesh;

    const singularityGeo = new THREE.SphereGeometry(15, 64, 64);
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    coreGroup.add(singularityMesh);
    meshes.singularity = singularityMesh;

    // Complex geometric cage around the core
    const cageGeo = new THREE.OctahedronGeometry(45, 1);
    const cageMesh = new THREE.Mesh(cageGeo, chrome);
    cageMesh.material.wireframe = true;
    coreGroup.add(cageMesh);
    meshes.coreCage = cageMesh;

    coreGroup.position.set(0, 150, 0);
    group.add(coreGroup);

    parts.push({
        name: "False Vacuum Core",
        description: "The churning epicenter of the bomb, containing a destabilizing metastable false vacuum state.",
        material: "glowing neon / chrome",
        function: "Initiates cosmic inflation upon collapse.",
        assemblyOrder: 1,
        connections: ["Singularity Housing", "Core Containment Field"],
        failureEffect: "Premature cosmic expansion destroying the local galactic cluster.",
        cascadeFailures: ["Complete Spacetime Erasure"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    // ==========================================
    // 2. Monolithic Casing Top
    // ==========================================
    const casingTopGroup = new THREE.Group();
    
    const topPoints = [];
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const radius = 80 - Math.pow(t, 2) * 50;
        const height = t * 100;
        topPoints.push(new THREE.Vector2(radius, height));
    }
    const topCasingGeo = new THREE.LatheGeometry(topPoints, 128);
    const topCasingMesh = new THREE.Mesh(topCasingGeo, darkSteel);
    casingTopGroup.add(topCasingMesh);

    // Add rivets to top casing
    for(let r=0; r<64; r++) {
        const angle = (r / 64) * Math.PI * 2;
        const rivetGeo = new THREE.SphereGeometry(1.5, 8, 8);
        const rivet = new THREE.Mesh(rivetGeo, steel);
        rivet.position.set(Math.cos(angle) * 78, 5, Math.sin(angle) * 78);
        casingTopGroup.add(rivet);
    }

    // Add runes to casing top
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const rShape = createRuneShape((i % 3) + 1);
        const rGeo = new THREE.ExtrudeGeometry(rShape, runeExtrudeSettings);
        const rMesh = new THREE.Mesh(rGeo, runeMat);
        rMesh.position.set(Math.cos(angle) * 70, 40, Math.sin(angle) * 70);
        rMesh.lookAt(0, 40, 0);
        rMesh.rotation.y += Math.PI;
        casingTopGroup.add(rMesh);
    }

    casingTopGroup.position.set(0, 150, 0);
    group.add(casingTopGroup);
    meshes.casingTop = casingTopGroup;
    meshes.casingTopBaseY = 150;

    parts.push({
        name: "Monolithic Casing Top",
        description: "The upper hemisphere of the neutronium casing, etched with cosmic warning runes.",
        material: "darkSteel",
        function: "Contains the outward pressure of the expanding false vacuum before critical threshold.",
        assemblyOrder: 2,
        connections: ["False Vacuum Core", "Monolithic Casing Bottom"],
        failureEffect: "Radiation leak and local gravity collapse.",
        cascadeFailures: ["Core Destabilization"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // ==========================================
    // 3. Monolithic Casing Bottom
    // ==========================================
    const casingBottomGroup = new THREE.Group();
    
    const botPoints = [];
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const radius = 80 - Math.pow(t, 2) * 20;
        const height = -t * 80;
        botPoints.push(new THREE.Vector2(radius, height));
    }
    const botCasingGeo = new THREE.LatheGeometry(botPoints, 128);
    const botCasingMesh = new THREE.Mesh(botCasingGeo, darkSteel);
    casingBottomGroup.add(botCasingMesh);

    // Add exhaust ports to bottom casing
    for(let e=0; e<12; e++) {
        const angle = (e / 12) * Math.PI * 2;
        const exhaustGeo = new THREE.CylinderGeometry(8, 10, 20, 32);
        const exhaust = new THREE.Mesh(exhaustGeo, copper);
        exhaust.position.set(Math.cos(angle) * 65, -50, Math.sin(angle) * 65);
        exhaust.lookAt(0, -100, 0);
        casingBottomGroup.add(exhaust);
    }

    casingBottomGroup.position.set(0, 150, 0);
    group.add(casingBottomGroup);
    meshes.casingBottom = casingBottomGroup;
    meshes.casingBottomBaseY = 150;

    parts.push({
        name: "Monolithic Casing Bottom",
        description: "The lower hemisphere, housing massive exhaust manifolds for thermal venting.",
        material: "darkSteel, copper",
        function: "Vents hawking radiation during the spooling sequence.",
        assemblyOrder: 3,
        connections: ["Chassis", "Monolithic Casing Top"],
        failureEffect: "Thermal runaway melting the chassis.",
        cascadeFailures: ["Chassis Collapse", "Core Breach"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // ==========================================
    // 4, 5, 6. Stabilizer Rings A, B, C
    // ==========================================
    function createStabilizerRing(radius, thickness, colorMat) {
        const ringGrp = new THREE.Group();
        const torusGeo = new THREE.TorusGeometry(radius, thickness, 64, 128);
        const torus = new THREE.Mesh(torusGeo, colorMat);
        ringGrp.add(torus);
        
        // Add magnetic nodes on the ring
        for(let n=0; n<16; n++) {
            const angle = (n/16) * Math.PI * 2;
            const nodeGeo = new THREE.BoxGeometry(thickness*3, thickness*1.5, thickness*1.5);
            const node = new THREE.Mesh(nodeGeo, chrome);
            node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            node.rotation.z = angle;
            ringGrp.add(node);
        }
        return ringGrp;
    }

    const ringA = createStabilizerRing(110, 5, steel);
    ringA.position.set(0, 150, 0);
    group.add(ringA);
    meshes.ringA = ringA;

    const ringB = createStabilizerRing(125, 4, copper);
    ringB.position.set(0, 150, 0);
    group.add(ringB);
    meshes.ringB = ringB;

    const ringC = createStabilizerRing(140, 6, darkSteel);
    ringC.position.set(0, 150, 0);
    group.add(ringC);
    meshes.ringC = ringC;

    parts.push({
        name: "Stabilizer Ring A",
        description: "Inner gyroscopic stabilizer utilizing quantum locking.",
        material: "steel",
        function: "Maintains core alignment on the X-axis.",
        assemblyOrder: 4,
        connections: ["Magnetic Bearings", "Core Containment Field"],
        failureEffect: "Wobble introduced into the false vacuum geometry.",
        cascadeFailures: ["Ring B overload"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 150, y: 150, z: 0 }
    });
    parts.push({
        name: "Stabilizer Ring B",
        description: "Middle gyroscopic stabilizer for energetic dispersion.",
        material: "copper",
        function: "Maintains core alignment on the Y-axis.",
        assemblyOrder: 5,
        connections: ["Ring A", "Ring C"],
        failureEffect: "Inductive feedback loop.",
        cascadeFailures: ["Ring C overload"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 150 }
    });
    parts.push({
        name: "Stabilizer Ring C",
        description: "Outer heavy gyroscopic ring.",
        material: "darkSteel",
        function: "Maintains core alignment on the Z-axis.",
        assemblyOrder: 6,
        connections: ["Chassis Mounts", "Ring B"],
        failureEffect: "Catastrophic gyroscopic decoupling, tearing the machine apart.",
        cascadeFailures: ["Total structural failure"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: -150, y: 150, z: -150 }
    });

    // ==========================================
    // 7. Main Chassis / Frame
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-100, -40);
    chassisShape.lineTo(100, -40);
    chassisShape.lineTo(120, 0);
    chassisShape.lineTo(-120, 0);
    chassisShape.lineTo(-100, -40);
    
    const chassisExtrude = { depth: 250, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 40, -125);
    chassisGroup.add(chassisMesh);

    // Add grilles to front of chassis
    for(let g=0; g<20; g++) {
        const grilleGeo = new THREE.BoxGeometry(180, 2, 5);
        const grille = new THREE.Mesh(grilleGeo, steel);
        grille.position.set(0, 35 - (g * 4), 125);
        chassisGroup.add(grille);
    }

    group.add(chassisGroup);

    parts.push({
        name: "Main Chassis",
        description: "The ultra-dense depleted uranium frame supporting the doomsday apparatus.",
        material: "darkSteel, steel",
        function: "Provides structural integrity and mounting points.",
        assemblyOrder: 7,
        connections: ["Axles", "Casing Bottom", "Operator Cabin"],
        failureEffect: "Complete collapse of the apparatus.",
        cascadeFailures: ["Every system"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // ==========================================
    // 8, 9, 10, 11. Tires and Wheels
    // ==========================================
    meshes.tires = [];
    function createTire(radius, width, lugCount, posX, posY, posZ) {
        const tireGroup = new THREE.Group();
        
        // Main rubber torus
        const torusGeo = new THREE.TorusGeometry(radius, width/2, 32, 128);
        const torusMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(torusMesh);
        
        // Massive complex lug array for off-road treads
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(width * 1.3, width/3, width/3);
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Stagger lugs
            const offset = (i % 2 === 0) ? width * 0.1 : -width * 0.1;
            lug.position.set(Math.cos(angle) * (radius + width/2.2), Math.sin(angle) * (radius + width/2.2), offset);
            lug.rotation.z = angle;
            // Angle the lugs for aggressive look
            lug.rotation.y = (i % 2 === 0) ? Math.PI / 8 : -Math.PI / 8;
            tireGroup.add(lug);
        }
        
        // Inner rim cylinder
        const rimGeo = new THREE.CylinderGeometry(radius*0.7, radius*0.7, width*1.05, 64);
        const rimMesh = new THREE.Mesh(rimGeo, darkSteel);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);
        
        // Complex Spoke Arrays
        for(let i=0; i<16; i++) {
            const angle = (i/16) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(width/10, width/6, radius*0.7, 32);
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.position.set(Math.cos(angle) * radius*0.35, Math.sin(angle) * radius*0.35, 0);
            spoke.rotation.z = angle + Math.PI/2;
            tireGroup.add(spoke);
        }
        
        // Hubcap
        const hubGeo = new THREE.CylinderGeometry(radius*0.2, radius*0.25, width*1.2, 32);
        const hubMesh = new THREE.Mesh(hubGeo, chrome);
        hubMesh.rotation.x = Math.PI / 2;
        tireGroup.add(hubMesh);

        // Axle connector
        const axleGeo = new THREE.CylinderGeometry(radius*0.1, radius*0.1, width*2, 16);
        const axleMesh = new THREE.Mesh(axleGeo, steel);
        axleMesh.rotation.x = Math.PI / 2;
        axleMesh.position.z = (posZ > 0) ? -width : width;
        tireGroup.add(axleMesh);

        tireGroup.position.set(posX, posY, posZ);
        // Correct default orientation so tires roll along Z axis
        tireGroup.rotation.y = Math.PI / 2;
        return tireGroup;
    }

    const tRadius = 35;
    const tWidth = 30;
    const tireFL = createTire(tRadius, tWidth, 60, -140, tRadius, 90);
    const tireFR = createTire(tRadius, tWidth, 60, 140, tRadius, 90);
    const tireRL = createTire(tRadius, tWidth, 60, -140, tRadius, -90);
    const tireRR = createTire(tRadius, tWidth, 60, 140, tRadius, -90);

    group.add(tireFL, tireFR, tireRL, tireRR);
    meshes.tires.push(tireFL, tireFR, tireRL, tireRR);

    parts.push({
        name: "Omni-Terrain Tread Modules",
        description: "Massive rubber and steel reinforced wheels with aggressive extrusions for traversing ruined planetary surfaces.",
        material: "rubber, chrome, darkSteel",
        function: "Locomotion of the massive weapon platform.",
        assemblyOrder: 8,
        connections: ["Axles", "Chassis"],
        failureEffect: "Immobilization in a hostile environment.",
        cascadeFailures: ["Targeting Failure"],
        originalPosition: { x: 140, y: 35, z: 90 },
        explodedPosition: { x: 300, y: 35, z: 200 }
    });

    // ==========================================
    // 12. Operator Cabin
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Main cabin box
    const cabGeo = new THREE.BoxGeometry(80, 70, 70);
    const cabMesh = new THREE.Mesh(cabGeo, steel);
    cabinGroup.add(cabMesh);
    
    // Front window (Tinted glass)
    const windowGeo = new THREE.PlaneGeometry(76, 30);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 10, 35.1);
    cabinGroup.add(windowMesh);

    // Control panels (inside, glowing screens)
    const panelGeo = new THREE.BoxGeometry(70, 20, 10);
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    panelMesh.position.set(0, -15, 30);
    panelMesh.rotation.x = -Math.PI / 6;
    cabinGroup.add(panelMesh);

    // Screens on panel
    for(let s=0; s<4; s++) {
        const scrnGeo = new THREE.PlaneGeometry(12, 10);
        const scrnMesh = new THREE.Mesh(scrnGeo, screenMat);
        scrnMesh.position.set(-25 + (s*16.5), -12, 35);
        scrnMesh.rotation.x = -Math.PI / 6;
        cabinGroup.add(scrnMesh);
    }

    // Steering Wheel inside cabin
    const steerGeo = new THREE.TorusGeometry(8, 1, 16, 32);
    const steerMesh = new THREE.Mesh(steerGeo, plastic);
    steerMesh.position.set(-15, -5, 25);
    steerMesh.rotation.x = -Math.PI / 4;
    cabinGroup.add(steerMesh);

    // Joysticks
    const joyBaseGeo = new THREE.CylinderGeometry(2, 3, 4, 16);
    const joyStickGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    
    const joystick1 = new THREE.Group();
    const j1Base = new THREE.Mesh(joyBaseGeo, plastic);
    const j1Stick = new THREE.Mesh(joyStickGeo, chrome);
    j1Stick.position.y = 5;
    joystick1.add(j1Base, j1Stick);
    joystick1.position.set(15, -10, 25);
    joystick1.rotation.x = -Math.PI / 8;
    cabinGroup.add(joystick1);

    const joystick2 = joystick1.clone();
    joystick2.position.set(25, -10, 25);
    cabinGroup.add(joystick2);
    
    // Side Mirrors
    const mirrorBracketGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const mirrorBoxGeo = new THREE.BoxGeometry(4, 12, 2);
    
    const leftMirror = new THREE.Group();
    const lBracket = new THREE.Mesh(mirrorBracketGeo, chrome);
    lBracket.rotation.z = Math.PI / 2;
    lBracket.position.x = -45;
    const lBox = new THREE.Mesh(mirrorBoxGeo, chrome);
    lBox.position.set(-50, 0, 0);
    leftMirror.add(lBracket, lBox);
    leftMirror.position.set(0, 10, 25);
    cabinGroup.add(leftMirror);

    const rightMirror = leftMirror.clone();
    rightMirror.scale.x = -1;
    cabinGroup.add(rightMirror);

    // Ladder up to cabin
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(1, 1, 80, 16);
    const railL = new THREE.Mesh(railGeo, steel);
    railL.position.x = -10;
    const railR = new THREE.Mesh(railGeo, steel);
    railR.position.x = 10;
    ladderGroup.add(railL, railR);
    for(let r=0; r<10; r++) {
        const rungGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
        const rung = new THREE.Mesh(rungGeo, chrome);
        rung.position.y = -35 + (r*7.5);
        rung.rotation.z = Math.PI / 2;
        ladderGroup.add(rung);
    }
    ladderGroup.position.set(-45, -40, 0);
    cabinGroup.add(ladderGroup);

    cabinGroup.position.set(0, 100, 160);
    group.add(cabinGroup);

    parts.push({
        name: "Operator Cabin",
        description: "Heavily shielded observation and control deck. Tinted glass protects the operator from blinding cosmic flashes.",
        material: "steel, tinted glass",
        function: "Manual override and navigation",
        assemblyOrder: 9,
        connections: ["Chassis", "Control Interfaces"],
        failureEffect: "Operator incineration, loss of manual control.",
        cascadeFailures: ["Navigation Failure", "Premature Detonation"],
        originalPosition: { x: 0, y: 100, z: 160 },
        explodedPosition: { x: 0, y: 200, z: 300 }
    });

    // ==========================================
    // 13. Hydraulic Piston Arrays
    // ==========================================
    const pistonGroup = new THREE.Group();
    meshes.pistons = [];

    function createPiston() {
        const pGrp = new THREE.Group();
        const outerGeo = new THREE.CylinderGeometry(4, 4, 40, 32);
        const outer = new THREE.Mesh(outerGeo, darkSteel);
        outer.position.y = 20;
        
        const innerGeo = new THREE.CylinderGeometry(2.5, 2.5, 40, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = 40; // extended out
        
        const jointGeo = new THREE.SphereGeometry(6, 32, 32);
        const joint = new THREE.Mesh(jointGeo, steel);
        joint.position.y = 60;
        
        pGrp.add(outer, inner, joint);
        return pGrp;
    }

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const p = createPiston();
        p.position.set(Math.cos(angle) * 90, 50, Math.sin(angle) * 90);
        // Angle pistons inwards towards casing
        p.lookAt(0, 150, 0);
        p.rotateX(Math.PI / 2);
        pistonGroup.add(p);
        meshes.pistons.push(p);
    }

    group.add(pistonGroup);

    parts.push({
        name: "Hydraulic Piston Array",
        description: "Massive fluid-driven rams designed to manually pry open the neutronium casing during the final sequence.",
        material: "darkSteel, chrome",
        function: "Actuates casing separation.",
        assemblyOrder: 10,
        connections: ["Chassis", "Casing Top", "Casing Bottom"],
        failureEffect: "Casing fails to separate, causing an internal implosion.",
        cascadeFailures: ["Misfire", "Implosion"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 200 }
    });

    // ==========================================
    // 14. Articulated Boom Arm (Singularity Handler)
    // ==========================================
    const boomGroup = new THREE.Group();
    
    // Base mount
    const bBaseGeo = new THREE.CylinderGeometry(15, 20, 10, 32);
    const bBase = new THREE.Mesh(bBaseGeo, steel);
    bBase.position.y = 5;
    boomGroup.add(bBase);

    // Boom arm segment 1
    const arm1Geo = new THREE.BoxGeometry(10, 80, 10);
    const arm1 = new THREE.Mesh(arm1Geo, darkSteel);
    arm1.position.y = 40;
    
    // Pivot joint
    const pivotGeo = new THREE.CylinderGeometry(8, 8, 12, 32);
    const pivot = new THREE.Mesh(pivotGeo, chrome);
    pivot.rotation.x = Math.PI / 2;
    pivot.position.y = 80;

    // Boom arm segment 2
    const arm2Geo = new THREE.BoxGeometry(8, 60, 8);
    const arm2 = new THREE.Mesh(arm2Geo, steel);
    arm2.position.y = 110;
    
    // Claw hand
    const clawBaseGeo = new THREE.BoxGeometry(15, 5, 15);
    const clawBase = new THREE.Mesh(clawBaseGeo, copper);
    clawBase.position.y = 140;

    const clawFingerGeo = new THREE.BoxGeometry(2, 20, 2);
    const clawF1 = new THREE.Mesh(clawFingerGeo, steel);
    clawF1.position.set(-6, 150, 6);
    clawF1.rotation.x = -Math.PI / 8;
    const clawF2 = new THREE.Mesh(clawFingerGeo, steel);
    clawF2.position.set(6, 150, -6);
    clawF2.rotation.x = Math.PI / 8;
    
    boomGroup.add(arm1, pivot, arm2, clawBase, clawF1, clawF2);
    
    // Position on rear of chassis
    boomGroup.position.set(0, 40, -100);
    group.add(boomGroup);
    meshes.boomArm1 = arm1;
    meshes.boomArm2 = arm2;
    meshes.boomPivot = pivot;
    meshes.boomArmGroup = boomGroup;

    parts.push({
        name: "Articulated Boom Arm",
        description: "Heavy crane used for calibrating and inserting the Singularity Housing.",
        material: "darkSteel, chrome, copper",
        function: "Precision manipulation of highly dangerous cosmic masses.",
        assemblyOrder: 11,
        connections: ["Chassis Rear"],
        failureEffect: "Singularity drops onto the chassis, instantly consuming the machine.",
        cascadeFailures: ["Black Hole Formation"],
        originalPosition: { x: 0, y: 40, z: -100 },
        explodedPosition: { x: 0, y: 150, z: -300 }
    });

    // ==========================================
    // 15. Energy Conduits & Tubes
    // ==========================================
    const conduitGroup = new THREE.Group();
    
    // We will generate multiple complex sweeping tubes wrapping around the base of the core
    for (let i = 0; i < 5; i++) {
        const offsetAngle = (i / 5) * Math.PI * 2;
        const curvePoints = [
            new THREE.Vector3(Math.cos(offsetAngle)*50, 40, Math.sin(offsetAngle)*50),
            new THREE.Vector3(Math.cos(offsetAngle + 1)*70, 80, Math.sin(offsetAngle + 1)*70),
            new THREE.Vector3(Math.cos(offsetAngle + 2)*80, 120, Math.sin(offsetAngle + 2)*80),
            new THREE.Vector3(Math.cos(offsetAngle + 3)*60, 140, Math.sin(offsetAngle + 3)*60)
        ];
        const lineCurve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(lineCurve, 64, 3, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        conduitGroup.add(tubeMesh);
    }

    // Add glowing plasma conduits
    for (let i = 0; i < 3; i++) {
        const offsetAngle = (i / 3) * Math.PI * 2;
        const curvePoints = [
            new THREE.Vector3(Math.cos(offsetAngle)*30, 40, Math.sin(offsetAngle)*30),
            new THREE.Vector3(Math.cos(offsetAngle - 1)*90, 100, Math.sin(offsetAngle - 1)*90),
            new THREE.Vector3(Math.cos(offsetAngle - 2)*50, 160, Math.sin(offsetAngle - 2)*50)
        ];
        const lineCurve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(lineCurve, 64, 1.5, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, glowingCoreMat);
        conduitGroup.add(tubeMesh);
    }

    group.add(conduitGroup);

    parts.push({
        name: "Plasma & Energy Conduits",
        description: "Thick winding tubes transferring exotic matter and cooling plasma to the core.",
        material: "copper, glowing neon",
        function: "Fuel injection and thermal regulation.",
        assemblyOrder: 12,
        connections: ["Chassis", "Core Cage", "Casing"],
        failureEffect: "Exotic matter leak.",
        cascadeFailures: ["Transdimensional Rift"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 200, y: 80, z: 200 }
    });

    // ==========================================
    // 16. Antimatter Injectors
    // ==========================================
    const injectorGroup = new THREE.Group();
    meshes.injectors = [];

    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        const injBase = new THREE.Group();
        
        const cyl1Geo = new THREE.CylinderGeometry(8, 8, 30, 32);
        const cyl1 = new THREE.Mesh(cyl1Geo, aluminum);
        
        const cyl2Geo = new THREE.CylinderGeometry(10, 10, 10, 32);
        const cyl2 = new THREE.Mesh(cyl2Geo, darkSteel);
        cyl2.position.y = 15;
        
        const glassGeo = new THREE.CylinderGeometry(7.5, 7.5, 20, 32);
        const glassMesh = new THREE.Mesh(glassGeo, glass);
        glassMesh.position.y = 5;
        
        // inner glowing core
        const amGeo = new THREE.CylinderGeometry(2, 2, 18, 16);
        const amMesh = new THREE.Mesh(amGeo, glowingCoreMat);
        amMesh.position.y = 5;
        
        injBase.add(cyl1, cyl2, glassMesh, amMesh);
        
        injBase.position.set(Math.cos(angle) * 110, 100, Math.sin(angle) * 110);
        injBase.rotation.x = Math.PI / 4;
        injBase.rotation.y = -angle;

        injectorGroup.add(injBase);
        meshes.injectors.push(amMesh); // store just the glowing part for pulsing
    }

    group.add(injectorGroup);

    parts.push({
        name: "Antimatter Injector Modules",
        description: "Glass-shielded cylinders violently mixing antimatter to sustain the false vacuum boundary.",
        material: "aluminum, darkSteel, glass, glowing neon",
        function: "Catalyst injection.",
        assemblyOrder: 13,
        connections: ["Casing Top", "Conduits"],
        failureEffect: "Antimatter containment failure.",
        cascadeFailures: ["Instant Vaporization"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: -250, y: 150, z: -250 }
    });

    // ==========================================
    // 17. Graviton Projectors (Poles)
    // ==========================================
    const gravitonPoints = [];
    gravitonPoints.push(new THREE.Vector2(0, 0));
    gravitonPoints.push(new THREE.Vector2(15, 0));
    gravitonPoints.push(new THREE.Vector2(15, 5));
    gravitonPoints.push(new THREE.Vector2(10, 10));
    gravitonPoints.push(new THREE.Vector2(20, 20));
    gravitonPoints.push(new THREE.Vector2(20, 25));
    gravitonPoints.push(new THREE.Vector2(12, 35));
    gravitonPoints.push(new THREE.Vector2(12, 40));
    gravitonPoints.push(new THREE.Vector2(25, 50));
    gravitonPoints.push(new THREE.Vector2(25, 55));
    gravitonPoints.push(new THREE.Vector2(5, 70));
    gravitonPoints.push(new THREE.Vector2(0, 70));

    const gravitonGeo = new THREE.LatheGeometry(gravitonPoints, 64);
    
    // Top Projector
    const gProjTop = new THREE.Mesh(gravitonGeo, chrome);
    gProjTop.position.set(0, 250, 0);
    group.add(gProjTop);

    // Bottom Projector
    const gProjBot = new THREE.Mesh(gravitonGeo, chrome);
    gProjBot.position.set(0, 50, 0);
    gProjBot.rotation.x = Math.PI;
    group.add(gProjBot);
    
    meshes.gProjTop = gProjTop;
    meshes.gProjBot = gProjBot;

    parts.push({
        name: "Polar Graviton Projectors",
        description: "Intricate conical lathe structures projecting intense gravitational waves to shape the explosion.",
        material: "chrome",
        function: "Directs the Big Bang into a planar shockwave to avoid collateral omnidirectional damage.",
        assemblyOrder: 14,
        connections: ["Casing Poles"],
        failureEffect: "Spherical explosion destroying the launch platform.",
        cascadeFailures: ["Omnidirectional Annihilation"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: 0, y: 450, z: 0 }
    });

    // ==========================================
    // 18. Blinding Flash Plane
    // ==========================================
    // A massive sphere that scales up to create the "blinding flash" effect
    const flashSphereGeo = new THREE.SphereGeometry(300, 64, 64);
    const flashMeshObj = new THREE.Mesh(flashSphereGeo, flashMat);
    flashMeshObj.position.set(0, 150, 0);
    group.add(flashMeshObj);
    meshes.flashPlane = flashMeshObj;

    // ==========================================
    // Extreme Animation Logic
    // ==========================================
    const animate = (time, speed, m = meshes) => {
        // 10 second loop
        const cycleLength = 10.0;
        const speedMultiplier = speed * 1.5;
        const cycle = (time * speedMultiplier) % cycleLength;
        const isFlashing = cycle > 9.5;
        const normalizedCycle = cycle / 9.5; // 0 to 1 before flash

        // 1. Casing slowly breaking apart
        const expansion = Math.pow(normalizedCycle, 4) * 60; // Exponential expansion
        if (!isFlashing) {
            m.casingTop.position.y = m.casingTopBaseY + expansion;
            m.casingBottom.position.y = m.casingBottomBaseY - expansion;
        } else {
            m.casingTop.position.y = m.casingTopBaseY;
            m.casingBottom.position.y = m.casingBottomBaseY;
        }

        // 2. Core glowing brighter and destabilizing (jitter)
        const intensity = 5.0 + (Math.pow(normalizedCycle, 3) * 50.0);
        m.coreMaterial.emissiveIntensity = isFlashing ? 200.0 : intensity;
        
        if (!isFlashing) {
            const jitterScale = 1.0 + (Math.random() * 0.1 * normalizedCycle);
            m.vacuumCore.scale.set(jitterScale, jitterScale, jitterScale);
            m.singularity.rotation.x += 0.2 * speedMultiplier;
            m.singularity.rotation.y += 0.3 * speedMultiplier;
        } else {
            m.vacuumCore.scale.set(1, 1, 1);
        }

        // 3. Boom arms sine wave articulation
        const boomAngle = Math.sin(time * speedMultiplier) * Math.PI / 8;
        m.boomArm1.rotation.z = boomAngle;
        m.boomArm2.rotation.z = -boomAngle * 1.5;
        
        // 4. Wheels rolling based on time
        const wheelRot = time * speedMultiplier * 2.0;
        m.tires.forEach(tire => {
            tire.rotation.x = wheelRot;
        });

        // 5. Rings spinning on different axes, speeding up over cycle
        const ringSpeed = 1.0 + (normalizedCycle * 10.0);
        m.ringA.rotation.x += 0.02 * ringSpeed * speedMultiplier;
        m.ringA.rotation.y += 0.01 * ringSpeed * speedMultiplier;

        m.ringB.rotation.y -= 0.03 * ringSpeed * speedMultiplier;
        m.ringB.rotation.z += 0.01 * ringSpeed * speedMultiplier;

        m.ringC.rotation.z += 0.04 * ringSpeed * speedMultiplier;
        m.ringC.rotation.x -= 0.01 * ringSpeed * speedMultiplier;

        // 6. Hydraulic pistons moving perfectly in sync with casing expansion
        m.pistons.forEach((piston, idx) => {
            // The inner cylinder of the piston is child at index 1
            const innerCyl = piston.children[1];
            // Move it upwards relative to the piston group
            innerCyl.position.y = 40 + (expansion * 0.8);
            
            // The joint at index 2
            const joint = piston.children[2];
            joint.position.y = 60 + (expansion * 0.8);
        });

        // 7. Pulse neon lights on antimatter injectors
        m.injectors.forEach((inj, idx) => {
            const pulse = (Math.sin(time * speedMultiplier * 10 + idx) + 1) / 2;
            inj.material.emissiveIntensity = 2.0 + (pulse * 5.0) + (normalizedCycle * 10);
        });

        // 8. Warning Runes glowing intensity
        m.runeMaterial.emissiveIntensity = 2.0 + (Math.sin(time * speedMultiplier * 5) * normalizedCycle * 10.0);

        // 9. Blinding flash resets the animation
        if (isFlashing) {
            m.flashMaterial.opacity = 1.0;
            m.flashPlane.scale.setScalar(1.0 + ((cycle - 9.5) * 20.0)); // Rapidly expand flash sphere
        } else {
            // fade out flash
            m.flashMaterial.opacity = Math.max(0, m.flashMaterial.opacity - 0.05);
            m.flashPlane.scale.setScalar(1.0);
        }
        
        // Spin graviton projectors rapidly
        m.gProjTop.rotation.y += 0.1 * ringSpeed * speedMultiplier;
        m.gProjBot.rotation.y -= 0.1 * ringSpeed * speedMultiplier;
    };

    return { group, parts, description, quizQuestions, animate };
}
