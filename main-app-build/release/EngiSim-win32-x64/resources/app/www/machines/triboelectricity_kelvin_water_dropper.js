import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Kelvin Water Dropper is an electrostatic generator that uses falling water to generate high voltage differences. Through electrostatic induction, cross-connected copper rings and collector cans accumulate opposite charges from water droplets, eventually discharging via a spark gap in a spectacular display of physics.";

    // Helper to create bolts
    const createBolt = (radius, height, segments) => {
        const hexGeo = new THREE.CylinderGeometry(radius, radius, height, 6);
        return hexGeo;
    };

    // 1. Base Plate
    const baseWidth = 40;
    const baseLength = 30;
    const baseHeight = 2;
    const baseGeom = new THREE.BoxGeometry(baseWidth, baseHeight, baseLength);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, baseHeight / 2, 0);
    group.add(baseMesh);
    parts.push({
        name: "Heavy Duty Base Plate",
        description: "A solid steel foundation grounding the apparatus and providing stability for the high-voltage operations.",
        material: "darkSteel",
        function: "Structural Support",
        assemblyOrder: 1,
        connections: ["Support Columns", "Insulator Stands"],
        failureEffect: "Apparatus becomes unstable, risking spills and short circuits.",
        cascadeFailures: ["Complete structural collapse"],
        originalPosition: { x: 0, y: baseHeight / 2, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Rubber Feet
    const footGeo = new THREE.CylinderGeometry(1.5, 2, 1, 16);
    const footPositions = [
        [-baseWidth/2 + 3, 0.5, -baseLength/2 + 3],
        [baseWidth/2 - 3, 0.5, -baseLength/2 + 3],
        [-baseWidth/2 + 3, 0.5, baseLength/2 - 3],
        [baseWidth/2 - 3, 0.5, baseLength/2 - 3]
    ];
    footPositions.forEach(pos => {
        const foot = new THREE.Mesh(footGeo, rubber);
        foot.position.set(pos[0], pos[1], pos[2]);
        group.add(foot);
    });

    // 3. Main Support Columns
    const colHeight = 50;
    const colGeo = new THREE.CylinderGeometry(1.2, 1.2, colHeight, 32);
    const colPositions = [
        [-8, baseHeight + colHeight/2, -10],
        [8, baseHeight + colHeight/2, -10],
        [-8, baseHeight + colHeight/2, 10],
        [8, baseHeight + colHeight/2, 10]
    ];
    colPositions.forEach(pos => {
        const col = new THREE.Mesh(colGeo, steel);
        col.position.set(pos[0], pos[1], pos[2]);
        // Add some detail to columns
        for(let i=0; i<5; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.2, 8, 32), chrome);
            ring.position.set(pos[0], pos[1] - 20 + i*10, pos[2]);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
        }
        group.add(col);
    });

    // 4. Top Reservoir Stand
    const topStandGeo = new THREE.BoxGeometry(20, 1.5, 24);
    const topStandMesh = new THREE.Mesh(topStandGeo, steel);
    topStandMesh.position.set(0, baseHeight + colHeight + 0.75, 0);
    group.add(topStandMesh);
    
    // 5. Top Water Reservoir
    const tankRadius = 8;
    const tankHeight = 12;
    const tankGeo = new THREE.CylinderGeometry(tankRadius, tankRadius, tankHeight, 32, 1, true);
    const tankMesh = new THREE.Mesh(tankGeo, glass);
    tankMesh.position.set(0, baseHeight + colHeight + 1.5 + tankHeight/2, 0);
    group.add(tankMesh);

    const tankBaseGeo = new THREE.CylinderGeometry(tankRadius + 0.5, tankRadius + 0.5, 1, 32);
    const tankBase = new THREE.Mesh(tankBaseGeo, aluminum);
    tankBase.position.set(0, baseHeight + colHeight + 1.5 + 0.5, 0);
    group.add(tankBase);

    const waterGeo = new THREE.CylinderGeometry(tankRadius - 0.2, tankRadius - 0.2, tankHeight * 0.8, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x0077ff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, baseHeight + colHeight + 1.5 + (tankHeight*0.8)/2 + 0.2, 0);
    group.add(waterMesh);
    
    parts.push({
        name: "Top Water Reservoir",
        description: "Holds the bulk water supply. Requires a steady head pressure to ensure consistent drip rates.",
        material: "glass",
        function: "Water Storage",
        assemblyOrder: 2,
        connections: ["Manifold", "Support Columns"],
        failureEffect: "Uncontrolled water release or dry run.",
        cascadeFailures: ["Loss of charge generation"],
        originalPosition: { x: 0, y: 58.5, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // 6. Manifold and Piping
    const pipeGroup = new THREE.Group();
    // Central down pipe
    const downPipe = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 16), steel);
    downPipe.position.set(0, baseHeight + colHeight - 0.5, 0);
    pipeGroup.add(downPipe);
    
    // Cross pipe (T-junction)
    const crossPipe = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 24, 16), steel);
    crossPipe.rotation.z = Math.PI / 2;
    crossPipe.position.set(0, baseHeight + colHeight - 2, 0);
    pipeGroup.add(crossPipe);

    // Left and Right down spouts
    const leftSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.4, 4, 16), chrome);
    leftSpout.position.set(-11, baseHeight + colHeight - 4, 0);
    pipeGroup.add(leftSpout);
    
    const rightSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.4, 4, 16), chrome);
    rightSpout.position.set(11, baseHeight + colHeight - 4, 0);
    pipeGroup.add(rightSpout);

    // Valves
    const createValve = (x, y, z) => {
        const vGroup = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 2), steel);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 16), chrome);
        stem.position.y = 2;
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 32), plastic);
        wheel.rotation.x = Math.PI/2;
        wheel.position.y = 3;
        const nut = new THREE.Mesh(createBolt(0.6, 0.5, 6), aluminum);
        nut.position.y = 1.5;
        
        vGroup.add(body, stem, wheel, nut);
        vGroup.position.set(x, y, z);
        return vGroup;
    };

    const leftValve = createValve(-6, baseHeight + colHeight - 2, 0);
    const rightValve = createValve(6, baseHeight + colHeight - 2, 0);
    pipeGroup.add(leftValve, rightValve);
    group.add(pipeGroup);

    parts.push({
        name: "Precision Flow Valves",
        description: "Dual needle valves controlling the precise drop rate for the left and right nozzles.",
        material: "chrome",
        function: "Flow Regulation",
        assemblyOrder: 3,
        connections: ["Reservoir", "Inducer Rings"],
        failureEffect: "Continuous stream instead of droplets prevents discrete charge separation.",
        cascadeFailures: ["Complete charge failure"],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 20 }
    });

    // 7. Inducer Rings (The complex coils)
    const createInducer = (x, y, z) => {
        const iGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(2, 0.4, 16, 64);
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.rotation.x = Math.PI / 2;
        
        const mountArm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6, 16), plastic);
        mountArm.rotation.z = Math.PI / 2;
        mountArm.position.set((x > 0 ? -3 : 3), 0, 0);

        iGroup.add(ring, mountArm);
        iGroup.position.set(x, y, z);
        return iGroup;
    };

    const inducerHeight = baseHeight + colHeight - 8;
    const leftInducer = createInducer(-11, inducerHeight, 0);
    const rightInducer = createInducer(11, inducerHeight, 0);
    group.add(leftInducer, rightInducer);

    parts.push({
        name: "Inducer Rings",
        description: "Copper toroids that induce electrostatic charge on the falling water droplets passing through them.",
        material: "copper",
        function: "Charge Induction",
        assemblyOrder: 4,
        connections: ["Nozzles", "Cross Wiring"],
        failureEffect: "No charge separation occurs.",
        cascadeFailures: ["Zero voltage output"],
        originalPosition: { x: -11, y: inducerHeight, z: 0 },
        explodedPosition: { x: -30, y: inducerHeight, z: 0 }
    });

    // 8. Collector Cans
    const canHeight = 12;
    const canRadius = 3.5;
    const createCollector = (x, y, z) => {
        const cGroup = new THREE.Group();
        const outerCan = new THREE.Mesh(new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 32, 1, true), steel);
        const innerCan = new THREE.Mesh(new THREE.CylinderGeometry(canRadius - 0.1, canRadius - 0.1, canHeight, 32, 1, false), steel);
        
        const rim = new THREE.Mesh(new THREE.TorusGeometry(canRadius, 0.2, 16, 64), chrome);
        rim.rotation.x = Math.PI/2;
        rim.position.y = canHeight/2;

        const base = new THREE.Mesh(new THREE.CylinderGeometry(canRadius, canRadius, 0.5, 32), aluminum);
        base.position.y = -canHeight/2;

        // Inside screen to catch splashes and conduct charge
        const screenGeo = new THREE.CylinderGeometry(canRadius-0.2, canRadius-0.2, 1, 16, 1, true);
        const screenMat = new THREE.MeshStandardMaterial({color: 0x555555, wireframe: true});
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.y = 2;

        cGroup.add(outerCan, innerCan, rim, base, screen);
        cGroup.position.set(x, y, z);
        return cGroup;
    };

    const collectorY = baseHeight + 10;
    const leftCollector = createCollector(-11, collectorY, 0);
    const rightCollector = createCollector(11, collectorY, 0);
    group.add(leftCollector, rightCollector);

    parts.push({
        name: "Collector Cans",
        description: "Capacitive reservoirs that collect the charged water and accumulate extremely high electrostatic potentials.",
        material: "steel",
        function: "Charge Accumulation",
        assemblyOrder: 5,
        connections: ["Insulator Stands", "Cross Wiring", "Spark Gap"],
        failureEffect: "Charge leaks to ground; no high voltage built.",
        cascadeFailures: ["Apparatus rendered inert"],
        originalPosition: { x: 11, y: collectorY, z: 0 },
        explodedPosition: { x: 30, y: collectorY, z: 0 }
    });

    // 9. Insulator Stands for Cans
    const createInsulator = (x, y, z) => {
        const iGroup = new THREE.Group();
        const glassRod = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10, 16), glass);
        const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 16), plastic);
        topCap.position.y = 5;
        const botCap = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 16), plastic);
        botCap.position.y = -5;
        
        iGroup.add(glassRod, topCap, botCap);
        iGroup.position.set(x, y, z);
        return iGroup;
    };

    const leftInsulator = createInsulator(-11, baseHeight + 5, 0);
    const rightInsulator = createInsulator(11, baseHeight + 5, 0);
    group.add(leftInsulator, rightInsulator);

    // 10. Cross Wiring (Complex 3D curves)
    // Wire from Left Collector to Right Inducer
    class CustomCurve1 extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = -11 + t * 22; // From x=-11 to x=11
            const ty = collectorY - 2 + t * (inducerHeight - collectorY + 2); // Upward slope
            const tz = Math.sin(t * Math.PI) * 15; // Arc outward in Z to avoid central structure
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    // Wire from Right Collector to Left Inducer
    class CustomCurve2 extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = 11 - t * 22; // From x=11 to x=-11
            const ty = collectorY - 2 + t * (inducerHeight - collectorY + 2);
            const tz = -Math.sin(t * Math.PI) * 15; // Arc outward in -Z
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    const wireGeo1 = new THREE.TubeGeometry(new CustomCurve1(), 64, 0.3, 8, false);
    const wire1 = new THREE.Mesh(wireGeo1, copper);
    group.add(wire1);

    const wireGeo2 = new THREE.TubeGeometry(new CustomCurve2(), 64, 0.3, 8, false);
    const wire2 = new THREE.Mesh(wireGeo2, copper);
    group.add(wire2);

    parts.push({
        name: "Cross-Connection Wiring",
        description: "Heavy gauge copper cables that cross-link the collector of one side to the inducer of the opposite side, creating a positive feedback loop.",
        material: "copper",
        function: "Feedback Circuit",
        assemblyOrder: 6,
        connections: ["Collector Cans", "Inducer Rings"],
        failureEffect: "Feedback loop broken.",
        cascadeFailures: ["No exponential voltage growth"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 30, z: -30 }
    });

    // 11. Spark Gap System
    const sparkMountY = baseHeight + 15;
    const sparkMountGeo = new THREE.BoxGeometry(6, 4, 4);
    const sparkMount = new THREE.Mesh(sparkMountGeo, plastic);
    sparkMount.position.set(0, sparkMountY, 8);
    group.add(sparkMount);

    // Spark electrodes
    const electrodeGeo = new THREE.CylinderGeometry(0.2, 0.5, 6, 16);
    electrodeGeo.rotateZ(Math.PI/2);
    
    const leftElectrode = new THREE.Mesh(electrodeGeo, chrome);
    leftElectrode.position.set(-1.5, sparkMountY, 8);
    
    const rightElectrode = new THREE.Mesh(electrodeGeo, chrome);
    rightElectrode.position.set(1.5, sparkMountY, 8);
    
    // Knobs on electrodes
    const knobGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const leftKnob = new THREE.Mesh(knobGeo, chrome);
    leftKnob.position.set(-4.5, sparkMountY, 8);
    const rightKnob = new THREE.Mesh(knobGeo, chrome);
    rightKnob.position.set(4.5, sparkMountY, 8);

    group.add(leftElectrode, rightElectrode, leftKnob, rightKnob);

    // Wiring from collectors to spark gap
    class SparkWireCurveL extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = -11 + t * 6.5; 
            const ty = collectorY + t * (sparkMountY - collectorY);
            const tz = t * 8; 
            return optionalTarget.set(tx, ty, tz);
        }
    }
    class SparkWireCurveR extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = 11 - t * 6.5; 
            const ty = collectorY + t * (sparkMountY - collectorY);
            const tz = t * 8; 
            return optionalTarget.set(tx, ty, tz);
        }
    }

    const swireGeoL = new THREE.TubeGeometry(new SparkWireCurveL(), 32, 0.2, 8, false);
    const swireL = new THREE.Mesh(swireGeoL, rubber);
    group.add(swireL);

    const swireGeoR = new THREE.TubeGeometry(new SparkWireCurveR(), 32, 0.2, 8, false);
    const swireR = new THREE.Mesh(swireGeoR, rubber);
    group.add(swireR);

    parts.push({
        name: "Spark Gap Terminals",
        description: "Adjustable brass/chrome spheres where the accumulated high voltage violently discharges as a visible electrical arc.",
        material: "chrome",
        function: "Voltage Discharge",
        assemblyOrder: 7,
        connections: ["Collector Cans", "Spark Gap Mount"],
        failureEffect: "Voltage builds until parasitic corona discharge occurs elsewhere.",
        cascadeFailures: ["Unintended shocks", "Ozone buildup"],
        originalPosition: { x: 0, y: sparkMountY, z: 8 },
        explodedPosition: { x: 0, y: sparkMountY + 20, z: 25 }
    });

    // 12. Water Droplet Particle System (InstancedMesh)
    const dropCount = 100;
    const dropGeo = new THREE.SphereGeometry(0.3, 8, 8);
    // Stretch to look like falling drops
    dropGeo.scale(1, 1.5, 1);
    
    // We'll use the waterMat from earlier
    const dropInstancedMeshL = new THREE.InstancedMesh(dropGeo, waterMat, dropCount);
    const dropInstancedMeshR = new THREE.InstancedMesh(dropGeo, waterMat, dropCount);
    
    // Store logic data for drops
    const dropDataL = [];
    const dropDataR = [];
    const startYL = baseHeight + colHeight - 4.5;
    const endYL = collectorY; // Splashes here
    
    const dummy = new THREE.Object3D();
    for (let i = 0; i < dropCount; i++) {
        const yL = startYL - Math.random() * (startYL - endYL);
        const yR = startYL - Math.random() * (startYL - endYL);
        const speedL = 0.5 + Math.random() * 0.2;
        const speedR = 0.5 + Math.random() * 0.2;
        
        dropDataL.push({ y: yL, speed: speedL, xOffset: (Math.random()-0.5)*0.2 });
        dropDataR.push({ y: yR, speed: speedR, xOffset: (Math.random()-0.5)*0.2 });

        dummy.position.set(-11 + dropDataL[i].xOffset, yL, 0);
        dummy.updateMatrix();
        dropInstancedMeshL.setMatrixAt(i, dummy.matrix);

        dummy.position.set(11 + dropDataR[i].xOffset, yR, 0);
        dummy.updateMatrix();
        dropInstancedMeshR.setMatrixAt(i, dummy.matrix);
    }
    
    group.add(dropInstancedMeshL, dropInstancedMeshR);

    // 13. The Spark (Glow / Flash effect)
    // We create a jagged line for the spark
    const sparkPoints = [];
    const segments = 10;
    const gapWidth = 3.0; // Distance between electrodes
    for (let i = 0; i <= segments; i++) {
        const px = -1.5 + (i / segments) * gapWidth;
        const py = sparkMountY + (Math.random() - 0.5) * 0.5;
        const pz = 8 + (Math.random() - 0.5) * 0.5;
        sparkPoints.push(new THREE.Vector3(px, py, pz));
    }
    const sparkLineGeo = new THREE.BufferGeometry().setFromPoints(sparkPoints);
    const sparkLineMat = new THREE.LineBasicMaterial({ 
        color: 0x88ccff, 
        transparent: true, 
        opacity: 0,
        linewidth: 3
    });
    const sparkLine = new THREE.Line(sparkLineGeo, sparkLineMat);
    group.add(sparkLine);
    
    // Spark Glow
    const sparkGlowGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const sparkGlowMat = new THREE.MeshBasicMaterial({ 
        color: 0x4488ff, 
        transparent: true, 
        opacity: 0 
    });
    const sparkGlow = new THREE.Mesh(sparkGlowGeo, sparkGlowMat);
    sparkGlow.position.set(0, sparkMountY, 8);
    group.add(sparkGlow);

    // Emissive effects on cans for visual feedback of charge
    const leftCanEmissiveMat = steel.clone();
    leftCanEmissiveMat.emissive = new THREE.Color(0xff0000);
    leftCanEmissiveMat.emissiveIntensity = 0;
    
    const rightCanEmissiveMat = steel.clone();
    rightCanEmissiveMat.emissive = new THREE.Color(0x0000ff);
    rightCanEmissiveMat.emissiveIntensity = 0;

    // Apply to the outer cylinders of the cans
    leftCollector.children[0].material = leftCanEmissiveMat;
    rightCollector.children[0].material = rightCanEmissiveMat;

    let chargeLevel = 0;
    let sparkFlashFrames = 0;

    // 14. Add highly detailed instrumentation / control panel
    const panelGroup = new THREE.Group();
    const panelBase = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 1), darkSteel);
    panelBase.rotation.x = -Math.PI / 6;
    panelBase.position.set(0, baseHeight + 5, 12);
    
    // Screens/Dials on panel
    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    screen1.position.set(-2.5, 1, 0.55);
    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), new THREE.MeshBasicMaterial({color: 0xff0000}));
    screen2.position.set(2.5, 1, 0.55);
    
    const dial1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 16), plastic);
    dial1.rotation.x = Math.PI/2;
    dial1.position.set(-2.5, -2, 0.6);
    const dial2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 16), plastic);
    dial2.rotation.x = Math.PI/2;
    dial2.position.set(2.5, -2, 0.6);

    panelGroup.add(panelBase, screen1, screen2, dial1, dial2);
    group.add(panelGroup);

    // Quiz Questions
    const quizQuestions = [
        {
            question: "What physical mechanism allows the Kelvin Water Dropper to generate high voltages?",
            options: [
                "Electromagnetic induction from moving magnets",
                "Electrostatic induction amplifying tiny initial charge imbalances",
                "Chemical reactions in the water",
                "Friction between water and the copper rings"
            ],
            correctAnswer: 1,
            explanation: "The Kelvin Water Dropper operates on electrostatic induction. A tiny initial imbalance causes one ring to attract opposite charges in the water stream. This charge falls into a can, which is wired to the opposite ring, exponentially amplifying the effect in a positive feedback loop."
        },
        {
            question: "Why must the streams break into individual droplets precisely within or near the inducer rings?",
            options: [
                "To cool the rings effectively",
                "To maximize the splash radius",
                "To isolate the induced charge so it can be carried away by gravity",
                "To reduce the water pressure on the collector cans"
            ],
            correctAnswer: 2,
            explanation: "If the stream is continuous, charge will just flow back up the stream to ground. Breaking into droplets electrically isolates the charged water, allowing gravity to do work against the electrostatic forces and transport the charge to the cans."
        },
        {
            question: "What is the purpose of the cross-wiring (left can to right ring, right can to left ring)?",
            options: [
                "To create a positive feedback loop that amplifies the charge",
                "To equalize the water level in both cans",
                "To structural reinforce the apparatus",
                "To ground the system safely"
            ],
            correctAnswer: 0,
            explanation: "The cross-wiring creates positive feedback. As the left can gains negative charge, it makes the right ring more negative, which induces more positive charge in the right water stream, which fills the right can, making the left ring more positive, and so on."
        },
        {
            question: "What supplies the energy to create the extremely high voltage difference?",
            options: [
                "The chemical potential of the copper",
                "The kinetic energy and gravitational potential energy of the falling water",
                "The ambient heat of the room",
                "A hidden battery"
            ],
            correctAnswer: 1,
            explanation: "Gravity does mechanical work by pulling charged droplets downward against the electrostatic repulsion of the like-charged collector cans they are falling into. This converts gravitational potential energy into electrical potential energy."
        },
        {
            question: "What happens when the voltage between the two spark gap terminals exceeds the breakdown voltage of air?",
            options: [
                "The water turns to steam",
                "The copper rings melt",
                "A spark jumps across the gap, neutralizing the accumulated charge",
                "The apparatus reverses polarity permanently"
            ],
            correctAnswer: 2,
            explanation: "When the electric field exceeds the dielectric strength of air (about 3 million volts per meter), the air ionizes, becoming conductive. A sudden spark discharges the capacitors (cans), resetting the system to begin building charge again."
        }
    ];

    // Animation Loop
    function animate(time, speed, meshes) {
        // Drop physics
        for (let i = 0; i < dropCount; i++) {
            // Left drops
            dropDataL[i].y -= dropDataL[i].speed * speed;
            if (dropDataL[i].y < endYL) {
                dropDataL[i].y = startYL;
                dropDataL[i].xOffset = (Math.random()-0.5)*0.2;
            }
            dummy.position.set(-11 + dropDataL[i].xOffset, dropDataL[i].y, 0);
            
            // Deflect drops slightly based on charge level (Electrostatic repulsion/attraction)
            if (dropDataL[i].y < inducerHeight && dropDataL[i].y > endYL + 2) {
                // As charge increases, spray becomes wider due to self-repulsion of drops
                dummy.position.x += (Math.random()-0.5) * (chargeLevel * 0.05);
            }
            dummy.updateMatrix();
            dropInstancedMeshL.setMatrixAt(i, dummy.matrix);

            // Right drops
            dropDataR[i].y -= dropDataR[i].speed * speed;
            if (dropDataR[i].y < endYL) {
                dropDataR[i].y = startYL;
                dropDataR[i].xOffset = (Math.random()-0.5)*0.2;
            }
            dummy.position.set(11 + dropDataR[i].xOffset, dropDataR[i].y, 0);
            
            if (dropDataR[i].y < inducerHeight && dropDataR[i].y > endYL + 2) {
                dummy.position.x += (Math.random()-0.5) * (chargeLevel * 0.05);
            }
            dummy.updateMatrix();
            dropInstancedMeshR.setMatrixAt(i, dummy.matrix);
        }
        
        dropInstancedMeshL.instanceMatrix.needsUpdate = true;
        dropInstancedMeshR.instanceMatrix.needsUpdate = true;

        // Charge accumulation
        if (sparkFlashFrames <= 0) {
            // Exponential growth simulation
            chargeLevel += 0.1 * speed * (1 + chargeLevel * 0.05); 
            
            // Update emissive visuals (glow gets brighter as charge builds)
            leftCanEmissiveMat.emissiveIntensity = Math.min(1.0, chargeLevel / 100);
            rightCanEmissiveMat.emissiveIntensity = Math.min(1.0, chargeLevel / 100);
            
            // Randomize spark line points slightly to prepare for strike
            const sparkGeomAttr = sparkLine.geometry.attributes.position;
            for(let i=1; i<segments; i++) {
                sparkGeomAttr.setY(i, sparkMountY + (Math.random() - 0.5) * 0.8 * (chargeLevel/100));
                sparkGeomAttr.setZ(i, 8 + (Math.random() - 0.5) * 0.8 * (chargeLevel/100));
            }
            sparkLine.geometry.attributes.position.needsUpdate = true;

            // Trigger spark
            if (chargeLevel >= 100) {
                sparkFlashFrames = 5;
                chargeLevel = 0; // Discharge
            }
        } else {
            // Flashing state
            sparkLineMat.opacity = 1.0;
            sparkGlowMat.opacity = 0.8 + Math.random() * 0.2;
            
            // Jitter the spark wildly
            const sparkGeomAttr = sparkLine.geometry.attributes.position;
            for(let i=1; i<segments; i++) {
                sparkGeomAttr.setY(i, sparkMountY + (Math.random() - 0.5) * 3);
                sparkGeomAttr.setZ(i, 8 + (Math.random() - 0.5) * 3);
            }
            sparkLine.geometry.attributes.position.needsUpdate = true;

            leftCanEmissiveMat.emissiveIntensity = 0;
            rightCanEmissiveMat.emissiveIntensity = 0;

            sparkFlashFrames -= speed;
            if (sparkFlashFrames <= 0) {
                sparkLineMat.opacity = 0;
                sparkGlowMat.opacity = 0;
            }
        }

        // Animate screens on panel
        screen1.material.color.setHSL(0.3, 1.0, Math.random() > 0.9 ? 0.8 : 0.4);
        screen2.material.color.setHSL(0.0, 1.0, 0.2 + (chargeLevel/100) * 0.8);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createKelvinWaterDropper() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
