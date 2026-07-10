import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "Ultra High-Tech Hyper-Realistic Civil Crane Jib Component. Features a massive lattice truss structure, internal cross-bracing, highly detailed trolley assembly, wire rope pendants, dynamic hoist mechanism, wind anemometer, and aviation warning lights. Engineereed for maximum realism and mechanical precision.";

    const quizQuestions = [
        {
            question: "What is the primary structural advantage of the lattice truss design used in this crane jib?",
            options: ["It completely eliminates wind resistance.", "It provides a high strength-to-weight ratio for long spans.", "It requires no maintenance or painting.", "It is flexible and bends easily under load."],
            answer: 1,
            explanation: "Lattice trusses use interconnected triangles to distribute stress, offering immense strength while minimizing weight, which is critical for long crane jibs."
        },
        {
            question: "Which component is responsible for adjusting the working radius of the load along the jib?",
            options: ["The Hoist Drum", "The Hook Block", "The Trolley Assembly", "The Anemometer"],
            answer: 2,
            explanation: "The trolley assembly moves longitudinally along the jib track, changing the horizontal distance (radius) of the load from the crane tower."
        },
        {
            question: "Why are wire rope pendants preferred over solid steel rods for jib tie-backs in high-tech cranes?",
            options: ["They look better aesthetically.", "They conduct electricity efficiently.", "They provide high tensile strength with flexibility to absorb dynamic shock loads.", "They are entirely immune to rust."],
            answer: 2,
            explanation: "Wire ropes offer extreme tensile strength and slight elasticity, allowing them to dampen and absorb shock loads during heavy lifting without snapping like rigid rods might."
        },
        {
            question: "What is the function of the sheaves inside the hook block?",
            options: ["To cool the hydraulic fluid.", "To provide mechanical advantage by routing the wire rope in multiple falls.", "To prevent the hook from spinning.", "To measure the wind speed."],
            answer: 1,
            explanation: "Sheaves (pulleys) inside the hook block route the wire rope back and forth, multiplying the lifting force (mechanical advantage) at the cost of slower hoist speed."
        },
        {
            question: "What critical environmental metric does the anemometer monitor on the crane jib?",
            options: ["Humidity levels", "Barometric pressure", "Wind speed and direction", "Ambient temperature"],
            answer: 2,
            explanation: "The anemometer measures wind speed. High winds can induce dangerous side loads on a long lattice jib, requiring crane operations to be halted for safety."
        }
    ];

    // --- Helper Functions for Procedural Generation --- //

    // 1. Create highly detailed Lattice Truss Section
    function createLatticeSection(width, height, length, segments, taperX = 0, taperY = 0) {
        const sectionGroup = new THREE.Group();
        const chordRadius = 0.08;
        const braceRadius = 0.04;
        
        const chordGeo = new THREE.CylinderGeometry(chordRadius, chordRadius, length, 16);
        chordGeo.rotateX(Math.PI / 2); // orient along Z

        // 4 Chords
        const positions = [
            [-width/2, -height/2],
            [width/2, -height/2],
            [-width/2 + taperX, height/2 - taperY],
            [width/2 - taperX, height/2 - taperY]
        ];

        for (let i = 0; i < 4; i++) {
            const chord = new THREE.Mesh(chordGeo, steel);
            chord.position.set(positions[i][0], positions[i][1], 0);
            sectionGroup.add(chord);
        }

        // Internal cross bracing
        const segLength = length / segments;
        const braceMaterial = darkSteel;

        for (let i = 0; i < segments; i++) {
            const zStart = -length/2 + i * segLength;
            const zEnd = -length/2 + (i + 1) * segLength;
            const zMid = (zStart + zEnd) / 2;

            // Transverse braces (frames)
            const frameGeoX1 = new THREE.CylinderGeometry(braceRadius, braceRadius, width, 8);
            frameGeoX1.rotateZ(Math.PI / 2);
            const frame1 = new THREE.Mesh(frameGeoX1, braceMaterial);
            frame1.position.set(0, -height/2, zStart);
            sectionGroup.add(frame1);

            const frameGeoX2 = new THREE.CylinderGeometry(braceRadius, braceRadius, width - 2*taperX, 8);
            frameGeoX2.rotateZ(Math.PI / 2);
            const frame2 = new THREE.Mesh(frameGeoX2, braceMaterial);
            frame2.position.set(0, height/2 - taperY, zStart);
            sectionGroup.add(frame2);

            const frameGeoY1 = new THREE.CylinderGeometry(braceRadius, braceRadius, height, 8);
            const frame3 = new THREE.Mesh(frameGeoY1, braceMaterial);
            frame3.position.set(-width/2, 0, zStart);
            sectionGroup.add(frame3);

            const frameGeoY2 = new THREE.CylinderGeometry(braceRadius, braceRadius, height, 8);
            const frame4 = new THREE.Mesh(frameGeoY2, braceMaterial);
            frame4.position.set(width/2, 0, zStart);
            sectionGroup.add(frame4);

            // Diagonal braces (Z pattern) on each face
            const diagLengthSide = Math.sqrt(Math.pow(segLength, 2) + Math.pow(height, 2));
            const diagGeoSide = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLengthSide, 8);
            diagGeoSide.rotateX(Math.atan2(height, segLength));
            
            const diagSide1 = new THREE.Mesh(diagGeoSide, braceMaterial);
            diagSide1.position.set(-width/2, 0, zMid);
            sectionGroup.add(diagSide1);

            const diagSide2 = new THREE.Mesh(diagGeoSide, braceMaterial);
            diagSide2.position.set(width/2, 0, zMid);
            diagSide2.rotation.x = -Math.atan2(height, segLength); // alternating pattern
            sectionGroup.add(diagSide2);

            const diagLengthTop = Math.sqrt(Math.pow(segLength, 2) + Math.pow(width - 2*taperX, 2));
            const diagGeoTop = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLengthTop, 8);
            diagGeoTop.rotateY(Math.atan2(width - 2*taperX, segLength));
            diagGeoTop.rotateX(Math.PI / 2);

            const diagTop = new THREE.Mesh(diagGeoTop, braceMaterial);
            diagTop.position.set(0, height/2 - taperY, zMid);
            sectionGroup.add(diagTop);

            const diagLengthBottom = Math.sqrt(Math.pow(segLength, 2) + Math.pow(width, 2));
            const diagGeoBottom = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLengthBottom, 8);
            diagGeoBottom.rotateY(Math.atan2(width, segLength));
            diagGeoBottom.rotateX(Math.PI / 2);

            const diagBottom = new THREE.Mesh(diagGeoBottom, braceMaterial);
            diagBottom.position.set(0, -height/2, zMid);
            diagBottom.rotation.z = Math.PI / 2; // adjust orientation
            sectionGroup.add(diagBottom);
        }
        
        return sectionGroup;
    }

    // --- Build The Jib Architecture --- //
    
    // 1. Jib Base Mount
    const jibBaseGroup = new THREE.Group();
    const baseMountGeo = new THREE.BoxGeometry(2, 2.5, 1);
    const baseMount = new THREE.Mesh(baseMountGeo, steel);
    jibBaseGroup.add(baseMount);
    
    const hingeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 32);
    hingeGeo.rotateZ(Math.PI / 2);
    const hinge = new THREE.Mesh(hingeGeo, chrome);
    hinge.position.set(0, 1.25, 0.5);
    jibBaseGroup.add(hinge);

    group.add(jibBaseGroup);
    meshes.jibBase = jibBaseGroup;

    parts.push({
        name: "Jib Base Mount Hinge",
        description: "Heavy-duty steel base mount with chrome-plated pivot pins connecting the jib to the main crane tower.",
        material: "Steel & Chrome",
        function: "Provides the primary structural articulation point for luffing operations.",
        assemblyOrder: 1,
        connections: ["Crane Tower", "Jib Root Section"],
        failureEffect: "Complete structural collapse of the jib assembly.",
        cascadeFailures: ["Jib Truss", "Trolley", "Hook Block"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 2. Main Jib Truss Assembly (Constructed of multiple lattice segments)
    const jibTrussGroup = new THREE.Group();
    jibTrussGroup.position.set(0, 0, 0.5);

    const segmentCount = 4;
    const segmentLength = 8;
    const jibWidth = 1.8;
    const jibHeight = 2.0;
    
    for (let i = 0; i < segmentCount; i++) {
        const isLast = i === segmentCount - 1;
        const taperX = isLast ? 0.4 : 0;
        const taperY = isLast ? 0.5 : 0;
        
        const section = createLatticeSection(jibWidth, jibHeight, segmentLength, 6, taperX, taperY);
        section.position.set(0, 0, segmentLength / 2 + i * segmentLength);
        jibTrussGroup.add(section);
    }
    
    jibTrussGroup.rotation.x = -Math.PI / 12; // Slight upward angle
    group.add(jibTrussGroup);
    meshes.jibTruss = jibTrussGroup;

    parts.push({
        name: "Main Lattice Truss Jib",
        description: "32-meter multi-segment lattice truss constructed of high-tensile steel chords and diagonal cross-bracing.",
        material: "High-Tensile Steel",
        function: "Provides immense reach and load-bearing capacity while minimizing wind profile and weight.",
        assemblyOrder: 2,
        connections: ["Jib Base Mount", "Trolley Track", "Pendants"],
        failureEffect: "Buckling or snapping, leading to uncontrolled load drop.",
        cascadeFailures: ["Trolley", "Hook Block"],
        originalPosition: { x: 0, y: 0, z: 0.5 },
        explodedPosition: { x: 0, y: 5, z: 15 }
    });

    // 3. Trolley Track (Rails integrated to the bottom of the jib)
    const trackGroup = new THREE.Group();
    const trackLength = segmentCount * segmentLength;
    const railGeo = new THREE.ExtrudeGeometry(
        new THREE.Shape([
            new THREE.Vector2(-0.1, -0.05),
            new THREE.Vector2(0.1, -0.05),
            new THREE.Vector2(0.1, 0.05),
            new THREE.Vector2(0.02, 0.05),
            new THREE.Vector2(0.02, 0.15),
            new THREE.Vector2(-0.02, 0.15),
            new THREE.Vector2(-0.02, 0.05),
            new THREE.Vector2(-0.1, 0.05)
        ]),
        { depth: trackLength, bevelEnabled: false }
    );
    
    const leftRail = new THREE.Mesh(railGeo, steel);
    leftRail.position.set(-jibWidth/2 + 0.1, -jibHeight/2 - 0.15, 0);
    trackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, steel);
    rightRail.position.set(jibWidth/2 - 0.1, -jibHeight/2 - 0.15, 0);
    trackGroup.add(rightRail);

    jibTrussGroup.add(trackGroup);

    parts.push({
        name: "Trolley Guide Rails",
        description: "Precision-extruded dual steel I-beam rails running the length of the jib's underside.",
        material: "Steel",
        function: "Guides the trolley assembly smoothly along the jib.",
        assemblyOrder: 3,
        connections: ["Main Lattice Truss Jib", "Trolley Assembly"],
        failureEffect: "Trolley derailment and jamming.",
        cascadeFailures: ["Trolley Drive System"],
        originalPosition: { x: 0, y: -jibHeight/2 - 0.15, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 15 }
    });

    // 4. Highly Detailed Trolley Assembly
    const trolleyGroup = new THREE.Group();
    
    // Trolley Frame
    const trolleyFrameGeo = new THREE.BoxGeometry(jibWidth - 0.1, 0.3, 1.5);
    const trolleyFrame = new THREE.Mesh(trolleyFrameGeo, darkSteel);
    trolleyGroup.add(trolleyFrame);

    // Trolley Wheels (4x)
    const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 32);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions = [
        [-jibWidth/2 + 0.1, 0.15, 0.6],
        [jibWidth/2 - 0.1, 0.15, 0.6],
        [-jibWidth/2 + 0.1, 0.15, -0.6],
        [jibWidth/2 - 0.1, 0.15, -0.6]
    ];
    
    meshes.trolleyWheels = [];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, chrome);
        wheel.position.set(...pos);
        trolleyGroup.add(wheel);
        meshes.trolleyWheels.push(wheel);
    });

    // Hoist motor & gearbox on trolley
    const hoistMotorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32);
    hoistMotorGeo.rotateZ(Math.PI / 2);
    const hoistMotor = new THREE.Mesh(hoistMotorGeo, copper);
    hoistMotor.position.set(0.3, 0.2, 0);
    trolleyGroup.add(hoistMotor);

    const drumGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32);
    drumGeo.rotateZ(Math.PI / 2);
    const hoistDrum = new THREE.Mesh(drumGeo, steel);
    hoistDrum.position.set(-0.2, 0.2, 0);
    trolleyGroup.add(hoistDrum);
    meshes.hoistDrum = hoistDrum;

    // Cable wrapping around drum (Lathe Geometry for realism)
    const cableWrapGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.45, 64, 20, false);
    const cableWrapMat = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true });
    const cableWrap = new THREE.Mesh(cableWrapGeo, cableWrapMat);
    cableWrap.rotation.z = Math.PI / 2;
    cableWrap.position.set(-0.2, 0.2, 0);
    trolleyGroup.add(cableWrap);

    // Initial positioning of trolley
    trolleyGroup.position.set(0, -jibHeight/2 - 0.35, trackLength / 3);
    jibTrussGroup.add(trolleyGroup);
    meshes.trolley = trolleyGroup;

    parts.push({
        name: "Trolley & Hoist Assembly",
        description: "Mobile carriage unit equipped with flanged chrome wheels, high-torque copper-wound hoist motor, and precision grooved hoist drum.",
        material: "Dark Steel, Chrome, Copper",
        function: "Traverses the jib to adjust load radius and houses the primary hoisting winch mechanism.",
        assemblyOrder: 4,
        connections: ["Trolley Guide Rails", "Hoist Wire Ropes"],
        failureEffect: "Inability to move load horizontally or hoist vertically.",
        cascadeFailures: ["Hoist Wire Ropes", "Hook Block"],
        originalPosition: { x: 0, y: -jibHeight/2 - 0.35, z: trackLength / 3 },
        explodedPosition: { x: -5, y: -3, z: trackLength / 3 }
    });

    // 5. Hook Block & Lifting Hook (Hyper-detailed)
    const hookBlockGroup = new THREE.Group();
    
    // Block Shell
    const blockShape = new THREE.Shape();
    blockShape.moveTo(-0.4, 0.5);
    blockShape.lineTo(0.4, 0.5);
    blockShape.lineTo(0.5, 0);
    blockShape.lineTo(0.4, -0.6);
    blockShape.lineTo(-0.4, -0.6);
    blockShape.lineTo(-0.5, 0);
    blockShape.lineTo(-0.4, 0.5);
    
    const blockExtrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const blockGeo = new THREE.ExtrudeGeometry(blockShape, blockExtrudeSettings);
    blockGeo.translate(0, 0, -0.2); // center on Z
    const blockShell = new THREE.Mesh(blockGeo, plastic); // high-vis plastic/paint
    blockShell.material = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.4, metalness: 0.1 });
    hookBlockGroup.add(blockShell);

    // Sheaves (Pulleys inside block)
    const sheaveGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 64);
    const sheave1 = new THREE.Mesh(sheaveGeo, chrome);
    sheave1.position.set(0, 0.1, 0.1);
    hookBlockGroup.add(sheave1);
    const sheave2 = new THREE.Mesh(sheaveGeo, chrome);
    sheave2.position.set(0, 0.1, -0.1);
    hookBlockGroup.add(sheave2);
    meshes.sheaves = [sheave1, sheave2];

    // The Lifting Hook (Complex Extruded Shape)
    const hookShape = new THREE.Shape();
    hookShape.moveTo(0, 0);
    hookShape.lineTo(0.1, 0);
    hookShape.bezierCurveTo(0.1, -0.3, 0.4, -0.3, 0.4, -0.6);
    hookShape.bezierCurveTo(0.4, -1.0, -0.4, -1.0, -0.4, -0.6);
    hookShape.bezierCurveTo(-0.4, -0.4, -0.2, -0.4, -0.2, -0.6);
    hookShape.bezierCurveTo(-0.2, -0.8, 0.2, -0.8, 0.2, -0.6);
    hookShape.bezierCurveTo(0.2, -0.4, -0.1, -0.4, -0.1, 0);
    
    const hookExtrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const hookGeo = new THREE.ExtrudeGeometry(hookShape, hookExtrudeSettings);
    hookGeo.translate(0, -0.6, -0.05); // center and offset downward
    const liftingHook = new THREE.Mesh(hookGeo, darkSteel);
    hookBlockGroup.add(liftingHook);

    // Swivel Joint
    const swivelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    const swivel = new THREE.Mesh(swivelGeo, chrome);
    swivel.position.set(0, -0.6, 0);
    hookBlockGroup.add(swivel);

    hookBlockGroup.position.set(0, -3, 0); // initial offset from trolley
    trolleyGroup.add(hookBlockGroup); // Attach to trolley space to move with it
    meshes.hookBlock = hookBlockGroup;
    meshes.liftingHook = liftingHook;

    parts.push({
        name: "Heavy-Duty Hook Block",
        description: "High-visibility sheave block containing dual chrome pulleys and a heavy forged steel lifting hook on a 360-degree swivel bearing.",
        material: "Forged Steel, High-Vis Polyurethane, Chrome",
        function: "Interfaces with the payload, multiplying hoist motor lifting force via mechanical advantage.",
        assemblyOrder: 5,
        connections: ["Hoist Wire Ropes", "Payload Attachment"],
        failureEffect: "Complete loss of payload.",
        cascadeFailures: ["Wire Ropes Snapping due to sudden tension release"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 6. Hoist Wire Ropes (Dynamic Tubes connecting trolley and hook block)
    class WireRope {
        constructor(startPoint, endPoint, group) {
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            const distance = startPoint.distanceTo(endPoint);
            this.geometry = new THREE.CylinderGeometry(0.015, 0.015, distance, 8);
            this.geometry.translate(0, -distance / 2, 0);
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.6 }));
            this.mesh.position.copy(startPoint);
            this.mesh.lookAt(endPoint);
            this.mesh.rotateX(Math.PI / 2);
            group.add(this.mesh);
        }
        update(startPoint, endPoint) {
            const distance = startPoint.distanceTo(endPoint);
            this.mesh.scale.y = distance / this.geometry.parameters.height;
            this.mesh.position.copy(startPoint);
            this.mesh.lookAt(endPoint);
            this.mesh.rotateX(Math.PI / 2);
        }
    }

    const wireRopes = [];
    const ropeStart1 = new THREE.Vector3(-0.15, 0, 0.1);
    const ropeStart2 = new THREE.Vector3(-0.15, 0, -0.1);
    const ropeEnd1 = new THREE.Vector3(0, -2.5, 0.1);
    const ropeEnd2 = new THREE.Vector3(0, -2.5, -0.1);

    wireRopes.push(new WireRope(ropeStart1, ropeEnd1, trolleyGroup));
    wireRopes.push(new WireRope(ropeStart2, ropeEnd2, trolleyGroup));
    meshes.wireRopes = wireRopes;

    parts.push({
        name: "Multi-Fall Wire Ropes",
        description: "High-tensile steel wire ropes utilizing a multi-fall configuration to distribute heavy loads.",
        material: "Braided High-Tensile Steel",
        function: "Transmits the mechanical force from the hoist drum to the hook block.",
        assemblyOrder: 6,
        connections: ["Trolley Hoist Drum", "Hook Block Sheaves"],
        failureEffect: "Sudden payload drop and dangerous rope whiplash.",
        cascadeFailures: ["Hook Block"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 2, y: -1.5, z: 0 }
    });

    // 7. Jib Tie-Back Pendants (Tension wires from tower to jib segments)
    const pendantsGroup = new THREE.Group();
    // Simulate connection from a high point on the tower
    const towerApex = new THREE.Vector3(0, 15, -5); 
    
    // Connections to middle and tip of jib
    const connectionPoints = [
        new THREE.Vector3(0, jibHeight/2, segmentLength * 2),
        new THREE.Vector3(0, jibHeight/2, segmentLength * 4)
    ];

    meshes.pendants = [];
    connectionPoints.forEach((pt, index) => {
        // Create a thick tube for the pendant
        const distance = towerApex.distanceTo(pt);
        const pendantGeo = new THREE.CylinderGeometry(0.04, 0.04, distance, 12);
        pendantGeo.translate(0, distance/2, 0); // Pivot at start
        const pendantMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
        const pendant = new THREE.Mesh(pendantGeo, pendantMat);
        
        // Position at apex and look at the jib point
        pendant.position.copy(towerApex);
        pendant.lookAt(pt);
        pendant.rotateX(Math.PI / 2); // Align cylinder to lookAt
        
        pendantsGroup.add(pendant);
        meshes.pendants.push(pendant);
    });
    
    group.add(pendantsGroup);

    parts.push({
        name: "Tension Pendants (Tie-Backs)",
        description: "Extremely thick, rigid structural wire ropes connecting the top of the A-frame tower to various points along the jib.",
        material: "Carbon Steel Cable",
        function: "Supports the cantilevered weight of the jib and resists downward bending moments from heavy loads.",
        assemblyOrder: 7,
        connections: ["Crane Tower Apex", "Main Lattice Truss Jib"],
        failureEffect: "Catastrophic bending and snapping of the jib truss.",
        cascadeFailures: ["Entire Jib Assembly"],
        originalPosition: { x: 0, y: 10, z: 5 },
        explodedPosition: { x: 0, y: 15, z: 5 }
    });

    // 8. Aviation Warning Light & Anemometer (Hyper-realism details)
    const instrumentationGroup = new THREE.Group();
    
    // Warning Light
    const warningLightGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const warningLightMat = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        emissive: 0xff0000, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.9 
    });
    const warningLight = new THREE.Mesh(warningLightGeo, warningLightMat);
    warningLight.position.set(0, jibHeight/2 + 0.5, trackLength - 0.2);
    
    const warningPointLight = new THREE.PointLight(0xff0000, 5, 20);
    warningLight.add(warningPointLight);
    instrumentationGroup.add(warningLight);
    meshes.warningLight = warningLight;

    // Anemometer (Wind Speed Sensor)
    const anemometerBaseGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
    const anemometerBase = new THREE.Mesh(anemometerBaseGeo, aluminum);
    anemometerBase.position.set(0.3, jibHeight/2 + 0.2, trackLength - 0.5);
    
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0.2, 0);
    
    const cupArmGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
    cupArmGeo.rotateZ(Math.PI / 2);
    
    for (let i = 0; i < 3; i++) {
        const arm = new THREE.Mesh(cupArmGeo, darkSteel);
        arm.rotation.y = (i * Math.PI * 2) / 3;
        
        const cupGeo = new THREE.SphereGeometry(0.05, 16, 16, 0, Math.PI);
        const cup = new THREE.Mesh(cupGeo, plastic);
        cup.position.set(0.15, 0, 0);
        cup.rotation.x = Math.PI / 2;
        arm.add(cup);
        
        rotorGroup.add(arm);
    }
    
    anemometerBase.add(rotorGroup);
    instrumentationGroup.add(anemometerBase);
    meshes.anemometerRotor = rotorGroup;

    jibTrussGroup.add(instrumentationGroup);

    parts.push({
        name: "Instrumentation Array (Anemometer & Warning Light)",
        description: "Tip-mounted sensor suite featuring a spinning 3-cup anemometer for wind telemetry and a high-intensity pulsing red LED aviation obstruction light.",
        material: "Aluminum, Polycarbonate, Electronics",
        function: "Provides critical safety data regarding wind limits and prevents aircraft collisions.",
        assemblyOrder: 8,
        connections: ["Jib Tip Section"],
        failureEffect: "Loss of safety telemetry, potential FAA violations, dangerous operation in high winds.",
        cascadeFailures: ["Crane Structural Failure due to unknown high winds"],
        originalPosition: { x: 0, y: jibHeight/2 + 0.5, z: trackLength - 0.2 },
        explodedPosition: { x: 2, y: jibHeight + 2, z: trackLength + 2 }
    });

    // 9. Load Sensor Pin
    const loadSensorGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 16);
    loadSensorGeo.rotateZ(Math.PI / 2);
    const loadSensor = new THREE.Mesh(loadSensorGeo, chrome);
    loadSensor.material = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x113355 }); // Slight glow indicating electronics
    loadSensor.position.set(0, -jibHeight/2 - 0.3, trackLength / 3); // Positioned near trolley
    jibTrussGroup.add(loadSensor);

    parts.push({
        name: "Telemetry Load Sensor Pin",
        description: "Embedded strain-gauge sheer pin acting as a hinge component while actively measuring payload weight.",
        material: "Stainless Steel, Micro-electronics",
        function: "Continuously monitors weight to prevent exceeding the crane's safe working load (SWL) chart.",
        assemblyOrder: 9,
        connections: ["Trolley Assembly", "Hoist Cables"],
        failureEffect: "Crane control system loses weight telemetry, risking critical overload.",
        cascadeFailures: ["Structural Overload"],
        originalPosition: { x: 0, y: -jibHeight/2 - 0.3, z: trackLength / 3 },
        explodedPosition: { x: -1, y: -4, z: trackLength / 3 - 2 }
    });

    // --- Animation Logic --- //

    // Add internal animation state variables
    meshes.state = {
        trolleyDir: 1,
        trolleyZ: trackLength / 3,
        hoistY: -3,
        hoistDir: -1,
        pulseTime: 0
    };

    function animate(time, speed, meshes) {
        // 1. Animate Trolley back and forth along the jib track
        const trackMax = trackLength - 1.5;
        const trackMin = 2.0;
        
        meshes.state.trolleyZ += meshes.state.trolleyDir * speed * 2.0;
        if (meshes.state.trolleyZ > trackMax) {
            meshes.state.trolleyZ = trackMax;
            meshes.state.trolleyDir = -1;
        } else if (meshes.state.trolleyZ < trackMin) {
            meshes.state.trolleyZ = trackMin;
            meshes.state.trolleyDir = 1;
        }
        meshes.trolley.position.z = meshes.state.trolleyZ;

        // 2. Animate Trolley Wheels spinning based on movement
        meshes.trolleyWheels.forEach(wheel => {
            wheel.rotation.x += meshes.state.trolleyDir * speed * 15.0; // Rotate wheels
        });

        // 3. Animate Hoist mechanism (up and down)
        meshes.state.hoistY += meshes.state.hoistDir * speed * 1.5;
        if (meshes.state.hoistY < -8.0) {
            meshes.state.hoistY = -8.0;
            meshes.state.hoistDir = 1;
        } else if (meshes.state.hoistY > -1.5) {
            meshes.state.hoistY = -1.5;
            meshes.state.hoistDir = -1;
        }
        meshes.hookBlock.position.y = meshes.state.hoistY;

        // 4. Spin hoist drum based on hoisting speed
        meshes.hoistDrum.rotation.x -= meshes.state.hoistDir * speed * 10.0;

        // 5. Spin hook block sheaves based on rope movement
        meshes.sheaves.forEach((sheave, index) => {
            sheave.rotation.x -= meshes.state.hoistDir * speed * 12.0 * (index % 2 === 0 ? 1 : -1); // Counter-rotate slightly
        });

        // 6. Swing the lifting hook slightly for dynamic realism
        meshes.liftingHook.rotation.z = Math.sin(time * 2.0) * 0.05;
        meshes.liftingHook.rotation.x = Math.cos(time * 1.5) * 0.03;

        // 7. Update Wire Ropes dynamically to connect trolley drum to hook block
        const startPoint1 = new THREE.Vector3(-0.15, 0.2, 0.1); // Relative to trolley
        const startPoint2 = new THREE.Vector3(-0.15, 0.2, -0.1);
        const endPoint1 = new THREE.Vector3(0, meshes.state.hoistY + 0.6, 0.1); // Relative to trolley space
        const endPoint2 = new THREE.Vector3(0, meshes.state.hoistY + 0.6, -0.1);
        
        meshes.wireRopes[0].update(startPoint1, endPoint1);
        meshes.wireRopes[1].update(startPoint2, endPoint2);

        // 8. Anemometer Rotor spinning constantly (simulating wind)
        meshes.anemometerRotor.rotation.y += speed * 20.0 + Math.sin(time) * 0.1; // variable speed flutter

        // 9. Aviation Warning Light Pulsing (Strobe effect)
        meshes.state.pulseTime += speed;
        if (meshes.state.pulseTime > 1.0) {
            meshes.state.pulseTime = 0;
            meshes.warningLight.material.emissiveIntensity = 5.0; // Flash
            meshes.warningLight.children[0].intensity = 20.0;
        } else {
            // Decay
            meshes.warningLight.material.emissiveIntensity = Math.max(0.5, meshes.warningLight.material.emissiveIntensity - speed * 10.0);
            meshes.warningLight.children[0].intensity = Math.max(0, meshes.warningLight.children[0].intensity - speed * 40.0);
        }

        // 10. Simulate slight luffing (bouncing/flexing of the massive jib truss under dynamic load)
        const flexAmplitude = 0.015;
        const flexFrequency = 3.0;
        meshes.jibTruss.rotation.x = -Math.PI / 12 + Math.sin(time * flexFrequency) * flexAmplitude;
    }

    return { group, parts, description, quizQuestions, animate };
}
