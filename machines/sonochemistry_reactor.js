import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Material for Sonochemistry (Acoustic Cavitation effect)
    const cavitationGlow = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        emissive: 0x2244ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    const activeGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9
    });

    // Helper: Create flanged pipe section
    function createFlangedPipe(radius, length, flangeRadius, flangeThickness, boltCount) {
        const pGroup = new THREE.Group();
        const pipeGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        pGroup.add(pipe);

        const flangeGeo = new THREE.CylinderGeometry(flangeRadius, flangeRadius, flangeThickness, 32);
        const f1 = new THREE.Mesh(flangeGeo, steel);
        f1.position.y = length / 2 - flangeThickness / 2;
        pGroup.add(f1);

        const f2 = new THREE.Mesh(flangeGeo, steel);
        f2.position.y = -length / 2 + flangeThickness / 2;
        pGroup.add(f2);

        // Add bolts
        for (let i = 0; i < boltCount; i++) {
            const angle = (i / boltCount) * Math.PI * 2;
            const boltGeo = new THREE.CylinderGeometry(flangeThickness*0.2, flangeThickness*0.2, flangeThickness * 1.5, 8);
            const bolt1 = new THREE.Mesh(boltGeo, darkSteel);
            const bRadius = radius + (flangeRadius - radius) * 0.7;
            bolt1.position.set(Math.cos(angle) * bRadius, length / 2 - flangeThickness / 2, Math.sin(angle) * bRadius);
            pGroup.add(bolt1);

            const bolt2 = bolt1.clone();
            bolt2.position.y = -length / 2 + flangeThickness / 2;
            pGroup.add(bolt2);
        }
        return pGroup;
    }

    // Helper: Create a Transducer Assembly
    function createTransducerAssembly() {
        const tGroup = new THREE.Group();
        
        // Base housing (generator connection)
        const housingGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.position.y = -1;
        tGroup.add(housing);

        // Cooling fins on housing
        for(let i=0; i<10; i++) {
            const finGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.05, 32);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = -0.2 - i * 0.18;
            tGroup.add(fin);
        }

        // Booster section
        const boosterGeo = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 32);
        const booster = new THREE.Mesh(boosterGeo, chrome);
        booster.position.y = 0.75;
        tGroup.add(booster);

        // Horn section (stepped)
        const hornGeo = new THREE.CylinderGeometry(0.2, 0.5, 2, 32);
        const horn = new THREE.Mesh(hornGeo, chrome);
        horn.position.y = 2.5;
        tGroup.add(horn);

        // Flange for mounting
        const mountGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.position.y = 1.5;
        tGroup.add(mount);

        // Wiring port
        const portGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
        const port = new THREE.Mesh(portGeo, plastic);
        port.position.set(0, -1, 0.8);
        tGroup.add(port);

        return tGroup;
    }

    // Build the Main Reactor Vessel
    const vesselGroup = new THREE.Group();
    meshes.vessel = vesselGroup;

    // Complex framed structure and glass cylinders
    const lowerConeGeo = new THREE.CylinderGeometry(3, 2, 2, 64);
    const lowerCone = new THREE.Mesh(lowerConeGeo, steel);
    lowerCone.position.y = -4;
    vesselGroup.add(lowerCone);

    const upperConeGeo = new THREE.CylinderGeometry(2, 3, 2, 64);
    const upperCone = new THREE.Mesh(upperConeGeo, steel);
    upperCone.position.y = 4;
    vesselGroup.add(upperCone);

    const mainGlassGeo = new THREE.CylinderGeometry(3, 3, 6, 64);
    const mainGlass = new THREE.Mesh(mainGlassGeo, glass);
    vesselGroup.add(mainGlass);

    const innerCoreGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const innerCore = new THREE.Mesh(innerCoreGeo, cavitationGlow);
    vesselGroup.add(innerCore);
    meshes.innerCore = innerCore;

    // Structural columns for the glass
    for(let i=0; i<8; i++) {
        const colGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
        const col = new THREE.Mesh(colGeo, darkSteel);
        const angle = (i/8)*Math.PI*2;
        col.position.set(Math.cos(angle)*3.2, 0, Math.sin(angle)*3.2);
        vesselGroup.add(col);
    }

    // Transducers array
    const transducerGroup = new THREE.Group();
    meshes.transducers = [];
    const numTransducers = 6;
    for(let i=0; i<numTransducers; i++) {
        const t = createTransducerAssembly();
        const angle = (i/numTransducers)*Math.PI*2;
        t.rotation.x = Math.PI / 2;
        t.rotation.z = -angle;
        
        t.position.set(Math.cos(angle)*4.5, 0, Math.sin(angle)*4.5);
        t.lookAt(0, 0, 0);
        t.rotateX(Math.PI/2);

        transducerGroup.add(t);
        meshes.transducers.push(t);
    }
    // Second layer of transducers
    for(let i=0; i<numTransducers; i++) {
        const t = createTransducerAssembly();
        const angle = (i/numTransducers)*Math.PI*2 + (Math.PI/numTransducers);
        t.rotation.x = Math.PI / 2;
        t.rotation.z = -angle;
        t.position.set(Math.cos(angle)*4.5, 2.5, Math.sin(angle)*4.5);
        t.lookAt(0, 2.5, 0);
        t.rotateX(Math.PI/2);
        transducerGroup.add(t);
        meshes.transducers.push(t);
    }
    // Third layer
    for(let i=0; i<numTransducers; i++) {
        const t = createTransducerAssembly();
        const angle = (i/numTransducers)*Math.PI*2 + (Math.PI/numTransducers);
        t.rotation.x = Math.PI / 2;
        t.rotation.z = -angle;
        t.position.set(Math.cos(angle)*4.5, -2.5, Math.sin(angle)*4.5);
        t.lookAt(0, -2.5, 0);
        t.rotateX(Math.PI/2);
        transducerGroup.add(t);
        meshes.transducers.push(t);
    }
    vesselGroup.add(transducerGroup);
    
    group.add(vesselGroup);

    parts.push({
        name: "Acoustic Transducer Array",
        description: "18 high-power ultrasonic transducers arranged in triple radial configurations to maximize cavitation field density.",
        material: "Titanium Alloy / Chrome / Steel",
        function: "Converts high-frequency electrical energy into intense mechanical vibrations (20kHz - 40kHz).",
        assemblyOrder: 1,
        connections: ["Reactor Vessel", "High Frequency Generators"],
        failureEffect: "Loss of acoustic cavitation, stopping the sonochemical reactions.",
        cascadeFailures: ["Generator overload", "Imbalanced acoustic field"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    parts.push({
        name: "Sonochemical Reaction Chamber",
        description: "A heavy-walled continuous flow vessel with sight glasses and structural steel reinforcements.",
        material: "Borosilicate Glass / 316L Stainless Steel",
        function: "Contains the chemical reagents under high pressure and intense ultrasonic fields.",
        assemblyOrder: 2,
        connections: ["Transducer Array", "Inlet Manifold", "Outlet Manifold"],
        failureEffect: "Catastrophic vessel rupture and leak of hazardous reagents.",
        cascadeFailures: ["Environmental contamination", "Pressure system collapse"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: 0, z: 0}
    });

    // Base Frame
    const frameGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(12, 0.5, 12);
    const frameBase = new THREE.Mesh(frameGeo, darkSteel);
    frameBase.position.y = -5.25;
    frameGroup.add(frameBase);
    
    // Grating
    const gratingGeo = new THREE.PlaneGeometry(11, 11);
    const grating = new THREE.Mesh(gratingGeo, new THREE.MeshStandardMaterial({color: 0x333333, wireframe: true}));
    grating.rotation.x = -Math.PI/2;
    grating.position.y = -4.99;
    frameGroup.add(grating);

    // Vertical Frame Pillars
    for(let x of [-5.5, 5.5]) {
        for(let z of [-5.5, 5.5]) {
            const pillarGeo = new THREE.BoxGeometry(0.8, 16, 0.8);
            const pillar = new THREE.Mesh(pillarGeo, darkSteel);
            pillar.position.set(x, 2.5, z);
            frameGroup.add(pillar);
        }
    }
    // Top Frame
    const topFrameGeo = new THREE.BoxGeometry(12, 0.5, 12);
    const topFrame = new THREE.Mesh(topFrameGeo, darkSteel);
    topFrame.position.y = 10.5;
    frameGroup.add(topFrame);

    group.add(frameGroup);

    parts.push({
        name: "Vibration-Damped Skid Frame",
        description: "Heavy steel skid framework designed to absorb and dissipate high-frequency acoustic vibrations.",
        material: "A36 Structural Steel / Elastomeric Mounts",
        function: "Provides structural integrity and isolation from the facility floor.",
        assemblyOrder: 3,
        connections: ["Reactor Vessel", "Pump Skids", "Control Cabinet"],
        failureEffect: "Structural fatigue and resonance leading to weld failure.",
        cascadeFailures: ["Pipe shearing", "Vessel misalignment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });


    // Fluid Piping System
    const inletCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -4, 0),
        new THREE.Vector3(-6, -4, 0),
        new THREE.Vector3(-4, -6, 0),
        new THREE.Vector3(0, -6, 0),
        new THREE.Vector3(0, -5, 0)
    ]);
    const inletGeo = new THREE.TubeGeometry(inletCurve, 64, 0.6, 16, false);
    const inletPipe = new THREE.Mesh(inletGeo, copper);
    group.add(inletPipe);

    const outletCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(0, 7, 0),
        new THREE.Vector3(3, 9, 0),
        new THREE.Vector3(8, 9, 0),
        new THREE.Vector3(10, 5, 0),
        new THREE.Vector3(10, -3, 0)
    ]);
    const outletGeo = new THREE.TubeGeometry(outletCurve, 128, 0.6, 16, false);
    const outletPipe = new THREE.Mesh(outletGeo, steel);
    group.add(outletPipe);

    parts.push({
        name: "Reagent Inlet Manifold",
        description: "Copper piping system supplying precursor chemicals to the sonochemical reactor.",
        material: "Copper / Brass",
        function: "Delivers fluid to the bottom of the reactor for continuous upward flow.",
        assemblyOrder: 4,
        connections: ["Reactor Vessel", "Dosing Pumps"],
        failureEffect: "Starvation of reactor, cavitation erosion of dry vessel walls.",
        cascadeFailures: ["Transducer overheating", "Vessel damage"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: -10, z: 0}
    });

    parts.push({
        name: "Product Outlet Manifold",
        description: "High-grade steel piping for routing the synthesized product out of the reaction zone.",
        material: "316L Stainless Steel",
        function: "Maintains back-pressure and routes product to downstream separation.",
        assemblyOrder: 5,
        connections: ["Reactor Vessel", "Heat Exchanger"],
        failureEffect: "Loss of product containment, depressurization.",
        cascadeFailures: ["Flash boiling of reactants"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 15, y: 10, z: 0}
    });

    // Control Cabinet
    const cabinetGroup = new THREE.Group();
    const cabGeo = new THREE.BoxGeometry(4, 8, 3);
    const cabinet = new THREE.Mesh(cabGeo, darkSteel);
    cabinet.position.set(-8, 0, 4);
    cabinetGroup.add(cabinet);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(3, 2);
    const screen = new THREE.Mesh(screenGeo, activeGlow);
    screen.position.set(-8, 1.5, 5.51);
    cabinetGroup.add(screen);

    // Buttons
    for(let i=0; i<6; i++) {
        const btnGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
        const btnMat = i % 2 === 0 ? new THREE.MeshStandardMaterial({color:0xff0000}) : new THREE.MeshStandardMaterial({color:0x00ff00});
        const btn = new THREE.Mesh(btnGeo, btnMat);
        btn.rotation.x = Math.PI/2;
        btn.position.set(-9 + i*0.4, 0, 5.51);
        cabinetGroup.add(btn);
    }

    group.add(cabinetGroup);

    parts.push({
        name: "Ultrasonic Generator Control Cabinet",
        description: "Houses 18 individual solid-state high-frequency power supplies and the main PLC.",
        material: "Steel / Electronics",
        function: "Synchronizes the acoustic waves to create standing wave patterns inside the reactor.",
        assemblyOrder: 6,
        connections: ["Transducer Array", "Facility Power"],
        failureEffect: "Loss of acoustic field, termination of sonochemical synthesis.",
        cascadeFailures: ["Process fluid solidification", "Thermal runaway"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -20, y: 0, z: 15}
    });

    // High Pressure Pumps
    const pumpGroup = new THREE.Group();
    const pumpBaseGeo = new THREE.BoxGeometry(3, 2, 4);
    const pumpBase = new THREE.Mesh(pumpBaseGeo, chrome);
    pumpBase.position.set(-10, -4, -3);
    pumpGroup.add(pumpBase);
    
    const motorGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const motor = new THREE.Mesh(motorGeo, aluminum);
    motor.rotation.x = Math.PI/2;
    motor.position.set(-10, -3, -4.5);
    pumpGroup.add(motor);

    const pumpHeadGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
    const pumpHead = new THREE.Mesh(pumpHeadGeo, steel);
    pumpHead.rotation.x = Math.PI/2;
    pumpHead.position.set(-10, -3, -2);
    pumpGroup.add(pumpHead);

    group.add(pumpGroup);

    parts.push({
        name: "High-Pressure Precursor Pump",
        description: "Positive displacement pump to force viscous fluids through the acoustic field.",
        material: "Cast Iron / Stainless Steel",
        function: "Provides the necessary 500 PSI inlet pressure for optimal cavitation.",
        assemblyOrder: 7,
        connections: ["Inlet Manifold", "Storage Tanks"],
        failureEffect: "No fluid flow, leading to localized boiling inside reactor.",
        cascadeFailures: ["Transducer failure due to no load"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: -5, z: -15}
    });

    // Piping connecting Pump to Inlet
    const connectCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -3, -1),
        new THREE.Vector3(-10, -3, 0),
        new THREE.Vector3(-10, -4, 0)
    ]);
    const connectGeo = new THREE.TubeGeometry(connectCurve, 32, 0.6, 16, false);
    const connectPipe = new THREE.Mesh(connectGeo, copper);
    group.add(connectPipe);

    // Cavitation Bubble Particles inside the inner core
    const particleCount = 500;
    const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    const instancedBubbles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    meshes.bubbles = instancedBubbles;
    meshes.bubbleData = [];

    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 2.5;
        const y = (Math.random() - 0.5) * 7.5;
        const z = (Math.random() - 0.5) * 2.5;
        dummy.position.set(x, y, z);
        
        const scale = Math.random() * 0.5 + 0.5;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        instancedBubbles.setMatrixAt(i, dummy.matrix);

        meshes.bubbleData.push({
            x, y, z,
            scale,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.05 + 0.02
        });
    }
    vesselGroup.add(instancedBubbles);

    parts.push({
        name: "Acoustic Cavitation Zone",
        description: "The core volume where millions of micro-bubbles rapidly form and symmetrically collapse.",
        material: "Plasma / Supercritical Fluid",
        function: "Generates localized temperatures of 5000K and pressures of 1000 atm to drive sonochemistry.",
        assemblyOrder: 8,
        connections: ["Reactor Vessel"],
        failureEffect: "N/A (Phenomenon, not physical part)",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // Cooling Jacket Piping (Wrap around vessel)
    const coolingGroup = new THREE.Group();
    const coolCurve = [];
    for(let i=0; i<=100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 16; // 8 coils
        const height = -3 + t * 6;
        const r = 3.2;
        coolCurve.push(new THREE.Vector3(Math.cos(angle)*r, height, Math.sin(angle)*r));
    }
    const coolPath = new THREE.CatmullRomCurve3(coolCurve);
    const coolGeo = new THREE.TubeGeometry(coolPath, 200, 0.15, 8, false);
    const coolPipe = new THREE.Mesh(coolGeo, aluminum);
    coolingGroup.add(coolPipe);
    vesselGroup.add(coolingGroup);

    parts.push({
        name: "Helical Cooling Jacket",
        description: "Circulates chilled glycol around the main glass vessel to manage exothermic sonochemical reactions.",
        material: "Aluminum",
        function: "Maintains bulk fluid temperature below boiling point despite immense localized heating.",
        assemblyOrder: 9,
        connections: ["Reactor Vessel", "Chiller Unit"],
        failureEffect: "Thermal runaway, boiling of reactants, vessel shatter.",
        cascadeFailures: ["Total system destruction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -15}
    });

    // Gauges
    function createGauge(radius) {
        const gGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.2, 16), chrome);
        base.rotation.x = Math.PI/2;
        gGroup.add(base);

        const face = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.9, radius*0.9, 0.22, 16), new THREE.MeshStandardMaterial({color:0xffffff}));
        face.rotation.x = Math.PI/2;
        gGroup.add(face);

        const needleGeo = new THREE.BoxGeometry(0.05, radius*1.2, 0.05);
        const needle = new THREE.Mesh(needleGeo, new THREE.MeshStandardMaterial({color:0xff0000}));
        needle.position.z = 0.12;
        gGroup.add(needle);
        
        const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.25, 16), glass);
        glassMesh.rotation.x = Math.PI/2;
        gGroup.add(glassMesh);

        return { group: gGroup, needle };
    }

    meshes.gauges = [];
    
    // Inlet Pressure Gauge
    const gauge1 = createGauge(0.6);
    gauge1.group.position.set(-6, -4, 0.6);
    group.add(gauge1.group);
    meshes.gauges.push(gauge1);

    // Vessel Pressure Gauge
    const gauge2 = createGauge(0.8);
    gauge2.group.position.set(0, 4.5, 3.5);
    group.add(gauge2.group);
    meshes.gauges.push(gauge2);

    parts.push({
        name: "Precision Instrumentation (Gauges)",
        description: "Analog pressure and flow indicators for redundant safety monitoring.",
        material: "Chrome / Glass / Steel",
        function: "Displays real-time pipeline and vessel pressures.",
        assemblyOrder: 10,
        connections: ["Inlet Manifold", "Reactor Vessel"],
        failureEffect: "Loss of manual readout.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 5, y: -5, z: 10}
    });

    // Large Valve on Outlet
    const valveGroup = new THREE.Group();
    const vBody = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), steel);
    valveGroup.add(vBody);
    
    const vStem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), chrome);
    vStem.position.y = 0.75;
    valveGroup.add(vStem);

    const vWheelGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
    const vWheel = new THREE.Mesh(vWheelGeo, new THREE.MeshStandardMaterial({color: 0xcc0000}));
    vWheel.rotation.x = Math.PI/2;
    vWheel.position.y = 1.5;
    valveGroup.add(vWheel);
    meshes.valveWheel = vWheel;

    valveGroup.position.set(10, 2, 0);
    group.add(valveGroup);

    parts.push({
        name: "Back-Pressure Regulating Valve",
        description: "Heavy-duty throttling valve with hardened trim to resist cavitation damage.",
        material: "Cast Steel / Stellite",
        function: "Controls the acoustic pressure threshold inside the reactor.",
        assemblyOrder: 11,
        connections: ["Outlet Manifold"],
        failureEffect: "Loss of system pressure, cessation of acoustic cavitation.",
        cascadeFailures: ["Pump deadheading if closed"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: 5, z: 5}
    });

    // Generator cables linking control cabinet to transducers
    const cablesGroup = new THREE.Group();
    for(let i=0; i<numTransducers; i++) {
        if (i % 2 === 0) {
            const startPoint = new THREE.Vector3(-8, 4, 4); 
            const angle = (i/numTransducers)*Math.PI*2;
            const endPoint = new THREE.Vector3(Math.cos(angle)*6, 0, Math.sin(angle)*6);

            const mid1 = new THREE.Vector3(-4, 6, 2);
            const mid2 = new THREE.Vector3(0, 5, endPoint.z > 0 ? 5 : -5);
            
            const cCurve = new THREE.CatmullRomCurve3([startPoint, mid1, mid2, endPoint]);
            const cGeo = new THREE.TubeGeometry(cCurve, 32, 0.1, 8, false);
            const cable = new THREE.Mesh(cGeo, rubber);
            cablesGroup.add(cable);
        }
    }
    group.add(cablesGroup);

    parts.push({
        name: "Coaxial RF Power Cables",
        description: "Heavy-gauge shielded cabling transmitting high-voltage, high-frequency AC power.",
        material: "Copper / Thick Rubber Insulation",
        function: "Delivers electrical power from the generators to the piezoelectric transducers.",
        assemblyOrder: 12,
        connections: ["Control Cabinet", "Transducer Array"],
        failureEffect: "Electrical arcing, loss of power to specific transducers.",
        cascadeFailures: ["Imbalanced acoustic field", "Generator burnout"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -10, y: 15, z: 10}
    });

    // Add extra details: Flanges on the main vessel
    const topFlange = createFlangedPipe(2.9, 0.5, 3.5, 0.3, 16);
    topFlange.position.y = 3;
    vesselGroup.add(topFlange);

    const botFlange = createFlangedPipe(2.9, 0.5, 3.5, 0.3, 16);
    botFlange.position.y = -3;
    vesselGroup.add(botFlange);
    
    // Add cooling pump skid
    const chillerGroup = new THREE.Group();
    const chillerBase = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), aluminum);
    chillerBase.position.set(5, -3, -8);
    chillerGroup.add(chillerBase);
    
    const chillerFanGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const chillerFan = new THREE.Mesh(chillerFanGeo, darkSteel);
    chillerFan.rotation.x = Math.PI/2;
    chillerFan.position.set(5, -2, -5.8);
    chillerGroup.add(chillerFan);
    meshes.chillerFan = chillerFan;

    group.add(chillerGroup);

    parts.push({
        name: "Industrial Chiller Unit",
        description: "Vapor-compression refrigeration system for the cooling jacket.",
        material: "Galvanized Steel / Aluminum",
        function: "Removes excess heat generated by the intense acoustic cavitation.",
        assemblyOrder: 13,
        connections: ["Helical Cooling Jacket"],
        failureEffect: "Cooling failure, thermal runaway.",
        cascadeFailures: ["Reactor vessel cracking due to thermal shock"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 15, y: -5, z: -20}
    });

    parts.push({
        name: "Piezoelectric Ceramics (PZT)",
        description: "The active elements inside each transducer assembly.",
        material: "Lead Zirconate Titanate",
        function: "Expands and contracts rapidly under alternating high voltage.",
        assemblyOrder: 14,
        connections: ["Transducer Array"],
        failureEffect: "Cracking of ceramic, loss of vibration amplitude.",
        cascadeFailures: ["Loss of acoustic power"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });

    parts.push({
        name: "Acoustic Matching Horns",
        description: "Stepped titanium cylinders connecting the ceramics to the fluid.",
        material: "Titanium Alloy",
        function: "Amplifies the mechanical vibration amplitude from microns to millimeters.",
        assemblyOrder: 15,
        connections: ["Transducer Array", "Reactor Vessel"],
        failureEffect: "Fatigue fracture due to intense stress cycles.",
        cascadeFailures: ["Vessel breach if fractured at sealing flange"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    const description = "The Advanced Continuous-Flow Sonochemical Reactor is a cutting-edge industrial system utilizing multiple opposing high-power ultrasonic transducers. It induces severe acoustic cavitation within the process fluid, creating localized hotspots of 5000K and 1000 atm. This extreme environment is used to drive difficult chemical reactions, synthesize nanomaterials, and crack complex hydrocarbons at unprecedented rates.";
    
    const quizQuestions = [
        {
            question: "What phenomenon is primarily responsible for driving reactions in a sonochemical reactor?",
            options: ["Acoustic Cavitation", "Thermal Distillation", "Magnetic Resonance", "Photocatalysis"],
            correctAnswer: 0,
            explanation: "Acoustic cavitation is the rapid formation, growth, and symmetric collapse of micro-bubbles in a liquid, generating extreme localized temperatures and pressures."
        },
        {
            question: "Why are the ultrasonic transducers arranged in opposing pairs around the vessel?",
            options: ["To create a standing acoustic wave pattern", "To balance the weight", "To look symmetrical", "To reduce power consumption"],
            correctAnswer: 0,
            explanation: "Opposing transducers help set up standing waves and maximize the acoustic field density in the center of the reactor."
        },
        {
            question: "What is the purpose of the Acoustic Matching Horns?",
            options: ["To amplify mechanical vibration amplitude", "To generate electricity", "To cool the reactor", "To emit sound for operators"],
            correctAnswer: 0,
            explanation: "The stepped design of the titanium horns mechanically amplifies the microscopic vibrations of the piezoelectric ceramics into larger movements needed for cavitation."
        },
        {
            question: "Which component prevents thermal runaway from the exothermic sonochemical reactions?",
            options: ["Helical Cooling Jacket", "Back-Pressure Valve", "Control Cabinet", "PZT Ceramics"],
            correctAnswer: 0,
            explanation: "The Helical Cooling Jacket circulates chilled fluid around the reactor to remove excess heat and maintain bulk fluid temperature."
        },
        {
            question: "Why is a High-Pressure Pump necessary for this reactor?",
            options: ["To maintain high static pressure to optimize cavitation intensity", "To clean the pipes", "To overcome the weight of the fluid", "To cool the transducers"],
            correctAnswer: 0,
            explanation: "Maintaining a high static back-pressure (e.g., via pump and back-pressure valve) increases the intensity of the cavitation bubble collapse."
        }
    ];

    const animate = (time, speed, meshes) => {
        if(meshes.innerCore) {
            meshes.innerCore.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 10) * 1.0;
        }

        if(meshes.transducers) {
            meshes.transducers.forEach((t, i) => {
                t.position.y += Math.sin(time * speed * 60 + i) * 0.01;
            });
        }

        if(meshes.bubbles && meshes.bubbleData) {
            const dummy = new THREE.Object3D();
            meshes.bubbleData.forEach((data, i) => {
                data.y += data.speed * speed * 5;
                if (data.y > 3.5) data.y = -3.5;
                
                const pulse = Math.sin(time * speed * 40 + data.phase);
                let currentScale = data.scale;
                if (pulse > 0.8) {
                    currentScale = data.scale * 0.1;
                } else if (pulse < -0.8) {
                    currentScale = data.scale * 2.0;
                }

                dummy.position.set(data.x, data.y, data.z);
                dummy.scale.set(currentScale, currentScale, currentScale);
                dummy.updateMatrix();
                meshes.bubbles.setMatrixAt(i, dummy.matrix);
            });
            meshes.bubbles.instanceMatrix.needsUpdate = true;
        }

        if(meshes.gauges) {
            meshes.gauges.forEach((g, i) => {
                g.needle.rotation.z = Math.sin(time * speed * 20 + i) * 0.1 - 0.5;
            });
        }

        if(meshes.chillerFan) {
            meshes.chillerFan.rotation.y = time * speed * 10;
        }

        if(meshes.valveWheel) {
            meshes.valveWheel.rotation.z = Math.sin(time * speed * 0.5) * 0.5;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSonochemicalReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
