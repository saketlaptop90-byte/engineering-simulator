import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        metalness: 0.3,
        roughness: 0.1
    });

    const coreCrystalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x880088,
        emissiveIntensity: 2.0,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.1,
        roughness: 0,
        ior: 2.5,
        thickness: 5,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });

    const redGlow = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff2222,
        emissiveIntensity: 2
    });

    // Leather fallback for seats
    const leatherMaterial = new THREE.MeshStandardMaterial({ color: 0x221100, roughness: 0.9, metalness: 0.1 });

    // --------------------------------------------------------
    // 4D MATHEMATICS & TESSERACT GENERATION
    // --------------------------------------------------------
    const vertices4D = [];
    for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
            for (let z = -1; z <= 1; z += 2) {
                for (let w = -1; w <= 1; w += 2) {
                    vertices4D.push(new THREE.Vector4(x, y, z, w));
                }
            }
        }
    }

    const edges4D = [];
    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
            let diffs = 0;
            if (vertices4D[i].x !== vertices4D[j].x) diffs++;
            if (vertices4D[i].y !== vertices4D[j].y) diffs++;
            if (vertices4D[i].z !== vertices4D[j].z) diffs++;
            if (vertices4D[i].w !== vertices4D[j].w) diffs++;
            if (diffs === 1) {
                edges4D.push([i, j]);
            }
        }
    }

    const vertexMeshes = [];
    const edgeMeshes = [];
    const tesseractGroup = new THREE.Group();
    group.add(tesseractGroup);

    // Complex vertex nodes
    const createVertexNode = () => {
        const node = new THREE.Group();
        
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 2), glowMaterial);
        node.add(core);

        const shell = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 16, 32), chrome);
        shell.rotation.x = Math.PI / 2;
        node.add(shell);

        const shell2 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 16, 32), copper);
        shell2.rotation.y = Math.PI / 2;
        node.add(shell2);

        for(let i=0; i<6; i++) {
            const spike = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.4, 8), darkSteel);
            spike.position.set(
                i===0?0.6:i===1?-0.6:0,
                i===2?0.6:i===3?-0.6:0,
                i===4?0.6:i===5?-0.6:0
            );
            if (i < 2) spike.rotation.z = Math.PI/2;
            else if (i < 4) spike.rotation.x = 0;
            else spike.rotation.x = Math.PI/2;
            node.add(spike);
        }

        return node;
    };

    for (let i = 0; i < 16; i++) {
        const mesh = createVertexNode();
        tesseractGroup.add(mesh);
        vertexMeshes.push(mesh);
    }

    parts.push({
        name: "Hyper-Vertices Nodes",
        description: "16 heavily armored quantum-locked vertex nodes that anchor the 4D manifold into 3D space.",
        material: "Chrome/Copper/Glowing Quantum Plasma",
        function: "Anchor the hypercube edges and stabilize higher-dimensional bleed-off.",
        assemblyOrder: 1,
        connections: ["Hyper-Struts", "Quantum Stabilizers"],
        failureEffect: "4D structural collapse, causing immediate localized reality failure.",
        cascadeFailures: ["Core Crystal", "Hyper-Struts"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    const createEdgeStrut = () => {
        const edgeGroup = new THREE.Group();
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 16), steel);
        tube.rotation.x = Math.PI / 2;
        edgeGroup.add(tube);

        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.8, 16), glowMaterial);
        core.rotation.x = Math.PI / 2;
        edgeGroup.add(core);

        for(let i=0; i<7; i++) {
            const rib = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), darkSteel);
            rib.position.z = -0.45 + i * 0.15;
            edgeGroup.add(rib);
        }
        return edgeGroup;
    };

    for (let i = 0; i < edges4D.length; i++) {
        const mesh = createEdgeStrut();
        tesseractGroup.add(mesh);
        edgeMeshes.push(mesh);
    }

    parts.push({
        name: "Hyper-Struts",
        description: "32 dynamic dimensional struts connecting the quantum nodes. They stretch and contract constantly.",
        material: "Steel/Plasma Glow",
        function: "Channels hyper-dimensional energy between nodes.",
        assemblyOrder: 2,
        connections: ["Hyper-Vertices Nodes"],
        failureEffect: "Spacetime shearing along the uncoupled edges.",
        cascadeFailures: ["Containment Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -35, z: 0 }
    });

    // --------------------------------------------------------
    // CORE & CONTAINMENT
    // --------------------------------------------------------
    const coreCrystal = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 4), coreCrystalMaterial);
    group.add(coreCrystal);
    
    parts.push({
        name: "Singularity Core Crystal",
        description: "A suspended zero-point energy crystal with immense refractive and emissive properties. Pulsates with 4D energy.",
        material: "Hyper-Refractive Crystal",
        function: "Provides the immense power required to bend local spacetime.",
        assemblyOrder: 3,
        connections: ["Gyroscopic Containment Rings", "Tesseract Framework"],
        failureEffect: "Complete evaporation of the facility in a micro-supernova event.",
        cascadeFailures: ["All"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -25 }
    });

    const rings = [];
    const ringGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const ring = new THREE.Group();
        const r = new THREE.Mesh(new THREE.TorusGeometry(5 + i*0.8, 0.15, 16, 120), chrome);
        
        for(let j=0; j<12; j++) {
            const magNode = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.6), copper);
            magNode.position.x = (5 + i*0.8) * Math.cos(j * Math.PI/6);
            magNode.position.y = (5 + i*0.8) * Math.sin(j * Math.PI/6);
            magNode.lookAt(0,0,0);
            
            // Add tiny glowing indicator on each magnet
            const indicator = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), glowMaterial);
            indicator.position.z = 0.31;
            magNode.add(indicator);

            ring.add(magNode);
        }

        ring.add(r);
        ringGroup.add(ring);
        rings.push(ring);
    }
    group.add(ringGroup);

    parts.push({
        name: "Gyroscopic Containment Rings",
        description: "Multi-axis spinning rings laced with heavy copper magnetic nodes. Rotates at thousands of RPM.",
        material: "Chrome/Copper",
        function: "Generates a massive localized magnetic field to contain the singularity.",
        assemblyOrder: 4,
        connections: ["Singularity Core Crystal", "Main Support Ring"],
        failureEffect: "Loss of magnetic containment; core drops, resulting in black hole formation.",
        cascadeFailures: ["Singularity Core Crystal", "Main Support Ring"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // REACTOR FOUNDATION & MACHINERY
    // --------------------------------------------------------
    const baseGroup = new THREE.Group();
    baseGroup.position.y = -10;
    
    // Hexagonal Extrusion for Main Bed
    const baseShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const radius = 14;
        if (i === 0) baseShape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else baseShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    baseShape.lineTo(14, 0);

    const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.8, bevelThickness: 0.8 };
    const baseMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(baseShape, extrudeSettings), darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseGroup.add(baseMesh);

    parts.push({
        name: "Hexagonal Reactor Bed",
        description: "Massive solid dark steel hexagonal foundation holding the entire structure.",
        material: "Dark Steel",
        function: "Supports thousands of tons of quantum apparatus.",
        assemblyOrder: 5,
        connections: ["Pneumatic Stabilization Pillars", "Coolant Pumps"],
        failureEffect: "Structural collapse of the apparatus.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // Hydraulic Pillars
    const pillars = [];
    for(let i=0; i<6; i++) {
        const angle = i * Math.PI / 3;
        const radius = 11;
        
        const pillar = new THREE.Group();
        pillar.position.set(Math.cos(angle) * radius, 1.5, Math.sin(angle) * radius);
        
        const jacket = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 6, 32), steel);
        jacket.position.y = 3;
        
        // Rivets on jacket
        for(let r=0; r<8; r++) {
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), darkSteel);
            rivet.position.set(Math.cos(r*Math.PI/4)*1.35, 1, Math.sin(r*Math.PI/4)*1.35);
            jacket.add(rivet);
        }
        pillar.add(jacket);

        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8, 32), chrome);
        piston.position.y = 7;
        pillar.add(piston);

        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.2, 0, 0),
            new THREE.Vector3(1.8, 3, 0.8),
            new THREE.Vector3(0.8, 7, 0)
        ]);
        const line = new THREE.Mesh(new THREE.TubeGeometry(lineCurve, 32, 0.15, 12, false), rubber);
        pillar.add(line);

        baseGroup.add(pillar);
        pillars.push(piston);
    }

    parts.push({
        name: "Pneumatic Stabilization Pillars",
        description: "6 massive heavy-duty hydraulic pistons that constantly adjust to micro-gravitational fluctuations.",
        material: "Steel/Chrome/Rubber",
        function: "Dampens the violent kinetic forces generated by 4D rotation.",
        assemblyOrder: 6,
        connections: ["Hexagonal Reactor Bed", "Main Support Ring"],
        failureEffect: "Vibrations tear the containment rings apart.",
        cascadeFailures: ["Gyroscopic Containment Rings"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 30, y: -10, z: 30 }
    });

    const supportRing = new THREE.Mesh(new THREE.TorusGeometry(11, 0.8, 64, 128), aluminum);
    supportRing.rotation.x = Math.PI / 2;
    supportRing.position.y = 9;
    
    // Mount points for pistons
    for(let i=0; i<6; i++) {
        const mount = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), darkSteel);
        const angle = i * Math.PI / 3;
        mount.position.set(Math.cos(angle)*11, 0, Math.sin(angle)*11);
        supportRing.add(mount);
    }
    baseGroup.add(supportRing);

    parts.push({
        name: "Main Support Ring",
        description: "A massive aluminum-alloy ring acting as the primary chassis for the containment system.",
        material: "Aluminum",
        function: "Distributes the load of the gyroscopic rings to the hydraulic pillars.",
        assemblyOrder: 7,
        connections: ["Pneumatic Stabilization Pillars", "Gyroscopic Containment Rings"],
        failureEffect: "Immediate decoupling of the gyroscopes.",
        cascadeFailures: ["Gyroscopic Containment Rings"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 35 }
    });

    // --------------------------------------------------------
    // CRAWLER TRACKS (TIRES/TREADS REQUIREMENT)
    // --------------------------------------------------------
    const tracksGroup = new THREE.Group();
    tracksGroup.position.y = -1; 
    const trackAssemblies = [];
    
    for(let i=0; i<4; i++) {
        const trackAssembly = new THREE.Group();
        trackAssembly.position.set(
            i%2===0 ? 15 : -15,
            -2,
            i<2 ? 15 : -15
        );
        
        // Rim
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 32), chrome);
        wheel.rotation.z = Math.PI/2;
        trackAssembly.add(wheel);

        // Complex spokes
        for(let s=0; s<12; s++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6, 16), darkSteel);
            spoke.rotation.x = s * Math.PI/6;
            trackAssembly.add(spoke);
        }

        // The Tread Core (Torus)
        const tire = new THREE.Mesh(new THREE.TorusGeometry(3, 0.8, 32, 128), rubber);
        tire.rotation.y = Math.PI/2;
        trackAssembly.add(tire);

        // Hundreds of tiny extruded BoxGeometry lugs
        for(let t=0; t<90; t++) {
            const lug = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 0.6), darkSteel);
            const angle = (t / 90) * Math.PI * 2;
            lug.position.set(0, Math.cos(angle)*3.6, Math.sin(angle)*3.6);
            lug.rotation.x = -angle;
            trackAssembly.add(lug);
        }

        // Track Guard
        const guard = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 5, 32, 1, true, 0, Math.PI));
        guard.rotation.z = Math.PI/2;
        guard.material = steel;
        trackAssembly.add(guard);

        tracksGroup.add(trackAssembly);
        trackAssemblies.push(trackAssembly);
    }
    baseGroup.add(tracksGroup);

    parts.push({
        name: "Omni-Directional Crawler Tracks",
        description: "Massive aggressive tread assemblies with chrome rims and dark steel lugs.",
        material: "Rubber / Chrome / Dark Steel",
        function: "Provides mobile positioning and seismic anchoring of the entire Tesseract Engine.",
        assemblyOrder: 8,
        connections: ["Hexagonal Reactor Bed"],
        failureEffect: "Engine becomes entirely stationary and vulnerable to localized structural sinkholes.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -11, z: 0 },
        explodedPosition: { x: 0, y: -45, z: 0 }
    });

    // --------------------------------------------------------
    // OPERATOR CABIN
    // --------------------------------------------------------
    const cabin = new THREE.Group();
    cabin.position.set(0, 14, 16);
    
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), darkSteel);
    cabin.add(cabinBody);

    const win1 = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 2), tinted);
    win1.position.set(0, 0.5, -2.01);
    win1.rotation.y = Math.PI;
    cabin.add(win1);

    const win2 = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2), tinted);
    win2.position.set(-3.01, 0.5, 0);
    win2.rotation.y = -Math.PI / 2;
    cabin.add(win2);
    
    const win3 = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2), tinted);
    win3.position.set(3.01, 0.5, 0);
    win3.rotation.y = Math.PI / 2;
    cabin.add(win3);

    // Operator Chair & Controls inside
    const chair = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 1), leatherMaterial);
    chair.position.set(0, -1, 0);
    cabin.add(chair);
    
    // Joystick
    const joystickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), darkSteel);
    joystickBase.position.set(1.5, -0.5, -1);
    cabin.add(joystickBase);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16), steel);
    stick.position.set(1.5, -0.2, -1);
    stick.rotation.x = 0.2;
    cabin.add(stick);

    const consoleDesk = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 1.5), steel);
    consoleDesk.position.set(0, -0.5, -1.2);
    cabin.add(consoleDesk);

    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), glowMaterial);
    screen1.position.set(-1, 0.5, -1.9);
    cabin.add(screen1);
    
    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1), redGlow);
    screen2.position.set(1.5, 0.5, -1.9);
    cabin.add(screen2);

    // Support arm
    const cabinArm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 8, 16), steel);
    cabinArm.rotation.x = Math.PI/2;
    cabinArm.position.set(0, -2, -4);
    cabin.add(cabinArm);
    
    baseGroup.add(cabin);

    parts.push({
        name: "Observation & Control Deck",
        description: "Heavily shielded operator cabin with hyper-tinted quantum glass, leather seating, and holographic displays.",
        material: "Dark Steel / Tinted Glass / Leather",
        function: "Houses the chief operator and main sequence control systems.",
        assemblyOrder: 9,
        connections: ["Hexagonal Reactor Bed", "Command Datalines"],
        failureEffect: "Operator is instantly vaporized by Hawking radiation.",
        cascadeFailures: ["Manual Override Systems"],
        originalPosition: { x: 0, y: 4, z: 16 },
        explodedPosition: { x: 0, y: 20, z: 40 }
    });

    // --------------------------------------------------------
    // VENTS, TUBES, CONDUITS
    // --------------------------------------------------------
    const ventGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const vent = new THREE.Group();
        vent.position.set(
            i%2===0 ? 9 : -9,
            0,
            i<2 ? 9 : -9
        );
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5, 32), steel);
        stack.rotation.x = Math.PI/4 * (i<2?-1:1);
        stack.rotation.z = Math.PI/4 * (i%2===0?-1:1);
        vent.add(stack);

        const grille = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 32), darkSteel);
        grille.position.y = 2.5;
        stack.add(grille);
        
        // Inner exhaust glow
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.1, 32), glowMaterial);
        exhaust.position.y = 2.4;
        stack.add(exhaust);

        ventGroup.add(vent);
    }
    baseGroup.add(ventGroup);

    parts.push({
        name: "Thermal Plasma Vents",
        description: "Massive exhaust stacks angled outwards, featuring heavy grilles and plasma exhaust channels.",
        material: "Steel / Dark Steel / Plasma",
        function: "Prevents thermal runaways by ejecting superheated tachyon plasma.",
        assemblyOrder: 10,
        connections: ["Hexagonal Reactor Bed", "Coolant System"],
        failureEffect: "Core meltdown and structural vaporization.",
        cascadeFailures: ["Singularity Core Crystal"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: -35, y: -15, z: -35 }
    });

    const coolantTubes = new THREE.Group();
    for(let i=0; i<4; i++) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(12, -4, 0),
            new THREE.Vector3(13, 2, 6),
            new THREE.Vector3(8, 8, 10),
            new THREE.Vector3(0, 10, 12),
            new THREE.Vector3(-8, 8, 10),
            new THREE.Vector3(-13, 2, 6),
            new THREE.Vector3(-12, -4, 0)
        ]);
        const tube = new THREE.Mesh(new THREE.TubeGeometry(path, 128, 0.3 + i*0.1, 16, false), copper);
        tube.rotation.y = (Math.PI / 2) * i;
        coolantTubes.add(tube);
    }
    baseGroup.add(coolantTubes);

    parts.push({
        name: "Super-Fluid Coolant Network",
        description: "Intricate copper piping wrapping the main frame, circulating liquid helium.",
        material: "Copper",
        function: "Keeps the magnetic containment nodes operating at near absolute zero.",
        assemblyOrder: 11,
        connections: ["Gyroscopic Containment Rings", "Hexagonal Reactor Bed"],
        failureEffect: "Magnets overheat, quenching violently and destroying the containment field.",
        cascadeFailures: ["Gyroscopic Containment Rings"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: 15, z: -40 }
    });

    const cables = new THREE.Group();
    for(let i=0; i<12; i++) {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(Math.cos(i*Math.PI/6)*16, -10, Math.sin(i*Math.PI/6)*16),
            new THREE.Vector3(Math.cos(i*Math.PI/6)*20, -5, Math.sin(i*Math.PI/6)*20),
            new THREE.Vector3(Math.cos(i*Math.PI/6)*14, 2, Math.sin(i*Math.PI/6)*14)
        );
        const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.2, 12, false), rubber);
        cables.add(cable);
    }
    baseGroup.add(cables);

    parts.push({
        name: "High-Voltage Power Conduits",
        description: "Thick rubber-insulated cables delivering gigawatts of power to the main systems.",
        material: "Rubber",
        function: "Energy transmission from external reactors.",
        assemblyOrder: 12,
        connections: ["Grid Input", "Containment Chamber"],
        failureEffect: "Catastrophic power failure.",
        cascadeFailures: ["All"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: -25, y: -5, z: 25 }
    });

    // --------------------------------------------------------
    // GEARS AND SENSORS
    // --------------------------------------------------------
    const gearGroup = new THREE.Group();
    gearGroup.position.y = -8;
    gearGroup.rotation.x = Math.PI / 2;
    for(let i=0; i<4; i++) {
        const gear = new THREE.Mesh(new THREE.CylinderGeometry(4 - i*0.8, 4 - i*0.8, 0.6, 64), chrome);
        gear.position.y = i * 0.7;
        for(let j=0; j<24; j++) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 1.2), darkSteel);
            const rad = 4 - i*0.8;
            tooth.position.x = rad * Math.cos(j*Math.PI/12);
            tooth.position.z = rad * Math.sin(j*Math.PI/12);
            tooth.rotation.y = -j*Math.PI/12;
            gear.add(tooth);
        }
        gearGroup.add(gear);
    }
    baseGroup.add(gearGroup);

    parts.push({
        name: "Planetary Gear Assembly",
        description: "Enormous chrome and dark steel gear reduction system.",
        material: "Chrome / Dark Steel",
        function: "Translates mechanical motion to rotate the lower magnetic arrays.",
        assemblyOrder: 13,
        connections: ["Drive Motors", "Lower Magnetic Array"],
        failureEffect: "Mechanical jamming causing motors to burn out.",
        cascadeFailures: ["Lower Magnetic Array"],
        originalPosition: { x: 0, y: -18, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    const lowerMagArray = new THREE.Mesh(new THREE.TorusGeometry(8, 1, 32, 128), copper);
    lowerMagArray.rotation.x = Math.PI / 2;
    lowerMagArray.position.y = -5;
    baseGroup.add(lowerMagArray);

    parts.push({
        name: "Secondary Magnetic Array",
        description: "A large copper torus beneath the main stage.",
        material: "Copper",
        function: "Pushes the singularity upwards, opposing gravity.",
        assemblyOrder: 14,
        connections: ["Planetary Gear Assembly", "Coolant Network"],
        failureEffect: "Singularity breaches the reactor floor.",
        cascadeFailures: ["Hexagonal Reactor Bed"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 40, y: -20, z: 0 }
    });

    const sensorGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const sensor = new THREE.Group();
        sensor.position.set(Math.cos(i*Math.PI/4)*9, -2, Math.sin(i*Math.PI/4)*9);
        sensor.lookAt(0,0,0);
        
        const dish = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI, 0, Math.PI), aluminum);
        sensor.add(dish);

        const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 16), glowMaterial);
        probe.position.z = 1.5;
        probe.rotation.x = Math.PI/2;
        sensor.add(probe);

        sensorGroup.add(sensor);
    }
    baseGroup.add(sensorGroup);

    parts.push({
        name: "Quantum Fluctuation Sensors",
        description: "8 high-precision interferometers pointing directly at the singularity.",
        material: "Aluminum / Glow",
        function: "Measures dimensional shearing in real-time.",
        assemblyOrder: 15,
        connections: ["Observation & Control Deck", "Main Support Ring"],
        failureEffect: "Blind operation of the reactor, almost guaranteeing a critical event.",
        cascadeFailures: ["Observation & Control Deck software"],
        originalPosition: { x: 0, y: -12, z: 0 },
        explodedPosition: { x: 0, y: 25, z: -30 }
    });

    const particleEmitters = new THREE.Group();
    for(let i=0; i<60; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), glowMaterial);
        p.position.set(
            (Math.random()-0.5)*20,
            (Math.random()-0.5)*20,
            (Math.random()-0.5)*20
        );
        particleEmitters.add(p);
    }
    group.add(particleEmitters);

    parts.push({
        name: "Tachyon Bleed-Off Particles",
        description: "Visual manifestation of faster-than-light particles ionizing the surrounding atmosphere.",
        material: "Quantum Luminescence",
        function: "Harmless byproduct of 4D manifold intersection with 3D space.",
        assemblyOrder: 16,
        connections: ["None"],
        failureEffect: "None.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    group.add(baseGroup);

    const description = "The Xenodynamics Tesseract Engine is an ultra-classified, hyper-complex machine designed to artificially project a 4-dimensional hypercube into our 3D space. By manipulating a zero-point singularity crystal suspended in a multi-axis gyroscopic containment field, it folds spacetime continuously. The resulting kinetic and tachyon energies are harvested for unparalleled power output. Mounted on massive crawler treads for mobile deployment. Extreme caution required: loss of magnetic containment will result in spontaneous localized reality collapse.";

    const quizQuestions = [
        {
            question: "What happens if the Gyroscopic Containment Rings fail?",
            options: [
                "The core cools down safely.",
                "Loss of magnetic containment; core drops, resulting in black hole formation.",
                "The tachyon particles change color.",
                "The gears reverse direction."
            ],
            correctAnswer: 1,
            explanation: "The rings provide the massive localized magnetic field holding the singularity. Without them, gravity takes over and a black hole forms."
        },
        {
            question: "What is the primary function of the Pneumatic Stabilization Pillars?",
            options: [
                "To look intimidating.",
                "To pump coolant into the reactor bed.",
                "To dampen the violent kinetic forces generated by 4D rotation.",
                "To rotate the outer containment chamber."
            ],
            correctAnswer: 2,
            explanation: "4D rotation causes extreme kinetic vibrations. The hydraulic pillars constantly adjust to dampen these forces and prevent the structure from tearing apart."
        },
        {
            question: "How many High-Precision Interferometers (Sensors) point at the singularity?",
            options: ["4", "6", "8", "16"],
            correctAnswer: 2,
            explanation: "There are 8 Quantum Fluctuation Sensors arranged around the core to measure dimensional shearing in real-time."
        },
        {
            question: "What material makes up the Super-Fluid Coolant Network tubes?",
            options: ["Dark Steel", "Chrome", "Rubber", "Copper"],
            correctAnswer: 3,
            explanation: "Thick copper tubing is used to circulate liquid helium and keep the magnetic containment nodes at near absolute zero."
        },
        {
            question: "Which component acts as the main sequence control center for the operator?",
            options: [
                "Planetary Gear Assembly",
                "Observation & Control Deck",
                "Singularity Core Crystal",
                "Hexagonal Reactor Bed"
            ],
            correctAnswer: 1,
            explanation: "The heavily shielded Observation & Control Deck houses the chief operator and the main sequence control systems."
        },
        {
            question: "What is the purpose of the Omni-Directional Crawler Tracks?",
            options: [
                "To rotate the 4D manifold.",
                "To cool the secondary magnetic array.",
                "Mobile positioning and seismic anchoring of the engine.",
                "To generate tachyon particles."
            ],
            correctAnswer: 2,
            explanation: "The massive tread assemblies allow the Tesseract Engine to reposition itself and provide a solid anchor to the ground during operation."
        }
    ];

    let timeAcc = 0;

    function rotateZW(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return function(v) {
            return new THREE.Vector4(
                v.x,
                v.y,
                v.z * c - v.w * s,
                v.z * s + v.w * c
            );
        };
    }
    
    function rotateXW(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return function(v) {
            return new THREE.Vector4(
                v.x * c - v.w * s,
                v.y,
                v.z,
                v.x * s + v.w * c
            );
        };
    }

    function rotateYW(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return function(v) {
            return new THREE.Vector4(
                v.x,
                v.y * c - v.w * s,
                v.z,
                v.y * s + v.w * c
            );
        };
    }

    function project4Dto3D(v, wDistance) {
        const wDist = wDistance || 2.5;
        const w = 1 / (wDist - v.w);
        return new THREE.Vector3(v.x * w, v.y * w, v.z * w);
    }

    const animate = (time, speed, meshes) => {
        timeAcc += speed * 0.01;

        coreCrystal.rotation.x = timeAcc * 1.5;
        coreCrystal.rotation.y = timeAcc * 2.1;
        coreCrystal.rotation.z = timeAcc * 1.8;
        const scale = 1 + Math.sin(timeAcc * 5) * 0.15;
        coreCrystal.scale.set(scale, scale, scale);

        rings.forEach((ring, index) => {
            ring.rotation.x = timeAcc * (index % 2 === 0 ? 1 : -1) * (1 + index * 0.2);
            ring.rotation.y = timeAcc * (index % 3 === 0 ? 1 : -1) * 1.5;
            ring.rotation.z = timeAcc * 0.8;
        });

        gearGroup.children.forEach((gear, idx) => {
            gear.rotation.y = timeAcc * (idx % 2 === 0 ? 2 : -2);
        });

        pillars.forEach((piston, idx) => {
            piston.position.y = 7 + Math.sin(timeAcc * 4 + idx) * 0.8;
        });

        trackAssemblies.forEach((track, idx) => {
            track.rotation.x += 0.02 * speed;
        });

        const angle1 = timeAcc * 0.5;
        const angle2 = timeAcc * 0.3;
        const angle3 = timeAcc * 0.2;
        
        const rotXW = rotateXW(angle1);
        const rotZW = rotateZW(angle2);
        const rotYW = rotateYW(angle3);

        const projectedVertices = [];

        for (let i = 0; i < vertices4D.length; i++) {
            let v = vertices4D[i];
            v = rotXW(v);
            v = rotZW(v);
            v = rotYW(v);
            
            const p3D = project4Dto3D(v, 2.5);
            p3D.multiplyScalar(4.5); // encompass core
            projectedVertices.push(p3D);

            if (vertexMeshes[i]) {
                vertexMeshes[i].position.copy(p3D);
                vertexMeshes[i].rotation.x += 0.03 * speed;
                vertexMeshes[i].rotation.y += 0.04 * speed;
            }
        }

        for (let i = 0; i < edges4D.length; i++) {
            const edge = edges4D[i];
            const start = projectedVertices[edge[0]];
            const end = projectedVertices[edge[1]];

            const edgeMesh = edgeMeshes[i];
            if (edgeMesh) {
                edgeMesh.position.copy(start).add(end).multiplyScalar(0.5);
                edgeMesh.lookAt(end);
                const dist = start.distanceTo(end);
                edgeMesh.scale.z = dist;
            }
        }

        particleEmitters.children.forEach((p, i) => {
            p.position.y += Math.sin(timeAcc + i) * 0.2 * speed;
            p.position.x += Math.cos(timeAcc + i*2) * 0.2 * speed;
            p.position.z += Math.sin(timeAcc*0.5 + i) * 0.2 * speed;
            
            if (p.position.y > 20) p.position.y = -20;
            if (p.position.y < -20) p.position.y = 20;
            if (p.position.x > 20) p.position.x = -20;
            if (p.position.x < -20) p.position.x = 20;
            if (p.position.z > 20) p.position.z = -20;
            if (p.position.z < -20) p.position.z = 20;
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
export function createTesseractEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
