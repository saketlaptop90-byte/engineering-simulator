import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "God-Tier Quantum Entanglement Communicator (Ansible). A massive, ultra-high-tech, FTL communication array. It utilizes spontaneous parametric down-conversion, continuous-variable quantum teleportation, and macro-scale entangled quantum states across a simulated deep-space void to achieve instantaneous intergalactic data transfer. Features chaotic entanglement tethers, highly complex optical paths, and real-time spin-state correlation telemetry.";

    const quizQuestions = [
        {
            question: "In continuous-variable quantum teleportation using two-mode squeezed vacuum states, how does finite squeezing affect the fidelity of the teleported coherent state?",
            options: [
                "It introduces unavoidable thermal noise, bounded by 1/(1+e^(-2r)), degrading fidelity below unity.",
                "It causes deterministic phase shifts in the Wigner function that can be entirely corrected by classical feedforward.",
                "It enhances the fidelity by introducing non-Gaussian elements into the teleported state, suppressing vacuum fluctuations.",
                "It leads to a periodic collapse and revival of fidelity due to the Kerr effect in the non-linear crystal."
            ],
            correctAnswer: 0,
            explanation: "Finite squeezing implies imperfect entanglement, which introduces vacuum noise during the Bell-state measurement and reconstruction, resulting in a thermalized version of the original state and fidelity less than 1."
        },
        {
            question: "Consider a superdense coding protocol utilizing a non-maximally entangled state cos(θ)|00⟩ + sin(θ)|11⟩. What is the asymptotic classical channel capacity per use of this state?",
            options: [
                "1 + H(cos^2(θ)) bits",
                "2 bits, irrespective of θ, provided local filtering operations are allowed.",
                "H(cos^2(θ)) bits, where H is the binary Shannon entropy.",
                "1 + 2cos(θ)sin(θ) bits"
            ],
            correctAnswer: 0,
            explanation: "Using the Holevo bound, the maximum accessible information for a bipartite pure state in superdense coding is 1 + S(ρ_A), where S is the von Neumann entropy, which equals H(cos^2(θ))."
        },
        {
            question: "For spontaneous parametric down-conversion (SPDC) in a periodically poled lithium niobate (PPLN) crystal, what is the role of quasi-phase matching (QPM)?",
            options: [
                "To compensate for phase velocity mismatch between the pump, signal, and idler fields by periodically modulating the nonlinear susceptibility.",
                "To increase the group velocity dispersion for ultra-broadband entanglement generation.",
                "To perfectly align the Poynting vectors of the extraordinary and ordinary rays to prevent spatial walk-off.",
                "To suppress higher-order nonlinear processes like third-harmonic generation."
            ],
            correctAnswer: 0,
            explanation: "QPM periodically inverts the sign of the nonlinear susceptibility (χ^(2)) to correct the accumulated phase difference between the interacting waves, compensating for natural dispersion."
        },
        {
            question: "In a stabilizer code formalism for quantum error correction, how are the logical operators defined?",
            options: [
                "They are elements of the normalizer of the stabilizer group that are not in the stabilizer group itself.",
                "They are the generators of the stabilizer group.",
                "They are arbitrary Pauli operators that anti-commute with all stabilizer generators.",
                "They are strictly diagonal matrices in the computational basis."
            ],
            correctAnswer: 0,
            explanation: "Logical operators must commute with all stabilizers (hence in the normalizer/centralizer) but must not be stabilizers themselves (as stabilizers act trivially on the codespace)."
        },
        {
            question: "Which of the following describes the CHSH inequality bound for a local hidden variable theory versus quantum mechanics?",
            options: [
                "Classical bound is 2; Quantum bound (Tsirelson's bound) is 2√2.",
                "Classical bound is 1; Quantum bound is √2.",
                "Classical bound is 4; Quantum bound is 4√2.",
                "Classical bound is 0; Quantum bound is 2."
            ],
            correctAnswer: 0,
            explanation: "The CHSH inequality |E(a,b) - E(a,b') + E(a',b) + E(a',b')| <= 2 holds for local realism, while quantum mechanics allows violations up to 2√2."
        }
    ];

    // --- CUSTOM MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const laserRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0, transparent: true, opacity: 0.7 });
    const laserBlue = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 5.0, transparent: true, opacity: 0.7 });
    const quantumCoreMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, transmission: 0.95, opacity: 1, metalness: 0.1, roughness: 0.05, 
        ior: 1.5, thickness: 2.0, clearcoat: 1.0, emissive: 0x00ffff, emissiveIntensity: 0.4 
    });
    const goldContacts = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.2 });
    const darkMatterMat = new THREE.MeshStandardMaterial({ color: 0x050505, emissive: 0x020202, emissiveIntensity: 0.1, roughness: 0.9, metalness: 0.1 });
    const hologramMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.3 });
    const voidMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x111122, emissiveIntensity: 0.8, wireframe: true });
    const carbonFiber = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.4, wireframe: false });

    // --- ANIMATION STATE ARRAYS ---
    const animData = {
        spinners: [],
        pistons: [],
        lasers: [],
        particles: [],
        crystals: [],
        rings: [],
        dataStreams: [],
        entanglementTethers: [],
        screens: []
    };

    let partIdCounter = 1;

    // --- HELPER FUNCTION TO ADD PARTS ---
    function addPart(mesh, name, desc, matName, func, order, conns, fail, cascade, ox, oy, oz, groupToAdd = group) {
        mesh.position.set(ox, oy, oz);
        groupToAdd.add(mesh);
        parts.push({
            id: partIdCounter++,
            name: name,
            description: desc,
            material: matName,
            function: func,
            assemblyOrder: order,
            connections: conns,
            failureEffect: fail,
            cascadeFailures: cascade,
            originalPosition: { x: ox, y: oy, z: oz },
            explodedPosition: { x: ox * 1.5, y: oy * 1.5 + Math.abs(ox)*0.5, z: oz * 1.5 }
        });
        return mesh;
    }

    // --- GEOMETRY GENERATORS ---
    function createHexCylinder(radius, height) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        shape.closePath();
        return new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 });
    }

    function createLatheProfile(pointsArray) {
        const points = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(points, 64);
    }

    function createPipe(pointsArray, radius) {
        const curve = new THREE.CatmullRomCurve3(pointsArray.map(p => new THREE.Vector3(p[0], p[1], p[2])));
        return new THREE.TubeGeometry(curve, 64, radius, 12, false);
    }

    function createTorusLugged(radius, tube, radialSegments, tubularSegments, lugs) {
        const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        // Adding lugs conceptually (in practice we merge geometries or create a group)
        const tireGroup = new THREE.Group();
        const torus = new THREE.Mesh(geo, rubber);
        tireGroup.add(torus);
        const lugGeo = new THREE.BoxGeometry(tube*1.5, tube*0.5, tube*0.5);
        for(let i=0; i<lugs; i++) {
            const angle = (Math.PI * 2 / lugs) * i;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle)*(radius+tube*0.2), Math.sin(angle)*(radius+tube*0.2), 0);
            lug.rotation.z = angle;
            tireGroup.add(lug);
        }
        return tireGroup;
    }

    // --- MAIN ARCHITECTURE CONSTANTS ---
    const STATION_A_X = -60;
    const STATION_B_X = 60;
    const PLATFORM_Y = -15;

    // ==========================================
    // STATION A: TRANSMITTER (EARTH-SIDE)
    // ==========================================
    const stationA = new THREE.Group();
    stationA.position.set(STATION_A_X, 0, 0);
    group.add(stationA);

    // A1: Massive Hexagonal Base
    const hexBaseAGeo = createHexCylinder(30, 4);
    const hexBaseA = new THREE.Mesh(hexBaseAGeo, darkSteel);
    hexBaseA.rotation.x = Math.PI / 2;
    addPart(hexBaseA, "Earth-Side Hex-Base", "Massive super-cooled foundation for the quantum transmitter array.", "darkSteel", "Structural integrity and vibration dampening to a nanometer scale.", 1, ["HydraulicSupportsA"], "Loss of calibration.", [], 0, PLATFORM_Y, 0, stationA);

    // A2: Hydraulic Support Pillars
    const legGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
    const pistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 32);
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const lx = Math.cos(angle) * 25;
        const lz = Math.sin(angle) * 25;
        
        const leg = new THREE.Mesh(legGeo, steel);
        addPart(leg, `Hydraulic Leg A-${i}`, "Outer cylinder of the active dampening hydraulic system.", "steel", "Isolates optical table from seismic noise.", 2, ["Earth-Side Hex-Base"], "Micro-vibrations enter optics.", ["Optical Misalignment"], lx, PLATFORM_Y - 10, lz, stationA);
        
        const piston = new THREE.Mesh(pistonGeo, chrome);
        addPart(piston, `Hydraulic Piston A-${i}`, "Inner chrome piston extending into the bedrock.", "chrome", "Active leveling.", 3, [`Hydraulic Leg A-${i}`], "Platform tilt.", ["Signal Loss"], lx, PLATFORM_Y - 20, lz, stationA);
        
        animData.pistons.push({ mesh: piston, baseY: PLATFORM_Y - 20, phase: i, speed: 2.0, amp: 0.5 });
    }

    // A3: Optical Table
    const optTableGeo = new THREE.BoxGeometry(40, 1, 40);
    const optTableA = new THREE.Mesh(optTableGeo, aluminum);
    addPart(optTableA, "Transmitter Optical Table", "Invar optical breadboard with M6 tapped holes for mounting optics.", "aluminum", "Mounting surface for laser and crystals.", 4, ["Earth-Side Hex-Base"], "Complete array failure.", ["Catastrophic Cascade"], 0, PLATFORM_Y + 2.5, 0, stationA);

    // A4: Pump Laser Source (Nd:YAG)
    const laserChamberGeo = new THREE.BoxGeometry(6, 4, 12);
    const laserChamber = new THREE.Mesh(laserChamberGeo, steel);
    addPart(laserChamber, "Pump Laser Chamber", "Houses the Nd:YAG rod and flashlamps. Generates the 355nm UV pump beam.", "steel", "Photon generation.", 5, ["Transmitter Optical Table"], "No pump photons.", ["Entanglement Ceases"], -12, PLATFORM_Y + 5, 0, stationA);

    // A5: Laser Cooling Lines
    const coolingCurveA = [
        [-12, PLATFORM_Y + 7, 6], [-12, PLATFORM_Y + 12, 10], [-5, PLATFORM_Y + 12, 15], [0, PLATFORM_Y + 5, 18]
    ];
    const coolingPipeA = new THREE.Mesh(createPipe(coolingCurveA, 0.4), copper);
    addPart(coolingPipeA, "Laser Cryo-Cooling Line", "Liquid helium flow path for the pump laser.", "copper", "Thermal management.", 6, ["Pump Laser Chamber"], "Laser thermal runaway.", ["Melt down"], 0, 0, 0, stationA);

    // A6: Beam Splitters and Mirrors Array
    for(let i=0; i<8; i++) {
        const bsGeo = new THREE.BoxGeometry(0.2, 2, 2);
        const bs = new THREE.Mesh(bsGeo, glass);
        bs.rotation.y = Math.PI/4 + (i * 0.1);
        addPart(bs, `Beam Splitter A-${i}`, "Dichroic mirror for routing the pump beam.", "glass", "Beam path routing.", 7, ["Transmitter Optical Table"], "Beam misdirected.", [], -8 + (i*1.5), PLATFORM_Y + 4, -4 + (i*0.5), stationA);
    }

    // A7: Massive PPLN Crystal Chamber (Lathe)
    const crystalChamberPoints = [
        [3, 0], [4, 2], [5, 4], [5, 8], [4, 10], [3, 12]
    ];
    const pplnGeo = createLatheProfile(crystalChamberPoints);
    const pplnChamber = new THREE.Mesh(pplnGeo, chrome);
    pplnChamber.rotation.z = Math.PI/2;
    addPart(pplnChamber, "PPLN Crystal Oven", "Temperature-controlled oven housing the Periodically Poled Lithium Niobate crystal for SPDC.", "chrome", "Houses nonlinear crystal to generate entangled photon pairs.", 8, ["Transmitter Optical Table"], "Phase mismatch.", ["Fidelity Drop"], 0, PLATFORM_Y + 4, 0, stationA);

    // A8: The Quantum Crystal (Emissive)
    const crystalGeo = new THREE.OctahedronGeometry(2, 2);
    const qCrystalA = new THREE.Mesh(crystalGeo, quantumCoreMat);
    addPart(qCrystalA, "Transmitter Quantum Crystal", "The non-linear crystal undergoing extreme optical pumping.", "quantumCoreMat", "Generates entangled state.", 9, ["PPLN Crystal Oven"], "No entanglement.", ["Total Comms Failure"], 0, PLATFORM_Y + 4, 0, stationA);
    animData.crystals.push({ mesh: qCrystalA, type: 'tx' });

    // A9: Crystal Data Rings
    for (let r=0; r<3; r++) {
        const ringGeo = new THREE.TorusGeometry(4 + r*1.2, 0.1, 16, 64);
        const ring = new THREE.Mesh(ringGeo, r%2==0 ? neonBlue : hologramMat);
        ring.rotation.x = Math.PI/2;
        addPart(ring, `Tx Telemetry Ring ${r}`, "Holographic magnetic containment and data readout ring.", "neonBlue", "State monitoring.", 10, ["PPLN Crystal Oven"], "Blind operation.", [], 0, PLATFORM_Y + 4, 0, stationA);
        animData.rings.push({ mesh: ring, axis: r%3, speed: 0.05 + r*0.02 });
    }

    // A10: Operator Cabin Tx
    const cabinGeoA = new THREE.BoxGeometry(10, 8, 10);
    const cabinA = new THREE.Mesh(cabinGeoA, plastic);
    addPart(cabinA, "Tx Control Cabin", "Pressurized, shielded cabin for the ansible operator.", "plastic", "Operator life support.", 11, ["Transmitter Optical Table"], "Operator asphyxiation.", [], 0, PLATFORM_Y + 8, 15, stationA);
    
    // A11: Tinted Windows
    const windowGeoA = new THREE.PlaneGeometry(8, 4);
    const windowA = new THREE.Mesh(windowGeoA, tinted);
    windowA.rotation.x = -Math.PI/8;
    addPart(windowA, "Cabin Window A", "Anti-laser tinted viewing port.", "tinted", "Visibility without blindness.", 12, ["Tx Control Cabin"], "Operator blindness.", [], 0, PLATFORM_Y + 10, 10.1, stationA);

    // A12: Control Screens inside cabin
    for(let s=0; s<4; s++) {
        const screenGeo = new THREE.PlaneGeometry(2, 1.5);
        const screen = new THREE.Mesh(screenGeo, s%2==0 ? neonGreen : neonBlue);
        addPart(screen, `Tx Screen ${s}`, "Quantum state vector readout display.", "neonGreen", "UI", 13, ["Tx Control Cabin"], "No UI.", [], -3 + s*2, PLATFORM_Y + 9, 14, stationA);
        animData.screens.push(screen);
    }

    // A13: Entanglement Emission Array (Dish)
    const dishPoints = [];
    for(let i=0; i<=20; i++) {
        dishPoints.push([ i*0.4, Math.pow(i*0.4, 2)*0.2 ]);
    }
    const dishGeo = createLatheProfile(dishPoints);
    const dishA = new THREE.Mesh(dishGeo, steel);
    dishA.rotation.x = Math.PI/2;
    dishA.rotation.y = Math.PI/2;
    addPart(dishA, "Tx Entanglement Dish", "Parabolic director focusing the entangled state probability waves towards the deep space void.", "steel", "Directs entanglement channel.", 14, ["Transmitter Optical Table"], "Signal scatter.", ["Connection Lost"], 12, PLATFORM_Y + 8, 0, stationA);

    // A14: Hydraulic Struts for Dish
    const strutGeo = new THREE.CylinderGeometry(0.3, 0.3, 8);
    const strutA = new THREE.Mesh(strutGeo, chrome);
    strutA.rotation.z = Math.PI/4;
    addPart(strutA, "Dish Strut A", "Actuator for dish alignment.", "chrome", "Aiming.", 15, ["Tx Entanglement Dish"], "Misalignment.", [], 8, PLATFORM_Y + 4, 0, stationA);


    // ==========================================
    // STATION B: RECEIVER (ALPHA CENTAURI-SIDE)
    // ==========================================
    const stationB = new THREE.Group();
    stationB.position.set(STATION_B_X, 0, 0);
    group.add(stationB);

    // B1: Hex Base
    const hexBaseBGeo = createHexCylinder(30, 4);
    const hexBaseB = new THREE.Mesh(hexBaseBGeo, darkSteel);
    hexBaseB.rotation.x = Math.PI / 2;
    addPart(hexBaseB, "Centauri-Side Hex-Base", "Massive receiver foundation.", "darkSteel", "Structural integrity.", 16, ["HydraulicSupportsB"], "Loss of calibration.", [], 0, PLATFORM_Y, 0, stationB);

    // B2: Hydraulic Supports B
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const lx = Math.cos(angle) * 25;
        const lz = Math.sin(angle) * 25;
        
        const leg = new THREE.Mesh(legGeo, steel);
        addPart(leg, `Hydraulic Leg B-${i}`, "Outer cylinder of receiver active dampening.", "steel", "Isolates optics.", 17, ["Centauri-Side Hex-Base"], "Micro-vibrations.", [], lx, PLATFORM_Y - 10, lz, stationB);
        
        const piston = new THREE.Mesh(pistonGeo, chrome);
        addPart(piston, `Hydraulic Piston B-${i}`, "Inner chrome piston.", "chrome", "Active leveling.", 18, [`Hydraulic Leg B-${i}`], "Platform tilt.", [], lx, PLATFORM_Y - 20, lz, stationB);
        
        animData.pistons.push({ mesh: piston, baseY: PLATFORM_Y - 20, phase: i+3, speed: 2.1, amp: 0.6 });
    }

    // B3: Optical Table B
    const optTableBGeo = new THREE.BoxGeometry(40, 1, 40);
    const optTableB = new THREE.Mesh(optTableBGeo, aluminum);
    addPart(optTableB, "Receiver Optical Table", "Invar optical breadboard.", "aluminum", "Mounting surface.", 19, ["Centauri-Side Hex-Base"], "Complete array failure.", [], 0, PLATFORM_Y + 2.5, 0, stationB);

    // B4: Entanglement Receiver Dish
    const dishB = new THREE.Mesh(dishGeo, steel);
    dishB.rotation.x = Math.PI/2;
    dishB.rotation.y = -Math.PI/2;
    addPart(dishB, "Rx Entanglement Dish", "Parabolic collector for incoming entangled states.", "steel", "Collects entanglement channel.", 20, ["Receiver Optical Table"], "Signal scatter.", ["Connection Lost"], -12, PLATFORM_Y + 8, 0, stationB);

    // B5: Homodyne Detector Array
    const detectorBoxGeo = new THREE.BoxGeometry(8, 6, 8);
    const detectorBox = new THREE.Mesh(detectorBoxGeo, carbonFiber);
    addPart(detectorBox, "Homodyne Detector Bank", "Cryogenically cooled balanced homodyne detectors for state tomography.", "carbonFiber", "Measures the teleported quantum state.", 21, ["Receiver Optical Table"], "No signal read.", ["Data Loss"], 8, PLATFORM_Y + 5.5, 0, stationB);

    // B6: Receiver Quantum Crystal
    const qCrystalB = new THREE.Mesh(crystalGeo, quantumCoreMat);
    addPart(qCrystalB, "Receiver Quantum Crystal", "The entangled twin crystal, instantaneously mirroring Tx state.", "quantumCoreMat", "Maintains entangled state.", 22, ["Homodyne Detector Bank"], "Decoherence.", ["Total Comms Failure"], 0, PLATFORM_Y + 4, 0, stationB);
    animData.crystals.push({ mesh: qCrystalB, type: 'rx' });

    // B7: Receiver Rings
    for (let r=0; r<3; r++) {
        const ringGeo = new THREE.TorusGeometry(4 + r*1.2, 0.1, 16, 64);
        const ring = new THREE.Mesh(ringGeo, r%2==0 ? neonPurple : hologramMat);
        ring.rotation.x = Math.PI/2;
        addPart(ring, `Rx Telemetry Ring ${r}`, "Holographic state readout.", "neonPurple", "State monitoring.", 23, ["Receiver Quantum Crystal"], "Blind operation.", [], 0, PLATFORM_Y + 4, 0, stationB);
        animData.rings.push({ mesh: ring, axis: (r+1)%3, speed: -0.05 - r*0.02 });
    }

    // B8: Operator Cabin Rx
    const cabinB = new THREE.Mesh(cabinGeoA, plastic);
    addPart(cabinB, "Rx Control Cabin", "Pressurized receiver operations cabin.", "plastic", "Operator life support.", 24, ["Receiver Optical Table"], "Operator asphyxiation.", [], 0, PLATFORM_Y + 8, 15, stationB);

    // B9: Tinted Windows Rx
    const windowB = new THREE.Mesh(windowGeoA, tinted);
    windowB.rotation.x = -Math.PI/8;
    addPart(windowB, "Cabin Window B", "Viewing port.", "tinted", "Visibility.", 25, ["Rx Control Cabin"], "Operator blindness.", [], 0, PLATFORM_Y + 10, 10.1, stationB);

    // B10: Cables and Wires B
    for(let c=0; c<10; c++) {
        const wireCurve = [
            [8, PLATFORM_Y+3, -3 + c], [4, PLATFORM_Y+1, -5+c], [0, PLATFORM_Y+2, -2+c]
        ];
        const wire = new THREE.Mesh(createPipe(wireCurve, 0.1), rubber);
        addPart(wire, `Data Bus Cable B-${c}`, "High-speed superconducting data bus.", "rubber", "Data routing.", 26, ["Homodyne Detector Bank"], "Data packet loss.", [], 0,0,0, stationB);
    }


    // ==========================================
    // THE DEEP SPACE VOID & ENTANGLEMENT TETHERS
    // ==========================================
    const voidGroup = new THREE.Group();
    group.add(voidGroup);

    // V1: The Void Rift
    const riftGeo = new THREE.TorusGeometry(15, 2, 32, 64);
    const rift = new THREE.Mesh(riftGeo, voidMat);
    rift.scale.z = 0.2;
    rift.scale.y = 2.0;
    addPart(rift, "Deep Space Void Anomaly", "A stabilized tear in spacetime shrinking intergalactic distances to meters.", "voidMat", "Shortcuts spacetime.", 27, ["Tx Entanglement Dish", "Rx Entanglement Dish"], "Anomaly collapse.", ["Spaghettification"], 0, PLATFORM_Y + 8, 0, voidGroup);

    // V2: Chaotic Entanglement Tethers (Hundreds of dynamic lines)
    const tetherMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, linewidth: 2 });
    const tetherCount = 150;
    
    for (let t = 0; t < tetherCount; t++) {
        const points = [];
        // Connect Dish A (-48, Y+8, 0) to Dish B (48, Y+8, 0) through the void (0, Y+8, 0)
        const startX = STATION_A_X + 12;
        const endX = STATION_B_X - 12;
        
        points.push(new THREE.Vector3(startX, PLATFORM_Y + 8 + (Math.random()-0.5)*5, (Math.random()-0.5)*5));
        
        // Control points for chaotic curve
        const cp1 = new THREE.Vector3(startX + 15, PLATFORM_Y + 8 + (Math.random()-0.5)*20, (Math.random()-0.5)*20);
        const cp2 = new THREE.Vector3(0, PLATFORM_Y + 8 + (Math.random()-0.5)*30, (Math.random()-0.5)*30);
        const cp3 = new THREE.Vector3(endX - 15, PLATFORM_Y + 8 + (Math.random()-0.5)*20, (Math.random()-0.5)*20);
        
        points.push(cp1, cp2, cp3);
        points.push(new THREE.Vector3(endX, PLATFORM_Y + 8 + (Math.random()-0.5)*5, (Math.random()-0.5)*5));
        
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
        const line = new THREE.Line(lineGeo, tetherMaterial);
        
        addPart(line, `Quantum Tether ${t}`, "Macro-scale entangled particle string bridging the void.", "hologramMat", "Instantaneous state transmission.", 28, ["Tx Entanglement Dish", "Rx Entanglement Dish"], "Signal noise.", [], 0,0,0, voidGroup);
        
        animData.entanglementTethers.push({
            mesh: line,
            curve: curve,
            basePoints: points.map(p => p.clone()),
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.1 + 0.05
        });
    }

    // V3: Energy Pulses (Lasers traveling the tethers)
    const pulseGeo = new THREE.SphereGeometry(0.3, 8, 8);
    for(let p=0; p<30; p++) {
        const pulse = new THREE.Mesh(pulseGeo, neonBlue);
        addPart(pulse, `Data Pulse ${p}`, "Packet of quantum information.", "neonBlue", "Carries data.", 29, ["Quantum Tether"], "Data loss.", [], 0,0,0, voidGroup);
        animData.dataStreams.push({
            mesh: pulse,
            tetherIndex: Math.floor(Math.random() * tetherCount),
            progress: Math.random()
        });
    }

    // ==========================================
    // EXTREME DETAILS: HYDRAULIC HOSES, PIPES, GEARS
    // ==========================================
    
    // Station A complex piping
    for(let p=0; p<15; p++) {
        const hCurve = [];
        let cx = -15 + Math.random()*10;
        let cy = PLATFORM_Y + Math.random()*10;
        let cz = -15 + Math.random()*30;
        for(let j=0; j<4; j++) {
            hCurve.push([cx, cy, cz]);
            cx += (Math.random()-0.5)*5;
            cy += Math.random()*4;
            cz += (Math.random()-0.5)*5;
        }
        const pipe = new THREE.Mesh(createPipe(hCurve, 0.15), rubber);
        addPart(pipe, `Hydraulic Hose A-${p}`, "High-pressure fluid line.", "rubber", "Fluid transfer.", 30, [], "Leak.", [], 0,0,0, stationA);
    }

    // Station B complex piping
    for(let p=0; p<15; p++) {
        const hCurve = [];
        let cx = 5 + Math.random()*10;
        let cy = PLATFORM_Y + Math.random()*10;
        let cz = -15 + Math.random()*30;
        for(let j=0; j<4; j++) {
            hCurve.push([cx, cy, cz]);
            cx += (Math.random()-0.5)*5;
            cy += Math.random()*4;
            cz += (Math.random()-0.5)*5;
        }
        const pipe = new THREE.Mesh(createPipe(hCurve, 0.15), copper);
        addPart(pipe, `Coolant Hose B-${p}`, "Liquid N2 coolant line.", "copper", "Cooling.", 31, [], "Overheat.", [], 0,0,0, stationB);
    }

    // Decorative Gears on Transmitter
    const gearGeo = new THREE.CylinderGeometry(2, 2, 0.5, 16);
    for(let g=0; g<5; g++) {
        const gear = new THREE.Mesh(gearGeo, darkSteel);
        gear.rotation.x = Math.PI/2;
        addPart(gear, `Alignment Gear A-${g}`, "Macro alignment gear.", "darkSteel", "Mechanical alignment.", 32, [], "Jammed.", [], -5, PLATFORM_Y + 1.5, -8 + g*4, stationA);
        animData.spinners.push({ mesh: gear, axis: 'z', speed: (g%2==0 ? 0.02 : -0.02) });
    }

    // Tires/Wheels for mobile calibration carts (Using Torus and Lugs)
    const cartA = new THREE.Group();
    stationA.add(cartA);
    cartA.position.set(5, PLATFORM_Y + 1, 15);
    const cartBody = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 6), steel);
    addPart(cartBody, "Calibration Cart A", "Mobile platform for quantum state calibration.", "steel", "Calibration.", 33, [], "Immobile.", [], 0,0,0, cartA);
    
    for(let w=0; w<4; w++) {
        const tx = (w%2===0 ? 1 : -1) * 2.2;
        const tz = (w<2 ? 1 : -1) * 2.2;
        const tire = createTorusLugged(0.8, 0.3, 16, 32, 20);
        addPart(tire, `Cart Tire A-${w}`, "Aggressive tread off-road tire.", "rubber", "Mobility.", 34, ["Calibration Cart A"], "Flat tire.", [], tx, 0, tz, cartA);
        animData.spinners.push({ mesh: tire, axis: 'x', speed: 0.05 });
    }

    // Massive Antenna Array on Station B
    for(let a=0; a<12; a++) {
        const antGeo = new THREE.CylinderGeometry(0.05, 0.2, 10, 8);
        const antenna = new THREE.Mesh(antGeo, chrome);
        antenna.rotation.x = (Math.random() - 0.5) * Math.PI/4;
        antenna.rotation.z = (Math.random() - 0.5) * Math.PI/4;
        addPart(antenna, `Telemetry Antenna B-${a}`, "Classical channel backup antenna.", "chrome", "Classical parity bit transmission.", 35, ["Receiver Optical Table"], "No parity checks.", [], 5 + (Math.random()-0.5)*10, PLATFORM_Y + 15, -15 + (Math.random()-0.5)*10, stationB);
    }

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    
    function animate(time, speed, meshes) {
        const t = time * speed;

        // 1. Pistons moving up and down
        animData.pistons.forEach(p => {
            p.mesh.position.y = p.baseY + Math.sin(t * p.speed + p.phase) * p.amp;
        });

        // 2. Spinners (gears, wheels)
        animData.spinners.forEach(s => {
            if(s.axis === 'x') s.mesh.rotation.x += s.speed * speed;
            if(s.axis === 'y') s.mesh.rotation.y += s.speed * speed;
            if(s.axis === 'z') s.mesh.rotation.z += s.speed * speed;
        });

        // 3. Rings rotating around crystals on different axes
        animData.rings.forEach(r => {
            if(r.axis === 0) r.mesh.rotation.x += r.speed * speed;
            if(r.axis === 1) r.mesh.rotation.y += r.speed * speed;
            if(r.axis === 2) r.mesh.rotation.z += r.speed * speed;
        });

        // 4. Crystals pulsating and hovering
        animData.crystals.forEach(c => {
            c.mesh.position.y = PLATFORM_Y + 4 + Math.sin(t * 3.0) * 0.5;
            c.mesh.rotation.x += 0.01 * speed;
            c.mesh.rotation.y += 0.02 * speed;
            
            // Entanglement synchronization: Tx and Rx perfectly mirrored
            if(c.type === 'rx') {
                c.mesh.rotation.x = animData.crystals[0].mesh.rotation.x;
                c.mesh.rotation.y = -animData.crystals[0].mesh.rotation.y; // Mirror inverse
            }
        });

        // 5. Chaotic Entanglement Tethers writhing
        animData.entanglementTethers.forEach(tether => {
            const pts = tether.basePoints;
            // Perturb control points 1 and 2
            pts[1].y = tether.basePoints[1].y + Math.sin(t * tether.speed + tether.phase) * 5;
            pts[1].z = tether.basePoints[1].z + Math.cos(t * tether.speed * 1.2 + tether.phase) * 5;
            
            pts[2].y = tether.basePoints[2].y + Math.sin(t * tether.speed * 0.8 + tether.phase) * 5;
            pts[2].z = tether.basePoints[2].z + Math.cos(t * tether.speed * 1.5 + tether.phase) * 5;
            
            tether.curve.points = pts;
            const newGeo = new THREE.BufferGeometry().setFromPoints(tether.curve.getPoints(50));
            tether.mesh.geometry.dispose();
            tether.mesh.geometry = newGeo;
        });

        // 6. Data pulses traveling along tethers
        animData.dataStreams.forEach(stream => {
            stream.progress += 0.02 * speed;
            if(stream.progress > 1) {
                stream.progress = 0;
                stream.tetherIndex = Math.floor(Math.random() * animData.entanglementTethers.length);
            }
            
            const tether = animData.entanglementTethers[stream.tetherIndex];
            const pos = tether.curve.getPointAt(stream.progress);
            if(pos) {
                stream.mesh.position.copy(pos);
            }
        });

        // 7. Void Rift pulsating
        rift.scale.z = 0.2 + Math.sin(t * 5.0) * 0.05;
        rift.scale.y = 2.0 + Math.cos(t * 3.0) * 0.1;
        rift.rotation.x = Math.sin(t * 0.5) * 0.1;

        // 8. Screens flashing
        animData.screens.forEach((s, idx) => {
            s.material.emissiveIntensity = 1 + Math.random();
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
