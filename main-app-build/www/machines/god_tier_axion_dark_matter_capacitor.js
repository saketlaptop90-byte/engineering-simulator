import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // CUSTOM GOD-TIER HIGH-TECH MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0022ff,
        emissive: 0x0066ff,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x6600ff,
        emissive: 0x8800ff,
        emissiveIntensity: 4.0,
        roughness: 0.2,
        metalness: 0.9
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0022,
        emissive: 0xff0022,
        emissiveIntensity: 3.0,
        roughness: 0.1,
        metalness: 0.7
    });

    const photonGlow = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffd700,
        emissiveIntensity: 8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const darkMatterAura = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        emissive: 0x110033,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const liquidHelium = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.0,
        metalness: 0.1,
        refractionRatio: 0.98
    });

    const superconductorMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x001133,
        emissiveIntensity: 1.0,
        roughness: 0.4,
        metalness: 0.95,
        wireframe: false
    });

    const goldPlated = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.05,
        metalness: 1.0,
        envMapIntensity: 2.0
    });

    const highPurityCopper = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.3,
        metalness: 0.8
    });

    const ceramicIsolator = new THREE.MeshStandardMaterial({
        color: 0xfff0f5,
        roughness: 0.9,
        metalness: 0.0
    });

    const plasmaField = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        wireframe: true
    });

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // ==========================================
    function createComplexLathe(pointsArray, segments, phiStart = 0, phiLength = Math.PI * 2) {
        const points = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    }

    function createPipeSystem(pathPoints, radius, tubularSegments, radialSegments, closed = false) {
        const curve = new THREE.CatmullRomCurve3(pathPoints.map(p => new THREE.Vector3(p[0], p[1], p[2])));
        return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
    }

    function createHexagonalMesh(radius, depth) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    // Reference Arrays for Animation
    const animatedGears = [];
    const animatedPistons = [];
    const animatedPhotons = [];
    const animatedAxions = [];
    const animatedPipes = [];
    const animatedDisplays = [];
    const tuningRods = [];
    const magneticFieldLines = [];
    const cryoVapors = [];

    // ==========================================
    // 1. MAIN VACUUM VESSEL (CRYOSTAT OUTER SHELL)
    // ==========================================
    const vesselGroup = new THREE.Group();
    const vesselProfile = [
        [0, -25], [12, -25], [12.5, -24.5], [12.5, -20], [14, -18], 
        [14, 18], [12.5, 20], [12.5, 24.5], [12, 25], [0, 25]
    ];
    // We only lathe half of it so we can see inside
    const vesselGeometry = createComplexLathe(vesselProfile, 64, Math.PI / 2, Math.PI * 1.5);
    const vesselMesh = new THREE.Mesh(vesselGeometry, darkSteel);
    vesselGroup.add(vesselMesh);

    // Ribs for structural integrity
    for (let i = -16; i <= 16; i += 4) {
        const ribGeo = new THREE.TorusGeometry(14.2, 0.4, 16, 64, Math.PI * 1.5);
        const rib = new THREE.Mesh(ribGeo, steel);
        rib.rotation.x = Math.PI / 2;
        rib.rotation.z = Math.PI / 2;
        rib.position.y = i;
        vesselGroup.add(rib);
    }

    // Heavy flanges at top and bottom
    const topFlangeGeo = new THREE.CylinderGeometry(15, 15, 2, 64, 1, false, Math.PI / 2, Math.PI * 1.5);
    const topFlange = new THREE.Mesh(topFlangeGeo, chrome);
    topFlange.position.y = 25;
    vesselGroup.add(topFlange);

    const bottomFlangeGeo = new THREE.CylinderGeometry(15, 15, 2, 64, 1, false, Math.PI / 2, Math.PI * 1.5);
    const bottomFlange = new THREE.Mesh(bottomFlangeGeo, chrome);
    bottomFlange.position.y = -25;
    vesselGroup.add(bottomFlange);

    // Rivets on Flanges
    for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        if (angle >= Math.PI / 2 && angle <= Math.PI * 2) {
            const rivet1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), darkSteel);
            rivet1.position.set(14.5 * Math.cos(angle), 25.5, 14.5 * Math.sin(angle));
            vesselGroup.add(rivet1);

            const rivet2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), darkSteel);
            rivet2.position.set(14.5 * Math.cos(angle), -25.5, 14.5 * Math.sin(angle));
            vesselGroup.add(rivet2);
        }
    }

    group.add(vesselGroup);
    parts.push({
        name: "OVC_Vacuum_Vessel",
        description: "Outer Vacuum Chamber (OVC). A colossal stainless steel vessel maintaining extreme ultra-high vacuum (10^-11 mbar) to thermally isolate the 10 mK experiment from room temperature.",
        material: "darkSteel, chrome",
        function: "Thermal and atmospheric isolation.",
        assemblyOrder: 1,
        connections: ["Magnetic_Flux_Yoke", "Vibration_Isolators"],
        failureEffect: "Catastrophic vacuum leak leads to rapid boil-off of liquid helium, causing a violent quench of the 14 Tesla superconducting magnet.",
        cascadeFailures: ["Superconducting_Solenoid", "Dilution_Refrigerator"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: 0, z: 0}
    });

    // ==========================================
    // 2. MAGNETIC FLUX RETURN YOKE
    // ==========================================
    const yokeGroup = new THREE.Group();
    const yokePillarGeo = new THREE.BoxGeometry(4, 54, 4);
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const pillar = new THREE.Mesh(yokePillarGeo, darkSteel);
        pillar.position.set(20 * Math.cos(angle), 0, 20 * Math.sin(angle));
        yokeGroup.add(pillar);
        
        // Add neon status strips
        const stripGeo = new THREE.BoxGeometry(4.2, 50, 0.5);
        const strip = new THREE.Mesh(stripGeo, neonBlue);
        strip.position.set(20 * Math.cos(angle), 0, 20 * Math.sin(angle));
        strip.lookAt(0, 0, 0);
        yokeGroup.add(strip);
        animatedDisplays.push(strip);
    }
    
    const yokeTopGeo = new THREE.TorusGeometry(20, 2.5, 16, 8);
    const yokeTop = new THREE.Mesh(yokeTopGeo, darkSteel);
    yokeTop.rotation.x = Math.PI / 2;
    yokeTop.position.y = 27;
    yokeGroup.add(yokeTop);

    const yokeBot = yokeTop.clone();
    yokeBot.position.y = -27;
    yokeGroup.add(yokeBot);

    group.add(yokeGroup);
    parts.push({
        name: "Magnetic_Flux_Yoke",
        description: "Massive low-carbon steel octagonal structure. Provides a return path for the intense 14 Tesla magnetic field, protecting the surrounding laboratory from lethal magnetic interference.",
        material: "darkSteel, neonBlue",
        function: "Confines the stray magnetic field lines and enhances the central field homogeneity.",
        assemblyOrder: 2,
        connections: ["OVC_Vacuum_Vessel"],
        failureEffect: "Stray magnetic field extends hundreds of meters, wiping hard drives and ripping ferromagnetic objects through the walls.",
        cascadeFailures: ["Data_Acquisition_System", "Control_Panel"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 40}
    });

    // ==========================================
    // 3. THERMAL RADIATION SHIELDS (50K & 4K)
    // ==========================================
    const shieldGroup = new THREE.Group();
    // 50K Shield (Outer)
    const shield50KGeo = new THREE.CylinderGeometry(11, 11, 46, 64, 1, true, 0, Math.PI * 1.5);
    const shield50K = new THREE.Mesh(shield50KGeo, goldPlated);
    shieldGroup.add(shield50K);
    
    // 4K Shield (Inner)
    const shield4KGeo = new THREE.CylinderGeometry(9.5, 9.5, 44, 64, 1, true, 0, Math.PI * 1.5);
    const shield4K = new THREE.Mesh(shield4KGeo, aluminum);
    shieldGroup.add(shield4K);

    // Multi-Layer Insulation (MLI) texturing
    const mliGeo = new THREE.CylinderGeometry(11.2, 11.2, 45, 64, 1, true, 0, Math.PI * 1.5);
    const mliMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.8,
        metalness: 0.5,
        wireframe: true
    });
    const mliMesh = new THREE.Mesh(mliGeo, mliMat);
    shieldGroup.add(mliMesh);

    group.add(shieldGroup);
    parts.push({
        name: "Thermal_Radiation_Shields",
        description: "Nested shields cooled by a pulse-tube cryocooler to 50K and liquid helium to 4K. Coated in gold and reflective aluminum to block infrared blackbody radiation.",
        material: "goldPlated, aluminum",
        function: "Prevents room-temperature photons from heating the millimeter-kelvin inner payload.",
        assemblyOrder: 3,
        connections: ["OVC_Vacuum_Vessel", "Superconducting_Solenoid"],
        failureEffect: "Massive heat leak into the core. Experiment temperature skyrockets, halting all dark matter searches.",
        cascadeFailures: ["Dilution_Refrigerator", "Haloscope_Cavity"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: 0, z: -15}
    });

    // ==========================================
    // 4. 14 TESLA SUPERCONDUCTING SOLENOID
    // ==========================================
    const solenoidGroup = new THREE.Group();
    const bobbinGeo = new THREE.CylinderGeometry(7, 7, 30, 64, 1, true);
    const bobbin = new THREE.Mesh(bobbinGeo, superconductorMat);
    solenoidGroup.add(bobbin);

    // Thousands of turns visually represented by highly dense toruses
    for(let y = -14.5; y <= 14.5; y += 0.2) {
        const wireGeo = new THREE.TorusGeometry(7.1, 0.08, 8, 64);
        const wire = new THREE.Mesh(wireGeo, highPurityCopper);
        wire.rotation.x = Math.PI / 2;
        wire.position.y = y;
        solenoidGroup.add(wire);
    }

    // Structural tie-rods for the magnet
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 32, 16), steel);
        rod.position.set(7.5 * Math.cos(angle), 0, 7.5 * Math.sin(angle));
        solenoidGroup.add(rod);
    }

    // Helium bath jacket for the magnet
    const heBathGeo = new THREE.CylinderGeometry(7.8, 7.8, 31, 64, 1, true, 0, Math.PI * 1.5);
    const heBath = new THREE.Mesh(heBathGeo, liquidHelium);
    solenoidGroup.add(heBath);

    group.add(solenoidGroup);
    parts.push({
        name: "Superconducting_Solenoid",
        description: "A gigantic Nb3Sn/NbTi superconducting coil bathed in superfluid helium. Generates a 14 Tesla magnetic field, billions of times stronger than Earth's, to coax axions into converting into photons.",
        material: "superconductorMat, highPurityCopper, liquidHelium",
        function: "Provides the Primakoff conversion background field (B0).",
        assemblyOrder: 4,
        connections: ["Thermal_Radiation_Shields", "Haloscope_Cavity"],
        failureEffect: "Quench. 100 Megajoules of stored magnetic energy instantly converts to heat, violently vaporizing all liquid helium and potentially rupturing the cryostat.",
        cascadeFailures: ["OVC_Vacuum_Vessel", "Haloscope_Cavity", "Thermal_Radiation_Shields"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 35, z: 0}
    });

    // ==========================================
    // 5. AXION HALOSCOPE CAVITY (THE CORE)
    // ==========================================
    const cavityGroup = new THREE.Group();
    // Ultra-high Q copper resonant cavity
    const cavityWallGeo = new THREE.CylinderGeometry(4, 4, 16, 64, 1, true, 0, Math.PI * 1.75);
    const cavityWall = new THREE.Mesh(cavityWallGeo, highPurityCopper);
    cavityGroup.add(cavityWall);

    const cavityTopGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.5, 64);
    const cavityTop = new THREE.Mesh(cavityTopGeo, highPurityCopper);
    cavityTop.position.y = 8.25;
    cavityGroup.add(cavityTop);

    const cavityBotGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.5, 64);
    const cavityBot = new THREE.Mesh(cavityBotGeo, highPurityCopper);
    cavityBot.position.y = -8.25;
    cavityGroup.add(cavityBot);

    // Dielectric Tuning Rods (Alumina / Sapphire)
    for(let i=0; i<3; i++) {
        const rodGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 32);
        const rod = new THREE.Mesh(rodGeo, ceramicIsolator);
        // Position them asymmetrically to break mode degeneracy
        const r = 2.0;
        const angle = (i/3) * Math.PI * 2;
        rod.position.set(r * Math.cos(angle), 0, r * Math.sin(angle));
        cavityGroup.add(rod);
        tuningRods.push({ mesh: rod, angle: angle, r: r });
    }

    // Coupling Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
    const antenna = new THREE.Mesh(antennaGeo, goldPlated);
    antenna.position.set(0, 7, 0);
    cavityGroup.add(antenna);

    // Plasma visualization inside the cavity (The microwave mode)
    const modeGeo = new THREE.CylinderGeometry(3.8, 3.8, 15.5, 32);
    const modeMesh = new THREE.Mesh(modeGeo, plasmaField);
    cavityGroup.add(modeMesh);
    animatedPhotons.push(modeMesh); // We will pulse the opacity and scale

    group.add(cavityGroup);
    parts.push({
        name: "Haloscope_Resonant_Cavity",
        description: "An ultra-high-Q (Q > 10^5) oxygen-free high thermal conductivity (OFHC) copper cavity. Tuned precisely to the unknown mass of the axion. Operates at 10 mK.",
        material: "highPurityCopper, ceramicIsolator",
        function: "Acts as a resonant chamber where axions convert into microwave photons via the Primakoff effect.",
        assemblyOrder: 5,
        connections: ["Superconducting_Solenoid", "Dilution_Refrigerator", "Quantum_Amplifier"],
        failureEffect: "Loss of Q-factor due to surface contamination. Signal completely buried in thermal noise.",
        cascadeFailures: ["Photon_Detection_Module"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 25, y: 0, z: 0}
    });

    // ==========================================
    // 6. DILUTION REFRIGERATOR CORE (10 mK)
    // ==========================================
    const drGroup = new THREE.Group();
    drGroup.position.y = 15;

    // Series of cold plates
    const plates = [
        { y: 0, r: 6, t: "4K Plate", col: aluminum },
        { y: -3, r: 5, t: "1K Still Plate", col: steel },
        { y: -6, r: 4.5, t: "100mK CP", col: goldPlated },
        { y: -9, r: 4, t: "10mK Mixing Chamber", col: highPurityCopper }
    ];

    plates.forEach(p => {
        const plateGeo = new THREE.CylinderGeometry(p.r, p.r, 0.4, 32);
        const plate = new THREE.Mesh(plateGeo, p.col);
        plate.position.y = p.y;
        drGroup.add(plate);

        // Struts connecting to the next plate
        if (p.y > -9) {
            for(let i=0; i<4; i++) {
                const angle = (i/4) * Math.PI * 2;
                const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 16), ceramicIsolator);
                strut.position.set((p.r - 0.5) * Math.cos(angle), p.y - 1.5, (p.r - 0.5) * Math.sin(angle));
                drGroup.add(strut);
            }
        }
    });

    // Step Heat Exchangers (Fractal-like blocks)
    for(let i=0; i<6; i++) {
        const hexGeo = createHexagonalMesh(0.8, 1.5);
        const hex = new THREE.Mesh(hexGeo, chrome);
        hex.position.set(2, -4 - (i*0.8), 0);
        hex.rotation.x = Math.PI / 2;
        drGroup.add(hex);
    }

    // Coiled capillary tubing
    const spiralPoints = [];
    for(let i=0; i<=100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 20;
        const r = 1.5;
        const y = -1 - (t * 7);
        spiralPoints.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
    }
    const capillaryGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiralPoints), 200, 0.05, 8, false);
    const capillary = new THREE.Mesh(capillaryGeo, neonBlue);
    drGroup.add(capillary);
    animatedPipes.push({ mesh: capillary, phase: 0, speed: 0.1 });

    group.add(drGroup);
    parts.push({
        name: "Dilution_Refrigerator",
        description: "Utilizes the continuous enthalpy of mixing He-3 into He-4 to achieve steady-state temperatures of 10 millikelvin.",
        material: "goldPlated, highPurityCopper, neonBlue",
        function: "Cools the resonant cavity and quantum amplifiers to near absolute zero to eliminate thermal blackbody photons.",
        assemblyOrder: 6,
        connections: ["Haloscope_Resonant_Cavity", "Quantum_Amplifier"],
        failureEffect: "Mixture blockage or leak. Temperature rises to 4K. Signal-to-noise ratio drops by orders of magnitude.",
        cascadeFailures: ["Quantum_Amplifier", "Haloscope_Resonant_Cavity"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 25}
    });

    // ==========================================
    // 7. QUANTUM AMPLIFIER (JPA / TWPA)
    // ==========================================
    const quantumGroup = new THREE.Group();
    // Mounted on the 10mK plate
    quantumGroup.position.set(-2, 5, -2);
    
    // Magnetic shielding for the JPA (Niobium box)
    const jpaShieldGeo = new THREE.BoxGeometry(2, 3, 2);
    const jpaShield = new THREE.Mesh(jpaShieldGeo, superconductorMat);
    quantumGroup.add(jpaShield);

    // The chip inside (visible on top)
    const chipGeo = new THREE.BoxGeometry(1, 0.1, 1);
    const chip = new THREE.Mesh(chipGeo, goldPlated);
    chip.position.y = 1.55;
    quantumGroup.add(chip);

    // Superconducting microwave coax cables connecting down to the cavity
    const coaxPath = [
        [-2, 6.5, -2],
        [-3, 6, -3],
        [-3, 0, -3],
        [0, -1, 0] // Connects to antenna
    ];
    const coaxGeo = createPipeSystem(coaxPath, 0.1, 64, 8);
    const coax = new THREE.Mesh(coaxGeo, chrome);
    group.add(coax);

    group.add(quantumGroup);
    parts.push({
        name: "Quantum_Amplifier_JPA",
        description: "Josephson Parametric Amplifier (JPA). A non-linear superconducting circuit operating precisely at the standard quantum limit.",
        material: "superconductorMat, goldPlated",
        function: "Provides first-stage, ultra-low-noise amplification of the single microwave photon generated by an axion conversion.",
        assemblyOrder: 7,
        connections: ["Haloscope_Resonant_Cavity", "Data_Acquisition_System"],
        failureEffect: "Amplifier saturation from stray magnetic flux or thermal noise. Signal is lost.",
        cascadeFailures: ["Data_Acquisition_System"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -10, y: 15, z: -10}
    });

    // ==========================================
    // 8. CRYOGENIC COOLANT PIPING (COMPLEX TUBING)
    // ==========================================
    const pipeGroup = new THREE.Group();
    const numPipes = 12;
    for(let i=0; i<numPipes; i++) {
        const angle = (i/numPipes) * Math.PI * 2;
        const r1 = 16;
        const r2 = 13;
        const pipePath = [
            [r1 * Math.cos(angle), 30, r1 * Math.sin(angle)],
            [r1 * Math.cos(angle), 15, r1 * Math.sin(angle)],
            [r2 * Math.cos(angle), 10, r2 * Math.sin(angle)],
            [r2 * Math.cos(angle), -20, r2 * Math.sin(angle)],
            [(r2+2) * Math.cos(angle), -22, (r2+2) * Math.sin(angle)],
            [(r2+2) * Math.cos(angle), -30, (r2+2) * Math.sin(angle)]
        ];
        
        const pipeGeo = createPipeSystem(pipePath, 0.4, 128, 12);
        // Alternate colors
        const mat = i % 2 === 0 ? chrome : neonBlue;
        const pipe = new THREE.Mesh(pipeGeo, mat);
        pipeGroup.add(pipe);

        // Add valves and joints
        const jointGeo = new THREE.SphereGeometry(0.7, 16, 16);
        const joint = new THREE.Mesh(jointGeo, steel);
        joint.position.set(r2 * Math.cos(angle), 10, r2 * Math.sin(angle));
        pipeGroup.add(joint);

        if (i % 2 !== 0) {
            animatedPipes.push({ mesh: pipe, phase: i, speed: 0.05 });
        }
    }
    
    group.add(pipeGroup);
    parts.push({
        name: "Cryogenic_Transfer_Lines",
        description: "Heavy-duty, vacuum-jacketed transfer lines piping liquid helium and nitrogen from external dewars into the cryostat.",
        material: "chrome, neonBlue, steel",
        function: "Maintains the immense cooling power required to operate the superconducting magnet and radiation shields.",
        assemblyOrder: 8,
        connections: ["Thermal_Radiation_Shields", "Superconducting_Solenoid"],
        failureEffect: "Ice blockages form inside pipes, exploding tubes due to rapid expansion of liquid to gas.",
        cascadeFailures: ["Thermal_Radiation_Shields", "OVC_Vacuum_Vessel"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -35}
    });

    // ==========================================
    // 9. VIBRATION ISOLATION SUSPENSION
    // ==========================================
    const isoGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + (Math.PI/4);
        
        // Massive pneumatic leg
        const legBaseGeo = new THREE.CylinderGeometry(2.5, 3, 10, 32);
        const legBase = new THREE.Mesh(legBaseGeo, darkSteel);
        legBase.position.set(22 * Math.cos(angle), -25, 22 * Math.sin(angle));
        isoGroup.add(legBase);

        const pistonGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.set(22 * Math.cos(angle), -15, 22 * Math.sin(angle));
        isoGroup.add(piston);
        animatedPistons.push({ mesh: piston, baseY: -15, phase: i });

        // Damping accordion bellows (Rubber)
        const bellowGeo = new THREE.CylinderGeometry(2.2, 2.2, 8, 32, 20);
        const positionAttribute = bellowGeo.attributes.position;
        for (let j = 0; j < positionAttribute.count; j++) {
            const y = positionAttribute.getY(j);
            const rOffset = Math.sin(y * 10) * 0.3;
            const x = positionAttribute.getX(j);
            const z = positionAttribute.getZ(j);
            const len = Math.sqrt(x*x + z*z);
            positionAttribute.setX(j, x + (x/len)*rOffset);
            positionAttribute.setZ(j, z + (z/len)*rOffset);
        }
        bellowGeo.computeVertexNormals();
        const bellow = new THREE.Mesh(bellowGeo, rubber);
        bellow.position.set(22 * Math.cos(angle), -15, 22 * Math.sin(angle));
        isoGroup.add(bellow);
    }

    group.add(isoGroup);
    parts.push({
        name: "Pneumatic_Vibration_Isolators",
        description: "Active-feedback pneumatic air legs with piezoelectric dampeners.",
        material: "darkSteel, chrome, rubber",
        function: "Isolates the haloscope from seismic noise and building vibrations which would cause microphonic heating of the cavity.",
        assemblyOrder: 9,
        connections: ["OVC_Vacuum_Vessel"],
        failureEffect: "Microphonic noise injects kinetic energy into the cavity tuning rods, mimicking a photon signal and drowning real data.",
        cascadeFailures: ["Haloscope_Resonant_Cavity"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // ==========================================
    // 10. PIEZOELECTRIC TUNING MOTORS
    // ==========================================
    const motorGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const motorBoxGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
        const motorBox = new THREE.Mesh(motorBoxGeo, aluminum);
        const r = 2.0;
        motorBox.position.set(r * Math.cos(angle), 10, r * Math.sin(angle));
        motorGroup.add(motorBox);

        const gearGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 20);
        const gear = new THREE.Mesh(gearGeo, steel);
        gear.position.set(r * Math.cos(angle), 11.2, r * Math.sin(angle));
        gear.rotation.x = Math.PI / 2;
        motorGroup.add(gear);
        animatedGears.push({ mesh: gear, speed: 0.1 * (i%2===0?1:-1) });
    }
    group.add(motorGroup);
    parts.push({
        name: "Piezoelectric_Tuning_System",
        description: "Cryogenic stepper motors using piezoelectric slip-stick mechanisms to rotate the internal sapphire tuning rods.",
        material: "aluminum, steel",
        function: "Scans the resonant frequency of the cavity through the microwave spectrum to search for the exact axion mass.",
        assemblyOrder: 10,
        connections: ["Haloscope_Resonant_Cavity"],
        failureEffect: "Motors freeze at 10mK. Cavity is permanently stuck at one frequency, ending the search across the parameter space.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: -15}
    });

    // ==========================================
    // 11. MICROWAVE DATA READOUT BUS
    // ==========================================
    const busGroup = new THREE.Group();
    for(let i=0; i<36; i++) {
        const angle = (i/36) * Math.PI * 2;
        const r = 11;
        const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 50, 8);
        const wire = new THREE.Mesh(wireGeo, copper);
        wire.position.set(r * Math.cos(angle), 0, r * Math.sin(angle));
        busGroup.add(wire);

        const glowNode = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), neonPurple);
        glowNode.position.set(r * Math.cos(angle), 25, r * Math.sin(angle));
        busGroup.add(glowNode);
        animatedDisplays.push(glowNode);
    }
    group.add(busGroup);
    parts.push({
        name: "Data_Readout_Bus",
        description: "Extensive array of semi-rigid coaxial cables carrying microwave signals, thermometry, and motor control telemetry.",
        material: "copper, neonPurple",
        function: "Bridges the cryogenic quantum regime with room-temperature classical electronics.",
        assemblyOrder: 11,
        connections: ["Quantum_Amplifier_JPA", "Control_Panel"],
        failureEffect: "Data corruption. The single axion photon signature is lost in transmission line reflections.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: 15, z: 20}
    });

    // ==========================================
    // 12. AXION DARK MATTER FIELD VISUALIZATION
    // ==========================================
    const axionGroup = new THREE.Group();
    const particleCount = 2000;
    const axionGeo = new THREE.BufferGeometry();
    const axionPos = new Float32Array(particleCount * 3);
    const axionPhases = new Float32Array(particleCount);

    for(let i=0; i<particleCount; i++) {
        const r = Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 80;
        
        axionPos[i*3] = r * Math.cos(theta);
        axionPos[i*3+1] = y;
        axionPos[i*3+2] = r * Math.sin(theta);
        axionPhases[i] = Math.random() * Math.PI * 2;
    }

    axionGeo.setAttribute('position', new THREE.BufferAttribute(axionPos, 3));
    axionGeo.setAttribute('phase', new THREE.BufferAttribute(axionPhases, 1));
    
    // Using a custom point material or points for performance
    const axionMat = new THREE.PointsMaterial({
        color: 0xaa00ff,
        size: 0.3,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        map: createParticleTexture(), // Assuming canvas texture generation
        depthWrite: false
    });

    const axionSystem = new THREE.Points(axionGeo, axionMat);
    axionGroup.add(axionSystem);
    animatedAxions.push(axionSystem);
    
    group.add(axionGroup);
    parts.push({
        name: "Axion_Dark_Matter_Halo",
        description: "Visualization of the invisible, ubiquitous galactic dark matter halo permeating the Earth and the experiment.",
        material: "darkMatterAura (Points)",
        function: "The theorized source particle that couples to electromagnetism via the anomaly.",
        assemblyOrder: 12,
        connections: ["Haloscope_Resonant_Cavity"],
        failureEffect: "If axions do not make up dark matter, or are outside the mass range, this machine detects absolutely nothing forever.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -40, z: 0}
    });

    // ==========================================
    // 13. CONVERTED PHOTON EMITTER (INSIDE CAVITY)
    // ==========================================
    const photonGroup = new THREE.Group();
    const pCount = 50;
    const photonGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const photonInstanced = new THREE.InstancedMesh(photonGeo, photonGlow, pCount);
    
    const dummy = new THREE.Object3D();
    for(let i=0; i<pCount; i++) {
        dummy.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 6
        );
        dummy.updateMatrix();
        photonInstanced.setMatrixAt(i, dummy.matrix);
    }
    photonGroup.add(photonInstanced);
    animatedPhotons.push(photonInstanced);
    group.add(photonGroup);

    parts.push({
        name: "Primakoff_Photon_Sparks",
        description: "Visual bursts representing single axions converting into microwave photons inside the cavity.",
        material: "photonGlow",
        function: "The detectable signal resulting from inverse Primakoff scattering in a strong magnetic field.",
        assemblyOrder: 13,
        connections: ["Haloscope_Resonant_Cavity", "Superconducting_Solenoid"],
        failureEffect: "N/A - Physical phenomenon.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 25, y: 15, z: 0}
    });

    // ==========================================
    // 14. CONTROL PANEL & DIAGNOSTICS
    // ==========================================
    const panelGroup = new THREE.Group();
    const panelMainGeo = new THREE.BoxGeometry(10, 8, 2);
    const panelMain = new THREE.Mesh(panelMainGeo, darkSteel);
    panelMain.position.set(0, 30, 15);
    panelMain.rotation.x = -Math.PI / 8;
    panelGroup.add(panelMain);

    // Screens
    for(let i=0; i<3; i++) {
        const screenGeo = new THREE.PlaneGeometry(2.5, 2);
        const screen = new THREE.Mesh(screenGeo, neonRed);
        screen.position.set(-3 + (i*3), 30.5, 16.1);
        screen.rotation.x = -Math.PI / 8;
        panelGroup.add(screen);
        animatedDisplays.push(screen);
    }
    
    // Dials and buttons
    for(let i=0; i<10; i++) {
        const btnGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
        const btn = new THREE.Mesh(btnGeo, (i%3===0)?neonBlue:chrome);
        btn.position.set(-4 + i, 28, 15.6);
        btn.rotation.x = Math.PI / 2 - Math.PI / 8;
        panelGroup.add(btn);
    }

    group.add(panelGroup);
    parts.push({
        name: "Control_and_Diagnostic_Panel",
        description: "Displays real-time cavity temperature, magnetic field strength, lock-in amplifier states, and dark matter exclusion limits.",
        material: "darkSteel, neonRed, neonBlue",
        function: "Human-machine interface for PhD researchers monitoring the run.",
        assemblyOrder: 14,
        connections: ["Data_Readout_Bus"],
        failureEffect: "Loss of telemetry. Researchers are flying blind while a highly volatile 14T magnet operates.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 35, z: 30}
    });

    // ==========================================
    // 15. SUPERFLUID HELIUM PUMPS
    // ==========================================
    const pumpGroup = new THREE.Group();
    for(let i=0; i<2; i++) {
        const pumpBodyGeo = new THREE.CylinderGeometry(3, 3, 6, 32);
        const pumpBody = new THREE.Mesh(pumpBodyGeo, chrome);
        const xPos = i === 0 ? 18 : -18;
        pumpBody.position.set(xPos, -20, -10);
        pumpBody.rotation.x = Math.PI / 2;
        pumpGroup.add(pumpBody);

        const impellerGeo = new THREE.TorusGeometry(2, 0.5, 16, 8);
        const impeller = new THREE.Mesh(impellerGeo, neonBlue);
        impeller.position.set(xPos, -20, -7);
        pumpGroup.add(impeller);
        animatedGears.push({ mesh: impeller, speed: 0.5 });
    }
    group.add(pumpGroup);
    parts.push({
        name: "Superfluid_Helium_Roots_Pumps",
        description: "Massive Roots blower pumps that circulate Helium-3 and pull a vacuum on the Helium-4 1K pot to initiate cooling.",
        material: "chrome, neonBlue",
        function: "Provides the immense gas throughput required for the dilution refrigerator.",
        assemblyOrder: 15,
        connections: ["Dilution_Refrigerator", "Cryogenic_Transfer_Lines"],
        failureEffect: "Pumps trip. Circulation stops. Cryostat warms up immediately, ending the dark matter run.",
        cascadeFailures: ["Dilution_Refrigerator"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: -20, z: -20}
    });

    // ==========================================
    // 16. MAGNETIC FIELD LINES VISUALIZER
    // ==========================================
    const magFieldGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const r = 2 + Math.random() * 5;
        const curvePoints = [];
        for(let j=0; j<=40; j++) {
            const t = j / 40;
            // Magnetic field loops out and back
            const y = (t - 0.5) * 100;
            const spread = Math.cosh(y / 20) * r;
            const angle = (i / 20) * Math.PI * 2;
            curvePoints.push(new THREE.Vector3(spread * Math.cos(angle), y, spread * Math.sin(angle)));
        }
        const bFieldGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePoints), 64, 0.1, 8, false);
        const bFieldMat = new THREE.MeshStandardMaterial({
            color: 0x00ffcc,
            emissive: 0x00ffcc,
            emissiveIntensity: 2,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const bField = new THREE.Mesh(bFieldGeo, bFieldMat);
        magFieldGroup.add(bField);
        magneticFieldLines.push({ mesh: bField, offset: Math.random() * Math.PI });
    }
    group.add(magFieldGroup);
    parts.push({
        name: "Magnetic_Field_Lines",
        description: "Holographic representation of the 14 Tesla static magnetic field lines generated by the solenoid.",
        material: "plasmaField",
        function: "The transverse B-field breaks the symmetry allowing the axion to couple to two photons (one virtual from the B-field, one real in the cavity).",
        assemblyOrder: 16,
        connections: ["Superconducting_Solenoid"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // ==========================================
    // 17. VAPOR VENTING SYSTEM
    // ==========================================
    const ventGroup = new THREE.Group();
    const ventStackGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
    const ventStack = new THREE.Mesh(ventStackGeo, steel);
    ventStack.position.set(10, 32.5, -10);
    ventGroup.add(ventStack);
    
    // Vapor particles
    const vaporCount = 500;
    const vaporGeo = new THREE.BufferGeometry();
    const vaporPos = new Float32Array(vaporCount * 3);
    for(let i=0; i<vaporCount; i++) {
        vaporPos[i*3] = 10 + (Math.random()-0.5)*2;
        vaporPos[i*3+1] = 40 + Math.random()*20;
        vaporPos[i*3+2] = -10 + (Math.random()-0.5)*2;
    }
    vaporGeo.setAttribute('position', new THREE.BufferAttribute(vaporPos, 3));
    const vaporMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.1,
        depthWrite: false
    });
    const vaporMesh = new THREE.Points(vaporGeo, vaporMat);
    ventGroup.add(vaporMesh);
    cryoVapors.push(vaporMesh);
    
    group.add(ventGroup);
    parts.push({
        name: "Cryogenic_Blow-off_Vent",
        description: "Pressure relief stack. Exhausts boiled-off helium gas to prevent pressure vessel explosion.",
        material: "steel, volumetric particles",
        function: "Safety pressure regulation for the cryogenic bath.",
        assemblyOrder: 17,
        connections: ["OVC_Vacuum_Vessel"],
        failureEffect: "Ice plug in the vent. Catastrophic overpressure rupture of the cryostat.",
        cascadeFailures: ["OVC_Vacuum_Vessel"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: 20, z: -10}
    });

    // ==========================================
    // Helper to make particle texture for Points
    // ==========================================
    function createParticleTexture() {
        if (typeof document === 'undefined') return null; // Fallback for environments without DOM
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }

    // ==========================================
    // ANIMATION LOOP (EXTREME COMPLEXITY)
    // ==========================================
    function animate(time, speed, meshes) {
        // 1. Spin gears and pumps
        animatedGears.forEach(g => {
            g.mesh.rotation.z += g.speed * speed * 0.1;
        });

        // 2. Pulse pneumatic pistons
        animatedPistons.forEach(p => {
            p.mesh.position.y = p.baseY + Math.sin(time * 0.002 + p.phase) * 0.5;
        });

        // 3. Fluid flow in cryogenic pipes
        animatedPipes.forEach(p => {
            // Emulate flowing cold fluid by pulsing emissive intensity
            const intensity = 1 + Math.sin(time * 0.005 * speed + p.phase) * 0.8;
            if (p.mesh.material.emissiveIntensity !== undefined) {
                p.mesh.material.emissiveIntensity = intensity;
            }
        });

        // 4. Move tuning rods inside cavity
        tuningRods.forEach((rod, index) => {
            // Slow scan up and down
            const yOff = Math.sin(time * 0.0005 * speed + index) * 5;
            rod.mesh.position.y = yOff;
            rod.mesh.rotation.y = time * 0.001 * speed;
        });

        // 5. Axion Dark Matter Field Flow (Swirling fluid-like motion)
        animatedAxions.forEach(ax => {
            const positions = ax.geometry.attributes.position.array;
            const phases = ax.geometry.attributes.phase.array;
            for(let i=0; i<positions.length; i+=3) {
                // Swirl around Y axis, slowly drift down
                const x = positions[i];
                const z = positions[i+2];
                const r = Math.sqrt(x*x + z*z);
                let theta = Math.atan2(z, x);
                theta += 0.01 * speed * (40 / (r+1)); // Faster in center
                
                positions[i] = r * Math.cos(theta);
                positions[i+2] = r * Math.sin(theta);
                
                positions[i+1] -= 0.1 * speed;
                if (positions[i+1] < -40) {
                    positions[i+1] = 40;
                }
            }
            ax.geometry.attributes.position.needsUpdate = true;
        });

        // 6. Photon generation (bursts when 'axion' converts)
        animatedPhotons.forEach(ph => {
            if (ph.isInstancedMesh) {
                const matrix = new THREE.Matrix4();
                const position = new THREE.Vector3();
                for(let i=0; i<ph.count; i++) {
                    ph.getMatrixAt(i, matrix);
                    position.setFromMatrixPosition(matrix);
                    
                    // Jitter and fade
                    position.x += (Math.random()-0.5)*0.1 * speed;
                    position.y += (Math.random()-0.5)*0.1 * speed;
                    position.z += (Math.random()-0.5)*0.1 * speed;
                    
                    // Keep inside cavity
                    if (position.length() > 3.8) position.set(0,0,0);
                    
                    matrix.setPosition(position);
                    // Scale pulsing
                    const sc = 1 + Math.sin(time*0.01 + i)*0.5;
                    matrix.elements[0] = sc; matrix.elements[5] = sc; matrix.elements[10] = sc;
                    
                    ph.setMatrixAt(i, matrix);
                }
                ph.instanceMatrix.needsUpdate = true;
            } else {
                // The main mode plasma field pulsing
                ph.material.opacity = 0.2 + Math.sin(time * 0.01 * speed) * 0.1;
                ph.scale.x = 1 + Math.sin(time * 0.02 * speed) * 0.02;
                ph.scale.z = 1 + Math.sin(time * 0.02 * speed) * 0.02;
            }
        });

        // 7. Status displays blinking
        animatedDisplays.forEach((disp, i) => {
            if(disp.material && disp.material.emissive) {
                // Randomly change color or intensity to simulate data processing
                if(Math.random() > 0.95) {
                    disp.material.emissiveIntensity = 2 + Math.random() * 3;
                    if(disp.material.color.getHex() === 0xff0022) {
                        disp.material.color.setHex(Math.random() > 0.5 ? 0xff0022 : 0x00ff00);
                    }
                }
            }
        });

        // 8. Magnetic Field Lines undulating
        magneticFieldLines.forEach(line => {
            line.mesh.material.opacity = 0.2 + Math.sin(time * 0.002 * speed + line.offset) * 0.1;
            line.mesh.rotation.y = time * 0.0001 * speed;
        });

        // 9. Venting Cryo Vapor
        cryoVapors.forEach(vapor => {
            const positions = vapor.geometry.attributes.position.array;
            for(let i=0; i<positions.length; i+=3) {
                positions[i+1] += 0.2 * speed; // move up
                positions[i] += (Math.random()-0.5)*0.1 * speed; // spread
                positions[i+2] += (Math.random()-0.5)*0.1 * speed; // spread
                
                // reset if too high
                if(positions[i+1] > 60) {
                    positions[i+1] = 40;
                    positions[i] = 10 + (Math.random()-0.5)*2;
                    positions[i+2] = -10 + (Math.random()-0.5)*2;
                }
            }
            vapor.geometry.attributes.position.needsUpdate = true;
        });
    }

    const description = "The God-Tier Axion Dark Matter Capacitor (Haloscope). An immensely complex piece of ultra-cryogenic machinery designed to detect the invisible dark matter holding galaxies together. By immersing a tunable microwave cavity in a 14-Tesla magnetic field, at temperatures a fraction of a degree above absolute zero, it attempts to force axions to decay into detectable microwave photons via the Primakoff effect.";

    const quizQuestions = [
        {
            question: "In an axion haloscope, the Primakoff effect is utilized to convert dark matter axions into detectable microwave photons. If the axion mass (m_a) is 10^-5 eV, what is the approximate resonant frequency required for the microwave cavity?",
            options: ["~2.4 GHz", "~14 GHz", "~100 MHz", "~500 THz"],
            answer: 0,
            explanation: "E = mc^2 = hf. An axion mass of 10^-5 eV corresponds to a frequency f = E/h ~ (10^-5 eV) / (4.136 x 10^-15 eV*s) ≈ 2.4 GHz, which lies in the microwave radio band."
        },
        {
            question: "Why is a dilution refrigerator operating at ~10 millikelvin absolutely critical for the detection of axion-induced photons in a macroscopic microwave cavity?",
            options: [
                "To suppress the blackbody thermal photon background to well below one photon per cavity mode.",
                "To increase the structural integrity of the copper cavity against magnetic crushing forces.",
                "To prevent the axions from boiling off before they can be trapped.",
                "To make the piezomotors run faster due to zero friction."
            ],
            answer: 0,
            explanation: "At temperatures like 4K, thermal noise (kT) generates thousands of blackbody photons in the microwave regime. At 10 mK, kT << hf, meaning the thermal photon occupation number approaches zero, allowing a single axion-generated photon to stand out."
        },
        {
            question: "The conversion power of axions to photons in a cavity is proportional to B^2 * V * C * Q_L. What does the form factor 'C' represent in this context?",
            options: [
                "The spatial overlap integral between the external static magnetic field and the cavity's resonant mode electric field.",
                "The capacitance of the external readout electronics.",
                "The concentration of axions in the local galactic dark matter halo.",
                "The cooling capacity of the dilution refrigerator."
            ],
            answer: 0,
            explanation: "The form factor 'C' measures how well the external magnetic field aligns with the electric field of the specific TM (Transverse Magnetic) cavity mode being used. Maximizing this overlap maximizes the conversion rate."
        },
        {
            question: "Quantum noise limit in linear amplifiers (like JPA or TWPA) dictates a minimum added noise of half a photon. How can squeezed states of the electromagnetic field bypass this standard quantum limit in axion searches?",
            options: [
                "By reducing the variance in the measured quadrature at the expense of increasing noise in the orthogonal unmeasured quadrature.",
                "By freezing the amplifier to exactly absolute zero, removing all quantum fluctuations.",
                "By using a completely non-magnetic amplifier casing.",
                "By spinning the tuning rods at relativistic speeds to blue-shift the noise."
            ],
            answer: 0,
            explanation: "Heisenberg's Uncertainty Principle allows squeezing: ΔX1 * ΔX2 ≥ ħ/2. You can 'squeeze' the noise in the phase quadrature you are measuring (ΔX1 → 0) as long as you let the conjugate quadrature (ΔX2) become extremely noisy."
        },
        {
            question: "If a 'Hidden-Photon' dark matter candidate was targeted instead of an axion, how would the fundamental design of this haloscope's primary magnetic field change?",
            options: [
                "The 14-Tesla external superconducting magnet would be completely unnecessary and could be removed.",
                "The magnetic field would need to be reversed in polarity every 10 seconds.",
                "An alternating AC magnetic field would be required instead of a static DC field.",
                "The magnet would need to be made of iron instead of niobium-tin."
            ],
            answer: 0,
            explanation: "Unlike axions, hidden photons (dark photons) couple directly to standard electromagnetic fields via kinetic mixing without needing an external magnetic field to trigger the conversion. The massive magnet would be useless."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
