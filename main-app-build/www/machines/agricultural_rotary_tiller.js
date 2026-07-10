import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // =========================================================================
    // GEOMETRY GENERATORS & UTILITIES
    // =========================================================================

    function createExtrusion(pts, depth, bevelEnabled = true) {
        const shape = new THREE.Shape();
        if (pts.length > 0) {
            shape.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) {
                shape.lineTo(pts[i][0], pts[i][1]);
            }
        }
        const settings = {
            depth: depth,
            bevelEnabled: bevelEnabled,
            bevelSegments: 6,
            steps: 4,
            bevelSize: 0.04,
            bevelThickness: 0.04
        };
        return new THREE.ExtrudeGeometry(shape, settings);
    }

    function createLathe(points, segments = 64) {
        const v2Points = points.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(v2Points, segments);
    }

    function createHexBolt() {
        const geom = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 6);
        geom.rotateX(Math.PI / 2);
        return new THREE.Mesh(geom, chrome);
    }

    // =========================================================================
    // PART 1: MAIN DECK / HEAVY-DUTY FRAME
    // =========================================================================
    // The massive outer cover/deck of the rotary tiller
    const framePts = [
        [0, 0], [4.5, 0], [4.8, 1.2], [4.2, 3.8],
        [3.0, 4.2], [0.5, 4.0], [-0.5, 2.5]
    ];
    const frameGeom = createExtrusion(framePts, 8, true);
    const frameMesh = new THREE.Mesh(frameGeom, steel);
    // Center it relative to the origin
    frameMesh.position.set(-2, 0, -4);
    
    // Add structural ribs across the top of the frame for strength
    const ribGeom = new THREE.BoxGeometry(0.15, 0.4, 8);
    for (let i = 0; i < 4; i++) {
        const rib = new THREE.Mesh(ribGeom, darkSteel);
        rib.position.set(-1.0 + i * 1.5, 4.0, 0);
        // Angle them slightly to match the deck curvature
        rib.rotation.z = -0.1 * i;
        frameMesh.add(rib);
    }
    
    meshes.mainFrame = frameMesh;
    group.add(frameMesh);
    parts.push({
        name: 'Main Deck Frame',
        description: 'A heavy-duty reinforced steel shroud that contains the rotating elements. It prevents rocks and soil from flying out while structurally supporting the transmission, three-point hitch, and rotor assembly.',
        material: 'steel',
        function: 'Structural support and safety guard',
        assemblyOrder: 1,
        connections: ['Gearbox', 'Side Panels', 'Trailing Board', 'Three-Point Tower'],
        failureEffect: 'Excessive vibration, chassis flexing, or exposed debris hazards.',
        cascadeFailures: ['Bearing failure from chassis misalignment', 'Gearbox structural fatigue'],
        originalPosition: { x: -2, y: 0, z: -4 },
        explodedPosition: { x: -2, y: 6, z: -4 }
    });


    // =========================================================================
    // PART 2: THREE-POINT HITCH TOWER
    // =========================================================================
    const hitchGroup = new THREE.Group();
    hitchGroup.position.set(1.5, 4.2, 0);

    // Left and right A-frame legs
    const legGeom = new THREE.BoxGeometry(0.4, 3.5, 0.2);
    
    const leftLeg = new THREE.Mesh(legGeom, steel);
    leftLeg.position.set(0, 1.5, -1.2);
    leftLeg.rotation.x = -0.3; // Lean inwards
    hitchGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, steel);
    rightLeg.position.set(0, 1.5, 1.2);
    rightLeg.rotation.x = 0.3;
    hitchGroup.add(rightLeg);

    // Top link pin support
    const topPinBlock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.8), darkSteel);
    topPinBlock.position.set(0, 3.2, 0);
    hitchGroup.add(topPinBlock);
    
    const topPin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16), chrome);
    topPin.rotation.x = Math.PI / 2;
    topPin.position.set(0, 3.2, 0);
    hitchGroup.add(topPin);

    meshes.hitchTower = hitchGroup;
    group.add(hitchGroup);
    parts.push({
        name: 'Three-Point Hitch Tower',
        description: 'Robust A-frame welded structure for attaching the top link of the tractor. It translates pulling force and enables lifting the implement.',
        material: 'steel',
        function: 'Tractor top-link connection',
        assemblyOrder: 2,
        connections: ['Main Deck Frame'],
        failureEffect: 'Implement falls backwards or cannot be lifted.',
        cascadeFailures: ['PTO shaft snap due to extreme geometry angle changes'],
        originalPosition: { x: 1.5, y: 4.2, z: 0 },
        explodedPosition: { x: 4, y: 8, z: 0 }
    });

    // =========================================================================
    // PART 3: LOWER LINK PINS (CLEVIS)
    // =========================================================================
    const lowerLinkGroup = new THREE.Group();
    lowerLinkGroup.position.set(4, 1.5, 0);

    const clevisGeom = new THREE.BoxGeometry(0.8, 0.6, 0.2);
    const pinGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    pinGeom.rotateX(Math.PI / 2);

    // Left lower link
    const leftClevisInner = new THREE.Mesh(clevisGeom, steel);
    leftClevisInner.position.set(0, 0, -2.8);
    const leftClevisOuter = new THREE.Mesh(clevisGeom, steel);
    leftClevisOuter.position.set(0, 0, -3.4);
    const leftPin = new THREE.Mesh(pinGeom, chrome);
    leftPin.position.set(0, 0, -3.1);
    lowerLinkGroup.add(leftClevisInner, leftClevisOuter, leftPin);

    // Right lower link
    const rightClevisInner = new THREE.Mesh(clevisGeom, steel);
    rightClevisInner.position.set(0, 0, 2.8);
    const rightClevisOuter = new THREE.Mesh(clevisGeom, steel);
    rightClevisOuter.position.set(0, 0, 3.4);
    const rightPin = new THREE.Mesh(pinGeom, chrome);
    rightPin.position.set(0, 0, 3.1);
    lowerLinkGroup.add(rightClevisInner, rightClevisOuter, rightPin);

    meshes.lowerLinks = lowerLinkGroup;
    group.add(lowerLinkGroup);
    parts.push({
        name: 'Lower Link Clevis Pins',
        description: 'Heavy steel brackets with category-2 pins used for the tractor draft arms.',
        material: 'steel, chrome',
        function: 'Tractor draft arm connections',
        assemblyOrder: 3,
        connections: ['Main Deck Frame'],
        failureEffect: 'Tiller detaches from tractor on one side.',
        cascadeFailures: ['PTO shaft destruction, structural twisting'],
        originalPosition: { x: 4, y: 1.5, z: 0 },
        explodedPosition: { x: 6, y: 1.5, z: 0 }
    });

    // =========================================================================
    // PART 4: GEARBOX HOUSING
    // =========================================================================
    const gearboxGroup = new THREE.Group();
    gearboxGroup.position.set(2, 4.5, 0); // Mounted centrally on the deck

    // Main cast iron body
    const gbPts = [
        [0, 0.8], [0.8, 0.8], [1.2, 0], [0.8, -0.8], [0, -0.8], [-0.5, 0]
    ];
    const gbGeom = createExtrusion(gbPts, 1.5, true);
    // Center it
    gbGeom.translate(0, 0, -0.75);
    const gbMesh = new THREE.Mesh(gbGeom, darkSteel);
    gearboxGroup.add(gbMesh);
    
    // Top Cover plate
    const gbCoverGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32);
    const gbCover = new THREE.Mesh(gbCoverGeom, aluminum);
    gbCover.position.set(0.4, 0, 0);
    gbCover.rotation.x = Math.PI / 2;
    gearboxGroup.add(gbCover);

    // Bolts on cover
    for(let i=0; i<6; i++) {
        const bolt = createHexBolt();
        const angle = (i/6)*Math.PI*2;
        bolt.position.set(0.4 + Math.cos(angle)*0.5, Math.sin(angle)*0.5, 0.15);
        bolt.rotation.x = 0;
        gearboxGroup.add(bolt);
    }

    // Oil level sight glass
    const sightGlassGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
    const sightGlass = new THREE.Mesh(sightGlassGeom, glass);
    sightGlass.position.set(1.2, 0, 0);
    sightGlass.rotation.z = Math.PI / 2;
    gearboxGroup.add(sightGlass);
    
    // Breather plug
    const breatherGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const breather = new THREE.Mesh(breatherGeom, copper);
    breather.position.set(0, 0.8, 0);
    gearboxGroup.add(breather);

    meshes.gearbox = gearboxGroup;
    group.add(gearboxGroup);
    parts.push({
        name: 'Cast Iron Gearbox',
        description: 'Central heavy-duty multi-speed gearbox housing bevel gears. Reduces PTO 540 RPM to approx 200-300 RPM for the rotor shaft while turning the drive axis 90 degrees.',
        material: 'darkSteel, aluminum',
        function: 'Speed reduction and 90-degree power transmission',
        assemblyOrder: 4,
        connections: ['Main Deck Frame', 'PTO Shaft', 'Transverse Drive Shaft'],
        failureEffect: 'Loss of power transmission, metal shards inside housing.',
        cascadeFailures: ['Gear seizure, PTO slip clutch activation'],
        originalPosition: { x: 2, y: 4.5, z: 0 },
        explodedPosition: { x: 2, y: 9, z: 0 }
    });

    // =========================================================================
    // PART 5: PTO INPUT SHAFT & SHIELD
    // =========================================================================
    const ptoGroup = new THREE.Group();
    ptoGroup.position.set(3, 4.5, 0);

    // splined input shaft
    const splineGeom = new THREE.CylinderGeometry(0.18, 0.18, 2, 6);
    splineGeom.rotateZ(Math.PI / 2);
    const ptoShaftMesh = new THREE.Mesh(splineGeom, chrome);
    ptoGroup.add(ptoShaftMesh);
    
    // Slip clutch housing
    const clutchGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32);
    clutchGeom.rotateZ(Math.PI / 2);
    const clutchMesh = new THREE.Mesh(clutchGeom, darkSteel);
    clutchMesh.position.set(1.2, 0, 0);
    ptoGroup.add(clutchMesh);
    
    // Plastic PTO guard cone
    const guardGeom = new THREE.ConeGeometry(0.8, 1.5, 32, 1, true);
    guardGeom.rotateZ(-Math.PI / 2);
    const guardMesh = new THREE.Mesh(guardGeom, plastic);
    guardMesh.position.set(1.5, 0, 0);
    ptoGroup.add(guardMesh);

    meshes.ptoInput = ptoGroup;
    group.add(ptoGroup);
    parts.push({
        name: 'PTO Input Shaft with Slip Clutch',
        description: 'Splined 1-3/8 inch 6-spline shaft with integrated friction-disc slip clutch. It connects to the tractor PTO and protects the gearbox from sudden shock loads (like hitting a boulder).',
        material: 'chrome, darkSteel, plastic',
        function: 'Power intake and torque overload protection',
        assemblyOrder: 5,
        connections: ['Gearbox', 'Tractor PTO Driveline'],
        failureEffect: 'No power to implement, or slip clutch burns out due to continuous slipping.',
        cascadeFailures: ['Friction disc destruction'],
        originalPosition: { x: 3, y: 4.5, z: 0 },
        explodedPosition: { x: 8, y: 4.5, z: 0 }
    });

    // =========================================================================
    // PART 6: TRANSVERSE SHAFT & SIDE DRIVE HOUSING
    // =========================================================================
    // Transverse shaft going from gearbox to the side drive
    const transShaftGeom = new THREE.CylinderGeometry(0.15, 0.15, 3.8, 32);
    transShaftGeom.rotateX(Math.PI / 2);
    const transShaft = new THREE.Mesh(transShaftGeom, steel);
    transShaft.position.set(2, 4.5, -2);
    group.add(transShaft);
    meshes.transShaft = transShaft;

    // Side Drive Housing (Chain or Gear drive)
    const sideDriveGroup = new THREE.Group();
    sideDriveGroup.position.set(2, 2.5, -4.1);

    const sdPts = [
        [-0.5, 2.5], [0.5, 2.5], [0.8, -2], [0, -2.5], [-0.8, -2]
    ];
    const sdGeom = createExtrusion(sdPts, 0.6, true);
    // Align appropriately
    const sdMesh = new THREE.Mesh(sdGeom, darkSteel);
    sdMesh.position.set(0, 0, -0.3);
    sideDriveGroup.add(sdMesh);
    
    // Add cooling fins / ribs on side housing
    const sdRibGeom = new THREE.BoxGeometry(1.2, 0.1, 0.7);
    for(let i=0; i<6; i++) {
        const sdRib = new THREE.Mesh(sdRibGeom, aluminum);
        sdRib.position.set(0, 1.5 - i*0.6, 0);
        sideDriveGroup.add(sdRib);
    }

    meshes.sideDrive = sideDriveGroup;
    group.add(sideDriveGroup);
    parts.push({
        name: 'Oil-Bath Side Gear Drive',
        description: 'Heavy duty casing housing a massive chain or set of cascading spur gears. It transfers rotational power from the upper transverse shaft down to the rotor shaft.',
        material: 'darkSteel, aluminum',
        function: 'Final drive ratio reduction and power transfer',
        assemblyOrder: 6,
        connections: ['Transverse Shaft', 'Rotor Shaft', 'Main Deck Frame'],
        failureEffect: 'Snapping of the drive chain or stripping of gear teeth.',
        cascadeFailures: ['Complete lockup of the rotor', 'Housing fracture from loose chain wrap'],
        originalPosition: { x: 2, y: 2.5, z: -4.1 },
        explodedPosition: { x: 2, y: 2.5, z: -8 }
    });

    // =========================================================================
    // PART 7: THE ROTOR ASSEMBLY (SHAFT + FLANGES + L-BLADES)
    // =========================================================================
    const rotorGroup = new THREE.Group();
    // Positioned down low inside the deck
    rotorGroup.position.set(1.5, 0.8, 0);

    // 7A: Rotor Shaft (Massive hollow tube)
    const rotorShaftGeom = new THREE.CylinderGeometry(0.35, 0.35, 7.8, 64);
    rotorShaftGeom.rotateX(Math.PI / 2);
    const rotorShaftMesh = new THREE.Mesh(rotorShaftGeom, steel);
    rotorGroup.add(rotorShaftMesh);
    
    // 7B: Flanges and L-Blades
    const numFlanges = 9;
    const tinesPerFlange = 6;
    const flangeSpacing = 7.6 / (numFlanges - 1);
    
    // Flange Geometry
    const flangeGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32);
    flangeGeom.rotateX(Math.PI / 2);

    // Tine (L-Blade) Geometry using TubeGeometry on a custom Curve
    class LBladeCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            // Complex L-shape with outward bend and twist
            let x, y, z;
            if(t < 0.6) {
                // straight out from flange
                const u = t / 0.6; // 0 to 1
                x = 0;
                y = u * 1.6;
                z = 0;
            } else {
                // bend horizontally 90 degrees
                const u = (t - 0.6) / 0.4; // 0 to 1
                const angle = u * Math.PI / 2;
                const radius = 0.6;
                x = Math.sin(angle) * radius;
                y = 1.6 + (Math.cos(angle) * radius - radius);
                z = u * 0.1; // Slight helical twist to the blade edge
            }
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    
    const bladePath = new LBladeCurve(1.0);
    // Extrude a flat rectangular shape along the curve instead of a tube for realistic blades
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.15, -0.05);
    bladeShape.lineTo(0.15, -0.05);
    bladeShape.lineTo(0.15, 0.05);
    // Sharp cutting edge
    bladeShape.lineTo(-0.15, 0.02);
    bladeShape.lineTo(-0.15, -0.05);

    const bladeExtrudeSettings = {
        steps: 20,
        bevelEnabled: false,
        extrudePath: bladePath
    };
    const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, bladeExtrudeSettings);

    const rotatingElements = new THREE.Group();

    for (let i = 0; i < numFlanges; i++) {
        const flangeGroup = new THREE.Group();
        const zPos = -3.8 + i * flangeSpacing;
        flangeGroup.position.set(0, 0, zPos);
        
        // Add the steel flange disc
        const flangeMesh = new THREE.Mesh(flangeGeom, darkSteel);
        flangeGroup.add(flangeMesh);
        
        // Add L-Blades to this flange
        for (let j = 0; j < tinesPerFlange; j++) {
            const angle = (j / tinesPerFlange) * Math.PI * 2;
            // The blades form a helical spiral down the shaft to reduce shock loads
            const helixAngle = angle + (i * 0.3); 
            
            const bladeMesh = new THREE.Mesh(bladeGeom, darkSteel);
            // Position at the edge of the flange
            bladeMesh.position.set(
                Math.cos(helixAngle) * 0.6, 
                Math.sin(helixAngle) * 0.6, 
                0
            );
            
            // Rotate blade to point radially outward
            bladeMesh.rotation.z = helixAngle - Math.PI/2;
            
            // Alternate left-facing and right-facing L-blades
            if (j % 2 === 0) {
                // Flip the blade to face the other way
                bladeMesh.rotation.x = Math.PI;
            }
            
            // Add mounting bolts
            const bolt1 = createHexBolt();
            bolt1.position.set(0, 0.2, 0);
            const bolt2 = createHexBolt();
            bolt2.position.set(0, 0.5, 0);
            bladeMesh.add(bolt1, bolt2);

            flangeGroup.add(bladeMesh);
        }
        rotatingElements.add(flangeGroup);
    }
    
    rotorGroup.add(rotatingElements);
    meshes.rotorAssembly = rotorGroup;
    meshes.rotatingElements = rotatingElements; // Save for animation
    
    group.add(rotorGroup);
    parts.push({
        name: 'Rotor Assembly with L-Blades',
        description: 'Massive rotating tubular shaft equipped with heavy flanges and tempered boron steel L-shaped blades. Rotates at high speed to pulverize soil and incorporate crop residue.',
        material: 'steel, darkSteel, chrome',
        function: 'Soil cultivation and mixing',
        assemblyOrder: 7,
        connections: ['Side Drive', 'Main Deck Frame Bearings'],
        failureEffect: 'Blades break off, causing extreme imbalance and violent shaking.',
        cascadeFailures: ['Bearing shatter', 'Housing fracture'],
        originalPosition: { x: 1.5, y: 0.8, z: 0 },
        explodedPosition: { x: 1.5, y: -4, z: 0 }
    });

    // =========================================================================
    // PART 8: ADJUSTABLE DEPTH SKIDS (LEFT & RIGHT)
    // =========================================================================
    // Create the skid profile
    class SkidCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            // A sweeping curved rail
            const x = t * 4; 
            const y = (t < 0.2) ? (0.2 - t)*2 : 0; // Curve up at the front
            const z = 0;
            return optionalTarget.set(x, y, z);
        }
    }
    const skidPath = new SkidCurve();
    const skidGeom = new THREE.TubeGeometry(skidPath, 20, 0.15, 8, false);
    // Flatten it to look like a skid shoe
    skidGeom.scale(1, 0.3, 2.0);

    // Left Skid
    const leftSkidGroup = new THREE.Group();
    leftSkidGroup.position.set(-0.5, 0, -4.2);
    
    const leftSkidMesh = new THREE.Mesh(skidGeom, steel);
    leftSkidGroup.add(leftSkidMesh);
    
    // Upright adjustment bracket
    const bracketGeom = new THREE.BoxGeometry(0.4, 2, 0.1);
    const leftBracket = new THREE.Mesh(bracketGeom, darkSteel);
    leftBracket.position.set(2, 1, 0);
    leftSkidGroup.add(leftBracket);
    
    // Threaded adjustment rod
    const rodGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16);
    const leftRod = new THREE.Mesh(rodGeom, chrome);
    leftRod.position.set(2, 2.5, 0);
    leftSkidGroup.add(leftRod);

    group.add(leftSkidGroup);
    meshes.leftSkid = leftSkidGroup;

    // Right Skid
    const rightSkidGroup = leftSkidGroup.clone();
    rightSkidGroup.position.set(-0.5, 0, 4.2);
    group.add(rightSkidGroup);
    meshes.rightSkid = rightSkidGroup;

    parts.push({
        name: 'Depth Control Skids',
        description: 'Heavy duty adjustable steel runners mounted on the sides of the deck. By adjusting the threaded rods, the operator controls the maximum tilling depth.',
        material: 'steel, chrome',
        function: 'Tilling depth regulation and frame support',
        assemblyOrder: 8,
        connections: ['Main Deck Frame'],
        failureEffect: 'Tiller digs too deep, stalling tractor, or completely bounces out of the ground.',
        cascadeFailures: ['Tractor engine stall', 'PTO overload'],
        originalPosition: { x: -0.5, y: 0, z: 0 },
        explodedPosition: { x: -0.5, y: -3, z: 0 }
    });

    // =========================================================================
    // PART 9: TRAILING BOARD (REAR DEFLECTOR HOOD)
    // =========================================================================
    const trailingGroup = new THREE.Group();
    // Pivot point at the rear of the main deck
    trailingGroup.position.set(-1.8, 2.0, 0);

    const tbPts = [
        [0, 0], [-1.5, -1.5], [-1.8, -2.5], [-1.7, -2.6], [-1.3, -1.6], [0.2, 0]
    ];
    const tbGeom = createExtrusion(tbPts, 7.8, true);
    tbGeom.translate(0, 0, -3.9); // center it
    const tbMesh = new THREE.Mesh(tbGeom, steel);
    trailingGroup.add(tbMesh);
    
    // Add heavy tension springs pushing the board down
    const springGeom = new THREE.TorusGeometry(0.15, 0.04, 8, 24, Math.PI * 10);
    // Fake a coiled spring by scaling and rotating a highly-twisted torus, or just using a cylinder for simplicity here
    // We will use a tightly coiled tube
    class SpringCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const radius = 0.15;
            const turns = 12;
            const height = 1.2;
            const x = Math.cos(t * Math.PI * 2 * turns) * radius;
            const z = Math.sin(t * Math.PI * 2 * turns) * radius;
            const y = t * height;
            return optionalTarget.set(x, y, z);
        }
    }
    const springTube = new THREE.TubeGeometry(new SpringCurve(), 100, 0.03, 8, false);
    
    const spring1 = new THREE.Mesh(springTube, chrome);
    spring1.position.set(0, 0, -2);
    spring1.rotation.z = -0.5;
    trailingGroup.add(spring1);

    const spring2 = new THREE.Mesh(springTube, chrome);
    spring2.position.set(0, 0, 2);
    spring2.rotation.z = -0.5;
    trailingGroup.add(spring2);

    meshes.trailingBoard = trailingGroup;
    group.add(trailingGroup);

    parts.push({
        name: 'Spring-Loaded Trailing Board',
        description: 'Adjustable rear hood that traps the flung soil. The heavy tension springs keep it pressed down to smooth and level the tilled earth, creating a perfect seedbed.',
        material: 'steel, chrome',
        function: 'Soil containment and seedbed leveling',
        assemblyOrder: 9,
        connections: ['Main Deck Frame'],
        failureEffect: 'Clods of dirt are thrown dangerously far behind the tractor, leaving a rough, uneven field.',
        cascadeFailures: [],
        originalPosition: { x: -1.8, y: 2.0, z: 0 },
        explodedPosition: { x: -5, y: 3.0, z: 0 }
    });

    // =========================================================================
    // PART 10: HYDRAULIC LINES & DETAILING (High-Tech touch)
    // =========================================================================
    // Add some advanced hydraulic cylinders for remote depth/board adjustment
    const hydroGroup = new THREE.Group();
    hydroGroup.position.set(-1.0, 3.0, 2);
    
    const cylinderGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
    const cylinderMesh = new THREE.Mesh(cylinderGeom, tinted);
    hydroGroup.add(cylinderMesh);
    
    const pistonGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16);
    const pistonMesh = new THREE.Mesh(pistonGeom, chrome);
    pistonMesh.position.set(0, 0.8, 0);
    hydroGroup.add(pistonMesh);
    
    // Hydraulic hose
    class HoseCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            return optionalTarget.set(
                t * 2,
                Math.sin(t * Math.PI) * 1.5,
                t * -2
            );
        }
    }
    const hoseGeom = new THREE.TubeGeometry(new HoseCurve(), 32, 0.04, 8, false);
    const hoseMesh = new THREE.Mesh(hoseGeom, rubber);
    hoseMesh.position.set(0, -0.5, 0);
    hydroGroup.add(hoseMesh);

    group.add(hydroGroup);
    meshes.hydro = hydroGroup;

    parts.push({
        name: 'Hydraulic Actuators & Lines',
        description: 'Advanced hydraulic cylinders providing on-the-fly adjustment of the trailing board angle directly from the tractor cab.',
        material: 'tinted, chrome, rubber',
        function: 'Remote dynamic leveling control',
        assemblyOrder: 10,
        connections: ['Trailing Board', 'Main Deck Frame', 'Tractor Remotes'],
        failureEffect: 'Loss of hydraulic pressure, board drops to lowest setting.',
        cascadeFailures: ['Hydraulic fluid contamination'],
        originalPosition: { x: -1.0, y: 3.0, z: 2 },
        explodedPosition: { x: -2.0, y: 7.0, z: 4 }
    });


    // =========================================================================
    // QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "What is the primary function of the slip clutch on the PTO input shaft?",
            options: [
                "To increase the rotational speed of the tiller",
                "To protect the gearbox and tractor from sudden shock loads",
                "To engage the hydraulic trailing board",
                "To reverse the direction of the rotor"
            ],
            correctAnswer: 1,
            explanation: "The slip clutch consists of friction discs that will slip if the blades hit an immovable object (like a massive rock). This instantly dissipates the energy, preventing the shock from shattering the gearbox or destroying the tractor's internal PTO gearing."
        },
        {
            question: "Why are the L-Blades mounted in a helical (spiral) pattern along the rotor shaft?",
            options: [
                "It looks visually appealing",
                "To ensure only a few blades strike the soil at any given millisecond, reducing shock loads and vibration",
                "To push all the dirt to one side of the machine",
                "To make the blades easier to replace"
            ],
            correctAnswer: 1,
            explanation: "If all blades hit the ground simultaneously, the impact would cause severe violent vibration and require immense horsepower. The helical spiral pattern ensures continuous, smooth cutting action, minimizing torque spikes on the driveline."
        },
        {
            question: "What does the adjustable Trailing Board (Rear Hood) primarily accomplish?",
            options: [
                "It traps pulverized soil, forcing it downward to create a smooth, level seedbed",
                "It prevents the tractor from driving backwards",
                "It acts as a brake for the implement",
                "It provides structural support for the three-point hitch"
            ],
            correctAnswer: 0,
            explanation: "As the high-speed rotor throws dirt backwards, the spring-loaded trailing board catches the soil, shattering clods and ironing the dirt flat against the ground, leaving a perfectly prepared seedbed ready for planting."
        },
        {
            question: "What is the function of the central Cast Iron Gearbox?",
            options: [
                "To store hydraulic fluid for the actuators",
                "To convert the 540 RPM PTO power through a 90-degree angle and reduce the speed for the rotor",
                "To act as a counterweight to keep the implement in the ground",
                "To monitor the depth of the skids"
            ],
            correctAnswer: 1,
            explanation: "The heavy-duty bevel gearbox takes the longitudinal rotational power from the tractor's PTO shaft, turns it 90 degrees to a transverse shaft, and typically reduces the speed via gear ratios so the rotor turns at a highly effective 200-300 RPM."
        },
        {
            question: "If the Side Drive Chain (or gear train) snaps during operation, what is the immediate consequence?",
            options: [
                "The tractor engine will immediately stall",
                "The rotor will lose all power and stop turning, while the PTO shaft continues spinning freely",
                "The trailing board will fly up",
                "The slip clutch will start smoking"
            ],
            correctAnswer: 1,
            explanation: "The side drive is the final link in the power transmission chain. If it snaps, the mechanical connection to the rotor is severed. The tractor and upper transverse shaft will keep spinning, but the massive rotor assembly will coast to a halt in the soil."
        }
    ];

    // =========================================================================
    // ANIMATION FUNCTION
    // =========================================================================
    function animate(time, speed, activeMeshes) {
        // High speed rotation for the PTO input shaft
        if (activeMeshes.ptoInput) {
            // PTO typically spins at 540 RPM. We simulate high speed rotation.
            activeMeshes.ptoInput.rotation.x = time * speed * 20;
        }

        // The transverse shaft spins at the same speed as PTO (or slightly reduced depending on gearbox)
        if (activeMeshes.transShaft) {
            activeMeshes.transShaft.rotation.x = time * speed * 20;
        }

        // The rotor assembly spins slightly slower (gear reduction) but still very fast
        if (activeMeshes.rotatingElements) {
            // Negative rotation so it cuts 'forward' into the soil
            activeMeshes.rotatingElements.rotation.x = -time * speed * 10;
        }

        // Vibration effect on the main frame simulating heavy soil impact
        if (activeMeshes.mainFrame) {
            // Tiny high-frequency shake
            const shake = Math.sin(time * speed * 50) * 0.005;
            activeMeshes.mainFrame.position.y = shake;
        }

        // The trailing board bounces slightly as it rides over uneven pulverized soil
        if (activeMeshes.trailingBoard) {
            const bounce = Math.sin(time * speed * 8) * 0.05 + 0.05; // 0 to 0.1 radians
            activeMeshes.trailingBoard.rotation.z = -bounce;
        }
    }

    return {
        group,
        parts,
        description: "A highly advanced, heavy-duty agricultural Rotary Tiller (Rotovator). Equipped with a massive helical L-blade rotor, heavy cast iron gearbox, and adjustable trailing board. Engineered for intense soil pulverization, breaking up clods, and preparing perfect seedbeds in a single pass.",
        quizQuestions,
        animate,
        meshes
    };
}
