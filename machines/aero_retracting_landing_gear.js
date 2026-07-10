import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing/Neon Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const meshes = {};

    // 1. Main Strut (Aluminum/Steel)
    const strutGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    const mainStrut = new THREE.Mesh(strutGeo, steel);
    mainStrut.position.set(0, 3, 0);
    group.add(mainStrut);
    meshes.mainStrut = mainStrut;

    parts.push({
        name: "Main Oleo Strut",
        description: "Primary shock-absorbing pneumatic strut.",
        material: "Steel",
        function: "Absorbs landing impact and supports the weight of the aircraft.",
        assemblyOrder: 1,
        connections: ["Trunnion", "Axle", "Hydraulic Actuator"],
        failureEffect: "Landing gear collapses on touchdown.",
        cascadeFailures: ["Wheel Damage", "Wing Structure Damage"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: mainStrut
    });

    // 2. Trunnion (Dark Steel)
    const trunnionGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const trunnion = new THREE.Mesh(trunnionGeo, darkSteel);
    trunnion.position.set(0, 6, 0);
    group.add(trunnion);
    meshes.trunnion = trunnion;
    
    parts.push({
        name: "Trunnion",
        description: "Mounting bracket connecting the gear to the airframe.",
        material: "Dark Steel",
        function: "Provides the pivot point for retraction and structural attachment.",
        assemblyOrder: 2,
        connections: ["Main Oleo Strut", "Airframe"],
        failureEffect: "Inability to deploy or retract gear.",
        cascadeFailures: ["Airframe structural damage during landing"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 },
        mesh: trunnion
    });

    // 3. Hydraulic Actuator (Chrome & Glow)
    const actuatorGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const actuator = new THREE.Mesh(actuatorGeo, chrome);
    actuator.position.set(1.5, 4.5, 0);
    actuator.rotation.z = Math.PI / 4;
    group.add(actuator);
    meshes.actuator = actuator;

    const actuatorRingGeo = new THREE.TorusGeometry(0.35, 0.05, 16, 32);
    const actuatorRing = new THREE.Mesh(actuatorRingGeo, glowBlue);
    actuatorRing.position.set(0, 1, 0);
    actuatorRing.rotation.x = Math.PI / 2;
    actuator.add(actuatorRing);

    parts.push({
        name: "Hydraulic Actuator",
        description: "High-pressure hydraulic cylinder.",
        material: "Chrome / Hydraulic Fluid",
        function: "Provides the mechanical force to raise and lower the landing gear.",
        assemblyOrder: 3,
        connections: ["Trunnion", "Main Oleo Strut"],
        failureEffect: "Gear fails to retract or extend normally.",
        cascadeFailures: ["Emergency free-fall system required"],
        originalPosition: { x: 1.5, y: 4.5, z: 0 },
        explodedPosition: { x: 4, y: 6, z: 0 },
        mesh: actuator
    });

    // 4. Axle (Steel)
    const axleGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
    const axle = new THREE.Mesh(axleGeo, steel);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(0, 0, 0);
    group.add(axle);
    meshes.axle = axle;

    parts.push({
        name: "Wheel Axle",
        description: "Heavy-duty steel axle for dual wheels.",
        material: "High-strength Steel",
        function: "Mounting point for the wheels and brakes.",
        assemblyOrder: 4,
        connections: ["Main Oleo Strut", "Wheels", "Brake Assembly"],
        failureEffect: "Wheel separation.",
        cascadeFailures: ["Ground loop during rollout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: axle
    });

    // 5. Wheels (Rubber & Aluminum)
    const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const rimGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.85, 16);
    
    // Left Wheel
    const leftWheel = new THREE.Group();
    const lTire = new THREE.Mesh(wheelGeo, rubber);
    const lRim = new THREE.Mesh(rimGeo, aluminum);
    lTire.rotation.x = Math.PI / 2;
    lRim.rotation.x = Math.PI / 2;
    leftWheel.add(lTire);
    leftWheel.add(lRim);
    leftWheel.position.set(0, 0, -1.2);
    group.add(leftWheel);
    meshes.leftWheel = leftWheel;

    // Right Wheel
    const rightWheel = new THREE.Group();
    const rTire = new THREE.Mesh(wheelGeo, rubber);
    const rRim = new THREE.Mesh(rimGeo, aluminum);
    rTire.rotation.x = Math.PI / 2;
    rRim.rotation.x = Math.PI / 2;
    rightWheel.add(rTire);
    rightWheel.add(rRim);
    rightWheel.position.set(0, 0, 1.2);
    group.add(rightWheel);
    meshes.rightWheel = rightWheel;

    parts.push({
        name: "Left Main Wheel & Tire",
        description: "Aviation-grade rubber tire mounted on an aluminum rim.",
        material: "Rubber / Aluminum",
        function: "Provides traction, braking surface, and initial shock absorption.",
        assemblyOrder: 5,
        connections: ["Axle", "Brake Assembly"],
        failureEffect: "Tire blowout, loss of directional control.",
        cascadeFailures: ["Brake assembly destruction"],
        originalPosition: { x: 0, y: 0, z: -1.2 },
        explodedPosition: { x: 0, y: 0, z: -4 },
        mesh: leftWheel
    });

    parts.push({
        name: "Right Main Wheel & Tire",
        description: "Secondary aviation-grade rubber tire.",
        material: "Rubber / Aluminum",
        function: "Provides traction, braking surface, and initial shock absorption.",
        assemblyOrder: 6,
        connections: ["Axle", "Brake Assembly"],
        failureEffect: "Tire blowout, loss of directional control.",
        cascadeFailures: ["Brake assembly destruction"],
        originalPosition: { x: 0, y: 0, z: 1.2 },
        explodedPosition: { x: 0, y: 0, z: 4 },
        mesh: rightWheel
    });

    // 6. Brake Assembly (Carbon / Dark Steel & Neon)
    const brakeGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const lBrake = new THREE.Mesh(brakeGeo, darkSteel);
    lBrake.rotation.y = Math.PI / 2;
    lBrake.position.set(0, 0, -0.6);
    group.add(lBrake);
    meshes.lBrake = lBrake;

    const brakeIndicatorGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const brakeIndicator = new THREE.Mesh(brakeIndicatorGeo, glowRed);
    brakeIndicator.position.set(0, 0.8, 0);
    lBrake.add(brakeIndicator);

    parts.push({
        name: "Carbon Disk Brakes",
        description: "High-performance carbon-carbon brake assembly with heat indicators.",
        material: "Carbon Composite / Steel",
        function: "Dissipates kinetic energy as heat to stop the aircraft.",
        assemblyOrder: 7,
        connections: ["Wheels", "Axle"],
        failureEffect: "Inability to stop on the runway.",
        cascadeFailures: ["Runway excursion", "Tire fire"],
        originalPosition: { x: 0, y: 0, z: -0.6 },
        explodedPosition: { x: 0, y: -2, z: -2.5 },
        mesh: lBrake
    });

    const description = "A highly detailed, complex electro-hydraulic retracting landing gear system for commercial or military aircraft. Features an oleo-pneumatic shock strut, dual main wheels with carbon disk brakes, glowing indicators, and a powerful hydraulic actuator for retraction and extension.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Oleo Strut?",
            options: [
                "To retract the landing gear",
                "To provide steering capability",
                "To absorb the kinetic energy and shock of landing",
                "To hold the hydraulic fluid for the brakes"
            ],
            correct: 2,
            explanation: "The oleo-pneumatic strut uses compressed gas (usually nitrogen) and hydraulic fluid to absorb and dampen the massive shock loads during touchdown.",
            difficulty: "Medium"
        },
        {
            question: "Which component attaches the landing gear assembly directly to the aircraft's structural frame?",
            options: [
                "Axle",
                "Trunnion",
                "Hydraulic Actuator",
                "Torque Links"
            ],
            correct: 1,
            explanation: "The trunnion serves as the mounting pivot point, transferring the landing loads safely directly into the reinforced structure of the airframe.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the hydraulic actuator completely fails during flight?",
            options: [
                "The brakes will instantly lock up",
                "The wheels will separate from the axle",
                "The gear will fail to retract or extend normally",
                "The oleo strut will rapidly decompress"
            ],
            correct: 2,
            explanation: "The hydraulic actuator provides the mechanical force required for retraction and extension. If it fails, an emergency free-fall or blow-down system must be used to mechanically unlock and lower the gear.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;

        // Complex hydraulic folding action: Retraction cycle based on sine wave
        const cycle = Math.sin(time * speed);
        
        // Map cycle (-1 to 1) to an angle for retraction (0 to 1.5 rad)
        const angle = (cycle + 1) * (Math.PI / 4.5); 

        // The entire group rotates around the trunnion point (y=6)
        const pivotY = 6;
        
        meshesObj.trunnion.position.set(0, pivotY, 0); // Trunnion stays relatively still
        
        // Calculate new positions based on rotation
        const strutLen = 3;
        meshesObj.mainStrut.rotation.z = angle;
        meshesObj.mainStrut.position.x = -Math.sin(angle) * strutLen;
        meshesObj.mainStrut.position.y = pivotY - Math.cos(angle) * strutLen;

        meshesObj.axle.rotation.z = angle;
        meshesObj.axle.position.x = -Math.sin(angle) * pivotY;
        meshesObj.axle.position.y = pivotY - Math.cos(angle) * pivotY;

        meshesObj.leftWheel.position.x = meshesObj.axle.position.x;
        meshesObj.leftWheel.position.y = meshesObj.axle.position.y;
        meshesObj.leftWheel.rotation.z = angle;

        // Spin the wheels slightly when extended
        if (angle < 0.2) {
            meshesObj.leftWheel.rotation.x -= 0.15 * speed;
            meshesObj.rightWheel.rotation.x -= 0.15 * speed;
        } else {
            // Apply braking effect when retracted
            meshesObj.leftWheel.rotation.x *= 0.95;
            meshesObj.rightWheel.rotation.x *= 0.95;
        }

        meshesObj.rightWheel.position.x = meshesObj.axle.position.x;
        meshesObj.rightWheel.position.y = meshesObj.axle.position.y;
        meshesObj.rightWheel.rotation.z = angle;

        meshesObj.lBrake.position.x = meshesObj.axle.position.x;
        meshesObj.lBrake.position.y = meshesObj.axle.position.y;
        meshesObj.lBrake.rotation.z = angle;

        // Actuator compresses and extends to fold the gear
        const strutMidX = -Math.sin(angle) * 1.5;
        const strutMidY = pivotY - Math.cos(angle) * 1.5;
        
        const actBaseX = 1.5;
        const actBaseY = 4.5;
        
        const dx = strutMidX - actBaseX;
        const dy = strutMidY - actBaseY;
        const actAngle = Math.atan2(dy, dx);
        
        meshesObj.actuator.position.set(actBaseX + dx/2, actBaseY + dy/2, 0);
        meshesObj.actuator.rotation.z = actAngle - Math.PI/2;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (t, s) => animate(t, s, meshes)
    };
}

// Auto-generated missing stub
export function createRetractingLandingGear() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
