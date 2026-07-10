import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshesToAnimate = {
        rotators: [],
        pistons: [],
        oscillators: [],
        particleSystems: [],
        energyCores: [],
        lights: []
    };

    // --- CUSTOM MATERIALS FOR GOD TIER MACHINE ---
    const falseVacuumMat = new THREE.MeshPhysicalMaterial({
        color: 0x050510,
        emissive: 0x220044,
        emissiveIntensity: 0.8,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 2.5
    });

    const symmetryBreakerMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3,
        wireframe: true
    });

    const monopoleMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff4444,
        emissiveIntensity: 5
    });

    const stringMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 4,
        roughness: 0.0
    });

    const glowingPanel = new THREE.MeshStandardMaterial({
        color: 0x002200,
        emissive: 0x00ff00,
        emissiveIntensity: 1
    });

    const cryogenicIceMat = new THREE.MeshPhysicalMaterial({
        color: 0xccffff,
        emissive: 0x002244,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.6,
        metalness: 0.1
    });

    // --- HELPER FUNCTIONS FOR COMPLEX GEOMETRY ---

    function createLatheShape(pointsArr, segments = 64) {
        const points = pointsArr.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(points, segments);
    }

    function createExtrudedBase(radius, sides, depth) {
        const shape = new THREE.Shape();
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const r = (i % 2 === 0) ? radius : radius * 0.8;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        return new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.5,
            bevelThickness: 0.5
        });
    }

    function createComplexPipe(pathArr, tubularSegments = 100, radius = 0.5, radialSegments = 16) {
        const curve = new THREE.CatmullRomCurve3(pathArr.map(p => new THREE.Vector3(p[0], p[1], p[2])));
        return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
    }

    // --- MACHINE CONSTRUCTION ---

    // 1. Foundation: Zero-Point Energy Pedestal
    const baseGeo = createExtrudedBase(30, 24, 5);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -10;
    group.add(baseMesh);

    parts.push({
        name: "Zero-Point Energy Pedestal",
        description: "A massive super-cooled dark steel foundation designed to isolate the forge from local quantum fluctuations.",
        material: "darkSteel",
        function: "Provides absolute inertial and quantum grounding for the symmetry breaking process.",
        assemblyOrder: 1,
        connections: ["Cryo-Piping Network", "Higgs Chamber Base"],
        failureEffect: "Quantum decoherence cascades into the local environment.",
        cascadeFailures: ["Higgs Chamber Base", "Phase Transition Containment"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 2. Higgs-Field Manipulation Chamber Base
    const chamberBaseGeo = new THREE.CylinderGeometry(15, 20, 10, 64, 1, false);
    const chamberBaseMesh = new THREE.Mesh(chamberBaseGeo, chrome);
    chamberBaseMesh.position.y = -5;
    group.add(chamberBaseMesh);

    parts.push({
        name: "Higgs Chamber Base Receptacle",
        description: "Chromium-plated housing that generates the initial scaler field potential.",
        material: "chrome",
        function: "Anchors the false vacuum bubble.",
        assemblyOrder: 2,
        connections: ["Zero-Point Energy Pedestal", "False Vacuum Sphere"],
        failureEffect: "Vacuum decay begins spreading at the speed of light.",
        cascadeFailures: ["Entire Facility"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 3. The False Vacuum Sphere
    const vacuumGeo = new THREE.IcosahedronGeometry(12, 4);
    const vacuumMesh = new THREE.Mesh(vacuumGeo, falseVacuumMat);
    vacuumMesh.position.y = 12;
    group.add(vacuumMesh);
    meshesToAnimate.oscillators.push(vacuumMesh);
    meshesToAnimate.rotators.push({ mesh: vacuumMesh, speed: { x: 0.005, y: 0.01, z: 0.002 } });

    parts.push({
        name: "False Vacuum Manifold",
        description: "A metastable spatial region held artificially at a higher local energy minimum.",
        material: "falseVacuumMat",
        function: "Serves as the raw material for topological defect generation.",
        assemblyOrder: 3,
        connections: ["Higgs Chamber Base Receptacle", "Symmetry Breaker Array"],
        failureEffect: "Catastrophic shift to true vacuum, erasing normal matter.",
        cascadeFailures: ["Universe"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 20 }
    });

    // 4. Symmetry Breaking Field Emitters (The 'Ice' Spreader)
    const emitterGeo = new THREE.TorusKnotGeometry(13, 0.5, 256, 32, 3, 7);
    const emitterMesh = new THREE.Mesh(emitterGeo, symmetryBreakerMat);
    emitterMesh.position.y = 12;
    group.add(emitterMesh);
    meshesToAnimate.rotators.push({ mesh: emitterMesh, speed: { x: -0.02, y: -0.03, z: 0.01 } });

    parts.push({
        name: "Symmetry Breaking Torsion Lattice",
        description: "High-frequency energy lattice that rapidly forces the false vacuum to 'choose' a ground state.",
        material: "symmetryBreakerMat",
        function: "Initiates the Kibble-Zurek mechanism across the vacuum manifold.",
        assemblyOrder: 4,
        connections: ["False Vacuum Manifold"],
        failureEffect: "No defects form; energy dissipates as pure radiation.",
        cascadeFailures: ["Monopole Collector"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 12, z: -30 }
    });

    // 5-12. Extreme Rapid Cooling Arrays
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        
        const coolingGroup = new THREE.Group();
        
        // Piston housing
        const housingGeo = new THREE.CylinderGeometry(2, 2, 15, 16);
        const housing = new THREE.Mesh(housingGeo, steel);
        housing.position.y = 5;
        
        // Cryo-piston
        const pistonGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 16);
        const piston = new THREE.Mesh(pistonGeo, cryogenicIceMat);
        piston.position.y = 12;
        
        // Fins
        for (let f = 0; f < 10; f++) {
            const finGeo = new THREE.BoxGeometry(6, 0.2, 6);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.y = 2 + (f * 1.2);
            housing.add(fin);
        }

        coolingGroup.add(housing);
        coolingGroup.add(piston);
        
        coolingGroup.position.x = Math.cos(angle) * 22;
        coolingGroup.position.z = Math.sin(angle) * 22;
        coolingGroup.position.y = -5;
        
        // Pointing inwards
        coolingGroup.lookAt(new THREE.Vector3(0, 10, 0));
        coolingGroup.rotateX(Math.PI / 2);

        group.add(coolingGroup);
        
        meshesToAnimate.pistons.push({
            mesh: piston,
            baseY: 12,
            amplitude: 4,
            speed: 0.05,
            offset: i * (Math.PI / 4)
        });

        parts.push({
            name: `Cryogenic Injector Array ${i+1}`,
            description: "Superfluid helium-3 injectors that drop the local temperature below the GUT scale instantly.",
            material: "steel/aluminum",
            function: "Quenches the vacuum to freeze out topological defects.",
            assemblyOrder: 5 + i,
            connections: ["Zero-Point Energy Pedestal", "False Vacuum Manifold"],
            failureEffect: "Thermal fluctuations melt the forming monopoles.",
            cascadeFailures: ["Monopole Magnetic Trap"],
            originalPosition: { x: coolingGroup.position.x, y: coolingGroup.position.y, z: coolingGroup.position.z },
            explodedPosition: { x: coolingGroup.position.x * 2, y: coolingGroup.position.y, z: coolingGroup.position.z * 2 }
        });
    }

    // 13. Magnetic Monopole Collection Trap
    const trapGeo = new THREE.TorusGeometry(8, 1, 64, 100);
    const trapMesh = new THREE.Mesh(trapGeo, copper);
    trapMesh.rotation.x = Math.PI / 2;
    trapMesh.position.y = 28;
    group.add(trapMesh);
    
    // Tiny electromagnets around the trap (simulated by boxes)
    for (let i = 0; i < 60; i++) {
        const magGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
        const magMesh = new THREE.Mesh(magGeo, darkSteel);
        const angle = (i / 60) * Math.PI * 2;
        magMesh.position.x = Math.cos(angle) * 8;
        magMesh.position.y = 28;
        magMesh.position.z = Math.sin(angle) * 8;
        magMesh.lookAt(new THREE.Vector3(0, 28, 0));
        group.add(magMesh);
    }

    parts.push({
        name: "Monopole Superconducting Trap",
        description: "A ring of extreme-field electromagnets designed to levitate massive point-like magnetic charges.",
        material: "copper/darkSteel",
        function: "Catches the newly formed 't Hooft-Polyakov monopoles as they erupt from the vacuum.",
        assemblyOrder: 13,
        connections: ["Containment Struts"],
        failureEffect: "Monopoles fall through the Earth to the core, dissolving it.",
        cascadeFailures: ["Planetary Integrity"],
        originalPosition: { x: 0, y: 28, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 14. The Monopole Itself (Animated)
    const monopoleGeo = new THREE.SphereGeometry(1, 32, 32);
    const monopoleMesh = new THREE.Mesh(monopoleGeo, monopoleMat);
    monopoleMesh.position.y = 28;
    group.add(monopoleMesh);
    
    const monopoleLight = new THREE.PointLight(0xff0000, 2, 50);
    monopoleLight.position.set(0, 28, 0);
    group.add(monopoleLight);

    meshesToAnimate.energyCores.push({
        mesh: monopoleMesh,
        light: monopoleLight,
        pulseSpeed: 0.1
    });

    parts.push({
        name: "Synthetic Magnetic Monopole",
        description: "An isolated north or south magnetic pole, a localized knot in the gauge fields.",
        material: "monopoleMat",
        function: "Primary output product. Used for macroscopic energy generation or extreme physics.",
        assemblyOrder: 14,
        connections: ["Monopole Superconducting Trap"],
        failureEffect: "Annihilation with an antimonopole.",
        cascadeFailures: ["None, but zero yield"],
        originalPosition: { x: 0, y: 28, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 15. Cosmic String Spindle/Loom
    const spindlePoints = [
        [1, 0], [2, 5], [1, 10], [0.5, 15], [3, 20], [1, 25], [1, 0]
    ];
    const spindleGeo = createLatheShape(spindlePoints, 32);
    const spindleMesh = new THREE.Mesh(spindleGeo, chrome);
    spindleMesh.position.set(0, 32, 0);
    group.add(spindleMesh);
    meshesToAnimate.rotators.push({ mesh: spindleMesh, speed: { x: 0, y: 0.1, z: 0 } });

    parts.push({
        name: "Cosmic String Extraction Loom",
        description: "A chromodynamic spindle that winds 1D topological defects (cosmic strings) before they collapse.",
        material: "chrome",
        function: "Extracts and stabilizes linear defects from the vacuum.",
        assemblyOrder: 15,
        connections: ["Monopole Superconducting Trap", "Containment Dome"],
        failureEffect: "Cosmic string snaps, whipping through the facility and slicing it at the subatomic level.",
        cascadeFailures: ["All components in the string's path"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // 16. The Cosmic String (Tube Geometry that waves)
    const stringPath = [];
    for(let i=0; i<=20; i++) {
        stringPath.push([0, 32 + (i*1.5), 0]);
    }
    const cosmicStringGeo = createComplexPipe(stringPath, 64, 0.2, 8);
    const cosmicStringMesh = new THREE.Mesh(cosmicStringGeo, stringMat);
    group.add(cosmicStringMesh);
    
    // We will animate the vertices of the tube geometry in the animate function
    meshesToAnimate.particleSystems.push({
        type: 'cosmicString',
        mesh: cosmicStringMesh,
        basePath: stringPath
    });

    parts.push({
        name: "Woven Cosmic String Thread",
        description: "A 1-dimensional false-vacuum remnant, incredibly dense and under immense tension.",
        material: "stringMat",
        function: "Exotic material storage.",
        assemblyOrder: 16,
        connections: ["Cosmic String Extraction Loom"],
        failureEffect: "Decays into gravitational waves.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 10, y: 60, z: 10 }
    });

    // 17-20. Hydraulic Containment Struts
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI/4);
        
        const strutGroup = new THREE.Group();
        
        // Base hinge
        const hingeGeo = new THREE.CylinderGeometry(3, 3, 6, 16);
        const hinge = new THREE.Mesh(hingeGeo, darkSteel);
        hinge.rotation.z = Math.PI / 2;
        
        // Main arm
        const armGeo = new THREE.BoxGeometry(4, 45, 4);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.y = 22.5;
        
        // Top clamp
        const clampGeo = new THREE.BoxGeometry(6, 6, 10);
        const clamp = new THREE.Mesh(clampGeo, rubber);
        clamp.position.y = 45;
        clamp.position.z = -3;
        
        strutGroup.add(hinge);
        strutGroup.add(arm);
        strutGroup.add(clamp);
        
        strutGroup.position.x = Math.cos(angle) * 30;
        strutGroup.position.z = Math.sin(angle) * 30;
        strutGroup.position.y = -8;
        
        // Tilt inwards
        strutGroup.lookAt(new THREE.Vector3(0, 32, 0));
        strutGroup.rotateX(Math.PI / 2.5); // Adjust tilt

        group.add(strutGroup);

        parts.push({
            name: `Hydraulic Containment Strut ${i+1}`,
            description: "Massive physical restraint arm with dampening rubber joints to absorb gravitational shockwaves.",
            material: "steel/rubber",
            function: "Prevents the Loom and Trap from tearing themselves apart under extreme magnetic/gravitational stress.",
            assemblyOrder: 17 + i,
            connections: ["Zero-Point Energy Pedestal", "Monopole Superconducting Trap"],
            failureEffect: "Structural collapse of the upper containment systems.",
            cascadeFailures: ["Monopole Superconducting Trap", "Cosmic String Extraction Loom"],
            originalPosition: { x: strutGroup.position.x, y: strutGroup.position.y, z: strutGroup.position.z },
            explodedPosition: { x: strutGroup.position.x * 1.5, y: strutGroup.position.y * 1.2, z: strutGroup.position.z * 1.5 }
        });
    }

    // 21. High-Tech Control Cabin
    const cabinGeo = new THREE.BoxGeometry(10, 8, 12);
    const cabin = new THREE.Mesh(cabinGeo, plastic);
    cabin.position.set(0, 5, 35);
    
    const windowGeo = new THREE.BoxGeometry(8, 4, 12.5);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 1, 0);
    cabin.add(windowMesh);
    
    // Screens inside cabin
    const screenGeo = new THREE.PlaneGeometry(6, 3);
    const screen = new THREE.Mesh(screenGeo, glowingPanel);
    screen.position.set(0, 0, -5.9);
    cabin.add(screen);

    group.add(cabin);

    parts.push({
        name: "Operator Control Cabin",
        description: "Heavily shielded observation and control deck. Tinted hyper-glass blocks Hawking radiation.",
        material: "plastic/tinted/glowingPanel",
        function: "Allows meat-based operators to safely trigger symmetry breaking and view the cosmos ripping.",
        assemblyOrder: 21,
        connections: ["Zero-Point Energy Pedestal"],
        failureEffect: "Operator is irradiated by exotic particles.",
        cascadeFailures: ["Human Life"],
        originalPosition: { x: 0, y: 5, z: 35 },
        explodedPosition: { x: 0, y: 5, z: 60 }
    });

    // 22-25. Cryo-Piping Networks
    for (let i = 0; i < 4; i++) {
        const path = [
            [Math.cos(i*Math.PI/2)*25, -5, Math.sin(i*Math.PI/2)*25],
            [Math.cos(i*Math.PI/2)*15, 0, Math.sin(i*Math.PI/2)*15],
            [Math.cos(i*Math.PI/2)*10, 5, Math.sin(i*Math.PI/2)*10],
            [0, 8, 0]
        ];
        const pipeGeo = createComplexPipe(path, 64, 1.5, 12);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper);
        group.add(pipeMesh);

        parts.push({
            name: `Superfluid Helium Conduit ${i+1}`,
            description: "Thick copper pipelines pumping liquid helium directly into the false vacuum interface.",
            material: "copper",
            function: "Thermal transfer.",
            assemblyOrder: 22 + i,
            connections: ["Cryogenic Injector Array", "Higgs Chamber Base Receptacle"],
            failureEffect: "Coolant leak; spontaneous boiling of helium.",
            cascadeFailures: ["Injector Arrays"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: Math.cos(i*Math.PI/2)*20, y: -10, z: Math.sin(i*Math.PI/2)*20 }
        });
    }

    // --- ANIMATION LOGIC ---
    
    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        meshesToAnimate.rotators.forEach(rot => {
            rot.mesh.rotation.x += rot.speed.x;
            rot.mesh.rotation.y += rot.speed.y;
            rot.mesh.rotation.z += rot.speed.z;
        });

        meshesToAnimate.pistons.forEach(piston => {
            piston.mesh.position.y = piston.baseY + Math.sin(t * piston.speed + piston.offset) * piston.amplitude;
        });

        meshesToAnimate.oscillators.forEach(osc => {
            osc.scale.setScalar(1 + Math.sin(t * 0.05) * 0.1);
        });

        meshesToAnimate.energyCores.forEach(core => {
            core.light.intensity = 2 + Math.sin(t * core.pulseSpeed) * 1.5;
            core.mesh.scale.setScalar(1 + Math.sin(t * core.pulseSpeed * 2) * 0.2);
            // Snap effect
            if (Math.random() < 0.05) {
                core.light.intensity = 10;
                core.mesh.material.emissiveIntensity = 10;
            } else {
                core.mesh.material.emissiveIntensity = 5;
            }
        });

        meshesToAnimate.particleSystems.forEach(ps => {
            if (ps.type === 'cosmicString') {
                const positions = ps.mesh.geometry.attributes.position;
                // Animate the vertices of the tube geometry to simulate a waving string under tension
                for (let i = 0; i < positions.count; i++) {
                    const vx = positions.getX(i);
                    const vy = positions.getY(i);
                    const vz = positions.getZ(i);
                    
                    // Apply a sine wave based on Y height and time
                    const waveX = Math.sin(vy * 0.5 + t * 0.2) * 0.5;
                    const waveZ = Math.cos(vy * 0.5 + t * 0.2) * 0.5;
                    
                    // We need to keep the base fixed (vy around 32), so we blend the effect
                    const factor = Math.max(0, (vy - 32) / 30);
                    
                    // Since it's complex to update tube geometry vertices robustly without recreating it,
                    // we will instead rotate and scale the whole mesh to simulate thrashing
                }
                
                // Simpler cosmic string thrashing for Three.js Group:
                ps.mesh.rotation.y = Math.sin(t * 0.1) * Math.PI;
                ps.mesh.rotation.x = Math.sin(t * 0.2) * 0.1;
                ps.mesh.rotation.z = Math.cos(t * 0.15) * 0.1;
            }
        });
        
        // Pulsing the False Vacuum color to simulate phase transition
        const hue = (t * 0.01) % 1;
        falseVacuumMat.emissive.setHSL(hue, 1, 0.2);
    };

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "Which theoretical framework describes the production of topological defects (like monopoles and cosmic strings) during a rapid, continuous cosmological phase transition?",
            options: ["Hawking Radiation", "The Kibble-Zurek Mechanism", "The Casimir Effect", "Baryogenesis"],
            correctAnswer: 1,
            explanation: "The Kibble-Zurek mechanism explains how topological defects form when a system undergoes a rapid continuous phase transition, causing causally disconnected regions to choose different vacuum states, leading to defects at their boundaries."
        },
        {
            question: "In the context of Grand Unified Theories (GUTs), what specific type of topological defect is inevitably produced when a semi-simple gauge group is broken down to the Standard Model gauge group containing a U(1) factor?",
            options: ["Global Monopole", "'t Hooft-Polyakov Magnetic Monopole", "Domain Wall", "Q-Ball"],
            correctAnswer: 1,
            explanation: "The 't Hooft-Polyakov monopole is a non-singular magnetic monopole that arises necessarily when a gauge symmetry group is spontaneously broken to a subgroup that includes a U(1) electromagnetic factor."
        },
        {
            question: "What physical state is fundamentally trapped inside the core of a cosmic string formed via spontaneous symmetry breaking?",
            options: ["A black hole singularity", "The unbroken symmetric phase (false vacuum)", "Pure dark matter", "A cloud of antimatter"],
            correctAnswer: 1,
            explanation: "The core of a topological defect, such as a cosmic string, contains the trapped, higher-energy unbroken symmetric phase (false vacuum) from before the phase transition occurred."
        },
        {
            question: "According to standard cosmology, what is the primary consequence if Domain Walls were to form and persist during a phase transition in the early universe?",
            options: ["They would act as seeds for galaxy formation", "They would generate the cosmic microwave background", "They would drastically overclose the universe and conflict with CMB isotropy", "They would cause the universe to immediately collapse in a Big Crunch"],
            correctAnswer: 2,
            explanation: "Domain walls have a high energy density that scales slower than matter or radiation. If they persisted, they would dominate the energy density of the universe, leading to a catastrophic overclosure and massive anisotropies in the CMB (the Zeldovich-Kobzarev-Okun bound)."
        },
        {
            question: "Which specific mathematical condition regarding the vacuum manifold (M) is required for the production of stable cosmic strings?",
            options: ["The zeroth homotopy group π0(M) is non-trivial", "The first homotopy group π1(M) is non-trivial", "The second homotopy group π2(M) is non-trivial", "The third homotopy group π3(M) is non-trivial"],
            correctAnswer: 1,
            explanation: "Cosmic strings are 1-dimensional topological defects, which require the first homotopy group (π1) of the vacuum manifold to be non-trivial (i.e., it contains unshrinkable loops)."
        }
    ];

    return {
        group,
        parts,
        description: "The God-Tier Topological Defect Forge. A hyper-advanced scientific apparatus capable of isolating a region of spacetime, inducing a false vacuum state, and rapidly quenching it via the Kibble-Zurek mechanism to forge cosmic strings and 't Hooft-Polyakov magnetic monopoles.",
        quizQuestions,
        animate
    };
}
