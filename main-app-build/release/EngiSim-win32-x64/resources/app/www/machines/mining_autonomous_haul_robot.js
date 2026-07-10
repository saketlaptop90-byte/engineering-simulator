import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- MATERIALS & CUSTOM SHADERS ---
    // Emissive materials for sensors and high-tech glow
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        metalness: 0.5,
        roughness: 0.5
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff5500,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.5
    });

    const dirtyMetal = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.9,
        roughness: 0.7,
        bumpScale: 0.05
    });

    // --- HELPER FUNCTIONS ---
    function createCylinder(rT, rB, h, rS, mat) {
        const geo = new THREE.CylinderGeometry(rT, rB, h, rS);
        return new THREE.Mesh(geo, mat);
    }

    function createBox(w, h, d, mat) {
        const geo = new THREE.BoxGeometry(w, h, d);
        return new THREE.Mesh(geo, mat);
    }

    // --- 1. CHASSIS (MAIN FRAME) ---
    const chassisGroup = new THREE.Group();
    
    // Main structural rails
    const railGeo = new THREE.BoxGeometry(18, 1, 1.5);
    const leftRail = new THREE.Mesh(railGeo, darkSteel);
    leftRail.position.set(0, 2, 2.5);
    chassisGroup.add(leftRail);
    
    const rightRail = new THREE.Mesh(railGeo, darkSteel);
    rightRail.position.set(0, 2, -2.5);
    chassisGroup.add(rightRail);
    
    // Cross members
    for (let i = -7; i <= 7; i += 3.5) {
        const cross = createBox(1, 0.8, 6.5, darkSteel);
        cross.position.set(i, 2, 0);
        chassisGroup.add(cross);
    }

    // Battery pack block
    const batteryPack = createBox(6, 2, 4, dirtyMetal);
    batteryPack.position.set(0, 1.5, 0);
    chassisGroup.add(batteryPack);
    
    // Battery cooling fins
    for (let i = -2.5; i <= 2.5; i += 0.2) {
        const fin = createBox(5.8, 2.2, 0.05, aluminum);
        fin.position.set(0, 1.5, i);
        chassisGroup.add(fin);
    }

    // Control electronics unit
    const cpuBox = createBox(2.5, 1.5, 3, steel);
    cpuBox.position.set(5, 3, 0);
    chassisGroup.add(cpuBox);

    // High voltage cables
    const cableGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(3, 2, 1),
            new THREE.Vector3(4, 2.5, 1.5),
            new THREE.Vector3(5, 3, 1)
        ]), 20, 0.1, 8, false
    );
    const cableMesh = new THREE.Mesh(cableGeo, neonOrange);
    chassisGroup.add(cableMesh);

    group.add(chassisGroup);

    // --- 2. MASSIVE TIRES & HUB MOTORS ---
    const wheelMeshes = [];
    const wheelPositions = [
        { x: -6, y: 3, z: 4.5, name: "Front Left Wheel" },
        { x: -6, y: 3, z: -4.5, name: "Front Right Wheel" },
        { x: 6, y: 3, z: 4.5, name: "Rear Left Wheel" },
        { x: 6, y: 3, z: -4.5, name: "Rear Right Wheel" }
    ];

    wheelPositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        
        // Torus for tire base
        const torusGeo = new THREE.TorusGeometry(3.5, 1.5, 32, 64);
        const torus = new THREE.Mesh(torusGeo, rubber);
        wheelGroup.add(torus);
        
        // Complex Treads
        const numTreads = 80;
        const treadGeo = new THREE.BoxGeometry(3.2, 0.4, 0.8);
        for (let i = 0; i < numTreads; i++) {
            const angle = (i / numTreads) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeo, rubber);
            const r = 4.8;
            tread.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
            tread.rotation.z = angle;
            tread.rotation.y = (i % 2 === 0) ? 0.15 : -0.15; // Aggressive chevron pattern
            wheelGroup.add(tread);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry(2.5, 2.5, 2.8, 32);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        wheelGroup.add(rim);

        // Electric Hub Motor
        const motorGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.2, 32);
        motorGeo.rotateX(Math.PI / 2);
        const motor = new THREE.Mesh(motorGeo, copper);
        wheelGroup.add(motor);

        // Spokes / planetary gears visible
        for (let i = 0; i < 6; i++) {
            const gearGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
            gearGeo.rotateX(Math.PI / 2);
            const gear = new THREE.Mesh(gearGeo, chrome);
            const gAngle = (i / 6) * Math.PI * 2;
            gear.position.set(Math.cos(gAngle) * 1.5, Math.sin(gAngle) * 1.5, 0);
            wheelGroup.add(gear);
        }

        wheelGroup.position.set(pos.x, pos.y, pos.z);
        if (pos.z < 0) wheelGroup.rotation.y = Math.PI; // Flip right side wheels
        
        group.add(wheelGroup);
        wheelMeshes.push(wheelGroup);

        parts.push({
            name: pos.name,
            description: "Massive ultra-class haul truck tire with integrated electric hub motor and planetary gear reduction.",
            material: "Rubber, High-Tensile Steel, Copper",
            function: "Provides locomotion, extreme load bearing, and regenerative braking.",
            assemblyOrder: 1,
            connections: ["Chassis Suspension Hub", "Power Inverter"],
            failureEffect: "Loss of mobility or extreme power consumption.",
            cascadeFailures: ["Overheating of opposite motor", "Suspension sag"],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 1.5, y: pos.y, z: pos.z * 1.8 }
        });
    });

    // --- 3. DUMP BED (BUCKET) ---
    const bedGroup = new THREE.Group();
    
    // Extrude a complex side profile for the bed
    const bedShape = new THREE.Shape();
    bedShape.moveTo(-7, 0);
    bedShape.lineTo(8, 0);
    bedShape.lineTo(10, 4);
    bedShape.lineTo(-9, 4);
    bedShape.lineTo(-7, 0);
    
    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    
    const leftWallGeo = new THREE.ExtrudeGeometry(bedShape, extrudeSettings);
    leftWallGeo.translate(0, 0, 3.5);
    const leftWall = new THREE.Mesh(leftWallGeo, steel);
    bedGroup.add(leftWall);
    
    const rightWallGeo = new THREE.ExtrudeGeometry(bedShape, extrudeSettings);
    rightWallGeo.translate(0, 0, -4.0);
    const rightWall = new THREE.Mesh(rightWallGeo, steel);
    bedGroup.add(rightWall);
    
    // Bed floor
    const floorGeo = new THREE.BoxGeometry(15, 0.5, 7.5);
    const floor = new THREE.Mesh(floorGeo, dirtyMetal);
    floor.position.set(0.5, 0.25, 0);
    bedGroup.add(floor);
    
    // Front wall of bed
    const frontWallGeo = new THREE.BoxGeometry(0.5, 4.5, 7.5);
    const frontWall = new THREE.Mesh(frontWallGeo, steel);
    frontWall.position.set(-8, 2, 0);
    frontWall.rotation.z = -0.2; // angled
    bedGroup.add(frontWall);
    
    // Canopy/Rock guard (extends over front)
    const canopyGeo = new THREE.BoxGeometry(4, 0.5, 7.5);
    const canopy = new THREE.Mesh(canopyGeo, steel);
    canopy.position.set(-9.5, 4.2, 0);
    canopy.rotation.z = -0.1;
    bedGroup.add(canopy);

    // Ribs for structural integrity on the outside
    for (let i = -6; i <= 6; i += 3) {
        const rib = createBox(0.4, 4, 0.6, darkSteel);
        rib.position.set(i, 2, 4);
        bedGroup.add(rib);
        const rib2 = createBox(0.4, 4, 0.6, darkSteel);
        rib2.position.set(i, 2, -4);
        bedGroup.add(rib2);
    }

    // Pivot point for bed
    bedGroup.position.set(5, 5, 0); // Moved to pivot location
    // To rotate correctly, geometry needs to be offset
    leftWall.position.set(-5, -2.5, 0);
    rightWall.position.set(-5, -2.5, 0);
    floor.position.set(-4.5, -2.25, 0);
    frontWall.position.set(-13, -0.5, 0);
    canopy.position.set(-14.5, 1.7, 0);
    
    // Re-adjusting ribs to match offset
    for (let i = 0; i < bedGroup.children.length; i++) {
        const child = bedGroup.children[i];
        if (child.geometry && child.geometry.type === 'BoxGeometry' && child.scale.y === 1 && child.position.y === 2) {
             child.position.x -= 5;
             child.position.y -= 2.5;
        }
    }

    group.add(bedGroup);
    
    parts.push({
        name: "Articulated Dump Bed",
        description: "Heavy-duty steel composite dump bed with reinforced ribs and over-cab rock guard.",
        material: "Hardox Wear Plate Steel",
        function: "Carries massive payloads of rock and ore. Tilts via hydraulic actuation to discharge cargo.",
        assemblyOrder: 5,
        connections: ["Chassis Rear Pivot", "Hydraulic Lift Cylinders"],
        failureEffect: "Inability to dump cargo.",
        cascadeFailures: ["Hydraulic blowout if overstressed", "Chassis warping"],
        originalPosition: { x: 5, y: 5, z: 0 },
        explodedPosition: { x: 5, y: 15, z: 0 }
    });


    // --- 4. HYDRAULIC LIFT SYSTEM ---
    const leftHydraulic = new THREE.Group();
    const rightHydraulic = new THREE.Group();
    const pistons = []; // To animate

    function createHydraulicCylinder(groupObj) {
        // Outer tube
        const tube = createCylinder(0.4, 0.4, 4, 16, darkSteel);
        tube.position.set(0, 2, 0);
        groupObj.add(tube);
        
        // Inner piston
        const piston = createCylinder(0.25, 0.25, 4, 16, chrome);
        piston.position.set(0, 4, 0);
        groupObj.add(piston);
        return piston;
    }

    leftHydraulic.position.set(0, 2, 2.5);
    rightHydraulic.position.set(0, 2, -2.5);
    
    const p1 = createHydraulicCylinder(leftHydraulic);
    const p2 = createHydraulicCylinder(rightHydraulic);
    pistons.push(p1, p2);

    group.add(leftHydraulic);
    group.add(rightHydraulic);

    parts.push({
        name: "Twin Hydraulic Lift Cylinders",
        description: "Massive telescoping hydraulic actuators capable of lifting hundreds of tons.",
        material: "Chrome-plated Steel, Hydraulic Fluid",
        function: "Extends to tilt the dump bed.",
        assemblyOrder: 4,
        connections: ["Chassis Mid-mount", "Bed Underside Mounts"],
        failureEffect: "Bed stuck in current position.",
        cascadeFailures: ["Pump overheating", "Fluid leak leading to environmental hazard"],
        originalPosition: { x: 0, y: 2, z: 2.5 },
        explodedPosition: { x: 0, y: 8, z: 6 }
    });

    // --- 5. AUTONOMOUS NAVIGATION & SENSOR ARRAY ---
    const sensorMast = new THREE.Group();
    sensorMast.position.set(-8, 5, 0);

    // Mast pole
    const pole = createCylinder(0.2, 0.2, 3, 16, darkSteel);
    pole.position.set(0, 1.5, 0);
    sensorMast.add(pole);

    // LiDAR Unit
    const lidarGroup = new THREE.Group();
    lidarGroup.position.set(0, 3, 0);
    
    const lidarBase = createCylinder(0.5, 0.5, 0.4, 16, steel);
    lidarGroup.add(lidarBase);
    
    const lidarSpinner = createCylinder(0.4, 0.4, 0.6, 16, plastic);
    lidarSpinner.position.set(0, 0.5, 0);
    lidarGroup.add(lidarSpinner);
    
    // Glowing laser aperture
    const aperture = createBox(0.45, 0.3, 0.45, neonBlue);
    aperture.position.set(0, 0.5, 0.2);
    lidarGroup.add(aperture);
    
    sensorMast.add(lidarGroup);

    // Side radar arrays
    const radarGeo = new THREE.BoxGeometry(0.8, 1, 0.2);
    const radarL = new THREE.Mesh(radarGeo, plastic);
    radarL.position.set(0, 2, 0.8);
    radarL.rotation.y = Math.PI / 4;
    sensorMast.add(radarL);

    const radarR = new THREE.Mesh(radarGeo, plastic);
    radarR.position.set(0, 2, -0.8);
    radarR.rotation.y = -Math.PI / 4;
    sensorMast.add(radarR);
    
    // Antennas
    for (let i = -0.3; i <= 0.3; i+= 0.6) {
        const ant = createCylinder(0.02, 0.05, 1.5, 8, darkSteel);
        ant.position.set(i, 3.8, -0.3);
        sensorMast.add(ant);
    }

    group.add(sensorMast);

    parts.push({
        name: "LiDAR & Radar Sensor Suite",
        description: "High-definition 360-degree LiDAR scanner with phased-array radar for object detection in extreme dust and weather.",
        material: "Polycarbonate, Silicon, Gold, Aluminum",
        function: "Maps environment, avoids obstacles, and interfaces with mine management system.",
        assemblyOrder: 6,
        connections: ["Sensor Mast", "Autonomous Compute Node"],
        failureEffect: "Robot halts automatically due to loss of spatial awareness.",
        cascadeFailures: ["Navigation errors", "Fleet collision hazard"],
        originalPosition: { x: -8, y: 5, z: 0 },
        explodedPosition: { x: -12, y: 10, z: 0 }
    });

    // --- 6. FRONT COMMAND/COMPUTE NODE (NO HUMAN CABIN) ---
    const computeNode = new THREE.Group();
    computeNode.position.set(-7.5, 3.5, 0);

    const nodeBodyGeo = new THREE.BoxGeometry(3, 2.5, 4);
    const nodeBody = new THREE.Mesh(nodeBodyGeo, steel);
    computeNode.add(nodeBody);

    // Glowing cooling vents
    for(let i = -1.5; i <= 1.5; i+=0.5) {
        const vent = createBox(0.2, 1.5, 0.1, neonBlue);
        vent.position.set(-1.51, 0, i);
        computeNode.add(vent);
    }

    // Status display screen
    const screenGeo = new THREE.BoxGeometry(0.1, 1, 2);
    const screen = new THREE.Mesh(screenGeo, neonBlue);
    screen.position.set(-1.52, 0.5, 0);
    computeNode.add(screen);
    
    group.add(computeNode);

    parts.push({
        name: "AI Edge Compute Node",
        description: "Liquid-cooled supercomputer housing the neural network models for autonomous driving.",
        material: "Aluminum chassis, Silicon carbide semiconductors",
        function: "Processes sensor data in real-time, executing path planning and machine control.",
        assemblyOrder: 3,
        connections: ["Power Bus", "Sensor Suite", "Drive By Wire System"],
        failureEffect: "Total loss of machine autonomy.",
        cascadeFailures: ["Failsafe braking engaged", "Data loss"],
        originalPosition: { x: -7.5, y: 3.5, z: 0 },
        explodedPosition: { x: -15, y: 3.5, z: 0 }
    });

    // --- 7. EXHAUST / COOLING TOWERS ---
    const coolerGroup = new THREE.Group();
    coolerGroup.position.set(-4, 3, 0);
    
    const coolerBase = createBox(2, 3, 3, darkSteel);
    coolerGroup.add(coolerBase);
    
    // Massive cooling fans
    const fanGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
    const fan1 = new THREE.Mesh(fanGeo, steel);
    fan1.position.set(1, 0.5, 1.51);
    coolerGroup.add(fan1);
    
    const fan2 = new THREE.Mesh(fanGeo, steel);
    fan2.position.set(1, 0.5, -1.51);
    coolerGroup.add(fan2);
    
    const fanBladeGeo = new THREE.BoxGeometry(1.5, 0.2, 0.05);
    const blades = [];
    for (let j=0; j<2; j++) {
        const zPos = j === 0 ? 1.51 : -1.51;
        const bladeGroup = new THREE.Group();
        for(let i=0; i<3; i++) {
            const blade = new THREE.Mesh(fanBladeGeo, plastic);
            blade.rotation.z = (i/3) * Math.PI * 2;
            bladeGroup.add(blade);
        }
        bladeGroup.position.set(1, 0.5, zPos);
        coolerGroup.add(bladeGroup);
        blades.push(bladeGroup);
    }
    
    group.add(coolerGroup);

    parts.push({
        name: "Active Thermal Management System",
        description: "High-RPM industrial fans pulling air over liquid-to-air heat exchangers.",
        material: "Aluminum fins, Carbon fiber fan blades",
        function: "Dissipates extreme heat generated by batteries and electric wheel motors.",
        assemblyOrder: 2,
        connections: ["Coolant Lines", "Chassis Mainframe"],
        failureEffect: "Thermal throttling, reduced machine speed.",
        cascadeFailures: ["Battery thermal runaway", "Motor stator melting"],
        originalPosition: { x: -4, y: 3, z: 0 },
        explodedPosition: { x: -4, y: 10, z: 5 }
    });

    // --- 8. SUSPENSION STRUTS ---
    const struts = [];
    wheelPositions.forEach(pos => {
        const strut = createCylinder(0.3, 0.3, 2, 16, chrome);
        strut.position.set(pos.x, pos.y + 1, pos.z * 0.7); // Mounted inwards
        strut.rotation.x = pos.z > 0 ? Math.PI / 8 : -Math.PI / 8;
        group.add(strut);
        
        const spring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 16), neonOrange);
        spring.position.copy(strut.position);
        spring.rotation.x = Math.PI / 2;
        group.add(spring);
    });

    parts.push({
        name: "Hydropneumatic Suspension Struts",
        description: "Nitrogen-charged shock absorbers wrapped in heavy-duty coil springs.",
        material: "Forged Steel, Nitrogen Gas, Synthetic Oil",
        function: "Absorbs extreme impacts from loading and uneven haul roads.",
        assemblyOrder: 1,
        connections: ["Wheel Hubs", "Chassis Rails"],
        failureEffect: "Severe vibration, chassis stress.",
        cascadeFailures: ["Sensor misalignment due to vibration", "Frame cracking"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 8 }
    });


    // --- DESCRIPTION ---
    const description = "The Autonomous Mining Haul Robot represents the pinnacle of robotic heavy industry. Void of a human cabin, its design is purely optimized for raw material transport, utilizing massive electric hub motors, advanced AI edge computing, and a reinforced articulating dump bed to move hundreds of tons of ore flawlessly in extreme environments.";

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "Why does the Autonomous Haul Robot lack a traditional cabin?",
            options: [
                "To reduce manufacturing costs.",
                "It is fully autonomous and optimized purely for structural integrity and payload.",
                "The operators control it via virtual reality from inside the bucket.",
                "It requires a cabin but it is hidden inside the chassis."
            ],
            correctAnswer: 1,
            explanation: "As a fully autonomous vehicle, removing the cabin reduces weight, eliminates human risk in hazardous zones, and allows for a more robust structural design."
        },
        {
            question: "What powers the locomotion of this machine?",
            options: [
                "A massive V24 diesel engine.",
                "Nuclear fusion reactor.",
                "Electric hub motors located within each wheel.",
                "Hydraulic drive pumps."
            ],
            correctAnswer: 2,
            explanation: "The vehicle uses electric hub motors in each wheel, providing massive torque, individual wheel control, and regenerative braking capabilities."
        },
        {
            question: "What is the primary function of the LiDAR system on the sensor mast?",
            options: [
                "To measure the volume of ore in the bed.",
                "To scan the environment in 3D for obstacle avoidance and path planning.",
                "To communicate with satellites.",
                "To vaporize rocks in its path."
            ],
            correctAnswer: 1,
            explanation: "LiDAR (Light Detection and Ranging) spins to create high-definition 3D maps of the surroundings, essential for autonomous navigation."
        },
        {
            question: "How does the machine manage the massive heat generated by its batteries and motors?",
            options: [
                "It operates only at night.",
                "It relies purely on passive radiating heat sinks.",
                "An Active Thermal Management System with high-RPM fans and heat exchangers.",
                "It periodically sprays itself with water."
            ],
            correctAnswer: 2,
            explanation: "An active cooling tower pulls air across liquid-to-air heat exchangers to dissipate the extreme thermal loads from heavy electric hauling."
        },
        {
            question: "What happens if the hydraulic lift cylinders fail?",
            options: [
                "The robot can no longer steer.",
                "The robot will explode.",
                "The dump bed cannot tilt to discharge its cargo.",
                "The suspension will collapse."
            ],
            correctAnswer: 2,
            explanation: "The hydraulic cylinders specifically push the dump bed upwards on its pivot. Failure means the payload is trapped in the bed."
        }
    ];

    // --- ANIMATION LOGIC ---
    // Variables for animation
    let dumpCycle = 0;
    
    function animate(time, speed, meshes) {
        const delta = time * speed;
        
        // 1. Rotate Wheels based on speed (simulating driving forward)
        // If speed is 0, we can still show idling animations, but wheel rotation stops.
        const wheelRotSpeed = speed * 0.05;
        wheelMeshes.forEach(w => {
            w.rotation.z -= wheelRotSpeed;
        });

        // 2. Spin LiDAR
        lidarSpinner.rotation.y = time * 5;

        // 3. Spin Cooling Fans
        blades.forEach(blade => {
            blade.rotation.z = time * 8;
        });

        // 4. Hydraulic Bed Tipping Animation
        // Sine wave to simulate loading -> driving -> dumping -> returning cycle
        // Modulate with time and speed
        dumpCycle = (time * 0.5) % (Math.PI * 2); 
        
        // Bed tilt angle (0 to approx 0.8 radians)
        // Use a smoothstep or max to make it stay flat for a while, then tip
        let tilt = Math.max(0, Math.sin(dumpCycle)); 
        // Square it for a slightly snappier tip
        tilt = tilt * tilt;
        
        const maxTilt = 0.9; // radians
        bedGroup.rotation.z = tilt * maxTilt;

        // Synchronize hydraulic cylinders with bed tilt
        // Calculate distance from cylinder base to cylinder mount point on bed
        // Base: (0, 2, 2.5) relative to chassis
        // Mount point on bed: approx (-5, 0, 0) relative to bed pivot (5,5,0)
        // We will just do a simple linear extension based on tilt angle for performance
        const extension = tilt * 4; // Max extension of 4 units
        
        pistons.forEach(p => {
            p.position.y = 4 + extension;
        });
        
        // Adjust hydraulic group angle to aim at bed
        // Base is at x=0, y=2. Pivot is x=5, y=5. Mount is moving.
        // Simple approximation:
        const angleAdjust = tilt * 0.4;
        leftHydraulic.rotation.z = -angleAdjust;
        rightHydraulic.rotation.z = -angleAdjust;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
