import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // -------------------------------------------------------------------------
    // ANIMATION REGISTRY
    // -------------------------------------------------------------------------
    const animObjects = {
        grapheneDiaphragm: null,
        grapheneWireframe: null,
        squidCoils: [],
        junctionsGlow: [],
        photons: [],
        levitationRings: [],
        signalPulses: [],
        cryoFluids: [],
        magneticFluxLines: [],
        timeScale: 1.0,
        rippleOrigin: new THREE.Vector3(0, 0, 0),
        rippleTime: 0
    };

    // -------------------------------------------------------------------------
    // CUSTOM GOD-TIER MATERIALS
    // -------------------------------------------------------------------------
    const grapheneMat = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        metalness: 1.0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0x0044ff,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
    });

    const grapheneWireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const superconductorMat = new THREE.MeshStandardMaterial({
        color: 0xddeeff,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0x0055ff,
        emissiveIntensity: 0.5
    });

    const junctionMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xff3300,
        emissiveIntensity: 0.9
    });

    const liquidHeliumMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.95,
        opacity: 1.0,
        metalness: 0.1,
        roughness: 0.05,
        ior: 1.03,
        thickness: 0.5,
        emissive: 0x0088ff,
        emissiveIntensity: 0.1
    });

    const cryoVesselMat = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.5,
        envMapIntensity: 1.0
    });

    const fluxMat = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const photonMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending
    });

    // -------------------------------------------------------------------------
    // PROCEDURAL GEOMETRY GENERATION
    // -------------------------------------------------------------------------

    // 1. CRYOSTAT HOUSING
    function buildCryostatHousing() {
        const shellGroup = new THREE.Group();
        
        // Main Vessel using LatheGeometry for complex profile
        const points = [];
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const y = (t - 0.5) * 40;
            let r = 25;
            if (t < 0.1) r = 10 + t * 150;
            else if (t > 0.9) r = 10 + (1 - t) * 150;
            else r = 25 + Math.sin(t * Math.PI * 10) * 1.5;
            points.push(new THREE.Vector2(r, y));
        }
        const vesselGeo = new THREE.LatheGeometry(points, 64);
        const vessel = new THREE.Mesh(vesselGeo, darkSteel);
        shellGroup.add(vessel);

        // Add rivets around the rims
        const rivetGeo = new THREE.SphereGeometry(0.5, 8, 8);
        for(let j = 0; j < 36; j++) {
            const angle = (j / 36) * Math.PI * 2;
            const rx = Math.cos(angle) * 25.5;
            const rz = Math.sin(angle) * 25.5;
            
            const topRivet = new THREE.Mesh(rivetGeo, chrome);
            topRivet.position.set(rx, 15, rz);
            shellGroup.add(topRivet);

            const botRivet = new THREE.Mesh(rivetGeo, chrome);
            botRivet.position.set(rx, -15, rz);
            shellGroup.add(botRivet);
        }

        group.add(shellGroup);
        parts.push({
            name: "Outer Cryostat Shell",
            description: "Ultra-high vacuum insulated titanium-alloy vessel to maintain near absolute zero temperatures.",
            material: "Dark Steel / Titanium Alloy",
            function: "Isolates the quantum components from ambient thermal noise and electromagnetic interference.",
            assemblyOrder: 1,
            connections: ["Vacuum Chamber Enclosure", "Base Mounting Pedestal"],
            failureEffect: "Thermal breach, causing immediate decoherence of the superconducting arrays.",
            cascadeFailures: ["Liquid Helium Primary Loop", "SQUID Array"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 0 }
        });
    }

    // 2. LIQUID HELIUM COOLING PIPES
    function buildLiquidHeliumPipes() {
        const pipeGroup = new THREE.Group();
        
        // Complex routed tubes
        const curvePoints = [];
        for (let i = 0; i < 200; i++) {
            const angle = i * 0.2;
            const r = 20 + Math.sin(i * 0.1) * 3;
            const y = 18 - (i * 0.18);
            curvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const pipeGeo = new THREE.TubeGeometry(curve, 200, 0.8, 16, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        
        // Animated liquid flow inside pipe
        const fluidGeo = new THREE.TubeGeometry(curve, 200, 0.6, 16, false);
        const fluid = new THREE.Mesh(fluidGeo, liquidHeliumMat);
        
        animObjects.cryoFluids.push(fluid);

        pipeGroup.add(pipe);
        pipeGroup.add(fluid);
        group.add(pipeGroup);

        parts.push({
            name: "Liquid Helium Capillaries",
            description: "Micro-routed copper and niobium tubes circulating superfluid helium.",
            material: "Copper / Liquid Helium",
            function: "Extracts residual heat from the SQUID and graphene mounts.",
            assemblyOrder: 2,
            connections: ["Cryostat Thermal Shield", "Superconducting Magnetic Shield"],
            failureEffect: "Localized heating leading to Johnson-Nyquist noise spikes.",
            cascadeFailures: ["Josephson Junction Array"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -40 }
        });
    }

    // 3. MAGNETIC LEVITATION SUSPENSION
    function buildMagneticLevitation() {
        const levGroup = new THREE.Group();
        
        const ringGeo = new THREE.TorusGeometry(18, 1.5, 32, 64);
        
        const topRing = new THREE.Mesh(ringGeo, superconductorMat);
        topRing.position.y = 8;
        topRing.rotation.x = Math.PI / 2;
        levGroup.add(topRing);
        animObjects.levitationRings.push(topRing);

        const botRing = new THREE.Mesh(ringGeo, superconductorMat);
        botRing.position.y = -8;
        botRing.rotation.x = Math.PI / 2;
        levGroup.add(botRing);
        animObjects.levitationRings.push(botRing);

        // Add magnetic flux lines connecting them
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const lineGeo = new THREE.CylinderGeometry(0.1, 0.1, 16, 8);
            const line = new THREE.Mesh(lineGeo, fluxMat);
            line.position.set(Math.cos(angle) * 18, 0, Math.sin(angle) * 18);
            levGroup.add(line);
            animObjects.magneticFluxLines.push({ mesh: line, angle: angle });
        }

        group.add(levGroup);

        parts.push({
            name: "Magnetic Levitation Suspension",
            description: "Meissner effect based suspension using counter-rotating superconducting rings.",
            material: "Niobium-Titanium Superconductor",
            function: "Decouples the diaphragm from all physical seismic and acoustic interference from the chassis.",
            assemblyOrder: 3,
            connections: ["Outer Cryostat Shell", "Diaphragm Retaining Bezel"],
            failureEffect: "Physical contact with chassis, transferring massive acoustic interference.",
            cascadeFailures: ["Primary Graphene Monolayer"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -40, y: 0, z: 0 }
        });
    }

    // 4. GRAPHENE DIAPHRAGM
    function buildDiaphragm() {
        const diaphragmGroup = new THREE.Group();
        
        // Massive plane with extremely high segment count
        const planeGeo = new THREE.PlaneGeometry(30, 30, 64, 64);
        
        const grapheneLayer = new THREE.Mesh(planeGeo, grapheneMat);
        grapheneLayer.rotation.x = -Math.PI / 2;
        diaphragmGroup.add(grapheneLayer);
        animObjects.grapheneDiaphragm = grapheneLayer;

        const wireframeLayer = new THREE.Mesh(planeGeo, grapheneWireframeMat);
        wireframeLayer.rotation.x = -Math.PI / 2;
        wireframeLayer.position.y = 0.05;
        diaphragmGroup.add(wireframeLayer);
        animObjects.grapheneWireframe = wireframeLayer;

        // Bezel
        const bezelGeo = new THREE.TorusGeometry(16, 1, 32, 64);
        const bezel = new THREE.Mesh(bezelGeo, darkSteel);
        bezel.rotation.x = Math.PI / 2;
        diaphragmGroup.add(bezel);

        // Micro-tensioners
        const tensionerGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        for(let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const tensioner = new THREE.Mesh(tensionerGeo, chrome);
            tensioner.rotation.x = Math.PI / 2;
            tensioner.rotation.z = angle;
            tensioner.position.set(Math.cos(angle) * 15.5, 0, Math.sin(angle) * 15.5);
            diaphragmGroup.add(tensioner);
        }

        group.add(diaphragmGroup);

        parts.push({
            name: "Primary Graphene Monolayer",
            description: "Flawless atomic monolayer of Carbon arranged in a hexagonal lattice, suspended under immense tension.",
            material: "Graphene",
            function: "Acts as the ultimate acoustic receptor, sensitive to single phonon and photon momentum transfers.",
            assemblyOrder: 4,
            connections: ["Diaphragm Retaining Bezel", "SQUID Secondary Coupling Loop"],
            failureEffect: "Lattice tear, complete loss of acoustic detection capabilities.",
            cascadeFailures: ["Signal Pre-Amplifier Stage"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 30, z: 0 }
        });
    }

    // 5. SQUID VOICE COIL & ARRAY
    function buildSQUIDArray() {
        const squidGroup = new THREE.Group();
        
        // Massive stack of superconducting rings
        for (let i = 0; i < 20; i++) {
            const r = 5 - (i * 0.1);
            const coilGeo = new THREE.TorusGeometry(r, 0.15, 16, 64);
            const coil = new THREE.Mesh(coilGeo, superconductorMat);
            coil.rotation.x = Math.PI / 2;
            coil.position.y = -1 - (i * 0.4);
            squidGroup.add(coil);
            animObjects.squidCoils.push(coil);
        }

        // Josephson Junctions bridging the rings
        const junctionGeo = new THREE.BoxGeometry(0.6, 10, 0.6);
        for (let j = 0; j < 4; j++) {
            const angle = (j / 4) * Math.PI * 2;
            const junction = new THREE.Mesh(junctionGeo, junctionMat);
            junction.position.set(Math.cos(angle) * 4.5, -4.5, Math.sin(angle) * 4.5);
            squidGroup.add(junction);
            animObjects.junctionsGlow.push(junction);
        }

        // Central flux core
        const coreGeo = new THREE.CylinderGeometry(1, 1.5, 12, 32);
        const core = new THREE.Mesh(coreGeo, glass);
        core.position.y = -5;
        squidGroup.add(core);

        group.add(squidGroup);

        parts.push({
            name: "SQUID Inductive Coil Array",
            description: "Stacked loop array of Superconducting Quantum Interference Devices.",
            material: "Niobium / Aluminum Oxide",
            function: "Translates picometer-scale movements of the graphene lattice into macroscopic quantum phase shifts.",
            assemblyOrder: 5,
            connections: ["Josephson Junction Array Alpha", "Flux Transformer"],
            failureEffect: "Flux quantization failure, generating massive white noise.",
            cascadeFailures: ["Data Acquisition Interface"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -30, z: 0 }
        });
    }

    // 6. SIGNAL PROCESSING RIG
    function buildSignalProcessing() {
        const pcbGroup = new THREE.Group();
        pcbGroup.position.y = -15;

        // Base plate
        const boardGeo = new THREE.CylinderGeometry(14, 14, 1, 64);
        const board = new THREE.Mesh(boardGeo, plastic); // Using plastic as base, but we pretend it's a cryogenic PCB
        pcbGroup.add(board);

        // Hundreds of tiny chips and capacitors
        const chipGeo = new THREE.BoxGeometry(1, 0.5, 1);
        const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
        
        for (let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 2 + Math.random() * 11;
            
            if (Math.random() > 0.5) {
                const chip = new THREE.Mesh(chipGeo, darkSteel);
                chip.position.set(Math.cos(angle) * r, 0.5, Math.sin(angle) * r);
                chip.rotation.y = Math.random() * Math.PI;
                pcbGroup.add(chip);
            } else {
                const cap = new THREE.Mesh(capGeo, aluminum);
                cap.position.set(Math.cos(angle) * r, 0.4, Math.sin(angle) * r);
                pcbGroup.add(cap);
            }

            // Signal trace pulses
            if (Math.random() > 0.8) {
                const traceGeo = new THREE.BoxGeometry(0.1, 0.1, 2);
                const trace = new THREE.Mesh(traceGeo, junctionMat);
                trace.position.set(Math.cos(angle) * r, 0.6, Math.sin(angle) * r);
                trace.lookAt(0, 0.6, 0);
                pcbGroup.add(trace);
                animObjects.signalPulses.push({
                    mesh: trace,
                    dist: r,
                    angle: angle,
                    speed: 0.05 + Math.random() * 0.05
                });
            }
        }

        group.add(pcbGroup);

        parts.push({
            name: "Quantum Phase Pre-Amplifier",
            description: "Cryogenic high-electron-mobility transistor (HEMT) amplifier stage.",
            material: "Gallium Arsenide / Gold Traces",
            function: "Amplifies the extremely weak flux variations from the SQUID array before exiting the cryostat.",
            assemblyOrder: 6,
            connections: ["SQUID Secondary Coupling Loop", "Cryogenic Wiring Harness"],
            failureEffect: "Signal attenuation leading to total loss of data.",
            cascadeFailures: ["Feedback Control Actuator"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -50, z: 0 }
        });
    }

    // 7. PHOTON EMITTER (For visualization of acoustic impacts)
    function buildPhotonEmitter() {
        const emitterGroup = new THREE.Group();
        emitterGroup.position.set(0, 25, 0);

        const nozzleGeo = new THREE.CylinderGeometry(0.5, 2, 5, 16);
        const nozzle = new THREE.Mesh(nozzleGeo, steel);
        emitterGroup.add(nozzle);

        // Pre-create some photon meshes
        const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
        for(let i = 0; i < 5; i++) {
            const photon = new THREE.Mesh(sphereGeo, photonMat);
            photon.visible = false;
            emitterGroup.add(photon);
            animObjects.photons.push({
                mesh: photon,
                active: false,
                t: 0,
                target: new THREE.Vector3()
            });
        }

        group.add(emitterGroup);

        parts.push({
            name: "Optical Calibration Emitter",
            description: "Single-photon source used to apply known momentum impulses to the graphene diaphragm.",
            material: "Synthetic Ruby / Steel",
            function: "Provides a benchmark standard for absolute acoustic momentum calibration.",
            assemblyOrder: 7,
            connections: ["Outer Cryostat Shell", "Data Acquisition Interface"],
            failureEffect: "Loss of absolute calibration.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 30, y: 40, z: 0 }
        });
    }

    // Adding more parts just for exhaustive detail
    function generateExtraParts() {
        const extraNames = [
            "Thermal Grounding Strap", "Helium Vapor Exhaust", "Feedback Control Actuator",
            "Superconducting Magnetic Shield", "Vibration Isolation Dampers", "Acoustic Baffle Plate",
            "Josephson Junction Array Beta", "Flux Transformer", "Cryogenic Wiring Harness",
            "Data Acquisition Interface", "Structural Support Struts", "Vacuum Pump Flange"
        ];
        
        extraNames.forEach((name, idx) => {
            parts.push({
                name: name,
                description: `Auxiliary ultra-precision component required for maintaining the quantum coherent state of the system. Serial ID: ${Math.floor(Math.random() * 90000) + 10000}.`,
                material: ["Titanium", "Niobium", "Gold-plated Copper", "Teflon", "Vespel"][idx % 5],
                function: "Ensures systemic homeostasis against thermal, electromagnetic, and acoustic externalities.",
                assemblyOrder: 8 + idx,
                connections: ["Base Chassis", "Main Bus"],
                failureEffect: "Subtle introduction of noise, reducing sensitivity from single-atom to multi-atom thresholds.",
                cascadeFailures: [],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: Math.random() * 40 - 20, y: Math.random() * 40 - 20, z: Math.random() * 40 - 20 }
            });
        });
    }

    // Execute builder functions
    buildCryostatHousing();
    buildLiquidHeliumPipes();
    buildMagneticLevitation();
    buildDiaphragm();
    buildSQUIDArray();
    buildSignalProcessing();
    buildPhotonEmitter();
    generateExtraParts();

    // -------------------------------------------------------------------------
    // DESCRIPTION & QUIZ
    // -------------------------------------------------------------------------
    const description = "Ultra God Tier Dynamic Microphone Diaphragm. An unprecedented feat of quantum engineering, this sensor utilizes a suspended, atomically flawless graphene monolayer coupled to a massive array of Superconducting Quantum Interference Devices (SQUIDs). Housed within a near-absolute-zero liquid helium cryostat and magnetically levitated to isolate all macroscopic seismic noise, it possesses the astonishing capability to detect the acoustic pressure and momentum transfer of a single atom or photon bouncing off its surface. The subsequent sub-picometer deformation of the graphene alters the magnetic flux through the SQUID coils, generating a macroscopic cascade of quantum phase shifts detectable by the cryogenic HEMT amplifiers.";

    const quizQuestions = [
        {
            question: "What is the fundamental physical limitation preventing the exact simultaneous measurement of the graphene diaphragm's instantaneous position and its acoustic momentum?",
            options: [
                "The Meissner Effect",
                "The Standard Quantum Limit (derived from the Heisenberg Uncertainty Principle)",
                "The Johnson-Nyquist Thermal Noise",
                "The Casimir Effect"
            ],
            correctAnswer: 1,
            explanation: "At ultra-low temperatures, classical thermal noise is suppressed, and the sensitivity of the resonator is limited only by quantum mechanics. The Standard Quantum Limit dictates that continuous measurement of position inevitably disturbs the momentum, enforcing a fundamental noise floor on simultaneous measurements."
        },
        {
            question: "How does the SQUID array utilize the Josephson effect to achieve extreme electromechanical sensitivity?",
            options: [
                "By converting thermal phonons directly into photons via bremsstrahlung.",
                "By exploiting macroscopic quantum interference between parallel weak links in a superconducting loop.",
                "By inducing a massive static magnetic field that freezes the diaphragm.",
                "By acting as a classical step-up transformer with extremely high impedance."
            ],
            correctAnswer: 1,
            explanation: "A DC SQUID consists of two Josephson junctions in a superconducting loop. The maximum supercurrent that can flow through the loop is exquisitely sensitive to the magnetic flux threading it, due to the quantum interference of the macroscopic wavefunctions of the Cooper pairs. The vibrating diaphragm modifies this flux, allowing detection of infinitesimal displacements."
        },
        {
            question: "In this graphene-based nanomechanical resonator, what mechanism dominates acoustic dissipation (lowering the Q-factor) at ultra-low temperatures (< 100 mK)?",
            options: [
                "Viscous drag from the superfluid helium.",
                "Blackbody radiation pressure.",
                "Two-level system (TLS) defects and clamping losses at the bezel.",
                "Ohmic heating within the graphene lattice."
            ],
            correctAnswer: 2,
            explanation: "At millikelvin temperatures, intrinsic phonon-phonon scattering is negligible. The dominant sources of energy loss (dissipation) are typically tunneling between Two-Level Systems (TLS) in the surrounding dielectric/amorphous materials, and acoustic radiation (clamping losses) into the supports."
        },
        {
            question: "What specific role does the superfluid liquid helium play beyond simply lowering the temperature?",
            options: [
                "It serves as a massive dielectric to increase the capacitance of the SQUID.",
                "It acts as a neutron moderator to prevent cosmic ray interference.",
                "It suppresses thermal Johnson-Nyquist noise and minimizes phonon population, ensuring the graphene occupies its quantum ground state.",
                "It chemically bonds with the graphene to increase its tensile strength."
            ],
            correctAnswer: 2,
            explanation: "Cooling to near absolute zero drastically reduces the population of thermal phonons in the lattice and suppresses Johnson-Nyquist electronic noise in the circuits, allowing the zero-point fluctuations of the mechanical mode to become observable and keeping the system in its quantum ground state."
        },
        {
            question: "When a single photon or atom impacts the graphene lattice, how is the minute momentum transfer actually coupled to the SQUID voice coil?",
            options: [
                "Through direct mechanical friction turning a micro-gear.",
                "Electromechanical transduction via capacitive or inductive coupling which shifts the magnetic flux through the superconducting loop.",
                "By emitting a secondary positron that is captured by the SQUIDs.",
                "Through acoustic resonance matching the resonant frequency of the titanium housing."
            ],
            correctAnswer: 1,
            explanation: "The mechanical motion of the metalized or inherently conductive graphene diaphragm modulates a capacitance or inductance in an LC circuit coupled to the SQUID. This minute change shifts the magnetic flux threading the SQUID, drastically changing its critical current and generating a measurable voltage pulse."
        }
    ];

    // -------------------------------------------------------------------------
    // EXTREME ANIMATION LOGIC
    // -------------------------------------------------------------------------
    function animate(time, speed, meshes) {
        animObjects.timeScale = speed;
        const t = time * 0.001 * speed;

        // 1. Magnetic Levitation Rotation
        animObjects.levitationRings.forEach((ring, idx) => {
            // Counter-rotating
            ring.rotation.z = t * (idx === 0 ? 1 : -1) * 0.5;
        });

        // 2. Magnetic Flux Lines Pulse
        animObjects.magneticFluxLines.forEach(line => {
            line.mesh.scale.y = 1 + Math.sin(t * 5 + line.angle) * 0.2;
            line.mesh.material.opacity = 0.3 + Math.sin(t * 10 + line.angle) * 0.2;
        });

        // 3. Liquid Helium Flow
        animObjects.cryoFluids.forEach(fluid => {
            // Simulate flow by altering material mapping or opacity pulsing
            fluid.material.opacity = 0.7 + Math.sin(t * 8) * 0.3;
            fluid.material.emissiveIntensity = 0.1 + Math.sin(t * 4) * 0.1;
        });

        // 4. Photon Emission & Impact Logic
        // Randomly fire a photon
        if (Math.random() < 0.02 * speed) {
            const inactivePhoton = animObjects.photons.find(p => !p.active);
            if (inactivePhoton) {
                inactivePhoton.active = true;
                inactivePhoton.t = 0;
                // Target a random point on the diaphragm
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 14;
                inactivePhoton.target.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
                inactivePhoton.mesh.position.set(0, 25, 0); // Start at nozzle
                inactivePhoton.mesh.visible = true;
            }
        }

        animObjects.photons.forEach(photon => {
            if (photon.active) {
                photon.t += 0.05 * speed;
                
                // Interpolate from nozzle to target
                photon.mesh.position.lerpVectors(new THREE.Vector3(0, 25, 0), photon.target, photon.t);

                if (photon.t >= 1.0) {
                    // Impact!
                    photon.active = false;
                    photon.mesh.visible = false;
                    
                    // Trigger Ripple
                    animObjects.rippleOrigin.copy(photon.target);
                    animObjects.rippleTime = 0;

                    // Trigger Junction Flash
                    animObjects.junctionsGlow.forEach(j => {
                        j.material.emissiveIntensity = 2.0;
                    });
                }
            }
        });

        // 5. Graphene Diaphragm Ripple Mechanics (Vertex displacement)
        animObjects.rippleTime += 0.1 * speed;
        const maxR = 15;
        
        if (animObjects.grapheneDiaphragm) {
            const positionAttr = animObjects.grapheneDiaphragm.geometry.attributes.position;
            const wireAttr = animObjects.grapheneWireframe.geometry.attributes.position;
            
            for (let i = 0; i < positionAttr.count; i++) {
                const x = positionAttr.getX(i);
                const y = positionAttr.getY(i); // Note: plane is rotated, so 'y' is local 2D space
                
                // Distance from center
                const dCenter = Math.sqrt(x*x + y*y);
                
                // Distance from ripple origin
                const dx = x - animObjects.rippleOrigin.x;
                const dy = y - animObjects.rippleOrigin.z;
                const dRipple = Math.sqrt(dx*dx + dy*dy);

                let z = 0;

                // Base quantum zero-point fluctuations (high frequency, microscopic)
                z += Math.sin(x * 10 + t * 20) * 0.02;
                z += Math.cos(y * 10 + t * 25) * 0.02;

                // Propagating ripple from impact
                if (animObjects.rippleTime < 20) {
                    const wavePhase = (dRipple * 2) - (animObjects.rippleTime * 3);
                    const damping = Math.max(0, 1 - (animObjects.rippleTime / 20));
                    if (wavePhase < 0 && wavePhase > -Math.PI * 4) {
                        z += Math.sin(wavePhase) * damping * 0.5;
                    }
                }

                // Clamping at edges (bezel is at r=15)
                const edgeDamp = Math.max(0, 1 - (dCenter / 15));
                z *= edgeDamp;

                positionAttr.setZ(i, z);
                wireAttr.setZ(i, z);
            }
            positionAttr.needsUpdate = true;
            wireAttr.needsUpdate = true;
        }

        // 6. SQUID Coils Feedback Animation
        // The ripples cause the coils to expand/contract magnetically
        animObjects.squidCoils.forEach((coil, idx) => {
            const phase = t * 5 + (idx * 0.2);
            // Coupling effect from the ripple time
            const excitation = Math.max(0, 1 - (animObjects.rippleTime / 10));
            
            coil.scale.setScalar(1 + (Math.sin(phase) * 0.01) + (excitation * 0.05));
            coil.material.emissiveIntensity = 0.5 + (excitation * 1.5);
        });

        // 7. Junction Cool Down
        animObjects.junctionsGlow.forEach(j => {
            j.material.emissiveIntensity = THREE.MathUtils.lerp(j.material.emissiveIntensity, 0.9, 0.05 * speed);
        });

        // 8. Signal Processing Pulses
        animObjects.signalPulses.forEach(pulse => {
            // Move outwards along the PCB
            pulse.dist += pulse.speed * speed;
            if (pulse.dist > 14) {
                pulse.dist = 2; // reset to center
            }
            pulse.mesh.position.set(
                Math.cos(pulse.angle) * pulse.dist,
                0.6,
                Math.sin(pulse.angle) * pulse.dist
            );
            
            // Pulse intensity linked to recent impacts
            const excitation = Math.max(0, 1 - (animObjects.rippleTime / 5));
            pulse.mesh.scale.z = 1 + excitation * 3;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDynamicMicrophoneDiaphragm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
