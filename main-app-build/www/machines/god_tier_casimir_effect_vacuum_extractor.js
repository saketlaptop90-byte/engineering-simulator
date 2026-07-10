import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const anim = {
        wheels: [],
        plates: [],
        particles: [],
        pistons: [],
        gears: [],
        conduits: [],
        screens: [],
        booms: [],
        lights: [],
        rotors: [],
        fluids: [],
        hydraulicArms: [],
        energyCores: []
    };

    // ============================================================================
    // 1. CUSTOM HIGH-TECH & GLOWING MATERIALS
    // ============================================================================
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0088ff, emissiveIntensity: 5.0, metalness: 0.8, roughness: 0.2 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x6600ff, emissive: 0x8800ff, emissiveIntensity: 6.0, metalness: 0.7, roughness: 0.1 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff7700, emissiveIntensity: 4.0, metalness: 0.5, roughness: 0.3 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff55, emissive: 0x00ff88, emissiveIntensity: 5.5, metalness: 0.4, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0022, emissive: 0xff0044, emissiveIntensity: 5.0, metalness: 0.6, roughness: 0.1 });
    const plasmaCore = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10.0, transparent: true, opacity: 0.9 });
    const hyperGlass = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, metalness: 1.0, roughness: 0.0, envMapIntensity: 2.0 });
    const darkPlating = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.5 });
    const goldContacts = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.1 });
    const quantumResonatorMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, wireframe: true });
    
    anim.lights.push(neonBlue, neonPurple, neonOrange, neonGreen, neonRed, plasmaCore);

    // ============================================================================
    // 2. PROCEDURAL GEOMETRY UTILITIES
    // ============================================================================
    
    // Generates a highly detailed gear with specific teeth and profile
    const createGear = (radius, teeth, depth, holeRadius, material) => {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const a1 = i * step;
            const a2 = i * step + step / 4;
            const a3 = i * step + step / 2;
            const a4 = i * step + (3 * step) / 4;
            
            if (i === 0) shape.moveTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
            else shape.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
            
            shape.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
            shape.lineTo(Math.cos(a3) * (radius + depth), Math.sin(a3) * (radius + depth));
            shape.lineTo(Math.cos(a4) * (radius + depth), Math.sin(a4) * (radius + depth));
        }
        shape.closePath();
        
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(holePath);
        
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, material);
    };

    // Generates a complex pipe tracing a 3D path
    const createConduit = (points, radius, material) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 64, radius, 16, false);
        return new THREE.Mesh(geo, material);
    };

    // Generates a hydraulic piston assembly
    const createHydraulic = (baseLen, extLen, radius) => {
        const pGroup = new THREE.Group();
        
        // Base Cylinder
        const baseGeo = new THREE.CylinderGeometry(radius, radius, baseLen, 32);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.position.y = baseLen / 2;
        pGroup.add(baseMesh);
        
        // Extension Arm
        const armGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, extLen, 32);
        const armMesh = new THREE.Mesh(armGeo, chrome);
        armMesh.position.y = baseLen + (extLen / 2);
        pGroup.add(armMesh);
        
        // Connectors
        const connGeo = new THREE.SphereGeometry(radius * 1.5, 32, 32);
        const topConn = new THREE.Mesh(connGeo, steel);
        topConn.position.y = baseLen + extLen;
        pGroup.add(topConn);
        
        const botConn = new THREE.Mesh(connGeo, steel);
        botConn.position.y = 0;
        pGroup.add(botConn);
        
        anim.pistons.push({ group: pGroup, arm: armMesh, top: topConn, baseLen, extLen });
        return pGroup;
    };

    // ============================================================================
    // 3. COMPONENT GENERATION: MASSIVE CRAWLER BASE
    // ============================================================================
    const baseGroup = new THREE.Group();
    
    // Main Chassis Body (Complex Extrusion)
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-60, -30);
    chassisShape.lineTo(60, -30);
    chassisShape.lineTo(80, 0);
    chassisShape.lineTo(60, 30);
    chassisShape.lineTo(-60, 30);
    chassisShape.lineTo(-80, 0);
    chassisShape.closePath();
    
    // Inner cutout
    const chassisHole = new THREE.Path();
    chassisHole.moveTo(-40, -15);
    chassisHole.lineTo(40, -15);
    chassisHole.lineTo(55, 0);
    chassisHole.lineTo(40, 15);
    chassisHole.lineTo(-40, 15);
    chassisHole.lineTo(-55, 0);
    chassisHole.closePath();
    chassisShape.holes.push(chassisHole);
    
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 20, bevelEnabled: true, bevelSize: 2, bevelThickness: 2 });
    chassisGeo.center();
    const chassisMesh = new THREE.Mesh(chassisGeo, darkPlating);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = 20;
    baseGroup.add(chassisMesh);

    // Chassis Details (Rivets and Panel Lines)
    for (let i = -50; i <= 50; i += 10) {
        for (let j = -25; j <= 25; j += 10) {
            if (Math.abs(i) < 40 && Math.abs(j) < 15) continue; // skip hole
            const rivetGeo = new THREE.SphereGeometry(0.5, 8, 8);
            const rivet = new THREE.Mesh(rivetGeo, steel);
            rivet.position.set(i, 30.5, j);
            baseGroup.add(rivet);
        }
    }

    // ============================================================================
    // 4. COMPONENT GENERATION: HYPER-REALISTIC OFF-ROAD TIRES
    // ============================================================================
    const createWheel = (x, y, z) => {
        const wGroup = new THREE.Group();
        wGroup.position.set(x, y, z);
        
        // Complex Rim (Cylinder + Spokes)
        const rimGeo = new THREE.CylinderGeometry(12, 12, 10, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        wGroup.add(rim);

        // Intricate Spoke Arrays
        for(let s = 0; s < 24; s++) {
            const spokeGeo = new THREE.CylinderGeometry(0.5, 0.8, 12, 16);
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.z = (s / 24) * Math.PI * 2;
            spoke.position.z = 2; // Outer spokes
            rim.add(spoke);
            
            const spokeInner = new THREE.Mesh(spokeGeo, steel);
            spokeInner.rotation.z = (s / 24) * Math.PI * 2 + 0.1;
            spokeInner.position.z = -2; // Inner spokes
            rim.add(spokeInner);
        }
        
        // Inner Hub
        const hubGeo = new THREE.CylinderGeometry(4, 4, 12, 32);
        const hub = new THREE.Mesh(hubGeo, copper);
        hub.rotation.x = Math.PI / 2;
        wGroup.add(hub);
        
        // Tire Base
        const tireGeo = new THREE.TorusGeometry(14, 5, 32, 128);
        const tireBase = new THREE.Mesh(tireGeo, rubber);
        tireBase.rotation.x = Math.PI / 2;
        wGroup.add(tireBase);

        // Aggressive Treads (Hundreds of tiny extruded lugs)
        const lugCount = 180;
        const lugGeo = new THREE.BoxGeometry(11, 2, 2.5);
        for(let l = 0; l < lugCount; l++) {
            const angle = (l / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            const r = 18.5;
            lug.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
            lug.rotation.y = -angle;
            // Interlocking Chevron pattern
            if (l % 2 === 0) {
                lug.rotation.x = 0.4;
                lug.position.y = 1.5;
            } else {
                lug.rotation.x = -0.4;
                lug.position.y = -1.5;
            }
            tireBase.add(lug);
        }
        
        anim.wheels.push(wGroup);
        return wGroup;
    };

    // Add 8 Massive Wheels to Crawler
    const wheelPositions = [
        [-70, 15, -45], [70, 15, -45], [-70, 15, 45], [70, 15, 45],
        [-25, 15, -45], [25, 15, -45], [-25, 15, 45], [25, 15, 45]
    ];
    wheelPositions.forEach(pos => {
        baseGroup.add(createWheel(pos[0], pos[1], pos[2]));
    });

    // ============================================================================
    // 5. COMPONENT GENERATION: OPERATOR CABIN (INSANELY DETAILED)
    // ============================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 45, 35);
    
    // Cabin Shell
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-15, 0);
    cabinShape.lineTo(15, 0);
    cabinShape.lineTo(12, 20);
    cabinShape.lineTo(-12, 20);
    cabinShape.closePath();
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 25, bevelEnabled: true });
    cabinGeo.center();
    const cabinMesh = new THREE.Mesh(cabinGeo, darkPlating);
    cabinGroup.add(cabinMesh);

    // Tinted Windows
    const windowGeo = new THREE.PlaneGeometry(22, 16);
    const frontWindow = new THREE.Mesh(windowGeo, tinted);
    frontWindow.position.set(0, 2, 13);
    cabinGroup.add(frontWindow);
    
    const sideWindowGeo = new THREE.PlaneGeometry(22, 16);
    const leftWindow = new THREE.Mesh(sideWindowGeo, tinted);
    leftWindow.rotation.y = -Math.PI / 2;
    leftWindow.position.set(-14, 2, 0);
    cabinGroup.add(leftWindow);
    
    const rightWindow = new THREE.Mesh(sideWindowGeo, tinted);
    rightWindow.rotation.y = Math.PI / 2;
    rightWindow.position.set(14, 2, 0);
    cabinGroup.add(rightWindow);

    // Interior: Control Panels & Joysticks
    const panelGeo = new THREE.BoxGeometry(20, 5, 8);
    const panel = new THREE.Mesh(panelGeo, steel);
    panel.position.set(0, -5, 8);
    panel.rotation.x = -0.2;
    cabinGroup.add(panel);
    
    // Glowing Screens
    for(let i=0; i<5; i++) {
        const screenGeo = new THREE.PlaneGeometry(3, 2);
        const screen = new THREE.Mesh(screenGeo, i%2===0 ? neonBlue : neonOrange);
        screen.position.set(-8 + i*4, -3, 11.5);
        screen.rotation.x = -0.2;
        cabinGroup.add(screen);
        anim.screens.push(screen);
    }

    // Steering Wheel & Joysticks
    const steerGeo = new THREE.TorusGeometry(2, 0.3, 16, 32);
    const steeringWheel = new THREE.Mesh(steerGeo, rubber);
    steeringWheel.position.set(0, -2, 7);
    steeringWheel.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringWheel);
    
    const joystickBaseGeo = new THREE.SphereGeometry(1, 16, 16);
    const joystickArmGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const leftJoy = new THREE.Group();
    const leftJoyBase = new THREE.Mesh(joystickBaseGeo, darkSteel);
    const leftJoyArm = new THREE.Mesh(joystickArmGeo, steel);
    leftJoyArm.position.y = 1.5;
    leftJoy.add(leftJoyBase, leftJoyArm);
    leftJoy.position.set(-6, -4, 5);
    cabinGroup.add(leftJoy);

    const rightJoy = leftJoy.clone();
    rightJoy.position.set(6, -4, 5);
    cabinGroup.add(rightJoy);

    // Operator Seat
    const seatGeo = new THREE.BoxGeometry(6, 8, 6);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(0, -6, -2);
    cabinGroup.add(seat);

    // Side Mirrors
    const mirrorArmGeo = new THREE.CylinderGeometry(0.3, 0.3, 4);
    const mirrorBoxGeo = new THREE.BoxGeometry(1.5, 3, 0.5);
    const lMirrorArm = new THREE.Mesh(mirrorArmGeo, darkSteel);
    lMirrorArm.rotation.z = Math.PI / 4;
    lMirrorArm.position.set(-16, 2, 10);
    const lMirror = new THREE.Mesh(mirrorBoxGeo, chrome);
    lMirror.position.set(-17.5, 3.5, 10);
    cabinGroup.add(lMirrorArm, lMirror);
    
    const rMirrorArm = new THREE.Mesh(mirrorArmGeo, darkSteel);
    rMirrorArm.rotation.z = -Math.PI / 4;
    rMirrorArm.position.set(16, 2, 10);
    const rMirror = new THREE.Mesh(mirrorBoxGeo, chrome);
    rMirror.position.set(17.5, 3.5, 10);
    cabinGroup.add(rMirrorArm, rMirror);

    // Ladder to Cabin
    const ladderGroup = new THREE.Group();
    const ladderSideGeo = new THREE.CylinderGeometry(0.3, 0.3, 30);
    const lSide = new THREE.Mesh(ladderSideGeo, steel);
    lSide.position.set(-2.5, -15, 14);
    const rSide = new THREE.Mesh(ladderSideGeo, steel);
    rSide.position.set(2.5, -15, 14);
    ladderGroup.add(lSide, rSide);
    
    for(let r=0; r<15; r++) {
        const rungGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.rotation.z = Math.PI / 2;
        rung.position.set(0, -28 + r*2, 14);
        ladderGroup.add(rung);
    }
    cabinGroup.add(ladderGroup);
    baseGroup.add(cabinGroup);

    // ============================================================================
    // 6. COMPONENT GENERATION: CASIMIR CORE HOUSING & PLATES
    // ============================================================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 70, -10);

    // Outer Containment Sphere (Lathe)
    const pts = [];
    for ( let i = 0; i <= 20; i ++ ) {
        pts.push( new THREE.Vector2( Math.sin( i * 0.15 ) * 25, ( i - 10 ) * 3 ) );
    }
    const coreShellGeo = new THREE.LatheGeometry(pts, 64);
    const coreShell = new THREE.Mesh(coreShellGeo, hyperGlass);
    coreGroup.add(coreShell);

    // Dark Matter Stabilizer Rings (Multiple Torus arrays)
    for(let r=0; r<5; r++) {
        const ringGeo = new THREE.TorusGeometry(26 + r*3, 1, 32, 100);
        const ring = new THREE.Mesh(ringGeo, r%2===0 ? copper : steel);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = (r - 2) * 8;
        coreGroup.add(ring);
        anim.rotors.push({ mesh: ring, axis: 'y', speed: (r%2===0 ? 1 : -1) * 0.02 * (r+1) });
    }

    // Billions of microscopic plates represented macroscopically as 200 distinct layers
    const platesGroup = new THREE.Group();
    const plateCount = 200;
    const plateGeo = new THREE.BoxGeometry(18, 0.1, 18);
    for(let p = 0; p < plateCount; p++) {
        // Alternating gold and palladium (represented by chrome/goldContacts)
        const mat = p % 2 === 0 ? goldContacts : chrome;
        const plate = new THREE.Mesh(plateGeo, mat);
        plate.position.y = -15 + (p * 0.15); // Nanometer precision scaled up
        platesGroup.add(plate);
        anim.plates.push({ mesh: plate, initialY: plate.position.y, phase: p * 0.1 });
    }
    coreGroup.add(platesGroup);

    // Virtual Particle Exciter (Flashing spheres inside the core)
    const particleGeo = new THREE.SphereGeometry(0.5, 16, 16);
    for(let v = 0; v < 50; v++) {
        const pMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0 });
        const particle = new THREE.Mesh(particleGeo, pMat);
        particle.position.set(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 28,
            (Math.random() - 0.5) * 16
        );
        coreGroup.add(particle);
        anim.particles.push({ mesh: particle, mat: pMat, phase: Math.random() * Math.PI * 2 });
    }

    // QED Resonance Chamber (Dodecahedron wireframe)
    const qedGeo = new THREE.DodecahedronGeometry(20, 1);
    const qedChamber = new THREE.Mesh(qedGeo, quantumResonatorMat);
    coreGroup.add(qedChamber);
    anim.rotors.push({ mesh: qedChamber, axis: 'xyz', speed: 0.01 });

    baseGroup.add(coreGroup);

    // ============================================================================
    // 7. COMPONENT GENERATION: MACROSCOPIC GEAR TRAIN & PIEZO MATRIX
    // ============================================================================
    const gearTrainGroup = new THREE.Group();
    gearTrainGroup.position.set(0, 30, -10);

    // A massive sequence of gears converting nanoscale vibration to macro-torque
    const gearsData = [
        { r: 12, t: 24, d: 4, h: 3, x: 0, y: 0, z: 20, mat: steel, speed: 0.05 },
        { r: 8, t: 16, d: 4, h: 2, x: 18, y: 0, z: 20, mat: copper, speed: -0.075 },
        { r: 15, t: 30, d: 5, h: 4, x: 18, y: 22, z: 20, mat: darkSteel, speed: 0.04 },
        { r: 10, t: 20, d: 3, h: 2, x: -8, y: 22, z: 20, mat: chrome, speed: -0.06 },
        { r: 25, t: 50, d: 6, h: 8, x: -35, y: 10, z: 20, mat: steel, speed: 0.024 },
        { r: 12, t: 24, d: 5, h: 3, x: -35, y: 40, z: 20, mat: copper, speed: -0.05 }
    ];

    gearsData.forEach(g => {
        const gearMesh = createGear(g.r, g.t, g.d, g.h, g.mat);
        gearMesh.position.set(g.x, g.y, g.z);
        gearTrainGroup.add(gearMesh);
        anim.gears.push({ mesh: gearMesh, speed: g.speed });
    });

    baseGroup.add(gearTrainGroup);

    // ============================================================================
    // 8. COMPONENT GENERATION: ENERGY CONTAINMENT BATTERIES
    // ============================================================================
    const batteryGroup = new THREE.Group();
    const createBattery = (x, z, glowMat) => {
        const bGroup = new THREE.Group();
        bGroup.position.set(x, 40, z);
        
        // Glass Housing
        const shellGeo = new THREE.CylinderGeometry(8, 8, 30, 32);
        const shell = new THREE.Mesh(shellGeo, hyperGlass);
        bGroup.add(shell);
        
        // Glowing Plasma Core
        const coreGeo = new THREE.CylinderGeometry(4, 4, 28, 32);
        const core = new THREE.Mesh(coreGeo, glowMat);
        bGroup.add(core);
        anim.energyCores.push({ mesh: core, mat: glowMat, baseScale: 1.0 });

        // Thermal Dissipation Fins
        const finCount = 20;
        const finGeo = new THREE.BoxGeometry(20, 2, 0.5);
        for(let f = 0; f < finCount; f++) {
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = -12 + f * 1.3;
            fin.rotation.y = (f % 2) * Math.PI / 4;
            bGroup.add(fin);
        }

        // Top/Bottom Caps
        const capGeo = new THREE.CylinderGeometry(9, 9, 2, 32);
        const topCap = new THREE.Mesh(capGeo, darkSteel);
        topCap.position.y = 16;
        const botCap = new THREE.Mesh(capGeo, darkSteel);
        botCap.position.y = -16;
        bGroup.add(topCap, botCap);

        return bGroup;
    };

    baseGroup.add(createBattery(-50, -40, neonBlue));
    baseGroup.add(createBattery(-20, -40, neonPurple));
    baseGroup.add(createBattery(20, -40, neonGreen));
    baseGroup.add(createBattery(50, -40, neonOrange));

    // ============================================================================
    // 9. COMPONENT GENERATION: ZPE CONDUITS (TUBES)
    // ============================================================================
    const conduitMats = [neonBlue, neonPurple, neonGreen, neonOrange];
    const batteryX = [-50, -20, 20, 50];
    
    for(let i=0; i<4; i++) {
        // Complex spline path from core to batteries
        const pts = [
            new THREE.Vector3(0, 70, -10),
            new THREE.Vector3(batteryX[i] * 0.5, 80, -25),
            new THREE.Vector3(batteryX[i], 60, -40),
            new THREE.Vector3(batteryX[i], 55, -40)
        ];
        
        // Outer Glass Tube
        const outerTube = createConduit(pts, 2.5, hyperGlass);
        baseGroup.add(outerTube);
        
        // Inner Glowing Plasma Fluid Line
        const innerTube = createConduit(pts, 1.0, conduitMats[i]);
        baseGroup.add(innerTube);
    }

    // High Voltage Copper Coils around conduits
    for(let i=0; i<4; i++) {
        const coilPts = [];
        const turns = 40;
        const height = 40;
        const radius = 3.5;
        for ( let j = 0; j <= turns * 10; j ++ ) {
            const t = j / (turns * 10);
            const a = turns * Math.PI * 2 * t;
            // Linear interpolation mapping to the battery positions
            const lx = THREE.MathUtils.lerp(0, batteryX[i], t);
            const ly = THREE.MathUtils.lerp(70, 55, t);
            const lz = THREE.MathUtils.lerp(-10, -40, t);
            
            coilPts.push( new THREE.Vector3(
                lx + Math.cos(a) * radius,
                ly + Math.sin(a) * radius,
                lz
            ) );
        }
        const coilTube = createConduit(coilPts, 0.4, copper);
        baseGroup.add(coilTube);
    }

    // ============================================================================
    // 10. COMPONENT GENERATION: HYDRAULIC SUPPORT PISTONS & EXHAUST STACKS
    // ============================================================================
    // Heavy pistons supporting the core
    const pistonPositions = [
        { x: -30, z: 10, rx: -0.5, rz: 0.5 },
        { x: 30, z: 10, rx: -0.5, rz: -0.5 },
        { x: -30, z: -30, rx: 0.5, rz: 0.5 },
        { x: 30, z: -30, rx: 0.5, rz: -0.5 }
    ];

    pistonPositions.forEach(p => {
        const piston = createHydraulic(15, 20, chrome);
        piston.position.set(p.x, 30, p.z);
        piston.rotation.x = p.rx;
        piston.rotation.z = p.rz;
        baseGroup.add(piston);
    });

    // Exhaust Stacks (For waste photons/heat)
    const stackGeo = new THREE.CylinderGeometry(3, 4, 40, 16);
    const s1 = new THREE.Mesh(stackGeo, dirtySteel);
    s1.position.set(-65, 50, 20);
    const s2 = new THREE.Mesh(stackGeo, dirtySteel);
    s2.position.set(65, 50, 20);
    
    // Add flapper valves on top
    const flapGeo = new THREE.PlaneGeometry(6, 6);
    const flap1 = new THREE.Mesh(flapGeo, darkSteel);
    flap1.position.set(0, 20.5, 0);
    flap1.rotation.x = -Math.PI / 4;
    s1.add(flap1);
    
    const flap2 = new THREE.Mesh(flapGeo, darkSteel);
    flap2.position.set(0, 20.5, 0);
    flap2.rotation.x = -Math.PI / 4;
    s2.add(flap2);

    anim.booms.push({ mesh: flap1, baseRot: -Math.PI/4, speed: 0.2, amp: 0.2 });
    anim.booms.push({ mesh: flap2, baseRot: -Math.PI/4, speed: 0.22, amp: 0.2 });

    baseGroup.add(s1, s2);

    group.add(baseGroup);

    // ============================================================================
    // 11. PARTS METADATA ARRAY (15+ Highly Detailed Entries)
    // ============================================================================
    parts.push(
        {
            name: "Crawler Base Chassis",
            description: "Massive dark steel foundation designed to isolate tectonic vibrations from the sensitive nanoscale Casimir plates.",
            material: "darkPlating",
            function: "Provides structural integrity and mobile mounting points for all extreme-mass components.",
            assemblyOrder: 1,
            connections: ["Off-Road Wheels", "Hydraulic Pistons", "Operator Cabin"],
            failureEffect: "Total machine collapse; structural fracture resulting in immediate vacuum energy decoherence and explosive rapid unscheduled disassembly.",
            cascadeFailures: ["Casimir Core", "Containment Batteries", "Gear Train"],
            originalPosition: {x: 0, y: 20, z: 0},
            explodedPosition: {x: 0, y: -50, z: 0}
        },
        {
            name: "Off-Road Quantum Treads",
            description: "Hyper-realistic wheel assemblies featuring Torus geometry bases, complex spoke arrays, and hundreds of interlocking rubber lugs.",
            material: "rubber, chrome, darkSteel",
            function: "Allows mobility across hostile terrains to locate optimal telluric current intersection points for enhanced extraction.",
            assemblyOrder: 2,
            connections: ["Crawler Base Chassis"],
            failureEffect: "Immobility. Potential misalignment with ley lines reducing energy yield by 94.2%.",
            cascadeFailures: ["Navigation Systems", "Thermal Dissipation Fins"],
            originalPosition: {x: -70, y: 15, z: -45},
            explodedPosition: {x: -120, y: -20, z: -80}
        },
        {
            name: "Operator Control Cabin",
            description: "Pressurized, radiation-shielded command center featuring tinted hyper-glass, joysticks, steering yokes, and glowing diagnostics screens.",
            material: "darkPlating, tinted, neonBlue",
            function: "Houses human operators to monitor nanoscale plate distance adjustments and piezoelectric torque conversion.",
            assemblyOrder: 3,
            connections: ["Crawler Base Chassis", "Access Ladder"],
            failureEffect: "Operator exposure to fatal zero-point radiation bursts. Loss of manual override capabilities.",
            cascadeFailures: ["Safety Venting Systems", "ZPE Conduits"],
            originalPosition: {x: 0, y: 45, z: 35},
            explodedPosition: {x: 0, y: 100, z: 80}
        },
        {
            name: "QED Resonance Chamber",
            description: "A wireframe dodecahedron composed of superconducting quantum-entangled alloys, encircling the inner core.",
            material: "quantumResonatorMat",
            function: "Amplifies the vacuum fluctuations by resonating at the exact frequency of virtual particle pair production.",
            assemblyOrder: 4,
            connections: ["Casimir Plate Array", "Dark Matter Rings"],
            failureEffect: "Loss of resonance; virtual particles annihilate too quickly to be harvested.",
            cascadeFailures: ["Piezoelectric Harvester", "Plasma Cores"],
            originalPosition: {x: 0, y: 70, z: -10},
            explodedPosition: {x: 0, y: 150, z: -10}
        },
        {
            name: "Casimir Plate Array",
            description: "Billions of ultra-smooth gold and palladium plates situated nanometers apart, rendered here as 200 macro-layers for visual comprehension.",
            material: "goldContacts, chrome",
            function: "Restricts the wavelength of virtual photons between them, creating a negative pressure gradient that draws the plates together.",
            assemblyOrder: 5,
            connections: ["QED Resonance Chamber", "Piezoelectric Harvester"],
            failureEffect: "Plate fusion (stiction) caused by Casimir attraction overwhelming the mechanical separators, rendering the core permanently inert.",
            cascadeFailures: ["Virtual Particle Exciter", "Gear Train"],
            originalPosition: {x: 0, y: 70, z: -10},
            explodedPosition: {x: 0, y: 70, z: -100}
        },
        {
            name: "Dark Matter Stabilizer Rings",
            description: "Counter-rotating toruses generating a localized gravitational anomaly to counteract the mass-energy equivalence of the extracted vacuum energy.",
            material: "copper, steel",
            function: "Prevents the formation of a microscopic black hole during peak energy extraction.",
            assemblyOrder: 6,
            connections: ["QED Resonance Chamber", "Core Housing"],
            failureEffect: "Spontaneous spatiotemporal collapse within a 5-meter radius.",
            cascadeFailures: ["Entire Facility"],
            originalPosition: {x: 0, y: 70, z: -10},
            explodedPosition: {x: 80, y: 90, z: -10}
        },
        {
            name: "Macroscopic Gear Train",
            description: "A complex interlocking set of massive steel, copper, and chrome gears with precisely milled teeth.",
            material: "steel, copper, chrome",
            function: "Translates the immense, high-frequency, nanoscale vibrations of the Casimir plates into usable macroscopic rotational torque.",
            assemblyOrder: 7,
            connections: ["Piezoelectric Harvester", "Base Chassis"],
            failureEffect: "Gear stripping; violent kinetic energy release equivalent to a minor seismic event.",
            cascadeFailures: ["Support Pistons", "Energy Batteries"],
            originalPosition: {x: 0, y: 30, z: -10},
            explodedPosition: {x: 0, y: 30, z: 60}
        },
        {
            name: "Zero-Point Energy (ZPE) Conduits",
            description: "Thick Catmull-Rom generated glass tubes containing inner fluid lines of intensely glowing harvested energy.",
            material: "hyperGlass, neonBlue, neonPurple",
            function: "Transports raw, unrefined vacuum energy from the core to the containment batteries without leakage.",
            assemblyOrder: 8,
            connections: ["Core Housing", "Containment Batteries", "High-Voltage Coils"],
            failureEffect: "Plasma leak resulting in exotic matter contamination and spontaneous disintegration of nearby atomic structures.",
            cascadeFailures: ["Containment Batteries"],
            originalPosition: {x: 0, y: 65, z: -25},
            explodedPosition: {x: 0, y: 120, z: -50}
        },
        {
            name: "High-Voltage Copper Coils",
            description: "Helical TubeGeometries wrapping tightly around the ZPE conduits.",
            material: "copper",
            function: "Generates a strong electromagnetic field to coax the plasma flow and prevent conduit wall ablation.",
            assemblyOrder: 9,
            connections: ["ZPE Conduits"],
            failureEffect: "Electromagnetic pinch failure, melting the glass conduits instantly.",
            cascadeFailures: ["ZPE Conduits", "Containment Batteries"],
            originalPosition: {x: 0, y: 65, z: -25},
            explodedPosition: {x: 0, y: 120, z: -50}
        },
        {
            name: "Energy Containment Batteries",
            description: "Towering glass cylinders housing blindingly bright plasma cores, capped with dark steel.",
            material: "hyperGlass, neonGreen, neonOrange",
            function: "Stores the harvested zero-point energy in a metastable state for eventual offloading to the grid.",
            assemblyOrder: 10,
            connections: ["ZPE Conduits", "Thermal Dissipation Fins"],
            failureEffect: "Supercritical detonation of stored vacuum energy, erasing the machine and surrounding geography.",
            cascadeFailures: ["Thermal Dissipation Fins", "Crawler Base Chassis"],
            originalPosition: {x: -50, y: 40, z: -40},
            explodedPosition: {x: -150, y: 40, z: -100}
        },
        {
            name: "Thermal Dissipation Fins",
            description: "Arrays of ultra-thin aluminum plates surrounding the batteries.",
            material: "aluminum",
            function: "Radiates the immense waste heat generated by compressing zero-point energy into macroscopic batteries.",
            assemblyOrder: 11,
            connections: ["Energy Containment Batteries"],
            failureEffect: "Battery overheating leading to thermal runaway and core meltdown.",
            cascadeFailures: ["Energy Containment Batteries"],
            originalPosition: {x: -50, y: 40, z: -40},
            explodedPosition: {x: -150, y: 80, z: -100}
        },
        {
            name: "Hydraulic Support Pistons",
            description: "Massive articulated cylinders utilizing dynamic fluid pressure.",
            material: "chrome, darkSteel",
            function: "Actively adjusts the angle and elevation of the core housing to maintain perfect alignment with the Earth's gravitational vector.",
            assemblyOrder: 12,
            connections: ["Core Housing", "Crawler Base Chassis"],
            failureEffect: "Core misalignment leading to asymmetric Casimir forces and immediate plate buckling.",
            cascadeFailures: ["Casimir Plate Array", "Core Housing"],
            originalPosition: {x: -30, y: 30, z: 10},
            explodedPosition: {x: -80, y: 10, z: 40}
        },
        {
            name: "Exhaust Stacks",
            description: "Tall, grimy steel chimneys equipped with automated flapper valves.",
            material: "dirtySteel",
            function: "Vents dangerous high-energy waste photons and stray plasma exhaust safely into the upper atmosphere.",
            assemblyOrder: 13,
            connections: ["Crawler Base Chassis", "Energy Batteries"],
            failureEffect: "Internal pressure build-up of waste photons, ionizing the interior crew cabin.",
            cascadeFailures: ["Operator Control Cabin"],
            originalPosition: {x: -65, y: 50, z: 20},
            explodedPosition: {x: -100, y: 80, z: 60}
        },
        {
            name: "Virtual Particle Exciter",
            description: "A matrix of dynamically scaling, flashing spheres inside the inner core.",
            material: "MeshStandardMaterial (Emissive)",
            function: "Bombards the vacuum with precise high-frequency radiation to artificially increase the rate of virtual particle pair production.",
            assemblyOrder: 14,
            connections: ["QED Resonance Chamber"],
            failureEffect: "Drop in extraction efficiency; zero-point yield falls to background levels.",
            cascadeFailures: ["Energy Containment Batteries"],
            originalPosition: {x: 0, y: 70, z: -10},
            explodedPosition: {x: 0, y: 70, z: -10}
        },
        {
            name: "Piezoelectric Harvester",
            description: "A micro-lattice structure mapping the Casimir plates to the macro-gears.",
            material: "copper, steel",
            function: "Directly converts the high-frequency physical impact of the plates snapping together into electrical pulses.",
            assemblyOrder: 15,
            connections: ["Casimir Plate Array", "Macroscopic Gear Train"],
            failureEffect: "Inability to harvest kinetic energy, leading to destructive resonance in the plates.",
            cascadeFailures: ["Casimir Plate Array", "Macroscopic Gear Train"],
            originalPosition: {x: 0, y: 50, z: -10},
            explodedPosition: {x: 0, y: 50, z: 20}
        }
    );

    // ============================================================================
    // 12. PHD-LEVEL QUANTUM ELECTRODYNAMICS QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the calculation of the Casimir force between two perfectly conducting parallel plates, how is the infinite zero-point energy of the vacuum regularized to yield a finite, measurable force?",
            options: [
                "By utilizing zeta function regularization or an exponential cutoff function to subtract the infinite free-space vacuum energy from the infinite energy between the plates.",
                "By assuming the plates have a finite mass which counteracts the infinite energy via general relativity.",
                "By applying the Pauli exclusion principle to photons, which limits the number of virtual particles allowed in the cavity.",
                "By dividing the total energy by the fine-structure constant to normalize the quantum fluctuations."
            ],
            correctAnswer: 0,
            explanation: "The total zero-point energy is theoretically infinite in both cases (with and without plates). Physicists use mathematical techniques like Riemann zeta function regularization or introducing an exponential cutoff to subtract these infinities, yielding a finite, negative potential energy that results in an attractive force."
        },
        {
            question: "According to Lifshitz theory, which generalizes the Casimir effect to realistic dielectric materials, how does the force behave at non-zero finite temperatures at very large separation distances?",
            options: [
                "It decays exponentially due to thermal decoherence of the virtual photons.",
                "It transitions from an inverse fourth-power law (1/a^4) to an inverse cube law (1/a^3) dominated by classical thermal fluctuations.",
                "It becomes perfectly repulsive regardless of the dielectric properties of the materials.",
                "It oscillates sinusoidally due to the interference of blackbody radiation modes."
            ],
            correctAnswer: 1,
            explanation: "At zero temperature or short distances, the Casimir force scales as 1/a^4. At finite temperatures and large distances (where the thermal wavelength is smaller than the separation), classical thermal fluctuations dominate over quantum fluctuations, causing the force to scale as 1/a^3."
        },
        {
            question: "What specific phenomenon occurs when the Casimir effect is considered in a dynamic system where a single conducting boundary is accelerated rapidly (approaching the speed of light) through the quantum vacuum?",
            options: [
                "The boundary becomes perfectly transparent to all electromagnetic radiation.",
                "The system generates real photons from the vacuum, a phenomenon known as the Dynamical Casimir Effect (DCE).",
                "The vacuum energy undergoes a phase transition, crystallizing into a topological insulator.",
                "The boundary experiences zero resistance and infinite thermal conductivity."
            ],
            correctAnswer: 1,
            explanation: "The Dynamical Casimir Effect predicts that a rapidly accelerating boundary (like a mirror vibrating at relativistic speeds) mismatches the vacuum modes over time, resulting in the conversion of virtual photons into real, observable photons."
        },
        {
            question: "For two plates made of different materials, it is theoretically possible to achieve a repulsive Casimir force. Which of the following conditions involving the dielectric permeabilities (ε) of the two plates (ε1, ε2) and the intervening fluid medium (ε3) must be met?",
            options: [
                "ε1 = ε2 and ε3 = 0",
                "ε1 > ε3 > ε2 or ε1 < ε3 < ε2",
                "ε1 * ε2 = ε3^2",
                "ε1, ε2, and ε3 must all be perfect conductors (ε -> infinity)"
            ],
            correctAnswer: 1,
            explanation: "According to the Dzyaloshinskii-Lifshitz-Pitaevskii formulation, the Casimir force between two distinct materials across a fluid can be repulsive if the dielectric permittivity of the fluid medium is strictly intermediate between the permittivities of the two bounding materials across a wide range of frequencies."
        },
        {
            question: "In the context of quantum field theory, how does the Casimir effect relate to the concept of renormalization?",
            options: [
                "The Casimir effect proves that renormalization is mathematically inconsistent and requires string theory to resolve.",
                "It serves as a macroscopic, physical manifestation of the fact that only changes in vacuum energy (not absolute infinite vacuum energy) are physically observable, justifying renormalization techniques.",
                "It demonstrates that the bare mass of an electron must be infinite to prevent the plates from collapsing.",
                "Renormalization is only necessary for the Casimir effect when gravity is introduced into the quantum fields."
            ],
            correctAnswer: 1,
            explanation: "The Casimir effect shows that the absolute infinite energy of the vacuum has no direct physical consequence; only the finite difference in energy caused by boundary conditions (the plates) exerts a measurable force. This conceptually mirrors renormalization, where unobservable infinities are subtracted to yield finite, measurable physical predictions."
        }
    ];

    // ============================================================================
    // 13. EXTREME ANIMATION LOGIC
    // ============================================================================
    const animate = (time, speed, meshes) => {
        // Base animation speed modifier
        const t = time * speed;

        // 1. Wheel Rotation (Crawler moving slowly)
        anim.wheels.forEach(wheelGroup => {
            wheelGroup.rotation.x = -t * 0.5; 
        });

        // 2. Casimir Plates Vibration (High frequency nanoscale vibrations scaled up)
        anim.plates.forEach(plateData => {
            // Complex waveform: Sine wave modified by noise and phase
            const vibration = Math.sin(t * 20 + plateData.phase) * 0.05 + Math.cos(t * 35 - plateData.phase) * 0.02;
            plateData.mesh.position.y = plateData.initialY + vibration;
            
            // Emissive pulsing on the plates
            if (plateData.mesh.material.emissive) {
                plateData.mesh.material.emissiveIntensity = 2 + Math.sin(t * 15 + plateData.phase) * 2;
            }
        });

        // 3. Virtual Particle Exciter (Popping in and out of existence)
        anim.particles.forEach(p => {
            // Rapid scaling and flashing
            const scale = Math.max(0, Math.sin(t * 10 + p.phase));
            p.mesh.scale.set(scale, scale, scale);
            
            // Intense flashing
            if (scale > 0.8) {
                p.mat.emissiveIntensity = 10;
                p.mat.color.setHex(0xffffff);
            } else {
                p.mat.emissiveIntensity = 0;
                p.mat.color.setHex(0x000000);
            }
        });

        // 4. Dark Matter Rings and Resonance Chamber rotation
        anim.rotors.forEach(r => {
            if (r.axis === 'xyz') {
                r.mesh.rotation.x += r.speed * speed;
                r.mesh.rotation.y += r.speed * 1.5 * speed;
                r.mesh.rotation.z += r.speed * 0.5 * speed;
            } else {
                r.mesh.rotation.y += r.speed * speed;
                // Wobble
                r.mesh.rotation.x = Math.sin(t + r.speed * 100) * 0.1;
            }
        });

        // 5. Macroscopic Gear Train
        anim.gears.forEach(g => {
            g.mesh.rotation.z += g.speed * speed;
        });

        // 6. Glowing Neon Intensity Pulsing
        anim.glowMats.forEach((mat, idx) => {
            if (mat !== plasmaCore) {
                mat.emissiveIntensity = 4 + Math.sin(t * 3 + idx) * 2;
            }
        });

        // 7. Battery Plasma Cores
        anim.energyCores.forEach((core, idx) => {
            // Throbbing effect
            const throb = 1 + Math.sin(t * 5 + idx) * 0.1;
            core.mesh.scale.set(throb, 1, throb);
            core.mat.emissiveIntensity = 8 + Math.sin(t * 8 + idx) * 4;
        });

        // 8. Control Cabin Screens
        anim.screens.forEach((screen, idx) => {
            // Flickering effect imitating rapid data processing
            if (Math.random() > 0.8) {
                screen.material.emissiveIntensity = Math.random() * 5 + 2;
            }
        });

        // 9. Exhaust Flappers
        anim.booms.forEach(b => {
            b.mesh.rotation.x = b.baseRot + Math.sin(t * b.speed * 50) * b.amp;
        });
        
        // 10. Hydraulic Piston active stabilization
        anim.pistons.forEach((p, idx) => {
            // Slight extensions and retractions
            const ext = Math.sin(t * 2 + idx) * 2; 
            p.arm.position.y = p.baseLen + (p.extLen / 2) + ext;
            p.top.position.y = p.baseLen + p.extLen + ext;
        });
    };

    return { 
        group, 
        parts, 
        description: "The God-Tier Casimir Effect Vacuum Extractor is a staggering triumph of post-modern macro-quantum engineering. By maintaining billions of microscopically parallel conducting plates at exactly 10 nanometers apart, it forces the quantum vacuum to yield zero-point energy via the Casimir force. This energy is harvested by advanced piezoelectric lattices, translated through a massive macroscopic gear train, and stored as metastable plasma in hyper-glass containment batteries, all mounted on an aggressively treaded crawler base for optimal telluric positioning.", 
        quizQuestions, 
        animate 
    };
}
