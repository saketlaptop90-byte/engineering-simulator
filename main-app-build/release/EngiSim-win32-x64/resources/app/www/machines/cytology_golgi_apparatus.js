import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom emissive materials for the high-tech biomechanical vibe
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, transparent: true, opacity: 0.85, wireframe: false });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.5, transparent: true, opacity: 0.8 });
    const neonPink = new THREE.MeshStandardMaterial({ color: 0xff00aa, emissive: 0xff00aa, emissiveIntensity: 2 });
    const plasmaYellow = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffdd00, emissiveIntensity: 1.5 });
    const glowingCoreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00aaff, emissiveIntensity: 3, wireframe: true });

    const description = "The Cytology Golgi Apparatus MK-VII is a highly advanced biomechanical sorting and processing facility. Operating at the microscopic level but engineered like a massive planetary factory, it utilizes pneumatic cisternae stacks, tracked transport rovers with advanced tread systems, and autonomous scanning rings to modify, sort, and package cellular payloads.";

    // --- HELPER FUNCTIONS ---

    function createHighTechTire(radius, thickness) {
        const tireGroup = new THREE.Group();
        const torus = new THREE.TorusGeometry(radius, thickness, 16, 120);
        const torusMesh = new THREE.Mesh(torus, rubber);
        tireGroup.add(torusMesh);

        // Hundreds of tiny extruded lugs for off-road/microtubule grip
        const lugGeo = new THREE.BoxGeometry(thickness * 2.4, thickness * 0.4, thickness * 0.8);
        const numLugs = 80;
        for (let i = 0; i < numLugs; i++) {
            const theta = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
            lug.rotation.z = theta;
            tireGroup.add(lug);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry(radius * 0.75, radius * 0.75, thickness * 1.5, 32);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        // Complex Spoke Array
        const spokeGeo = new THREE.CylinderGeometry(radius * 0.05, radius * 0.08, radius * 1.5, 16);
        for(let i = 0; i < 12; i++) {
            const theta = (i / 12) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.z = theta;
            spoke.rotation.x = Math.PI / 2;
            tireGroup.add(spoke);
        }
        
        // Hubcap
        const hubGeo = new THREE.SphereGeometry(radius * 0.2, 16, 16);
        const hub = new THREE.Mesh(hubGeo, neonBlue);
        hub.scale.z = 0.5;
        tireGroup.add(hub);

        return tireGroup;
    }

    function createRover() {
        const roverGroup = new THREE.Group();
        
        // Complex Chassis (Shape Extrusion)
        const chassisShape = new THREE.Shape();
        chassisShape.moveTo(-3, -1.5);
        chassisShape.lineTo(3, -1.5);
        chassisShape.lineTo(4, 0);
        chassisShape.lineTo(3, 1.5);
        chassisShape.lineTo(-3, 1.5);
        chassisShape.lineTo(-4, 0);
        chassisShape.lineTo(-3, -1.5);
        
        const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
        chassisGeo.translate(0, 0, -2);
        const chassis = new THREE.Mesh(chassisGeo, steel);
        roverGroup.add(chassis);

        // Tires
        const tFR = createHighTechTire(1.2, 0.4); tFR.position.set(2.5, -1.5, 2.5);
        const tFL = createHighTechTire(1.2, 0.4); tFL.position.set(2.5, -1.5, -2.5);
        const tBR = createHighTechTire(1.2, 0.4); tBR.position.set(-2.5, -1.5, 2.5);
        const tBL = createHighTechTire(1.2, 0.4); tBL.position.set(-2.5, -1.5, -2.5);
        
        roverGroup.add(tFR, tFL, tBR, tBL);
        
        // Cargo (Vesicle payload)
        const cargoGeo = new THREE.IcosahedronGeometry(1.5, 2);
        const cargo = new THREE.Mesh(cargoGeo, neonPink);
        cargo.position.set(0, 2, 0);
        roverGroup.add(cargo);

        // Cockpit / Sensor Eye
        const eyeGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
        const eye = new THREE.Mesh(eyeGeo, glass);
        eye.rotation.z = Math.PI / 2;
        eye.position.set(3.5, 0.5, 0);
        roverGroup.add(eye);

        return { root: roverGroup, tires: [tFR, tFL, tBR, tBL], cargo: cargo };
    }

    function createCisternaLayer(width, depth, height, curveOffset) {
        const shape = new THREE.Shape();
        const w = width / 2;
        const d = depth / 2;
        const c = curveOffset;
        shape.moveTo(-w, -d);
        shape.quadraticCurveTo(0, -d - c, w, -d);
        shape.quadraticCurveTo(w + c, 0, w, d);
        shape.quadraticCurveTo(0, d + c, -w, d);
        shape.quadraticCurveTo(-w - c, 0, -w, -d);
        
        const ext = { depth: height, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.8, bevelThickness: 0.8 };
        const geo = new THREE.ExtrudeGeometry(shape, ext);
        geo.translate(0, 0, -height/2);
        geo.rotateX(Math.PI / 2);
        
        const mesh = new THREE.Mesh(geo, tinted);
        
        // Add detailed structural rim using lathe
        const points = [];
        for (let i = 0; i <= 10; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.3) * 1.5 + (width*0.5 + 1), (i - 5) * 0.4));
        }
        const rimGeo = new THREE.LatheGeometry(points, 64);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.scale.set(1, 1, depth/width); // Elliptical stretch
        mesh.add(rimMesh);

        return mesh;
    }

    function createHydraulicPiston() {
        const pGroup = new THREE.Group();
        
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.5, 6, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 3;
        
        const rodGeo = new THREE.CylinderGeometry(0.6, 0.6, 8, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = 7;
        
        const jointGeo = new THREE.SphereGeometry(1.4, 32, 32);
        const joint = new THREE.Mesh(jointGeo, copper);
        joint.position.y = 11;
        rod.add(joint);
        
        pGroup.add(base);
        pGroup.add(rod);
        
        return { root: pGroup, rod: rod };
    }

    function createComplexPipeNetwork() {
        const pipeGroup = new THREE.Group();
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 5, 2),
            new THREE.Vector3(8, 2, -4),
            new THREE.Vector3(12, 10, 0),
            new THREE.Vector3(5, 15, 5)
        ]);
        const geo = new THREE.TubeGeometry(curve, 64, 0.8, 16, false);
        const mesh = new THREE.Mesh(geo, copper);
        
        // Add containment rings around the pipe
        for (let i = 0; i <= 1; i += 0.1) {
            const pt = curve.getPointAt(i);
            const tan = curve.getTangentAt(i);
            const ringGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.position.copy(pt);
            ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), tan);
            pipeGroup.add(ring);
        }
        pipeGroup.add(mesh);
        return pipeGroup;
    }

    // --- ASSEMBLY ---

    // 1. Structural Matrix Scaffold (Huge outer icosahedral frame)
    const scaffoldGeo = new THREE.IcosahedronGeometry(45, 1);
    const scaffold = new THREE.Mesh(scaffoldGeo, new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true, transparent: true, opacity: 0.2 }));
    group.add(scaffold);
    meshes.scaffold = scaffold;

    // 2. Cisternae Stacks
    const cisternaeGroup = new THREE.Group();
    
    const cisCisterna = createCisternaLayer(35, 25, 3, 5);
    cisCisterna.position.y = -15;
    
    const medial1 = createCisternaLayer(40, 30, 3, 6);
    medial1.position.y = -7;
    
    const medial2 = createCisternaLayer(42, 32, 3, 7);
    medial2.position.y = 1;
    
    const medial3 = createCisternaLayer(38, 28, 3, 6);
    medial3.position.y = 9;
    
    const transCisterna = createCisternaLayer(32, 22, 3, 5);
    transCisterna.position.y = 17;
    
    cisternaeGroup.add(cisCisterna, medial1, medial2, medial3, transCisterna);
    group.add(cisternaeGroup);
    
    meshes.cisternae = { cis: cisCisterna, m1: medial1, m2: medial2, m3: medial3, trans: transCisterna };

    // 3. Hydraulic Supports
    const pistons = [];
    const p1 = createHydraulicPiston(); p1.root.position.set(15, -20, 10);
    const p2 = createHydraulicPiston(); p2.root.position.set(-15, -20, 10);
    const p3 = createHydraulicPiston(); p3.root.position.set(0, -20, -15);
    group.add(p1.root, p2.root, p3.root);
    pistons.push(p1, p2, p3);
    meshes.pistons = pistons;

    // 4. Microtubule Highway Track
    const trackCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-30, -25, 20),
        new THREE.Vector3(30, -20, 25),
        new THREE.Vector3(45, 0, 0),
        new THREE.Vector3(25, 25, -25),
        new THREE.Vector3(-20, 30, -30),
        new THREE.Vector3(-45, 5, 0),
        new THREE.Vector3(-30, -25, 20)
    ], true);
    
    const trackGeo = new THREE.TubeGeometry(trackCurve, 300, 1.5, 32, true);
    const trackMesh = new THREE.Mesh(trackGeo, aluminum);
    
    // Add glowing rails to the track
    const railGeo1 = new THREE.TubeGeometry(trackCurve, 300, 0.3, 8, true);
    const rail1 = new THREE.Mesh(railGeo1, neonBlue);
    const railGeo2 = new THREE.TubeGeometry(trackCurve, 300, 0.3, 8, true);
    const rail2 = new THREE.Mesh(railGeo2, neonBlue);
    rail1.scale.set(1.05, 1.05, 1.05);
    rail2.scale.set(0.95, 0.95, 0.95);
    
    trackMesh.add(rail1, rail2);
    group.add(trackMesh);
    meshes.trackCurve = trackCurve;

    // 5. Vesicle Rovers
    const rover1 = createRover();
    const rover2 = createRover();
    const rover3 = createRover();
    group.add(rover1.root, rover2.root, rover3.root);
    meshes.rovers = [
        { data: rover1, offset: 0.0 },
        { data: rover2, offset: 0.33 },
        { data: rover3, offset: 0.66 }
    ];

    // 6. Central Energy Core
    const coreGeo = new THREE.CylinderGeometry(3, 3, 40, 32);
    const coreMesh = new THREE.Mesh(coreGeo, glowingCoreMat);
    group.add(coreMesh);
    meshes.core = coreMesh;
    
    // Core Helix Shell
    const helixGeo = new THREE.TorusKnotGeometry(4, 1, 128, 16, 2, 15);
    const helixMesh = new THREE.Mesh(helixGeo, copper);
    helixMesh.rotation.x = Math.PI / 2;
    helixMesh.scale.z = 5;
    group.add(helixMesh);
    meshes.helix = helixMesh;

    // 7. Glycosylation Processor
    const glycoGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 16), chrome);
        cyl.position.set(Math.cos(i/8 * Math.PI*2)*5, 3, Math.sin(i/8 * Math.PI*2)*5);
        cyl.rotation.x = Math.PI/2;
        glycoGroup.add(cyl);
    }
    glycoGroup.position.set(15, 0, 10);
    medial1.add(glycoGroup);
    meshes.glyco = glycoGroup;

    // 8. Phosphorylation Scanner Ring at Trans Face
    const scannerGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(12, 0.8, 32, 64);
    const ring = new THREE.Mesh(ringGeo, darkSteel);
    scannerGroup.add(ring);
    
    for(let i=0; i<4; i++) {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), neonGreen);
        eye.position.set(Math.cos(i/4 * Math.PI*2)*12, Math.sin(i/4 * Math.PI*2)*12, 0);
        scannerGroup.add(eye);
    }
    scannerGroup.position.set(0, 22, 0);
    scannerGroup.rotation.x = Math.PI / 2;
    group.add(scannerGroup);
    meshes.scanner = scannerGroup;

    // 9. Secretory Launcher Array (Catapults)
    const launcherGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const base = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), steel);
        base.position.set((i-1)*10, 0, -15);
        
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 8, 32), glass);
        barrel.rotation.x = Math.PI/2;
        barrel.position.set(0, 2, 4);
        
        const glowingBall = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), neonPink);
        glowingBall.position.set(0, 2, 8);
        meshes['secretoryBall'+i] = glowingBall;
        
        base.add(barrel, glowingBall);
        launcherGroup.add(base);
    }
    launcherGroup.position.set(0, 20, 0);
    group.add(launcherGroup);

    // 10. Fluid Circulation Pipes
    const pipe1 = createComplexPipeNetwork(); pipe1.position.set(-20, -10, 0);
    const pipe2 = createComplexPipeNetwork(); pipe2.position.set(20, 0, -10); pipe2.rotation.y = Math.PI;
    group.add(pipe1, pipe2);

    // 11. Cis-Face Receptor Array
    const receptorGroup = new THREE.Group();
    const recTorus = new THREE.Mesh(new THREE.TorusGeometry(8, 1, 32, 64), plastic);
    recTorus.rotation.x = Math.PI / 2;
    receptorGroup.add(recTorus);
    
    for(let i=0; i<6; i++) {
        const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 5, 16), chrome);
        prong.position.set(Math.cos(i/6 * Math.PI*2)*8, -2.5, Math.sin(i/6 * Math.PI*2)*8);
        receptorGroup.add(prong);
    }
    receptorGroup.position.set(0, -22, 0);
    group.add(receptorGroup);
    meshes.receptor = receptorGroup;

    // --- PARTS DEFINITION ---
    
    parts.push({
        name: "Cis-Face Receptor Array",
        description: "The receiving dock for incoming transport vesicles from the Rough ER.",
        material: "Advanced Plastic and Chrome",
        function: "Captures and stabilizes incoming molecular cargo before injection into the cis-cisterna.",
        assemblyOrder: 1,
        connections: ["Microtubule_Track_System", "Cis_Cisterna"],
        failureEffect: "Incoming vesicles bounce off, halting cellular processing entirely.",
        cascadeFailures: ["Medial_Cisterna_Alpha", "Trans_Cisterna"],
        originalPosition: {x:0, y:-22, z:0},
        explodedPosition: {x:0, y:-40, z:0}
    });

    parts.push({
        name: "Cis_Cisterna",
        description: "The primary processing chamber where initial sorting occurs.",
        material: "Tinted Bio-Glass and Chrome",
        function: "Removes specific sugar monomers and prepares proteins for deep processing.",
        assemblyOrder: 2,
        connections: ["Cis-Face Receptor Array", "Medial_Cisterna_Alpha", "Fluid_Circulation_Pipes"],
        failureEffect: "Unsorted raw proteins clog the stack.",
        cascadeFailures: ["Glycosylation_Processor_Unit"],
        originalPosition: {x:0, y:-15, z:0},
        explodedPosition: {x:0, y:-30, z:0}
    });

    parts.push({
        name: "Medial_Cisterna_Alpha",
        description: "Secondary processing vat equipped with heavy glycosylation arrays.",
        material: "Tinted Bio-Glass",
        function: "Adds complex oligosaccharides to passing proteins.",
        assemblyOrder: 3,
        connections: ["Cis_Cisterna", "Medial_Cisterna_Beta"],
        failureEffect: "Incomplete protein folding and tagging.",
        cascadeFailures: ["Trans_Golgi_Network"],
        originalPosition: {x:0, y:-7, z:0},
        explodedPosition: {x:-20, y:-10, z:20}
    });

    parts.push({
        name: "Glycosylation_Processor_Unit",
        description: "Rotary injection cylinders attached to Medial Alpha.",
        material: "Chrome",
        function: "Physically injects sugar chains into passing vesicle lumens.",
        assemblyOrder: 4,
        connections: ["Medial_Cisterna_Alpha"],
        failureEffect: "Failure to synthesize glycoproteins properly.",
        cascadeFailures: [],
        originalPosition: {x:15, y:-7, z:10},
        explodedPosition: {x:40, y:-7, z:30}
    });

    parts.push({
        name: "Central_Energy_Core",
        description: "A pulsating column of pure ATP-derived energy.",
        material: "Glowing Core Material, Copper Helix",
        function: "Provides mechanical power to all processing vats and transport rovers.",
        assemblyOrder: 5,
        connections: ["All Cisternae"],
        failureEffect: "Complete factory shutdown and immediate cell death.",
        cascadeFailures: ["Hydraulic_Scaffold_Pistons", "Microtubule_Track_System"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:-50}
    });

    parts.push({
        name: "Microtubule_Track_System",
        description: "An aluminum and neon track acting as the cellular highway.",
        material: "Aluminum, Neon Blue Rails",
        function: "Guides Vesicle Rovers precisely to their docking stations.",
        assemblyOrder: 6,
        connections: ["Vesicle_Rovers", "Structural_Matrix_Scaffold"],
        failureEffect: "Rovers derail, spilling cargo into the cytoplasm.",
        cascadeFailures: ["Secretory_Launcher_Array"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:50}
    });

    parts.push({
        name: "Vesicle_Rover_Alpha",
        description: "High-tech transport vehicle with heavily treaded tires.",
        material: "Steel, Rubber, Neon Pink",
        function: "Automates the transport of vesicles between cisternae via motor protein simulation.",
        assemblyOrder: 7,
        connections: ["Microtubule_Track_System"],
        failureEffect: "Cargo bottleneck at the cis-face.",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:50, y:20, z:0}
    });

    parts.push({
        name: "Hydraulic_Scaffold_Pistons",
        description: "Heavy-duty lifting mechanisms beneath the apparatus.",
        material: "Dark Steel, Chrome, Copper",
        function: "Maintains optimal pressure and distance between cisternae layers.",
        assemblyOrder: 8,
        connections: ["Cis_Cisterna", "Cytoskeleton"],
        failureEffect: "Cisternae collapse into each other, destroying the spatial sorting gradient.",
        cascadeFailures: ["Medial_Cisterna_Alpha", "Medial_Cisterna_Beta"],
        originalPosition: {x:15, y:-20, z:10},
        explodedPosition: {x:30, y:-40, z:30}
    });

    parts.push({
        name: "Trans_Cisterna",
        description: "The final processing vat before the shipping hub.",
        material: "Tinted Bio-Glass",
        function: "Final protein modifications and sorting receptor attachment.",
        assemblyOrder: 9,
        connections: ["Medial_Cisterna_Gamma", "Trans_Face_Sorting_Hub"],
        failureEffect: "Proteins miss their final destination tags.",
        cascadeFailures: ["Phosphorylation_Scanner"],
        originalPosition: {x:0, y:17, z:0},
        explodedPosition: {x:0, y:40, z:0}
    });

    parts.push({
        name: "Phosphorylation_Scanner",
        description: "A rotating ring with neon green scanning lasers.",
        material: "Dark Steel, Neon Green",
        function: "Scans passing proteins to detect Mannose-6-phosphate tags for lysosomal delivery.",
        assemblyOrder: 10,
        connections: ["Trans_Cisterna"],
        failureEffect: "Lysosomal enzymes get secreted outside the cell instead, causing extracellular damage.",
        cascadeFailures: ["Secretory_Launcher_Array"],
        originalPosition: {x:0, y:22, z:0},
        explodedPosition: {x:0, y:60, z:0}
    });

    parts.push({
        name: "Secretory_Launcher_Array",
        description: "Pneumatic catapults attached to the trans-Golgi network.",
        material: "Steel, Glass, Neon Pink",
        function: "Vigorously propels secretory vesicles towards the plasma membrane.",
        assemblyOrder: 11,
        connections: ["Trans_Face_Sorting_Hub"],
        failureEffect: "Vesicles pile up at the trans-face, unable to exit.",
        cascadeFailures: [],
        originalPosition: {x:0, y:20, z:0},
        explodedPosition: {x:0, y:70, z:-30}
    });

    parts.push({
        name: "Fluid_Circulation_Pipes",
        description: "Complex copper tubing with flow regulators.",
        material: "Copper, Steel",
        function: "Pumps buffer solutions and raw enzymes between different vat layers.",
        assemblyOrder: 12,
        connections: ["Cis_Cisterna", "Trans_Cisterna"],
        failureEffect: "Chemical gradient breakdown across the Golgi stack.",
        cascadeFailures: ["All Cisternae"],
        originalPosition: {x:-20, y:-10, z:0},
        explodedPosition: {x:-50, y:-10, z:0}
    });

    parts.push({
        name: "Structural_Matrix_Scaffold",
        description: "Massive icosahedral wireframe encasing the apparatus.",
        material: "Lightweight Nano-Carbon",
        function: "Protects the delicate cisternae from intracellular impacts.",
        assemblyOrder: 13,
        connections: ["Hydraulic_Scaffold_Pistons", "Microtubule_Track_System"],
        failureEffect: "Structural integrity compromised under mechanical cellular stress.",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:0}
    });
    
    parts.push({
        name: "High-Tech_Vesicle_Tires",
        description: "Specialized Torus geometries with hundreds of box-extruded treads.",
        material: "Rubber, Aluminum Rim",
        function: "Provides absolute traction on slippery microtubule rails for rovers.",
        assemblyOrder: 14,
        connections: ["Vesicle_Rover_Alpha"],
        failureEffect: "Rovers slip and lose momentum.",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:60, y:10, z:10}
    });

    parts.push({
        name: "Lysosomal_Sorting_Hub",
        description: "A dedicated side chamber near the Trans Face.",
        material: "Chrome and Glass",
        function: "Packages destructive enzymes safely into strong vesicles.",
        assemblyOrder: 15,
        connections: ["Phosphorylation_Scanner", "Trans_Cisterna"],
        failureEffect: "Enzyme leakage, digesting the Golgi from the inside.",
        cascadeFailures: ["Entire Machine"],
        originalPosition: {x:-15, y:20, z:0},
        explodedPosition: {x:-40, y:40, z:0}
    });

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In this mechanized representation, what functional consequence occurs if the Phosphorylation Scanner Ring fails?",
            options: [
                "Proteins meant for the lysosome miss their Mannose-6-phosphate tags and are erroneously secreted outside the cell.",
                "The Cis-Face Receptor Array stops accepting incoming vesicles from the Rough ER.",
                "The Vesicle Transport Rovers derail from the Microtubule Track System.",
                "The Hydraulic Scaffold Pistons collapse under the weight of the cisternae."
            ],
            correctAnswer: 0,
            explanation: "The Phosphorylation Scanner (representing the trans-Golgi sorting mechanism) identifies the M6P tag on lysosomal enzymes. Without it, these destructive enzymes default to the secretory pathway and exit the cell."
        },
        {
            question: "What is the primary function of the heavily treaded High-Tech Vesicle Tires on the Transport Rovers?",
            options: [
                "To simulate the action of motor proteins (like kinesin and dynein) gripping the microtubule tracks.",
                "To crush defective proteins before they reach the trans-face.",
                "To power the Central Energy Core via friction.",
                "To pump hydraulic fluid into the Scaffold Pistons."
            ],
            correctAnswer: 0,
            explanation: "In our biomechanical model, the rovers represent transport vesicles, and their advanced tires simulate motor proteins that physically 'walk' or drive along the microtubule tracks."
        },
        {
            question: "Which component is responsible for the sequential addition of complex oligosaccharides?",
            options: [
                "The Glycosylation Processor Unit attached to the Medial Cisternae.",
                "The Secretory Launcher Array.",
                "The Central Energy Core.",
                "The Cis-Face Receptor Array."
            ],
            correctAnswer: 0,
            explanation: "Glycosylation (the addition and modification of sugar chains) occurs progressively as proteins move through the medial cisternae."
        },
        {
            question: "Why is the Golgi Apparatus structurally arranged as a stacked series of separated flattened vats (cisternae)?",
            options: [
                "To maintain strict, isolated biochemical environments and enzyme concentration gradients for sequential processing.",
                "To increase the aerodynamic efficiency of the cell.",
                "To allow the nucleus to expand rapidly.",
                "To store excessive amounts of water."
            ],
            correctAnswer: 0,
            explanation: "The stacked, separate nature of the cisternae prevents different processing enzymes from mixing prematurely, allowing a sequential 'assembly line' modification of proteins."
        },
        {
            question: "If the Secretory Launcher Array (Catapults) jams, what immediate crisis faces the Trans-Golgi Network?",
            options: [
                "A severe bottleneck where fully processed secretory vesicles accumulate and cannot exit, halting production.",
                "The Nucleus stops transcribing DNA.",
                "The Mitochondria produce excessive ATP.",
                "Incoming vesicles bypass the Golgi entirely."
            ],
            correctAnswer: 0,
            explanation: "The Launcher Array represents exocytosis. If it fails, processed vesicles build up at the trans-face, causing a logistical traffic jam that ultimately shuts down the Golgi's sorting capability."
        }
    ];

    // --- ANIMATION LOGIC ---
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // 1. Scaffold Rotation
        if (activeMeshes.scaffold) {
            activeMeshes.scaffold.rotation.y = t * 0.1;
            activeMeshes.scaffold.rotation.x = t * 0.05;
        }

        // 2. Cisternae Breathing (Pulsating scale)
        if (activeMeshes.cisternae) {
            const c = activeMeshes.cisternae;
            c.cis.scale.y = 1 + Math.sin(t * 2) * 0.05;
            c.m1.scale.y = 1 + Math.sin(t * 2 + 1) * 0.05;
            c.m2.scale.y = 1 + Math.sin(t * 2 + 2) * 0.05;
            c.m3.scale.y = 1 + Math.sin(t * 2 + 3) * 0.05;
            c.trans.scale.y = 1 + Math.sin(t * 2 + 4) * 0.05;
        }

        // 3. Hydraulic Pistons Pumping
        if (activeMeshes.pistons) {
            activeMeshes.pistons.forEach((piston, idx) => {
                piston.rod.position.y = 7 + Math.sin(t * 3 + idx) * 1.5;
            });
        }

        // 4. Rovers Moving on Track and Tires Rotating
        if (activeMeshes.rovers && activeMeshes.trackCurve) {
            activeMeshes.rovers.forEach((roverObj, idx) => {
                // Track progress
                const progress = ((t * 0.1) + roverObj.offset) % 1.0;
                const point = activeMeshes.trackCurve.getPointAt(progress);
                const tangent = activeMeshes.trackCurve.getTangentAt(progress);
                
                roverObj.data.root.position.copy(point);
                
                // Orient rover along the track
                const up = new THREE.Vector3(0, 1, 0);
                const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
                const radians = Math.acos(up.dot(tangent));
                roverObj.data.root.quaternion.setFromAxisAngle(axis, radians);
                
                // Spin tires rapidly
                roverObj.data.tires.forEach(tire => {
                    tire.rotation.y = t * 10;
                });
                
                // Bob cargo slightly
                roverObj.data.cargo.position.y = 2 + Math.sin(t * 15 + idx) * 0.2;
            });
        }

        // 5. Core Helix Spinning and Pulsing
        if (activeMeshes.helix) {
            activeMeshes.helix.rotation.z = -t * 2;
            glowingCoreMat.emissiveIntensity = 2 + Math.sin(t * 8) * 1.5;
        }

        // 6. Glycosylation Processors Spinning
        if (activeMeshes.glyco) {
            activeMeshes.glyco.rotation.y = t * 4;
            activeMeshes.glyco.children.forEach(child => {
                child.rotation.y = -t * 8;
            });
        }

        // 7. Phosphorylation Scanner Ring
        if (activeMeshes.scanner) {
            activeMeshes.scanner.rotation.z = t * 3;
        }

        // 8. Secretory Catapult Balls
        for(let i=0; i<3; i++) {
            const ball = activeMeshes['secretoryBall'+i];
            if (ball) {
                // Shoot out and reset
                const shootCycle = (t * 2 + i * 2) % 5;
                if (shootCycle < 1) {
                    ball.position.z = 8 + shootCycle * 20; // Shoot forward
                    ball.material.opacity = 1 - shootCycle;
                } else {
                    ball.position.z = 8;
                    ball.material.opacity = 1;
                }
            }
        }
        
        // 9. Receptor Array Prongs
        if (activeMeshes.receptor) {
            activeMeshes.receptor.children.forEach((child, idx) => {
                if (idx > 0) { // skip torus base
                    child.rotation.x = Math.sin(t * 5 + idx) * 0.5;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGolgiApparatus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
