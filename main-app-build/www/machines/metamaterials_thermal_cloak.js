import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Hexagonal Containment Base
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(16, 18, 3, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseGroup.add(baseMesh);

    // Detail rings on base
    const baseRingGeo = new THREE.TorusGeometry(16.5, 0.4, 8, 6);
    const baseRingMesh1 = new THREE.Mesh(baseRingGeo, chrome);
    baseRingMesh1.position.y = 1;
    baseRingMesh1.rotation.y = Math.PI / 6;
    baseGroup.add(baseRingMesh1);
    
    const baseRingMesh2 = new THREE.Mesh(baseRingGeo, chrome);
    baseRingMesh2.position.y = -1;
    baseRingMesh2.rotation.y = Math.PI / 6;
    baseGroup.add(baseRingMesh2);

    // Complex Base wiring
    for(let i=0; i<12; i++) {
        const wirePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(i*Math.PI/6)*10, 1.5, Math.sin(i*Math.PI/6)*10),
            new THREE.Vector3(Math.cos(i*Math.PI/6)*14, 2, Math.sin(i*Math.PI/6)*14),
            new THREE.Vector3(Math.cos(i*Math.PI/6)*17, 0, Math.sin(i*Math.PI/6)*17)
        ]);
        const wireGeo = new THREE.TubeGeometry(wirePath, 12, 0.15, 6, false);
        const wireMesh = new THREE.Mesh(wireGeo, copper);
        baseGroup.add(wireMesh);
    }
    
    baseGroup.position.set(0, -12, 0);
    group.add(baseGroup);
    meshes.base = baseGroup;
    parts.push({
        name: "Hexagonal Containment Base",
        description: "A heavy-duty multi-layered base platform heavily threaded with copper conduits to distribute massive thermal differentials.",
        material: "Dark Steel & Copper",
        function: "Structural support and thermal grounding.",
        assemblyOrder: 1,
        connections: ["Radial Heat Sinks", "Cryogenic Suspension Struts"],
        failureEffect: "Structural collapse",
        cascadeFailures: ["Complete systemic failure"],
        originalPosition: { x: 0, y: -12, z: 0 },
        explodedPosition: { x: 0, y: -35, z: 0 }
    });

    // 2. Radial Heat Sinks
    const heatSinkGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const sinkBaseGeo = new THREE.BoxGeometry(3, 8, 5);
        const sinkMesh = new THREE.Mesh(sinkBaseGeo, aluminum);
        
        sinkMesh.position.set(Math.cos(angle)*19, -10, Math.sin(angle)*19);
        sinkMesh.rotation.y = -angle;
        
        // Highly detailed fins
        for(let j=0; j<15; j++) {
            const finGeo = new THREE.BoxGeometry(0.1, 7.5, 6);
            const finMesh = new THREE.Mesh(finGeo, aluminum);
            finMesh.position.set((j-7)*0.18, 0, 0.5);
            sinkMesh.add(finMesh);
        }
        
        // Heat sink cap
        const capGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.2, 8);
        const capMesh = new THREE.Mesh(capGeo, darkSteel);
        capMesh.rotation.z = Math.PI/2;
        capMesh.position.y = 4;
        sinkMesh.add(capMesh);

        heatSinkGroup.add(sinkMesh);
    }
    group.add(heatSinkGroup);
    meshes.heatSinks = heatSinkGroup;
    parts.push({
        name: "Radial Heat Sinks",
        description: "Arrays of ultra-thin aluminum fins engineered to maximize surface area and bleed off extraneous heat from the perimeter.",
        material: "Aluminum",
        function: "Thermal dissipation",
        assemblyOrder: 2,
        connections: ["Hexagonal Containment Base"],
        failureEffect: "Overheating of base structure",
        cascadeFailures: ["Waveguide warping"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // 3. Protected Inner Payload Core
    const coreGroup = new THREE.Group();
    // Inner Sphere
    const innerCoreGeo = new THREE.IcosahedronGeometry(2, 4);
    const innerCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0033aa,
        emissiveIntensity: 2,
        metalness: 0.9,
        roughness: 0.1
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCoreMesh);
    
    // Outer Shell of Core
    const outerCoreGeo = new THREE.IcosahedronGeometry(3.5, 3);
    const outerCoreMat = new THREE.MeshStandardMaterial({
        color: 0x001133,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    coreGroup.add(outerCoreMesh);

    // Inner mechanical locking pins
    for(let i=0; i<8; i++) {
        const pinGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const pinMesh = new THREE.Mesh(pinGeo, chrome);
        pinMesh.position.set(Math.cos(i)*2.7, Math.sin(i)*2.7, 0);
        pinMesh.lookAt(0,0,0);
        pinMesh.rotation.x += Math.PI/2;
        coreGroup.add(pinMesh);
    }

    group.add(coreGroup);
    meshes.core = coreGroup;
    parts.push({
        name: "Protected Inner Payload Core",
        description: "The highly sensitive payload maintained at absolute zero, featuring a glowing quantum state material shielded entirely by the cloak.",
        material: "Advanced Cryogenic Metamaterial",
        function: "Houses the sensitive payload",
        assemblyOrder: 3,
        connections: ["Aerogel Insulation Matrix"],
        failureEffect: "Payload destruction due to thermal shock",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 4. Aerogel Insulation Matrix
    const insulationGeo = new THREE.IcosahedronGeometry(4.5, 4);
    const insulationMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.1, roughness: 0.9, wireframe: true });
    const insulationMesh = new THREE.Mesh(insulationGeo, insulationMat);
    
    // Add nodes to vertices
    const pos = insulationGeo.attributes.position;
    const nodeGeo = new THREE.SphereGeometry(0.15, 8, 8);
    for(let i=0; i<pos.count; i++) {
        if (i%5 === 0) { // Add sparsely
            const nodeMesh = new THREE.Mesh(nodeGeo, plastic);
            nodeMesh.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
            insulationMesh.add(nodeMesh);
        }
    }

    group.add(insulationMesh);
    meshes.insulation = insulationMesh;
    parts.push({
        name: "Aerogel Insulation Matrix",
        description: "A wireframe matrix supporting ultra-low density aerogel blocks connected by polymer nodes to prevent conductive heat transfer.",
        material: "Aerogel Matrix & Polymer",
        function: "Conductive insulation",
        assemblyOrder: 4,
        connections: ["Protected Inner Payload Core", "Cryogenic Suspension Struts"],
        failureEffect: "Minor heat leakage",
        cascadeFailures: ["Increased load on cryo lines"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 5. Cryogenic Suspension Struts
    const strutGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*4.5, 0, Math.sin(angle)*4.5),
            new THREE.Vector3(Math.cos(angle)*9, -5, Math.sin(angle)*9),
            new THREE.Vector3(Math.cos(angle)*14, -10.5, Math.sin(angle)*14)
        ]);
        
        const strutGeo = new THREE.TubeGeometry(path, 32, 0.6, 12, false);
        const strutMesh = new THREE.Mesh(strutGeo, steel);
        
        // Hydraulic pistons along strut
        const pistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
        const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
        pistonMesh.position.copy(path.getPointAt(0.5));
        pistonMesh.lookAt(path.getPointAt(0.55));
        pistonMesh.rotateX(Math.PI/2);
        strutMesh.add(pistonMesh);

        // Rubber shock absorbers
        const shockGeo = new THREE.TorusGeometry(1, 0.3, 16, 32);
        for(let k=0; k<3; k++) {
            const shock = new THREE.Mesh(shockGeo, rubber);
            shock.position.y = -1 + k;
            shock.rotation.x = Math.PI/2;
            pistonMesh.add(shock);
        }

        strutGroup.add(strutMesh);
    }
    group.add(strutGroup);
    meshes.struts = strutGroup;
    parts.push({
        name: "Cryogenic Suspension Struts",
        description: "Hydraulic-assisted, thermally isolating struts suspending the core. Features internal coolant flow and heavy-duty shock absorption.",
        material: "Steel, Chrome & Rubber",
        function: "Mechanical support with thermal isolation",
        assemblyOrder: 5,
        connections: ["Aerogel Insulation Matrix", "Hexagonal Containment Base"],
        failureEffect: "Core displacement",
        cascadeFailures: ["Cloaking field intersection", "Catastrophic thermal breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 6. Metamaterial Thermal Waveguides
    const waveguidesGroup = new THREE.Group();
    const ringCount = 18;
    for(let i=0; i<ringCount; i++) {
        const radius = 6 + (i * 0.45);
        const thickness = 0.1 + (i*0.015);
        const ringGeo = new THREE.TorusGeometry(radius, thickness, 32, 128);
        
        // Emissive material for temperature gradient illusion (Cold interior to Hot exterior)
        const heatColor = new THREE.Color().setHSL(0.65 - (i/ringCount)*0.65, 1.0, 0.5);
        const heatMat = new THREE.MeshStandardMaterial({
            color: heatColor,
            emissive: heatColor,
            emissiveIntensity: 0.8 + (i/ringCount)*0.5,
            metalness: 0.5,
            roughness: 0.3
        });
        
        const ringMesh = new THREE.Mesh(ringGeo, heatMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = Math.sin((i/ringCount)*Math.PI) * 7.5 - 3.75;
        
        // Add metamaterial micro-structures (interlocking split-ring resonators)
        const nodeCount = 20 + i*2;
        for(let j=0; j<nodeCount; j++) {
            const angle = (j/nodeCount) * Math.PI * 2;
            const resonatorGroup = new THREE.Group();
            
            const outerRingGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI * 1.5); // broken ring
            const outerRingMesh = new THREE.Mesh(outerRingGeo, copper);
            resonatorGroup.add(outerRingMesh);
            
            const innerRingGeo = new THREE.TorusGeometry(0.15, 0.05, 8, 16, Math.PI * 1.5);
            const innerRingMesh = new THREE.Mesh(innerRingGeo, copper);
            innerRingMesh.rotation.z = Math.PI; // opposite gap
            resonatorGroup.add(innerRingMesh);

            resonatorGroup.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
            resonatorGroup.rotation.y = angle;
            resonatorGroup.rotation.x = Math.PI/2;
            
            ringMesh.add(resonatorGroup);
        }
        
        waveguidesGroup.add(ringMesh);
    }
    group.add(waveguidesGroup);
    meshes.waveguides = waveguidesGroup;
    parts.push({
        name: "Metamaterial Thermal Waveguides",
        description: "Concentric torus structures populated with thousands of copper split-ring resonators that warp thermal phonon fields around the core.",
        material: "Copper-doped Metamaterial",
        function: "Routing heat waves",
        assemblyOrder: 6,
        connections: ["Quantum Heat Valves", "Outer Confinement Shell"],
        failureEffect: "Thermal leakage",
        cascadeFailures: ["Core overheating", "Resonator meltdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 7. Thermal Flux Injectors
    const injectorGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const injector = new THREE.Group();
        
        const bodyGeo = new THREE.CylinderGeometry(1.2, 1.8, 7, 24);
        const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
        bodyMesh.position.y = 3.5;
        injector.add(bodyMesh);
        
        // Vent grooves
        for(let v=0; v<6; v++) {
            const ventGeo = new THREE.BoxGeometry(3, 0.2, 3);
            const ventMesh = new THREE.Mesh(ventGeo, aluminum);
            ventMesh.position.y = 1 + v;
            injector.add(ventMesh);
        }

        const nozzleGeo = new THREE.CylinderGeometry(0.6, 1.2, 3, 24);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, chrome);
        nozzleMesh.position.y = 8.5;
        injector.add(nozzleMesh);
        
        // Glowing hot port with internal fire color
        const portGeo = new THREE.SphereGeometry(0.7, 24, 24);
        const portMat = new THREE.MeshStandardMaterial({color: 0xff3300, emissive: 0xff4400, emissiveIntensity: 2.5});
        const portMesh = new THREE.Mesh(portGeo, portMat);
        portMesh.position.y = 10;
        injector.add(portMesh);

        // Power cables to injector
        const pCableGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
        const pCable = new THREE.Mesh(pCableGeo, rubber);
        pCable.position.set(1.5, 2, 0);
        pCable.rotation.z = Math.PI/8;
        injector.add(pCable);
        
        injector.position.set(Math.cos(angle)*22, -12, Math.sin(angle)*22);
        
        // Pointing into the waveguides
        injector.lookAt(0, 0, 0);
        injector.rotateX(Math.PI/2);
        
        injectorGroup.add(injector);
    }
    group.add(injectorGroup);
    meshes.injectors = injectorGroup;
    parts.push({
        name: "Thermal Flux Injectors",
        description: "Massive thermal cannons injecting simulated extreme environmental heat loads (up to 3000°C) into the cloak for testing.",
        material: "Dark Steel, Chrome & Aluminum",
        function: "Heat source generation",
        assemblyOrder: 7,
        connections: ["Hexagonal Containment Base"],
        failureEffect: "Test failure",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: -10, z: 40 }
    });

    // 8. Quantum Heat Valves
    const valveGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const valveOuterGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 24);
        const valveMesh = new THREE.Mesh(valveOuterGeo, glass);
        
        // Alternate valve heights
        const hOffset = (i%2 === 0) ? 6 : 2;
        const radius = 13.5;

        valveMesh.position.set(Math.cos(angle)*radius, hOffset, Math.sin(angle)*radius);
        valveMesh.rotation.x = Math.PI/2;
        valveMesh.rotation.z = angle;
        
        // inner glowing core
        const coreGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.8, 12);
        const coreMat = new THREE.MeshStandardMaterial({color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1.8});
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        valveMesh.add(coreMesh);

        // Control rings
        const cRingGeo = new THREE.TorusGeometry(0.65, 0.1, 16, 32);
        const cRing1 = new THREE.Mesh(cRingGeo, copper);
        cRing1.position.y = 1.5;
        cRing1.rotation.x = Math.PI/2;
        valveMesh.add(cRing1);
        
        const cRing2 = new THREE.Mesh(cRingGeo, copper);
        cRing2.position.y = -1.5;
        cRing2.rotation.x = Math.PI/2;
        valveMesh.add(cRing2);
        
        valveGroup.add(valveMesh);
    }
    group.add(valveGroup);
    meshes.valves = valveGroup;
    parts.push({
        name: "Quantum Heat Valves",
        description: "Directional heat flow regulators utilizing quantum tunneling principles, mounted at critical junctions to halt thermal backflow.",
        material: "Reinforced Glass & Rare Earth Elements",
        function: "One-way thermal regulation",
        assemblyOrder: 8,
        connections: ["Metamaterial Thermal Waveguides"],
        failureEffect: "Thermal backflow",
        cascadeFailures: ["Waveguide saturation", "Core breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 9. Outer Confinement Shell
    const shellGeo = new THREE.IcosahedronGeometry(17, 5); // very high poly sphere
    const shellMat = new THREE.MeshStandardMaterial({
        color: 0xaaccff,
        metalness: 0.8,
        roughness: 0.1,
        transparent: true,
        opacity: 0.12,
        wireframe: true
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    group.add(shellMesh);
    meshes.shell = shellMesh;
    parts.push({
        name: "Outer Confinement Shell",
        description: "A colossal high-tensile geodesic boundary maintaining the hard vacuum interior, necessary to negate convective heat transfer.",
        material: "Transparent Polycarbonate Lattice",
        function: "Vacuum containment",
        assemblyOrder: 9,
        connections: ["Hexagonal Containment Base", "Magnetic Containment Rings"],
        failureEffect: "Atmospheric breach",
        cascadeFailures: ["Convective heat transfer", "Total cloaking failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 10. Holographic Diagnostic Panels
    const panelsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + (Math.PI/4);
        const panelGroup = new THREE.Group();
        
        const frameGeo = new THREE.BoxGeometry(5, 8, 0.4);
        const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
        panelGroup.add(frameMesh);
        
        const screenGeo = new THREE.PlaneGeometry(4.6, 7.6);
        const screenMat = new THREE.MeshStandardMaterial({color: 0x000000, emissive: 0x002244, emissiveIntensity: 1, side: THREE.DoubleSide});
        const screenMesh = new THREE.Mesh(screenGeo, screenMat);
        screenMesh.position.z = 0.21;
        panelGroup.add(screenMesh);
        
        // Render complex data graphs on screen
        for(let j=0; j<8; j++) {
            const barGeo = new THREE.PlaneGeometry(0.4, 1 + Math.random()*4);
            const barMat = new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2, side: THREE.DoubleSide});
            const barMesh = new THREE.Mesh(barGeo, barMat);
            barMesh.position.set(-1.8 + j*0.5, -3.8 + barGeo.parameters.height/2, 0.22);
            panelGroup.add(barMesh);
        }

        // Circular radar element
        const radarGeo = new THREE.RingGeometry(1, 1.2, 32);
        const radarMat = new THREE.MeshStandardMaterial({color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.5, side: THREE.DoubleSide});
        const radarMesh = new THREE.Mesh(radarGeo, radarMat);
        radarMesh.position.set(0, 1.5, 0.22);
        panelGroup.add(radarMesh);

        panelGroup.position.set(Math.cos(angle)*19, 4, Math.sin(angle)*19);
        panelGroup.lookAt(0, 4, 0);
        panelsGroup.add(panelGroup);
    }
    group.add(panelsGroup);
    meshes.panels = panelsGroup;
    parts.push({
        name: "Holographic Diagnostic Panels",
        description: "Displays complex real-time telemetry, including thermal gradients, quantum valve status, and structural strain.",
        material: "Dark Steel & LCD Array",
        function: "User interface and diagnostics",
        assemblyOrder: 10,
        connections: ["Hexagonal Containment Base"],
        failureEffect: "Loss of telemetry",
        cascadeFailures: ["Blind operation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 35, y: 10, z: 35 }
    });

    // 11. Magnetic Containment Rings
    const magGroup = new THREE.Group();
    const magMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.9, roughness: 0.3});
    for(let i=0; i<3; i++) {
        const yPos = (i - 1) * 12; // -12, 0, 12
        const rad = i === 1 ? 18.5 : 15;
        const magGeo = new THREE.TorusGeometry(rad, 0.8, 32, 128);
        const magMesh = new THREE.Mesh(magGeo, magMat);
        magMesh.position.y = yPos;
        magMesh.rotation.x = Math.PI/2;
        
        // Massive copper electromagnets on ring
        for(let j=0; j<16; j++) {
            const angle = (j/16) * Math.PI * 2;
            const emitGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16);
            const emitMesh = new THREE.Mesh(emitGeo, copper);
            emitMesh.position.set(Math.cos(angle)*rad, Math.sin(angle)*rad, 0);
            emitMesh.rotation.z = angle;
            emitMesh.rotation.x = Math.PI/2;
            magMesh.add(emitMesh);
        }
        
        magGroup.add(magMesh);
    }
    group.add(magGroup);
    meshes.magRings = magGroup;
    parts.push({
        name: "Magnetic Containment Rings",
        description: "Three colossal electromagnets stabilizing the delicate copper split-ring resonators against thermal vibration.",
        material: "Steel & Solid Copper",
        function: "Lattice stabilization",
        assemblyOrder: 11,
        connections: ["Outer Confinement Shell"],
        failureEffect: "Lattice destabilization",
        cascadeFailures: ["Waveguide disruption", "Catastrophic uncloaking"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // 12. Cryogenic Pumping Station
    const pumpGroup = new THREE.Group();
    const pumpBaseGeo = new THREE.BoxGeometry(6, 4, 6);
    const pumpBaseMesh = new THREE.Mesh(pumpBaseGeo, darkSteel);
    
    // Pump tanks
    for(let t=0; t<2; t++) {
        const tankGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 24);
        const tankMesh = new THREE.Mesh(tankGeo, chrome);
        tankMesh.position.set(-1.5 + t*3, 4.5, 0);
        pumpBaseMesh.add(tankMesh);
        
        // Tank gauges
        const gaugeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
        const gaugeMesh = new THREE.Mesh(gaugeGeo, tinted);
        gaugeMesh.position.set(0, 1, 1.5);
        gaugeMesh.rotation.x = Math.PI/2;
        tankMesh.add(gaugeMesh);
    }

    pumpGroup.add(pumpBaseMesh);
    pumpGroup.position.set(-12, -10, -12);
    pumpGroup.rotation.y = Math.PI/4;
    group.add(pumpGroup);
    meshes.pump = pumpGroup;
    parts.push({
        name: "Cryogenic Pumping Station",
        description: "A dual-tank, high-pressure pumping array circulating liquid helium through the support struts to the core.",
        material: "Dark Steel, Chrome & Tinted Glass",
        function: "Coolant circulation",
        assemblyOrder: 12,
        connections: ["Cryogenic Suspension Struts", "Hexagonal Containment Base"],
        failureEffect: "Loss of coolant flow",
        cascadeFailures: ["Core temperature spike", "Payload destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: -10, z: -30 }
    });

    // 13. Phase-Change Thermal Capacitors
    const capGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const capGeo = new THREE.CapsuleGeometry(1.2, 4, 16, 32);
        const capMesh = new THREE.Mesh(capGeo, tinted);
        capMesh.position.set(Math.cos(angle)*11, 10, Math.sin(angle)*11);
        
        // Fluid inside
        const fluidGeo = new THREE.CapsuleGeometry(1.0, 3.8, 16, 32);
        const fluidMat = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x005500, emissiveIntensity: 1, transparent: true, opacity: 0.8});
        const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
        capMesh.add(fluidMesh);

        // Heavy industrial end caps
        const endGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.8, 24);
        const end1 = new THREE.Mesh(endGeo, darkSteel);
        end1.position.y = 2.4;
        capMesh.add(end1);
        const end2 = new THREE.Mesh(endGeo, darkSteel);
        end2.position.y = -2.4;
        capMesh.add(end2);
        
        capGroup.add(capMesh);
    }
    group.add(capGroup);
    meshes.capacitors = capGroup;
    parts.push({
        name: "Phase-Change Thermal Capacitors",
        description: "Fluid-filled shock absorbers that buffer massive, sudden thermal spikes by instantly changing states from liquid to gas.",
        material: "Tinted Glass & Dark Steel",
        function: "Thermal shock buffering",
        assemblyOrder: 13,
        connections: ["Metamaterial Thermal Waveguides", "Magnetic Containment Rings"],
        failureEffect: "Vulnerability to thermal spikes",
        cascadeFailures: ["Waveguide shattering"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });

    // 14. Photon Funnel Array
    const funnelGroup = new THREE.Group();
    // Complex mobius-like knot
    const funnelGeo = new THREE.TorusKnotGeometry(5.5, 0.6, 128, 32, 2, 5);
    const funnelMat = new THREE.MeshStandardMaterial({color: 0xff00aa, emissive: 0xff0055, emissiveIntensity: 1.5, wireframe: true});
    const funnelMesh = new THREE.Mesh(funnelGeo, funnelMat);
    funnelMesh.position.y = 16;
    funnelMesh.rotation.x = Math.PI/2;
    
    // Core of funnel
    const fCoreGeo = new THREE.SphereGeometry(2, 32, 32);
    const fCoreMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffaaff, emissiveIntensity: 2});
    const fCoreMesh = new THREE.Mesh(fCoreGeo, fCoreMat);
    funnelMesh.add(fCoreMesh);

    funnelGroup.add(funnelMesh);
    group.add(funnelGroup);
    meshes.funnel = funnelGroup;
    parts.push({
        name: "Photon Funnel Array",
        description: "A hyper-dimensional topological lattice structure designed to safely vent intense radiative heat as harmless photons directly out the zenith.",
        material: "Energy Construct & Metamaterial",
        function: "Radiative heat venting",
        assemblyOrder: 14,
        connections: ["Outer Confinement Shell"],
        failureEffect: "Radiative heat pooling",
        cascadeFailures: ["Upper cloak saturation", "Shell meltdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // 15. Superconducting Ground Cables
    const cableGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const cablePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*15, -12, Math.sin(angle)*15),
            new THREE.Vector3(Math.cos(angle)*22, -18, Math.sin(angle)*22),
            new THREE.Vector3(Math.cos(angle)*28, -25, Math.sin(angle)*28)
        ]);
        const cableGeo = new THREE.TubeGeometry(cablePath, 32, 0.8, 16, false);
        const cableMesh = new THREE.Mesh(cableGeo, rubber);
        
        // Cable rings
        const cRingGeo = new THREE.TorusGeometry(1, 0.2, 16, 16);
        const cRing = new THREE.Mesh(cRingGeo, chrome);
        cRing.position.copy(cablePath.getPointAt(0.5));
        cRing.lookAt(cablePath.getPointAt(0.51));
        cableMesh.add(cRing);

        cableGroup.add(cableMesh);
    }
    group.add(cableGroup);
    meshes.cables = cableGroup;
    parts.push({
        name: "Superconducting Ground Cables",
        description: "Massive rubber-sheathed, superconducting cables meant to rapidly dump catastrophic electrical and thermal feedback safely into the ground.",
        material: "Rubber & Superconductor Core",
        function: "Emergency energy dumping",
        assemblyOrder: 15,
        connections: ["Hexagonal Containment Base"],
        failureEffect: "Feedback build-up",
        cascadeFailures: ["System-wide short circuit", "Plasma explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    const description = "The Metamaterial Thermal Cloak is an ultra-high-tech, massive apparatus engineered to render a central payload entirely invisible to external heat flow. Utilizing complex copper split-ring resonators embedded within nested torus waveguides, it literally bends thermal phonons around the core. Backed by absolute-zero cryogenic pumping, quantum heat valves, and massive magnetic stabilizers, this machine achieves perfect thermal isolation in the most hostile environments imaginable.";

    const quizQuestions = [
        {
            question: "How do the Metamaterial Thermal Waveguides successfully bend thermal energy around the core?",
            options: [
                "Using countless copper split-ring resonators to manipulate phonons",
                "By flooding the chamber with liquid helium",
                "Spinning rapidly to create a vortex",
                "Acting as simple highly polished mirrors"
            ],
            correctAnswer: 0,
            explanation: "The waveguides use embedded copper split-ring resonators which interact with thermal phonons to alter their path around the core."
        },
        {
            question: "What is the primary function of the Outer Confinement Shell?",
            options: [
                "Maintaining a hard vacuum to stop convective heat transfer",
                "Shielding against kinetic impacts",
                "Looking intimidating",
                "Absorbing radiation"
            ],
            correctAnswer: 0,
            explanation: "The geodesic boundary maintains a hard vacuum, which completely eliminates convective heat transfer, a requirement for perfect cloaking."
        },
        {
            question: "Why does the machine utilize Magnetic Containment Rings?",
            options: [
                "To stabilize the delicate copper resonators against thermal vibration",
                "To levitate the core",
                "To generate electricity",
                "To trap the liquid coolant"
            ],
            correctAnswer: 0,
            explanation: "The massive electromagnets generate a field to stabilize the metamaterial lattice and prevent destructive thermal vibrations."
        },
        {
            question: "What mechanism allows the Quantum Heat Valves to prevent thermal backflow?",
            options: [
                "Quantum tunneling principles",
                "Mechanical steel shutters",
                "High-speed fans",
                "Chemical freezing agents"
            ],
            correctAnswer: 0,
            explanation: "They act as directional regulators that utilize quantum tunneling principles to ensure heat only flows outward."
        },
        {
            question: "How do the Phase-Change Thermal Capacitors handle sudden catastrophic heat spikes?",
            options: [
                "By immediately changing state from liquid to gas to buffer the shock",
                "By jettisoning into the atmosphere",
                "By turning into solid ice",
                "By shutting down the entire machine"
            ],
            correctAnswer: 0,
            explanation: "The internal fluid changes from liquid to gas instantly, absorbing massive amounts of energy through phase change to buffer the system."
        }
    ];

    // Particle system for thermal flow visualization
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    const phaseArray = new Float32Array(particleCount);
    
    for(let i=0; i<particleCount; i++) {
        // Randomly place particles within a radius
        const radius = 10 + Math.random() * 8;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 15;
        
        posArray[i*3] = Math.cos(angle)*radius;
        posArray[i*3+1] = y;
        posArray[i*3+2] = Math.sin(angle)*radius;
        
        phaseArray[i] = Math.random() * Math.PI * 2;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('phase', new THREE.BufferAttribute(phaseArray, 1));

    const particleMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xffaa00,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);
    meshes.particles = { obj: particles, phases: phaseArray };

    function animate(time, speed, meshesObj) {
        const delta = time * 0.001 * speed;
        
        // 1. Outer Shell slow rotation
        if (meshesObj.shell) {
            meshesObj.shell.rotation.y = delta * 0.15;
            meshesObj.shell.rotation.z = delta * 0.05;
        }

        // 2. Waveguides intricate pulsing and spinning
        if (meshesObj.waveguides) {
            meshesObj.waveguides.children.forEach((ring, index) => {
                ring.rotation.z = delta * 0.4 * (index % 2 === 0 ? 1 : -1);
                
                // Pulsing emissive intensity (hotter towards outer rings)
                const baseIntensity = 0.8 + (index/18)*0.5;
                ring.material.emissiveIntensity = baseIntensity + 0.3 * Math.sin(delta * 3 + index);
                
                // Spin the tiny resonators
                ring.children.forEach(res => {
                    res.rotation.z = delta * 5;
                });
            });
        }

        // 3. Inner Core quantum pulsing
        if (meshesObj.core) {
            const innerSphere = meshesObj.core.children[0];
            innerSphere.scale.setScalar(1 + 0.05 * Math.sin(delta * 8));
            innerSphere.material.emissiveIntensity = 2 + Math.sin(delta * 12);
            
            const outerWire = meshesObj.core.children[1];
            outerWire.rotation.x = delta * 0.5;
            outerWire.rotation.y = delta * 0.7;
        }

        // 4. Quantum Heat Valves glow pulsing
        if (meshesObj.valves) {
            meshesObj.valves.children.forEach((valve, index) => {
                // Glow core
                valve.children[0].material.emissiveIntensity = 1.5 + Math.sin(delta * 15 + index);
                // Rotate control rings
                valve.children[1].rotation.z = delta * 2;
                valve.children[2].rotation.z = -delta * 2;
            });
        }

        // 5. Magnetic Containment Rings opposing rotations
        if (meshesObj.magRings) {
            meshesObj.magRings.children[0].rotation.z = delta * 0.5;
            meshesObj.magRings.children[1].rotation.z = -delta * 0.3;
            meshesObj.magRings.children[2].rotation.z = delta * 0.5;
        }

        // 6. Photon Funnel swirling
        if (meshesObj.funnel) {
            const knot = meshesObj.funnel.children[0];
            knot.rotation.z = delta * 1.5;
            knot.material.emissiveIntensity = 1.5 + 0.5 * Math.sin(delta * 10);
            
            const core = knot.children[0];
            core.scale.setScalar(1 + 0.2 * Math.sin(delta * 20));
        }

        // 7. Holographic diagnostic panels data scroll and radar
        if (meshesObj.panels) {
            meshesObj.panels.children.forEach((panel) => {
                // animate bars
                for(let j=2; j<10; j++) {
                    const bar = panel.children[j];
                    if(bar) {
                        const h = 1 + Math.abs(Math.sin(delta * 5 + j)) * 3;
                        bar.scale.y = h;
                    }
                }
                // animate radar
                const radar = panel.children[10];
                if(radar) {
                    radar.rotation.z = -delta * 3;
                }
            });
        }

        // 8. Capacitors liquid bubbling effect
        if (meshesObj.capacitors) {
            meshesObj.capacitors.children.forEach((cap, i) => {
                const fluid = cap.children[0];
                fluid.scale.y = 1 + 0.05 * Math.sin(delta * 10 + i);
                fluid.material.emissiveIntensity = 1 + 0.5 * Math.sin(delta * 5 + i);
            });
        }

        // 9. Particle Flow (Simulating thermal energy bending around the core)
        if (meshesObj.particles) {
            const pObj = meshesObj.particles.obj;
            const positions = pObj.geometry.attributes.position.array;
            
            for(let i=0; i<particleCount; i++) {
                // Flow upwards and around the sphere
                let x = positions[i*3];
                let y = positions[i*3+1];
                let z = positions[i*3+2];
                
                y += 0.05 * speed;
                
                // Repel from core (radius ~10)
                const dist2D = Math.sqrt(x*x + z*z);
                if (dist2D < 8 && y > -8 && y < 8) {
                    const push = (8 - dist2D) * 0.1;
                    x += (x/dist2D) * push;
                    z += (z/dist2D) * push;
                }
                
                // Reset if too high
                if (y > 15) {
                    y = -15;
                    const radius = 10 + Math.random() * 8;
                    const angle = Math.random() * Math.PI * 2;
                    x = Math.cos(angle)*radius;
                    z = Math.sin(angle)*radius;
                }
                
                positions[i*3] = x;
                positions[i*3+1] = y;
                positions[i*3+2] = z;
            }
            pObj.geometry.attributes.position.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createThermalCloak() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
