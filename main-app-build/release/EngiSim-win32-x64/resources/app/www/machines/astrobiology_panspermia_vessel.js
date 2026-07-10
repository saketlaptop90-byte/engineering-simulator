import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const emissiveBlue = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });
    
    const emissiveGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9
    });

    const emissiveOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 4.0
    });

    const ablativeMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.2,
        bumpScale: 0.5
    });

    const sailMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.8,
        roughness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        emissive: 0x111122,
        emissiveIntensity: 0.5
    });

    // 1. Ablative Heat Shield
    const heatShieldPoints = [];
    for ( let i = 0; i <= 20; i ++ ) {
        heatShieldPoints.push( new THREE.Vector2( Math.sin( i * 0.05 ) * 20, - ( i * 0.2 ) * ( i * 0.2 ) + 5 ) );
    }
    const heatShieldGeo = new THREE.LatheGeometry( heatShieldPoints, 128 );
    const heatShield = new THREE.Mesh( heatShieldGeo, ablativeMaterial );
    heatShield.rotation.x = Math.PI / 2;
    heatShield.position.z = 40;
    group.add(heatShield);
    meshes.heatShield = heatShield;

    parts.push({
        name: "Ablative Heat Shield",
        description: "Massive forward shield designed to protect the vessel from micrometeorites and intense heat during interstellar travel and planetary atmospheric entry.",
        material: "Ablative Carbon-Carbon",
        function: "Thermal and Kinetic Protection",
        assemblyOrder: 1,
        connections: ["Central Spine", "Forward Sensor Array"],
        failureEffect: "Vessel incineration upon atmospheric entry.",
        cascadeFailures: ["Biological Payload Destruction", "Structural Integrity Loss"],
        originalPosition: { x: 0, y: 0, z: 40 },
        explodedPosition: { x: 0, y: 0, z: 60 }
    });

    // Heat shield structural supports
    const shieldSupportGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const shieldSupports = new THREE.Group();
    for(let i=0; i<8; i++) {
        const support = new THREE.Mesh(shieldSupportGeo, darkSteel);
        const angle = (i / 8) * Math.PI * 2;
        support.position.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 35);
        support.rotation.x = Math.PI / 2;
        support.rotation.z = angle;
        shieldSupports.add(support);
    }
    group.add(shieldSupports);
    meshes.shieldSupports = shieldSupports;

    parts.push({
        name: "Shield Struts",
        description: "Heavy-duty titanium struts absorbing kinetic impacts from the heat shield.",
        material: "Dark Steel",
        function: "Structural Support",
        assemblyOrder: 2,
        connections: ["Ablative Heat Shield", "Central Spine"],
        failureEffect: "Heat shield detaches under load.",
        cascadeFailures: ["Ablative Heat Shield"],
        originalPosition: { x: 0, y: 0, z: 35 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // 2. Central Spine
    const spineGeo = new THREE.CylinderGeometry( 3, 3, 70, 32 );
    const spine = new THREE.Mesh( spineGeo, steel );
    spine.rotation.x = Math.PI / 2;
    spine.position.z = 0;
    group.add(spine);
    meshes.spine = spine;

    parts.push({
        name: "Central Spine",
        description: "The main structural core of the vessel, housing power conduits and fluid transfer lines.",
        material: "Steel",
        function: "Primary Chassis",
        assemblyOrder: 3,
        connections: ["Heat Shield", "Habitat Ring", "Biological Pods", "Thruster Array"],
        failureEffect: "Catastrophic vessel fragmentation.",
        cascadeFailures: ["All systems"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // Spine Ribs
    const spineRibs = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const ribGeo = new THREE.TorusGeometry(3.5, 0.5, 16, 64);
        const rib = new THREE.Mesh(ribGeo, chrome);
        rib.position.z = -30 + i * 4.5;
        spineRibs.add(rib);
    }
    group.add(spineRibs);
    meshes.spineRibs = spineRibs;

    // 3. Biological Storage Pods
    const podGroup = new THREE.Group();
    const podGeo = new THREE.CapsuleGeometry(2, 6, 16, 32);
    const coreGeo = new THREE.CapsuleGeometry(1.5, 5, 16, 32);
    const podCount = 12;

    for (let i = 0; i < podCount; i++) {
        const angle = (i / podCount) * Math.PI * 2;
        const radius = 8;
        
        const singlePod = new THREE.Group();
        
        const outerShell = new THREE.Mesh(podGeo, glass);
        const innerCore = new THREE.Mesh(coreGeo, emissiveGreen);
        
        // Connectors to spine
        const connectorGeo = new THREE.CylinderGeometry(0.3, 0.3, radius - 3, 16);
        const connector = new THREE.Mesh(connectorGeo, copper);
        connector.rotation.x = Math.PI / 2;
        connector.position.z = -(radius - 3) / 2;
        
        singlePod.add(outerShell);
        singlePod.add(innerCore);
        singlePod.add(connector);
        
        singlePod.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (i % 2 === 0) ? 10 : -10);
        
        // Orient pod to face outwards
        singlePod.lookAt(new THREE.Vector3(0, 0, singlePod.position.z));
        singlePod.rotateX(Math.PI / 2);

        podGroup.add(singlePod);
    }
    group.add(podGroup);
    meshes.podGroup = podGroup;

    parts.push({
        name: "Biological Incubation Pods",
        description: "Cryo-stasis capsules holding the genetic seeds of life, bathed in nutrient-rich amniotic fluid and energized by vital radiation.",
        material: "Glass, Emissive Organics",
        function: "Panspermia Payload Storage",
        assemblyOrder: 4,
        connections: ["Central Spine", "Nutrient Lines"],
        failureEffect: "Loss of biological viability.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 }
    });

    // 4. Habitat Ring (Rotating)
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry( 20, 2, 32, 128 );
    const ringMesh = new THREE.Mesh( ringGeo, aluminum );
    ringGroup.add(ringMesh);

    // Ring spokes
    for (let i = 0; i < 4; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, 17, 16);
        const spoke = new THREE.Mesh(spokeGeo, steel);
        const angle = (i / 4) * Math.PI * 2;
        spoke.position.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 0);
        spoke.rotation.z = angle + Math.PI / 2;
        ringGroup.add(spoke);
    }
    
    // Ring windows/lights
    for (let i = 0; i < 32; i++) {
        const windowGeo = new THREE.BoxGeometry(1, 1, 4.1);
        const window = new THREE.Mesh(windowGeo, emissiveBlue);
        const angle = (i / 32) * Math.PI * 2;
        window.position.set(Math.cos(angle) * 20, Math.sin(angle) * 20, 0);
        window.rotation.z = angle;
        ringGroup.add(window);
    }

    ringGroup.position.z = 20;
    group.add(ringGroup);
    meshes.ringGroup = ringGroup;

    parts.push({
        name: "Centrifugal Habitat Ring",
        description: "Provides artificial gravity for the caretaker AI cores and biomechanical maintenance drones.",
        material: "Aluminum",
        function: "Crew/Drone Habitation",
        assemblyOrder: 5,
        connections: ["Central Spine"],
        failureEffect: "Loss of artificial gravity, disrupting maintenance operations.",
        cascadeFailures: ["Drone Malfunction", "Pod Degradation"],
        originalPosition: { x: 0, y: 0, z: 20 },
        explodedPosition: { x: 0, y: -40, z: 20 }
    });

    // 5. Solar Sails
    const sailGroup = new THREE.Group();
    const sailShape = new THREE.Shape();
    sailShape.moveTo( 0, 0 );
    sailShape.lineTo( 40, 60 );
    sailShape.lineTo( 40, 100 );
    sailShape.lineTo( 0, 80 );
    sailShape.lineTo( -40, 100 );
    sailShape.lineTo( -40, 60 );
    sailShape.lineTo( 0, 0 );

    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const sailExtrudeGeo = new THREE.ExtrudeGeometry( sailShape, extrudeSettings );
    
    for (let i = 0; i < 4; i++) {
        const sail = new THREE.Mesh( sailExtrudeGeo, sailMaterial );
        const angle = (i / 4) * Math.PI * 2;
        sail.rotation.z = angle;
        sail.position.z = -10;
        
        // Sail deployment masts
        const mastGeo = new THREE.CylinderGeometry(0.8, 0.4, 100, 16);
        const mast = new THREE.Mesh(mastGeo, darkSteel);
        mast.rotation.z = angle;
        mast.position.set(Math.cos(angle + Math.PI/2) * 50, Math.sin(angle + Math.PI/2) * 50, -10);
        
        sailGroup.add(sail);
        sailGroup.add(mast);
    }
    group.add(sailGroup);
    meshes.sailGroup = sailGroup;

    parts.push({
        name: "Photon Solar Sails",
        description: "Ultra-thin meta-material sails that harness stellar radiation pressure and laser propulsion for sub-light travel.",
        material: "Meta-material",
        function: "Primary Propulsion",
        assemblyOrder: 6,
        connections: ["Central Spine", "Deployment Masts"],
        failureEffect: "Loss of primary propulsion.",
        cascadeFailures: ["Missed Target Trajectory"],
        originalPosition: { x: 0, y: 0, z: -10 },
        explodedPosition: { x: 0, y: 60, z: -10 }
    });

    // 6. Main Thruster Array
    const engineGroup = new THREE.Group();
    const engineBlockGeo = new THREE.CylinderGeometry(8, 12, 15, 32);
    const engineBlock = new THREE.Mesh(engineBlockGeo, darkSteel);
    engineBlock.rotation.x = Math.PI / 2;
    engineBlock.position.z = -42.5;
    engineGroup.add(engineBlock);

    parts.push({
        name: "Antimatter Engine Block",
        description: "Housing for the catalytic antimatter reactions used for course corrections and deceleration.",
        material: "Dark Steel",
        function: "Reaction Propulsion",
        assemblyOrder: 7,
        connections: ["Central Spine", "Thruster Nozzles"],
        failureEffect: "Inability to decelerate at target star system.",
        cascadeFailures: ["Overshoot Target"],
        originalPosition: { x: 0, y: 0, z: -42.5 },
        explodedPosition: { x: 0, y: 0, z: -70 }
    });

    const thrusterNozzleGeo = new THREE.CylinderGeometry(2, 4, 10, 32, 1, true);
    const thrusterCoreGeo = new THREE.CylinderGeometry(1.5, 3, 9, 32);
    
    for (let i = 0; i < 5; i++) {
        const nozGroup = new THREE.Group();
        
        const nozzle = new THREE.Mesh(thrusterNozzleGeo, chrome);
        const core = new THREE.Mesh(thrusterCoreGeo, emissiveOrange);
        
        nozGroup.add(nozzle);
        nozGroup.add(core);
        nozGroup.rotation.x = Math.PI / 2;

        if (i === 0) {
            nozGroup.position.set(0, 0, -55);
        } else {
            const angle = (i / 4) * Math.PI * 2;
            nozGroup.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, -53);
        }
        engineGroup.add(nozGroup);
    }
    group.add(engineGroup);
    meshes.engineGroup = engineGroup;

    parts.push({
        name: "Magnetic Confinement Nozzles",
        description: "Directs the highly energetic plasma exhaust, utilizing magnetic fields to protect the physical nozzle.",
        material: "Chrome, Emissive Plasma",
        function: "Thrust Vectoring",
        assemblyOrder: 8,
        connections: ["Antimatter Engine Block"],
        failureEffect: "Engine melting and catastrophic explosion.",
        cascadeFailures: ["Vessel Destruction"],
        originalPosition: { x: 0, y: 0, z: -55 },
        explodedPosition: { x: 0, y: -30, z: -80 }
    });

    // 7. Coolant Piping & Hydraulics
    const pipePoints1 = [];
    for (let i = 0; i <= 20; i++) {
        pipePoints1.push(new THREE.Vector3(3.5, 0, -40 + i * 4));
    }
    const pipePath1 = new THREE.CatmullRomCurve3(pipePoints1);
    const pipeGeo1 = new THREE.TubeGeometry(pipePath1, 64, 0.4, 16, false);
    
    const pipesGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const pipe = new THREE.Mesh(pipeGeo1, copper);
        const angle = (i / 6) * Math.PI * 2;
        pipe.position.set(0,0,0);
        pipe.rotation.z = angle;
        pipesGroup.add(pipe);
    }
    group.add(pipesGroup);
    meshes.pipesGroup = pipesGroup;

    parts.push({
        name: "Liquid Helium Coolant Lines",
        description: "High-pressure pipes circulating liquid helium to prevent the antimatter containment from failing.",
        material: "Copper",
        function: "Thermal Management",
        assemblyOrder: 9,
        connections: ["Engine Block", "Central Spine", "Heat Shield"],
        failureEffect: "Containment failure.",
        cascadeFailures: ["Engine Overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 20, z: 0 }
    });

    // 8. Communications Dish
    const dishGeo = new THREE.LatheGeometry( heatShieldPoints.map(p => new THREE.Vector2(p.x * 0.4, p.y * 0.4)), 64 );
    const dish = new THREE.Mesh(dishGeo, aluminum);
    dish.rotation.x = -Math.PI / 2;
    dish.position.set(0, 15, 30);
    
    const dishAntennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const dishAntenna = new THREE.Mesh(dishAntennaGeo, chrome);
    dishAntenna.position.set(0, 15, 34);
    dishAntenna.rotation.x = Math.PI / 2;

    const commsGroup = new THREE.Group();
    commsGroup.add(dish);
    commsGroup.add(dishAntenna);
    group.add(commsGroup);
    meshes.commsGroup = commsGroup;

    parts.push({
        name: "Subspace Comm Array",
        description: "High-gain quantum entanglement antenna for transmitting telemetry back to the origin world.",
        material: "Aluminum, Chrome",
        function: "Long-Range Telemetry",
        assemblyOrder: 10,
        connections: ["Central Spine"],
        failureEffect: "Loss of contact with origin.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 30 },
        explodedPosition: { x: 0, y: 40, z: 30 }
    });

    // 9. Sensor Pallets
    const sensorGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const sensorGeo = new THREE.BoxGeometry(2, 3, 4);
        const sensor = new THREE.Mesh(sensorGeo, darkSteel);
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        sensor.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 38);
        
        const lensGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
        const lens = new THREE.Mesh(lensGeo, emissiveBlue);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 39.5);
        
        sensorGroup.add(sensor);
        sensorGroup.add(lens);
    }
    group.add(sensorGroup);
    meshes.sensorGroup = sensorGroup;

    parts.push({
        name: "Spectroscopic Sensor Pallets",
        description: "Optical and non-optical sensors used to analyze target planets for life-sustaining atmospheric compositions.",
        material: "Dark Steel, Glass",
        function: "Target Acquisition",
        assemblyOrder: 11,
        connections: ["Central Spine", "Heat Shield Supports"],
        failureEffect: "Inability to select a viable host planet.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 38 },
        explodedPosition: { x: -20, y: -20, z: 50 }
    });

    // 10. Navigational Thrusters (RCS)
    const rcsGroup = new THREE.Group();
    for (let i=0; i<4; i++) {
        const rcsBlockGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const rcsBlock = new THREE.Mesh(rcsBlockGeo, steel);
        const angle = (i/4)*Math.PI*2;
        rcsBlock.position.set(Math.cos(angle)*3.5, Math.sin(angle)*3.5, 25);
        
        const rcsNozzleGeo = new THREE.CylinderGeometry(0.3, 0.6, 1, 16);
        const rcsNozzle = new THREE.Mesh(rcsNozzleGeo, chrome);
        rcsNozzle.rotation.x = Math.PI/2;
        rcsNozzle.position.set(Math.cos(angle)*4, Math.sin(angle)*4, 25);
        rcsNozzle.lookAt(new THREE.Vector3(Math.cos(angle)*10, Math.sin(angle)*10, 25));
        rcsNozzle.rotateX(Math.PI/2);
        
        rcsGroup.add(rcsBlock);
        rcsGroup.add(rcsNozzle);
    }
    group.add(rcsGroup);
    meshes.rcsGroup = rcsGroup;

    parts.push({
        name: "RCS Thruster Blocks",
        description: "Reaction control system for fine-tuning orientation and attitude adjustments.",
        material: "Steel, Chrome",
        function: "Attitude Control",
        assemblyOrder: 12,
        connections: ["Central Spine"],
        failureEffect: "Inability to orient vessel for sail deployment or engine burns.",
        cascadeFailures: ["Off-course Trajectory"],
        originalPosition: { x: 0, y: 0, z: 25 },
        explodedPosition: { x: 30, y: 0, z: 25 }
    });

    // 11. Deflector Array
    const deflectorGeo = new THREE.ConeGeometry(5, 15, 32);
    const deflector = new THREE.Mesh(deflectorGeo, tinted);
    deflector.rotation.x = -Math.PI / 2;
    deflector.position.set(0, 0, 48);
    group.add(deflector);
    meshes.deflector = deflector;

    parts.push({
        name: "Forward Magnetic Deflector",
        description: "Projects a powerful magnetic bubble ahead of the ship to deflect ionized interstellar gas.",
        material: "Tinted Glass (Emitter)",
        function: "Interstellar Shielding",
        assemblyOrder: 13,
        connections: ["Ablative Heat Shield"],
        failureEffect: "Hull erosion from interstellar medium.",
        cascadeFailures: ["Sensor Degradation"],
        originalPosition: { x: 0, y: 0, z: 48 },
        explodedPosition: { x: 0, y: 0, z: 80 }
    });

    // 12. Energy Storage Banks
    const batteryGroup = new THREE.Group();
    for (let i=0; i<8; i++) {
        const batteryGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
        const battery = new THREE.Mesh(batteryGeo, plastic);
        const angle = (i/8)*Math.PI*2 + Math.PI/8;
        battery.position.set(Math.cos(angle)*4.5, Math.sin(angle)*4.5, -25);
        battery.rotation.x = Math.PI / 2;
        batteryGroup.add(battery);
    }
    group.add(batteryGroup);
    meshes.batteryGroup = batteryGroup;

    parts.push({
        name: "Superconducting Energy Banks",
        description: "Stores immense electrical power for the magnetic nozzles and deflectors.",
        material: "Plastic/Ceramic Composite",
        function: "Power Storage",
        assemblyOrder: 14,
        connections: ["Central Spine", "Coolant Piping"],
        failureEffect: "Loss of magnetic fields.",
        cascadeFailures: ["Deflector Array", "Magnetic Confinement Nozzles"],
        originalPosition: { x: 0, y: 0, z: -25 },
        explodedPosition: { x: -25, y: -25, z: -25 }
    });

    // 13. AI Caretaker Core
    const aiCoreGeo = new THREE.IcosahedronGeometry(2, 2);
    const aiCore = new THREE.Mesh(aiCoreGeo, emissiveBlue);
    aiCore.position.set(0, 0, 15);
    group.add(aiCore);
    meshes.aiCore = aiCore;
    
    // AI core protective cage
    const cageGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const cageMaterial = new THREE.MeshStandardMaterial({color: 0x555555, wireframe: true, transparent: true, opacity: 0.5});
    const cage = new THREE.Mesh(cageGeo, cageMaterial);
    cage.position.set(0, 0, 15);
    group.add(cage);
    meshes.aiCage = cage;

    parts.push({
        name: "Caretaker AI Core",
        description: "The quantum computer overseeing the millennia-long journey, monitoring pod viability and navigating hazards.",
        material: "Quantum Crystalline Matrix",
        function: "Vessel Command",
        assemblyOrder: 15,
        connections: ["Central Spine", "Sensor Pallets", "Subspace Comm Array"],
        failureEffect: "Ship becomes a derelict ghost ship.",
        cascadeFailures: ["All systems unmonitored"],
        originalPosition: { x: 0, y: 0, z: 15 },
        explodedPosition: { x: 0, y: 20, z: 15 }
    });

    // 14. Pod Deployment Rails
    const railGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const railGeo = new THREE.BoxGeometry(0.2, 0.2, 20);
        const rail = new THREE.Mesh(railGeo, steel);
        const angle = (i/12)*Math.PI*2;
        rail.position.set(Math.cos(angle)*7, Math.sin(angle)*7, 0);
        railGroup.add(rail);
    }
    group.add(railGroup);
    meshes.railGroup = railGroup;

    parts.push({
        name: "Pod Deployment Rails",
        description: "Electromagnetic catapult rails to launch the biological pods into the atmosphere of a target world.",
        material: "Steel",
        function: "Payload Delivery",
        assemblyOrder: 16,
        connections: ["Central Spine", "Biological Incubation Pods"],
        failureEffect: "Inability to deploy seeds of life.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 30, z: 0 }
    });

    // 15. Aft Stabilizer Fins
    const finGroup = new THREE.Group();
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(20, -10);
    finShape.lineTo(20, -20);
    finShape.lineTo(0, -15);
    finShape.lineTo(0, 0);
    const finExtrudeGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    
    for(let i=0; i<3; i++) {
        const fin = new THREE.Mesh(finExtrudeGeo, aluminum);
        const angle = (i/3)*Math.PI*2;
        fin.position.z = -35;
        fin.rotation.z = angle;
        
        // Pivot to stick out
        const finPivot = new THREE.Group();
        finPivot.add(fin);
        finPivot.rotation.z = angle;
        finGroup.add(finPivot);
    }
    group.add(finGroup);
    meshes.finGroup = finGroup;

    parts.push({
        name: "Aft Stabilizer Fins",
        description: "Aerodynamic surfaces used exclusively during atmospheric entry or skimming maneuvers to shed velocity.",
        material: "Aluminum",
        function: "Aerobraking Stabilization",
        assemblyOrder: 17,
        connections: ["Antimatter Engine Block"],
        failureEffect: "Uncontrolled tumbling during aerobraking.",
        cascadeFailures: ["Structural Integrity Loss"],
        originalPosition: { x: 0, y: 0, z: -35 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });

    const description = "The 'Panspermia Vessel' is an ultra-massive, hyper-advanced interstellar seed ship. Designed to travel across the galaxy for thousands of years, it carries biological payloads in cryo-stasis, protected by a massive ablative heat shield and magnetic deflectors. Powered by antimatter engines and propelled by immense photon solar sails, its goal is to seed barren, habitable worlds with life. Featuring an intricate array of thermal management pipes, a rotating centrifugal habitat ring, and a central quantum AI caretaker core.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Ablative Heat Shield?",
            options: ["Generating thrust", "Protecting from micrometeorites and heat", "Storing biological samples", "Housing the AI core"],
            correctAnswer: 1,
            explanation: "The Ablative Heat Shield is designed to absorb kinetic impacts and protect the ship from intense heat during interstellar travel and atmospheric entry."
        },
        {
            question: "How does the vessel primarily propel itself across interstellar distances?",
            options: ["Solid Rocket Boosters", "Photon Solar Sails and Antimatter Engines", "Warp Drive", "Chemical Combustion"],
            correctAnswer: 1,
            explanation: "The ship uses massive Photon Solar Sails riding on radiation pressure, supplemented by Antimatter Engines for maneuvers and deceleration."
        },
        {
            question: "Why does the ship feature a Centrifugal Habitat Ring?",
            options: ["To store liquid helium", "To provide artificial gravity", "To generate magnetic fields", "To deploy the pods"],
            correctAnswer: 1,
            explanation: "The rotating ring provides artificial gravity for the biomechanical maintenance drones and caretaker systems."
        },
        {
            question: "What is stored within the glowing green capsules?",
            options: ["Antimatter fuel", "Liquid Helium", "Biological Incubation Pods (Seeds of life)", "Superconducting batteries"],
            correctAnswer: 2,
            explanation: "These pods contain the biological payload in nutrient-rich fluid, ready to be deployed to a viable host planet."
        },
        {
            question: "What prevents the antimatter engines from melting down?",
            options: ["Ablative Heat Shield", "Liquid Helium Coolant Lines", "Magnetic Deflectors", "Photon Sails"],
            correctAnswer: 1,
            explanation: "High-pressure pipes circulate liquid helium around the engine block to maintain thermal management and prevent containment failure."
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the habitat ring
        if (meshes.ringGroup) meshes.ringGroup.rotation.z += 0.01 * speed;
        
        // Slowly pulse the AI core
        if (meshes.aiCore) {
            meshes.aiCore.rotation.y += 0.02 * speed;
            meshes.aiCore.rotation.x += 0.01 * speed;
            const scale = 1 + Math.sin(time * 0.003) * 0.1;
            meshes.aiCore.scale.set(scale, scale, scale);
        }

        // Rotate the protective cage in the opposite direction
        if (meshes.aiCage) {
            meshes.aiCage.rotation.y -= 0.015 * speed;
            meshes.aiCage.rotation.x -= 0.005 * speed;
        }

        // Pulse the biological pods
        if (meshes.podGroup) {
            meshes.podGroup.children.forEach((singlePod, index) => {
                const innerCore = singlePod.children[1];
                if (innerCore && innerCore.material) {
                    innerCore.material.emissiveIntensity = 3.5 + Math.sin(time * 0.002 + index) * 1.5;
                }
            });
        }

        // Pulse the engine exhaust
        if (meshes.engineGroup) {
            meshes.engineGroup.children.forEach((nozGroup, index) => {
                if (index > 0) { // skip engine block
                    const core = nozGroup.children[1];
                    if (core && core.material) {
                        core.material.emissiveIntensity = 4.0 + Math.random() * 2.0;
                    }
                }
            });
        }

        // Slightly articulate the solar sails
        if (meshes.sailGroup) {
            meshes.sailGroup.children.forEach((child) => {
                if (child.geometry && child.geometry.type === 'ExtrudeGeometry') {
                    // It's a sail, flex it slightly
                    child.rotation.y = Math.sin(time * 0.001) * 0.1;
                }
            });
        }
        
        // Spin the comms dish antenna
        if (meshes.commsGroup) {
            meshes.commsGroup.children[1].rotation.y += 0.05 * speed;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createPanspermiaVessel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
