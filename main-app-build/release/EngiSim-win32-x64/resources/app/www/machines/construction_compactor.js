import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Animation references
    let drum;
    let leftTire;
    let rightTire;
    let frontFrameGroup;
    let beacon;
    let hydLeft;
    let hydRight;
    let exhaustPipe;

    // Custom Neon Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, metalness: 0.9, roughness: 0.1 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const warningLight = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3 });

    // --- HELPER FUNCTIONS ---
    function createCylinder(rTop, rBot, h, radialSeg, mat, rotX, rotY, rotZ, posX, posY, posZ) {
        const geom = new THREE.CylinderGeometry(rTop, rBot, h, radialSeg);
        if (rotX) geom.rotateX(rotX);
        if (rotY) geom.rotateY(rotY);
        if (rotZ) geom.rotateZ(rotZ);
        if (posX || posY || posZ) geom.translate(posX || 0, posY || 0, posZ || 0);
        return new THREE.Mesh(geom, mat);
    }
    
    function createBox(w, h, d, mat, posX, posY, posZ) {
        const geom = new THREE.BoxGeometry(w, h, d);
        if (posX || posY || posZ) geom.translate(posX || 0, posY || 0, posZ || 0);
        return new THREE.Mesh(geom, mat);
    }

    // --- TIRE CONSTRUCTION (Hyper-detailed) ---
    function createHeavyTire() {
        const tireGroup = new THREE.Group();
        
        // Main donut
        const torusGeom = new THREE.TorusGeometry(3.2, 1.4, 64, 128);
        const torus = new THREE.Mesh(torusGeom, rubber);
        tireGroup.add(torus);

        // Hundreds of tiny extruded lugs
        const numLugs = 72;
        const lugGeom = new THREE.BoxGeometry(1.5, 0.5, 3.2);
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * 4.4, Math.sin(angle) * 4.4, 0);
            lug.rotation.z = angle;
            // Angle the lugs for offroad tread pattern
            lug.rotation.y = (i % 2 === 0) ? Math.PI / 8 : -Math.PI / 8;
            tireGroup.add(lug);
        }
        
        const rimGeom = new THREE.CylinderGeometry(2.2, 2.2, 2.8, 64);
        rimGeom.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        tireGroup.add(rim);

        const hubGeom = new THREE.CylinderGeometry(0.8, 1.2, 3.2, 32);
        hubGeom.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeom, chrome);
        tireGroup.add(hub);

        for (let i = 0; i < 12; i++) {
            const spoke = createCylinder(0.15, 0.25, 4.4, 16, chrome, Math.PI/2, 0, 0, 0, 0, 0);
            spoke.rotation.z = (i / 12) * Math.PI * 2;
            tireGroup.add(spoke);
        }

        const boltGeom = new THREE.CylinderGeometry(0.1, 0.1, 3.4, 8);
        boltGeom.rotateX(Math.PI / 2);
        for(let i = 0; i < 10; i++) {
            const bolt = new THREE.Mesh(boltGeom, steel);
            const a = (i/10)*Math.PI*2;
            bolt.position.set(Math.cos(a)*1.5, Math.sin(a)*1.5, 0);
            tireGroup.add(bolt);
        }

        return tireGroup;
    }

    // --- PADFOOT DRUM (Hyper-detailed) ---
    function createPadfootDrum() {
        const drumGroup = new THREE.Group();
        const drumRadius = 3.5;
        const drumWidth = 10;
        const drumGeom = new THREE.CylinderGeometry(drumRadius, drumRadius, drumWidth, 128);
        drumGeom.rotateZ(Math.PI / 2);
        const drumMesh = new THREE.Mesh(drumGeom, darkSteel);
        drumGroup.add(drumMesh);

        const rows = 18;
        const padsPerRow = 40;
        for (let r = 0; r < rows; r++) {
            for (let p = 0; p < padsPerRow; p++) {
                const angle = (p / padsPerRow) * Math.PI * 2;
                const offset = (r % 2) * (Math.PI / padsPerRow);
                const x = -drumWidth/2 + 0.25 + (r / (rows - 1)) * (drumWidth - 0.5);
                const y = Math.cos(angle + offset) * drumRadius;
                const z = Math.sin(angle + offset) * drumRadius;
                
                // Extrude shapes for tapered pad
                const padShape = new THREE.Shape();
                padShape.moveTo(-0.3, -0.3);
                padShape.lineTo(0.3, -0.3);
                padShape.lineTo(0.2, 0.3);
                padShape.lineTo(-0.2, 0.3);
                padShape.lineTo(-0.3, -0.3);
                
                const extrudeSet = { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
                const padGeo = new THREE.ExtrudeGeometry(padShape, extrudeSet);
                padGeo.translate(0, 0, -0.4);
                
                const pad = new THREE.Mesh(padGeo, steel);
                pad.position.set(x, y, z);
                pad.lookAt(x, y * 2, z * 2);
                pad.rotateX(Math.PI/2);
                
                drumGroup.add(pad);
            }
        }

        // Inner mechanisms (visible at ends)
        const innerMech = createCylinder(2.5, 2.5, drumWidth + 0.2, 64, chrome, 0, 0, Math.PI/2, 0, 0, 0);
        drumGroup.add(innerMech);

        return drumGroup;
    }

    // --- HYDRAULICS ---
    function createHydraulic(length, rOut, rIn) {
        const hyd = new THREE.Group();
        const base = createCylinder(rOut, rOut, length, 32, darkSteel, 0, 0, 0, 0, length/2, 0);
        const piston = createCylinder(rIn, rIn, length*1.2, 32, chrome, 0, 0, 0, 0, length*0.6, 0);
        piston.position.y = length * 0.4;
        
        // Hose connections
        const hosePort = createBox(0.4, 0.4, 0.4, copper, rOut, length*0.2, 0);
        base.add(hosePort);
        
        hyd.add(base);
        hyd.add(piston);
        return { group: hyd, base: base, piston: piston, length: length };
    }

    // --- CABIN ---
    function createROPSCabin() {
        const cab = new THREE.Group();
        
        // Main structure frame
        const frameShape = new THREE.Shape();
        frameShape.moveTo(0, 0);
        frameShape.lineTo(6, 0);
        frameShape.lineTo(6, 4);
        frameShape.lineTo(5.5, 7);
        frameShape.lineTo(0.5, 7);
        frameShape.lineTo(0, 4);
        frameShape.lineTo(0, 0);
        
        const extrude = { depth: 5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 3 };
        const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrude);
        frameGeo.translate(-3, 0, -2.5);
        const frame = new THREE.Mesh(frameGeo, steel);
        cab.add(frame);

        // Windows
        const winShape = new THREE.Shape();
        winShape.moveTo(0.3, 1.5);
        winShape.lineTo(5.7, 1.5);
        winShape.lineTo(5.7, 3.8);
        winShape.lineTo(5.2, 6.7);
        winShape.lineTo(0.8, 6.7);
        winShape.lineTo(0.3, 3.8);
        winShape.lineTo(0.3, 1.5);

        const winExtrude = { depth: 5.2, bevelEnabled: false };
        const winGeo = new THREE.ExtrudeGeometry(winShape, winExtrude);
        winGeo.translate(-3, 0, -2.6);
        const glassMesh = new THREE.Mesh(winGeo, tinted);
        cab.add(glassMesh);
        
        // Interior
        const seat = createBox(1.5, 0.5, 1.5, plastic, 0, 2, 0);
        const backrest = createBox(1.5, 2, 0.4, plastic, 0, 3, -0.6);
        cab.add(seat);
        cab.add(backrest);

        const steeringCol = createCylinder(0.2, 0.2, 2, 16, darkSteel, Math.PI/6, 0, 0, 0, 2.5, 1.5);
        cab.add(steeringCol);
        const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 32), plastic);
        steeringWheel.rotation.x = Math.PI / 3;
        steeringWheel.position.set(0, 3.3, 1.8);
        cab.add(steeringWheel);

        // Neon screens
        const screen1 = createBox(1.2, 0.8, 0.1, neonBlue, -1, 3.2, 2);
        screen1.rotation.y = Math.PI / 6;
        const screen2 = createBox(0.8, 0.6, 0.1, neonOrange, 1, 3.2, 2);
        screen2.rotation.y = -Math.PI / 6;
        cab.add(screen1);
        cab.add(screen2);

        // Warning light
        beacon = createCylinder(0.3, 0.3, 0.6, 32, warningLight, 0, 0, 0, 0, 7.5, 0);
        cab.add(beacon);

        return cab;
    }

    // --- ASSEMBLING THE COMPACTOR ---

    // 1. Front Frame
    frontFrameGroup = new THREE.Group();
    const frontSidePlateL = createBox(8, 4, 0.8, steel, 0, 0, -5.5);
    const frontSidePlateR = createBox(8, 4, 0.8, steel, 0, 0, 5.5);
    const frontCrossBeam1 = createBox(3, 2, 11, darkSteel, 3, 1, 0);
    const frontCrossBeam2 = createBox(3, 2, 11, darkSteel, -3, 1, 0);
    frontFrameGroup.add(frontSidePlateL, frontSidePlateR, frontCrossBeam1, frontCrossBeam2);
    
    // Drum
    drum = createPadfootDrum();
    drum.position.set(0, -1, 0);
    frontFrameGroup.add(drum);

    // Scrapers
    const scraperFront = createBox(1, 4, 10, steel, 4.5, 0, 0);
    const scraperRear = createBox(1, 4, 10, steel, -4.5, 0, 0);
    frontFrameGroup.add(scraperFront, scraperRear);
    
    frontFrameGroup.position.set(10, 4.5, 0);
    group.add(frontFrameGroup);

    // 2. Articulation Joint
    const articulationGroup = new THREE.Group();
    const pivotPin = createCylinder(0.8, 0.8, 6, 32, chrome, 0, 0, 0, 0, 0, 0);
    const articulationHousing = createBox(3, 4, 4, darkSteel, 0, 0, 0);
    articulationGroup.add(pivotPin, articulationHousing);
    articulationGroup.position.set(5, 4.5, 0);
    group.add(articulationGroup);

    // 3. Rear Frame
    const rearFrameGroup = new THREE.Group();
    const rearMainBodyShape = new THREE.Shape();
    rearMainBodyShape.moveTo(0, 0);
    rearMainBodyShape.lineTo(10, 0);
    rearMainBodyShape.lineTo(10, 6);
    rearMainBodyShape.lineTo(8, 8);
    rearMainBodyShape.lineTo(0, 8);
    rearMainBodyShape.lineTo(0, 0);
    const rmExtrude = { depth: 8, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 4 };
    const rearBodyGeom = new THREE.ExtrudeGeometry(rearMainBodyShape, rmExtrude);
    rearBodyGeom.translate(-10, 0, -4);
    const rearBody = new THREE.Mesh(rearBodyGeom, steel);
    rearFrameGroup.add(rearBody);

    // Engine Block
    const engineBlock = createBox(6, 4, 5, darkSteel, -6, 2.5, 0);
    rearFrameGroup.add(engineBlock);

    // Exhaust
    const exhaustBase = createCylinder(0.6, 0.6, 2, 16, darkSteel, 0, 0, 0, -4, 8, 3);
    exhaustPipe = createCylinder(0.3, 0.3, 5, 16, chrome, 0, 0, 0, -4, 11, 3);
    rearFrameGroup.add(exhaustBase, exhaustPipe);

    // Radiator Grille
    const grilleGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const slat = createBox(0.2, 5, 0.2, darkSteel, -9.8, 3, -3 + (i * 0.4));
        grilleGroup.add(slat);
    }
    rearFrameGroup.add(grilleGroup);

    // Tires & Axle
    const rearAxle = createCylinder(1.5, 1.5, 14, 32, chrome, Math.PI/2, 0, 0, -7, 0, 0);
    rearFrameGroup.add(rearAxle);

    leftTire = createHeavyTire();
    leftTire.position.set(-7, 0, -6.5);
    rightTire = createHeavyTire();
    rightTire.position.set(-7, 0, 6.5);
    rearFrameGroup.add(leftTire, rightTire);

    // Cabin
    const cabin = createROPSCabin();
    cabin.position.set(-3, 8.5, 0);
    rearFrameGroup.add(cabin);

    rearFrameGroup.position.set(5, 4.5, 0);
    group.add(rearFrameGroup);

    // 4. Steering Hydraulics (Connecting Front and Rear)
    hydLeft = createHydraulic(4, 0.4, 0.2);
    hydLeft.group.position.set(5, 4.5, -2);
    hydLeft.group.rotation.z = Math.PI / 2;
    group.add(hydLeft.group);

    hydRight = createHydraulic(4, 0.4, 0.2);
    hydRight.group.position.set(5, 4.5, 2);
    hydRight.group.rotation.z = Math.PI / 2;
    group.add(hydRight.group);

    // --- PARTS DEFINITION ---
    parts.push(
        {
            name: "Front_Frame_Assembly",
            description: "Heavy-duty steel frame housing the compactor drum and scraper bars. Provides the massive weight required for soil compaction.",
            material: "Steel",
            function: "Structural support for vibratory drum",
            assemblyOrder: 1,
            connections: ["Padfoot_Drum", "Articulation_Joint"],
            failureEffect: "Structural collapse under extreme vibratory loads.",
            cascadeFailures: ["Padfoot_Drum_Detachment"],
            originalPosition: { x: 10, y: 4.5, z: 0 },
            explodedPosition: { x: 20, y: 4.5, z: 0 }
        },
        {
            name: "Padfoot_Drum",
            description: "Massive vibrating steel cylinder studded with tapered pads (sheepsfoot) designed to knead and compact cohesive soils.",
            material: "Dark Steel / Hardened Alloy",
            function: "Soil compaction and air void elimination",
            assemblyOrder: 2,
            connections: ["Front_Frame_Assembly", "Vibration_Motor"],
            failureEffect: "Inefficient compaction, surface tearing, or soil bridging.",
            cascadeFailures: ["Subgrade_Failure"],
            originalPosition: { x: 10, y: 3.5, z: 0 },
            explodedPosition: { x: 20, y: -5, z: 0 }
        },
        {
            name: "Articulation_Joint",
            description: "Central pivot point connecting the front and rear frames, allowing for tight steering angles and chassis oscillation over uneven terrain.",
            material: "Chrome / Steel",
            function: "Steering and chassis oscillation",
            assemblyOrder: 3,
            connections: ["Front_Frame_Assembly", "Rear_Frame_Assembly", "Steering_Hydraulic_Left", "Steering_Hydraulic_Right"],
            failureEffect: "Loss of steering control and inability to traverse uneven ground.",
            cascadeFailures: ["Rollover"],
            originalPosition: { x: 5, y: 4.5, z: 0 },
            explodedPosition: { x: 5, y: 15, z: 0 }
        },
        {
            name: "Rear_Frame_Assembly",
            description: "Primary chassis containing the engine, drivetrain, cooling systems, and operator cabin.",
            material: "Steel",
            function: "Power generation and operator housing",
            assemblyOrder: 4,
            connections: ["Articulation_Joint", "Rear_Axle", "ROPS_Cabin"],
            failureEffect: "Complete machine failure.",
            cascadeFailures: ["Total_System_Shutdown"],
            originalPosition: { x: 5, y: 4.5, z: 0 },
            explodedPosition: { x: -5, y: 4.5, z: 0 }
        },
        {
            name: "Left_Rear_Tire",
            description: "Massive pneumatic tractor-tread tire designed to provide extreme traction without sinking into uncompacted soil.",
            material: "Vulcanized Rubber / Steel Rim",
            function: "Traction and propulsion",
            assemblyOrder: 5,
            connections: ["Rear_Axle"],
            failureEffect: "Loss of traction and mobility.",
            cascadeFailures: ["Immobilization"],
            originalPosition: { x: -2, y: 4.5, z: -6.5 },
            explodedPosition: { x: -2, y: 4.5, z: -15 }
        },
        {
            name: "Right_Rear_Tire",
            description: "Massive pneumatic tractor-tread tire designed to provide extreme traction without sinking into uncompacted soil.",
            material: "Vulcanized Rubber / Steel Rim",
            function: "Traction and propulsion",
            assemblyOrder: 6,
            connections: ["Rear_Axle"],
            failureEffect: "Loss of traction and mobility.",
            cascadeFailures: ["Immobilization"],
            originalPosition: { x: -2, y: 4.5, z: 6.5 },
            explodedPosition: { x: -2, y: 4.5, z: 15 }
        },
        {
            name: "Rear_Axle",
            description: "Heavy-duty planetary drive axle distributing engine torque to the massive rear wheels.",
            material: "Chrome / Steel",
            function: "Power transmission to wheels",
            assemblyOrder: 7,
            connections: ["Rear_Frame_Assembly", "Left_Rear_Tire", "Right_Rear_Tire"],
            failureEffect: "Power loss to wheels.",
            cascadeFailures: ["Drivetrain_Binding"],
            originalPosition: { x: -2, y: 4.5, z: 0 },
            explodedPosition: { x: -2, y: -2, z: 0 }
        },
        {
            name: "Engine_Block",
            description: "High-torque turbo-diesel engine generating massive hydraulic flow for propulsion and drum vibration.",
            material: "Dark Steel / Cast Iron",
            function: "Primary power generation",
            assemblyOrder: 8,
            connections: ["Rear_Frame_Assembly", "Cooling_Radiator", "Exhaust_System"],
            failureEffect: "Complete power loss.",
            cascadeFailures: ["Hydraulic_Pump_Stall"],
            originalPosition: { x: -1, y: 7, z: 0 },
            explodedPosition: { x: -1, y: 15, z: 0 }
        },
        {
            name: "Exhaust_System",
            description: "Vertical exhaust stack with diesel particulate filter and muffler to route hot emissions safely away from the operator.",
            material: "Chrome",
            function: "Emission venting",
            assemblyOrder: 9,
            connections: ["Engine_Block"],
            failureEffect: "Engine choking and operator asphyxiation risk.",
            cascadeFailures: ["Engine_Overheating"],
            originalPosition: { x: 1, y: 12.5, z: 3 },
            explodedPosition: { x: 1, y: 20, z: 10 }
        },
        {
            name: "Cooling_Radiator",
            description: "Massive rear-mounted radiator and fan assembly to dissipate intense heat from the engine and hydraulic oil.",
            material: "Aluminum / Steel",
            function: "Thermal regulation",
            assemblyOrder: 10,
            connections: ["Engine_Block", "Rear_Frame_Assembly"],
            failureEffect: "Engine and hydraulic fluid overheating.",
            cascadeFailures: ["Engine_Seizure", "Hydraulic_Seal_Failure"],
            originalPosition: { x: -4.8, y: 7.5, z: 0 },
            explodedPosition: { x: -15, y: 7.5, z: 0 }
        },
        {
            name: "ROPS_Cabin",
            description: "Roll-Over Protective Structure (ROPS) equipped cabin featuring climate control, tinted glass, and highly advanced neon diagnostic screens.",
            material: "Steel / Tinted Glass",
            function: "Operator protection and control interface",
            assemblyOrder: 11,
            connections: ["Rear_Frame_Assembly"],
            failureEffect: "Operator exposure to extreme noise, vibration, and rollover hazards.",
            cascadeFailures: ["Operator_Injury"],
            originalPosition: { x: 2, y: 13, z: 0 },
            explodedPosition: { x: 2, y: 25, z: 0 }
        },
        {
            name: "Front_Scraper_Bar",
            description: "Heavy steel blade mounted close to the drum to scrape off packed mud and debris, preventing accumulation between padfeet.",
            material: "Steel",
            function: "Drum cleaning",
            assemblyOrder: 12,
            connections: ["Front_Frame_Assembly"],
            failureEffect: "Drum clogging with cohesive soil, severely reducing compaction efficiency.",
            cascadeFailures: ["Vibration_Dampening"],
            originalPosition: { x: 14.5, y: 4.5, z: 0 },
            explodedPosition: { x: 25, y: 4.5, z: 5 }
        },
        {
            name: "Rear_Scraper_Bar",
            description: "Secondary steel blade mounted behind the drum to ensure complete debris removal in reverse operations.",
            material: "Steel",
            function: "Drum cleaning",
            assemblyOrder: 13,
            connections: ["Front_Frame_Assembly"],
            failureEffect: "Drum clogging.",
            cascadeFailures: ["Vibration_Dampening"],
            originalPosition: { x: 5.5, y: 4.5, z: 0 },
            explodedPosition: { x: -5, y: 4.5, z: -5 }
        },
        {
            name: "Steering_Hydraulic_Left",
            description: "High-pressure hydraulic cylinder that forces the articulation joint to pivot, steering the machine.",
            material: "Steel / Chrome",
            function: "Articulated steering actuation",
            assemblyOrder: 14,
            connections: ["Front_Frame_Assembly", "Rear_Frame_Assembly"],
            failureEffect: "Inability to steer left.",
            cascadeFailures: ["Hydraulic_Fluid_Leak"],
            originalPosition: { x: 5, y: 4.5, z: -2 },
            explodedPosition: { x: 5, y: 10, z: -8 }
        },
        {
            name: "Steering_Hydraulic_Right",
            description: "High-pressure hydraulic cylinder that forces the articulation joint to pivot, steering the machine.",
            material: "Steel / Chrome",
            function: "Articulated steering actuation",
            assemblyOrder: 15,
            connections: ["Front_Frame_Assembly", "Rear_Frame_Assembly"],
            failureEffect: "Inability to steer right.",
            cascadeFailures: ["Hydraulic_Fluid_Leak"],
            originalPosition: { x: 5, y: 4.5, z: 2 },
            explodedPosition: { x: 5, y: 10, z: 8 }
        }
    );

    const description = "The Ultra High-Tech Padfoot Soil Compactor is a massive, highly detailed engineering marvel designed for cohesive soil stabilization. It features articulated steering, hyper-realistic diamond-tread tractor tires, and a brutally efficient sheepsfoot vibratory drum. The ROPS cabin is outfitted with glowing neon diagnostic screens, reflecting the advanced nature of this heavy machinery.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the Padfoot (Sheepsfoot) Drum?",
            options: ["To cut asphalt", "To knead and compact cohesive soils", "To transport loose gravel", "To act as a counterweight"],
            answer: 1,
            explanation: "The tapered pads penetrate cohesive soils (like clay) to knead the soil and squeeze out air voids, resulting in high-density compaction."
        },
        {
            question: "Why does this machine use an Articulated Joint rather than traditional front-wheel steering?",
            options: ["It is cheaper to manufacture", "It allows the heavy drum to remain rigidly attached to the front frame while providing a tight turning radius", "It increases top speed", "It prevents the rear wheels from spinning"],
            answer: 1,
            explanation: "Articulated steering pivots the entire front half of the chassis, allowing for heavy, rigid frames to maneuver tightly without requiring steering knuckles on the drum or axles."
        },
        {
            question: "What would happen if the Scraper Bars failed or were removed?",
            options: ["The machine would drive faster", "The drum would quickly clog with packed mud between the pads, ruining compaction efficiency", "The engine would overheat", "The articulation joint would lock"],
            answer: 1,
            explanation: "In cohesive soils, mud rapidly packs between the padfeet. Scraper bars constantly shave this mud off to keep the pads exposed."
        },
        {
            question: "What is the function of the massive ROPS cabin?",
            options: ["Aerodynamics", "Roll-Over Protective Structure to keep the operator safe in case the heavy machine tips over on uneven terrain", "To store extra soil", "To generate downforce"],
            answer: 1,
            explanation: "Compactors often work on steep, unstable grades. A ROPS cabin is a heavily reinforced steel cage designed to prevent crushing if the machine rolls."
        },
        {
            question: "How do the Left and Right Steering Hydraulics work together to turn the machine?",
            options: ["They both push at the same time", "One pushes (extends) while the other pulls (retracts), forcing the chassis to bend at the articulation joint", "They spin the wheels independently", "They lift the drum off the ground"],
            answer: 1,
            explanation: "Articulated steering relies on dual hydraulic cylinders. To turn, fluid is pumped into the base of one cylinder (extending it) and the rod end of the other (retracting it)."
        }
    ];

    // --- ANIMATION LOGIC ---
    let timeAcc = 0;
    function animate(time, speed, meshes) {
        timeAcc += speed * 0.01;
        
        // Drive machinery
        const driveSpeed = speed * 0.05;
        
        // Spin Drum
        drum.rotation.x -= driveSpeed;
        
        // Spin Rear Tires
        leftTire.rotation.z -= driveSpeed;
        rightTire.rotation.z -= driveSpeed;

        // Articulated Steering sine wave (wobble left and right)
        const steerAngle = Math.sin(timeAcc * 0.5) * (Math.PI / 6); 
        frontFrameGroup.rotation.y = steerAngle;
        
        // Move steering hydraulics to match articulation
        // This requires complex inverse kinematics, simulated here with scale and position hacks
        const hydExtLeft = 1 + Math.sin(timeAcc * 0.5) * 0.2;
        const hydExtRight = 1 - Math.sin(timeAcc * 0.5) * 0.2;
        
        hydLeft.piston.position.y = hydLeft.length * 0.4 * hydExtLeft;
        hydRight.piston.position.y = hydRight.length * 0.4 * hydExtRight;
        
        // Simulating the vibration of the drum (rapid micro-movements)
        if (speed > 0) {
            const vibrationX = (Math.random() - 0.5) * 0.05 * speed;
            const vibrationY = (Math.random() - 0.5) * 0.05 * speed;
            drum.position.set(0 + vibrationX, -1 + vibrationY, 0);
            
            // Beacon flashing
            beacon.material.emissiveIntensity = 3 + Math.sin(time * 0.01) * 2;
        } else {
            drum.position.set(0, -1, 0);
            beacon.material.emissiveIntensity = 1;
        }

        // Exhaust smoke simulation (pulsing scale on exhaust tip if we had particles, just wobble the pipe slightly)
        exhaustPipe.scale.set(1 + Math.random()*0.02, 1, 1 + Math.random()*0.02);
    }

    return { group, parts, description, quizQuestions, animate };
}
