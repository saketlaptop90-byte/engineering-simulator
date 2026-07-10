import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "God Tier Brane Collider: A mobile, trans-dimensional megastructure designed to intersect 11-dimensional p-branes. Mounted on a colossal all-terrain chassis with hyper-detailed operator cabins and hydraulic boom calibrators, this machine initiates a localized Big Bang singularity for omniversal energy extraction and string-theoretic anomaly manipulation. It features immense containment rings, tachyon injectors, and a holographic boundary projector.";

    // ==========================================
    // CUSTOM GLOWING & NEON MATERIALS
    // ==========================================
    const emissiveSingularity = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.95,
        wireframe: false
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 4.0,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0x6600ff,
        emissiveIntensity: 5.0,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0022,
        emissiveIntensity: 6.0
    });
    
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x002200,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // Shader materials for the Branes (Rippling Planes)
    const braneShader = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            colorA: { value: new THREE.Color(0x000515) },
            colorB: { value: new THREE.Color(0x00ffff) },
            pulseRate: { value: 2.0 }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                vec3 pos = position;
                float dist = length(pos.xy);
                pos.z += sin(dist * 0.2 - time * 3.0) * 8.0;
                pos.z += cos(pos.x * 0.1 + time * 2.0) * 4.0;
                pos.z += sin(pos.y * 0.15 - time) * 5.0;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorA;
            uniform vec3 colorB;
            uniform float pulseRate;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                float intensity = sin(vPosition.z * 0.5 - time * pulseRate) * 0.5 + 0.5;
                vec3 finalColor = mix(colorA, colorB, intensity);
                float alpha = intensity * 0.8 + 0.2;
                gl_FragColor = vec4(finalColor * 3.0, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        wireframe: false
    });

    const braneWireframe = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
        },
        vertexShader: `
            uniform float time;
            void main() {
                vec3 pos = position;
                float dist = length(pos.xy);
                pos.z += sin(dist * 0.2 - time * 3.0) * 8.0;
                pos.z += cos(pos.x * 0.1 + time * 2.0) * 4.0;
                pos.z += sin(pos.y * 0.15 - time) * 5.0;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            void main() {
                gl_FragColor = vec4(0.5, 0.0, 1.0, 0.4);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        wireframe: true
    });

    // ==========================================
    // ANIMATION REGISTRY
    // ==========================================
    const animRegistry = {
        branes: [],
        singularity: null,
        containmentRings: [],
        tachyonNodes: [],
        wheels: [],
        booms: [],
        pistons: [],
        screens: [],
        particles: [],
        gears: [],
        exhausts: []
    };

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // ==========================================
    function createHydraulicTube(pathVecs, radius) {
        const curve = new THREE.CatmullRomCurve3(pathVecs);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, radius, 8, false);
        return new THREE.Mesh(tubeGeo, rubber);
    }

    function createRivetPanel(width, height, depth) {
        const panelGeo = new THREE.BoxGeometry(width, height, depth);
        const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
        const rivetGeo = new THREE.SphereGeometry(depth * 0.4, 8, 8);
        for(let i=0; i<4; i++) {
            const rivet = new THREE.Mesh(rivetGeo, chrome);
            rivet.position.set(
                (i%2 === 0 ? 1 : -1) * (width/2 - depth),
                (i < 2 ? 1 : -1) * (height/2 - depth),
                depth/2
            );
            panelMesh.add(rivet);
        }
        return panelMesh;
    }

    // ==========================================
    // 1. OMNIVERSAL MOBILITY CHASSIS (TIRES & AXLES)
    // ==========================================
    const chassisBaseGeo = new THREE.BoxGeometry(100, 10, 200);
    const chassisBase = new THREE.Mesh(chassisBaseGeo, darkSteel);
    chassisBase.position.y = 20;
    group.add(chassisBase);

    parts.push({
        name: "Omniversal Chassis Mainframe",
        description: "A super-dense, dark steel foundation supporting the immense mass of the brane intersection hardware.",
        material: "Dark Steel / Depleted Uranium Core",
        function: "Structural integrity and vibrational dampening.",
        assemblyOrder: 1,
        connections: ["WheelAxles", "PrimaryContainmentRings", "HydraulicBooms"],
        failureEffect: "Structural collapse leading to immediate crushing of lower operator cabins and spontaneous black hole formation.",
        cascadeFailures: ["BraneUpper", "SingularityCore"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: 50, z: -50 }
    });

    const wheelPositions = [
        {x: 60, y: 15, z: 80}, {x: -60, y: 15, z: 80},
        {x: 60, y: 15, z: 30}, {x: -60, y: 15, z: 30},
        {x: 60, y: 15, z: -30}, {x: -60, y: 15, z: -30},
        {x: 60, y: 15, z: -80}, {x: -60, y: 15, z: -80}
    ];

    wheelPositions.forEach((pos, idx) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos.x, pos.y, pos.z);

        // Tire base
        const tireGeo = new THREE.TorusGeometry(15, 6, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        // Extruded Lugs for aggressive off-road treads
        const lugCount = 144;
        const lugGeo = new THREE.BoxGeometry(10, 2, 8);
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Position on the surface of the torus
            lug.position.set(
                Math.cos(angle) * 21,
                Math.sin(angle) * 21,
                0
            );
            lug.rotation.z = angle;
            tire.add(lug);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry(12, 12, 4, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        // Complex Spokes
        const spokeCount = 24;
        const spokeGeo = new THREE.CylinderGeometry(0.8, 0.4, 12, 16);
        for (let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.position.set(0, Math.sin(angle) * 6, Math.cos(angle) * 6);
            spoke.rotation.x = angle;
            rim.add(spoke);
        }

        // Axle connector
        const axleGeo = new THREE.CylinderGeometry(3, 3, 20, 32);
        const axle = new THREE.Mesh(axleGeo, darkSteel);
        axle.rotation.z = Math.PI / 2;
        axle.position.x = pos.x > 0 ? -10 : 10;
        wheelGroup.add(axle);

        group.add(wheelGroup);
        animRegistry.wheels.push(tire);
        animRegistry.wheels.push(rim);

        if (idx === 0) {
            parts.push({
                name: `Tractric Suspension Wheel Array`,
                description: `Colossal toroidal locomotion unit with aggressive lug pattern, consisting of 144 independent extrusions.`,
                material: "Quantum-Resistant Rubber / Chromed Steel",
                function: "Omniversal platform locomotion.",
                assemblyOrder: 2,
                connections: ["ChassisBase", "SuspensionHydraulics"],
                failureEffect: "Platform tilting, misalignment of brane intersection resulting in localized vacuum decay.",
                cascadeFailures: ["ChassisBase", "ContainmentRings"],
                originalPosition: { x: pos.x, y: pos.y, z: pos.z },
                explodedPosition: { x: pos.x * 2, y: pos.y - 10, z: pos.z }
            });
        }
    });

    // ==========================================
    // 2. OPERATOR CABIN WITH HYPER-DETAILS
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 35, 90);
    
    const cabinBodyGeo = new THREE.BoxGeometry(20, 15, 15);
    const cabinBody = new THREE.Mesh(cabinBodyGeo, darkSteel);
    cabinGroup.add(cabinBody);

    const windshieldGeo = new THREE.PlaneGeometry(18, 8);
    const windshield = new THREE.Mesh(windshieldGeo, tinted);
    windshield.position.set(0, 2, 7.6);
    cabinGroup.add(windshield);

    // Operator Seats
    for(let i=-1; i<=1; i+=2) {
        const seatGeo = new THREE.BoxGeometry(4, 5, 4);
        const seat = new THREE.Mesh(seatGeo, rubber);
        seat.position.set(i * 5, -2, 2);
        cabinGroup.add(seat);

        // Joysticks
        const stickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 8), plastic);
        stickBase.position.set(i * 5, -0.5, 5);
        cabinGroup.add(stickBase);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 8), aluminum);
        stick.position.set(i * 5, 0.5, 5);
        stick.rotation.x = 0.2;
        cabinGroup.add(stick);
    }

    // Control Panels & Glowing Screens
    const dashGeo = new THREE.BoxGeometry(18, 4, 3);
    const dash = new THREE.Mesh(dashGeo, plastic);
    dash.position.set(0, -1, 6);
    cabinGroup.add(dash);

    for(let i=0; i<4; i++) {
        const screenGeo = new THREE.PlaneGeometry(3, 2);
        const screen = new THREE.Mesh(screenGeo, screenMaterial);
        screen.position.set(-6 + i*4, 1, 7);
        screen.rotation.x = -0.2;
        cabinGroup.add(screen);
        animRegistry.screens.push(screen);
    }

    // Side Mirrors
    for(let i=-1; i<=1; i+=2) {
        const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), steel);
        mirrorArm.position.set(i * 11, 2, 5);
        mirrorArm.rotation.z = i * Math.PI / 2;
        cabinGroup.add(mirrorArm);
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 2), chrome);
        mirror.position.set(i * 13, 2, 5);
        cabinGroup.add(mirror);
    }

    // Ladders and grilles
    const ladderGeo = new THREE.CylinderGeometry(0.2, 0.2, 20);
    const ladderLeft = new THREE.Mesh(ladderGeo, steel);
    ladderLeft.position.set(-8, -10, -8);
    const ladderRight = new THREE.Mesh(ladderGeo, steel);
    ladderRight.position.set(-5, -10, -8);
    cabinGroup.add(ladderLeft);
    cabinGroup.add(ladderRight);
    for(let j=0; j<8; j++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), steel);
        rung.position.set(-6.5, -18 + j*2.5, -8);
        rung.rotation.z = Math.PI / 2;
        cabinGroup.add(rung);
    }

    group.add(cabinGroup);

    parts.push({
        name: "Primary Command Cabin",
        description: "Hyper-detailed operator cabin featuring tinted trans-paristeel, glowing diagnostic screens, dual joysticks, and blast-proof seating.",
        material: "Dark Steel / Tinted Glass / Advanced Plastic",
        function: "Pilot interface and singularity monitoring.",
        assemblyOrder: 3,
        connections: ["ChassisBase", "SensorArrays"],
        failureEffect: "Loss of manual override, blinding of operators from Hawking radiation.",
        cascadeFailures: ["HolographicBoundary"],
        originalPosition: { x: 0, y: 35, z: 90 },
        explodedPosition: { x: 0, y: 80, z: 150 }
    });

    // ==========================================
    // 3. HYDRAULIC BOOM ARMS (ARTICULATING)
    // ==========================================
    const boomPositions = [ {x: 40, z: 40}, {x: -40, z: 40}, {x: 40, z: -40}, {x: -40, z: -40} ];
    boomPositions.forEach((pos, idx) => {
        const boomGroup = new THREE.Group();
        boomGroup.position.set(pos.x, 25, pos.z);

        // Boom Base
        const baseGeo = new THREE.CylinderGeometry(6, 8, 10, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        boomGroup.add(base);

        // Main Arm Pivot
        const pivotGroup = new THREE.Group();
        pivotGroup.position.y = 5;
        boomGroup.add(pivotGroup);

        const armGeo = new THREE.BoxGeometry(4, 40, 4);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.y = 20;
        pivotGroup.add(arm);

        // Hydraulic Piston Cylinder (outer)
        const cylinderGeo = new THREE.CylinderGeometry(2, 2, 20, 16);
        const cylinder = new THREE.Mesh(cylinderGeo, chrome);
        cylinder.position.set(0, 10, -4);
        pivotGroup.add(cylinder);

        // Hydraulic Piston Rod (inner)
        const rodGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
        const rod = new THREE.Mesh(rodGeo, aluminum);
        rod.position.set(0, 10, 0); // local to cylinder assembly in animation
        cylinder.add(rod);

        // Extensive hydraulic lines (tubes)
        const tubePath = [
            new THREE.Vector3(0, 0, 2),
            new THREE.Vector3(2, 10, 3),
            new THREE.Vector3(0, 20, 2)
        ];
        const line = createHydraulicTube(tubePath, 0.4);
        arm.add(line);

        group.add(boomGroup);
        animRegistry.booms.push(pivotGroup);
        animRegistry.pistons.push(rod);

        if (idx === 0) {
            parts.push({
                name: "Brane Calibrator Hydraulic Booms",
                description: "Massive articulating arms utilizing nested cylinders and complex tubing to precisely position the containment rings.",
                material: "Chromed Steel / Aluminum / Rubber Lines",
                function: "Micro-adjustment of the 11D brane intersection angle.",
                assemblyOrder: 4,
                connections: ["ChassisBase", "ContainmentRingAlpha"],
                failureEffect: "Asymmetric brane collision causing runaway localized inflation.",
                cascadeFailures: ["BraneUpper", "BraneLower"],
                originalPosition: { x: pos.x, y: 25, z: pos.z },
                explodedPosition: { x: pos.x + 50, y: 50, z: pos.z }
            });
        }
    });

    // ==========================================
    // 4. THE BRANES (UPPER AND LOWER RIPPLING PLANES)
    // ==========================================
    const braneGeo = new THREE.PlaneGeometry(300, 300, 150, 150);
    
    const upperBraneGroup = new THREE.Group();
    upperBraneGroup.position.set(0, 180, 0);
    upperBraneGroup.rotation.x = Math.PI / 2;
    const upperBrane = new THREE.Mesh(braneGeo, braneShader);
    const upperBraneWire = new THREE.Mesh(braneGeo, braneWireframe);
    upperBraneGroup.add(upperBrane);
    upperBraneGroup.add(upperBraneWire);
    group.add(upperBraneGroup);

    const lowerBraneGroup = new THREE.Group();
    lowerBraneGroup.position.set(0, 80, 0);
    lowerBraneGroup.rotation.x = -Math.PI / 2;
    const lowerBrane = new THREE.Mesh(braneGeo, braneShader);
    const lowerBraneWire = new THREE.Mesh(braneGeo, braneWireframe);
    lowerBraneGroup.add(lowerBrane);
    lowerBraneGroup.add(lowerBraneWire);
    group.add(lowerBraneGroup);

    animRegistry.branes.push({ mesh: upperBrane, wire: upperBraneWire, initialY: 180, phase: 0 });
    animRegistry.branes.push({ mesh: lowerBrane, wire: lowerBraneWire, initialY: 80, phase: Math.PI });

    parts.push({
        name: "Upper p-Brane Projector",
        description: "An artificially generated 11-dimensional membrane surface, rendered as a rippling shader plane. Intersects with the lower brane.",
        material: "Quantum Field / Photonic Plasma",
        function: "Provides the collision manifold for the Big Bang emulation.",
        assemblyOrder: 5,
        connections: ["SingularityCore", "HolographicBoundary"],
        failureEffect: "Dimensional unraveling, stripping local space of the strong nuclear force.",
        cascadeFailures: ["Lower p-Brane", "SingularityCore"],
        originalPosition: { x: 0, y: 180, z: 0 },
        explodedPosition: { x: 0, y: 350, z: 0 }
    });

    parts.push({
        name: "Lower p-Brane Projector",
        description: "The corresponding inverse membrane. Ripples in counter-phase to the upper brane to maximize string tension at intersection.",
        material: "Quantum Field / Anti-Photonic Plasma",
        function: "Counter-manifold for the singularity event.",
        assemblyOrder: 6,
        connections: ["SingularityCore", "ChassisBase"],
        failureEffect: "Spontaneous vacuum decay.",
        cascadeFailures: ["Upper p-Brane"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // ==========================================
    // 5. SINGULARITY CORE & EXOTIC PARTICLES
    // ==========================================
    const singularityGeo = new THREE.IcosahedronGeometry(15, 3);
    const singularity = new THREE.Mesh(singularityGeo, emissiveSingularity);
    singularity.position.set(0, 130, 0);
    group.add(singularity);
    animRegistry.singularity = singularity;

    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        particlePos[i] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xff00ff, size: 1.5, transparent: true, opacity: 0.8 });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.position.set(0, 130, 0);
    group.add(particleSystem);
    animRegistry.particles.push(particleSystem);

    parts.push({
        name: "Chaotic Singularity Core",
        description: "An unimaginably bright, pulsating core representing a localized Big Bang. Formed exactly at the brane intersection.",
        material: "Pure Primordial Energy / Emissive Plasma",
        function: "Generates infinite omniversal energy via string vibrations.",
        assemblyOrder: 7,
        connections: ["ContainmentRingAlpha", "Upper p-Brane", "Lower p-Brane"],
        failureEffect: "Uncontrolled expansion of a new universe within the current one, destroying the host galaxy.",
        cascadeFailures: ["EVERYTHING"],
        originalPosition: { x: 0, y: 130, z: 0 },
        explodedPosition: { x: -200, y: 130, z: 200 }
    });

    // ==========================================
    // 6. CONTAINMENT ARCHITECTURE (RINGS & TORUS KNOTS)
    // ==========================================
    const ringRadii = [40, 60, 85];
    const ringMaterials = [neonBlue, neonPurple, neonRed];

    ringRadii.forEach((radius, idx) => {
        const ringGroup = new THREE.Group();
        ringGroup.position.set(0, 130, 0);

        // Main torus
        const torusGeo = new THREE.TorusGeometry(radius, 4, 32, 128);
        const torus = new THREE.Mesh(torusGeo, chrome);
        ringGroup.add(torus);

        // Glowing inner track
        const innerGeo = new THREE.TorusGeometry(radius, 4.2, 16, 64);
        const innerTrack = new THREE.Mesh(innerGeo, ringMaterials[idx]);
        innerTrack.rotation.x = Math.PI / 2;
        ringGroup.add(innerTrack);

        // Magnetic struts
        const strutGeo = new THREE.CylinderGeometry(1, 1, radius * 2, 16);
        for(let j=0; j<4; j++) {
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.rotation.z = Math.PI / 2;
            strut.rotation.y = (j / 4) * Math.PI;
            ringGroup.add(strut);
        }

        group.add(ringGroup);
        animRegistry.containmentRings.push({ mesh: ringGroup, speed: 0.01 * (idx + 1) * (idx % 2 === 0 ? 1 : -1) });

        if(idx === 1) {
            parts.push({
                name: "Hyper-Advanced Containment Architecture",
                description: "A nested array of chrome toroids with glowing magnetic tracks and heavy struts. Prevents the singularity from instantly vaporizing the chassis.",
                material: "Chromed Steel / Superconducting Neon Tracks",
                function: "Gravitational and thermal shielding.",
                assemblyOrder: 8,
                connections: ["SingularityCore", "ChassisBase"],
                failureEffect: "Immediate core breach, exposing the facility to infinite heat and gravity.",
                cascadeFailures: ["OperatorCabin", "HydraulicBooms"],
                originalPosition: { x: 0, y: 130, z: 0 },
                explodedPosition: { x: 0, y: 130, z: -200 }
            });
        }
    });

    // Calabi-Yau Manifold Stabilizer (Abstract Torus Knot)
    const cyGeo = new THREE.TorusKnotGeometry(25, 2, 256, 32, 3, 7);
    const cyMesh = new THREE.Mesh(cyGeo, glass);
    cyMesh.position.set(0, 130, 0);
    group.add(cyMesh);
    animRegistry.containmentRings.push({ mesh: cyMesh, speed: 0.05 });

    parts.push({
        name: "Calabi-Yau Manifold Stabilizer",
        description: "A crystalline, complex torus knot topology representing the compactified dimensions. Absorbs dimensional overflow.",
        material: "Trans-dimensional Glass",
        function: "Maintains 11D topology locally.",
        assemblyOrder: 9,
        connections: ["ContainmentRingAlpha", "SingularityCore"],
        failureEffect: "Dimensions unfurl, turning 3D space into 11D chaos.",
        cascadeFailures: ["BraneUpper"],
        originalPosition: { x: 0, y: 130, z: 0 },
        explodedPosition: { x: 200, y: 130, z: 0 }
    });

    // ==========================================
    // 7. EXHAUST STACKS, TACHYON INJECTORS, & GEARS
    // ==========================================
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        
        // Exhaust Stacks
        const stackGroup = new THREE.Group();
        stackGroup.position.set(Math.cos(angle) * 70, 40, Math.sin(angle) * 70);
        
        const stackPipeGeo = new THREE.CylinderGeometry(4, 5, 40, 16);
        const stackPipe = new THREE.Mesh(stackPipeGeo, darkSteel);
        stackGroup.add(stackPipe);

        const grilleGeo = new THREE.CylinderGeometry(4.5, 4.5, 10, 16, 1, true);
        const grille = new THREE.Mesh(grilleGeo, new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true }));
        grille.position.y = 15;
        stackGroup.add(grille);

        // Exhaust Particles
        const smokeGeo = new THREE.BufferGeometry();
        const smokePos = new Float32Array(50 * 3);
        for(let k=0; k<50*3; k++) smokePos[k] = (Math.random() - 0.5) * 5;
        smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
        const smokeMat = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 2, transparent: true, opacity: 0.5 });
        const smoke = new THREE.Points(smokeGeo, smokeMat);
        smoke.position.y = 25;
        stackGroup.add(smoke);
        animRegistry.exhausts.push(smoke);

        group.add(stackGroup);

        // Tachyon Injector Nodes
        const nodeGeo = new THREE.ConeGeometry(5, 15, 16);
        const node = new THREE.Mesh(nodeGeo, neonBlue);
        node.position.set(Math.cos(angle + Math.PI/4) * 50, 80, Math.sin(angle + Math.PI/4) * 50);
        node.lookAt(0, 130, 0);
        group.add(node);
        animRegistry.tachyonNodes.push(node);

        // Massive Gears on the chassis deck
        const gearGeo = new THREE.CylinderGeometry(15, 15, 2, 32);
        const gear = new THREE.Mesh(gearGeo, copper);
        gear.position.set(Math.cos(angle) * 30, 25, Math.sin(angle) * 30);
        
        // Gear teeth
        for(let t=0; t<20; t++) {
            const toothAngle = (t/20) * Math.PI * 2;
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), copper);
            tooth.position.set(Math.cos(toothAngle) * 16, 0, Math.sin(toothAngle) * 16);
            tooth.rotation.y = -toothAngle;
            gear.add(tooth);
        }
        group.add(gear);
        animRegistry.gears.push({ mesh: gear, speed: i%2===0 ? 0.05 : -0.05 });
    }

    parts.push({
        name: "Tachyon Injector Nodes & Exhaust Array",
        description: "Four massive cone injectors that pump tachyons into the collision zone, with accompanying dark steel exhaust stacks venting Hawking radiation.",
        material: "Dark Steel / Emissive Blue Plating / Copper Gears",
        function: "Fuel injection for the singularity and excess radiation venting.",
        assemblyOrder: 10,
        connections: ["ChassisBase", "SingularityCore"],
        failureEffect: "Tachyon backflow resulting in temporal inversion of the crew (aging backwards to non-existence).",
        cascadeFailures: ["OperatorCabin"],
        originalPosition: { x: 50, y: 80, z: 50 },
        explodedPosition: { x: 150, y: 150, z: 150 }
    });

    // ==========================================
    // 8. HOLOGRAPHIC BOUNDARY PROJECTORS
    // ==========================================
    const boundaryGeo = new THREE.SphereGeometry(140, 32, 32);
    const boundaryMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        emissive: 0x00aaff,
        emissiveIntensity: 0.5
    });
    const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
    boundary.position.set(0, 130, 0);
    group.add(boundary);
    animRegistry.containmentRings.push({ mesh: boundary, speed: -0.005 });

    parts.push({
        name: "Holographic Boundary Projector",
        description: "Projects the AdS/CFT correspondence boundary, effectively mapping the 3D singularity data onto a 2D holographic surface for safe analysis.",
        material: "Hard-Light Hologram",
        function: "Data extraction via the holographic principle.",
        assemblyOrder: 11,
        connections: ["SingularityCore", "SensorArrays"],
        failureEffect: "Information paradox; data is permanently lost to the singularity.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 130, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // ==========================================
    // MORE INTRICATE DETAILS: RIVETS, PIPES, GENERATORS
    // ==========================================
    for(let p=0; p<8; p++) {
        const generator = createRivetPanel(12, 18, 8);
        const angle = (p/8) * Math.PI * 2;
        generator.position.set(Math.cos(angle) * 85, 30, Math.sin(angle) * 85);
        generator.rotation.y = -angle;
        group.add(generator);

        // Dilaton field coils on generator
        const coil = new THREE.Mesh(new THREE.TorusGeometry(3, 1, 16, 32), neonRed);
        coil.position.set(0, 4, 4);
        generator.add(coil);
    }
    
    parts.push({
        name: "Dilaton Field Generators",
        description: "Heavy riveted dark steel panels housing pulsing neon red dilaton coils, distributed around the chassis perimeter.",
        material: "Dark Steel / Chrome / Neon Red Coils",
        function: "Modulates the dilaton scalar field to control string coupling constants.",
        assemblyOrder: 12,
        connections: ["ChassisBase", "ContainmentRings"],
        failureEffect: "Strings become infinitely stiff, halting all quantum mechanical interactions in the sector.",
        cascadeFailures: ["SingularityCore"],
        originalPosition: { x: 85, y: 30, z: 0 },
        explodedPosition: { x: 180, y: 30, z: 0 }
    });

    // ==========================================
    // ATTACH REGISTRY TO GROUP FOR ANIMATE FUNCTION
    // ==========================================
    group.userData.animRegistry = animRegistry;

    // ==========================================
    // QUIZ QUESTIONS (M-THEORY / STRING THEORY PHD LEVEL)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of M-theory, how does the God Tier Brane Collider utilize the intersection of p-branes to avoid the spontaneous compactification of the 11th dimension (as proposed by Hořava-Witten theory) during a localized Big Bang?",
            options: [
                "By injecting tachyonic fields to stabilize the dilaton vacuum expectation value.",
                "By pinning the intersecting branes to an E8 x E8 heterotic string boundary, neutralizing bulk anomalies.",
                "By accelerating the branes beyond the speed of light, reversing local entropy.",
                "By utilizing a Calabi-Yau manifold to fold the 11th dimension into a 4D singularity."
            ],
            answer: 1,
            explanation: "Hořava-Witten theory posits that the 11th dimension is bounded by two 10D planes associated with the E8 x E8 gauge group. The collider pins the branes to these boundaries to cancel quantum anomalies via anomaly inflow, preventing spontaneous compactification."
        },
        {
            question: "When calibrating the String Tension Modulators, operators observe a sudden transition where fundamental strings begin behaving like black holes. This implies the collider has crossed which theoretical boundary?",
            options: [
                "The Chandrasekhar limit.",
                "The AdS/CFT Correspondence horizon.",
                "The Correspondence Principle (Susskind) where string mass exceeds the Planck mass.",
                "The Bekenstein-Hawking entropy bound."
            ],
            answer: 2,
            explanation: "Leonard Susskind's Correspondence Principle states that as the string coupling increases, a highly excited string states' mass will eventually exceed the Planck mass, at which point its Schwarzschild radius exceeds its physical size, turning it into a black hole."
        },
        {
            question: "The Holographic Boundary Projector analyzes the AdS/CFT duality of the singularity. If a local bulk operator in the Anti-de Sitter space (inside the singularity) is translated to the Conformal Field Theory boundary, it is represented as what?",
            options: [
                "A smeared, non-local integral of boundary CFT operators (HKLL construction).",
                "A perfectly localized single point particle on the boundary.",
                "A tachyon condensation wave.",
                "A flat Minkowski space metric."
            ],
            answer: 0,
            explanation: "In the HKLL (Hamilton-Kabat-Lifschitz-Lowe) construction of the AdS/CFT dictionary, a local bulk operator is reconstructed on the boundary not as a local operator, but as an integral of CFT operators smeared over a finite spatial region."
        },
        {
            question: "If the Dilaton Field Generator fails and the string coupling constant (g_s) approaches infinity, M-theory dictates that Type IIA string theory will transition into what?",
            options: [
                "Type IIB string theory via T-duality.",
                "A purely classical Newtonian vacuum.",
                "An 11-dimensional supergravity limit where the 10th spatial dimension decompactifies.",
                "A 26-dimensional bosonic string theory."
            ],
            answer: 2,
            explanation: "A profound result of M-theory is that as the string coupling constant g_s in Type IIA string theory becomes large, strongly coupled Type IIA theory grows an extra spatial dimension, dynamically decompactifying into 11-dimensional M-theory."
        },
        {
            question: "The Calabi-Yau Manifold Stabilizer is exhibiting Kähler moduli fluctuations. To prevent the manifold from tearing (a topology change), the system must utilize which stringy mechanism?",
            options: [
                "Flop transitions mediated by massless D-branes wrapping shrinking cycles.",
                "Increasing the cosmological constant to force inflation.",
                "Applying a Heisenberg compensator to the graviton emitters.",
                "Cooling the system to absolute zero to freeze the manifold."
            ],
            answer: 0,
            explanation: "In string theory, space can undergo topology-changing transitions (like the flop transition) smoothly. This is because D-branes or strings wrapping the shrinking cycles become massless, and their inclusion in the effective field theory resolves the singularity that classical general relativity would predict."
        }
    ];

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed, meshes) {
        // We use the locally scoped animRegistry stored in group.userData
        const reg = group.userData.animRegistry || animRegistry;

        // 1. Wheel Rotation (driving forward slowly)
        reg.wheels.forEach(w => {
            w.rotation.z -= speed * 0.5;
        });

        // 2. Hydraulic Booms (Sine wave articulation)
        const boomAngle = Math.sin(time * speed) * 0.2;
        reg.booms.forEach(b => {
            b.rotation.x = boomAngle;
        });

        // Pistons syncing with booms
        // As boom tilts, piston rod extends/retracts
        reg.pistons.forEach(p => {
            p.position.y = 10 + Math.sin(time * speed) * 2;
        });

        // 3. Rippling Branes
        reg.branes.forEach(b => {
            if(b.mesh.material.uniforms) {
                b.mesh.material.uniforms.time.value = time * speed;
                b.wire.material.uniforms.time.value = time * speed;
            }
            // Macro oscillation
            b.mesh.position.y = b.initialY + Math.sin(time * speed + b.phase) * 5;
            b.wire.position.y = b.mesh.position.y;
        });

        // 4. Singularity Pulsation
        if (reg.singularity) {
            const scale = 1.0 + Math.sin(time * speed * 5.0) * 0.1;
            reg.singularity.scale.set(scale, scale, scale);
            reg.singularity.rotation.y += speed * 2.0;
            reg.singularity.rotation.z += speed * 1.5;
            
            // Pulse emissive intensity
            reg.singularity.material.emissiveIntensity = 5.0 + Math.random() * 10.0;
        }

        // 5. Containment Rings
        reg.containmentRings.forEach(r => {
            r.mesh.rotation.y += r.speed * speed;
            r.mesh.rotation.x += r.speed * 0.5 * speed;
        });

        // 6. Exotic Particles
        reg.particles.forEach(ps => {
            ps.rotation.y -= speed * 0.5;
            const positions = ps.geometry.attributes.position.array;
            for(let i=1; i<positions.length; i+=3) {
                positions[i] += Math.random() * 2 * speed;
                if(positions[i] > 20) positions[i] = -20;
            }
            ps.geometry.attributes.position.needsUpdate = true;
        });

        // 7. Screen Flickering
        reg.screens.forEach(s => {
            s.material.emissiveIntensity = 1.0 + Math.random() * 2.0;
        });

        // 8. Gears
        reg.gears.forEach(g => {
            g.mesh.rotation.y += g.speed * speed;
        });

        // 9. Tachyon nodes pulsing
        reg.tachyonNodes.forEach((n, idx) => {
            n.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 10 + idx) * 3.0;
        });

        // 10. Exhaust smoke rising
        reg.exhausts.forEach(ex => {
            const positions = ex.geometry.attributes.position.array;
            for(let i=1; i<positions.length; i+=3) {
                positions[i] += speed * 5;
                if(positions[i] > 20) positions[i] = 0;
            }
            ex.geometry.attributes.position.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
