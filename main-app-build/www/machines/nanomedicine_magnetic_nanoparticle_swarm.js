import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------------------
    // CUSTOM MATERIALS & SHADERS
    // -------------------------------------------------------------------------
    const bioTissue = new THREE.MeshPhysicalMaterial({
        color: 0xffaaaa,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.3,
        thickness: 5.0,
        side: THREE.DoubleSide
    });

    const tumorMat = new THREE.MeshPhysicalMaterial({
        color: 0x113311,
        roughness: 0.9,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.8,
        bumpScale: 0.5
    });

    const tumorVeinMat = new THREE.MeshStandardMaterial({
        color: 0x550000,
        roughness: 0.6,
        metalness: 0.2
    });

    const fluxMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const heatMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff2200,
        emissiveIntensity: 0.0,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const rbcMat = new THREE.MeshPhysicalMaterial({
        color: 0xcc0000,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4
    });

    const nanoCoreMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.9
    });

    const nanoShellMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.1
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.5
    });

    // -------------------------------------------------------------------------
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // -------------------------------------------------------------------------
    class BloodVesselCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = (t - 0.5) * 300;
            const y = Math.sin(t * Math.PI * 3) * 15;
            const z = Math.cos(t * Math.PI * 2) * 10;
            return optionalTarget.set(x, y, z);
        }
    }

    class CatheterCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = -150 + t * 60;
            const y = Math.sin(t * Math.PI) * 5;
            const z = Math.cos(t * Math.PI) * 2;
            return optionalTarget.set(x, y, z);
        }
    }

    class FluxCurve extends THREE.Curve {
        constructor(p1, p2, p3) {
            super();
            this.p1 = p1; this.p2 = p2; this.p3 = p3;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const u = 1 - t;
            const tt = t * t, uu = u * u;
            const uut = 2 * u * t;
            const p = new THREE.Vector3();
            p.x = uu * this.p1.x + uut * this.p2.x + tt * this.p3.x;
            p.y = uu * this.p1.y + uut * this.p2.y + tt * this.p3.y;
            p.z = uu * this.p1.z + uut * this.p2.z + tt * this.p3.z;
            return optionalTarget.copy(p);
        }
    }

    // -------------------------------------------------------------------------
    // SCENE CONSTRUCTION
    // -------------------------------------------------------------------------

    // 1. Blood Vessel (Capillary)
    const vesselCurve = new BloodVesselCurve();
    const vesselGeo = new THREE.TubeGeometry(vesselCurve, 150, 35, 48, false);
    const vesselMesh = new THREE.Mesh(vesselGeo, bioTissue);
    group.add(vesselMesh);

    parts.push({
        name: "Capillary Endothelium",
        description: "The semi-permeable biological vessel wall representing a major arteriole guiding the nanoparticles.",
        material: "Bio-Tissue",
        function: "Contains the circulatory flow and provides a mounting surface for the targeted tumor.",
        assemblyOrder: 1,
        connections: ["Tumor Mass Core", "Erythrocytes"],
        failureEffect: "Rupture leading to internal hemorrhage and failure of targeted delivery.",
        cascadeFailures: ["Loss of circulatory pressure", "Systemic nanoparticle toxicity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 2. Tumor Mass (Complex clustered geometry)
    const tumorGroup = new THREE.Group();
    tumorGroup.position.set(40, -32, 5);
    
    const baseTumorGeo = new THREE.DodecahedronGeometry(15, 2);
    const tumorPositions = [
        [0,0,0], [8,5,-2], [-6,-4,8], [5,-10,3], [-8,6,-5],
        [12,-2,-8], [-10,-8,-6], [3,12,6]
    ];
    
    tumorPositions.forEach((pos, idx) => {
        const tMesh = new THREE.Mesh(baseTumorGeo, tumorMat);
        tMesh.position.set(...pos);
        const scale = 0.5 + Math.random() * 0.8;
        tMesh.scale.set(scale, scale, scale);
        tMesh.rotation.set(Math.random(), Math.random(), Math.random());
        tumorGroup.add(tMesh);
    });

    // Tumor Vascularization (Angiogenesis lines)
    const veinCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-15, 5, 5),
        new THREE.Vector3(0, 20, 15),
        new THREE.Vector3(10, 5, -5)
    );
    const veinGeo = new THREE.TubeGeometry(veinCurve, 20, 1.5, 8, false);
    const veinMesh = new THREE.Mesh(veinGeo, tumorVeinMat);
    tumorGroup.add(veinMesh);

    group.add(tumorGroup);

    parts.push({
        name: "Tumor Mass Core",
        description: "A highly heterogeneous, dense collection of mutated cells with disorganized vascularization (angiogenesis).",
        material: "Mutated Organic Tissue",
        function: "The primary target for the magnetic nanoparticles, destined for magnetic hyperthermia ablation.",
        assemblyOrder: 2,
        connections: ["Capillary Endothelium", "Tumor Vascularization"],
        failureEffect: "Metastasis and uncontrolled growth.",
        cascadeFailures: ["Organ failure", "Systemic biological collapse"],
        originalPosition: { x: 40, y: -32, z: 5 },
        explodedPosition: { x: 40, y: -100, z: 5 }
    });

    parts.push({
        name: "Tumor Vascularization",
        description: "Chaotic, leaky blood vessels characteristic of rapid tumor growth, exploiting the EPR (Enhanced Permeability and Retention) effect.",
        material: "Endothelial Tissue",
        function: "Provides nutrients to the tumor and acts as the entry point for extravasating nanoparticles.",
        assemblyOrder: 3,
        connections: ["Tumor Mass Core"],
        failureEffect: "Starvation of tumor core (beneficial) or hemorrhage.",
        cascadeFailures: ["Necrosis of surrounding healthy tissue"],
        originalPosition: { x: 40, y: -32, z: 5 },
        explodedPosition: { x: 40, y: -120, z: 20 }
    });

    // 3. Hyperthermia Heat Radiator
    const heatGeo = new THREE.IcosahedronGeometry(22, 4);
    const heatMesh = new THREE.Mesh(heatGeo, heatMat);
    heatMesh.position.copy(tumorGroup.position);
    group.add(heatMesh);
    meshes.heatMesh = heatMesh;

    parts.push({
        name: "Hyperthermia Radiator Zone",
        description: "A spherical field representing the localized heat generated by magnetic nanoparticles under an alternating magnetic field.",
        material: "Thermal Energy (Visualized)",
        function: "Raises local temperature above 42°C to induce apoptosis in cancer cells without harming healthy tissue.",
        assemblyOrder: 4,
        connections: ["Tumor Mass Core", "Magnetic Flux Lines"],
        failureEffect: "Insufficient heating leads to tumor survival; excessive heating damages healthy tissue.",
        cascadeFailures: ["Treatment failure", "Thermal necrosis of arteriole"],
        originalPosition: { x: 40, y: -32, z: 5 },
        explodedPosition: { x: 40, y: -32, z: -80 }
    });

    // 4. External Targeting Electromagnets (North and South Poles)
    function createElectromagnet(isNorth) {
        const magGroup = new THREE.Group();
        
        // Iron Core
        const coreGeo = new THREE.CylinderGeometry(15, 25, 40, 32);
        const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
        coreMesh.rotation.x = Math.PI / 2;
        magGroup.add(coreMesh);

        // Coil Windings
        const coilGeo = new THREE.TorusGeometry(20, 2, 16, 64);
        for(let i=0; i<15; i++) {
            const coilLoop = new THREE.Mesh(coilGeo, copper);
            coilLoop.position.z = -15 + i*2;
            magGroup.add(coilLoop);
        }

        // Cryo Cooling System
        const cryoGeo = new THREE.TubeGeometry(
            new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(0, 25, 10),
                new THREE.Vector3(30, 30, 0),
                new THREE.Vector3(0, 25, -10)
            ), 20, 1.5, 12, false
        );
        const cryoMesh = new THREE.Mesh(cryoGeo, chrome);
        magGroup.add(cryoMesh);

        // Indicator Light
        const lightGeo = new THREE.TorusGeometry(26, 1, 16, 64);
        const lightMesh = new THREE.Mesh(lightGeo, isNorth ? neonBlue : heatMat);
        lightMesh.position.z = 15;
        magGroup.add(lightMesh);

        return magGroup;
    }

    const magnetN = createElectromagnet(true);
    magnetN.position.set(40, -100, 5);
    magnetN.lookAt(40, -32, 5);
    group.add(magnetN);

    const magnetS = createElectromagnet(false);
    magnetS.position.set(40, 80, 5);
    magnetS.lookAt(40, -32, 5);
    group.add(magnetS);

    parts.push({
        name: "Targeting Electromagnet North",
        description: "A supercooled external electromagnetic pole piece generating a high-gradient magnetic field.",
        material: "Dark Steel, Copper, Chrome",
        function: "Pulls and aligns magnetic nanoparticles directly into the tumor vascular bed.",
        assemblyOrder: 5,
        connections: ["Copper Induction Coil N", "Cryo Cooling System North"],
        failureEffect: "Loss of directional targeting, causing nanoparticles to flush systemically.",
        cascadeFailures: ["Systemic toxicity", "Ineffective localized heating"],
        originalPosition: { x: 40, y: -100, z: 5 },
        explodedPosition: { x: 120, y: -150, z: 5 }
    });

    parts.push({
        name: "Copper Induction Coil N",
        description: "Thick, densely wound ultra-pure copper wire for generating massive Ampere-turns.",
        material: "Ultra-pure Copper",
        function: "Converts high-frequency alternating current into an oscillating magnetic field for hyperthermia.",
        assemblyOrder: 6,
        connections: ["Targeting Electromagnet North"],
        failureEffect: "Short circuit or resistive overheating.",
        cascadeFailures: ["Melted core", "Catastrophic power supply failure"],
        originalPosition: { x: 40, y: -100, z: 5 },
        explodedPosition: { x: 120, y: -150, z: 40 }
    });

    parts.push({
        name: "Cryo Cooling System North",
        description: "Liquid nitrogen piping surrounding the induction coils.",
        material: "Chrome-plated Alloy",
        function: "Prevents the copper coils from melting under extreme high-amperage loads.",
        assemblyOrder: 7,
        connections: ["Copper Induction Coil N"],
        failureEffect: "Thermal runaway of the electromagnet.",
        cascadeFailures: ["Coil melting", "Electromagnet failure"],
        originalPosition: { x: 40, y: -100, z: 5 },
        explodedPosition: { x: 120, y: -150, z: -30 }
    });

    parts.push({
        name: "Targeting Electromagnet South",
        description: "The opposing supercooled external electromagnetic pole piece.",
        material: "Dark Steel, Copper, Chrome",
        function: "Works in tandem with the North pole to create a concentrated flux gradient at the tumor site.",
        assemblyOrder: 8,
        connections: ["Copper Induction Coil S"],
        failureEffect: "Asymmetric field generation, pushing nanoparticles away from the target.",
        cascadeFailures: ["Off-target aggregation"],
        originalPosition: { x: 40, y: 80, z: 5 },
        explodedPosition: { x: -40, y: 150, z: 5 }
    });

    // 5. Magnetic Flux Lines (Animated glowing tubes)
    const fluxLines = new THREE.Group();
    meshes.fluxLines = [];
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 25;
        const start = new THREE.Vector3(40 + Math.cos(angle)*radius, -90, 5 + Math.sin(angle)*radius);
        const end = new THREE.Vector3(40 + Math.cos(angle)*radius, 70, 5 + Math.sin(angle)*radius);
        const mid = new THREE.Vector3(40 + Math.cos(angle)*(radius-10), -10, 5 + Math.sin(angle)*(radius-10));
        
        const fCurve = new FluxCurve(start, mid, end);
        const fGeo = new THREE.TubeGeometry(fCurve, 32, 0.8, 8, false);
        const fMesh = new THREE.Mesh(fGeo, fluxMat.clone());
        fluxLines.add(fMesh);
        meshes.fluxLines.push(fMesh);
    }
    group.add(fluxLines);

    parts.push({
        name: "Magnetic Flux Lines",
        description: "Visual representation of the intense, alternating magnetic field lines penetrating the tissue.",
        material: "Photon/Energy Visualization",
        function: "Indicates the field strength, gradient, and frequency manipulating the nanoparticles.",
        assemblyOrder: 9,
        connections: ["Targeting Electromagnet North", "Targeting Electromagnet South"],
        failureEffect: "N/A (Conceptual visualization)",
        cascadeFailures: [],
        originalPosition: { x: 40, y: -10, z: 5 },
        explodedPosition: { x: 40, y: -10, z: -100 }
    });

    // 6. Delivery Catheter
    const catheterGroup = new THREE.Group();
    const catGeo = new THREE.TubeGeometry(new CatheterCurve(), 64, 4, 16, false);
    const catMesh = new THREE.Mesh(catGeo, chrome);
    catheterGroup.add(catMesh);

    // Catheter Nozzle (Intricate tip)
    const nozzleGeo = new THREE.CylinderGeometry(4, 2, 10, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, darkSteel);
    nozzleMesh.rotation.z = -Math.PI / 2;
    nozzleMesh.position.set(-90, 0, 0);
    catheterGroup.add(nozzleMesh);

    // Sensor Array on Nozzle
    const sensorGeo = new THREE.TorusGeometry(4.2, 0.5, 8, 32);
    const sensorMesh = new THREE.Mesh(sensorGeo, neonBlue);
    sensorMesh.rotation.y = Math.PI / 2;
    sensorMesh.position.set(-92, 0, 0);
    catheterGroup.add(sensorMesh);

    group.add(catheterGroup);

    parts.push({
        name: "Catheter Shaft",
        description: "A flexible, microscopically braided steel and polymer tube navigated through the vascular system.",
        material: "Medical Grade Chrome & Polymer",
        function: "Provides a protected conduit for injecting the nanoparticle swarm near the target site.",
        assemblyOrder: 10,
        connections: ["Catheter Deployment Nozzle"],
        failureEffect: "Kinking or piercing of the blood vessel.",
        cascadeFailures: ["Internal bleeding", "Delivery failure"],
        originalPosition: { x: -120, y: 0, z: 0 },
        explodedPosition: { x: -200, y: 50, z: 0 }
    });

    parts.push({
        name: "Catheter Deployment Nozzle",
        description: "A micro-machined dark steel tip with fluid dynamic channels for optimal swarm dispersion.",
        material: "Machined Dark Steel",
        function: "Releases the nanoparticles smoothly without causing cavitation or cellular damage.",
        assemblyOrder: 11,
        connections: ["Catheter Shaft", "Sensor Array"],
        failureEffect: "Clogging, causing back-pressure and particle agglomeration.",
        cascadeFailures: ["Catheter rupture", "Embolism"],
        originalPosition: { x: -90, y: 0, z: 0 },
        explodedPosition: { x: -90, y: 50, z: 0 }
    });

    parts.push({
        name: "Sensor Array",
        description: "A ring of optical and piezoresistive sensors on the catheter tip.",
        material: "Silicon and Glowing Phosphors",
        function: "Monitors blood flow rate, temperature, and local nanoparticle concentration.",
        assemblyOrder: 12,
        connections: ["Catheter Deployment Nozzle"],
        failureEffect: "Loss of telemetry data, requiring blind deployment.",
        cascadeFailures: ["Over-dosage of nanoparticles"],
        originalPosition: { x: -92, y: 0, z: 0 },
        explodedPosition: { x: -92, y: 70, z: 20 }
    });

    // 7. Red Blood Cells (Erythrocytes) via InstancedMesh
    // Custom biconcave disk geometry
    const rbcPoints = [];
    for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const x = Math.sin(t * Math.PI) * 3;
        const y = (1.2 - Math.sin(t * Math.PI)) * Math.cos(t * Math.PI) * 1.0;
        rbcPoints.push(new THREE.Vector2(x, y));
    }
    const rbcGeo = new THREE.LatheGeometry(rbcPoints, 32);
    
    const rbcCount = 150;
    const rbcMesh = new THREE.InstancedMesh(rbcGeo, rbcMat, rbcCount);
    
    const rbcData = [];
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < rbcCount; i++) {
        const t = Math.random(); // Position along curve
        const curvePoint = vesselCurve.getPoint(t);
        
        // Add random offset within tube radius
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * 20;
        curvePoint.x += Math.random() * 10 - 5;
        curvePoint.y += Math.cos(angle) * rad;
        curvePoint.z += Math.sin(angle) * rad;

        dummy.position.copy(curvePoint);
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        rbcMesh.setMatrixAt(i, dummy.matrix);

        rbcData.push({
            t: t,
            rad: rad,
            angle: angle,
            rotSpeed: new THREE.Vector3(Math.random()*0.1, Math.random()*0.1, Math.random()*0.1)
        });
    }
    group.add(rbcMesh);
    meshes.rbcMesh = rbcMesh;
    meshes.rbcData = rbcData;

    parts.push({
        name: "Erythrocytes (Red Blood Cells)",
        description: "Biconcave disks responsible for oxygen transport, representing the natural biological environment.",
        material: "Cellular Membrane & Hemoglobin",
        function: "Flows through the capillary, interacting hydrodynamically with the nanoparticle swarm.",
        assemblyOrder: 13,
        connections: ["Capillary Endothelium"],
        failureEffect: "Hemolysis (rupture) due to shear stress or overheating.",
        cascadeFailures: ["Anemia", "Vascular blockage from cellular debris"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -80, z: -50 }
    });

    // 8. Nanoparticle Swarm (InstancedMesh, high count, complex geometry)
    const nanoCount = 2000;
    
    // Core (Iron Oxide)
    const coreNanoGeo = new THREE.DodecahedronGeometry(0.8, 0);
    const coreNanoMesh = new THREE.InstancedMesh(coreNanoGeo, nanoCoreMat, nanoCount);
    
    // Shell (PEG / Silica)
    const shellNanoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const shellNanoMesh = new THREE.InstancedMesh(shellNanoGeo, nanoShellMat, nanoCount);
    
    const nanoData = [];
    for(let i = 0; i < nanoCount; i++) {
        // Start them inside or near the catheter nozzle
        const startX = -85 + (Math.random() * 10 - 5);
        const startY = Math.random() * 4 - 2;
        const startZ = Math.random() * 4 - 2;
        
        dummy.position.set(startX, startY, startZ);
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        dummy.updateMatrix();
        
        coreNanoMesh.setMatrixAt(i, dummy.matrix);
        shellNanoMesh.setMatrixAt(i, dummy.matrix);
        
        nanoData.push({
            position: new THREE.Vector3(startX, startY, startZ),
            velocity: new THREE.Vector3(Math.random()*2, (Math.random()-0.5), (Math.random()-0.5)),
            phase: Math.random() * Math.PI * 2,
            captured: false,
            rotation: dummy.rotation.clone(),
            rotSpeed: new THREE.Vector3(Math.random()*0.2-0.1, Math.random()*0.2-0.1, Math.random()*0.2-0.1)
        });
    }
    
    coreNanoMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    shellNanoMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    
    group.add(coreNanoMesh);
    group.add(shellNanoMesh);
    
    meshes.coreNanoMesh = coreNanoMesh;
    meshes.shellNanoMesh = shellNanoMesh;
    meshes.nanoData = nanoData;

    parts.push({
        name: "Nanoparticle Core (SPIONs)",
        description: "Superparamagnetic Iron Oxide Nanoparticles (SPIONs) consisting of a crystalline magnetite/maghemite core.",
        material: "Dark Steel / Iron Oxide",
        function: "Reacts strongly to external magnetic fields for targeted steering and generates heat via Néel/Brownian relaxation.",
        assemblyOrder: 14,
        connections: ["Nanoparticle PEG Shell"],
        failureEffect: "Loss of superparamagnetism due to core oxidation or incorrect size.",
        cascadeFailures: ["Inability to steer", "Lack of hyperthermic response"],
        originalPosition: { x: -85, y: 0, z: 0 },
        explodedPosition: { x: -85, y: 0, z: 80 }
    });

    parts.push({
        name: "Nanoparticle PEG Shell",
        description: "Polyethylene glycol (PEG) and silica coating surrounding the iron core.",
        material: "Transparent Polymer / Glass",
        function: "Provides steric stabilization, preventing agglomeration and evasion from the Reticuloendothelial System (RES/macrophages).",
        assemblyOrder: 15,
        connections: ["Nanoparticle Core (SPIONs)"],
        failureEffect: "Desorption of the shell exposes the reactive iron core.",
        cascadeFailures: ["Rapid agglomeration", "Immune system clearance", "Toxicity"],
        originalPosition: { x: -85, y: 0, z: 0 },
        explodedPosition: { x: -85, y: 0, z: 120 }
    });

    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary purpose of the alternating magnetic field in magnetic nanoparticle hyperthermia?",
            options: [
                "To push the nanoparticles out of the body",
                "To induce rapid flipping of magnetic moments, generating heat through hysteresis and relaxation losses",
                "To freeze the tumor cells",
                "To make the nanoparticles emit light"
            ],
            correctAnswer: 1,
            explanation: "Alternating magnetic fields cause the superparamagnetic core's magnetic moment to rapidly flip (Néel relaxation) or the entire particle to rotate (Brownian relaxation), dissipating energy as heat."
        },
        {
            question: "Why are the nanoparticles coated with a PEG (polyethylene glycol) shell?",
            options: [
                "To increase their magnetic strength",
                "To make them visible under X-ray",
                "To evade the immune system and prevent agglomeration",
                "To reduce their manufacturing cost"
            ],
            correctAnswer: 2,
            explanation: "PEG provides a 'stealth' layer that prevents proteins from binding (opsonization), thus delaying clearance by the immune system (macrophages) and preventing the particles from clumping together."
        },
        {
            question: "What does the EPR effect refer to in the context of tumor targeting?",
            options: [
                "Enhanced Permeability and Retention",
                "Electromagnetic Particle Resonance",
                "Extracellular Protein Reduction",
                "Endothelial Plasma Reaction"
            ],
            correctAnswer: 0,
            explanation: "Tumors grow rapidly and form defective, leaky blood vessels. Nanoparticles can slip through these large pores (Enhanced Permeability) and stay there due to poor lymphatic drainage (Retention)."
        },
        {
            question: "Why must the nanoparticle cores be 'superparamagnetic' rather than strongly ferromagnetic?",
            options: [
                "Ferromagnetic materials are too heavy",
                "Superparamagnetic particles only exhibit magnetism in the presence of an external field, preventing unwanted clumping",
                "Superparamagnetic materials dissolve in the bloodstream",
                "Ferromagnetic particles cannot be heated"
            ],
            correctAnswer: 1,
            explanation: "If they were purely ferromagnetic, they would retain permanent magnetization and clump together in the bloodstream, causing lethal embolisms. Superparamagnetic particles lose their magnetism once the external field is removed."
        },
        {
            question: "What happens to a cancer cell when the local temperature is raised to 42-45°C via hyperthermia?",
            options: [
                "It immediately vaporizes",
                "It undergoes apoptosis (programmed cell death) due to protein denaturation, while healthy cells can generally survive this mild heat",
                "It multiplies faster",
                "It turns into a magnetic particle itself"
            ],
            correctAnswer: 1,
            explanation: "Mild hyperthermia (42-45°C) damages cellular structures and disrupts DNA repair in cancer cells, triggering apoptosis. Healthy tissue has better heat dissipation (via normal blood flow) and survives."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------
    const tumorCenter = new THREE.Vector3(40, -32, 5);

    function animate(time, speed, activeMeshes) {
        const delta = 0.016 * speed;
        
        // 1. Animate Blood Cells (Erythrocytes)
        if (meshes.rbcMesh && meshes.rbcData) {
            for (let i = 0; i < meshes.rbcData.length; i++) {
                let data = meshes.rbcData[i];
                data.t += delta * 0.02; // Flow speed
                if (data.t > 1.0) data.t = 0; // Loop back
                
                const pos = vesselCurve.getPoint(data.t);
                // Re-apply radius offset
                pos.x += Math.random() * 1.0 - 0.5; // slight jitter
                pos.y += Math.cos(data.angle) * data.rad;
                pos.z += Math.sin(data.angle) * data.rad;

                dummy.position.copy(pos);
                dummy.rotation.x += data.rotSpeed.x * speed;
                dummy.rotation.y += data.rotSpeed.y * speed;
                dummy.rotation.z += data.rotSpeed.z * speed;
                dummy.updateMatrix();
                meshes.rbcMesh.setMatrixAt(i, dummy.matrix);
            }
            meshes.rbcMesh.instanceMatrix.needsUpdate = true;
        }

        // 2. Animate Nanoparticle Swarm
        if (meshes.coreNanoMesh && meshes.nanoData) {
            for (let i = 0; i < meshes.nanoData.length; i++) {
                let data = meshes.nanoData[i];
                let p = data.position;
                let v = data.velocity;

                // Base flow (bloodstream pushing +x direction)
                if (!data.captured) {
                    v.x += delta * 2.0;
                }

                // Magnetic Attraction (pull towards tumor)
                let distToTumor = p.distanceTo(tumorCenter);
                if (distToTumor < 60) {
                    data.captured = true;
                    // Vector pointing to tumor
                    let pull = new THREE.Vector3().subVectors(tumorCenter, p).normalize();
                    // Stronger pull as it gets closer
                    pull.multiplyScalar(delta * (150 / Math.max(distToTumor, 1.0)));
                    v.add(pull);

                    // Add swirling vortex effect around the tumor
                    let axis = new THREE.Vector3(0, 0, 1);
                    let swirl = new THREE.Vector3().crossVectors(pull, axis).normalize().multiplyScalar(delta * 10.0);
                    v.add(swirl);
                    
                    // Damping to prevent flying away
                    v.multiplyScalar(0.92);
                } else {
                    // Normal bloodstream damping
                    v.multiplyScalar(0.98);
                }

                p.add(v);

                // Reset particles that flow way past the scene to simulate continuous injection
                if (p.x > 150 || p.y < -80 || p.y > 80) {
                    p.set(-85 + (Math.random()*10-5), Math.random()*4-2, Math.random()*4-2);
                    v.set(Math.random()*2, (Math.random()-0.5), (Math.random()-0.5));
                    data.captured = false;
                }

                dummy.position.copy(p);
                
                // Rotation
                data.rotation.x += data.rotSpeed.x * speed;
                data.rotation.y += data.rotSpeed.y * speed;
                data.rotation.z += data.rotSpeed.z * speed;
                dummy.rotation.copy(data.rotation);
                
                // Add rapid shaking if captured (simulating alternating magnetic field heating)
                if (data.captured) {
                    let shake = Math.sin(time * 50 + data.phase) * 0.1;
                    dummy.position.x += shake;
                    dummy.position.y += shake;
                }

                dummy.updateMatrix();
                meshes.coreNanoMesh.setMatrixAt(i, dummy.matrix);
                meshes.shellNanoMesh.setMatrixAt(i, dummy.matrix);
            }
            meshes.coreNanoMesh.instanceMatrix.needsUpdate = true;
            meshes.shellNanoMesh.instanceMatrix.needsUpdate = true;
        }

        // 3. Animate Magnetic Flux Lines (Pulsing Effect)
        if (meshes.fluxLines) {
            meshes.fluxLines.forEach((line, idx) => {
                const phase = (idx / meshes.fluxLines.length) * Math.PI * 2;
                // Pulsate opacity and emissive intensity based on high frequency
                const pulse = (Math.sin(time * 8 + phase) + 1) / 2;
                line.material.opacity = 0.2 + pulse * 0.6;
                line.material.emissiveIntensity = 1.0 + pulse * 3.0;
            });
        }

        // 4. Animate Hyperthermia Heat Radiator
        if (meshes.heatMesh) {
            // Pulse the heat zone to simulate alternating field power cycles
            const heatPulse = (Math.sin(time * 4) + 1) / 2;
            meshes.heatMesh.material.opacity = 0.2 + heatPulse * 0.4;
            meshes.heatMesh.material.emissiveIntensity = heatPulse * 1.5;
            // Slow rotation
            meshes.heatMesh.rotation.y += delta * 0.5;
            meshes.heatMesh.rotation.z += delta * 0.2;
        }
    }

    return {
        group,
        parts,
        description: "An advanced, highly detailed simulation of a Nanomedicine Magnetic Nanoparticle Swarm. It demonstrates Superparamagnetic Iron Oxide Nanoparticles (SPIONs) being injected via a catheter, navigating the bloodstream, and being captured by external high-gradient superconducting electromagnets. The targeted swarm agglomerates at the tumor site where an alternating magnetic field induces localized hyperthermia, heating the mutated cells to trigger apoptosis while leaving healthy tissue unharmed.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createMagneticNanoparticleSwarm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
