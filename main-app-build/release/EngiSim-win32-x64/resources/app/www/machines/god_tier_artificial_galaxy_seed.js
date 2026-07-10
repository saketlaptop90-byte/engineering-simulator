import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const machineGroup = new THREE.Group();
    machineGroup.name = "God_Tier_Artificial_Galaxy_Seed";

    const parts = [];
    const updateCallbacks = [];

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================
    const singularityMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x110022,
        emissiveIntensity: 20,
        metalness: 1,
        roughness: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const plasmaMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        ior: 1.5
    });

    const hotHydrogenMat = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 8,
        transparent: true,
        opacity: 0.9,
        transmission: 0.5
    });

    const darkMatterMat = new THREE.MeshStandardMaterial({
        color: 0x110033,
        emissive: 0x330066,
        emissiveIntensity: 3,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        opacity: 1,
        metalness: 0.1,
        roughness: 0,
        ior: 2.5,
        thickness: 10
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 5
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 5
    });

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function createDetailedCylinder(radiusTop, radiusBottom, height, radialSegments, mat) {
        const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, 5);
        return new THREE.Mesh(geo, mat);
    }

    function createTorus(radius, tube, radialSegments, tubularSegments, mat) {
        const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        return new THREE.Mesh(geo, mat);
    }

    function createTubePath(pointsArr, radius, radialSegments, mat) {
        const path = new THREE.CatmullRomCurve3(pointsArr);
        const geo = new THREE.TubeGeometry(path, 64, radius, radialSegments, false);
        return new THREE.Mesh(geo, mat);
    }

    function createLatheShape(pointsArr, segments, mat) {
        const pts = pointsArr.map(p => new THREE.Vector2(p[0], p[1]));
        const geo = new THREE.LatheGeometry(pts, segments);
        return new THREE.Mesh(geo, mat);
    }

    // ==========================================
    // MODULE 1: MOBILE ALL-TERRAIN TRACTION PLATFORM
    // ==========================================
    const chassisGroup = new THREE.Group();
    machineGroup.add(chassisGroup);

    // Chassis Base (Massive Extrude)
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-150, -50);
    chassisShape.lineTo(150, -50);
    chassisShape.lineTo(170, -20);
    chassisShape.lineTo(170, 20);
    chassisShape.lineTo(150, 50);
    chassisShape.lineTo(100, 50);
    chassisShape.lineTo(80, 80);
    chassisShape.lineTo(-80, 80);
    chassisShape.lineTo(-100, 50);
    chassisShape.lineTo(-150, 50);
    chassisShape.lineTo(-170, 20);
    chassisShape.lineTo(-170, -20);
    chassisShape.lineTo(-150, -50);

    const extrudeSettings = { depth: 200, bevelEnabled: true, bevelSegments: 10, steps: 5, bevelSize: 5, bevelThickness: 5 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 50, -100);
    chassisGroup.add(chassisMesh);

    // Suspension & Axles
    const wheelPositions = [
        [-160, 50, -80], [160, 50, -80],
        [-160, 50, 0],   [160, 50, 0],
        [-160, 50, 80],  [160, 50, 80]
    ];

    const allWheels = [];

    wheelPositions.forEach((pos, idx) => {
        const axle = createDetailedCylinder(10, 10, 60, 32, steel);
        axle.rotation.x = Math.PI / 2;
        axle.position.set(pos[0], pos[1], pos[2]);
        chassisGroup.add(axle);

        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(pos[0], pos[1], pos[2] + (idx % 2 === 0 ? 30 : -30));
        chassisGroup.add(wheelGroup);
        allWheels.push(wheelGroup);

        // Rim
        const rim = createDetailedCylinder(25, 25, 20, 64, chrome);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Spokes
        for (let i = 0; i < 12; i++) {
            const spoke = createDetailedCylinder(2, 2, 25, 16, aluminum);
            spoke.position.y = 12.5;
            const pivot = new THREE.Group();
            pivot.rotation.z = (Math.PI * 2 / 12) * i;
            pivot.add(spoke);
            wheelGroup.add(pivot);
        }

        // Tire Main Torus
        const tireTorus = createTorus(35, 15, 64, 128, rubber);
        tireTorus.rotation.x = Math.PI / 2;
        wheelGroup.add(tireTorus);

        // Tire Treads (Hundreds of tiny extruded BoxGeometry lugs)
        const lugGeo = new THREE.BoxGeometry(18, 4, 8);
        const lugCount = 72;
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            // Position on the surface of the torus
            lug.position.set(
                Math.cos(angle) * 50,
                Math.sin(angle) * 50,
                0
            );
            lug.rotation.z = angle;
            // Add aggressive chevron offset
            lug.rotation.y = (i % 2 === 0) ? 0.3 : -0.3;
            wheelGroup.add(lug);
        }

        // Hubcap Neon
        const hubcap = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 32), neonBlue);
        hubcap.position.z = (idx % 2 === 0 ? 12 : -12);
        wheelGroup.add(hubcap);
    });

    // ==========================================
    // MODULE 2: HYDRAULIC BOOM ARTICULATORS & SCAFFOLDING
    // ==========================================
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 140, 0);
    chassisGroup.add(boomGroup);

    const boomLathePts = [];
    for (let i = 0; i <= 50; i++) {
        boomLathePts.push([
            15 + Math.sin(i * 0.5) * 5,
            i * 4
        ]);
    }
    const mainPillar = createLatheShape(boomLathePts, 64, darkSteel);
    boomGroup.add(mainPillar);

    const hydraulicPistons = [];
    for (let i = 0; i < 4; i++) {
        const pistonGroup = new THREE.Group();
        const angle = (Math.PI / 2) * i;
        
        const outerCylinder = createDetailedCylinder(6, 6, 100, 32, steel);
        outerCylinder.position.y = 50;
        pistonGroup.add(outerCylinder);

        const innerCylinder = createDetailedCylinder(4, 4, 100, 32, chrome);
        innerCylinder.position.y = 100;
        pistonGroup.add(innerCylinder);
        hydraulicPistons.push({ inner: innerCylinder, baseY: 100 });

        pistonGroup.position.set(Math.cos(angle) * 40, 0, Math.sin(angle) * 40);
        boomGroup.add(pistonGroup);
    }

    // ==========================================
    // MODULE 3: SUPERMASSIVE SINGULARITY CORE
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 400, 0);
    machineGroup.add(coreGroup);

    const singularityCore = new THREE.Mesh(new THREE.SphereGeometry(40, 128, 128), singularityMat);
    coreGroup.add(singularityCore);

    // Inner Event Horizon Stabilizer Rings
    const ehRings = [];
    for (let i = 0; i < 3; i++) {
        const ring = createTorus(60 + (i * 15), 3, 64, 128, neonPurple);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        coreGroup.add(ring);
        ehRings.push({ mesh: ring, speed: { x: Math.random() * 0.05, y: Math.random() * 0.05, z: Math.random() * 0.05 } });
    }

    // Complex TorusKnot for contained quantum foam
    const quantumFoam = new THREE.Mesh(new THREE.TorusKnotGeometry(45, 8, 256, 64, 3, 7), plasmaMat);
    coreGroup.add(quantumFoam);

    // ==========================================
    // MODULE 4: GRAVITATIONAL LENSING ARRAY
    // ==========================================
    const lensingGroup = new THREE.Group();
    coreGroup.add(lensingGroup);

    const lensGeo = new THREE.SphereGeometry(150, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.2);
    const upperLens = new THREE.Mesh(lensGeo, lensMat);
    const lowerLens = new THREE.Mesh(lensGeo, lensMat);
    lowerLens.rotation.x = Math.PI;
    lensingGroup.add(upperLens);
    lensingGroup.add(lowerLens);

    // Support struts for lenses
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        const strut = createDetailedCylinder(3, 3, 300, 16, darkSteel);
        strut.position.set(Math.cos(angle) * 100, 0, Math.sin(angle) * 100);
        lensingGroup.add(strut);
    }

    // ==========================================
    // MODULE 5: PARTICLE ACCELERATORS (PRIMARY & SECONDARY)
    // ==========================================
    const acceleratorGroup = new THREE.Group();
    coreGroup.add(acceleratorGroup);

    // Primary Ring (Horizontal)
    const primaryRing = createTorus(250, 20, 64, 256, steel);
    primaryRing.rotation.x = Math.PI / 2;
    acceleratorGroup.add(primaryRing);

    // Primary Ring Plasma Interior
    const primaryPlasma = createTorus(250, 15, 64, 256, hotHydrogenMat);
    primaryPlasma.rotation.x = Math.PI / 2;
    acceleratorGroup.add(primaryPlasma);

    // Accelerating Nodes (Magnets) along the ring
    const accelNodes = [];
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const nodeGeo = new THREE.BoxGeometry(40, 50, 40);
        const node = new THREE.Mesh(nodeGeo, darkSteel);
        node.position.set(Math.cos(angle) * 250, 0, Math.sin(angle) * 250);
        node.rotation.y = -angle;
        
        // Add neon indicator to node
        const ind = new THREE.Mesh(new THREE.BoxGeometry(42, 10, 42), neonBlue);
        node.add(ind);
        
        acceleratorGroup.add(node);
        accelNodes.push(ind);
    }

    // Secondary Ring (Vertical)
    const secondaryRing = createTorus(350, 15, 64, 256, aluminum);
    secondaryRing.rotation.y = Math.PI / 2;
    acceleratorGroup.add(secondaryRing);

    const secondaryPlasma = createTorus(350, 10, 64, 256, neonPurple);
    secondaryPlasma.rotation.y = Math.PI / 2;
    acceleratorGroup.add(secondaryPlasma);

    // ==========================================
    // MODULE 6: MATTER INJECTION MANIFOLD (HYDRAULIC LINES)
    // ==========================================
    const injectionGroup = new THREE.Group();
    machineGroup.add(injectionGroup);

    // Countless Bezier Tubes for Plasma Conduits
    const conduits = [];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const start = new THREE.Vector3(Math.cos(angle) * 120, 150, Math.sin(angle) * 120);
        const cp1 = new THREE.Vector3(Math.cos(angle) * 200, 250, Math.sin(angle) * 200);
        const cp2 = new THREE.Vector3(Math.cos(angle) * 300, 350, Math.sin(angle) * 300);
        const end = new THREE.Vector3(Math.cos(angle) * 250, 400, Math.sin(angle) * 250);

        const curve = new THREE.CubicBezierCurve3(start, cp1, cp2, end);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 5, 16, false);
        const tube = new THREE.Mesh(tubeGeo, copper);
        injectionGroup.add(tube);
        
        // Inner glowing pulse
        const pulseGeo = new THREE.SphereGeometry(8, 16, 16);
        const pulse = new THREE.Mesh(pulseGeo, hotHydrogenMat);
        injectionGroup.add(pulse);
        conduits.push({ mesh: pulse, curve: curve, progress: Math.random() });
    }

    // ==========================================
    // MODULE 7: PROTOSTAR INCUBATION CHAMBERS
    // ==========================================
    const incubatorGroup = new THREE.Group();
    coreGroup.add(incubatorGroup);

    const protostars = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = 450;
        
        const chamberGroup = new THREE.Group();
        chamberGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
        
        // Containment Icosahedron
        const containGeo = new THREE.IcosahedronGeometry(50, 1);
        const containMesh = new THREE.Mesh(containGeo, darkMatterMat);
        chamberGroup.add(containMesh);
        
        // Inner Protostar
        const starGeo = new THREE.SphereGeometry(30, 64, 64);
        const starMesh = new THREE.Mesh(starGeo, hotHydrogenMat);
        chamberGroup.add(starMesh);
        protostars.push(starMesh);

        // Connectors to primary ring
        const conn = createDetailedCylinder(10, 10, dist - 250, 16, steel);
        conn.rotation.z = Math.PI / 2;
        conn.rotation.y = -angle;
        conn.position.set(Math.cos(angle) * (250 + (dist - 250) / 2), 0, Math.sin(angle) * (250 + (dist - 250) / 2));
        incubatorGroup.add(conn);

        incubatorGroup.add(chamberGroup);
    }

    // ==========================================
    // MODULE 8: VOLUMETRIC NEBULA CONDENSER
    // ==========================================
    const nebulaGroup = new THREE.Group();
    coreGroup.add(nebulaGroup);

    // Simulating volumetric clouds via multiple overlapping scaled Icosahedrons with high transparency
    const cloudMats = [plasmaMat, hotHydrogenMat, darkMatterMat];
    const clouds = [];
    for (let i = 0; i < 20; i++) {
        const cloudGeo = new THREE.IcosahedronGeometry(Math.random() * 100 + 50, 2);
        const cloud = new THREE.Mesh(cloudGeo, cloudMats[i % cloudMats.length]);
        cloud.position.set(
            (Math.random() - 0.5) * 800,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 800
        );
        cloud.rotation.set(Math.random(), Math.random(), Math.random());
        cloud.scale.setScalar(Math.random() * 2 + 0.5);
        nebulaGroup.add(cloud);
        clouds.push({ mesh: cloud, rotSpeed: Math.random() * 0.01 - 0.005 });
    }

    // ==========================================
    // MODULE 9: SPACETIME METRIC WARP ENGINE (THRUSTERS)
    // ==========================================
    const thrusterGroup = new THREE.Group();
    chassisGroup.add(thrusterGroup);

    const thrusterPts = [];
    for (let i = 0; i < 20; i++) {
        thrusterPts.push([
            30 + Math.pow(i, 1.2),
            -i * 5
        ]);
    }
    
    for (let i = 0; i < 4; i++) {
        const tMesh = createLatheShape(thrusterPts, 64, darkSteel);
        tMesh.position.set(i % 2 === 0 ? 150 : -150, 20, i < 2 ? 100 : -100);
        tMesh.rotation.x = Math.PI; // pointing down
        thrusterGroup.add(tMesh);
        
        // Thruster plume
        const plumeGeo = new THREE.CylinderGeometry(20, 60, 150, 32, 1, true);
        const plume = new THREE.Mesh(plumeGeo, neonBlue);
        plume.position.y = -100;
        tMesh.add(plume);
    }

    // ==========================================
    // MODULE 10: OBSERVATION CITADEL & CONTROL CABIN
    // ==========================================
    const citadelGroup = new THREE.Group();
    citadelGroup.position.set(0, 150, 150);
    chassisGroup.add(citadelGroup);

    const citadelShape = new THREE.Shape();
    citadelShape.moveTo(-40, 0);
    citadelShape.lineTo(40, 0);
    citadelShape.lineTo(60, 30);
    citadelShape.lineTo(40, 60);
    citadelShape.lineTo(-40, 60);
    citadelShape.lineTo(-60, 30);
    citadelShape.lineTo(-40, 0);

    const citExtrude = new THREE.ExtrudeGeometry(citadelShape, { depth: 80, bevelEnabled: true, bevelThickness: 2, bevelSize: 2 });
    const citadelMesh = new THREE.Mesh(citExtrude, darkSteel);
    citadelMesh.position.set(0, 0, -40);
    citadelGroup.add(citadelMesh);

    // Tinted Glass window for citadel
    const windowGeo = new THREE.PlaneGeometry(70, 40);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 30, 42);
    citadelGroup.add(windowMesh);

    // Glowing screens inside
    const screenGeo = new THREE.BoxGeometry(10, 5, 1);
    for (let i = 0; i < 5; i++) {
        const screen = new THREE.Mesh(screenGeo, neonPurple);
        screen.position.set(-20 + i * 10, 20, 35);
        screen.rotation.x = -0.2;
        citadelGroup.add(screen);
    }

    // Radar Dish / Sensor Array on top of citadel
    const radarDish = new THREE.Group();
    radarDish.position.set(0, 70, 0);
    citadelGroup.add(radarDish);

    const dishGeo = new THREE.SphereGeometry(20, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dishMesh = new THREE.Mesh(dishGeo, aluminum);
    dishMesh.rotation.x = -Math.PI / 2;
    radarDish.add(dishMesh);
    
    const antenna = createDetailedCylinder(1, 1, 30, 8, steel);
    antenna.position.y = 15;
    radarDish.add(antenna);
    
    updateCallbacks.push((time) => {
        radarDish.rotation.y = time * 2;
    });

    // ==========================================
    // MODULE 11: SHOCKWAVE EMITTERS
    // ==========================================
    const shockwaves = [];
    for (let i = 0; i < 3; i++) {
        const sw = createTorus(1, 2, 16, 128, neonBlue);
        sw.rotation.x = Math.PI / 2;
        coreGroup.add(sw);
        shockwaves.push({ mesh: sw, phase: i * (Math.PI * 2 / 3) });
    }

    // ==========================================
    // DEFINING PARTS ARRAY (MASSIVE DETAIL)
    // ==========================================
    parts.push({
        name: "Mobile Command Chassis",
        description: "The immense, hyper-dense structural platform constructed from collapsed neutronium alloys. Designed to bear the unimaginable stress of supporting a localized spacetime metric disruption.",
        material: "Dark Steel / Neutronium Alloy",
        function: "Provides mobility, structural integrity, and grounding for the Artificial Galaxy Seed.",
        assemblyOrder: 1,
        connections: ["All-Terrain Traction Array", "Hydraulic Boom Articulators", "Spacetime Metric Warp Engine", "Observation Citadel"],
        failureEffect: "Complete structural collapse resulting in localized uncontained metric tearing.",
        cascadeFailures: ["All systems offline", "Immediate singularity breach"],
        originalPosition: { x: 0, y: 50, z: -100 },
        explodedPosition: { x: 0, y: -200, z: -100 }
    });

    parts.push({
        name: "All-Terrain Traction Array",
        description: "Massive toroidal wheels encased in hyper-vulcanized synthetic rubber with hundreds of individual extruded chevron lugs. Incorporates dynamic spoke topology to distribute gravitational stresses.",
        material: "Hyper-Vulcanized Rubber, Chrome, Aluminum",
        function: "Enables traversal over wildly varying planetary or sub-stellar surfaces prior to seed ignition.",
        assemblyOrder: 2,
        connections: ["Mobile Command Chassis"],
        failureEffect: "Loss of mobility; extreme stress concentrations on the chassis.",
        cascadeFailures: ["Chassis microfractures"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 300 }
    });

    parts.push({
        name: "Supermassive Singularity Core",
        description: "The absolute heart of the machine. A contained, stable, rotating micro-black hole whose angular momentum is precisely tuned to emit Hawking radiation at safe, utilizable frequencies.",
        material: "Singularity Material (Absolute Black / High Emissive Core)",
        function: "Generates the massive gravitational well required to anchor a new galactic structure.",
        assemblyOrder: 10,
        connections: ["Event Horizon Stabilizer", "Gravitational Lensing Mirrors", "Primary Hydrogen Accelerator"],
        failureEffect: "Uncontained black hole expansion, consuming the local solar system.",
        cascadeFailures: ["Total localized annihilation"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 0, y: 1200, z: 0 }
    });

    parts.push({
        name: "Event Horizon Stabilizer",
        description: "A series of high-energy neon-plasma toroids rotating on multiple axes around the singularity. They inject precise fermionic states to manage evaporation rates.",
        material: "Neon Purple Plasma",
        function: "Prevents runaway Hawking evaporation and stabilizes the ergosphere.",
        assemblyOrder: 11,
        connections: ["Supermassive Singularity Core", "Quantum Foam Generator"],
        failureEffect: "Singularity decay leading to a catastrophic gamma-ray burst.",
        cascadeFailures: ["Singularity loss", "Incubator destruction"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 0, y: 800, z: 200 }
    });

    parts.push({
        name: "Primary Hydrogen Accelerator",
        description: "An immense horizontal ring utilizing extreme magnetic fields to accelerate raw hydrogen to 0.999c, preparing it for injection into the orbital plane.",
        material: "Steel / Hot Hydrogen Plasma",
        function: "Provides the kinetic foundation for the formation of galactic spiral arms.",
        assemblyOrder: 7,
        connections: ["Secondary Particle Accelerator", "Protostar Incubation Chambers", "Magnetic Flux Conduits"],
        failureEffect: "Hydrogen stalls, failing to achieve orbit, collapsing back into the singularity.",
        cascadeFailures: ["Asymmetric gravitational shear", "Lensing mirror shatter"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 500, y: 400, z: 500 }
    });

    parts.push({
        name: "Gravitational Lensing Mirrors",
        description: "Vast, curved metamaterial structures exhibiting negative refractive indices. They bend light and spacetime around the core to protect the chassis.",
        material: "Transmissive Metamaterial / Glass",
        function: "Focuses and redirects intense X-ray and Gamma-ray emissions away from the operator citadel.",
        assemblyOrder: 9,
        connections: ["Supermassive Singularity Core"],
        failureEffect: "Immediate operator vaporization; chassis melting.",
        cascadeFailures: ["Command Chassis destruction", "Traction Array melting"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 0, y: 400, z: -600 }
    });

    parts.push({
        name: "Magnetic Flux Conduits",
        description: "Hundreds of dynamically routing hydraulic and plasma lines constructed from room-temperature superconductor copper variants.",
        material: "Superconductor Copper / Hot Hydrogen",
        function: "Routes high-energy plasma from the lower extraction nodes to the upper accelerator rings.",
        assemblyOrder: 5,
        connections: ["Mobile Command Chassis", "Primary Hydrogen Accelerator"],
        failureEffect: "Plasma leakage, localized detonations.",
        cascadeFailures: ["Hydraulic boom severance"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: -400, y: 250, z: -400 }
    });

    parts.push({
        name: "Protostar Incubation Chambers",
        description: "Icosahedral containment vessels located on the periphery. Inside, raw hydrogen is compressed past the Jeans mass threshold to ignite nuclear fusion.",
        material: "Dark Matter Mesh / Hot Hydrogen",
        function: "Seeds the early galaxy with Population III hyper-massive stars.",
        assemblyOrder: 8,
        connections: ["Primary Hydrogen Accelerator"],
        failureEffect: "Premature stellar ignition causing supernovae within the machine.",
        cascadeFailures: ["Complete machine vaporization"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 800, y: 600, z: -800 }
    });

    parts.push({
        name: "Volumetric Nebula Condenser",
        description: "Projects massive fields of overlapping, semi-transparent energetic gas to form the nebulous aesthetic and structural gas clouds of the new galaxy.",
        material: "Various Plasma / Dark Matter Translucents",
        function: "Provides the interstellar medium (ISM) necessary for future stellar generations.",
        assemblyOrder: 12,
        connections: ["Supermassive Singularity Core"],
        failureEffect: "A barren galaxy devoid of gas, unable to form new stars.",
        cascadeFailures: ["None, but results in a dead elliptical galaxy"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 0, y: 1000, z: 1000 }
    });

    parts.push({
        name: "Hydraulic Boom Articulators",
        description: "Colossal multi-stage pistons that raise and stabilize the entire core assembly high above the chassis.",
        material: "Dark Steel / Chrome",
        function: "Maintains absolute vertical alignment of the core irrespective of terrain.",
        assemblyOrder: 4,
        connections: ["Mobile Command Chassis", "Supermassive Singularity Core"],
        failureEffect: "Core tilts, causing catastrophic asymmetric gravitational drag on the planet.",
        cascadeFailures: ["Planetary crust sheer", "Traction array overload"],
        originalPosition: { x: 0, y: 140, z: 0 },
        explodedPosition: { x: 200, y: 140, z: 200 }
    });

    parts.push({
        name: "Observation Citadel",
        description: "A heavily armored, heavily shielded command bunker with tinted transparent aluminum windows and holographic UI displays.",
        material: "Dark Steel / Tinted Glass / Neon Purple Screens",
        function: "Houses the operators (if any mortal could survive here) to monitor the galaxy genesis.",
        assemblyOrder: 3,
        connections: ["Mobile Command Chassis"],
        failureEffect: "Loss of manual override and telemetry.",
        cascadeFailures: ["AI takeover protocols initiate"],
        originalPosition: { x: 0, y: 150, z: 150 },
        explodedPosition: { x: 0, y: 300, z: 600 }
    });

    parts.push({
        name: "Spacetime Metric Warp Engine",
        description: "Downward-facing hyper-relativistic thrusters arrayed along the chassis edges, utilizing Alcubierre metric manipulation for local levitation.",
        material: "Dark Steel / Neon Blue Plasma Plumes",
        function: "Prevents the sheer mass of the machine from instantly collapsing into the planet's core.",
        assemblyOrder: 6,
        connections: ["Mobile Command Chassis"],
        failureEffect: "Machine sinks through the planetary crust to the core in seconds.",
        cascadeFailures: ["Planetary destruction"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 0 }
    });

    parts.push({
        name: "Secondary Particle Accelerator",
        description: "A vertical ring that injects matter orthogonally to the primary plane, ensuring the formation of a spherical dark matter halo.",
        material: "Aluminum / Neon Purple Plasma",
        function: "Generates the dark matter scaffolding that holds the galaxy together.",
        assemblyOrder: 13,
        connections: ["Supermassive Singularity Core", "Primary Hydrogen Accelerator"],
        failureEffect: "Galaxy flies apart due to insufficient mass-to-light ratio.",
        cascadeFailures: ["Galactic dissolution"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: -600, y: 400, z: 0 }
    });

    parts.push({
        name: "Quantum Foam Torus",
        description: "A highly complex TorusKnot containing roiling quantum foam, extracted from the vacuum, serving as the ultimate seed mass.",
        material: "Cyan Plasma",
        function: "Provides infinite mass-energy via vacuum zero-point extraction.",
        assemblyOrder: 14,
        connections: ["Supermassive Singularity Core"],
        failureEffect: "Energy starvation, singularity evaporates.",
        cascadeFailures: ["Event Horizon Stabilizer overload"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 0, y: 600, z: -200 }
    });

    parts.push({
        name: "Shockwave Emitters",
        description: "Expanding toroidal energy ripples that clear the immediate vicinity of cosmic debris prior to ignition.",
        material: "Neon Blue Plasma",
        function: "Sterilizes the local spacetime volume, ensuring a clean slate for the new galaxy.",
        assemblyOrder: 15,
        connections: ["Supermassive Singularity Core"],
        failureEffect: "Debris impacts the singularity, causing unpredictable mass spikes.",
        cascadeFailures: ["Accelerator misalignment"],
        originalPosition: { x: 0, y: 400, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });


    // ==========================================
    // EXTREMELY DIFFICULT PhD LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Alcubierre metric utilized by the Spacetime Metric Warp Engine, how does the York time relate to the extrinsic curvature tensor when maintaining the stability of the generated singularity?",
            options: [
                "It is strictly proportional to the trace of the extrinsic curvature tensor, defining the foliation of spacelike hypersurfaces.",
                "It serves as the lapse function multiplier, actively dampening the Weyl tensor components.",
                "It inversely scales with the shift vector, effectively decoupling the ADM formalism from the stress-energy tensor.",
                "It has no relation; York time is only applicable in Schwarzschild geodesics."
            ],
            correctAnswer: 0,
            explanation: "In the ADM formalism of numerical relativity, York time is defined as the trace of the extrinsic curvature tensor (K), which is crucial for choosing stable spacelike hypersurfaces (foliation) during dynamic spacetime evolution, such as stabilizing a warp bubble or singularity."
        },
        {
            question: "During the protostar incubation phase, the Artificial Galaxy Seed regulates the Jeans mass of the injected hydrogen clouds. If the effective temperature is artificially lowered while maintaining constant density, how does the minimum mass required for gravitational collapse scale?",
            options: [
                "It scales proportionally to T^2.",
                "It scales proportionally to T^(3/2).",
                "It scales inversely to T^(1/2).",
                "It remains independent of temperature as long as density is constant."
            ],
            correctAnswer: 1,
            explanation: "The Jeans mass M_J is proportional to T^(3/2) / ρ^(1/2). Therefore, if density ρ is constant, the required mass for collapse scales with T^(3/2). Lowering the temperature drastically reduces the mass required to initiate collapse."
        },
        {
            question: "The Gravitational Lensing Mirrors utilize metamaterials to achieve a negative refractive index at X-ray wavelengths. According to the generalized Pendry-Ramakrishna lens equations, what is the critical condition for perfect focusing in a curved spacetime background?",
            options: [
                "The permittivity and permeability tensors must exactly cancel the spatial components of the background metric tensor.",
                "The refractive index must approach negative infinity.",
                "The material must exhibit extreme positive dispersion.",
                "The group velocity of the X-rays must exceed c locally."
            ],
            correctAnswer: 0,
            explanation: "In transformation optics applied to general relativity, a 'perfect lens' in a curved background requires the metamaterial's constitutive parameters (permittivity ε and permeability μ tensors) to perfectly mimic or cancel the effective optical metric introduced by the spacetime curvature."
        },
        {
            question: "The Secondary Particle Accelerator relies on wakefield acceleration. In a plasma of electron density $n_e$, the maximum accelerating electric field (the 1D non-relativistic wave-breaking limit) scales as?",
            options: [
                "n_e",
                "n_e^2",
                "n_e^(1/2)",
                "n_e^(-1/2)"
            ],
            correctAnswer: 2,
            explanation: "The cold, non-relativistic wave-breaking field in a plasma (also known as the Tajima-Dawson field) is given by E_0 = (m_e c ω_p)/e. Since the plasma frequency ω_p is proportional to the square root of the electron density (n_e^(1/2)), the maximum field scales as n_e^(1/2)."
        },
        {
            question: "To prevent the Supermassive Singularity Core from undergoing rapid Hawking radiation evaporation during the initial micro-black hole phase, the Event Horizon Stabilizer injects specific fermionic states. According to the generalized Unruh effect, an observer accelerating uniformly at 'a' near the horizon perceives a thermal bath of temperature?",
            options: [
                "T = (ℏ a) / (2 π c k_B)",
                "T = (ℏ c^3) / (8 π G M k_B)",
                "T = (c^2) / (2 a k_B)",
                "T = (G M a) / (ℏ c^2 k_B)"
            ],
            correctAnswer: 0,
            explanation: "The Unruh temperature for a uniformly accelerating observer is given exactly by T = (ℏ a) / (2 π c k_B). This fundamental result bridges quantum field theory and thermodynamics in curved spacetime, crucial for managing the local vacuum state near the event horizon."
        }
    ];


    // ==========================================
    // ANIMATION LOGIC (HIGHLY SYNCHRONIZED)
    // ==========================================
    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // Drive the chassis wheels
        allWheels.forEach(wheel => {
            wheel.rotation.x = -t * 2;
        });

        // Articulate hydraulic boom slightly (breathing effect)
        const boomY = 140 + Math.sin(t) * 10;
        boomGroup.position.y = boomY;
        
        // Adjust pistons perfectly in sync with boom
        hydraulicPistons.forEach(piston => {
            // As boom moves up/down, inner cylinder extends/retracts
            const extension = Math.sin(t) * 10;
            piston.inner.position.y = piston.baseY + extension;
        });

        // Singularity core rotation and pulsing
        singularityCore.rotation.y = t * 0.5;
        singularityCore.rotation.x = t * 0.3;
        singularityMat.emissiveIntensity = 15 + Math.sin(t * 5) * 5;

        // Event Horizon Stabilizers complex rotation
        ehRings.forEach(ringObj => {
            ringObj.mesh.rotation.x += ringObj.speed.x * speed;
            ringObj.mesh.rotation.y += ringObj.speed.y * speed;
            ringObj.mesh.rotation.z += ringObj.speed.z * speed;
        });

        // Quantum foam knot rapid rotation
        quantumFoam.rotation.x = t * 3;
        quantumFoam.rotation.z = -t * 2;

        // Lensing Array slow tracking
        lensingGroup.rotation.y = Math.sin(t * 0.2) * 0.5;

        // Primary & Secondary Accelerators
        acceleratorGroup.rotation.y = t * 0.2;
        acceleratorGroup.rotation.x = Math.sin(t * 0.1) * 0.1;
        
        // Pulse the accelerator nodes
        accelNodes.forEach((node, idx) => {
            const phase = (idx / 36) * Math.PI * 2;
            const intensity = (Math.sin(t * 10 + phase) + 1) / 2;
            node.material.emissiveIntensity = intensity * 10;
        });

        // Magnetic Flux Conduits plasma pulses
        conduits.forEach(cond => {
            cond.progress += speed * 0.02;
            if (cond.progress > 1) cond.progress = 0;
            const pt = cond.curve.getPointAt(cond.progress);
            cond.mesh.position.copy(pt);
            // Scale pulse based on position
            cond.mesh.scale.setScalar(1 + Math.sin(cond.progress * Math.PI) * 2);
        });

        // Protostar spinning and pulsing
        protostars.forEach((star, idx) => {
            star.rotation.y = t * 5;
            const phase = idx * (Math.PI / 3);
            star.scale.setScalar(1 + Math.sin(t * 3 + phase) * 0.2);
            star.material.emissiveIntensity = 8 + Math.sin(t * 3 + phase) * 4;
        });
        incubatorGroup.rotation.y = -t * 0.5;

        // Volumetric Nebula Condenser
        clouds.forEach(cloudObj => {
            cloudObj.mesh.rotation.y += cloudObj.rotSpeed * speed * 50;
            cloudObj.mesh.rotation.x += cloudObj.rotSpeed * speed * 30;
            // Pulse opacity
            if (cloudObj.mesh.material.opacity !== undefined) {
                cloudObj.mesh.material.opacity = 0.5 + Math.sin(t * 2 + cloudObj.mesh.position.x) * 0.3;
            }
        });

        // Shockwave Emitters
        shockwaves.forEach(sw => {
            sw.phase += speed * 2;
            const scale = (sw.phase % (Math.PI * 2)) * 100 + 1; // Expands outward
            sw.mesh.scale.setScalar(scale);
            sw.mesh.material.opacity = Math.max(0, 1 - (scale / 600)); // Fades out
            sw.mesh.material.transparent = true;
            if (scale > 600) sw.phase = 0; // Reset
        });

        // Execute any internal update callbacks
        updateCallbacks.forEach(cb => cb(t));
    };

    return {
        group: machineGroup,
        parts,
        description: "The God-Tier Artificial Galaxy Seed. An incomprehensibly advanced, hyper-realistic, mobile terraforming (or rather, galaxi-forming) platform. Featuring a contained supermassive singularity, wakefield particle accelerators, dark matter weaving arrays, and localized Alcubierre warp engines. Designed to ignite the formation of a completely new spiral galaxy from the vacuum of intergalactic space.",
        quizQuestions,
        animate
    };
}
