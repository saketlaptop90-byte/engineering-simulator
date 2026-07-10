import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x00aaff, emissiveIntensity: 2.5, metalness: 0.1, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2.0, metalness: 0.2, roughness: 0.3 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.8, metalness: 0.5, roughness: 0.2 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0xaa00ff, emissiveIntensity: 3.0, metalness: 0.4, roughness: 0.1 });
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, metalness: 0.3, roughness: 0.1 });
    const quantumCoreMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0, transmission: 0.9, opacity: 1, metalness: 0.1, roughness: 0.1, ior: 1.5 });
    
    // Arrays for animation
    const qubits = [];
    const pRings = [];
    const fans = [];
    const drones = [];
    const leds = [];
    const dataBlocks = [];
    const fiberBundles = [];
    const vaultShells = [];
    const hydraulicPistons = [];
    const confinementCoils = [];

    // 1. Vault Base Platform & Foundation
    const baseGroup = new THREE.Group();
    
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-15, -15);
    baseShape.lineTo(15, -15);
    baseShape.lineTo(18, -5);
    baseShape.lineTo(18, 5);
    baseShape.lineTo(15, 15);
    baseShape.lineTo(-15, 15);
    baseShape.lineTo(-18, 5);
    baseShape.lineTo(-18, -5);
    baseShape.lineTo(-15, -15);

    const baseExtrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 0.8, bevelThickness: 0.8 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -3;
    baseGroup.add(baseMesh);

    // Floor Grid Details
    for(let i=-12; i<=12; i+=2) {
        for(let j=-12; j<=12; j+=2) {
            if (i*i + j*j < 180) {
                const gridGeo = new THREE.BoxGeometry(1.8, 0.1, 1.8);
                const gridMesh = new THREE.Mesh(gridGeo, steel);
                gridMesh.position.set(i, 0.1, j);
                baseGroup.add(gridMesh);
            }
        }
    }
    
    // Seismic Dampers
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const rad = 14;
        const dx = Math.cos(angle) * rad;
        const dz = Math.sin(angle) * rad;
        
        const damperGeo = new THREE.CylinderGeometry(0.8, 1.2, 2, 16);
        const damperMesh = new THREE.Mesh(damperGeo, rubber);
        damperMesh.position.set(dx, -3.5, dz);
        
        const springGeo = new THREE.TorusGeometry(1, 0.2, 16, 64, Math.PI * 8);
        const springMesh = new THREE.Mesh(springGeo, steel);
        springMesh.position.set(dx, -3.5, dz);
        springMesh.rotation.x = Math.PI/2;
        springMesh.scale.z = 0.2; // Compress spring visually
        
        baseGroup.add(damperMesh);
        baseGroup.add(springMesh);
    }
    
    parts.push({
        name: "Reinforced Anti-Seismic Vault Base",
        description: "A heavily armored, shock-absorbing platform using active elastomeric dampers to isolate the quantum core from any environmental vibrations.",
        material: darkSteel,
        function: "Vibration isolation and structural foundation",
        assemblyOrder: 1,
        connections: ["Cryogenic Support Pillars", "Hydraulic Dampers", "Vault Shells"],
        failureEffect: "Quantum decoherence due to vibrational noise crossing the micro-g threshold",
        cascadeFailures: ["Qubit Array", "Optical Fiber Alignment"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });
    group.add(baseGroup);

    // 2. Main Structural Chandelier Support
    const supportGroup = new THREE.Group();
    for (let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const rad = 6.5;
        const px = Math.cos(angle) * rad;
        const pz = Math.sin(angle) * rad;
        
        // Main pillar
        const pillarGeo = new THREE.CylinderGeometry(0.5, 0.8, 16, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, steel);
        pillarMesh.position.set(px, 8, pz);
        supportGroup.add(pillarMesh);
        
        // Bracing arms to center
        const armGeo = new THREE.CylinderGeometry(0.3, 0.3, rad, 16);
        const armMesh = new THREE.Mesh(armGeo, chrome);
        armMesh.position.set(px/2, 14, pz/2);
        armMesh.lookAt(px, 14, pz);
        armMesh.rotateY(Math.PI/2);
        supportGroup.add(armMesh);
    }
    
    parts.push({
        name: "Titanium Chandelier Support Scaffolding",
        description: "Thermal-isolated titanium pillars suspending the dilution refrigerator above the seismic base.",
        material: steel,
        function: "Structural support with minimal thermal conductivity",
        assemblyOrder: 2,
        connections: ["Base Platform", "Dilution Refrigerator"],
        failureEffect: "Structural collapse of the cryogenic system",
        cascadeFailures: ["Dilution Refrigerator", "Quantum Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 30 }
    });
    group.add(supportGroup);

    // 3. Cryogenic Dilution Refrigerator
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.y = 8;
    
    // Top Plate (Room Temp Flange)
    const topPlateGeo = new THREE.CylinderGeometry(6, 6, 0.6, 64);
    const topPlateMesh = new THREE.Mesh(topPlateGeo, copper);
    topPlateMesh.position.y = 6;
    chandelierGroup.add(topPlateMesh);

    // Multi-stage cooling plates and shields
    const stages = [
        { radius: 5.5, height: 4, y: 4, mat: chrome, name: "50K Shield Flange" },    
        { radius: 4.8, height: 2, y: 1, mat: copper, name: "4K Shield Flange" },    
        { radius: 4.0, height: 1.5, y: -1, mat: copper, name: "Still Plate (1K)" }, 
        { radius: 3.2, height: 1.2, y: -2.5, mat: chrome, name: "Cold Plate (100mK)" }, 
        { radius: 2.2, height: 1, y: -4.5, mat: copper, name: "Mixing Chamber (10mK)" }  
    ];

    stages.forEach((stage, idx) => {
        // The flange plate
        const stageGeo = new THREE.CylinderGeometry(stage.radius, stage.radius, 0.3, 64);
        const stageMesh = new THREE.Mesh(stageGeo, stage.mat);
        stageMesh.position.y = stage.y;
        chandelierGroup.add(stageMesh);

        // Extensive wiring and cooling pipes between stages
        if (idx > 0) {
            const prevStage = stages[idx-1];
            const dist = prevStage.y - stage.y;
            
            // Heat exchangers (spiral tubes)
            const spiralCurve = new THREE.CatmullRomCurve3();
            const points = [];
            for (let t=0; t<=20; t++) {
                const a = t * Math.PI;
                const r = stage.radius * 0.5;
                points.push(new THREE.Vector3(Math.cos(a)*r, stage.y + dist*(t/20), Math.sin(a)*r));
            }
            spiralCurve.points = points;
            const hxGeo = new THREE.TubeGeometry(spiralCurve, 64, 0.08, 8, false);
            const hxMesh = new THREE.Mesh(hxGeo, copper);
            chandelierGroup.add(hxMesh);

            // Support rods
            for (let r=0; r<8; r++) {
                const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, dist, 16);
                const rodMesh = new THREE.Mesh(rodGeo, steel);
                const angle = (r / 8) * Math.PI * 2;
                const rad = stage.radius * 0.8;
                rodMesh.position.set(Math.cos(angle) * rad, stage.y + dist/2, Math.sin(angle) * rad);
                chandelierGroup.add(rodMesh);
            }
        }
    });

    parts.push({
        name: "Multi-Stage Helium Dilution Refrigerator",
        description: "An intricate assembly of gold-plated copper flanges, sintered silver heat exchangers, and continuous circulation paths bringing the core to 10 millikelvin.",
        material: copper,
        function: "Cooling the quantum processor to near absolute zero",
        assemblyOrder: 3,
        connections: ["Support Scaffolding", "Quantum Core", "Cryogen Pumps"],
        failureEffect: "Thermal noise overwhelms quantum states, terminating entanglement",
        cascadeFailures: ["Qubit Array"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });
    group.add(chandelierGroup);

    // 4. Quantum Core & Qubit Array
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 2; // Below mixing chamber
    
    // Magnetic Confinement Coils (Torus Knots)
    for(let i=0; i<3; i++) {
        const knotGeo = new THREE.TorusKnotGeometry(1.8, 0.1, 128, 16, i+2, 3);
        const knotMesh = new THREE.Mesh(knotGeo, copper);
        coreGroup.add(knotMesh);
        confinementCoils.push({mesh: knotMesh, axis: i});
    }

    // Core housing sphere
    const coreHousingGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const coreHousing = new THREE.Mesh(coreHousingGeo, quantumCoreMat);
    coreGroup.add(coreHousing);

    // Qubits inside the core
    const qubitGeo = new THREE.OctahedronGeometry(0.2, 0);
    for (let i = 0; i < 32; i++) {
        const qbMesh = new THREE.Mesh(qubitGeo, neonPurple);
        const phi = Math.acos(1 - 2 * (i + 0.5) / 32);
        const theta = Math.PI * (1 + Math.pow(5, 0.5)) * i;
        qbMesh.position.x = 0.9 * Math.cos(theta) * Math.sin(phi);
        qbMesh.position.y = 0.9 * Math.sin(theta) * Math.sin(phi);
        qbMesh.position.z = 0.9 * Math.cos(phi);
        coreGroup.add(qbMesh);
        qubits.push(qbMesh);
    }
    
    // Superconducting Microwave Lines (Twisted pairs)
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 32; i++) {
        const qPos = qubits[i].position;
        const curvePoints = [];
        for (let t=0; t<=10; t++) {
            const lx = qPos.x + (0 - qPos.x) * (t/10);
            const ly = qPos.y + (1.5 - qPos.y) * (t/10);
            const lz = qPos.z + (0 - qPos.z) * (t/10);
            const twist = 0.2;
            curvePoints.push(new THREE.Vector3(lx + Math.cos(t)*twist, ly, lz + Math.sin(t)*twist));
        }
        const path = new THREE.CatmullRomCurve3(curvePoints);
        const lineGeo = new THREE.TubeGeometry(path, 16, 0.015, 8, false);
        const lineMesh = new THREE.Mesh(lineGeo, steel);
        linesGroup.add(lineMesh);
    }
    coreGroup.add(linesGroup);

    parts.push({
        name: "Topological Qubit Core & Confinement Coils",
        description: "The processing nexus featuring 32 physical topological qubits protected by active magnetic confinement fields.",
        material: quantumCoreMat,
        function: "Performing error-corrected quantum cryptographic operations",
        assemblyOrder: 4,
        connections: ["Dilution Refrigerator", "Microwave Control Lines"],
        failureEffect: "Complete cryptographic failure, instantaneous state collapse",
        cascadeFailures: ["Secure Vault Protocol"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });
    group.add(coreGroup);

    // 5. Heavy Retractable Shielding Vault
    const vaultGroup = new THREE.Group();
    
    for (let i=0; i<3; i++) {
        const angleStart = (i/3) * Math.PI * 2;
        const angleEnd = ((i+1)/3) * Math.PI * 2 - 0.1; // gap for opening
        
        const shellShape = new THREE.Shape();
        shellShape.absarc(0, 0, 11, angleStart, angleEnd, false);
        shellShape.absarc(0, 0, 13.5, angleEnd, angleStart, true);
        
        const shellExtrude = { depth: 18, curveSegments: 64, bevelEnabled: true, bevelThickness: 0.8, bevelSize: 0.8, bevelSegments: 4 };
        const shellGeo = new THREE.ExtrudeGeometry(shellShape, shellExtrude);
        const shellMesh = new THREE.Mesh(shellGeo, darkSteel);
        shellMesh.rotation.x = Math.PI / 2;
        shellMesh.position.y = 18; 
        
        // Exterior details on shell
        for(let r=1; r<=4; r++) {
            const ribGeo = new THREE.TorusGeometry(13.6, 0.4, 16, 64, angleEnd - angleStart);
            const ribMesh = new THREE.Mesh(ribGeo, steel);
            ribMesh.rotation.z = angleStart;
            ribMesh.position.z = -r * 3.5;
            shellMesh.add(ribMesh);
        }

        const shellWrapper = new THREE.Group();
        shellWrapper.add(shellMesh);
        vaultGroup.add(shellWrapper);
        vaultShells.push({ group: shellWrapper, angle: (angleStart + angleEnd)/2 });
    }

    parts.push({
        name: "Mu-Metal & Depleted Uranium Vault Shells",
        description: "Three massive retractable armor segments providing absolute isolation from radiation, EMPs, and physical intrusion.",
        material: darkSteel,
        function: "Protecting the core from external reality",
        assemblyOrder: 5,
        connections: ["Base Platform", "Hydraulic Actuators", "Locking Ring"],
        failureEffect: "Vulnerability to targeted EMP, radiation spikes, or physical espionage",
        cascadeFailures: ["Quantum Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });
    group.add(vaultGroup);

    // 6. Extreme Hydraulic Actuators
    const hydraulicGroup = new THREE.Group();
    for (let i=0; i<3; i++) {
        const angle = vaultShells[i].angle;
        const hx = Math.cos(angle) * 12.25;
        const hz = Math.sin(angle) * 12.25;
        
        // Base Mount
        const mountGeo = new THREE.BoxGeometry(2, 2, 2);
        const mountMesh = new THREE.Mesh(mountGeo, steel);
        mountMesh.position.set(hx, 1, hz);
        
        // Outer Cylinder
        const cylGeo = new THREE.CylinderGeometry(1, 1, 12, 32);
        const cylMesh = new THREE.Mesh(cylGeo, darkSteel);
        cylMesh.position.set(hx, 7, hz);
        
        // Inner Piston
        const pistonGeo = new THREE.CylinderGeometry(0.6, 0.6, 12, 32);
        const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
        pistonMesh.position.set(hx, 13, hz);
        
        // Fluid Manifolds
        const manifoldGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
        const manifoldMesh = new THREE.Mesh(manifoldGeo, copper);
        manifoldMesh.position.set(hx * 1.1, 4, hz * 1.1);
        
        // Heavy duty hoses
        const hosePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(hx * 1.1, 4, hz * 1.1),
            new THREE.Vector3(hx * 1.3, 2, hz * 1.3),
            new THREE.Vector3(hx * 1.2, 0, hz * 1.2)
        ]);
        const hoseGeo = new THREE.TubeGeometry(hosePath, 16, 0.25, 12, false);
        const hoseMesh = new THREE.Mesh(hoseGeo, rubber);

        hydraulicGroup.add(mountMesh);
        hydraulicGroup.add(cylMesh);
        hydraulicGroup.add(pistonMesh);
        hydraulicGroup.add(manifoldMesh);
        hydraulicGroup.add(hoseMesh);
        
        hydraulicPistons.push(pistonMesh);
    }

    parts.push({
        name: "Industrial Heavy-Lift Hydraulic Actuators",
        description: "High-pressure pistons utilizing synthetic diamond fluid to silently lift the massive vault shells.",
        material: chrome,
        function: "Opening and closing the vault shielding",
        assemblyOrder: 6,
        connections: ["Vault Shells", "Base Platform"],
        failureEffect: "Vault is jammed, preventing maintenance or sealing",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 40 }
    });
    group.add(hydraulicGroup);

    // 7. Optical Fiber Array & Laser Modulators
    const opticalGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const bundleGroup = new THREE.Group();
        const angle = (i / 6) * Math.PI * 2;
        const bx = Math.cos(angle) * 7.5;
        const bz = Math.sin(angle) * 7.5;
        
        bundleGroup.position.set(bx, 1.5, bz);
        bundleGroup.lookAt(0, 1.5, 0);

        // Input Lens assembly
        const lensBaseGeo = new THREE.CylinderGeometry(0.6, 0.8, 2, 32);
        lensBaseGeo.rotateX(Math.PI/2);
        const lensBase = new THREE.Mesh(lensBaseGeo, darkSteel);
        bundleGroup.add(lensBase);
        
        const lensGeo = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI*2, 0, Math.PI/2);
        lensGeo.rotateX(Math.PI/2);
        const lens = new THREE.Mesh(lensGeo, glass);
        lens.position.z = -1;
        bundleGroup.add(lens);

        // Emitting light ray
        const rayGeo = new THREE.CylinderGeometry(0.1, 0.1, 7.5, 16);
        rayGeo.rotateX(Math.PI/2);
        const rayMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        const rayMesh = new THREE.Mesh(rayGeo, rayMat);
        rayMesh.position.z = -4.75;
        bundleGroup.add(rayMesh);

        // External Fiber cables
        const fiberPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, -1, 3),
            new THREE.Vector3((Math.random()-0.5)*4, -3, 8)
        ]);
        const fiberGeo = new THREE.TubeGeometry(fiberPath, 32, 0.2, 16, false);
        const fiber = new THREE.Mesh(fiberGeo, plastic);
        bundleGroup.add(fiber);
        
        opticalGroup.add(bundleGroup);
        fiberBundles.push(bundleGroup);
    }
    
    parts.push({
        name: "Single-Photon Optical Fiber Arrays",
        description: "Precision laser assemblies that pipe entangled photons directly into the cryogenic chamber for Quantum Key Distribution.",
        material: glass,
        function: "Transmitting and receiving quantum data",
        assemblyOrder: 7,
        connections: ["Base Platform", "External Global Network"],
        failureEffect: "Loss of quantum link, system defaults to vulnerable classical keys",
        cascadeFailures: ["Global Secure Network"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 10, z: 30 }
    });
    group.add(opticalGroup);

    // 8. Master Power Generators & Transformers
    const powerGroup = new THREE.Group();
    powerGroup.position.set(-14, 2, -10);
    
    // Main housing
    const genGeo = new THREE.BoxGeometry(6, 6, 8);
    const genMesh = new THREE.Mesh(genGeo, darkSteel);
    powerGroup.add(genMesh);
    
    // Capacitors / Transformers on top
    for(let i=0; i<3; i++) {
        const capGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
        const capMesh = new THREE.Mesh(capGeo, copper);
        capMesh.position.set(0, 4.5, -2 + i*2);
        powerGroup.add(capMesh);
        
        // Arc glowing rings
        const arcGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 64);
        const arcMesh = new THREE.Mesh(arcGeo, neonBlue);
        arcMesh.rotation.x = Math.PI/2;
        arcMesh.position.set(0, 4.5, -2 + i*2);
        powerGroup.add(arcMesh);
    }
    
    // Massive Power cables routing under floor
    for(let i=0; i<2; i++) {
        const cPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3, 0, (i-0.5)*2),
            new THREE.Vector3(5, -1.5, (i-0.5)*2),
            new THREE.Vector3(10, -2, 10)
        ]);
        const cGeo = new THREE.TubeGeometry(cPath, 32, 0.4, 16, false);
        const cMesh = new THREE.Mesh(cGeo, rubber);
        powerGroup.add(cMesh);
    }

    parts.push({
        name: "Zero-Point Power Modulators",
        description: "Massive transformers conditioning raw grid power into perfectly flat, noise-free DC current for sensitive quantum components.",
        material: copper,
        function: "Supplying ultra-clean electrical power",
        assemblyOrder: 8,
        connections: ["Grid Input", "Cryogen Pumps", "Microwave Rack"],
        failureEffect: "Instantaneous brownout, loss of cooling and quantum state",
        cascadeFailures: ["Entire System"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 5, z: -30 }
    });
    group.add(powerGroup);

    // 9. Microwave Laser Control Rack
    const controlRackGroup = new THREE.Group();
    controlRackGroup.position.set(13, 6, -5);
    
    const rackGeo = new THREE.BoxGeometry(4, 12, 6);
    const rackMesh = new THREE.Mesh(rackGeo, darkSteel);
    controlRackGroup.add(rackMesh);
    
    // Server blades
    for(let i=0; i<10; i++) {
        const bladeGeo = new THREE.BoxGeometry(4.2, 0.6, 5.8);
        const bladeMesh = new THREE.Mesh(bladeGeo, steel);
        bladeMesh.position.set(0, -5 + i*1.1, 0);
        controlRackGroup.add(bladeMesh);

        // LED Arrays on blades
        for(let j=0; j<8; j++) {
            const ledGeo = new THREE.PlaneGeometry(0.2, 0.2);
            const ledMat = j%3===0 ? neonBlue : (j%2===0 ? neonCyan : neonGreen);
            const ledMesh = new THREE.Mesh(ledGeo, ledMat);
            ledMesh.position.set(-1.8, -5 + i*1.1, 2.91);
            controlRackGroup.add(ledMesh);
            leds.push({ mesh: ledMesh, offset: Math.random() * 20 });
        }
    }

    parts.push({
        name: "Microwave Pulse Logic Controllers",
        description: "High-frequency FPGA arrays that synthesize the exact microwave waveforms needed to execute quantum logic gates.",
        material: steel,
        function: "Controlling qubit logic operations",
        assemblyOrder: 9,
        connections: ["Microwave Control Lines", "Power Modulators"],
        failureEffect: "Inability to process algorithms or generate keys",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 5, z: -10 }
    });
    group.add(controlRackGroup);

    // 10. Operator Console & Telemetry Screens
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, 2, 16);
    
    // Desk
    const deskGeo = new THREE.BoxGeometry(8, 2, 3);
    const deskMesh = new THREE.Mesh(deskGeo, plastic);
    consoleGroup.add(deskMesh);
    
    // Main Holographic Screen
    const screenGeo = new THREE.PlaneGeometry(10, 5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000510, side: THREE.DoubleSide });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 4, -1);
    
    // UI Elements on screen
    const gridHelper = new THREE.GridHelper(10, 20, 0x00aaff, 0x004488);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 4, -0.99);
    consoleGroup.add(gridHelper);

    for(let i=0; i<15; i++) {
        const bGeo = new THREE.PlaneGeometry(0.8, 0.3);
        const bMesh = new THREE.Mesh(bGeo, neonCyan);
        bMesh.position.set((Math.random()-0.5)*9, 4 + (Math.random()-0.5)*4, -0.98);
        consoleGroup.add(bMesh);
        dataBlocks.push(bMesh);
    }
    
    consoleGroup.add(screenMesh);

    parts.push({
        name: "Operator Control & Telemetry Console",
        description: "Primary interface for monitoring quantum state tomography, cryogenic temperatures, and cryptographic key rates.",
        material: plastic,
        function: "Human-machine interface",
        assemblyOrder: 10,
        connections: ["Microwave Rack", "Hydraulic Controllers", "Optical Arrays"],
        failureEffect: "Loss of manual override and monitoring",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 40 }
    });
    group.add(consoleGroup);

    // 11. Maintenance Catwalk & Railings
    const catwalkGroup = new THREE.Group();
    const cwShape = new THREE.Shape();
    cwShape.absarc(0, 0, 15, 0, Math.PI * 1.5, false); // 3/4 circle
    cwShape.absarc(0, 0, 18, Math.PI * 1.5, 0, true);
    
    const cwGeo = new THREE.ExtrudeGeometry(cwShape, { depth: 0.5, bevelEnabled: false, curveSegments: 64 });
    const cwMesh = new THREE.Mesh(cwGeo, steel);
    cwMesh.rotation.x = Math.PI / 2;
    cwMesh.position.y = 10;
    
    // Railings
    for(let i=0; i<=30; i++) {
        const angle = (i/30) * Math.PI * 1.5;
        const rxIn = Math.cos(angle) * 15.2;
        const rzIn = -Math.sin(angle) * 15.2; 
        const rxOut = Math.cos(angle) * 17.8;
        const rzOut = -Math.sin(angle) * 17.8;
        
        const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 8);
        const postMat = aluminum;
        
        const postIn = new THREE.Mesh(postGeo, postMat);
        postIn.position.set(rxIn, 11.25, rzIn);
        catwalkGroup.add(postIn);
        
        const postOut = new THREE.Mesh(postGeo, postMat);
        postOut.position.set(rxOut, 11.25, rzOut);
        catwalkGroup.add(postOut);
    }
    
    catwalkGroup.add(cwMesh);
    
    parts.push({
        name: "Elevated Diagnostics Catwalk",
        description: "A titanium grated walkway allowing engineers physical access to the dilution refrigerator flanges and optical alignment lenses.",
        material: steel,
        function: "Maintenance Access",
        assemblyOrder: 11,
        connections: ["Base Platform"],
        failureEffect: "None",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -35 }
    });
    group.add(catwalkGroup);

    // 12. Auto-Alignment Calibration Drones
    const droneGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const droneMesh = new THREE.Group();
        const bodyGeo = new THREE.TetrahedronGeometry(0.6, 2);
        const body = new THREE.Mesh(bodyGeo, chrome);
        
        const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const eye = new THREE.Mesh(eyeGeo, neonRed);
        eye.position.z = 0.5;
        
        const dLight = new THREE.PointLight(0xff0044, 2, 8);
        dLight.position.set(0, 0, 0);
        
        droneMesh.add(body);
        droneMesh.add(eye);
        droneMesh.add(dLight);

        const droneAngle = (i/4) * Math.PI * 2;
        droneMesh.position.set(Math.cos(droneAngle) * 9, 14, Math.sin(droneAngle) * 9);
        
        droneGroup.add(droneMesh);
        drones.push({ group: droneMesh, angle: droneAngle, speed: 0.3 + Math.random()*0.4, baseHeight: 14 + i*0.5 });
    }

    parts.push({
        name: "Auto-Alignment Laser Drones",
        description: "Autonomous hovering units that emit spatial reference lasers, ensuring the fiber optics remain perfectly aligned to the sub-micron level.",
        material: chrome,
        function: "Dynamic spatial alignment of optical inputs",
        assemblyOrder: 12,
        connections: [],
        failureEffect: "Gradual degradation of QKD fidelity due to micro-seismic shifts",
        cascadeFailures: ["Optical Fiber Arrays"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: -40 }
    });
    group.add(droneGroup);

    // 13. Helium Compressors & Cryogen Tanks
    const pumpGroup = new THREE.Group();
    for (let i=0; i<2; i++) {
        const xPos = i === 0 ? -12 : 12;
        const zPos = -12;
        
        // Main Pressure Vessel
        const tankGeo = new THREE.CapsuleGeometry(2.5, 7, 32, 32);
        const tankMesh = new THREE.Mesh(tankGeo, steel);
        tankMesh.position.set(xPos, 6, zPos);
        
        // Turbo Pump Motor
        const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
        motorGeo.rotateZ(Math.PI/2);
        const motorMesh = new THREE.Mesh(motorGeo, darkSteel);
        motorMesh.position.set(xPos, 1, zPos);
        
        // Giant Heat Sinks
        for(let j=0; j<15; j++) {
            const finGeo = new THREE.BoxGeometry(4, 0.1, 4);
            const finMesh = new THREE.Mesh(finGeo, aluminum);
            finMesh.position.set(xPos, 3.5 + j*0.3, zPos);
            pumpGroup.add(finMesh);
        }

        // Complex Pipe network
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(xPos, 9, zPos),
            new THREE.Vector3(xPos*0.8, 14, zPos*0.5),
            new THREE.Vector3(0, 16, 0) // Connects to top flange
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipePath, 32, 0.6, 16, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper);

        pumpGroup.add(tankMesh);
        pumpGroup.add(motorMesh);
        pumpGroup.add(pipeMesh);
    }
    
    parts.push({
        name: "He-3 / He-4 Cryogen Circulation Compressors",
        description: "Industrial turbo-molecular pumps driving the continuous cycle of helium isotopes required for the 10mK dilution refrigerator.",
        material: steel,
        function: "Pumping cryogenic fluids to the dilution refrigerator",
        assemblyOrder: 13,
        connections: ["Dilution Refrigerator", "Power Generators"],
        failureEffect: "Rapid thermal runaway destroying quantum coherence",
        cascadeFailures: ["Dilution Refrigerator", "Quantum Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });
    group.add(pumpGroup);

    // 14. Emergency Coolant Flush Ring
    const flushGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(8, 0.4, 32, 64);
    const ringMesh = new THREE.Mesh(ringGeo, steel);
    ringMesh.rotation.x = Math.PI/2;
    ringMesh.position.y = 17;
    flushGroup.add(ringMesh);

    for (let i=0; i<6; i++) {
        const vAngle = (i/6) * Math.PI * 2;
        const vx = Math.cos(vAngle) * 8;
        const vz = Math.sin(vAngle) * 8;
        
        const nozzleGeo = new THREE.ConeGeometry(0.3, 1, 16);
        nozzleGeo.rotateX(Math.PI/2);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, copper);
        nozzleMesh.position.set(vx, 17, vz);
        nozzleMesh.lookAt(0, 17, 0);
        
        flushGroup.add(nozzleMesh);
    }
    
    parts.push({
        name: "Emergency Liquid Nitrogen Deluge Ring",
        description: "A failsafe ring capable of rapidly flooding the internal vault atmosphere with LN2 in the event of primary cooling failure.",
        material: steel,
        function: "Failsafe thermal protection",
        assemblyOrder: 14,
        connections: ["Dilution Refrigerator", "Vault Shells"],
        failureEffect: "No backup cooling during compressor failure",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });
    group.add(flushGroup);

    // 15. The Master Locking Ring & Biometric Seal
    const lockGroup = new THREE.Group();
    const lockRingGeo = new THREE.TorusGeometry(14.0, 0.8, 64, 128);
    const lockRingMesh = new THREE.Mesh(lockRingGeo, darkSteel);
    lockRingMesh.rotation.x = Math.PI / 2;
    lockRingMesh.position.y = 19;
    lockGroup.add(lockRingMesh);
    
    // Glowing lock indicator track
    const lockIndGeo = new THREE.TorusGeometry(14.2, 0.2, 16, 128);
    const lockIndMesh = new THREE.Mesh(lockIndGeo, neonGreen);
    lockIndMesh.rotation.x = Math.PI / 2;
    lockIndMesh.position.y = 19;
    lockGroup.add(lockIndMesh);

    parts.push({
        name: "Biometric Hydraulic Locking Ring",
        description: "Secures the three multi-ton vault shells together at the apex. Requires quantum-entangled keys and multi-factor biometrics to disengage.",
        material: darkSteel,
        function: "Vault security seal",
        assemblyOrder: 15,
        connections: ["Vault Shells"],
        failureEffect: "Vault cannot be properly sealed, leaving EMP vulnerabilities",
        cascadeFailures: ["Vault Shells"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });
    group.add(lockGroup);


    const description = "The Cyber Quantum Key Cryptoprocessor is an ultra-massive, state-of-the-art facility-scale machine dedicated to generating unbreakable cryptographic keys via Quantum Key Distribution (QKD) and executing fault-tolerant quantum algorithms. It centers around a 32-qubit topological array suspended within a colossal multi-stage He-3/He-4 dilution refrigerator operating at 10 millikelvin. This highly sensitive core is shielded by three retractable, hydraulically actuated vault shells composed of Mu-metal and depleted uranium to block all electromagnetic, seismic, and radiation interference. Auxiliary subsystems include zero-point power modulators, autonomous laser-alignment drones, and single-photon optical fiber arrays.";

    const quizQuestions = [
        {
            question: "What temperature does the mixing chamber of the Dilution Refrigerator operate at?",
            options: ["Room Temperature (300K)", "Liquid Nitrogen (77K)", "Liquid Helium (4K)", "Near Absolute Zero (10mK)"],
            answer: 3,
            explanation: "The dilution refrigerator uses a complex mixture of He-3 and He-4 isotopes to cool the quantum core down to 10 millikelvin, essential for preventing thermal noise from destroying delicate quantum states."
        },
        {
            question: "What is the primary function of the Microwave Pulse Logic Controllers?",
            options: ["To provide high-speed wifi", "To manipulate the spin states of the qubits", "To power the hydraulic actuators", "To heat up the cryogens"],
            answer: 1,
            explanation: "Microwave pulses of very specific frequencies and durations are synthesized by FPGAs to precisely rotate the quantum state vectors (spin states) of the topological qubits, effectively executing logic gates."
        },
        {
            question: "Why does the machine utilize Mu-Metal & Depleted Uranium Vault Shells?",
            options: ["For aesthetic purposes", "To prevent physical, electromagnetic, and radiation interference from causing qubit decoherence", "To keep the cold air inside", "To trap the photons"],
            answer: 1,
            explanation: "Quantum bits are incredibly sensitive to environmental noise. Magnetic fields, ambient radiation, or EMPs can easily cause decoherence, destroying the quantum information."
        },
        {
            question: "What role do the Auto-Alignment Laser Drones play?",
            options: ["They act as physical security guards", "They deliver spare parts", "They emit reference lasers to maintain perfect spatial alignment of the optical inputs", "They clean the vault surfaces"],
            answer: 2,
            explanation: "To maintain high-fidelity single-photon transfer for QKD, optical fiber links must be perfectly aligned. The drones provide dynamic spatial reference points to constantly correct for micro-seismic shifts."
        },
        {
            question: "What happens if the He-3 / He-4 Cryogen Circulation Compressors fail?",
            options: ["The machine speeds up", "Rapid thermal runaway leading to quantum decoherence", "The vault doors open automatically", "The microwave rack shuts down"],
            answer: 1,
            explanation: "Without the continuous turbo-molecular circulation of cryogens, the dilution refrigerator will rapidly heat up due to ambient thermal leakage, completely destroying the operational environment for the qubits."
        }
    ];

    // Animation variables
    let vaultOpenFactor = 0; // 0 to 1

    const animate = (time, speed, meshes) => {
        // Quantum Core Animations
        qubits.forEach((qb, i) => {
            qb.rotation.x += 0.05 * speed;
            qb.rotation.y += 0.07 * speed;
            const scale = 1 + 0.3 * Math.sin(time * 3 * speed + i);
            qb.scale.set(scale, scale, scale);
        });

        // Magnetic Confinement Coils
        confinementCoils.forEach(coil => {
            if(coil.axis === 0) coil.mesh.rotation.x += 0.02 * speed;
            if(coil.axis === 1) coil.mesh.rotation.y += 0.02 * speed;
            if(coil.axis === 2) coil.mesh.rotation.z += 0.02 * speed;
        });

        // Drones orbiting and bobbing
        drones.forEach((drone, i) => {
            drone.angle += 0.01 * speed * drone.speed;
            drone.group.position.x = Math.cos(drone.angle) * 9;
            drone.group.position.z = Math.sin(drone.angle) * 9;
            drone.group.position.y = drone.baseHeight + Math.sin(time * 2 * speed + i) * 1.5;
            drone.group.lookAt(0, 10, 0); // Always look at core
        });

        // Server rack LEDs blinking fast
        leds.forEach(led => {
            if (Math.sin(time * 10 * speed + led.offset) > 0.5) {
                led.mesh.material.emissiveIntensity = 3;
            } else {
                led.mesh.material.emissiveIntensity = 0.2;
            }
        });

        // Telemetry screen data blocks flowing
        dataBlocks.forEach(block => {
            block.position.x -= 0.1 * speed;
            if (block.position.x < -4.5) {
                block.position.x = 4.5;
                block.position.y = 4 + (Math.random()-0.5)*4;
            }
        });

        // Vault breathing / pulsing logic lock indicator
        const pulse = (Math.sin(time * speed * 3) + 1) / 2;
        lockIndMesh.material.color.setHSL(0.33, 1.0, 0.1 + pulse * 0.4);
        lockIndMesh.material.emissiveIntensity = 1 + pulse * 3;
        
        // Fiber optic tips pulsing
        fiberBundles.forEach((bundle, i) => {
            const ray = bundle.children[2];
            ray.material.opacity = 0.3 + Math.sin(time * 5 * speed + i) * 0.4;
        });

        // Optional: Animate the vault opening and closing based on a slow sine wave
        vaultOpenFactor = (Math.sin(time * speed * 0.5) + 1) / 2; // oscillates 0 to 1
        
        // Move vault shells outward and retract pistons
        vaultShells.forEach((shellObj, i) => {
            // Move outward radially
            const moveDist = vaultOpenFactor * 5; 
            shellObj.group.position.x = Math.cos(shellObj.angle) * moveDist;
            shellObj.group.position.z = Math.sin(shellObj.angle) * moveDist;
        });

        // Adjust hydraulic pistons accordingly
        hydraulicPistons.forEach((piston, i) => {
            // As vault opens (vaultOpenFactor -> 1), piston compresses (y goes down)
            piston.position.y = 13 - (vaultOpenFactor * 4);
        });
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createQuantumKeyCryptoprocessor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
