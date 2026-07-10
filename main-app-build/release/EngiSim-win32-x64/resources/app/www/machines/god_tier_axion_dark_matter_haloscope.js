import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // ============================================================================
    // ANIMATION CONTEXT & STATE
    // ============================================================================
    const animCtx = {
        time: 0,
        gears: [],
        tuningRods: [],
        magneticFieldLines: [],
        axions: [],
        photons: [],
        heliumFlows: [],
        valves: [],
        sensors: [],
        compressorFans: [],
        liquidNitrogen: [],
        vacuumPumps: []
    };

    // ============================================================================
    // ADVANCED CUSTOM MATERIALS
    // ============================================================================
    const matSuperconductor = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a24, metalness: 0.95, roughness: 0.3 
    });
    const matCryoGold = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, metalness: 1.0, roughness: 0.1 
    });
    const matOFHCCopper = new THREE.MeshStandardMaterial({ 
        color: 0xb87333, metalness: 0.9, roughness: 0.15 
    });
    const matSapphire = new THREE.MeshPhysicalMaterial({ 
        color: 0xaaccff, transmission: 0.95, opacity: 1, metalness: 0, roughness: 0.01, ior: 1.76, thickness: 2.0 
    });
    const matNbTi = new THREE.MeshStandardMaterial({ 
        color: 0x778899, metalness: 0.8, roughness: 0.5 
    });
    const matG10 = new THREE.MeshStandardMaterial({ 
        color: 0x112211, roughness: 0.9, metalness: 0.1 
    });
    const matTeflon = new THREE.MeshStandardMaterial({
        color: 0xffffff, roughness: 0.7, metalness: 0.05
    });
    const matMLI = new THREE.MeshStandardMaterial({ // Multi-Layer Insulation
        color: 0xffaa00, metalness: 0.6, roughness: 0.8, side: THREE.DoubleSide
    });
    
    // Emissive / Energy Materials
    const matFieldLine = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, side: THREE.DoubleSide 
    });
    const matAxion = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending 
    });
    const matPhoton = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending 
    });
    const matHeliumLiquid = new THREE.MeshPhysicalMaterial({ 
        color: 0xcceeff, transmission: 0.8, transparent: true, opacity: 0.4, roughness: 0.1 
    });
    const matNeonIndicator = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0 
    });

    // ============================================================================
    // HELPER FUNCTIONS (PROCEDURAL GEOMETRY)
    // ============================================================================

    function addPart(mesh, name, desc, matName, func, order, conn, failEff, cascade, origPos) {
        mesh.position.copy(origPos);
        mesh.userData = { 
            name, 
            originalPosition: origPos.clone(), 
            explodedPosition: origPos.clone().multiplyScalar(1.5).add(new THREE.Vector3(0, Math.random()*5, 0))
        };
        group.add(mesh);
        parts.push({
            name, description: desc, material: matName, function: func,
            assemblyOrder: order, connections: conn, failureEffect: failEff, cascadeFailures: cascade,
            originalPosition: mesh.userData.originalPosition, 
            explodedPosition: mesh.userData.explodedPosition
        });
    }

    function createFlange(innerRadius, outerRadius, thickness, numHoles, holeRadius, mat) {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        shape.holes.push(holePath);
        for(let i = 0; i < numHoles; i++) {
            const angle = (i / numHoles) * Math.PI * 2;
            const hx = Math.cos(angle) * (innerRadius + (outerRadius - innerRadius) / 2);
            const hy = Math.sin(angle) * (innerRadius + (outerRadius - innerRadius) / 2);
            const boltHole = new THREE.Path();
            boltHole.absarc(hx, hy, holeRadius, 0, Math.PI * 2, true);
            shape.holes.push(boltHole);
        }
        const extSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
        const geo = new THREE.ExtrudeGeometry(shape, extSettings);
        geo.center();
        return new THREE.Mesh(geo, mat);
    }

    function createBoltRing(radius, count, boltRadius, boltLength, mat, yOffset) {
        const ringGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const boltGeo = new THREE.CylinderGeometry(boltRadius, boltRadius, boltLength, 6);
            const bolt = new THREE.Mesh(boltGeo, mat);
            bolt.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
            
            // Add bolt head
            const head = new THREE.Mesh(new THREE.CylinderGeometry(boltRadius * 1.5, boltRadius * 1.5, boltLength * 0.2, 6), mat);
            head.position.y = boltLength / 2;
            bolt.add(head);
            
            ringGroup.add(bolt);
        }
        return ringGroup;
    }

    function createBellows(radius, length, convolutions, mat) {
        const points = [];
        const numPoints = convolutions * 4;
        for (let i = 0; i <= numPoints; i++) {
            const y = (i / numPoints) * length - length / 2;
            const r = radius + (i % 2 === 0 ? 0 : radius * 0.15);
            points.push(new THREE.Vector2(r, y));
        }
        const geo = new THREE.LatheGeometry(points, 32);
        return new THREE.Mesh(geo, mat);
    }

    function createHeliumLine(points, radius, mat) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 64, radius, 8, false);
        return new THREE.Mesh(geo, mat);
    }

    function createHeatExchanger(width, height, depth, numFins, mat) {
        const hexGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
        hexGroup.add(base);
        const finDepth = depth * 1.5;
        const finWidth = width / numFins * 0.5;
        for(let i = 0; i < numFins; i++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(finWidth, height * 0.9, finDepth), mat);
            fin.position.set(-width/2 + (i + 0.5) * (width/numFins), 0, finDepth/2 - depth/2);
            hexGroup.add(fin);
        }
        return hexGroup;
    }

    function createSMAConnector(matOuter, matInner) {
        const smaGroup = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16), matOuter);
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), matInner);
        const dielectric = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.31, 16), matTeflon);
        smaGroup.add(body);
        smaGroup.add(pin);
        smaGroup.add(dielectric);
        return smaGroup;
    }

    // ============================================================================
    // COMPONENT ASSEMBLY: OUTER VACUUM CHAMBER (OVC)
    // ============================================================================
    const ovcGroup = new THREE.Group();
    
    // Main OVC Body
    for (let i = 0; i < 4; i++) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 4.0, 64, 1, true), steel);
        cyl.position.y = i * 4 - 6;
        ovcGroup.add(cyl);
        
        // Massive Flanges connecting OVC sections
        const flange = createFlange(4.9, 5.3, 0.2, 48, 0.06, steel);
        flange.rotation.x = Math.PI / 2;
        flange.position.y = i * 4 - 4;
        ovcGroup.add(flange);
        
        // Add bolt rings to flanges
        const bolts = createBoltRing(5.1, 48, 0.05, 0.4, darkSteel, i * 4 - 4);
        ovcGroup.add(bolts);
    }
    
    // OVC Top Dome
    const topDomeGeo = new THREE.SphereGeometry(5.0, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(topDomeGeo, steel);
    topDome.position.y = 10;
    ovcGroup.add(topDome);
    
    // OVC Base Plate
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.5, 64), steel);
    basePlate.position.y = -8;
    ovcGroup.add(basePlate);

    addPart(ovcGroup, "Outer Vacuum Chamber (OVC)", "Maintains extreme high vacuum (~10^-9 Torr) for cryogenic insulation, preventing convective heat leak.", "316LN Stainless Steel", "Thermal Isolation & Structural Integrity", 1, ["Room Environment", "Radiation Shields"], "Total loss of vacuum, catastrophic thermal crash", ["Quench", "Cavity Heating"], new THREE.Vector3(0, 0, 0));

    // ============================================================================
    // COMPONENT ASSEMBLY: THERMAL SHIELDS & MLI
    // ============================================================================
    const shieldGroup = new THREE.Group();
    
    // LN2 Shield (77K)
    const ln2Shield = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 17, 64, 1, true), matMLI);
    ln2Shield.position.y = 1;
    shieldGroup.add(ln2Shield);
    
    // LN2 Cooling Tubes
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 17, 8), copper);
        tube.position.set(Math.cos(angle)*4.65, 1, Math.sin(angle)*4.65);
        shieldGroup.add(tube);
    }

    // LHe Shield (4K)
    const lheShield = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 16, 64, 1, true), matOFHCCopper);
    lheShield.position.y = 1;
    shieldGroup.add(lheShield);

    addPart(shieldGroup, "Cryogenic Radiation Shields", "Intercepts room-temperature blackbody radiation using MLI and actively cooled copper.", "Copper / Aluminized Mylar", "Radiative Thermal Shielding", 2, ["OVC", "Dilution Refrigerator"], "Increased heat load, base temperature rise", ["Helium Boil-off"], new THREE.Vector3(0, 0, 0));

    // ============================================================================
    // COMPONENT ASSEMBLY: DILUTION REFRIGERATOR (THE CORE COOLING)
    // ============================================================================
    const drGroup = new THREE.Group();
    
    const plateConfigs = [
        { temp: "50K", radius: 3.8, y: 8, thickness: 0.3 },
        { temp: "4K", radius: 3.5, y: 5, thickness: 0.3 },
        { temp: "1K (Still)", radius: 3.2, y: 2, thickness: 0.2 },
        { temp: "100mK (Cold Plate)", radius: 2.8, y: -1, thickness: 0.2 },
        { temp: "10mK (Mixing Chamber)", radius: 2.5, y: -4, thickness: 0.4 }
    ];

    for (let p = 0; p < plateConfigs.length; p++) {
        const config = plateConfigs[p];
        
        // The Plate itself
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(config.radius, config.radius, config.thickness, 64), matCryoGold);
        plate.position.y = config.y;
        drGroup.add(plate);
        
        // Add structural support pillars (G10 for low thermal conductivity) connecting to the plate above
        if (p > 0) {
            const prevConfig = plateConfigs[p-1];
            const drop = prevConfig.y - config.y;
            for(let s=0; s<8; s++) {
                const angle = (s/8)*Math.PI*2;
                const r = config.radius * 0.8;
                const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, drop, 16), matG10);
                strut.position.set(Math.cos(angle)*r, config.y + drop/2, Math.sin(angle)*r);
                drGroup.add(strut);
            }
        }

        // Add complex heat exchangers and step-down plumbing
        for (let h = 0; h < 6; h++) {
            const angle = (h/6)*Math.PI*2;
            const r = config.radius * 0.6;
            const hex = createHeatExchanger(0.3, 0.5, 0.3, 10, matOFHCCopper);
            hex.position.set(Math.cos(angle)*r, config.y + config.thickness/2 + 0.25, Math.sin(angle)*r);
            // Orient heat exchanger toward center
            hex.lookAt(new THREE.Vector3(0, hex.position.y, 0));
            drGroup.add(hex);
            
            // Connective plumbing down to next stage
            if (p < plateConfigs.length - 1) {
                const nextConfig = plateConfigs[p+1];
                const drop = config.y - nextConfig.y;
                
                // Helical plumbing for impedance and thermalization
                const helixPoints = [];
                for(let hp=0; hp<=50; hp++) {
                    const t = hp/50;
                    const hy = config.y - t * drop;
                    const hRad = 0.2;
                    const hx = Math.cos(angle)*r + Math.cos(t * Math.PI * 10) * hRad;
                    const hz = Math.sin(angle)*r + Math.sin(t * Math.PI * 10) * hRad;
                    helixPoints.push(new THREE.Vector3(hx, hy, hz));
                }
                const pipe = createHeliumLine(helixPoints, 0.02, matNbTi);
                drGroup.add(pipe);
                animCtx.heliumFlows.push(pipe);
            }
        }
    }
    
    // Add the Dilution Unit (Still to Mixing Chamber complex continuous exchanger)
    const dilUnitPoints = [];
    for(let d=0; d<=100; d++) {
        const t = d/100;
        const y = 2 - t * 6; // From Still (y=2) to Mixing Chamber (y=-4)
        const rad = 1.0;
        dilUnitPoints.push(new THREE.Vector3(Math.cos(t*Math.PI*20)*rad, y, Math.sin(t*Math.PI*20)*rad));
    }
    const dilUnit = createHeliumLine(dilUnitPoints, 0.1, matCryoGold);
    drGroup.add(dilUnit);

    addPart(drGroup, "3He/4He Dilution Refrigerator", "Achieves 10 mK continuous cooling via the phase separation and forced mixing of 3He into 4He.", "Gold-Plated Copper / G10 / Niobium", "Ultra-Cooling", 3, ["Shields", "Magnet", "Cavity"], "Loss of cooling power, rapid temperature spike", ["Amplifier Saturation", "Thermal Noise Overload"], new THREE.Vector3(0, 0, 0));


    // ============================================================================
    // COMPONENT ASSEMBLY: SUPERCONDUCTING MAGNET
    // ============================================================================
    const magGroup = new THREE.Group();
    
    // Magnet former (massive Titanium or Steel spool)
    const former = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 8.0, 64, 1, true), darkSteel);
    former.position.y = -8;
    magGroup.add(former);
    
    // Superconducting Coils
    // Instead of one solid block, we generate an array of coil rings for extreme detail
    const coilGeo = new THREE.TorusGeometry(2.1, 0.05, 16, 128);
    for (let w = 0; w < 150; w++) {
        const wind = new THREE.Mesh(coilGeo, matNbTi);
        wind.rotation.x = Math.PI / 2;
        wind.position.y = -11.9 + (w * 7.8 / 150);
        magGroup.add(wind);
    }
    
    // Magnet clamping structure (keeps coils from ripping apart due to Lorentz forces)
    for(let c=0; c<12; c++) {
        const angle = (c/12)*Math.PI*2;
        const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8.2, 0.4), aluminum);
        clamp.position.set(Math.cos(angle)*2.25, -8, Math.sin(angle)*2.25);
        clamp.lookAt(new THREE.Vector3(0, -8, 0));
        magGroup.add(clamp);
    }
    
    // Current Leads (bringing thousands of amps from room temp down to 4K)
    for(let cl=0; cl<2; cl++) {
        const leadPoints = [
            new THREE.Vector3(cl===0? 1.5 : -1.5, 8, 0),
            new THREE.Vector3(cl===0? 1.5 : -1.5, 5, 0),
            new THREE.Vector3(cl===0? 2.1 : -2.1, -4, 0)
        ];
        const lead = createHeliumLine(leadPoints, 0.1, matOFHCCopper);
        magGroup.add(lead);
    }

    addPart(magGroup, "8 Tesla Superconducting Solenoid", "Generates an immense, uniform magnetic field to trigger the inverse Primakoff conversion of Axions into Photons.", "Niobium-Titanium / Aluminum", "Magnetic Field Generation", 4, ["Dilution Refrigerator", "Cavity"], "Violent Quench event, massive Lorentz force release", ["Liquid Helium Boil-off", "Catastrophic Structural Failure"], new THREE.Vector3(0, 0, 0));


    // ============================================================================
    // COMPONENT ASSEMBLY: RESONANT MICROWAVE CAVITY
    // ============================================================================
    const cavGroup = new THREE.Group();
    
    // Cavity Barrel (Ultra-high Q factor OFHC Copper, polished to mirror finish)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6.0, 128, 1, true), matOFHCCopper);
    barrel.position.y = -8;
    cavGroup.add(barrel);
    
    // Cavity End Caps
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.2, 128), matOFHCCopper);
    topCap.position.y = -4.9;
    cavGroup.add(topCap);
    const botCap = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.2, 128), matOFHCCopper);
    botCap.position.y = -11.1;
    cavGroup.add(botCap);
    
    // Tuning Rods (Dielectric Sapphire to sweep resonant frequency without breaking TM010 mode symmetry)
    for(let t=0; t<2; t++) {
        const isSapphire = t === 0;
        const rodMat = isSapphire ? matSapphire : matOFHCCopper;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5.8, 64), rodMat);
        rod.position.set(t === 0 ? 0.6 : -0.6, -8, 0);
        cavGroup.add(rod);
        animCtx.tuningRods.push({ mesh: rod, phase: t * Math.PI, type: t });
        
        // Precision Stepper Motors and Gearboxes operating at 10mK
        const motorGroup = new THREE.Group();
        const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32), steel);
        motorBody.rotation.x = Math.PI/2;
        motorBody.position.set(t === 0 ? 0.6 : -0.6, -4.5, 0.4);
        motorGroup.add(motorBody);
        
        const gear = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32), darkSteel);
        gear.position.set(t === 0 ? 0.6 : -0.6, -4.5, 0);
        motorGroup.add(gear);
        animCtx.gears.push(gear);
        
        cavGroup.add(motorGroup);
    }
    
    // Tuning Drive Shafts extending to Mixing Chamber
    const driveShaft1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5, 16), matG10);
    driveShaft1.position.set(0.6, -2.75, 0.4);
    cavGroup.add(driveShaft1);
    const driveShaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5, 16), matG10);
    driveShaft2.position.set(-0.6, -2.75, 0.4);
    cavGroup.add(driveShaft2);
    
    // Main RF Coupling Antenna (Extracts the single photon)
    const mainAntenna = createSMAConnector(matCryoGold, matOFHCCopper);
    mainAntenna.position.set(0, -4.9, 0);
    cavGroup.add(mainAntenna);
    
    // Weak coupling port for calibration
    const calAntenna = createSMAConnector(matCryoGold, matOFHCCopper);
    calAntenna.position.set(1.0, -4.9, 0);
    cavGroup.add(calAntenna);

    addPart(cavGroup, "High-Q Resonant Microwave Cavity", "Tunes to specific microwave frequencies. The Form Factor maximizes overlap between the electric field of the TM010 mode and the external magnetic field.", "OFHC Copper / Sapphire", "Signal Resonator & Axion Capture", 5, ["Magnet", "Quantum Amplifier"], "Mode crossing, loss of Q-factor", ["Zero Sensitivity", "Scan Failure"], new THREE.Vector3(0, 0, 0));


    // ============================================================================
    // COMPONENT ASSEMBLY: QUANTUM ELECTRONICS (JPA) & CABLING
    // ============================================================================
    const quantGroup = new THREE.Group();
    
    // Multi-layer Magnetic Shielding for the JPA (Cryoperm + Superconducting Niobium)
    const jpaShield = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 64), matSuperconductor);
    jpaShield.position.set(0, -12.5, 0);
    quantGroup.add(jpaShield);
    
    // Inside the shield: The JPA Chip casing
    const jpaCasing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), matCryoGold);
    jpaCasing.position.set(0, -12.5, 0);
    quantGroup.add(jpaCasing);
    
    // Cryogenic Circulators & Isolators (Non-reciprocal devices to prevent amplifier noise from heating the cavity)
    for(let c=0; c<4; c++) {
        const circ = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32), matOFHCCopper);
        circ.rotation.x = Math.PI/2;
        // Arranged in a chain
        circ.position.set(0.8, -12.0 - c*0.3, 0);
        quantGroup.add(circ);
    }
    
    // Rigid Superconducting Coaxial Cabling (NbTi lines)
    // From Antenna to Circulators to JPA
    const rfPath1 = [
        new THREE.Vector3(0, -4.9, 0), // Antenna
        new THREE.Vector3(0, -4.0, 1.0),
        new THREE.Vector3(0.8, -11.0, 1.0),
        new THREE.Vector3(0.8, -12.0, 0.0) // First Circulator
    ];
    const rfLine1 = createHeliumLine(rfPath1, 0.03, matNbTi);
    quantGroup.add(rfLine1);
    
    const rfPath2 = [
        new THREE.Vector3(0.8, -12.9, 0), // Last Circulator
        new THREE.Vector3(0.8, -13.5, 0),
        new THREE.Vector3(0, -13.5, 0),
        new THREE.Vector3(0, -12.5, 0) // JPA
    ];
    const rfLine2 = createHeliumLine(rfPath2, 0.03, matNbTi);
    quantGroup.add(rfLine2);
    
    // Amplified signal line heading to room temperature HEMT
    const outPath = [
        new THREE.Vector3(0, -12.5, 0.2), // JPA Out
        new THREE.Vector3(-1.0, -12.5, 0.5),
        new THREE.Vector3(-1.0, 8.0, 0.5) // Up to room temp
    ];
    const outLine = createHeliumLine(outPath, 0.04, matNbTi);
    quantGroup.add(outLine);

    addPart(quantGroup, "Josephson Parametric Amplifier (JPA) Circuit", "Provides quantum-limited, phase-preserving amplification of the single microwave photon signal, operating at the Standard Quantum Limit.", "Niobium / Gold / Cryoperm", "Signal Amplification", 6, ["Cavity", "Readout Electronics"], "Quantum noise spikes, thermal back-action", ["False Negatives", "Loss of Signal-to-Noise Ratio"], new THREE.Vector3(0, 0, 0));


    // ============================================================================
    // COMPONENT ASSEMBLY: MASSIVE SENSOR ARRAY & TELEMETRY
    // ============================================================================
    const sensorGroup = new THREE.Group();
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xaa5500, roughness: 0.9, wireframe: true });
    
    // Distribute 300 RuO2 Thermometers and Hall Effect Sensors across the structure
    for (let k = 0; k < 300; k++) {
        // Fibonacci spiral distribution over the cylinder
        const y = 8 - (k / 300) * 22; // From y=8 to y=-14
        const radius = 2.4 + (k % 4) * 0.2;
        const theta = k * Math.PI * (3 - Math.sqrt(5)); // Golden angle
        
        const sx = Math.cos(theta) * radius;
        const sz = Math.sin(theta) * radius;
        
        const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), matCryoGold);
        sensor.position.set(sx, y, sz);
        sensorGroup.add(sensor);
        animCtx.sensors.push(sensor);
        
        // Create tangled wiring loom effect linking sensors to a central bus
        if (k % 5 === 0) {
            const wPath = [
                new THREE.Vector3(sx, y, sz),
                new THREE.Vector3(sx * 0.8, y, sz * 0.8),
                new THREE.Vector3(Math.cos(theta)*1.2, y, Math.sin(theta)*1.2),
                new THREE.Vector3(0, 8, 0) // Up to feedthrough
            ];
            const wire = createHeliumLine(wPath, 0.01, wireMat);
            sensorGroup.add(wire);
        }
    }

    addPart(sensorGroup, "Cryogenic Sensor & Telemetry Array", "Monitors temperature and magnetic field at 300 distinct points to ensure sub-millikelvin stability and magnet health.", "Gold / Copper Wire", "Diagnostics & Control", 7, ["Dilution Refrigerator", "Magnet"], "Loss of telemetry, blind operation", ["Inability to tune", "Unnoticed Quench"], new THREE.Vector3(0, 0, 0));


    // ============================================================================
    // COMPONENT ASSEMBLY: VISUAL EFFECTS (FIELDS & PARTICLES)
    // ============================================================================
    const fxGroup = new THREE.Group();
    
    // Magnetic Field Lines (Glowing Toroids representing the 8T field)
    for(let f = 0; f < 40; f++) {
        const fRad = 0.5 + f * 0.05;
        const fLineGeo = new THREE.TorusGeometry(fRad, 0.01, 8, 128);
        const fLine = new THREE.Mesh(fLineGeo, matFieldLine);
        fLine.rotation.x = Math.PI / 2;
        fLine.position.y = -8; // Centered on cavity/magnet
        fxGroup.add(fLine);
        animCtx.magneticFieldLines.push({ mesh: fLine, offset: f, baseRadius: fRad });
    }
    
    // Axion Particles (streaming through Earth)
    const axGeo = new THREE.SphereGeometry(0.04, 16, 16);
    for(let a = 0; a < 150; a++) {
        const axion = new THREE.Mesh(axGeo, matAxion);
        // Random positions inside the cavity volume
        axion.position.set((Math.random()-0.5)*2.5, -8 + (Math.random()-0.5)*5.5, (Math.random()-0.5)*2.5);
        fxGroup.add(axion);
        animCtx.axions.push({ mesh: axion, life: Math.random(), speed: 0.5 + Math.random() });
    }
    
    // Microwave Photon Burst (The converted signal)
    const photGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const photon = new THREE.Mesh(photGeo, matPhoton);
    photon.position.set(0, -8, 0);
    fxGroup.add(photon);
    animCtx.photons.push(photon);

    addPart(fxGroup, "Axion-Photon Conversion Event", "Visualizes the exceedingly rare interaction governed by the inverse Primakoff effect, where a dark matter axion interacts with the B-field to become a detectable photon.", "Quantum Energy", "Visualization", 8, ["Cavity", "Magnet"], "None", ["None"], new THREE.Vector3(0, 0, 0));


    // ============================================================================
    // ANIMATION LOOP (EXTREME COMPLEXITY)
    // ============================================================================
    const animate = (delta, speed, meshes) => {
        animCtx.time += speed * 0.01;
        
        // 1. Tuning Rods Sweeping
        // Rods revolve around the cavity center and spin on their axes to tune the resonant frequency
        animCtx.tuningRods.forEach(tr => {
            const sweepAngle = Math.sin(animCtx.time * 0.2 + tr.phase) * 1.5; // Sweep back and forth
            const radius = 0.7;
            tr.mesh.position.x = Math.cos(sweepAngle) * radius;
            tr.mesh.position.z = Math.sin(sweepAngle) * radius;
            // Spin
            tr.mesh.rotation.y = animCtx.time * 3.0;
        });
        
        // 2. Gears driving the tuning rods
        animCtx.gears.forEach((gear, i) => {
            const tr = animCtx.tuningRods[i];
            if (tr) {
                gear.position.x = tr.mesh.position.x;
                gear.position.z = tr.mesh.position.z;
                gear.rotation.y = -animCtx.time * 10.0; // Fast gear spin
            }
        });
        
        // 3. Magnetic Field Lines Pulsing
        animCtx.magneticFieldLines.forEach(fl => {
            const pulse = 1.0 + 0.03 * Math.sin(animCtx.time * 3.0 + fl.offset * 0.5);
            fl.mesh.scale.set(pulse, pulse, pulse);
            // Opacity wave propagating outward
            fl.mesh.material.opacity = 0.05 + 0.15 * Math.max(0, Math.sin(animCtx.time * 5.0 - fl.offset * 0.2));
        });
        
        // 4. Cryogenic Fluid Flow (Helium plumbing)
        animCtx.heliumFlows.forEach((pipe, i) => {
            // Simulate density fluctuations in the 3He/4He mixture
            pipe.material.opacity = 0.3 + 0.4 * Math.sin(animCtx.time * 8.0 + i);
        });

        // 5. Sensor Array Blinking
        animCtx.sensors.forEach((sensor, i) => {
            if (Math.random() > 0.98) {
                sensor.scale.set(1.5, 1.5, 1.5);
            } else {
                sensor.scale.lerp(new THREE.Vector3(1,1,1), 0.1);
            }
        });
        
        // 6. Quantum Event: Axion to Photon Conversion
        let conversionOccurred = false;
        animCtx.axions.forEach(ax => {
            // Axions stream downwards through the detector
            ax.life += speed * 0.01 * ax.speed;
            ax.mesh.position.y -= speed * 0.05 * ax.speed;
            
            // Reset position if it leaves cavity bounds
            if(ax.mesh.position.y < -11.0 || ax.life > 1.0) {
                ax.life = 0;
                ax.mesh.position.set((Math.random()-0.5)*2.5, -5.0, (Math.random()-0.5)*2.5);
                ax.mesh.material.opacity = 0.0; // Invisible normally
            }
            
            // EXACTLY at a specific point in the magnetic field, extremely rare conversion flash
            // We force one to convert periodically for visualization
            if (Math.abs(ax.life - 0.5) < 0.01 && Math.random() > 0.8) {
                ax.mesh.material.opacity = 1.0;
                ax.mesh.scale.set(4, 4, 4);
                conversionOccurred = true;
                
                // Align photon burst to this axion's position
                animCtx.photons[0].position.copy(ax.mesh.position);
            } else {
                // Fade out axion flash quickly
                ax.mesh.material.opacity *= 0.8;
                ax.mesh.scale.lerp(new THREE.Vector3(1,1,1), 0.2);
            }
        });
        
        // 7. Photon Burst Expansion
        if (conversionOccurred) {
            animCtx.photons[0].material.opacity = 1.0;
            animCtx.photons[0].scale.set(0.1, 0.1, 0.1);
        }
        // Expand and fade the photon representing microwave ringing in the cavity
        animCtx.photons[0].material.opacity *= 0.92;
        animCtx.photons[0].scale.addScalar(0.4 * speed);
    };

    // ============================================================================
    // METADATA & ACADEMIC QUIZ
    // ============================================================================
    const description = "The God Tier Axion Dark Matter Haloscope represents the absolute pinnacle of quantum metrology and cryogenic engineering. Housed within a massive 8 Tesla superconducting toroidal magnet and cooled by a custom 3He/4He continuous dilution refrigerator to an unfathomable 10 millikelvin, this monumental machine aims to detect the theoretical axion particle. Axions streaming through the Earth's dark matter halo interact with the intense magnetic field, converting into extremely faint single microwave photons via the inverse Primakoff effect. A high-Q tunable OFHC copper microwave cavity captures these photons, which are then amplified by a quantum-limited Josephson Parametric Amplifier (JPA) operating at the Standard Quantum Limit.";
    
    const quizQuestions = [
        {
            question: "In a haloscope, axions convert to photons via the inverse Primakoff effect. What determines the resonant frequency (ν) of the microwave cavity required to detect an axion of mass (m_a)?",
            options: [
                "ν = m_a c^2 / h",
                "ν = m_a v^2 / 2h",
                "ν = (m_a c^2 + 0.5 m_a v^2) / h",
                "ν = m_a c / (h λ)"
            ],
            correctAnswer: 2,
            explanation: "The total energy of the axion includes its rest mass energy and its kinetic energy derived from the velocity dispersion in the galactic halo. Thus, the photon energy is E = m_a c^2 + 1/2 m_a v^2 = hν."
        },
        {
            question: "What physical mechanism poses the primary bottleneck for continuous heat transfer between the 3He/4He mixture and the heat exchangers in the dilution refrigerator at 10 mK?",
            options: [
                "Viscous heating of 3He in the dilute phase",
                "Kapitza thermal boundary resistance",
                "The finite solubility of 3He in 4He at absolute zero",
                "Cosmic ray muon heating"
            ],
            correctAnswer: 1,
            explanation: "Kapitza resistance is a thermal boundary resistance between liquid helium and solid metals that scales inversely with T^3, becoming the dominant barrier to cooling at sub-millikelvin temperatures."
        },
        {
            question: "Assuming the Standard Halo Model for dark matter in the Milky Way, what is the expected fractional width (Δν/ν) of the resulting axion microwave signal?",
            options: [
                "~ 10^-3",
                "~ 10^-6",
                "~ 10^-9",
                "~ 10^-12"
            ],
            correctAnswer: 1,
            explanation: "The local dark matter velocity dispersion is v ~ 10^-3 c. The fractional energy spread is dominated by the kinetic energy divided by the rest mass, scaling as v^2/c^2 ~ 10^-6."
        },
        {
            question: "What is the fundamental Standard Quantum Limit (SQL) on the added noise of a phase-preserving linear amplifier (such as a HEMT or a standard JPA) used to read out the cavity signal?",
            options: [
                "Zero photons",
                "Half a quantum (hν / 2)",
                "One quantum (hν)",
                "hν / 4"
            ],
            correctAnswer: 1,
            explanation: "According to Caves' theorem, quantum mechanics dictates that any phase-preserving linear amplifier must add at least half a photon of noise (equivalent to the vacuum zero-point fluctuation energy) to the signal."
        },
        {
            question: "The haloscope scan rate is directly proportional to the cavity form factor (C). Which resonant mode is typically chosen because it maximizes the overlap integral with the external uniform solenoidal magnetic field?",
            options: [
                "TM_010",
                "TE_011",
                "TM_110",
                "TE_111"
            ],
            correctAnswer: 0,
            explanation: "The TM_010 mode is ideal because its electric field is aligned parallel to the external solenoidal magnetic field everywhere within the cavity volume, maximizing the axion-photon coupling integral (Form Factor C)."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
