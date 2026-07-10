import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ----------------------------------------------------------------------------------
    // CUSTOM HYPER-TECH MATERIALS
    // ----------------------------------------------------------------------------------
    const exoticMatterMat = new THREE.MeshStandardMaterial({
        color: 0x8a2be2, 
        emissive: 0x4a00e0, 
        emissiveIntensity: 3.5,
        roughness: 0.2, 
        metalness: 1.0, 
        wireframe: false, 
        transparent: true, 
        opacity: 0.95
    });

    const tachyonConduitMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc, 
        emissive: 0x00faac, 
        emissiveIntensity: 4.0,
        roughness: 0.1, 
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
    });

    const hyperSteelMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a24,
        roughness: 0.4,
        metalness: 0.9,
        envMapIntensity: 1.5,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2
    });

    const warningNeonMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 5.0,
        roughness: 0.3,
        metalness: 0.8
    });

    const screenMat = new THREE.MeshBasicMaterial({
        color: 0x0044ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const pureEnergyMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });

    // ----------------------------------------------------------------------------------
    // SHADERS FOR POCKET UNIVERSE BUBBLE (EXTREME COMPLEXITY)
    // ----------------------------------------------------------------------------------
    const bubbleVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        // 3D Simplex Noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0);
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vUv = uv;
            vNormal = normal;
            vPosition = position;
            float noise = snoise(position * 2.0 + time * 0.5);
            vec3 newPosition = position + normal * noise * 1.5; // High displacement for chaotic bubble
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `;

    const bubbleFragmentShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;

        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 mixColor = mix(colorA, colorB, sin(vPosition.y * 5.0 + time) * 0.5 + 0.5);
            vec3 finalColor = mixColor * intensity * 3.0;
            gl_FragColor = vec4(finalColor, 0.9);
        }
    `;

    const bubbleUniforms = {
        time: { value: 0.0 },
        colorA: { value: new THREE.Color(0xff00ff) },
        colorB: { value: new THREE.Color(0x00ffff) }
    };

    const shaderMat = new THREE.ShaderMaterial({
        vertexShader: bubbleVertexShader,
        fragmentShader: bubbleFragmentShader,
        uniforms: bubbleUniforms,
        transparent: true,
        side: THREE.DoubleSide
    });

    // ----------------------------------------------------------------------------------
    // GEOMETRY GENERATION
    // ----------------------------------------------------------------------------------

    // --- 1. BASE PLATFORM (Massive Hexagonal Plinth) ---
    const baseGroup = new THREE.Group();
    const hexShape = new THREE.Shape();
    const size = 30;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        if (i === 0) hexShape.moveTo(Math.cos(angle) * size, Math.sin(angle) * size);
        else hexShape.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
    }
    hexShape.closePath();
    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const baseGeo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, hyperSteelMat);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -10;
    baseGroup.add(baseMesh);

    // Base Greebles and Vents
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI/6;
        const ventGeo = new THREE.BoxGeometry(8, 2, 8);
        const vent = new THREE.Mesh(ventGeo, darkSteel);
        vent.position.set(Math.cos(angle) * 20, -5, Math.sin(angle) * 20);
        vent.lookAt(0, -5, 0);
        baseGroup.add(vent);
    }
    group.add(baseGroup);

    // --- 2. GRAVITON PILLARS & HYDRAULIC ACTUATORS ---
    const pillarsGroup = new THREE.Group();
    meshes.pistons = [];
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const radius = 22;
        
        // Main Pillar
        const pillarGeo = new THREE.CylinderGeometry(2, 3, 25, 16);
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.position.set(Math.cos(angle) * radius, 2.5, Math.sin(angle) * radius);
        pillarsGroup.add(pillar);

        // Hydraulic Piston
        const pistonBaseGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        const pistonBase = new THREE.Mesh(pistonBaseGeo, chrome);
        pistonBase.position.set(Math.cos(angle) * (radius - 5), -2.5, Math.sin(angle) * (radius - 5));
        
        const pistonArmGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
        const pistonArm = new THREE.Mesh(pistonArmGeo, steel);
        pistonArm.position.y = 10;
        pistonBase.add(pistonArm);
        
        pillarsGroup.add(pistonBase);
        meshes.pistons.push(pistonArm); // For animation
    }
    group.add(pillarsGroup);

    // --- 3. EXOTIC MATTER RINGS (Gyroscope Arrays) ---
    const ringGroup = new THREE.Group();
    meshes.rings = [];
    const ringConfig = [
        { rad: 18, tube: 1.5, speed: 0.02, axis: new THREE.Vector3(1,0,0), mat: exoticMatterMat, lugs: 64 },
        { rad: 15, tube: 1.2, speed: -0.03, axis: new THREE.Vector3(0,1,0), mat: steel, lugs: 48 },
        { rad: 12, tube: 1.0, speed: 0.04, axis: new THREE.Vector3(0,0,1), mat: exoticMatterMat, lugs: 36 },
        { rad: 9, tube: 0.8, speed: -0.05, axis: new THREE.Vector3(1,1,0).normalize(), mat: chrome, lugs: 24 }
    ];

    ringConfig.forEach((cfg, idx) => {
        const rGroup = new THREE.Group();
        const rGeo = new THREE.TorusGeometry(cfg.rad, cfg.tube, 32, 100);
        const rMesh = new THREE.Mesh(rGeo, cfg.mat);
        rGroup.add(rMesh);

        // Add Lugs
        const lugGeo = new THREE.BoxGeometry(cfg.tube*2.5, cfg.tube*0.5, cfg.tube*2.5);
        for(let l=0; l<cfg.lugs; l++) {
            const lAngle = (l / cfg.lugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, idx % 2 === 0 ? darkSteel : warningNeonMat);
            lug.position.set(Math.cos(lAngle) * cfg.rad, Math.sin(lAngle) * cfg.rad, 0);
            lug.rotation.z = lAngle;
            rGroup.add(lug);
        }

        rGroup.userData = { axis: cfg.axis, speed: cfg.speed };
        meshes.rings.push(rGroup);
        if (idx === 0) ringGroup.add(rGroup);
        else meshes.rings[idx-1].add(rGroup);
    });
    ringGroup.position.y = 15;
    group.add(ringGroup);

    // --- 4. TACHYON CONDUIT (Energy Beams) ---
    meshes.beams = [];
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
    for(let i=0; i<4; i++) {
        const beam = new THREE.Mesh(beamGeo, tachyonConduitMat);
        beam.position.set((i%2===0?1:-1)*12, 15, (i<2?1:-1)*12);
        beam.lookAt(0, 15, 0);
        beam.rotation.x = Math.PI/2;
        group.add(beam);
        meshes.beams.push(beam);
    }

    // --- 5. SPACETIME GRID LATTICE (Extreme Complexity) ---
    // Represents the fabric of spacetime being pulled into the core
    const stGeo = new THREE.BufferGeometry();
    const stCount = 25; // 25x25 grid
    const stSize = 50;
    const stPositions = new Float32Array(stCount * stCount * 3);
    const stOriginal = new Float32Array(stCount * stCount * 3);
    const stIndices = [];

    for(let i=0; i<stCount; i++) {
        for(let j=0; j<stCount; j++) {
            const idx = (i * stCount + j) * 3;
            const x = (i / (stCount-1) - 0.5) * stSize;
            const z = (j / (stCount-1) - 0.5) * stSize;
            const y = 15; // Grid plane height aligned with core
            
            stPositions[idx] = x;
            stPositions[idx+1] = y;
            stPositions[idx+2] = z;
            
            stOriginal[idx] = x;
            stOriginal[idx+1] = y;
            stOriginal[idx+2] = z;

            if (i < stCount-1 && j < stCount-1) {
                const a = i * stCount + j;
                const b = i * stCount + (j+1);
                const c = (i+1) * stCount + j;
                const d = (i+1) * stCount + (j+1);
                // Lines for lattice
                stIndices.push(a, b, a, c, b, d, c, d);
            }
        }
    }
    stGeo.setAttribute('position', new THREE.BufferAttribute(stPositions, 3));
    stGeo.setIndex(stIndices);
    const stMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
    const stMesh = new THREE.LineSegments(stGeo, stMat);
    stMesh.userData = { original: stOriginal };
    meshes.spacetimeGrid = stMesh;
    group.add(stMesh);

    // --- 6. POCKET UNIVERSE BUBBLE CORE ---
    const coreGeo = new THREE.SphereGeometry(6, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeo, shaderMat);
    coreMesh.position.y = 15;
    group.add(coreMesh);
    meshes.core = coreMesh;

    // --- 7. CONTROL CABIN AND OBSERVER DECK ---
    const cabinGroup = new THREE.Group();
    
    // Cabin Body
    const cabinGeo = new THREE.BoxGeometry(10, 8, 10);
    const cabin = new THREE.Mesh(cabinGeo, hyperSteelMat);
    cabinGroup.add(cabin);

    // Window
    const windowGeo = new THREE.PlaneGeometry(8, 4);
    const winMesh = new THREE.Mesh(windowGeo, tinted);
    winMesh.position.set(0, 1, 5.1);
    cabinGroup.add(winMesh);

    // Screens inside
    const screenGroup = new THREE.Group();
    const scnGeo = new THREE.PlaneGeometry(2, 1.5);
    for(let i=0; i<3; i++) {
        const scn = new THREE.Mesh(scnGeo, screenMat);
        scn.position.set((i-1)*2.5, 1, 4.9);
        scn.rotation.y = Math.PI; // Face inwards
        screenGroup.add(scn);
    }
    cabinGroup.add(screenGroup);

    // Ladder
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 20);
    const rail1 = new THREE.Mesh(railGeo, steel); rail1.position.x = -1;
    const rail2 = new THREE.Mesh(railGeo, steel); rail2.position.x = 1;
    ladderGroup.add(rail1, rail2);
    const rungGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    for(let r=-9; r<9; r+=1.5) {
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.position.y = r;
        rung.rotation.z = Math.PI/2;
        ladderGroup.add(rung);
    }
    ladderGroup.position.set(4, -10, -5.1);
    cabinGroup.add(ladderGroup);

    cabinGroup.position.set(0, -2, 25);
    group.add(cabinGroup);

    // --- 8. SUBATOMIC PARTICLE ACCELERATOR TUBES ---
    const accelGroup = new THREE.Group();
    const accelGeo = new THREE.TorusGeometry(28, 0.5, 16, 128);
    for(let i=0; i<3; i++) {
        const accel = new THREE.Mesh(accelGeo, copper);
        accel.position.y = 5 + i*10;
        accel.rotation.x = Math.PI/2;
        accelGroup.add(accel);
    }
    group.add(accelGroup);


    // ----------------------------------------------------------------------------------
    // PARTS ARRAY FOR INTERACTIVITY & EXPLOSION VIEW
    // ----------------------------------------------------------------------------------
    
    parts.push({
        name: "Quantum_Base_Manifold",
        description: "A colossal hexagonal plinth constructed from Hyper-Steel. It serves as the primary grounding point, absorbing stray Hawking radiation and preventing the localized dimensional tear from propagating into the surrounding bulk.",
        material: "HyperSteelMat",
        function: "Structural grounding and dimensional stabilization.",
        assemblyOrder: 1,
        connections: ["Graviton_Generators", "Cooling_Pipes_Subsystem"],
        failureEffect: "Spacetime unzips locally, dumping the facility into a 5D bulk space.",
        cascadeFailures: ["Entire Facility Annihilation"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    parts.push({
        name: "Temporal_Distortion_Plinth",
        description: "The core platform locking the base structure to the local temporal reference frame, ensuring the laboratory doesn't age at a different rate than the pocket universe.",
        material: "Steel / DarkSteel",
        function: "Locks the local arrow of time.",
        assemblyOrder: 2,
        connections: ["Quantum_Base_Manifold"],
        failureEffect: "Extreme localized time dilation. Operators may age centuries in seconds.",
        cascadeFailures: ["Control_Cabin_Module"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 20 }
    });

    parts.push({
        name: "Gravity_Inversion_Ring_Alpha",
        description: "The outermost exotic matter torus. Generates a massive negative energy density field via Casimir-effect analogs, fulfilling the weak energy condition violation necessary to pinch off spacetime.",
        material: "ExoticMatterMat",
        function: "Generates primary negative spacetime curvature.",
        assemblyOrder: 3,
        connections: ["Gravity_Inversion_Ring_Beta", "Hydraulic_Pistons"],
        failureEffect: "Pocket universe collapses immediately into a micro black hole.",
        cascadeFailures: ["Pocket_Dimension_Bubble_Core"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 50, y: 15, z: 0 }
    });

    parts.push({
        name: "Gravity_Inversion_Ring_Beta",
        description: "Secondary nested torus. Counter-rotates to cancel macroscopic angular momentum, preventing the formation of closed timelike curves (CTCs) near the event horizon.",
        material: "Steel / Neon Lugs",
        function: "Angular momentum cancellation (Kerr metric nullification).",
        assemblyOrder: 4,
        connections: ["Gravity_Inversion_Ring_Alpha", "Gravity_Inversion_Ring_Gamma"],
        failureEffect: "Formation of closed timelike curves. Causality violations within the lab.",
        cascadeFailures: ["Temporal_Distortion_Plinth"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: -50, y: 15, z: 0 }
    });

    parts.push({
        name: "Pocket_Dimension_Bubble_Core",
        description: "The actual manifestation of the detached spacetime manifold. Contains its own unique physical laws, governed by the Coleman-De Luccia instanton parameters injected during formation.",
        material: "Custom 3D Noise Shader Material",
        function: "Hosts the newly created universe.",
        assemblyOrder: 15,
        connections: ["Tachyon_Pulse_Conduit", "Spacetime_Lattice_Anchor"],
        failureEffect: "False vacuum decay propagating outward at the speed of light.",
        cascadeFailures: ["The known universe"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    parts.push({
        name: "Spacetime_Lattice_Anchor",
        description: "Visible representation of the local spacetime grid being stretched, warped, and eventually pinched off. Interacts dynamically with the gravity inversion rings.",
        material: "Cyan Line Segments",
        function: "Visualizing metric tensor deformations.",
        assemblyOrder: 16,
        connections: ["Pocket_Dimension_Bubble_Core"],
        failureEffect: "Loss of bulk-boundary correspondence.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: -40 }
    });

    parts.push({
        name: "Observer_Cabin_Module",
        description: "Heavily shielded bunker for the Principal Investigator. Features lead-glass windows, multi-spectral monitors, and completely isolated life support.",
        material: "HyperSteel / Tinted Glass",
        function: "Protects human observers from exotic radiation and causal paradoxes.",
        assemblyOrder: 20,
        connections: ["Quantum_Base_Manifold"],
        failureEffect: "Crew is spaghettified or irradiated by Hawking radiation.",
        cascadeFailures: ["Main_Telemetry_Console"],
        originalPosition: { x: 0, y: -2, z: 25 },
        explodedPosition: { x: 0, y: -2, z: 60 }
    });

    // Add 10 more procedural part entries to ensure massive complexity
    for (let i = 1; i <= 10; i++) {
        parts.push({
            name: `Hyper_Strut_Assembly_${i}`,
            description: `Heavy duty bracing element ${i} designed to withstand the immense tidal forces generated by the naked singularity required for the pinch-off.`,
            material: "Steel / Chrome",
            function: "Structural integrity under infinite gravity.",
            assemblyOrder: 5 + i,
            connections: ["Quantum_Base_Manifold", "Ring_Housing"],
            failureEffect: `Catastrophic shear failure in sector ${i}.`,
            cascadeFailures: ["Adjacent Struts"],
            originalPosition: { x: Math.cos(i) * 15, y: 5, z: Math.sin(i) * 15 },
            explodedPosition: { x: Math.cos(i) * 40, y: 20, z: Math.sin(i) * 40 }
        });
    }

    // ----------------------------------------------------------------------------------
    // PHD-LEVEL THEORETICAL PHYSICS QUIZ QUESTIONS
    // ----------------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of the Farhi-Guth-Guven mechanism for creating a baby universe in the laboratory, what fundamental barrier prevents the classical creation of a pocket universe from a non-singular initial state?",
            options: [
                "The Penrose Singularity Theorem dictates that all closed trapped surfaces must evolve into a singularity.",
                "The Topological Censorship Theorem strictly forbids the bifurcation of the Cauchy surface without violating the Null Energy Condition.",
                "The Bekenstein bound limits the amount of entropy that can be compressed into a given volume.",
                "The cosmic censorship conjecture forces any singularity to be hidden behind an event horizon, preventing expansion."
            ],
            correctAnswer: 1,
            explanation: "The Topological Censorship Theorem (Friedman, Schleich, and Witt) states that in a globally hyperbolic, asymptotically flat spacetime satisfying the Null Energy Condition, the topology of the domain of outer communications cannot change. To pinch off a baby universe (changing the topology), exotic matter violating the NEC is strictly required."
        },
        {
            question: "When stabilizing the moduli of a Calabi-Yau compactification during the false vacuum decay that initiates the pocket universe, which flux configuration is necessary to fix the complex structure moduli?",
            options: [
                "Only Ramond-Ramond (RR) fluxes are required to induce a superpotential.",
                "A combination of Neveu-Schwarz-Neveu-Schwarz (NSNS) and Ramond-Ramond (RR) 3-form fluxes (G_3 flux).",
                "D-brane instanton effects are purely sufficient for complex structure stabilization.",
                "Kähler moduli stabilization automatically fixes the complex structure via mirror symmetry."
            ],
            correctAnswer: 1,
            explanation: "In Type IIB string theory flux compactifications (like KKLT), a combination of NSNS (H3) and RR (F3) 3-form fluxes, combined into the complex G3 flux, induces the Gukov-Vafa-Witten superpotential which explicitly depends on and stabilizes the complex structure moduli and the dilaton."
        },
        {
            question: "Inside the pocket dimension, the physical transition of the vacuum state involves tunneling through a potential barrier. What mathematical entity describes the instanton mediating this true vacuum nucleation?",
            options: [
                "A Taub-NUT space with a Misner string.",
                "The Coleman-De Luccia bounce solution.",
                "A Hartle-Hawking no-boundary state.",
                "An Anti-de Sitter black hole metric."
            ],
            correctAnswer: 1,
            explanation: "The Coleman-De Luccia instanton (or bounce) is the $O(4)$ symmetric Euclidean solution to the Einstein-scalar field equations that dominates the path integral for false vacuum decay including gravitational effects."
        },
        {
            question: "Calculating the holographic entanglement entropy of the newly formed spacetime bubble involves finding a minimal area surface homologous to the boundary region. According to the Hubeny-Rangamani-Takayanagi (HRT) prescription for time-dependent backgrounds, this surface is defined by:",
            options: [
                "The surface of minimal area strictly on a constant time slice.",
                "The extremal surface of co-dimension 2 which is a saddle point of the area functional.",
                "The event horizon of the resulting black hole in the bulk.",
                "The stretched horizon located one Planck length outside the apparent horizon."
            ],
            correctAnswer: 1,
            explanation: "Because the background is time-dependent (the universe is expanding/pinching off), the standard Ryu-Takayanagi formula fails. The HRT prescription generalizes it by looking for covariant extremal surfaces of co-dimension 2 in the bulk, which act as saddle points rather than global minimums of the area."
        },
        {
            question: "The exotic matter rings utilize a Casimir-effect analog to generate negative energy density. If the rings are modeled as parallel conducting plates separated by a distance 'a', the macroscopic energy density 'ρ' scales proportionally to:",
            options: [
                "ρ ∝ a^-2",
                "ρ ∝ -a^-3",
                "ρ ∝ -a^-4",
                "ρ ∝ a^-5"
            ],
            correctAnswer: 2,
            explanation: "The Casimir energy density for perfectly conducting parallel plates in vacuum is given by ρ = -(π² ħ c) / (720 a⁴), making it proportional to -a^-4. This negative energy density is what allows the circumvention of standard energy conditions."
        }
    ];

    // ----------------------------------------------------------------------------------
    // EXTREME ANIMATION LOGIC
    // ----------------------------------------------------------------------------------
    const description = "The God-Tier Pocket Universe Generator. A machine capable of violating the Null Energy Condition, manipulating Calabi-Yau manifolds, and pinching off segments of the spacetime bulk to create highly customized baby universes with inverted physical laws. CAUTION: Risk of false vacuum decay.";

    function animate(time, speed, meshesObj) {
        // time: elapsed time, speed: playback speed multiplier
        
        // 1. Core Bubble Shader Animation
        if (meshes.core) {
            meshes.core.material.uniforms.time.value = time * 2.0 * speed;
            // Pulse scale
            const scale = 1.0 + Math.sin(time * 3 * speed) * 0.15;
            meshes.core.scale.set(scale, scale, scale);
        }

        // 2. Gyroscopic Exotic Matter Rings
        if (meshes.rings) {
            meshes.rings.forEach((ring, index) => {
                const axis = ring.userData.axis;
                const rSpeed = ring.userData.speed * speed * 20; // Fast rotation
                ring.rotateOnAxis(axis, rSpeed);
                
                // Bobbing motion for the whole assembly
                if (index === 0) {
                    ring.position.y = 15 + Math.sin(time * speed) * 1.5;
                }
            });
        }

        // 3. Hydraulic Pistons Tracking
        if (meshes.pistons && meshes.rings && meshes.rings[0]) {
            const targetY = meshes.rings[0].position.y;
            meshes.pistons.forEach(piston => {
                // Adjust piston extension based on ring height
                const extension = (targetY - 15) * 0.5;
                piston.position.y = 10 + extension;
            });
        }

        // 4. Spacetime Grid Deformation (The Pinch-Off Effect)
        if (meshes.spacetimeGrid) {
            const positions = meshes.spacetimeGrid.geometry.attributes.position.array;
            const original = meshes.spacetimeGrid.userData.original;
            
            // Core singularity position
            const corePos = new THREE.Vector3(0, meshes.rings[0].position.y, 0);
            
            // Cycle represents the buildup and snapping of spacetime
            const cycle = (time * speed) % (Math.PI * 2);
            const pullFactor = Math.max(0, Math.sin(cycle) * 0.8); // Pulls in, then releases

            for(let i=0; i<positions.length; i+=3) {
                const ox = original[i];
                const oy = original[i+1];
                const oz = original[i+2];
                
                const dist = Math.sqrt(ox*ox + (oy-corePos.y)*(oy-corePos.y) + oz*oz);
                
                if (dist < 40) {
                    // Gravitational well effect
                    const force = (40 - dist) / 40; // 0 to 1
                    
                    // Direction vector to core
                    const dx = corePos.x - ox;
                    const dy = corePos.y - oy;
                    const dz = corePos.z - oz;
                    
                    // Deform vertices towards core
                    positions[i] = ox + dx * force * pullFactor;
                    positions[i+1] = oy + dy * force * pullFactor;
                    positions[i+2] = oz + dz * force * pullFactor;
                } else {
                    positions[i] = ox;
                    positions[i+1] = oy;
                    positions[i+2] = oz;
                }
            }
            meshes.spacetimeGrid.geometry.attributes.position.needsUpdate = true;
        }

        // 5. Tachyon Conduit Pulsing
        if (meshes.beams) {
            meshes.beams.forEach((beam, idx) => {
                const flash = (Math.sin(time * 10 * speed + idx) + 1) / 2;
                beam.material.opacity = 0.4 + flash * 0.6;
                beam.scale.set(1 + flash*0.5, 1, 1 + flash*0.5);
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
