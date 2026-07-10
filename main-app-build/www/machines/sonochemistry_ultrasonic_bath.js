import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Utility function to create glowing materials
    const createNeon = (color, intensity) => {
        return new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: intensity,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9
        });
    };

    const neonBlue = createNeon(0x00ffff, 2);
    const neonGreen = createNeon(0x00ff00, 2);
    const neonRed = createNeon(0xff0000, 1.5);
    const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x002244,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 0.8,
        transparent: true,
        roughness: 0.05,
        ior: 1.33,
        thickness: 2.0
    });

    const meshes = {};

    // 1. Main Tank Outer Shell (Complex Extruded Shape with Ribs)
    const shellShape = new THREE.Shape();
    shellShape.moveTo(-10, -5);
    shellShape.lineTo(10, -5);
    shellShape.bezierCurveTo(11, -5, 12, -4, 12, -3);
    shellShape.lineTo(12, 5);
    shellShape.bezierCurveTo(12, 6, 11, 7, 10, 7);
    shellShape.lineTo(-10, 7);
    shellShape.bezierCurveTo(-11, 7, -12, 6, -12, 5);
    shellShape.lineTo(-12, -3);
    shellShape.bezierCurveTo(-12, -4, -11, -5, -10, -5);
    
    const shellExtrudeSettings = { depth: 15, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const shellGeo = new THREE.ExtrudeGeometry(shellShape, shellExtrudeSettings);
    const shellMesh = new THREE.Mesh(shellGeo, darkSteel);
    shellMesh.position.set(0, 0, -7.5);
    // Create outer ribs for cooling/structural integrity
    for(let i=0; i<14; i++) {
        const ribGeo = new THREE.TorusGeometry(12.5, 0.4, 8, 50, Math.PI);
        const rib = new THREE.Mesh(ribGeo, steel);
        rib.rotation.x = Math.PI/2;
        rib.position.set(0, 1, -7 + i*1.1);
        shellMesh.add(rib);
    }
    group.add(shellMesh);
    meshes.shellMesh = shellMesh;
    parts.push({
        name: "Reinforced Outer Tank Shell",
        description: "Heavy-duty industrial housing made of reinforced dark steel, built to withstand immense acoustic vibrations and prevent structural fatigue.",
        material: "Dark Steel / Structural Steel",
        function: "Encloses the inner basin and houses internal components while providing structural rigidity.",
        assemblyOrder: 1,
        connections: ["Vibration Isolators", "Inner Basin", "Generator Enclosure"],
        failureEffect: "Structural resonance could lead to micro-fractures, fluid leakage, and complete system failure.",
        cascadeFailures: ["Vibration Isolators", "Inner Basin"],
        originalPosition: {x: 0, y: 0, z: -7.5},
        explodedPosition: {x: 0, y: -20, z: -7.5}
    });

    // 2. Inner Basin
    const basinShape = new THREE.Shape();
    basinShape.moveTo(-9.5, -4);
    basinShape.lineTo(9.5, -4);
    basinShape.bezierCurveTo(10, -4, 10.5, -3.5, 10.5, -3);
    basinShape.lineTo(10.5, 6.5);
    basinShape.lineTo(-10.5, 6.5);
    basinShape.lineTo(-10.5, -3);
    basinShape.bezierCurveTo(-10.5, -3.5, -10, -4, -9.5, -4);
    const basinExtrudeSettings = { depth: 14, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const basinGeo = new THREE.ExtrudeGeometry(basinShape, basinExtrudeSettings);
    const basinMesh = new THREE.Mesh(basinGeo, chrome); // highly polished inner surface for wave reflection
    basinMesh.position.set(0, 0.5, -7);
    group.add(basinMesh);
    parts.push({
        name: "Polished Inner Reflection Basin",
        description: "High-grade chromium-plated basin designed to maximize acoustic wave reflection and prevent cavitation-induced pitting.",
        material: "Chromium / Stainless Steel",
        function: "Holds the sonochemistry liquid medium and reflects high-frequency ultrasonic waves into the center.",
        assemblyOrder: 2,
        connections: ["Main Tank Outer Shell", "Transducer Array Base", "Liquid Medium"],
        failureEffect: "Pitting from cavitation can cause micro-leaks or reduce reflection efficiency, lowering cleaning power.",
        cascadeFailures: ["Liquid Medium", "Transducer Array Base"],
        originalPosition: {x: 0, y: 0.5, z: -7},
        explodedPosition: {x: 0, y: 20, z: -7}
    });

    // 3. Vibration Isolators (4x corners)
    const isolatorGeo = new THREE.CylinderGeometry(1.5, 1.8, 3, 32);
    const isolatorPositions = [ [-10, -6.5, -5], [10, -6.5, -5], [-10, -6.5, 5], [10, -6.5, 5] ];
    const isolatorGroup = new THREE.Group();
    isolatorPositions.forEach(pos => {
        const iso = new THREE.Mesh(isolatorGeo, rubber);
        iso.position.set(pos[0], pos[1], pos[2]);
        // add ridges
        for(let j=0; j<4; j++) {
            const ridge = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.3, 16, 32), darkSteel);
            ridge.rotation.x = Math.PI/2;
            ridge.position.set(0, -1 + j*0.6, 0);
            iso.add(ridge);
        }
        isolatorGroup.add(iso);
    });
    group.add(isolatorGroup);
    meshes.isolators = isolatorGroup;
    parts.push({
        name: "Heavy-Duty Vibration Isolators",
        description: "Elastomeric industrial mounts with steel reinforcing rings to decouple the ultrasonic tank from the surrounding environment.",
        material: "Industrial Rubber / Dark Steel",
        function: "Prevents high-frequency vibrations from destroying external supports or damaging the generator enclosure.",
        assemblyOrder: 3,
        connections: ["Main Tank Outer Shell", "Tank Support Frame"],
        failureEffect: "Excessive vibration transmitted to the facility, leading to component fatigue and noise hazards.",
        cascadeFailures: ["Tank Support Frame", "Generator Enclosure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -40, z: 0}
    });

    // 4. Tank Support Frame
    const frameGroup = new THREE.Group();
    const frameGeo = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-11, -8, -6), new THREE.Vector3(11, -8, -6)), 20, 0.8, 16, false);
    const frame1 = new THREE.Mesh(frameGeo, steel);
    const frameGeo2 = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-11, -8, 6), new THREE.Vector3(11, -8, 6)), 20, 0.8, 16, false);
    const frame2 = new THREE.Mesh(frameGeo2, steel);
    const frameGeo3 = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-11, -8, -6), new THREE.Vector3(-11, -8, 6)), 20, 0.8, 16, false);
    const frame3 = new THREE.Mesh(frameGeo3, steel);
    const frameGeo4 = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(11, -8, -6), new THREE.Vector3(11, -8, 6)), 20, 0.8, 16, false);
    const frame4 = new THREE.Mesh(frameGeo4, steel);
    frameGroup.add(frame1, frame2, frame3, frame4);
    // add legs
    for(let pos of isolatorPositions) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5, 16), steel);
        leg.position.set(pos[0], -10.5, pos[2]);
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), aluminum);
        foot.position.set(0, -2.5, 0);
        leg.add(foot);
        frameGroup.add(leg);
    }
    group.add(frameGroup);
    parts.push({
        name: "Tubular Steel Support Frame",
        description: "A rigidly welded tubular steel chassis providing a stable foundation for the massive fluid tank.",
        material: "Steel / Aluminum",
        function: "Supports the entire weight of the tank, fluid, and generated dynamic loads.",
        assemblyOrder: 4,
        connections: ["Vibration Isolators", "Ground"],
        failureEffect: "Structural collapse of the system under heavy fluid load.",
        cascadeFailures: ["Main Tank Outer Shell", "Liquid Medium"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -60, z: 0}
    });

    // 5. Transducer Array Base
    const transducerBase = new THREE.Group();
    const tBaseGeo = new THREE.BoxGeometry(18, 1, 12);
    const tBaseMesh = new THREE.Mesh(tBaseGeo, copper);
    tBaseMesh.position.set(0, -4.5, 0);
    transducerBase.add(tBaseMesh);
    
    // 6. Piezoelectric Crystals / Transducers
    const piezoGroup = new THREE.Group();
    const pGeo = new THREE.CylinderGeometry(0.8, 1, 1.5, 8); // octagonal piezo elements
    const pTopGeo = new THREE.CylinderGeometry(0.4, 0.8, 1, 16);
    
    const transducerMeshes = [];
    for(let x = -8; x <= 8; x += 2.5) {
        for(let z = -5; z <= 5; z += 2.5) {
            const piezoBase = new THREE.Mesh(pGeo, ceramic_like_material());
            piezoBase.position.set(x, 0.75, z);
            
            const piezoTop = new THREE.Mesh(pTopGeo, aluminum);
            piezoTop.position.set(0, 1.25, 0);
            piezoBase.add(piezoTop);
            
            const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.1, 8, 16), neonBlue);
            glowRing.rotation.x = Math.PI/2;
            glowRing.position.set(0, 0, 0);
            piezoBase.add(glowRing);

            piezoGroup.add(piezoBase);
            transducerMeshes.push({ mesh: piezoBase, ring: glowRing, origY: 0.75 });
        }
    }
    tBaseMesh.add(piezoGroup);
    group.add(transducerBase);
    meshes.transducers = transducerMeshes;
    parts.push({
        name: "Piezoelectric Transducer Array",
        description: "A dense matrix of high-power piezoelectric ceramic elements bonded to an acoustic transmission plate.",
        material: "PZT Ceramic / Aluminum / Copper",
        function: "Converts high-frequency electrical energy into immense mechanical vibrations (ultrasonic waves).",
        assemblyOrder: 5,
        connections: ["Transducer Array Base", "Power Cables", "Generator Enclosure"],
        failureEffect: "Loss of acoustic field generation resulting in zero cavitation and failed cleaning/reaction processes.",
        cascadeFailures: ["Liquid Medium", "Cavitation Bubbles"],
        originalPosition: {x: 0, y: -4.5, z: 0},
        explodedPosition: {x: 0, y: -25, z: 0}
    });

    // 7. Generator Enclosure
    const generatorBox = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 8), steel);
    generatorBox.position.set(16, -2, 0);
    
    // Cooling Fins on Generator
    for(let f = -3; f <= 3; f += 0.5) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 7.5), aluminum);
        fin.position.set(0, f, 0);
        generatorBox.add(fin);
    }
    const genCap = new THREE.Mesh(new THREE.BoxGeometry(10.2, 8.2, 1), darkSteel);
    genCap.position.set(0, 0, 4);
    generatorBox.add(genCap);

    group.add(generatorBox);
    parts.push({
        name: "High-Frequency Ultrasonic Generator",
        description: "Industrial solid-state power supply delivering precise high-frequency alternating current to the transducer array.",
        material: "Steel / Aluminum",
        function: "Provides power and modulates frequency (e.g., 20kHz - 100kHz) for optimal cavitation.",
        assemblyOrder: 6,
        connections: ["Power Cables", "Transducer Array Base", "Control Panel Screen"],
        failureEffect: "Complete system shutdown; electrical shorting or overheating.",
        cascadeFailures: ["Piezoelectric Transducer Array", "Power Cables"],
        originalPosition: {x: 16, y: -2, z: 0},
        explodedPosition: {x: 40, y: -2, z: 0}
    });

    // 8. Control Panel Screen
    const controlPanel = new THREE.Group();
    const panelBase = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 0.5), plastic);
    panelBase.rotation.y = -Math.PI/6;
    panelBase.rotation.x = -Math.PI/8;
    panelBase.position.set(16, 6, 5);
    
    const screenGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const screenMesh = new THREE.Mesh(screenGeo, neonGreen);
    screenMesh.position.set(0, 1, 0.26);
    panelBase.add(screenMesh);
    
    // 9. Dials and Buttons
    for(let i=0; i<3; i++) {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), aluminum);
        knob.rotation.x = Math.PI/2;
        knob.position.set(-1 + i*1.0, -1.5, 0.25);
        const indicator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.45), neonRed);
        indicator.position.set(0, 0.1, 0);
        knob.add(indicator);
        panelBase.add(knob);
        meshes['knob'+i] = knob;
    }
    controlPanel.add(panelBase);
    group.add(controlPanel);
    parts.push({
        name: "HMI Control & Monitoring Interface",
        description: "Advanced Human-Machine Interface with real-time waveform display, frequency modulation dials, and status indicators.",
        material: "Plastic / Glass / Electronics",
        function: "Allows operators to tune acoustic parameters, set timers, and monitor system health.",
        assemblyOrder: 7,
        connections: ["High-Frequency Ultrasonic Generator"],
        failureEffect: "Inability to control frequency, potentially causing resonant destruction of the tank.",
        cascadeFailures: ["High-Frequency Ultrasonic Generator"],
        originalPosition: {x: 16, y: 6, z: 5},
        explodedPosition: {x: 40, y: 20, z: 10}
    });

    // 10. Liquid Medium
    const liquidGeo = new THREE.PlaneGeometry(18.5, 12.5, 64, 64);
    const liquidMesh = new THREE.Mesh(liquidGeo, waterMat);
    liquidMesh.rotation.x = -Math.PI/2;
    liquidMesh.position.set(0, 5, 0);
    group.add(liquidMesh);
    meshes.liquid = liquidMesh;
    parts.push({
        name: "Sonochemical Fluid Medium",
        description: "A specialized aqueous or solvent-based liquid optimized for acoustic cavitation and chemical reactivity.",
        material: "Complex Fluidic Material",
        function: "Acts as the propagation medium for ultrasonic waves and the site of imploding cavitation bubbles.",
        assemblyOrder: 8,
        connections: ["Inner Basin", "Cavitation Bubbles", "Heating Elements"],
        failureEffect: "Without fluid, ultrasonic energy reflects back into transducers, melting them instantly.",
        cascadeFailures: ["Piezoelectric Transducer Array"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // 11. Cavitation Bubbles
    const bubblesGroup = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.8
    });
    
    const bubbles = [];
    for(let i=0; i<300; i++) {
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        const x = (Math.random() - 0.5) * 17;
        const y = Math.random() * 8 - 3;
        const z = (Math.random() - 0.5) * 11;
        bubble.position.set(x, y, z);
        
        // Randomize initial scale and phase
        const phase = Math.random() * Math.PI * 2;
        bubbles.push({ mesh: bubble, x, y, z, phase });
        bubblesGroup.add(bubble);
    }
    group.add(bubblesGroup);
    meshes.bubbles = bubbles;
    parts.push({
        name: "Transient Cavitation Bubbles",
        description: "Microscopic vacuum bubbles that rapidly form and violently implode, generating extreme local temperatures (up to 5000K) and pressures.",
        material: "Vacuum / Plasma",
        function: "Performs the mechanical scrubbing or initiates sonochemical reactions upon implosion.",
        assemblyOrder: 9,
        connections: ["Sonochemical Fluid Medium", "Acoustic Wave Visualizers"],
        failureEffect: "Lack of cavitation means no cleaning or chemical reaction occurs.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // 12. Heating Elements
    const heaterGroup = new THREE.Group();
    const heaterMat = new THREE.MeshStandardMaterial({ color: 0x333333, emissive: 0xff2200, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.4 });
    const heaterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, -3.8, -4),
        new THREE.Vector3(8, -3.8, -4),
        new THREE.Vector3(8, -3.8, -2),
        new THREE.Vector3(-8, -3.8, -2),
        new THREE.Vector3(-8, -3.8, 0),
        new THREE.Vector3(8, -3.8, 0),
        new THREE.Vector3(8, -3.8, 2),
        new THREE.Vector3(-8, -3.8, 2),
        new THREE.Vector3(-8, -3.8, 4),
        new THREE.Vector3(8, -3.8, 4)
    ]);
    const heaterGeo = new THREE.TubeGeometry(heaterCurve, 100, 0.3, 16, false);
    const heaterMesh = new THREE.Mesh(heaterGeo, heaterMat);
    heaterGroup.add(heaterMesh);
    group.add(heaterGroup);
    meshes.heater = heaterMesh;
    parts.push({
        name: "Incoloy Immersion Heaters",
        description: "Serpentine heating elements laid across the tank bottom to pre-heat the solvent, lowering viscosity and enhancing cavitation.",
        material: "Incoloy / Tungsten Wire",
        function: "Maintains optimal temperature for the sonochemical process.",
        assemblyOrder: 10,
        connections: ["Inner Basin", "Sonochemical Fluid Medium"],
        failureEffect: "Sub-optimal fluid temperature leading to weak cavitation fields and poor process yield.",
        cascadeFailures: ["Cavitation Bubbles"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 13. Fluid Inlet/Outlet Valves
    const valveGroup = new THREE.Group();
    const pipeGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 16);
    const pipeMesh1 = new THREE.Mesh(pipeGeo, steel);
    pipeMesh1.rotation.z = Math.PI/2;
    pipeMesh1.position.set(-11, -2, -2);
    
    const valveBodyGeo = new THREE.SphereGeometry(1, 16, 16);
    const valveBody = new THREE.Mesh(valveBodyGeo, copper);
    valveBody.position.set(-13, -2, -2);
    
    const handleGeo = new THREE.TorusGeometry(0.8, 0.2, 8, 16);
    const handle = new THREE.Mesh(handleGeo, neonRed);
    handle.rotation.x = Math.PI/2;
    handle.position.set(-13, -1, -2);
    
    valveGroup.add(pipeMesh1, valveBody, handle);
    group.add(valveGroup);
    meshes.valveHandle = handle;
    parts.push({
        name: "High-Flow Hydraulic Valves",
        description: "Industrial copper and steel ball valves equipped with electronic actuators for precise fluid regulation.",
        material: "Copper / Steel / Rubber",
        function: "Controls the flow of solvent into and out of the tank.",
        assemblyOrder: 11,
        connections: ["Inner Basin", "Sonochemical Fluid Medium"],
        failureEffect: "Leakage of potentially hazardous or extremely hot solvents into the surrounding area.",
        cascadeFailures: ["Sonochemical Fluid Medium"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: -2, z: 0}
    });

    // 14. Power Cables
    const cableCurve1 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(11, -4.5, 0),
        new THREE.Vector3(13, -6, 0),
        new THREE.Vector3(16, -2, 0)
    );
    const cableGeo1 = new THREE.TubeGeometry(cableCurve1, 32, 0.4, 12, false);
    const cableMesh1 = new THREE.Mesh(cableGeo1, rubber);
    
    const cableCurve2 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(11, -4.5, 2),
        new THREE.Vector3(13, -7, 2),
        new THREE.Vector3(16, -2, 2)
    );
    const cableGeo2 = new THREE.TubeGeometry(cableCurve2, 32, 0.4, 12, false);
    const cableMesh2 = new THREE.Mesh(cableGeo2, rubber);
    
    group.add(cableMesh1, cableMesh2);
    parts.push({
        name: "Armored High-Voltage Cables",
        description: "Thick, multi-shielded cables transmitting high-frequency AC power while minimizing electromagnetic interference (EMI).",
        material: "Copper Wire / Synthetic Rubber / Kevlar Shielding",
        function: "Transmits gigawatts of peak electrical power from the generator to the transducer array.",
        assemblyOrder: 12,
        connections: ["High-Frequency Ultrasonic Generator", "Piezoelectric Transducer Array"],
        failureEffect: "Catastrophic electrical arcing, massive EMI emission, and generator meltdown.",
        cascadeFailures: ["High-Frequency Ultrasonic Generator"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: -20, z: 10}
    });

    // 15. Tank Lid
    const lidGroup = new THREE.Group();
    const lidFrameShape = new THREE.Shape();
    lidFrameShape.moveTo(-11, -7.5);
    lidFrameShape.lineTo(11, -7.5);
    lidFrameShape.lineTo(11, 7.5);
    lidFrameShape.lineTo(-11, 7.5);
    lidFrameShape.lineTo(-11, -7.5);
    // Cutout for glass
    const holePath = new THREE.Path();
    holePath.moveTo(-9, -5.5);
    holePath.lineTo(9, -5.5);
    holePath.lineTo(9, 5.5);
    holePath.lineTo(-9, 5.5);
    holePath.lineTo(-9, -5.5);
    lidFrameShape.holes.push(holePath);

    const lidExtrude = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const lidFrame = new THREE.Mesh(new THREE.ExtrudeGeometry(lidFrameShape, lidExtrude), darkSteel);
    lidFrame.rotation.x = -Math.PI/2;
    lidFrame.position.set(0, 7.5, -7.5);
    lidGroup.add(lidFrame);

    const glassGeo = new THREE.BoxGeometry(18, 0.2, 11);
    const glassMesh = new THREE.Mesh(glassGeo, tinted);
    glassMesh.position.set(0, 7.75, 0);
    lidGroup.add(glassMesh);

    // Hinge
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 16, 16), steel);
    hinge.rotation.z = Math.PI/2;
    hinge.position.set(0, 7.5, -7.5);
    lidGroup.add(hinge);

    group.add(lidGroup);
    meshes.lid = lidGroup;
    parts.push({
        name: "Acoustic Shielding Lid & Viewport",
        description: "Heavy acoustic dampening lid with a multi-pane tinted quartz viewport to safely observe sonochemical reactions.",
        material: "Dark Steel / Tinted Quartz Glass",
        function: "Contains vaporized solvents, blocks harmful high-frequency noise, and prevents splash-out.",
        assemblyOrder: 13,
        connections: ["Main Tank Outer Shell", "Safety Interlock Sensors"],
        failureEffect: "Operator exposure to intense acoustic radiation and toxic solvent vapors.",
        cascadeFailures: ["Safety Interlock Sensors"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 30, z: -15}
    });

    // 16. Safety Interlock Sensors
    const sensorGroup = new THREE.Group();
    const sensorGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const s1 = new THREE.Mesh(sensorGeo, neonGreen);
    s1.position.set(-10.5, 7.5, 7);
    const s2 = new THREE.Mesh(sensorGeo, neonGreen);
    s2.position.set(10.5, 7.5, 7);
    sensorGroup.add(s1, s2);
    group.add(sensorGroup);
    meshes.sensors = [s1, s2];
    parts.push({
        name: "Optical Safety Interlocks",
        description: "High-precision laser limit switches that detect if the lid is securely closed.",
        material: "Polycarbonate / Electronics",
        function: "Instantly kills transducer power if the lid is opened, preventing acoustic injuries.",
        assemblyOrder: 14,
        connections: ["Acoustic Shielding Lid & Viewport", "High-Frequency Ultrasonic Generator"],
        failureEffect: "System may operate with lid open, causing severe acoustic trauma.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 25, z: 15}
    });

    // 17. Acoustic Wave Visualizers
    const waveGroup = new THREE.Group();
    const waveGeo = new THREE.TorusGeometry(8, 0.5, 16, 64);
    const waveMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 4,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const waves = [];
    for(let i=0; i<5; i++) {
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.rotation.x = Math.PI/2;
        wave.position.set(0, -3 + i*2, 0);
        waveGroup.add(wave);
        waves.push({ mesh: wave, baseY: -3, offset: i*2 });
    }
    group.add(waveGroup);
    meshes.waves = waves;
    parts.push({
        name: "Acoustic Standing Wave Fields",
        description: "Visual representation of the intense longitudinal sound waves propagating through the fluid medium.",
        material: "Energy / Photonic Emission",
        function: "Creates alternating high and low pressure zones, tearing the liquid apart to form cavitation bubbles.",
        assemblyOrder: 15,
        connections: ["Sonochemical Fluid Medium", "Cavitation Bubbles", "Piezoelectric Transducer Array"],
        failureEffect: "Wave disruption (e.g., from improper fluid level) leads to destructive interference and localized cold spots.",
        cascadeFailures: ["Cavitation Bubbles"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 60, z: 0}
    });


    // Helper for piezo material
    function ceramic_like_material() {
        return new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.7,
            metalness: 0.1
        });
    }

    const description = "The UltraSonic Sonochemical Reactor is a colossal, high-tech industrial bath designed to harness the extreme physical phenomena of acoustic cavitation. By pumping gigawatts of high-frequency power through a dense matrix of piezoelectric transducers, this machine creates standing ultrasonic waves that tear the liquid medium apart. The resulting micro-bubbles implode with forces akin to the surface of the sun, driving complex chemical reactions and stripping molecular contaminants from parts. It features heavy-duty vibration isolation, high-flow hydraulics, optical safety interlocks, and a glowing array of real-time monitoring instruments.";

    const quizQuestions = [
        {
            question: "What extremely violent phenomenon is generated by the Acoustic Standing Wave Fields tearing the fluid apart?",
            options: ["Acoustic Cavitation", "Thermal Radiation", "Magnetic Resonance", "Nuclear Fusion"],
            correctAnswer: 0,
            explanation: "Ultrasonic waves create alternating high and low pressure cycles. During low pressure, microscopic bubbles form. In high pressure, they violently implode—a process called cavitation."
        },
        {
            question: "Which component converts high-frequency AC electrical energy directly into mechanical vibrations?",
            options: ["Incoloy Immersion Heaters", "Piezoelectric Transducer Array", "High-Flow Hydraulic Valves", "Optical Safety Interlocks"],
            correctAnswer: 1,
            explanation: "Piezoelectric ceramics change shape rapidly when an alternating electrical voltage is applied, thus generating the mechanical sound waves."
        },
        {
            question: "Why is the Acoustic Shielding Lid equipped with safety interlocks?",
            options: ["To keep the fluid cold", "To prevent operator exposure to intense acoustic radiation and toxic vapors", "To increase cavitation pressure", "To look futuristic"],
            correctAnswer: 1,
            explanation: "Industrial ultrasonic baths generate intense, potentially harmful acoustic energy and can vaporize hazardous solvents. The interlocks cut power if the lid opens."
        },
        {
            question: "What is the function of the Heavy-Duty Vibration Isolators?",
            options: ["To amplify the sound waves", "To decouple the machine from the floor, preventing structural damage to the facility", "To power the control panel", "To heat the fluid"],
            correctAnswer: 1,
            explanation: "The massive mechanical vibrations created by the transducers could cause structural fatigue to surrounding infrastructure if not properly isolated using rubber and steel mounts."
        },
        {
            question: "What happens if the Sonochemical Fluid Medium drains completely while the generators are active?",
            options: ["The machine cleans itself", "Ultrasonic energy reflects back into the transducers, causing catastrophic melting", "The cavitation bubbles become larger", "The heaters freeze"],
            correctAnswer: 1,
            explanation: "Without a medium to propagate into, the acoustic energy has nowhere to go. It reflects back into the piezoelectric crystals, turning into heat and melting them."
        }
    ];

    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        // Liquid surface displacement (waves)
        if (meshes.liquid) {
            const positions = meshes.liquid.geometry.attributes.position;
            for(let i=0; i<positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i); // Since plane is rotated, Y is actually Z in local space
                // Create complex standing wave interference pattern
                const z = Math.sin(x * 1.5 + t * 5) * 0.15 + Math.cos(y * 1.5 - t * 4) * 0.15;
                positions.setZ(i, z);
            }
            positions.needsUpdate = true;
            // Pulsing emission
            meshes.liquid.material.emissiveIntensity = 0.5 + Math.sin(t * 10) * 0.3;
        }

        // Cavitation bubbles behavior
        if (meshes.bubbles) {
            meshes.bubbles.forEach(b => {
                // Rapidly grow and then instantly collapse (implode)
                const cycle = (t * 4 + b.phase) % Math.PI;
                let scale = 1;
                if (cycle < 2.5) {
                    scale = 0.1 + (cycle / 2.5) * 1.5; // Grow
                    b.mesh.material.emissiveIntensity = 1;
                } else {
                    scale = 0.01; // Implode violently
                    b.mesh.material.emissiveIntensity = 10; // Flash upon implosion
                }
                b.mesh.scale.set(scale, scale, scale);
                
                // Float upwards slowly
                b.mesh.position.y = b.y + Math.sin(t*2 + b.phase)*0.5;
            });
        }

        // Acoustic Wave Visualizers pulsating upwards
        if (meshes.waves) {
            meshes.waves.forEach((w, index) => {
                // Move up
                w.mesh.position.y = w.baseY + ((t * 4 + w.offset) % 10);
                // Fade out at top
                const heightProg = (w.mesh.position.y - w.baseY) / 10;
                w.mesh.material.opacity = (1 - heightProg) * 0.6;
                // Scale expands slightly
                const s = 1 + heightProg * 0.2;
                w.mesh.scale.set(s, 1, s);
            });
        }

        // Transducers pulsating
        if (meshes.transducers) {
            meshes.transducers.forEach((tr, index) => {
                // Micro vibrations
                tr.mesh.position.y = tr.origY + Math.sin(t * 50 + index)*0.02;
                // Ring pulsing
                tr.ring.material.emissiveIntensity = 2 + Math.sin(t * 20 + index)*2;
            });
        }

        // Control Panel Knobs rotating slightly
        for(let i=0; i<3; i++) {
            if(meshes['knob'+i]) {
                meshes['knob'+i].rotation.y = Math.sin(t * 2 + i)*0.5;
            }
        }

        // Heater pulsing
        if (meshes.heater) {
            meshes.heater.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3;
        }

        // Valve handle vibrates slightly
        if (meshes.valveHandle) {
            meshes.valveHandle.rotation.y = Math.sin(t * 30) * 0.05;
        }

        // Interlock sensors blinking
        if (meshes.sensors) {
            const blink = (t % 2 < 0.1) ? 5 : 1;
            meshes.sensors[0].material.emissiveIntensity = blink;
            meshes.sensors[1].material.emissiveIntensity = blink;
        }
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createUltrasonicBath() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
