import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const machineGroup = new THREE.Group();
    const parts = [];

    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const glowingYellow = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 2 });
    const brightGreen = new THREE.MeshStandardMaterial({ color: 0x33ff33, roughness: 0.4, metalness: 0.6 });
    const dirtySteel = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9, metalness: 0.5 });
    
    // Meshes for animation
    const meshes = {
        wheels: [],
        pickupReel: null,
        augers: [],
        rotor: null,
        rollers: [],
        belts: null,
        tailgate: null,
        pto: null,
        hydraulics: [],
        tines: []
    };

    // 1. Chassis Frame
    const chassisGroup = new THREE.Group();
    const frameShape = new THREE.Shape();
    frameShape.moveTo(0, 0);
    frameShape.lineTo(4, 0);
    frameShape.lineTo(4.5, 1);
    frameShape.lineTo(4.5, 4);
    frameShape.lineTo(-1, 4);
    frameShape.lineTo(-1.5, 2);
    frameShape.lineTo(0, 0);

    const frameExtrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const frameGeom = new THREE.ExtrudeGeometry(frameShape, frameExtrudeSettings);
    
    const leftFrame = new THREE.Mesh(frameGeom, steel);
    leftFrame.position.set(0, 1, -1.2);
    chassisGroup.add(leftFrame);

    const rightFrame = new THREE.Mesh(frameGeom, steel);
    rightFrame.position.set(0, 1, 1.1);
    chassisGroup.add(rightFrame);

    // Cross members
    for(let i=0; i<4; i++) {
        const crossMem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 16), steel);
        crossMem.rotation.x = Math.PI/2;
        crossMem.position.set(i*1.2, 1.2, 0);
        chassisGroup.add(crossMem);
    }
    
    machineGroup.add(chassisGroup);
    parts.push({
        name: "Main Chassis Frame",
        description: "Heavy-duty steel backbone of the baler, providing structural integrity for the compression chamber.",
        material: "Steel",
        function: "Supports all components and withstands high tension forces from bale formation.",
        assemblyOrder: 1,
        connections: ["Axle", "Tailgate", "Drawbar"],
        failureEffect: "Structural collapse",
        cascadeFailures: ["Complete machine destruction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // 2. Drawbar & PTO
    const drawbarGroup = new THREE.Group();
    const drawbarGeom = new THREE.BoxGeometry(2.5, 0.15, 0.3);
    const drawbar = new THREE.Mesh(drawbarGeom, darkSteel);
    drawbar.position.set(-2, 1.2, 0);
    drawbarGroup.add(drawbar);

    const hitchGeom = new THREE.TorusGeometry(0.15, 0.05, 16, 32);
    const hitch = new THREE.Mesh(hitchGeom, steel);
    hitch.position.set(-3.2, 1.2, 0);
    hitch.rotation.x = Math.PI/2;
    drawbarGroup.add(hitch);

    // PTO Shaft
    const ptoGroup = new THREE.Group();
    const ptoOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), plastic);
    ptoOuter.rotation.z = Math.PI/2;
    ptoGroup.add(ptoOuter);
    
    const ptoInner = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16), chrome);
    ptoInner.rotation.z = Math.PI/2;
    ptoInner.position.x = -0.5;
    ptoGroup.add(ptoInner);

    // Universal Joint
    const uJoint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), darkSteel);
    uJoint.position.x = 0.8;
    ptoGroup.add(uJoint);

    ptoGroup.position.set(-1.5, 1.4, 0);
    drawbarGroup.add(ptoGroup);
    meshes.pto = ptoGroup;

    machineGroup.add(drawbarGroup);
    parts.push({
        name: "Drawbar & PTO Driveline",
        description: "Connects the baler to the tractor and transfers mechanical power via the Power Take-Off (PTO) shaft.",
        material: "Dark Steel / Chrome",
        function: "Power transmission and towing link.",
        assemblyOrder: 2,
        connections: ["Chassis", "Tractor"],
        failureEffect: "Loss of power to all systems",
        cascadeFailures: ["Pickup reel stops", "Rotors stop", "Blockage"],
        originalPosition: {x: -2, y: 1.2, z: 0},
        explodedPosition: {x: -4, y: 1.2, z: 0}
    });

    // 3. Axle and Wheels
    const axleGroup = new THREE.Group();
    const mainAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.2, 32), steel);
    mainAxle.rotation.x = Math.PI/2;
    mainAxle.position.set(1.5, 0.8, 0);
    axleGroup.add(mainAxle);

    function createWheel() {
        const wheelGroup = new THREE.Group();
        // Tire base
        const tireGeom = new THREE.TorusGeometry(0.6, 0.35, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Tread Lugs
        const lugGeom = new THREE.BoxGeometry(0.7, 0.08, 0.15);
        for(let i=0; i<40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0);
            lug.rotation.z = angle;
            // Alternating chevron pattern
            lug.rotation.y = (i % 2 === 0) ? Math.PI/6 : -Math.PI/6;
            lug.rotation.x = Math.PI/2;
            wheelGroup.add(lug);
        }

        // Rim
        const rimGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
        const rim = new THREE.Mesh(rimGeom, steel);
        rim.rotation.x = Math.PI/2;
        wheelGroup.add(rim);

        // Spokes
        for(let i=0; i<8; i++) {
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), chrome);
            spoke.rotation.z = (i / 8) * Math.PI;
            wheelGroup.add(spoke);
        }

        return wheelGroup;
    }

    const leftWheel = createWheel();
    leftWheel.position.set(1.5, 0.8, -1.6);
    axleGroup.add(leftWheel);
    meshes.wheels.push(leftWheel);

    const rightWheel = createWheel();
    rightWheel.position.set(1.5, 0.8, 1.6);
    axleGroup.add(rightWheel);
    meshes.wheels.push(rightWheel);

    machineGroup.add(axleGroup);
    parts.push({
        name: "Flotation Tires & Axle",
        description: "High-flotation pneumatic tires with deep V-tread lugs and heavy-duty axle.",
        material: "Rubber / Steel",
        function: "Supports the massive weight of the machine and the bale while minimizing soil compaction.",
        assemblyOrder: 3,
        connections: ["Chassis"],
        failureEffect: "Machine immobilization",
        cascadeFailures: ["Chassis dragging", "Structural bending"],
        originalPosition: {x: 1.5, y: 0.8, z: 0},
        explodedPosition: {x: 1.5, y: -1, z: 0}
    });

    // 4. Pickup Reel
    const pickupGroup = new THREE.Group();
    const pickupWidth = 2.2;
    const pickupDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, pickupWidth, 32), steel);
    pickupDrum.rotation.x = Math.PI/2;
    pickupGroup.add(pickupDrum);

    // Tine bars and tines
    const numBars = 5;
    const tinesPerBar = 25;
    const tinesGroup = new THREE.Group();
    for(let b=0; b<numBars; b++) {
        const barAngle = (b / numBars) * Math.PI * 2;
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, pickupWidth, 16), chrome);
        const barRadius = 0.18;
        bar.position.set(Math.cos(barAngle) * barRadius, Math.sin(barAngle) * barRadius, 0);
        bar.rotation.x = Math.PI/2;
        pickupGroup.add(bar);

        // Add tines to bar
        for(let t=0; t<tinesPerBar; t++) {
            const tineGeom = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0.1, 0.15, 0),
                    new THREE.Vector3(0.25, 0.2, 0)
                ]),
                8, 0.01, 8, false
            );
            const tine = new THREE.Mesh(tineGeom, steel);
            const zPos = -pickupWidth/2 + (t / (tinesPerBar-1)) * pickupWidth;
            tine.position.set(Math.cos(barAngle)*barRadius, Math.sin(barAngle)*barRadius, zPos);
            tine.rotation.z = barAngle;
            tinesGroup.add(tine);
        }
    }
    pickupGroup.add(tinesGroup);
    
    // Windguard roller
    const windguard = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, pickupWidth, 16), plastic);
    windguard.rotation.x = Math.PI/2;
    windguard.position.set(0.3, 0.3, 0);
    pickupGroup.add(windguard);

    pickupGroup.position.set(-0.5, 0.4, 0);
    machineGroup.add(pickupGroup);
    meshes.pickupReel = pickupGroup;

    parts.push({
        name: "Camless Pickup Reel",
        description: "High-speed rotating drum with curved steel tines to lift the crop from the windrow.",
        material: "Steel / Chrome",
        function: "Gathers crop material from the ground and feeds it into the baler.",
        assemblyOrder: 4,
        connections: ["Chassis", "Feed Auger"],
        failureEffect: "Crop left in field",
        cascadeFailures: ["Blockage ahead of rotor"],
        originalPosition: {x: -0.5, y: 0.4, z: 0},
        explodedPosition: {x: -1.5, y: -0.5, z: 0}
    });

    // 5. Feed Augers & Cutting Rotor
    const feedGroup = new THREE.Group();
    
    // Augers (Left and Right)
    const augerRadius = 0.15;
    const augerLength = 0.6;
    function createAuger(spiralDir) {
        const agrp = new THREE.Group();
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, augerLength, 16), steel);
        core.rotation.x = Math.PI/2;
        agrp.add(core);

        const flighting = new THREE.Mesh(new THREE.CylinderGeometry(augerRadius, augerRadius, augerLength, 32, 10, true), dirtySteel);
        // Deform cylinder into spiral
        const pos = flighting.geometry.attributes.position;
        for(let i=0; i<pos.count; i++) {
            const z = pos.getZ(i);
            const angle = (z / augerLength) * Math.PI * 4 * spiralDir;
            const x = pos.getX(i);
            const y = pos.getY(i);
            const rad = Math.sqrt(x*x + y*y);
            const newX = rad * Math.cos(Math.atan2(y, x) + angle);
            const newY = rad * Math.sin(Math.atan2(y, x) + angle);
            pos.setXY(i, newX, newY);
        }
        flighting.geometry.computeVertexNormals();
        flighting.rotation.x = Math.PI/2;
        agrp.add(flighting);
        return agrp;
    }

    const leftAuger = createAuger(1);
    leftAuger.position.set(0, 0, -0.8);
    feedGroup.add(leftAuger);
    meshes.augers.push(leftAuger);

    const rightAuger = createAuger(-1);
    rightAuger.position.set(0, 0, 0.8);
    feedGroup.add(rightAuger);
    meshes.augers.push(rightAuger);

    // Cutting Rotor (center)
    const rotorLength = 1.0;
    const rotorGrp = new THREE.Group();
    const rotorCore = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, rotorLength, 32), steel);
    rotorCore.rotation.x = Math.PI/2;
    rotorGrp.add(rotorCore);
    
    for(let i=0; i<15; i++) {
        for(let j=0; j<3; j++) { // 3-lobe star pattern
            const star = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.02), steel);
            const angle = (j / 3) * Math.PI * 2 + (i * 0.2);
            star.rotation.z = angle;
            star.position.z = -rotorLength/2 + (i / 14) * rotorLength;
            rotorGrp.add(star);
        }
    }
    feedGroup.add(rotorGrp);
    meshes.rotor = rotorGrp;

    feedGroup.position.set(0.2, 0.7, 0);
    machineGroup.add(feedGroup);
    
    parts.push({
        name: "Integral Rotor & Pre-Cutter",
        description: "Heavy duty rotor with hardox tines and converging side augers. Includes 15 drop-floor knives.",
        material: "Hardened Steel",
        function: "Consolidates crop flow and chops it before entering the bale chamber to increase density.",
        assemblyOrder: 5,
        connections: ["Pickup Reel", "Bale Chamber"],
        failureEffect: "Blockage and poor bale density",
        cascadeFailures: ["Shear bolt failure", "PTO overload"],
        originalPosition: {x: 0.2, y: 0.7, z: 0},
        explodedPosition: {x: 0.2, y: -0.5, z: 0}
    });

    // 6. Bale Chamber Rollers
    const chamberGroup = new THREE.Group();
    const numRollers = 18;
    const chamberRadius = 1.2;
    const rollerLength = 1.5;
    const rollers = [];

    for(let i=0; i<numRollers; i++) {
        // Leave a gap at the bottom front for crop entry
        if(i >= 12 && i <= 14) continue; 

        const angle = (i / numRollers) * Math.PI * 2 + Math.PI/4;
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, rollerLength, 32), steel);
        
        // Add grip strips to roller
        for(let s=0; s<6; s++) {
            const strip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.25, rollerLength), darkSteel);
            strip.rotation.z = (s/6) * Math.PI * 2;
            roller.add(strip);
        }

        roller.rotation.x = Math.PI/2;
        roller.position.set(Math.cos(angle) * chamberRadius, Math.sin(angle) * chamberRadius, 0);
        chamberGroup.add(roller);
        rollers.push(roller);
    }
    meshes.rollers = rollers;

    chamberGroup.position.set(1.5, 2.2, 0);
    machineGroup.add(chamberGroup);

    parts.push({
        name: "Fixed Chamber Rollers",
        description: "18 heavily ribbed, seamless steel rollers forming a perfectly circular compression chamber.",
        material: "Steel",
        function: "Rotates the incoming crop to form a dense, perfectly cylindrical bale.",
        assemblyOrder: 6,
        connections: ["Rotor", "Tailgate", "Driveline"],
        failureEffect: "Irregular bale shape",
        cascadeFailures: ["Bearing failure", "Fire risk from friction"],
        originalPosition: {x: 1.5, y: 2.2, z: 0},
        explodedPosition: {x: 1.5, y: 4, z: 0}
    });

    // 7. Wrapping System (Net Wrap)
    const wrapGroup = new THREE.Group();
    const wrapRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.3, 32), plastic);
    wrapRoll.rotation.x = Math.PI/2;
    wrapGroup.add(wrapRoll);

    const wrapArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 1.4), aluminum);
    wrapArm.position.set(0.2, -0.1, 0);
    wrapGroup.add(wrapArm);

    const netMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const netPath = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.3), netMaterial);
    netPath.position.set(0.25, -0.2, 0);
    netPath.rotation.y = Math.PI/2;
    netPath.rotation.x = -Math.PI/6;
    wrapGroup.add(netPath);

    wrapGroup.position.set(0.3, 3.2, 0);
    machineGroup.add(wrapGroup);
    
    parts.push({
        name: "Net Wrap Application System",
        description: "Motorized active tension system that feeds net wrap directly into the chamber.",
        material: "Aluminum / Plastic",
        function: "Secures the formed bale tightly before ejection.",
        assemblyOrder: 7,
        connections: ["Bale Chamber"],
        failureEffect: "Bale unravels upon ejection",
        cascadeFailures: ["Net wrapping around rollers"],
        originalPosition: {x: 0.3, y: 3.2, z: 0},
        explodedPosition: {x: -1, y: 5, z: 0}
    });

    // 8. Tailgate Mechanism
    const tailgateGroup = new THREE.Group();
    // Pivot at top
    tailgateGroup.position.set(1.5, 3.5, 0); 

    // The curved rear shell
    const tgCurve = new THREE.Shape();
    tgCurve.moveTo(0, 0);
    tgCurve.absarc(0, -1.3, 1.4, Math.PI/2, -Math.PI/4, true);
    tgCurve.lineTo(0.5, -2.5);
    tgCurve.lineTo(1.0, -1.5);
    tgCurve.lineTo(0.2, 0);
    const tgGeom = new THREE.ExtrudeGeometry(tgCurve, { depth: 1.6, bevelEnabled: false });
    
    const tgMesh = new THREE.Mesh(tgGeom, brightGreen);
    tgMesh.position.z = -0.8;
    tailgateGroup.add(tgMesh);
    
    machineGroup.add(tailgateGroup);
    meshes.tailgate = tailgateGroup;

    parts.push({
        name: "Clam-Shell Tailgate",
        description: "Massive curved rear housing that opens hydraulically to eject the finished bale.",
        material: "Steel / Sheet Metal",
        function: "Contains the rear half of the bale chamber and ejects the bale.",
        assemblyOrder: 8,
        connections: ["Chassis", "Hydraulic Cylinders"],
        failureEffect: "Cannot eject bale",
        cascadeFailures: ["Hydraulic lockout", "Bale fire from trapped friction"],
        originalPosition: {x: 1.5, y: 3.5, z: 0},
        explodedPosition: {x: 4, y: 5, z: 0}
    });

    // 9. Hydraulic Cylinders for Tailgate
    const hydraulicGroup = new THREE.Group();
    
    function createHydraulicCyl() {
        const cylGrp = new THREE.Group();
        // Barrel
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 16), darkSteel);
        barrel.position.y = 0.6;
        cylGrp.add(barrel);
        // Rod
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 16), chrome);
        rod.position.y = 1.4;
        cylGrp.add(rod);
        return cylGrp;
    }

    const leftHydraulic = createHydraulicCyl();
    leftHydraulic.position.set(1.0, 1.2, -1.0);
    leftHydraulic.rotation.z = -Math.PI/6;
    hydraulicGroup.add(leftHydraulic);

    const rightHydraulic = createHydraulicCyl();
    rightHydraulic.position.set(1.0, 1.2, 1.0);
    rightHydraulic.rotation.z = -Math.PI/6;
    hydraulicGroup.add(rightHydraulic);

    machineGroup.add(hydraulicGroup);
    meshes.hydraulics.push(leftHydraulic.children[1]); // the rod
    meshes.hydraulics.push(rightHydraulic.children[1]);

    parts.push({
        name: "Tailgate Lift Cylinders",
        description: "Dual double-acting heavy duty hydraulic cylinders.",
        material: "Chrome / Steel",
        function: "Forces the massive tailgate open and locks it closed during baling.",
        assemblyOrder: 9,
        connections: ["Chassis", "Tailgate", "Tractor Hydraulics"],
        failureEffect: "Tailgate falls shut or opens during baling",
        cascadeFailures: ["Loss of hydraulic pressure", "Bale deformation"],
        originalPosition: {x: 1.0, y: 1.2, z: 0},
        explodedPosition: {x: 1.0, y: 1.2, z: 2.5}
    });

    // 10. Side Panels (Guards)
    const sidePanelGeom = new THREE.PlaneGeometry(3.5, 3);
    const leftPanel = new THREE.Mesh(sidePanelGeom, brightGreen);
    leftPanel.position.set(1.5, 2.0, -1.05);
    leftPanel.rotation.y = Math.PI;
    machineGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(sidePanelGeom, brightGreen);
    rightPanel.position.set(1.5, 2.0, 1.05);
    machineGroup.add(rightPanel);

    // Vents on panels
    for(let i=0; i<5; i++) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), darkSteel);
        vent.position.set(1.0, 2.5 - i*0.15, 1.06);
        machineGroup.add(vent);
        
        const lVent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), darkSteel);
        lVent.position.set(1.0, 2.5 - i*0.15, -1.06);
        machineGroup.add(lVent);
    }

    parts.push({
        name: "Aerodynamic Side Shields",
        description: "Gull-wing style fiberglass composite side panels with cooling vents.",
        material: "Fiberglass / Paint",
        function: "Protects complex drive systems from dust and operator from moving parts.",
        assemblyOrder: 10,
        connections: ["Chassis"],
        failureEffect: "Exposure of moving parts",
        cascadeFailures: ["Debris buildup on chains", "Safety hazard"],
        originalPosition: {x: 1.5, y: 2.0, z: 1.05},
        explodedPosition: {x: 1.5, y: 2.0, z: 3}
    });

    // 11. Driveline Chains and Gears
    const driveGroup = new THREE.Group();
    const mainSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32), darkSteel);
    mainSprocket.rotation.x = Math.PI/2;
    mainSprocket.position.set(0.5, 2.0, 0.95);
    driveGroup.add(mainSprocket);

    const secondarySprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32), darkSteel);
    secondarySprocket.rotation.x = Math.PI/2;
    secondarySprocket.position.set(1.5, 3.0, 0.95);
    driveGroup.add(secondarySprocket);

    const chainPath = new THREE.Shape();
    chainPath.absarc(0.5, 2.0, 0.4, Math.PI/2, Math.PI*1.5, false);
    chainPath.lineTo(1.5, 2.8);
    chainPath.absarc(1.5, 3.0, 0.2, Math.PI*1.5, Math.PI/2, false);
    chainPath.lineTo(0.5, 2.4);
    
    const chainGeom = new THREE.ExtrudeGeometry(chainPath, { depth: 0.02, bevelEnabled: false });
    const chainMesh = new THREE.Mesh(chainGeom, steel);
    chainMesh.position.z = 0.94;
    driveGroup.add(chainMesh);

    machineGroup.add(driveGroup);
    
    parts.push({
        name: "Main Chain Drive System",
        description: "Massive 1.5-inch pitch roller chains and hardened steel sprockets.",
        material: "Hardened Steel",
        function: "Transfers power from the central gearbox to all bale chamber rollers simultaneously.",
        assemblyOrder: 11,
        connections: ["Gearbox", "Rollers"],
        failureEffect: "Chain snap",
        cascadeFailures: ["Rollers stop", "Major blockage", "Gearbox shock load"],
        originalPosition: {x: 1.0, y: 2.5, z: 0.95},
        explodedPosition: {x: 1.0, y: 2.5, z: 1.5}
    });

    // 12. Central Gearbox
    const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), aluminum);
    gearbox.position.set(-0.2, 1.4, 0);
    machineGroup.add(gearbox);

    parts.push({
        name: "Split-Drive Gearbox",
        description: "Heavy-duty cast aluminum T-bevel gearbox.",
        material: "Cast Aluminum / Steel Gears",
        function: "Splits PTO power: 50% to chamber rollers, 50% to rotor/pickup.",
        assemblyOrder: 12,
        connections: ["PTO", "Drive Chains"],
        failureEffect: "Total driveline failure",
        cascadeFailures: ["Catastrophic internal gear shearing"],
        originalPosition: {x: -0.2, y: 1.4, z: 0},
        explodedPosition: {x: -0.2, y: 1.4, z: -2}
    });

    // 13. Operator Control Node & Sensors
    const sensorGroup = new THREE.Group();
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8), plastic);
    antenna.position.set(0, 0.25, 0);
    sensorGroup.add(antenna);
    
    const nodeBox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.15), plastic);
    sensorGroup.add(nodeBox);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), glowingYellow);
    screen.position.set(0, 0, 0.08);
    sensorGroup.add(screen);

    sensorGroup.position.set(0.2, 3.8, 0);
    machineGroup.add(sensorGroup);

    parts.push({
        name: "ISOBUS Control Node & Moisture Sensor",
        description: "Advanced micro-controller unit with moisture pads and bale shape sensors.",
        material: "Silicon / Plastic",
        function: "Feeds real-time bale density, shape, and moisture data to tractor terminal.",
        assemblyOrder: 13,
        connections: ["Sensors", "Tractor Harness"],
        failureEffect: "Loss of automation",
        cascadeFailures: ["Uneven bale shape", "Overfilling chamber"],
        originalPosition: {x: 0.2, y: 3.8, z: 0},
        explodedPosition: {x: 0.2, y: 5.5, z: 0}
    });

    // 14. High-Visibility Lighting
    const lightGroup = new THREE.Group();
    const lLight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.2), plastic);
    const lLens = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.18), glowingRed);
    lLens.position.x = -0.051;
    lLens.rotation.y = -Math.PI/2;
    lLight.add(lLens);
    lLight.position.set(3.2, 1.5, -1.0);
    lightGroup.add(lLight);

    const rLight = lLight.clone();
    rLight.position.set(3.2, 1.5, 1.0);
    lightGroup.add(rLight);

    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), glowingYellow);
    beacon.position.set(1.5, 4.0, 0);
    lightGroup.add(beacon);

    machineGroup.add(lightGroup);

    parts.push({
        name: "LED Road & Working Lights",
        description: "High-intensity LED tail lights and a rotating amber beacon.",
        material: "Polycarbonate / LED",
        function: "Ensures safety during road transport and visibility for night bailing.",
        assemblyOrder: 14,
        connections: ["Chassis", "Electrical Harness"],
        failureEffect: "Traffic hazard",
        cascadeFailures: ["Electrical short"],
        originalPosition: {x: 3.2, y: 1.5, z: 0},
        explodedPosition: {x: 5, y: 1.5, z: 0}
    });

    // 15. Bale Ramp / Kicker
    const rampGroup = new THREE.Group();
    const rampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16), steel);
    rampBar.rotation.x = Math.PI/2;
    rampGroup.add(rampBar);
    
    for(let i=0; i<3; i++) {
        const finger = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.05), steel);
        finger.position.set(0.3, 0, -0.4 + i*0.4);
        rampGroup.add(finger);
    }
    
    const springGeom = new THREE.TorusGeometry(0.03, 0.01, 8, 16);
    const spring = new THREE.Mesh(springGeom, darkSteel);
    spring.position.set(0, 0, 0.6);
    rampGroup.add(spring);

    rampGroup.position.set(1.5, 0.6, 0);
    machineGroup.add(rampGroup);

    parts.push({
        name: "Spring-Loaded Bale Kicker",
        description: "Heavy steel ramp heavily sprung.",
        material: "Steel",
        function: "Rolls the ejected bale completely clear of the tailgate closing path.",
        assemblyOrder: 15,
        connections: ["Axle", "Tailgate"],
        failureEffect: "Tailgate crushes bale",
        cascadeFailures: ["Bent tailgate", "Damage to rollers"],
        originalPosition: {x: 1.5, y: 0.6, z: 0},
        explodedPosition: {x: 3, y: 0, z: 0}
    });

    // 16. Hydraulic Hoses
    const hoseMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const hosePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.5, 1.4, 0.1),
        new THREE.Vector3(-1.0, 1.6, 0.2),
        new THREE.Vector3(0.0, 1.4, 0.5),
        new THREE.Vector3(1.0, 1.2, 1.0)
    ]);
    const hoseGeom = new THREE.TubeGeometry(hosePath, 20, 0.02, 8, false);
    const hose = new THREE.Mesh(hoseGeom, hoseMaterial);
    machineGroup.add(hose);

    parts.push({
        name: "Hydraulic Lines & Pioneer Couplers",
        description: "High-pressure multi-ply braided rubber hoses.",
        material: "Braided Rubber",
        function: "Supplies 3000 PSI tractor hydraulic oil to tailgate cylinders and pickup lift.",
        assemblyOrder: 16,
        connections: ["Tractor", "Cylinders"],
        failureEffect: "Massive oil leak",
        cascadeFailures: ["Environmental hazard", "Hydraulic lockout"],
        originalPosition: {x: -0.5, y: 1.5, z: 0.5},
        explodedPosition: {x: -0.5, y: 3, z: 1}
    });


    // Animation State
    const animate = (time, speed, meshesObj = meshes) => {
        const activeSpeed = speed * 2;

        if (meshesObj.pto) {
            meshesObj.pto.rotation.x = time * activeSpeed * 10;
        }

        meshesObj.wheels.forEach(wheel => {
            wheel.rotation.z = -time * activeSpeed;
        });

        if (meshesObj.pickupReel) {
            meshesObj.pickupReel.rotation.z = -time * activeSpeed * 8;
        }

        if (meshesObj.augers.length > 1) {
            meshesObj.augers[0].rotation.z = time * activeSpeed * 5;
            meshesObj.augers[1].rotation.z = -time * activeSpeed * 5;
        }

        if (meshesObj.rotor) {
            meshesObj.rotor.rotation.z = -time * activeSpeed * 6;
        }

        meshesObj.rollers.forEach(roller => {
            roller.rotation.z = -time * activeSpeed * 7;
        });

        // Tailgate Ejection Cycle
        const cycleTime = (time * speed) % 10;
        
        if (cycleTime > 7 && cycleTime < 9) {
            // Opening
            const progress = (cycleTime - 7) / 2;
            const angle = progress * (Math.PI / 2.5);
            if (meshesObj.tailgate) {
                meshesObj.tailgate.rotation.z = angle;
            }
            meshesObj.hydraulics.forEach(rod => {
                rod.position.y = 1.4 + progress * 0.8;
            });
        } else if (cycleTime >= 9 || cycleTime < 1) {
            // Closing
            let progress = 0;
            if (cycleTime >= 9) {
                progress = 1.0 - (cycleTime - 9);
            }
            const angle = progress * (Math.PI / 2.5);
            if (meshesObj.tailgate) {
                meshesObj.tailgate.rotation.z = angle;
            }
            meshesObj.hydraulics.forEach(rod => {
                rod.position.y = 1.4 + progress * 0.8;
            });
        } else {
            // Closed
            if (meshesObj.tailgate) {
                meshesObj.tailgate.rotation.z = 0;
            }
            meshesObj.hydraulics.forEach(rod => {
                rod.position.y = 1.4;
            });
        }
    };

    const description = "A massive, ultra-high-tech modern agricultural round baler. Features a camless high-speed pickup, integral rotor cutter with 15 knives, 18 heavy-duty steel chamber rollers, an active net-wrap system, ISOBUS moisture sensing, and a clam-shell tailgate powered by heavy-duty hydraulics. Designed for extremely dense silage and dry hay bale production.";

    const quizQuestions = [
        {
            question: "What is the function of the Integral Rotor & Pre-Cutter?",
            options: [
                "To wrap the bale in net",
                "To chop the crop and consolidate flow into the chamber",
                "To lift the crop off the ground",
                "To open the tailgate"
            ],
            correctAnswer: 1,
            explanation: "The integral rotor actively pulls crop from the pickup, chops it using drop-floor knives, and forces it into the chamber to increase bale density."
        },
        {
            question: "How is power split in the central gearbox?",
            options: [
                "100% to the wheels",
                "It is a T-bevel gearbox splitting power to the chamber rollers and the pickup/rotor.",
                "It powers the hydraulic pump only",
                "It runs off battery power"
            ],
            correctAnswer: 1,
            explanation: "The central T-bevel gearbox efficiently splits the massive PTO power symmetrically down the left and right sides of the baler."
        },
        {
            question: "What handles the ejection of the finished bale?",
            options: [
                "The feed augers reverse direction",
                "The massive Clam-Shell Tailgate opened by dual hydraulic cylinders",
                "A robotic arm",
                "The drawbar extends"
            ],
            correctAnswer: 1,
            explanation: "Once the bale is tied with net wrap, the massive rear tailgate is forced open by hydraulic cylinders to release the bale onto the kicker ramp."
        },
        {
            question: "What is the purpose of the spring-loaded bale kicker?",
            options: [
                "To roll the ejected bale clear of the tailgate's closing path",
                "To compress the crop",
                "To attach to the tractor",
                "To apply net wrap"
            ],
            correctAnswer: 0,
            explanation: "The kicker ensures the heavy bale rolls backwards away from the machine so the tailgate can safely close without crushing it."
        },
        {
            question: "Why does the baler use high-flotation pneumatic tires?",
            options: [
                "To allow it to float on water",
                "To minimize soil compaction despite the massive weight of the machine and the bale",
                "To spin the PTO",
                "To drive the chains"
            ],
            correctAnswer: 1,
            explanation: "A baler with a full silage bale is incredibly heavy. Wide flotation tires spread this weight out to prevent deep ruts and damage to the field."
        }
    ];

    return {
        group: machineGroup,
        parts,
        description,
        quizQuestions,
        animate
    };
}
