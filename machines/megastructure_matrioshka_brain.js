import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --------------------------------------------------------
    // CUSTOM HYPER-TECH MATERIALS
    // --------------------------------------------------------
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffdd44, emissiveIntensity: 5.0, roughness: 0.1, metalness: 0.1 });
    const coreCoronaMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.6 });
    
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00aaff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x9900ff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ff44, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.9, roughness: 0.4, wireframe: false });
    const goldCircuitMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.1, emissive: 0x221100 });
    const darkChrome = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 1.0, roughness: 0.1 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x001133, metalness: 0.1, roughness: 0.1, transmission: 0.9, transparent: true });

    // --------------------------------------------------------
    // PART 1: Captured Star (Stellar Core)
    // --------------------------------------------------------
    const coreGeom = new THREE.IcosahedronGeometry(20, 8);
    const starCore = new THREE.Mesh(coreGeom, coreMat);
    group.add(starCore);
    meshes.starCore = starCore;

    const coronaGeom = new THREE.IcosahedronGeometry(21.5, 6);
    const starCorona = new THREE.Mesh(coronaGeom, coreCoronaMat);
    group.add(starCorona);
    meshes.starCorona = starCorona;

    parts.push({
        name: "Stellar Core & Corona",
        description: "A captured main-sequence star, heavily manipulated to output precise energy frequencies. Surrounded by a magnetic containment corona.",
        material: "coreMat",
        function: "Provides infinite energy for the Matrioshka Brain.",
        assemblyOrder: 1,
        connections: ["Inner Harvester Shell"],
        failureEffect: "Complete system energy starvation and stellar collapse.",
        cascadeFailures: ["All Shells", "Computation Arrays"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // --------------------------------------------------------
    // PART 2: Inner Harvester Shell (Dyson Shell Layer 1)
    // --------------------------------------------------------
    const innerShellGroup = new THREE.Group();
    // Complex geodesic sphere
    const innerShellGeom = new THREE.IcosahedronGeometry(35, 4);
    // Remove some faces to make it a frame
    const innerShell = new THREE.Mesh(innerShellGeom, darkSteel);
    // Add glowing nodes at vertices
    const posAttribute = innerShellGeom.attributes.position;
    for(let i=0; i<posAttribute.count; i+=3) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        const nodeGeom = new THREE.CylinderGeometry(0.5, 1, 3, 8);
        const node = new THREE.Mesh(nodeGeom, neonBlue);
        node.position.set(x, y, z);
        node.lookAt(0,0,0);
        innerShellGroup.add(node);
    }
    
    // Add orbital energy transfer rings
    const ringGeom = new THREE.TorusGeometry(38, 0.5, 16, 100);
    const ring1 = new THREE.Mesh(ringGeom, goldCircuitMat);
    ring1.rotation.x = Math.PI / 2;
    const ring2 = new THREE.Mesh(ringGeom, goldCircuitMat);
    ring2.rotation.y = Math.PI / 2;
    const ring3 = new THREE.Mesh(ringGeom, goldCircuitMat);
    ring3.rotation.z = Math.PI / 2;
    innerShellGroup.add(innerShell, ring1, ring2, ring3);
    group.add(innerShellGroup);
    meshes.innerShellGroup = innerShellGroup;

    parts.push({
        name: "Inner Harvester Shell",
        description: "The primary energy extraction layer, consisting of geodesic collectors and orbital transfer rings capturing 99.9% of the star's output.",
        material: "darkSteel, goldCircuitMat",
        function: "Energy extraction and conversion.",
        assemblyOrder: 2,
        connections: ["Stellar Core", "Plasma Conduits"],
        failureEffect: "Energy bottleneck leading to localized shell melting.",
        cascadeFailures: ["Plasma Conduits"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -80, y: 0, z: -80 }
    });

    // --------------------------------------------------------
    // PART 3: Plasma Conduits
    // --------------------------------------------------------
    const conduitsGroup = new THREE.Group();
    const splinePoints = [];
    for(let i=0; i<10; i++) {
        splinePoints.push(new THREE.Vector3(Math.cos(i)*40, Math.sin(i)*20, Math.sin(i)*40));
    }
    const conduitCurve = new THREE.CatmullRomCurve3(splinePoints, true);
    const conduitGeom = new THREE.TubeGeometry(conduitCurve, 128, 1.5, 16, true);
    const conduitMesh = new THREE.Mesh(conduitGeom, neonPurple);
    conduitsGroup.add(conduitMesh);
    // Add multiple intertwined tubes
    const conduitMesh2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(splinePoints.map(p => new THREE.Vector3(p.y, p.z, p.x)), true), 128, 1.2, 16, true), neonBlue);
    conduitsGroup.add(conduitMesh2);
    
    group.add(conduitsGroup);
    meshes.conduitsGroup = conduitsGroup;

    parts.push({
        name: "Hyper-Dimensional Plasma Conduits",
        description: "Massive tubular structures weaving between shells to transport raw solar plasma to computation nodes.",
        material: "neonPurple, neonBlue",
        function: "Power distribution.",
        assemblyOrder: 3,
        connections: ["Inner Harvester Shell", "Computation Shell Alpha"],
        failureEffect: "Plasma leakage causing catastrophic logic board incineration.",
        cascadeFailures: ["Computation Shell Alpha"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -100 }
    });

    // --------------------------------------------------------
    // PART 4: Computation Shell Alpha (Layer 2)
    // --------------------------------------------------------
    const alphaShellGroup = new THREE.Group();
    // Let's create a highly complex Lathe geometry for this shell
    const pointsAlpha = [];
    for ( let i = 0; i < 50; i ++ ) {
        pointsAlpha.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 60, ( i - 25 ) * 2.5 ) );
    }
    const latheGeomAlpha = new THREE.LatheGeometry( pointsAlpha, 64 );
    const alphaShellMesh = new THREE.Mesh( latheGeomAlpha, hullMat );
    alphaShellGroup.add(alphaShellMesh);
    
    // Add Data Spires
    for(let i=0; i<16; i++) {
        const spireGroup = new THREE.Group();
        const spireBaseGeom = new THREE.CylinderGeometry(2, 4, 15, 8);
        const spireBase = new THREE.Mesh(spireBaseGeom, chrome);
        spireBase.position.y = 7.5;
        const spireTipGeom = new THREE.CylinderGeometry(0.1, 2, 20, 8);
        const spireTip = new THREE.Mesh(spireTipGeom, glassMat);
        spireTip.position.y = 25;
        
        // Inner glowing core
        const tipCoreGeom = new THREE.CylinderGeometry(0.05, 1, 19, 8);
        const tipCore = new THREE.Mesh(tipCoreGeom, neonGreen);
        tipCore.position.y = 25;

        spireGroup.add(spireBase, spireTip, tipCore);
        
        const angle = (i / 16) * Math.PI * 2;
        spireGroup.position.set(Math.cos(angle) * 70, 0, Math.sin(angle) * 70);
        spireGroup.rotation.x = Math.PI / 2;
        spireGroup.lookAt(0,0,0);
        alphaShellGroup.add(spireGroup);
    }

    group.add(alphaShellGroup);
    meshes.alphaShellGroup = alphaShellGroup;

    parts.push({
        name: "Computation Shell Alpha",
        description: "The primary logic processor layer. Operates at 10^42 ops/sec. Features towering data spires and crystalline memory matrices.",
        material: "hullMat, chrome, glassMat",
        function: "Quantum computation and consciousness hosting.",
        assemblyOrder: 4,
        connections: ["Plasma Conduits", "Data Highways"],
        failureEffect: "Loss of primary simulation integrity.",
        cascadeFailures: ["Sub-simulations", "Memory Banks"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 120, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // PART 5: Data Highways (Torus Knots)
    // --------------------------------------------------------
    const highwayGroup = new THREE.Group();
    const tkGeom1 = new THREE.TorusKnotGeometry(85, 3, 200, 32, 3, 7);
    const tk1 = new THREE.Mesh(tkGeom1, neonBlue);
    highwayGroup.add(tk1);

    const tkGeom2 = new THREE.TorusKnotGeometry(85, 1.5, 200, 32, 7, 3);
    const tk2 = new THREE.Mesh(tkGeom2, neonPurple);
    highwayGroup.add(tk2);

    group.add(highwayGroup);
    meshes.highwayGroup = highwayGroup;

    parts.push({
        name: "Data Highways",
        description: "Complex topological knots of entangled photon streams transferring petabytes of data instantly across the structure.",
        material: "neonBlue, neonPurple",
        function: "High-bandwidth data transfer.",
        assemblyOrder: 5,
        connections: ["Computation Shell Alpha", "Computation Shell Beta"],
        failureEffect: "Data fragmentation and packet loss.",
        cascadeFailures: ["Logic Spindles"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // --------------------------------------------------------
    // PART 6: Logic Spindles
    // --------------------------------------------------------
    const spindleGroup = new THREE.Group();
    const spindleGeom = new THREE.OctahedronGeometry(5, 1);
    for(let i=0; i<30; i++) {
        const phi = Math.acos( - 1 + ( 2 * i ) / 30 );
        const theta = Math.sqrt( 30 * Math.PI ) * phi;
        const spindle = new THREE.Mesh(spindleGeom, goldCircuitMat);
        spindle.position.setFromSphericalCoords(95, phi, theta);
        spindle.lookAt(0,0,0);
        spindleGroup.add(spindle);
    }
    group.add(spindleGroup);
    meshes.spindleGroup = spindleGroup;

    parts.push({
        name: "Logic Spindles",
        description: "Floating octahedral processing units suspended by magnetic fields. They dynamically reconfigure based on workload.",
        material: "goldCircuitMat",
        function: "Dynamic secondary processing.",
        assemblyOrder: 6,
        connections: ["Data Highways"],
        failureEffect: "Reduced processing efficiency and lag.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -120, y: -50, z: 120 }
    });

    // --------------------------------------------------------
    // PART 7: Computation Shell Beta (Layer 3)
    // --------------------------------------------------------
    const betaShellGroup = new THREE.Group();
    const betaGeom = new THREE.SphereGeometry(110, 64, 32);
    const betaShell = new THREE.Mesh(betaGeom, new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true, wireframeLinewidth: 2 }));
    betaShellGroup.add(betaShell);

    // Add hexagonal plates
    const hexGeom = new THREE.CylinderGeometry(8, 8, 2, 6);
    const coolerMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.9, roughness: 0.2 });
    for(let i=0; i<60; i++) {
        const hex = new THREE.Mesh(hexGeom, coolerMat);
        const phi = Math.acos( - 1 + ( 2 * i ) / 60 );
        const theta = Math.sqrt( 60 * Math.PI ) * phi;
        hex.position.setFromSphericalCoords(110, phi, theta);
        hex.lookAt(0,0,0);
        hex.rotation.x += Math.PI / 2; // flatten to surface
        
        // Inner glowing core for each hex plate
        const hexCore = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2.2, 6), neonBlue);
        hex.add(hexCore);
        
        betaShellGroup.add(hex);
    }

    group.add(betaShellGroup);
    meshes.betaShellGroup = betaShellGroup;

    parts.push({
        name: "Computation Shell Beta",
        description: "The secondary processing layer characterized by massive hexagonal computing clusters arrayed in a geodesic sphere.",
        material: "coolerMat, neonBlue",
        function: "Deep memory storage and background task processing.",
        assemblyOrder: 7,
        connections: ["Logic Spindles", "Memory Banks"],
        failureEffect: "Long-term memory corruption.",
        cascadeFailures: ["Memory Banks"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -180, z: 0 }
    });

    // --------------------------------------------------------
    // PART 8: Cold Storage Memory Banks
    // --------------------------------------------------------
    const memoryGroup = new THREE.Group();
    const boxShape = new THREE.Shape();
    boxShape.moveTo(0, 0);
    boxShape.lineTo(10, 0);
    boxShape.lineTo(12, 5);
    boxShape.lineTo(10, 10);
    boxShape.lineTo(0, 10);
    boxShape.lineTo(-2, 5);
    boxShape.lineTo(0, 0);

    const extrudeSettings = { depth: 40, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const memGeom = new THREE.ExtrudeGeometry(boxShape, extrudeSettings);

    for(let i=0; i<12; i++) {
        const memNode = new THREE.Mesh(memGeom, darkChrome);
        const angle = (i / 12) * Math.PI * 2;
        memNode.position.set(Math.cos(angle) * 130, 0, Math.sin(angle) * 130);
        memNode.lookAt(0,0,0);
        
        // Add glowing strips
        const stripGeom = new THREE.BoxGeometry(1, 42, 1);
        const strip1 = new THREE.Mesh(stripGeom, neonGreen);
        strip1.position.set(5, 5, 20);
        memNode.add(strip1);

        memoryGroup.add(memNode);
    }
    group.add(memoryGroup);
    meshes.memoryGroup = memoryGroup;

    parts.push({
        name: "Cold Storage Memory Banks",
        description: "Extruded cryogenic vaults storing trillions of yottabytes of archived simulations and historical universe data.",
        material: "darkChrome, neonGreen",
        function: "Permanent data storage.",
        assemblyOrder: 8,
        connections: ["Computation Shell Beta", "Radiator Rings"],
        failureEffect: "Loss of historical records.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 50, z: 200 }
    });

    // --------------------------------------------------------
    // PART 9: Radiator Rings
    // --------------------------------------------------------
    const radiatorGroup = new THREE.Group();
    for(let j=0; j<5; j++) {
        const radRingGeom = new THREE.TorusGeometry(150 + j*10, 2, 16, 120);
        const radRing = new THREE.Mesh(radRingGeom, aluminum);
        radRing.rotation.x = Math.PI / 2;
        radRing.position.y = (j - 2) * 20;
        
        // Add fins
        for(let k=0; k<60; k++) {
            const finGeom = new THREE.BoxGeometry(4, 15, 0.5);
            const fin = new THREE.Mesh(finGeom, steel);
            const angle = (k / 60) * Math.PI * 2;
            fin.position.set(Math.cos(angle)*(150+j*10), 0, Math.sin(angle)*(150+j*10));
            fin.lookAt(0, radRing.position.y, 0);
            radRing.add(fin);
        }
        radiatorGroup.add(radRing);
    }
    group.add(radiatorGroup);
    meshes.radiatorGroup = radiatorGroup;

    parts.push({
        name: "Thermodynamic Radiator Rings",
        description: "Massive concentric rings laced with micro-fins to radiate waste heat from the computation layers into deep space.",
        material: "aluminum, steel",
        function: "Heat dissipation.",
        assemblyOrder: 9,
        connections: ["Cold Storage Memory Banks", "Computation Shell Gamma"],
        failureEffect: "Overheating, leading to localized system meltdowns.",
        cascadeFailures: ["Cold Storage Memory Banks", "Computation Shell Gamma"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    // --------------------------------------------------------
    // PART 10: Computation Shell Gamma (Layer 4)
    // --------------------------------------------------------
    const gammaShellGroup = new THREE.Group();
    const gammaGeom = new THREE.IcosahedronGeometry(200, 3);
    const gammaShell = new THREE.Mesh(gammaGeom, new THREE.MeshStandardMaterial({ color: 0x222233, wireframe: true }));
    gammaShellGroup.add(gammaShell);
    
    // Add glowing intersecting tubes
    const gammaEdges = new THREE.EdgesGeometry(gammaGeom);
    const gammaLines = new THREE.LineSegments(gammaEdges, new THREE.LineBasicMaterial({ color: 0x0088ff }));
    gammaShellGroup.add(gammaLines);

    group.add(gammaShellGroup);
    meshes.gammaShellGroup = gammaShellGroup;

    parts.push({
        name: "Computation Shell Gamma",
        description: "The outermost logic shell, operating near absolute zero for perfect quantum coherence.",
        material: "wireframe, blue neon",
        function: "Quantum state resolution.",
        assemblyOrder: 10,
        connections: ["Radiator Rings", "Hyper-router Hubs"],
        failureEffect: "Decoherence in quantum tasks.",
        cascadeFailures: ["Hyper-router Hubs"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -300, y: 0, z: -300 }
    });

    // --------------------------------------------------------
    // PART 11: Hyper-router Hubs
    // --------------------------------------------------------
    const hubGroup = new THREE.Group();
    const hubGeom = new THREE.DodecahedronGeometry(15, 1);
    for(let i=0; i<20; i++) {
        const phi = Math.acos( - 1 + ( 2 * i ) / 20 );
        const theta = Math.sqrt( 20 * Math.PI ) * phi;
        const hub = new THREE.Mesh(hubGeom, darkChrome);
        hub.position.setFromSphericalCoords(215, phi, theta);
        
        // Add antennas
        const antGeom = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
        const ant = new THREE.Mesh(antGeom, copper);
        ant.position.y = 15;
        hub.add(ant);

        // Core
        const core = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), neonPurple);
        hub.add(core);

        hub.lookAt(0,0,0);
        hubGroup.add(hub);
    }
    group.add(hubGroup);
    meshes.hubGroup = hubGroup;

    parts.push({
        name: "Hyper-router Hubs",
        description: "Dodecahedral networking nodes linking the internal matrioshka layers with external communication arrays.",
        material: "darkChrome, copper, neonPurple",
        function: "System-wide data routing.",
        assemblyOrder: 11,
        connections: ["Computation Shell Gamma", "Outer Shielding"],
        failureEffect: "Communication breakdown between inner and outer layers.",
        cascadeFailures: ["Deep Space Transceivers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 300 }
    });

    // --------------------------------------------------------
    // PART 12: Outer Shielding Array
    // --------------------------------------------------------
    const shieldGroup = new THREE.Group();
    const shieldGeom = new THREE.TorusGeometry(260, 20, 16, 64, Math.PI * 1.5);
    const shield1 = new THREE.Mesh(shieldGeom, hullMat);
    shield1.rotation.x = Math.PI / 4;
    const shield2 = new THREE.Mesh(shieldGeom, hullMat);
    shield2.rotation.y = Math.PI / 4;
    shieldGroup.add(shield1, shield2);
    group.add(shieldGroup);
    meshes.shieldGroup = shieldGroup;

    parts.push({
        name: "Outer Shielding Array",
        description: "Massive armor arcs protecting the brain from meteor impacts, rogue planets, and hostile gamma-ray bursts.",
        material: "hullMat",
        function: "Kinetic and radiation protection.",
        assemblyOrder: 12,
        connections: ["Hyper-router Hubs"],
        failureEffect: "Vulnerability to interstellar debris.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 400, y: 0, z: -400 }
    });

    // --------------------------------------------------------
    // PART 13: Deep Space Transceivers
    // --------------------------------------------------------
    const transceiverGroup = new THREE.Group();
    const dishShape = new THREE.Shape();
    dishShape.moveTo(0, 0);
    dishShape.quadraticCurveTo(15, 5, 30, 20);
    dishShape.lineTo(32, 18);
    dishShape.quadraticCurveTo(16, 3, 0, -2);
    dishShape.lineTo(0, 0);
    
    const dishGeom = new THREE.LatheGeometry(dishShape.getPoints(), 32);
    
    for(let i=0; i<6; i++) {
        const tMesh = new THREE.Mesh(dishGeom, steel);
        const angle = (i / 6) * Math.PI * 2;
        tMesh.position.set(Math.cos(angle)*300, 0, Math.sin(angle)*300);
        tMesh.rotation.x = -Math.PI / 2; // face outward
        tMesh.rotation.z = -angle;

        // Add center needle
        const needleGeom = new THREE.CylinderGeometry(1, 0.1, 40, 8);
        const needle = new THREE.Mesh(needleGeom, neonBlue);
        needle.position.y = 20;
        tMesh.add(needle);

        transceiverGroup.add(tMesh);
    }
    group.add(transceiverGroup);
    meshes.transceiverGroup = transceiverGroup;

    parts.push({
        name: "Deep Space Transceivers",
        description: "Gigantic parabolic dishes capable of transmitting petabytes of consciousness data to other star systems.",
        material: "steel, neonBlue",
        function: "Interstellar communication.",
        assemblyOrder: 13,
        connections: ["Hyper-router Hubs"],
        failureEffect: "Isolation from the galactic network.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -400, y: 0, z: 400 }
    });

    // --------------------------------------------------------
    // PART 14: Thermal Exhaust Vents
    // --------------------------------------------------------
    const ventsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const ventGeom = new THREE.CylinderGeometry(8, 12, 40, 16, 1, true);
        const vent = new THREE.Mesh(ventGeom, darkSteel);
        const angle = (i / 8) * Math.PI * 2;
        vent.position.set(Math.cos(angle)*230, 150, Math.sin(angle)*230);
        vent.rotation.x = Math.PI / 4;
        vent.rotation.z = -angle;

        // Inner fire
        const fireGeom = new THREE.CylinderGeometry(6, 6, 42, 16);
        const fire = new THREE.Mesh(fireGeom, coreCoronaMat);
        vent.add(fire);

        ventsGroup.add(vent);
    }
    group.add(ventsGroup);
    meshes.ventsGroup = ventsGroup;

    parts.push({
        name: "Polar Thermal Exhaust Vents",
        description: "Megastructure-scale chimneys venting excess stellar plasma that couldn't be converted into computation energy.",
        material: "darkSteel, coreCoronaMat",
        function: "Emergency thermal venting.",
        assemblyOrder: 14,
        connections: ["Outer Shielding Array", "Radiator Rings"],
        failureEffect: "Core breach and plasma backflow.",
        cascadeFailures: ["Stellar Core & Corona"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // --------------------------------------------------------
    // PART 15: Overlord Command Node
    // --------------------------------------------------------
    const commandGroup = new THREE.Group();
    const cmdGeom = new THREE.OctahedronGeometry(40, 2);
    const cmdMesh = new THREE.Mesh(cmdGeom, glassMat);
    cmdMesh.position.y = 350;
    
    const cmdInnerGeom = new THREE.OctahedronGeometry(20, 1);
    const cmdInner = new THREE.Mesh(cmdInnerGeom, neonPurple);
    cmdMesh.add(cmdInner);

    // Orbital rings around command node
    const cmdRingGeom = new THREE.TorusGeometry(50, 1, 16, 64);
    const cmdRing1 = new THREE.Mesh(cmdRingGeom, goldCircuitMat);
    cmdRing1.rotation.x = Math.PI / 2;
    const cmdRing2 = new THREE.Mesh(cmdRingGeom, goldCircuitMat);
    cmdRing2.rotation.y = Math.PI / 2;
    cmdMesh.add(cmdRing1, cmdRing2);

    commandGroup.add(cmdMesh);
    group.add(commandGroup);
    meshes.commandGroup = commandGroup;
    meshes.cmdInner = cmdInner;
    meshes.cmdRing1 = cmdRing1;
    meshes.cmdRing2 = cmdRing2;

    parts.push({
        name: "Overlord Command Node",
        description: "The apex control center hovering at the polar axis. Houses the primary governing AI of the Matrioshka Brain.",
        material: "glassMat, neonPurple, goldCircuitMat",
        function: "Centralized decision making and universe simulation governance.",
        assemblyOrder: 15,
        connections: ["Computation Shell Gamma", "Deep Space Transceivers"],
        failureEffect: "Complete system anarchy and unsynchronized computation.",
        cascadeFailures: ["All Shells", "Data Highways"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 600, z: 0 }
    });


    // --------------------------------------------------------
    // ANIMATION FUNCTION
    // --------------------------------------------------------
    function animate(time, speed, meshes) {
        // Core rotation and pulsing
        meshes.starCore.rotation.y += 0.005 * speed;
        meshes.starCorona.rotation.x += 0.007 * speed;
        meshes.starCorona.rotation.y += 0.006 * speed;
        meshes.starCorona.scale.setScalar(1.0 + Math.sin(time * 2) * 0.02);

        // Shell rotations
        meshes.innerShellGroup.rotation.y += 0.002 * speed;
        meshes.innerShellGroup.rotation.z += 0.001 * speed;
        
        meshes.alphaShellGroup.rotation.y -= 0.0015 * speed;
        meshes.betaShellGroup.rotation.y += 0.001 * speed;
        meshes.betaShellGroup.rotation.x -= 0.0005 * speed;
        
        meshes.gammaShellGroup.rotation.y -= 0.0008 * speed;

        // Data highways (Torus knots)
        meshes.highwayGroup.rotation.x += 0.005 * speed;
        meshes.highwayGroup.rotation.y += 0.004 * speed;

        // Spindles orbiting
        meshes.spindleGroup.rotation.y += 0.01 * speed;
        meshes.spindleGroup.children.forEach((spindle, index) => {
            spindle.rotation.x += 0.05 * speed;
            spindle.rotation.y += 0.05 * speed;
            // Pulsing scale
            const pulse = 1.0 + Math.sin(time * 5 + index) * 0.2;
            spindle.scale.setScalar(pulse);
        });

        // Radiator rings slight wobble
        meshes.radiatorGroup.rotation.z = Math.sin(time * 0.5) * 0.05;

        // Hubs pulsing
        meshes.hubGroup.children.forEach((hub, index) => {
            hub.rotation.y += 0.02 * speed;
            const core = hub.children[1];
            if(core) core.scale.setScalar(1.0 + Math.sin(time * 8 + index) * 0.3);
        });

        // Shield array rotation
        meshes.shieldGroup.rotation.y += 0.003 * speed;
        meshes.shieldGroup.rotation.z += 0.002 * speed;

        // Transceivers tracking
        meshes.transceiverGroup.rotation.y -= 0.002 * speed;

        // Overlord command node
        meshes.commandGroup.rotation.y += 0.005 * speed;
        meshes.cmdInner.scale.setScalar(1.0 + Math.sin(time * 4) * 0.15);
        meshes.cmdRing1.rotation.y += 0.02 * speed;
        meshes.cmdRing2.rotation.x += 0.02 * speed;
        
        // Vents exhaust animation
        meshes.ventsGroup.children.forEach((vent, index) => {
            const fire = vent.children[0];
            if(fire) {
                fire.scale.y = 1.0 + Math.sin(time * 10 + index) * 0.1;
                fire.position.y = Math.sin(time * 10 + index) * 1.5;
            }
        });
        
        // Conduits pulsing
        meshes.conduitsGroup.children.forEach((conduit, index) => {
            conduit.material.emissiveIntensity = 2.0 + Math.sin(time * 5 + index * 2) * 1.5;
        });
    }

    // --------------------------------------------------------
    // QUIZ QUESTIONS
    // --------------------------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary function of the Inner Harvester Shell in the Matrioshka Brain?",
            options: [
                "To cool the core",
                "To extract and convert 99.9% of the star's energy output",
                "To act as the main logic processor",
                "To transmit data to other stars"
            ],
            correctAnswer: 1,
            explanation: "The Inner Harvester Shell captures the raw energy from the Stellar Core using geodesic collectors, acting as the primary power source for the entire megastructure."
        },
        {
            question: "Which component is responsible for permanently storing trillions of yottabytes of archived data?",
            options: [
                "Data Highways",
                "Cold Storage Memory Banks",
                "Logic Spindles",
                "Thermodynamic Radiator Rings"
            ],
            correctAnswer: 1,
            explanation: "The Cold Storage Memory Banks are extruded cryogenic vaults designed specifically for long-term, permanent storage of vast amounts of historical universe data."
        },
        {
            question: "What physical mechanism allows the Thermodynamic Radiator Rings to dissipate heat?",
            options: [
                "Venting plasma directly into space",
                "Absorbing heat into a black hole",
                "Massive concentric rings laced with micro-fins radiating heat into deep space",
                "Converting heat back into light"
            ],
            correctAnswer: 2,
            explanation: "The Radiator Rings use extensive surface area provided by concentric rings and micro-fins to radiate waste heat from computation away from the structure."
        },
        {
            question: "What happens if the Hyper-router Hubs fail?",
            options: [
                "The star explodes immediately",
                "Communication breakdown between inner and outer layers, isolating the system",
                "Gravity fails, causing the shells to drift apart",
                "The command node takes direct control of all nodes"
            ],
            correctAnswer: 1,
            explanation: "The Hyper-router Hubs are responsible for system-wide data routing. Their failure severs the connection between the internal computation layers and external arrays like transceivers."
        },
        {
            question: "Which layer operates near absolute zero to maintain perfect quantum coherence?",
            options: [
                "Stellar Core",
                "Computation Shell Alpha",
                "Computation Shell Beta",
                "Computation Shell Gamma"
            ],
            correctAnswer: 3,
            explanation: "Computation Shell Gamma is the outermost logic shell. Being furthest from the star and protected by cooling systems, it operates near absolute zero, ideal for resolving delicate quantum states."
        }
    ];

    return {
        group,
        parts,
        description: "A hyper-advanced Matrioshka Brain megastructure. Consists of nested Dyson shells built around a captured star, dedicating all stellar output to ultimate computation and universe simulation.",
        quizQuestions,
        animate
    };
}
