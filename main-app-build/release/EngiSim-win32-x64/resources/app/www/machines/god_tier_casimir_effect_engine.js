import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Ultra God Tier Casimir Effect Engine is a macroscopic marvel of quantum engineering. It exploits the zero-point energy of the quantum vacuum by utilizing the Casimir effect—the physical force arising from a quantized field. Within the core containment vessel, millions of nanometer-scale parallel conductive plates snap together under immense vacuum pressure. This colossal force is harnessed mechanically via a hyper-dense drive train, transferring kinetic energy to a macroscopic flywheel. Before the plates perfectly bond (which would cause stiction), an intricate array of electromagnetic and hydraulic reset systems forcibly separates them, completing the cycle. This engine theoretically extracts macroscopic work from the quantum void.";

    const quizQuestions = [
        {
            question: "In Lifshitz theory for real dielectric plates, how does the Casimir force scale with distance 'd' at asymptotically large separations (the retarded regime)?",
            options: [
                "1 / d^3",
                "1 / d^4",
                "1 / d^5",
                "Exponential decay"
            ],
            correct: 1,
            explanation: "At large separations, the finite speed of light must be taken into account (retardation effects), and the force between two parallel uncharged dielectric or conducting plates transitions from the non-retarded van der Waals 1/d^3 dependence to the retarded Casimir-Polder 1/d^4 dependence."
        },
        {
            question: "Which of the following phenomena is a direct macroscopic manifestation of the dynamical Casimir effect?",
            options: [
                "Spontaneous emission of real photons from an accelerating uncharged mirror",
                "The Lamb shift of the hydrogen atom",
                "Anomalous magnetic dipole moment of the electron",
                "Hawking radiation from a static black hole"
            ],
            correct: 0,
            explanation: "The dynamical Casimir effect involves the creation of real particles (photons) from the quantum vacuum due to rapidly changing boundary conditions, such as a mirror accelerating at relativistic speeds."
        },
        {
            question: "How does finite temperature affect the Casimir pressure between two perfectly conducting parallel plates at very large separations (thermal regime)?",
            options: [
                "The force becomes repulsive.",
                "The force vanishes exponentially.",
                "The pressure becomes proportional to T / d^3.",
                "The pressure remains independent of temperature."
            ],
            correct: 2,
            explanation: "At separations where thermal fluctuations dominate over quantum fluctuations (high T or large d), the Casimir pressure scales linearly with temperature T and inversely with the cube of the distance, transitioning away from the purely zero-temperature 1/d^4 dependence."
        },
        {
            question: "In the context of the Casimir effect, what is the role of zeta function regularization?",
            options: [
                "To account for the surface roughness of the conductive plates.",
                "To assign a finite value to the divergent sum of infinite zero-point energy modes.",
                "To calculate the transition from the non-retarded to the retarded regime.",
                "To model the finite skin depth of real metals at optical frequencies."
            ],
            correct: 1,
            explanation: "The bare zero-point energy of the vacuum is infinite. Zeta function regularization (specifically using the Riemann zeta function) is a mathematical technique used to analytically continue the sum of mode frequencies to extract the finite, physically meaningful energy difference that yields the Casimir force."
        },
        {
            question: "When replacing parallel plates with a sphere and a plate, what approximation is typically used to calculate the Casimir force if the sphere radius R is much larger than the separation distance d?",
            options: [
                "Born approximation",
                "WKB approximation",
                "Proximity Force Approximation (PFA)",
                "Rayleigh-Jeans limit"
            ],
            correct: 2,
            explanation: "The Proximity Force Approximation (PFA), or Derjaguin's approximation, simplifies the calculation of forces between curved surfaces by integrating the force over infinitesimally small parallel plate segments. It is highly accurate when the separation d is much smaller than the radius of curvature R."
        }
    ];

    // ==========================================
    // UTILITY FUNCTIONS FOR PROCEDURAL GEOMETRY
    // ==========================================

    function createDetailedGear(radius, teethCount, thickness, holeRadius, spokeCount) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85;
        const toothDepth = radius * 0.15;
        const angleStep = (Math.PI * 2) / teethCount;

        for (let i = 0; i < teethCount; i++) {
            const angle = i * angleStep;
            const nextAngle = (i + 1) * angleStep;
            const midAngle1 = angle + angleStep * 0.25;
            const midAngle2 = angle + angleStep * 0.75;

            if (i === 0) {
                shape.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            } else {
                shape.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            }
            shape.lineTo(Math.cos(midAngle1) * (radius + toothDepth), Math.sin(midAngle1) * (radius + toothDepth));
            shape.lineTo(Math.cos(midAngle2) * (radius + toothDepth), Math.sin(midAngle2) * (radius + toothDepth));
            shape.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
        }

        const hole = new THREE.Path();
        hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        if (spokeCount > 0) {
            const spokeAngleStep = (Math.PI * 2) / spokeCount;
            const spokeWidth = radius * 0.1;
            for (let i = 0; i < spokeCount; i++) {
                const angle = i * spokeAngleStep;
                const spokePath = new THREE.Path();
                const wStart = angle + spokeWidth / radius;
                const wEnd = angle + spokeAngleStep - spokeWidth / radius;
                spokePath.moveTo(Math.cos(wStart) * (holeRadius + radius*0.05), Math.sin(wStart) * (holeRadius + radius*0.05));
                spokePath.lineTo(Math.cos(wStart) * (innerRadius - radius*0.05), Math.sin(wStart) * (innerRadius - radius*0.05));
                spokePath.lineTo(Math.cos(wEnd) * (innerRadius - radius*0.05), Math.sin(wEnd) * (innerRadius - radius*0.05));
                spokePath.lineTo(Math.cos(wEnd) * (holeRadius + radius*0.05), Math.sin(wEnd) * (holeRadius + radius*0.05));
                spokePath.lineTo(Math.cos(wStart) * (holeRadius + radius*0.05), Math.sin(wStart) * (holeRadius + radius*0.05));
                shape.holes.push(spokePath);
            }
        }
        return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: thickness * 0.05, bevelThickness: thickness * 0.05 });
    }

    function createSplineShaft(radius, length, splineCount) {
        const shape = new THREE.Shape();
        const angleStep = (Math.PI * 2) / splineCount;
        for (let i = 0; i < splineCount; i++) {
            const angle = i * angleStep;
            const mid = angle + angleStep / 2;
            if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            shape.lineTo(Math.cos(mid) * (radius * 0.8), Math.sin(mid) * (radius * 0.8));
            shape.lineTo(Math.cos(angle + angleStep) * radius, Math.sin(angle + angleStep) * radius);
        }
        return new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false, curveSegments: 12 });
    }

    function createTrussLattice(width, height, depth, gridX, gridY, gridZ, strutRadius) {
        const latticeGroup = new THREE.Group();
        const strutGeo = new THREE.CylinderGeometry(strutRadius, strutRadius, 1, 8);
        strutGeo.translate(0, 0.5, 0);
        strutGeo.rotateX(Math.PI / 2);

        const dx = width / gridX;
        const dy = height / gridY;
        const dz = depth / gridZ;

        const strutMat = steel;
        
        function addStrut(p1, p2) {
            const mesh = new THREE.Mesh(strutGeo, strutMat);
            const vec = new THREE.Vector3().subVectors(p2, p1);
            mesh.position.copy(p1);
            mesh.scale.set(1, 1, vec.length());
            mesh.lookAt(p2);
            latticeGroup.add(mesh);
        }

        const nodes = [];
        for (let i = 0; i <= gridX; i++) {
            nodes[i] = [];
            for (let j = 0; j <= gridY; j++) {
                nodes[i][j] = [];
                for (let k = 0; j <= gridZ && k <= gridZ; k++) {
                    nodes[i][j][k] = new THREE.Vector3(i * dx - width/2, j * dy - height/2, k * dz - depth/2);
                }
            }
        }

        for (let i = 0; i <= gridX; i++) {
            for (let j = 0; j <= gridY; j++) {
                for (let k = 0; k <= gridZ; k++) {
                    const p = nodes[i][j][k];
                    if (i < gridX) addStrut(p, nodes[i+1][j][k]);
                    if (j < gridY) addStrut(p, nodes[i][j+1][k]);
                    if (k < gridZ) addStrut(p, nodes[i][j][k+1]);
                    if (i < gridX && j < gridY) addStrut(p, nodes[i+1][j+1][k]);
                    if (j < gridY && k < gridZ) addStrut(p, nodes[i][j+1][k+1]);
                    if (i < gridX && k < gridZ) addStrut(p, nodes[i+1][j][k+1]);
                }
            }
        }
        return latticeGroup;
    }

    function createPipeSystem(pathPoints, radius, tubularSegments) {
        const curve = new THREE.CatmullRomCurve3(pathPoints);
        const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, 12, false);
        return new THREE.Mesh(geo, copper);
    }

    // ==========================================
    // MATERIALS (Glowing / Tech)
    // ==========================================
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 3, metalness: 0.5, roughness: 0.5 });
    
    const animationContext = {
        gears: [],
        shafts: [],
        pistons: [],
        casimirPlates: null,
        casimirOffsets: [],
        flywheel: null,
        pulses: [],
        coreLight: null,
        resetRods: []
    };

    // ==========================================
    // MAIN ARCHITECTURE
    // ==========================================
    
    // 1. Base Framework
    const baseGroup = new THREE.Group();
    const lattice = createTrussLattice(60, 10, 80, 6, 1, 8, 0.4);
    lattice.position.y = -5;
    baseGroup.add(lattice);
    
    const floorGeo = new THREE.BoxGeometry(62, 1, 82);
    const floor = new THREE.Mesh(floorGeo, darkSteel);
    floor.position.y = -0.5;
    baseGroup.add(floor);

    parts.push({
        name: "Quantum Scaffold Base",
        description: "Heavy-duty vibration-dampening truss lattice designed to absorb the microscopic, high-frequency shocks generated by the Casimir engine's rapid cycling.",
        material: "Dark Steel / Titanium Struts",
        function: "Structural integrity and seismic isolation.",
        assemblyOrder: 1,
        connections: ["Floor", "Containment Chamber", "Drive System"],
        failureEffect: "Micro-fractures lead to catastrophic misalignment of the quantum core, destroying the engine.",
        cascadeFailures: ["Casimir Core", "Containment Vessel"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });
    group.add(baseGroup);

    // 2. Casimir Containment Vessel
    const vesselGroup = new THREE.Group();
    vesselGroup.position.set(0, 20, -15);
    
    const vesselShape = new THREE.Path();
    vesselShape.moveTo(0, -15);
    vesselShape.lineTo(10, -12);
    vesselShape.bezierCurveTo(15, -5, 15, 5, 10, 12);
    vesselShape.lineTo(0, 15);
    const vesselGeo = new THREE.LatheGeometry(vesselShape.getPoints(), 64);
    const vessel = new THREE.Mesh(vesselGeo, chrome);
    vesselGroup.add(vessel);

    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(16 + i*1.5, 1.5 - i*0.2, 32, 100);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -5 + i*5;
        
        for(let j=0; j<36; j++) {
            const coilGeo = new THREE.BoxGeometry(4, 4, 6);
            const coil = new THREE.Mesh(coilGeo, copper);
            const angle = (j / 36) * Math.PI * 2;
            coil.position.set(Math.cos(angle) * (16 + i*1.5), 0, Math.sin(angle) * (16 + i*1.5));
            coil.lookAt(0, 0, 0);
            ring.add(coil);
        }
        vesselGroup.add(ring);
    }

    parts.push({
        name: "Vacuum Containment Vessel",
        description: "An ultra-high vacuum chamber surrounded by superconducting electromagnetic coils to perfectly isolate the Casimir plates from stray particles and external fields.",
        material: "Chromium / Superconducting Copper",
        function: "Maintains absolute vacuum (10^-12 Torr) necessary for zero-point energy extraction.",
        assemblyOrder: 2,
        connections: ["Base Scaffold", "Quantum Core", "Hydraulic Reset Array"],
        failureEffect: "Loss of vacuum introduces gas molecules that damp the Casimir effect, halting the engine.",
        cascadeFailures: ["Power Output", "Cooling System"],
        originalPosition: { x: 0, y: 20, z: -15 },
        explodedPosition: { x: 0, y: 40, z: -15 }
    });

    // 3. The Casimir Core (InstancedMesh)
    const plateCount = 20000;
    const plateGeo = new THREE.BoxGeometry(10, 10, 0.05);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 });
    const casimirInstanced = new THREE.InstancedMesh(plateGeo, plateMat, plateCount);
    
    const coreRadius = 8;
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < plateCount; i++) {
        const r = Math.sqrt(Math.random()) * coreRadius;
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        
        const pairIndex = Math.floor(i / 2);
        const isLeft = i % 2 === 0;
        
        const zBase = (pairIndex / (plateCount/2)) * 20 - 10;
        const zOffset = isLeft ? -0.2 : 0.2;

        dummy.position.set(x, y, zBase + zOffset);
        dummy.updateMatrix();
        casimirInstanced.setMatrixAt(i, dummy.matrix);
        
        animationContext.casimirOffsets.push({
            x: x, y: y, zBase: zBase, isLeft: isLeft, maxGap: 0.2
        });
    }
    casimirInstanced.instanceMatrix.needsUpdate = true;
    vesselGroup.add(casimirInstanced);
    animationContext.casimirPlates = casimirInstanced;

    const coreLight = new THREE.PointLight(0xaa00ff, 10, 50);
    vesselGroup.add(coreLight);
    animationContext.coreLight = coreLight;

    parts.push({
        name: "Nanoscopic Casimir Plate Array",
        description: "20,000 highly polished, uncharged parallel conductive plates. When the reset mechanism releases them, quantum vacuum fluctuations push them together, extracting kinetic energy from the void.",
        material: "Perfectly Reflective Metamaterial",
        function: "The heart of the engine; generates motive force via the Casimir effect.",
        assemblyOrder: 3,
        connections: ["Containment Vessel", "Coupling Linkages"],
        failureEffect: "Plates permanently fuse due to stiction (Casimir bonding), rendering the core a solid, useless block.",
        cascadeFailures: ["Drive Train"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 }
    });
    group.add(vesselGroup);

    // 4. Reset Hydraulics (Mechanical Piston Array)
    const hydraulicsGroup = new THREE.Group();
    hydraulicsGroup.position.set(0, 20, 5);
    
    const hydraulicPlateGeo = new THREE.CylinderGeometry(12, 12, 2, 32);
    const hPlate = new THREE.Mesh(hydraulicPlateGeo, darkSteel);
    hPlate.rotation.x = Math.PI / 2;
    hydraulicsGroup.add(hPlate);
    
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const r = 9;
        const pistonGroup = new THREE.Group();
        pistonGroup.position.set(Math.cos(angle)*r, Math.sin(angle)*r, 0);
        
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 10, 16), steel);
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.z = 5;
        pistonGroup.add(cylinder);
        
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12, 16), chrome);
        rod.rotation.x = Math.PI / 2;
        rod.position.z = 10;
        pistonGroup.add(rod);
        
        animationContext.resetRods.push(rod);
        hydraulicsGroup.add(pistonGroup);
    }
    
    group.add(hydraulicsGroup);

    parts.push({
        name: "Electromagnetic Reset Hydraulics",
        description: "Massive ultra-high pressure hydraulic pistons that mechanically rip the Casimir plates apart after they snap together, resetting the quantum cycle. Powered by auxiliary electromagnetic fields.",
        material: "Chromoly Steel / Titanium",
        function: "Resets the quantum state by forcing plates against the Casimir vacuum pressure.",
        assemblyOrder: 4,
        connections: ["Casimir Core", "Gearbox"],
        failureEffect: "Engine stalls as Casimir plates permanently bond.",
        cascadeFailures: ["Quantum Core Array"],
        originalPosition: { x: 0, y: 20, z: 5 },
        explodedPosition: { x: 0, y: 20, z: 40 }
    });

    // 5. Macro-Scale Transmission Gearbox
    const gearBoxGroup = new THREE.Group();
    gearBoxGroup.position.set(0, 20, 25);
    
    const gbHousingGeo = new THREE.BoxGeometry(30, 30, 20);
    const gbHousing = new THREE.Mesh(gbHousingGeo, glass);
    gbHousing.material.transparent = true;
    gbHousing.material.opacity = 0.3;
    gearBoxGroup.add(gbHousing);

    const gear1Geo = createDetailedGear(10, 32, 2, 2, 5);
    const gear1 = new THREE.Mesh(gear1Geo, copper);
    gear1.position.set(-5, -5, -5);
    gearBoxGroup.add(gear1);
    animationContext.gears.push({ mesh: gear1, ratio: 1, axis: 'z' });

    const gear2Geo = createDetailedGear(6, 19, 2, 1.5, 4);
    const gear2 = new THREE.Mesh(gear2Geo, steel);
    gear2.position.set(11, -5, -5);
    gearBoxGroup.add(gear2);
    animationContext.gears.push({ mesh: gear2, ratio: -32/19, axis: 'z' });

    const gear3Geo = createDetailedGear(14, 45, 3, 3, 6);
    const gear3 = new THREE.Mesh(gear3Geo, chrome);
    gear3.position.set(11, -5, 2);
    gearBoxGroup.add(gear3);
    animationContext.gears.push({ mesh: gear3, ratio: -32/19, axis: 'z' }); 

    const gear4Geo = createDetailedGear(8, 25, 3, 2, 4);
    const gear4 = new THREE.Mesh(gear4Geo, darkSteel);
    gear4.position.set(11, 17, 2);
    gearBoxGroup.add(gear4);
    animationContext.gears.push({ mesh: gear4, ratio: (-32/19) * (-45/25), axis: 'z' });

    const driveShaftGeo = createSplineShaft(2, 40, 8);
    const driveShaft = new THREE.Mesh(driveShaftGeo, steel);
    driveShaft.position.set(11, 17, 2);
    gearBoxGroup.add(driveShaft);
    animationContext.shafts.push({ mesh: driveShaft, ratio: (-32/19) * (-45/25), axis: 'z' });

    group.add(gearBoxGroup);

    parts.push({
        name: "Macro-Translation Gearbox",
        description: "A highly complex gear train that converts the high-frequency, microscopic linear oscillations of the Casimir core into continuous, high-torque macroscopic rotary motion.",
        material: "Hardened Copper / Chrome Alloys",
        function: "Kinetic translation and torque multiplication.",
        assemblyOrder: 5,
        connections: ["Reset Hydraulics", "Flywheel Shaft"],
        failureEffect: "Gears strip under the extreme high-frequency torque spikes.",
        cascadeFailures: ["Flywheel Assembly"],
        originalPosition: { x: 0, y: 20, z: 25 },
        explodedPosition: { x: 30, y: 20, z: 25 }
    });

    // 6. Colossal Flywheel Assembly
    const flywheelGroup = new THREE.Group();
    flywheelGroup.position.set(11, 37, 27); 

    const flywheelCoreGeo = new THREE.CylinderGeometry(8, 8, 10, 32);
    const flywheelCore = new THREE.Mesh(flywheelCoreGeo, darkSteel);
    flywheelCore.rotation.x = Math.PI / 2;
    flywheelGroup.add(flywheelCore);

    const fwRingGeo = new THREE.TorusGeometry(25, 4, 64, 100);
    const fwRing = new THREE.Mesh(fwRingGeo, steel);
    fwRing.rotation.x = Math.PI / 2;
    flywheelGroup.add(fwRing);

    for(let i=0; i<12; i++) {
        const spokeGroup = new THREE.Group();
        spokeGroup.rotation.z = (i / 12) * Math.PI * 2;
        
        const spokeMain = new THREE.Mesh(new THREE.CylinderGeometry(1, 2, 17, 16), chrome);
        spokeMain.position.y = 16.5;
        spokeGroup.add(spokeMain);
        
        const sRing = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 16, 32), copper);
        sRing.position.y = 16.5;
        spokeGroup.add(sRing);
        
        flywheelGroup.add(spokeGroup);
    }
    
    animationContext.flywheel = flywheelGroup;
    group.add(flywheelGroup);

    parts.push({
        name: "Inertial Storage Flywheel",
        description: "A hyper-dense macroscopic flywheel constructed from depleted uranium and steel. It smooths out the quantum 'snaps' of the Casimir engine into a steady, enormous supply of rotational kinetic energy.",
        material: "Depleted Uranium Core / Steel Shell",
        function: "Energy storage and frequency smoothing.",
        assemblyOrder: 6,
        connections: ["Main Drive Shaft"],
        failureEffect: "Uncontrolled overspin leads to catastrophic fragmentation.",
        cascadeFailures: ["Entire Facility"],
        originalPosition: { x: 11, y: 37, z: 27 },
        explodedPosition: { x: 11, y: 80, z: 27 }
    });

    // 7. Energy Conduits & Coolant Pipes
    const pipeGroup = new THREE.Group();
    const p1 = [
        new THREE.Vector3(0, 10, -15),
        new THREE.Vector3(20, 10, -15),
        new THREE.Vector3(20, 30, 0),
        new THREE.Vector3(0, 30, 20),
        new THREE.Vector3(-20, 10, 25),
        new THREE.Vector3(-10, -2, 25)
    ];
    const pipe1 = createPipeSystem(p1, 1.5, 64);
    pipeGroup.add(pipe1);
    
    const p2 = [
        new THREE.Vector3(0, -5, -15),
        new THREE.Vector3(-25, 0, -10),
        new THREE.Vector3(-25, 20, 10),
        new THREE.Vector3(10, 40, 25)
    ];
    const pipe2 = createPipeSystem(p2, 1.2, 64);
    pipeGroup.add(pipe2);

    group.add(pipeGroup);

    parts.push({
        name: "Cryogenic Coolant Network",
        description: "Circulates liquid helium to keep the electromagnetic coils superconducting and to siphon off the immense thermal energy generated by the gearbox friction.",
        material: "Copper / Cryo-Polymers",
        function: "Thermal regulation and superconducting maintenance.",
        assemblyOrder: 7,
        connections: ["Containment Vessel", "Gearbox"],
        failureEffect: "Superconductors quench, electromagnets fail, containment is breached.",
        cascadeFailures: ["Containment Vessel", "Reset Hydraulics"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 0, z: 0 }
    });

    // 8. Quantum Operator Console
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(-30, 0, 30);
    consoleGroup.rotation.y = Math.PI / 4;

    const desk = new THREE.Mesh(new THREE.BoxGeometry(15, 1, 8), darkSteel);
    desk.position.y = 5;
    consoleGroup.add(desk);
    
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 5, 16), steel);
    stand.position.y = 2.5;
    consoleGroup.add(stand);

    for(let i=0; i<3; i++) {
        const screenGeo = new THREE.PlaneGeometry(8, 5);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set((i-1)*8.5, 8, -2);
        screen.rotation.x = -0.2;
        if(i===0) screen.rotation.y = 0.5;
        if(i===2) screen.rotation.y = -0.5;
        
        const grid = new THREE.GridHelper(8, 8, 0xffffff, 0x00ffff);
        grid.rotation.x = Math.PI / 2;
        screen.add(grid);

        consoleGroup.add(screen);
        animationContext.pulses.push(screen);
    }

    for(let i=0; i<5; i++) {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5), emissiveRed);
        btn.position.set(-6 + i*1.5, 5.25, 2);
        consoleGroup.add(btn);
    }
    
    const joystick = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), chrome);
    joystick.position.set(5, 6, 2);
    joystick.rotation.x = 0.5;
    consoleGroup.add(joystick);

    group.add(consoleGroup);

    parts.push({
        name: "Operator Console",
        description: "The primary human-machine interface. Monitors zero-point energy extraction rates, hydraulic pressure, and flywheel RPM in real-time.",
        material: "Reinforced Glass / Steel",
        function: "Telemetry and manual override control.",
        assemblyOrder: 8,
        connections: ["Floor", "Data Cables"],
        failureEffect: "Loss of telemetry; engine enters automated failsafe mode.",
        cascadeFailures: [],
        originalPosition: { x: -30, y: 0, z: 30 },
        explodedPosition: { x: -50, y: 0, z: 50 }
    });

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    
    function animate(time, speed, meshes) {
        const cycleSpeed = speed * 2.0;
        const cyclePhase = (time * cycleSpeed) % (Math.PI * 2);
        
        let gapMultiplier = 0;
        if (cyclePhase < Math.PI) {
            gapMultiplier = cyclePhase / Math.PI; 
        } else {
            const snapProgress = (cyclePhase - Math.PI) / Math.PI;
            gapMultiplier = 1.0 - Math.pow(snapProgress, 4); 
        }

        if (animationContext.casimirPlates) {
            for (let i = 0; i < plateCount; i++) {
                const data = animationContext.casimirOffsets[i];
                const currentZOffset = data.isLeft ? -data.maxGap * gapMultiplier : data.maxGap * gapMultiplier;
                dummy.position.set(data.x, data.y, data.zBase + currentZOffset);
                dummy.updateMatrix();
                animationContext.casimirPlates.setMatrixAt(i, dummy.matrix);
            }
            animationContext.casimirPlates.instanceMatrix.needsUpdate = true;
        }

        const rodExtension = gapMultiplier * 2.0; 
        animationContext.resetRods.forEach(rod => {
            rod.position.z = 10 + rodExtension;
        });

        const continuousRotation = time * speed * 0.5;
        
        animationContext.gears.forEach(g => {
            g.mesh.rotation[g.axis] = continuousRotation * g.ratio;
        });
        
        animationContext.shafts.forEach(s => {
            s.mesh.rotation[s.axis] = continuousRotation * s.ratio;
        });

        if (animationContext.flywheel) {
            const fwRatio = (-32/19) * (-45/25); 
            animationContext.flywheel.rotation.z = continuousRotation * fwRatio;
        }

        if (animationContext.coreLight) {
            animationContext.coreLight.intensity = 10 + (1.0 - gapMultiplier) * 20;
            animationContext.coreLight.distance = 50 + (1.0 - gapMultiplier) * 20;
        }

        animationContext.pulses.forEach(p => {
            if(p.material.opacity !== undefined) {
                p.material.opacity = 0.5 + Math.sin(time * speed * 5) * 0.3;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
