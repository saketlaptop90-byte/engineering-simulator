import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper: Tube for hydraulics/wires
    function createTube(points, radius, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 32, radius, 8, false);
        return new THREE.Mesh(geo, material);
    }

    // Helper: Auger flighting (simplified as an angled tube wrapped around)
    function createFlighting(radius, length, pitch, material, rightHand = true) {
        const points = [];
        const segments = 100;
        const turns = length / pitch;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * turns * Math.PI * 2 * (rightHand ? 1 : -1);
            const x = t * length;
            const y = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            points.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, segments, radius * 0.3, 4, false);
        const mesh = new THREE.Mesh(geo, material);
        mesh.scale.set(1, 0.1, 1); // Flatten it into a blade
        return mesh;
    }

    const rowCount = 12;
    const rowSpacing = 1.0;
    const headerWidth = rowCount * rowSpacing;
    const startX = -headerWidth / 2 + rowSpacing / 2;

    // ==========================================
    // 1. Massive Main Frame
    // ==========================================
    const frameGroup = new THREE.Group();
    const mainBeamGeo = new THREE.BoxGeometry(headerWidth + 1.5, 0.6, 0.6);
    const mainBeam = new THREE.Mesh(mainBeamGeo, darkSteel);
    mainBeam.position.set(0, 0.3, -1);
    frameGroup.add(mainBeam);
    
    const topBeamGeo = new THREE.BoxGeometry(headerWidth + 1.5, 0.3, 0.3);
    const topBeam = new THREE.Mesh(topBeamGeo, darkSteel);
    topBeam.position.set(0, 1.2, -1.2);
    frameGroup.add(topBeam);
    
    for(let i=0; i<=rowCount; i++) {
        const supGeo = new THREE.BoxGeometry(0.1, 1.0, 0.3);
        const sup = new THREE.Mesh(supGeo, steel);
        sup.position.set(startX - rowSpacing/2 + i*rowSpacing, 0.75, -1.1);
        frameGroup.add(sup);
    }
    
    group.add(frameGroup);
    parts.push({
        name: "High-Tensile Main Frame",
        description: "Massive heavy-duty steel frame forming the structural backbone of the 12-row header.",
        material: "Dark Steel",
        function: "Supports all row units, transverse auger, and power transmission systems.",
        assemblyOrder: 1,
        connections: ["Feeder House Adapter", "Row Units"],
        failureEffect: "Structural failure causing catastrophic harvest stoppage.",
        cascadeFailures: ["Auger binding", "Driveline snapping"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -5 }
    });

    // ==========================================
    // 2. Transverse Auger Core
    // ==========================================
    const augerGroup = new THREE.Group();
    const augerRadius = 0.4;
    const augerLength = headerWidth;
    const augerTubeGeo = new THREE.CylinderGeometry(augerRadius, augerRadius, augerLength, 32);
    const augerTube = new THREE.Mesh(augerTubeGeo, steel);
    augerTube.rotation.z = Math.PI / 2;
    augerGroup.add(augerTube);

    parts.push({
        name: "Transverse Auger Core Tube",
        description: "Thick-walled steel tube serving as the rotating base for the auger flighting.",
        material: "Steel",
        function: "Provides rigidity to the auger and houses the retractable finger eccentric shaft.",
        assemblyOrder: 2,
        connections: ["Main Frame", "Flighting"],
        failureEffect: "Tube bending resulting in violent vibration.",
        cascadeFailures: ["Bearing destruction", "Floor pan wear"],
        originalPosition: { x: 0, y: 0.6, z: -0.2 },
        explodedPosition: { x: 0, y: 4, z: -2 }
    });

    // ==========================================
    // 3 & 4. Auger Flighting (Left & Right)
    // ==========================================
    const flightL = createFlighting(augerRadius + 0.25, augerLength / 2 - 0.5, 0.6, chrome, true);
    flightL.position.set(-augerLength / 2, 0, 0);
    augerGroup.add(flightL);

    parts.push({
        name: "Left-Hand Auger Flighting",
        description: "Deep spiral hardened steel blades.",
        material: "Chrome Steel",
        function: "Aggressively conveys cut crop from the left side toward the center.",
        assemblyOrder: 3,
        connections: ["Auger Core Tube"],
        failureEffect: "Crop plugging on the left side.",
        cascadeFailures: ["Uneven feeding", "Rotor slugging"],
        originalPosition: { x: -augerLength / 2, y: 0.6, z: -0.2 },
        explodedPosition: { x: -5, y: 4, z: 0 }
    });

    const flightR = createFlighting(augerRadius + 0.25, augerLength / 2 - 0.5, 0.6, chrome, false);
    flightR.position.set(0.5, 0, 0);
    augerGroup.add(flightR);

    parts.push({
        name: "Right-Hand Auger Flighting",
        description: "Deep spiral hardened steel blades mirroring the left side.",
        material: "Chrome Steel",
        function: "Aggressively conveys cut crop from the right side toward the center.",
        assemblyOrder: 4,
        connections: ["Auger Core Tube"],
        failureEffect: "Crop plugging on the right side.",
        cascadeFailures: ["Uneven feeding", "Rotor slugging"],
        originalPosition: { x: 0.5, y: 0.6, z: -0.2 },
        explodedPosition: { x: 5, y: 4, z: 0 }
    });

    // ==========================================
    // 5. Retractable Auger Fingers
    // ==========================================
    const fingers = [];
    for(let i=0; i<16; i++) {
        const fingerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const finger = new THREE.Mesh(fingerGeo, chrome);
        const ang = (i / 16) * Math.PI * 2;
        const xPos = -0.4 + (i%4)*0.2;
        finger.position.set(xPos, Math.sin(ang)*augerRadius, Math.cos(ang)*augerRadius);
        finger.rotation.x = ang;
        augerGroup.add(finger);
        fingers.push({ mesh: finger, angleBase: ang });
    }

    augerGroup.position.set(0, 0.6, -0.2);
    group.add(augerGroup);
    meshes.auger = augerGroup;
    meshes.fingers = fingers;

    parts.push({
        name: "Retractable Feeding Fingers",
        description: "Hardened steel fingers mounted on an internal eccentric cam shaft.",
        material: "Chrome",
        function: "Extends to grab crop at the center and retracts to release it smoothly into the feeder house.",
        assemblyOrder: 5,
        connections: ["Auger Core Tube"],
        failureEffect: "Crop builds up in the center and back-feeds.",
        cascadeFailures: ["Plugging the entire header"],
        originalPosition: { x: 0, y: 0.6, z: -0.2 },
        explodedPosition: { x: 0, y: 5, z: 2 }
    });

    // ==========================================
    // ROW UNITS LOOP (Generates parts 6-12 implicitly via arrays, 
    // but we will list them individually in the metadata for realism)
    // ==========================================
    meshes.stalkRolls = [];
    meshes.gatheringChains = [];
    meshes.choppers = [];
    
    for (let r = 0; r < rowCount; r++) {
        const xPos = startX + r * rowSpacing;
        const rowGroup = new THREE.Group();
        rowGroup.position.set(xPos, 0, 0.5);

        // Gearbox
        const gearboxGeo = new THREE.BoxGeometry(0.3, 0.3, 0.4);
        const gearbox = new THREE.Mesh(gearboxGeo, darkSteel);
        gearbox.position.set(0, 0.2, -0.5);
        rowGroup.add(gearbox);

        // Stalk Rolls (Pair per row)
        const rollRadius = 0.05;
        const rollLength = 1.2;
        const rollGeo = new THREE.CylinderGeometry(rollRadius, rollRadius, rollLength, 16);
        const fluteGeo = new THREE.BoxGeometry(0.02, rollLength, 0.02);
        
        const leftRollGroup = new THREE.Group();
        const leftRoll = new THREE.Mesh(rollGeo, steel);
        leftRollGroup.add(leftRoll);
        for(let f=0; f<6; f++){
            const flute = new THREE.Mesh(fluteGeo, chrome);
            const ang = (f/6)*Math.PI*2;
            flute.position.set(Math.cos(ang)*rollRadius, 0, Math.sin(ang)*rollRadius);
            leftRollGroup.add(flute);
        }
        leftRollGroup.rotation.x = Math.PI / 2;
        leftRollGroup.position.set(-0.06, 0.3, 0);
        rowGroup.add(leftRollGroup);
        
        const rightRollGroup = leftRollGroup.clone();
        rightRollGroup.position.set(0.06, 0.3, 0);
        rowGroup.add(rightRollGroup);
        
        meshes.stalkRolls.push({ left: leftRollGroup, right: rightRollGroup });

        // Deck Plates
        const deckPlateGeo = new THREE.BoxGeometry(0.12, 0.02, 1.3);
        const leftDeck = new THREE.Mesh(deckPlateGeo, steel);
        leftDeck.position.set(-0.08, 0.35, 0);
        rowGroup.add(leftDeck);
        const rightDeck = new THREE.Mesh(deckPlateGeo, steel);
        rightDeck.position.set(0.08, 0.35, 0);
        rowGroup.add(rightDeck);

        // Gathering Chains with Lugs
        const chainGeo = new THREE.BoxGeometry(0.05, 0.02, 1.3);
        const leftChain = new THREE.Mesh(chainGeo, darkSteel);
        leftChain.position.set(-0.15, 0.38, 0);
        rowGroup.add(leftChain);
        
        const rightChain = new THREE.Mesh(chainGeo, darkSteel);
        rightChain.position.set(0.15, 0.38, 0);
        rowGroup.add(rightChain);
        
        const lugGroup = new THREE.Group();
        for(let l=0; l<8; l++) {
            const lugGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
            const lug1 = new THREE.Mesh(lugGeo, steel);
            lug1.position.set(-0.1, 0.4, -0.6 + l*0.17);
            lugGroup.add(lug1);
            
            const lug2 = new THREE.Mesh(lugGeo, steel);
            lug2.position.set(0.1, 0.4, -0.6 + l*0.17);
            lugGroup.add(lug2);
        }
        rowGroup.add(lugGroup);
        meshes.gatheringChains.push(lugGroup);

        // Rotary Chopper (Underneath)
        const chopperGroup = new THREE.Group();
        const chopperHubGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
        const chopperHub = new THREE.Mesh(chopperHubGeo, steel);
        chopperGroup.add(chopperHub);
        
        const bladeGeo = new THREE.BoxGeometry(0.4, 0.01, 0.05);
        const blade1 = new THREE.Mesh(bladeGeo, chrome);
        chopperGroup.add(blade1);
        const blade2 = new THREE.Mesh(bladeGeo, chrome);
        blade2.rotation.y = Math.PI / 2;
        chopperGroup.add(blade2);
        
        chopperGroup.position.set(0, 0.1, 0.2);
        rowGroup.add(chopperGroup);
        meshes.choppers.push(chopperGroup);
        
        group.add(rowGroup);
    }

    // Adding metadata for the row unit components
    parts.push({
        name: "Row Unit Gearboxes",
        description: "Heavy cast-iron enclosed gear drives powering the chains, rolls, and choppers.",
        material: "Dark Steel / Cast Iron",
        function: "Power distribution per row.",
        assemblyOrder: 6,
        connections: ["Main PTO Driveline"],
        failureEffect: "Complete failure of one row.",
        cascadeFailures: ["Slipping clutch", "Missed corn rows"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    parts.push({
        name: "Fluted Stalk Rolls",
        description: "Counter-rotating cylinders with aggressive fluting.",
        material: "Steel / Chrome",
        function: "Pulls stalks downward violently to snap ears against the deck plates.",
        assemblyOrder: 7,
        connections: ["Gearbox"],
        failureEffect: "Stalks are not pulled down, causing ears to not be stripped.",
        cascadeFailures: ["Plugging the gathering chains"],
        originalPosition: { x: 0, y: 0.3, z: 0.5 },
        explodedPosition: { x: 0, y: -1, z: 3 }
    });

    parts.push({
        name: "Hydraulic Deck Plates",
        description: "Adjustable steel plates that narrow the gap where stalks are pulled.",
        material: "Steel",
        function: "Acts as the stripping edge to snap ears off the stalk. Gap adjusts for stalk thickness.",
        assemblyOrder: 8,
        connections: ["Row Unit Frame", "Hydraulic Cylinders"],
        failureEffect: "Ears slip through and are lost, or stalks wedge and plug.",
        cascadeFailures: ["Yield loss", "Massive plugging"],
        originalPosition: { x: 0, y: 0.35, z: 0.5 },
        explodedPosition: { x: 0, y: 1.5, z: 2 }
    });

    parts.push({
        name: "Gathering Chains with Lugs",
        description: "High-strength roller chains equipped with aggressive sweeping fingers.",
        material: "Dark Steel",
        function: "Sweeps cut ears and loose crop backward into the transverse auger.",
        assemblyOrder: 9,
        connections: ["Sprockets", "Gearbox"],
        failureEffect: "Ears pile up on the deck plates and fall forward.",
        cascadeFailures: ["Crop loss"],
        originalPosition: { x: 0, y: 0.38, z: 0.5 },
        explodedPosition: { x: 0, y: 2, z: 4 }
    });

    parts.push({
        name: "Rotary Stalk Choppers",
        description: "Extremely high-speed under-row spinning blades.",
        material: "Hardened Chrome Steel",
        function: "Pulverizes stalks into fine residue as they pass through the rolls.",
        assemblyOrder: 10,
        connections: ["Gearbox"],
        failureEffect: "Stalks remain whole, causing difficult planting next season.",
        cascadeFailures: ["Gearbox bearing failure from imbalance"],
        originalPosition: { x: 0, y: 0.1, z: 0.7 },
        explodedPosition: { x: 0, y: -3, z: 2 }
    });

    // ==========================================
    // 13. Poly Snouts (Dividers)
    // ==========================================
    for (let r = 0; r <= rowCount; r++) {
        const xPos = startX - rowSpacing/2 + r * rowSpacing;
        const snoutGroup = new THREE.Group();
        
        const snoutShape = new THREE.Shape();
        snoutShape.moveTo(0, 0);
        snoutShape.lineTo(0.2, -1.8);
        snoutShape.lineTo(0, -2.0);
        snoutShape.lineTo(-0.2, -1.8);
        snoutShape.lineTo(0, 0);
        
        const extrudeSet = { depth: 0.3, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.1 };
        const snoutGeo = new THREE.ExtrudeGeometry(snoutShape, extrudeSet);
        const snoutMesh = new THREE.Mesh(snoutGeo, plastic); // Bright yellow/green plastic usually
        
        snoutMesh.rotation.x = Math.PI / 2;
        snoutMesh.rotation.y = Math.PI; // Point forward
        snoutMesh.position.set(0, 0.5, 1.8);
        
        const hingeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
        const hinge = new THREE.Mesh(hingeGeo, darkSteel);
        hinge.rotation.z = Math.PI / 2;
        hinge.position.set(0, 0.45, 0.2);
        
        snoutGroup.add(snoutMesh);
        snoutGroup.add(hinge);
        snoutGroup.position.set(xPos, 0, 0);
        snoutGroup.rotation.x = 0.1;
        
        group.add(snoutGroup);
    }

    parts.push({
        name: "Pointed Poly Snouts",
        description: "Impact-resistant polymer dividers that gently lift downed corn and guide stalks into the row units.",
        material: "High-Density Polyethylene (Plastic)",
        function: "Crop dividing and lifting.",
        assemblyOrder: 11,
        connections: ["Row Units", "Hinge Pins"],
        failureEffect: "Trampled crops, feeding inefficiencies.",
        cascadeFailures: ["Snout cracking", "Gathering chain exposure"],
        originalPosition: { x: 0, y: 0.5, z: 1.8 },
        explodedPosition: { x: 0, y: 4, z: 7 }
    });

    // ==========================================
    // 14. Main PTO Driveline
    // ==========================================
    const ptoGroup = new THREE.Group();
    const ptoTubeGeo = new THREE.CylinderGeometry(0.06, 0.06, headerWidth - 1, 16);
    const ptoTube = new THREE.Mesh(ptoTubeGeo, steel);
    ptoTube.rotation.z = Math.PI / 2;
    ptoTube.position.set(0, 0.2, -0.8);
    ptoGroup.add(ptoTube);
    meshes.pto = ptoTube;
    
    parts.push({
        name: "Main PTO Transverse Driveline",
        description: "High-torque hexagonal shaft running the entire width of the header.",
        material: "Steel",
        function: "Delivers rotational mechanical power to all 12 row unit gearboxes.",
        assemblyOrder: 12,
        connections: ["Combine PTO", "Header Gearboxes"],
        failureEffect: "Header stops entirely.",
        cascadeFailures: ["Shear pin breaking", "U-joint explosion"],
        originalPosition: { x: 0, y: 0.2, z: -0.8 },
        explodedPosition: { x: 0, y: 1, z: -4 }
    });

    // ==========================================
    // 15. Hydraulic Lines
    // ==========================================
    const hydLine1 = createTube([
        new THREE.Vector3(-5, 0.5, -1),
        new THREE.Vector3(-3, 0.8, -0.5),
        new THREE.Vector3(0, 0.8, -0.5),
        new THREE.Vector3(3, 0.5, -1)
    ], 0.02, rubber);
    ptoGroup.add(hydLine1);
    
    const hydLine2 = createTube([
        new THREE.Vector3(-5, 0.4, -1),
        new THREE.Vector3(-3, 0.7, -0.4),
        new THREE.Vector3(0, 0.7, -0.4),
        new THREE.Vector3(3, 0.4, -1)
    ], 0.02, rubber);
    ptoGroup.add(hydLine2);
    group.add(ptoGroup);

    parts.push({
        name: "Hydraulic Distribution Network",
        description: "Braided high-pressure rubber hoses running across the frame.",
        material: "Rubber / Steel Fittings",
        function: "Supplies fluid pressure to the deck plate adjustment cylinders.",
        assemblyOrder: 13,
        connections: ["Combine Multi-coupler", "Deck Plate Cylinders"],
        failureEffect: "Inability to adjust deck plates on-the-go.",
        cascadeFailures: ["Fluid leak causing fire hazard", "Pump cavitation"],
        originalPosition: { x: 0, y: 0.6, z: -0.5 },
        explodedPosition: { x: 0, y: 6, z: -1 }
    });

    // ==========================================
    // 16. Feeder House Adapter
    // ==========================================
    const adapterGeo = new THREE.BoxGeometry(2, 1.5, 0.5);
    const adapter = new THREE.Mesh(adapterGeo, darkSteel);
    adapter.position.set(0, 0.75, -1.5);
    group.add(adapter);

    parts.push({
        name: "Feeder House Mount & Adapter",
        description: "Massive rear bracket that interfaces with the combine's throat.",
        material: "Steel",
        function: "Primary physical attachment point to the combine harvester.",
        assemblyOrder: 14,
        connections: ["Main Frame", "Combine Feeder House"],
        failureEffect: "Header detaches and falls.",
        cascadeFailures: ["Crushing damage", "PTO destruction"],
        originalPosition: { x: 0, y: 0.75, z: -1.5 },
        explodedPosition: { x: 0, y: 1, z: -8 }
    });
    
    // ==========================================
    // 17 & 18. End Shields & Lights
    // ==========================================
    const endShieldGeo = new THREE.BoxGeometry(0.1, 1.2, 2.5);
    const leftShield = new THREE.Mesh(endShieldGeo, plastic);
    leftShield.position.set(startX - rowSpacing, 0.8, -0.2);
    group.add(leftShield);
    
    const rightShield = new THREE.Mesh(endShieldGeo, plastic);
    rightShield.position.set(-startX + rowSpacing, 0.8, -0.2);
    group.add(rightShield);

    parts.push({
        name: "Aerodynamic End Shields",
        description: "Smooth plastic cowlings mounted on the far left and right extremities.",
        material: "Plastic",
        function: "Prevents ears from flying out the sides, pushes standing crop inward, and covers drivelines.",
        assemblyOrder: 15,
        connections: ["Main Frame"],
        failureEffect: "Crop loss off the sides, exposed spinning sprockets.",
        cascadeFailures: ["Safety hazard", "Snagging on fences"],
        originalPosition: { x: startX - rowSpacing, y: 0.8, z: -0.2 },
        explodedPosition: { x: startX - rowSpacing - 4, y: 1, z: -0.2 }
    });

    const lightGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 5 });
    
    const strobeL = new THREE.Mesh(lightGeo, lightMat);
    strobeL.rotation.z = Math.PI / 2;
    strobeL.position.set(startX - rowSpacing - 0.06, 1.2, -0.2);
    group.add(strobeL);
    
    const strobeR = new THREE.Mesh(lightGeo, lightMat);
    strobeR.rotation.z = Math.PI / 2;
    strobeR.position.set(-startX + rowSpacing + 0.06, 1.2, -0.2);
    group.add(strobeR);
    
    meshes.strobes = [strobeL, strobeR];

    parts.push({
        name: "High-Intensity LED Strobe Lights",
        description: "Pulsing amber warning lights mounted on the extremity shields.",
        material: "Glass / Electronic",
        function: "Provides width clearance visibility during road transport at night.",
        assemblyOrder: 16,
        connections: ["End Shields", "Wiring Harness"],
        failureEffect: "Reduced visibility.",
        cascadeFailures: ["Road collision"],
        originalPosition: { x: startX - rowSpacing - 0.06, y: 1.2, z: -0.2 },
        explodedPosition: { x: startX - rowSpacing - 6, y: 3, z: -0.2 }
    });


    // ==========================================
    // Quiz Questions
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary function of the stalk rolls in a corn header?",
            options: [
                "To chop the stalk into fine residue",
                "To pull the corn stalk downward and strip the ear off against the deck plates",
                "To push the corn into the auger",
                "To guide the combine through the rows automatically"
            ],
            correctAnswer: 1,
            explanation: "Stalk rolls aggressively pull the stalk downward. As the stalk goes down, the ear is stripped off when it hits the narrower deck plates."
        },
        {
            question: "Why are the retractable fingers on the transverse auger important?",
            options: [
                "They cut the stalks",
                "They grab the corn ears at the center and feed them evenly into the feeder house",
                "They adjust the header height",
                "They prevent stones from entering"
            ],
            correctAnswer: 1,
            explanation: "The retractable fingers extend to aggressively grab the crop in the center of the auger and pull it into the feeder house, then retract to release it smoothly without wrapping."
        },
        {
            question: "What failure cascade results from a shattered rotary chopper blade?",
            options: [
                "The auger spins out of control",
                "The row unit gearbox can overheat or lock up due to massive imbalance and vibration",
                "The gathering chains reverse direction",
                "The poly snouts melt"
            ],
            correctAnswer: 1,
            explanation: "A shattered blade creates extreme vibration and imbalance at high RPMs, which quickly destroys the gearbox bearings and can cause it to lock up or overheat."
        },
        {
            question: "What material are the pointed snouts typically made of to resist impact and slide easily through the crop?",
            options: [
                "Cast Iron",
                "High-Density Polyethylene (Plastic)",
                "Tempered Glass",
                "Copper"
            ],
            correctAnswer: 1,
            explanation: "Poly snouts are lightweight, highly impact-resistant, and have a smooth low-friction surface that helps them glide through downed or tangled corn without snagging."
        },
        {
            question: "How do the gathering chains move the crop?",
            options: [
                "They use electromagnets",
                "They rely on wind generated by a fan",
                "They have steel lugs that catch the stalks and sweep loose ears backward toward the auger",
                "They vibrate at high frequency"
            ],
            correctAnswer: 2,
            explanation: "Gathering chains run parallel to the deck plates and are equipped with metal lugs (fingers) that grab the stalks and pulled ears, sweeping them backward to the auger."
        }
    ];

    // ==========================================
    // Animation Loop
    // ==========================================
    function animate(time, speed, meshesList) {
        const timeMod = time * speed;
        
        // Auger rotation
        if (meshes.auger) {
            meshes.auger.rotation.x = timeMod * 2.5;
        }
        
        // Retractable fingers eccentric motion
        if (meshes.fingers) {
            meshes.fingers.forEach(f => {
                const currentAngle = f.angleBase + meshes.auger.rotation.x;
                const extension = Math.sin(currentAngle) * 0.15;
                f.mesh.position.y = Math.sin(f.angleBase) * 0.4 + Math.sin(f.angleBase)*extension;
                f.mesh.position.z = Math.cos(f.angleBase) * 0.4 + Math.cos(f.angleBase)*extension;
            });
        }
        
        // Stalk rolls (counter-rotating)
        if (meshes.stalkRolls) {
            meshes.stalkRolls.forEach(rolls => {
                rolls.left.rotation.y = timeMod * 12;
                rolls.right.rotation.y = -timeMod * 12;
            });
        }
        
        // Gathering chains lugs translation
        if (meshes.gatheringChains) {
            meshes.gatheringChains.forEach(lugGroup => {
                lugGroup.children.forEach(lug => {
                    lug.position.z += 0.08 * speed;
                    if (lug.position.z > 0.6) {
                        lug.position.z = -0.6;
                    }
                });
            });
        }
        
        // Rotary choppers
        if (meshes.choppers) {
            meshes.choppers.forEach(chop => {
                chop.rotation.y = timeMod * 25; // extremely fast
            });
        }
        
        // PTO Driveline
        if (meshes.pto) {
            meshes.pto.rotation.x = timeMod * 10;
        }
        
        // Strobe lights pulsing
        if (meshes.strobes) {
            const intensity = 2 + Math.sin(time * 8) * 3;
            meshes.strobes.forEach(strobe => {
                strobe.material.emissiveIntensity = intensity;
            });
        }
    }

    return {
        group,
        parts,
        description: "Massive 12-Row Agricultural Combine Corn Header. Features high-speed counter-rotating stalk rolls, rapid rotary choppers, resilient pointed poly dividers, gathering chains with heavy lugs, and a heavy-duty transverse auger with retractable feeding fingers. Engineered for ultra-high capacity harvesting in dense crop conditions.",
        quizQuestions,
        animate
    };
}
