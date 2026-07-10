import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ============================================================================
    // GOD TIER HAWKING RADIATION LASER - CORE PHYSICS & METADATA
    // ============================================================================
    const description = `
    GOD TIER HAWKING RADIATION LASER (GTHRL - Mk IX)
    This colossal, hyper-advanced mechanism harnesses the thermodynamic output 
    of an evaporating micro black hole. By magnetically and gravimetrically 
    confining a Kerr-Newman singularity, it taps into the Hawking radiation 
    (and Penrose process energy) emitted as the black hole slowly evaporates. 
    The radiation is collimated through an array of extreme-index metamaterial 
    lenses and a massive parabolic reflector, forming a coherent, highly destructive beam.
    The system requires catastrophic heat dissipation arrays to manage the 
    near-Planck temperatures at the event horizon's inner boundary.
    `;

    // ============================================================================
    // CUSTOM GLOWING / NEON MATERIALS
    // ============================================================================
    const eventHorizonMat = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        side: THREE.DoubleSide 
    });
    const accretionCoreMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xff8800, 
        emissiveIntensity: 15, 
        transparent: true, 
        opacity: 0.95, 
        blending: THREE.AdditiveBlending 
    });
    const accretionEdgeMat = new THREE.MeshStandardMaterial({ 
        color: 0xff4400, 
        emissive: 0xff1100, 
        emissiveIntensity: 8, 
        transparent: true, 
        opacity: 0.7, 
        blending: THREE.AdditiveBlending 
    });
    const lensMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        transmission: 1.0, 
        opacity: 1, 
        metalness: 0.1, 
        roughness: 0.05, 
        ior: 3.5, 
        thickness: 15.0, 
        specularIntensity: 2.0 
    });
    const radiatorMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        emissive: 0xff3300, 
        emissiveIntensity: 0.0, // Animated later
        roughness: 0.9, 
        metalness: 0.5 
    });
    const beamMat = new THREE.MeshStandardMaterial({ 
        color: 0xccffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 20, 
        transparent: true, 
        opacity: 0.9, 
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide 
    });
    const neonBlueMat = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff, 
        emissive: 0x0088ff, 
        emissiveIntensity: 8 
    });
    const warningMat = new THREE.MeshStandardMaterial({ 
        color: 0xffcc00, 
        roughness: 0.8, 
        metalness: 0.1 
    });
    const plasmaMat = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0x8800ff, 
        emissiveIntensity: 10,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // ============================================================================
    // ANIMATION STATE & CACHE
    // ============================================================================
    const animState = {
        time: 0,
        blackHoleMass: 10.0, 
        entropy: 100.0,
        coolingCycle: 0,
    };
    
    const animMeshes = {
        containmentRings: [],
        accretionDisks: [],
        radiatorFins: [],
        lenses: [],
        singularity: null,
        mainBeam: null,
        hydraulicPistons: [],
        coolantPipes: [],
        floatingParticles: []
    };

    // ============================================================================
    // HELPER FUNCTIONS FOR EXTREME GEOMETRY GENERATION
    // ============================================================================
    
    function createComplexGearShape(outerRad, innerRad, teeth, toothDepth) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle = i * step;
            const nextAngle = (i + 1) * step;
            const m1 = angle + step * 0.2;
            const m2 = angle + step * 0.8;

            if (i === 0) shape.moveTo(Math.cos(angle) * outerRad, Math.sin(angle) * outerRad);
            else shape.lineTo(Math.cos(angle) * outerRad, Math.sin(angle) * outerRad);

            shape.lineTo(Math.cos(m1) * (outerRad + toothDepth), Math.sin(m1) * (outerRad + toothDepth));
            shape.lineTo(Math.cos(m2) * (outerRad + toothDepth), Math.sin(m2) * (outerRad + toothDepth));
            shape.lineTo(Math.cos(nextAngle) * outerRad, Math.sin(nextAngle) * outerRad);
        }
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRad, 0, Math.PI * 2, false);
        shape.holes.push(hole);
        return shape;
    }

    function createParabolaPoints(radius, depth, steps) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * radius;
            // y = a * x^2
            const a = depth / (radius * radius);
            const y = a * (x * x);
            points.push(new THREE.Vector2(x, y));
        }
        return points;
    }

    function createCatmullRomPipe(pointsArr, radius, segments) {
        const curve = new THREE.CatmullRomCurve3(pointsArr.map(p => new THREE.Vector3(p[0], p[1], p[2])));
        return new THREE.TubeGeometry(curve, 64, radius, segments, false);
    }

    // ============================================================================
    // PART 1: MASSIVE BASE CHASSIS
    // ============================================================================
    const buildBaseChassis = () => {
        const chassisGroup = new THREE.Group();
        
        // Main Octagonal Platform
        const octoShape = new THREE.Shape();
        const rad = 80;
        for (let i = 0; i < 8; i++) {
            const a = i * Math.PI / 4;
            if (i === 0) octoShape.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
            else octoShape.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        octoShape.lineTo(Math.cos(0) * rad, Math.sin(0) * rad);
        const centralHole = new THREE.Path();
        centralHole.absarc(0, 0, 30, 0, Math.PI * 2, false);
        octoShape.holes.push(centralHole);

        const extrudeSettings = { depth: 15, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 3, bevelThickness: 3 };
        const platformGeom = new THREE.ExtrudeGeometry(octoShape, extrudeSettings);
        const platformMesh = new THREE.Mesh(platformGeom, darkSteel);
        platformMesh.rotation.x = Math.PI / 2;
        platformMesh.position.y = -40;
        chassisGroup.add(platformMesh);

        // Internal support ribs
        for (let i = 0; i < 16; i++) {
            const ribGeom = new THREE.BoxGeometry(4, 15, 50);
            const rib = new THREE.Mesh(ribGeom, steel);
            const angle = i * Math.PI / 8;
            rib.position.set(Math.cos(angle) * 50, -47.5, Math.sin(angle) * 50);
            rib.rotation.y = -angle;
            chassisGroup.add(rib);
        }

        // Sub-tier foundation
        const subTierGeom = new THREE.CylinderGeometry(90, 100, 10, 32);
        const subTier = new THREE.Mesh(subTierGeom, darkSteel);
        subTier.position.y = -55;
        chassisGroup.add(subTier);

        return chassisGroup;
    };
    const part_BaseChassis = buildBaseChassis();
    group.add(part_BaseChassis);
    parts.push({
        name: "Omni-Directional_Mounting_Chassis",
        mesh: part_BaseChassis,
        description: "Massive octagonal dark-steel platform housing the extreme power conduits and gravimetric dampeners required to stabilize the singularity.",
        material: "Dark Steel / Steel",
        function: "Structural foundation and shock absorption",
        assemblyOrder: 1,
        connections: ["Gravimetric_Pedestal", "Coolant_Pumping_Station"],
        failureEffect: "Catastrophic structural collapse under localized gravity sheer.",
        cascadeFailures: ["Containment breach", "Planet-cracking event"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -100, z: 0}
    });

    // ============================================================================
    // PART 2: GRAVIMETRIC PEDESTAL & COILS
    // ============================================================================
    const buildPedestal = () => {
        const pedGroup = new THREE.Group();
        
        // Central Core
        const coreGeom = new THREE.CylinderGeometry(25, 30, 40, 64);
        const core = new THREE.Mesh(coreGeom, chrome);
        core.position.y = -20;
        pedGroup.add(core);

        // Superconducting Coils (Torus Array)
        for (let i = 0; i < 8; i++) {
            const coilGeom = new THREE.TorusGeometry(32, 3, 32, 100);
            const coil = new THREE.Mesh(coilGeom, copper);
            coil.rotation.x = Math.PI / 2;
            coil.position.y = -35 + (i * 4);
            pedGroup.add(coil);
        }

        // Vertical Hydraulic Mounts
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const mountGeom = new THREE.CylinderGeometry(3, 3, 40, 32);
            const mount = new THREE.Mesh(mountGeom, steel);
            mount.position.set(Math.cos(angle) * 35, -20, Math.sin(angle) * 35);
            pedGroup.add(mount);

            const pistonGeom = new THREE.CylinderGeometry(1.5, 1.5, 30, 32);
            const piston = new THREE.Mesh(pistonGeom, chrome);
            piston.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
            animMeshes.hydraulicPistons.push(piston);
            pedGroup.add(piston);
        }

        return pedGroup;
    };
    const part_Pedestal = buildPedestal();
    group.add(part_Pedestal);
    parts.push({
        name: "Gravimetric_Pedestal_and_Coils",
        mesh: part_Pedestal,
        description: "Contains 8 layers of YBCO superconducting coils carrying peta-amperes of current to manipulate the local Higgs field.",
        material: "Chrome / Copper / Steel",
        function: "Suspends the machine in a localized zero-G bubble",
        assemblyOrder: 2,
        connections: ["Omni-Directional_Mounting_Chassis", "Containment_Field_Generator_Alpha"],
        failureEffect: "Singularity instantly falls through the Earth.",
        cascadeFailures: ["Complete annihilation of the core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // ============================================================================
    // PART 3, 4, 5: CONTAINMENT FIELD GENERATORS (ALPHA, BETA, GAMMA)
    // ============================================================================
    const buildContainmentRing = (radius, thickness, teeth) => {
        const ringGroup = new THREE.Group();
        
        // Outer Gear
        const gearShape = createComplexGearShape(radius, radius - thickness, teeth, 4);
        const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 1 };
        const gearGeom = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
        const gear = new THREE.Mesh(gearGeom, darkSteel);
        gear.position.z = -2.5; // Center extrusion
        ringGroup.add(gear);

        // Inner glowing track
        const trackGeom = new THREE.TorusGeometry(radius - thickness + 1, 1.5, 32, 100);
        const track = new THREE.Mesh(trackGeom, neonBlueMat);
        ringGroup.add(track);

        // Emitter nodes
        for (let i = 0; i < teeth; i++) {
            const angle = i * (Math.PI * 2) / teeth;
            const nodeGeom = new THREE.CylinderGeometry(1, 2, 8, 16);
            const node = new THREE.Mesh(nodeGeom, chrome);
            node.rotation.x = Math.PI / 2;
            node.rotation.z = angle;
            node.position.set(Math.cos(angle) * (radius - thickness + 2), Math.sin(angle) * (radius - thickness + 2), 0);
            ringGroup.add(node);
        }

        return ringGroup;
    };

    const part_RingAlpha = buildContainmentRing(40, 8, 24);
    part_RingAlpha.position.y = 15;
    animMeshes.containmentRings.push({ mesh: part_RingAlpha, axis: 'x', speed: 0.02 });
    group.add(part_RingAlpha);
    parts.push({
        name: "Containment_Field_Generator_Alpha",
        mesh: part_RingAlpha,
        description: "The primary X-axis Penrose-effect containment ring. Uses exotic matter to create a repulsive gravity well.",
        material: "Dark Steel / Chrome / Neon Emitters",
        function: "Maintains singularity position on the X-axis",
        assemblyOrder: 3,
        connections: ["Containment_Field_Generator_Beta"],
        failureEffect: "Singularity breaches X-axis.",
        cascadeFailures: ["Spaghettification of port-side geometry"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 100, y: 15, z: 0}
    });

    const part_RingBeta = buildContainmentRing(30, 6, 16);
    part_RingBeta.position.y = 15;
    part_RingBeta.rotation.x = Math.PI / 2;
    animMeshes.containmentRings.push({ mesh: part_RingBeta, axis: 'y', speed: -0.035 });
    group.add(part_RingBeta);
    parts.push({
        name: "Containment_Field_Generator_Beta",
        mesh: part_RingBeta,
        description: "The secondary Y-axis containment ring. Syncs with Alpha to form a spherical metric tensor field.",
        material: "Dark Steel / Chrome",
        function: "Maintains singularity position on the Y-axis",
        assemblyOrder: 4,
        connections: ["Containment_Field_Generator_Alpha", "Containment_Field_Generator_Gamma"],
        failureEffect: "Singularity breaches Y-axis.",
        cascadeFailures: ["Event horizon expansion"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 115, z: 0}
    });

    const part_RingGamma = buildContainmentRing(22, 4, 12);
    part_RingGamma.position.y = 15;
    part_RingGamma.rotation.y = Math.PI / 2;
    animMeshes.containmentRings.push({ mesh: part_RingGamma, axis: 'z', speed: 0.05 });
    group.add(part_RingGamma);
    parts.push({
        name: "Containment_Field_Generator_Gamma",
        mesh: part_RingGamma,
        description: "The innermost Z-axis ring. Directly interfaces with the accretion disk plasma to siphon angular momentum.",
        material: "Dark Steel / Chrome",
        function: "Rotational stabilization",
        assemblyOrder: 5,
        connections: ["Containment_Field_Generator_Beta", "Event_Horizon_Singularity"],
        failureEffect: "Loss of angular momentum extraction.",
        cascadeFailures: ["Laser power drops to 0", "Overheating"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 15, z: -100}
    });

    // ============================================================================
    // PART 6: EVENT HORIZON SINGULARITY
    // ============================================================================
    const buildSingularity = () => {
        const singGroup = new THREE.Group();
        const sphereGeom = new THREE.SphereGeometry(3, 64, 64);
        const sphere = new THREE.Mesh(sphereGeom, eventHorizonMat);
        
        // Add a slight gravitational lensing aura (inverse hull)
        const auraGeom = new THREE.SphereGeometry(3.5, 64, 64);
        const auraMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
        const aura = new THREE.Mesh(auraGeom, auraMat);

        singGroup.add(sphere);
        singGroup.add(aura);
        singGroup.position.y = 15;
        
        animMeshes.singularity = singGroup;
        return singGroup;
    };
    const part_Singularity = buildSingularity();
    group.add(part_Singularity);
    parts.push({
        name: "Event_Horizon_Singularity",
        mesh: part_Singularity,
        description: "A micro black hole with a mass of 10^12 kg. Evaporating aggressively due to Hawking radiation. Absolute black body.",
        material: "Perfect Void",
        function: "Primary energy source",
        assemblyOrder: 6,
        connections: ["Containment_Field_Generator_Gamma"],
        failureEffect: "Complete annihilation.",
        cascadeFailures: ["End of the world"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // ============================================================================
    // PART 7: ACCRETION DISK PLASMA
    // ============================================================================
    const buildAccretionDisk = () => {
        const diskGroup = new THREE.Group();
        
        // Inner hot core
        const coreGeom = new THREE.TorusGeometry(6, 1.5, 32, 100);
        const core = new THREE.Mesh(coreGeom, accretionCoreMat);
        core.rotation.x = Math.PI / 2;
        diskGroup.add(core);
        animMeshes.accretionDisks.push({ mesh: core, speed: 0.2 });

        // Outer cooler edge
        const edgeGeom = new THREE.TorusGeometry(9, 2, 32, 100);
        const edge = new THREE.Mesh(edgeGeom, accretionEdgeMat);
        edge.rotation.x = Math.PI / 2;
        diskGroup.add(edge);
        animMeshes.accretionDisks.push({ mesh: edge, speed: 0.1 });

        // Extreme plasma anomalies (TorusKnots)
        const anomalyGeom = new THREE.TorusKnotGeometry(7, 0.5, 100, 16, 3, 7);
        const anomaly = new THREE.Mesh(anomalyGeom, plasmaMat);
        anomaly.rotation.x = Math.PI / 2;
        diskGroup.add(anomaly);
        animMeshes.accretionDisks.push({ mesh: anomaly, speed: -0.15 });

        // Floating plasma particles
        for(let i=0; i<100; i++) {
            const pGeom = new THREE.SphereGeometry(0.2, 8, 8);
            const p = new THREE.Mesh(pGeom, accretionCoreMat);
            const angle = Math.random() * Math.PI * 2;
            const dist = 5 + Math.random() * 8;
            p.position.set(Math.cos(angle)*dist, (Math.random()-0.5)*2, Math.sin(angle)*dist);
            diskGroup.add(p);
            animMeshes.floatingParticles.push({ mesh: p, angle: angle, dist: dist, speed: 0.1 + Math.random()*0.2 });
        }

        diskGroup.position.y = 15;
        return diskGroup;
    };
    const part_AccretionDisk = buildAccretionDisk();
    group.add(part_AccretionDisk);
    parts.push({
        name: "Accretion_Disk_Plasma",
        mesh: part_AccretionDisk,
        description: "Superheated plasma trapped in the ergosphere. Emits immense X-rays and acts as a buffer for the containment field.",
        material: "Superheated Plasma",
        function: "Energy buffering and angular momentum transfer",
        assemblyOrder: 7,
        connections: ["Event_Horizon_Singularity"],
        failureEffect: "Plasma venting.",
        cascadeFailures: ["Melting of containment rings"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // ============================================================================
    // PART 8: PRIMARY PARABOLIC REFLECTOR
    // ============================================================================
    const buildPrimaryReflector = () => {
        const dishGroup = new THREE.Group();
        
        // Generate Parabola points
        const points = createParabolaPoints(120, 80, 100);
        const dishGeom = new THREE.LatheGeometry(points, 128);
        const dish = new THREE.Mesh(dishGeom, chrome);
        
        // The dish faces +Z. Lathe rotates around Y by default.
        // We need to rotate it so the "cup" opens towards +Z.
        dish.rotation.x = Math.PI / 2;
        
        // Position so the focal point (y=0 of the lathe) is exactly at the singularity (0, 15, 0)
        // Wait, if depth is 80, focal length f = r^2 / (4 * depth) = 120^2 / (4 * 80) = 14400 / 320 = 45.
        // The focal point of the parabola is at y = 45 in its local space.
        // We want local y=45 to be at world Z=0.
        // So the dish should be pushed back along Z by -45.
        dish.position.z = -45;
        dish.position.y = 15; // Align with singularity height
        
        dishGroup.add(dish);

        // Dish Backing / Support Structure
        const backingGeom = new THREE.LatheGeometry(points, 32);
        const backing = new THREE.Mesh(backingGeom, darkSteel);
        // Slightly scale up for thickness
        backing.scale.set(1.02, 1.05, 1.02);
        backing.rotation.x = Math.PI / 2;
        backing.position.z = -45;
        backing.position.y = 15;
        dishGroup.add(backing);

        // Massive Struts behind the dish
        for(let i=0; i<16; i++) {
            const angle = i * Math.PI / 8;
            const strutGeom = new THREE.CylinderGeometry(2, 4, 100, 16);
            const strut = new THREE.Mesh(strutGeom, steel);
            strut.position.set(Math.cos(angle)*60, 15, -70);
            strut.rotation.x = Math.PI / 2;
            strut.rotation.z = angle;
            dishGroup.add(strut);
        }

        return dishGroup;
    };
    const part_PrimaryReflector = buildPrimaryReflector();
    group.add(part_PrimaryReflector);
    parts.push({
        name: "Primary_Parabolic_Reflector",
        mesh: part_PrimaryReflector,
        description: "Massive 240m diameter dish coated in neutron-star degenerate matter to reflect extreme gamma and Hawking radiation without vaporizing.",
        material: "Degenerate Chrome / Dark Steel",
        function: "Collimates omnidirectional Hawking radiation into a directional beam",
        assemblyOrder: 8,
        connections: ["Omni-Directional_Mounting_Chassis", "Event_Horizon_Singularity"],
        failureEffect: "Radiation blasts backwards destroying the facility.",
        cascadeFailures: ["Vaporization of the Earth's crust"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -150}
    });

    // ============================================================================
    // PART 9: SECONDARY REFLECTOR & BAFFLES
    // ============================================================================
    const buildSecondaryReflector = () => {
        const secGroup = new THREE.Group();
        const points = createParabolaPoints(30, 10, 64);
        const secGeom = new THREE.LatheGeometry(points, 64);
        const secMesh = new THREE.Mesh(secGeom, chrome);
        
        // Opens towards -Z to catch forward-emitted radiation and bounce it back to the primary
        secMesh.rotation.x = -Math.PI / 2; 
        secMesh.position.z = 40; 
        secMesh.position.y = 15;
        secGroup.add(secMesh);

        // Support Struts connecting to Primary
        for(let i=0; i<4; i++) {
            const angle = i * Math.PI / 2;
            const strutGeom = new THREE.CylinderGeometry(1, 1, 90, 16);
            const strut = new THREE.Mesh(strutGeom, steel);
            strut.position.set(Math.cos(angle)*28, 15 + Math.sin(angle)*28, -5);
            strut.rotation.x = Math.PI / 2;
            secGroup.add(strut);
        }

        return secGroup;
    };
    const part_SecondaryReflector = buildSecondaryReflector();
    group.add(part_SecondaryReflector);
    parts.push({
        name: "Cassegrain_Secondary_Reflector",
        mesh: part_SecondaryReflector,
        description: "A smaller parabolic mirror suspended in front of the singularity. Reflects forward-escaping radiation back into the primary dish.",
        material: "Chrome / Steel",
        function: "Maximizes radiation capture efficiency",
        assemblyOrder: 9,
        connections: ["Primary_Parabolic_Reflector"],
        failureEffect: "50% loss in beam coherence.",
        cascadeFailures: ["Overheating of forward arrays"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 100}
    });

    // ============================================================================
    // PART 10: METAMATERIAL LENSING ARRAY
    // ============================================================================
    const buildLensingArray = () => {
        const lensGroup = new THREE.Group();
        const lensRadii = [45, 40, 35, 30, 25, 20];
        const zPositions = [80, 120, 160, 200, 240, 280];

        for (let i = 0; i < lensRadii.length; i++) {
            const lGeom = new THREE.CylinderGeometry(lensRadii[i], lensRadii[i], 5, 64);
            const lens = new THREE.Mesh(lGeom, lensMat);
            lens.rotation.x = Math.PI / 2;
            lens.position.set(0, 15, zPositions[i]);
            
            // Housing ring for lens
            const ringGeom = new THREE.TorusGeometry(lensRadii[i] + 2, 2, 16, 64);
            const ring = new THREE.Mesh(ringGeom, darkSteel);
            ring.position.set(0, 15, zPositions[i]);
            
            lensGroup.add(lens);
            lensGroup.add(ring);
            animMeshes.lenses.push({ mesh: lens, baseZ: zPositions[i], offsetPhase: i });
        }
        return lensGroup;
    };
    const part_LensingArray = buildLensingArray();
    group.add(part_LensingArray);
    parts.push({
        name: "Metamaterial_Lensing_Array",
        mesh: part_LensingArray,
        description: "A series of 6 extreme-IOR spatial-warping lenses. They compress the scattered Hawking radiation into a tightly focused parallel beam.",
        material: "Lensing Crystal / Dark Steel",
        function: "Beam collimation and focal shifting",
        assemblyOrder: 10,
        connections: ["Laser_Barrel_Housing"],
        failureEffect: "Beam defocuses, melting the barrel.",
        cascadeFailures: ["Vaporization of forward structures"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    // ============================================================================
    // PART 11: LASER BARREL HOUSING
    // ============================================================================
    const buildBarrel = () => {
        const barrelGroup = new THREE.Group();
        
        // Massive outer tube with cutouts
        const shape = new THREE.Shape();
        shape.absarc(0, 0, 50, 0, Math.PI * 2, false);
        const inner = new THREE.Path();
        inner.absarc(0, 0, 48, 0, Math.PI * 2, false);
        shape.holes.push(inner);
        
        const extrudeSettings = { depth: 250, bevelEnabled: false, curveSegments: 64 };
        const barrelGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const barrel = new THREE.Mesh(barrelGeom, steel);
        barrel.position.set(0, 15, 50);
        barrelGroup.add(barrel);

        // Add external ribs
        for(let i = 50; i <= 300; i += 25) {
            const ribGeom = new THREE.TorusGeometry(52, 3, 32, 64);
            const rib = new THREE.Mesh(ribGeom, darkSteel);
            rib.position.set(0, 15, i);
            barrelGroup.add(rib);
        }

        return barrelGroup;
    };
    const part_Barrel = buildBarrel();
    group.add(part_Barrel);
    parts.push({
        name: "Titanium_Laser_Barrel_Housing",
        mesh: part_Barrel,
        description: "The primary structural housing for the lensing array. Built with extreme titanium-carbide alloys to withstand secondary thermal blooming.",
        material: "Steel / Dark Steel",
        function: "Protects and aligns the metamaterial lenses",
        assemblyOrder: 11,
        connections: ["Metamaterial_Lensing_Array", "Omni-Directional_Mounting_Chassis"],
        failureEffect: "Structural warp causing lens misalignment.",
        cascadeFailures: ["Beam reflects internally", "Explosion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -150, y: 0, z: 0}
    });

    // ============================================================================
    // PART 12 & 13: HEAT DISSIPATION RADIATOR BANKS (PORT & STARBOARD)
    // ============================================================================
    const buildRadiatorBank = (isPort) => {
        const radGroup = new THREE.Group();
        const finCount = 150; // Extreme detail
        const xOffset = isPort ? 100 : -100;
        
        // Main coolant manifold block
        const manifoldGeom = new THREE.BoxGeometry(20, 20, 200);
        const manifold = new THREE.Mesh(manifoldGeom, darkSteel);
        manifold.position.set(xOffset, 15, 100);
        radGroup.add(manifold);

        // Huge array of glowing fins
        for (let i = 0; i < finCount; i++) {
            const finGeom = new THREE.BoxGeometry(40, 60, 0.5);
            const fin = new THREE.Mesh(finGeom, radiatorMat);
            const zPos = (i * 1.3) + 5;
            fin.position.set(isPort ? xOffset + 30 : xOffset - 30, 15, zPos);
            radGroup.add(fin);
            animMeshes.radiatorFins.push(fin);

            // Micro heat-pipes for each fin
            const pipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 40, 8);
            const pipe = new THREE.Mesh(pipeGeom, copper);
            pipe.rotation.z = Math.PI / 2;
            pipe.position.set(isPort ? xOffset + 15 : xOffset - 15, 15, zPos);
            radGroup.add(pipe);
        }

        // Heavy support arms connecting to chassis
        const armGeom = new THREE.BoxGeometry(80, 10, 20);
        const arm1 = new THREE.Mesh(armGeom, steel);
        arm1.position.set(isPort ? 50 : -50, -10, 50);
        radGroup.add(arm1);
        
        const arm2 = new THREE.Mesh(armGeom, steel);
        arm2.position.set(isPort ? 50 : -50, -10, 150);
        radGroup.add(arm2);

        return radGroup;
    };

    const part_RadiatorPort = buildRadiatorBank(true);
    group.add(part_RadiatorPort);
    parts.push({
        name: "Port_Heat_Dissipation_Radiator_Bank",
        mesh: part_RadiatorPort,
        description: "150 ultra-thin graphene-aerogel fins. Designed to radiate terawatts of waste heat via blackbody radiation into the surrounding environment.",
        material: "Radiator Glow / Dark Steel / Copper",
        function: "Prevents thermal meltdown of the singularity containment",
        assemblyOrder: 12,
        connections: ["Main_Coolant_Manifold", "Omni-Directional_Mounting_Chassis"],
        failureEffect: "Rapid thermal buildup.",
        cascadeFailures: ["Containment coils melt", "Singularity drops"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 200, y: 0, z: 0}
    });

    const part_RadiatorStarboard = buildRadiatorBank(false);
    group.add(part_RadiatorStarboard);
    parts.push({
        name: "Starboard_Heat_Dissipation_Radiator_Bank",
        mesh: part_RadiatorStarboard,
        description: "Symmetrical counterpart to the port radiator bank. Operates in a binary cycle to ensure continuous heat rejection.",
        material: "Radiator Glow / Dark Steel / Copper",
        function: "Thermal regulation",
        assemblyOrder: 13,
        connections: ["Main_Coolant_Manifold", "Omni-Directional_Mounting_Chassis"],
        failureEffect: "Asymmetrical thermal expansion.",
        cascadeFailures: ["Structural shearing of the laser barrel"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -200, y: 0, z: 0}
    });

    // ============================================================================
    // PART 14: COOLANT PUMPING STATION
    // ============================================================================
    const buildCoolantPumps = () => {
        const pumpGroup = new THREE.Group();
        
        for (let i = -1; i <= 1; i += 2) {
            // Main spherical reservoirs
            const resGeom = new THREE.SphereGeometry(15, 32, 32);
            const res = new THREE.Mesh(resGeom, chrome);
            res.position.set(i * 40, -30, 80);
            pumpGroup.add(res);

            // Massive turbine pumps
            const pumpGeom = new THREE.CylinderGeometry(10, 10, 20, 32);
            const pump = new THREE.Mesh(pumpGeom, darkSteel);
            pump.rotation.x = Math.PI / 2;
            pump.position.set(i * 40, -30, 105);
            pumpGroup.add(pump);

            // Caution stripes
            const stripeGeom = new THREE.CylinderGeometry(10.1, 10.1, 4, 32);
            const stripe = new THREE.Mesh(stripeGeom, warningMat);
            stripe.rotation.x = Math.PI / 2;
            stripe.position.set(i * 40, -30, 105);
            pumpGroup.add(stripe);
        }

        return pumpGroup;
    };
    const part_CoolantPumps = buildCoolantPumps();
    group.add(part_CoolantPumps);
    parts.push({
        name: "Liquid_Helium_Coolant_Pumps",
        mesh: part_CoolantPumps,
        description: "Cryogenic pumping array pushing millions of liters of superfluid helium-4 per second to cool the superconducting containment coils.",
        material: "Chrome / Dark Steel / Warning Paint",
        function: "Maintains superconductivity in the coils",
        assemblyOrder: 14,
        connections: ["Gravimetric_Pedestal_and_Coils", "Port_Heat_Dissipation_Radiator_Bank"],
        failureEffect: "Superconductors quench instantly.",
        cascadeFailures: ["Explosive boiling of helium", "Loss of containment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -80, z: 100}
    });

    // ============================================================================
    // PART 15: MAIN POWER CONDUITS
    // ============================================================================
    const buildPowerConduits = () => {
        const conduitGroup = new THREE.Group();
        
        // Complex winding paths for cables
        const path1 = [
            [0, -50, 0],
            [30, -40, 20],
            [40, -10, 10],
            [20, 15, 0]
        ];
        const pipe1 = new THREE.Mesh(createCatmullRomPipe(path1, 2, 64), copper);
        conduitGroup.add(pipe1);

        const path2 = [
            [0, -50, 0],
            [-30, -40, 20],
            [-40, -10, 10],
            [-20, 15, 0]
        ];
        const pipe2 = new THREE.Mesh(createCatmullRomPipe(path2, 2, 64), copper);
        conduitGroup.add(pipe2);
        
        // Thick braided power bundles winding around the barrel
        for(let i=0; i<3; i++) {
            const bundlePath = [];
            for(let z=50; z<=250; z+=20) {
                const angle = (z / 200) * Math.PI * 4 + (i * Math.PI * 2 / 3);
                bundlePath.push([
                    Math.cos(angle) * 53,
                    15 + Math.sin(angle) * 53,
                    z
                ]);
            }
            const bundle = new THREE.Mesh(createCatmullRomPipe(bundlePath, 1.5, 128), rubber);
            conduitGroup.add(bundle);
        }

        return conduitGroup;
    };
    const part_PowerConduits = buildPowerConduits();
    group.add(part_PowerConduits);
    parts.push({
        name: "Superconducting_Power_Conduits",
        mesh: part_PowerConduits,
        description: "Massive copper and rubber shielded conduits transferring the tapped Hawking radiation energy directly into the secondary grid.",
        material: "Copper / Rubber",
        function: "Energy extraction and system powering",
        assemblyOrder: 15,
        connections: ["Omni-Directional_Mounting_Chassis", "Containment_Field_Generator_Alpha"],
        failureEffect: "Massive electrical arcing.",
        cascadeFailures: ["Frying of control cabin electronics"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 100, z: -50}
    });

    // ============================================================================
    // PART 16: CONTROL & MONITORING CABIN
    // ============================================================================
    const buildControlCabin = () => {
        const cabinGroup = new THREE.Group();
        
        // Stealth-bomber angular shape
        const shape = new THREE.Shape();
        shape.moveTo(-15, 0);
        shape.lineTo(15, 0);
        shape.lineTo(10, 15);
        shape.lineTo(20, 25);
        shape.lineTo(-20, 25);
        shape.lineTo(-10, 15);
        shape.lineTo(-15, 0);
        
        const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
        const cabinGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const cabin = new THREE.Mesh(cabinGeom, darkSteel);
        cabin.position.set(0, 50, -80);
        cabinGroup.add(cabin);

        // Tinted Windows (Boolean subtraction approximated by simple meshes overlay)
        const windowGeom = new THREE.PlaneGeometry(35, 12);
        const windowMesh = new THREE.Mesh(windowGeom, tinted);
        windowMesh.position.set(0, 70, -49);
        windowMesh.rotation.x = -Math.PI / 10;
        cabinGroup.add(windowMesh);

        // Operator Seat inside (visible if zoomed in or exploded)
        const seatGeom = new THREE.BoxGeometry(4, 6, 4);
        const seat = new THREE.Mesh(seatGeom, rubber);
        seat.position.set(0, 55, -60);
        cabinGroup.add(seat);

        // Control consoles glowing
        const consoleGeom = new THREE.BoxGeometry(10, 4, 3);
        const consoleMesh = new THREE.Mesh(consoleGeom, neonBlueMat);
        consoleMesh.position.set(0, 57, -54);
        consoleMesh.rotation.x = Math.PI / 4;
        cabinGroup.add(consoleMesh);

        return cabinGroup;
    };
    const part_ControlCabin = buildControlCabin();
    group.add(part_ControlCabin);
    parts.push({
        name: "Operator_Control_Matrix_Cabin",
        mesh: part_ControlCabin,
        description: "Heavily shielded bunker suspended above the primary dish. Contains manual overrides for the gravimetric dampeners and the laser firing sequence.",
        material: "Dark Steel / Tinted Glass / Rubber",
        function: "Human oversight and manual targeting",
        assemblyOrder: 16,
        connections: ["Primary_Parabolic_Reflector"],
        failureEffect: "Loss of manual control.",
        cascadeFailures: ["AI takes over", "Skynet scenario"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 200, z: -100}
    });

    // ============================================================================
    // PART 17: EMITTER NOZZLE
    // ============================================================================
    const buildEmitterNozzle = () => {
        const nozzleGroup = new THREE.Group();
        
        const baseGeom = new THREE.CylinderGeometry(40, 50, 40, 64);
        const base = new THREE.Mesh(baseGeom, chrome);
        base.rotation.x = Math.PI / 2;
        base.position.set(0, 15, 320);
        nozzleGroup.add(base);

        const tipGeom = new THREE.CylinderGeometry(20, 40, 30, 64);
        const tip = new THREE.Mesh(tipGeom, steel);
        tip.rotation.x = Math.PI / 2;
        tip.position.set(0, 15, 355);
        nozzleGroup.add(tip);

        // Focus Rings
        for(let i=0; i<3; i++) {
            const ringGeom = new THREE.TorusGeometry(22 + (i*5), 1.5, 32, 64);
            const ring = new THREE.Mesh(ringGeom, darkSteel);
            ring.position.set(0, 15, 370 + (i*15));
            nozzleGroup.add(ring);
        }

        return nozzleGroup;
    };
    const part_EmitterNozzle = buildEmitterNozzle();
    group.add(part_EmitterNozzle);
    parts.push({
        name: "Final_Collimation_Emitter_Nozzle",
        mesh: part_EmitterNozzle,
        description: "The final stage of the laser. Narrows the 100m wide internal beam down to a highly concentrated 40m diameter column of absolute destruction.",
        material: "Chrome / Steel",
        function: "Final beam focus and atmospheric piercing",
        assemblyOrder: 17,
        connections: ["Titanium_Laser_Barrel_Housing"],
        failureEffect: "Beam scatters.",
        cascadeFailures: ["Localized atmospheric ignition"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 200}
    });

    // ============================================================================
    // PART 18: COHERENT OUTPUT BEAM (THE LASER)
    // ============================================================================
    const buildMainBeam = () => {
        const beamGroup = new THREE.Group();
        
        // Massive cylinder stretching far away
        const beamGeom = new THREE.CylinderGeometry(18, 18, 1000, 64);
        const beamMesh = new THREE.Mesh(beamGeom, beamMat);
        beamMesh.rotation.x = Math.PI / 2;
        beamMesh.position.set(0, 15, 900); // starts after the nozzle and goes to z=1400
        
        beamGroup.add(beamMesh);
        animMeshes.mainBeam = beamMesh;
        
        return beamGroup;
    };
    const part_MainBeam = buildMainBeam();
    group.add(part_MainBeam);
    parts.push({
        name: "Coherent_Hawking_Radiation_Beam",
        mesh: part_MainBeam,
        description: "The output of the God Tier Laser. A blindingly bright, hyper-focused stream of Hawking radiation, capable of melting through planetary mantles.",
        material: "Pure Energy / Plasma",
        function: "Total annihilation of targets",
        assemblyOrder: 18,
        connections: ["Final_Collimation_Emitter_Nozzle"],
        failureEffect: "Beam stops.",
        cascadeFailures: ["Target survives"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 500}
    });

    // ============================================================================
    // PART 19: QUANTUM SENSOR ARRAY
    // ============================================================================
    const buildSensors = () => {
        const sensorGroup = new THREE.Group();
        
        for(let i = 60; i <= 280; i += 40) {
            const baseGeom = new THREE.BoxGeometry(6, 6, 6);
            const base = new THREE.Mesh(baseGeom, plastic);
            base.position.set(0, 68, i); // Top of the barrel
            sensorGroup.add(base);

            const dishGeom = new THREE.CylinderGeometry(4, 0.1, 4, 16);
            const dish = new THREE.Mesh(dishGeom, chrome);
            dish.position.set(0, 72, i);
            sensorGroup.add(dish);
        }

        return sensorGroup;
    };
    const part_Sensors = buildSensors();
    group.add(part_Sensors);
    parts.push({
        name: "Quantum_State_Sensors_Array",
        mesh: part_Sensors,
        description: "Array of incredibly sensitive detectors measuring the exact quantum state of the emitted radiation to ensure no information paradoxes occur locally.",
        material: "Plastic / Chrome",
        function: "Telemetry and quantum coherence monitoring",
        assemblyOrder: 19,
        connections: ["Titanium_Laser_Barrel_Housing"],
        failureEffect: "Data loss on beam efficiency.",
        cascadeFailures: ["None. Just annoying."],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // ============================================================================
    // PHD LEVEL BLACK HOLE THERMODYNAMICS QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "Given an evaporating Schwarzschild micro black hole at the core, what is the exact scaling relationship between its remaining mass $M$ and its power output $P$ via Hawking radiation, and how does this affect the extreme cooling system?",
            options: [
                "$P \\propto M^2$; Power drops as it shrinks, requiring less cooling.",
                "$P \\propto M^{-2}$; Power grows exponentially as mass drops, requiring dynamic non-linear cooling.",
                "$P \\propto M^{-3}$; Power grows cubically, instantly destroying the radiators.",
                "$P \\propto e^{-M}$; Power is logarithmic."
            ],
            correctAnswer: 1,
            explanation: "The Hawking temperature $T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}$ is inversely proportional to mass. The surface area of the event horizon $A \\propto M^2$. By the Stefan-Boltzmann law, power emitted $P \\propto A T^4 \\propto M^2 (M^{-1})^4 \\propto M^{-2}$. Thus, as the black hole evaporates and loses mass, its power output grows exponentially, demanding the massive radiator arrays to adapt rapidly."
        },
        {
            question: "In utilizing the black hole for energy, the Bekenstein-Hawking entropy $S_{BH}$ must be strictly managed. If the laser containment system forcibly injects charged particles to increase the black hole's mass $M$ by a factor of 2, how does the entropy of the singularity change?",
            options: [
                "Entropy is halved.",
                "Entropy remains constant (adiabatic process).",
                "Entropy doubles.",
                "Entropy quadruples."
            ],
            correctAnswer: 3,
            explanation: "Bekenstein-Hawking entropy is given by $S = \\frac{k_B c^3 A}{4 G \\hbar}$. Since the surface area $A$ of a Schwarzschild black hole is proportional to the square of its mass ($A = \\frac{16 \\pi G^2 M^2}{c^4}$), doubling the mass increases the area by a factor of $2^2 = 4$. Therefore, the entropy quadruples. The containment field must computationally account for this massive increase in microstate permutations."
        },
        {
            question: "The metamaterial lenses in the barrel simulate extreme gravitational warping to focus the radiation. To perfectly mimic a spherically symmetric gravitational lens in the weak-field limit, what must the effective refractive index $n(r)$ of the metamaterial be?",
            options: [
                "$n(r) = 1 - \\frac{2GM}{rc^2}$",
                "$n(r) = 1 + \\frac{2GM}{rc^2}$",
                "$n(r) = \\sqrt{1 - \\frac{2GM}{rc^2}}$",
                "$n(r) = e^{2GM/rc^2}$"
            ],
            correctAnswer: 1,
            explanation: "In the weak-field limit of General Relativity, an isotropic gravitational field acts on electromagnetic waves exactly like an optical medium with an effective index of refraction $n(r) = 1 + \\frac{2GM}{rc^2}$ (when modeled in flat, Minkowski space). The metamaterial lenses must precisely replicate this gradient profile to perfectly collimate the emitted Hawking radiation."
        },
        {
            question: "As the micro black hole nears the final stages of evaporation, the Hawking temperature approaches the Planck temperature. At this scale, which phenomenon poses the greatest catastrophic threat to the primary parabolic reflector?",
            options: [
                "Spontaneous emission of magnetic monopoles.",
                "Violent burst of high-energy gamma rays and massive hadrons (Black Hole Explosion).",
                "Extreme tidal stretching (spaghettification).",
                "Immediate topological expansion into a white hole."
            ],
            correctAnswer: 1,
            explanation: "As $M \\to 0$, the temperature $T \\to \\infty$. The black hole will radiate particles of increasingly higher rest mass as the thermal energy exceeds their mass-energy equivalence threshold ($kT > mc^2$). The final milliseconds produce a blinding, catastrophic burst of hard gamma rays, hadrons, and exotic particles, known as a black hole explosion, which would instantly vaporize standard reflector materials if not managed."
        },
        {
            question: "To amplify the laser via the Penrose process, the black hole is maintained as a rapidly spinning Kerr singularity. If the singularity is spun up to its maximal rotation parameter $a = GM/c$, from which exact region is the energy extracted?",
            options: [
                "The event horizon directly.",
                "The Ergosphere.",
                "The Singularity Ring.",
                "The Photon Sphere."
            ],
            correctAnswer: 1,
            explanation: "The Penrose process extracts energy specifically from the ergosphere of a rotating (Kerr) black hole. In this region, space-time is dragged along with the rotation of the black hole faster than the speed of light. Particles can enter the ergosphere, split in two, and one piece falls into the event horizon with negative energy (relative to infinity), while the other escapes with more energy than it initially had, effectively siphoning the black hole's rotational energy."
        }
    ];

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    
    // Simple 3D Noise function for sputtering effect
    const noise = (function() {
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
        return function(x, y, z) {
            return (Math.sin(x) + Math.sin(y) + Math.cos(z)) / 3.0;
        };
    })();

    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        // 1. Simulate Black Hole Evaporation Cycle (Mass drops, Temperature spikes)
        // We will make it a cyclic oscillation for the visual effect.
        const massFluctuation = Math.sin(t * 0.5) * 0.5 + 0.5; // 0.0 to 1.0
        const hawkingTemp = 1.0 / (massFluctuation + 0.1); // Spikes when mass is low
        
        // 2. Animate Singularity Sputtering
        if (animMeshes.singularity) {
            // Sputter scale based on noise
            const sputter = noise(t * 10, t * 12, t * 15) * 0.2;
            const targetScale = 1.0 + sputter;
            animMeshes.singularity.scale.set(targetScale, targetScale, targetScale);
        }

        // 3. Containment Rings Gimbal Rotation
        animMeshes.containmentRings.forEach(ringObj => {
            // Speed increases as hawking temp increases (working harder)
            ringObj.mesh.rotation[ringObj.axis] += ringObj.speed * hawkingTemp * 0.5;
        });

        // 4. Accretion Disk Rotation & Pulsing
        animMeshes.accretionDisks.forEach((diskObj, index) => {
            diskObj.mesh.rotation.z += diskObj.speed;
            // Pulse emissive intensity
            if (diskObj.mesh.material.emissiveIntensity !== undefined) {
                diskObj.mesh.material.emissiveIntensity = 5 + Math.sin(t * 5 + index) * 3 * hawkingTemp;
            }
        });

        // 5. Floating Plasma Particles (Ergosphere simulation)
        animMeshes.floatingParticles.forEach(pObj => {
            pObj.angle += pObj.speed * hawkingTemp * 0.1;
            // Dist fluctuates
            const currentDist = pObj.dist + Math.sin(t * 10 + pObj.angle) * 1.5;
            pObj.mesh.position.x = Math.cos(pObj.angle) * currentDist;
            pObj.mesh.position.z = Math.sin(pObj.angle) * currentDist;
            pObj.mesh.position.y = (Math.random() - 0.5) * 3;
        });

        // 6. Lensing Array Focus Shifting (Z-axis micro movements)
        animMeshes.lenses.forEach(lensObj => {
            const zShift = Math.sin(t * 2 + lensObj.offsetPhase) * 5;
            lensObj.mesh.position.z = lensObj.baseZ + zShift;
        });

        // 7. Heat Dissipation Radiators (Color cycle based on thermal load)
        // Simulate a thermal wave propagating through the fins
        animMeshes.radiatorFins.forEach((fin, index) => {
            const wave = Math.sin(t * 5 - index * 0.1) * 0.5 + 0.5; // 0 to 1
            // Base heat + wave * temp
            const heatVal = wave * (hawkingTemp * 2);
            fin.material.emissiveIntensity = heatVal;
            // Color shift from deep red to bright white-orange
            const r = Math.min(255, heatVal * 100) / 255;
            const g = Math.min(255, heatVal * 30) / 255;
            const b = Math.min(255, heatVal * 5) / 255;
            fin.material.emissive.setRGB(r, g, b);
        });

        // 8. Hydraulic Pistons Pumping (To handle recoil/stabilization)
        animMeshes.hydraulicPistons.forEach((piston, index) => {
            piston.position.y = Math.sin(t * 10 + index) * 2;
        });

        // 9. Main Laser Beam Pulsing
        if (animMeshes.mainBeam) {
            animMeshes.mainBeam.material.opacity = 0.8 + Math.sin(t * 20) * 0.2;
            animMeshes.mainBeam.material.emissiveIntensity = 15 + Math.random() * 10; // Rapid flicker
            const scalePulse = 1.0 + Math.sin(t * 50) * 0.05;
            animMeshes.mainBeam.scale.set(scalePulse, 1.0, scalePulse);
        }
    };

    // Return the required payload
    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
