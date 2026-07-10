import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom emissive materials for plasma and lasers
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const sparkMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.8
    });

    const indicatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0
    });

    // 1. Central Chamber (LatheGeometry)
    const chamberPoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const r = 5 + Math.sin(t * Math.PI) * 2;
        const y = (t - 0.5) * 10;
        chamberPoints.push(new THREE.Vector2(r, y));
    }
    const chamberGeo = new THREE.LatheGeometry(chamberPoints, 64);
    const chamber = new THREE.Mesh(chamberGeo, steel);
    chamber.position.set(0, 15, 0);
    
    // Add flanges to chamber
    const flangeGeo = new THREE.TorusGeometry(5.2, 0.5, 16, 64);
    const topFlange = new THREE.Mesh(flangeGeo, chrome);
    topFlange.position.set(0, 20, 0);
    topFlange.rotation.x = Math.PI / 2;
    chamber.add(topFlange);

    const bottomFlange = new THREE.Mesh(flangeGeo, chrome);
    bottomFlange.position.set(0, 10, 0);
    bottomFlange.rotation.x = Math.PI / 2;
    chamber.add(bottomFlange);

    group.add(chamber);

    parts.push({
        name: "Central Target Chamber",
        description: "A massive, vacuum-sealed spherical-cylindrical chamber forged from high-tensile steel, designed to withstand extreme electromagnetic forces and radiation bursts.",
        material: "Steel / Chrome",
        function: "Houses the cathode-anode assembly and provides the vacuum environment necessary for pure plasma formation without atmospheric contamination.",
        assemblyOrder: 1,
        connections: ["SupportStructure", "CathodeAnodeAssembly", "DiagnosticPorts"],
        failureEffect: "Vacuum breach, causing immediate atmospheric plasma dispersion and catastrophic shockwave.",
        cascadeFailures: ["DiagnosticPorts", "PlasmaColumn"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 2. High Voltage Capacitor Banks (Primary)
    const primaryCapGroup = new THREE.Group();
    const numCaps = 36;
    for (let i = 0; i < numCaps; i++) {
        const angle = (i / numCaps) * Math.PI * 2;
        const capGeo = new THREE.CylinderGeometry(1, 1, 8, 32);
        const cap = new THREE.Mesh(capGeo, aluminum);
        const r = 18;
        cap.position.set(Math.cos(angle) * r, 4, Math.sin(angle) * r);
        
        // Cap detailing
        const capTopGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
        const capTop = new THREE.Mesh(capTopGeo, copper);
        capTop.position.set(0, 4.25, 0);
        cap.add(capTop);

        const capRingGeo = new THREE.TorusGeometry(1.05, 0.1, 8, 32);
        const capRing = new THREE.Mesh(capRingGeo, rubber);
        capRing.position.set(0, 0, 0);
        capRing.rotation.x = Math.PI / 2;
        cap.add(capRing);

        primaryCapGroup.add(cap);
    }
    primaryCapGroup.position.set(0, 0, 0);
    group.add(primaryCapGroup);

    parts.push({
        name: "Primary Capacitor Bank",
        description: "An array of 36 high-voltage, low-inductance capacitors arranged radially to minimize transmission distance.",
        material: "Aluminum / Copper",
        function: "Stores massive amounts of electrical energy, discharging it in nanoseconds to power the Z-pinch effect.",
        assemblyOrder: 2,
        connections: ["SparkGaps", "TransmissionLines"],
        failureEffect: "Asymmetric discharge, causing magnetic instabilities in the pinch.",
        cascadeFailures: ["PlasmaColumn", "SparkGaps"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 3. High Voltage Capacitor Banks (Secondary)
    const secondaryCapGroup = new THREE.Group();
    const numSecCaps = 72;
    for (let i = 0; i < numSecCaps; i++) {
        const angle = (i / numSecCaps) * Math.PI * 2;
        const capGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
        const cap = new THREE.Mesh(capGeo, darkSteel);
        const r = 24;
        cap.position.set(Math.cos(angle) * r, 3, Math.sin(angle) * r);
        
        // Indicator light on each secondary cap
        const indGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const ind = new THREE.Mesh(indGeo, indicatorMaterial);
        ind.position.set(0, 3.1, 0);
        cap.add(ind);

        secondaryCapGroup.add(cap);
    }
    group.add(secondaryCapGroup);

    parts.push({
        name: "Secondary Energy Storage Array",
        description: "A secondary outer ring of 72 capacitors used to pre-ionize the target before the main discharge.",
        material: "Dark Steel",
        function: "Delivers a precisely timed pre-pulse to shape the plasma column and ensure a uniform implosion.",
        assemblyOrder: 3,
        connections: ["PrimaryCapacitorBank", "ControlConsole"],
        failureEffect: "Poor plasma uniformity, leading to reduced peak density.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 4. Transmission Lines (Marx Generators)
    const transmissionGroup = new THREE.Group();
    for (let i = 0; i < numCaps; i++) {
        const angle = (i / numCaps) * Math.PI * 2;
        const r1 = 18;
        const r2 = 7;
        const h1 = 8;
        const h2 = 15;

        class CustomCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.cos(angle) * (r1 * (1 - t) + r2 * t);
                const tz = Math.sin(angle) * (r1 * (1 - t) + r2 * t);
                const ty = h1 * (1 - t) + h2 * t;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        
        const path = new CustomCurve();
        const lineGeo = new THREE.TubeGeometry(path, 20, 0.3, 12, false);
        const line = new THREE.Mesh(lineGeo, copper);
        
        // Insulator rings along the tube
        for(let j=1; j<5; j++) {
            const t = j/5;
            const pt = path.getPoint(t);
            const insGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
            const insulator = new THREE.Mesh(insGeo, rubber);
            insulator.position.copy(pt);
            
            // Safe lookAt implementation avoiding collinear vector issues
            const nextT = Math.min(t + 0.1, 1);
            if (nextT > t) {
                 const nextPt = path.getPoint(nextT);
                 if (nextPt.distanceTo(pt) > 0.001) {
                     insulator.lookAt(nextPt);
                 }
            }
            line.add(insulator);
        }

        transmissionGroup.add(line);
    }
    group.add(transmissionGroup);

    parts.push({
        name: "Radial Transmission Lines",
        description: "Massive copper conduits wrapped in ribbed rubber insulators, converging from the capacitors to the central chamber.",
        material: "Copper / Rubber",
        function: "Channels the multi-terawatt electrical pulse from the capacitors directly into the cathode with minimal inductance.",
        assemblyOrder: 4,
        connections: ["PrimaryCapacitorBank", "CathodeAnodeAssembly"],
        failureEffect: "Electrical arcing to ground, destroying equipment and stopping the pinch.",
        cascadeFailures: ["PrimaryCapacitorBank", "SparkGaps"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 5. Cathode-Anode Assembly (Lathe)
    const electrodePoints = [];
    electrodePoints.push(new THREE.Vector2(0, 0));
    electrodePoints.push(new THREE.Vector2(3, 0));
    electrodePoints.push(new THREE.Vector2(2, 2));
    electrodePoints.push(new THREE.Vector2(0.5, 4));
    electrodePoints.push(new THREE.Vector2(0, 4));

    const electrodeGeo = new THREE.LatheGeometry(electrodePoints, 64);
    
    const anode = new THREE.Mesh(electrodeGeo, chrome);
    anode.position.set(0, 16, 0); // pointing up
    group.add(anode);

    const cathode = new THREE.Mesh(electrodeGeo, chrome);
    cathode.position.set(0, 14, 0);
    cathode.rotation.x = Math.PI; // pointing down
    group.add(cathode);

    parts.push({
        name: "Cathode-Anode Cones",
        description: "Precision-machined tungsten and chrome conical electrodes located at the very center of the vacuum chamber.",
        material: "Chrome / Tungsten",
        function: "Focuses the electrical discharge across the target gap, instantly vaporizing the target material into plasma.",
        assemblyOrder: 5,
        connections: ["CentralChamber", "TransmissionLines", "PlasmaColumn"],
        failureEffect: "Electrode melting and pitting, resulting in asymmetrical pinches.",
        cascadeFailures: ["PlasmaColumn"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 15 }
    });

    // 6. Dense Plasma Column (Z-Pinch)
    const plasmaGroup = new THREE.Group();
    plasmaGroup.position.set(0, 15, 0);

    const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
    const plasmaCore = new THREE.Mesh(coreGeo, plasmaMaterial);
    plasmaGroup.add(plasmaCore);

    const outerGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.2, 32);
    const plasmaOuter = new THREE.Mesh(outerGeo, new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.4
    }));
    plasmaGroup.add(plasmaOuter);
    
    group.add(plasmaGroup);

    parts.push({
        name: "Plasma Column (Z-Pinch)",
        description: "The immensely hot and dense column of plasma created by the massive current pulse, pinched by its own induced magnetic field.",
        material: "Plasma (Emissive)",
        function: "Reaches temperatures exceeding the core of the sun, producing intense X-rays and potentially facilitating nuclear fusion.",
        assemblyOrder: 6,
        connections: ["CathodeAnodeAssembly"],
        failureEffect: "Instabilities (sausage or kink instabilities) disrupt the column before peak compression.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 7. Diagnostic Ports
    const diagGroup = new THREE.Group();
    diagGroup.position.set(0, 15, 0);
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const portGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
        const port = new THREE.Mesh(portGeo, steel);
        port.rotation.x = Math.PI / 2;
        port.rotation.z = angle;
        port.position.set(Math.cos(angle) * 5.5, 0, Math.sin(angle) * 5.5);
        port.lookAt(0, 15, 0);

        const lensGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const lens = new THREE.Mesh(lensGeo, glass);
        lens.position.set(0, 1, 0);
        port.add(lens);

        // Fiber optic cables leaving port
        const cableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 3, 2),
            new THREE.Vector3(0, 5, 5)
        ]), 16, 0.1, 8, false);
        const cable = new THREE.Mesh(cableGeo, plastic);
        port.add(cable);

        diagGroup.add(port);
    }
    group.add(diagGroup);

    parts.push({
        name: "Diagnostic Viewports & Sensors",
        description: "Extruded steel ports fitted with ultra-pure quartz glass, connected to fiber-optic cables and spectrometers.",
        material: "Steel / Quartz Glass / Plastic",
        function: "Measures X-ray yield, plasma temperature, and records high-speed interferometry of the pinch dynamics.",
        assemblyOrder: 7,
        connections: ["CentralChamber", "ControlConsole"],
        failureEffect: "Loss of telemetry data, making experimental results unreadable.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: -15 }
    });

    // 8. Vacuum Pumps (Turbo-molecular)
    const pumpGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        const pumpBase = new THREE.Group();
        
        const p1Geo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
        const p1 = new THREE.Mesh(p1Geo, darkSteel);
        p1.position.set(0, 1.5, 0);
        pumpBase.add(p1);

        const p2Geo = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
        const p2 = new THREE.Mesh(p2Geo, aluminum);
        p2.position.set(0, 4, 0);
        pumpBase.add(p2);

        // fins
        for(let j=0; j<10; j++) {
            const finGeo = new THREE.BoxGeometry(3.2, 0.1, 3.2);
            const fin = new THREE.Mesh(finGeo, steel);
            fin.position.set(0, 1 + j*0.2, 0);
            pumpBase.add(fin);
        }

        pumpBase.position.set(Math.cos(angle) * 8, 5, Math.sin(angle) * 8);
        pumpBase.lookAt(0, 5, 0);
        pumpGroup.add(pumpBase);

        // connect to chamber
        const pipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        pipe.position.set(Math.cos(angle) * 4, 10, Math.sin(angle) * 4);
        pipe.rotation.z = Math.PI / 4 * (Math.cos(angle)); 
        pipe.rotation.x = Math.PI / 4 * (Math.sin(angle));
        pipe.lookAt(pumpBase.position);
        pumpGroup.add(pipe);
    }
    group.add(pumpGroup);

    parts.push({
        name: "Turbo-Molecular Vacuum Pumps",
        description: "High-speed multi-stage turbine pumps with advanced cooling fins, arrayed around the lower chamber base.",
        material: "Dark Steel / Aluminum",
        function: "Evacuates the chamber to ultra-high vacuum levels (10^-7 Torr) to prevent atmospheric breakdown before the pinch.",
        assemblyOrder: 8,
        connections: ["CentralChamber"],
        failureEffect: "Contamination of the plasma, resulting in low X-ray yield and excessive arcing.",
        cascadeFailures: ["PlasmaColumn"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 15, y: 5, z: 15 }
    });

    // 9. Cooling System Pipes
    const coolingGroup = new THREE.Group();
    const coolCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(10, 0, 10),
        new THREE.Vector3(12, 10, 5),
        new THREE.Vector3(5, 12, 0),
        new THREE.Vector3(12, 10, -5),
        new THREE.Vector3(10, 0, -10)
    ]);
    const coolGeo = new THREE.TubeGeometry(coolCurve, 64, 0.4, 16, false);
    const coolMesh = new THREE.Mesh(coolGeo, copper);
    coolingGroup.add(coolMesh);

    const coolCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, -10),
        new THREE.Vector3(-12, 10, -5),
        new THREE.Vector3(-5, 12, 0),
        new THREE.Vector3(-12, 10, 5),
        new THREE.Vector3(-10, 0, 10)
    ]);
    const coolGeo2 = new THREE.TubeGeometry(coolCurve2, 64, 0.4, 16, false);
    const coolMesh2 = new THREE.Mesh(coolGeo2, copper);
    coolingGroup.add(coolMesh2);

    group.add(coolingGroup);

    parts.push({
        name: "Cryogenic Cooling Manifold",
        description: "Intricate network of copper tubing circulating liquid nitrogen around the highest-current components.",
        material: "Copper",
        function: "Prevents thermal degradation of the transmission lines and insulators during rapid firing sequences.",
        assemblyOrder: 9,
        connections: ["TransmissionLines", "CentralChamber"],
        failureEffect: "Overheating of transmission lines, increasing resistance and lowering pinch power.",
        cascadeFailures: ["TransmissionLines"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 }
    });

    // 10. Control Console
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, 0, 30);
    
    const deskGeo = new THREE.BoxGeometry(6, 3, 2);
    const desk = new THREE.Mesh(deskGeo, darkSteel);
    desk.position.set(0, 1.5, 0);
    consoleGroup.add(desk);

    const screenGeo = new THREE.BoxGeometry(5, 2.5, 0.2);
    const screen = new THREE.Mesh(screenGeo, tinted);
    screen.position.set(0, 4, -0.5);
    screen.rotation.x = -Math.PI / 8;
    consoleGroup.add(screen);

    const kbGeo = new THREE.BoxGeometry(2, 0.1, 0.8);
    const kb = new THREE.Mesh(kbGeo, plastic);
    kb.position.set(0, 3.05, 0.5);
    kb.rotation.x = Math.PI / 16;
    consoleGroup.add(kb);

    const joyBaseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16);
    const joyBase = new THREE.Mesh(joyBaseGeo, steel);
    joyBase.position.set(2, 3.1, 0.5);
    consoleGroup.add(joyBase);

    const joyStickGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const joyStick = new THREE.Mesh(joyStickGeo, chrome);
    joyStick.position.set(2, 3.5, 0.5);
    consoleGroup.add(joyStick);

    const joyTopGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const joyTop = new THREE.Mesh(joyTopGeo, rubber);
    joyTop.position.set(2, 3.9, 0.5);
    consoleGroup.add(joyTop);
    
    // glowing buttons
    for(let i=0; i<5; i++){
        const btnGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
        const btn = new THREE.Mesh(btnGeo, indicatorMaterial);
        btn.position.set(-2 + i*0.2, 3.1, 0.3);
        consoleGroup.add(btn);
    }

    group.add(consoleGroup);

    parts.push({
        name: "Operator Control Console",
        description: "A secure, shielded workstation featuring tinted glass telemetry displays, ergonomic joysticks, and arming switches.",
        material: "Dark Steel / Tinted Glass / Plastic",
        function: "Allows the chief physicist to monitor capacitor charge levels, vacuum state, and initiate the firing sequence.",
        assemblyOrder: 10,
        connections: ["SecondaryEnergyStorageArray", "DiagnosticPorts"],
        failureEffect: "Inability to trigger the device or monitor abort conditions.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 30 },
        explodedPosition: { x: 0, y: 0, z: 45 }
    });

    // 11. Support Structure Lattice
    const supportGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.position.set(Math.cos(angle) * 12, 10, Math.sin(angle) * 12);
        supportGroup.add(pillar);

        // cross beams
        const crossGeo = new THREE.CylinderGeometry(0.4, 0.4, 12, 16);
        const cross = new THREE.Mesh(crossGeo, steel);
        cross.position.set(Math.cos(angle + Math.PI/6) * 10.4, 15, Math.sin(angle + Math.PI/6) * 10.4);
        cross.rotation.y = -(angle + Math.PI/6);
        cross.rotation.z = Math.PI / 2;
        supportGroup.add(cross);
    }
    
    const baseRingGeo = new THREE.TorusGeometry(12, 1, 16, 64);
    const baseRing = new THREE.Mesh(baseRingGeo, steel);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.set(0, 0.5, 0);
    supportGroup.add(baseRing);

    group.add(supportGroup);

    parts.push({
        name: "Heavy Steel Support Lattice",
        description: "Hexagonal array of massive steel pillars and cross-beams bolted to a reinforced concrete foundation.",
        material: "Steel",
        function: "Absorbs the extreme mechanical shockwaves generated during the electromagnetic implosion, keeping optics aligned.",
        assemblyOrder: 11,
        connections: ["CentralChamber", "TransmissionLines"],
        failureEffect: "Structural collapse under magnetic pressure, causing complete catastrophic destruction.",
        cascadeFailures: ["CentralChamber", "TransmissionLines", "PrimaryCapacitorBank"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // 12. Spark Gaps (Switches)
    const sparkGapGroup = new THREE.Group();
    for (let i = 0; i < numCaps; i++) {
        const angle = (i / numCaps) * Math.PI * 2;
        const r = 14;
        const sg = new THREE.Group();
        
        const housingGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16);
        const housing = new THREE.Mesh(housingGeo, plastic);
        housing.rotation.x = Math.PI / 2;
        
        const sphereGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const s1 = new THREE.Mesh(sphereGeo, chrome);
        s1.position.set(0, 0, -0.4);
        housing.add(s1);

        const s2 = new THREE.Mesh(sphereGeo, chrome);
        s2.position.set(0, 0, 0.4);
        housing.add(s2);

        sg.add(housing);
        sg.position.set(Math.cos(angle) * r, 6, Math.sin(angle) * r);
        sg.lookAt(0, 6, 0);

        sparkGapGroup.add(sg);
    }
    group.add(sparkGapGroup);

    parts.push({
        name: "Gas-Insulated Spark Gaps",
        description: "Pressurized SF6 gas chambers containing heavy chrome spherical electrodes.",
        material: "Plastic / Chrome",
        function: "Acts as ultra-fast, ultra-high voltage switches. When triggered, gas breaks down, closing the circuit in sub-nanoseconds.",
        assemblyOrder: 12,
        connections: ["PrimaryCapacitorBank", "TransmissionLines"],
        failureEffect: "Pre-fire or jitter (timing mismatch) destroying implosion symmetry.",
        cascadeFailures: ["PlasmaColumn"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // 13. Magnetic Confinement Coils
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 15, 0);
    for (let i = -1; i <= 1; i += 2) {
        const coilGeo = new THREE.TorusGeometry(6, 0.8, 32, 64);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.rotation.x = Math.PI / 2;
        coil.position.set(0, i * 4, 0);
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    parts.push({
        name: "Helmholtz Magnetic Coils",
        description: "Massive solid copper torus coils flanking the top and bottom of the chamber.",
        material: "Copper",
        function: "Generates a strong axial magnetic field to stabilize the plasma column against magnetohydrodynamic (MHD) instabilities.",
        assemblyOrder: 13,
        connections: ["CentralChamber"],
        failureEffect: "Rapid sausage/kink instability development, halting the pinch.",
        cascadeFailures: ["PlasmaColumn"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 14. Arcing Effects (Hidden initially, shown on animate)
    const arcGroup = new THREE.Group();
    const arcs = [];
    for (let i = 0; i < 15; i++) {
        const points = [];
        let cur = new THREE.Vector3((Math.random()-0.5)*10, 10 + (Math.random()-0.5)*10, (Math.random()-0.5)*10);
        points.push(cur.clone());
        for (let j = 0; j < 5; j++) {
            cur.add(new THREE.Vector3((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3));
            points.push(cur.clone());
        }
        const arcCurve = new THREE.CatmullRomCurve3(points);
        const arcGeo = new THREE.TubeGeometry(arcCurve, 16, 0.05, 8, false);
        const arcMesh = new THREE.Mesh(arcGeo, sparkMaterial);
        arcMesh.visible = false;
        arcGroup.add(arcMesh);
        arcs.push(arcMesh);
    }
    group.add(arcGroup);

    parts.push({
        name: "Parasitic Arcing Phenomena",
        description: "Uncontrolled electrical discharges jumping across insulators and air gaps due to massive electromagnetic stress.",
        material: "Emissive Energy",
        function: "An unwanted but visually spectacular side-effect of discharging terawatts of power in a confined space.",
        assemblyOrder: 14,
        connections: ["SparkGaps", "TransmissionLines"],
        failureEffect: "Excessive arcing drains energy from the main pinch and damages surrounding equipment.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 15. Radiation Shielding Cages
    const shieldGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI*2;
        
        const shape = new THREE.Shape();
        shape.moveTo(-3, 0);
        shape.lineTo(3, 0);
        shape.lineTo(3, 20);
        shape.lineTo(-3, 20);
        shape.lineTo(-3, 0);
        
        const holePath = new THREE.Path();
        holePath.moveTo(-2, 2);
        holePath.lineTo(2, 2);
        holePath.lineTo(2, 18);
        holePath.lineTo(-2, 18);
        holePath.lineTo(-2, 2);
        shape.holes.push(holePath);

        const extrudeSettings = { depth: 0.2, bevelEnabled: false };
        const panelGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const panel = new THREE.Mesh(panelGeo, darkSteel);
        
        const wireGeo = new THREE.PlaneGeometry(4, 16, 10, 40);
        const wireMesh = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true }));
        wireMesh.position.set(0, 10, 0.1);
        panel.add(wireMesh);

        panel.position.set(Math.cos(angle) * 30, 0, Math.sin(angle) * 30);
        panel.lookAt(0, 10, 0);
        shieldGroup.add(panel);
    }
    group.add(shieldGroup);

    parts.push({
        name: "Neutron/X-Ray Shielding Cage",
        description: "Outer perimeter walls comprised of lead-lined dark steel panels and faraday cage wire mesh.",
        material: "Dark Steel / Lead",
        function: "Protects operators and sensitive electronics from intense Bremsstrahlung X-rays and EMP pulses generated by the pinch.",
        assemblyOrder: 15,
        connections: ["SupportStructure"],
        failureEffect: "Lethal radiation exposure to operators and total destruction of localized electronics via EMP.",
        cascadeFailures: ["ControlConsole"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 16. Maintenance Walkways
    const walkwayGroup = new THREE.Group();
    const walkGeo = new THREE.RingGeometry(18, 22, 32);
    const walkway = new THREE.Mesh(walkGeo, steel);
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.set(0, 8, 0);
    
    const railGeo = new THREE.TorusGeometry(21.5, 0.1, 8, 64);
    const rail = new THREE.Mesh(railGeo, darkSteel);
    rail.rotation.x = Math.PI / 2;
    rail.position.set(0, 9, 0);
    walkwayGroup.add(rail);

    for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const post = new THREE.Mesh(postGeo, darkSteel);
        post.position.set(Math.cos(angle) * 21.5, 8.5, Math.sin(angle) * 21.5);
        walkwayGroup.add(post);
    }

    walkwayGroup.add(walkway);
    group.add(walkwayGroup);

    parts.push({
        name: "Elevated Maintenance Walkway",
        description: "Perforated steel grating ring circling the machine, complete with safety railings.",
        material: "Steel",
        function: "Provides access for technicians to service spark gaps and diagnostic ports without scaling the capacitor banks.",
        assemblyOrder: 16,
        connections: ["SupportStructure"],
        failureEffect: "Tripping hazards for technicians.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    const description = "The Z-Pinch Plasma Device is an ultra-high-tech, multi-terawatt pulsed-power generator. By rapidly discharging immense capacitor banks through a cylindrical target, it uses the Lorentz force to instantly implode the target into an incredibly dense, sun-hot plasma column (the 'pinch'). This process generates massive bursts of X-rays and is a crucial pathway toward controlled nuclear fusion and high-energy-density physics research.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Turbo-Molecular Vacuum Pumps?",
            options: [
                "To circulate cryogenic cooling fluid",
                "To evacuate the chamber to ultra-high vacuum levels",
                "To pump plasma into the spark gaps",
                "To pressurize the transmission lines"
            ],
            correctAnswer: 1,
            explanation: "Turbo-molecular pumps are used to achieve ultra-high vacuum in the central chamber, preventing premature electrical breakdown with atmospheric gases."
        },
        {
            question: "Why are the Primary Capacitor Banks arranged radially in a circle?",
            options: [
                "To look aesthetically pleasing",
                "To minimize transmission distance and inductance",
                "To prevent them from overheating",
                "To make room for the control console"
            ],
            correctAnswer: 1,
            explanation: "Radial arrangement minimizes the distance energy must travel, drastically reducing inductance so the capacitors can discharge their multi-terawatt load in nanoseconds."
        },
        {
            question: "What phenomenon threatens to disrupt the Plasma Column during peak compression?",
            options: [
                "Sausage or kink magnetohydrodynamic (MHD) instabilities",
                "Capacitor overcharging",
                "Radiation shielding degradation",
                "Vacuum pump cavitation"
            ],
            correctAnswer: 0,
            explanation: "The plasma column is highly unstable; minor perturbations grow rapidly into 'sausage' or 'kink' MHD instabilities that break the column apart."
        },
        {
            question: "What role do the Helmholtz Magnetic Coils play?",
            options: [
                "They store electrical energy",
                "They cool the transmission lines",
                "They generate an axial magnetic field to stabilize the plasma",
                "They shield the operators from EMP"
            ],
            correctAnswer: 2,
            explanation: "Helmholtz coils produce a steady axial magnetic field, which helps suppress plasma instabilities and prolongs the life of the pinch."
        },
        {
            question: "How do the Spark Gaps function in this device?",
            options: [
                "They generate the primary X-rays",
                "They measure plasma temperature",
                "They act as ultra-fast, high-voltage switches",
                "They connect the vacuum pumps to the chamber"
            ],
            correctAnswer: 2,
            explanation: "Filled with pressurized SF6 gas, the spark gaps act as precision switches. Breaking down the gas closes the circuit in sub-nanoseconds."
        }
    ];

    let timeAcc = 0;
    
    function animate(time, speed, meshes) {
        timeAcc += speed * 0.01;
        
        // Pulse plasma column based on a rapid sine wave
        const plasmaPulse = (Math.sin(timeAcc * 20) + 1) / 2; // 0 to 1
        plasmaCore.scale.set(1 + plasmaPulse * 0.5, 1, 1 + plasmaPulse * 0.5);
        plasmaOuter.scale.set(1 + plasmaPulse * 1.2, 1, 1 + plasmaPulse * 1.2);
        plasmaMaterial.emissiveIntensity = 5.0 + plasmaPulse * 10.0;
        
        // Random arcing effect around the spark gaps and transmission lines
        arcs.forEach(arc => {
            if (Math.random() > 0.95 && plasmaPulse > 0.8) {
                arc.visible = true;
                arc.rotation.y = Math.random() * Math.PI;
                arc.position.y = (Math.random() - 0.5) * 5;
            } else {
                arc.visible = false;
            }
        });

        // Blinking indicator lights on secondary capacitors
        secondaryCapGroup.children.forEach((cap, index) => {
            const ind = cap.children[0];
            if (ind && ind.material) {
                const phase = (index % 10) / 10;
                ind.material.emissiveIntensity = (Math.sin(timeAcc * 5 + phase * Math.PI * 2) > 0) ? 3.0 : 0.5;
            }
        });
        
        // Console buttons blinking
        consoleGroup.children.forEach(child => {
            if(child.geometry && child.geometry.type === 'CylinderGeometry' && child.material === indicatorMaterial){
                child.material.emissiveIntensity = Math.random() > 0.5 ? 2.0 : 0;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createZPinch() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
