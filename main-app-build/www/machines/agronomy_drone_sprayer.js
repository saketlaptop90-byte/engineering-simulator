import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Hexa-Core Agronomy Drone Sprayer, an ultra-advanced autonomous chemical application and crop monitoring vehicle. Features a 6-rotor high-torque lift system, multi-spectral camera gimbal, high-pressure pump system, and precision micrometer nozzles.";

    const quizQuestions = [
        {
            question: "What is the primary function of the multi-spectral camera gimbal?",
            options: [
                "To record cinematic video",
                "To analyze crop health, moisture levels, and detect pests using various light spectrums",
                "To control flight path via visual odometry",
                "To act as a counterweight"
            ],
            answer: 1,
            explanation: "Multi-spectral cameras capture visible and invisible light to assess plant health and stress levels before they are visible to the naked eye."
        },
        {
            question: "Why does the drone utilize a hexacopter (6 rotors) design instead of a quadcopter (4 rotors)?",
            options: [
                "It uses less battery power per motor",
                "It looks more aggressive and advanced",
                "It provides critical redundancy; if one motor fails, it can still land safely, and it offers higher payload capacity",
                "It prevents the rotors from creating a vortex ring state"
            ],
            answer: 2,
            explanation: "Hexacopters offer essential redundancy. If a quadcopter loses a motor, it crashes. A hexacopter can maintain stability with a lost motor, which is crucial when carrying heavy chemical payloads."
        },
        {
            question: "What is the purpose of the high-pressure pump system connected to the chemical tank?",
            options: [
                "To cool down the battery pack",
                "To maintain drone altitude by expelling air",
                "To pressurize the liquid payload, allowing the micrometer nozzles to create a fine mist for even crop coverage",
                "To pump hydraulic fluid to the landing gear"
            ],
            answer: 2,
            explanation: "The pump system is essential for atomizing the liquid chemical into fine droplets, maximizing leaf coverage while minimizing chemical usage and runoff."
        },
        {
            question: "How do the brushless motors generate the immense torque required to lift a fully loaded tank?",
            options: [
                "By using internal combustion chambers",
                "By utilizing high-density neodymium magnets and intricate copper coils controlled by rapid electronic switching",
                "By relying on a series of gears that multiply a weak motor's force",
                "By burning solid rocket fuel in small bursts"
            ],
            answer: 1,
            explanation: "High-end drone motors are brushless direct current (BLDC) motors, utilizing strong permanent magnets and electronically commutated electromagnets to generate frictionless, high-torque rotation."
        },
        {
            question: "What failure cascade is most likely if the radar module malfunctions during low-altitude spraying?",
            options: [
                "The rotors will immediately stop spinning",
                "The chemical tank will spontaneously empty",
                "The drone loses terrain-following capability, risking a catastrophic collision with uneven ground or crops",
                "The battery will short circuit and catch fire"
            ],
            answer: 2,
            explanation: "The radar (or LiDAR) module continuously maps the ground to maintain a precise height above the crop canopy. Its failure can lead to ground strikes or ineffective high-altitude spraying."
        }
    ];

    // -- Materials for LEDs and SpecialFX --
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3, roughness: 0.2 });
    const glowingGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 3, roughness: 0.2 });
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2, roughness: 0.2 });
    const chemicalLiquid = new THREE.MeshStandardMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.75, roughness: 0.1, metalness: 0.1 });
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 });

    // --- Helper Functions for Complex Geometry ---
    class CustomPipeCurve extends THREE.Curve {
        constructor(points) {
            super();
            this.points = points;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const index = t * (this.points.length - 1);
            const i = Math.floor(index);
            const frac = index - i;
            if (i >= this.points.length - 1) return optionalTarget.copy(this.points[this.points.length - 1]);
            return optionalTarget.copy(this.points[i]).lerp(this.points[i + 1], frac);
        }
    }

    // --- Part Generators ---

    // 1. Central Chassis
    const chassisGroup = new THREE.Group();
    
    // Main Hexagonal Body using Extrude
    const chassisShape = new THREE.Shape();
    for(let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = Math.cos(angle) * 5.0;
        const y = Math.sin(angle) * 5.0;
        if(i === 0) chassisShape.moveTo(x,y);
        else chassisShape.lineTo(x,y);
    }
    chassisShape.closePath();
    const extrudeSettings = { depth: 2.0, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.4, bevelThickness: 0.5 };
    const chassisExtrude = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    const chassisMesh = new THREE.Mesh(chassisExtrude, darkSteel);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = 3.0;
    chassisGroup.add(chassisMesh);

    // Chassis Top Dome (LatheGeometry)
    const domePoints = [];
    for(let i = 0; i <= 20; i++) {
        const t = i / 20;
        domePoints.push(new THREE.Vector2(Math.cos(t * Math.PI / 2) * 4.0, Math.sin(t * Math.PI / 2) * 2.0));
    }
    const domeGeom = new THREE.LatheGeometry(domePoints, 64);
    const domeMesh = new THREE.Mesh(domeGeom, tinted);
    domeMesh.position.y = 3.5;
    chassisGroup.add(domeMesh);
    
    // Lower cooling grill plates
    for(let i = 0; i < 5; i++) {
        const grillShape = new THREE.Shape();
        for(let j = 0; j < 6; j++) {
            const angle = j * Math.PI / 3;
            const radius = 4.8 - (i * 0.2);
            if(j === 0) grillShape.moveTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
            else grillShape.lineTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
        }
        grillShape.closePath();
        const grill = new THREE.Mesh(new THREE.ExtrudeGeometry(grillShape, {depth: 0.1, bevelEnabled: false}), steel);
        grill.rotation.x = Math.PI / 2;
        grill.position.y = 1.0 - (i * 0.2);
        chassisGroup.add(grill);
    }

    parts.push({
        name: "Central_Chassis",
        description: "The primary carbon-forged hexagonal hull housing main electronics, cooling grilles, and structural nodes.",
        material: darkSteel,
        function: "Structural integrity and environmental protection",
        assemblyOrder: 1,
        connections: ["Flight_Computer", "Hex_Arms", "Battery_Array", "Chemical_Reservoir"],
        failureEffect: "Structural collapse",
        cascadeFailures: ["Entire system failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 2. Flight Computer
    const flightCompGroup = new THREE.Group();
    // Motherboard
    const boardGeom = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
    const boardMesh = new THREE.Mesh(boardGeom, plastic);
    flightCompGroup.add(boardMesh);
    // Neural Processors and IMUs
    for(let i = 0; i < 12; i++) {
        const chip = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 8), darkSteel);
        chip.position.set(Math.cos(i * Math.PI/6) * 1.5, 0.2, Math.sin(i * Math.PI/6) * 1.5);
        flightCompGroup.add(chip);
        
        // Mini glowing data nodes
        const node = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), neonCyan);
        node.position.set(Math.cos(i * Math.PI/6) * 2.0, 0.25, Math.sin(i * Math.PI/6) * 2.0);
        flightCompGroup.add(node);
    }
    const coreProc = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.6, 16), glowingBlue);
    coreProc.position.y = 0.3;
    flightCompGroup.add(coreProc);
    
    // Wire bundles out of flight computer
    const dataWireCurve = new CustomPipeCurve([
        new THREE.Vector3(1, 0.5, 0),
        new THREE.Vector3(2, 1.5, 0),
        new THREE.Vector3(3, 1.0, -1)
    ]);
    const dWire = new THREE.Mesh(new THREE.TubeGeometry(dataWireCurve, 20, 0.1, 8, false), copper);
    flightCompGroup.add(dWire);

    flightCompGroup.position.y = 2.0;

    parts.push({
        name: "Flight_Computer",
        description: "Neuromorphic AI flight controller with multi-redundant IMUs and quantum-encrypted telemetry.",
        material: plastic,
        function: "Navigation and system regulation",
        assemblyOrder: 2,
        connections: ["Central_Chassis", "LiDAR_Module", "Hex_Arms"],
        failureEffect: "Loss of autonomous control",
        cascadeFailures: ["LiDAR_Module"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 3. Battery Array
    const batteryGroup = new THREE.Group();
    // Massive dual battery packs
    for(let i = -1; i <= 1; i += 2) {
        const packGroup = new THREE.Group();
        const cell = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5, 32), aluminum);
        cell.rotation.z = Math.PI / 2;
        packGroup.add(cell);
        
        // Battery Cooling Fins
        for(let f = -2.2; f <= 2.2; f += 0.4) {
            const fin = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.1, 8, 32), chrome);
            fin.rotation.y = Math.PI / 2;
            fin.position.x = f;
            packGroup.add(fin);
        }
        
        // Power coupling
        const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16), copper);
        coupling.rotation.z = Math.PI / 2;
        coupling.position.x = 2.8 * (i > 0 ? 1 : -1);
        packGroup.add(coupling);

        packGroup.position.set(0, 4.2, i * 2.5);
        batteryGroup.add(packGroup);
    }

    parts.push({
        name: "Battery_Array",
        description: "High-density solid-state lithium-sulfur power cells wrapped in aluminum cooling fins.",
        material: aluminum,
        function: "Provides immense electrical power to motors and pumps",
        assemblyOrder: 3,
        connections: ["Central_Chassis"],
        failureEffect: "Total power loss",
        cascadeFailures: ["Brushless_Motors", "High_Pressure_Pump"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 4. Hex Arms
    const hexArmsGroup = new THREE.Group();
    const armLength = 9.0;
    for(let i = 0; i < 6; i++) {
        const armGroup = new THREE.Group();
        const angle = i * Math.PI / 3;
        
        // Main arm carbon tube
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, armLength, 32), darkSteel);
        tube.rotation.z = Math.PI / 2;
        tube.position.x = armLength / 2 + 4; // extend from center
        armGroup.add(tube);
        
        // Under-slung structural truss
        for(let j = 4; j < armLength + 3; j+=1.5) {
            const truss = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 8), steel);
            truss.rotation.x = Math.PI/4;
            truss.position.x = j;
            truss.position.y = -0.6;
            armGroup.add(truss);
            
            const truss2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 8), steel);
            truss2.rotation.x = -Math.PI/4;
            truss2.position.x = j + 0.75;
            truss2.position.y = -0.6;
            armGroup.add(truss2);
        }
        
        // Heavy hydraulic folding hinge at base of arm
        const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.0, 32), chrome);
        hinge.rotation.x = Math.PI / 2;
        hinge.position.x = 4.0;
        armGroup.add(hinge);

        armGroup.rotation.y = angle;
        armGroup.position.y = 2.0;
        hexArmsGroup.add(armGroup);
    }

    parts.push({
        name: "Hex_Arms",
        description: "Carbon nanotube reinforced structural booms with hydraulic folding hinges and underslung trusses.",
        material: darkSteel,
        function: "Supports lift systems",
        assemblyOrder: 4,
        connections: ["Central_Chassis", "Brushless_Motors"],
        failureEffect: "Motor detachment",
        cascadeFailures: ["Carbon_Propellers"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: 0, z: 0}
    });

    // 5. Brushless Motors & 6. Propellers & 16. LEDs
    const motorsGroup = new THREE.Group();
    const propsGroup = new THREE.Group();
    const ledsGroup = new THREE.Group();
    const motorsList = [];
    const propsList = [];

    for(let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = Math.cos(angle) * (armLength + 4);
        const z = Math.sin(angle) * (armLength + 4);
        
        // Motor Construction
        const motorObj = new THREE.Group();
        
        // Base mount plate
        const mountPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32), darkSteel);
        mountPlate.position.y = 0.1;
        motorObj.add(mountPlate);

        // Motor stator base
        const mBase = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.6, 64), chrome);
        mBase.position.y = 0.5;
        motorObj.add(mBase);
        
        // Stator Coils (Highly detailed)
        for(let c = 0; c < 24; c++) {
            const cAng = c * Math.PI / 12;
            const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8), copper);
            coil.position.set(Math.cos(cAng)*0.9, 0.9, Math.sin(cAng)*0.9);
            motorObj.add(coil);
        }

        // Rotor Bell
        const mBell = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.0, 64, 1, true), aluminum); // hollow cylinder
        mBell.position.y = 1.0;
        motorObj.add(mBell);
        
        // Bell Top
        const mTop = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 0.3, 0.2, 64), aluminum);
        mTop.position.y = 1.6;
        motorObj.add(mTop);

        motorObj.position.set(x, 2.0, z);
        motorsGroup.add(motorObj);
        motorsList.push(motorObj);

        // Propeller Construction
        const propObj = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32), steel);
        propObj.add(hub);
        
        // Complex twisted blades
        const bladeShape = new THREE.Shape();
        bladeShape.moveTo(0, 0);
        bladeShape.bezierCurveTo(3, 1.5, 8, 0.5, 10, 0.2);
        bladeShape.bezierCurveTo(11, 0, 10, -0.4, 8, -0.6);
        bladeShape.bezierCurveTo(3, -1.0, 0, 0, 0, 0);
        const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
        
        // Twisted aerodynamics
        const posAttr = bladeGeom.attributes.position;
        const v = new THREE.Vector3();
        for(let j = 0; j < posAttr.count; j++) {
            v.fromBufferAttribute(posAttr, j);
            const t = v.x * 0.09; 
            const ny = v.y * Math.cos(t) - v.z * Math.sin(t);
            const nz = v.y * Math.sin(t) + v.z * Math.cos(t);
            posAttr.setXYZ(j, v.x, ny, nz);
        }
        bladeGeom.computeVertexNormals();
        
        for(let b = 0; b < 3; b++) {
            const bMesh = new THREE.Mesh(bladeGeom, plastic);
            bMesh.rotation.y = b * (Math.PI * 2 / 3);
            propObj.add(bMesh);
        }
        
        propObj.position.set(x, 3.9, z);
        propsGroup.add(propObj);
        propsList.push({ mesh: propObj, direction: i % 2 === 0 ? 1 : -1 });
        
        // Navigation LED arrays
        const ledMat = i === 0 || i === 1 ? glowingRed : (i === 3 || i === 4 ? glowingGreen : glowingBlue);
        const ledBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.5, 16), darkSteel);
        ledBase.position.set(x, 1.5, z);
        ledsGroup.add(ledBase);
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), ledMat);
        led.position.set(x, 1.2, z);
        ledsGroup.add(led);
    }

    parts.push({
        name: "Brushless_Motors",
        description: "Massive electromagnetic stators offering 80kg of thrust each, with intricately wound 24-pole copper cores.",
        material: copper,
        function: "Generates rotational force",
        assemblyOrder: 5,
        connections: ["Hex_Arms", "Carbon_Propellers"],
        failureEffect: "Loss of lift and stability",
        cascadeFailures: ["Drone Crash"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -8, z: 0}
    });

    parts.push({
        name: "Carbon_Propellers",
        description: "40-inch triple-blade folding carbon fiber propellers with optimized aerodynamic twisting winglets.",
        material: plastic,
        function: "Converts torque to upward thrust",
        assemblyOrder: 6,
        connections: ["Brushless_Motors"],
        failureEffect: "Catastrophic crash",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });

    // 7. Chemical Reservoir
    const reservoirGroup = new THREE.Group();
    const resPoints = [];
    // Design a massive belly tank
    resPoints.push(new THREE.Vector2(0, -5));
    resPoints.push(new THREE.Vector2(2, -4.8));
    resPoints.push(new THREE.Vector2(4, -4.0));
    resPoints.push(new THREE.Vector2(4.5, -2.0));
    resPoints.push(new THREE.Vector2(4.5, 0));
    resPoints.push(new THREE.Vector2(3.5, 1));
    resPoints.push(new THREE.Vector2(0, 1.5));
    const resGeom = new THREE.LatheGeometry(resPoints, 64);
    const resMesh = new THREE.Mesh(resGeom, tinted);
    
    // Glowing liquid inside
    const liqGeom = new THREE.LatheGeometry(resPoints.map(p => new THREE.Vector2(p.x * 0.95, p.y * 0.95)), 64);
    const liqMesh = new THREE.Mesh(liqGeom, chemicalLiquid);
    
    // Tank reinforcing ribs
    for(let r = -4; r <= 0; r += 1) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(4.5 + (r * 0.1), 0.1, 16, 64), steel);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = r;
        reservoirGroup.add(rib);
    }
    
    reservoirGroup.add(resMesh);
    reservoirGroup.add(liqMesh);
    reservoirGroup.position.y = -1.5;

    parts.push({
        name: "Chemical_Reservoir",
        description: "60-liter pressurized transparent tank with slosh-baffling internal walls and exterior reinforcing ribs.",
        material: tinted,
        function: "Holds agronomy chemicals",
        assemblyOrder: 7,
        connections: ["Central_Chassis", "High_Pressure_Pump"],
        failureEffect: "Chemical leak",
        cascadeFailures: ["Pump cavitation", "Environmental hazard"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -15, z: 0}
    });

    // 8. High Pressure Pump & 9. Distribution Manifold
    const pumpGroup = new THREE.Group();
    // Main pump block
    const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.5, 64), steel);
    pumpBody.rotation.z = Math.PI / 2;
    pumpGroup.add(pumpBody);
    
    // Internal gears (visible through glass casing)
    const gearCasing = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.0, 32), glass);
    gearCasing.rotation.z = Math.PI / 2;
    pumpGroup.add(gearCasing);
    const pumpGear1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 16), chrome);
    pumpGear1.rotation.z = Math.PI / 2;
    pumpGear1.position.x = -0.2;
    pumpGroup.add(pumpGear1);
    
    // Hydraulic pistons driving the pump
    for(let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const pCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16), darkSteel);
        pCylinder.position.set(Math.cos(angle)*1.0, Math.sin(angle)*1.0, 0);
        pumpGroup.add(pCylinder);
        
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16), chrome);
        piston.position.set(Math.cos(angle)*1.0, Math.sin(angle)*1.0, 0);
        pumpGroup.add(piston);
    }
    
    pumpGroup.position.set(0, -7.5, 2.5);

    parts.push({
        name: "High_Pressure_Pump",
        description: "Industrial diaphragm pump capable of 250 PSI output, featuring visible chromium internal gears.",
        material: steel,
        function: "Pressurizes liquid for atomization",
        assemblyOrder: 8,
        connections: ["Chemical_Reservoir", "Distribution_Manifold"],
        failureEffect: "Failure to spray",
        cascadeFailures: ["Micrometer_Nozzles", "Crop malnutrition"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 8}
    });

    const manifoldGroup = new THREE.Group();
    // Complex snake-like tubing manifold
    const path1 = new CustomPipeCurve([
        new THREE.Vector3(0, -7.5, 2.5),
        new THREE.Vector3(-2, -8, 1),
        new THREE.Vector3(-4, -7.5, 0),
        new THREE.Vector3(-6, -7, 0)
    ]);
    const pipeMesh1 = new THREE.Mesh(new THREE.TubeGeometry(path1, 64, 0.25, 16, false), rubber);
    manifoldGroup.add(pipeMesh1);

    const path2 = new CustomPipeCurve([
        new THREE.Vector3(0, -7.5, 2.5),
        new THREE.Vector3(2, -8, 1),
        new THREE.Vector3(4, -7.5, 0),
        new THREE.Vector3(6, -7, 0)
    ]);
    const pipeMesh2 = new THREE.Mesh(new THREE.TubeGeometry(path2, 64, 0.25, 16, false), rubber);
    manifoldGroup.add(pipeMesh2);
    
    // Central junction box
    const junction = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16), chrome);
    junction.position.set(0, -7.5, 2.5);
    manifoldGroup.add(junction);

    parts.push({
        name: "Distribution_Manifold",
        description: "Reinforced fluoropolymer high-pressure tubing routing liquid to dual lateral booms.",
        material: rubber,
        function: "Routes pressurized liquid",
        assemblyOrder: 9,
        connections: ["High_Pressure_Pump", "Spray_Booms"],
        failureEffect: "Pressure drop and catastrophic leaking",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -25, z: 5}
    });

    // 10. Spray Booms & 11. Nozzles
    const boomsGroup = new THREE.Group();
    const boomLength = 18;
    for(let side = -1; side <= 1; side += 2) {
        const boom = new THREE.Group();
        
        // Primary Boom Pipe
        const mainB = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, boomLength, 32), darkSteel);
        mainB.rotation.z = Math.PI / 2;
        mainB.position.x = side * (boomLength / 2 + 4);
        boom.add(mainB);
        
        // Elaborate lattice truss for the boom
        for(let t = 0; t < boomLength; t += 2) {
            const xPos = side * (4 + t);
            // X-bracing
            const brace1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), steel);
            brace1.rotation.z = Math.PI / 4;
            brace1.position.set(xPos + 1, 0.5, 0);
            boom.add(brace1);
            const brace2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), steel);
            brace2.rotation.z = -Math.PI / 4;
            brace2.position.set(xPos + 1, 0.5, 0);
            boom.add(brace2);
            // Top rail
            const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 8), darkSteel);
            rail.rotation.z = Math.PI / 2;
            rail.position.set(xPos + 1, 1.0, 0);
            boom.add(rail);
        }
        
        // Micrometer Nozzles
        for(let n = 1; n <= 8; n++) {
            const nz = new THREE.Group();
            
            // Valve block
            const nValve = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16), chrome);
            nValve.rotation.x = Math.PI / 2;
            nz.add(nValve);
            
            // Conical nozzle tip
            const nTip = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.02, 0.6, 32), copper);
            nTip.position.y = -0.5;
            nz.add(nTip);
            
            // Micro-fan for droplet dispersion (Torus)
            const nFan = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 16), steel);
            nFan.rotation.x = Math.PI / 2;
            nFan.position.y = -0.7;
            nz.add(nFan);
            
            nz.position.set(side * (4 + n * (boomLength/9)), -0.3, 0);
            boom.add(nz);
        }
        boomsGroup.add(boom);
    }
    boomsGroup.position.set(0, -7.0, 0);

    parts.push({
        name: "Spray_Booms",
        description: "Foldable 36-foot lateral extensions crafted from titanium lattice structures.",
        material: darkSteel,
        function: "Positions nozzles precisely over crops",
        assemblyOrder: 10,
        connections: ["Distribution_Manifold"],
        failureEffect: "Reduced coverage area",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -30, z: 0}
    });

    parts.push({
        name: "Micrometer_Nozzles",
        description: "Atomizing ultrasonic nozzles with integrated dispersion micro-fans for perfect droplet sizes.",
        material: copper,
        function: "Disperses chemical payload in a uniform mist",
        assemblyOrder: 11,
        connections: ["Spray_Booms"],
        failureEffect: "Uneven chemical application causing localized crop burns",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -35, z: 0}
    });

    // 12. Multi-Spectral Gimbal & 13. Lenses
    const gimbalGroup = new THREE.Group();
    // Gimbal Base
    const gBase = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.6, 64), darkSteel);
    gimbalGroup.add(gBase);
    
    // Articulated Arm
    const gArmCurve = new CustomPipeCurve([
        new THREE.Vector3(0, -0.3, 0),
        new THREE.Vector3(0, -1.0, 1.0),
        new THREE.Vector3(0, -1.5, 1.5)
    ]);
    const gArm = new THREE.Mesh(new THREE.TubeGeometry(gArmCurve, 16, 0.3, 16, false), aluminum);
    gimbalGroup.add(gArm);
    
    // Yaw/Pitch Motors on Gimbal
    const yMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32), chrome);
    yMotor.rotation.z = Math.PI / 2;
    yMotor.position.set(0, -1.5, 1.5);
    gimbalGroup.add(yMotor);
    
    // Main Camera Payload
    const cameraPayload = new THREE.Group();
    const cameraBody = new THREE.Mesh(new THREE.ExtrudeGeometry(
        new THREE.Shape([new THREE.Vector2(-1,-0.5), new THREE.Vector2(1,-0.5), new THREE.Vector2(1,0.5), new THREE.Vector2(-1,0.5)]), 
        {depth: 1.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1}
    ), plastic);
    cameraBody.position.set(0, 0, 0.75); // center depth
    cameraPayload.add(cameraBody);
    
    // Lenses (RGB, NIR, Thermal)
    const lensData = [
        { x: -0.6, y: 0, r: 0.35, mat: glass },
        { x: 0, y: 0, r: 0.45, mat: glass }, // Main lens
        { x: 0.6, y: 0, r: 0.25, mat: chrome } // Thermal sensor
    ];
    
    lensData.forEach(l => {
        const lGroup = new THREE.Group();
        const lBase = new THREE.Mesh(new THREE.CylinderGeometry(l.r + 0.1, l.r + 0.1, 0.4, 32), darkSteel);
        lBase.rotation.x = Math.PI / 2;
        lGroup.add(lBase);
        
        const lGlass = new THREE.Mesh(new THREE.SphereGeometry(l.r, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), l.mat);
        lGlass.rotation.x = Math.PI / 2;
        lGlass.position.z = 0.2;
        lGroup.add(lGlass);
        
        lGroup.position.set(l.x, 0, 1.6);
        cameraPayload.add(lGroup);
    });
    
    cameraPayload.position.set(0, -2.0, 1.5);
    gimbalGroup.add(cameraPayload);
    gimbalGroup.position.set(0, -1.0, 5.0); // Mounted at the very front

    parts.push({
        name: "Multi_Spectral_Gimbal",
        description: "3-axis stabilized brushless mount ensuring zero-vibration optical acquisition.",
        material: aluminum,
        function: "Maintains camera stability during aggressive maneuvers",
        assemblyOrder: 12,
        connections: ["Central_Chassis", "Gimbal_Camera_Lenses"],
        failureEffect: "Shaky imagery and failed AI crop analysis",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 15}
    });

    parts.push({
        name: "Gimbal_Camera_Lenses",
        description: "Integrated RGB, Near-Infrared, and Thermal imaging array with sapphire glass.",
        material: glass,
        function: "Captures multi-layered high-res crop health data",
        assemblyOrder: 13,
        connections: ["Multi_Spectral_Gimbal"],
        failureEffect: "Loss of vision",
        cascadeFailures: ["Autonomous navigation impairment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -12, z: 20}
    });

    // 14. LiDAR Module
    const lidarGroup = new THREE.Group();
    // Raised mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.5, 16), steel);
    lidarGroup.add(mast);
    
    // LiDAR Base
    const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.6, 64), darkSteel);
    lBase.position.y = 1.0;
    lidarGroup.add(lBase);
    
    // Spinning Laser Scanner
    const lSpinner = new THREE.Group();
    const spinGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.8, 64), glass);
    lSpinner.add(spinGlass);
    
    // Internal laser diodes
    for(let i=0; i<4; i++) {
        const diode = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), chrome);
        diode.position.set(Math.cos(i*Math.PI/2)*0.4, 0, Math.sin(i*Math.PI/2)*0.4);
        lSpinner.add(diode);
    }
    
    lSpinner.position.y = 1.7;
    lidarGroup.add(lSpinner);
    
    // Top Cap
    const lTop = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 64), aluminum);
    lTop.position.y = 2.25;
    lidarGroup.add(lTop);
    
    lidarGroup.position.y = 4.5; // Top of drone
    
    parts.push({
        name: "LiDAR_Module",
        description: "128-channel 360-degree laser scanning array spinning at 20Hz for millimetric obstacle avoidance.",
        material: glass,
        function: "Generates real-time 3D point cloud of surroundings",
        assemblyOrder: 14,
        connections: ["Central_Chassis", "Flight_Computer"],
        failureEffect: "Blind to obstacles",
        cascadeFailures: ["Drone Crash"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 15. Landing Skids (Intricate carbon tubes)
    const skidsGroup = new THREE.Group();
    for(let side = -1; side <= 1; side += 2) {
        const skidSide = new THREE.Group();
        
        // Front and back angled vertical struts
        const strut1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6, 32), darkSteel);
        strut1.rotation.x = Math.PI / 6 * side;
        strut1.rotation.z = Math.PI / 12 * side;
        strut1.position.set(3 * side, -3.5, 3);
        skidSide.add(strut1);
        
        const strut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6, 32), darkSteel);
        strut2.rotation.x = -Math.PI / 6 * side;
        strut2.rotation.z = Math.PI / 12 * side;
        strut2.position.set(3 * side, -3.5, -3);
        skidSide.add(strut2);
        
        // Massive bottom skid rail
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 14, 32), darkSteel);
        rail.rotation.x = Math.PI / 2;
        rail.position.set(3.8 * side, -6.0, 0);
        skidSide.add(rail);
        
        // Rubber shock absorbers on the bottom
        for(let s = -5; s <= 5; s += 2.5) {
            const shock = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.0, 32), rubber);
            shock.rotation.x = Math.PI / 2;
            shock.position.set(3.8 * side, -6.0, s);
            skidSide.add(shock);
        }
        
        skidsGroup.add(skidSide);
    }

    parts.push({
        name: "Landing_Skids",
        description: "Shock-absorbing carbon-composite landing struts with vulcanized rubber impact dampers.",
        material: darkSteel,
        function: "Supports massive drone weight on uneven terrain",
        assemblyOrder: 15,
        connections: ["Central_Chassis"],
        failureEffect: "Inability to land safely",
        cascadeFailures: ["Damage to Chemical_Reservoir and Pump"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -25, z: 0}
    });

    // Add all meticulously crafted groups to main machine group
    group.add(chassisGroup);
    group.add(flightCompGroup);
    group.add(batteryGroup);
    group.add(hexArmsGroup);
    group.add(motorsGroup);
    group.add(propsGroup);
    group.add(ledsGroup);
    group.add(reservoirGroup);
    group.add(pumpGroup);
    group.add(manifoldGroup);
    group.add(boomsGroup);
    group.add(gimbalGroup);
    group.add(lidarGroup);
    group.add(skidsGroup);

    // --- Complex Animation Logic ---
    const maxPropSpeed = 2.5;
    let pumpOscillator = 0;

    function animate(time, speed, meshes) {
        // 1. Hyper-fast Propeller Rotation
        propsList.forEach(prop => {
            prop.mesh.rotation.y += prop.direction * maxPropSpeed * speed;
        });

        // 2. Spinning LiDAR
        if(speed > 0.05) {
            const lidarSpinner = lidarGroup.children[2]; // lSpinner is index 2
            lidarSpinner.rotation.y += 0.8 * speed;
        }

        // 3. Multi-axis Gimbal Scanning
        // Smooth sine wave scanning over terrain
        gimbalGroup.rotation.y = Math.sin(time * 1.5) * 0.8 * (speed > 0.1 ? 1 : 0);
        // Tilt adjusting to speed
        const cameraPayload = gimbalGroup.children[3];
        if(cameraPayload) {
            cameraPayload.rotation.x = Math.sin(time * 2.5) * 0.2 - (speed * 0.2);
        }

        // 4. LED Navigation Pulses
        const pulse = (Math.sin(time * 10) + 1) / 2;
        glowingRed.emissiveIntensity = 1 + pulse * 4;
        glowingGreen.emissiveIntensity = 1 + pulse * 4;
        // Central computer node pulse
        neonCyan.emissiveIntensity = 0.5 + ((Math.sin(time * 20) + 1) / 2) * 2;

        // 5. High-Pressure Pump Mechanics
        if(speed > 0.4) {
            pumpOscillator += 0.5 * speed;
            // Vibrate entire pump
            pumpGroup.position.y = -7.5 + Math.sin(pumpOscillator * 2) * 0.03;
            pumpGroup.position.z = 2.5 + Math.cos(pumpOscillator * 3) * 0.03;
            // Spin internal gears rapidly
            const gear1 = pumpGroup.children[2];
            if(gear1) gear1.rotation.y += 0.4 * speed;
            
            // Move hydraulic pistons inside pump (children 3 to 14)
            for(let i = 0; i < 6; i++) {
                const piston = pumpGroup.children[4 + (i*2)];
                if(piston) {
                    piston.position.z = Math.sin(pumpOscillator + (i * Math.PI/3)) * 0.3;
                }
            }
        } else {
            pumpGroup.position.y = -7.5;
            pumpGroup.position.z = 2.5;
        }

        // 6. Overall Drone Flight Dynamics
        // Simulate hover instability and wind resistance
        const floatY = Math.sin(time * 1.2) * 0.4 * speed;
        const driftX = Math.cos(time * 0.8) * 0.2 * speed;
        const driftZ = Math.sin(time * 0.9) * 0.2 * speed;
        
        group.position.set(driftX, floatY, driftZ);
        
        // Pitch and Roll based on flight logic
        group.rotation.x = Math.sin(time * 1.5) * 0.03 * speed;
        group.rotation.z = Math.cos(time * 1.1) * 0.03 * speed;
        group.rotation.y = Math.sin(time * 0.5) * 0.01 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDroneSprayer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
