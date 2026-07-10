import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // helper to create detailed geometry for continuous tracks
    const createTrackLinks = () => {
        const trackGroup = new THREE.Group();
        const linkGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.8);
        const treadGeometry = new THREE.BoxGeometry(0.05, 0.08, 0.8);
        const linkMaterial = darkSteel;
        const radius = 1.2;
        const length = 4.0;
        const numLinks = 60;
        
        for (let i = 0; i < numLinks; i++) {
            const linkGroup = new THREE.Group();
            
            const base = new THREE.Mesh(linkGeometry, linkMaterial);
            base.castShadow = true;
            base.receiveShadow = true;
            linkGroup.add(base);
            
            const tread1 = new THREE.Mesh(treadGeometry, linkMaterial);
            tread1.position.set(0.1, 0.04, 0);
            tread1.castShadow = true;
            tread1.receiveShadow = true;
            linkGroup.add(tread1);
            
            const tread2 = new THREE.Mesh(treadGeometry, linkMaterial);
            tread2.position.set(-0.1, 0.04, 0);
            tread2.castShadow = true;
            tread2.receiveShadow = true;
            linkGroup.add(tread2);
            
            // Calculate position along the track path (capsule shape)
            const t = i / numLinks;
            const pathLength = 2 * Math.PI * radius + 2 * length;
            let currentDist = t * pathLength;
            
            if (currentDist < length) {
                // Top flat part
                linkGroup.position.set(currentDist - length / 2, radius, 0);
            } else if (currentDist < length + Math.PI * radius) {
                // Front curve
                const angle = ((currentDist - length) / (Math.PI * radius)) * Math.PI;
                linkGroup.position.set(
                    length / 2 + Math.sin(angle) * radius,
                    Math.cos(angle) * radius,
                    0
                );
                linkGroup.rotation.z = -angle;
            } else if (currentDist < 2 * length + Math.PI * radius) {
                // Bottom flat part
                const d = currentDist - (length + Math.PI * radius);
                linkGroup.position.set(length / 2 - d, -radius, 0);
                linkGroup.rotation.z = Math.PI;
            } else {
                // Rear curve
                const d = currentDist - (2 * length + Math.PI * radius);
                const angle = (d / (Math.PI * radius)) * Math.PI;
                linkGroup.position.set(
                    -length / 2 - Math.sin(angle) * radius,
                    -Math.cos(angle) * radius,
                    0
                );
                linkGroup.rotation.z = Math.PI - angle;
            }
            
            trackGroup.add(linkGroup);
        }
        
        return trackGroup;
    };

    const leftTrack = createTrackLinks();
    leftTrack.position.set(0, 1.2, 1.8);
    group.add(leftTrack);
    
    parts.push({
        name: "Left Track Assembly",
        description: "Heavy-duty continuous track assembly with individual steel links and grousers for maximum traction in extreme terrains.",
        material: "darkSteel",
        function: "Locomotion",
        assemblyOrder: 1,
        connections: ["Main Chassis", "Left Drive Sprocket", "Left Idler"],
        failureEffect: "Loss of mobility and steering capability.",
        cascadeFailures: ["Drive motor overload"],
        originalPosition: {x: 0, y: 1.2, z: 1.8},
        explodedPosition: {x: -2, y: 1.2, z: 4.0}
    });

    const rightTrack = createTrackLinks();
    rightTrack.position.set(0, 1.2, -1.8);
    group.add(rightTrack);
    
    parts.push({
        name: "Right Track Assembly",
        description: "Heavy-duty continuous track assembly with individual steel links and grousers for maximum traction in extreme terrains.",
        material: "darkSteel",
        function: "Locomotion",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Right Drive Sprocket", "Right Idler"],
        failureEffect: "Vehicle veers continuously to the right when accelerating.",
        cascadeFailures: ["Drive motor overload"],
        originalPosition: {x: 0, y: 1.2, z: -1.8},
        explodedPosition: {x: -2, y: 1.2, z: -4.0}
    });

    // Main Chassis Body using ExtrudeGeometry for non-blocky realistic shape
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-2.5, 0);
    chassisShape.lineTo(2.5, 0);
    chassisShape.lineTo(3.0, 1.0);
    chassisShape.lineTo(2.5, 2.5);
    chassisShape.lineTo(-1.5, 2.5);
    chassisShape.lineTo(-2.0, 1.5);
    chassisShape.lineTo(-2.5, 0);
    
    const chassisExtrudeSettings = {
        depth: 2.4,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 3,
        bevelSize: 0.15,
        bevelThickness: 0.15
    };
    
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeSettings);
    const chassis = new THREE.Mesh(chassisGeo, steel);
    chassis.position.set(0, 0.2, -1.2);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    group.add(chassis);
    
    parts.push({
        name: "Main Chassis Core",
        description: "Reinforced steel mainframe designed to absorb extreme torsional stresses and heavy impact loads during earthmoving.",
        material: "steel",
        function: "Structural support",
        assemblyOrder: 3,
        connections: ["Engine Block", "Track Assemblies", "Cabin", "Blade C-Frame"],
        failureEffect: "Structural collapse under heavy load.",
        cascadeFailures: ["Engine misalignment", "Hydraulic failure"],
        originalPosition: {x: 0, y: 0.2, z: -1.2},
        explodedPosition: {x: 0, y: 5.2, z: -1.2}
    });

    // Engine Block and Compartment
    const engineGroup = new THREE.Group();
    const engineBlockGeo = new THREE.BoxGeometry(2.0, 1.2, 1.2);
    const engineMesh = new THREE.Mesh(engineBlockGeo, aluminum);
    engineMesh.position.set(1.0, 1.8, 0);
    engineGroup.add(engineMesh);
    
    // Cylinders / Engine Details
    for(let i=0; i<4; i++) {
        const cylGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
        const cyl1 = new THREE.Mesh(cylGeo, chrome);
        cyl1.position.set(0.4 + i*0.4, 2.5, 0.3);
        engineGroup.add(cyl1);
        
        const cyl2 = new THREE.Mesh(cylGeo, chrome);
        cyl2.position.set(0.4 + i*0.4, 2.5, -0.3);
        engineGroup.add(cyl2);
    }

    const radiatorGeo = new THREE.BoxGeometry(0.3, 1.0, 1.4);
    const radiator = new THREE.Mesh(radiatorGeo, darkSteel);
    radiator.position.set(2.1, 1.8, 0);
    engineGroup.add(radiator);
    
    // Exhaust Stacks
    const exhaustGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
    const exhaust = new THREE.Mesh(exhaustGeo, chrome);
    exhaust.position.set(1.5, 3.2, 0.5);
    engineGroup.add(exhaust);
    
    const airIntake = new THREE.Mesh(exhaustGeo, plastic);
    airIntake.position.set(1.5, 3.2, -0.5);
    engineGroup.add(airIntake);

    group.add(engineGroup);
    
    parts.push({
        name: "Turbocharged Diesel Engine V8",
        description: "Massive high-torque diesel engine providing immense pushing power at low RPMs.",
        material: "aluminum",
        function: "Power generation",
        assemblyOrder: 4,
        connections: ["Main Chassis", "Transmission", "Radiator", "Exhaust"],
        failureEffect: "Complete loss of power.",
        cascadeFailures: ["Hydraulic pump failure", "Electrical failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 3, y: 6, z: 0}
    });

    // Enclosed Operator Cabin
    const cabinGroup = new THREE.Group();
    
    const cabinBaseGeo = new THREE.BoxGeometry(2.0, 0.2, 2.2);
    const cabinBase = new THREE.Mesh(cabinBaseGeo, rubber);
    cabinBase.position.set(-0.5, 2.8, 0);
    cabinGroup.add(cabinBase);
    
    // ROPS Frame
    const pillarGeo = new THREE.BoxGeometry(0.15, 1.6, 0.15);
    const positions = [
        [-1.4, 3.7, 1.0], [-1.4, 3.7, -1.0], 
        [0.4, 3.7, 1.0], [0.4, 3.7, -1.0]
    ];
    positions.forEach(pos => {
        const p = new THREE.Mesh(pillarGeo, steel);
        p.position.set(...pos);
        cabinGroup.add(p);
    });
    
    // Roof
    const roofGeo = new THREE.BoxGeometry(2.2, 0.2, 2.4);
    const roof = new THREE.Mesh(roofGeo, steel);
    roof.position.set(-0.5, 4.6, 0);
    cabinGroup.add(roof);

    // Tinted Glass Panes
    const frontGlassGeo = new THREE.PlaneGeometry(1.8, 1.5);
    const frontGlass = new THREE.Mesh(frontGlassGeo, tinted);
    frontGlass.position.set(0.4, 3.7, 0);
    frontGlass.rotation.y = Math.PI / 2;
    cabinGroup.add(frontGlass);
    
    const backGlass = new THREE.Mesh(frontGlassGeo, tinted);
    backGlass.position.set(-1.4, 3.7, 0);
    backGlass.rotation.y = -Math.PI / 2;
    cabinGroup.add(backGlass);
    
    const sideGlassGeo = new THREE.PlaneGeometry(1.8, 1.5);
    const leftGlass = new THREE.Mesh(sideGlassGeo, tinted);
    leftGlass.position.set(-0.5, 3.7, 1.0);
    cabinGroup.add(leftGlass);
    
    const rightGlass = new THREE.Mesh(sideGlassGeo, tinted);
    rightGlass.position.set(-0.5, 3.7, -1.0);
    rightGlass.rotation.y = Math.PI;
    cabinGroup.add(rightGlass);
    
    // Operator Seat and Controls Detailed
    const seatGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(-0.8, 3.2, 0);
    cabinGroup.add(seat);
    
    const joystickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
    const joy1 = new THREE.Mesh(joystickGeo, plastic);
    joy1.position.set(-0.4, 3.4, 0.3);
    cabinGroup.add(joy1);
    
    const joy2 = new THREE.Mesh(joystickGeo, plastic);
    joy2.position.set(-0.4, 3.4, -0.3);
    cabinGroup.add(joy2);
    
    const controlPanelGeo = new THREE.BoxGeometry(0.4, 0.6, 1.2);
    const controls = new THREE.Mesh(controlPanelGeo, darkSteel);
    controls.position.set(0.0, 3.2, 0);
    cabinGroup.add(controls);

    group.add(cabinGroup);
    
    parts.push({
        name: "ROPS Enclosed Operator Cabin",
        description: "Roll-Over Protection Structure with climate control, advanced joysticks, and tinted safety glass.",
        material: "steel/tinted",
        function: "Operator protection and interface",
        assemblyOrder: 5,
        connections: ["Main Chassis", "Hydraulic Controls", "Electrical Harness"],
        failureEffect: "Operator hazard, extreme discomfort, or loss of precision control.",
        cascadeFailures: ["Loss of precision grading"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -2, y: 9, z: 0}
    });

    // Front Blade Assembly (Semi-U)
    const bladeGroup = new THREE.Group();
    bladeGroup.position.set(2.5, 1.0, 0);
    
    const bladeCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(1, -0.5, 0),
        new THREE.Vector3(1.2, 1, 0),
        new THREE.Vector3(0.5, 2, 0)
    );
    const bladeGeo = new THREE.TubeGeometry(bladeCurve, 32, 2.4, 12, false);
    const blade = new THREE.Mesh(bladeGeo, steel);
    blade.rotation.x = Math.PI / 2;
    blade.position.set(1.0, 0.5, 0);
    blade.castShadow = true;
    bladeGroup.add(blade);
    
    const bladeCuttingEdgeGeo = new THREE.BoxGeometry(0.2, 0.4, 4.8);
    const cuttingEdge = new THREE.Mesh(bladeCuttingEdgeGeo, darkSteel);
    cuttingEdge.position.set(1.0, -0.4, 0);
    bladeGroup.add(cuttingEdge);
    
    group.add(bladeGroup);
    
    parts.push({
        name: "Massive Semi-U Dozer Blade",
        description: "Colossal curved steel moldboard designed for maximum material retention, heavy earthmoving, and fine grading.",
        material: "steel",
        function: "Earthmoving",
        assemblyOrder: 6,
        connections: ["C-Frame Push Arms", "Lift Cylinders", "Tilt Cylinders"],
        failureEffect: "Inability to push material.",
        cascadeFailures: ["C-Frame stress fracture"],
        originalPosition: {x: 2.5, y: 1.0, z: 0},
        explodedPosition: {x: 8.5, y: 1.0, z: 0}
    });
    
    // C-Frame Push Arms
    const pushArmsGroup = new THREE.Group();
    
    const armGeo = new THREE.BoxGeometry(4.0, 0.4, 0.4);
    const leftArm = new THREE.Mesh(armGeo, steel);
    leftArm.position.set(1.0, 1.0, 1.8);
    leftArm.rotation.y = 0.2;
    pushArmsGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeo, steel);
    rightArm.position.set(1.0, 1.0, -1.8);
    rightArm.rotation.y = -0.2;
    pushArmsGroup.add(rightArm);

    group.add(pushArmsGroup);
    
    parts.push({
        name: "Heavy-Duty C-Frame Push Arms",
        description: "Transfers the immense driving force from the chassis directly to the blade, constructed of thick box-section steel.",
        material: "steel",
        function: "Force transmission",
        assemblyOrder: 7,
        connections: ["Main Chassis Trunnion", "Blade"],
        failureEffect: "Loss of blade control and pushing capacity.",
        cascadeFailures: ["Blade detachment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 4, y: -3, z: 0}
    });

    // Hydraulic Lift Cylinders (Highly detailed)
    const hydraulicGroup = new THREE.Group();
    
    const createHydraulic = () => {
        const hydGroup = new THREE.Group();
        const cylinderGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 16);
        const cylinder = new THREE.Mesh(cylinderGeo, steel);
        cylinder.position.set(0, 0.9, 0);
        hydGroup.add(cylinder);
        
        const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.set(0, 1.8, 0);
        hydGroup.add(rod);
        
        // Hydraulic lines
        const lineCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.2, 0.5, 0),
            new THREE.Vector3(0.5, 0.5, 0),
            new THREE.Vector3(0.5, 0, 0)
        );
        const lineGeo = new THREE.TubeGeometry(lineCurve, 8, 0.03, 8, false);
        const line = new THREE.Mesh(lineGeo, rubber);
        hydGroup.add(line);

        return hydGroup;
    };
    
    const leftLiftHyd = createHydraulic();
    leftLiftHyd.position.set(2.0, 1.5, 1.4);
    leftLiftHyd.rotation.z = -0.4;
    hydraulicGroup.add(leftLiftHyd);
    
    const rightLiftHyd = createHydraulic();
    rightLiftHyd.position.set(2.0, 1.5, -1.4);
    rightLiftHyd.rotation.z = -0.4;
    hydraulicGroup.add(rightLiftHyd);
    
    group.add(hydraulicGroup);
    
    parts.push({
        name: "Blade Lift Hydraulic Cylinders",
        description: "High-pressure hydraulic actuators for raising and lowering the immense dozer blade with precision.",
        material: "steel/chrome",
        function: "Blade elevation control",
        assemblyOrder: 8,
        connections: ["Main Chassis Front", "Blade"],
        failureEffect: "Blade drops to ground, cannot be lifted.",
        cascadeFailures: ["Hydraulic fluid leak", "Pump cavitations"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 2, y: 5, z: 4}
    });
    
    // Rear Ripper Assembly
    const ripperGroup = new THREE.Group();
    ripperGroup.position.set(-2.5, 1.0, 0);
    
    const ripperFrameGeo = new THREE.BoxGeometry(1.5, 0.6, 2.0);
    const ripperFrame = new THREE.Mesh(ripperFrameGeo, steel);
    ripperFrame.position.set(-0.75, 0.5, 0);
    ripperGroup.add(ripperFrame);
    
    const shankGeo = new THREE.BoxGeometry(0.35, 3.0, 0.5);
    const shankPositions = [0, 0.7, -0.7];
    shankPositions.forEach(z => {
        const shank = new THREE.Mesh(shankGeo, darkSteel);
        shank.position.set(-1.2, -0.5, z);
        shank.rotation.z = 0.3;
        ripperGroup.add(shank);
        
        // Tooth point
        const pointGeo = new THREE.CylinderGeometry(0, 0.2, 0.5, 4);
        const point = new THREE.Mesh(pointGeo, darkSteel);
        point.position.set(0, -1.5, 0);
        point.rotation.z = Math.PI;
        shank.add(point);
    });
    
    const ripperHyd = createHydraulic();
    ripperHyd.position.set(-0.2, 1.0, 0);
    ripperHyd.rotation.z = 0.5;
    ripperGroup.add(ripperHyd);
    
    group.add(ripperGroup);
    
    parts.push({
        name: "Multi-Shank Rear Ripper",
        description: "Hydraulically controlled heavy steel claws for tearing up hardened earth, rock, or asphalt. Equipped with replaceable hardened steel tips.",
        material: "darkSteel",
        function: "Surface penetration and fracturing",
        assemblyOrder: 9,
        connections: ["Rear Chassis", "Ripper Hydraulics"],
        failureEffect: "Inability to break hard ground, drastically reducing grading efficiency.",
        cascadeFailures: ["Shank fracture under extreme stress"],
        originalPosition: {x: -2.5, y: 1.0, z: 0},
        explodedPosition: {x: -7, y: 1.0, z: 0}
    });

    // Elevated Drive Sprockets (Rear)
    const sprocketGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.4, 32);
    const leftSprocket = new THREE.Mesh(sprocketGeo, steel);
    leftSprocket.rotation.x = Math.PI / 2;
    leftSprocket.position.set(-1.5, 1.2, 1.6);
    
    // Add teeth to sprocket
    for(let i=0; i<12; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.4), darkSteel);
        tooth.position.set(Math.cos(i * Math.PI/6) * 1.0, Math.sin(i * Math.PI/6) * 1.0, 0);
        tooth.rotation.z = i * Math.PI/6;
        leftSprocket.add(tooth);
    }
    group.add(leftSprocket);
    
    const rightSprocket = new THREE.Mesh(sprocketGeo, steel);
    rightSprocket.rotation.x = Math.PI / 2;
    rightSprocket.position.set(-1.5, 1.2, -1.6);
    
    for(let i=0; i<12; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.4), darkSteel);
        tooth.position.set(Math.cos(i * Math.PI/6) * 1.0, Math.sin(i * Math.PI/6) * 1.0, 0);
        tooth.rotation.z = i * Math.PI/6;
        rightSprocket.add(tooth);
    }
    group.add(rightSprocket);

    parts.push({
        name: "Elevated Drive Sprockets",
        description: "Transmits torque from the final drives to the track links. The elevated design isolates the final drives from abrasive ground impacts.",
        material: "steel",
        function: "Track propulsion",
        assemblyOrder: 10,
        connections: ["Final Drive", "Track Chain"],
        failureEffect: "Loss of track drive.",
        cascadeFailures: ["Track derailment", "Final drive destruction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -3, y: 1.2, z: 6}
    });

    // Front Idlers
    const idlerGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
    const leftIdler = new THREE.Mesh(idlerGeo, darkSteel);
    leftIdler.rotation.x = Math.PI / 2;
    leftIdler.position.set(2.0, 1.2, 1.6);
    group.add(leftIdler);
    
    const rightIdler = new THREE.Mesh(idlerGeo, darkSteel);
    rightIdler.rotation.x = Math.PI / 2;
    rightIdler.position.set(2.0, 1.2, -1.6);
    group.add(rightIdler);

    parts.push({
        name: "Massive Front Track Idlers",
        description: "Heavy steel wheels maintaining track tension and guiding the track chain over front obstacles.",
        material: "darkSteel",
        function: "Track tension and guidance",
        assemblyOrder: 11,
        connections: ["Track Frame", "Track Chain", "Recoil Spring"],
        failureEffect: "Track sags or derails entirely.",
        cascadeFailures: ["Damage to track links", "Undercarriage grinding"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 5, y: 1.2, z: 6}
    });

    // Track Rollers
    const rollerGroup = new THREE.Group();
    const rollerGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
    
    for(let i=0; i<6; i++) {
        const lx = -1.2 + i * 0.6;
        
        const lr = new THREE.Mesh(rollerGeo, steel);
        lr.rotation.x = Math.PI / 2;
        lr.position.set(lx, 0.4, 1.6);
        rollerGroup.add(lr);
        
        const rr = new THREE.Mesh(rollerGeo, steel);
        rr.rotation.x = Math.PI / 2;
        rr.position.set(lx, 0.4, -1.6);
        rollerGroup.add(rr);
    }
    group.add(rollerGroup);

    parts.push({
        name: "Bottom Track Rollers",
        description: "Weight-bearing solid steel rollers distributing the immense machine weight evenly across the track chain footprint.",
        material: "steel",
        function: "Weight distribution",
        assemblyOrder: 12,
        connections: ["Track Frame", "Track Links"],
        failureEffect: "Increased vibration, excessive uneven wear on track sections.",
        cascadeFailures: ["Premature track failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: 4}
    });

    // Radiator Grille
    const grilleGeo = new THREE.BoxGeometry(0.2, 1.2, 1.2);
    const grille = new THREE.Mesh(grilleGeo, darkSteel);
    grille.position.set(2.2, 1.8, 0);
    // Add slats
    for(let i=0; i<10; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 1.1), chrome);
        slat.position.set(0.1, -0.5 + (i * 0.11), 0);
        grille.add(slat);
    }
    group.add(grille);

    parts.push({
        name: "Radiator Grille and Cooling Assembly",
        description: "Armored front grille protecting the immense cooling matrix from flying debris while allowing extreme airflow.",
        material: "darkSteel/chrome",
        function: "Thermal regulation and protection",
        assemblyOrder: 13,
        connections: ["Chassis Front", "Engine Radiator"],
        failureEffect: "Engine overheating.",
        cascadeFailures: ["Engine block warp", "Coolant boil-over"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 6, y: 2.5, z: 0}
    });

    // Hydraulic Fluid Reservoir
    const resGeo = new THREE.BoxGeometry(0.8, 1.0, 1.8);
    const reservoir = new THREE.Mesh(resGeo, plastic);
    reservoir.position.set(-1.0, 1.8, 0);
    group.add(reservoir);

    parts.push({
        name: "Hydraulic Fluid Reservoir",
        description: "Large capacity armored tank holding specialized high-pressure hydraulic fluid for the lift, tilt, and ripper actuators.",
        material: "plastic/steel",
        function: "Fluid storage",
        assemblyOrder: 14,
        connections: ["Main Pump", "Return Lines", "Filter Assembly"],
        failureEffect: "Loss of all hydraulic function.",
        cascadeFailures: ["Pump burn-out due to dry running"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -2, y: 5, z: -4}
    });

    // High-Intensity Work Lights & Beacon
    const lightGroup = new THREE.Group();
    const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);
    const beaconMat = new THREE.MeshStandardMaterial({color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 2.0});
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(-0.5, 4.8, 0);
    lightGroup.add(beacon);
    
    const ledGeo = new THREE.BoxGeometry(0.2, 0.1, 0.3);
    const ledMat = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0});
    const frontLight1 = new THREE.Mesh(ledGeo, ledMat);
    frontLight1.position.set(0.6, 4.5, 0.8);
    lightGroup.add(frontLight1);
    
    const frontLight2 = new THREE.Mesh(ledGeo, ledMat);
    frontLight2.position.set(0.6, 4.5, -0.8);
    lightGroup.add(frontLight2);

    group.add(lightGroup);

    parts.push({
        name: "High-Intensity LED Work Lights & Warning Beacon",
        description: "Ultra-bright LED arrays for night operations and a high-visibility rotating strobe for worksite safety.",
        material: "plastic/glass/LED",
        function: "Illumination and warning",
        assemblyOrder: 15,
        connections: ["Cabin Roof", "Electrical Harness"],
        failureEffect: "Reduced visibility, safety hazard during night operations.",
        cascadeFailures: ["Electrical short"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 8, z: 2}
    });

    // Exhaust Smoke Emitter (visual cue for animation)
    const smokeGroup = new THREE.Group();
    smokeGroup.position.copy(exhaust.position);
    smokeGroup.position.y += 0.8;
    for(let i=0; i<8; i++){
        const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2), new THREE.MeshStandardMaterial({color: 0x333333, transparent: true, opacity: 0.6}));
        p.position.set(0, i*0.3, 0);
        smokeGroup.add(p);
    }
    group.add(smokeGroup);

    const description = "The Modern Tracked Bulldozer (D9 Class) is a colossal marvel of heavy earthmoving engineering. Featuring individual steel track links, elevated drive sprockets for extreme durability, a massive turbocharged V8 diesel engine, and hyper-complex hydraulic systems governing a semi-U blade and multi-shank ripper. Engineered for the harshest environments on Earth, its imposing silhouette and rugged construction define ultimate industrial dominance.";
    
    const quizQuestions = [
        {
            question: "Why does this modern bulldozer utilize an elevated drive sprocket design?",
            options: [
                "To isolate the final drives from ground impacts, shock loads, and abrasive debris.",
                "To increase the top speed of the machine on highways.",
                "To make track replacement intentionally harder.",
                "For aerodynamic efficiency during transport."
            ],
            correctAnswer: 0,
            explanation: "Elevated sprockets keep the crucial final drive components away from direct ground impacts, abrasive materials, and greatly reduce the shock transferred to the powertrain."
        },
        {
            question: "What is the primary function of the multi-shank rear ripper?",
            options: [
                "To tow other broken down vehicles out of mud.",
                "To fracture heavily compacted earth, rock, or asphalt prior to pushing.",
                "To act as a heavy counterweight for the front blade only.",
                "To dispense seeds for massive-scale agriculture."
            ],
            correctAnswer: 1,
            explanation: "The heavy steel claws of the ripper use extreme hydraulic downforce to tear into hard surfaces, breaking them up so the front blade can efficiently move the material without stalling."
        },
        {
            question: "What connects the immense pushing force of the main chassis directly to the dozer blade?",
            options: [
                "The ROPS cabin.",
                "The Heavy-Duty C-Frame Push Arms.",
                "The engine exhaust.",
                "The track idlers."
            ],
            correctAnswer: 1,
            explanation: "The C-Frame push arms act as the vital structural bridge, translating the tractive effort from the chassis trunnions straight to the massive moldboard blade."
        },
        {
            question: "What component prevents the track chain from sagging and guides it over the front of the undercarriage?",
            options: [
                "Bottom Track Rollers",
                "Elevated Drive Sprocket",
                "Massive Front Track Idlers",
                "Hydraulic Cylinders"
            ],
            correctAnswer: 2,
            explanation: "Front Track Idlers maintain the proper track tension and seamlessly guide the continuous track links as they transition from the top return path down to the ground contact patch."
        },
        {
            question: "What kind of hydraulic fluid configuration do these massive machines typically employ for the blade and ripper cylinders?",
            options: [
                "Low-pressure water systems.",
                "High-pressure closed-loop systems powered by a main pump.",
                "Pneumatic air lines.",
                "Gravity-fed oil drip."
            ],
            correctAnswer: 1,
            explanation: "They rely on high-pressure hydraulic fluid driven by powerful engine-linked pumps to exert the thousands of pounds of force required to lift, tilt, and rip heavy loads."
        }
    ];

    let animState = { bladeLift: 0, ripperLift: 0, trackOffset: 0, cycle: 0 };
    
    const animate = (time, speed, meshes) => {
        // Track movement
        animState.trackOffset += speed * 2.0;
        
        leftSprocket.rotation.x = animState.trackOffset;
        rightSprocket.rotation.x = animState.trackOffset;
        leftIdler.rotation.x = animState.trackOffset;
        rightIdler.rotation.x = animState.trackOffset;
        
        rollerGroup.children.forEach(r => {
            r.rotation.x = animState.trackOffset * 3.0; // smaller rollers spin proportionally faster
        });

        // Simulate track vibration
        leftTrack.position.y = 1.2 + Math.sin(time * 25 * speed) * 0.015;
        rightTrack.position.y = 1.2 + Math.cos(time * 25 * speed) * 0.015;
        
        // Blade Hydraulics & C-Frame animation
        animState.cycle += speed * 0.5;
        const liftVal = Math.sin(animState.cycle) * 0.35; // -0.35 to 0.35
        
        bladeGroup.position.y = 1.0 + liftVal;
        pushArmsGroup.rotation.z = liftVal * 0.2; 
        
        // Complex hydraulic cylinder rod extension perfectly matching blade lift
        const liftHydExt = liftVal * 0.85;
        hydraulicGroup.children.forEach(hyd => {
            hyd.children[1].position.y = 1.8 + liftHydExt; // inner rod extends
            hyd.rotation.z = -0.4 + (liftVal * 0.12); // subtle angle adjustment as it lifts
        });
        
        // Ripper animation (out of phase with front blade for visual interest)
        const ripVal = Math.cos(animState.cycle) * 0.45; 
        ripperGroup.position.y = 1.0 + ripVal;
        ripperGroup.rotation.z = ripVal * 0.35;
        
        ripperHyd.children[1].position.y = 1.8 + (ripVal * 0.65); // ripper cylinder extension

        // Intense Engine vibration
        engineGroup.position.y = Math.sin(time * 60) * 0.008;
        
        // Exhaust smoke pulsating and rising
        smokeGroup.children.forEach((p, index) => {
            p.position.y += speed * 2.5;
            p.scale.setScalar(1.0 + p.position.y * 0.25);
            p.material.opacity = Math.max(0, 0.6 - p.position.y * 0.15);
            if (p.position.y > 4.5) {
                p.position.y = 0;
                p.scale.setScalar(1.0);
                p.material.opacity = 0.6;
            }
        });

        // Beacon rotation and pulsing
        beacon.rotation.y = time * 6 * speed;
        beaconMat.emissiveIntensity = 1.0 + Math.abs(Math.sin(time * 12)) * 2.5;
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBulldozer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
