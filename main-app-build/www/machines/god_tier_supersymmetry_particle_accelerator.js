import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------
    // ADVANCED GLOWING & TECHNICAL MATERIALS
    // -------------------------------------------------------------
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 2, 
        wireframe: false,
        transparent: true,
        opacity: 0.9
    });

    const neonPurple = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0xff00ff, 
        emissiveIntensity: 4, 
        wireframe: false,
        transparent: true,
        opacity: 0.95
    });

    const intenseEnergy = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffffff, 
        emissiveIntensity: 8, 
        wireframe: false 
    });

    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, 
        emissive: 0x00ff00, 
        emissiveIntensity: 1 
    });

    // -------------------------------------------------------------
    // EXTREME GEOMETRY: TREADED OFF-ROAD TIRES (FOR TRANSPORTER)
    // -------------------------------------------------------------
    function createTreadedTire() {
        const tireGroup = new THREE.Group();
        
        // Massive main carcass
        const torusGeo = new THREE.TorusGeometry(12, 4, 32, 128);
        const tireMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(tireMesh);

        // Hundreds of tiny extruded lugs
        const lugGeo = new THREE.BoxGeometry(2, 5, 2.5);
        for (let i = 0; i < 180; i++) {
            const theta = (i / 180) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            const radius = 12;
            
            lug.position.set(
                Math.cos(theta) * radius, 
                Math.sin(theta) * radius, 
                0
            );
            lug.rotation.z = theta;
            tireGroup.add(lug);
            
            // Sub-lugs for aggressive off-road grip
            if (i % 2 === 0) {
                const miniLug = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), rubber);
                miniLug.position.set(
                    Math.cos(theta) * (radius - 0.5), 
                    Math.sin(theta) * (radius - 0.5), 
                    3
                );
                miniLug.rotation.z = theta;
                tireGroup.add(miniLug);
                
                const miniLug2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.5), rubber);
                miniLug2.position.set(
                    Math.cos(theta) * (radius - 0.5), 
                    Math.sin(theta) * (radius - 0.5), 
                    -3
                );
                miniLug2.rotation.z = theta;
                tireGroup.add(miniLug2);
            }
        }
        
        // Complex structural rims
        const rimGeo = new THREE.CylinderGeometry(9, 9, 5, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        // Intricate spoke arrays
        const spokeGeo = new THREE.CylinderGeometry(0.8, 0.8, 18, 16);
        for (let i = 0; i < 16; i++) {
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / 16) * Math.PI * 2;
            tireGroup.add(spoke);
            
            // Cross bracing
            const subSpoke = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 10, 8), steel);
            subSpoke.rotation.x = Math.PI / 2;
            subSpoke.rotation.z = (i / 16) * Math.PI * 2 + Math.PI / 32;
            subSpoke.position.set(
                Math.cos(subSpoke.rotation.z) * 5, 
                Math.sin(subSpoke.rotation.z) * 5, 
                0
            );
            tireGroup.add(subSpoke);
        }
        
        return tireGroup;
    }

    // -------------------------------------------------------------
    // EXTREME GEOMETRY: SUPERCONDUCTING DIPOLE MAGNET SECTORS
    // -------------------------------------------------------------
    function createDipoleMagnetSegment(angleStart, angleEnd, radius) {
        const segGroup = new THREE.Group();
        
        const tubePath = new THREE.Curve();
        tubePath.getPoint = function (t) {
            const angle = angleStart + t * (angleEnd - angleStart);
            return new THREE.Vector3(
                Math.cos(angle) * radius, 
                Math.sin(angle) * radius, 
                0
            );
        };
        
        const mainTubeGeo = new THREE.TubeGeometry(tubePath, 64, 6, 32, false);
        const mainTube = new THREE.Mesh(mainTubeGeo, darkSteel);
        segGroup.add(mainTube);

        // Add extreme high-tech greebling along the curve
        const steps = 40;
        for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            const angle = angleStart + t * (angleEnd - angleStart);
            const pos = new THREE.Vector3(
                Math.cos(angle) * radius, 
                Math.sin(angle) * radius, 
                0
            );
            
            // Outer cryogenic containment collar
            const collarGeo = new THREE.TorusGeometry(6.5, 0.8, 16, 64);
            const collar = new THREE.Mesh(collarGeo, steel);
            collar.position.copy(pos);
            collar.rotation.x = Math.PI / 2;
            collar.rotation.y = angle;
            segGroup.add(collar);
            
            // Liquid helium circulation pipes wrapping the segment
            for (let p = 0; p < 6; p++) {
                const pipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 8);
                const pipe = new THREE.Mesh(pipeGeo, copper);
                const pAngle = (p / 6) * Math.PI * 2;
                pipe.position.copy(pos);
                pipe.position.x += Math.cos(pAngle) * 7.5;
                pipe.position.y += Math.sin(pAngle) * 7.5;
                pipe.rotation.z = angle;
                segGroup.add(pipe);
            }
        }
        return segGroup;
    }

    // -------------------------------------------------------------
    // EXTREME GEOMETRY: CENTRAL COLLISION CHAMBER (ATLAS STYLE)
    // -------------------------------------------------------------
    function createCollisionChamber() {
        const chamber = new THREE.Group();
        
        // Inner Silicon Tracker (LatheGeometry)
        const points = [];
        for ( let i = 0; i < 60; i ++ ) { 
            points.push( new THREE.Vector2( 
                Math.sin( i * 0.1 ) * 20 + 8, 
                ( i - 30 ) * 4 
            ) ); 
        }
        const trackerGeo = new THREE.LatheGeometry( points, 128 );
        const tracker = new THREE.Mesh( trackerGeo, glass );
        chamber.add( tracker );
        
        // Electromagnetic Calorimeter (ExtrudeGeometry)
        const ecalShape = new THREE.Shape();
        ecalShape.absarc(0, 0, 30, 0, Math.PI * 2, false);
        const ecalHole = new THREE.Path();
        ecalHole.absarc(0, 0, 26, 0, Math.PI * 2, true);
        ecalShape.holes.push(ecalHole);
        const ecalGeo = new THREE.ExtrudeGeometry(ecalShape, { 
            depth: 140, 
            curveSegments: 64, 
            bevelEnabled: true 
        });
        const ecal = new THREE.Mesh(ecalGeo, copper);
        ecal.position.z = -70;
        chamber.add(ecal);

        // Hadron Calorimeter (Nested Cylinders)
        const hcalGeo = new THREE.CylinderGeometry(45, 45, 160, 64, 1, true);
        const hcal = new THREE.Mesh(hcalGeo, darkSteel);
        hcal.rotation.x = Math.PI / 2;
        chamber.add(hcal);

        // Huge Muon Spectrometer Toroids
        for (let i = -8; i <= 8; i += 2) {
            const muonGeo = new THREE.TorusGeometry(55, 5, 64, 128);
            const muon = new THREE.Mesh(muonGeo, aluminum);
            muon.position.z = i * 10;
            chamber.add(muon);
            
            // Structural struts connecting toroids
            for (let j = 0; j < 16; j++) {
                const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 15), steel);
                strut.position.z = i * 10;
                const a = j * Math.PI / 8;
                strut.position.x = Math.cos(a) * 48;
                strut.position.y = Math.sin(a) * 48;
                strut.rotation.z = a + Math.PI / 2;
                chamber.add(strut);
            }
        }
        
        return chamber;
    }

    // -------------------------------------------------------------
    // EXTREME GEOMETRY: PARTICLE SYSTEMS (BEAMS & SPARTICLES)
    // -------------------------------------------------------------
    const pCount = 8000;
    const instancedGeo = new THREE.SphereGeometry(0.8, 8, 8);
    const particleMesh = new THREE.InstancedMesh(instancedGeo, neonBlue, pCount);
    for (let i = 0; i < pCount; i++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(
            Math.random() * 100 - 50, 
            Math.random() * 100 - 50, 
            Math.random() * 100 - 50
        );
        particleMesh.setMatrixAt(i, matrix);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    group.add(particleMesh);
    meshes.beam = { count: pCount, mesh: particleMesh };

    const sCount = 800;
    const sGeo = new THREE.IcosahedronGeometry(3.5, 2);
    const sMesh = new THREE.InstancedMesh(sGeo, neonPurple, sCount);
    for (let i = 0; i < sCount; i++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(0, 0, 0); 
        matrix.scale(new THREE.Vector3(0, 0, 0));
        sMesh.setMatrixAt(i, matrix);
    }
    sMesh.instanceMatrix.needsUpdate = true;
    group.add(sMesh);
    meshes.sparticles = { count: sCount, mesh: sMesh };

    // -------------------------------------------------------------
    // ASSEMBLE THE RING (24 SUPERCONDUCTING SECTORS)
    // -------------------------------------------------------------
    const ringRadius = 800;
    for (let i = 0; i < 24; i++) {
        const startAngle = i * Math.PI / 12;
        const endAngle = (i + 1) * Math.PI / 12;
        const sector = createDipoleMagnetSegment(startAngle, endAngle, ringRadius);
        group.add(sector);
        meshes[`ringSector${i}`] = sector;
        
        parts.push({
            name: `Superconducting_Dipole_Ring_Sector_${i+1}`,
            description: `Sector ${i+1}/24 of the ultra-high vacuum beam pipe. Cooled to 1.9 K using superfluid helium. Employs Niobium-Titanium Rutherford cables to generate colossal 8.3 Tesla magnetic fields.`,
            material: 'DarkSteel/Copper',
            function: 'Provides the immense Lorentz force required to bend 14 TeV proton beams into a circular orbit.',
            assemblyOrder: i + 10,
            connections: ['Central_Collision_Chamber', 'Liquid_Helium_Distribution_Ring'],
            failureEffect: 'A magnet quench here would dump gigajoules of stored energy, instantly boiling the helium and causing a catastrophic structural explosion.',
            cascadeFailures: ['Data_Acquisition_Server_Banks'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { 
                x: Math.cos(startAngle + Math.PI/24) * 500, 
                y: Math.sin(startAngle + Math.PI/24) * 500, 
                z: -300 
            }
        });
    }

    // -------------------------------------------------------------
    // ASSEMBLE CENTRAL COLLISION CHAMBER
    // -------------------------------------------------------------
    const chamber = createCollisionChamber();
    chamber.position.set(ringRadius, 0, 0);
    group.add(chamber);
    meshes.chamber = chamber;
    
    parts.push({
        name: 'Central_Collision_Chamber',
        description: 'The monumental primary interaction point. Five stories tall and packed with tens of millions of readout channels. Designed specifically to detect missing transverse energy indicative of neutralino (LSP) escape.',
        material: 'Glass/Copper/DarkSteel',
        function: 'Collides counter-rotating proton bunches and reconstructs the resulting particle jets, muons, and photons with micrometer precision.',
        assemblyOrder: 1,
        connections: ['Superconducting_Dipole_Ring_Sector_1'],
        failureEffect: 'Catastrophic loss of vacuum. The 14 TeV beam would physically melt through the silicon trackers in milliseconds.',
        cascadeFailures: ['Sparticle_Containment_Vessel'],
        originalPosition: { x: ringRadius, y: 0, z: 0 },
        explodedPosition: { x: ringRadius, y: 250, z: 0 }
    });

    // -------------------------------------------------------------
    // ASSEMBLE MOBILE MAGNET TRANSPORTER (GANTRY CRANE)
    // -------------------------------------------------------------
    const transporter = new THREE.Group();
    
    // Extruded Chassis
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-70, -25);
    chassisShape.lineTo(70, -25);
    chassisShape.lineTo(70, 25);
    chassisShape.lineTo(-70, 25);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 120, bevelEnabled: true });
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.set(0, 0, -60);
    transporter.add(chassis);
    
    parts.push({
        name: 'Mobile_Magnet_Transporter_Chassis',
        description: 'An autonomous, radiation-hardened mega-gantry vehicle used to carefully navigate the subterranean tunnel and precisely position 35-ton magnet segments.',
        material: 'DarkSteel',
        function: 'Provides a mobile, hyper-stable platform for robotic magnet insertion.',
        assemblyOrder: 50,
        connections: ['Transporter_Treaded_Tire_FL'],
        failureEffect: 'Gantry collapse during transport, destroying the payload and blocking the main tunnel.',
        cascadeFailures: [],
        originalPosition: { x: -ringRadius, y: 0, z: -80 },
        explodedPosition: { x: -ringRadius - 300, y: 0, z: -150 }
    });

    // 8 Independent Drive Tires
    const tirePositions = [
        { x: -60, y: -40, z: -30, name: 'FL_Outer' },
        { x: -20, y: -40, z: -30, name: 'FL_Inner' },
        { x: 20, y: -40, z: -30, name: 'FR_Inner' },
        { x: 60, y: -40, z: -30, name: 'FR_Outer' },
        { x: -60, y: 40, z: -30, name: 'RL_Outer' },
        { x: -20, y: 40, z: -30, name: 'RL_Inner' },
        { x: 20, y: 40, z: -30, name: 'RR_Inner' },
        { x: 60, y: 40, z: -30, name: 'RR_Outer' }
    ];
    
    tirePositions.forEach((pos, idx) => {
        const tire = createTreadedTire();
        tire.position.set(pos.x, pos.y, pos.z);
        tire.rotation.x = Math.PI / 2;
        tire.rotation.y = Math.PI / 2;
        transporter.add(tire);
        meshes[`transporterTire${idx}`] = tire;
        
        parts.push({
            name: `Transporter_Treaded_Tire_${pos.name}`,
            description: `Massive pneumatic off-road tire with extreme lug patterns. Driven by independent electric hub motors for omnidirectional crabbing.`,
            material: 'Rubber/Chrome',
            function: 'Mobility, suspension, and precise positioning over uneven tunnel floors.',
            assemblyOrder: 51 + idx,
            connections: ['Mobile_Magnet_Transporter_Chassis'],
            failureEffect: 'Vehicle lists dangerously; payload positioning precision drops below acceptable margins.',
            cascadeFailures: [],
            originalPosition: { x: -ringRadius + pos.x, y: pos.y, z: -80 + pos.z },
            explodedPosition: { x: -ringRadius - 300 + pos.x*2, y: pos.y*2, z: -150 + pos.z*2 }
        });
    });

    // Twin Hydraulic Lifting Pistons
    const pistonL = new THREE.Group();
    const pb1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 60, 32), steel);
    pb1.position.set(-40, 0, 30);
    pb1.rotation.x = Math.PI / 2;
    pistonL.add(pb1);
    const pa1 = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 80, 32), chrome);
    pa1.position.set(-40, 0, 70);
    pa1.rotation.x = Math.PI / 2;
    pistonL.add(pa1);
    transporter.add(pistonL);
    meshes.pistonL = pa1;

    const pistonR = new THREE.Group();
    const pb2 = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 60, 32), steel);
    pb2.position.set(40, 0, 30);
    pb2.rotation.x = Math.PI / 2;
    pistonR.add(pb2);
    const pa2 = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 80, 32), chrome);
    pa2.position.set(40, 0, 70);
    pa2.rotation.x = Math.PI / 2;
    pistonR.add(pa2);
    transporter.add(pistonR);
    meshes.pistonR = pa2;

    parts.push({
        name: 'Twin_Hydraulic_Lifting_Rams',
        description: 'Multi-stage telescopic hydraulic rams operating at 50,000 PSI.',
        material: 'Chrome/Steel',
        function: 'Elevates the dipole magnets precisely into the ring assembly path.',
        assemblyOrder: 60,
        connections: ['Mobile_Magnet_Transporter_Chassis'],
        failureEffect: 'Sudden depressurization leads to dropped payload.',
        cascadeFailures: [],
        originalPosition: { x: -ringRadius, y: 0, z: 20 },
        explodedPosition: { x: -ringRadius - 300, y: 0, z: 200 }
    });
    
    transporter.position.set(-ringRadius, 0, -80);
    group.add(transporter);

    // -------------------------------------------------------------
    // ASSEMBLE CRYOGENIC COOLING PLANT
    // -------------------------------------------------------------
    const cryoShape = new THREE.Shape();
    cryoShape.absarc(0, 0, 50, 0, Math.PI * 2, false);
    const cryoGeo = new THREE.ExtrudeGeometry(cryoShape, { depth: 150, curveSegments: 128 });
    const cryo = new THREE.Mesh(cryoGeo, aluminum);
    cryo.position.set(0, -ringRadius - 200, -80);
    group.add(cryo);
    
    parts.push({
        name: 'Cryogenic_Cooling_System_Main_Plant',
        description: 'A sprawling industrial refrigeration facility containing multi-stage compressors, heat exchangers, and expansion turbines. Generates rivers of superfluid helium (He-II).',
        material: 'Aluminum',
        function: 'Brings the entire 27km ring down to 1.9 Kelvin, unlocking macroscopic quantum states and superconductivity.',
        assemblyOrder: 5,
        connections: ['Superconducting_Dipole_Ring_Sector_12'],
        failureEffect: 'Warming of the ring above the critical temperature, causing immediate and violent loss of superconductivity.',
        cascadeFailures: ['Superconducting_Dipole_Ring_Sector_1'],
        originalPosition: { x: 0, y: -ringRadius - 200, z: -80 },
        explodedPosition: { x: 0, y: -ringRadius - 500, z: -150 }
    });

    // -------------------------------------------------------------
    // ASSEMBLE DAQ SERVER BANKS
    // -------------------------------------------------------------
    const serverGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
        const srv = new THREE.Mesh(new THREE.BoxGeometry(15, 60, 30), plastic);
        const radiusSrv = 120;
        srv.position.set(
            Math.cos(i / 40 * Math.PI * 2) * radiusSrv, 
            Math.sin(i / 40 * Math.PI * 2) * radiusSrv, 
            0
        );
        
        // Add flickering diagnostic lights
        for (let j = 0; j < 6; j++) {
            const light = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), neonRed);
            light.position.set(7.6, -20 + j * 8, 0);
            srv.add(light);
        }
        serverGroup.add(srv);
    }
    serverGroup.position.set(ringRadius, 0, 150);
    group.add(serverGroup);
    meshes.servers = serverGroup;
    
    parts.push({
        name: 'Level_1_Trigger_and_DAQ_Server_Farm',
        description: 'A circular array of hyper-dense server racks utilizing advanced FPGAs and custom ASICs. Evaluates 40 million collision events per second and decides within microseconds which ones to save to tape.',
        material: 'Plastic/Glass',
        function: 'Filters overwhelming raw collision data to isolate ultra-rare signatures of sparticle production.',
        assemblyOrder: 70,
        connections: ['Central_Collision_Chamber'],
        failureEffect: 'Data pipeline buffer overflow. Irrecoverable loss of potential Nobel-prize-winning collision events.',
        cascadeFailures: [],
        originalPosition: { x: ringRadius, y: 0, z: 150 },
        explodedPosition: { x: ringRadius + 200, y: 0, z: 400 }
    });

    // -------------------------------------------------------------
    // EXTREME GREEBLING (HUNDREDS OF SMALL DETAILS)
    // -------------------------------------------------------------
    const greebleGroup = new THREE.Group();
    for (let i = 0; i < 600; i++) {
        const type = Math.random();
        let gMesh;
        if (type < 0.4) {
            gMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), darkSteel);
        } else if (type < 0.7) {
            gMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 16), copper);
        } else {
            gMesh = new THREE.Mesh(new THREE.TorusGeometry(3, 1, 16, 16), steel);
        }
        
        const angle = Math.random() * Math.PI * 2;
        const r = ringRadius + (Math.random() * 60 - 30);
        gMesh.position.set(
            Math.cos(angle) * r, 
            Math.sin(angle) * r, 
            (Math.random() * 80 - 40)
        );
        gMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        greebleGroup.add(gMesh);
    }
    group.add(greebleGroup);

    // -------------------------------------------------------------
    // METADATA & DESCRIPTION
    // -------------------------------------------------------------
    const description = "The Ultra God Tier Supersymmetry Particle Accelerator. A monumental feat of hyper-engineering designed to probe the deepest structures of the universe at staggering 100 TeV center-of-mass energies. By utilizing 8.3 Tesla superconducting dipole magnets cooled to 1.9K with superfluid helium, it maintains incredibly tight proton bunches. Its primary directive is the absolute proof of supersymmetry (SUSY) via the production and containment of heavy supersymmetric partner particles (sparticles) such as squarks, gluinos, selectrons, and the elusive neutralino (the leading candidate for cold Dark Matter). Every element is modeled with insane fidelity, from the complex silicon tracking detectors inside the ATLAS-like collision chamber, to the aggressive off-road treads of the massive robotic gantry used for magnet insertion.";

    const quizQuestions = [
        {
            question: "What is the fundamental mechanism by which R-parity conservation ensures the stability of the Lightest Supersymmetric Particle (LSP)?",
            options: [
                "It assigns R-parity +1 to all SM particles and -1 to all sparticles, making the decay of the LSP into SM particles kinematically and quantum-mechanically forbidden.",
                "It introduces a new unbroken gauge symmetry U(1)_R that strongly couples only to the dark sector.",
                "It mandates that the LSP must be a fermion, preventing decay without violating angular momentum.",
                "It restricts the LSP to decay via virtual black holes, extending its lifetime beyond the age of the universe."
            ],
            correctAnswer: 0,
            explanation: "R-parity is defined as P_R = (-1)^(3B + L + 2s). Standard Model particles have P_R = +1, while SUSY particles have P_R = -1. If R-parity is exactly conserved, any interaction vertex must involve an even number of sparticles. Thus, the lightest sparticle (LSP) cannot decay solely into Standard Model particles."
        },
        {
            question: "In the Minimal Supersymmetric Standard Model (MSSM), how many Higgs doublets are required to prevent gauge anomalies and give mass to all fermions?",
            options: [
                "One doublet, exactly as in the Standard Model.",
                "Two doublets with opposite hypercharge (Y = +1/2 and Y = -1/2).",
                "Three doublets, corresponding to the three fermion generations.",
                "An infinite tower of doublets resulting from Kaluza-Klein reduction."
            ],
            correctAnswer: 1,
            explanation: "The MSSM requires two Higgs doublets. H_u (Y=+1/2) gives mass to up-type quarks, and H_d (Y=-1/2) gives mass to down-type quarks and charged leptons. Two doublets are mathematically necessary to cancel gauge anomalies introduced by their fermionic partners (higgsinos)."
        },
        {
            question: "Which soft supersymmetry-breaking parameter primarily determines the mass splitting between the top quark and the scalar top (stop) squarks?",
            options: [
                "The universal gaugino mass (m_1/2).",
                "The trilinear scalar coupling term (A_t) and the soft scalar mass parameters.",
                "The bilinear higgsino mixing parameter (μ).",
                "The gravitino mass parameter (m_3/2)."
            ],
            correctAnswer: 1,
            explanation: "The mass splitting in the stop sector is dominated by the soft SUSY-breaking scalar masses and the large trilinear A-term for the top quark (A_t). The off-diagonal element of the stop mass matrix is proportional to m_t(A_t - μ cot β), leading to massive mixing and potentially a very light stop_1 state."
        },
        {
            question: "How does the gauge coupling unification scale behave when incorporating the MSSM particle spectrum, as compared to the Standard Model?",
            options: [
                "The couplings diverge rapidly due to the new heavy degrees of freedom.",
                "The couplings unify perfectly at the Planck scale (1.2 x 10^19 GeV).",
                "The couplings unify precisely at approximately 2 x 10^16 GeV, unlike in the SM where they narrowly miss each other.",
                "Unification is forced down to the TeV scale by large extra dimensions."
            ],
            correctAnswer: 2,
            explanation: "In the Standard Model, the renormalization group evolution of the three gauge couplings (strong, weak, electromagnetic) brings them close, but they do not intersect at a single point. Adding the MSSM particle content alters the beta functions such that the three couplings unify remarkably well at ~2 x 10^16 GeV, a major theoretical motivation for SUSY."
        },
        {
            question: "In the context of gauge-mediated supersymmetry breaking (GMSB), what is the typical nature of the gravitino, and how does its mass relate to the SUSY breaking scale?",
            options: [
                "The gravitino is extremely heavy (near Planck mass) and decouples.",
                "The gravitino is the LSP, and its mass is m_3/2 = F / (sqrt(3) M_Pl), typically making it very light (eV to GeV range).",
                "The gravitino perfectly degenerates with the photino to form a massless dark photon.",
                "The gravitino becomes a tachyonic field, destabilizing the vacuum."
            ],
            correctAnswer: 1,
            explanation: "In GMSB models, supersymmetry breaking occurs at a relatively low scale (sqrt(F) ~ 10^4 - 10^5 GeV). Because the gravitino mass is given by m_3/2 = F / (sqrt(3) M_Pl), a low F implies an extremely light gravitino. It is almost always the LSP, meaning the Next-to-Lightest Supersymmetric Particle (NLSP) will decay into it."
        }
    ];

    // -------------------------------------------------------------
    // EXTREME ANIMATION LOGIC
    // -------------------------------------------------------------
    function animate(time, speed, activeMeshes, exploded) {
        // Animate high-energy proton beams racing around the ring
        if (activeMeshes.beam) {
            const b = activeMeshes.beam;
            const bCount = b.count;
            const dummy = new THREE.Object3D();
            
            for (let i = 0; i < bCount; i++) {
                // High-speed orbital mechanics
                const t = (time * speed * 4 + (i / bCount) * Math.PI * 2) % (Math.PI * 2);
                
                // Two beams: clockwise and counter-clockwise
                const dir = (i % 2 === 0) ? 1 : -1;
                const angle = dir * t;
                
                // Slight beam oscillation (betatron oscillations)
                const r = ringRadius + Math.sin(time * speed * 8 + i) * 6; 
                
                dummy.position.set(
                    Math.cos(angle) * r, 
                    Math.sin(angle) * r, 
                    Math.cos(time * speed * 12 + i) * 4
                );
                dummy.updateMatrix();
                b.mesh.setMatrixAt(i, dummy.matrix);
            }
            b.mesh.instanceMatrix.needsUpdate = true;
        }

        // Animate sparticle production and decay in the collision chamber
        if (activeMeshes.sparticles) {
            const s = activeMeshes.sparticles;
            const sCount = s.count;
            const dummy = new THREE.Object3D();
            const cycleTime = 1.5; // New collision every 1.5 seconds
            const localTime = (time * speed) % cycleTime;
            
            // Extreme energy flash during collision moment
            if (localTime < 0.1) {
                activeMeshes.chamber.children.forEach(c => {
                    if (c.material && c.material === glass) {
                        c.material.emissive = new THREE.Color(0xffffff);
                        c.material.emissiveIntensity = 10;
                    }
                });
            } else {
                activeMeshes.chamber.children.forEach(c => {
                    if (c.material && c.material === glass) {
                        c.material.emissiveIntensity = Math.max(0, c.material.emissiveIntensity * 0.9);
                    }
                });
            }

            for (let i = 0; i < sCount; i++) {
                // Spherical distribution radiating outwards
                const phi = Math.acos( -1 + ( 2 * i ) / sCount );
                const theta = Math.sqrt( sCount * Math.PI ) * phi;
                
                // Heavy sparticles move slower
                const dist = localTime * 150; 
                dummy.position.setFromSphericalCoords(dist, phi, theta);
                
                // Shift position to the collision chamber origin
                dummy.position.x += ringRadius;
                
                // Scale up then decay/fade away as they interact with calorimeters
                const sc = Math.max(0, Math.sin((localTime / cycleTime) * Math.PI)) * 5;
                dummy.scale.set(sc, sc, sc);
                
                // Spin erratically
                dummy.rotation.set(
                    time * speed * 2 + i, 
                    time * speed * 3 - i, 
                    time * speed
                );
                dummy.updateMatrix();
                s.mesh.setMatrixAt(i, dummy.matrix);
            }
            s.mesh.instanceMatrix.needsUpdate = true;
        }

        // Animate the robotic transporter gantry
        if (!exploded) {
            // Traverse the tunnel
            const tr = activeMeshes.transporterChassis.parent;
            tr.position.y = Math.sin(time * speed * 0.1) * 300;
            
            // Rotate all 8 massive tires
            const tireRot = (time * speed * 0.1) * 3;
            for (let i = 0; i < 8; i++) {
                if (activeMeshes[`transporterTire${i}`]) {
                    activeMeshes[`transporterTire${i}`].rotation.y = tireRot;
                }
            }
            
            // Hydraulic pistons actively adjusting magnet level
            if (activeMeshes.pistonL && activeMeshes.pistonR) {
                const extension = 70 + Math.sin(time * speed * 2) * 20;
                activeMeshes.pistonL.position.z = extension;
                activeMeshes.pistonR.position.z = extension;
            }
        }
        
        // Flickering DAQ Servers processing the insane data throughput
        if (activeMeshes.servers) {
            activeMeshes.servers.children.forEach(srv => {
                srv.children.forEach(light => {
                    // Hyperactive blinking
                    light.material.emissiveIntensity = Math.random() > 0.85 ? 6 : 0;
                });
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
