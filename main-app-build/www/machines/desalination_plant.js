import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        pumpRotors: [],
        erdRotors: [],
        fans: [],
        valves: [],
        lights: [],
        dosingPistons: [],
        waterFlows: [],
        screens: [],
        indicatorLights: [],
        rotatingBeacons: []
    };

    // --- Custom Advanced Materials ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2, roughness: 0.1, metalness: 0.8 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x001133, emissive: 0x003388, emissiveIntensity: 1 });
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });
    const cautionMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4, metalness: 0.2 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9, metalness: 0.1 });
    const membraneMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4, metalness: 0.1 });
    const pipeBlue = new THREE.MeshStandardMaterial({ color: 0x114488, roughness: 0.3, metalness: 0.5 });
    const pipeGreen = new THREE.MeshStandardMaterial({ color: 0x118844, roughness: 0.3, metalness: 0.5 });
    const pipeRed = new THREE.MeshStandardMaterial({ color: 0xaa2222, roughness: 0.3, metalness: 0.5 });
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.8, wireframe: true });

    // --- Utility Geometry Generators ---
    function createFlange(pipeRadius, flangeRadius, thickness, boltCount, material) {
        const flangeGroup = new THREE.Group();
        const flange = new THREE.Mesh(new THREE.CylinderGeometry(flangeRadius, flangeRadius, thickness, 32), material);
        flange.rotation.x = Math.PI / 2;
        flangeGroup.add(flange);
        
        const boltGeo = new THREE.CylinderGeometry(0.05, 0.05, thickness * 1.5, 8);
        for (let i = 0; i < boltCount; i++) {
            const angle = (i / boltCount) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, darkSteel);
            bolt.position.set(Math.cos(angle) * (flangeRadius - 0.1), Math.sin(angle) * (flangeRadius - 0.1), 0);
            bolt.rotation.x = Math.PI / 2;
            flangeGroup.add(bolt);
        }
        return flangeGroup;
    }

    function createElbow(radius, tube, arc, material) {
        const elbowGeo = new THREE.TorusGeometry(radius, tube, 16, 32, arc);
        return new THREE.Mesh(elbowGeo, material);
    }

    function createValveActuator(size) {
        const actGroup = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(size, size*1.5, size), steel);
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(size, size*0.1, 16, 32), cautionMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.y = size;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(size*0.2, size*0.2, size*1.2, 16), chrome);
        stem.position.y = size*0.5;
        actGroup.add(body, wheel, stem);
        meshes.valves.push(wheel);
        return actGroup;
    }

    // ==========================================
    // 1. BASE PLATFORM & FOUNDATION
    // ==========================================
    const baseOriginal = new THREE.Vector3(0, -1, 0);
    const baseGroup = new THREE.Group();
    baseGroup.position.copy(baseOriginal);
    
    // Main concrete slab
    const slabGeo = new THREE.BoxGeometry(80, 2, 80);
    const slab = new THREE.Mesh(slabGeo, concreteMat);
    baseGroup.add(slab);
    
    // Containment curbs
    const curbGeo = new THREE.BoxGeometry(82, 3, 2);
    const curb1 = new THREE.Mesh(curbGeo, cautionMat);
    curb1.position.set(0, 0.5, 40);
    const curb2 = curb1.clone();
    curb2.position.set(0, 0.5, -40);
    const curb3 = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 78), cautionMat);
    curb3.position.set(40, 0.5, 0);
    const curb4 = curb3.clone();
    curb4.position.set(-40, 0.5, 0);
    baseGroup.add(curb1, curb2, curb3, curb4);

    // Drain grates running along the center
    for(let i=0; i<38; i++) {
        const grate = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 1.8), grateMat);
        grate.position.set(0, 1.05, -38 + (i*2));
        baseGroup.add(grate);
    }

    parts.push({
        name: "Concrete Foundation & Spill Containment",
        description: "Massive reinforced concrete base engineered to withstand immense vibrational loads from high-pressure pumps and contain potential chemical spills.",
        material: "Reinforced Concrete & Steel Grating",
        function: "Provides structural stability, vibration dampening, and environmental protection via integrated drainage trenches.",
        assemblyOrder: 1,
        connections: ["Pre-Treatment Filters", "RO Skids", "Pump Bases"],
        failureEffect: "Structural cracking, severe vibration damage to rotating equipment.",
        cascadeFailures: ["Pipe rupture", "Pump misalignment"],
        originalPosition: baseOriginal.clone(),
        explodedPosition: new THREE.Vector3(0, -20, 0)
    });
    group.add(baseGroup);

    // ==========================================
    // 2. INTAKE SYSTEM & SCREENS
    // ==========================================
    const intakeOriginal = new THREE.Vector3(30, 2, 30);
    const intakeGroup = new THREE.Group();
    intakeGroup.position.copy(intakeOriginal);

    // Massive inlet pipe
    const inletPipe = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 64), pipeGreen);
    inletPipe.rotation.x = Math.PI / 2;
    inletPipe.position.z = 10;
    intakeGroup.add(inletPipe);

    // Strainer Body
    const strainerBody = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 8, 64), darkSteel);
    strainerBody.position.set(0, 2, 0);
    intakeGroup.add(strainerBody);

    const strainerDome = new THREE.Mesh(new THREE.SphereGeometry(3.5, 64, 32, 0, Math.PI*2, 0, Math.PI/2), steel);
    strainerDome.position.set(0, 6, 0);
    intakeGroup.add(strainerDome);
    
    // Rotating Drum Screen Motor
    const screenMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), chrome);
    screenMotor.position.set(0, 8, 0);
    intakeGroup.add(screenMotor);
    meshes.erdRotors.push(screenMotor); // animate rotation

    // Inlet flange
    const inletFlange = createFlange(2, 2.5, 0.2, 24, steel);
    inletFlange.position.z = 20;
    intakeGroup.add(inletFlange);

    parts.push({
        name: "Seawater Intake & Drum Screen",
        description: "Primary extraction point featuring automated self-cleaning rotary drum screens to filter out marine life, kelp, and large debris.",
        material: "Marine-Grade Super Duplex Stainless Steel",
        function: "Extracts raw seawater while protecting downstream equipment from macro-fouling.",
        assemblyOrder: 2,
        connections: ["Foundation", "Pre-Treatment Filters"],
        failureEffect: "Intake blockage, pump cavitation due to starvation.",
        cascadeFailures: ["Pump destruction", "Total plant shutdown"],
        originalPosition: intakeOriginal.clone(),
        explodedPosition: new THREE.Vector3(50, 20, 50)
    });
    group.add(intakeGroup);

    // ==========================================
    // 3. PRE-TREATMENT MULTI-MEDIA FILTERS
    // ==========================================
    const preTreatOriginal = new THREE.Vector3(25, 0, -10);
    const preTreatGroup = new THREE.Group();
    preTreatGroup.position.copy(preTreatOriginal);

    for (let i = 0; i < 6; i++) {
        const filterGroup = new THREE.Group();
        filterGroup.position.set(0, 0, -25 + (i * 9));
        
        // Massive Tank
        const tankBody = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 64), pipeGreen);
        tankBody.position.y = 8;
        filterGroup.add(tankBody);
        
        const domeGeo = new THREE.SphereGeometry(3, 64, 32, 0, Math.PI*2, 0, Math.PI/2);
        const topDome = new THREE.Mesh(domeGeo, pipeGreen);
        topDome.position.y = 14;
        filterGroup.add(topDome);
        
        const bottomDome = new THREE.Mesh(domeGeo, pipeGreen);
        bottomDome.position.y = 2;
        bottomDome.rotation.x = Math.PI;
        filterGroup.add(bottomDome);

        // Legs
        for(let l=0; l<4; l++) {
            const angle = (l/4)*Math.PI*2;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 16), darkSteel);
            leg.position.set(Math.cos(angle)*2.5, 1.5, Math.sin(angle)*2.5);
            filterGroup.add(leg);
        }

        // Structural Rings
        for (let r = 0; r < 5; r++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.1, 16, 64), darkSteel);
            ring.rotation.x = Math.PI/2;
            ring.position.y = 4 + r * 2.5;
            filterGroup.add(ring);
        }

        // Sight Glass & Lights
        const glassWindow = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32), glass);
        glassWindow.rotation.z = Math.PI/2;
        glassWindow.position.set(-3, 8, 0);
        filterGroup.add(glassWindow);
        const glassFrame = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 16, 32), darkSteel);
        glassFrame.rotation.y = Math.PI/2;
        glassFrame.position.set(-3.05, 8, 0);
        filterGroup.add(glassFrame);
        
        const statusLight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neonGreen);
        statusLight.position.set(-3.1, 9.5, 0);
        meshes.indicatorLights.push(statusLight);
        filterGroup.add(statusLight);

        // Valve Manifold (Intricate piping)
        const manifold = new THREE.Group();
        const vertPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 32), pipeBlue);
        vertPipe.position.set(-4, 8, 2);
        manifold.add(vertPipe);
        
        const horizPipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 32), pipeBlue);
        horizPipe1.rotation.z = Math.PI/2;
        horizPipe1.position.set(-2.5, 12, 2);
        manifold.add(horizPipe1);
        
        const actuator = createValveActuator(0.6);
        actuator.position.set(-4, 8, 2);
        actuator.rotation.y = Math.PI/2;
        manifold.add(actuator);
        
        filterGroup.add(manifold);
        preTreatGroup.add(filterGroup);
    }

    parts.push({
        name: "Dual-Media Pre-Treatment Filters",
        description: "Massive pressurized vessels containing layers of anthracite, sand, and garnet to achieve ultra-fine filtration of suspended solids before RO.",
        material: "Epoxy-Coated Carbon Steel, Internal Fiberglass",
        function: "Removes particulate matter to lower the Silt Density Index (SDI) and prevent irreversible membrane fouling.",
        assemblyOrder: 3,
        connections: ["Intake System", "High-Pressure Pumps"],
        failureEffect: "High SDI water bypass.",
        cascadeFailures: ["Catastrophic RO membrane fouling", "Excessive differential pressure"],
        originalPosition: preTreatOriginal.clone(),
        explodedPosition: new THREE.Vector3(40, 20, -20)
    });
    group.add(preTreatGroup);

    // ==========================================
    // 4. CHEMICAL DOSING STATION
    // ==========================================
    const dosingOriginal = new THREE.Vector3(5, 0, 30);
    const dosingGroup = new THREE.Group();
    dosingGroup.position.copy(dosingOriginal);

    // Skid platform
    const dosingSkid = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 6), darkSteel);
    dosingSkid.position.y = 0.25;
    dosingGroup.add(dosingSkid);

    // 4 Chemical Tanks (Antiscalant, Sodium Bisulfite, Coagulant, Acid)
    const chemColors = [neonOrange, neonRed, pipeBlue, neonGreen];
    for(let i=0; i<4; i++) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 32), plastic);
        tank.position.set(-3.5 + (i*2.3), 2, -1);
        
        // Liquid inside effect
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 2.5, 32), chemColors[i]);
        liquid.position.set(-3.5 + (i*2.3), 1.8, -1);
        liquid.material.transparent = true;
        liquid.material.opacity = 0.8;
        
        // Dosing Pump (Diaphragm)
        const dPump = new THREE.Group();
        const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), steel);
        const pHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), chrome);
        pHead.rotation.x = Math.PI/2;
        pHead.position.z = 0.3;
        
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16), darkSteel);
        piston.rotation.x = Math.PI/2;
        piston.position.z = 0.4;
        meshes.dosingPistons.push(piston);

        dPump.add(pBody, pHead, piston);
        dPump.position.set(-3.5 + (i*2.3), 1, 1);
        
        // Tubing
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 16), plastic);
        tube.position.set(-3.5 + (i*2.3), 1.5, 0);
        tube.rotation.x = Math.PI/4;
        
        dosingGroup.add(tank, liquid, dPump, tube);
    }

    parts.push({
        name: "Precision Chemical Dosing Station",
        description: "Automated multi-channel injection system for antiscalants, coagulants, and pH adjusters using positive displacement diaphragm pumps.",
        material: "HDPE Tanks, PTFE Diaphragms, Hastelloy C-276 Wet Ends",
        function: "Alters water chemistry to prevent scale precipitation and oxidize biological contaminants.",
        assemblyOrder: 4,
        connections: ["Pre-Treatment Filters", "RO Feed Lines"],
        failureEffect: "Incorrect chemical dosing.",
        cascadeFailures: ["Mineral scaling on RO membranes", "Irreversible biofouling"],
        originalPosition: dosingOriginal.clone(),
        explodedPosition: new THREE.Vector3(10, 15, 50)
    });
    group.add(dosingGroup);

    // ==========================================
    // 5. HIGH-PRESSURE PUMP ARRAYS
    // ==========================================
    const pumpsOriginal = new THREE.Vector3(-5, 0, -20);
    const hpPumpsGroup = new THREE.Group();
    hpPumpsGroup.position.copy(pumpsOriginal);

    for (let p = 0; p < 4; p++) {
        const pumpAsm = new THREE.Group();
        pumpAsm.position.set(0, 0, p * 12);

        // Concrete plinth
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 4), concreteMat);
        plinth.position.set(0, 0.5, 0);
        pumpAsm.add(plinth);

        // Massive Motor Body
        const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 5, 64), pipeBlue);
        motorBody.rotation.z = Math.PI / 2;
        motorBody.position.set(-2, 2.5, 0);
        pumpAsm.add(motorBody);

        // Heavy Cooling Fins (50 of them!)
        for (let f = 0; f < 50; f++) {
            const finGeo = new THREE.TorusGeometry(1.55, 0.08, 16, 64);
            const fin = new THREE.Mesh(finGeo, darkSteel);
            fin.rotation.y = Math.PI / 2;
            fin.position.set(-4.2 + (f * 0.09), 2.5, 0);
            pumpAsm.add(fin);
        }

        // Motor Endbell & Fan cover
        const endbell = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.5, 64), steel);
        endbell.rotation.z = Math.PI/2;
        endbell.position.set(-4.7, 2.5, 0);
        pumpAsm.add(endbell);
        
        // Volute Pump Casing (Complex curved shape)
        const volutePoints = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            volutePoints.push(new THREE.Vector2(Math.sin(t * Math.PI) * 2 + 0.5, (t - 0.5) * 3));
        }
        const voluteGeo = new THREE.LatheGeometry(volutePoints, 64);
        const volute = new THREE.Mesh(voluteGeo, chrome);
        volute.rotation.z = Math.PI / 2;
        volute.position.set(3, 2.5, 0);
        pumpAsm.add(volute);

        // Flanged inlets/outlets
        const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), steel);
        inlet.position.set(3, 4, 0);
        pumpAsm.add(inlet);
        const inFlange = createFlange(0.8, 1.2, 0.1, 12, steel);
        inFlange.position.set(3, 5, 0);
        pumpAsm.add(inFlange);

        const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 32), steel);
        outlet.rotation.x = Math.PI/2;
        outlet.position.set(3, 2.5, -2);
        pumpAsm.add(outlet);

        // Drive Shaft & Coupling
        const shaftGroup = new THREE.Group();
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 32), chrome);
        shaft.rotation.z = Math.PI / 2;
        
        const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32), darkSteel);
        coupling.rotation.z = Math.PI/2;
        
        shaftGroup.add(shaft, coupling);
        shaftGroup.position.set(0.5, 2.5, 0);
        pumpAsm.add(shaftGroup);
        
        meshes.pumpRotors.push(shaftGroup); // Add to animation

        // Vibration sensors & cables
        const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), cautionMat);
        sensor.position.set(-1, 4.1, 0);
        pumpAsm.add(sensor);
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2, 8), rubber);
        cable.position.set(-1, 3.5, 0.2);
        cable.rotation.x = Math.PI/4;
        pumpAsm.add(cable);

        hpPumpsGroup.add(pumpAsm);
    }

    parts.push({
        name: "Multi-Stage High-Pressure Centrifugal Pumps",
        description: "Behemoth variable-frequency drive (VFD) motors coupled to multi-stage axial centrifugal pumps, generating hydraulic pressures exceeding 800 PSI / 55 Bar.",
        material: "Super Duplex Stainless Steel (SAF 2507), Cast Iron Motor Housings",
        function: "Overcomes the immense natural osmotic pressure of seawater to force water molecules through the semi-permeable RO membranes.",
        assemblyOrder: 5,
        connections: ["Pre-Treatment Effluent", "Energy Recovery Device", "RO Feed Manifold"],
        failureEffect: "Loss of hydraulic pressure, halting desalination.",
        cascadeFailures: ["VFD burn-out", "Shaft shearing", "Water hammer effect on RO vessels"],
        originalPosition: pumpsOriginal.clone(),
        explodedPosition: new THREE.Vector3(-10, 15, -40)
    });
    group.add(hpPumpsGroup);

    // ==========================================
    // 6. ENERGY RECOVERY DEVICES (ISOBARIC CHAMBERS)
    // ==========================================
    const erdOriginal = new THREE.Vector3(-15, 0, -20);
    const erdGroup = new THREE.Group();
    erdGroup.position.copy(erdOriginal);

    for (let e = 0; e < 4; e++) {
        const pxSkid = new THREE.Group();
        pxSkid.position.set(0, 0, e * 12);

        // Rack
        const frame = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 2), darkSteel);
        frame.position.set(0, 1.5, 0);
        pxSkid.add(frame);

        // PX Cylinders (Pressure Exchangers)
        for(let c=0; c<3; c++) {
            const pxCyl = new THREE.Group();
            
            const pxBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3, 32), chrome);
            pxBody.rotation.z = Math.PI/2;
            
            const pxRotor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 2.9, 16), steel);
            pxRotor.rotation.z = Math.PI/2;
            pxRotor.position.z = 0.01; // Slightly offset to see it spinning through window
            meshes.erdRotors.push(pxRotor);

            const pxWindow = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.3), glass);
            pxWindow.position.set(0, 0.4, 0);
            pxWindow.rotation.x = -Math.PI/2;
            
            pxCyl.add(pxBody, pxRotor, pxWindow);
            pxCyl.position.set(0, 3 + (c*0.9), 0);
            pxSkid.add(pxCyl);
        }

        // Connecting complex piping
        const hPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 32), pipeRed);
        hPipe.position.set(-1.8, 4, 0);
        pxSkid.add(hPipe);

        erdGroup.add(pxSkid);
    }

    parts.push({
        name: "Isobaric Energy Recovery Devices (ERD)",
        description: "Array of ceramic rotary pressure exchangers spinning freely inside pressure vessels, transferring hydraulic energy from the high-pressure brine directly to incoming seawater.",
        material: "Alumina Ceramic Rotors, Duplex Steel Housings",
        function: "Recovers up to 98% of the hydraulic energy from the reject brine stream, massively reducing the plant's total electrical footprint.",
        assemblyOrder: 6,
        connections: ["High-Pressure Pumps", "RO Reject Brine Line", "Raw Seawater Line"],
        failureEffect: "Catastrophic drop in plant energy efficiency by over 50%.",
        cascadeFailures: ["Pump motor overload", "Thermal grid overloading"],
        originalPosition: erdOriginal.clone(),
        explodedPosition: new THREE.Vector3(-30, 20, -40)
    });
    group.add(erdGroup);

    // ==========================================
    // 7. REVERSE OSMOSIS MEMBRANE RACKS
    // ==========================================
    const roOriginal = new THREE.Vector3(-30, 0, -20);
    const roGroup = new THREE.Group();
    roGroup.position.copy(roOriginal);

    for (let r = 0; r < 4; r++) { // 4 Massive Skids
        const skidGroup = new THREE.Group();
        skidGroup.position.set(0, 0, r * 15);

        // Base frame
        const skidBase = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 12), darkSteel);
        skidBase.position.y = 0.25;
        skidGroup.add(skidBase);

        // Rack Support Pillars
        const frameGeo = new THREE.BoxGeometry(0.2, 12, 0.2);
        for (let x of [-3.8, 3.8]) {
            for (let z of [-5.8, 0, 5.8]) {
                const pillar = new THREE.Mesh(frameGeo, darkSteel);
                pillar.position.set(x, 6, z);
                skidGroup.add(pillar);
            }
        }
        
        // 240 Pressure Vessels per skid (20 rows, 4 columns, both sides)
        const vGeo = new THREE.CylinderGeometry(0.2, 0.2, 11.5, 16);
        const endGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 16);
        
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 4; col++) {
                // The vessel itself
                const vessel = new THREE.Mesh(vGeo, membraneMat);
                vessel.rotation.x = Math.PI / 2;
                vessel.position.set(-2.5 + (col * 1.66), 1.5 + (row * 0.5), 0);
                skidGroup.add(vessel);

                // Chrome endcaps
                const capFront = new THREE.Mesh(endGeo, chrome);
                capFront.rotation.x = Math.PI / 2;
                capFront.position.set(-2.5 + (col * 1.66), 1.5 + (row * 0.5), 5.75);
                
                const capBack = capFront.clone();
                capBack.position.z = -5.75;
                skidGroup.add(capFront, capBack);

                // High Pressure Feed Lines (Blue)
                const feedLine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), pipeBlue);
                feedLine.position.set(-2.5 + (col * 1.66), 1.5 + (row * 0.5) - 0.2, 5.5);
                skidGroup.add(feedLine);

                // Brine Reject Lines (Red)
                const rejectLine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), pipeRed);
                rejectLine.position.set(-2.5 + (col * 1.66), 1.5 + (row * 0.5) - 0.2, -5.5);
                skidGroup.add(rejectLine);
            }
        }

        // Header Manifolds
        for(let col=0; col<4; col++) {
            // Front Feed Header
            const feedHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 11, 16), pipeBlue);
            feedHeader.position.set(-2.5 + (col * 1.66), 6.5, 5.5);
            skidGroup.add(feedHeader);
            
            // Back Brine Header
            const brineHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 11, 16), pipeRed);
            brineHeader.position.set(-2.5 + (col * 1.66), 6.5, -5.5);
            skidGroup.add(brineHeader);
        }

        roGroup.add(skidGroup);
    }

    parts.push({
        name: "Reverse Osmosis (RO) Membrane Racks",
        description: "Thousands of tightly wound semi-permeable thin-film composite membranes housed in fiberglass pressure vessels, arranged in a massive multi-stage rack configuration.",
        material: "Fiberglass Reinforced Plastic (FRP), Polyamide Thin-Film Composite",
        function: "Executes the fundamental molecular separation, allowing H2O to pass through microscopic pores while rejecting 99.8% of dissolved salts and ions.",
        assemblyOrder: 7,
        connections: ["High-Pressure Feed", "Brine Reject Manifold", "Permeate Collection Manifold"],
        failureEffect: "Membrane rupture or severe fouling.",
        cascadeFailures: ["Salt passage into fresh water", "System overpressurization alarm trigger"],
        originalPosition: roOriginal.clone(),
        explodedPosition: new THREE.Vector3(-50, 30, -20)
    });
    group.add(roGroup);

    // ==========================================
    // 8. BRINE DISCHARGE PIPELINE
    // ==========================================
    const brineOriginal = new THREE.Vector3(-45, 0, 0);
    const brineGroup = new THREE.Group();
    brineGroup.position.copy(brineOriginal);

    // Main colossal header pipe
    const brinePipe = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 40, 32), pipeRed);
    brinePipe.position.set(0, 2, 0);
    brineGroup.add(brinePipe);

    // Diffuser manifold branching off
    for(let i=0; i<5; i++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5, 16), pipeRed);
        branch.rotation.z = Math.PI/2;
        branch.position.set(-2.5, 2, -15 + (i*7.5));
        brineGroup.add(branch);
        
        const flange = createFlange(0.4, 0.6, 0.1, 8, steel);
        flange.rotation.y = Math.PI/2;
        flange.position.set(-5, 2, -15 + (i*7.5));
        brineGroup.add(flange);
    }
    
    // Large discharge valve
    const brineValve = createValveActuator(1.5);
    brineValve.position.set(0, 3, 10);
    brineGroup.add(brineValve);

    parts.push({
        name: "Hypersaline Brine Discharge System",
        description: "Heavy-duty piping network equipped with diffusers designed to handle extremely high-salinity and high-density reject water safely.",
        material: "HDPE and Super Austenitic Stainless Steel",
        function: "Transports concentrated brine back to the ocean, utilizing precision diffusers to mix and dilute the brine instantly, protecting local marine ecosystems.",
        assemblyOrder: 8,
        connections: ["ERD", "RO Reject Headers", "Ocean Outfall"],
        failureEffect: "Brine pipeline rupture or localized ocean dead-zones if diffusers fail.",
        cascadeFailures: ["Environmental hazard", "Regulatory shutdown"],
        originalPosition: brineOriginal.clone(),
        explodedPosition: new THREE.Vector3(-70, 0, 0)
    });
    group.add(brineGroup);

    // ==========================================
    // 9. FRESH WATER (PERMEATE) STORAGE TANK
    // ==========================================
    const tankOriginal = new THREE.Vector3(-20, 0, 30);
    const tankGroup = new THREE.Group();
    tankGroup.position.copy(tankOriginal);

    // Massive Dome Tank
    const tankBody = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 20, 64), concreteMat);
    tankBody.position.y = 10;
    tankGroup.add(tankBody);
    
    const tankDome = new THREE.Mesh(new THREE.SphereGeometry(12, 64, 32, 0, Math.PI*2, 0, Math.PI/2), steel);
    tankDome.position.y = 20;
    tankGroup.add(tankDome);

    // Spiral Staircase
    for(let i=0; i<60; i++) {
        const angle = i * 0.2;
        const step = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 1), grateMat);
        step.position.set(Math.cos(angle)*13.5, i*0.33, Math.sin(angle)*13.5);
        step.rotation.y = -angle;
        tankGroup.add(step);
    }

    // Top railing & Beacon
    const railRing = new THREE.Mesh(new THREE.TorusGeometry(10, 0.1, 8, 64), darkSteel);
    railRing.rotation.x = Math.PI/2;
    railRing.position.y = 24;
    tankGroup.add(railRing);

    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), neonRed);
    beacon.position.y = 24.5;
    tankGroup.add(beacon);
    meshes.rotatingBeacons.push(beacon);

    // Inlet pipe from RO
    const permPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 15, 32), pipeBlue);
    permPipe.rotation.x = Math.PI/2;
    permPipe.position.set(-8, 15, -10);
    tankGroup.add(permPipe);

    parts.push({
        name: "Permeate Storage & Post-Treatment Tank",
        description: "Monolithic concrete and steel storage reservoir where ultra-pure RO permeate is remineralized and chlorinated to become potable drinking water.",
        material: "Epoxy-Lined Reinforced Concrete",
        function: "Provides surge capacity, buffer storage, and contact time for final chemical post-treatment before distribution to municipal grids.",
        assemblyOrder: 9,
        connections: ["RO Permeate Header", "Municipal Grid", "Post-Treatment Dosing"],
        failureEffect: "Contamination of potable water or tank structural failure.",
        cascadeFailures: ["City water shortage", "Flooding"],
        originalPosition: tankOriginal.clone(),
        explodedPosition: new THREE.Vector3(-30, 10, 60)
    });
    group.add(tankGroup);

    // ==========================================
    // 10. CENTRAL CONTROL ROOM
    // ==========================================
    const ctrlOriginal = new THREE.Vector3(15, 0, 15);
    const ctrlGroup = new THREE.Group();
    ctrlGroup.position.copy(ctrlOriginal);

    // Building Structure
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(15, 8, 10), concreteMat);
    bldg.position.y = 4;
    ctrlGroup.add(bldg);

    // Slanted observation windows
    const windowGeo = new THREE.BoxGeometry(14.8, 5, 0.2);
    const wGlass = new THREE.Mesh(windowGeo, tinted);
    wGlass.position.set(0, 5, 4.9);
    wGlass.rotation.x = -0.1;
    ctrlGroup.add(wGlass);

    // Interior Details (Screens and Desks)
    for(let i=0; i<3; i++) {
        const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), darkSteel);
        desk.position.set(-4 + (i*4), 3, 3);
        
        const monitorGeo = new THREE.BoxGeometry(1, 0.6, 0.1);
        
        const monitor1 = new THREE.Mesh(monitorGeo, screenMat);
        monitor1.position.set(-4.5 + (i*4), 3.8, 2.5);
        monitor1.rotation.y = Math.PI/6;
        
        const monitor2 = new THREE.Mesh(monitorGeo, screenMat);
        monitor2.position.set(-3.5 + (i*4), 3.8, 2.5);
        monitor2.rotation.y = -Math.PI/6;

        meshes.screens.push(monitor1, monitor2);
        ctrlGroup.add(desk, monitor1, monitor2);
    }

    // Roof Antenna & Radars
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8), darkSteel);
    antenna.position.set(-6, 10, -3);
    ctrlGroup.add(antenna);

    const radarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), darkSteel);
    radarBase.position.set(5, 8.5, 0);
    const radarDish = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16, 0, Math.PI, 0, Math.PI), steel);
    radarDish.position.set(5, 9, 0);
    radarDish.rotation.x = Math.PI/4;
    ctrlGroup.add(radarBase, radarDish);
    meshes.erdRotors.push(radarBase); // rotate radar

    parts.push({
        name: "SCADA Central Control & Command Center",
        description: "Hardened facility featuring blast-resistant tinted glazing, housing the Supervisory Control and Data Acquisition (SCADA) server banks and operator consoles.",
        material: "Reinforced Concrete, Ballistic Tinted Glass, Silicon Circuitry",
        function: "Serves as the neurological center of the plant, monitoring flow rates, pressure differentials, salinity, and pH across 10,000+ sensor nodes in real-time.",
        assemblyOrder: 10,
        connections: ["Plant-wide Sensor Network", "Substation", "City Telecom Grid"],
        failureEffect: "Loss of automated control and telemetry.",
        cascadeFailures: ["Blind operation", "Automated emergency safety shutdown"],
        originalPosition: ctrlOriginal.clone(),
        explodedPosition: new THREE.Vector3(30, 30, 30)
    });
    group.add(ctrlGroup);

    // ==========================================
    // 11. ELECTRICAL SUBSTATION & TRANSFORMERS
    // ==========================================
    const subOriginal = new THREE.Vector3(35, 0, -10);
    const subGroup = new THREE.Group();
    subGroup.position.copy(subOriginal);

    // Substation pad
    const subPad = new THREE.Mesh(new THREE.BoxGeometry(15, 0.5, 10), concreteMat);
    subPad.position.y = 0.25;
    subGroup.add(subPad);

    // 2 Massive Transformers
    for(let t=0; t<2; t++) {
        const transBody = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), steel);
        transBody.position.set(-4 + (t*8), 3, 0);
        subGroup.add(transBody);

        // Cooling radiators
        for(let r=0; r<10; r++) {
            const rad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4, 2), darkSteel);
            rad.position.set(-6 + (t*8) + (r*0.4), 3, 2.5);
            subGroup.add(rad);
        }

        // Ceramic insulators
        for(let i=0; i<3; i++) {
            const insulator = new THREE.Group();
            for(let p=0; p<5; p++) {
                const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), plastic);
                plate.position.y = p*0.2;
                insulator.add(plate);
            }
            insulator.position.set(-5 + (t*8) + (i*1), 5.5, 0);
            subGroup.add(insulator);
            
            // Spark effect (hidden, flashes via animation)
            const spark = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), neonBlue);
            spark.position.set(-5 + (t*8) + (i*1), 6.5, 0);
            spark.material.opacity = 0;
            spark.material.transparent = true;
            meshes.lights.push(spark);
            subGroup.add(spark);
        }
    }

    parts.push({
        name: "High-Voltage Electrical Substation",
        description: "Steps down massive incoming municipal grid voltage to supply the colossal megawatts required by the high-pressure pump VFDs.",
        material: "Copper Coils, Transformer Oil, Ceramic Insulators, Steel",
        function: "Powers the entire facility, isolating sensitive electronics from grid surges while maintaining a massive uninterrupted power draw.",
        assemblyOrder: 11,
        connections: ["City Power Grid", "VFD Motors", "Control Center"],
        failureEffect: "Total plant blackout.",
        cascadeFailures: ["Pump starvation", "Water hammer", "System depressurization"],
        originalPosition: subOriginal.clone(),
        explodedPosition: new THREE.Vector3(60, 10, -30)
    });
    group.add(subGroup);

    // ==========================================
    // 12. SURGE VESSELS & ACCUMULATORS
    // ==========================================
    const surgeOriginal = new THREE.Vector3(-10, 0, 5);
    const surgeGroup = new THREE.Group();
    surgeGroup.position.copy(surgeOriginal);

    for(let i=0; i<3; i++) {
        // Spherical pressure tank
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), pipeBlue);
        sphere.position.set(0, 4, i*6);
        surgeGroup.add(sphere);

        // Legs
        for(let l=0; l<4; l++) {
            const angle = (l/4)*Math.PI*2;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), darkSteel);
            leg.position.set(Math.cos(angle)*1.5, 2, i*6 + Math.sin(angle)*1.5);
            surgeGroup.add(leg);
        }

        // Pressure Gauge
        const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16), chrome);
        gauge.rotation.x = Math.PI/2;
        gauge.position.set(0, 4, i*6 + 2.1);
        
        const dial = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), screenMat);
        dial.position.set(0, 4, i*6 + 2.16);
        meshes.screens.push(dial);
        
        surgeGroup.add(gauge, dial);
    }

    parts.push({
        name: "Hydraulic Surge Accumulators",
        description: "Heavy-walled spherical pressure vessels charged with nitrogen gas, mounted on the high-pressure feed manifolds.",
        material: "Forged Carbon Steel, Internal Bladder",
        function: "Absorbs violent hydraulic shocks and 'water hammer' effects caused by pump starts/stops, protecting the fragile RO membranes from shattering.",
        assemblyOrder: 12,
        connections: ["High-Pressure Piping Network"],
        failureEffect: "Uncontrolled hydraulic shockwaves propagating through pipes.",
        cascadeFailures: ["Explosive pipe rupture", "Membrane mechanical destruction"],
        originalPosition: surgeOriginal.clone(),
        explodedPosition: new THREE.Vector3(-20, 30, 20)
    });
    group.add(surgeGroup);

    // ==========================================
    // 13. MAIN PIPE NETWORK (CONNECTIVE TISSUE)
    // ==========================================
    const pipeNetGroup = new THREE.Group();
    
    // Connect Intake to Pre-treat
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 20, 32), pipeGreen);
    p1.rotation.z = Math.PI/2;
    p1.position.set(20, 1.5, 10);
    pipeNetGroup.add(p1);

    // Connect Pre-treat to Pumps
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 30, 32), pipeBlue);
    p2.rotation.x = Math.PI/2;
    p2.position.set(10, 1.2, -15);
    pipeNetGroup.add(p2);

    // Lots of flanges and elbows
    const el1 = createElbow(1.5, 1.5, Math.PI/2, pipeGreen);
    el1.rotation.x = Math.PI/2;
    el1.position.set(10, 1.5, 10);
    pipeNetGroup.add(el1);

    parts.push({
        name: "Super-Duplex Pipe Network",
        description: "Hundreds of meters of precision-welded, corrosion-resistant pipework equipped with numerous isolation valves, flow meters, and pressure relief valves.",
        material: "Super Duplex Stainless Steel, Flanged & Welded",
        function: "Safely routes hyper-saline, ultra-high-pressure fluids across the plant's various operational stages with zero leakage.",
        assemblyOrder: 13,
        connections: ["All primary modules"],
        failureEffect: "High-pressure toxic/saline fluid leaks.",
        cascadeFailures: ["Flooding", "Electrocution hazard", "Total plant shutdown"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0, 40, 0)
    });
    group.add(pipeNetGroup);

    // ==========================================
    // 14. CATWALKS & ACCESS LADDERS
    // ==========================================
    const catwalkGroup = new THREE.Group();
    
    // Main elevated walkway over the pumps
    const walk1 = new THREE.Mesh(new THREE.BoxGeometry(40, 0.2, 3), grateMat);
    walk1.position.set(-10, 8, -15);
    catwalkGroup.add(walk1);

    // Handrails
    for(let i=0; i<20; i++) {
        const railPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), cautionMat);
        railPost.position.set(-29 + (i*2), 8.6, -13.6);
        const railPost2 = railPost.clone();
        railPost2.position.set(-29 + (i*2), 8.6, -16.4);
        catwalkGroup.add(railPost, railPost2);
    }
    const topRail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 40, 8), cautionMat);
    topRail1.rotation.z = Math.PI/2;
    topRail1.position.set(-10, 9.2, -13.6);
    const topRail2 = topRail1.clone();
    topRail2.position.set(-10, 9.2, -16.4);
    catwalkGroup.add(topRail1, topRail2);

    parts.push({
        name: "Operator Catwalks & Safety Gratings",
        description: "Intricate network of anti-slip fiberglass grating, stairs, and OSHA-compliant yellow handrails bridging the entire facility.",
        material: "FRP (Fiberglass Reinforced Plastic), Galvanized Steel",
        function: "Allows safe vertical and horizontal access for maintenance crews to inspect gauges, perform valve actuations, and service heavy equipment.",
        assemblyOrder: 14,
        connections: ["Foundation", "Pump Skids", "Tanks"],
        failureEffect: "Loss of safe maintenance access.",
        cascadeFailures: ["Maintenance delays", "Safety incidents"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0, 50, -15)
    });
    group.add(catwalkGroup);

    // ==========================================
    // 15. EXHAUST & COOLING FANS
    // ==========================================
    const hvacGroup = new THREE.Group();

    // Place fans on Control Room and Substation
    const fanLocations = [
        new THREE.Vector3(12, 8.5, 15),
        new THREE.Vector3(18, 8.5, 15),
        new THREE.Vector3(33, 6, -10),
        new THREE.Vector3(37, 6, -10)
    ];

    fanLocations.forEach(loc => {
        const hvacUnit = new THREE.Group();
        
        const box = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), steel);
        box.position.y = 0.5;
        
        const fanHole = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.1, 32), darkSteel);
        fanHole.position.y = 0.5;
        
        // Fan Blades
        const bladeGroup = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), chrome);
        bladeGroup.add(hub);
        
        for(let b=0; b<4; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.3), darkSteel);
            blade.rotation.y = (b * Math.PI) / 2;
            blade.rotation.x = Math.PI/6;
            bladeGroup.add(blade);
        }
        bladeGroup.position.y = 1;
        meshes.fans.push(bladeGroup);
        
        hvacUnit.add(box, fanHole, bladeGroup);
        hvacUnit.position.copy(loc);
        hvacGroup.add(hvacUnit);
    });

    parts.push({
        name: "Industrial HVAC & Thermal Extraction",
        description: "Heavy-duty thermal extraction units and chillers mounted on critical infrastructure roofs.",
        material: "Galvanized Steel, Aluminum Blades",
        function: "Extracts immense radiant heat generated by the VFDs, servers, and transformers to prevent catastrophic thermal runaways.",
        assemblyOrder: 15,
        connections: ["Control Room", "Substation"],
        failureEffect: "Rapid overheating of electrical systems.",
        cascadeFailures: ["VFD meltdown", "SCADA server failure", "Transformer fire"],
        originalPosition: new THREE.Vector3(0,0,0),
        explodedPosition: new THREE.Vector3(0, 45, 0)
    });
    group.add(hvacGroup);


    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary function of the High-Pressure Pumps in this facility?",
            options: [
                "To cool the transformers",
                "To overcome the natural osmotic pressure of seawater",
                "To add chemicals to the water",
                "To pump brine into the control room"
            ],
            correctAnswer: 1,
            explanation: "High-pressure pumps generate immense force (often exceeding 800 PSI) required to overcome the natural osmotic pressure of seawater, forcing H2O molecules through the semi-permeable RO membranes while leaving salts behind."
        },
        {
            question: "Why are Isobaric Energy Recovery Devices (ERDs) critical to modern desalination plant design?",
            options: [
                "They generate electricity to sell to the grid",
                "They capture hydraulic energy from high-pressure brine to pressurize incoming seawater",
                "They filter out large marine debris",
                "They act as safety valves to prevent pipe explosions"
            ],
            correctAnswer: 1,
            explanation: "ERDs transfer the hydraulic pressure from the highly pressurized waste brine stream directly into the incoming raw seawater stream. This recovers up to 98% of wasted pressure energy, massively reducing the electrical load of the main pumps."
        },
        {
            question: "What is the purpose of the massive Pre-Treatment Filters before the RO racks?",
            options: [
                "To remove suspended solids, organics, and particulates",
                "To add salt back into the water",
                "To increase the pressure of the water",
                "To separate the hydrogen and oxygen molecules"
            ],
            correctAnswer: 0,
            explanation: "Pre-treatment filters (using layers of sand, anthracite, etc.) remove microscopic particulates and biological matter to lower the Silt Density Index (SDI). If this is not done, the incredibly sensitive RO membranes will rapidly clog (foul) and be permanently destroyed."
        },
        {
            question: "How do Reverse Osmosis (RO) membranes successfully separate salt from water?",
            options: [
                "By boiling the water and collecting steam",
                "By using magnets to pull salt ions away",
                "By forcing water through a semi-permeable membrane at high pressure",
                "By freezing the water into ice blocks"
            ],
            correctAnswer: 2,
            explanation: "RO works by applying high hydraulic pressure to force water through a semi-permeable thin-film composite membrane. The microscopic pores allow water molecules to pass but physically block larger dissolved salt ions and impurities."
        },
        {
            question: "Why does the Brine Discharge System require specialized diffusers instead of a single open pipe?",
            options: [
                "To make the water look prettier",
                "To instantly dilute the hypersaline brine and protect local marine ecosystems",
                "To generate waves for surfers",
                "To stop fish from swimming up the pipe"
            ],
            correctAnswer: 1,
            explanation: "The reject brine is roughly twice as salty as normal seawater and denser. If dumped in one spot, it sinks and creates a toxic, oxygen-deprived 'dead zone' on the sea floor. Diffusers spray the brine over a large area to ensure rapid dilution into the surrounding ocean."
        }
    ];


    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed) {
        const adjustedSpeed = speed * 1.5;
        
        // Spin High-Pressure Pump shafts and couplings
        meshes.pumpRotors.forEach(rotor => {
            rotor.rotation.x += 0.4 * adjustedSpeed;
        });

        // Spin ERD Rotary pressure exchangers
        meshes.erdRotors.forEach(rotor => {
            rotor.rotation.y += 0.3 * adjustedSpeed;
        });

        // Spin HVAC Fans
        meshes.fans.forEach(fan => {
            fan.rotation.y -= 0.2 * adjustedSpeed;
        });

        // Actuate dosing pistons in chemical station
        meshes.dosingPistons.forEach((piston, idx) => {
            piston.position.z = 0.4 + Math.sin((time * 10) + idx) * 0.1;
        });

        // Substation electrical arcing effect (flickering lights)
        meshes.lights.forEach((light, idx) => {
            if(Math.random() > 0.95) {
                light.material.opacity = 0.8;
                light.scale.set(1.5,1.5,1.5);
            } else {
                light.material.opacity = 0;
                light.scale.set(1,1,1);
            }
        });

        // Rotate Warning Beacons on tanks
        meshes.rotatingBeacons.forEach(beacon => {
            beacon.material.emissiveIntensity = 1 + Math.sin(time * 5) * 1;
        });

        // Blink Status Lights on Filters and Control Screens
        meshes.indicatorLights.forEach((light, idx) => {
            light.material.emissiveIntensity = 1.5 + Math.sin((time * 2) + idx) * 0.5;
        });

        // Pulsate Control Room Screens (Data Processing Effect)
        meshes.screens.forEach((screen, idx) => {
            screen.material.emissiveIntensity = 0.8 + Math.random() * 0.4;
        });
        
        // Slowly actuate large automated valves back and forth
        meshes.valves.forEach((valve, idx) => {
            valve.rotation.z = Math.sin((time * 0.5) + idx) * (Math.PI / 4);
        });
    }

    return { group, parts, description: "Advanced Reverse Osmosis Desalination Plant", quizQuestions, animate };
}

// Auto-generated missing stub
export function createDesalinationPlant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
