import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // CUSTOM MATERIALS & GLOW EFFECTS
    // ==========================================
    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0xaa22ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 1.0,
        roughness: 0.2
    });

    const whiteHotMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 0.0, // Controlled by animation
        metalness: 0.8,
        roughness: 0.4
    });

    const shockwaveMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.0, // Controlled by animation
        side: THREE.FrontSide,
        depthWrite: false
    });

    const heavyArmor = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.7,
        bumpScale: 0.05
    });

    const glowingHeaterMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 8.0
    });

    // ==========================================
    // HELPER FUNCTIONS FOR EXTREME COMPLEXITY
    // ==========================================
    
    function createFlangedCylinder(radius, length, mat, flangeScale=1.2) {
        const grp = new THREE.Group();
        const main = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 64), mat);
        main.rotation.z = Math.PI / 2;
        grp.add(main);
        
        const fGeom = new THREE.CylinderGeometry(radius * flangeScale, radius * flangeScale, 0.5, 64);
        const f1 = new THREE.Mesh(fGeom, darkSteel);
        f1.rotation.z = Math.PI / 2;
        f1.position.x = -length / 2;
        grp.add(f1);
        
        const f2 = new THREE.Mesh(fGeom, darkSteel);
        f2.rotation.z = Math.PI / 2;
        f2.position.x = length / 2;
        grp.add(f2);
        
        // Bolts on flanges
        const numBolts = 24;
        for (let i = 0; i < numBolts; i++) {
            const angle = (Math.PI * 2 / numBolts) * i;
            const boltGeom = new THREE.CylinderGeometry(radius*0.05, radius*0.05, 0.6, 8);
            const bolt1 = new THREE.Mesh(boltGeom, chrome);
            bolt1.rotation.z = Math.PI / 2;
            bolt1.position.set(-length/2, Math.cos(angle) * radius * 1.1, Math.sin(angle) * radius * 1.1);
            grp.add(bolt1);
            
            const bolt2 = new THREE.Mesh(boltGeom, chrome);
            bolt2.rotation.z = Math.PI / 2;
            bolt2.position.set(length/2, Math.cos(angle) * radius * 1.1, Math.sin(angle) * radius * 1.1);
            grp.add(bolt2);
        }
        return grp;
    }

    function createCrawlerTire() {
        const tireGroup = new THREE.Group();
        
        // Intricate Rim
        const rimGeom = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 64);
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);
        
        // Internal Spokes (Complex array)
        for(let i=0; i<12; i++) {
            const spokeGrp = new THREE.Group();
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.3, 16), steel);
            spoke.rotation.z = (Math.PI * 2 / 12) * i;
            spokeGrp.add(spoke);
            // Spoke reinforcement
            const brace = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.1), darkSteel);
            brace.position.y = 0.8;
            brace.rotation.z = (Math.PI * 2 / 12) * i;
            spokeGrp.add(brace);
            tireGroup.add(spokeGrp);
        }
        
        // Torus Tire Body
        const torusGeom = new THREE.TorusGeometry(1.8, 0.6, 64, 128);
        const tire = new THREE.Mesh(torusGeom, rubber);
        tire.rotation.x = Math.PI / 2;
        tireGroup.add(tire);
        
        // Extremely Detailed Tread Lugs
        const lugCount = 120;
        const lugGeom = new THREE.BoxGeometry(0.9, 0.25, 1.7);
        for(let i=0; i<lugCount; i++) {
            const angle = (Math.PI * 2 / lugCount) * i;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.x = Math.cos(angle) * 2.35;
            lug.position.y = Math.sin(angle) * 2.35;
            lug.rotation.z = angle;
            // Angled chevron pattern
            lug.rotation.x = (i % 2 === 0) ? 0.3 : -0.3;
            lug.position.z = (i % 2 === 0) ? 0.3 : -0.3;
            tireGroup.add(lug);
        }
        return tireGroup;
    }

    function createTrussBeam(length, width, height) {
        const beamGrp = new THREE.Group();
        const main = new THREE.Mesh(new THREE.BoxGeometry(length, width, height), darkSteel);
        beamGrp.add(main);
        
        // Cross bracing
        const numBraces = Math.floor(length / 2);
        for(let i=0; i<numBraces; i++) {
            const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, height*1.4, 8), steel);
            cross.position.x = -length/2 + (i * 2) + 1;
            cross.rotation.x = Math.PI/4;
            beamGrp.add(cross);
            
            const cross2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, height*1.4, 8), steel);
            cross2.position.x = -length/2 + (i * 2) + 1;
            cross2.rotation.x = -Math.PI/4;
            beamGrp.add(cross2);
        }
        return beamGrp;
    }

    // ==========================================
    // MAJOR ASSEMBLIES
    // ==========================================

    // 1. Arc Heater Chamber
    const arcHeater = new THREE.Group();
    arcHeater.position.set(-80, 0, 0);
    const heaterBody = createFlangedCylinder(6, 20, steel, 1.15);
    arcHeater.add(heaterBody);
    
    // Internal glowing core visible through gaps
    const heaterCore = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 19.5, 32), glowingHeaterMat);
    heaterCore.rotation.z = Math.PI / 2;
    arcHeater.add(heaterCore);
    
    // Cryogenic cooling lines wrapping the heater
    const heaterCoolingGroup = new THREE.Group();
    for(let i=0; i<40; i++) {
        const pipe = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.2, 16, 64), copper);
        pipe.rotation.y = Math.PI / 2;
        pipe.position.x = -9 + (i * 0.45);
        heaterCoolingGroup.add(pipe);
    }
    arcHeater.add(heaterCoolingGroup);
    group.add(arcHeater);

    // 2. MHD Accelerator (Magnetohydrodynamic)
    const mhdAccelerator = new THREE.Group();
    mhdAccelerator.position.set(-50, 0, 0);
    
    // Massive Superconducting Coils
    const coilCount = 6;
    for(let i=0; i<coilCount; i++) {
        const coilAssembly = new THREE.Group();
        
        // Outer Housing
        const housing = new THREE.Mesh(new THREE.TorusGeometry(8, 2, 64, 128), darkSteel);
        housing.rotation.y = Math.PI / 2;
        coilAssembly.add(housing);
        
        // Inner Superconductor Ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(7, 0.8, 32, 64), superConductorMat);
        ring.rotation.y = Math.PI / 2;
        coilAssembly.add(ring);
        
        // Radial Power Feeders
        for(let j=0; j<8; j++) {
            const feeder = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 6, 16), copper);
            const angle = (Math.PI * 2 / 8) * j;
            feeder.position.set(0, Math.cos(angle)*9, Math.sin(angle)*9);
            feeder.rotation.x = angle;
            coilAssembly.add(feeder);
        }
        
        coilAssembly.position.x = -10 + (i * 4);
        mhdAccelerator.add(coilAssembly);
    }
    
    // Central MHD Plasma Tube
    const mhdTube = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 24, 64), glass);
    mhdTube.rotation.z = Math.PI / 2;
    mhdAccelerator.add(mhdTube);
    group.add(mhdAccelerator);

    // 3. Convergent-Divergent Nozzle (De Laval)
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(-25, 0, 0);
    
    const nozzlePoints = [];
    for (let i = 0; i <= 50; i++) {
        const x = (i / 50) * 20; // 0 to 20 length
        // Converge then diverge
        let y = 0;
        if (x < 5) {
            y = 3 - (x / 5) * 2; // Converge from 3 to 1
        } else {
            y = 1 + Math.pow((x - 5) / 3, 1.5); // Diverge massively to 12
        }
        nozzlePoints.push(new THREE.Vector2(y, x));
    }
    const nozzleGeom = new THREE.LatheGeometry(nozzlePoints, 128);
    const nozzleMesh = new THREE.Mesh(nozzleGeom, steel);
    nozzleMesh.rotation.z = -Math.PI / 2; // Point down +X
    nozzleMesh.position.x = -10;
    
    // Exterior Ribbing for Nozzle
    for(let i=1; i<20; i++) {
        const xPos = (i/20) * 20;
        let r = 0;
        if (xPos < 5) r = 3 - (xPos / 5) * 2;
        else r = 1 + Math.pow((xPos - 5) / 3, 1.5);
        
        const rib = new THREE.Mesh(new THREE.TorusGeometry(r+0.2, 0.4, 16, 64), darkSteel);
        rib.rotation.y = Math.PI / 2;
        rib.position.x = -10 + xPos;
        nozzleGroup.add(rib);
    }
    nozzleGroup.add(nozzleMesh);
    group.add(nozzleGroup);

    // 4. Test Section (Heavily Armored)
    const testSection = new THREE.Group();
    testSection.position.set(10, 0, 0);
    
    // Outer Hull (Octagonal)
    const hullShape = new THREE.Shape();
    const R = 15;
    for(let i=0; i<8; i++) {
        const angle = (Math.PI * 2 / 8) * i + Math.PI/8;
        if(i===0) hullShape.moveTo(Math.cos(angle)*R, Math.sin(angle)*R);
        else hullShape.lineTo(Math.cos(angle)*R, Math.sin(angle)*R);
    }
    hullShape.lineTo(Math.cos(Math.PI/8)*R, Math.sin(Math.PI/8)*R);
    
    // Inner Hull Hole
    const holePath = new THREE.Path();
    const rIn = 12;
    for(let i=0; i<8; i++) {
        const angle = (Math.PI * 2 / 8) * i + Math.PI/8;
        if(i===0) holePath.moveTo(Math.cos(angle)*rIn, Math.sin(angle)*rIn);
        else holePath.lineTo(Math.cos(angle)*rIn, Math.sin(angle)*rIn);
    }
    holePath.lineTo(Math.cos(Math.PI/8)*rIn, Math.sin(Math.PI/8)*rIn);
    hullShape.holes.push(holePath);
    
    const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const hullGeom = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    const hullMesh = new THREE.Mesh(hullGeom, heavyArmor);
    hullMesh.rotation.y = Math.PI / 2;
    hullMesh.position.x = -15;
    testSection.add(hullMesh);

    // Observation Windows (Tinted)
    const windowGeom = new THREE.CylinderGeometry(3, 3, 2, 32);
    const win1 = new THREE.Mesh(windowGeom, tinted);
    win1.rotation.x = Math.PI / 2;
    win1.position.set(0, 0, 13.5);
    testSection.add(win1);
    
    const win2 = new THREE.Mesh(windowGeom, tinted);
    win2.rotation.x = Math.PI / 2;
    win2.position.set(0, 0, -13.5);
    testSection.add(win2);
    
    // Massive Crawler Transporter underneath Test Section
    const crawler = new THREE.Group();
    crawler.position.set(0, -16, 0);
    const crawlerBody = new THREE.Mesh(new THREE.BoxGeometry(20, 4, 25), darkSteel);
    crawler.add(crawlerBody);
    
    // 8 Huge Tires for crawler
    const tirePositions = [
        [-8, 0, 14], [8, 0, 14], [-8, 0, -14], [8, 0, -14],
        [-8, 0, 9], [8, 0, 9], [-8, 0, -9], [8, 0, -9]
    ];
    tirePositions.forEach(pos => {
        const t = createCrawlerTire();
        t.position.set(pos[0], pos[1], pos[2]);
        // Orient tires correctly
        t.rotation.y = Math.PI / 2;
        crawler.add(t);
    });
    testSection.add(crawler);
    
    group.add(testSection);

    // 5. Multi-Axis Sting Support System & Re-entry Capsule
    const stingSystem = new THREE.Group();
    stingSystem.position.set(20, 0, 0); // Positioned inside/back of test section
    
    // Base Strut
    const stingBase = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 4), steel);
    stingBase.position.x = 10;
    stingSystem.add(stingBase);
    
    // Telescoping Arm
    const stingArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 32), chrome);
    stingArm.rotation.z = Math.PI / 2;
    stingArm.position.x = 2.5;
    stingSystem.add(stingArm);
    
    // Pitch/Yaw Gimbal Joints
    const gimbalX = new THREE.Group(); // Pitch
    const gimbalXMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), darkSteel);
    gimbalX.add(gimbalXMesh);
    gimbalX.position.x = -5; // Attach to front of arm
    
    const gimbalY = new THREE.Group(); // Yaw
    const gimbalYMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 3, 32), steel);
    gimbalY.add(gimbalYMesh);
    gimbalX.add(gimbalY);
    
    // Re-entry Capsule (Test Article)
    const capsuleGroup = new THREE.Group();
    
    // Capsule Geometry (Blunt body)
    const capPoints = [];
    for(let i=0; i<=20; i++) {
        const a = (i/20) * Math.PI/2;
        // Elliptical heat shield face
        capPoints.push(new THREE.Vector2(Math.cos(a)*3.5, -Math.sin(a)*1.5));
    }
    // Conical backshell
    capPoints.push(new THREE.Vector2(3.5, 0));
    capPoints.push(new THREE.Vector2(1.5, 4));
    capPoints.push(new THREE.Vector2(0, 4));
    
    const capGeom = new THREE.LatheGeometry(capPoints, 64);
    const capsuleMesh = new THREE.Mesh(capGeom, aluminum);
    capsuleMesh.rotation.z = -Math.PI / 2; // Point heat shield into flow (-X)
    capsuleGroup.add(capsuleMesh);
    
    // Glowing Ablative Heat Shield
    const shieldGeom = new THREE.LatheGeometry(capPoints.slice(0, 21), 64); // Just the front face
    const heatShieldMesh = new THREE.Mesh(shieldGeom, whiteHotMat);
    heatShieldMesh.rotation.z = -Math.PI / 2;
    // slightly offset to prevent z-fighting
    heatShieldMesh.position.x = -0.05; 
    capsuleGroup.add(heatShieldMesh);
    
    // Extreme Bow Shockwave (Transparent Glowing Cone)
    const shockGeom = new THREE.ConeGeometry(8, 12, 64, 1, true);
    const shockMesh = new THREE.Mesh(shockGeom, shockwaveMat);
    shockMesh.rotation.z = -Math.PI / 2;
    shockMesh.position.x = -6.5; // Ahead of capsule
    capsuleGroup.add(shockMesh);
    
    gimbalY.add(capsuleGroup);
    stingSystem.add(gimbalX);
    group.add(stingSystem);

    // 6. Diffuser and Scrubber
    const diffuserGroup = new THREE.Group();
    diffuserGroup.position.set(40, 0, 0);
    
    const diffPoints = [];
    for(let i=0; i<=20; i++) {
        const x = (i/20) * 30;
        const y = 12 + (i/20) * 8; // Expands from 12 to 20
        diffPoints.push(new THREE.Vector2(y, x));
    }
    const diffGeom = new THREE.LatheGeometry(diffPoints, 64);
    const diffMesh = new THREE.Mesh(diffGeom, steel);
    diffMesh.rotation.z = -Math.PI / 2;
    diffuserGroup.add(diffMesh);
    
    // Massive Cooling Ribs on Diffuser
    for(let i=1; i<15; i++) {
        const xPos = (i/15) * 30;
        const r = 12 + (i/15) * 8;
        const rib = new THREE.Mesh(new THREE.TorusGeometry(r+0.5, 0.8, 16, 64), copper);
        rib.rotation.y = Math.PI / 2;
        rib.position.x = xPos;
        diffuserGroup.add(rib);
    }
    group.add(diffuserGroup);

    // 7. Vacuum Accumulator Spheres
    const vacuumGroup = new THREE.Group();
    vacuumGroup.position.set(90, 0, 0);
    
    const sphereCenters = [
        [0, 20, 20], [0, 20, -20],
        [0, -20, 20], [0, -20, -20],
        [25, 0, 0]
    ];
    
    sphereCenters.forEach(pos => {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(15, 64, 64), heavyArmor);
        sphere.position.set(pos[0], pos[1], pos[2]);
        vacuumGroup.add(sphere);
        
        // Connect to center manifold
        const pipeLen = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1] + pos[2]*pos[2]);
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, pipeLen, 32), steel);
        pipe.position.set(pos[0]/2, pos[1]/2, pos[2]/2);
        pipe.lookAt(new THREE.Vector3(pos[0], pos[1], pos[2]));
        pipe.rotation.x += Math.PI/2;
        vacuumGroup.add(pipe);
    });
    
    // Central Manifold Box
    const manifold = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), darkSteel);
    vacuumGroup.add(manifold);
    
    group.add(vacuumGroup);

    // 8. Plasma Flow Particle System
    // Thousands of glowing particles representing the hypersonic ionized flow
    const particleCount = 10000;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    
    for(let i=0; i<particleCount; i++) {
        // Start randomly inside the arc heater / MHD area
        const x = Math.random() * 60 - 90; // -90 to -30
        const r = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const y = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        
        particlePositions[i*3] = x;
        particlePositions[i*3+1] = y;
        particlePositions[i*3+2] = z;
        
        // Velocity (X is dominant hypersonic speed)
        particleVelocities.push({
            vx: 50 + Math.random() * 20,
            vy: (Math.random() - 0.5) * 2,
            vz: (Math.random() - 0.5) * 2
        });
    }
    
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xcc44ff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const plasmaParticles = new THREE.Points(particleGeom, particleMat);
    group.add(plasmaParticles);

    // ==========================================
    // PARTS METADATA
    // ==========================================

    parts.push({
        name: "Arc Heater Core",
        description: "Contains massive tungsten electrodes that generate an electrical arc, heating the incoming gas to plasma state at over 10,000 Kelvin.",
        material: "Tungsten/Steel",
        function: "Ionize and hyper-heat the working gas.",
        assemblyOrder: 1,
        connections: ["Gas Supply", "MHD Accelerator", "Cooling System"],
        failureEffect: "Arc blowout or electrode melting, causing asymmetric flow and catastrophic thermal shock.",
        cascadeFailures: ["MHD Destabilization", "Nozzle Erosion"],
        originalPosition: { x: -80, y: 0, z: 0 },
        explodedPosition: { x: -80, y: 50, z: 0 }
    });
    
    parts.push({
        name: "MHD Superconducting Coils",
        description: "A series of 6 massive superconducting magnets that create a Lorentz force to accelerate the ionized plasma to extreme hypersonic velocities.",
        material: "Niobium-Titanium/Copper",
        function: "Electromagnetic acceleration of plasma.",
        assemblyOrder: 2,
        connections: ["Arc Heater", "Liquid Helium Cryogenics"],
        failureEffect: "Quench event leading to explosive liquid helium expansion and instant loss of flow acceleration.",
        cascadeFailures: ["Plasma Backflow", "Test Article Impact Loss"],
        originalPosition: { x: -50, y: 0, z: 0 },
        explodedPosition: { x: -50, y: 50, z: -50 }
    });

    parts.push({
        name: "De Laval Convergent-Divergent Nozzle",
        description: "Precision-machined supersonic expansion nozzle. Converts the thermal and pressure energy of the plasma into directed kinetic energy, achieving Mach 30+.",
        material: "Ablative Carbon-Carbon / Steel",
        function: "Flow expansion and Mach number generation.",
        assemblyOrder: 3,
        connections: ["MHD Accelerator", "Test Section"],
        failureEffect: "Boundary layer separation or localized melting, causing violent shockwave oscillations.",
        cascadeFailures: ["Test Article Destruction"],
        originalPosition: { x: -25, y: 0, z: 0 },
        explodedPosition: { x: -25, y: -50, z: 0 }
    });

    parts.push({
        name: "Heavily Armored Test Section Hull",
        description: "Octagonal containment vessel with 30-inch thick heavy armor to withstand both explosive overpressure and extreme thermal radiation from the plasma flow.",
        material: "Heavy Armor / Concrete",
        function: "Environment containment and observation.",
        assemblyOrder: 4,
        connections: ["Nozzle", "Diffuser", "Crawler Transporter"],
        failureEffect: "Hull breach resulting in explosive decompression and lethal plasma venting into the facility.",
        cascadeFailures: ["Total Facility Loss"],
        originalPosition: { x: 10, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 80 }
    });

    parts.push({
        name: "Heavy Crawler Transporter",
        description: "Massive 8-wheeled robotic crawler with custom lugged tires. Used to slowly roll the massive test section doors and support systems into alignment.",
        material: "Dark Steel / Rubber / Chrome",
        function: "Mobility for test section access.",
        assemblyOrder: 5,
        connections: ["Test Section", "Foundation Rails"],
        failureEffect: "Hydraulic tire blowout or suspension collapse, trapping the test article inside.",
        cascadeFailures: ["Delayed Retrieval"],
        originalPosition: { x: 10, y: -16, z: 0 },
        explodedPosition: { x: 10, y: -60, z: 0 }
    });

    parts.push({
        name: "Multi-Axis Sting Gimbal",
        description: "Hydraulically actuated robotic arm that holds the test article. Capable of rapid pitch and yaw maneuvers to simulate reentry vehicle dynamics under extreme load.",
        material: "Titanium / Steel",
        function: "Dynamic positioning of the test model.",
        assemblyOrder: 6,
        connections: ["Test Section Floor", "Capsule"],
        failureEffect: "Actuator lockup or structural shear, sending the test article flying down the tunnel at Mach 30.",
        cascadeFailures: ["Diffuser Destruction"],
        originalPosition: { x: 20, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 40, z: 40 }
    });

    parts.push({
        name: "Re-entry Capsule (Test Article)",
        description: "A scale model of a hypersonic reentry vehicle. Coated in advanced ablative materials to study thermal protection systems.",
        material: "Aluminum / Carbon Phenolic",
        function: "Aerodynamic and thermodynamic data acquisition.",
        assemblyOrder: 7,
        connections: ["Sting Gimbal"],
        failureEffect: "Heat shield burn-through causing structural disintegration.",
        cascadeFailures: ["Sensor Loss"],
        originalPosition: { x: 15, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: -40 }
    });

    parts.push({
        name: "Vacuum Accumulator Network",
        description: "A network of massive spherical pressure vessels evacuated to near-perfect vacuum. Provides the necessary pressure differential to drive the flow.",
        material: "Reinforced Steel",
        function: "Flow suction and pressure regulation.",
        assemblyOrder: 8,
        connections: ["Diffuser"],
        failureEffect: "Implosion of a sphere leading to instantaneous loss of tunnel vacuum.",
        cascadeFailures: ["Flow Stagnation", "Shockwave Reversal"],
        originalPosition: { x: 90, y: 0, z: 0 },
        explodedPosition: { x: 150, y: 0, z: 0 }
    });

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================

    const animate = (time, speed, meshes) => {
        // 1. Arc Heater Core Pulsing
        heaterCore.material.emissiveIntensity = 8.0 + Math.sin(time * 10 * speed) * 3.0;
        
        // 2. MHD Coil Electromagnetic Rotation Effect
        // We simulate this by oscillating the emissive color or intensity
        superConductorMat.emissiveIntensity = 2.0 + Math.sin(time * 20 * speed) * 1.5;
        
        // 3. Sting Gimbal Dynamic Pitch and Yaw
        // Simulating the capsule maneuvering during re-entry
        const pitchAngle = Math.sin(time * 0.5 * speed) * 0.3; // +/- ~17 degrees
        const yawAngle = Math.cos(time * 0.7 * speed) * 0.2;
        gimbalX.rotation.z = pitchAngle;
        gimbalY.rotation.y = yawAngle;
        
        // 4. Plasma Flow Particle Physics
        const positions = plasmaParticles.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            let px = positions[i*3];
            let py = positions[i*3+1];
            let pz = positions[i*3+2];
            
            // Apply velocity
            px += particleVelocities[i].vx * 0.01 * speed;
            py += particleVelocities[i].vy * 0.01 * speed;
            pz += particleVelocities[i].vz * 0.01 * speed;
            
            // Flow geometry shaping (Converging/Diverging)
            // If in nozzle area (-25 to 0)
            if (px > -25 && px < 0) {
                const fraction = (px + 25) / 25; // 0 to 1
                // Squeeze flow
                const squeeze = 1.0 - fraction * 0.5;
                py *= squeeze;
                pz *= squeeze;
                particleVelocities[i].vx += 2 * speed; // accelerate
            }
            
            // Interaction with Bow Shock (around x = 8 to 12)
            // Simplified shock interaction: deflect particles outward
            if (px > 5 && px < 15) {
                const distToCenter = Math.sqrt(py*py + pz*pz);
                if (distToCenter < 5) {
                    // Push outwards violently
                    particleVelocities[i].vy += (py / distToCenter) * 15 * speed;
                    particleVelocities[i].vz += (pz / distToCenter) * 15 * speed;
                }
            }
            
            // Reset particles that pass the diffuser
            if (px > 80) {
                px = -90 + Math.random() * 10;
                const r = Math.random() * 2;
                const theta = Math.random() * Math.PI * 2;
                py = Math.cos(theta) * r;
                pz = Math.sin(theta) * r;
                particleVelocities[i].vx = 50 + Math.random() * 20;
                particleVelocities[i].vy = (Math.random() - 0.5) * 2;
                particleVelocities[i].vz = (Math.random() - 0.5) * 2;
            }
            
            positions[i*3] = px;
            positions[i*3+1] = py;
            positions[i*3+2] = pz;
        }
        plasmaParticles.geometry.attributes.position.needsUpdate = true;
        
        // 5. Bow Shockwave Intensity and Geometry Fluctuation
        // The shockwave geometry fluctuates slightly due to plasma turbulence
        shockMesh.scale.set(
            1.0 + Math.random() * 0.05 * speed,
            1.0 + Math.random() * 0.02 * speed,
            1.0 + Math.random() * 0.02 * speed
        );
        shockwaveMat.opacity = 0.6 + Math.sin(time * 15 * speed) * 0.2;
        
        // 6. Heat Shield Ablation and White-Hot Glow
        // As time passes, the shield gets hotter and pulses
        const heatLevel = (Math.sin(time * 0.2 * speed) + 1.0) / 2.0; // 0.0 to 1.0
        whiteHotMat.emissiveIntensity = 2.0 + heatLevel * 6.0;
        
        // 7. Crawler Tire Micro-vibrations
        // Facility shakes due to massive acoustic and mechanical loads
        const vibration = Math.sin(time * 50 * speed) * 0.05;
        crawler.position.y = -16 + vibration;
    };

    const description = "Ultra God Tier Hypersonic Plasma Wind Tunnel. A massive, hyper-complex facility capable of simulating Mach 30+ atmospheric re-entry conditions. Features a colossal arc heater, magnetohydrodynamic (MHD) accelerators, an armored test section transported by heavy crawlers, and an intense glowing plasma flow colliding with an ablative spacecraft heat shield, generating extreme bow shocks.";

    // ==========================================
    // PhD-LEVEL QUIZ QUESTIONS
    // ==========================================
    
    const quizQuestions = [
        {
            question: "In the MHD accelerator section, what happens to the electrical conductivity of the plasma if the scalar Hall parameter (ratio of electron cyclotron frequency to collision frequency) becomes extremely large?",
            options: [
                "The effective transverse conductivity drastically decreases, leading to the Hall effect dominating and severe current skewing.",
                "The conductivity increases exponentially, causing a short circuit across the Faraday electrodes.",
                "The plasma becomes perfectly diamagnetic and expels all magnetic flux via the Meissner effect.",
                "The collision frequency approaches zero, causing the plasma to freeze in place due to magnetic mirroring."
            ],
            correctAnswer: 0,
            explanation: "In high magnetic fields, electrons gyrate many times before colliding (high Hall parameter). This causes the electrons to drift perpendicular to both E and B (Hall drift), severely reducing the effective conductivity in the direction of the applied electric field unless Hall currents are shorted or the electrode geometry is specifically segmented."
        },
        {
            question: "When the Mach 30 flow passes through the normal segment of the bow shock directly ahead of the blunt re-entry capsule, what occurs to the specific entropy and total enthalpy of the gas?",
            options: [
                "Specific entropy increases drastically, while total enthalpy remains constant (adiabatic and no work done).",
                "Both specific entropy and total enthalpy decrease due to intense radiative heat loss.",
                "Specific entropy remains constant, but total enthalpy increases due to the shock compression.",
                "Specific entropy decreases as the flow is ordered, and total enthalpy drops proportionally."
            ],
            correctAnswer: 0,
            explanation: "A shock wave is highly irreversible, so entropy increases across it. However, if the shock is considered adiabatic and no external work is extracted or added at the shock interface itself, the total enthalpy (stagnation enthalpy) remains constant."
        },
        {
            question: "Why is a blunt body geometry, like the capsule in the test section, preferred over a sharp, needle-like shape for extreme hypersonic re-entry?",
            options: [
                "A blunt body creates a strong detached bow shock that dissipates the majority of the kinetic energy into the surrounding air rather than the vehicle surface.",
                "A blunt body maintains attached oblique shocks, which are cooler than detached shocks.",
                "Sharp shapes cause the flow to become turbulent prematurely, increasing skin friction drag beyond structural limits.",
                "Blunt bodies possess higher ballistic coefficients, allowing them to penetrate the atmosphere faster."
            ],
            correctAnswer: 0,
            explanation: "H. Julian Allen's blunt body theory showed that a blunt shape forms a strong detached normal/bow shock wave. This shock heats the air tremendously, carrying the heat away in the wake rather than transferring it to the vehicle's surface via friction."
        },
        {
            question: "During ablation of the capsule's heat shield, massive amounts of carbon-phenolic material vaporize. How does this 'blowing' effect influence the hypersonic boundary layer?",
            options: [
                "It thickens the boundary layer and significantly reduces the convective heat transfer coefficient (aerodynamic blockage).",
                "It thins the boundary layer by accelerating the flow near the wall, increasing heat transfer.",
                "It ionizes immediately, causing the boundary layer to magnetically couple with the bow shock, freezing the flow.",
                "It causes premature transition to turbulence, which eliminates the bow shock entirely."
            ],
            correctAnswer: 0,
            explanation: "Mass injection (blowing) from the ablating heat shield pushes the hot shock layer gas away from the surface. This thickens the boundary layer and absorbs heat through phase change and cracking, drastically reducing the convective heat flux reaching the solid surface."
        },
        {
            question: "To prevent liquefaction of the working gas as it expands in the De Laval nozzle to Mach 30, the stagnation temperature must be extraordinarily high. If utilizing the Arc Heater alone is insufficient, why is the MHD accelerator implemented *downstream* of the throat?",
            options: [
                "Adding energy downstream of the throat in supersonic flow increases velocity without choking the throat, avoiding the limits of pure thermal expansion.",
                "The MHD accelerator relies on the gas being completely cold to utilize superconductivity in the flow.",
                "Downstream injection compresses the boundary layer, preventing flow separation in the divergent section.",
                "It acts as a magnetic nozzle to decrease the Mach number back to subsonic speeds for safe testing."
            ],
            correctAnswer: 0,
            explanation: "According to Rayleigh flow physics, adding heat/energy to a supersonic flow decreases its Mach number, but in an MHD accelerator, work (J x B force) is added directly as kinetic energy. Heating upstream (stagnation) is limited by throat melting; accelerating a supersonic flow electromagnetically avoids choking constraints and extreme stagnation chamber pressures."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
