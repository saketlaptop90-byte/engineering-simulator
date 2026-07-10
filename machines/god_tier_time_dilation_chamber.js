import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        outerRings: [],
        midRings: [],
        innerRings: [],
        magneticCoils: [],
        tachyonNodes: [],
        coolantPipes: [],
        cables: [],
        hydraulicPistons: [],
        subjectCore: null,
        coreShells: [],
        energyPulses: [],
        displays: [],
        rotors: []
    };

    const description = "GOD TIER TIME DILATION CHAMBER: A vastly complex relativistic containment facility capable of localized spacetime metric manipulation. Utilizing an array of superconducting frame-dragging rings, it generates a synthetic Kerr spacetime metric, accelerating or freezing time within its central quantum vault relative to the external universe. Extreme caution is required, as metric shear can cause spaghettification or spontaneous closed timelike curve (CTC) generation. Features an incredibly high-speed frame-dragging outer matrix, suspended by quantum magnetic levitators.";

    // --- ADVANCED CUSTOM MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0055ff, emissiveIntensity: 4, metalness: 0.8, roughness: 0.2 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0x7700ff, emissiveIntensity: 5, metalness: 0.9, roughness: 0.1 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xaa0011, emissiveIntensity: 3, metalness: 0.5, roughness: 0.4 });
    const plasmaWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10, metalness: 0.0, roughness: 1.0 });
    const tachyonGlass = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.98, opacity: 1, metalness: 0.1, roughness: 0.0, ior: 1.2, thickness: 5.0, transparent: true });
    const voidBlack = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.9 });
    const superConductor = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 1.0, roughness: 0.05, clearcoat: 1.0, clearcoatRoughness: 0.1 });
    const frozenSubjectMat = new THREE.MeshStandardMaterial({ color: 0xddddff, emissive: 0x222244, emissiveIntensity: 1, metalness: 0.6, roughness: 0.8, wireframe: false });

    // --- HELPER FUNCTIONS FOR EXTREME DETAIL ---
    function createBolt(radius, height) {
        const hex = new THREE.CylinderGeometry(radius, radius, height, 6);
        return new THREE.Mesh(hex, darkSteel);
    }

    function createRibbedTube(path, radius, segments, ribsCount) {
        const tubeGeom = new THREE.TubeGeometry(path, segments, radius, 12, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, rubber);
        const ribGroup = new THREE.Group();
        ribGroup.add(tubeMesh);
        
        for (let i = 0; i <= ribsCount; i++) {
            const t = i / ribsCount;
            const pt = path.getPointAt(t);
            const tangent = path.getTangentAt(t).normalize();
            
            const ribGeom = new THREE.TorusGeometry(radius + 0.05, 0.02, 8, 16);
            const rib = new THREE.Mesh(ribGeom, darkSteel);
            rib.position.copy(pt);
            const axis = new THREE.Vector3(0, 0, 1);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
            rib.quaternion.copy(quaternion);
            ribGroup.add(rib);
        }
        return ribGroup;
    }

    // --- 1. THE FOUNDATION & PLATFORM ---
    const platformGroup = new THREE.Group();
    
    // Extruded Octagonal Base
    const baseShape = new THREE.Shape();
    const numSides = 8;
    const baseRadius = 40;
    for (let i = 0; i < numSides; i++) {
        const angle = (i / numSides) * Math.PI * 2;
        const nextAngle = ((i + 1) / numSides) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;
        
        baseShape.lineTo(Math.cos(angle) * baseRadius, Math.sin(angle) * baseRadius);
        // Indentation for complexity
        baseShape.lineTo(Math.cos(midAngle) * (baseRadius - 5), Math.sin(midAngle) * (baseRadius - 5));
    }
    baseShape.lineTo(Math.cos(0) * baseRadius, Math.sin(0) * baseRadius);

    const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -20;
    platformGroup.add(baseMesh);

    // Floor Grating & Rails
    const gratingGeom = new THREE.CylinderGeometry(baseRadius - 2, baseRadius - 2, 0.2, 64);
    const grating = new THREE.Mesh(gratingGeom, steel);
    grating.position.y = -15.8;
    platformGroup.add(grating);

    // Add stairs
    for (let i = 0; i < 4; i++) {
        const stairGroup = new THREE.Group();
        for (let j = 0; j < 20; j++) {
            const step = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 2), steel); // Only cube-like object used for stairs
            step.position.set(0, -19.5 + j * 0.5, baseRadius + 2 + j * 1);
            stairGroup.add(step);
        }
        stairGroup.rotation.y = (i * Math.PI) / 2;
        platformGroup.add(stairGroup);
    }

    parts.push({
        name: "Foundation Isolation Platform",
        description: "Massive depleted uranium and dark-steel extruded base designed to absorb extreme gravitational waves and seismic vibrations from the time dilation core.",
        material: "Dark Steel / Depleted Uranium",
        function: "Structural integrity and vibrational dampening.",
        assemblyOrder: 1,
        connections: ["Quantum Anchors", "Power Mains"],
        failureEffect: "Chamber collapses into a localized micro-singularity.",
        cascadeFailures: ["Total structural vaporization"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    group.add(platformGroup);

    // --- 2. QUANTUM MAGNETIC ANCHORS ---
    const anchorGroup = new THREE.Group();
    const anchorCount = 8;
    for (let i = 0; i < anchorCount; i++) {
        const angle = (i / anchorCount) * Math.PI * 2;
        const x = Math.cos(angle) * 32;
        const z = Math.sin(angle) * 32;

        const pillar = new THREE.Group();
        
        // Pillar Base
        const pBaseGeom = new THREE.CylinderGeometry(4, 5, 6, 16);
        const pBase = new THREE.Mesh(pBaseGeom, chrome);
        pBase.position.y = -13;
        pillar.add(pBase);

        // Pillar Shaft (Lathed)
        const shaftPoints = [];
        for (let j = 0; j <= 20; j++) {
            const y = (j / 20) * 30 - 10;
            const r = 2.5 + Math.sin(j * 0.5) * 0.5;
            shaftPoints.push(new THREE.Vector2(r, y));
        }
        const shaftGeom = new THREE.LatheGeometry(shaftPoints, 32);
        const shaft = new THREE.Mesh(shaftGeom, superConductor);
        pillar.add(shaft);

        // Magnetic Emitter Head
        const headGeom = new THREE.CylinderGeometry(5, 3, 8, 16);
        const head = new THREE.Mesh(headGeom, darkSteel);
        head.position.y = 24;
        pillar.add(head);

        // Glowing Coils on Head
        for (let k = 0; k < 5; k++) {
            const coilGeom = new THREE.TorusGeometry(5.2, 0.4, 8, 32);
            const coil = new THREE.Mesh(coilGeom, neonBlue);
            coil.position.y = 21 + k * 1.5;
            coil.rotation.x = Math.PI / 2;
            pillar.add(coil);
            meshes.magneticCoils.push(coil);
        }

        // Connecting Hydraulics leaning inwards
        const strutGeom = new THREE.CylinderGeometry(0.8, 0.8, 25, 12);
        const strut = new THREE.Mesh(strutGeom, aluminum);
        strut.position.set(0, 10, -8);
        strut.rotation.x = Math.PI / 6;
        pillar.add(strut);

        pillar.position.set(x, 0, z);
        pillar.lookAt(new THREE.Vector3(0, 0, 0));
        anchorGroup.add(pillar);
    }

    parts.push({
        name: "Quantum Magnetic Anchors (Array of 8)",
        description: "Superconducting pillars that generate an inverted magnetic bottle, suspending the relativistic rings in a frictionless vacuum state.",
        material: "Superconductor, Chrome, Dark Steel",
        function: "Levitation and spatial locking of the frame-dragging rings.",
        assemblyOrder: 2,
        connections: ["Foundation", "Outer Relativistic Ring"],
        failureEffect: "Rings crash into base at 0.99c, causing a thermonuclear yield explosion.",
        cascadeFailures: ["Outer Ring", "Mid Ring", "Containment Vault"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });
    group.add(anchorGroup);


    // --- 3. RELATIVISTIC FRAME-DRAGGING RINGS ---
    const ringsGroup = new THREE.Group();

    function createRelativisticRing(radius, tubeThickness, color, greebleCount) {
        const ringObj = new THREE.Group();
        
        // Main Lathe Shape for Ring (Not just a simple torus, a complex cross section)
        const pts = [];
        pts.push(new THREE.Vector2(radius - tubeThickness, -tubeThickness/2));
        pts.push(new THREE.Vector2(radius - tubeThickness*1.2, 0));
        pts.push(new THREE.Vector2(radius - tubeThickness, tubeThickness/2));
        pts.push(new THREE.Vector2(radius + tubeThickness, tubeThickness/2));
        pts.push(new THREE.Vector2(radius + tubeThickness*1.5, 0));
        pts.push(new THREE.Vector2(radius + tubeThickness, -tubeThickness/2));
        pts.push(new THREE.Vector2(radius - tubeThickness, -tubeThickness/2));
        
        const latheGeom = new THREE.LatheGeometry(pts, 128);
        const mainRing = new THREE.Mesh(latheGeom, superConductor);
        ringObj.add(mainRing);

        // Add extreme details (Greebles, tachyon nodes, cooling fins)
        for(let i=0; i<greebleCount; i++) {
            const angle = (i / greebleCount) * Math.PI * 2;
            
            // Outer Nodes
            const nodeGeom = new THREE.CylinderGeometry(tubeThickness*0.3, tubeThickness*0.4, tubeThickness*2.2, 8);
            const node = new THREE.Mesh(nodeGeom, steel);
            node.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            node.rotation.x = Math.PI/2;
            node.rotation.z = -angle;
            ringObj.add(node);

            // Glowing Emitters on nodes
            const glowGeom = new THREE.SphereGeometry(tubeThickness*0.35, 16, 16);
            const glow = new THREE.Mesh(glowGeom, color);
            glow.position.set(Math.cos(angle)*(radius+tubeThickness*1.2), 0, Math.sin(angle)*(radius+tubeThickness*1.2));
            ringObj.add(glow);
            meshes.energyPulses.push(glow);

            // Inner focus spikes
            const spikeGeom = new THREE.CylinderGeometry(0, tubeThickness*0.2, tubeThickness*1.5, 4);
            const spike = new THREE.Mesh(spikeGeom, copper);
            spike.position.set(Math.cos(angle)*(radius-tubeThickness), 0, Math.sin(angle)*(radius-tubeThickness));
            spike.rotation.x = Math.PI/2;
            spike.rotation.z = -angle;
            ringObj.add(spike);
        }

        return ringObj;
    }

    // Outer Ring (Z-axis gimbal)
    const outerRing = createRelativisticRing(24, 2, neonBlue, 36);
    meshes.outerRings.push(outerRing);
    ringsGroup.add(outerRing);
    
    parts.push({
        name: "Outer Frame-Dragging Matrix",
        description: "The primary Kerr-metric generator. Spins at 0.8c to literally drag the fabric of spacetime around the core.",
        material: "Superconductor / Metamaterial",
        function: "Macro-scale spacetime warping.",
        assemblyOrder: 3,
        connections: ["Quantum Anchors", "Mid Ring Gimbal"],
        failureEffect: "Spacetime shear rips apart local molecular bonds.",
        cascadeFailures: ["Mid Ring"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });

    // Mid Ring (X-axis gimbal)
    const midRing = createRelativisticRing(19, 1.5, neonPurple, 24);
    meshes.midRings.push(midRing);
    ringsGroup.add(midRing);

    parts.push({
        name: "Secondary Resonance Ring",
        description: "Harmonizes the gravitational waves produced by the outer ring to prevent uncontrolled singularities.",
        material: "Superconductor",
        function: "Wave dampening and secondary acceleration.",
        assemblyOrder: 4,
        connections: ["Outer Ring", "Inner Ring Gimbal"],
        failureEffect: "Wild fluctuations in local gravity.",
        cascadeFailures: ["Inner Ring"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 0, z: 0 }
    });

    // Inner Ring (Y-axis gimbal)
    const innerRing = createRelativisticRing(14, 1.0, neonRed, 16);
    meshes.innerRings.push(innerRing);
    ringsGroup.add(innerRing);

    parts.push({
        name: "Inner Chronal Focusing Ring",
        description: "Focuses the compressed spacetime directly onto the containment vault, establishing the precise dilation ratio.",
        material: "Superconductor",
        function: "Pinpoint metric targeting.",
        assemblyOrder: 5,
        connections: ["Mid Ring", "Containment Vault"],
        failureEffect: "Time inside the vault accelerates to infinity, instantly aging the subject to dust.",
        cascadeFailures: ["Containment Vault", "Subject"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 40 }
    });

    group.add(ringsGroup);

    // --- 4. THE TEMPORAL VAULT (CORE) ---
    const vaultGroup = new THREE.Group();

    // The Glass Shell
    const vaultPoints = [];
    for (let i = 0; i <= 30; i++) {
        const v = i / 30;
        const y = Math.cos(v * Math.PI) * 8;
        const r = Math.sin(v * Math.PI) * 6;
        vaultPoints.push(new THREE.Vector2(r, y));
    }
    const vaultGeom = new THREE.LatheGeometry(vaultPoints, 64);
    const vaultMesh = new THREE.Mesh(vaultGeom, tachyonGlass);
    meshes.coreShells.push(vaultMesh);
    vaultGroup.add(vaultMesh);

    // The Inner Energy Field (slightly smaller, glowing)
    const fieldGeom = new THREE.LatheGeometry(vaultPoints.map(p => new THREE.Vector2(p.x * 0.95, p.y * 0.95)), 64);
    const fieldMesh = new THREE.Mesh(fieldGeom, neonBlue);
    fieldMesh.material.transparent = true;
    fieldMesh.material.opacity = 0.3;
    fieldMesh.material.wireframe = true;
    meshes.coreShells.push(fieldMesh);
    vaultGroup.add(fieldMesh);

    // Vault Caps (Top and Bottom)
    const capGeom = new THREE.CylinderGeometry(3, 4, 2, 32);
    const topCap = new THREE.Mesh(capGeom, chrome);
    topCap.position.y = 8;
    vaultGroup.add(topCap);
    
    const botCap = new THREE.Mesh(capGeom, chrome);
    botCap.position.y = -8;
    botCap.rotation.x = Math.PI;
    vaultGroup.add(botCap);

    // Massive cabling going into caps
    for(let i=0; i<6; i++) {
        const angle = (i/6)*Math.PI*2;
        const cableGeom = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
        const tCable = new THREE.Mesh(cableGeom, rubber);
        tCable.position.set(Math.cos(angle)*2, 12, Math.sin(angle)*2);
        vaultGroup.add(tCable);

        const bCable = new THREE.Mesh(cableGeom, rubber);
        bCable.position.set(Math.cos(angle)*2, -12, Math.sin(angle)*2);
        vaultGroup.add(bCable);
    }

    parts.push({
        name: "Tachyon Glass Containment Vault",
        description: "A crystalline hyper-structure designed to visually expose the interior while isolating it entirely from standard universal time flow.",
        material: "Tachyon-infused Quartz Glass, Chrome",
        function: "Atmospheric and temporal isolation of the subject.",
        assemblyOrder: 6,
        connections: ["Inner Ring", "Life Support Hydraulics"],
        failureEffect: "Subject is exposed to raw chronal radiation, ceasing to exist in current timeline.",
        cascadeFailures: ["Subject Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });


    // --- 5. THE FROZEN SUBJECT ---
    // Creating a complex hyper-dimensional looking object that is "frozen" inside
    const subjectGroup = new THREE.Group();
    
    const sCoreGeom = new THREE.IcosahedronGeometry(2, 2);
    const sCore = new THREE.Mesh(sCoreGeom, frozenSubjectMat);
    subjectGroup.add(sCore);

    for(let i=0; i<4; i++) {
        const sRingGeom = new THREE.TorusGeometry(3 + i*0.5, 0.1, 8, 32);
        const sRing = new THREE.Mesh(sRingGeom, plasmaWhite);
        sRing.rotation.x = Math.random() * Math.PI;
        sRing.rotation.y = Math.random() * Math.PI;
        subjectGroup.add(sRing);
        meshes.rotors.push({ mesh: sRing, speed: (Math.random() - 0.5) * 0.0001 }); // Incredibly slow rotation
    }

    meshes.subjectCore = subjectGroup;
    vaultGroup.add(subjectGroup);

    parts.push({
        name: "Test Subject (Quantum Oscillator)",
        description: "A hyper-complex beryllium lattice acting as the test mass. It is experiencing time at a rate of 1 second per 10,000 external years.",
        material: "Beryllium, Plasma",
        function: "Observable target for dilation effects.",
        assemblyOrder: 7,
        connections: ["Containment Vault"],
        failureEffect: "None. Subject is already practically frozen.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Remains in vault
    });

    group.add(vaultGroup);

    // --- 6. CABLE MATRICES & TUBE HYDRAULICS ---
    // Complex routing of power cables from the base to the anchors
    const cablesGroup = new THREE.Group();
    
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        
        // Bezier curve from base center outward to anchor
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -19, 0),
            new THREE.Vector3(Math.cos(angle)*10, -18, Math.sin(angle)*10),
            new THREE.Vector3(Math.cos(angle)*20, -12, Math.sin(angle)*20),
            new THREE.Vector3(Math.cos(angle)*30, -5, Math.sin(angle)*30),
            new THREE.Vector3(Math.cos(angle)*32, 0, Math.sin(angle)*32)
        ]);

        const tube = createRibbedTube(curve, 0.6, 64, 40);
        cablesGroup.add(tube);
        meshes.cables.push(tube);

        // Secondary smaller coolant lines
        const curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle+0.2)*5, -19, Math.sin(angle+0.2)*5),
            new THREE.Vector3(Math.cos(angle+0.1)*15, -15, Math.sin(angle+0.1)*15),
            new THREE.Vector3(Math.cos(angle)*32, 5, Math.sin(angle)*32)
        ]);
        const tube2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 64, 0.2, 8, false), copper);
        cablesGroup.add(tube2);
    }

    parts.push({
        name: "Superfluid Helium Coolant Lines & Power Mains",
        description: "Hundreds of meters of ribbed rubber and copper tubing delivering terawatts of power and zero-point coolant to the quantum anchors.",
        material: "Rubber, Copper, Dark Steel",
        function: "Thermal regulation and power delivery.",
        assemblyOrder: 8,
        connections: ["Foundation", "Quantum Anchors"],
        failureEffect: "Massive thermal runaway, melting the anchors.",
        cascadeFailures: ["Quantum Anchors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 30 }
    });

    group.add(cablesGroup);

    // --- 7. OPERATOR CONTROL STATION ---
    const controlGroup = new THREE.Group();
    controlGroup.position.set(0, -15.8, 35); // Placed on the edge of the grating
    
    // Desk
    const deskShape = new THREE.Shape();
    deskShape.moveTo(-8, -2);
    deskShape.lineTo(8, -2);
    deskShape.lineTo(6, 2);
    deskShape.lineTo(-6, 2);
    const deskGeom = new THREE.ExtrudeGeometry(deskShape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    const desk = new THREE.Mesh(deskGeom, plastic);
    desk.rotation.x = Math.PI / 2;
    desk.position.y = 3;
    controlGroup.add(desk);

    // Desk Legs
    const legGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
    const leg1 = new THREE.Mesh(legGeom, aluminum); leg1.position.set(-7, 1.5, -1); controlGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeom, aluminum); leg2.position.set(7, 1.5, -1); controlGroup.add(leg2);
    const leg3 = new THREE.Mesh(legGeom, aluminum); leg3.position.set(-5, 1.5, 1); controlGroup.add(leg3);
    const leg4 = new THREE.Mesh(legGeom, aluminum); leg4.position.set(5, 1.5, 1); controlGroup.add(leg4);

    // Monitors (Curved array)
    for(let i=-2; i<=2; i++) {
        const monGroup = new THREE.Group();
        const monGeom = new THREE.BoxGeometry(2.5, 1.5, 0.1);
        const monBody = new THREE.Mesh(monGeom, darkSteel);
        
        const screenGeom = new THREE.PlaneGeometry(2.3, 1.3);
        const screen = new THREE.Mesh(screenGeom, neonBlue); // glowing screens
        screen.position.z = 0.06;
        meshes.displays.push(screen);

        monGroup.add(monBody);
        monGroup.add(screen);
        
        const angle = i * 0.3;
        monGroup.position.set(Math.sin(angle)*5, 4.5, Math.cos(angle)*5 - 5);
        monGroup.lookAt(new THREE.Vector3(0, 4.5, -5));
        controlGroup.add(monGroup);
    }

    // Keyboards and Buttons
    for(let i=0; i<30; i++) {
        const btnGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
        const btnColor = Math.random() > 0.8 ? neonRed : (Math.random() > 0.5 ? neonBlue : plastic);
        const btn = new THREE.Mesh(btnGeom, btnColor);
        btn.position.set((Math.random()-0.5)*10, 3.25, (Math.random()-0.5)*2);
        controlGroup.add(btn);
    }

    parts.push({
        name: "Primary Operations Console",
        description: "The main interface for adjusting the localized metric tensor. Features direct neural-link fail-safes due to the extreme reaction times required.",
        material: "Plastic, Aluminum, Dark Steel, Glass",
        function: "User interfacing, monitoring chronal shear, and emergency aborts.",
        assemblyOrder: 9,
        connections: ["Foundation"],
        failureEffect: "Loss of control. System defaults to highest dilation setting.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -15.8, z: 35 },
        explodedPosition: { x: 0, y: -10, z: 60 }
    });

    group.add(controlGroup);

    // --- 8. TACHYON INJECTOR ARRAYS (TOP) ---
    const injectorGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        
        const injCoreGeom = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        const injCore = new THREE.Mesh(injCoreGeom, darkSteel);
        injCore.position.set(Math.cos(angle)*15, 25, Math.sin(angle)*15);
        injCore.lookAt(new THREE.Vector3(0, 10, 0)); // Point down at core
        
        // Emitter tip
        const tipGeom = new THREE.CylinderGeometry(0.1, 1.5, 4, 16);
        const tip = new THREE.Mesh(tipGeom, copper);
        tip.position.y = 9.5;
        injCore.add(tip);

        // Energy Beam (Transparent cylinder)
        const beamGeom = new THREE.CylinderGeometry(0.5, 0.5, 30, 16);
        const beam = new THREE.Mesh(beamGeom, plasmaWhite);
        beam.material.transparent = true;
        beam.material.opacity = 0.4;
        beam.position.y = 25; // Extend down
        injCore.add(beam);
        meshes.energyPulses.push(beam);

        injectorGroup.add(injCore);
    }

    parts.push({
        name: "Tachyon Injector Array",
        description: "Fires focused beams of hypothetical faster-than-light particles to stabilize the Kerr metric horizons.",
        material: "Dark Steel, Copper, Plasma",
        function: "Metric stabilization.",
        assemblyOrder: 10,
        connections: ["Containment Vault Caps"],
        failureEffect: "Metric collapses, unleashing a shockwave of exotic matter.",
        cascadeFailures: ["Outer Ring", "Mid Ring", "Inner Ring", "Containment Vault"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });
    
    group.add(injectorGroup);


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the Kerr metric generated by the Outer Frame-Dragging Matrix, the angular velocity $\\omega$ of a zero-angular-momentum observer (ZAMO) at the event horizon of a maximally rotating black hole ($a=M$) is given by:",
            options: [
                "$\\omega = 1 / (2M)$",
                "$\\omega = 1 / (4M)$",
                "$\\omega = 0$",
                "$\\omega = \\infty$"
            ],
            correctAnswerIndex: 0,
            explanation: "For a maximally rotating Kerr black hole ($a=M$), the frame-dragging angular velocity at the horizon ($r=M$) simplifies to $1/(2M)$ in geometrized units ($G=c=1$)."
        },
        {
            question: "Which component of the Riemann curvature tensor explicitly drives the tidal disruption due to the transverse frame-dragging (gravitomagnetic) effect in a rotating spacetime?",
            options: [
                "$R_{t\\phi r \\theta}$",
                "$R_{r\\theta r\\theta}$",
                "$R_{t r t r}$",
                "$R_{\\phi \\theta \\phi \\theta}$"
            ],
            correctAnswerIndex: 0,
            explanation: "The component $R_{t\\phi r \\theta}$ couples the time ($t$), azimuthal ($\\phi$), radial ($r$), and polar ($\\theta$) coordinates, directly representing the gravitomagnetic tidal shear caused by the rotation of the source."
        },
        {
            question: "As the Test Subject experiences extreme time dilation approaching the synthetic event horizon, the coordinate time $t$ for an operator at the console diverges. What is the leading order asymptotic behavior of $t(r)$ near the Schwarzschild radius $r_s$?",
            options: [
                "$t \\sim -r_s \\ln(r/r_s - 1)$",
                "$t \\sim r_s e^{-r/r_s}$",
                "$t \\sim (r-r_s)^{-1}$",
                "$t \\sim r_s \\sqrt{r/r_s - 1}$"
            ],
            correctAnswerIndex: 0,
            explanation: "For a radially infalling observer, the coordinate time $t$ diverges logarithmically as $r \\to r_s$, specifically scaling with $-r_s \\ln(r/r_s - 1)$, which explains why objects appear to 'freeze' at the horizon to outside observers."
        },
        {
            question: "If the Frame-Dragging Rings accidentally generated a Gödel-type universe locally, allowing for closed timelike curves (CTCs), the critical radius $r_c$ beyond which CTCs exist is related to the cosmological constant $\\Lambda$ and matter density $\\rho$ by:",
            options: [
                "$r_c = \\ln(1+\\sqrt{2}) / \\omega$",
                "$r_c = c / \\sqrt{4\\pi G \\rho}$",
                "$r_c = \\sqrt{3/\\Lambda}$",
                "$r_c = 2GM/c^2$"
            ],
            correctAnswerIndex: 0,
            explanation: "In the Gödel metric, the critical radius for the onset of CTCs is uniquely determined by the vorticity $\\omega$ of the dust, given by $r_c = \\ln(1+\\sqrt{2}) / \\omega$."
        },
        {
            question: "Considering the Unruh effect for a quantum particle within the highly accelerated frame-dragged region, what is the exact relationship between the Unruh temperature $T_U$ and the local proper acceleration $a$?",
            options: [
                "$T_U = \\hbar a / (2\\pi c k_B)$",
                "$T_U = \\hbar a^2 / (4\\pi c k_B)$",
                "$T_U = \\hbar c / (2\\pi a k_B)$",
                "$T_U = \\sqrt{\\hbar a / (\\pi c k_B)}$"
            ],
            correctAnswerIndex: 0,
            explanation: "The Unruh temperature is strictly proportional to the proper acceleration, given by the formula $T_U = \\hbar a / (2\\pi c k_B)$, demonstrating a deep link between quantum mechanics, relativity, and thermodynamics."
        }
    ];

    // --- ANIMATION LOGIC ---
    const animate = (time, speed, activeMeshes) => {
        // Relativistic Ring rotations (Extremely fast, simulating frame dragging)
        // Note: Utilizing prime number ratios to prevent harmonic resonance visually
        if (meshes.outerRings.length > 0) {
            meshes.outerRings[0].rotation.z = time * speed * 25.0; 
            meshes.outerRings[0].rotation.y = Math.sin(time * speed * 2.0) * 0.2; 
        }
        
        if (meshes.midRings.length > 0) {
            meshes.midRings[0].rotation.x = time * speed * 41.0;
            meshes.midRings[0].rotation.z = Math.cos(time * speed * 1.5) * 0.3;
        }

        if (meshes.innerRings.length > 0) {
            meshes.innerRings[0].rotation.y = time * speed * 73.0;
            meshes.innerRings[0].rotation.x = time * speed * 11.0;
        }

        // Vault Field pulsing (Breathing effect)
        if (meshes.coreShells.length > 1) {
            const field = meshes.coreShells[1];
            const pulse = (Math.sin(time * speed * 10.0) + 1.0) / 2.0;
            field.material.opacity = 0.1 + pulse * 0.4;
            field.scale.setScalar(1.0 + pulse * 0.02);
        }

        // Energy pulses (Tachyon nodes and beams flickering)
        meshes.energyPulses.forEach((mesh, index) => {
            const flicker = Math.random() > 0.1 ? 1 : 0.2; // High tech flicker
            if(mesh.material && mesh.material.emissiveIntensity !== undefined) {
                // Base intensity + sine wave based on index + random flicker
                mesh.material.emissiveIntensity = 2 + Math.sin(time * speed * 20.0 + index) * 1.5 * flicker;
            }
            if(mesh.material && mesh.material.opacity !== undefined) {
                 mesh.material.opacity = 0.3 + Math.sin(time * speed * 30.0 + index) * 0.2 * flicker;
            }
        });

        // Displays changing colors slightly to simulate data flow
        meshes.displays.forEach((display, index) => {
            display.material.emissive.setHSL((time * speed * 0.5 + index * 0.2) % 1, 1.0, 0.5);
        });

        // Frozen Subject Core (EXTREMELY slow rotation to simulate extreme time dilation)
        if (meshes.subjectCore) {
            meshes.subjectCore.rotation.y = time * speed * 0.00005;
            meshes.subjectCore.rotation.x = time * speed * 0.00002;
        }

        // Subject internal rotors (also extremely slow)
        meshes.rotors.forEach(rotor => {
            rotor.mesh.rotation.x += rotor.speed * speed;
            rotor.mesh.rotation.y += rotor.speed * speed * 1.2;
        });

        // Magnetic Coils undulating slightly to show load
        meshes.magneticCoils.forEach((coil, index) => {
             coil.scale.setScalar(1.0 + Math.sin(time * speed * 5.0 + index) * 0.015);
             coil.material.emissiveIntensity = 3 + Math.sin(time * speed * 10.0 - index) * 1;
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
