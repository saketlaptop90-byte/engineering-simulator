import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD-TIER BRANE COSMOLOGY ENGINE
 * -------------------------------
 * This machine simulates the intricate dynamics of M-theory and Brane Cosmology.
 * It visualizes our 3-brane (the observable universe) and a parallel hidden 3-brane,
 * separated by a higher-dimensional bulk. The engine modulates the distance between
 * these branes, simulating Ekpyrotic collision scenarios, graviton leakage across
 * the bulk, and Calabi-Yau manifold compactification stabilization.
 * 
 * Features:
 * - Extremely high polygon count (Procedural geometries).
 * - Massive InstancedMeshes for Brane processing nodes and Gravitons.
 * - Complex procedural animations driven by multi-variable trigonometric functions.
 * - Hyper-realistic materials combined with emissive quantum phenomena.
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "The Brane Cosmology Engine (God Tier). An ultra-complex 11-dimensional hyper-structure translated into a 3D projection. It is designed to modulate the scalar distance between our 3-brane (the observable universe) and adjacent parallel branes within the bulk. It harvests graviton leakage, regulates string tension using Ekpyrotic core dynamics, and stabilizes Calabi-Yau compactifications to prevent catastrophic vacuum decay.";

    // -------------------------------------------------------------------------
    // CUSTOM HYPER-TECH MATERIALS
    // -------------------------------------------------------------------------
    const quantumGlass = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        transmission: 0.9,
        ior: 1.6,
        emissive: 0x0044ff,
        emissiveIntensity: 0.8
    });

    const voidMatter = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.9,
        metalness: 0.8,
        wireframe: false
    });

    const bulkEnergy = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 2.5,
        wireframe: true
    });

    const gravitonMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9
    });

    const hyperChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 2.0
    });

    const dangerEmissive = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 3.0,
        wireframe: false
    });
    
    const stringMatter = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // We reuse existing materials from the simulator too
    const baseSteel = steel;
    const baseDark = darkSteel;
    const baseCopper = copper;

    // -------------------------------------------------------------------------
    // HELPER: PART REGISTRATION
    // -------------------------------------------------------------------------
    function registerPart(name, desc, mat, func, order, conn, fail, cascade, origPos, explPos, meshObj) {
        meshObj.name = name;
        group.add(meshObj);
        parts.push({
            name: name,
            description: desc,
            material: mat,
            function: func,
            assemblyOrder: order,
            connections: conn,
            failureEffect: fail,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // -------------------------------------------------------------------------
    // PROCEDURAL GEOMETRY GENERATORS
    // -------------------------------------------------------------------------

    // Generate a massive Brane surface
    function createBraneSurface(isUpper) {
        const braneGroup = new THREE.Group();
        
        // Base plate
        const radius = 250;
        const baseGeom = new THREE.CylinderGeometry(radius, radius, 2, 64);
        const baseMesh = new THREE.Mesh(baseGeom, baseDark);
        braneGroup.add(baseMesh);

        // Grid lines (String web)
        const gridGeom = new THREE.PlaneGeometry(radius * 2, radius * 2, 50, 50);
        const gridMesh = new THREE.Mesh(gridGeom, bulkEnergy);
        gridMesh.rotation.x = Math.PI / 2;
        gridMesh.position.y = isUpper ? -1.1 : 1.1;
        
        // Distort grid slightly to simulate quantum fluctuations
        const posAttr = gridMesh.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const d = Math.sqrt(x*x + y*y);
            if (d > radius) {
                // flatten edges
                posAttr.setZ(i, 0);
            } else {
                posAttr.setZ(i, Math.sin(x/10) * Math.cos(y/10) * 2);
            }
        }
        gridMesh.geometry.computeVertexNormals();
        braneGroup.add(gridMesh);

        // Instanced Nodes (Hex Processors)
        const hexGeom = new THREE.CylinderGeometry(2, 2, 4, 6);
        const hexCount = 2000;
        const hexInstanced = new THREE.InstancedMesh(hexGeom, hyperChrome, hexCount);
        
        const dummy = new THREE.Object3D();
        let idx = 0;
        for (let i = 0; i < hexCount; i++) {
            const r = Math.random() * (radius - 5);
            const theta = Math.random() * Math.PI * 2;
            dummy.position.set(r * Math.cos(theta), isUpper ? -2 : 2, r * Math.sin(theta));
            const scale = Math.random() * 1.5 + 0.5;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.updateMatrix();
            hexInstanced.setMatrixAt(idx++, dummy.matrix);
        }
        braneGroup.add(hexInstanced);
        
        // Store for animation
        if (isUpper) {
            meshes.upperBraneNodes = hexInstanced;
            meshes.upperBraneGrid = gridMesh;
        } else {
            meshes.lowerBraneNodes = hexInstanced;
            meshes.lowerBraneGrid = gridMesh;
        }

        return braneGroup;
    }

    // Generate the Central Dimensional Pillar (The Bulk Strut)
    function createCentralPillar() {
        const pillarGroup = new THREE.Group();
        
        // Main Core
        const coreGeom = new THREE.CylinderGeometry(20, 20, 300, 32);
        const coreMesh = new THREE.Mesh(coreGeom, quantumGlass);
        pillarGroup.add(coreMesh);
        meshes.pillarCore = coreMesh;

        // Inner Helix
        const helixGeom = new THREE.TorusKnotGeometry(15, 2, 200, 16, 2, 30);
        const helixMesh = new THREE.Mesh(helixGeom, bulkEnergy);
        helixMesh.scale.set(1, 4, 1);
        pillarGroup.add(helixMesh);
        meshes.innerHelix = helixMesh;

        // Outer Casing Rings
        const ringGeom = new THREE.TorusGeometry(30, 3, 16, 64);
        const ringCount = 15;
        const ringsGroup = new THREE.Group();
        for (let i = 0; i < ringCount; i++) {
            const ring = new THREE.Mesh(ringGeom, baseSteel);
            ring.position.y = -140 + (i * 20);
            ring.rotation.x = Math.PI / 2;
            // Add detail to ring
            const lugGeom = new THREE.BoxGeometry(4, 4, 8);
            for(let j=0; j<8; j++){
                const lug = new THREE.Mesh(lugGeom, baseCopper);
                const angle = (j / 8) * Math.PI * 2;
                lug.position.set(30 * Math.cos(angle), 0, 30 * Math.sin(angle));
                lug.rotation.y = -angle;
                ring.add(lug);
            }
            ringsGroup.add(ring);
        }
        pillarGroup.add(ringsGroup);
        meshes.pillarRings = ringsGroup;

        // Vertical support struts
        for(let i=0; i<4; i++){
            const strutGeom = new THREE.CylinderGeometry(4, 4, 310, 16);
            const strut = new THREE.Mesh(strutGeom, baseDark);
            const angle = (i/4) * Math.PI * 2;
            strut.position.set(40 * Math.cos(angle), 0, 40 * Math.sin(angle));
            pillarGroup.add(strut);
        }

        return pillarGroup;
    }

    // Generate Calabi-Yau Manifold representations
    function createCalabiYau() {
        const cyGroup = new THREE.Group();
        
        // Complex intertwined torus knots
        const mat = stringMatter;
        const k1 = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 1.5, 128, 16, 3, 5), mat);
        const k2 = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 1.5, 128, 16, 4, 7), mat);
        const k3 = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 1.5, 128, 16, 5, 2), mat);
        
        k2.rotation.x = Math.PI / 2;
        k3.rotation.y = Math.PI / 2;

        cyGroup.add(k1, k2, k3);
        
        // Enclosing sphere
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(16, 32, 32), quantumGlass);
        cyGroup.add(sphere);

        return cyGroup;
    }

    // Generate Hydraulic/Energy Actuators
    function createActuator() {
        const actGroup = new THREE.Group();
        
        const baseGeom = new THREE.CylinderGeometry(8, 10, 50, 16);
        const base = new THREE.Mesh(baseGeom, baseDark);
        base.position.y = 25;
        actGroup.add(base);

        const pistonGeom = new THREE.CylinderGeometry(5, 5, 60, 16);
        const piston = new THREE.Mesh(pistonGeom, hyperChrome);
        piston.position.y = 55;
        actGroup.add(piston);

        const jointGeom = new THREE.SphereGeometry(7, 16, 16);
        const joint = new THREE.Mesh(jointGeom, baseCopper);
        joint.position.y = 85;
        actGroup.add(joint);

        return { group: actGroup, piston: piston, joint: joint };
    }

    // Generate the Graviton Particle System
    function createGravitons() {
        const count = 5000;
        const geom = new THREE.SphereGeometry(0.8, 8, 8);
        const instanced = new THREE.InstancedMesh(geom, gravitonMat, count);
        
        const dummy = new THREE.Object3D();
        const data = [];
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 400;
            const y = (Math.random() - 0.5) * 300;
            const z = (Math.random() - 0.5) * 400;
            
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            instanced.setMatrixAt(i, dummy.matrix);
            
            data.push({
                x, y, z,
                vy: (Math.random() - 0.5) * 2,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        meshes.gravitonData = data;
        meshes.gravitons = instanced;
        return instanced;
    }

    // -------------------------------------------------------------------------
    // ASSEMBLY OF THE GOD-TIER ENGINE
    // -------------------------------------------------------------------------

    // 1. Lower Brane Matrix
    const lowerBrane = createBraneSurface(false);
    meshes.lowerBrane = lowerBrane;
    registerPart(
        "Lower Brane Matrix (Our Universe)",
        "A hyper-scale representation of our observable 3-brane. It features billions of quantum processors that anchor the fundamental constants of the Standard Model. The surface topology is dynamically flat but subject to quantum fluctuations.",
        "Dark Steel, Bulk Energy, Hyper Chrome",
        "Anchors the lower boundary of the bulk space and hosts observable reality.",
        1,
        "Central Dimensional Pillar, Graviton Field",
        "Vacuum decay, complete collapse of the observable universe into a lower energy state.",
        "Annihilation of all baryonic matter, breakdown of spacetime geometry.",
        { x: 0, y: -150, z: 0 },
        { x: 0, y: -300, z: 0 },
        lowerBrane
    );

    // 2. Upper Brane Matrix
    const upperBrane = createBraneSurface(true);
    meshes.upperBrane = upperBrane;
    registerPart(
        "Upper Brane Matrix (The Hidden Sector)",
        "A parallel 3-brane existing in the higher-dimensional bulk. In the RS1 model, this could represent the Planck brane where gravity is strong, while our universe is the TeV brane. It is highly energetic and emits gravitons.",
        "Dark Steel, Bulk Energy, Hyper Chrome",
        "Generates the baseline string tension and gravitational flux that permeates across the bulk.",
        2,
        "Central Dimensional Pillar, Ekpyrotic Engine Core",
        "Uncontrollable brane collision (Big Crunch/Big Bang event).",
        "Reset of the multiverse cosmological constant.",
        { x: 0, y: 150, z: 0 },
        { x: 0, y: 300, z: 0 },
        upperBrane
    );

    // 3. Central Dimensional Pillar
    const centralPillar = createCentralPillar();
    registerPart(
        "Central Dimensional Pillar (The Bulk Strut)",
        "A colossal structure spanning the 5th dimension (the bulk). It acts as a physical and energetic bridge between the two branes, stabilizing their separation distance (the radion field).",
        "Quantum Glass, Base Steel, Bulk Energy",
        "Maintains and modulates the scalar distance between the branes, preventing premature Ekpyrotic collisions.",
        3,
        "Lower Brane, Upper Brane, Calabi-Yau Cores",
        "Radion field destabilization.",
        "The branes would attract each other uncontrollably, leading to a multiverse-ending collision.",
        { x: 0, y: 0, z: 0 },
        { x: 500, y: 0, z: 0 },
        centralPillar
    );

    // 4 & 5. Calabi-Yau Spatial Compressors
    const cyCore1 = createCalabiYau();
    meshes.cyCore1 = cyCore1;
    registerPart(
        "Calabi-Yau Spatial Compressor Alpha",
        "A physical manifestation of a compactified 6-dimensional Calabi-Yau manifold. It traps and stabilizes the extra dimensions required by Superstring Theory (10D) and M-Theory (11D).",
        "String Matter, Quantum Glass",
        "Compacts excess spatial dimensions into microscopic scales.",
        4,
        "Central Dimensional Pillar",
        "Decompactification of extra dimensions.",
        "The universe would suddenly become 10-dimensional, destroying all 3D physical laws and chemistry.",
        { x: -100, y: 0, z: 0 },
        { x: -300, y: 0, z: -200 },
        cyCore1
    );

    const cyCore2 = createCalabiYau();
    meshes.cyCore2 = cyCore2;
    registerPart(
        "Calabi-Yau Spatial Compressor Beta",
        "The sister manifold to Alpha, providing chiral symmetry breaking and generating the necessary flux to stabilize the moduli of the compactification.",
        "String Matter, Quantum Glass",
        "Stabilizes the shape and size moduli (Kähler and Complex Structure moduli) of the extra dimensions.",
        5,
        "Central Dimensional Pillar",
        "Moduli destabilization.",
        "Fundamental constants (like the fine-structure constant or electron mass) would fluctuate wildly across space.",
        { x: 100, y: 0, z: 0 },
        { x: 300, y: 0, z: 200 },
        cyCore2
    );

    // 6-9. Inter-brane Strut Actuators (Hydraulics)
    meshes.actuators = [];
    for(let i=0; i<4; i++){
        const act = createActuator();
        const angle = (i/4) * Math.PI * 2;
        const radius = 150;
        act.group.position.set(radius * Math.cos(angle), -150, radius * Math.sin(angle));
        
        meshes.actuators.push({
            piston: act.piston,
            joint: act.joint,
            baseY: -150
        });

        registerPart(
            `Inter-brane Strut Actuator 0${i+1}`,
            "Massive dimensional hydraulic systems that physically push or pull the branes. They operate using exotic matter fluids that defy standard pressure-volume laws.",
            "Dark Steel, Hyper Chrome, Copper",
            "Fine-tunes the brane separation distance dynamically.",
            6 + i,
            "Lower Brane, Upper Brane",
            "Actuator failure leads to asymmetric brane tilting.",
            "Gravitational anomalies and localized tearing of the spacetime continuum.",
            { x: act.group.position.x, y: act.group.position.y, z: act.group.position.z },
            { x: act.group.position.x * 2, y: act.group.position.y - 100, z: act.group.position.z * 2 },
            act.group
        );
    }

    // 10. Graviton Confinement Field Generator
    const gFieldGeom = new THREE.TorusGeometry(180, 5, 64, 64);
    const gField = new THREE.Mesh(gFieldGeom, dangerEmissive);
    gField.rotation.x = Math.PI / 2;
    meshes.gField = gField;
    registerPart(
        "Graviton Confinement Field Generator",
        "A highly energetic ring that generates a magnetic-like confinement field for closed strings (gravitons), preventing them from leaking completely into the bulk.",
        "Danger Emissive",
        "Maintains the strength of gravity on the Lower Brane by bounding graviton trajectories.",
        10,
        "Lower Brane",
        "Field collapse.",
        "Gravity on our brane would exponentially decay as gravitons dissipate into the 5th dimension, causing galaxies and planets to fly apart.",
        { x: 0, y: -100, z: 0 },
        { x: 0, y: -400, z: 0 },
        gField
    );

    // 11-14. Bulk Energy Harvesters
    meshes.harvesters = [];
    for(let i=0; i<4; i++){
        const harvGroup = new THREE.Group();
        const hGeom = new THREE.OctahedronGeometry(20, 0);
        const hMesh = new THREE.Mesh(hGeom, quantumGlass);
        harvGroup.add(hMesh);
        
        const coreGeom = new THREE.SphereGeometry(10, 16, 16);
        const coreMesh = new THREE.Mesh(coreGeom, bulkEnergy);
        harvGroup.add(coreMesh);

        const angle = (i/4) * Math.PI * 2 + (Math.PI/4);
        const radius = 200;
        harvGroup.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
        
        meshes.harvesters.push(harvGroup);

        registerPart(
            `Bulk Energy Harvester 0${i+1}`,
            "Extracts zero-point energy directly from the quantum foam of the higher-dimensional bulk to power the cosmology engine.",
            "Quantum Glass, Bulk Energy",
            "Provides infinite power via 11-dimensional vacuum energy.",
            11 + i,
            "Central Dimensional Pillar",
            "Energy overload and detonation.",
            "Creation of a localized false vacuum bubble that expands at the speed of light.",
            { x: harvGroup.position.x, y: harvGroup.position.y, z: harvGroup.position.z },
            { x: harvGroup.position.x * 2.5, y: 0, z: harvGroup.position.z * 2.5 },
            harvGroup
        );
    }

    // 15. Graviton Particle System
    const gravitons = createGravitons();
    registerPart(
        "Graviton Particle Flow",
        "A visible manifestation of closed strings (gravitons) propagating through the bulk. Unlike open strings which are attached to the branes (forming standard matter and gauge bosons), gravitons are free to traverse the extra dimensions.",
        "Graviton Material",
        "Mediates gravitational force across the multiverse.",
        15,
        "Everywhere",
        "Graviton stalling.",
        "Cessation of gravitational attraction.",
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1000, z: 0 },
        gravitons
    );

    // 16. String Tension Modulator Array
    const modulatorGroup = new THREE.Group();
    for(let i=0; i<8; i++){
        const modGeom = new THREE.BoxGeometry(10, 80, 10);
        const mod = new THREE.Mesh(modGeom, baseCopper);
        const angle = (i/8) * Math.PI * 2;
        mod.position.set(70 * Math.cos(angle), 100, 70 * Math.sin(angle));
        mod.lookAt(0, 100, 0);
        modulatorGroup.add(mod);
    }
    meshes.modulators = modulatorGroup;
    registerPart(
        "String Tension Modulator Array",
        "Adjusts the fundamental tension of superstrings ($\\alpha'$), directly influencing the mass spectrum of all elementary particles.",
        "Copper, Steel",
        "Prevents the string length scale from approaching the macroscopic scale.",
        16,
        "Upper Brane",
        "Tension relaxation.",
        "Electrons and quarks would expand to the size of baseballs.",
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 400, z: 0 },
        modulatorGroup
    );

    // 17. Ekpyrotic Engine Core
    const ekpyroticGeom = new THREE.DodecahedronGeometry(40, 2);
    const ekpyrotic = new THREE.Mesh(ekpyroticGeom, dangerEmissive);
    ekpyrotic.position.y = 180;
    meshes.ekpyrotic = ekpyrotic;
    registerPart(
        "Ekpyrotic Engine Core",
        "The primary driver of brane kinematics. It simulates the conditions of the pre-Big Bang universe according to the Ekpyrotic model, generating the force necessary to push the branes apart after a collision.",
        "Danger Emissive",
        "Generates repulsive bulk forces.",
        17,
        "Upper Brane Matrix",
        "Premature ignition.",
        "A localized Big Bang event inside the engine.",
        { x: 0, y: 180, z: 0 },
        { x: 0, y: 600, z: 0 },
        ekpyrotic
    );

    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS (PhD Level String Theory / M-Theory)
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of the Randall-Sundrum (RS1) model, how does the warped geometry of the $AdS_5$ bulk address the hierarchy problem?",
            options: [
                "By exponentially redshifting the vacuum expectation value of the Higgs field on the visible (TeV) brane relative to the Planck brane.",
                "By compactifying the extra dimensions into a Calabi-Yau manifold, which cancels the large quantum corrections to the Higgs mass.",
                "By introducing a massless graviton that only interacts with the hidden brane, decoupling gravity from the Standard Model.",
                "By utilizing string dualities (T-duality) to equate the high-energy and low-energy limits of the gravitational coupling constant."
            ],
            correctAnswer: 0,
            explanation: "In the RS1 model, the metric contains a warp factor $e^{-2kr_c \\phi}$. This exponential warp factor scales down mass parameters from the Planck scale on the hidden brane to the TeV scale on the visible brane, elegantly solving the hierarchy problem without requiring supersymmetry."
        },
        {
            question: "In M-theory, which extended objects are considered fundamental, replacing the 1-dimensional strings of perturbative string theory?",
            options: [
                "M2-branes and M5-branes.",
                "D-branes and NS5-branes.",
                "O-planes and Fundamental strings (F-strings).",
                "Only 11-dimensional supergravity backgrounds."
            ],
            correctAnswer: 0,
            explanation: "M-theory in 11 dimensions contains two fundamental extended objects: the 2-dimensional M2-brane and its magnetic dual, the 5-dimensional M5-brane. Type IIA strings can be derived by wrapping an M2-brane over the compactified 11th dimension."
        },
        {
            question: "The Ekpyrotic universe scenario models the Big Bang as a collision between two branes. What is a key cosmological prediction of this model regarding the primordial density perturbations?",
            options: [
                "They are nearly scale-invariant and purely Gaussian, generated by a phase of accelerated expansion (inflation).",
                "They are scale-invariant and generated by quantum fluctuations in a contracting phase prior to the brane collision.",
                "They are highly blue-tilted and dominated by primordial tensor modes (gravitational waves).",
                "They are completely suppressed, requiring topological defects (like cosmic strings) to form galactic structure."
            ],
            correctAnswer: 1,
            explanation: "The Ekpyrotic model provides an alternative to inflation. It generates scale-invariant perturbations during a slow contracting phase (prior to the 'bounce' or collision) rather than during an exponentially expanding phase. A key signature distinguishing it from inflation is the near absence of primordial gravitational waves (tensor modes)."
        },
        {
            question: "Which of the following describes the mechanism of moduli stabilization in the KKLT (Kachru-Kallosh-Linde-Trivedi) construction?",
            options: [
                "Background fluxes stabilize complex structure moduli and the dilaton, while non-perturbative effects (like gaugino condensation) stabilize the Kähler moduli, followed by an uplift to a de Sitter vacuum using anti-D3 branes.",
                "D-branes wrap all cycles of the Calabi-Yau manifold, freezing all geometric deformations classically via their massive tension.",
                "The bulk cosmological constant is set to exactly zero, and the branes are stabilized by unbroken $\\mathcal{N}=8$ supergravity.",
                "T-duality relates the momentum and winding modes of strings, fixing the overall volume of the compactification to the string scale."
            ],
            correctAnswer: 0,
            explanation: "The KKLT mechanism is a famous procedure to construct metastable de Sitter vacua in string theory. It first uses fluxes to freeze the dilaton and complex structure moduli (yielding a supersymmetric AdS vacuum), then incorporates non-perturbative effects (Euclidean D-branes or gaugino condensation) to fix the Kähler moduli, and finally adds anti-D3 branes to 'uplift' the vacuum energy to a positive value (de Sitter space)."
        },
        {
            question: "The AdS/CFT correspondence provides a holographic duality between theories. In the most well-known form of Maldacena's conjecture, what is the precise duality?",
            options: [
                "Type IIB string theory on an $AdS_5 \\times S^5$ background is exactly dual to $\\mathcal{N}=4$ Supersymmetric Yang-Mills theory in 4 dimensions.",
                "11-dimensional supergravity on $AdS_4 \\times S^7$ is dual to a 2-dimensional conformal field theory.",
                "Heterotic string theory on a Calabi-Yau 3-fold is dual to a 3-dimensional Chern-Simons theory.",
                "Type IIA string theory is dual to M-theory compactified on a circle of radius $R$."
            ],
            correctAnswer: 0,
            explanation: "The seminal paper by Juan Maldacena proposed that Type IIB string theory formulated on the product space $AdS_5 \\times S^5$ (Anti-de Sitter space crossed with a 5-sphere) is mathematically equivalent (dual) to the $\\mathcal{N}=4$ supersymmetric Yang-Mills gauge theory defined on the 4-dimensional boundary of the $AdS_5$ space. This is the cornerstone of gauge/gravity duality."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // 1. Brane Oscillation (Radion field fluctuation)
        // The branes move closer and further apart periodically
        const distanceModulation = Math.sin(t * 0.5) * 50;
        if(meshes.upperBrane) meshes.upperBrane.position.y = 150 + distanceModulation;
        if(meshes.lowerBrane) meshes.lowerBrane.position.y = -150 - distanceModulation;

        // 2. Calabi-Yau Rotations
        // Complex multi-axis rotation simulating higher-dimensional tumbling
        if(meshes.cyCore1) {
            meshes.cyCore1.rotation.x = t * 0.5;
            meshes.cyCore1.rotation.y = t * 0.7;
            meshes.cyCore1.rotation.z = t * 0.3;
        }
        if(meshes.cyCore2) {
            meshes.cyCore2.rotation.x = -t * 0.4;
            meshes.cyCore2.rotation.y = t * 0.8;
            meshes.cyCore2.rotation.z = -t * 0.6;
        }

        // 3. Central Pillar Helix Animation
        // Simulates energy flowing up and down the bulk strut
        if(meshes.innerHelix) {
            meshes.innerHelix.rotation.y = t * 2.0;
        }

        // 4. Actuator Hydraulics
        // Piston rods must extend and retract to match the brane positions
        if(meshes.actuators) {
            const currentLowerY = -150 - distanceModulation;
            const currentUpperY = 150 + distanceModulation;
            const totalDistance = currentUpperY - currentLowerY;
            
            meshes.actuators.forEach((act, i) => {
                // Base is attached to lower brane
                const phase = i * Math.PI / 2;
                // Piston extends to reach upper brane
                const extension = (totalDistance - 300) / 2; // base offset
                act.piston.position.y = 55 + extension;
                act.piston.scale.y = 1 + (extension / 60);
                act.joint.position.y = 55 + extension + (30 * act.piston.scale.y);
            });
        }

        // 5. Graviton Particle Flow
        // Particles move from upper brane to lower brane (leakage)
        if(meshes.gravitons && meshes.gravitonData) {
            const dummy = new THREE.Object3D();
            const upperY = 150 + distanceModulation;
            const lowerY = -150 - distanceModulation;
            
            for (let i = 0; i < meshes.gravitonData.length; i++) {
                let p = meshes.gravitonData[i];
                // Move down
                p.y -= 2 * speed + Math.sin(t * 5 + p.phase) * 0.5;
                
                // Add some chaotic bulk drift
                p.x += Math.sin(t * 2 + p.phase) * 0.5;
                p.z += Math.cos(t * 2 + p.phase) * 0.5;

                // Reset to top if they hit the bottom brane
                if (p.y < lowerY) {
                    p.y = upperY;
                    p.x = (Math.random() - 0.5) * 400;
                    p.z = (Math.random() - 0.5) * 400;
                }

                dummy.position.set(p.x, p.y, p.z);
                
                // Scale pulse
                const s = 1 + Math.sin(t * 10 + p.phase) * 0.5;
                dummy.scale.set(s, s, s);
                
                dummy.updateMatrix();
                meshes.gravitons.setMatrixAt(i, dummy.matrix);
            }
            meshes.gravitons.instanceMatrix.needsUpdate = true;
        }

        // 6. Bulk Energy Harvesters
        // Orbit around the central pillar and spin
        if(meshes.harvesters) {
            meshes.harvesters.forEach((harv, i) => {
                const angle = (i/4) * Math.PI * 2 + (t * 0.5);
                const radius = 200 + Math.sin(t * 2 + i) * 20;
                harv.position.set(radius * Math.cos(angle), Math.sin(t*3 + i)*20, radius * Math.sin(angle));
                harv.rotation.x += 0.05 * speed;
                harv.rotation.y += 0.07 * speed;
            });
        }

        // 7. Grid Fluctuation (Brane surface distortion)
        // Modifies the Z-coordinates of the plane geometry to simulate quantum foam
        [meshes.upperBraneGrid, meshes.lowerBraneGrid].forEach((grid, idx) => {
            if(grid) {
                const posAttr = grid.geometry.attributes.position;
                const timeOffset = t * 2 + (idx * 10);
                for (let i = 0; i < posAttr.count; i++) {
                    const x = posAttr.getX(i);
                    const y = posAttr.getY(i);
                    const d = Math.sqrt(x*x + y*y);
                    if (d < 240) {
                        const z = Math.sin(x/15 + timeOffset) * Math.cos(y/15 + timeOffset) * 4;
                        posAttr.setZ(i, z);
                    }
                }
                posAttr.needsUpdate = true;
                grid.geometry.computeVertexNormals();
            }
        });

        // 8. Ekpyrotic Core Pulsing
        if(meshes.ekpyrotic) {
            const scale = 1 + Math.sin(t * 8) * 0.1;
            meshes.ekpyrotic.scale.set(scale, scale, scale);
            meshes.ekpyrotic.rotation.y = t * 1.5;
            meshes.ekpyrotic.rotation.z = Math.sin(t) * 0.5;
        }

        // 9. Graviton Confinement Field Ring rotation
        if(meshes.gField) {
            meshes.gField.rotation.z = -t;
            const s = 1 + Math.sin(t * 5) * 0.02;
            meshes.gField.scale.set(s, s, s);
        }

        // 10. String Tension Modulators
        if(meshes.modulators) {
            meshes.modulators.rotation.y = t * 0.2;
            meshes.modulators.children.forEach((child, i) => {
                child.position.y = 100 + Math.sin(t * 4 + i) * 20;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
