import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const refs = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });
    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xcc1100,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });
    const plasmaCore = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        wireframe: true
    });
    const carbonBrake = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1
    });

    // Trunnion Mount (Fixed to aircraft body, pivot point for retraction)
    const trunnionPivot = new THREE.Group();
    trunnionPivot.position.set(0, 10, 0);
    group.add(trunnionPivot);
    refs.trunnionPivot = trunnionPivot;

    const trunnionMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 32), darkSteel);
    trunnionMesh.rotation.z = Math.PI / 2;
    trunnionPivot.add(trunnionMesh);
    
    const trunnionAttach = new THREE.Group();
    trunnionAttach.position.set(0, -1, -1.5);
    trunnionPivot.add(trunnionAttach);
    refs.trunnionAttach = trunnionAttach;

    parts.push({
        name: "Trunnion Mount",
        description: "Primary attachment point and pivot axis for the landing gear assembly.",
        material: "Dark Steel / Titanium",
        function: "Transmits landing loads to the airframe and acts as the pivot for retraction.",
        assemblyOrder: 1,
        connections: ["Outer Strut", "Actuator", "Aircraft Frame"],
        failureEffect: "Landing gear separation from aircraft.",
        cascadeFailures: ["Catastrophic structural failure", "Loss of control"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // Outer Strut
    const outerStrutGroup = new THREE.Group();
    trunnionPivot.add(outerStrutGroup);
    refs.outerStrutGroup = outerStrutGroup;

    const outerStrutMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6, 32), steel);
    outerStrutMesh.position.set(0, -3, 0);
    outerStrutGroup.add(outerStrutMesh);
    
    const strutAttach = new THREE.Group();
    strutAttach.position.set(0, -2, -0.6);
    outerStrutGroup.add(strutAttach);
    refs.strutAttach = strutAttach;

    parts.push({
        name: "Main Outer Strut",
        description: "Main housing for the oleo-pneumatic shock absorber.",
        material: "High-Strength Steel Alloy",
        function: "Absorbs vertical impact forces during landing.",
        assemblyOrder: 2,
        connections: ["Trunnion Mount", "Inner Shock Strut", "Torque Links"],
        failureEffect: "Loss of shock absorption, extreme stress on airframe.",
        cascadeFailures: ["Gear collapse", "Airframe cracking"],
        originalPosition: {x: 0, y: 7, z: 0},
        explodedPosition: {x: 0, y: 7, z: -5}
    });

    // Neon Hydraulic Rings
    refs.hydraulicRings = [];
    for(let i=0; i<4; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.05, 16, 32), glowingBlue);
        ring.position.set(0, -1 - i, 0);
        ring.rotation.x = Math.PI / 2;
        outerStrutGroup.add(ring);
        refs.hydraulicRings.push(ring);
    }
    parts.push({
        name: "Hydraulic Plasma Channels",
        description: "Advanced synthetic fluid routing for extremely rapid actuator response.",
        material: "Synthetic Polymer / Plasma",
        function: "Routes pressurized fluid to dampers and steering actuators.",
        assemblyOrder: 3,
        connections: ["Outer Strut"],
        failureEffect: "Loss of hydraulic pressure and steering.",
        cascadeFailures: ["Inability to steer", "Gear lock failure"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 4, y: 4.5, z: 0}
    });

    // Inner Shock Strut
    const innerStrutGroup = new THREE.Group();
    innerStrutGroup.position.set(0, -6, 0); 
    outerStrutGroup.add(innerStrutGroup);
    refs.innerStrutGroup = innerStrutGroup;

    const innerStrutMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6, 32), chrome);
    innerStrutMesh.position.set(0, -1, 0); 
    innerStrutGroup.add(innerStrutMesh);
    
    const lowerPivotMarker = new THREE.Group();
    lowerPivotMarker.position.set(0, 1.5, 0.6);
    innerStrutGroup.add(lowerPivotMarker);
    refs.lowerPivotMarker = lowerPivotMarker;

    parts.push({
        name: "Inner Shock Strut",
        description: "Chromed lower piston compressing into the outer housing.",
        material: "Chrome-Plated Titanium",
        function: "Pneumatic dampening of landing forces.",
        assemblyOrder: 4,
        connections: ["Outer Strut", "Axle Assembly"],
        failureEffect: "Strut jamming or collapsing.",
        cascadeFailures: ["Tire blowout due to hard impact", "Loss of ground clearance"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // Axle Assembly
    const axleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 32), steel);
    axleMesh.rotation.z = Math.PI / 2;
    axleMesh.position.set(0, -3.5, 0);
    innerStrutGroup.add(axleMesh);
    parts.push({
        name: "Axle Assembly",
        description: "Horizontal load-bearing beam mounting the wheels and brakes.",
        material: "Forged Steel",
        function: "Connects dual wheels and brake units to the inner strut.",
        assemblyOrder: 5,
        connections: ["Inner Shock Strut", "Main Wheels", "Brakes"],
        failureEffect: "Wheel separation.",
        cascadeFailures: ["Brake destruction", "Runway deviation"],
        originalPosition: {x: 0, y: -0.5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // Wheels (Left and Right)
    const wheelGeo = new THREE.TorusGeometry(1.2, 0.6, 32, 64);
    const rimGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    rimGeo.rotateZ(Math.PI/2);
    
    const wheelLGroup = new THREE.Group();
    wheelLGroup.position.set(-1.8, -3.5, 0);
    innerStrutGroup.add(wheelLGroup);
    refs.wheelLGroup = wheelLGroup;
    
    const tireL = new THREE.Mesh(wheelGeo, rubber);
    tireL.rotation.y = Math.PI / 2;
    const rimL = new THREE.Mesh(rimGeo, aluminum);
    wheelLGroup.add(tireL);
    wheelLGroup.add(rimL);

    const wheelRGroup = new THREE.Group();
    wheelRGroup.position.set(1.8, -3.5, 0);
    innerStrutGroup.add(wheelRGroup);
    refs.wheelRGroup = wheelRGroup;

    const tireR = new THREE.Mesh(wheelGeo, rubber);
    tireR.rotation.y = Math.PI / 2;
    const rimR = new THREE.Mesh(rimGeo, aluminum);
    wheelRGroup.add(tireR);
    wheelRGroup.add(rimR);

    parts.push({
        name: "Main Dual Wheels",
        description: "High-speed, heavy-load aviation tires mounted on forged rims.",
        material: "Aviation Rubber & Aluminum",
        function: "Traction, braking interface, and ground contact.",
        assemblyOrder: 6,
        connections: ["Axle Assembly", "Brake Rotors"],
        failureEffect: "Tire blowout.",
        cascadeFailures: ["Loss of directional control", "Rim disintegration"],
        originalPosition: {x: -1.8, y: -0.5, z: 0},
        explodedPosition: {x: -6, y: -0.5, z: 0}
    });

    // Brakes
    const brakeGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
    brakeGeo.rotateZ(Math.PI / 2);
    
    const brakeL = new THREE.Mesh(brakeGeo, carbonBrake);
    brakeL.position.set(-1.1, -3.5, 0);
    innerStrutGroup.add(brakeL);
    
    const brakeR = new THREE.Mesh(brakeGeo, carbonBrake);
    brakeR.position.set(1.1, -3.5, 0);
    innerStrutGroup.add(brakeR);

    const brakeHeatGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.42, 32);
    brakeHeatGeo.rotateZ(Math.PI / 2);
    
    const brakeHeatL = new THREE.Mesh(brakeHeatGeo, glowingRed);
    brakeL.add(brakeHeatL);
    refs.brakeHeatL = brakeHeatL;

    const brakeHeatR = new THREE.Mesh(brakeHeatGeo, glowingRed);
    brakeR.add(brakeHeatR);
    refs.brakeHeatR = brakeHeatR;

    parts.push({
        name: "Carbon Multi-Disc Brakes",
        description: "Stacks of carbon rotors and stators for intense kinetic energy dissipation.",
        material: "Carbon-Carbon Composite",
        function: "Decelerates the aircraft upon landing.",
        assemblyOrder: 7,
        connections: ["Axle Assembly", "Main Wheels"],
        failureEffect: "Inability to stop the aircraft.",
        cascadeFailures: ["Runway excursion", "Brake fire"],
        originalPosition: {x: -1.1, y: -0.5, z: 0},
        explodedPosition: {x: -4, y: -0.5, z: 3}
    });

    // Torque Links
    const scissorGroup = new THREE.Group();
    scissorGroup.position.set(0, -3, 0.6); 
    outerStrutGroup.add(scissorGroup);
    
    const upperLinkGroup = new THREE.Group();
    scissorGroup.add(upperLinkGroup);
    refs.upperLinkGroup = upperLinkGroup;
    
    const upperLink = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2, 0.2), aluminum);
    upperLink.position.set(0, -1, 0);
    upperLinkGroup.add(upperLink);
    
    const lowerLinkGroup = new THREE.Group();
    scissorGroup.add(lowerLinkGroup);
    refs.lowerLinkGroup = lowerLinkGroup;

    const lowerLink = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2, 0.2), aluminum);
    lowerLink.position.set(0, -1, 0);
    lowerLinkGroup.add(lowerLink);

    parts.push({
        name: "Torque Links (Scissors)",
        description: "Hinged linkages connecting outer and inner struts.",
        material: "Forged Aluminum Alloy",
        function: "Prevents the inner strut and wheels from rotating out of alignment while allowing vertical travel.",
        assemblyOrder: 8,
        connections: ["Outer Strut", "Inner Shock Strut"],
        failureEffect: "Wheel shimmy and uncommanded steering.",
        cascadeFailures: ["Gear collapse during side-load", "Loss of steering"],
        originalPosition: {x: 0, y: 2, z: 1.5},
        explodedPosition: {x: 0, y: 2, z: 5}
    });

    // Retraction Actuator
    const actuatorGroup = new THREE.Group();
    actuatorGroup.position.set(0, 10, -2);
    group.add(actuatorGroup);
    refs.actuatorGroup = actuatorGroup;
    
    const actuatorCylGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    actuatorCylGeo.rotateX(Math.PI / 2);
    actuatorCylGeo.translate(0, 0, 2.5);
    const actuatorCyl = new THREE.Mesh(actuatorCylGeo, steel);
    actuatorGroup.add(actuatorCyl);
    
    const actuatorPistonGroup = new THREE.Group();
    actuatorGroup.add(actuatorPistonGroup);
    refs.actuatorPistonGroup = actuatorPistonGroup;
    
    const actuatorPistonGeo = new THREE.CylinderGeometry(0.15, 0.15, 5, 16);
    actuatorPistonGeo.rotateX(Math.PI / 2);
    actuatorPistonGeo.translate(0, 0, 2.5);
    const actuatorPiston = new THREE.Mesh(actuatorPistonGeo, chrome);
    actuatorPistonGroup.add(actuatorPiston);

    parts.push({
        name: "Retraction Actuator",
        description: "Heavy-duty hydraulic cylinder linking aircraft structure to gear trunnion.",
        material: "Steel / Hydraulic Fluid",
        function: "Drives the landing gear into the wheel well for flight, and extends it for landing.",
        assemblyOrder: 9,
        connections: ["Trunnion Mount", "Aircraft Frame"],
        failureEffect: "Failure to extend or retract.",
        cascadeFailures: ["Emergency gear extension required", "Belly landing"],
        originalPosition: {x: 0, y: 10, z: -2},
        explodedPosition: {x: 0, y: 15, z: -8}
    });

    // Drag Brace
    const dragBraceGroup = new THREE.Group();
    dragBraceGroup.position.set(0, 5, -3);
    group.add(dragBraceGroup);
    refs.dragBraceGroup = dragBraceGroup;

    const dragBraceGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    dragBraceGeo.rotateX(Math.PI/2);
    dragBraceGeo.translate(0, 0, 2.5);
    const dragBraceMesh = new THREE.Mesh(dragBraceGeo, steel);
    dragBraceGroup.add(dragBraceMesh);
    refs.dragBraceMesh = dragBraceMesh;

    parts.push({
        name: "Drag Brace / Side Strut",
        description: "Folding structural member that locks the gear in the down position.",
        material: "High-Strength Steel Alloy",
        function: "Maintains gear downlock and resists fore/aft drag loads during braking.",
        assemblyOrder: 10,
        connections: ["Outer Strut", "Aircraft Frame"],
        failureEffect: "Gear collapses rearward upon landing.",
        cascadeFailures: ["Catastrophic crash"],
        originalPosition: {x: 0, y: 5, z: -3},
        explodedPosition: {x: -3, y: 5, z: -6}
    });

    // Plasma Core
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, -1.5, 0);
    outerStrutGroup.add(coreGroup);
    
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 1), plasmaCore);
    coreGroup.add(coreMesh);
    refs.coreMesh = coreMesh;

    const coreCage = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), darkSteel);
    coreCage.material.wireframe = true;
    coreGroup.add(coreCage);
    refs.coreCage = coreCage;

    parts.push({
        name: "Magnetic Damper Core",
        description: "Active magnetic plasma reactor to dynamically adjust suspension stiffness.",
        material: "Plasma / Containment Field",
        function: "Provides instantaneous active damping adjustments to terrain irregularities.",
        assemblyOrder: 11,
        connections: ["Outer Strut", "Inner Shock Strut"],
        failureEffect: "Harsh ride, increased structural fatigue.",
        cascadeFailures: ["Plasma leak", "Micro-fractures in struts"],
        originalPosition: {x: 0, y: 5.5, z: 0},
        explodedPosition: {x: 0, y: 5.5, z: -3}
    });

    const animate = (time, speed, meshes) => {
        const cycleDuration = 18;
        const t = (time * speed) % cycleDuration;

        refs.coreMesh.rotation.y = time * 2;
        refs.coreMesh.rotation.x = time * 1.5;
        refs.coreCage.rotation.y = -time * 1.2;
        
        let retractionAng = 0;
        let shockComp = 0;
        let wheelSpeed = 0;
        let brakeHeatOpacity = 0;
        
        if (t < 3) {
            retractionAng = 0;
            shockComp = 0;
            wheelSpeed = Math.max(0, 1 - t/3);
            brakeHeatOpacity = 0;
        } else if (t < 6) {
            const norm = (t - 3) / 3;
            const smooth = norm * norm * (3 - 2 * norm);
            retractionAng = smooth * (Math.PI / 2);
            shockComp = 0;
            wheelSpeed = 0;
            brakeHeatOpacity = 0;
        } else if (t < 9) {
            retractionAng = Math.PI / 2;
            shockComp = 0;
            wheelSpeed = 0;
            brakeHeatOpacity = 0;
        } else if (t < 12) {
            const norm = (t - 9) / 3;
            const smooth = norm * norm * (3 - 2 * norm);
            retractionAng = (1 - smooth) * (Math.PI / 2);
            shockComp = 0;
            wheelSpeed = 0;
            brakeHeatOpacity = 0;
        } else if (t < 15) {
            retractionAng = 0;
            const norm = (t - 12) / 3;
            wheelSpeed = Math.min(1, norm * 10) * 20; 
            const damp = Math.exp(-norm * 3);
            shockComp = damp * Math.abs(Math.sin(norm * Math.PI * 4)) * 0.8;
            brakeHeatOpacity = Math.min(1, norm * 2);
        } else {
            retractionAng = 0;
            const norm = (t - 15) / 3;
            wheelSpeed = 10 - norm * 5;
            shockComp = 0.1 + Math.sin(time * 10) * 0.05;
            brakeHeatOpacity = 1 - norm;
        }

        // 1. Trunnion Retraction
        refs.trunnionPivot.rotation.x = -retractionAng;
        
        // Update matrices for world position lookAts
        refs.trunnionPivot.updateMatrixWorld();
        
        // 2. Actuator LookAt
        const actWorldTarget = new THREE.Vector3();
        refs.trunnionAttach.getWorldPosition(actWorldTarget);
        refs.actuatorGroup.lookAt(actWorldTarget);
        
        const actWorldBase = new THREE.Vector3();
        refs.actuatorGroup.getWorldPosition(actWorldBase);
        const actDist = actWorldBase.distanceTo(actWorldTarget);
        refs.actuatorPistonGroup.position.z = actDist - 5; 

        // 3. Shock Compression
        const strutMaxTravel = 2.5;
        refs.innerStrutGroup.position.y = -6 + shockComp * strutMaxTravel;
        refs.innerStrutGroup.updateMatrixWorld();

        // 4. Torque Links IK
        const targetY = (-6 + shockComp * strutMaxTravel) + 1.5 - (-3);
        const dist = Math.abs(targetY);
        const linkLen = 2.0;
        const safeDist = Math.min(dist, linkLen * 2 - 0.01);
        const ang = Math.acos((safeDist / 2) / linkLen); 
        
        refs.upperLinkGroup.rotation.x = ang;
        const kneeY = -linkLen * Math.cos(ang);
        const kneeZ = linkLen * Math.sin(ang);
        refs.lowerLinkGroup.position.set(0, kneeY, kneeZ);
        refs.lowerLinkGroup.rotation.x = -ang;

        // 5. Drag Brace LookAt
        const dragWorldTarget = new THREE.Vector3();
        refs.strutAttach.getWorldPosition(dragWorldTarget);
        refs.dragBraceGroup.lookAt(dragWorldTarget);
        
        const dragWorldBase = new THREE.Vector3();
        refs.dragBraceGroup.getWorldPosition(dragWorldBase);
        const dragDist = dragWorldBase.distanceTo(dragWorldTarget);
        refs.dragBraceMesh.scale.z = dragDist / 5;

        // 6. Wheels and Brakes
        refs.wheelLGroup.rotation.x -= wheelSpeed * 0.05;
        refs.wheelRGroup.rotation.x -= wheelSpeed * 0.05;

        refs.brakeHeatL.material.opacity = brakeHeatOpacity * 0.9;
        refs.brakeHeatR.material.opacity = brakeHeatOpacity * 0.9;
        
        // 7. Hydraulic Rings
        refs.hydraulicRings.forEach((ring, idx) => {
            const phase = time * 3 + idx;
            const scale = 1 + 0.1 * Math.sin(phase);
            ring.scale.set(scale, scale, scale);
            ring.material.emissiveIntensity = 1.0 + 1.0 * Math.sin(phase);
        });
    };

    const description = "The Aerospace Heavy-Duty Retractable Landing Gear incorporates advanced pneumatics, carbon multi-disc braking, and active magnetic plasma damping to handle extreme landing forces. Its retractable design utilizes a trunnion-mounted structural sweep and complex hydraulic actuation.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Torque Links (Scissors) on a landing gear?",
            options: [
                "To provide braking force to the wheels.",
                "To lock the gear in the retracted position.",
                "To prevent the inner strut from rotating while allowing vertical movement.",
                "To act as the primary shock absorber."
            ],
            correct: 2,
            explanation: "Torque links act as a hinged bridge between the fixed outer strut and the moving inner strut, maintaining wheel alignment while allowing vertical shock compression.",
            difficulty: "Medium"
        },
        {
            question: "Why are carbon multi-disc brakes preferred in heavy aerospace applications?",
            options: [
                "They are cheaper to manufacture.",
                "They can absorb and dissipate massive amounts of kinetic energy and heat.",
                "They generate electricity during braking.",
                "They are completely immune to wear."
            ],
            correct: 1,
            explanation: "Carbon brakes have an incredibly high specific heat capacity and maintain their friction properties at extreme temperatures, making them ideal for heavy aircraft.",
            difficulty: "Hard"
        },
        {
            question: "Which component attaches the landing gear to the aircraft frame and acts as the pivot point for retraction?",
            options: [
                "The Axle Assembly",
                "The Trunnion Mount",
                "The Oleo Strut",
                "The Drag Brace"
            ],
            correct: 1,
            explanation: "The Trunnion Mount provides the structural connection to the airframe and serves as the primary hinge axis for extending and retracting the gear.",
            difficulty: "Medium"
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLandingGearAssembly() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
