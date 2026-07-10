import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.1 });
    const neonMagenta = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.1 });
    const glowingCoreMat = new THREE.MeshStandardMaterial({ color: 0x5500ff, emissive: 0x3300ff, emissiveIntensity: 6, transparent: true, opacity: 0.9, wireframe: true });
    const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Perfectly black
    const accretionDiskMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 4, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const quantumFoamMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x8888ff, emissive: 0x2222ff, emissiveIntensity: 1.5, 
        transparent: true, opacity: 0.7, transmission: 0.95, roughness: 0.05, ior: 2.5 
    });
    const virtualParticleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const spaceTearMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const controlScreenMat = new THREE.MeshStandardMaterial({ color: 0x002200, emissive: 0x00ff00, emissiveIntensity: 1.2 });
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
    const heavySteelMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.6 });

    // ==========================================
    // LORE & DESCRIPTION
    // ==========================================
    const description = "The God Tier Planck Scale Microscope (Project OMEGA-SIGHT) is an ultra god-tier scientific instrument designed to peer beyond the fabric of standard model physics. By utilizing a stabilized, synthetically generated micro-singularity, the device harnesses extreme gravitational lensing to magnify the foundational graininess of spacetime itself. At its focal point lies the Quantum Foam Observation Chamber, where the seething, chaotic nature of the vacuum is made visible. Virtual particles pop in and out of existence, and space itself occasionally tears, requiring the Spacetime Stitcher Array to rapidly repair the manifold. Only those with a profound understanding of M-Theory and quantum gravity can even begin to comprehend the readouts.";

    // ==========================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the device's event horizon lens, how does the synthetic micro-black hole avoid rapid evaporation via Hawking radiation while maintaining a stable focal length?",
            options: [
                "By continuous injection of negative-mass tachyons to balance the mass-energy loss.",
                "By surrounding it with a perfectly reflective mirrored sphere (a Wheeler-Feynman cavity) that feeds the radiation back into the singularity.",
                "By entangling its event horizon with a macroscopic white hole in a parallel manifold.",
                "By utilizing the Hawking-Penrose stabilized loop metric, where angular momentum exactly cancels the evaporative thermal emission."
            ],
            correctAnswer: 1,
            explanation: "While exotic, the Wheeler-Feynman cavity approach (a microscopic Dyson sphere for Hawking radiation) ensures that the energy radiated is perfectly re-absorbed, maintaining the singularity's mass and therefore its gravitational focal length without requiring continuous external mass injection, which would destabilize the optical path."
        },
        {
            question: "When observing the bubbling quantum foam, the microscope utilizes a 'Tachyon Illuminator'. According to string theory constraints, why must tachyons be used rather than standard photons?",
            options: [
                "Photons lack the necessary energy density to resolve structures at 1.6 x 10^-35 meters.",
                "Tachyons propagate backward in time, allowing the observer to view the virtual particles before they mutually annihilate.",
                "The target space is a 10-dimensional Calabi-Yau manifold where standard gauge bosons like photons are confined to D-branes, whereas tachyons can propagate through the bulk.",
                "Tachyons have imaginary mass, which perfectly couples to the imaginary energy of the virtual vacuum fluctuations."
            ],
            correctAnswer: 2,
            explanation: "In brane cosmology models derived from M-theory, Standard Model particles (including photons) are stuck on a 3-brane. To probe the fundamental structure of the bulk spacetime and its extra dimensions, one must use a hypothetical particle not constrained to the brane, such as a bulk-propagating closed string (like a graviton) or specific tachyonic excitations."
        },
        {
            question: "The 'Spacetime Stitcher Array' repairs localized false-vacuum tears. What physical mechanism does it employ to 'stitch' the metric tensor back together?",
            options: [
                "It injects high-energy gluons to bind the torn edges of the space-time fabric.",
                "It generates localized regions of extreme negative energy density (exotic matter) to flatten the divergent curvature singularities.",
                "It rapidly oscillates the cosmological constant locally to induce a mini-inflationary epoch, smoothing out the tear.",
                "It utilizes a concentrated beam of hypothetical gravitinos to stabilize the supersymmetric vacuum state."
            ],
            correctAnswer: 1,
            explanation: "A 'tear' in spacetime implies a curvature singularity or a localized topological defect. In General Relativity, stabilizing wormholes or preventing curvature singularities often requires exotic matter with negative energy density to violate the Null Energy Condition and counteract the run-away gravitational collapse or topological tearing."
        },
        {
            question: "If the microscopic singularity breached containment, the Chronal Displacement Safeguard activates. What is the theoretical basis for 'rolling back time by 1 Planck time'?",
            options: [
                "Inducing a localized closed timelike curve (CTC) via a rapidly spinning Tipler cylinder mechanism wrapping the containment unit.",
                "Reversing the entropy of the isolated system using an array of Maxwell's Demons operating at the Landauer limit.",
                "Utilizing the AdS/CFT correspondence to map the breach to a lower-dimensional boundary and simply deleting the boundary data.",
                "Flipping the direction of the CPT symmetry locally, effectively reversing the arrow of time for the localized particles."
            ],
            correctAnswer: 0,
            explanation: "In General Relativity, a rapidly spinning, infinitely long cylinder (a Tipler cylinder) can create frame-dragging effects so extreme that light cones tip over, allowing for closed timelike curves. A highly advanced, localized synthetic equivalent could theoretically allow the system's state to propagate backward along its own worldline just long enough to activate secondary containment."
        },
        {
            question: "The data output of the microscope maps the 11-dimensional framework of M-theory. What mathematical object is primarily used by the Holographic Data Matrix to project this into 3D?",
            options: [
                "Riemann zeta functions.",
                "Octonionic projective geometry and Fano planes.",
                "Non-commutative topological algebraic K-theory.",
                "E8 x E8 exceptional Lie group representations mapped onto a 3D Poincare section."
            ],
            correctAnswer: 3,
            explanation: "String theory, particularly heterotic string theory (a major component of M-theory), relies heavily on the E8 x E8 gauge group to describe its fundamental symmetries. To visualize this in 3D, one would take a Poincare section or lower-dimensional slice of the high-dimensional representation space of these exceptional Lie groups."
        }
    ];

    // ==========================================
    // PART REGISTRY HELPER
    // ==========================================
    function registerPart(name, desc, mat, func, order, conns, failure, cascade, origPos, explPos, mesh) {
        parts.push({
            name: name,
            description: desc,
            material: mat,
            function: func,
            assemblyOrder: order,
            connections: conns,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
        mesh.userData.partName = name;
        mesh.userData.originalPosition = new THREE.Vector3(origPos.x, origPos.y, origPos.z);
        mesh.position.copy(mesh.userData.originalPosition);
        group.add(mesh);
    }

    // ==========================================
    // 1. PRIMARY BASE PLATE
    // ==========================================
    const baseGroup = new THREE.Group();
    const baseShape = new THREE.Shape();
    // Complex octagonal star base
    const numPoints = 16;
    for(let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = i % 2 === 0 ? 35 : 25;
        if(i === 0) baseShape.moveTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
        else baseShape.lineTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
    }
    baseShape.lineTo(35, 0);

    // Cutouts
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 10, 0, Math.PI * 2, false);
    baseShape.holes.push(holePath);

    const baseExtrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    // Rotate to lie flat
    baseGeo.rotateX(-Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    
    registerPart(
        'Primary Base Plate', 
        'The foundational stage made of dark steel, anchoring the microscopic reality warping field.', 
        'darkSteel', 
        'Provides a stable platform for the microscope and houses the anti-gravity generators.', 
        1, ['Vibration Dampening Struts', 'Cooling Manifold Complex'], 
        'Catastrophic structural collapse, leading to singularity containment failure.', 
        ['magnetic_confinement_toroid_alpha', 'singularity_core_housing'], 
        {x: 0, y: -25, z: 0}, {x: 0, y: -50, z: 0}, 
        baseMesh
    );

    // ==========================================
    // 2. VIBRATION DAMPENING STRUTS (HYDRAULICS)
    // ==========================================
    const strutsGroup = new THREE.Group();
    meshes.pistons = [];
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 20;
        const z = Math.sin(angle) * 20;

        const cylinderOuter = new THREE.CylinderGeometry(2, 2, 10, 16);
        const strutOuter = new THREE.Mesh(cylinderOuter, steel);
        strutOuter.position.set(x, 5, z);
        
        const cylinderInner = new THREE.CylinderGeometry(1, 1, 12, 16);
        const strutInner = new THREE.Mesh(cylinderInner, chrome);
        strutInner.position.set(0, 6, 0); // Relative to outer
        strutOuter.add(strutInner);
        
        // Add intricate springs around the inner cylinder
        const springPath = new THREE.Curve();
        springPath.getPoint = function (t, optionalTarget = new THREE.Vector3()) {
            const y = t * 10 - 5;
            const r = 1.5;
            const theta = t * Math.PI * 20; // 10 coils
            return optionalTarget.set(Math.cos(theta)*r, y, Math.sin(theta)*r);
        };
        const springGeo = new THREE.TubeGeometry(springPath, 100, 0.2, 8, false);
        const springMesh = new THREE.Mesh(springGeo, copper);
        springMesh.position.set(0, 6, 0);
        strutOuter.add(springMesh);

        meshes.pistons.push(strutInner);
        strutsGroup.add(strutOuter);
    }
    registerPart(
        'Vibration Dampening Struts', 'Harmonic oscillators using negative-mass fluid to negate seismic events on Earth.', 'steel, chrome, copper',
        'Isolates the quantum foam observation chamber from all macroscopic vibrations.', 2, ['Primary Base Plate', 'Main Support Frame'],
        'Jitter in the image resolution, rendering the Planck-scale data useless.', [],
        {x: 0, y: -20, z: 0}, {x: 0, y: -30, z: 0}, strutsGroup
    );

    // ==========================================
    // 3. MAIN SUPPORT FRAME
    // ==========================================
    const frameGroup = new THREE.Group();
    const framePoints = [];
    for(let i=0; i<=20; i++) {
        framePoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 5 + 15, i * 2 - 10));
    }
    const frameGeo = new THREE.LatheGeometry(framePoints, 32);
    const frameMesh = new THREE.Mesh(frameGeo, aluminum);
    
    // Add intricate cutouts/details to frame
    for(let i=0; i<8; i++) {
        const detailGeo = new THREE.BoxGeometry(4, 30, 4);
        const detailMesh = new THREE.Mesh(detailGeo, darkSteel);
        const angle = (i/8)*Math.PI*2;
        detailMesh.position.set(Math.cos(angle)*16, 10, Math.sin(angle)*16);
        detailMesh.rotation.y = -angle;
        frameGroup.add(detailMesh);
    }
    frameGroup.add(frameMesh);
    registerPart(
        'Main Support Frame', 'Heavy lathed aluminum frame with dark steel bracing.', 'aluminum, darkSteel',
        'Supports the magnetic confinement and optical assembly.', 3, ['Vibration Dampening Struts', 'Magnetic Confinement Toroid Alpha'],
        'Sagging of the optical path, misaligning the singularity lens.', ['event_horizon_lens_upper'],
        {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 30}, frameGroup
    );

    // ==========================================
    // 4 & 5. MAGNETIC CONFINEMENT TOROIDS
    // ==========================================
    const toroidGeo = new THREE.TorusGeometry(12, 2, 32, 100);
    const toroidAlpha = new THREE.Mesh(toroidGeo, neonCyan);
    toroidAlpha.rotation.x = Math.PI/2;
    meshes.toroidAlpha = toroidAlpha;
    registerPart(
        'Magnetic Confinement Toroid Alpha', 'First stage containment for the singularity.', 'neonCyan',
        'Generates an immense magnetic bottle to hold the micro-black hole.', 4, ['Main Support Frame', 'Singularity Core Housing'],
        'Loss of containment.', ['Singularity Core Housing'],
        {x: 0, y: 15, z: 0}, {x: -20, y: 15, z: 0}, toroidAlpha
    );

    const toroidBeta = new THREE.Mesh(toroidGeo, neonMagenta);
    toroidBeta.rotation.x = Math.PI/2;
    // Add greebles to toroid beta
    for(let i=0; i<16; i++){
        const nodeGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeo, chrome);
        const angle = (i/16)*Math.PI*2;
        nodeMesh.position.set(Math.cos(angle)*12, Math.sin(angle)*12, 0);
        toroidBeta.add(nodeMesh);
    }
    meshes.toroidBeta = toroidBeta;
    registerPart(
        'Magnetic Confinement Toroid Beta', 'Second stage containment, counter-rotating.', 'neonMagenta, chrome',
        'Stabilizes the magnetic bottle against plasma instabilities.', 5, ['Magnetic Confinement Toroid Alpha', 'Singularity Core Housing'],
        'Plasma leakage, extreme radiation hazard.', ['operator_command_console'],
        {x: 0, y: 20, z: 0}, {x: 20, y: 20, z: 0}, toroidBeta
    );

    // ==========================================
    // 6. SINGULARITY CORE HOUSING
    // ==========================================
    const housingPoints = [];
    for(let i=0; i<=20; i++) {
        housingPoints.push(new THREE.Vector2(Math.sin(i * 0.15) * 8, i * 0.5 - 5));
    }
    const housingGeo = new THREE.LatheGeometry(housingPoints, 64);
    const housingMesh = new THREE.Mesh(housingGeo, glowingCoreMat);
    // Add protective cage
    const cageGeo = new THREE.IcosahedronGeometry(10, 1);
    const cageMesh = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({color: 0x111111, wireframe: true, wireframeLinewidth: 2}));
    housingMesh.add(cageMesh);
    registerPart(
        'Singularity Core Housing', 'The heavily shielded shell holding the artificial micro-black hole.', 'glowingCoreMat',
        'Protects the outside world from the raw gravitational and radiative power of the singularity.', 6, ['Magnetic Confinement Toroid Beta', 'Black Hole Lens System'],
        'Instantaneous spaghettification of the laboratory.', ['Everything'],
        {x: 0, y: 17.5, z: 0}, {x: 0, y: 17.5, z: -30}, housingMesh
    );

    // ==========================================
    // 7. BLACK HOLE LENS SYSTEM & ACCRETION DISK
    // ==========================================
    const bhGroup = new THREE.Group();
    const bhGeo = new THREE.SphereGeometry(2, 64, 64);
    const bhMesh = new THREE.Mesh(bhGeo, blackHoleMat);
    bhGroup.add(bhMesh);

    const diskGeo = new THREE.RingGeometry(3, 8, 64);
    const diskMesh = new THREE.Mesh(diskGeo, accretionDiskMat);
    diskMesh.rotation.x = -Math.PI / 2;
    bhGroup.add(diskMesh);
    meshes.accretionDisk = diskMesh;

    // Lensing artifact rings (visual only)
    const lensRingGeo = new THREE.TorusGeometry(5, 0.1, 16, 100);
    const lensRingMesh = new THREE.Mesh(lensRingGeo, new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}));
    bhGroup.add(lensRingMesh);
    meshes.lensRing = lensRingMesh;

    registerPart(
        'Black Hole Lens System', 'Focuses the gravitational lensing effect downwards onto the sample.', 'blackHoleMat, accretionDiskMat',
        'Acts as the primary objective lens, warping spacetime to magnify Planck-scale objects.', 7, ['Singularity Core Housing', 'Event Horizon Lens Lower'],
        'Loss of optical focus, resulting in a view of random background cosmic radiation.', [],
        {x: 0, y: 17.5, z: 0}, {x: 0, y: 40, z: 0}, bhGroup
    );

    // ==========================================
    // 8. COOLING MANIFOLD COMPLEX
    // ==========================================
    const coolingGroup = new THREE.Group();
    meshes.coolingPipes = [];
    for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2;
        const radius1 = 12 + Math.random() * 5;
        const radius2 = 4 + Math.random() * 2;
        const height1 = -10 + Math.random() * 10;
        const height2 = 15 + Math.random() * 10;
        
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle) * 30, height1, Math.sin(angle) * 30),
            new THREE.Vector3(Math.cos(angle) * radius1, height1 + 10, Math.sin(angle) * radius1),
            new THREE.Vector3(Math.cos(angle+0.2) * radius2, height2, Math.sin(angle+0.2) * radius2),
            new THREE.Vector3(Math.cos(angle) * 8, 20, Math.sin(angle) * 8)
        ]);
        const tubeGeo = new THREE.TubeGeometry(path, 32, 0.3 + Math.random()*0.2, 8, false);
        const pipeMat = i % 3 === 0 ? copper : (i % 3 === 1 ? aluminum : rubber);
        const tubeMesh = new THREE.Mesh(tubeGeo, pipeMat);
        coolingGroup.add(tubeMesh);
        meshes.coolingPipes.push(tubeMesh);
    }
    registerPart(
        'Cooling Manifold Complex', 'Hundreds of pipes circulating liquid helium and exotic superfluids.', 'copper, aluminum, rubber',
        'Prevents the entire apparatus from melting down due to Hawking radiation and magnetic resistance.', 8, ['Primary Base Plate', 'Magnetic Confinement Toroid Alpha'],
        'Thermal runaway and subsequent explosion.', ['Singularity Core Housing'],
        {x: 0, y: 0, z: 0}, {x: 40, y: 0, z: 0}, coolingGroup
    );

    // ==========================================
    // 9. QUANTUM FOAM OBSERVATION CHAMBER
    // ==========================================
    const chamberGroup = new THREE.Group();
    
    // Outer glass sphere
    const glassChamberGeo = new THREE.SphereGeometry(6, 32, 32);
    const glassChamberMesh = new THREE.Mesh(glassChamberGeo, glass);
    chamberGroup.add(glassChamberMesh);

    // Quantum foam mesh
    const foamGeo = new THREE.IcosahedronGeometry(4, 8); // High detail for manipulation
    const foamMesh = new THREE.Mesh(foamGeo, quantumFoamMat);
    // Store original vertices for animation
    foamMesh.userData.originalPositions = new Float32Array(foamGeo.attributes.position.array);
    chamberGroup.add(foamMesh);
    meshes.quantumFoam = foamMesh;

    registerPart(
        'Quantum Foam Observation Chamber', 'A specialized vacuum chamber suspended in an anti-gravity well.', 'glass, quantumFoamMat',
        'The focal point where the seething, chaotic nature of the vacuum is magnified and made visible.', 9, ['Black Hole Lens System', 'Virtual Particle Illuminator'],
        'Vacuum decay cascade.', ['Everything'],
        {x: 0, y: 40, z: 0}, {x: 0, y: 60, z: 0}, chamberGroup
    );

    // ==========================================
    // 10. VIRTUAL PARTICLE ILLUMINATOR
    // ==========================================
    // Particle system inside the chamber
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const virtualParticles = new THREE.Points(particleGeo, virtualParticleMat);
    meshes.virtualParticles = virtualParticles;

    registerPart(
        'Virtual Particle Illuminator', 'High-energy tachyon beam that makes virtual particles flash in the visible spectrum.', 'virtualParticleMat',
        'Illuminates the transient pairs of particles and anti-particles popping in and out of the vacuum.', 10, ['Quantum Foam Observation Chamber'],
        'Inability to see anything in the chamber.', [],
        {x: 0, y: 40, z: 0}, {x: -20, y: 60, z: 0}, virtualParticles
    );

    // ==========================================
    // 11. SPACETIME STITCHER ARRAY
    // ==========================================
    const stitcherGroup = new THREE.Group();
    const needleGeo = new THREE.ConeGeometry(0.5, 10, 16);
    // Pointing inwards to the chamber
    for(let i=0; i<12; i++) {
        const needleMesh = new THREE.Mesh(needleGeo, chrome);
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        const x = Math.cos(theta) * Math.sin(phi) * 10;
        const y = Math.sin(theta) * Math.sin(phi) * 10;
        const z = Math.cos(phi) * 10;
        needleMesh.position.set(x, y, z);
        needleMesh.lookAt(0,0,0);
        needleMesh.rotateX(Math.PI/2);
        stitcherGroup.add(needleMesh);
    }

    // Space tearing lines
    const tearCount = 50;
    const tearGeo = new THREE.BufferGeometry();
    const tearPos = new Float32Array(tearCount * 2 * 3); // line segments
    tearGeo.setAttribute('position', new THREE.BufferAttribute(tearPos, 3));
    const spaceTears = new THREE.LineSegments(tearGeo, spaceTearMat);
    stitcherGroup.add(spaceTears);
    meshes.spaceTears = spaceTears;

    registerPart(
        'Spacetime Stitcher Array', 'A safety mechanism to prevent microscopic false-vacuum collapse or localized tears.', 'chrome, spaceTearMat',
        'Injects exotic matter to rapidly repair localized metric anomalies.', 11, ['Quantum Foam Observation Chamber'],
        'Macroscopic space tear, swallowing the laboratory into a pocket dimension.', ['Everything'],
        {x: 0, y: 40, z: 0}, {x: 20, y: 60, z: 0}, stitcherGroup
    );

    // ==========================================
    // 12. OPERATOR COMMAND CONSOLE
    // ==========================================
    const consoleGroup = new THREE.Group();
    
    // Main desk
    const deskGeo = new THREE.BoxGeometry(25, 2, 15);
    const deskMesh = new THREE.Mesh(deskGeo, heavySteelMat);
    deskMesh.position.set(0, 5, 0);
    consoleGroup.add(deskMesh);
    
    // Desk supports
    const legGeo = new THREE.CylinderGeometry(1, 1, 10, 16);
    const leg1 = new THREE.Mesh(legGeo, darkSteel); leg1.position.set(-10, 0, -5); consoleGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, darkSteel); leg2.position.set(10, 0, -5); consoleGroup.add(leg2);
    const leg3 = new THREE.Mesh(legGeo, darkSteel); leg3.position.set(-10, 0, 5); consoleGroup.add(leg3);
    const leg4 = new THREE.Mesh(legGeo, darkSteel); leg4.position.set(10, 0, 5); consoleGroup.add(leg4);

    // Massive curved monitor array
    const monitorGeo = new THREE.CylinderGeometry(12, 12, 8, 32, 1, true, -Math.PI/3, Math.PI/1.5);
    const monitorMesh = new THREE.Mesh(monitorGeo, controlScreenMat);
    monitorMesh.position.set(0, 12, -8);
    // Add grid helper to simulate UI
    const gridHelper = new THREE.GridHelper(20, 20, 0x00ff00, 0x00ff00);
    gridHelper.rotation.x = Math.PI/2;
    gridHelper.position.set(0, 0, 11);
    monitorMesh.add(gridHelper);
    consoleGroup.add(monitorMesh);

    // Holographic Data Matrix projector
    const projectorGeo = new THREE.SphereGeometry(1, 16, 16);
    const projectorMesh = new THREE.Mesh(projectorGeo, neonCyan);
    projectorMesh.position.set(0, 6.5, 0);
    consoleGroup.add(projectorMesh);

    const holoMatrixGeo = new THREE.IcosahedronGeometry(4, 2);
    const holoMatrixMesh = new THREE.Mesh(holoMatrixGeo, new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5}));
    holoMatrixMesh.position.set(0, 15, 0);
    consoleGroup.add(holoMatrixMesh);
    meshes.holoMatrix = holoMatrixMesh;

    // Controls (Buttons, Joysticks)
    for(let i=0; i<20; i++) {
        const btnGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const btnMat = Math.random() > 0.5 ? neonMagenta : (Math.random() > 0.5 ? neonCyan : new THREE.MeshStandardMaterial({color: 0xff0000}));
        const btnMesh = new THREE.Mesh(btnGeo, btnMat);
        btnMesh.position.set(-8 + Math.random()*16, 6.25, -2 + Math.random()*6);
        consoleGroup.add(btnMesh);
    }
    // Joystick
    const joyBaseGeo = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    const joyBase = new THREE.Mesh(joyBaseGeo, chrome);
    joyBase.position.set(8, 6.25, 2);
    const joyStickGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const joyStick = new THREE.Mesh(joyStickGeo, darkSteel);
    joyStick.position.set(0, 1.5, 0);
    joyStick.rotation.x = 0.2;
    const joyKnob = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), plastic);
    joyKnob.position.set(0, 1.5, 0);
    joyStick.add(joyKnob);
    joyBase.add(joyStick);
    consoleGroup.add(joyBase);

    // Operator Chair
    const chairGroup = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(6, 1, 6);
    const seatMesh = new THREE.Mesh(seatGeo, rubber);
    chairGroup.add(seatMesh);
    const backGeo = new THREE.BoxGeometry(6, 8, 1);
    const backMesh = new THREE.Mesh(backGeo, rubber);
    backMesh.position.set(0, 4.5, 3);
    chairGroup.add(backMesh);
    const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 16), chrome);
    chairPole.position.set(0, -3, 0);
    chairGroup.add(chairPole);
    chairGroup.position.set(0, 5, 10);
    consoleGroup.add(chairGroup);

    registerPart(
        'Operator Command Console', 'Where the brave physicist attempts to parse reality.', 'heavySteelMat, controlScreenMat, neonCyan',
        'Provides telemetry, control over the singularity, and holographic rendering of the 11-dimensional data.', 12, ['Holographic Data Matrix', 'Entanglement Anchors'],
        'Operator loses control, unable to activate chronal safeguard.', ['Chronal Displacement Safeguard'],
        {x: 0, y: -20, z: 50}, {x: 0, y: -20, z: 80}, consoleGroup
    );

    // ==========================================
    // 13. TACHYON EXHAUST STACKS
    // ==========================================
    const exhaustGroup = new THREE.Group();
    for(let i=-1; i<=1; i+=2) {
        for(let j=-1; j<=1; j+=2) {
            const stackGeo = new THREE.CylinderGeometry(2, 3, 25, 16);
            const stackMesh = new THREE.Mesh(stackGeo, darkSteel);
            stackMesh.position.set(i*15, 10, j*15);
            // Rings around stack
            for(let k=0; k<5; k++) {
                const ringGeo = new THREE.TorusGeometry(3.5, 0.5, 16, 32);
                const ringMesh = new THREE.Mesh(ringGeo, chrome);
                ringMesh.position.set(0, -10 + k*5, 0);
                ringMesh.rotation.x = Math.PI/2;
                stackMesh.add(ringMesh);
            }
            exhaustGroup.add(stackMesh);
        }
    }
    registerPart(
        'Tachyon Exhaust Stacks', 'Vents for faster-than-light particle waste.', 'darkSteel, chrome',
        'Expels dangerous exotic particles away from the operator into the upper atmosphere.', 13, ['Cooling Manifold Complex'],
        'Temporal radiation poisoning.', [],
        {x: 0, y: 10, z: 0}, {x: 0, y: 10, z: -50}, exhaustGroup
    );

    // ==========================================
    // 14. CHRONAL DISPLACEMENT SAFEGUARD
    // ==========================================
    const chronalGroup = new THREE.Group();
    const gearPoints = [];
    for(let i=0; i<36; i++) {
        const angle = (i/36)*Math.PI*2;
        const radius = i%2===0 ? 10 : 8;
        gearPoints.push(new THREE.Vector2(Math.cos(angle)*radius, Math.sin(angle)*radius));
    }
    const gearShape = new THREE.Shape(gearPoints);
    const gearGeo = new THREE.ExtrudeGeometry(gearShape, {depth: 2, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5});
    
    meshes.gears = [];
    for(let i=0; i<3; i++) {
        const gearMesh = new THREE.Mesh(gearGeo, i===1 ? copper : steel);
        gearMesh.position.set(-25, 30 + i*5, -20);
        gearMesh.rotation.x = Math.PI/2;
        // Offset rotation for interlocking
        if(i%2!==0) {
            gearMesh.position.x += 18.5;
            gearMesh.position.z += 0;
            gearMesh.rotation.z = Math.PI/36;
        } else if (i===2) {
            gearMesh.position.x += 18.5*2;
        }
        chronalGroup.add(gearMesh);
        meshes.gears.push(gearMesh);
    }
    registerPart(
        'Chronal Displacement Safeguard', 'A macroscopic Tipler cylinder mechanism linked to massive gears.', 'steel, copper',
        'Rolls back time by 1 Planck time if the singularity breaches containment, giving automated systems a chance to re-stabilize.', 14, ['Main Support Frame'],
        'Complete obliteration of the current timeline in the localized region.', [],
        {x: 0, y: 0, z: 0}, {x: -40, y: 30, z: -20}, chronalGroup
    );

    // ==========================================
    // 15. LASER INTERFEROMETER ARMS
    // ==========================================
    const laserGroup = new THREE.Group();
    // Huge arms extending outward like LIGO
    const armGeo = new THREE.BoxGeometry(4, 4, 100);
    const arm1 = new THREE.Mesh(armGeo, aluminum);
    arm1.position.set(50, 5, 0);
    const arm2 = new THREE.Mesh(armGeo, aluminum);
    arm2.position.set(0, 5, 50);
    arm2.rotation.y = Math.PI/2;
    
    // Internal laser beams
    const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 100, 16);
    const beam1 = new THREE.Mesh(beamGeo, laserMat);
    beam1.rotation.x = Math.PI/2;
    arm1.add(beam1);
    const beam2 = new THREE.Mesh(beamGeo, laserMat);
    beam2.rotation.x = Math.PI/2;
    arm2.add(beam2);

    laserGroup.add(arm1);
    laserGroup.add(arm2);
    
    registerPart(
        'Laser Interferometer Arms', 'Miniaturized gravitational wave detectors.', 'aluminum, laserMat',
        'Calibrates the spatial distortion caused by the black hole lens to sub-proton accuracy.', 15, ['Primary Base Plate'],
        'Microscopic blurring due to uncompensated background gravitational waves.', [],
        {x: 0, y: -20, z: 0}, {x: 50, y: -20, z: 50}, laserGroup
    );

    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, meshes) => {
        // time is continuous seconds
        const t = time * speed;

        // 1. Magnetic Confinement
        if (meshes.toroidAlpha) {
            meshes.toroidAlpha.rotation.z = t * 2.5;
            meshes.toroidAlpha.material.emissiveIntensity = 2.5 + Math.sin(t * 10) * 1.5;
        }
        if (meshes.toroidBeta) {
            meshes.toroidBeta.rotation.z = -t * 3.2;
            meshes.toroidBeta.rotation.y = Math.sin(t * 2) * 0.2; // Wobble
            meshes.toroidBeta.material.emissiveIntensity = 2.5 + Math.cos(t * 12) * 1.5;
        }

        // 2. Black Hole & Accretion Disk
        if (meshes.accretionDisk) {
            meshes.accretionDisk.rotation.z = -t * 25.0; // extremely fast spin
            meshes.accretionDisk.material.emissiveIntensity = 4 + Math.sin(t * 30) * 2;
        }
        if (meshes.lensRing) {
            meshes.lensRing.rotation.x = t * 0.5;
            meshes.lensRing.rotation.y = t * 0.7;
            const scale = 1 + Math.sin(t * 5) * 0.1;
            meshes.lensRing.scale.set(scale, scale, scale);
        }

        // 3. Quantum Foam (The most complex animation)
        if (meshes.quantumFoam) {
            meshes.quantumFoam.rotation.x = t * 0.3;
            meshes.quantumFoam.rotation.y = t * 0.4;
            
            const positions = meshes.quantumFoam.geometry.attributes.position;
            const original = meshes.quantumFoam.userData.originalPositions;
            
            for (let i = 0; i < positions.count; i++) {
                const ox = original[i * 3];
                const oy = original[i * 3 + 1];
                const oz = original[i * 3 + 2];
                
                // Extremely complex 3D noise approximation using intersecting high-frequency sine waves
                // This simulates the "boiling" graininess of Planck-scale spacetime
                const noise = Math.sin(ox * 5 + t * 8) * Math.cos(oy * 5 + t * 7) * Math.sin(oz * 5 + t * 9);
                const noise2 = Math.cos(ox * 12 - t * 15) * Math.sin(oy * 12 - t * 13); // High frequency detail
                
                const totalDistortion = (noise * 0.2) + (noise2 * 0.05);
                
                positions.setXYZ(
                    i,
                    ox + ox * totalDistortion,
                    oy + oy * totalDistortion,
                    oz + oz * totalDistortion
                );
            }
            positions.needsUpdate = true;
        }

        // 4. Virtual Particles (Tachyon Illuminator)
        if (meshes.virtualParticles) {
            const pos = meshes.virtualParticles.geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                // Particles "decay" and pop out of existence, instantly respawning elsewhere
                if (Math.random() < 0.08 * speed) {
                    pos.setXYZ(
                        i,
                        (Math.random() - 0.5) * 7,
                        (Math.random() - 0.5) * 7, 
                        (Math.random() - 0.5) * 7
                    );
                }
                // High energy jitter
                pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 0.3 * speed);
                pos.setY(i, pos.getY(i) + (Math.random() - 0.5) * 0.3 * speed);
                pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.3 * speed);
            }
            pos.needsUpdate = true;
        }

        // 5. Spacetime Tearing (Stitcher Array)
        if (meshes.spaceTears) {
            const pos = meshes.spaceTears.geometry.attributes.position;
            for (let i = 0; i < pos.count; i+=2) {
                // Randomly create a bright tear in spacetime
                if (Math.random() < 0.05 * speed) {
                    const startX = (Math.random() - 0.5) * 10;
                    const startY = (Math.random() - 0.5) * 10;
                    const startZ = (Math.random() - 0.5) * 10;
                    pos.setXYZ(i, startX, startY, startZ);
                    // The tear is a jagged line
                    pos.setXYZ(i+1, startX + (Math.random() - 0.5)*3, startY + (Math.random() - 0.5)*3, startZ + (Math.random() - 0.5)*3);
                }
            }
            pos.needsUpdate = true;
            meshes.spaceTears.material.opacity = 0.3 + Math.random() * 0.7; // Flickering
        }

        // 6. Holographic Data Matrix
        if (meshes.holoMatrix) {
            meshes.holoMatrix.rotation.x = t;
            meshes.holoMatrix.rotation.y = t * 1.5;
            const s = 1 + Math.sin(t * 10) * 0.2;
            meshes.holoMatrix.scale.set(s, s, s);
        }

        // 7. Chronal Safeguard Gears
        if (meshes.gears) {
            meshes.gears.forEach((gear, idx) => {
                const dir = idx % 2 === 0 ? 1 : -1;
                gear.rotation.z = t * dir * 0.5;
            });
        }

        // 8. Vibration Dampening Pistons
        if (meshes.pistons) {
            meshes.pistons.forEach((piston, idx) => {
                // Simulating counter-acting seismic waves
                piston.position.y = 6 + Math.sin(t * 15 + idx) * 0.8;
            });
        }
        
        // 9. Cooling Pipes subtle pulsing
        if (meshes.coolingPipes) {
            meshes.coolingPipes.forEach((pipe, idx) => {
                // Scale thickness slightly to simulate extreme pressure pulsing
                const s = 1 + Math.sin(t * 5 + idx) * 0.05;
                pipe.scale.set(s, 1, s); // Assuming TubeGeometry along Y axis mostly, though it curves. Scale uniformly for weird effect.
            });
        }
    };

    return { group, parts, description, quizQuestions, animate };
}
