import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // =========================================================================
    // CUSTOM ADVANCED MATERIALS
    // =========================================================================
    const neonPink = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 2.5 });
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x8a2be2, emissive: 0x8a2be2, emissiveIntensity: 1.5 });
    const brightOrange = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 1.0 });
    const bioMembraneOuter = new THREE.MeshPhysicalMaterial({
        color: 0xff66cc,
        emissive: 0x330011,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.45,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const bioMembraneInner = new THREE.MeshPhysicalMaterial({
        color: 0x8a2be2,
        emissive: 0x110022,
        transmission: 0.8,
        opacity: 1,
        transparent: true,
        roughness: 0.3,
        ior: 1.33,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    const dnaMats = {
        backbone: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 }),
        bases: [
            new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x880000, emissiveIntensity: 0.5 }), // Adenine
            new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x008800, emissiveIntensity: 0.5 }), // Thymine
            new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x000088, emissiveIntensity: 0.5 }), // Guanine
            new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x888800, emissiveIntensity: 0.5 })  // Cytosine
        ],
        connector: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 })
    };

    const animatedMeshes = {
        wheels: [],
        dnaStrands: [],
        pistons: [],
        chromatin: [],
        nucleolus: null,
        envelopeOuter: null,
        envelopeInner: null,
        exhaustGlows: []
    };

    // =========================================================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRY
    // =========================================================================

    function createWheel(x, y, z) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);
        
        // Massive Off-road Tire
        const tireGeo = new THREE.TorusGeometry(4.5, 2.0, 48, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        
        // Aggressive Tread Lugs ( cientos de tiny boxes )
        const lugGeo = new THREE.BoxGeometry(0.8, 1.2, 4.4);
        for (let i = 0; i < 120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 6.3, Math.sin(angle) * 6.3, 0);
            lug.rotation.z = angle;
            tire.add(lug);
        }
        
        // Complex Rim (Cylinders and Spokes)
        const rimGeo = new THREE.CylinderGeometry(3.2, 3.2, 3.0, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        
        const hubGeo = new THREE.CylinderGeometry(1.0, 1.0, 3.4, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        tire.add(hub);

        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.2, 6.4, 16);
        for (let i = 0; i < 12; i++) {
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = (i / 12) * Math.PI * 2;
            spoke.rotation.x = Math.PI / 2;
            tire.add(spoke);
        }

        // Brake Disc & Caliper
        const discGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.0, 64);
        const disc = new THREE.Mesh(discGeo, steel);
        disc.rotation.x = Math.PI / 2;
        disc.position.z = -1.0;
        wheelGroup.add(disc);

        const caliperGeo = new THREE.BoxGeometry(1.5, 2.5, 1.2);
        const caliper = new THREE.Mesh(caliperGeo, dnaMats.bases[0]); // Red caliper
        caliper.position.set(0, 1.8, -1.0);
        wheelGroup.add(caliper);

        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        // Store for animation
        animatedMeshes.wheels.push(tire);
        return wheelGroup;
    }

    function createNuclearPore() {
        const poreGroup = new THREE.Group();
        // Outer Ring
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.15, 16, 64), chrome);
        // Inner Ring
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 16, 64), darkSteel);
        ring2.position.z = -0.3;
        
        poreGroup.add(ring1);
        poreGroup.add(ring2);
        
        // Central Transporter Basket
        const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 0.6, 16), bioMembraneInner);
        basket.rotation.x = Math.PI / 2;
        basket.position.z = -0.15;
        poreGroup.add(basket);

        // Spokes connecting rings
        for(let s=0; s<8; s++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6), steel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (s / 8) * Math.PI * 2;
            poreGroup.add(spoke);
        }
        return poreGroup;
    }

    function createDNAStrand(length, radius, turns, segments) {
        const group = new THREE.Group();
        const pts1 = [];
        const pts2 = [];
        for(let i=0; i<=segments; i++) {
            const t = i/segments;
            const y = (t - 0.5) * length;
            const angle = t * Math.PI * 2 * turns;
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;
            
            pts1.push(new THREE.Vector3(x1, y, z1));
            pts2.push(new THREE.Vector3(x2, y, z2));
            
            // Generate Base Pairs (Rungs)
            if (i % 2 === 0 && i < segments) {
                const rungGrp = new THREE.Group();
                const p1 = new THREE.Vector3(x1, y, z1);
                const p2 = new THREE.Vector3(x2, y, z2);
                const dist = p1.distanceTo(p2);
                
                // Randomly select complementary pairs (0-1 or 2-3)
                const pairType = Math.random() > 0.5 ? 0 : 2;
                const m1 = dnaMats.bases[pairType];
                const m2 = dnaMats.bases[pairType + 1];
                
                const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, dist/2, 16), m1);
                h1.position.y = dist/4;
                const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, dist/2, 16), m2);
                h2.position.y = -dist/4;
                
                rungGrp.add(h1);
                rungGrp.add(h2);
                
                // Hydrogen bond visual (glowing center sphere)
                const bond = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), dnaMats.connector);
                rungGrp.add(bond);

                rungGrp.position.copy(p1).lerp(p2, 0.5);
                rungGrp.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
                
                group.add(rungGrp);
            }
        }
        
        // Phosphodiester Backbones
        const curve1 = new THREE.CatmullRomCurve3(pts1);
        const curve2 = new THREE.CatmullRomCurve3(pts2);
        const t1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, segments, 0.3, 16, false), dnaMats.backbone);
        const t2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, segments, 0.3, 16, false), dnaMats.backbone);
        group.add(t1);
        group.add(t2);
        
        animatedMeshes.dnaStrands.push(group);
        return group;
    }

    function addPiping(parent, count, bounds) {
        for(let i=0; i<count; i++) {
            const pts = [];
            let cx = bounds.x + (Math.random()-0.5)*bounds.w;
            let cy = bounds.y + (Math.random()-0.5)*bounds.h;
            let cz = bounds.z + (Math.random()-0.5)*bounds.d;
            for(let j=0; j<6; j++) {
                pts.push(new THREE.Vector3(cx, cy, cz));
                cx += (Math.random()-0.5)*6;
                cy += (Math.random()-0.5)*6;
                cz += (Math.random()-0.5)*6;
            }
            const curve = new THREE.CatmullRomCurve3(pts);
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, Math.random()*0.15 + 0.05, 8, false), copper);
            parent.add(tube);
        }
    }

    // =========================================================================
    // ASSEMBLY: CHASSIS & VEHICLE BASE
    // =========================================================================
    const vehicleGroup = new THREE.Group();
    vehicleGroup.position.y = 7;
    group.add(vehicleGroup);

    // Main Body
    const chassisGeo = new THREE.BoxGeometry(20, 6, 40);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    vehicleGroup.add(chassis);

    // Greebles & Panel Lines on Chassis
    for(let i=0; i<40; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(Math.random()*4+1, 0.2, Math.random()*4+1), steel);
        panel.position.set((Math.random()-0.5)*18, 3.1, (Math.random()-0.5)*38);
        vehicleGroup.add(panel);
    }
    
    // Extensive Hydraulic Lines
    addPiping(vehicleGroup, 60, {x: 0, y: 0, z: 0, w: 22, h: 8, d: 42});

    // Wheels
    const wheelPositions = [
        [-12, -1, 15], [12, -1, 15], 
        [-12, -1, -15], [12, -1, -15]
    ];
    wheelPositions.forEach(pos => {
        const w = createWheel(pos[0], pos[1], pos[2]);
        vehicleGroup.add(w);
    });

    // Exhaust Stacks
    for(let i=0; i<6; i++) {
        const stackGeo = new THREE.CylinderGeometry(1.2, 1.2, 8, 32);
        const stack = new THREE.Mesh(stackGeo, chrome);
        stack.position.set(-8 + i*3.2, 6, -18);
        vehicleGroup.add(stack);
        
        // Emissive Core inside stack
        const glowGeo = new THREE.CylinderGeometry(0.8, 0.8, 8.2, 16);
        const glow = new THREE.Mesh(glowGeo, brightOrange);
        glow.position.copy(stack.position);
        vehicleGroup.add(glow);
        animatedMeshes.exhaustGlows.push(glow);
    }

    // Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 6, 12);
    vehicleGroup.add(cabinGroup);
    
    const cabinGeo = new THREE.BoxGeometry(10, 8, 10);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);

    // Tinted Glass Windows
    const windowGeo = new THREE.BoxGeometry(9.6, 4, 10.2);
    const windows = new THREE.Mesh(windowGeo, tinted);
    windows.position.y = 1;
    cabinGroup.add(windows);

    // Control Screens inside cabin
    const screenGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), neonCyan);
        screen.position.set(-3 + i*3, 1, 4.8);
        screen.rotation.y = Math.PI;
        screenGroup.add(screen);
    }
    cabinGroup.add(screenGroup);

    // =========================================================================
    // ASSEMBLY: HYDRAULIC PISTONS
    // =========================================================================
    const nucleusCenterY = 32;
    const pistonPositions = [
        { x: -9, z: 10 }, { x: 9, z: 10 },
        { x: -9, z: -10 }, { x: 9, z: -10 }
    ];
    
    pistonPositions.forEach(pos => {
        const pBase = new THREE.Group();
        pBase.position.set(pos.x, 3, pos.z);
        
        const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 12, 32), darkSteel);
        outerCyl.position.y = 6;
        pBase.add(outerCyl);

        const pRod = new THREE.Group();
        pRod.position.y = 12;
        const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 15, 32), chrome);
        innerCyl.position.y = 7.5;
        pRod.add(innerCyl);
        
        pBase.add(pRod);
        
        // Pivot orientation towards nucleus center
        pBase.lookAt(0, nucleusCenterY, 0);
        pBase.rotateX(Math.PI / 2); // align cylinder up-axis with lookAt z-axis

        vehicleGroup.add(pBase);
        
        animatedMeshes.pistons.push({
            base: pBase,
            rod: pRod,
            initialDistance: 15
        });
    });

    // =========================================================================
    // ASSEMBLY: MASSIVE CYTOLOGY NUCLEUS
    // =========================================================================
    const nucleusGroup = new THREE.Group();
    nucleusGroup.position.set(0, nucleusCenterY, 0);
    group.add(nucleusGroup);

    // Nuclear Envelopes
    const outerEnvelope = new THREE.Mesh(new THREE.SphereGeometry(18, 128, 128), bioMembraneOuter);
    const innerEnvelope = new THREE.Mesh(new THREE.SphereGeometry(17.2, 128, 128), bioMembraneInner);
    nucleusGroup.add(outerEnvelope);
    nucleusGroup.add(innerEnvelope);
    animatedMeshes.envelopeOuter = outerEnvelope;
    animatedMeshes.envelopeInner = innerEnvelope;

    // Nuclear Pore Complexes (Fibonacci Sphere Distribution)
    const numPores = 350;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPores; i++) {
        const y = 1 - (i / (numPores - 1)) * 2;
        const rAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * rAtY;
        const z = Math.sin(theta) * rAtY;
        
        const pore = createNuclearPore();
        pore.position.set(x * 18.05, y * 18.05, z * 18.05);
        pore.lookAt(new THREE.Vector3(0, 0, 0));
        nucleusGroup.add(pore);
    }

    // Nucleolus (Dense Glowing Core)
    const nucleolusGroup = new THREE.Group();
    for(let i=0; i<60; i++) {
        const isoGeo = new THREE.IcosahedronGeometry(Math.random()*2.5 + 1.0, 2);
        const iso = new THREE.Mesh(isoGeo, neonPurple);
        iso.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8);
        iso.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        nucleolusGroup.add(iso);
    }
    nucleusGroup.add(nucleolusGroup);
    animatedMeshes.nucleolus = nucleolusGroup;

    // Chromatin Matrix (Complex tangled splines)
    const chromatinGroup = new THREE.Group();
    for (let c = 0; c < 25; c++) {
        const pts = [];
        let cx = (Math.random()-0.5)*12;
        let cy = (Math.random()-0.5)*12;
        let cz = (Math.random()-0.5)*12;
        for(let p = 0; p < 40; p++) {
            pts.push(new THREE.Vector3(cx, cy, cz));
            cx += (Math.random()-0.5)*5;
            cy += (Math.random()-0.5)*5;
            cz += (Math.random()-0.5)*5;
            // Constrain inside inner envelope
            const len = Math.sqrt(cx*cx + cy*cy + cz*cz);
            if (len > 16) { cx *= 16/len; cy *= 16/len; cz *= 16/len; }
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.15, 8, false);
        const mat = Math.random() > 0.5 ? neonCyan : neonPink;
        const tube = new THREE.Mesh(tubeGeo, mat);
        chromatinGroup.add(tube);
        animatedMeshes.chromatin.push(tube);
    }
    nucleusGroup.add(chromatinGroup);

    // Giant Extractable DNA Helices
    for(let i = 0; i < 4; i++) {
        const dna = createDNAStrand(30, 2.5, 4, 100);
        dna.position.set((Math.random()-0.5)*10, 0, (Math.random()-0.5)*10);
        dna.rotation.x = (Math.random()-0.5)*Math.PI;
        dna.rotation.z = (Math.random()-0.5)*Math.PI;
        nucleusGroup.add(dna);
    }

    // Floating Transcription Factors / Proteins
    const proteinsGroup = new THREE.Group();
    for(let i=0; i<150; i++) {
        const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), brightOrange);
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.random() * 15;
        const y = (Math.random()-0.5) * 30;
        mesh.position.set(Math.cos(theta)*radius, y, Math.sin(theta)*radius);
        proteinsGroup.add(mesh);
    }
    nucleusGroup.add(proteinsGroup);

    // =========================================================================
    // PARTS METADATA ARRAY
    // =========================================================================
    parts.push({
        name: "Titan_Chassis_Base",
        description: "The primary structural framework of the Cytology Transporter. Forged from hyper-dense dark steel, it houses the locomotion drives and life-support systems for the biological payload.",
        material: darkSteel,
        function: "Provides structural integrity and houses all sub-systems, engines, and hydraulic reservoirs.",
        assemblyOrder: 1,
        connections: ["All_Terrain_Traction_Wheel_FL", "All_Terrain_Traction_Wheel_FR", "Cytology_Command_Cabin"],
        failureEffect: "Complete structural collapse, leading to immediate biological payload contamination and mechanical immobilization.",
        cascadeFailures: ["Hydraulic_Support_Piston_Alpha", "Synthetic_Nuclear_Envelope"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    parts.push({
        name: "Synthetic_Nuclear_Envelope",
        description: "A dual-layer, highly advanced lipid bilayer simulation encasing the nucleoplasm. It isolates the genetic material from the external environment while maintaining structural integrity via the nuclear lamina.",
        material: bioMembraneOuter,
        function: "Protects genetic material, regulates internal pressure, and anchors the nuclear pore complexes.",
        assemblyOrder: 10,
        connections: ["Nucleoporin_Complex_Array", "Hydraulic_Support_Piston_Alpha"],
        failureEffect: "Massive decompression of the nucleoplasm, leading to chromatin unraveling and catastrophic cellular death simulation.",
        cascadeFailures: ["Chromatin_Filament_Matrix", "Nucleolus_Core"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    parts.push({
        name: "Nucleoporin_Complex_Array",
        description: "An array of 350 highly engineered nanomechanical pores embedded in the nuclear envelope. They utilize octagonal symmetries to regulate the flow of macromolecules.",
        material: chrome,
        function: "Selective gating of RNA, ribosomes, and large proteins into and out of the nucleus.",
        assemblyOrder: 11,
        connections: ["Synthetic_Nuclear_Envelope"],
        failureEffect: "Loss of selective permeability. Toxins enter the nucleus and mRNA cannot exit for translation.",
        cascadeFailures: ["Protein_Synthesis_Simulation"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 30, y: 32, z: 30 }
    });

    parts.push({
        name: "Hyper_Dense_Nucleolus",
        description: "A concentrated region of glowing neon nanostructures at the very core of the nucleus, simulating the site of ribosome biogenesis.",
        material: neonPurple,
        function: "Synthesizes ribosomal RNA (rRNA) and assembles ribosomal subunits.",
        assemblyOrder: 12,
        connections: ["Chromatin_Filament_Matrix"],
        failureEffect: "Halt in ribosome production, leading to total cessation of cellular growth capabilities.",
        cascadeFailures: ["Cellular_Metabolism_Engine"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 32, z: -40 }
    });

    parts.push({
        name: "Chromatin_Filament_Matrix",
        description: "An intricate, chaotic web of DNA tightly spooled around histone proteins, forming the complex tangled structure that fills the nucleoplasm.",
        material: neonCyan,
        function: "Efficiently packages massive amounts of DNA into a small volume while protecting the sequence and regulating gene expression.",
        assemblyOrder: 13,
        connections: ["Hyper_Dense_Nucleolus", "Double_Helix_Extractor_Core"],
        failureEffect: "DNA strand breaks and entanglement, leading to corrupted genetic readouts and simulation termination.",
        cascadeFailures: ["Double_Helix_Extractor_Core"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: -40, y: 32, z: 0 }
    });

    parts.push({
        name: "Double_Helix_Extractor_Core",
        description: "Massive, highly detailed representations of the DNA double helix. Constructed with phosphodiester backbones and distinct, colored base pairs (A-T, C-G) connected by glowing hydrogen bonds.",
        material: dnaMats.connector,
        function: "Stores the master genetic blueprint for the simulated organism.",
        assemblyOrder: 14,
        connections: ["Chromatin_Filament_Matrix"],
        failureEffect: "Irreversible genetic mutation or loss of critical coding sequences.",
        cascadeFailures: ["Simulation_Viability"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    parts.push({
        name: "All_Terrain_Traction_Wheel_FL",
        description: "A colossal, deeply treaded rubber tire mounted on a reinforced steel rim, equipped with massive hydraulic disc brakes.",
        material: rubber,
        function: "Provides heavy-duty locomotion across hostile microscopic or synthetic terrains while supporting the massive weight of the cytology payload.",
        assemblyOrder: 2,
        connections: ["Titan_Chassis_Base"],
        failureEffect: "Loss of mobility and severe chassis listing, potentially unbalancing the delicate nuclear payload.",
        cascadeFailures: ["Hydraulic_Support_Piston_Alpha"],
        originalPosition: { x: -12, y: 6, z: 15 },
        explodedPosition: { x: -30, y: 6, z: 30 }
    });

    parts.push({
        name: "All_Terrain_Traction_Wheel_FR",
        description: "Front right traction wheel, mirroring the left in specification and load-bearing capacity.",
        material: rubber,
        function: "Provides heavy-duty locomotion.",
        assemblyOrder: 3,
        connections: ["Titan_Chassis_Base"],
        failureEffect: "Loss of mobility.",
        cascadeFailures: ["Hydraulic_Support_Piston_Beta"],
        originalPosition: { x: 12, y: 6, z: 15 },
        explodedPosition: { x: 30, y: 6, z: 30 }
    });

    parts.push({
        name: "All_Terrain_Traction_Wheel_BL",
        description: "Back left traction wheel.",
        material: rubber,
        function: "Provides heavy-duty locomotion and torque transfer.",
        assemblyOrder: 4,
        connections: ["Titan_Chassis_Base"],
        failureEffect: "Loss of rear drive traction.",
        cascadeFailures: [],
        originalPosition: { x: -12, y: 6, z: -15 },
        explodedPosition: { x: -30, y: 6, z: -30 }
    });

    parts.push({
        name: "All_Terrain_Traction_Wheel_BR",
        description: "Back right traction wheel.",
        material: rubber,
        function: "Provides heavy-duty locomotion and torque transfer.",
        assemblyOrder: 5,
        connections: ["Titan_Chassis_Base"],
        failureEffect: "Loss of rear drive traction.",
        cascadeFailures: [],
        originalPosition: { x: 12, y: 6, z: -15 },
        explodedPosition: { x: 30, y: 6, z: -30 }
    });

    parts.push({
        name: "Hydraulic_Support_Piston_Alpha",
        description: "A high-pressure pneumatic cylinder utilizing complex telescopic rods to dynamically support and stabilize the nuclear payload against seismic shocks.",
        material: chrome,
        function: "Shock absorption and leveling for the Nuclear Envelope.",
        assemblyOrder: 6,
        connections: ["Titan_Chassis_Base", "Synthetic_Nuclear_Envelope"],
        failureEffect: "The nuclear envelope tilts dangerously, causing internal shearing of the chromatin matrix.",
        cascadeFailures: ["Synthetic_Nuclear_Envelope"],
        originalPosition: { x: -9, y: 15, z: 10 },
        explodedPosition: { x: -20, y: 15, z: 20 }
    });

    parts.push({
        name: "Cytology_Command_Cabin",
        description: "A reinforced steel enclosure heavily shielded with tinted, radiation-proof glass. Inside, glowing holographic interfaces monitor the DNA transcription processes.",
        material: steel,
        function: "Houses the human or AI operators navigating the synthetic cellular environment and managing nuclear extraction.",
        assemblyOrder: 7,
        connections: ["Titan_Chassis_Base"],
        failureEffect: "Loss of manual override and telemetry data.",
        cascadeFailures: ["Autopilot_Systems"],
        originalPosition: { x: 0, y: 13, z: 12 },
        explodedPosition: { x: 0, y: 25, z: 40 }
    });

    parts.push({
        name: "Cooling_Exhaust_Towers",
        description: "A bank of six towering cylindrical vents that exhaust superheated plasma gases generated by the chassis' drive train and life-support generators.",
        material: chrome,
        function: "Thermal regulation to prevent the organic payloads from denaturing due to high heat.",
        assemblyOrder: 8,
        connections: ["Titan_Chassis_Base"],
        failureEffect: "Core meltdown. The resulting heat spike immediately denatures the DNA helices and melts the nuclear envelope.",
        cascadeFailures: ["Synthetic_Nuclear_Envelope", "Double_Helix_Extractor_Core"],
        originalPosition: { x: 0, y: 13, z: -18 },
        explodedPosition: { x: 0, y: 25, z: -40 }
    });

    parts.push({
        name: "Biometric_Sensors_Array",
        description: "A network of copper hydraulic and pneumatic sensor tubes interwoven across the chassis, constantly analyzing the ambient cytoplasm.",
        material: copper,
        function: "Provides real-time environmental data to the Command Cabin.",
        assemblyOrder: 9,
        connections: ["Titan_Chassis_Base", "Cytology_Command_Cabin"],
        failureEffect: "Blind navigation through the cellular environment.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 25 }
    });

    parts.push({
        name: "Hydraulic_Support_Piston_Beta",
        description: "Front right stabilization piston.",
        material: chrome,
        function: "Shock absorption.",
        assemblyOrder: 15,
        connections: ["Titan_Chassis_Base", "Synthetic_Nuclear_Envelope"],
        failureEffect: "Payload instability.",
        cascadeFailures: [],
        originalPosition: { x: 9, y: 15, z: 10 },
        explodedPosition: { x: 20, y: 15, z: 20 }
    });


    // =========================================================================
    // QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "What is the primary function of the Nucleoporin Complex Array on the Synthetic Nuclear Envelope?",
            options: [
                "To generate kinetic energy for the chassis.",
                "To regulate the transport of macromolecules like RNA and proteins across the nuclear envelope.",
                "To synthesize ribosomes from rRNA.",
                "To provide armored protection against ballistic threats."
            ],
            correctAnswer: 1,
            explanation: "The nuclear pore complexes (nucleoporins) are essential regulatory channels that span the double-membrane of the nuclear envelope, selectively allowing RNA and proteins to pass while keeping chromatin safely inside."
        },
        {
            question: "Within the massive Nucleolus Core, what critical biological process is being simulated?",
            options: [
                "Cellular respiration and ATP generation.",
                "The synthesis of ribosomal RNA (rRNA) and assembly of ribosomal subunits.",
                "The digestion of cellular waste using hydrolytic enzymes.",
                "The packaging of proteins into vesicles for secretion."
            ],
            correctAnswer: 1,
            explanation: "The nucleolus is the largest structure in the nucleus of eukaryotic cells. It is primarily known as the site of ribosome biogenesis, where rRNA is transcribed and assembled with proteins."
        },
        {
            question: "Looking at the Double Helix Extractor Core, how do the base pairs connect across the two phosphodiester backbones?",
            options: [
                "Adenine pairs with Guanine, and Cytosine pairs with Thymine.",
                "They connect via strong covalent peptide bonds.",
                "Adenine pairs with Thymine (A-T), and Cytosine pairs with Guanine (C-G) via hydrogen bonds.",
                "They connect randomly depending on the ambient temperature."
            ],
            correctAnswer: 2,
            explanation: "In DNA, the rules of base pairing dictate that Adenine (A) always pairs with Thymine (T), and Cytosine (C) always pairs with Guanine (G). These are connected by relatively weak, but numerous, hydrogen bonds."
        },
        {
            question: "Why is the Chromatin Filament Matrix modeled as a chaotic, tangled web rather than neat structures?",
            options: [
                "To save computational rendering power.",
                "Because chromosomes only condense into neat 'X' shapes during cell division (mitosis); otherwise, they exist as a loose tangle of chromatin.",
                "Because DNA naturally repel itself into chaotic shapes.",
                "It represents a diseased cell undergoing apoptosis."
            ],
            correctAnswer: 1,
            explanation: "For the vast majority of a cell's life (interphase), DNA exists as a loose, tangled mass called chromatin. This allows enzymes access to the genes for transcription. They only tightly pack into chromosomes during cell division."
        },
        {
            question: "If the Cooling Exhaust Towers fail, why would it lead to 'denaturing' of the payload?",
            options: [
                "The heat would cause the tires to melt and stall the machine.",
                "High temperatures break the hydrogen bonds holding the DNA double helix together, causing the strands to separate (denature).",
                "Heat causes DNA to freeze and shatter.",
                "The cabin operators would abandon the mission."
            ],
            correctAnswer: 1,
            explanation: "In biology, denaturing refers to the process where proteins or nucleic acids lose their complex 3D structure due to extreme stress, such as high heat. For DNA, heat breaks the hydrogen bonds, unwinding the double helix."
        }
    ];

    // =========================================================================
    // COMPLEX ANIMATION LOOP
    // =========================================================================
    const animate = (time, speed, meshes) => {
        // 1. Wheel Rotation (tied to speed)
        animatedMeshes.wheels.forEach(wheel => {
            wheel.rotation.z -= speed * 0.1; 
        });

        // 2. Nucleus Pulsation (Breathing effect)
        const pulse = Math.sin(time * 1.5) * 1.5;
        nucleusGroup.position.y = nucleusCenterY + pulse;
        
        // Envelope Rotation
        if(animatedMeshes.envelopeOuter) {
            animatedMeshes.envelopeOuter.rotation.y = time * 0.05;
            animatedMeshes.envelopeOuter.rotation.z = Math.sin(time * 0.1) * 0.1;
        }
        if(animatedMeshes.envelopeInner) {
            animatedMeshes.envelopeInner.rotation.y = -time * 0.03;
        }

        // 3. Nucleolus Scaling
        if(animatedMeshes.nucleolus) {
            const scale = 1.0 + Math.sin(time * 3.0) * 0.15;
            animatedMeshes.nucleolus.scale.set(scale, scale, scale);
            animatedMeshes.nucleolus.rotation.y = time * 0.2;
        }

        // 4. DNA Helices Rotation
        animatedMeshes.dnaStrands.forEach((dna, index) => {
            dna.rotation.y += speed * 0.02 + 0.01;
            dna.position.y = Math.sin(time * 2.0 + index) * 2.0;
        });

        // 5. Chromatin Writhing
        animatedMeshes.chromatin.forEach((tube, index) => {
            tube.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
            tube.rotation.y = Math.cos(time * 0.4 + index) * 0.1;
        });

        // 6. Hydraulic Piston Inverse Kinematics / LookAt adjustment
        animatedMeshes.pistons.forEach((piston, index) => {
            // The base always looks at the center of the nucleus
            piston.base.lookAt(0, nucleusGroup.position.y, 0);
            piston.base.rotateX(Math.PI / 2);
            
            // Adjust rod extension based on distance
            const basePos = piston.base.position;
            const targetPos = new THREE.Vector3(0, nucleusGroup.position.y, 0);
            const dist = basePos.distanceTo(targetPos);
            // Assuming inner cylinder length is 15, we adjust its local Y position to bridge the gap
            // Base cylinder is 12 long. 
            // We just scale or move the rod to fit the visual gap
            piston.rod.position.y = (dist / 2) + Math.sin(time*2)*0.5;
        });

        // 7. Exhaust Glow pulsing
        animatedMeshes.exhaustGlows.forEach((glow, index) => {
            const intensity = 0.8 + Math.random() * 0.4;
            glow.scale.set(intensity, 1, intensity);
        });
    };

    return {
        group,
        parts,
        description: "A colossal, cybernetic Cytology Transport Unit. It carries a hyper-realistic, fully functional simulation of a cellular Nucleus, complete with double-membrane envelope, nucleoporin complexes, dense chromatin tangles, and giant extractable DNA helices. It represents the pinnacle of biomechanical engineering.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createNucleusDNA() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
