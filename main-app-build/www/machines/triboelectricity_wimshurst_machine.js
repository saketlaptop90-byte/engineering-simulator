import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions to create complex geometries
    function createLatheGeometry(points, segments = 64) {
        const vectorPoints = points.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(vectorPoints, segments);
    }

    function createBolt(x, y, z, rotationX = 0, rotationY = 0, rotationZ = 0) {
        const hexGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 6);
        const bolt = new THREE.Mesh(hexGeo, chrome);
        bolt.position.set(x, y, z);
        bolt.rotation.set(rotationX, rotationY, rotationZ);
        return bolt;
    }

    // 1. Base Platform - Ornate cast metal / dark wood style
    const baseGeo = new THREE.BoxGeometry(12, 1, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.5, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    
    // Add decorative base molding
    const moldingGeo = new THREE.BoxGeometry(12.5, 0.5, 6.5);
    const moldingMesh = new THREE.Mesh(moldingGeo, darkSteel);
    moldingMesh.position.set(0, -1.0, 0);
    baseMesh.add(moldingMesh);

    group.add(baseMesh);
    meshes.base = baseMesh;

    parts.push({
        name: "Base Platform",
        description: "A heavy, insulated platform providing stability and grounding for the complex electrostatic generation system. Contains vibration dampeners.",
        material: "darkSteel",
        function: "Structural support and insulation.",
        assemblyOrder: 1,
        connections: ["Support Pillars", "Leyden Jars", "Drive System Base"],
        failureEffect: "Machine instability and potential discharge to ground.",
        cascadeFailures: ["Rotor misalignment", "Leyden Jar cracking"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Support Pillars (Complex lathed structures)
    const pillarPoints = [
        [0.0, 0.0], [0.8, 0.0], [0.8, 0.5], [0.5, 0.8], [0.5, 2.0], [0.6, 2.5],
        [0.4, 3.0], [0.4, 5.0], [0.6, 5.5], [0.6, 6.5], [0.3, 7.0], [0.3, 8.5],
        [0.5, 9.0], [0.5, 10.0], [0.0, 10.0]
    ];
    const pillarGeo = createLatheGeometry(pillarPoints);
    const leftPillar = new THREE.Mesh(pillarGeo, glass);
    leftPillar.position.set(-2, 0, 0);
    const rightPillar = new THREE.Mesh(pillarGeo, glass);
    rightPillar.position.set(2, 0, 0);
    
    // Inner metal core for pillars
    const coreGeo = new THREE.CylinderGeometry(0.15, 0.15, 10, 16);
    const leftCore = new THREE.Mesh(coreGeo, steel);
    leftCore.position.set(0, 5, 0);
    leftPillar.add(leftCore);
    const rightCore = new THREE.Mesh(coreGeo, steel);
    rightCore.position.set(0, 5, 0);
    rightPillar.add(rightCore);

    group.add(leftPillar, rightPillar);
    meshes.leftPillar = leftPillar;
    meshes.rightPillar = rightPillar;

    parts.push({
        name: "Support Pillars",
        description: "Thick, highly polished dielectric glass pillars with internal steel cores to prevent electrical leakage while holding the main axle.",
        material: "glass/steel",
        function: "Supports the central axle and insulates the static charge from the base.",
        assemblyOrder: 2,
        connections: ["Base Platform", "Primary Axle"],
        failureEffect: "Charge bleeds into the base, zero output.",
        cascadeFailures: ["Complete depolarization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -5 }
    });

    // 3. Main Axle
    const axleGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 32);
    const mainAxle = new THREE.Mesh(axleGeo, steel);
    mainAxle.rotation.z = Math.PI / 2;
    mainAxle.position.set(0, 9, 0);
    group.add(mainAxle);
    meshes.mainAxle = mainAxle;

    // 4. Counter-Rotating Glass Disks (The Rotors)
    const diskRadius = 6;
    const diskThickness = 0.05;
    const diskGeo = new THREE.CylinderGeometry(diskRadius, diskRadius, diskThickness, 64);
    
    const diskFront = new THREE.Mesh(diskGeo, glass);
    diskFront.rotation.x = Math.PI / 2;
    diskFront.position.set(0, 9, 0.3);
    
    const diskRear = new THREE.Mesh(diskGeo, glass);
    diskRear.rotation.x = Math.PI / 2;
    diskRear.position.set(0, 9, -0.3);

    meshes.diskFront = diskFront;
    meshes.diskRear = diskRear;

    // 5. Metal Sectors (Tinfoil / Aluminum plates)
    const numSectors = 36;
    const sectorShape = new THREE.Shape();
    // A pie slice-like shape for the sectors
    sectorShape.moveTo(0, 0);
    sectorShape.lineTo(-0.3, 1.5);
    sectorShape.lineTo(0.3, 1.5);
    sectorShape.lineTo(0, 0);
    
    const sectorExtrudeSettings = { depth: 0.02, bevelEnabled: false };
    const sectorGeo = new THREE.ExtrudeGeometry(sectorShape, sectorExtrudeSettings);
    // Adjust sector geometry center
    sectorGeo.translate(0, 4.0, 0);

    const sectorsGroupFront = new THREE.Group();
    const sectorsGroupRear = new THREE.Group();

    for(let i=0; i<numSectors; i++) {
        const angle = (i / numSectors) * Math.PI * 2;
        
        const sectorF = new THREE.Mesh(sectorGeo, aluminum);
        sectorF.rotation.z = angle;
        sectorsGroupFront.add(sectorF);
        
        const sectorR = new THREE.Mesh(sectorGeo, aluminum);
        sectorR.rotation.z = angle;
        // Flip rear sectors so they face outward properly
        sectorR.rotation.y = Math.PI; 
        sectorsGroupRear.add(sectorR);
    }
    
    sectorsGroupFront.position.set(0, 0, diskThickness);
    sectorsGroupRear.position.set(0, 0, -diskThickness);
    
    diskFront.add(sectorsGroupFront);
    diskRear.add(sectorsGroupRear);
    
    group.add(diskFront, diskRear);

    parts.push({
        name: "Dielectric Rotors & Sectors",
        description: "Massive counter-rotating glass disks embedded with 36 aluminum foil sectors. They generate electrostatic charge via the triboelectric effect and induction.",
        material: "glass/aluminum",
        function: "Main charge generation through continuous breaking and making of capacitive contacts.",
        assemblyOrder: 3,
        connections: ["Primary Axle", "Neutralizing Brushes", "Charge Collectors"],
        failureEffect: "Lack of static charge buildup.",
        cascadeFailures: ["No spark generation"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 8 }
    });

    // 6. Drive System (Lower Axle, Pulleys, Belts, Crank)
    const driveAxleGeo = new THREE.CylinderGeometry(0.2, 0.2, 7, 32);
    const driveAxle = new THREE.Mesh(driveAxleGeo, steel);
    driveAxle.rotation.z = Math.PI / 2;
    driveAxle.position.set(0, 2, 0);
    group.add(driveAxle);
    meshes.driveAxle = driveAxle;

    const largePulleyGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32);
    const smallPulleyGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    
    // Front pulleys
    const pulleyFrontLower = new THREE.Mesh(largePulleyGeo, darkSteel);
    pulleyFrontLower.rotation.z = Math.PI / 2;
    pulleyFrontLower.position.set(0, 0, 0.6);
    driveAxle.add(pulleyFrontLower);
    
    const pulleyFrontUpper = new THREE.Mesh(smallPulleyGeo, darkSteel);
    pulleyFrontUpper.rotation.x = Math.PI / 2;
    pulleyFrontUpper.position.set(0, 0, 0.6);
    diskFront.add(pulleyFrontUpper);

    // Rear pulleys
    const pulleyRearLower = new THREE.Mesh(largePulleyGeo, darkSteel);
    pulleyRearLower.rotation.z = Math.PI / 2;
    pulleyRearLower.position.set(0, 0, -0.6);
    driveAxle.add(pulleyRearLower);
    
    const pulleyRearUpper = new THREE.Mesh(smallPulleyGeo, darkSteel);
    pulleyRearUpper.rotation.x = Math.PI / 2;
    pulleyRearUpper.position.set(0, 0, -0.6);
    diskRear.add(pulleyRearUpper);

    // Belts (represented as toruses stretched/scaled to form a loop)
    // In three.js it's hard to make a perfect dynamic belt loop simply, so we approximate with a scaled torus/tube
    const beltPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2, 0.6), // lower
        new THREE.Vector3(1.5, 5.5, 0.6),
        new THREE.Vector3(0, 9, 0.6), // upper
        new THREE.Vector3(-1.5, 5.5, 0.6),
    ]);
    beltPath.closed = true;
    const beltGeo = new THREE.TubeGeometry(beltPath, 64, 0.05, 8, true);
    const beltFront = new THREE.Mesh(beltGeo, rubber);
    group.add(beltFront);
    meshes.beltFront = beltFront;

    // Rear belt (crossed for counter-rotation) - Approximate visual of crossed belt
    const crossedBeltPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2, -0.6),
        new THREE.Vector3(1.0, 5.5, -0.5), // twist
        new THREE.Vector3(0, 9, -0.6),
        new THREE.Vector3(-1.0, 5.5, -0.7), // twist
    ]);
    crossedBeltPath.closed = true;
    const crossedBeltGeo = new THREE.TubeGeometry(crossedBeltPath, 64, 0.05, 8, true);
    const beltRear = new THREE.Mesh(crossedBeltGeo, rubber);
    group.add(beltRear);
    meshes.beltRear = beltRear;

    // Hand Crank
    const crankArmGeo = new THREE.BoxGeometry(0.3, 2.5, 0.2);
    const crankArm = new THREE.Mesh(crankArmGeo, chrome);
    crankArm.position.set(3.5, 2, 0.2);
    // Align to axle end
    crankArm.position.y += 1.25; 
    
    const handleGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
    const handle = new THREE.Mesh(handleGeo, plastic);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 1.1, 0.5);
    crankArm.add(handle);
    
    const crankPivot = new THREE.Group();
    crankPivot.position.set(3.5, 2, 0);
    crankArm.position.set(0, 1.25, 0);
    crankPivot.add(crankArm);
    group.add(crankPivot);
    meshes.crankPivot = crankPivot;

    parts.push({
        name: "Drive System & Hand Crank",
        description: "Kinetic transfer system utilizing high-tension rubber belts and a heavy chrome crank to forcefully rotate the disks in opposite directions.",
        material: "rubber/chrome",
        function: "Converts mechanical input into high-speed counter-rotation.",
        assemblyOrder: 4,
        connections: ["Base Platform", "Main Axle"],
        failureEffect: "Disks cease rotation.",
        cascadeFailures: ["Complete power failure"],
        originalPosition: { x: 3.5, y: 2, z: 0 },
        explodedPosition: { x: 8, y: 2, z: 0 }
    });

    // 7. Neutralizing Bars and Brushes
    // Front bar (45 degree angle)
    const neutBarGeo = new THREE.CylinderGeometry(0.08, 0.08, 12.5, 16);
    const neutBarFront = new THREE.Mesh(neutBarGeo, copper);
    neutBarFront.position.set(0, 9, 0.7);
    neutBarFront.rotation.z = Math.PI / 4;
    group.add(neutBarFront);
    
    // Rear bar (-45 degree angle)
    const neutBarRear = new THREE.Mesh(neutBarGeo, copper);
    neutBarRear.position.set(0, 9, -0.7);
    neutBarRear.rotation.z = -Math.PI / 4;
    group.add(neutBarRear);

    // Brushes
    const brushGeo = new THREE.BoxGeometry(0.3, 0.1, 0.4);
    const tinselGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4);
    
    function createBrushAssembly(isFront) {
        const brushGroup = new THREE.Group();
        const holder = new THREE.Mesh(brushGeo, chrome);
        brushGroup.add(holder);
        // Add many tiny tinsel wires
        for(let i=0; i<20; i++) {
            const wire = new THREE.Mesh(tinselGeo, copper);
            wire.position.set((Math.random() - 0.5) * 0.2, -0.15, (Math.random() - 0.5) * 0.3);
            wire.rotation.x = (Math.random() - 0.5) * 0.2;
            brushGroup.add(wire);
        }
        return brushGroup;
    }

    const brushF1 = createBrushAssembly(true);
    brushF1.position.set(0, 6, 0); // local to neutBar
    brushF1.rotation.x = Math.PI / 2; // point toward disk
    neutBarFront.add(brushF1);

    const brushF2 = createBrushAssembly(true);
    brushF2.position.set(0, -6, 0);
    brushF2.rotation.x = Math.PI / 2;
    neutBarFront.add(brushF2);

    const brushR1 = createBrushAssembly(false);
    brushR1.position.set(0, 6, 0);
    brushR1.rotation.x = -Math.PI / 2;
    neutBarRear.add(brushR1);

    const brushR2 = createBrushAssembly(false);
    brushR2.position.set(0, -6, 0);
    brushR2.rotation.x = -Math.PI / 2;
    neutBarRear.add(brushR2);

    parts.push({
        name: "Neutralizing Bars & Tinsel Brushes",
        description: "Copper rods equipped with microscopic copper tinsel brushes. They short out opposing sectors to induce massive potential differences.",
        material: "copper/chrome",
        function: "Resets the sector charges to maximize induction differential.",
        assemblyOrder: 5,
        connections: ["Primary Axle", "Sectors"],
        failureEffect: "Charge equalizes incorrectly; sparks fail to form.",
        cascadeFailures: ["Induction cycle breakdown"],
        originalPosition: { x: 0, y: 9, z: 0.7 },
        explodedPosition: { x: 0, y: 9, z: 6 }
    });

    // 8. Leyden Jars (Capacitors)
    function createLeydenJar() {
        const jarGroup = new THREE.Group();
        
        // Glass Jar
        const jarPoints = [
            [0,0], [1,0], [1, 3], [0.8, 3.5], [0.5, 4], [0.5, 5], [0, 5]
        ];
        const jarGeo = createLatheGeometry(jarPoints, 32);
        const jarMesh = new THREE.Mesh(jarGeo, tinted);
        jarGroup.add(jarMesh);

        // Outer Foil (Copper)
        const outerFoilPoints = [[0,0.01], [1.02, 0.01], [1.02, 2.5]];
        const foilGeo = createLatheGeometry(outerFoilPoints, 32);
        const outerFoil = new THREE.Mesh(foilGeo, copper);
        jarGroup.add(outerFoil);

        // Inner Rod & Chain
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 6, 16);
        const centralRod = new THREE.Mesh(rodGeo, chrome);
        centralRod.position.y = 3;
        jarGroup.add(centralRod);

        const ballGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const topBall = new THREE.Mesh(ballGeo, chrome);
        topBall.position.y = 6;
        jarGroup.add(topBall);

        return jarGroup;
    }

    const jarLeft = createLeydenJar();
    jarLeft.position.set(-4, 0, 3);
    group.add(jarLeft);

    const jarRight = createLeydenJar();
    jarRight.position.set(4, 0, 3);
    group.add(jarRight);

    parts.push({
        name: "Leyden Jars (High Voltage Capacitors)",
        description: "Massive, thick-walled glass vessels lined internally and externally with conductive copper. They act as prime accumulators for the electrostatic charge.",
        material: "tinted/copper",
        function: "Stores enormous electrostatic potential until dielectric breakdown occurs at the spark gap.",
        assemblyOrder: 6,
        connections: ["Base Platform", "Charge Collectors"],
        failureEffect: "Sparks become weak and frequent rather than loud and explosive.",
        cascadeFailures: ["Current bleed"],
        originalPosition: { x: -4, y: 0, z: 3 },
        explodedPosition: { x: -8, y: 0, z: 8 }
    });

    // 9. Charge Collectors (Combs)
    function createComb() {
        const combGroup = new THREE.Group();
        // U-shape pipe wrapping around the disks
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 1.5),
            new THREE.Vector3(0, 0, 0.5),
            new THREE.Vector3(0, 0, -0.5),
            new THREE.Vector3(0, 0, -1.5)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipePath, 16, 0.15, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, chrome);
        combGroup.add(pipe);

        // Teeth (pins pointing inward)
        const toothGeo = new THREE.CylinderGeometry(0.02, 0.01, 0.4, 8);
        for(let i=0; i<10; i++) {
            const zF = 0.4;
            const zR = -0.4;
            const yOffset = (i - 4.5) * 0.3;
            
            const toothF = new THREE.Mesh(toothGeo, copper);
            toothF.rotation.x = Math.PI / 2;
            toothF.position.set(0, yOffset, zF + 0.2);
            combGroup.add(toothF);
            
            const toothR = new THREE.Mesh(toothGeo, copper);
            toothR.rotation.x = -Math.PI / 2;
            toothR.position.set(0, yOffset, zR - 0.2);
            combGroup.add(toothR);
        }

        return combGroup;
    }

    const combLeft = createComb();
    combLeft.position.set(-6.5, 9, 0);
    group.add(combLeft);
    
    const combRight = createComb();
    combRight.position.set(6.5, 9, 0);
    // Rotate to face inward correctly
    combRight.rotation.y = Math.PI;
    group.add(combRight);

    // Connecting rods from combs to Leyden jars
    const connectRodGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
    
    const connLeft = new THREE.Mesh(connectRodGeo, chrome);
    connLeft.rotation.z = Math.PI / 4;
    connLeft.position.set(-5.2, 7.5, 1.5);
    // Adjust to link comb to jar top
    connLeft.lookAt(new THREE.Vector3(-4, 6, 3));
    group.add(connLeft);

    const connRight = new THREE.Mesh(connectRodGeo, chrome);
    connRight.position.set(5.2, 7.5, 1.5);
    connRight.lookAt(new THREE.Vector3(4, 6, 3));
    group.add(connRight);

    parts.push({
        name: "Ionizing Combs",
        description: "U-shaped highly polished chrome assemblies with sharpened copper teeth. They collect static charge via corona discharge from the spinning sectors without physical contact.",
        material: "chrome/copper",
        function: "Harvests high voltage from the rotors.",
        assemblyOrder: 7,
        connections: ["Rotors", "Leyden Jars", "Discharge Arms"],
        failureEffect: "Charge fails to route to the capacitors.",
        cascadeFailures: ["Zero terminal voltage"],
        originalPosition: { x: -6.5, y: 9, z: 0 },
        explodedPosition: { x: -12, y: 9, z: 0 }
    });

    // 10. Discharge Arms (The Spark Gap)
    // Left arm
    const armPivotLeft = new THREE.Group();
    armPivotLeft.position.set(-4, 6, 3); // Top of left Leyden jar
    
    const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 5, 16);
    const armMeshL = new THREE.Mesh(armGeo, chrome);
    armMeshL.position.set(2.5, 0, 0);
    armMeshL.rotation.z = Math.PI / 2;
    armPivotLeft.add(armMeshL);

    const sphereLarge = new THREE.SphereGeometry(0.6, 32, 32);
    const terminalL = new THREE.Mesh(sphereLarge, chrome);
    terminalL.position.set(5, 0, 0);
    armPivotLeft.add(terminalL);
    
    const handleGeo2 = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const handleL = new THREE.Mesh(handleGeo2, rubber);
    handleL.position.set(-0.5, 0, 0);
    handleL.rotation.z = Math.PI / 2;
    armPivotLeft.add(handleL);

    group.add(armPivotLeft);
    meshes.armPivotLeft = armPivotLeft;

    // Right arm
    const armPivotRight = new THREE.Group();
    armPivotRight.position.set(4, 6, 3);
    
    const armMeshR = new THREE.Mesh(armGeo, chrome);
    armMeshR.position.set(-2.5, 0, 0);
    armMeshR.rotation.z = Math.PI / 2;
    armPivotRight.add(armMeshR);

    const sphereSmall = new THREE.SphereGeometry(0.4, 32, 32);
    const terminalR = new THREE.Mesh(sphereSmall, chrome);
    terminalR.position.set(-5, 0, 0);
    armPivotRight.add(terminalR);

    const handleR = new THREE.Mesh(handleGeo2, rubber);
    handleR.position.set(0.5, 0, 0);
    handleR.rotation.z = Math.PI / 2;
    armPivotRight.add(handleR);

    group.add(armPivotRight);
    meshes.armPivotRight = armPivotRight;
    meshes.terminalL = terminalL;
    meshes.terminalR = terminalR;

    parts.push({
        name: "Discharge Terminals",
        description: "Heavy chrome articulating arms with unequal sphere sizes (one large, one small) to control the breakdown voltage threshold and direct the arc trajectory.",
        material: "chrome/rubber",
        function: "Provides an air gap for massive dielectric breakdown and lightning discharge.",
        assemblyOrder: 8,
        connections: ["Leyden Jars"],
        failureEffect: "No controlled spark gap; machine arcs internally.",
        cascadeFailures: ["Dielectric failure of glass pillars"],
        originalPosition: { x: -4, y: 6, z: 3 },
        explodedPosition: { x: -4, y: 12, z: 8 }
    });

    // 11. Emissive Spark / Lightning Arc
    // Using a tube with emissive material that flickers
    const sparkMat = new THREE.MeshStandardMaterial({
        color: 0x88bbff,
        emissive: 0x4488ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });

    const sparkGroup = new THREE.Group();
    group.add(sparkGroup);
    meshes.sparkGroup = sparkGroup;
    meshes.sparkMat = sparkMat;
    
    // Add point light for the flash
    const flashLight = new THREE.PointLight(0xaaddff, 0, 20);
    flashLight.position.set(0, 6, 3);
    group.add(flashLight);
    meshes.flashLight = flashLight;

    parts.push({
        name: "Plasma Arc / Dielectric Breakdown",
        description: "High-voltage plasma channel formed when the potential difference exceeds the dielectric strength of the air, reaching millions of volts.",
        material: "plasma",
        function: "Energy release mechanism.",
        assemblyOrder: 9,
        connections: ["Discharge Terminals"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 6, z: 3 },
        explodedPosition: { x: 0, y: 6, z: 10 }
    });

    // Quiz Questions
    const quizQuestions = [
        {
            question: "Why do the two large glass disks of the Wimshurst machine rotate in opposite directions?",
            options: [
                "To cool the machine down.",
                "To multiply the inductive charge exponentially through crossing paths of sectors.",
                "To cancel out magnetic fields.",
                "To balance the mechanical load on the crank."
            ],
            correctAnswer: 1,
            explanation: "Counter-rotation is critical to the influence process, where sectors on one disk induce opposite charges on the sectors of the other disk as they pass each other."
        },
        {
            question: "What is the primary function of the Leyden jars attached to the machine?",
            options: [
                "They act as high-voltage capacitors to store charge for a massive spark.",
                "They are simply decorative glass pillars.",
                "They filter out impurities in the air.",
                "They generate the initial charge via chemical reaction."
            ],
            correctAnswer: 0,
            explanation: "Leyden jars accumulate the continuously generated electrostatic charge. When the potential becomes high enough, it dumps all the stored energy simultaneously across the spark gap."
        },
        {
            question: "How do the U-shaped 'combs' collect charge without physically touching the metal sectors?",
            options: [
                "Through magnetic induction.",
                "By using corona discharge across a tiny air gap at the sharp points.",
                "They actually do touch, but move so fast you can't see it.",
                "Through radioactive decay."
            ],
            correctAnswer: 1,
            explanation: "The intensely sharp points of the combs create incredibly high localized electric fields, ionizing the air (corona discharge) and allowing charge to jump the small gap."
        },
        {
            question: "Why are the neutralizing brushes positioned at roughly 45-degree angles to the combs?",
            options: [
                "To look aesthetically pleasing.",
                "To clear dust off the glass.",
                "To ground sectors just after they pass the charge combs, prepping them to be induced again.",
                "To act as emergency brakes."
            ],
            correctAnswer: 2,
            explanation: "The neutralizing brushes short opposite sectors together right after they deliver their payload. This resets their charge state so they can forcefully pull in new charge via induction from the opposite disk."
        },
        {
            question: "What dictates the maximum spark length the Wimshurst machine can produce?",
            options: [
                "How fast you turn the crank.",
                "The color of the glass disks.",
                "The dielectric breakdown voltage of the air and the size/spacing of the components (preventing internal arcing).",
                "The amount of copper used in the base."
            ],
            correctAnswer: 2,
            explanation: "While turning it faster increases the current (sparks per second), the maximum voltage (and thus maximum spark length) is limited by when the charge decides to jump across other parts of the machine (leakage) rather than the spark gap."
        }
    ];

    let chargeLevel = 0;

    function animate(time, speed, activeMeshes) {
        // Rotate crank
        activeMeshes.crankPivot.rotation.z = time * speed * 2;
        
        // Rotate disks (counter rotation)
        // Adjust speed mapping due to gear ratios
        const diskSpeed = speed * 4;
        activeMeshes.diskFront.rotation.y = time * diskSpeed;
        activeMeshes.diskRear.rotation.y = -time * diskSpeed;
        
        // Animate belts
        activeMeshes.beltFront.rotation.y = time * diskSpeed * 2;
        activeMeshes.beltRear.rotation.y = -time * diskSpeed * 2;

        // Modulate charge buildup
        chargeLevel += speed * 0.05;
        
        // Spark logic
        if (chargeLevel > 1.0) {
            // Trigger spark
            chargeLevel = 0;
            
            // Rebuild spark geometry for random lightning shape
            activeMeshes.sparkGroup.clear();
            
            // Get positions of the two terminals in world space (approximate relative to group)
            const startVec = new THREE.Vector3();
            activeMeshes.terminalL.getWorldPosition(startVec);
            const endVec = new THREE.Vector3();
            activeMeshes.terminalR.getWorldPosition(endVec);
            
            // Convert back to group local space
            activeMeshes.sparkGroup.worldToLocal(startVec);
            activeMeshes.sparkGroup.worldToLocal(endVec);
            
            const distance = startVec.distanceTo(endVec);
            const segments = 10;
            
            const sparkPoints = [];
            sparkPoints.push(startVec);
            
            for(let i=1; i<segments; i++) {
                const t = i / segments;
                const point = new THREE.Vector3().lerpVectors(startVec, endVec, t);
                // Add jagged randomness
                point.x += (Math.random() - 0.5) * 0.5;
                point.y += (Math.random() - 0.5) * 0.5;
                point.z += (Math.random() - 0.5) * 0.5;
                sparkPoints.push(point);
            }
            sparkPoints.push(endVec);
            
            const sparkCurve = new THREE.CatmullRomCurve3(sparkPoints);
            const sparkGeo = new THREE.TubeGeometry(sparkCurve, 32, 0.03, 8, false);
            const sparkMesh = new THREE.Mesh(sparkGeo, activeMeshes.sparkMat);
            
            activeMeshes.sparkGroup.add(sparkMesh);
            
            // Flash light
            activeMeshes.flashLight.intensity = 5.0;
        } else {
            // Fade out spark and light
            if (activeMeshes.sparkGroup.children.length > 0) {
                const spark = activeMeshes.sparkGroup.children[0];
                spark.material.opacity = Math.max(0, spark.material.opacity - 0.1);
                if (spark.material.opacity <= 0) {
                    activeMeshes.sparkGroup.clear();
                }
            }
            activeMeshes.flashLight.intensity = Math.max(0, activeMeshes.flashLight.intensity - 0.5);
        }

        // Slightly bob the discharge arms up and down based on a slow sine wave to simulate adjustment
        activeMeshes.armPivotLeft.rotation.y = Math.sin(time * 0.5) * 0.2;
        activeMeshes.armPivotRight.rotation.y = -Math.sin(time * 0.5) * 0.2;
    }

    return {
        group,
        parts,
        description: "A hyper-realistic, fully functional electrostatic Wimshurst Machine. Features massive counter-rotating dielectric rotors, intricate copper neutralizing brushes, high-capacity Leyden jars, and dynamic multi-segmented plasma arc discharges simulating dielectric breakdown.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createWimshurstMachine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
