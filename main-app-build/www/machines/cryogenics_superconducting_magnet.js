import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Emissive & Specialized Materials
    const activeNeonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, metalness: 0.8, roughness: 0.2 });
    const superconMaterial = new THREE.MeshStandardMaterial({ color: 0x8888aa, metalness: 0.9, roughness: 0.1, wireframe: true });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ff00, emissiveIntensity: 0.8 });
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 });

    const tireMeshes = [];
    const pistonRods = [];
    const boomArms = [];
    const coilMeshes = [];
    const indicatorMeshes = [];

    // =======================================================================
    // 1. ALL-TERRAIN MOBILE CHASSIS & OFF-ROAD TIRES
    // =======================================================================
    const chassisGroup = new THREE.Group();
    
    // Main Chassis Frame
    const frameShape = new THREE.Shape();
    frameShape.moveTo(-6, -10);
    frameShape.lineTo(6, -10);
    frameShape.lineTo(6, 8);
    frameShape.lineTo(4, 12);
    frameShape.lineTo(-4, 12);
    frameShape.lineTo(-6, 8);
    
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, { depth: 2, bevelEnabled: true, bevelThickness: 0.3 });
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.rotation.x = Math.PI / 2;
    frame.position.set(0, -6, -1);
    chassisGroup.add(frame);

    // Front Grille
    const grilleGroup = new THREE.Group();
    grilleGroup.position.set(0, -5, 11.5);
    const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 0.4), darkSteel);
    grilleGroup.add(grilleFrame);
    for(let g=0; g<12; g++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.3, 0.6), chrome);
        bar.position.set(-2.2 + g*0.4, 0, 0);
        grilleGroup.add(bar);
    }
    chassisGroup.add(grilleGroup);

    // Ladders on both sides
    for(let i of [-1, 1]) {
        const ladderGroup = new THREE.Group();
        ladderGroup.position.set(6.5 * i, -3, 0);
        
        const side1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6, 8), darkSteel);
        side1.position.set(0, 0, -1);
        ladderGroup.add(side1);
        
        const side2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6, 8), darkSteel);
        side2.position.set(0, 0, 1);
        ladderGroup.add(side2);
        
        for(let r=0; r<6; r++) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 8), chrome);
            rung.position.set(0, -2.5 + (r*1.0), 0);
            rung.rotation.x = Math.PI / 2;
            ladderGroup.add(rung);
        }
        chassisGroup.add(ladderGroup);
    }

    // 6x6 Off-Road Tires with Lugs and Spokes
    const tirePositions = [
        [-7.5, -6, -7],
        [ 7.5, -6, -7],
        [-7.5, -6,  5],
        [ 7.5, -6,  5],
        [-7.5, -6, -1],
        [ 7.5, -6, -1]
    ];
    
    tirePositions.forEach((pos) => {
        const wheel = new THREE.Group();
        wheel.position.set(pos[0], pos[1], pos[2]);
        
        // Torus Tire
        const tireGeo = new THREE.TorusGeometry(2.5, 1.2, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wheel.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs
        const numLugs = 60;
        for(let j=0; j<numLugs; j++) {
            const angle = (Math.PI * 2 / numLugs) * j;
            const lugGeo = new THREE.BoxGeometry(2.6, 0.4, 0.8);
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.y = Math.sin(angle) * 3.7;
            lug.position.z = Math.cos(angle) * 3.7;
            lug.rotation.x = angle;
            if (j % 2 === 0) lug.position.x += 0.2;
            else lug.position.x -= 0.2;
            wheel.add(lug);
        }

        // Rim with complex spoke arrays
        const rimGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.8, 32);
        const rim = new THREE.Mesh(rimGeo, steel);
        rim.rotation.z = Math.PI / 2;
        wheel.add(rim);

        const numSpokes = 18;
        for(let s=0; s<numSpokes; s++) {
            const sAngle = (Math.PI * 2 / numSpokes) * s;
            const spokeGeo = new THREE.CylinderGeometry(0.15, 0.3, 3.2, 16);
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.position.y = Math.sin(sAngle) * 0.8;
            spoke.position.z = Math.cos(sAngle) * 0.8;
            spoke.rotation.x = sAngle;
            wheel.add(spoke);
        }

        // Hub
        const hubGeo = new THREE.CylinderGeometry(0.7, 0.9, 3.4, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.z = Math.PI / 2;
        wheel.add(hub);
        
        tireMeshes.push(wheel);
        chassisGroup.add(wheel);
    });

    group.add(chassisGroup);
    parts.push({
        name: "All-Terrain Mobile Chassis",
        description: "Massive 6x6 wheeled frame with aggressive off-road treads, deep lugs, and complex rim spokes.",
        material: darkSteel,
        function: "Transports the massive superconducting magnet across rough and extreme terrain.",
        assemblyOrder: 1,
        connections: ["Hydraulic Suspension", "Operator Cabin", "Ladders"],
        failureEffect: "Immobility and structural collapse of the magnet mount.",
        cascadeFailures: ["Magnet Misalignment", "Cryo-Lines Severed"],
        originalPosition: {x: 0, y: -6, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // =======================================================================
    // 2. ARMORED OPERATOR CABIN
    // =======================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -2, 8);
    
    // Main Cabin Body
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-3.5, 0);
    cabinShape.lineTo(3.5, 0);
    cabinShape.lineTo(3.5, 5);
    cabinShape.lineTo(2.5, 7);
    cabinShape.lineTo(-2.5, 7);
    cabinShape.lineTo(-3.5, 5);
    
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 5, bevelEnabled: true, bevelThickness: 0.2 });
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabinMesh);

    // Tinted Windows
    const windowGeo = new THREE.PlaneGeometry(4.8, 2.2);
    const frontWindow = new THREE.Mesh(windowGeo, tinted);
    frontWindow.position.set(0, 5.3, 5.1);
    frontWindow.rotation.x = -Math.PI / 7;
    cabinGroup.add(frontWindow);

    // Interior Controls
    const steeringGeo = new THREE.TorusGeometry(0.5, 0.08, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringGeo, plastic);
    steeringWheel.position.set(-1.5, 3.5, 3);
    steeringWheel.rotation.x = -Math.PI / 4;
    cabinGroup.add(steeringWheel);

    const joystickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16), darkSteel);
    joystickBase.position.set(1.5, 2.5, 3);
    cabinGroup.add(joystickBase);
    
    const joystickStick = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16), chrome);
    joystickStick.position.set(1.5, 2.9, 3);
    cabinGroup.add(joystickStick);

    const mainScreen = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), screenMat);
    mainScreen.position.set(0, 4.0, 4.0);
    mainScreen.rotation.x = -Math.PI / 8;
    cabinGroup.add(mainScreen);
    
    // Side Mirrors
    for(let i of [-1, 1]) {
        const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 16), chrome);
        mirrorArm.position.set(4 * i, 4.5, 3);
        mirrorArm.rotation.z = (Math.PI / 3) * i;
        cabinGroup.add(mirrorArm);
        
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.1), chrome);
        mirror.position.set(4.8 * i, 5, 3);
        cabinGroup.add(mirror);
    }

    group.add(cabinGroup);
    parts.push({
        name: "Armored Operator Cabin",
        description: "Heavily shielded control cabin featuring tinted glass, joysticks, steering wheel, and diagnostic glowing screens.",
        material: steel,
        function: "Safely houses the operator and provides full telemetry and navigation controls.",
        assemblyOrder: 2,
        connections: ["Chassis", "Wiring Harness"],
        failureEffect: "Loss of control, communication, and real-time telemetry.",
        cascadeFailures: ["Navigation Failure", "Unnoticed Quench"],
        originalPosition: {x: 0, y: -2, z: 8},
        explodedPosition: {x: 0, y: 10, z: 25}
    });

    // =======================================================================
    // 3. HYDRAULIC BOOM ARMS & PISTONS
    // =======================================================================
    const boomGroup = new THREE.Group();
    
    // Pivot Base
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1.5, 64), darkSteel);
    pivot.position.set(0, -3.5, -3);
    boomGroup.add(pivot);

    // Twin Boom Arms
    for(let i of [-1, 1]) {
        const armGeo = new THREE.BoxGeometry(1.5, 10, 2.5);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.set(3.5 * i, 0, -3);
        arm.rotation.x = -Math.PI / 6;
        boomArms.push(arm);
        boomGroup.add(arm);

        // Heavy Piston (Cylinder inside Cylinder)
        const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5, 32), darkSteel);
        pistonOuter.position.set(3.5 * i, -2, -1);
        pistonOuter.rotation.x = -Math.PI / 4;
        boomGroup.add(pistonOuter);

        const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 32), chrome);
        pistonInner.position.set(0, 1.5, 0);
        pistonOuter.add(pistonInner);
        pistonRods.push(pistonInner); 
    }

    group.add(boomGroup);
    parts.push({
        name: "Hydraulic Boom Array",
        description: "Articulated heavy-duty boom arms driven by synchronized double-acting hydraulic pistons.",
        material: steel,
        function: "Adjusts the elevation and spatial orientation of the massive magnet assembly.",
        assemblyOrder: 3,
        connections: ["Chassis", "Magnet Cradle"],
        failureEffect: "Magnet crashes into the chassis, causing immediate structural failure.",
        cascadeFailures: ["Quench", "Cryogen Explosion", "Vacuum Breach"],
        originalPosition: {x: 0, y: -3.5, z: -3},
        explodedPosition: {x: 0, y: -5, z: -15}
    });

    // =======================================================================
    // 4. THE SUPERCONDUCTING MAGNET CORE
    // =======================================================================
    const magnetGroup = new THREE.Group();
    magnetGroup.position.set(0, 6, -3); // Elevated

    // A. Vacuum Vessel Shell (LatheGeometry)
    const vesselPts = [];
    vesselPts.push(new THREE.Vector2(3.5, -5));
    vesselPts.push(new THREE.Vector2(7.0, -5));
    vesselPts.push(new THREE.Vector2(7.5, -4));
    vesselPts.push(new THREE.Vector2(7.5, 4));
    vesselPts.push(new THREE.Vector2(7.0, 5));
    vesselPts.push(new THREE.Vector2(3.5, 5));
    vesselPts.push(new THREE.Vector2(3.0, 4));
    vesselPts.push(new THREE.Vector2(3.0, -4));
    vesselPts.push(new THREE.Vector2(3.5, -5));
    
    const vessel = new THREE.Mesh(new THREE.LatheGeometry(vesselPts, 64), aluminum);
    vessel.rotation.x = Math.PI / 2;
    magnetGroup.add(vessel);

    // Rivets / Structural Bolts on the Vessel
    for(let r=0; r<48; r++) {
        const a = (Math.PI * 2 / 48) * r;
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), darkSteel);
        rivet.position.set(Math.cos(a) * 7.5, 0, Math.sin(a) * 7.5);
        magnetGroup.add(rivet);
    }

    // B. Internal Liquid Helium Jacket
    const hePts = vesselPts.map(p => new THREE.Vector2(p.x * 0.85 + (p.x < 4 ? 0.6 : -0.6), p.y * 0.85));
    const heVessel = new THREE.Mesh(new THREE.LatheGeometry(hePts, 64), steel);
    heVessel.rotation.x = Math.PI / 2;
    magnetGroup.add(heVessel);

    // C. NbTi Superconducting Coils
    for(let i=0; i<10; i++) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(5.0, 0.4, 32, 100), activeNeonCyan);
        coil.position.y = -3.5 + (i * 0.77);
        coil.rotation.x = Math.PI / 2;
        coilMeshes.push(coil);
        magnetGroup.add(coil);

        const winding = new THREE.Mesh(new THREE.TorusGeometry(5.05, 0.45, 16, 120, Math.PI*2), superconMaterial);
        winding.position.y = coil.position.y;
        winding.rotation.x = Math.PI / 2;
        magnetGroup.add(winding);
    }

    // D. Gradient Coils & RF Coil (Nested Cylinders inside the bore)
    const gradCyl = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 3.9, 9, 64, 1, true), copper);
    gradCyl.rotation.x = Math.PI / 2;
    magnetGroup.add(gradCyl);
    
    let rfMesh;
    rfMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 8.5, 32, 16, true), new THREE.MeshStandardMaterial({color: 0xdddd22, wireframe: true}));
    rfMesh.rotation.x = Math.PI / 2;
    rfMesh.userData = { isRF: true };
    magnetGroup.add(rfMesh);

    group.add(magnetGroup);
    parts.push({
        name: "Massive Toroidal Coil Assembly",
        description: "MRI-style superconducting magnet core featuring NbTi coils, liquid helium cooling jacket, and multi-layer vacuum vessel.",
        material: aluminum,
        function: "Generates an extremely powerful and stable magnetic field.",
        assemblyOrder: 4,
        connections: ["Hydraulic Boom", "Cryogenic Turret", "Power Cables"],
        failureEffect: "Total magnetic field collapse.",
        cascadeFailures: ["Explosive Quench", "Shrapnel", "Asphyxiation"],
        originalPosition: {x: 0, y: 6, z: -3},
        explodedPosition: {x: 0, y: 25, z: -3}
    });

    // =======================================================================
    // 5. EXTENSIVE HYDRAULIC LINES & EXHAUST
    // =======================================================================
    const linesGroup = new THREE.Group();
    
    // Extruded TubeGeometry for winding hydraulic and cryogenic lines
    for(let i=0; i<16; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -4, -3),
            new THREE.Vector3(Math.sin(i)*3.5, 0, -3 + Math.cos(i)*3.5),
            new THREE.Vector3(Math.sin(i*2)*4.5, 4, -3),
            new THREE.Vector3(0, 6, -3)
        ]);
        const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.12, 8, false), rubber);
        linesGroup.add(line);
    }

    // Twin Exhaust Stacks
    for(let i of [-1, 1]) {
        const stackGroup = new THREE.Group();
        stackGroup.position.set(5.5 * i, -1, -9);
        
        const stackPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 32), chrome);
        stackPipe.position.y = 5;
        stackGroup.add(stackPipe);

        const flapper = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 16), darkSteel);
        flapper.position.set(0, 10.1, 0);
        flapper.rotation.x = Math.PI / 4; 
        stackGroup.add(flapper);
        
        linesGroup.add(stackGroup);
    }
    
    group.add(linesGroup);
    parts.push({
        name: "Hydraulic & Cryogenic Routing",
        description: "Extensive network of high-pressure TubeGeometry lines and thick superconducting conduits.",
        material: rubber,
        function: "Delivers fluid power to the booms, cryogens to the vessel, and electrical power to the coils.",
        assemblyOrder: 5,
        connections: ["Chassis", "Magnet Core", "Booms"],
        failureEffect: "Loss of hydraulic pressure, dropping the magnet.",
        cascadeFailures: ["Magnet Damage", "Line Rupture", "Cryogen Leak"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -12, y: 5, z: 0}
    });

    // =======================================================================
    // 6. CRYOGENIC TURRET & SENSORS
    // =======================================================================
    const turretGroup = new THREE.Group();
    turretGroup.position.set(0, 11, -3);
    
    const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, 2.5, 32), steel);
    turretGroup.add(turretBase);

    const coldHead = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 32), chrome);
    coldHead.position.y = 3;
    turretGroup.add(coldHead);
    
    // Heat Exchanger Rings
    let heatExchangerGroup;
    heatExchangerGroup = new THREE.Group();
    heatExchangerGroup.position.y = 4;
    for(let h=0; h<5; h++) {
        const hRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.15, 16, 32), copper);
        hRing.position.y = h * 0.4;
        hRing.rotation.x = Math.PI / 2;
        heatExchangerGroup.add(hRing);
    }
    heatExchangerGroup.userData = { isGear: true };
    turretGroup.add(heatExchangerGroup);
    
    // Blinking Sensor Array
    for(let i=0; i<8; i++) {
        const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), plastic);
        sensor.position.set(Math.cos(i)*2.1, 1, Math.sin(i)*2.1);
        turretGroup.add(sensor);
        
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), sensorMat);
        led.position.set(Math.cos(i)*2.3, 1, Math.sin(i)*2.3);
        indicatorMeshes.push(led);
        turretGroup.add(led);
    }

    group.add(turretGroup);
    parts.push({
        name: "Cryogenic Cooling Tower",
        description: "Contains the mechanical cold head, heat exchangers, and burst disk pressure relief valves.",
        material: chrome,
        function: "Continuously recondenses helium gas and regulates internal vessel pressure.",
        assemblyOrder: 6,
        connections: ["Magnet Core", "Vents"],
        failureEffect: "Thermal runaway in the cryostat.",
        cascadeFailures: ["Helium Venting", "Massive Quench"],
        originalPosition: {x: 0, y: 11, z: -3},
        explodedPosition: {x: 0, y: 30, z: -3}
    });

    // =======================================================================
    // METADATA & ANIMATION
    // =======================================================================
    const description = "The Mobile Superconducting Magnet Unit (MSMU). An ultra high-tech, hyper-realistic 7.0 Tesla MRI-style toroidal coil assembly mounted on an aggressive 6x6 off-road chassis. Features complex articulated hydraulic booms, a zero-boil-off liquid helium cooling jacket, heavy support struts, extensive hydraulic tubing, and an armored operator cabin with tinted windows and glowing telemetry panels. Engineered for extreme terrain deployment.";

    const quizQuestions = [
        {
            question: "Why does this Superconducting Magnet feature an aggressive 6x6 off-road chassis with lugged tires?",
            options: [
                "To reduce the weight",
                "To deploy ultra-high magnetic field resonance capabilities into extreme and rugged terrains",
                "To cool the magnet faster",
                "To absorb radiation from the core"
            ],
            correctAnswer: 1,
            explanation: "The massive off-road chassis allows the deployment of the heavy cryostat and magnet assembly into rugged environments for advanced geological or field scanning."
        },
        {
            question: "What is the function of the massive toroidal coil assembly?",
            options: [
                "To generate the primary ultra-high magnetic field using NbTi windings",
                "To drive the off-road wheels",
                "To serve as a fuel tank",
                "To provide structural support"
            ],
            correctAnswer: 0,
            explanation: "The toroidal coil assembly houses the Niobium-Titanium superconducting wires that carry massive currents to generate the 7.0T field."
        },
        {
            question: "How do the hydraulic booms and double-acting pistons interact?",
            options: [
                "They spin the magnet",
                "They adjust the elevation and angle of the massive magnet perfectly in sync",
                "They pump helium gas",
                "They clean the tinted windows"
            ],
            correctAnswer: 1,
            explanation: "The hydraulic pistons extend and retract in perfect synchronization with the boom arms to alter the elevation and pitch of the extremely heavy magnet core."
        },
        {
            question: "How is the superconducting state maintained within the core?",
            options: [
                "By driving the vehicle at high speeds",
                "By bathing the coils in a liquid helium cooling jacket enclosed in a vacuum vessel",
                "By pumping hydraulic fluid over the wires",
                "By opening the front grille"
            ],
            correctAnswer: 1,
            explanation: "Superconductivity requires extremely low temperatures, provided by liquid helium at 4.2K, which is thermally isolated by the massive vacuum vessel and MLI shields."
        },
        {
            question: "What do the intensely pulsing cyan rings represent during operation?",
            options: [
                "Tire pressure warnings",
                "The active flow of immense superconducting current through the main coils",
                "Cabin heating elements",
                "Exhaust gas"
            ],
            correctAnswer: 1,
            explanation: "The pulsing glowing rings simulate the massive, zero-resistance electrical currents flowing continuously through the NbTi superconducting coils."
        }
    ];

    let time = 0;
    function animate(delta, speed, meshes) {
        time += speed * 0.05;

        // 1. Rotate 6x6 Off-Road Wheels
        tireMeshes.forEach(wheel => {
            wheel.rotation.x -= speed * 0.08; 
        });

        // 2. Articulate Hydraulic Booms using Sine Waves
        const boomAngle = Math.sin(time * 0.8) * 0.25;
        boomArms.forEach(arm => {
            arm.rotation.x = -Math.PI / 6 + boomAngle;
        });

        // 3. Move Hydraulic Pistons Perfectly in Sync
        pistonRods.forEach(rod => {
            rod.position.y = 1.5 + (boomAngle * 4.5);
        });

        // 4. Spin Heat Exchanger
        if(heatExchangerGroup) {
            heatExchangerGroup.rotation.y += 0.15 * speed;
        }

        // 5. Pulse Neon Superconducting Coils
        coilMeshes.forEach((coil, i) => {
            const glow = (Math.sin(time * 3 + i) * 0.5) + 0.5;
            coil.material.emissiveIntensity = 1.0 + glow * 2.5;
        });

        // 6. Blink Diagnostics
        indicatorMeshes.forEach((led, idx) => {
            led.material.emissiveIntensity = Math.random() > 0.8 ? 3.0 : 0.2;
        });

        // 7. RF Coil spinning / pulsing
        if (rfMesh) {
            rfMesh.rotation.y += 0.12 * speed;
            rfMesh.material.opacity = 0.6 + Math.sin(time*6)*0.3;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSuperconductingMagnet() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
