import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = 'Kardashev_Type_III_Galaxy_Core';

    const parts = [];
    const updatables = [];

    // ==========================================
    // 1. CUSTOM HIGH-TECH EMISSIVE MATERIALS
    // ==========================================
    const matEventHorizon = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const matErgosphere = new THREE.MeshStandardMaterial({ color: 0x110033, emissive: 0x220066, emissiveIntensity: 2.0, transparent: true, opacity: 0.3, wireframe: true });
    const matAccretionHot = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffaa00, emissiveIntensity: 5.0, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const matAccretionCold = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff1100, emissiveIntensity: 2.0, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const matJet = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 6.0, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const matDataStream = new THREE.PointsMaterial({ color: 0x00ffcc, size: 4.0, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const matNeonScreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 3.0 });
    const matWarningLight = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0 });

    // ==========================================
    // 2. PROCEDURAL GEOMETRY GENERATORS
    // ==========================================

    function createGargantuanTire() {
        const tireGroup = new THREE.Group();
        
        // Complex Rim (CylinderGeometry with spoke arrays)
        const rimGeo = new THREE.CylinderGeometry(400, 400, 250, 64);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);

        // Inner Hub
        const hubGeo = new THREE.CylinderGeometry(100, 100, 270, 32);
        const hubMesh = new THREE.Mesh(hubGeo, darkSteel);
        hubMesh.rotation.x = Math.PI / 2;
        tireGroup.add(hubMesh);

        // Spokes
        const spokeGeo = new THREE.CylinderGeometry(15, 15, 400, 16);
        for(let i = 0; i < 24; i++) {
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (Math.PI * 2 / 24) * i;
            tireGroup.add(spoke);
        }

        // Tire Body (TorusGeometry)
        const tireBodyGeo = new THREE.TorusGeometry(600, 180, 64, 128);
        const tireBody = new THREE.Mesh(tireBodyGeo, rubber);
        tireGroup.add(tireBody);

        // Aggressive Off-Road Treads (Hundreds of tiny extruded BoxGeometry lugs)
        const lugGeo = new THREE.BoxGeometry(140, 50, 260);
        for(let i = 0; i < 128; i++) {
            const angle = (Math.PI * 2 / 128) * i;
            
            // Left row of lugs
            const lug1 = new THREE.Mesh(lugGeo, rubber);
            lug1.position.set(Math.cos(angle) * 760, Math.sin(angle) * 760, 70);
            lug1.rotation.z = angle;
            lug1.rotation.y = Math.PI / 6;
            tireGroup.add(lug1);
            
            // Right row of lugs
            const lug2 = new THREE.Mesh(lugGeo, rubber);
            lug2.position.set(Math.cos(angle) * 760, Math.sin(angle) * 760, -70);
            lug2.rotation.z = angle;
            lug2.rotation.y = -Math.PI / 6;
            tireGroup.add(lug2);
        }

        // Rivets on the rim
        const rivetGeo = new THREE.SphereGeometry(10, 16, 16);
        for(let i = 0; i < 32; i++) {
            const angle = (Math.PI * 2 / 32) * i;
            const rivet = new THREE.Mesh(rivetGeo, darkSteel);
            rivet.position.set(Math.cos(angle) * 380, Math.sin(angle) * 380, 130);
            tireGroup.add(rivet);
            const rivet2 = new THREE.Mesh(rivetGeo, darkSteel);
            rivet2.position.set(Math.cos(angle) * 380, Math.sin(angle) * 380, -130);
            tireGroup.add(rivet2);
        }

        return tireGroup;
    }

    function createHydraulicPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer Cylinder (Housing)
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outerMesh = new THREE.Mesh(outerGeo, darkSteel);
        outerMesh.position.y = length * 0.3;
        pistonGroup.add(outerMesh);

        // Inner Cylinder (Shaft)
        const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length, 32);
        const innerMesh = new THREE.Mesh(innerGeo, chrome);
        innerMesh.position.y = length * 0.5;
        pistonGroup.add(innerMesh);

        // Hydraulic Fluid Lines (TubeGeometry wrapping around)
        class HydraulicCurve extends THREE.Curve {
            constructor(scale, loops) {
                super();
                this.scale = scale;
                this.loops = loops;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const y = t * this.scale * 0.6;
                const angle = t * Math.PI * 2 * this.loops;
                const x = Math.cos(angle) * (radius * 1.2);
                const z = Math.sin(angle) * (radius * 1.2);
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new HydraulicCurve(length, 3);
        const tubeGeo = new THREE.TubeGeometry(path, 64, radius * 0.15, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
        pistonGroup.add(tubeMesh);

        // Piston Head
        const headGeo = new THREE.CylinderGeometry(radius * 1.1, radius * 1.1, radius * 0.5, 32);
        const headMesh = new THREE.Mesh(headGeo, steel);
        headMesh.position.y = length;
        pistonGroup.add(headMesh);

        return { group: pistonGroup, shaft: innerMesh, head: headMesh, maxLen: length };
    }

    function createOperatorCabin() {
        const cabGroup = new THREE.Group();
        
        // Base / Floor
        const floorGeo = new THREE.BoxGeometry(400, 20, 400);
        const floorMesh = new THREE.Mesh(floorGeo, darkSteel);
        cabGroup.add(floorMesh);

        // Walls and Roof Frame
        const frameGeo = new THREE.BoxGeometry(400, 300, 400);
        const frameEdges = new THREE.EdgesGeometry(frameGeo);
        const frameMesh = new THREE.LineSegments(frameEdges, new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 }));
        frameMesh.position.y = 150;
        cabGroup.add(frameMesh);

        // Tinted Glass Windows
        const glassGeo = new THREE.BoxGeometry(380, 280, 380);
        const glassMesh = new THREE.Mesh(glassGeo, tinted);
        glassMesh.position.y = 150;
        cabGroup.add(glassMesh);

        // Internal Control Panel
        const panelGeo = new THREE.BoxGeometry(360, 80, 100);
        const panelMesh = new THREE.Mesh(panelGeo, plastic);
        panelMesh.position.set(0, 60, -120);
        panelMesh.rotation.x = Math.PI / 6;
        cabGroup.add(panelMesh);

        // Glowing Screens on Panel
        const screenGeo = new THREE.PlaneGeometry(80, 50);
        for(let i = -1; i <= 1; i++) {
            const screen = new THREE.Mesh(screenGeo, matNeonScreen);
            screen.position.set(i * 100, 80, -100);
            screen.rotation.x = Math.PI / 6;
            cabGroup.add(screen);
        }

        // Steering Wheel (Chrome Torus)
        const wheelGeo = new THREE.TorusGeometry(30, 4, 16, 32);
        const wheelMesh = new THREE.Mesh(wheelGeo, chrome);
        wheelMesh.position.set(0, 120, -60);
        wheelMesh.rotation.x = -Math.PI / 4;
        
        // Wheel Spokes
        const wSpokeGeo = new THREE.CylinderGeometry(2, 2, 60, 8);
        const wSpoke1 = new THREE.Mesh(wSpokeGeo, chrome);
        wheelMesh.add(wSpoke1);
        const wSpoke2 = new THREE.Mesh(wSpokeGeo, chrome);
        wSpoke2.rotation.z = Math.PI / 2;
        wheelMesh.add(wSpoke2);
        cabGroup.add(wheelMesh);

        // Joysticks (Cylinder + Sphere)
        for(let i of [-1, 1]) {
            const joyStickGeo = new THREE.CylinderGeometry(3, 3, 40, 16);
            const joyStick = new THREE.Mesh(joyStickGeo, steel);
            joyStick.position.set(i * 150, 110, -80);
            joyStick.rotation.x = Math.PI / 8;
            
            const joyKnobGeo = new THREE.SphereGeometry(10, 16, 16);
            const joyKnob = new THREE.Mesh(joyKnobGeo, plastic);
            joyKnob.position.y = 20;
            joyStick.add(joyKnob);
            
            cabGroup.add(joyStick);
            
            // Animate joysticks
            updatables.push((t) => {
                joyStick.rotation.x = Math.PI / 8 + Math.sin(t * 3 + i) * 0.2;
                joyStick.rotation.z = Math.cos(t * 2 + i) * 0.2;
            });
        }

        // Access Ladder
        const ladderGroup = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(3, 3, 500, 8);
        const railL = new THREE.Mesh(railGeo, steel);
        railL.position.set(-30, -250, 210);
        const railR = new THREE.Mesh(railGeo, steel);
        railR.position.set(30, -250, 210);
        ladderGroup.add(railL);
        ladderGroup.add(railR);
        
        const rungGeo = new THREE.CylinderGeometry(2, 2, 60, 8);
        for(let i = 0; i < 20; i++) {
            const rung = new THREE.Mesh(rungGeo, steel);
            rung.position.set(0, -480 + i * 25, 210);
            rung.rotation.z = Math.PI / 2;
            ladderGroup.add(rung);
        }
        cabGroup.add(ladderGroup);

        updatables.push((t) => {
            wheelMesh.rotation.z = Math.sin(t) * Math.PI;
        });

        return cabGroup;
    }

    // ==========================================
    // 3. CORE CONSTRUCTION (BLACK HOLE ENGINE)
    // ==========================================

    const engineBlock = new THREE.Group();
    group.add(engineBlock);

    // Singularity Combustion Chamber
    const singularityGeo = new THREE.SphereGeometry(300, 64, 64);
    const singularityMesh = new THREE.Mesh(singularityGeo, matEventHorizon);
    engineBlock.add(singularityMesh);

    // Ergosphere Housing
    const ergosphereGeo = new THREE.SphereGeometry(500, 64, 64);
    const ergosphereMesh = new THREE.Mesh(ergosphereGeo, matErgosphere);
    engineBlock.add(ergosphereMesh);
    updatables.push((t) => {
        ergosphereMesh.rotation.y = t * 0.5;
        ergosphereMesh.scale.set(1 + Math.sin(t*3)*0.02, 0.9, 1 + Math.cos(t*3)*0.02);
    });

    // Accretion Disk (Mechanical Plasma Generator)
    const diskGroup = new THREE.Group();
    for(let layer = 0; layer < 15; layer++) {
        let radius = 600 + layer * 150;
        let tube = 40 + Math.random() * 20;
        let geom = new THREE.TorusGeometry(radius, tube, 32, 128);
        
        // Distort vertices to simulate turbulence
        let pos = geom.attributes.position;
        let v = new THREE.Vector3();
        for(let i=0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            let noise = Math.sin(v.x * 0.01) * Math.cos(v.z * 0.01) * Math.sin(v.y * 0.05) * 40;
            v.add(v.clone().normalize().multiplyScalar(noise));
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        geom.computeVertexNormals();

        let mat = layer < 5 ? matAccretionHot : matAccretionCold;
        let mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.x = Math.PI / 2 + (Math.random()-0.5)*0.05;
        
        let speed = 0.5 - layer * 0.02;
        updatables.push((t) => {
            mesh.rotation.z = t * speed;
            mesh.position.y = Math.sin(t * 2 + layer) * 20;
        });
        diskGroup.add(mesh);
    }
    engineBlock.add(diskGroup);

    // Exhaust Stacks (Relativistic Jets)
    const exhaustGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(150, 150, 2000, 32);
    const stackNorth = new THREE.Mesh(stackGeo, chrome);
    stackNorth.position.y = 1500;
    const stackSouth = new THREE.Mesh(stackGeo, chrome);
    stackSouth.position.y = -1500;
    
    // Panel lines on stacks
    const stackRings = new THREE.CylinderGeometry(160, 160, 20, 32);
    for(let i=0; i<10; i++) {
        const ring1 = new THREE.Mesh(stackRings, darkSteel);
        ring1.position.y = 600 + i * 200;
        stackNorth.add(ring1);
        
        const ring2 = new THREE.Mesh(stackRings, darkSteel);
        ring2.position.y = -600 - i * 200;
        stackSouth.add(ring2);
    }
    exhaustGroup.add(stackNorth);
    exhaustGroup.add(stackSouth);

    // Jet Plume Streams
    const plumeGeo = new THREE.CylinderGeometry(130, 400, 4000, 32, 1, true);
    const plumeNorth = new THREE.Mesh(plumeGeo, matJet);
    plumeNorth.position.y = 4000;
    const plumeSouth = new THREE.Mesh(plumeGeo, matJet);
    plumeSouth.position.y = -4000;
    plumeSouth.rotation.x = Math.PI;
    exhaustGroup.add(plumeNorth);
    exhaustGroup.add(plumeSouth);
    
    updatables.push((t) => {
        plumeNorth.scale.x = 1 + Math.sin(t * 15) * 0.2;
        plumeNorth.scale.z = 1 + Math.sin(t * 15) * 0.2;
        plumeSouth.scale.x = 1 + Math.cos(t * 15) * 0.2;
        plumeSouth.scale.z = 1 + Math.cos(t * 15) * 0.2;
    });
    engineBlock.add(exhaustGroup);

    // ==========================================
    // 4. MECH-CHASSIS & AXLES
    // ==========================================

    const chassis = new THREE.Group();
    group.add(chassis);

    // Main girders
    const girderGeo = new THREE.BoxGeometry(4000, 200, 400);
    const girder1 = new THREE.Mesh(girderGeo, darkSteel);
    girder1.position.set(0, 0, 1500);
    const girder2 = new THREE.Mesh(girderGeo, darkSteel);
    girder2.position.set(0, 0, -1500);
    const crossGirder = new THREE.BoxGeometry(400, 200, 3000);
    const girder3 = new THREE.Mesh(crossGirder, darkSteel);
    girder3.position.set(1800, 0, 0);
    const girder4 = new THREE.Mesh(crossGirder, darkSteel);
    girder4.position.set(-1800, 0, 0);
    chassis.add(girder1, girder2, girder3, girder4);

    // Axles
    const axleGeo = new THREE.CylinderGeometry(150, 150, 4000, 32);
    const axleF = new THREE.Mesh(axleGeo, steel);
    axleF.rotation.z = Math.PI / 2;
    axleF.position.set(0, 0, 1500);
    const axleR = new THREE.Mesh(axleGeo, steel);
    axleR.rotation.z = Math.PI / 2;
    axleR.position.set(0, 0, -1500);
    chassis.add(axleF, axleR);

    // Mount Tires
    const tires = [];
    const tirePositions = [
        {x: 2000, y: 0, z: 1500},
        {x: -2000, y: 0, z: 1500},
        {x: 2000, y: 0, z: -1500},
        {x: -2000, y: 0, z: -1500}
    ];
    
    tirePositions.forEach((pos, idx) => {
        const tire = createGargantuanTire();
        tire.position.set(pos.x, pos.y, pos.z);
        if (pos.x < 0) tire.rotation.y = Math.PI; // flip left side tires
        chassis.add(tire);
        tires.push({mesh: tire, side: pos.x > 0 ? 1 : -1});
    });

    updatables.push((t) => {
        tires.forEach(tData => {
            // Roll the tires
            tData.mesh.rotation.x = t * 2 * tData.side;
        });
    });

    // ==========================================
    // 5. HYDRAULIC BOOM ARMS (Penrose Siphons)
    // ==========================================

    const booms = [];
    for(let i=0; i<8; i++) {
        const boomGroup = new THREE.Group();
        const angle = (Math.PI * 2 / 8) * i;
        
        // Base mount on chassis
        boomGroup.position.set(Math.cos(angle)*1200, 200, Math.sin(angle)*1200);
        boomGroup.rotation.y = -angle;

        // Piston assembly
        const pistonData = createHydraulicPiston(800, 60);
        pistonData.group.rotation.x = Math.PI / 4; 
        boomGroup.add(pistonData.group);

        // Siphon Head (Extracts energy)
        const siphonGeo = new THREE.BoxGeometry(200, 200, 200);
        const siphonMesh = new THREE.Mesh(siphonGeo, copper);
        siphonMesh.position.y = 800; // Attached to piston head
        pistonData.group.add(siphonMesh);
        
        // Glowing intake grille
        const grilleGeo = new THREE.PlaneGeometry(180, 180);
        const grille = new THREE.Mesh(grilleGeo, matNeonScreen);
        grille.position.set(0, 0, 101);
        siphonMesh.add(grille);

        chassis.add(boomGroup);
        booms.push({group: pistonData.group, shaft: pistonData.shaft, head: pistonData.head, phase: i});
    }

    updatables.push((t) => {
        booms.forEach(b => {
            // Articulate the boom angle
            b.group.rotation.x = Math.PI / 4 + Math.sin(t * 2 + b.phase) * 0.2;
            
            // Extend/Retract the piston shaft
            const ext = Math.sin(t * 4 + b.phase) * 200;
            b.shaft.scale.y = (800 + ext) / 800;
            b.shaft.position.y = (800 + ext) / 2;
            b.head.position.y = 800 + ext;
        });
    });

    // ==========================================
    // 6. OPERATOR CABIN
    // ==========================================

    const cabin = createOperatorCabin();
    cabin.position.set(0, 2500, 0); // High up above the black hole engine
    group.add(cabin);

    // ==========================================
    // 7. GALACTIC DATA STREAMS
    // ==========================================

    const streamCount = 20000;
    const streamGeo = new THREE.BufferGeometry();
    const streamPos = new Float32Array(streamCount * 3);
    const streamParams = [];
    for(let i = 0; i < streamCount; i++) {
        let r = 3000 + Math.random() * 5000;
        let theta = Math.random() * Math.PI * 2;
        let y = (Math.random() - 0.5) * 1000;
        streamPos[i*3] = Math.cos(theta) * r;
        streamPos[i*3+1] = y;
        streamPos[i*3+2] = Math.sin(theta) * r;
        streamParams.push({
            angle: theta,
            radius: r,
            yOff: y,
            speed: 0.01 + Math.random() * 0.03
        });
    }
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
    const dataStreamMesh = new THREE.Points(streamGeo, matDataStream);
    group.add(dataStreamMesh);

    updatables.push((t) => {
        let positions = dataStreamMesh.geometry.attributes.position.array;
        for(let i = 0; i < streamCount; i++) {
            let sp = streamParams[i];
            sp.angle += sp.speed;
            sp.radius -= sp.speed * 50; // Suck into engine
            if (sp.radius < 500) {
                sp.radius = 8000; // Respawn far away
                sp.yOff = (Math.random() - 0.5) * 1000;
            }
            positions[i*3] = Math.cos(sp.angle) * sp.radius;
            positions[i*3+1] = sp.yOff + Math.sin(t * 5 + i) * 100; // wavy
            positions[i*3+2] = Math.sin(sp.angle) * sp.radius;
        }
        dataStreamMesh.geometry.attributes.position.needsUpdate = true;
    });

    // ==========================================
    // 8. PARTS ARRAY (Highly Detailed)
    // ==========================================
    
    parts.push({
        name: "Singularity Combustion Chamber",
        description: "The core of the engine, containing a maximally rotating Kerr black hole. Metric engineering forces the singularity to act as a cosmic cylinder block.",
        material: "Event Horizon Boundary",
        function: "Main Power Source",
        assemblyOrder: 1,
        connections: ["Ergosphere Housing", "Exhaust Stacks"],
        failureEffect: "Engine block cracks, leaking raw gravity and spaghettifying the operator cabin.",
        cascadeFailures: ["Galactic collapse", "Timeline fracture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10000, z: 0 }
    });

    parts.push({
        name: "Gargantuan Off-Road Tire (Front Left)",
        description: "A rubberized torus the size of a solar system, equipped with hundreds of extruded traction lugs to grip the very fabric of spacetime or physical orbital rings.",
        material: "Hyper-Rubber & Steel",
        function: "Cosmic Locomotion",
        assemblyOrder: 2,
        connections: ["Front Axle"],
        failureEffect: "Blowout causing the megastructure to fishtail across the galactic plane.",
        cascadeFailures: ["Axle snap", "Suspension collapse"],
        originalPosition: { x: 2000, y: 0, z: 1500 },
        explodedPosition: { x: 8000, y: -2000, z: 8000 }
    });

    parts.push({
        name: "Gargantuan Off-Road Tire (Front Right)",
        description: "Equipped with chrome rims and spoke arrays, this tire handles the steering torque required to navigate between galaxy clusters.",
        material: "Hyper-Rubber & Steel",
        function: "Cosmic Locomotion",
        assemblyOrder: 3,
        connections: ["Front Axle"],
        failureEffect: "Loss of steering, inevitable collision with Andromeda.",
        cascadeFailures: ["Rim deformation", "Lug shear"],
        originalPosition: { x: -2000, y: 0, z: 1500 },
        explodedPosition: { x: -8000, y: -2000, z: 8000 }
    });
    
    parts.push({
        name: "Gargantuan Off-Road Tire (Rear Left)",
        description: "Transmits the unfathomable torque from the Penrose Extractors directly into forward momentum.",
        material: "Hyper-Rubber & Steel",
        function: "Traction",
        assemblyOrder: 4,
        connections: ["Rear Axle"],
        failureEffect: "Spins out, shredding local star systems into dust.",
        cascadeFailures: ["Differential lockup"],
        originalPosition: { x: 2000, y: 0, z: -1500 },
        explodedPosition: { x: 8000, y: -2000, z: -8000 }
    });

    parts.push({
        name: "Gargantuan Off-Road Tire (Rear Right)",
        description: "Maintains stability while traversing the rough, uneven topology of dark matter filaments.",
        material: "Hyper-Rubber & Steel",
        function: "Traction",
        assemblyOrder: 5,
        connections: ["Rear Axle"],
        failureEffect: "Tread separation wiping out thousands of nearby habitable worlds.",
        cascadeFailures: ["Tire fire burning for eons"],
        originalPosition: { x: -2000, y: 0, z: -1500 },
        explodedPosition: { x: -8000, y: -2000, z: -8000 }
    });

    parts.push({
        name: "Relativistic Exhaust Stack (North)",
        description: "A colossal chrome pipe venting Hawking radiation and plasma jets away from the operator cabin at 0.99c.",
        material: "Chrome / Dark Steel",
        function: "Emission Control",
        assemblyOrder: 6,
        connections: ["Singularity Combustion Chamber"],
        failureEffect: "Exhaust back-pressure stalls the black hole.",
        cascadeFailures: ["Cab asphyxiation", "Ergosphere blowout"],
        originalPosition: { x: 0, y: 1500, z: 0 },
        explodedPosition: { x: 0, y: 8000, z: -4000 }
    });

    parts.push({
        name: "Relativistic Exhaust Stack (South)",
        description: "Balances the thrust to prevent the engine from tumbling out of control.",
        material: "Chrome / Dark Steel",
        function: "Emission Control",
        assemblyOrder: 7,
        connections: ["Singularity Combustion Chamber"],
        failureEffect: "Engine tumbling, scattering the accretion disk.",
        cascadeFailures: ["Frame twist"],
        originalPosition: { x: 0, y: -1500, z: 0 },
        explodedPosition: { x: 0, y: -8000, z: -4000 }
    });

    parts.push({
        name: "Operator Cabin",
        description: "The tinted-glass cockpit where a god-like entity sits holding the chrome steering wheel, controlling the fate of the galaxy via joysticks and glowing screens.",
        material: "Tinted Glass / Steel / Plastic",
        function: "Command and Control",
        assemblyOrder: 8,
        connections: ["Chassis Mounts", "Access Ladder"],
        failureEffect: "Loss of manual control; AI autopilot engages (which is historically reckless).",
        cascadeFailures: ["Life support failure", "Coffee spill on main terminal"],
        originalPosition: { x: 0, y: 2500, z: 0 },
        explodedPosition: { x: 0, y: 12000, z: 0 }
    });

    for(let i=1; i<=8; i++) {
        parts.push({
            name: `Hydraulic Penrose Siphon Boom ${i}`,
            description: "Massive outer cylinder housing a chrome inner shaft, wrapped in rubber hydraulic fluid lines. It dips into the ergosphere to extract rotational energy.",
            material: "Dark Steel / Chrome / Rubber",
            function: "Energy Extraction",
            assemblyOrder: 8 + i,
            connections: ["Chassis", "Ergosphere"],
            failureEffect: "Hydraulic fluid (liquid neutronium) leaks, crushing anything it touches.",
            cascadeFailures: ["Boom snap", "Loss of torque to wheels"],
            originalPosition: { x: Math.cos(i)*1200, y: 200, z: Math.sin(i)*1200 },
            explodedPosition: { x: Math.cos(i)*6000, y: 4000, z: Math.sin(i)*6000 }
        });
    }

    // ==========================================
    // 9. EXTREMELY DIFFICULT QUIZ QUESTIONS
    // ==========================================
    
    const quizQuestions = [
        {
            question: "To prevent the gargantuan rubber tires from undergoing spontaneous nuclear fusion due to extreme rolling friction against the spacetime fabric, what material property MUST be artificially maintained?",
            options: ["Infinite specific heat capacity via hyper-dimensional heat sinks", "A negative shear modulus", "Superconductivity at Planck temperatures", "A refractive index of zero"],
            correctAnswer: 0,
            explanation: "Rolling a solar-system sized tire generates immense kinetic friction. Unless the rubber is connected to hyper-dimensional heat sinks to artificially create an infinite specific heat capacity, the treads would ignite into a degenerate matter plasma instantly."
        },
        {
            question: "The inner shaft of the Hydraulic Penrose Siphon Boom extracts energy from the Kerr black hole. What limits the theoretical maximum efficiency of this process before the engine stalls?",
            options: ["The Bekenstein bound of the hydraulic fluid", "The irreducible mass of the black hole, capping extraction at 29%", "The tensile strength of the chrome shaft", "The Schwarzschild radius expanding beyond the boom's reach"],
            correctAnswer: 1,
            explanation: "The Penrose process relies on the rotational energy of the black hole. You can only extract energy until the black hole stops spinning, which corresponds to its irreducible mass. This limits the total extractable energy to 29% of its initial mass-energy."
        },
        {
            question: "Why are the exhaust stacks equipped with dark steel panel rings spaced exactly 200 units apart?",
            options: ["Aesthetic design choices by the God-Tier operator", "To disrupt harmonic resonance caused by the Lense-Thirring (frame-dragging) effect", "To measure the redshift of the escaping plasma", "To mount aftermarket subwoofers"],
            correctAnswer: 1,
            explanation: "Relativistic jets escaping the poles of a spinning black hole experience severe torsional shear due to frame-dragging (Lense-Thirring effect). The heavily reinforced dark steel rings act as harmonic dampeners to prevent the exhaust stacks from vibrating themselves into dust."
        },
        {
            question: "The Operator Cabin sits precisely 2500 units above the singularity. Assuming the singularity has a mass of 100 million solar masses, what protects the tinted glass windows from spaghettification?",
            options: ["They are outside the innermost stable circular orbit (ISCO)", "The glass is doped with exotic matter exerting negative pressure", "A localized Alcubierre warp bubble isolating the cabin's metric", "The chrome steering wheel acts as a grounding rod for gravity"],
            correctAnswer: 2,
            explanation: "At that proximity, tidal forces would turn any normal matter into a stream of atoms. The only way an operator cabin can remain physically intact and stationary is by enclosing it in a localized Alcubierre metric (warp bubble), effectively decoupling its local spacetime from the black hole's gravity well."
        },
        {
            question: "The Galactic Data Streams (cyan particles) flow directly into the engine intake. According to Landauer's Principle, how does the engine utilize this information?",
            options: ["It reads the data to play music in the cabin", "Erasing the data generates heat, which expands the hydraulic fluid to drive the pistons", "It compresses the data into a new singularity", "It broadcasts the data via the exhaust stacks"],
            correctAnswer: 1,
            explanation: "Landauer's Principle states that erasing information fundamentally increases thermodynamic entropy (releases heat). The engine ingests trillions of exabytes of junk galactic data and continuously erases it, harnessing the resulting localized heat burst to expand the liquid neutronium hydraulic fluid and drive the massive pistons."
        }
    ];

    // ==========================================
    // 10. ANIMATION LOOP
    // ==========================================

    function animate(time, speed, meshes) {
        let t = time * speed;
        updatables.forEach(fn => fn(t));
    }

    return {
        group,
        parts,
        description: "The absolute zenith of cosmic diesel-punk engineering. A God-Tier Kardashev Type III civilization has enclosed their supermassive black hole within a colossal, fully functional tractor engine. Featuring solar-system sized off-road tires, relativistic exhaust stacks, and massive hydraulic pistons that extract rotational energy directly from the ergosphere. An operator sits in a tinted-glass cabin, gripping a chrome steering wheel, literally driving the galaxy through the cosmos.",
        quizQuestions,
        animate
    };
}
