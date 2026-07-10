import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ---------------------------------------------------------
    // Custom High-Tech Materials
    // ---------------------------------------------------------
    const titaniumMat = new THREE.MeshStandardMaterial({
        color: 0x99aab5,
        roughness: 0.3,
        metalness: 0.85,
        envMapIntensity: 1.5
    });
    
    const glowingCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const quantumFluidMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.2,
        roughness: 0.0,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true
    });

    const goldPlating = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 1.0,
        envMapIntensity: 2.0
    });

    const bioGelMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f7fa,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.2,
        transparent: true,
        opacity: 0.6
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0022,
        emissiveIntensity: 3,
        roughness: 0.2
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.3
    });

    const logicGateMat = new THREE.MeshStandardMaterial({
        color: 0x223344,
        roughness: 0.5,
        metalness: 0.6,
        wireframe: false
    });

    const emissiveBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.8
    });

    const emissiveGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff22,
        emissiveIntensity: 2,
        roughness: 0.1
    });

    // ---------------------------------------------------------
    // 1. Main Casing (Titanium)
    // ---------------------------------------------------------
    const casingGroup = new THREE.Group();
    const casingShape = new THREE.Shape();
    casingShape.moveTo(0, 0);
    casingShape.lineTo(2, 0.5);
    casingShape.bezierCurveTo(2.5, 1, 3, 2, 2.5, 3);
    casingShape.lineTo(1.5, 3.5);
    casingShape.quadraticCurveTo(0, 4, -1.5, 3.5);
    casingShape.lineTo(-2.5, 3);
    casingShape.bezierCurveTo(-3, 2, -2.5, 1, -2, 0.5);
    casingShape.lineTo(0, 0);

    const extrudeSettings = {
        steps: 4,
        depth: 1.2,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.15,
        bevelOffset: 0,
        bevelSegments: 8
    };

    const casingGeo = new THREE.ExtrudeGeometry(casingShape, extrudeSettings);
    const casingMesh = new THREE.Mesh(casingGeo, titaniumMat);
    casingMesh.rotation.x = Math.PI / 2;
    casingMesh.position.set(0, 1.2, -0.6);
    casingMesh.castShadow = true;
    casingMesh.receiveShadow = true;
    casingGroup.add(casingMesh);

    // Add some panel lines using Torus geometries embedded in the casing
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(1.5 - i*0.3, 0.05, 16, 64);
        const ringMesh = new THREE.Mesh(ringGeo, darkSteel);
        ringMesh.position.set(0, 2.5 - i*0.4, 0.6);
        ringMesh.rotation.x = Math.PI / 2;
        casingGroup.add(ringMesh);
    }

    group.add(casingGroup);
    meshes.mainCasing = casingGroup;

    parts.push({
        name: "Titanium Cranial Casing",
        description: "Biocompatible titanium outer shell protecting delicate internal components from physical shock and electromagnetic interference.",
        material: "Titanium Alloy",
        function: "Structural housing and electromagnetic shielding.",
        assemblyOrder: 1,
        connections: ["Microelectrode Base", "Power Cell"],
        failureEffect: "Exposure of internal components, leading to malfunction.",
        cascadeFailures: ["Processing Core", "Power Cell"],
        originalPosition: { x: 0, y: 1.2, z: -0.6 },
        explodedPosition: { x: 0, y: 5.0, z: -0.6 }
    });

    // ---------------------------------------------------------
    // 2. Microelectrode Array Base
    // ---------------------------------------------------------
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.0, 0.3, 64);
    const baseMesh = new THREE.Mesh(baseGeo, goldPlating);
    baseMesh.position.set(0, 0.15, 0);
    baseGroup.add(baseMesh);

    const bioRingGeo = new THREE.TorusGeometry(2.2, 0.15, 32, 64);
    const bioRingMesh = new THREE.Mesh(bioRingGeo, bioGelMat);
    bioRingMesh.rotation.x = Math.PI / 2;
    bioRingMesh.position.set(0, 0.15, 0);
    baseGroup.add(bioRingMesh);

    group.add(baseGroup);
    meshes.microelectrodeBase = baseGroup;

    parts.push({
        name: "Gold-Plated Array Base",
        description: "The primary structural base connecting the microelectrodes to the processing units above.",
        material: "Gold and Bio-Gel",
        function: "Conductive routing and cranial seating.",
        assemblyOrder: 2,
        connections: ["Main Casing", "Microelectrodes"],
        failureEffect: "Total loss of neural signal bridging.",
        cascadeFailures: ["Microelectrodes"],
        originalPosition: { x: 0, y: 0.15, z: 0 },
        explodedPosition: { x: 0, y: -2.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 3. Ultra-fine Microelectrodes
    // ---------------------------------------------------------
    const electrodeGroup = new THREE.Group();
    const needleGeo = new THREE.CylinderGeometry(0.01, 0.002, 1.5, 8);
    // Move needle down so origin is at top
    needleGeo.translate(0, -0.75, 0);

    for (let x = -9; x <= 9; x++) {
        for (let z = -9; z <= 9; z++) {
            if (x*x + z*z < 80) { // keep in a circular pattern
                const needleMesh = new THREE.Mesh(needleGeo, chrome);
                needleMesh.position.set(x * 0.18, 0, z * 0.18);
                electrodeGroup.add(needleMesh);
            }
        }
    }
    
    electrodeGroup.position.set(0, 0, 0);
    group.add(electrodeGroup);
    meshes.microelectrodes = electrodeGroup;

    parts.push({
        name: "Invasive Microelectrode Array",
        description: "Hundreds of ultra-fine nanotech needles designed to penetrate the cortex and interface directly with individual neurons.",
        material: "Chrome/Tungsten",
        function: "Read and write neural spikes at the synaptic level.",
        assemblyOrder: 3,
        connections: ["Microelectrode Base", "Cortex"],
        failureEffect: "Loss of read/write capability in localized brain regions.",
        cascadeFailures: ["Synaptic Bridge"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 4. Glowing Data Processing Core
    // ---------------------------------------------------------
    const coreGroup = new THREE.Group();
    const corePoints = [];
    for ( let i = 0; i <= 10; i ++ ) {
        corePoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.8, (i - 5) * 0.15));
    }
    const coreGeo = new THREE.LatheGeometry(corePoints, 64);
    const coreMesh = new THREE.Mesh(coreGeo, glowingCoreMat);
    coreMesh.position.set(0, 1.5, 0);
    coreGroup.add(coreMesh);

    // Inner processing matrix
    const matrixGeo = new THREE.IcosahedronGeometry(0.5, 2);
    const matrixMesh = new THREE.Mesh(matrixGeo, quantumFluidMat);
    matrixMesh.position.set(0, 1.5, 0);
    coreGroup.add(matrixMesh);

    group.add(coreGroup);
    meshes.processingCore = coreGroup;
    meshes.processingMatrix = matrixMesh;

    parts.push({
        name: "Quantum Neural Co-Processor",
        description: "A glowing, fluid-dynamic quantum processor that translates biological neural spikes into digital data arrays.",
        material: "Quantum Fluid / Transparent Casing",
        function: "Real-time, zero-latency decoding of cortical signals.",
        assemblyOrder: 4,
        connections: ["Microelectrode Base", "Synaptic Bridge"],
        failureEffect: "Severe cognitive desync, corrupted data flow.",
        cascadeFailures: ["Data Transmitter"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 6.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 5. Data Transmitter Coil
    // ---------------------------------------------------------
    const txGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const coilGeo = new THREE.TorusGeometry(1.2 + i*0.1, 0.02, 16, 100);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        coilMesh.rotation.x = Math.PI / 2;
        coilMesh.position.set(0, 2.2 + i*0.02, 0);
        txGroup.add(coilMesh);
    }
    group.add(txGroup);
    meshes.transmitterCoil = txGroup;

    parts.push({
        name: "Sub-space Data Transmitter Coil",
        description: "Dense copper induction loops for high-bandwidth wireless telemetry with external systems.",
        material: "High-purity Copper",
        function: "Wireless neural data broadcast.",
        assemblyOrder: 5,
        connections: ["Processing Core"],
        failureEffect: "Device isolation; inability to offload or receive data.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2.2, z: 0 },
        explodedPosition: { x: 0, y: 8.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 6. Neural Fiber Cables (Hydraulic/Data lines)
    // ---------------------------------------------------------
    const cablesGroup = new THREE.Group();
    
    function createCable(p1, p2, p3, p4, material) {
        const curve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
        return new THREE.Mesh(tubeGeo, material);
    }

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.0;
        
        const start = new THREE.Vector3(Math.cos(angle)*radius, 1.2, Math.sin(angle)*radius);
        const mid1 = new THREE.Vector3(Math.cos(angle)*(radius+0.5), 1.8, Math.sin(angle)*(radius+0.5));
        const mid2 = new THREE.Vector3(Math.cos(angle)*0.8, 2.2, Math.sin(angle)*0.8);
        const end = new THREE.Vector3(Math.cos(angle)*0.2, 2.5, Math.sin(angle)*0.2);
        
        const cable = createCable(start, mid1, mid2, end, rubber);
        cablesGroup.add(cable);

        // Add a glowing fiber optic line wrapping it
        const glowCable = createCable(
            new THREE.Vector3(start.x + 0.05, start.y, start.z),
            new THREE.Vector3(mid1.x, mid1.y + 0.05, mid1.z),
            new THREE.Vector3(mid2.x, mid2.y, mid2.z + 0.05),
            new THREE.Vector3(end.x, end.y + 0.05, end.z),
            glowingCoreMat
        );
        cablesGroup.add(glowCable);
    }
    
    group.add(cablesGroup);
    meshes.neuralCables = cablesGroup;

    parts.push({
        name: "Fiber-Optic Neural Cables",
        description: "Bundles of synthetic neural fibers routing raw data from the array to the processor.",
        material: "Synthetic Polymer and Fiber Optics",
        function: "High-speed multi-channel data conduit.",
        assemblyOrder: 6,
        connections: ["Microelectrode Base", "Processing Core"],
        failureEffect: "Signal noise and packet loss.",
        cascadeFailures: ["Processing Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 7. Cooling Heatsink Array
    // ---------------------------------------------------------
    const heatsinkGroup = new THREE.Group();
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.1, 0);
    finShape.lineTo(0.1, 1.0);
    finShape.lineTo(0.05, 1.1);
    finShape.lineTo(0, 1.0);
    
    const finExtrude = { depth: 1.5, bevelEnabled: false };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);
    finGeo.translate(-0.05, 0, -0.75);

    for(let i=0; i<24; i++) {
        const finMesh = new THREE.Mesh(finGeo, aluminum);
        const angle = (i / 24) * Math.PI * 2;
        finMesh.position.set(Math.cos(angle)*1.5, 0.5, Math.sin(angle)*1.5);
        finMesh.lookAt(0, 0.5, 0);
        heatsinkGroup.add(finMesh);
    }
    
    group.add(heatsinkGroup);
    meshes.heatsink = heatsinkGroup;

    parts.push({
        name: "Radial Aluminum Heatsink",
        description: "Precision-machined aluminum fins designed to dissipate intense thermal output from the quantum core safely away from brain tissue.",
        material: "Anodized Aluminum",
        function: "Thermal regulation.",
        assemblyOrder: 7,
        connections: ["Processing Core", "Main Casing"],
        failureEffect: "Severe thermal necrosis of surrounding brain tissue.",
        cascadeFailures: ["Processing Core"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 4.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 8. Micro Nuclear Power Cell
    // ---------------------------------------------------------
    const powerGroup = new THREE.Group();
    const cellGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32);
    const cellMesh = new THREE.Mesh(cellGeo, steel);
    cellMesh.position.set(1.5, 1.5, 0);
    powerGroup.add(cellMesh);

    const cellCapGeo = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const cellCap = new THREE.Mesh(cellCapGeo, chrome);
    cellCap.position.set(1.5, 1.9, 0);
    powerGroup.add(cellCap);

    const cellRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 16, 32), neonRed);
    cellRing.position.set(1.5, 1.5, 0);
    cellRing.rotation.x = Math.PI / 2;
    powerGroup.add(cellRing);

    group.add(powerGroup);
    meshes.powerCell = powerGroup;
    meshes.powerRing = cellRing; // For animation

    parts.push({
        name: "Micro-Fission Power Cell",
        description: "A highly shielded, miniaturized nuclear isotope battery providing uninterrupted power for decades.",
        material: "Steel / Plutonium-238",
        function: "Energy generation for all interface functions.",
        assemblyOrder: 8,
        connections: ["Main Casing", "Processing Core"],
        failureEffect: "Complete system shutdown.",
        cascadeFailures: ["Processing Core", "Microelectrodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3.0, y: 3.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 9. Optical Sensor Array
    // ---------------------------------------------------------
    const opticalGroup = new THREE.Group();
    const lensGeo = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI*2, 0, Math.PI/3);
    const lensMesh = new THREE.Mesh(lensGeo, tinted);
    lensMesh.position.set(0, 3.2, 1.8);
    lensMesh.rotation.x = Math.PI / 2;
    opticalGroup.add(lensMesh);

    const lensHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32), darkSteel);
    lensHousing.position.set(0, 3.0, 1.8);
    opticalGroup.add(lensHousing);

    group.add(opticalGroup);
    meshes.opticalSensor = opticalGroup;

    parts.push({
        name: "Cortical Optical Sensor",
        description: "A specialized lens array designed to interface with external optical datastreams and project them directly into the visual cortex.",
        material: "Tinted Glass / Dark Steel",
        function: "Visual data ingestion.",
        assemblyOrder: 9,
        connections: ["Main Casing"],
        failureEffect: "Inability to process external visual stimuli directly.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5.0, z: 4.0 }
    });

    // ---------------------------------------------------------
    // 10. Cranial Anchors
    // ---------------------------------------------------------
    const anchorGroup = new THREE.Group();
    const anchorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
    anchorGeo.translate(0, -0.3, 0);

    const anchorHead = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    anchorHead.translate(0, 0.05, 0);

    for(let i=0; i<6; i++) {
        const angle = (i/6)*Math.PI*2;
        const x = Math.cos(angle)*2.4;
        const z = Math.sin(angle)*2.4;

        const screwBody = new THREE.Mesh(anchorGeo, chrome);
        const screwHead = new THREE.Mesh(anchorHead, steel);
        
        const singleAnchor = new THREE.Group();
        singleAnchor.add(screwBody);
        singleAnchor.add(screwHead);
        
        singleAnchor.position.set(x, 0.1, z);
        
        // angle them slightly outward
        singleAnchor.rotation.x = Math.cos(angle)*0.2;
        singleAnchor.rotation.z = -Math.sin(angle)*0.2;

        anchorGroup.add(singleAnchor);
    }

    group.add(anchorGroup);
    meshes.cranialAnchors = anchorGroup;

    parts.push({
        name: "Titanium Cranial Anchors",
        description: "Bone-integrating screws that permanently bolt the interface array into the skull.",
        material: "Titanium",
        function: "Mechanical stabilization.",
        assemblyOrder: 10,
        connections: ["Microelectrode Base", "Skull"],
        failureEffect: "Micro-vibrations causing severe brain tissue tearing.",
        cascadeFailures: ["Microelectrodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 11. Cortical Stimulators
    // ---------------------------------------------------------
    const stimGroup = new THREE.Group();
    for (let i=0; i<4; i++) {
        const stimMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.4, 8, 16), glowingCoreMat);
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        stimMesh.position.set(Math.cos(angle)*1.2, 0.5, Math.sin(angle)*1.2);
        stimGroup.add(stimMesh);
    }
    group.add(stimGroup);
    meshes.corticalStimulators = stimGroup;

    parts.push({
        name: "Deep-Cortical Stimulators",
        description: "High-voltage nodes capable of delivering macro-shocks to reset neural rhythms or induce hyper-focus.",
        material: "Superconductive Ceramic",
        function: "Emergency neural override and adrenaline synthesis.",
        assemblyOrder: 11,
        connections: ["Microelectrode Base"],
        failureEffect: "Inability to perform hard-resets of the neural bridge.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1.0, z: -3.0 }
    });

    // ---------------------------------------------------------
    // 12. Synaptic Bridge Rings
    // ---------------------------------------------------------
    const bridgeGroup = new THREE.Group();
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 16, 64), emissiveBlue);
    ring1.position.set(0, 1.2, 0);
    ring1.rotation.x = Math.PI/2;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 16, 64), emissiveGreen);
    ring2.position.set(0, 1.2, 0);
    ring2.rotation.y = Math.PI/4;
    
    bridgeGroup.add(ring1);
    bridgeGroup.add(ring2);
    group.add(bridgeGroup);
    meshes.synapticRings = bridgeGroup;
    meshes.ring1 = ring1;
    meshes.ring2 = ring2;

    parts.push({
        name: "Synaptic Bridge",
        description: "A pair of accelerating magnetic rings that align quantum states before data enters the processing core.",
        material: "Magnetic Superconductors",
        function: "Data alignment and quantum coherence.",
        assemblyOrder: 12,
        connections: ["Processing Core"],
        failureEffect: "Data corruption and localized hallucinations.",
        cascadeFailures: ["Processing Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3.0, y: 5.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 13. Status Indicators (LED Array)
    // ---------------------------------------------------------
    const ledGroup = new THREE.Group();
    const ledGeo = new THREE.BoxGeometry(0.05, 0.02, 0.1);
    for (let i=0; i<8; i++) {
        const led = new THREE.Mesh(ledGeo, emissiveRed);
        led.position.set(-1.8, 2.5, -1.0 + i*0.15);
        ledGroup.add(led);
    }
    group.add(ledGroup);
    meshes.statusLEDs = ledGroup;

    parts.push({
        name: "Diagnostic LED Array",
        description: "External sub-surface indicators showing real-time interface health, power levels, and neural sync ratios.",
        material: "Sapphire Glass / Emissive Diode",
        function: "Visual diagnostics.",
        assemblyOrder: 13,
        connections: ["Main Casing"],
        failureEffect: "No external diagnostic capability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4.0, y: 6.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 14. Bio-Compatibility Outer Mesh
    // ---------------------------------------------------------
    const bioMeshGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(2.35, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const outerMesh = new THREE.Mesh(sphereGeo, carbonFiber);
    outerMesh.position.set(0, 0.2, 0);
    // Add wireframe aesthetic
    const wireframeGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0x555555, depthTest: false, opacity: 0.2, transparent: true });
    const line = new THREE.LineSegments(wireframeGeo, wireframeMat);
    line.position.copy(outerMesh.position);
    bioMeshGroup.add(outerMesh);
    bioMeshGroup.add(line);
    
    group.add(bioMeshGroup);
    meshes.bioMesh = bioMeshGroup;

    parts.push({
        name: "Carbon-Fiber Bio-Mesh",
        description: "A porous outer dome that encourages bone and tissue growth over the implant, securing it naturally.",
        material: "Carbon Fiber Mesh",
        function: "Biological integration and secondary armor.",
        assemblyOrder: 14,
        connections: ["Main Casing", "Skull"],
        failureEffect: "Implant rejection by the host's immune system.",
        cascadeFailures: ["Microelectrode Base", "Cranial Anchors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10.0, z: 0 }
    });

    // ---------------------------------------------------------
    // 15. Logic Gate Surface Arrays
    // ---------------------------------------------------------
    const logicGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.4), logicGateMat);
        chip.position.set(Math.cos(i)*1.0, 1.8, Math.sin(i)*1.0);
        
        // Add tiny gold pins
        for(let j=-1; j<=1; j+=2) {
            for(let k=-2; k<=2; k+=1) {
                const pin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.02), goldPlating);
                pin.position.set(j*0.16, -0.02, k*0.08);
                chip.add(pin);
            }
        }
        
        chip.lookAt(0, 2.0, 0);
        logicGroup.add(chip);
    }
    group.add(logicGroup);
    meshes.logicGates = logicGroup;

    parts.push({
        name: "Sub-processor Logic Gates",
        description: "Distributed logic arrays handling low-level filtering of neural noise before it hits the main quantum core.",
        material: "Silicon/Gold",
        function: "Signal-to-noise optimization.",
        assemblyOrder: 15,
        connections: ["Main Casing", "Processing Core"],
        failureEffect: "Extreme sensory noise and hallucinations.",
        cascadeFailures: ["Processing Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4.0, y: 4.0, z: 4.0 }
    });


    // ---------------------------------------------------------
    // Metadata & Quiz
    // ---------------------------------------------------------
    const description = "The Cybernetics Neural Interface (CNI-9X) is an ultra high-tech, invasive brain-computer implant. It utilizes an array of hundreds of microelectrodes to physically bridge biological neurons with a quantum fluid processing core. The entire assembly is housed in titanium and biological carbon-mesh, cooled by an aluminum radial heatsink, and powered by a micro-fission cell.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Micro-Fission Power Cell?",
            options: [
                "To cool the interface down.",
                "To provide uninterrupted energy for decades.",
                "To decode visual stimuli.",
                "To anchor the device to the skull."
            ],
            correctAnswer: 1,
            explanation: "The Micro-Fission Power Cell uses a miniaturized nuclear isotope to generate long-lasting power for the implant."
        },
        {
            question: "Why does the interface use a Radial Aluminum Heatsink?",
            options: [
                "To look intimidating.",
                "To broadcast wireless signals.",
                "To safely dissipate intense thermal output away from brain tissue.",
                "To store extra quantum fluid."
            ],
            correctAnswer: 2,
            explanation: "Heat is dangerous to biological tissue. The radial heatsink draws thermal energy from the processing core and safely dissipates it."
        },
        {
            question: "Which component is responsible for aligning quantum states?",
            options: [
                "Synaptic Bridge Rings",
                "Carbon-Fiber Bio-Mesh",
                "Cranial Anchors",
                "Diagnostic LED Array"
            ],
            correctAnswer: 0,
            explanation: "The Synaptic Bridge uses magnetic superconductors to accelerate and align quantum states before they enter the processing core."
        },
        {
            question: "What happens if the Carbon-Fiber Bio-Mesh fails?",
            options: [
                "The LEDs will turn blue.",
                "The host's immune system may reject the implant.",
                "The power cell will explode.",
                "The quantum fluid will freeze."
            ],
            correctAnswer: 1,
            explanation: "The bio-mesh encourages natural tissue integration. If it fails, the body may treat the implant as a foreign invader and reject it."
        },
        {
            question: "How does the implant handle raw data from the cortex?",
            options: [
                "Bluetooth 5.0.",
                "Fiber-Optic Neural Cables route it to the processing core.",
                "It is printed out on paper.",
                "The titanium casing absorbs it."
            ],
            correctAnswer: 1,
            explanation: "Fiber-Optic Neural Cables bundle synthetic fibers to securely and rapidly transmit raw data from the electrodes to the main core."
        }
    ];

    // ---------------------------------------------------------
    // Animation Logic
    // ---------------------------------------------------------
    function animate(time, speed, meshes) {
        // Spin the synaptic bridge rings in opposite directions
        if (meshes.ring1 && meshes.ring2) {
            meshes.ring1.rotation.y = time * 2 * speed;
            meshes.ring1.rotation.z = Math.sin(time * speed) * 0.2;
            meshes.ring2.rotation.x = time * 3 * speed;
            meshes.ring2.rotation.z = Math.cos(time * speed) * 0.2;
        }

        // Pulse the quantum processing matrix
        if (meshes.processingMatrix) {
            const scale = 1.0 + Math.sin(time * 5 * speed) * 0.05;
            meshes.processingMatrix.scale.set(scale, scale, scale);
            meshes.processingMatrix.rotation.y = time * 0.5 * speed;
            meshes.processingMatrix.rotation.x = time * 0.2 * speed;
        }

        // Rotate the inner transmitter coils sequentially
        if (meshes.transmitterCoil) {
            meshes.transmitterCoil.children.forEach((coil, index) => {
                coil.rotation.z = time * speed * (index + 1) * 0.5;
            });
        }

        // Make the power cell ring pulse dangerously
        if (meshes.powerRing) {
            meshes.powerRing.scale.setScalar(1.0 + Math.sin(time * 10 * speed) * 0.1);
        }

        // Blinking logic for Status LEDs
        if (meshes.statusLEDs) {
            meshes.statusLEDs.children.forEach((led, index) => {
                const blinkSpeed = 2 + index;
                led.material.emissiveIntensity = Math.max(0, Math.sin(time * speed * blinkSpeed) * 3);
            });
        }

        // Subtle organic bobbing of the neural cables to simulate fluid pumping
        if (meshes.neuralCables) {
            meshes.neuralCables.children.forEach((cable, index) => {
                if(index % 2 === 0) { // Only affect the rubber ones
                    cable.scale.x = 1.0 + Math.sin(time * speed * 4 + index) * 0.02;
                    cable.scale.z = 1.0 + Math.cos(time * speed * 4 + index) * 0.02;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createNeuralInterface() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
