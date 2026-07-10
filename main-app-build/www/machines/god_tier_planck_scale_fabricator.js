import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animationHooks = [];

    // --- CUSTOM HYPER-TECH MATERIALS ---
    const materials = {
        neonBlue: new THREE.MeshStandardMaterial({ color: 0x0044ff, emissive: 0x00aaff, emissiveIntensity: 3.5, transparent: true, opacity: 0.9 }),
        neonPurple: new THREE.MeshStandardMaterial({ color: 0x4400ff, emissive: 0xaa00ff, emissiveIntensity: 3.0, wireframe: false }),
        neonGreen: new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ffaa, emissiveIntensity: 4.0 }),
        neonRed: new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff3333, emissiveIntensity: 5.0 }),
        hologram: new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.3 }),
        quantumCore: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8.0, transparent: true, opacity: 0.95 }),
        plasmaStream: new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 6.0, wireframe: true }),
        darkAlloy: darkSteel,
        brightSteel: steel,
        chassisMetal: new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.3 }),
        copperWire: copper,
        glassLens: glass,
        tintedWindow: tinted,
        tireRubber: rubber,
        chromeRim: chrome,
        goldContacts: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 })
    };

    let assemblyOrderCounter = 1;

    function registerPart(name, description, materialName, func, connections, failureEffect, cascadeFailures, mesh, explodedOffset) {
        mesh.userData.isPart = true;
        mesh.userData.name = name;
        group.add(mesh);
        
        parts.push({
            name: name,
            description: description,
            material: materialName,
            function: func,
            assemblyOrder: assemblyOrderCounter++,
            connections: connections,
            failureEffect: failureEffect,
            cascadeFailures: cascadeFailures,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: { x: mesh.position.x + explodedOffset.x, y: mesh.position.y + explodedOffset.y, z: mesh.position.z + explodedOffset.z }
        });
    }

    // ==========================================
    // 1. COLLOSAL OFF-ROAD MOBILE BASE
    // ==========================================
    
    function buildWheel(x, y, z, scale, wheelName) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);
        wheelGroup.scale.set(scale, scale, scale);

        // Tire Main Body
        const tireGeo = new THREE.TorusGeometry(15, 6, 64, 128);
        const tire = new THREE.Mesh(tireGeo, materials.tireRubber);
        wheelGroup.add(tire);

        // Aggressive Treads (Hundreds of tiny extruded BoxGeometry lugs)
        const lugCount = 360;
        const lugGeo = new THREE.BoxGeometry(5, 2, 9);
        for(let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, materials.tireRubber);
            const offset = (i % 2 === 0) ? 2.5 : -2.5;
            lug.position.set(Math.cos(angle) * 20.5, Math.sin(angle) * 20.5, offset);
            lug.rotation.z = angle;
            lug.rotation.x = (i % 2 === 0) ? 0.25 : -0.25;
            wheelGroup.add(lug);
        }

        // Rim & Spokes
        const rimGeo = new THREE.CylinderGeometry(11, 11, 7, 64);
        const rim = new THREE.Mesh(rimGeo, materials.chromeRim);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        const hubGeo = new THREE.CylinderGeometry(4.5, 4.5, 10, 32);
        const hub = new THREE.Mesh(hubGeo, materials.darkAlloy);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        const spokeGeo = new THREE.CylinderGeometry(0.8, 1.2, 22, 16);
        const innerSpokeGeo = new THREE.CylinderGeometry(0.4, 0.4, 22, 16);
        for(let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, materials.brightSteel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = angle;
            wheelGroup.add(spoke);

            const innerSpoke = new THREE.Mesh(innerSpokeGeo, materials.neonBlue);
            innerSpoke.rotation.x = Math.PI / 2;
            innerSpoke.rotation.z = angle + (Math.PI / 24);
            wheelGroup.add(innerSpoke);
        }

        animationHooks.push((time, speed) => {
            wheelGroup.rotation.x = time * speed * -1.5; // Wheels rolling along Z axis
        });

        registerPart(
            wheelName,
            "Colossal quantum-tread mobility wheel with integrated dark-matter suspension.",
            "Rubber / Chrome / Dark Steel",
            "Provides ultra-stable planetary mobility across multi-dimensional terrain.",
            ["Suspension_Arm", "Chassis_Main_Drive"],
            "Loss of mobility; extreme localized seismic shock.",
            ["Chassis_Main_Drive misalignment", "Containment field destabilization due to vibration"],
            wheelGroup,
            { x: x > 0 ? 60 : -60, y: -20, z: z > 0 ? 60 : -60 }
        );
    }

    // Build 8 colossal wheels
    const wheelPositions = [
        [ -70, -30,  90], [  70, -30,  90],
        [ -70, -30,  30], [  70, -30,  30],
        [ -70, -30, -30], [  70, -30, -30],
        [ -70, -30, -90], [  70, -30, -90],
    ];
    wheelPositions.forEach((pos, idx) => {
        buildWheel(pos[0], pos[1], pos[2], 1.3, `Colossal_Mobility_Wheel_Alpha_${idx + 1}`);
    });


    // ==========================================
    // 2. MASSIVE CHASSIS & LATTICEWORK
    // ==========================================
    
    const chassisGroup = new THREE.Group();
    
    // Main base plate (Extruded complex shape)
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-50, -100);
    baseShape.lineTo(50, -100);
    baseShape.lineTo(80, -60);
    baseShape.lineTo(80, 60);
    baseShape.lineTo(50, 100);
    baseShape.lineTo(-50, 100);
    baseShape.lineTo(-80, 60);
    baseShape.lineTo(-80, -60);
    baseShape.lineTo(-50, -100);

    const baseHole = new THREE.Path();
    baseHole.moveTo(-30, -30);
    baseHole.lineTo(30, -30);
    baseHole.lineTo(30, 30);
    baseHole.lineTo(-30, 30);
    baseHole.lineTo(-30, -30);
    baseShape.holes.push(baseHole);

    const baseExtrudeSettings = { depth: 15, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 2, bevelThickness: 2 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    baseGeo.translate(0, 0, -7.5); // Center depth
    baseGeo.rotateX(Math.PI / 2); // Lay flat
    
    const baseMesh = new THREE.Mesh(baseGeo, materials.chassisMetal);
    baseMesh.position.y = -10;
    chassisGroup.add(baseMesh);

    // Structural Lattice enclosing the core
    const latticeMat = materials.chassisMetal;
    const nodeGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const strutGeo = new THREE.CylinderGeometry(1.0, 1.0, 30, 12);
    
    for(let x = -2; x <= 2; x++) {
        for(let y = 0; y <= 3; y++) {
            for(let z = -2; z <= 2; z++) {
                if (Math.abs(x) < 2 && Math.abs(z) < 2 && y > 0 && y < 3) continue; // Hollow center for the quantum core
                
                const px = x * 30;
                const py = y * 30;
                const pz = z * 30;
                
                const node = new THREE.Mesh(nodeGeo, materials.brightSteel);
                node.position.set(px, py, pz);
                chassisGroup.add(node);
                
                if (x < 2) {
                    const strutX = new THREE.Mesh(strutGeo, latticeMat);
                    strutX.position.set(px + 15, py, pz);
                    strutX.rotation.z = Math.PI / 2;
                    chassisGroup.add(strutX);
                }
                if (z < 2) {
                    const strutZ = new THREE.Mesh(strutGeo, latticeMat);
                    strutZ.position.set(px, py, pz + 15);
                    strutZ.rotation.x = Math.PI / 2;
                    chassisGroup.add(strutZ);
                }
                if (y < 3) {
                    const strutY = new THREE.Mesh(strutGeo, latticeMat);
                    strutY.position.set(px, py + 15, pz);
                    chassisGroup.add(strutY);
                }
            }
        }
    }

    registerPart(
        "Dark_Matter_Chassis_Framework",
        "The primary superstructure engineered to withstand extreme gravitational shearing from quantum processes.",
        "Chassis Metal / Bright Steel",
        "Houses all subsystems and provides immense structural integrity.",
        ["All_Wheels", "Quantum_Core_Mounts", "Operator_Cabin"],
        "Catastrophic structural failure, instantaneous singularity collapse.",
        ["Complete reality tear in local sector", "Vaporization of all attached components"],
        chassisGroup,
        { x: 0, y: -50, z: 0 }
    );

    // ==========================================
    // 3. DETAILED OPERATOR CABIN & HYDRAULICS
    // ==========================================

    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 100, 70);
    
    // Cabin Body
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-25, 0);
    cabinShape.lineTo(25, 0);
    cabinShape.lineTo(30, 15);
    cabinShape.lineTo(20, 35);
    cabinShape.lineTo(-20, 35);
    cabinShape.lineTo(-30, 15);
    cabinShape.lineTo(-25, 0);
    
    const cabinExtrude = new THREE.ExtrudeGeometry(cabinShape, { depth: 40, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 });
    cabinExtrude.translate(0, 0, -20);
    const cabinBody = new THREE.Mesh(cabinExtrude, materials.darkAlloy);
    cabinGroup.add(cabinBody);

    // Tinted Glass Canopy (Slightly smaller, embedded)
    const glassExtrude = new THREE.ExtrudeGeometry(cabinShape, { depth: 42, bevelEnabled: false });
    glassExtrude.scale(0.95, 0.95, 1);
    glassExtrude.translate(0, 2, -21);
    const cabinGlass = new THREE.Mesh(glassExtrude, materials.tintedWindow);
    cabinGroup.add(cabinGlass);

    // Interior Details
    const seatGeo = new THREE.BoxGeometry(10, 12, 10);
    const seat = new THREE.Mesh(seatGeo, plastic);
    seat.position.set(0, 6, 0);
    cabinGroup.add(seat);

    const steeringColGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
    const steeringCol = new THREE.Mesh(steeringColGeo, materials.brightSteel);
    steeringCol.position.set(0, 10, -10);
    steeringCol.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringCol);

    const steeringWheelGeo = new THREE.TorusGeometry(4, 0.8, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeo, materials.tireRubber);
    steeringWheel.position.set(0, 15, -15);
    steeringWheel.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringWheel);

    const screenGeo = new THREE.PlaneGeometry(16, 8);
    const screen = new THREE.Mesh(screenGeo, materials.neonBlue);
    screen.position.set(0, 18, -18);
    screen.rotation.x = 0.2;
    cabinGroup.add(screen);
    
    // Side Mirrors
    const mirrorGeo = new THREE.BoxGeometry(2, 6, 4);
    const mirrorL = new THREE.Mesh(mirrorGeo, materials.brightSteel);
    mirrorL.position.set(-32, 20, -10);
    mirrorL.rotation.y = -0.2;
    cabinGroup.add(mirrorL);
    
    const mirrorR = new THREE.Mesh(mirrorGeo, materials.brightSteel);
    mirrorR.position.set(32, 20, -10);
    mirrorR.rotation.y = 0.2;
    cabinGroup.add(mirrorR);

    // Ladders leading up to cabin
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.5, 0.5, 80, 8);
    const railL = new THREE.Mesh(railGeo, materials.brightSteel);
    railL.position.set(-6, -40, 0);
    const railR = new THREE.Mesh(railGeo, materials.brightSteel);
    railR.position.set(6, -40, 0);
    ladderGroup.add(railL, railR);
    
    const rungGeo = new THREE.CylinderGeometry(0.3, 0.3, 12, 8);
    for(let i = 0; i < 20; i++) {
        const rung = new THREE.Mesh(rungGeo, materials.chassisMetal);
        rung.position.set(0, -75 + (i * 4), 0);
        rung.rotation.z = Math.PI / 2;
        ladderGroup.add(rung);
    }
    ladderGroup.position.set(0, 0, 22);
    cabinGroup.add(ladderGroup);

    // Exhaust Stacks on the cabin back
    const stackGeo = new THREE.CylinderGeometry(3, 3, 30, 16);
    const stackL = new THREE.Mesh(stackGeo, materials.chromeRim);
    stackL.position.set(-20, 30, 20);
    cabinGroup.add(stackL);
    const stackR = new THREE.Mesh(stackGeo, materials.chromeRim);
    stackR.position.set(20, 30, 20);
    cabinGroup.add(stackR);

    // Quantum exhaust particles
    animationHooks.push((time, speed) => {
        screen.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 10) * 1.5; // Flickering screen
        steeringWheel.rotation.z = Math.sin(time * speed * 0.5) * 0.5; // Auto-steering
    });

    registerPart(
        "Omni_Directional_Operator_Cabin",
        "Pressurized, radiation-shielded command center with holographic instrumentation.",
        "Dark Alloy / Tinted Glass",
        "Allows biological or cybernetic operators to monitor waveform collapse safely.",
        ["Dark_Matter_Chassis", "Holo_Interface_Mainframe"],
        "Operator exposure to hard radiation and raw uncollapsed probability waves.",
        ["Spontaneous biological transmutation", "Total loss of manual override"],
        cabinGroup,
        { x: 0, y: 50, z: 100 }
    );

    // ==========================================
    // 4. PLANCK-SCALE MANIPULATOR ARMS (6X)
    // ==========================================

    function buildArm(x, y, z, rotY, name) {
        const armGroup = new THREE.Group();
        armGroup.position.set(x, y, z);
        armGroup.rotation.y = rotY;

        const baseGeo = new THREE.CylinderGeometry(8, 12, 15, 32);
        const base = new THREE.Mesh(baseGeo, materials.darkAlloy);
        armGroup.add(base);

        const lowerArmGeo = new THREE.BoxGeometry(6, 45, 6);
        lowerArmGeo.translate(0, 22.5, 0);
        const lowerArm = new THREE.Mesh(lowerArmGeo, materials.brightSteel);
        lowerArm.position.set(0, 7.5, 0);
        lowerArm.rotation.x = 0.6;
        armGroup.add(lowerArm);

        // Intricate Hydraulic Piston on lower arm
        const pistonCyl = new THREE.CylinderGeometry(1.5, 1.5, 30, 16);
        const pistonInner = new THREE.CylinderGeometry(0.8, 0.8, 30, 16);
        const piston = new THREE.Mesh(pistonCyl, materials.darkAlloy);
        piston.position.set(0, 20, -5);
        piston.rotation.x = -0.1;
        lowerArm.add(piston);
        const pistonRod = new THREE.Mesh(pistonInner, materials.chromeRim);
        pistonRod.position.set(0, 15, 0);
        piston.add(pistonRod);

        const elbowGeo = new THREE.SphereGeometry(7, 32, 32);
        const elbow = new THREE.Mesh(elbowGeo, materials.chromeRim);
        elbow.position.set(0, 7.5 + Math.cos(0.6)*45, Math.sin(0.6)*45);
        armGroup.add(elbow);

        const upperArmGeo = new THREE.CylinderGeometry(3, 4, 35, 16);
        upperArmGeo.translate(0, 17.5, 0);
        const upperArm = new THREE.Mesh(upperArmGeo, materials.darkAlloy);
        upperArm.position.copy(elbow.position);
        upperArm.rotation.x = -1.2;
        armGroup.add(upperArm);

        const effectorGroup = new THREE.Group();
        const effectorPos = new THREE.Vector3(
            elbow.position.x,
            elbow.position.y + Math.cos(-1.2)*35,
            elbow.position.z + Math.sin(-1.2)*35
        );
        effectorGroup.position.copy(effectorPos);
        
        const palmGeo = new THREE.DodecahedronGeometry(5, 0);
        const palm = new THREE.Mesh(palmGeo, materials.neonBlue);
        effectorGroup.add(palm);

        for(let f = 0; f < 4; f++) {
            const angle = (f / 4) * Math.PI * 2;
            const fingerGeo = new THREE.CylinderGeometry(0.8, 0.2, 12, 8);
            fingerGeo.translate(0, -6, 0);
            const finger = new THREE.Mesh(fingerGeo, materials.brightSteel);
            finger.position.set(Math.cos(angle)*5, 0, Math.sin(angle)*5);
            finger.rotation.x = -0.7;
            finger.rotation.y = -angle;
            effectorGroup.add(finger);
        }
        
        armGroup.add(effectorGroup);
        
        animationHooks.push((time, speed) => {
            armGroup.rotation.y = rotY + Math.sin(time * speed + x) * 0.3;
            lowerArm.rotation.x = 0.6 + Math.sin(time * speed * 1.2 + z) * 0.15;
            
            // Re-calculate elbow and upper arm dynamically based on lower arm rotation
            elbow.position.set(0, 7.5 + Math.cos(lowerArm.rotation.x)*45, Math.sin(lowerArm.rotation.x)*45);
            upperArm.position.copy(elbow.position);
            
            // Effector dynamics
            effectorGroup.position.set(
                elbow.position.x,
                elbow.position.y + Math.cos(upperArm.rotation.x)*35,
                elbow.position.z + Math.sin(upperArm.rotation.x)*35
            );
            effectorGroup.rotation.y = time * speed * 4.0;
            effectorGroup.rotation.z = Math.cos(time * speed * 2.0) * 0.5;
            palm.scale.setScalar(1.0 + Math.sin(time * speed * 8.0) * 0.3);
        });

        registerPart(
            name,
            "Planck-Scale Manipulator Arm. Modulates quantum states with picometer precision.",
            "Dark Alloy / Bright Steel / Neon Blue",
            "Agitates the quantum foam to induce localized waveform collapse.",
            ["Chassis_Main", "Quantum_Core"],
            "Loss of fine-tuning control over subatomic assembly.",
            ["Spontaneous particle decay", "Unintended isotope generation"],
            armGroup,
            { x: x * 1.5, y: y + 20, z: z * 1.5 }
        );
    }

    const armRadius = 55;
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        buildArm(Math.cos(angle)*armRadius, 10, Math.sin(angle)*armRadius, -angle + Math.PI/2, `Planck_Manipulator_Arm_Model_${i+1}`);
    }

    // ==========================================
    // 5. HYPER-GEOMETRIC QUANTUM CORE (THE HEART)
    // ==========================================

    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 45, 0);

    // Outer Containment Sphere (Icosahedron Wireframe)
    const outGeo = new THREE.IcosahedronGeometry(40, 2);
    const outSphere = new THREE.Mesh(outGeo, materials.hologram);
    coreGroup.add(outSphere);

    // Middle Torus Knot Arrays
    const knotGeo1 = new THREE.TorusKnotGeometry(25, 1.5, 200, 32, 3, 7);
    const knot1 = new THREE.Mesh(knotGeo1, materials.neonPurple);
    coreGroup.add(knot1);

    const knotGeo2 = new THREE.TorusKnotGeometry(20, 2, 200, 32, 5, 4);
    const knot2 = new THREE.Mesh(knotGeo2, materials.neonRed);
    coreGroup.add(knot2);

    // Inner Core Shell
    const shellGeo = new THREE.DodecahedronGeometry(12, 1);
    const shell = new THREE.Mesh(shellGeo, materials.darkAlloy);
    const edges = new THREE.EdgesGeometry(shellGeo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ffaa, linewidth: 3 }));
    shell.add(line);
    coreGroup.add(shell);

    // The Quantum Foam (Massive Particle System)
    const particleCount = 30000;
    const foamGeo = new THREE.BufferGeometry();
    const foamPositions = new Float32Array(particleCount * 3);
    const foamColors = new Float32Array(particleCount * 3);
    const foamPhases = new Float32Array(particleCount);
    const foamRadii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.random() * 15;

        foamPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        foamPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        foamPositions[i * 3 + 2] = r * Math.cos(phi);

        foamColors[i * 3] = Math.random(); 
        foamColors[i * 3 + 1] = Math.random() * 0.5 + 0.5; 
        foamColors[i * 3 + 2] = 1.0; 

        foamPhases[i] = Math.random() * Math.PI * 2;
        foamRadii[i] = r;
    }

    foamGeo.setAttribute('position', new THREE.BufferAttribute(foamPositions, 3));
    foamGeo.setAttribute('color', new THREE.BufferAttribute(foamColors, 3));

    const foamMat = new THREE.PointsMaterial({
        size: 0.25,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const quantumFoam = new THREE.Points(foamGeo, foamMat);
    coreGroup.add(quantumFoam);

    // Probability Wave Emitters (Lasers targeting the center)
    const emittersGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const phi = Math.acos( -1 + ( 2 * i ) / 12 );
        const theta = Math.sqrt( 12 * Math.PI ) * phi;
        
        const emitGeo = new THREE.CylinderGeometry(1.5, 3, 20, 16);
        emitGeo.translate(0, 30, 0);
        const emitter = new THREE.Mesh(emitGeo, materials.brightSteel);
        
        emitter.position.setFromSphericalCoords(10, phi, theta);
        emitter.lookAt(0,0,0);
        emitter.rotateX(Math.PI / 2); // align cylinder with lookAt
        
        // Laser Beam
        const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 40, 8);
        beamGeo.translate(0, 10, 0);
        const beam = new THREE.Mesh(beamGeo, materials.plasmaStream);
        emitter.add(beam);

        emittersGroup.add(emitter);
    }
    coreGroup.add(emittersGroup);

    animationHooks.push((time, speed) => {
        // Rotate structural elements
        outSphere.rotation.x = time * speed * 0.1;
        outSphere.rotation.y = time * speed * 0.15;
        
        knot1.rotation.y = time * speed * 1.5;
        knot1.rotation.z = time * speed * 0.5;
        
        knot2.rotation.x = time * speed * -2.0;
        knot2.rotation.y = time * speed * -1.0;

        shell.rotation.x = time * speed * 3.0;
        shell.rotation.y = time * speed * 2.0;
        shell.scale.setScalar(1.0 + Math.sin(time * speed * 10) * 0.05);

        // Quantum Foam Particle Animation (Heavy Math)
        const positions = foamGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const phase = foamPhases[i] + time * speed * 3.0;
            const r = foamRadii[i] + Math.sin(phase) * 1.5;
            
            // Induce a swirling vortex effect
            const theta = time * speed * 1.2 + (i * 0.0005);
            const phi = Math.cos(time * speed * 0.4 + (i * 0.0001)) * Math.PI;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        foamGeo.attributes.position.needsUpdate = true;
        quantumFoam.rotation.y = time * speed * -0.5;

        // Emitters pulsing
        emittersGroup.rotation.y = time * speed * 0.5;
        emittersGroup.rotation.z = Math.sin(time * speed * 0.2) * 0.2;
    });

    registerPart(
        "Zero_Point_Energy_Core_Assembly",
        "The primary singularity manipulation chamber. Extracts vacuum energy to power fabrication.",
        "Dark Alloy / Hologram / Neon Materials",
        "Maintains the quantum superposition of raw subatomic materials before waveform collapse.",
        ["Probability_Wave_Emitters", "Heisenberg_Compensators", "Chassis_Main"],
        "Uncontained singularity expansion; immediate collapse of local spacetime.",
        ["Vacuum decay event", "Creation of a micro black hole"],
        coreGroup,
        { x: 0, y: 150, z: 0 }
    );


    // ==========================================
    // 6. PIPING & HYDRAULIC NETWORKS
    // ==========================================

    const pipingGroup = new THREE.Group();
    const pipeMat = materials.copperWire;
    
    // Create random complex curves for pipes connecting chassis to core
    for(let i=0; i<30; i++) {
        const start = new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            -10,
            (Math.random() - 0.5) * 100
        );
        const end = new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            30,
            (Math.random() - 0.5) * 30
        );
        const mid1 = new THREE.Vector3(start.x, start.y + 40, start.z);
        const mid2 = new THREE.Vector3(end.x, end.y - 20, end.z);

        const curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.8, 8, false);
        const tube = new THREE.Mesh(tubeGeo, pipeMat);
        pipingGroup.add(tube);
    }
    
    registerPart(
        "Superfluid_Helium_Cooling_Network",
        "Extensive cryogenic piping network to keep the Heisenberg compensators near absolute zero.",
        "Copper / Cryo-materials",
        "Prevents catastrophic thermal runaway during high-probability waveform collapses.",
        ["Zero_Point_Energy_Core_Assembly", "Dark_Matter_Chassis"],
        "Thermal runaway in the quantum core.",
        ["Melted manipulators", "Plasma explosion"],
        pipingGroup,
        { x: -50, y: 0, z: 50 }
    );

    // ==========================================
    // 7. HEISENBERG COMPENSATOR RINGS
    // ==========================================

    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 45, 0);

    function createCompensatorRing(radius, tube, speedMulti, axis, name) {
        const geo = new THREE.TorusGeometry(radius, tube, 32, 100);
        const mesh = new THREE.Mesh(geo, materials.neonGreen);
        
        // Add nodes on the ring
        const nodeGeo = new THREE.BoxGeometry(tube*3, tube*3, tube*3);
        for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const node = new THREE.Mesh(nodeGeo, materials.brightSteel);
            node.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
            mesh.add(node);
        }

        ringGroup.add(mesh);

        animationHooks.push((time, speed) => {
            if(axis === 'x') mesh.rotation.x = time * speed * speedMulti;
            if(axis === 'y') mesh.rotation.y = time * speed * speedMulti;
            if(axis === 'z') mesh.rotation.z = time * speed * speedMulti;
        });

        registerPart(
            name,
            "Heisenberg Compensator Ring. Decouples position and momentum uncertainties.",
            "Neon Green / Bright Steel",
            "Allows precise placement of subatomic particles without violating quantum mechanics.",
            ["Zero_Point_Energy_Core_Assembly"],
            "Extreme uncertainty in particle location.",
            ["Fabricated objects smearing across multiple dimensions", "Spontaneous teleportation of parts"],
            mesh,
            { x: 0, y: 100, z: 0 } // Explode upwards
        );
    }

    createCompensatorRing(65, 2.5, 0.8, 'x', "Heisenberg_Compensator_Alpha");
    createCompensatorRing(75, 2.0, -0.6, 'y', "Heisenberg_Compensator_Beta");
    createCompensatorRing(85, 1.5, 0.4, 'z', "Heisenberg_Compensator_Gamma");


    // ==========================================
    // EXPORTS
    // ==========================================

    const description = "The God Tier Planck Scale Fabricator is a colossal, mobile mega-structure capable of manipulating the fundamental quantum foam of reality. Crawling on massive off-road tracks, it positions its zero-point energy core over quantum nodes to synthesize matter atom by atom. Probability wave emitters collapse subatomic waveforms into macroscopic structures, while enormous Planck-scale manipulator arms agitate the vacuum state. An absolute triumph of impossible hyper-geometry.";

    const quizQuestions = [
        {
            question: "Which interpretation of quantum mechanics avoids the measurement problem by proposing that all possible alternate histories and futures are real, each representing an actual 'world'?",
            options: [
                "The Copenhagen Interpretation",
                "The Many-Worlds Interpretation",
                "De Broglie-Bohm Pilot-Wave Theory",
                "Objective Collapse Theory"
            ],
            correct: 1,
            explanation: "The Many-Worlds Interpretation (MWI) posits that the universal wavefunction is objectively real, and that there is no wavefunction collapse. Instead, every quantum event causes the universe to branch into non-communicating parallel realities."
        },
        {
            question: "In quantum field theory, what are the hypothetical gauge bosons that mediate the strong interaction between quarks?",
            options: [
                "W and Z bosons",
                "Photons",
                "Gluons",
                "Gravitons"
            ],
            correct: 2,
            explanation: "Gluons are the exchange particles (gauge bosons) for the strong force between quarks, analogous to the exchange of photons in the electromagnetic force between two charged particles."
        },
        {
            question: "According to the Heisenberg Uncertainty Principle, which pair of conjugate variables cannot be simultaneously measured with arbitrary precision?",
            options: [
                "Position and Momentum",
                "Energy and Mass",
                "Spin and Charge",
                "Velocity and Acceleration"
            ],
            correct: 0,
            explanation: "The principle states that the more precisely the position of some particle is determined, the less precisely its momentum can be predicted from initial conditions, and vice versa. $\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$."
        },
        {
            question: "What physical mechanism is responsible for the spontaneous symmetry breaking of the electroweak gauge group $SU(2)_L \\times U(1)_Y$, granting mass to the W and Z bosons?",
            options: [
                "The Casimir Effect",
                "The Higgs Mechanism",
                "Color Confinement",
                "Asymptotic Freedom"
            ],
            correct: 1,
            explanation: "The Higgs mechanism describes how the gauge bosons of the weak interaction acquire mass via interaction with the all-pervading Higgs field, which breaks the electroweak symmetry at low energies."
        },
        {
            question: "In the framework of String Theory, extra spatial dimensions must be 'compactified'. What specific type of complex manifold is typically used to compactify these 6 extra dimensions?",
            options: [
                "Riemann Sphere",
                "Minkowski Space",
                "Calabi-Yau Manifold",
                "Hilbert Space"
            ],
            correct: 2,
            explanation: "Calabi-Yau manifolds are complex manifolds with vanishing first Chern class (Ricci-flat), which are used in superstring theory to compactify the 6 extra spatial dimensions, preserving the exact amount of supersymmetry required."
        }
    ];

    const animate = (time, speed, meshes) => {
        // Execute all registered animation hooks
        animationHooks.forEach(hook => hook(time, speed));
    };

    return { group, parts, description, quizQuestions, animate };
}
