import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "God_Tier_Von_Neumann_Factory";

    const parts = [];
    const meshes = {
        macroArms: [],
        microArms: [],
        nanoArms: [],
        daughterProbes: [],
        grinderGears: [],
        rings: [],
        energyCores: [],
        conveyorItems: [],
        sparks: null,
        plasmaStreams: []
    };

    // -------------------------------------------------------------------------
    // CUSTOM HIGH-TECH MATERIALS
    // -------------------------------------------------------------------------
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 2.5, metalness: 0.7, roughness: 0.1 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 1.8, metalness: 0.9, roughness: 0.3 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x0088ff, emissiveIntensity: 4.0, transparent: true, opacity: 0.8 });
    const darkMatter = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 1.0, roughness: 0.9, wireframe: true });
    const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.2, roughness: 0.9, bumpScale: 2.0 });
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 });

    // -------------------------------------------------------------------------
    // UTILITY SHAPES & GEOMETRIES
    // -------------------------------------------------------------------------
    function createGearShape(teeth, outerRadius, innerRadius) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / (teeth * 2);
        for (let i = 0; i < teeth * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const theta = i * step;
            if (i === 0) shape.moveTo(Math.cos(theta) * r, Math.sin(theta) * r);
            else shape.lineTo(Math.cos(theta) * r, Math.sin(theta) * r);
        }
        shape.closePath();
        return shape;
    }

    const gearExtrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    
    // Lathe profile for central spindle
    const spindlePoints = [];
    for (let i = 0; i <= 50; i++) {
        const y = (i - 25) * 4;
        const x = 15 + Math.sin(i * 0.5) * 5 + (Math.abs(i - 25) < 5 ? 10 : 0);
        spindlePoints.push(new THREE.Vector2(x, y));
    }
    const spindleGeo = new THREE.LatheGeometry(spindlePoints, 64);

    // -------------------------------------------------------------------------
    // 1. THE ASTEROID (Target of Consumption)
    // -------------------------------------------------------------------------
    const asteroidGroup = new THREE.Group();
    asteroidGroup.position.set(-150, 0, 0);
    
    // Base Icosahedron heavily displaced
    const astGeo = new THREE.IcosahedronGeometry(60, 5);
    const posAttribute = astGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < posAttribute.count; i++) {
        v.fromBufferAttribute(posAttribute, i);
        const noise = Math.sin(v.x * 0.1) * Math.cos(v.y * 0.1) * Math.sin(v.z * 0.1);
        const crater = Math.max(0, 1 - (v.distanceTo(new THREE.Vector3(60, 0, 0)) / 20));
        v.multiplyScalar(1 + noise * 0.2 - crater * 0.3);
        posAttribute.setXYZ(i, v.x, v.y, v.z);
    }
    astGeo.computeVertexNormals();
    const asteroid = new THREE.Mesh(astGeo, asteroidMat);
    asteroidGroup.add(asteroid);
    group.add(asteroidGroup);

    parts.push({
        name: "Target Asteroid 433 Eros-Variant",
        description: "Carbonaceous chondrite body currently being systematically deconstructed and processed by the primary maw.",
        material: "Silicates, Carbon, Ice",
        function: "Raw material source for exponential self-replication.",
        assemblyOrder: 1,
        connections: ["The Great Maw", "Plasma Extractors"],
        failureEffect: "Resource starvation leading to factory hibernation.",
        cascadeFailures: ["Nanite swarm attrition", "Daughter probe production halt"],
        originalPosition: { x: -150, y: 0, z: 0 },
        explodedPosition: { x: -300, y: 0, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 2. THE GREAT MAW (Asteroid Chewer)
    // -------------------------------------------------------------------------
    const mawGroup = new THREE.Group();
    mawGroup.position.set(-80, 0, 0);
    mawGroup.rotation.z = -Math.PI / 2;

    const mawCasingGeo = new THREE.CylinderGeometry(40, 20, 40, 32, 1, true);
    const mawCasing = new THREE.Mesh(mawCasingGeo, darkSteel);
    mawGroup.add(mawCasing);

    // Grinder Gears inside the maw
    for (let i = 0; i < 4; i++) {
        const gearGeo = new THREE.ExtrudeGeometry(createGearShape(24, 35 - i * 5, 25 - i * 5), gearExtrudeSettings);
        const gear = new THREE.Mesh(gearGeo, chrome);
        gear.position.y = 15 - i * 10;
        gear.rotation.x = Math.PI / 2;
        mawGroup.add(gear);
        meshes.grinderGears.push({ mesh: gear, speed: (i % 2 === 0 ? 1 : -1) * (0.02 + i * 0.01) });
    }
    group.add(mawGroup);

    parts.push({
        name: "Macro-Scale Grinder Maw",
        description: "A colossal intake port featuring counter-rotating tritanium gear sets.",
        material: "Tritanium Alloy, Chrome",
        function: "Fractures large planetary bodies into manageable debris.",
        assemblyOrder: 2,
        connections: ["Mass Spectrometers", "Central Hub Core"],
        failureEffect: "Asteroid jams intake, stalling primary production.",
        cascadeFailures: ["Hub starvation", "Thermal overload in plasma jets"],
        originalPosition: { x: -80, y: 0, z: 0 },
        explodedPosition: { x: -120, y: 50, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 3. CENTRAL SPINDLE HUB (The Factory Core)
    // -------------------------------------------------------------------------
    const hubGroup = new THREE.Group();
    const spindle = new THREE.Mesh(spindleGeo, steel);
    spindle.rotation.z = Math.PI / 2;
    hubGroup.add(spindle);

    // Core Plasma Chamber
    const coreGeo = new THREE.SphereGeometry(18, 32, 32);
    const core = new THREE.Mesh(coreGeo, plasmaMat);
    hubGroup.add(core);
    meshes.energyCores.push(core);

    // Hub Rings
    const ringRadii = [30, 45, 60, 75];
    ringRadii.forEach((r, i) => {
        const ringGroup = new THREE.Group();
        const torusGeo = new THREE.TorusGeometry(r, 2, 16, 64);
        const ring = new THREE.Mesh(torusGeo, darkSteel);
        ring.rotation.y = Math.PI / 2;
        ringGroup.add(ring);

        // Add greebles (compute nodes, habitats, sensors)
        for (let j = 0; j < 36; j++) {
            const angle = (j / 36) * Math.PI * 2;
            const gbox = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), i % 2 === 0 ? aluminum : copper);
            gbox.position.set(r * Math.cos(angle), r * Math.sin(angle), 0);
            gbox.rotation.z = angle;
            ringGroup.add(gbox);

            // Add neon accents
            if (j % 4 === 0) {
                const neon = new THREE.Mesh(new THREE.BoxGeometry(1, 4.5, 1), neonBlue);
                neon.position.copy(gbox.position);
                neon.rotation.copy(gbox.rotation);
                ringGroup.add(neon);
            }
        }
        
        hubGroup.add(ringGroup);
        meshes.rings.push({ mesh: ringGroup, speed: (i % 2 === 0 ? 0.005 : -0.007) * (i + 1) });
    });

    group.add(hubGroup);

    parts.push({
        name: "Central Spindle Hub & Compute Rings",
        description: "The computational and structural backbone of the factory, housing the AGI core and fusion reactors.",
        material: "Steel, Plasma, Copper",
        function: "Orchestrates exponential replication algorithms and routes power.",
        assemblyOrder: 3,
        connections: ["The Great Maw", "Macro Assembly Arms"],
        failureEffect: "Total logical breakdown and factory self-destruction.",
        cascadeFailures: ["Rogue AGI generation", "Magnetic containment failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 4. MASS SPECTROMETERS (Element Sorters)
    // -------------------------------------------------------------------------
    const specGroup = new THREE.Group();
    specGroup.position.set(-40, 0, 0);
    
    // Create coiled tubes
    class SpiralCurve extends THREE.Curve {
        constructor(radius, height, loops) {
            super();
            this.radius = radius;
            this.height = height;
            this.loops = loops;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.loops;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    for (let s = 0; s < 4; s++) {
        const curve = new SpiralCurve(15, 60, 5);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 1.5, 8, false);
        const tube = new THREE.Mesh(tubeGeo, glass);
        tube.rotation.z = Math.PI / 2;
        tube.rotation.x = (s * Math.PI) / 2;
        
        // Inner plasma stream representing matter moving
        const innerTube = new THREE.Mesh(new THREE.TubeGeometry(curve, 100, 0.8, 8, false), neonOrange);
        innerTube.rotation.copy(tube.rotation);
        meshes.plasmaStreams.push(innerTube);

        specGroup.add(tube);
        specGroup.add(innerTube);
    }
    group.add(specGroup);

    parts.push({
        name: "Cyclotron Mass Spectrometers",
        description: "Electromagnetic sorting tubes that separate elemental streams via atomic mass variations.",
        material: "Quartz Glass, Superconductors",
        function: "Refines raw debris into pure elements for manufacturing.",
        assemblyOrder: 4,
        connections: ["The Great Maw", "Conveyance Network"],
        failureEffect: "Impure materials compromise structural integrity of daughter probes.",
        cascadeFailures: ["Assembly line jamming", "Probe engine blowouts"],
        originalPosition: { x: -40, y: 0, z: 0 },
        explodedPosition: { x: -40, y: -100, z: 100 }
    });

    // -------------------------------------------------------------------------
    // 5. ROBOTIC ARM FACTORY (Fractal Kinematics)
    // -------------------------------------------------------------------------
    // Generic Arm Builder function to reuse for Macro, Micro, and Nano scales
    function buildRoboticArm(scale, baseColor, armColor, neonColor) {
        const armGroup = new THREE.Group();
        
        // Base
        const baseGeo = new THREE.CylinderGeometry(4 * scale, 5 * scale, 2 * scale, 16);
        const base = new THREE.Mesh(baseGeo, baseColor);
        armGroup.add(base);

        // Base Joint (Y-axis rotation)
        const shoulderJointGroup = new THREE.Group();
        shoulderJointGroup.position.y = 1 * scale;
        base.add(shoulderJointGroup);

        const shoulderPivot = new THREE.Mesh(new THREE.SphereGeometry(3 * scale, 16, 16), chrome);
        shoulderJointGroup.add(shoulderPivot);

        // Upper Arm
        const upperArmGroup = new THREE.Group();
        shoulderPivot.add(upperArmGroup);
        const upperArmMesh = new THREE.Mesh(new THREE.BoxGeometry(2 * scale, 12 * scale, 2 * scale), armColor);
        upperArmMesh.position.y = 6 * scale;
        upperArmGroup.add(upperArmMesh);
        
        // Elbow Joint (X-axis rotation)
        const elbowJointGroup = new THREE.Group();
        elbowJointGroup.position.y = 12 * scale;
        upperArmGroup.add(elbowJointGroup);
        const elbowPivot = new THREE.Mesh(new THREE.CylinderGeometry(2.5 * scale, 2.5 * scale, 3 * scale, 16).rotateZ(Math.PI/2), chrome);
        elbowJointGroup.add(elbowPivot);

        // Forearm
        const forearmGroup = new THREE.Group();
        elbowPivot.add(forearmGroup);
        const forearmMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5 * scale, 10 * scale, 1.5 * scale), armColor);
        forearmMesh.position.y = 5 * scale;
        forearmGroup.add(forearmMesh);
        
        // Wrist Joint
        const wristJointGroup = new THREE.Group();
        wristJointGroup.position.y = 10 * scale;
        forearmGroup.add(wristJointGroup);
        const wristPivot = new THREE.Mesh(new THREE.SphereGeometry(2 * scale, 16, 16), neonColor);
        wristJointGroup.add(wristPivot);

        // Claw / Tool
        const clawGroup = new THREE.Group();
        wristPivot.add(clawGroup);
        const clawBase = new THREE.Mesh(new THREE.BoxGeometry(3 * scale, 1 * scale, 1 * scale), baseColor);
        clawBase.position.y = 1 * scale;
        clawGroup.add(clawBase);
        
        const finger1 = new THREE.Mesh(new THREE.ConeGeometry(0.5 * scale, 3 * scale, 4).rotateX(Math.PI), chrome);
        finger1.position.set(-1 * scale, 2.5 * scale, 0);
        clawGroup.add(finger1);
        
        const finger2 = new THREE.Mesh(new THREE.ConeGeometry(0.5 * scale, 3 * scale, 4).rotateX(Math.PI), chrome);
        finger2.position.set(1 * scale, 2.5 * scale, 0);
        clawGroup.add(finger2);

        // Add hydraulic pistons (decorative)
        const pistonGeo = new THREE.CylinderGeometry(0.5 * scale, 0.5 * scale, 6 * scale, 8);
        const piston = new THREE.Mesh(pistonGeo, steel);
        piston.position.set(1.5 * scale, 5 * scale, 1 * scale);
        upperArmGroup.add(piston);

        return {
            root: armGroup,
            shoulder: shoulderJointGroup,
            elbow: elbowJointGroup,
            wrist: wristJointGroup,
            claw: clawGroup
        };
    }

    // Deploy Macro Arms (Constructing Medium parts)
    for (let i = 0; i < 6; i++) {
        const arm = buildRoboticArm(1.5, darkSteel, steel, neonBlue);
        const angle = (i / 6) * Math.PI * 2;
        arm.root.position.set(0, 0, 0);
        
        // Attach to the main spindle outer surface
        const mountObj = new THREE.Group();
        mountObj.position.set(Math.cos(angle) * 15, -10 + (i % 2) * 20, Math.sin(angle) * 15);
        mountObj.lookAt(0, -10 + (i % 2) * 20, 0); // point inwards, we want them pointing outwards
        mountObj.rotateX(-Math.PI / 2); // align properly
        
        mountObj.add(arm.root);
        hubGroup.add(mountObj);
        
        meshes.macroArms.push({
            arm: arm,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5
        });
    }

    // Deploy Micro Arms on the Rings (Constructing Nano parts)
    for (let r = 0; r < 3; r++) {
        const ringR = ringRadii[r];
        for (let i = 0; i < 12; i++) {
            const arm = buildRoboticArm(0.3, copper, aluminum, neonOrange);
            const angle = (i / 12) * Math.PI * 2;
            arm.root.position.set(ringR * Math.cos(angle), ringR * Math.sin(angle), 5);
            arm.root.rotation.z = angle + Math.PI/2;
            
            hubGroup.add(arm.root);
            meshes.microArms.push({
                arm: arm,
                phase: Math.random() * Math.PI * 2,
                speed: 1.0 + Math.random()
            });
        }
    }

    parts.push({
        name: "Macro & Micro Kinematic Assembly Arms",
        description: "Thousands of fractal multi-jointed arms scaling from 50 meters down to 50 nanometers.",
        material: "Titanium, Graphene, Servo-actuators",
        function: "Assembles components with perfect precision across all scalar tiers.",
        assemblyOrder: 5,
        connections: ["Compute Rings", "Daughter Probes"],
        failureEffect: "Misalignment of atomic structures in daughter units.",
        cascadeFailures: ["Defective probe swarms", "Kessler syndrome due to exploding probes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: -100 }
    });

    // -------------------------------------------------------------------------
    // 6. DAUGHTER PROBE SWARM (The Output)
    // -------------------------------------------------------------------------
    const swarmGroup = new THREE.Group();
    swarmGroup.position.set(100, 0, 0);

    const probeBaseGeo = new THREE.TetrahedronGeometry(2, 1);
    const engineGeo = new THREE.ConeGeometry(0.5, 2, 8);

    for (let i = 0; i < 100; i++) {
        const probeGroup = new THREE.Group();
        
        const hull = new THREE.Mesh(probeBaseGeo, darkSteel);
        probeGroup.add(hull);

        const engine = new THREE.Mesh(engineGeo, chrome);
        engine.position.z = -1.5;
        engine.rotation.x = Math.PI / 2;
        probeGroup.add(engine);

        const engineGlow = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), neonPurple);
        engineGlow.position.z = -2.5;
        probeGroup.add(engineGlow);

        // Random starting positions within a swarm cloud
        const r = 30 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        probeGroup.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        
        probeGroup.lookAt(200, probeGroup.position.y, probeGroup.position.z);
        
        swarmGroup.add(probeGroup);
        meshes.daughterProbes.push({
            mesh: probeGroup,
            basePos: probeGroup.position.clone(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.2 + Math.random() * 0.3
        });
    }
    group.add(swarmGroup);

    parts.push({
        name: "Daughter Probe Swarm",
        description: "Fully assembled miniature Von Neumann probes ready for interstellar dispersion.",
        material: "Refined Asteroid Matter, Dark Matter Drive Cores",
        function: "Locates new star systems to restart the replication cycle.",
        assemblyOrder: 6,
        connections: ["Assembly Arms", "Launch Rail"],
        failureEffect: "Stagnation of the exponential growth curve.",
        cascadeFailures: ["Overpopulation of factory sector", "Resource exhaustion"],
        originalPosition: { x: 100, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 0, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 7. PARTICLE SYSTEM (Sparks & Debris)
    // -------------------------------------------------------------------------
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVels = [];

    for (let i = 0; i < particleCount; i++) {
        particlePos[i * 3] = -80 + (Math.random() - 0.5) * 40; // Near the maw
        particlePos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        particlePos[i * 3 + 2] = (Math.random() - 0.5) * 40;
        
        particleVels.push(new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ));
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xffaa00,
        size: 0.5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const sparkSystem = new THREE.Points(particleGeo, particleMat);
    group.add(sparkSystem);
    meshes.sparks = { system: sparkSystem, velocities: particleVels };

    // -------------------------------------------------------------------------
    // 8. ADDITIONAL GREEBLES & SENSORS
    // -------------------------------------------------------------------------
    // Adding some communication dishes
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 100, 0);
    const dishGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dish = new THREE.Mesh(dishGeo, aluminum);
    dish.rotation.x = Math.PI; // point up
    dishGroup.add(dish);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 20), steel);
    antenna.position.y = -10;
    dishGroup.add(antenna);
    
    group.add(dishGroup);

    parts.push({
        name: "Subspace Transceiver Array",
        description: "A parabolic array tuned for entangled quantum communication with other factory instances.",
        material: "Aluminum, Superconducting Metamaterials",
        function: "Coordinates the Swarm network across light-years.",
        assemblyOrder: 7,
        connections: ["Central Hub Core"],
        failureEffect: "Isolation from the hive mind.",
        cascadeFailures: ["Redundant targeting", "Friendly fire protocols disabled"],
        originalPosition: { x: 0, y: 100, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    // Conveyor Belt / Rails connecting maw to hub
    const railGeo = new THREE.BoxGeometry(100, 2, 10);
    const rail = new THREE.Mesh(railGeo, steel);
    rail.position.set(-40, -15, 0);
    group.add(rail);

    parts.push({
        name: "Magnetic Conveyance Rails",
        description: "High-speed maglev lines transporting refined ingots from spectrometers to the assembly layers.",
        material: "Steel, YBCO Superconductors",
        function: "Logistical transport artery.",
        assemblyOrder: 8,
        connections: ["Mass Spectrometers", "Central Hub Core"],
        failureEffect: "Logistics bottleneck.",
        cascadeFailures: ["Arm starvation", "Maw backup"],
        originalPosition: { x: -40, y: -15, z: 0 },
        explodedPosition: { x: -40, y: -150, z: -50 }
    });

    // -------------------------------------------------------------------------
    // 9. QUIZ QUESTIONS (PhD Level)
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In a purely kinematic model of a 6-DOF fractal robotic arm recursively instantiating smaller variants, what happens to the Jacobian matrix determinant as the scalar ratio approaches the singularity limit (L_n -> 0)?",
            options: [
                "It diverges to infinity due to cascading inverse kinematics.",
                "It collapses to zero, resulting in kinematic singularities at all micro-joints simultaneously.",
                "It oscillates periodically depending on the Denavit-Hartenberg parameters.",
                "It normalizes into an identity matrix representing perfect rigid-body motion."
            ],
            correctAnswerIndex: 1,
            explanation: "As link lengths (L_n) approach zero, the columns of the Jacobian matrix become linearly dependent, leading to a zero determinant and a total loss of manipulability (a singularity condition at the nano-scale)."
        },
        {
            question: "Assuming this Von Neumann probe replicates via a logistic growth function dN/dt = rN(1 - N/K), how does the 'Great Maw's' consumption rate affect the carrying capacity 'K' of the local asteroid belt?",
            options: [
                "K remains strictly constant; consumption only affects 'r'.",
                "K decreases monotonically as raw materials are permanently converted into closed-system probes.",
                "K increases exponentially due to the mass-energy equivalence principle.",
                "K fluctuates based on the thermal efficiency of the plasma spectrometers."
            ],
            correctAnswerIndex: 1,
            explanation: "In resource-constrained self-replication, K (carrying capacity) is directly proportional to available raw matter. As the Maw consumes the asteroid to build probes, the total available external matter decreases monotonically."
        },
        {
            question: "What is the primary thermodynamic constraint when using a cyclotron mass spectrometer for sorting atomic species at the scale of millions of tons per hour?",
            options: [
                "Magnetic hysteresis in the YBCO rails.",
                "The Bremstrahlung radiation emitted by decelerating heavy ions melting the quartz tubes.",
                "Quantum tunneling of isotopes across the electromagnetic sorting barrier.",
                "Gravitational shear forces tearing the spiral apart."
            ],
            correctAnswerIndex: 1,
            explanation: "Sorting massive quantities of ionized matter via electromagnetic deflection requires extreme accelerations and decelerations, generating lethal amounts of Bremsstrahlung (braking radiation) that must be thermally managed."
        },
        {
            question: "To prevent Kessler Syndrome during the simultaneous launch of 100,000 daughter probes, which orbital mechanics principle must the Swarm AGI heavily optimize?",
            options: [
                "Hohmann transfer synchronicity.",
                "Non-intersecting Lambertian trajectories with collision-avoidance perturbation limits.",
                "Lagrangian point stabilization.",
                "Geostationary orbital decay rates."
            ],
            correctAnswerIndex: 1,
            explanation: "Solving Lambert's problem for thousands of simultaneous bodies requires calculating non-intersecting trajectories considering multi-body perturbations to ensure no two paths cross at the same time."
        },
        {
            question: "When evaluating the AGI core's error-correction, if a single bit flip in the 'Macro Arm' DNA causes a 0.01% alignment error, how does this propagate down to the 'Nano Arm' tier (assuming 5 fractal layers)?",
            options: [
                "It propagates linearly (0.05% error).",
                "It propagates exponentially, resulting in a geometric compounding of mechanical tolerances (O(c^n)).",
                "It is completely absorbed by the micro-tier's compliance mechanisms.",
                "It reverses due to phase-conjugate feedback loops."
            ],
            correctAnswerIndex: 1,
            explanation: "In recursive manufacturing, a fundamental tolerance error at a macro level acts as the baseline coordinate frame for the next level. This causes exponential compounding of errors, severely degrading precision at the nanoscale unless strictly calibrated."
        }
    ];

    // -------------------------------------------------------------------------
    // 10. ANIMATE FUNCTION
    // -------------------------------------------------------------------------
    function animate(time, speed) {
        const t = time * speed;

        // 1. Rotate Asteroid slowly and move it slightly into the maw
        asteroidGroup.rotation.y = t * 0.1;
        asteroidGroup.rotation.x = t * 0.05;
        // Simulating the asteroid being pulled in very slowly
        asteroidGroup.position.x = -150 + Math.sin(t * 0.05) * 10; 

        // 2. Grind the Maw Gears
        meshes.grinderGears.forEach(g => {
            g.mesh.rotation.z += g.speed * speed;
        });

        // 3. Rotate Hub Rings at different speeds
        meshes.rings.forEach(r => {
            r.mesh.rotation.z += r.speed * speed;
        });

        // 4. Pulse Plasma Cores
        meshes.energyCores.forEach(core => {
            const scale = 1 + Math.sin(t * 5) * 0.05;
            core.scale.set(scale, scale, scale);
            core.material.emissiveIntensity = 4 + Math.sin(t * 10) * 2;
        });

        // 5. Plasma stream UV scrolling (if we had textures, but we will pulse opacity)
        meshes.plasmaStreams.forEach((stream, i) => {
            stream.material.opacity = 0.5 + Math.sin(t * 10 + i) * 0.5;
        });

        // 6. Kinematic Arm Movements
        // Macro Arms
        meshes.macroArms.forEach((m, idx) => {
            const cycle = t * m.speed + m.phase;
            m.arm.shoulder.rotation.y = Math.sin(cycle) * 1.5;
            m.arm.elbow.rotation.x = Math.sin(cycle * 1.3) * 1.0 - 0.5;
            m.arm.wrist.rotation.z = Math.cos(cycle * 1.7) * 2.0;
            // Claw pinch
            m.arm.claw.children[1].rotation.z = Math.sin(cycle * 3) * 0.2;
            m.arm.claw.children[2].rotation.z = -Math.sin(cycle * 3) * 0.2;
        });

        // Micro Arms
        meshes.microArms.forEach((m, idx) => {
            const cycle = t * m.speed * 2 + m.phase;
            m.arm.shoulder.rotation.y = Math.cos(cycle) * 2.0;
            m.arm.elbow.rotation.x = Math.sin(cycle * 1.5) * 1.2;
            m.arm.wrist.rotation.x = Math.sin(cycle * 2.0);
        });

        // 7. Swarm Movement (Flocking/Orbiting)
        meshes.daughterProbes.forEach(p => {
            const cycle = t * p.speed + p.phase;
            // Orbiting motion
            p.mesh.position.x = p.basePos.x + Math.sin(cycle) * 20;
            p.mesh.position.y = p.basePos.y + Math.cos(cycle * 1.2) * 20;
            p.mesh.position.z = p.basePos.z + Math.sin(cycle * 0.8) * 20;
            
            // Point slightly forward in their orbit
            p.mesh.rotation.y += 0.05 * speed;
            p.mesh.rotation.z = Math.sin(cycle) * 0.2;
        });

        // 8. Particle System (Sparks flying from the Maw)
        if (meshes.sparks) {
            const positions = meshes.sparks.system.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                // Update position by velocity
                positions[i * 3] += meshes.sparks.velocities[i].x * speed;
                positions[i * 3 + 1] += meshes.sparks.velocities[i].y * speed;
                positions[i * 3 + 2] += meshes.sparks.velocities[i].z * speed;

                // Reset if they fly too far
                if (Math.abs(positions[i * 3] + 80) > 40 || 
                    Math.abs(positions[i * 3 + 1]) > 40 || 
                    Math.abs(positions[i * 3 + 2]) > 40) {
                    
                    positions[i * 3] = -80 + (Math.random() - 0.5) * 10;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
                }
            }
            meshes.sparks.system.geometry.attributes.position.needsUpdate = true;
        }

        // 9. Subspace Dish Rotation
        dishGroup.rotation.y = t * 0.5;
    }

    return {
        group,
        parts,
        description: "A God-Tier Von Neumann Self-Replicating Factory. This moon-sized megastructure consumes celestial bodies, refines their atomic structure via massive cyclotrons, and uses a fractal hierarchy of robotic arms to construct identical daughter probes for exponential galactic colonization.",
        quizQuestions,
        animate
    };
}
