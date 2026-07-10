import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------
    // CUSTOM HIGH-TECH MATERIALS
    // -------------------------------------------------------------
    const pcbBoardMat = new THREE.MeshStandardMaterial({ color: 0x071a0d, roughness: 0.9, metalness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.2, metalness: 1.0 });
    const dielectricMat = new THREE.MeshPhysicalMaterial({ color: 0xccffff, transmission: 0.95, opacity: 1, transparent: true, metalness: 0.0, roughness: 0.05, ior: 1.6, thickness: 1.0 });
    const fieldE = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x0088ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, wireframe: true });
    const fieldH = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xcc0033, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, wireframe: true });
    const indexMat = new THREE.MeshStandardMaterial({ color: 0x5500ff, emissive: 0x3300cc, emissiveIntensity: 1.2, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.1 });
    const probeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.9 });
    const neonGlow = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 3.0, transparent: true, opacity: 0.9 });

    // -------------------------------------------------------------
    // 1. MULTI-LAYER DIELECTRIC SUBSTRATE
    // -------------------------------------------------------------
    const substrateGroup = new THREE.Group();
    
    // Core layer
    const coreGeom = new THREE.BoxGeometry(42, 1, 42);
    const core = new THREE.Mesh(coreGeom, pcbBoardMat);
    core.position.set(0, -0.5, 0);
    substrateGroup.add(core);

    // Ground plane (Bottom)
    const groundGeom = new THREE.BoxGeometry(42.2, 0.1, 42.2);
    const groundPlane = new THREE.Mesh(groundGeom, copper);
    groundPlane.position.set(0, -1.05, 0);
    substrateGroup.add(groundPlane);

    // Etched grid lines on top
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x224422, roughness: 0.8 });
    const gridGeom = new THREE.BoxGeometry(41, 0.05, 41);
    const grid = new THREE.Mesh(gridGeom, gridMat);
    grid.position.set(0, 0.025, 0);
    substrateGroup.add(grid);

    group.add(substrateGroup);
    meshes.substrate = substrateGroup;

    parts.push({
        name: "Multi-Layer PTFE Substrate",
        description: "A high-frequency polytetrafluoroethylene (PTFE) laminate base with a copper ground plane. Engineered for minimal dielectric loss at microwave frequencies.",
        material: "PTFE / Copper",
        function: "Provides the mechanical foundation and electromagnetic isolation for the metamaterial array.",
        assemblyOrder: 1,
        connections: ["Gold_Traces", "Dielectric_Posts", "Thermal_Dissipators"],
        failureEffect: "Structural collapse and array misalignment.",
        cascadeFailures: ["Array detuning", "Massive wave scattering"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // -------------------------------------------------------------
    // 2. ACTIVE CONTROL TRACES (GOLD)
    // -------------------------------------------------------------
    const tracesGroup = new THREE.Group();
    const traceGeomX = new THREE.BoxGeometry(40, 0.08, 0.15);
    const traceGeomZ = new THREE.BoxGeometry(0.15, 0.08, 40);
    
    for (let i = -19; i <= 19; i += 1.5) {
        const traceX = new THREE.Mesh(traceGeomX, goldMat);
        traceX.position.set(0, 0.08, i);
        tracesGroup.add(traceX);
        
        const traceZ = new THREE.Mesh(traceGeomZ, goldMat);
        traceZ.position.set(i, 0.08, 0);
        tracesGroup.add(traceZ);
    }
    group.add(tracesGroup);
    meshes.traces = tracesGroup;
    
    parts.push({
        name: "Microstrip Gold Traces",
        description: "Intricate grid of gold microstrip transmission lines for biasing and tuning the individual unit cells via the varactor diodes.",
        material: "24k Gold",
        function: "Delivers control voltages to varactor diodes and provides active impedance matching.",
        assemblyOrder: 2,
        connections: ["Substrate_Core", "Control_Unit"],
        failureEffect: "Loss of active tuning and impedance mismatch.",
        cascadeFailures: ["Signal reflection", "Resonator overloading"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // -------------------------------------------------------------
    // 3. THERMAL DISSIPATOR ARRAY
    // -------------------------------------------------------------
    const thermalGroup = new THREE.Group();
    const basePlateGeom = new THREE.BoxGeometry(40, 0.5, 40);
    const basePlate = new THREE.Mesh(basePlateGeom, aluminum);
    basePlate.position.set(0, -1.35, 0);
    thermalGroup.add(basePlate);

    const finGeom = new THREE.BoxGeometry(40, 3, 0.2);
    for (let i = -19; i <= 19; i += 1) {
        const fin = new THREE.Mesh(finGeom, darkSteel);
        fin.position.set(0, -3, i);
        thermalGroup.add(fin);
    }
    group.add(thermalGroup);
    meshes.thermal = thermalGroup;

    parts.push({
        name: "Microchannel Heat Sink",
        description: "Extruded dark-steel cooling fins mounted below the copper ground plane to dissipate heat generated by intense local electromagnetic field enhancement.",
        material: "Anodized Aluminum / Dark Steel",
        function: "Maintains absolute thermal stability to prevent thermal expansion from altering the microscopic geometry of the resonators.",
        assemblyOrder: 3,
        connections: ["Substrate_Core"],
        failureEffect: "Thermal runaway and melting of the substrate.",
        cascadeFailures: ["Catastrophic structural failure", "Plasma ignition"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // -------------------------------------------------------------
    // 4. METAMATERIAL UNIT CELLS (SRR + WIRES)
    // -------------------------------------------------------------
    const postsGroup = new THREE.Group();
    const outerGroup = new THREE.Group();
    const innerGroup = new THREE.Group();
    const varactorGroup = new THREE.Group();
    const wireGroup = new THREE.Group();
    const nodeGroup = new THREE.Group();

    // High detail geometries
    const postGeom = new THREE.CylinderGeometry(0.35, 0.45, 1.8, 32);
    const outerRingGeom = new THREE.TorusGeometry(1.6, 0.2, 32, 128, Math.PI * 1.85);
    const innerRingGeom = new THREE.TorusGeometry(1.0, 0.2, 32, 128, Math.PI * 1.85);
    const varactorGeom = new THREE.BoxGeometry(0.3, 0.5, 0.3);
    const wireGeom = new THREE.CylinderGeometry(0.08, 0.08, 7, 16);
    const nodeGeom = new THREE.SphereGeometry(0.15, 16, 16);

    const srrArray = [];
    const gridSize = 4.5;
    const limit = 18;

    for (let x = -limit; x <= limit; x += gridSize) {
        for (let z = -limit; z <= limit; z += gridSize) {
            
            // Dielectric Post
            const post = new THREE.Mesh(postGeom, dielectricMat);
            post.position.set(x, 1.0, z);
            postsGroup.add(post);

            // Outer Split Ring
            const outer = new THREE.Mesh(outerRingGeom, copper);
            outer.rotation.x = Math.PI / 2;
            outer.rotation.z = Math.PI / 8; // Gap angle offset
            outer.position.set(x, 2.0, z);
            outerGroup.add(outer);

            // Inner Split Ring
            const inner = new THREE.Mesh(innerRingGeom, copper);
            inner.rotation.x = Math.PI / 2;
            inner.rotation.z = Math.PI + Math.PI / 8; // Gap opposite
            inner.position.set(x, 2.0, z);
            innerGroup.add(inner);

            // Varactors inside the gaps
            const varOuter = new THREE.Mesh(varactorGeom, ceramicMat);
            varOuter.position.set(x + Math.sin(Math.PI/8)*1.6, 2.0, z + Math.cos(Math.PI/8)*1.6);
            varactorGroup.add(varOuter);

            const varInner = new THREE.Mesh(varactorGeom, ceramicMat);
            varInner.position.set(x - Math.sin(Math.PI/8)*1.0, 2.0, z - Math.cos(Math.PI/8)*1.0);
            varactorGroup.add(varInner);

            // Continuous Wire (for negative permittivity)
            const wire = new THREE.Mesh(wireGeom, copper);
            wire.position.set(x + 2.25, 3.5, z); // Offset between rings
            wireGroup.add(wire);

            // Field Nodes (glowing spheres for animation)
            const node = new THREE.Mesh(nodeGeom, neonGlow);
            node.position.set(x, 2.0, z);
            nodeGroup.add(node);

            srrArray.push({ outer, inner, node });
        }
    }
    
    group.add(postsGroup);
    group.add(outerGroup);
    group.add(innerGroup);
    group.add(varactorGroup);
    group.add(wireGroup);
    group.add(nodeGroup);
    
    meshes.srrArray = srrArray;
    meshes.nodeGroup = nodeGroup;

    parts.push({
        name: "Dielectric Support Pillars",
        description: "Low-permittivity optical-grade pillars that elevate the split-ring resonators above the substrate.",
        material: "Fused Quartz",
        function: "Mechanical elevation and electrical isolation of the SRRs to minimize parasitic capacitance with the ground plane.",
        assemblyOrder: 4,
        connections: ["Substrate_Core", "Outer_Resonators", "Inner_Resonators"],
        failureEffect: "Resonators shorting to the substrate traces.",
        cascadeFailures: ["Complete absorption of incident wave"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    parts.push({
        name: "Outer C-Resonators",
        description: "Massive copper C-shaped rings providing the primary inductive response for magnetic resonance.",
        material: "Oxygen-Free High-Conductivity Copper",
        function: "Couples with the magnetic field of the incident electromagnetic wave to produce a gigantic diamagnetic response, leading to negative permeability.",
        assemblyOrder: 5,
        connections: ["Dielectric_Support_Pillars", "Varactor_Diodes"],
        failureEffect: "Loss of negative permeability response.",
        cascadeFailures: ["Loss of negative refraction index", "Wave scattering"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    parts.push({
        name: "Inner Nested Resonators",
        description: "Smaller nested copper rings with gaps oriented 180 degrees from the outer rings.",
        material: "Oxygen-Free High-Conductivity Copper",
        function: "Lowers the resonance frequency and immensely enhances the magnetic response through strong distributed capacitive coupling with the outer ring.",
        assemblyOrder: 6,
        connections: ["Dielectric_Support_Pillars", "Varactor_Diodes"],
        failureEffect: "Shift in resonance frequency outside operational band.",
        cascadeFailures: ["Complete invisibility cloak failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    parts.push({
        name: "Continuous Plasma Wires",
        description: "A thick grid of continuous vertical copper wires intersecting the split rings spaces.",
        material: "Copper",
        function: "Provides a plasma-like macroscopic response to electric fields, yielding a negative effective permittivity below the plasma frequency.",
        assemblyOrder: 7,
        connections: ["Substrate_Core"],
        failureEffect: "Loss of negative permittivity.",
        cascadeFailures: ["Medium becomes highly reflective opaque metal to microwaves"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });

    // -------------------------------------------------------------
    // 5. MICROWAVE HORNS (INPUT/OUTPUT)
    // -------------------------------------------------------------
    const wgGroup = new THREE.Group();
    
    // Complex Horn Shape via Extrude
    const hornShape = new THREE.Shape();
    hornShape.moveTo(-5, -4);
    hornShape.lineTo(5, -4);
    hornShape.lineTo(7, 4);
    hornShape.lineTo(-7, 4);
    hornShape.lineTo(-5, -4);
    const extrudeSettings = { depth: 12, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    
    // Input Horn
    const wgInput = new THREE.Mesh(new THREE.ExtrudeGeometry(hornShape, extrudeSettings), chrome);
    wgInput.rotation.y = Math.PI / 2;
    wgInput.rotation.x = -Math.PI / 2;
    wgInput.position.set(-35, 4, 0);
    
    // Inner dark hole
    const holeGeom = new THREE.BoxGeometry(2, 6, 12);
    const wgHole = new THREE.Mesh(holeGeom, tinted);
    wgHole.position.set(-29, 4, 0);
    
    wgGroup.add(wgInput);
    wgGroup.add(wgHole);

    // Output Horn
    const wgOutput = new THREE.Mesh(new THREE.ExtrudeGeometry(hornShape, extrudeSettings), chrome);
    wgOutput.rotation.y = -Math.PI / 2;
    wgOutput.rotation.x = -Math.PI / 2;
    wgOutput.position.set(35, 4, 0);
    
    const wgOutHole = new THREE.Mesh(holeGeom, tinted);
    wgOutHole.position.set(29, 4, 0);
    
    wgGroup.add(wgOutput);
    wgGroup.add(wgOutHole);

    group.add(wgGroup);

    parts.push({
        name: "Phased Microwave Injector Horn",
        description: "A heavy chrome-plated pyramidal waveguide antenna that focuses the incident electromagnetic wave onto the metamaterial array.",
        material: "Chrome-plated Brass",
        function: "Injects the highly directional wave into the system, aligning the E-field parallel to the wires and the H-field perpendicular to the SRRs.",
        assemblyOrder: 8,
        connections: ["Substrate_Core", "Electric_Fields"],
        failureEffect: "No signal input.",
        cascadeFailures: ["System becomes completely inert"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 10, z: 0 }
    });

    // -------------------------------------------------------------
    // 6. ELECTROMAGNETIC FIELD VISUALIZATIONS
    // -------------------------------------------------------------
    const eFieldGroup = new THREE.Group();
    const wavesE = [];
    // Generating complex sine wave tubes
    for (let z = -12; z <= 12; z += 3) {
        const path = new THREE.Curve();
        path.getPoint = function(t) {
            const x = -30 + t * 60;
            const y = 4 + Math.sin(t * Math.PI * 12) * 2.5;
            return new THREE.Vector3(x, y, z);
        };
        const tubeGeom = new THREE.TubeGeometry(path, 150, 0.15, 12, false);
        const wave = new THREE.Mesh(tubeGeom, fieldE);
        eFieldGroup.add(wave);
        wavesE.push({ mesh: wave, zOffset: z });
    }
    group.add(eFieldGroup);
    meshes.wavesE = wavesE;

    const hFieldGroup = new THREE.Group();
    const wavesH = [];
    for (let y = 1; y <= 7; y += 2) {
        const path = new THREE.Curve();
        path.getPoint = function(t) {
            const x = -30 + t * 60;
            const z = Math.sin(t * Math.PI * 12) * 2.5;
            return new THREE.Vector3(x, y, z);
        };
        const tubeGeom = new THREE.TubeGeometry(path, 150, 0.15, 12, false);
        const wave = new THREE.Mesh(tubeGeom, fieldH);
        hFieldGroup.add(wave);
        wavesH.push({ mesh: wave, yOffset: y });
    }
    group.add(hFieldGroup);
    meshes.wavesH = wavesH;

    parts.push({
        name: "Electric Field Propagation Matrix",
        description: "Visualized oscillating high-intensity electric fields propagating longitudinally through the medium.",
        material: "Photon Plasma Simulation",
        function: "Interacts directly with the continuous copper wires to establish the negative permittivity state.",
        assemblyOrder: 9,
        connections: ["Microwave_Injector_Horn"],
        failureEffect: "N/A (Visualization)",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 55, z: 0 }
    });

    parts.push({
        name: "Magnetic Field Oscillation Matrix",
        description: "Visualized oscillating magnetic fields orthogonal to the E-field.",
        material: "Photon Plasma Simulation",
        function: "Pierces the split-ring resonators, inducing circulating currents that generate a macroscopic negative permeability.",
        assemblyOrder: 10,
        connections: ["Outer_C-Resonators"],
        failureEffect: "N/A (Visualization)",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 65, z: 0 }
    });

    // -------------------------------------------------------------
    // 7. NEGATIVE REFRACTION ZONE VOLUME
    // -------------------------------------------------------------
    const negRefGeom = new THREE.BoxGeometry(42, 8, 42);
    const negRefZone = new THREE.Mesh(negRefGeom, indexMat);
    negRefZone.position.set(0, 4, 0);
    group.add(negRefZone);
    meshes.negRefZone = negRefZone;

    parts.push({
        name: "Negative Index Medium Envelope",
        description: "The volumetric space where both permittivity and permeability drop below zero, forming the effective metamaterial phase.",
        material: "Quantum Vacuum Field Effect",
        function: "Exhibits reverse Snell's law, causing waves to bend backwards, propagating phase velocity opposite to group velocity.",
        assemblyOrder: 11,
        connections: ["Continuous_Plasma_Wires", "Outer_C-Resonators"],
        failureEffect: "Reverts to positive index.",
        cascadeFailures: ["Scattering", "Loss of Cloaking"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 75, z: 0 }
    });

    // -------------------------------------------------------------
    // 8. DIAGNOSTIC PROBE ARRAY
    // -------------------------------------------------------------
    const probeGroup = new THREE.Group();
    const probeTipGeom = new THREE.CylinderGeometry(0, 0.2, 1.5, 16);
    const probeBodyGeom = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
    
    for(let i = -15; i <= 15; i+=15) {
        const probe = new THREE.Group();
        const body = new THREE.Mesh(probeBodyGeom, probeMat);
        body.position.y = 5.5;
        const tip = new THREE.Mesh(probeTipGeom, chrome);
        tip.position.y = 1.5;
        probe.add(body);
        probe.add(tip);
        probe.position.set(i, 8, 22);
        probe.rotation.x = -Math.PI/6;
        probeGroup.add(probe);
    }
    group.add(probeGroup);

    parts.push({
        name: "Near-Field Diagnostic Probes",
        description: "Ultra-sensitive Tungsten-tipped RF probes positioned tightly above the array.",
        material: "Tungsten / Carbon Fiber",
        function: "Maps the local field enhancement, phase shifts, and resonance of individual unit cells in real-time.",
        assemblyOrder: 12,
        connections: ["Metamaterial_Array_Controller"],
        failureEffect: "Blind spots in diagnostic readings.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 25 }
    });

    // -------------------------------------------------------------
    // 9. HYPER-COMPLEX CONTROL UNIT
    // -------------------------------------------------------------
    const controlGroup = new THREE.Group();
    const chipGeom = new THREE.BoxGeometry(6, 0.8, 6);
    const chip = new THREE.Mesh(chipGeom, darkSteel);
    chip.position.set(0, 0, 26);
    controlGroup.add(chip);

    // Glowing logo/lines on chip
    const chipGlowGeom = new THREE.PlaneGeometry(4, 4);
    const chipGlow = new THREE.Mesh(chipGlowGeom, neonGlow);
    chipGlow.rotation.x = -Math.PI / 2;
    chipGlow.position.set(0, 0.41, 26);
    controlGroup.add(chipGlow);
    meshes.chipGlow = chipGlow;
    
    // Chip pins and routing
    const pinGeom = new THREE.BoxGeometry(0.2, 0.4, 2);
    for(let p = -2.5; p <= 2.5; p += 0.5) {
        const pin1 = new THREE.Mesh(pinGeom, chrome);
        pin1.position.set(p, 0, 23);
        controlGroup.add(pin1);
        const pin2 = new THREE.Mesh(pinGeom, chrome);
        pin2.position.set(p, 0, 29);
        controlGroup.add(pin2);
    }
    group.add(controlGroup);

    parts.push({
        name: "Metamaterial Array Controller (FPGA)",
        description: "High-speed Field Programmable Gate Array that dynamically biases the varactors to shift the refraction index.",
        material: "Silicon / Ceramic / Black Epoxy",
        function: "Calculates required phase shifts for cloaking or beam steering and adjusts thousands of unit cells independently.",
        assemblyOrder: 13,
        connections: ["Gold_Traces", "Near-Field_Diagnostic_Probes"],
        failureEffect: "Complete loss of active control.",
        cascadeFailures: ["Array defaults to a static passive state"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 35 }
    });


    // -------------------------------------------------------------
    // DESCRIPTION & QUIZ
    // -------------------------------------------------------------
    const description = "The Metamaterial Split-Ring Resonator (SRR) Array is an ultra-advanced synthetic medium designed to exhibit an effectively negative refractive index. By combining a dense array of continuous wires (providing negative permittivity) with microscopic split-ring resonators (providing negative permeability), the structure forces electromagnetic waves to bend in the opposite direction of standard Snell's Law. This immense control over microwave propagation is the foundational technology behind super-lenses, electromagnetic cloaking devices, and advanced phased-array antennas. The model features dynamically tuning varactor diodes, intense glowing field visualizations, microchannel heat sinks, and hyper-detailed multi-layer PCB substrates.";

    const quizQuestions = [
        {
            question: "What specific combination of properties gives this metamaterial a negative refractive index?",
            options: [
                "Negative permittivity and negative permeability",
                "Positive permittivity and negative permeability",
                "High density and low conductivity",
                "Superconductivity and zero resistance"
            ],
            correctAnswer: 0,
            explanation: "A negative index of refraction occurs when both the electric permittivity (epsilon) and the magnetic permeability (mu) are negative simultaneously. This is often called a left-handed medium."
        },
        {
            question: "What is the primary function of the C-shaped Split-Ring Resonators (SRRs)?",
            options: [
                "To provide an effective negative magnetic permeability",
                "To cool the substrate",
                "To increase the speed of light",
                "To convert microwaves to direct current"
            ],
            correctAnswer: 0,
            explanation: "The split rings act as microscopic LC circuits. When driven by an external magnetic field near their resonance frequency, they produce a strong opposing magnetic field, creating an effective negative permeability."
        },
        {
            question: "What component is responsible for providing the negative effective permittivity?",
            options: [
                "The Continuous Wire Array",
                "The Varactor Diodes",
                "The Substrate Core",
                "The Diagnostic Probes"
            ],
            correctAnswer: 0,
            explanation: "The array of continuous straight wires mimics the plasma-like behavior of metals at lower frequencies, yielding a negative permittivity for electric fields polarized parallel to the wires."
        },
        {
            question: "Why are the gaps in the inner and outer split rings placed on opposite sides?",
            options: [
                "To maximize the distributed capacitance between the rings",
                "To balance the weight of the rings",
                "To prevent electric shocks",
                "To make manufacturing easier"
            ],
            correctAnswer: 0,
            explanation: "Orienting the gaps oppositely maximizes the capacitive coupling between the inner and outer rings, which drastically lowers the resonance frequency while keeping the physical size of the unit cell small compared to the wavelength."
        },
        {
            question: "What phenomenon occurs inside a negative index medium when a wave enters at an angle?",
            options: [
                "Reverse Snell's Law (it bends to the same side of the normal)",
                "It accelerates to infinite speed",
                "It immediately converts to heat",
                "It freezes in place"
            ],
            correctAnswer: 0,
            explanation: "In a negative index medium, the refracted ray bends to the 'wrong' side of the normal (Reverse Snell's Law), enabling advanced optics like perfect lenses that can resolve features smaller than the diffraction limit."
        }
    ];

    // -------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------
    let phase = 0;
    
    function animate(time, speed, meshes) {
        phase += speed * 0.03;

        // Animate Electric Field Waves flowing left to right
        meshes.wavesE.forEach((waveObj, i) => {
            const wave = waveObj.mesh;
            const tOffset = (time * speed * 4) + (i * 0.5);
            wave.position.x = (tOffset % 60) - 30; // Reset loop
            // Pulsating emissive based on position
            wave.material.emissiveIntensity = 1.0 + Math.sin(phase * 4 + i) * 2.0;
        });

        // Animate Magnetic Field Waves
        meshes.wavesH.forEach((waveObj, i) => {
            const wave = waveObj.mesh;
            const tOffset = (time * speed * 4.1) + (i * 0.5);
            wave.position.x = (tOffset % 60) - 30;
            wave.material.emissiveIntensity = 1.0 + Math.cos(phase * 4 + i) * 2.0;
        });

        // Animate the SRR Arrays (simulating intense induced currents/resonance)
        meshes.srrArray.forEach((srr, i) => {
            const dist = Math.sqrt(srr.outer.position.x ** 2 + srr.outer.position.z ** 2);
            // Wave propagation effect over the array
            const wavePhase = phase * 10 - srr.outer.position.x * 0.5;
            const resonance = Math.sin(wavePhase);
            
            // Subtle high-frequency vibration due to strong fields
            const jitter = Math.random() * 0.05 * Math.abs(resonance);
            srr.outer.position.y = 2.0 + jitter;
            srr.inner.position.y = 2.0 - jitter;
            
            // Pulse the central node
            srr.node.material.emissiveIntensity = resonance > 0 ? resonance * 4.0 : 0.2;
            const s = 1.0 + resonance * 0.5;
            srr.node.scale.set(s, s, s);
            
            // Rotate the inner ring slightly to simulate torsional magnetic stress
            srr.inner.rotation.z = Math.PI + Math.PI / 8 + resonance * 0.1;
        });

        // Pulse the negative index envelope to represent effectively coupled state
        meshes.negRefZone.material.opacity = 0.3 + Math.sin(phase * 3) * 0.15;
        const scalePulse = 1 + Math.sin(phase * 5)*0.005;
        meshes.negRefZone.scale.set(scalePulse, scalePulse, scalePulse);
        
        // Blink the control chip glowing lines
        meshes.chipGlow.material.emissiveIntensity = (Math.sin(phase * 20) > 0) ? 3.0 : 0.5;
    }

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
export function createSplitRingResonatorArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
