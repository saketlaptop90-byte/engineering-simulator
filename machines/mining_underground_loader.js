import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for complex geometries
    function createTireWithChains(tireRadius, tireTube, lugCount) {
        const tireGroup = new THREE.Group();
        // Main tire body
        const tireGeom = new THREE.TorusGeometry(tireRadius, tireTube, 32, 100);
        const tireMesh = new THREE.Mesh(tireGeom, rubber);
        tireGroup.add(tireMesh);

        // Chains / Lugs
        const lugGeom = new THREE.BoxGeometry(tireTube * 2.2, tireTube * 0.4, tireRadius * 0.2);
        const chainMaterial = chrome; // chains are metallic
        
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, chainMaterial);
            
            // Positioning along the torus surface
            lug.position.x = (tireRadius) * Math.cos(angle);
            lug.position.y = (tireRadius) * Math.sin(angle);
            
            // Orient the lug
            lug.rotation.z = angle;
            // Cross wrap for chains
            if (i % 2 === 0) {
                lug.rotation.y = Math.PI / 4;
            } else {
                lug.rotation.y = -Math.PI / 4;
            }
            tireGroup.add(lug);
        }

        // Rim
        const rimGeom = new THREE.CylinderGeometry(tireRadius * 0.6, tireRadius * 0.6, tireTube * 1.5, 32);
        rimGeom.rotateX(Math.PI / 2);
        const rimMesh = new THREE.Mesh(rimGeom, darkSteel);
        tireGroup.add(rimMesh);

        // Spokes / Hub
        const hubGeom = new THREE.CylinderGeometry(tireRadius * 0.2, tireRadius * 0.2, tireTube * 1.6, 16);
        hubGeom.rotateX(Math.PI / 2);
        const hubMesh = new THREE.Mesh(hubGeom, aluminum);
        tireGroup.add(hubMesh);

        const spokeGeom = new THREE.CylinderGeometry(tireRadius * 0.05, tireRadius * 0.05, tireRadius * 1.2, 16);
        for(let i=0; i<8; i++) {
            const spoke = new THREE.Mesh(spokeGeom, steel);
            const spokeAngle = (i / 8) * Math.PI * 2;
            spoke.position.x = (tireRadius * 0.3) * Math.cos(spokeAngle);
            spoke.position.y = (tireRadius * 0.3) * Math.sin(spokeAngle);
            spoke.rotation.z = spokeAngle;
            tireGroup.add(spoke);
        }
        
        return tireGroup;
    }

    // Extruded Frame
    function createExtrudedFrame(pts, depth, material) {
        const shape = new THREE.Shape();
        if (pts.length > 0) {
            shape.moveTo(pts[0][0], pts[0][1]);
            for(let i=1; i<pts.length; i++){
                shape.lineTo(pts[i][0], pts[i][1]);
            }
            shape.lineTo(pts[0][0], pts[0][1]);
        }
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center();
        return new THREE.Mesh(geom, material);
    }
    
    // Hydraulic cylinder
    function createHydraulic(length, radius) {
        const hyd = new THREE.Group();
        const barrelGeom = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const barrel = new THREE.Mesh(barrelGeom, darkSteel);
        barrel.position.y = length * 0.3;
        hyd.add(barrel);
        
        const rodGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 32);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length * 0.7;
        hyd.add(rod);
        
        // Hose connections
        const hosePort = new THREE.Mesh(new THREE.BoxGeometry(radius*1.5, radius*1.5, radius*1.5), copper);
        hosePort.position.set(radius, length*0.1, 0);
        hyd.add(hosePort);

        hyd.userData.rod = rod;
        return hyd;
    }

    // Front Frame Assembly
    const frontFrame = new THREE.Group();
    frontFrame.position.set(3, 0, 0);
    group.add(frontFrame);

    const frontFramePts = [
        [0, -1], [3, -1], [4, 0], [4, 1.5], [1, 1.5], [0, 0]
    ];
    const frontFrameMesh = createExtrudedFrame(frontFramePts, 2.5, steel);
    frontFrame.add(frontFrameMesh);
    
    // Add neon glowing strips to front frame
    const neonMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
    const stripGeom = new THREE.BoxGeometry(3, 0.1, 2.6);
    const strip = new THREE.Mesh(stripGeom, neonMaterial);
    strip.position.set(2, 0.5, 0);
    frontFrame.add(strip);
    meshes.frontNeon = strip;

    // Bucket Boom
    const boom = new THREE.Group();
    boom.position.set(1.5, 0.5, 0);
    frontFrame.add(boom);
    meshes.boom = boom;

    const boomPts = [
        [0, -0.5], [4, -1], [4, -0.2], [1, 0.5]
    ];
    const boomArmLeft = createExtrudedFrame(boomPts, 0.4, darkSteel);
    boomArmLeft.position.z = 1.1;
    boom.add(boomArmLeft);
    const boomArmRight = createExtrudedFrame(boomPts, 0.4, darkSteel);
    boomArmRight.position.z = -1.1;
    boom.add(boomArmRight);
    
    // Boom cross-tube
    const crossTube = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.2, 32), steel);
    crossTube.rotation.x = Math.PI / 2;
    crossTube.position.set(2, -0.2, 0);
    boom.add(crossTube);

    // Front Bucket
    const bucket = new THREE.Group();
    bucket.position.set(4, -0.6, 0);
    boom.add(bucket);
    meshes.bucket = bucket;

    const bucketPts = [
        [0, 0], [1.5, -1.5], [2.5, -1.5], [2.5, 0.5], [0.5, 1.5], [0, 1.5]
    ];
    const bucketMesh = createExtrudedFrame(bucketPts, 3, darkSteel);
    bucket.add(bucketMesh);
    
    // Bucket teeth
    const toothGeom = new THREE.ConeGeometry(0.2, 0.8, 4);
    for(let i=0; i<6; i++) {
        const tooth = new THREE.Mesh(toothGeom, steel);
        tooth.position.set(2.6, -1.5, -1.25 + i * 0.5);
        tooth.rotation.z = -Math.PI / 4;
        bucket.add(tooth);
    }

    // Main Lift Hydraulics
    const liftHydLeft = createHydraulic(3, 0.3);
    liftHydLeft.position.set(0, -0.5, 1.1);
    liftHydLeft.rotation.z = -Math.PI / 4;
    frontFrame.add(liftHydLeft);
    meshes.liftHydLeft = liftHydLeft;

    const liftHydRight = createHydraulic(3, 0.3);
    liftHydRight.position.set(0, -0.5, -1.1);
    liftHydRight.rotation.z = -Math.PI / 4;
    frontFrame.add(liftHydRight);
    meshes.liftHydRight = liftHydRight;

    // Bucket Tilt Hydraulics
    const tiltHyd = createHydraulic(2.5, 0.25);
    tiltHyd.position.set(1, 0.5, 0);
    tiltHyd.rotation.z = -Math.PI / 6;
    boom.add(tiltHyd);
    meshes.tiltHyd = tiltHyd;
    
    // Rear Frame Assembly
    const rearFrame = new THREE.Group();
    rearFrame.position.set(-2, 0, 0);
    group.add(rearFrame);
    meshes.rearFrame = rearFrame;
    
    const rearFramePts = [
        [-5, -1], [0, -1], [1, 0], [0, 2], [-4, 2], [-5, 0]
    ];
    const rearFrameMesh = createExtrudedFrame(rearFramePts, 2.5, steel);
    rearFrame.add(rearFrameMesh);

    // Engine Compartment details (grilles, vents)
    const engineCover = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2.2), darkSteel);
    engineCover.position.set(-3, 1.5, 0);
    rearFrame.add(engineCover);

    const grilleGeom = new THREE.BoxGeometry(0.1, 0.8, 2.0);
    for(let i=0; i<8; i++) {
        const grille = new THREE.Mesh(grilleGeom, chrome);
        grille.position.set(-1.6 - (i*0.2), 1.5, 0);
        rearFrame.add(grille);
    }
    
    // Exhaust stack
    const exhaustGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const exhaust = new THREE.Mesh(exhaustGeom, chrome);
    exhaust.position.set(-2, 2.5, 0.8);
    rearFrame.add(exhaust);
    
    const exhaustCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), darkSteel);
    exhaustCap.position.set(-2, 3.25, 0.8);
    rearFrame.add(exhaustCap);

    // Operator Cabin (Side-facing)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-1, 0.5, 1.8);
    rearFrame.add(cabinGroup);

    const cabinFramePts = [
        [-1.5, -0.5], [1.5, -0.5], [1.2, 2.5], [-1.2, 2.5]
    ];
    const cabinBase = createExtrudedFrame(cabinFramePts, 1.2, steel);
    cabinGroup.add(cabinBase);

    // Tinted Glass windows
    const windowGeom = new THREE.BoxGeometry(2.2, 1.5, 1.25);
    const windowMesh = new THREE.Mesh(windowGeom, tinted);
    windowMesh.position.set(0, 1.2, 0);
    cabinGroup.add(windowMesh);

    // Cabin Interior
    const steeringBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), darkSteel);
    steeringBase.position.set(0.8, 0.2, 0);
    steeringBase.rotation.z = Math.PI / 4;
    cabinGroup.add(steeringBase);

    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 32), plastic);
    steeringWheel.position.set(1.1, 0.5, 0);
    steeringWheel.rotation.y = Math.PI / 2;
    steeringWheel.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringWheel);
    meshes.steeringWheel = steeringWheel;

    const screenGeom = new THREE.BoxGeometry(0.05, 0.6, 0.8);
    const screenMesh = new THREE.Mesh(screenGeom, new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00, emissiveIntensity: 1 }));
    screenMesh.position.set(0.9, 0.5, 0.5);
    screenMesh.rotation.y = -Math.PI / 6;
    cabinGroup.add(screenMesh);
    
    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), rubber);
    seat.position.set(-0.2, 0, 0);
    cabinGroup.add(seat);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.8), rubber);
    seatBack.position.set(-0.5, 0.5, 0);
    cabinGroup.add(seatBack);

    // Articulated Joint
    const artJoint = new THREE.Group();
    artJoint.position.set(0.5, 0, 0);
    group.add(artJoint);

    const jointPin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 32), steel);
    jointPin.rotation.x = Math.PI / 2;
    artJoint.add(jointPin);

    // Steering Hydraulics (cross joint)
    const steerHydLeft = createHydraulic(2, 0.2);
    steerHydLeft.position.set(0.5, 0, 1);
    steerHydLeft.rotation.z = Math.PI / 2;
    group.add(steerHydLeft);
    meshes.steerHydLeft = steerHydLeft;

    const steerHydRight = createHydraulic(2, 0.2);
    steerHydRight.position.set(0.5, 0, -1);
    steerHydRight.rotation.z = Math.PI / 2;
    group.add(steerHydRight);
    meshes.steerHydRight = steerHydRight;

    // Tires
    const tRadius = 1.2;
    const tTube = 0.5;
    const lugCount = 36;
    
    const wheelFL = createTireWithChains(tRadius, tTube, lugCount);
    wheelFL.position.set(3.5, -1, 1.8);
    frontFrame.add(wheelFL);
    meshes.wheelFL = wheelFL;

    const wheelFR = createTireWithChains(tRadius, tTube, lugCount);
    wheelFR.position.set(3.5, -1, -1.8);
    frontFrame.add(wheelFR);
    meshes.wheelFR = wheelFR;

    const wheelRL = createTireWithChains(tRadius, tTube, lugCount);
    wheelRL.position.set(-3.5, -1, 1.8);
    rearFrame.add(wheelRL);
    meshes.wheelRL = wheelRL;

    const wheelRR = createTireWithChains(tRadius, tTube, lugCount);
    wheelRR.position.set(-3.5, -1, -1.8);
    rearFrame.add(wheelRR);
    meshes.wheelRR = wheelRR;

    // Hydraulic Hoses / Pipes using TubeGeometry
    class HoseCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 3;
            const ty = Math.sin(t * Math.PI) * 1.5;
            const tz = 0;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const hosePathLeft = new HoseCurve(1);
    const hoseGeomLeft = new THREE.TubeGeometry(hosePathLeft, 20, 0.05, 8, false);
    const hoseLeft = new THREE.Mesh(hoseGeomLeft, rubber);
    hoseLeft.position.set(1.5, -0.5, 1.2);
    frontFrame.add(hoseLeft);

    const hosePathRight = new HoseCurve(1);
    const hoseGeomRight = new THREE.TubeGeometry(hosePathRight, 20, 0.05, 8, false);
    const hoseRight = new THREE.Mesh(hoseGeomRight, rubber);
    hoseRight.position.set(1.5, -0.5, -1.2);
    frontFrame.add(hoseRight);


    // Add parts data
    parts.push({
        name: "Front Frame",
        description: "Heavy-duty steel constructed front section of the LHD, housing the loading boom, front axle, and bucket connections.",
        material: "Reinforced Steel",
        function: "Supports dynamic loads from digging, lifting, and tramming heavily fragmented rock.",
        assemblyOrder: 1,
        connections: ["Articulated Joint", "Bucket Boom", "Front Axle"],
        failureEffect: "Structural fatigue leads to cracking, reducing payload capacity and potentially dropping loads.",
        cascadeFailures: ["Hydraulic Line Rupture", "Front Axle Misalignment"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    parts.push({
        name: "Rear Frame & Engine Compartment",
        description: "Low-profile rear chassis containing the high-torque diesel engine, drivetrain components, and structural mounts.",
        material: "Cast Steel",
        function: "Provides locomotion, counter-balance for the bucket, and houses the power plant.",
        assemblyOrder: 2,
        connections: ["Articulated Joint", "Side-facing Cabin", "Rear Axle"],
        failureEffect: "Total power loss, extreme vibration, and overheating in confined underground spaces.",
        cascadeFailures: ["Transmission Failure", "Cooling System Overload"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    parts.push({
        name: "Articulated Pivot Joint",
        description: "Massive central pin and bearing assembly connecting the front and rear frames, allowing for tight-radius steering in narrow mine drifts.",
        material: "Hardened Chromium Steel",
        function: "Enables vehicle articulation up to 45 degrees left or right.",
        assemblyOrder: 3,
        connections: ["Front Frame", "Rear Frame", "Steering Hydraulics"],
        failureEffect: "Loss of steering control, jamming of the machine against tunnel ribs.",
        cascadeFailures: ["Steering Cylinder Blowout", "Driveline Shearing"],
        originalPosition: { x: 0.5, y: 0, z: 0 },
        explodedPosition: { x: 0.5, y: 5, z: 0 }
    });

    parts.push({
        name: "Side-Facing Operator Cabin",
        description: "ROPS/FOPS certified enclosed cabin mounted sideways to allow the operator to see equally well driving forward (mucking) or in reverse (hauling).",
        material: "Steel & Tinted Safety Glass",
        function: "Protects operator from rock falls and hazardous mine atmospheres while maximizing visibility.",
        assemblyOrder: 4,
        connections: ["Rear Frame"],
        failureEffect: "Compromised operator safety, potential injury from rockbursts.",
        cascadeFailures: ["Control Panel Disconnect"],
        originalPosition: { x: -3, y: 0.5, z: 1.8 },
        explodedPosition: { x: -3, y: 5, z: 5 }
    });

    parts.push({
        name: "Bucket Boom Assembly",
        description: "Z-bar linkage and massive lifting arms designed to break out heavy rock piles.",
        material: "High-Tensile Steel",
        function: "Transfers hydraulic power into mechanical lifting force.",
        assemblyOrder: 5,
        connections: ["Front Frame", "Wide Flat Bucket", "Lift Cylinders"],
        failureEffect: "Inability to lift loads, boom collapse.",
        cascadeFailures: ["Bucket Pivot Pin Failure"],
        originalPosition: { x: 4.5, y: 0.5, z: 0 },
        explodedPosition: { x: 4.5, y: 8, z: 0 }
    });

    parts.push({
        name: "Wide Flat Front Bucket",
        description: "Low-profile, high-capacity bucket equipped with reinforced teeth and wear shrouds for highly abrasive rock.",
        material: "Abrasive-Resistant Hardox Steel",
        function: "Scoops, carries, and dumps payloads (typically 10-18 tonnes) of fragmented ore.",
        assemblyOrder: 6,
        connections: ["Bucket Boom", "Tilt Cylinder"],
        failureEffect: "Material spillage, rapid wear requiring costly rebuilds.",
        cascadeFailures: ["Tire Damage from Spillage"],
        originalPosition: { x: 7, y: -0.6, z: 0 },
        explodedPosition: { x: 12, y: -2, z: 0 }
    });

    parts.push({
        name: "Lift Hydraulic Cylinders",
        description: "Massive dual cylinders operating at high pressure (up to 300+ bar) to lift the boom.",
        material: "Chrome-Plated Steel Rods, Iron Barrels",
        function: "Provides the immense upward force required to hoist a fully loaded bucket.",
        assemblyOrder: 7,
        connections: ["Front Frame", "Bucket Boom"],
        failureEffect: "Boom drops unexpectedly; extreme danger to personnel.",
        cascadeFailures: ["Hydraulic Pump Cavitation"],
        originalPosition: { x: 3, y: -0.5, z: 0 },
        explodedPosition: { x: 3, y: -5, z: 3 }
    });

    parts.push({
        name: "Chained Tires (Front Left)",
        description: "Massive underground loader tire enveloped in heavy steel chains to protect rubber from sharp rock cuts.",
        material: "Rubber & Chrome Chains",
        function: "Traction, load bearing, and puncture resistance.",
        assemblyOrder: 8,
        connections: ["Front Axle"],
        failureEffect: "Tire blowout, machine immobilization.",
        cascadeFailures: ["Axle Planetary Gear Damage"],
        originalPosition: { x: 6.5, y: -1, z: 1.8 },
        explodedPosition: { x: 6.5, y: -5, z: 6 }
    });
    
    parts.push({
        name: "Chained Tires (Front Right)",
        description: "Massive underground loader tire enveloped in heavy steel chains to protect rubber from sharp rock cuts.",
        material: "Rubber & Chrome Chains",
        function: "Traction, load bearing, and puncture resistance.",
        assemblyOrder: 9,
        connections: ["Front Axle"],
        failureEffect: "Tire blowout, machine immobilization.",
        cascadeFailures: ["Axle Planetary Gear Damage"],
        originalPosition: { x: 6.5, y: -1, z: -1.8 },
        explodedPosition: { x: 6.5, y: -5, z: -6 }
    });

    parts.push({
        name: "Chained Tires (Rear Left)",
        description: "Massive underground loader tire enveloped in heavy steel chains to protect rubber from sharp rock cuts.",
        material: "Rubber & Chrome Chains",
        function: "Traction, load bearing, and puncture resistance.",
        assemblyOrder: 10,
        connections: ["Rear Axle"],
        failureEffect: "Tire blowout, machine immobilization.",
        cascadeFailures: ["Axle Planetary Gear Damage"],
        originalPosition: { x: -5.5, y: -1, z: 1.8 },
        explodedPosition: { x: -5.5, y: -5, z: 6 }
    });

    parts.push({
        name: "Chained Tires (Rear Right)",
        description: "Massive underground loader tire enveloped in heavy steel chains to protect rubber from sharp rock cuts.",
        material: "Rubber & Chrome Chains",
        function: "Traction, load bearing, and puncture resistance.",
        assemblyOrder: 11,
        connections: ["Rear Axle"],
        failureEffect: "Tire blowout, machine immobilization.",
        cascadeFailures: ["Axle Planetary Gear Damage"],
        originalPosition: { x: -5.5, y: -1, z: -1.8 },
        explodedPosition: { x: -5.5, y: -5, z: -6 }
    });

    parts.push({
        name: "Steering Cylinders",
        description: "Cross-mounted hydraulic rams bridging the front and rear frames at the articulation joint.",
        material: "Steel / Hydraulics",
        function: "Pushes/pulls the frames to articulate the machine left or right.",
        assemblyOrder: 12,
        connections: ["Front Frame", "Rear Frame", "Articulated Pivot Joint"],
        failureEffect: "Machine stuck in a turned position, unable to navigate tunnels.",
        cascadeFailures: ["Hydraulic Line Rupture"],
        originalPosition: { x: 0.5, y: 0, z: 1 },
        explodedPosition: { x: 0.5, y: -2, z: 4 }
    });

    parts.push({
        name: "Engine Exhaust Stack",
        description: "High-temperature exhaust routing with integrated diesel particulate filter (DPF) and scrubber.",
        material: "Chrome / Heat-resistant Alloy",
        function: "Routes dangerous exhaust gases away from the operator and reduces particulate emissions in the mine.",
        assemblyOrder: 13,
        connections: ["Rear Frame", "Engine Compartment"],
        failureEffect: "Excessive toxic emissions causing mine evacuation.",
        cascadeFailures: ["Engine Overheating"],
        originalPosition: { x: -4, y: 2.5, z: 0.8 },
        explodedPosition: { x: -4, y: 6, z: 0.8 }
    });

    parts.push({
        name: "Cabin Control Panel",
        description: "High-tech multi-function display providing real-time diagnostics on payload weight, hydraulic pressure, and engine health.",
        material: "Electronics / Glass",
        function: "Interface for the operator to monitor and control the LHD.",
        assemblyOrder: 14,
        connections: ["Side-Facing Operator Cabin"],
        failureEffect: "Loss of instrumentation, forcing machine shutdown.",
        cascadeFailures: ["Missed Warning Alarms"],
        originalPosition: { x: -2.1, y: 1, z: 2.3 },
        explodedPosition: { x: -2.1, y: 1.5, z: 8 }
    });

    parts.push({
        name: "Front Neon Guidance Strip",
        description: "High-intensity LED/neon strips for illuminating dark underground drifts and outlining machine extremities.",
        material: "Emissive Polymer",
        function: "Improves spatial awareness for the operator and visibility for personnel on foot.",
        assemblyOrder: 15,
        connections: ["Front Frame"],
        failureEffect: "Reduced visibility, higher collision risk in pitch-black conditions.",
        cascadeFailures: ["Frame Collision Damage"],
        originalPosition: { x: 5, y: 0.5, z: 0 },
        explodedPosition: { x: 5, y: 3, z: 0 }
    });

    const description = "The Underground LHD (Load Haul Dump) is a massive, hyper-engineered piece of mining equipment designed to operate in extremely confined and hazardous subterranean environments. Characterized by its low-profile stance, aggressive chained tires, and heavy-duty articulated chassis, it is built to survive high-impact loading of abrasive rock. The side-facing cabin provides dual-directional visibility, a necessity when navigating narrow mine drifts where turning around is impossible. Advanced hydraulics and reinforced linkages allow it to tear into blast rock with staggering breakout force.";

    const quizQuestions = [
        {
            question: "Why is the operator cabin on an underground LHD mounted sideways?",
            options: [
                "To reduce the overall width of the machine",
                "To provide equal visibility when driving forward and in reverse",
                "To keep the operator away from the hot engine compartment",
                "To make room for larger hydraulic pumps"
            ],
            correctAnswer: 1,
            explanation: "Underground tunnels are often too narrow to turn around in. The LHD must drive into a tunnel (forward), load the bucket, and then drive out in reverse. A side-facing cabin lets the operator simply turn their head to see perfectly in either direction without twisting their body continuously."
        },
        {
            question: "What is the primary purpose of the heavy steel chains enveloping the tires?",
            options: [
                "To increase the top speed of the machine",
                "To provide electrical grounding for the chassis",
                "To protect the rubber tires from severe cuts and abrasions caused by sharp blast rock",
                "To act as a counterweight against the loaded bucket"
            ],
            correctAnswer: 2,
            explanation: "Blast rock in underground mines is incredibly sharp and abrasive. Massive steel tire chains act as armor, significantly extending the life of the very expensive rubber tires while also providing exceptional traction in wet, muddy conditions."
        },
        {
            question: "How does the LHD steer in tight underground drifts?",
            options: [
                "Using independent steering on all four wheels (crab walk)",
                "By articulating (bending) in the middle using a heavy-duty pivot joint and hydraulic cylinders",
                "By braking one side of the wheels, similar to a skid-steer loader",
                "By rotating the entire cab and chassis 360 degrees on an excavator track base"
            ],
            correctAnswer: 1,
            explanation: "LHDs use an articulated chassis. A massive pivot joint connects the front and rear frames, and cross-mounted hydraulic cylinders push/pull the frames to 'bend' the machine, allowing for incredibly tight turning radii in narrow tunnels."
        },
        {
            question: "What is a major risk if the engine exhaust system (scrubbers/DPF) fails on an underground LHD?",
            options: [
                "The machine will immediately explode",
                "Toxic diesel particulate and gases will rapidly accumulate in the confined tunnel, forcing an evacuation",
                "The chained tires will lose traction",
                "The hydraulic fluid will freeze"
            ],
            correctAnswer: 1,
            explanation: "Ventilation is critical underground. LHDs are equipped with scrubbers and Diesel Particulate Filters (DPF) to minimize emissions. A failure means dangerous gases like carbon monoxide and nitrogen dioxide, along with particulates, quickly foul the air, creating a hazardous environment for all miners."
        },
        {
            question: "What role do the Lift Hydraulic Cylinders play during the mucking (loading) process?",
            options: [
                "They control the articulation angle of the chassis",
                "They pump fuel into the engine during heavy loads",
                "They provide the immense upward force required to break the bucket out of the muck pile and hoist the heavy load",
                "They engage the transmission gears"
            ],
            correctAnswer: 2,
            explanation: "The lift cylinders are massive hydraulic rams that push against the boom to lift the bucket. When digging into a pile of fragmented rock, these cylinders must exert tremendous 'breakout force' to tear the load free and lift it for transport."
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Complex synchronized animations
        
        // 1. Driving and Wheel Rotation
        // Move the whole machine forward/backward in a slow cycle
        const driveCycle = Math.sin(time * speed * 0.5); // ranges from -1 to 1
        group.position.x = driveCycle * 5; 
        
        // Rotate wheels based on driveCycle derivative (velocity)
        const wheelRotSpeed = Math.cos(time * speed * 0.5) * speed * 2;
        meshesObj.wheelFL.rotation.z -= wheelRotSpeed;
        meshesObj.wheelFR.rotation.z -= wheelRotSpeed;
        meshesObj.wheelRL.rotation.z -= wheelRotSpeed;
        meshesObj.wheelRR.rotation.z -= wheelRotSpeed;

        // 2. Articulated Steering
        // Steer slightly left and right as it drives
        const steerCycle = Math.sin(time * speed * 0.25) * 0.2; // 0.2 radians
        meshesObj.rearFrame.rotation.y = steerCycle;
        
        // 3. Boom and Bucket digging cycle
        // Boom lifts and lowers
        const digCycle = Math.max(0, Math.sin(time * speed)); 
        meshesObj.boom.rotation.z = -digCycle * 0.8; // Lift up
        
        // Bucket curls
        meshesObj.bucket.rotation.z = digCycle * 1.2;
        
        // Sync Hydraulic Cylinders
        // Lift cylinders push boom
        const boomBaseY = -0.5;
        const boomTargetY = -0.5 + Math.sin(meshesObj.boom.rotation.z) * 2;
        const liftExtension = digCycle * 0.5;
        
        // Animate the rod within the hydraulic cylinder
        if (meshesObj.liftHydLeft.userData.rod) {
            meshesObj.liftHydLeft.userData.rod.position.y = 3 * 0.7 + liftExtension;
            meshesObj.liftHydRight.userData.rod.position.y = 3 * 0.7 + liftExtension;
        }

        // Tilt cylinder
        if (meshesObj.tiltHyd.userData.rod) {
            meshesObj.tiltHyd.userData.rod.position.y = 2.5 * 0.7 + (digCycle * 0.4);
        }

        // 4. Operator Cabin Details
        // Steering wheel turns with articulation
        meshesObj.steeringWheel.rotation.x = steerCycle * 2;
        
        // 5. Neon Glowing pulsing
        const pulse = (Math.sin(time * speed * 4) + 1) / 2;
        meshesObj.frontNeon.material.emissiveIntensity = 1 + pulse * 2;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
