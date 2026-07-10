import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER MAGNETIC MONOPOLE REACTOR
 * 
 * An ultra-high-tech, hyper-realistic, massively complex 3D simulation of a 
 * theoretical Grand Unified Theory (GUT) device. This reactor uses a captured 
 * magnetic monopole to catalyze proton decay via the Callan-Rubakov effect.
 * 
 * Features:
 * - 16 D-Shaped Superconducting Toroidal Coils
 * - Intricate Parametric Helical Poloidal Coils
 * - Lorenz Attractor governed Chaotic Monopole Trapping
 * - Advanced InstancedMesh Particle System (Protons in, Positrons & Pions out)
 * - 20+ Highly detailed sub-assemblies and physics-driven mechanics
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // ============================================================================
    // 1. CUSTOM MATERIALS & VISUAL EFFECTS
    // ============================================================================
    
    const plasmaBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x00aaff, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.8, wireframe: true, side: THREE.DoubleSide
    });
    
    const plasmaRed = new THREE.MeshStandardMaterial({
        color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 3.0,
        transparent: true, opacity: 0.9, wireframe: true, side: THREE.DoubleSide
    });
    
    const superconductorMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111, metalness: 1.0, roughness: 0.1,
        clearcoat: 1.0, clearcoatRoughness: 0.1, emissive: 0x001133, emissiveIntensity: 0.2
    });

    const cryogenicSteel = new THREE.MeshStandardMaterial({
        color: 0x99aacc, metalness: 0.8, roughness: 0.4, envMapIntensity: 1.5
    });
    
    const monopoleCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10.0,
        roughness: 0.0, metalness: 0.0
    });

    const positronMat = new THREE.MeshStandardMaterial({
        color: 0xff2200, emissive: 0xff4400, emissiveIntensity: 2.0
    });

    const protonMat = new THREE.MeshStandardMaterial({
        color: 0x0044ff, emissive: 0x0088ff, emissiveIntensity: 1.5
    });

    const gammaMat = new THREE.MeshStandardMaterial({
        color: 0xffff00, emissive: 0xffffff, emissiveIntensity: 4.0, transparent: true, opacity: 0.6
    });

    const glowingGridMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.1
    });

    // ============================================================================
    // 2. ADVANCED PARAMETRIC GEOMETRIES
    // ============================================================================
    
    class ComplexHelixCurve extends THREE.Curve {
        constructor(radius, height, turns, harmonics) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
            this.harmonics = harmonics;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const harmonicMod = Math.sin(t * Math.PI * 2 * this.harmonics) * 0.5 + 1.0;
            const r = this.radius * harmonicMod;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    class D_ShapedCoilCurve extends THREE.Curve {
        constructor(scale) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            // Parametric D-shape typical in Tokamaks
            const angle = t * Math.PI * 2;
            const x = this.scale * (Math.cos(angle) + 0.3 * Math.sin(angle) * Math.sin(angle));
            const y = this.scale * 1.5 * Math.sin(angle);
            const z = 0;
            return optionalTarget.set(x, y, z);
        }
    }

    // ============================================================================
    // 3. PARTICLE PHYSICS ENGINE (CALLAN-RUBAKOV EFFECT)
    // ============================================================================
    
    const MAX_PARTICLES = 1500;
    const dummy = new THREE.Object3D();
    
    const protonGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const positronGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const gammaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4);
    gammaGeo.rotateX(Math.PI / 2); // Align to Z-axis for velocity pointing

    const protonMesh = new THREE.InstancedMesh(protonGeo, protonMat, MAX_PARTICLES);
    const positronMesh = new THREE.InstancedMesh(positronGeo, positronMat, MAX_PARTICLES);
    const gammaMesh = new THREE.InstancedMesh(gammaGeo, gammaMat, MAX_PARTICLES);
    
    protonMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    positronMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    gammaMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    group.add(protonMesh);
    group.add(positronMesh);
    group.add(gammaMesh);

    const particles = {
        protons: [],
        positrons: [],
        gammas: []
    };

    function spawnProton(startPos, velocity) {
        particles.protons.push({
            pos: startPos.clone(),
            vel: velocity.clone(),
            life: 1.0,
            active: true
        });
    }

    function spawnDecayProducts(center) {
        // Proton decays into Positron + Neutral Pion (which decays to 2 Gammas)
        // Positron
        particles.positrons.push({
            pos: center.clone(),
            vel: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(1.2),
            life: 1.0, active: true
        });
        
        // 2 Gammas (back to back in pion rest frame, but we'll randomize here for visual flair)
        const gDir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        particles.gammas.push({
            pos: center.clone(),
            vel: gDir.clone().multiplyScalar(2.5),
            life: 1.0, active: true
        });
        particles.gammas.push({
            pos: center.clone(),
            vel: gDir.clone().multiplyScalar(-2.5),
            life: 1.0, active: true
        });
    }

    function updateParticles(dt) {
        let pCount = 0, eCount = 0, gCount = 0;

        // Protons moving in
        for (let i = particles.protons.length - 1; i >= 0; i--) {
            let p = particles.protons[i];
            if (!p.active) continue;
            
            p.pos.addScaledVector(p.vel, dt);
            
            // Check for annihilation at core (Callan-Rubakov effect)
            if (p.pos.length() < 0.5) {
                p.active = false;
                particles.protons.splice(i, 1);
                spawnDecayProducts(p.pos);
                continue;
            }

            if (pCount < MAX_PARTICLES) {
                dummy.position.copy(p.pos);
                dummy.rotation.set(0,0,0);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                protonMesh.setMatrixAt(pCount++, dummy.matrix);
            }
        }
        protonMesh.count = pCount;
        protonMesh.instanceMatrix.needsUpdate = true;

        // Positrons moving out
        for (let i = particles.positrons.length - 1; i >= 0; i--) {
            let e = particles.positrons[i];
            if (!e.active) continue;
            
            // Magnetic field effect (spiraling out)
            const bField = new THREE.Vector3(0, 1, 0); // Simplified vertical B-field
            const lorentz = e.vel.clone().cross(bField).multiplyScalar(0.5);
            e.vel.addScaledVector(lorentz, dt);
            e.pos.addScaledVector(e.vel, dt);
            e.life -= dt * 0.2;
            
            if (e.life <= 0 || e.pos.length() > 40) {
                e.active = false;
                particles.positrons.splice(i, 1);
                continue;
            }

            if (eCount < MAX_PARTICLES) {
                dummy.position.copy(e.pos);
                dummy.scale.setScalar(e.life);
                dummy.updateMatrix();
                positronMesh.setMatrixAt(eCount++, dummy.matrix);
            }
        }
        positronMesh.count = eCount;
        positronMesh.instanceMatrix.needsUpdate = true;

        // Gammas moving out (straight lines, speed of light proxy)
        for (let i = particles.gammas.length - 1; i >= 0; i--) {
            let g = particles.gammas[i];
            if (!g.active) continue;
            
            g.pos.addScaledVector(g.vel, dt);
            g.life -= dt * 0.3;
            
            if (g.life <= 0 || g.pos.length() > 60) {
                g.active = false;
                particles.gammas.splice(i, 1);
                continue;
            }

            if (gCount < MAX_PARTICLES) {
                dummy.position.copy(g.pos);
                // Orient gamma cylinder along velocity vector
                dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), g.vel.clone().normalize());
                dummy.scale.setScalar(g.life);
                dummy.updateMatrix();
                gammaMesh.setMatrixAt(gCount++, dummy.matrix);
            }
        }
        gammaMesh.count = gCount;
        gammaMesh.instanceMatrix.needsUpdate = true;
    }

    // ============================================================================
    // 4. SUB-ASSEMBLY BUILDERS
    // ============================================================================
    
    // --- The Monopole & Trap ---
    const monopoleGroup = new THREE.Group();
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 2), monopoleCoreMat);
    const coreHalo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), plasmaRed);
    const trapCageGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const trapCage = new THREE.LineSegments(new THREE.WireframeGeometry(trapCageGeo), glowingGridMat);
    
    monopoleGroup.add(coreMesh);
    monopoleGroup.add(coreHalo);
    group.add(trapCage);
    group.add(monopoleGroup);

    parts.push({
        name: "Dirac Magnetic Monopole",
        description: "A stable, massive topological defect possessing a net magnetic charge. It acts as the catalytic center for baryon number violating proton decay.",
        material: "Topological Vacuum",
        function: "Catalyzes the Callan-Rubakov effect.",
        assemblyOrder: 25,
        connections: ["None - Held via magnetic levitation"],
        failureEffect: "Instantaneous microscopic black hole formation or uncontrolled vacuum decay.",
        cascadeFailures: ["Complete annihilation of the facility", "Local spacetime rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    parts.push({
        name: "Inner Vacuum Trap Cage",
        description: "Projects a high-frequency alternating magnetic tensor field to stabilize the monopole against quantum tunneling out of the core.",
        material: "Superconducting YBCO Matrix",
        function: "Monopole containment and stabilization.",
        assemblyOrder: 24,
        connections: ["Cryogenic Network", "Sensor Array"],
        failureEffect: "Monopole destabilization leading to wandering path and structural ablation.",
        cascadeFailures: ["Loss of monopole", "Proton beam misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // --- Toroidal Field Coils (D-Shaped) ---
    const toroidalCoilsGroup = new THREE.Group();
    const numToroidal = 16;
    for (let i = 0; i < numToroidal; i++) {
        const angle = (i / numToroidal) * Math.PI * 2;
        const dCurve = new D_ShapedCoilCurve(12);
        const coilGeo = new THREE.TubeGeometry(dCurve, 100, 1.2, 16, true);
        const coilMesh = new THREE.Mesh(coilGeo, superconductorMat);
        
        // Add cryogenic cooling lines around each coil
        const cryoGeo = new THREE.TubeGeometry(dCurve, 100, 1.4, 6, true);
        const cryoMesh = new THREE.LineSegments(new THREE.WireframeGeometry(cryoGeo), glowingGridMat);

        const coilAssembly = new THREE.Group();
        coilAssembly.add(coilMesh);
        coilAssembly.add(cryoMesh);

        coilAssembly.rotation.y = angle;
        coilAssembly.position.y = 0;
        
        toroidalCoilsGroup.add(coilAssembly);
    }
    group.add(toroidalCoilsGroup);

    parts.push({
        name: "Primary Toroidal Superconducting Coils",
        description: "16 Massive D-shaped coils generating a 100+ Tesla containment field. Designed to confine the immense energies released by proton decay.",
        material: "Niobium-Tin / YBCO Composite",
        function: "Macro-scale magnetic confinement.",
        assemblyOrder: 10,
        connections: ["Power Bus", "Cryogenic Network", "Base Pedestal"],
        failureEffect: "Catastrophic quench, vaporizing the coolant and releasing gigajoules of stored magnetic energy instantly.",
        cascadeFailures: ["Outer shell rupture", "Monopole escape"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Explodes outward radially in animation
    });

    // --- Poloidal / Helical Coils ---
    const helicalCurve = new ComplexHelixCurve(8, 20, 10, 5);
    const helicalGeo = new THREE.TubeGeometry(helicalCurve, 300, 0.4, 12, false);
    const helicalMesh1 = new THREE.Mesh(helicalGeo, copper);
    const helicalMesh2 = new THREE.Mesh(helicalGeo, copper);
    helicalMesh2.rotation.y = Math.PI; // Offset phase
    group.add(helicalMesh1);
    group.add(helicalMesh2);

    parts.push({
        name: "Harmonic Poloidal Coils",
        description: "Intricate helical windings that generate the secondary twist in the magnetic field, creating a magnetic bottle tight enough for a monopole.",
        material: "High-Purity Copper with Graphene Jacket",
        function: "Field stabilization and shaping.",
        assemblyOrder: 12,
        connections: ["Toroidal Coils", "Control Systems"],
        failureEffect: "Field rippling, allowing plasma leakage and localized melting of the containment wall.",
        cascadeFailures: ["Thermal shielding failure", "Sensor degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // --- High-Energy Proton Injectors ---
    const injectorGroup = new THREE.Group();
    const injectorDirections = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
        // Add diagonal injectors for extreme complexity
        new THREE.Vector3(1, 1, 1).normalize(), new THREE.Vector3(-1, -1, -1).normalize(),
        new THREE.Vector3(1, -1, 1).normalize(), new THREE.Vector3(-1, 1, -1).normalize()
    ];

    // Build a complex lathe geometry for the injector nozzle
    const points = [];
    for (let i = 0; i < 20; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.6 + (i * 0.1), i * 0.8));
    }
    const nozzleGeo = new THREE.LatheGeometry(points, 32);

    injectorDirections.forEach((dir, index) => {
        const injAssembly = new THREE.Group();
        
        const nozzle = new THREE.Mesh(nozzleGeo, darkSteel);
        nozzle.rotation.x = -Math.PI / 2; // Point along Z
        
        // Add focusing rings
        for (let j = 0; j < 5; j++) {
            const ringGeo = new THREE.TorusGeometry(1.5 + j * 0.2, 0.2, 16, 32);
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.position.z = j * 2 + 2;
            injAssembly.add(ring);
        }

        const acceleratorPipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);
        const acceleratorPipe = new THREE.Mesh(acceleratorPipeGeo, cryogenicSteel);
        acceleratorPipe.rotation.x = Math.PI / 2;
        acceleratorPipe.position.z = 10;
        
        injAssembly.add(nozzle);
        injAssembly.add(acceleratorPipe);

        // Position and orient the injector assembly to point AT the core
        injAssembly.position.copy(dir.clone().multiplyScalar(15));
        injAssembly.lookAt(new THREE.Vector3(0,0,0));

        injectorGroup.add(injAssembly);

        parts.push({
            name: `Linear Proton Accelerator Array ${index + 1}`,
            description: `High-luminosity proton beam injector. Accelerates raw hydrogen nuclei to 99.99% c before directing them into the monopole core.`,
            material: "Tungsten-Carbide / Superconducting RF Cavities",
            function: "Fuel injection for the Callan-Rubakov decay process.",
            assemblyOrder: 15 + index,
            connections: ["Plasma Feed Lines", "Coolant Network"],
            failureEffect: "Beam misalignment causing high-energy proton spray against the inner containment wall.",
            cascadeFailures: ["Wall ablation", "Vacuum loss", "Coil quench"],
            originalPosition: injAssembly.position.clone(),
            explodedPosition: injAssembly.position.clone().multiplyScalar(2.5)
        });
    });
    group.add(injectorGroup);

    // --- Structural Base Pedestal & Exhaust Matrix ---
    const baseGroup = new THREE.Group();
    
    // Hexagonal tiered base
    for (let i = 0; i < 4; i++) {
        const hexGeo = new THREE.CylinderGeometry(25 - i * 2, 26 - i * 2, 2, 6);
        const hexMesh = new THREE.Mesh(hexGeo, steel);
        hexMesh.position.y = -15 + i * 2;
        baseGroup.add(hexMesh);
    }

    // Exhaust / Energy Extraction Ports
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const portGeo = new THREE.CylinderGeometry(2, 3, 10, 16);
        const port = new THREE.Mesh(portGeo, darkSteel);
        port.rotation.z = Math.PI / 2;
        port.rotation.y = angle;
        port.position.set(Math.cos(angle) * 22, -13, Math.sin(angle) * 22);
        baseGroup.add(port);
        
        const innerGlow = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.8, 10.1, 16), plasmaBlue);
        innerGlow.rotation.copy(port.rotation);
        innerGlow.position.copy(port.position);
        baseGroup.add(innerGlow);
    }
    group.add(baseGroup);

    parts.push({
        name: "Hexa-Tier Subsurface Pedestal",
        description: "Massive vibration-damped foundation housing the positron collection cyclotrons and gamma-ray thermal exchangers.",
        material: "Reinforced Plasteel and Lead-Bismuth Eutectic Shielding",
        function: "Structural support and energy conversion.",
        assemblyOrder: 1,
        connections: ["Geological Bedrock", "Main Power Grid", "Coolant Pumps"],
        failureEffect: "Micro-fractures leading to misalignment of the entire 50,000-ton assembly.",
        cascadeFailures: ["Total system de-calibration"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    parts.push({
        name: "Positron Extraction Manifolds",
        description: "Radial ports that capture outgoing high-energy positrons using specifically angled magnetic mirrors, converting their kinetic energy to electrical power.",
        material: "Dark Steel / Plasma Field Generators",
        function: "Energy harvesting.",
        assemblyOrder: 5,
        connections: ["Base Pedestal", "Toroidal Coils"],
        failureEffect: "Positron backscatter, irradiating the lower facilities.",
        cascadeFailures: ["Electronics burnout", "Personnel hazard"],
        originalPosition: { x: 0, y: -13, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // --- Outer Geodesic Shielding Sphere ---
    const shieldGeo = new THREE.IcosahedronGeometry(35, 3);
    const shieldWire = new THREE.LineSegments(new THREE.WireframeGeometry(shieldGeo), new THREE.LineBasicMaterial({ color: 0x445566, transparent: true, opacity: 0.3 }));
    
    // Add glowing connection nodes to the geodesic sphere
    const nodeGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const nodeMesh = new THREE.InstancedMesh(nodeGeo, chrome, shieldGeo.attributes.position.count);
    const nodeDummy = new THREE.Object3D();
    for(let i=0; i<shieldGeo.attributes.position.count; i++) {
        nodeDummy.position.fromBufferAttribute(shieldGeo.attributes.position, i);
        nodeDummy.updateMatrix();
        nodeMesh.setMatrixAt(i, nodeDummy.matrix);
    }
    
    group.add(shieldWire);
    group.add(nodeMesh);

    parts.push({
        name: "Geodesic Dilaton Shielding Matrix",
        description: "Outer containment sphere comprised of interlocking sub-space dampening fields to prevent macroscopic vacuum decay during operation.",
        material: "Metamaterial / Chrono-Steel",
        function: "Ultimate fail-safe containment.",
        assemblyOrder: 30,
        connections: ["All Inner Systems"],
        failureEffect: "Exposure of the local universe to unmitigated baryon violation radiation.",
        cascadeFailures: ["Reality degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });


    // ============================================================================
    // 5. DIAGNOSTICS & SENSORS
    // ============================================================================
    
    const sensorGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sAssembly = new THREE.Group();
        
        const stalkGeo = new THREE.CylinderGeometry(0.2, 0.4, 25, 8);
        const stalk = new THREE.Mesh(stalkGeo, aluminum);
        stalk.position.y = 12.5;
        
        const headGeo = new THREE.BoxGeometry(2, 3, 2);
        const head = new THREE.Mesh(headGeo, plastic);
        head.position.y = 25;
        
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16), glass);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, 25, 1);
        
        sAssembly.add(stalk);
        sAssembly.add(head);
        sAssembly.add(lens);
        
        sAssembly.rotation.z = Math.PI / 4; // Tilt inwards
        sAssembly.rotation.y = angle;
        
        // Position them in a ring
        const r = 28;
        sAssembly.position.set(Math.cos(angle) * r, -10, Math.sin(angle) * r);
        
        sensorGroup.add(sAssembly);
    }
    group.add(sensorGroup);

    parts.push({
        name: "Baryon-Number Violation Sensor Array",
        description: "High-precision interferometric sensors designed to track the exact rate of proton decay and calibrate the monopole trap accordingly.",
        material: "Aluminum, Optical Glass, Quantum Sensor Grids",
        function: "Telemetry and reaction rate monitoring.",
        assemblyOrder: 28,
        connections: ["Base Pedestal", "Control AI"],
        failureEffect: "Blind operation of the reactor, leading to over-injection and prompt criticality.",
        cascadeFailures: ["Runaway decay chain", "Core breach"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ============================================================================
    // 6. QUIZ QUESTIONS
    // ============================================================================

    const quizQuestions = [
        {
            question: "What specific process allows a grand unified theory (GUT) magnetic monopole to catalyze the decay of a proton into a positron and a neutral pion?",
            options: [
                "The Callan-Rubakov effect",
                "The Schwinger mechanism",
                "Hawking radiation",
                "The Casimir effect"
            ],
            correctAnswer: 0,
            explanation: "The Callan-Rubakov effect describes how magnetic monopoles can catalyze baryon-number-violating processes, such as proton decay, with cross-sections typical of strong interactions, rather than the expected tiny GUT-scale suppressed cross-sections."
        },
        {
            question: "In the context of the minimal SU(5) Grand Unified Theory, what is the expected mass scale of a 't Hooft-Polyakov magnetic monopole?",
            options: [
                "~ 10^2 GeV",
                "~ 10^16 GeV",
                "~ 10^-3 eV",
                "Exactly 0 eV"
            ],
            correctAnswer: 1,
            explanation: "In GUTs like SU(5), monopoles are produced when the GUT symmetry spontaneously breaks to the Standard Model symmetries. Their mass is characterized by the symmetry breaking scale, typically around 10^16 GeV, making them macroscopic in mass compared to standard particles (about a microgram)."
        },
        {
            question: "According to the Dirac Quantization Condition, what is the fundamental relationship between electric charge (e) and magnetic charge (g)?",
            options: [
                "e * g = n * hbar * c / 2",
                "e / g = alpha",
                "e + g = 0",
                "e * g = c^2"
            ],
            correctAnswer: 0,
            explanation: "Paul Dirac showed that if even a single magnetic monopole exists anywhere in the universe, it forces all electric charge to be quantized. The condition is eg = n(hbar*c/2), where n is an integer."
        },
        {
            question: "Proton decay violates which of the following supposedly conserved quantities in the Standard Model?",
            options: [
                "Electric Charge",
                "Baryon Number",
                "Color Charge",
                "Angular Momentum"
            ],
            correctAnswer: 1,
            explanation: "Protons are the lightest baryons. For them to decay into lighter particles (like positrons and pions), Baryon Number (B) must be violated. Grand Unified Theories inherently allow for B violation."
        },
        {
            question: "What cosmological paradox, involving these supermassive topological defects, was a primary motivation for Alan Guth's theory of Cosmic Inflation?",
            options: [
                "The Horizon Problem",
                "The Flatness Problem",
                "The Monopole Problem",
                "The Antimatter Asymmetry Problem"
            ],
            correctAnswer: 2,
            explanation: "Standard Big Bang cosmology with GUT symmetry breaking predicted a massive overabundance of magnetic monopoles, which would have closed the universe immediately. Inflation dilutes their density to virtually zero, solving the Monopole Problem."
        }
    ];

    // ============================================================================
    // 7. ANIMATION AND CHAOS PHYSICS
    // ============================================================================

    // Variables for chaotic monopole movement (Lorenz Attractor)
    const lorenz = { x: 0.1, y: 0.1, z: 0.1 };
    const sigma = 10, rho = 28, beta = 8/3;
    const lorenzScale = 0.05; // Scale down the chaotic path to fit in the trap

    const description = "The Ultra God-Tier Magnetic Monopole Reactor. This pinnacle of engineering utilizes a captured GUT-scale 't Hooft-Polyakov monopole. By precisely directing beams of protons into the monopole's core, it exploits the Callan-Rubakov effect to catalyze proton decay. This utterly violates baryon number conservation, converting the mass of the protons entirely into high-energy positrons and pions (which rapidly decay into gamma rays), yielding 100% mass-to-energy conversion efficiency. Features a 100-Tesla D-shaped toroidal superconducting array, harmonic poloidal field coils, and a subspace dilaton geodesic containment shield.";

    let timeAccumulator = 0;
    let particleSpawnTimer = 0;

    function animate(time, speed, meshes) {
        const dt = 0.016 * speed; // Assuming 60fps base
        timeAccumulator += dt;

        // 1. Chaotic Monopole Movement (Lorenz Attractor step)
        // This simulates the quantum jitter of a confined monopole
        let dx = sigma * (lorenz.y - lorenz.x) * dt;
        let dy = (lorenz.x * (rho - lorenz.z) - lorenz.y) * dt;
        let dz = (lorenz.x * lorenz.y - beta * lorenz.z) * dt;
        lorenz.x += dx;
        lorenz.y += dy;
        lorenz.z += dz;
        
        // Apply to monopole mesh, offset z so it orbits origin
        monopoleGroup.position.set(
            lorenz.x * lorenzScale,
            lorenz.y * lorenzScale,
            (lorenz.z - rho) * lorenzScale 
        );

        // Pulse the core halo based on speed of monopole
        const velocity = Math.sqrt(dx*dx + dy*dy + dz*dz);
        coreHalo.scale.setScalar(1.0 + velocity * 0.1 * Math.sin(timeAccumulator * 20));
        trapCage.rotation.y += dt * 0.5;
        trapCage.rotation.x += dt * 0.3;

        // 2. Coil Pulses and Rotations
        toroidalCoilsGroup.children.forEach((coilAssm, index) => {
            // Pulse the cryogenic lines
            const cryo = coilAssm.children[1];
            cryo.material.opacity = 0.5 + 0.5 * Math.sin(timeAccumulator * 5 + index);
        });

        helicalMesh1.rotation.y = timeAccumulator * 0.2;
        helicalMesh2.rotation.y = timeAccumulator * 0.2 + Math.PI;

        // 3. Shield Matrix Rotation
        shieldWire.rotation.y -= dt * 0.05;
        shieldWire.rotation.z += dt * 0.02;
        nodeMesh.rotation.y -= dt * 0.05;
        nodeMesh.rotation.z += dt * 0.02;

        // 4. Injector Firing Logic
        particleSpawnTimer += dt;
        if (particleSpawnTimer > 0.05) { // Spawn protons rapidly
            particleSpawnTimer = 0;
            // Pick a random injector direction
            const dir = injectorDirections[Math.floor(Math.random() * injectorDirections.length)].clone();
            // Start position just inside the accelerator nozzle
            const startPos = dir.clone().multiplyScalar(14);
            // Velocity points exactly opposite to the direction (inwards)
            const vel = dir.clone().multiplyScalar(-30); 
            spawnProton(startPos, vel);
        }

        // 5. Update Particle Engine
        updateParticles(dt);
        
        // 6. Sensor Array Scanning
        sensorGroup.children.forEach((sensor, index) => {
            // Nodding motion to track the core
            sensor.rotation.x = Math.sin(timeAccumulator * 2 + index) * 0.1;
            sensor.children[2].material.emissiveIntensity = 0.5 + 0.5 * Math.cos(timeAccumulator * 10 + index);
        });

        // Handle Exploded View Positioning
        parts.forEach((part, index) => {
            if (part.name.includes("Linear Proton Accelerator Array")) {
                // Find corresponding injector
                const idx = part.assemblyOrder - 15;
                if (injectorGroup.children[idx]) {
                    const targetPos = new THREE.Vector3().lerpVectors(
                        part.originalPosition,
                        part.explodedPosition,
                        meshes.explodedGroup ? meshes.explodedGroup.userData.explosionProgress || 0 : 0
                    );
                    injectorGroup.children[idx].position.copy(targetPos);
                }
            } else if (part.name === "Primary Toroidal Superconducting Coils") {
                const progress = meshes.explodedGroup ? meshes.explodedGroup.userData.explosionProgress || 0 : 0;
                toroidalCoilsGroup.children.forEach((coil, cIdx) => {
                    const angle = (cIdx / numToroidal) * Math.PI * 2;
                    const expandVec = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(progress * 20);
                    coil.position.copy(expandVec);
                });
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
