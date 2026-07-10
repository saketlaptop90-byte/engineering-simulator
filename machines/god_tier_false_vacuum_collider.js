import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER FALSE VACUUM COLLIDER
 * An ultra-complex, high-fidelity engineering model of a theoretical
 * particle accelerator capable of probing the stability of the electroweak vacuum.
 * Features massive interlocking superconducting rings, extreme magnetic containment,
 * cryogenic cooling networks, and a central collision chamber where reality itself
 * is momentarily torn (rendered via custom GLSL shaders).
 */
export function createMachine(THREE) {
    const group = new THREE.Group();

    // ==========================================
    // CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const superconductorMat = new THREE.MeshStandardMaterial({
        color: 0x111115,
        roughness: 0.2,
        metalness: 0.9,
        envMapIntensity: 2.0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
    });

    const energyCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const cryoPipeMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeff,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        envMapIntensity: 1.5
    });

    const magnetMat = new THREE.MeshStandardMaterial({
        color: 0x880000,
        roughness: 0.4,
        metalness: 0.6,
        clearcoat: 0.2
    });

    const cautionMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.5,
        metalness: 0.2
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 2.5
    });

    const plasmaPink = new THREE.MeshStandardMaterial({
        color: 0xff00aa,
        emissive: 0xff00aa,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.8
    });

    // ==========================================
    // SHADER MATERIALS (Reality Tear)
    // ==========================================
    const realityTearVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;
            vec3 pos = position;
            
            // Extreme fractal displacement based on time
            float displacement = sin(pos.x * 15.0 + time * 10.0) * 
                                 cos(pos.y * 15.0 - time * 8.0) * 
                                 sin(pos.z * 15.0 + time * 12.0);
            
            pos += normal * displacement * 0.4;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const realityTearFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
            // High-frequency color oscillation for blinding effect
            float r = abs(sin(vPosition.x * 20.0 + time * 15.0));
            float g = abs(cos(vPosition.y * 20.0 - time * 14.0));
            float b = abs(sin(vPosition.z * 20.0 + time * 16.0));
            
            vec3 color = vec3(1.0) - vec3(r * 0.5, g * 0.5, b * 0.2); // Mostly blinding white with dark tears
            
            float intensity = (r + g + b) / 3.0;
            if (intensity < 0.2) {
                // The "void" shining through
                color = vec3(0.0, 0.0, 0.0);
            } else if (intensity > 0.8) {
                // High energy burst
                color = vec3(1.0, 1.0, 1.0);
            }
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const realityTearUniforms = {
        time: { value: 0.0 }
    };

    const realityTearMat = new THREE.ShaderMaterial({
        vertexShader: realityTearVertexShader,
        fragmentShader: realityTearFragmentShader,
        uniforms: realityTearUniforms,
        transparent: true,
        side: THREE.DoubleSide
    });

    // ==========================================
    // ANIMATABLE ARRAYS
    // ==========================================
    const animRotators = [];
    const animPulsers = [];
    const animParticles = [];
    const animHydraulics = [];

    // ==========================================
    // GEOMETRY GENERATION HELPERS
    // ==========================================
    function createGreebledRing(radius, tube, radialSegs, tubularSegs, material, greebleDensity) {
        const ringGroup = new THREE.Group();
        const baseGeom = new THREE.TorusGeometry(radius, tube, radialSegs, tubularSegs);
        const baseMesh = new THREE.Mesh(baseGeom, material);
        ringGroup.add(baseMesh);

        // Add greebles (magnetic containment nodes)
        const greebleGeom = new THREE.BoxGeometry(tube * 2.5, tube * 2.5, tube * 1.5);
        const greebleCount = Math.floor(tubularSegs * greebleDensity);
        const step = (Math.PI * 2) / greebleCount;

        for (let i = 0; i < greebleCount; i++) {
            const angle = i * step;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const gMesh = new THREE.Mesh(greebleGeom, darkSteel);
            gMesh.position.set(x, y, 0);
            gMesh.rotation.z = angle;
            
            // Sub-greeble (emission strip)
            const emissionGeom = new THREE.BoxGeometry(tube * 2.6, tube * 0.5, tube * 0.2);
            const eMesh = new THREE.Mesh(emissionGeom, energyCoreMat);
            eMesh.position.z = tube * 0.75;
            gMesh.add(eMesh);
            animPulsers.push(eMesh);

            ringGroup.add(gMesh);
        }
        return ringGroup;
    }

    function createCryoTubing(ringRadius, tubeRadius, count, coils) {
        const tubesGroup = new THREE.Group();
        for (let c = 0; c < count; c++) {
            const pathPoints = [];
            const segments = 200;
            const phase = (Math.PI * 2 * c) / count;
            
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const r = ringRadius + Math.sin(theta * coils + phase) * (tubeRadius * 2);
                const z = Math.cos(theta * coils + phase) * (tubeRadius * 2);
                
                pathPoints.push(new THREE.Vector3(
                    Math.cos(theta) * r,
                    Math.sin(theta) * r,
                    z
                ));
            }
            const curve = new THREE.CatmullRomCurve3(pathPoints);
            const tubeGeom = new THREE.TubeGeometry(curve, segments, tubeRadius * 0.3, 8, true);
            const tubeMesh = new THREE.Mesh(tubeGeom, cryoPipeMat);
            tubesGroup.add(tubeMesh);
        }
        return tubesGroup;
    }

    function createInjectorArray(x, y, z, rotationY) {
        const injGroup = new THREE.Group();
        
        // Base housing
        const housingGeom = new THREE.CylinderGeometry(2, 4, 15, 16);
        const housing = new THREE.Mesh(housingGeom, steel);
        housing.rotation.z = Math.PI / 2;
        injGroup.add(housing);

        // Accelerator barrel
        const barrelGeom = new THREE.CylinderGeometry(0.8, 0.8, 30, 32);
        const barrel = new THREE.Mesh(barrelGeom, chrome);
        barrel.rotation.z = Math.PI / 2;
        barrel.position.x = 15;
        injGroup.add(barrel);

        // Magnetic rings on barrel
        for (let i = 0; i < 10; i++) {
            const magGeom = new THREE.TorusGeometry(1.5, 0.4, 16, 32);
            const mag = new THREE.Mesh(magGeom, magnetMat);
            mag.rotation.y = Math.PI / 2;
            mag.position.x = 5 + (i * 2.5);
            injGroup.add(mag);
            
            const glowGeom = new THREE.TorusGeometry(1.6, 0.1, 8, 32);
            const glow = new THREE.Mesh(glowGeom, neonPurple);
            glow.rotation.y = Math.PI / 2;
            glow.position.x = 5 + (i * 2.5);
            injGroup.add(glow);
            animPulsers.push(glow);
        }

        injGroup.position.set(x, y, z);
        injGroup.rotation.y = rotationY;
        return injGroup;
    }

    // ==========================================
    // STRUCTURE ASSEMBLY
    // ==========================================

    // 1. Central Containment Chamber (The Core)
    const coreGroup = new THREE.Group();
    
    // Core Outer Shield
    const points = [];
    for ( let i = 0; i < 20; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
    }
    const shieldGeom = new THREE.LatheGeometry(points, 64);
    const shieldMesh = new THREE.Mesh(shieldGeom, steel);
    coreGroup.add(shieldMesh);

    // Inner Glass Vacuum Sphere
    const glassGeom = new THREE.SphereGeometry(8, 64, 64);
    const glassSphere = new THREE.Mesh(glassGeom, tinted);
    coreGroup.add(glassSphere);

    // The Reality Tear (Custom Shader Mesh)
    const tearGeom = new THREE.IcosahedronGeometry(4, 8); // High detail
    const tearMesh = new THREE.Mesh(tearGeom, realityTearMat);
    coreGroup.add(tearMesh);
    
    // Core Stabilizer Rings
    for (let i = 0; i < 3; i++) {
        const stabRingGeom = new THREE.TorusGeometry(12, 0.5, 16, 64);
        const stabRing = new THREE.Mesh(stabRingGeom, chrome);
        stabRing.rotation.x = (Math.PI / 2) * i;
        stabRing.rotation.y = (Math.PI / 4) * i;
        coreGroup.add(stabRing);
        animRotators.push({ mesh: stabRing, axis: 'x', speed: 0.5 + i*0.2 });
        animRotators.push({ mesh: stabRing, axis: 'y', speed: 0.3 + i*0.1 });
    }

    group.add(coreGroup);

    // 2. Main Accelerator Rings (Massive Torus structures)
    const primaryRingRadius = 80;
    const secondaryRingRadius = 65;
    const tertiaryRingRadius = 50;

    const ringAlpha = createGreebledRing(primaryRingRadius, 4, 32, 256, superconductorMat, 0.5);
    ringAlpha.rotation.x = Math.PI / 2;
    group.add(ringAlpha);

    const ringBeta = createGreebledRing(secondaryRingRadius, 3, 32, 256, darkSteel, 0.4);
    ringBeta.rotation.x = Math.PI / 2;
    ringBeta.rotation.y = Math.PI / 8; // Offset tilt
    group.add(ringBeta);

    const ringGamma = createGreebledRing(tertiaryRingRadius, 2, 32, 128, steel, 0.3);
    ringGamma.rotation.x = Math.PI / 2;
    ringGamma.rotation.y = -Math.PI / 8;
    group.add(ringGamma);

    // Animate the main rings
    animRotators.push({ mesh: ringAlpha, axis: 'z', speed: 0.1 });
    animRotators.push({ mesh: ringBeta, axis: 'z', speed: -0.25 });
    animRotators.push({ mesh: ringGamma, axis: 'z', speed: 0.5 });

    // 3. Cryogenic Cooling Networks
    const cryoNet1 = createCryoTubing(primaryRingRadius, 4, 12, 16);
    cryoNet1.rotation.x = Math.PI / 2;
    group.add(cryoNet1);
    animRotators.push({ mesh: cryoNet1, axis: 'z', speed: 0.1 }); // Match alpha ring

    const cryoNet2 = createCryoTubing(secondaryRingRadius, 3, 8, 12);
    cryoNet2.rotation.x = Math.PI / 2;
    cryoNet2.rotation.y = Math.PI / 8;
    group.add(cryoNet2);
    animRotators.push({ mesh: cryoNet2, axis: 'z', speed: -0.25 });

    // 4. Particle Injector Arrays
    const injectors = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const x = Math.cos(angle) * 120;
        const z = Math.sin(angle) * 120;
        const injector = createInjectorArray(x, 0, z, -angle);
        injectors.add(injector);
    }
    group.add(injectors);

    // 5. Massive Support Struts and Hydraulic Pistons
    const supportBase = new THREE.Group();
    const strutGeom = new THREE.BoxGeometry(4, 40, 4);
    
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        const x = Math.cos(angle) * (primaryRingRadius - 10);
        const z = Math.sin(angle) * (primaryRingRadius - 10);
        
        // Main Pillar
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        strut.position.set(x, -30, z);
        
        // Piston Cylinder (Base)
        const cylinderGeom = new THREE.CylinderGeometry(3, 3, 20, 16);
        const cylinder = new THREE.Mesh(cylinderGeom, copper);
        cylinder.position.set(x, -10, z);
        
        // Piston Rod (Moving part)
        const rodGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 16);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.set(x, 0, z);
        
        supportBase.add(strut);
        supportBase.add(cylinder);
        supportBase.add(rod);
        
        // Add to hydraulics animation
        animHydraulics.push({
            mesh: rod,
            baseY: 0,
            amplitude: 5,
            phase: i * 0.5
        });
    }

    // Floor Base Ring
    const floorGeom = new THREE.TorusGeometry(90, 8, 4, 64);
    const floorMesh = new THREE.Mesh(floorGeom, cautionMat);
    floorMesh.rotation.x = Math.PI / 2;
    floorMesh.position.y = -50;
    supportBase.add(floorMesh);

    group.add(supportBase);

    // 6. Particle Stream System (Points)
    const particleCount = 20000;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Distribute particles across the 3 rings and central core
        const ringChoice = Math.random();
        let radius = primaryRingRadius;
        if (ringChoice > 0.8) radius = secondaryRingRadius;
        else if (ringChoice > 0.5) radius = tertiaryRingRadius;
        else if (ringChoice > 0.95) radius = 5; // Central core particles

        particleRadii[i] = radius;
        particlePhases[i] = Math.random() * Math.PI * 2;

        particlePositions[i * 3] = Math.cos(particlePhases[i]) * radius;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4; // Slight vertical spread
        particlePositions[i * 3 + 2] = Math.sin(particlePhases[i]) * radius;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('aPhase', new THREE.BufferAttribute(particlePhases, 1));
    particleGeom.setAttribute('aRadius', new THREE.BufferAttribute(particleRadii, 1));

    const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    particleSystem.rotation.x = Math.PI / 2; // Align with rings
    group.add(particleSystem);
    animParticles.push(particleSystem);


    // ==========================================
    // PARTS METADATA (FOR SIMULATOR UI)
    // ==========================================
    const parts = [
        {
            name: "Core Reality Sub-Processor",
            description: "Houses the main collision point where high-energy particles intersect, creating microscopic false vacuum bubbles.",
            material: "Custom GLSL Shader (Reality Tear)",
            function: "Maintains the stability of the local spacetime metric during collision.",
            assemblyOrder: 1,
            connections: ["Stabilizer Rings", "Vacuum Chamber"],
            failureEffect: "Localized false vacuum decay, complete universe disintegration.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 0 }
        },
        {
            name: "Alpha Superconducting Ring",
            description: "The primary 80m radius acceleration loop utilizing yttrium barium copper oxide magnets.",
            material: "Superconductor Material",
            function: "Accelerates hadrons to 99.9999999% the speed of light.",
            assemblyOrder: 2,
            connections: ["Cryo Network 1", "Particle Injectors"],
            failureEffect: "Particle beam derailment, extreme radiation leak.",
            cascadeFailures: ["Beta Ring", "Cryo Network 1"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 150, z: 0 }
        },
        {
            name: "Cryogenic Cooling Tubing (Primary)",
            description: "Liquid Helium II circulation network wrapping the Alpha ring.",
            material: "CryoPipe / Aluminum",
            function: "Maintains the 1.9K temperature required for superconductivity.",
            assemblyOrder: 3,
            connections: ["Alpha Superconducting Ring"],
            failureEffect: "Thermal runaway in magnets, explosive quenching.",
            cascadeFailures: ["Alpha Superconducting Ring"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 100, z: 100 }
        },
        {
            name: "Beta Compression Ring",
            description: "Secondary ring for anti-particle accumulation and bunch compression.",
            material: "Dark Steel / Neodymium",
            function: "Increases luminosity of the particle bunches prior to collision.",
            assemblyOrder: 4,
            connections: ["Alpha Superconducting Ring", "Gamma Injection Ring"],
            failureEffect: "Loss of luminosity, failed collisions.",
            cascadeFailures: ["Central Core Calibration"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 200, z: 0 }
        },
        {
            name: "Linear Particle Injector Array",
            description: "Initial linear accelerators that feed particles into the main rings.",
            material: "Steel, Chrome, Magnet",
            function: "Provides the initial kinetic energy kick to resting particles.",
            assemblyOrder: 5,
            connections: ["Alpha Superconducting Ring"],
            failureEffect: "Beam starvation.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 150, y: 0, z: 150 }
        },
        {
            name: "Hydraulic Dampening Struts",
            description: "Massive physical dampeners connecting the machine to the bedrock.",
            material: "Copper, Steel, Chrome",
            function: "Isolates the accelerator from seismic and tectonic vibrations to extreme tolerances.",
            assemblyOrder: 6,
            connections: ["Floor Base", "Alpha Superconducting Ring"],
            failureEffect: "Beam misalignment, grazing incidence collisions.",
            cascadeFailures: ["Alpha Superconducting Ring"],
            originalPosition: { x: 0, y: -20, z: 0 },
            explodedPosition: { x: 0, y: -100, z: 0 }
        },
        {
            name: "Quantum Containment Glass",
            description: "Inner vacuum sphere isolating the collision point.",
            material: "Tinted Borosilicate / Metamaterial",
            function: "Prevents atmospheric interference with the reality tear.",
            assemblyOrder: 7,
            connections: ["Core Reality Sub-Processor"],
            failureEffect: "Immediate annihilation of incoming matter with air.",
            cascadeFailures: ["Core Reality Sub-Processor"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 50 }
        },
        {
            name: "Floor Base Power Ring",
            description: "Hexagonal ground distribution ring for the staggering 4.5 Terawatt power draw.",
            material: "Caution painted Heavy Steel",
            function: "Routes power to the injectors and magnets.",
            assemblyOrder: 8,
            connections: ["Hydraulic Dampening Struts", "Grid"],
            failureEffect: "Total blackout.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: -50, z: 0 },
            explodedPosition: { x: 0, y: -150, z: 0 }
        },
        {
            name: "Gamma Synchronization Ring",
            description: "The smallest, fastest rotating inner ring.",
            material: "Steel / Titanium",
            function: "Final trajectory alignment milliseconds before collision.",
            assemblyOrder: 9,
            connections: ["Beta Compression Ring", "Core Outer Shield"],
            failureEffect: "Asymmetric collision, dangerous exotic matter scatter.",
            cascadeFailures: ["Core Outer Shield"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 250, z: 0 }
        },
        {
            name: "Core Outer Lathe Shield",
            description: "Thick tungsten and lead composite shield housing the core.",
            material: "Tungsten/Steel alloy",
            function: "Absorbs rogue gamma rays and stray muons generated by the tear.",
            assemblyOrder: 10,
            connections: ["Core Stabilizer Rings"],
            failureEffect: "Lethal radiation exposure to operators.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -100, y: 0, z: 0 }
        },
        {
            name: "Tri-Axial Stabilizer Rings",
            description: "Spinning rings around the core that generate a localized gyroscopic magnetic field.",
            material: "Chrome / Superconductor",
            function: "Contains the multidimensional stress of the reality tear.",
            assemblyOrder: 11,
            connections: ["Core Outer Lathe Shield"],
            failureEffect: "Spacetime shear, unpredictable topological defects.",
            cascadeFailures: ["Core Reality Sub-Processor"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -100 }
        },
        {
            name: "Plasma Confinement Nodes",
            description: "Greebled nodes attached to the main rings.",
            material: "Dark Steel / Energy Emitters",
            function: "Injects plasma pulses to correct beam drift.",
            assemblyOrder: 12,
            connections: ["Alpha Superconducting Ring"],
            failureEffect: "Beam spread and wall collision.",
            cascadeFailures: ["Alpha Superconducting Ring"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 100, y: 100, z: 100 }
        },
        {
            name: "Cryo Pump Station",
            description: "Pressurizes the liquid Helium II.",
            material: "Aluminum",
            function: "Maintains flow rate in the cooling tubes.",
            assemblyOrder: 13,
            connections: ["Cryogenic Cooling Tubing (Primary)"],
            failureEffect: "Coolant stagnation.",
            cascadeFailures: ["Cryogenic Cooling Tubing (Primary)"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -100, y: 100, z: -100 }
        },
        {
            name: "Injector Magnetic Focusing Array",
            description: "Series of magnets on the injector barrels.",
            material: "Neodymium / Neon Purple Emitters",
            function: "Squeezes the particle stream into a microscopic thread.",
            assemblyOrder: 14,
            connections: ["Linear Particle Injector Array"],
            failureEffect: "Diffuse beam injection.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 200, y: 0, z: -200 }
        },
        {
            name: "Safety Interlock Subsystem",
            description: "The only thing stopping the scientists from ending the universe by mistake.",
            material: "Steel / Silicon",
            function: "Monitors the vacuum metastability threshold during collisions.",
            assemblyOrder: 15,
            connections: ["Floor Base Power Ring"],
            failureEffect: "Accidental initiation of False Vacuum Decay.",
            cascadeFailures: ["Universe"],
            originalPosition: { x: 0, y: -45, z: 50 },
            explodedPosition: { x: 0, y: -200, z: 150 }
        }
    ];

    // ==========================================
    // EXTREME DIFFICULTY PHD-LEVEL QUIZ
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of Coleman-De Luccia tunneling, what primarily determines the decay rate of the false vacuum?",
            options: [
                "The Euclidean bounce action of the critical bubble.",
                "The Minkowski space path integral of the Higgs field.",
                "The zero-point energy derived from the Casimir effect.",
                "The spontaneous symmetry breaking of the SU(2) × U(1) group."
            ],
            correctAnswer: 0,
            explanation: "The decay rate is governed by the semi-classical approximation, where the exponent is the Euclidean action evaluated on the 'bounce' solution, which represents the formation of a critical bubble of true vacuum."
        },
        {
            question: "According to the Standard Model, the stability of the electroweak vacuum is most sensitively dependent on the precise masses of which two entities?",
            options: [
                "The W boson and the Z boson.",
                "The Higgs boson and the Top quark.",
                "The Up quark and the Down quark.",
                "The Electron neutrino and the Muon."
            ],
            correctAnswer: 1,
            explanation: "The renormalization group evolution of the Higgs quartic coupling depends critically on the negative contribution from top quark loops and the positive contribution from Higgs self-interactions, making their exact masses the defining factors of our universe's metastability."
        },
        {
            question: "Which mechanism could potentially catalyze a false vacuum decay locally, dramatically lowering the tunneling action?",
            options: [
                "Production of primordial microscopic black holes serving as nucleation seeds.",
                "High-intensity coherent photon emission from an active galactic nucleus.",
                "The decay of a heavy sterile neutrino into dark matter.",
                "Baryogenesis via leptogenesis in the early universe."
            ],
            correctAnswer: 0,
            explanation: "Black holes, particularly microscopic ones, can act as nucleation sites for vacuum decay. The intense gravitational field and Hawking radiation can significantly lower the Euclidean action required for a true vacuum bubble to form."
        },
        {
            question: "What happens to the thin-wall approximation of vacuum bubble nucleation when the energy difference (ε) between the false and true vacuum becomes very large?",
            options: [
                "The approximation becomes perfectly exact.",
                "The thin-wall approximation breaks down, requiring a thick-wall instanton solution.",
                "The bubble radius becomes infinite, preventing decay entirely.",
                "The surface tension of the bubble wall drops strictly to zero."
            ],
            correctAnswer: 1,
            explanation: "The thin-wall approximation assumes the energy difference ε is small compared to the barrier height. When ε is large, the bubble interior doesn't reach the true vacuum before the wall starts, resulting in a 'thick wall' where the field is everywhere varying."
        },
        {
            question: "In a metastable universe experiencing false vacuum decay, what happens immediately after a critical bubble nucleates?",
            options: [
                "It collapses back in on itself due to negative pressure.",
                "It expands at an exponentially decelerating rate until it reaches equilibrium.",
                "It expands outward asymptotically approaching the speed of light, destroying the false vacuum.",
                "It phases out of our light cone into a higher-dimensional bulk."
            ],
            correctAnswer: 2,
            explanation: "Once a bubble of true vacuum reaches critical size, the outward pressure from the lower energy state inside exceeds the inward pull of surface tension. It expands relativistically, approaching the speed of light, replacing the false vacuum with the true vacuum."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        const t = time * 0.001 * speed; // Base time

        // 1. Update Custom Shader (Reality Tear)
        realityTearUniforms.time.value = t * 5.0; // Fast oscillation

        // 2. Rotate all rings and cryo tubes
        animRotators.forEach(rot => {
            rot.mesh.rotation[rot.axis] += rot.speed * 0.01 * speed;
        });

        // 3. Pulse emissive materials (Magnetic nodes and injectors)
        const pulseIntensity = (Math.sin(t * 10) + 1.0) * 1.5 + 1.0;
        animPulsers.forEach(pulser => {
            if (pulser.material.emissiveIntensity !== undefined) {
                pulser.material.emissiveIntensity = pulseIntensity;
            }
        });

        // 4. Hydraulic Piston Animation
        animHydraulics.forEach(hyd => {
            // Sine wave motion based on phase
            hyd.mesh.position.y = hyd.baseY + Math.sin(t * 2 + hyd.phase) * hyd.amplitude;
        });

        // 5. Particle Stream Animation
        animParticles.forEach(ps => {
            const positions = ps.geometry.attributes.position.array;
            const phases = ps.geometry.attributes.aPhase.array;
            const radii = ps.geometry.attributes.aRadius.array;

            for (let i = 0; i < particleCount; i++) {
                // Determine speed based on radius (inner rings spin much faster)
                const r = radii[i];
                let angularSpeed = 10.0;
                if (r === primaryRingRadius) angularSpeed = 15.0;
                else if (r === secondaryRingRadius) angularSpeed = -20.0; // Counter-rotating
                else if (r === tertiaryRingRadius) angularSpeed = 30.0;
                else angularSpeed = 50.0; // Core particles chaotic

                phases[i] += (angularSpeed * 0.001 * speed);
                
                positions[i * 3] = Math.cos(phases[i]) * r;
                // Add a slight wobble
                positions[i * 3 + 1] = Math.sin(phases[i] * 5 + t) * (r * 0.02); 
                positions[i * 3 + 2] = Math.sin(phases[i]) * r;
            }
            ps.geometry.attributes.position.needsUpdate = true;
            ps.geometry.attributes.aPhase.needsUpdate = true;
        });
    }

    return {
        group,
        parts,
        description: "God-Tier False Vacuum Collider. A staggeringly massive, ultra-complex particle accelerator designed to probe the deepest, most dangerous thresholds of the electroweak vacuum. Warning: Simulated operation may cause localized reality tears.",
        quizQuestions,
        animate
    };
}
