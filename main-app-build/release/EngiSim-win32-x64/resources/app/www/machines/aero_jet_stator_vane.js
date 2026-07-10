import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 1.2,
        metalness: 0.5,
        roughness: 0.4
    });
    
    const heatShieldMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.6,
        clearcoat: 0.2
    });

    const meshes = {};

    // 1. Casing / Outer Ring Segment
    const casingGeo = new THREE.CylinderGeometry(12, 12, 4, 32, 1, false, 0, Math.PI / 4);
    const casing = new THREE.Mesh(casingGeo, darkSteel);
    casing.position.set(0, 0, 0);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);
    meshes.casing = casing;

    parts.push({
        name: "Outer Casing Segment",
        description: "A section of the engine's outer structural ring supporting the variable stator vanes.",
        material: "Dark Steel",
        function: "Provides structural integrity, contains high pressure, and houses the vane actuation mechanism.",
        assemblyOrder: 1,
        connections: ["Actuator Ring", "Stator Vane Pivot"],
        failureEffect: "Structural failure, catastrophic engine decompresion, and possible uncontained debris.",
        cascadeFailures: ["Rotor blade collision", "Thrust loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 2. Actuator Ring
    const actuatorRingGeo = new THREE.TorusGeometry(12.5, 0.4, 16, 32, Math.PI / 4);
    const actuatorRing = new THREE.Mesh(actuatorRingGeo, aluminum);
    actuatorRing.position.set(0, 0, 0);
    group.add(actuatorRing);
    meshes.actuatorRing = actuatorRing;

    parts.push({
        name: "Actuator Ring (Unison Ring)",
        description: "A synchronized ring connected to all variable vanes in the stage.",
        material: "Aluminum",
        function: "Rotates to collectively change the angle of all variable stator vanes simultaneously.",
        assemblyOrder: 2,
        connections: ["Outer Casing", "Actuator Lever"],
        failureEffect: "Vanes become stuck at an incorrect angle, leading to compressor stall or surge.",
        cascadeFailures: ["Engine surge", "Flameout", "Overheating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: -5 }
    });

    // 3. Stator Vane (Variable Geometry)
    const vaneGeo = new THREE.BoxGeometry(0.5, 8, 3);
    const vane = new THREE.Mesh(vaneGeo, steel);
    // Move the pivot point
    vane.geometry.translate(0, 4, 0);
    const vanePivot = new THREE.Group();
    vanePivot.position.set(0, -2, 0);
    vanePivot.rotation.z = Math.PI / 8; // align somewhat with the segment
    vanePivot.add(vane);
    group.add(vanePivot);
    meshes.vanePivot = vanePivot;

    parts.push({
        name: "Variable Stator Vane (VSV)",
        description: "An aerodynamic foil whose pitch can be altered during operation.",
        material: "High-Temperature Steel",
        function: "Directs airflow onto the downstream rotor blades at the optimal angle for the current engine RPM, preventing stall.",
        assemblyOrder: 3,
        connections: ["Actuator Lever", "Inner Spindle"],
        failureEffect: "Disturbed airflow causing compressor stall, vibration, or reduced efficiency.",
        cascadeFailures: ["Compressor stall", "Blade stress", "Reduced thrust"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: -10, y: -2, z: 10 }
    });

    // 4. Actuator Lever (Linkage)
    const leverGeo = new THREE.BoxGeometry(0.3, 2, 0.3);
    const lever = new THREE.Mesh(leverGeo, chrome);
    lever.position.set(0, 8.5, 0);
    vanePivot.add(lever);
    meshes.lever = lever;

    parts.push({
        name: "Actuator Lever",
        description: "A small metal arm connecting the stator vane spindle to the actuator ring.",
        material: "Chrome/Steel",
        function: "Transmits the rotational movement from the unison ring to the individual stator vane.",
        assemblyOrder: 4,
        connections: ["Stator Vane Spindle", "Actuator Ring"],
        failureEffect: "Individual vane fails to rotate, causing localized airflow disruption.",
        cascadeFailures: ["Localized stall", "Asymmetric aerodynamic loads"],
        originalPosition: { x: 0, y: 8.5, z: 0 },
        explodedPosition: { x: -10, y: 25, z: 10 }
    });

    // 5. Sensor/Hydraulic Actuator Piston (Mock)
    const pistonCylinderGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 16);
    const pistonCylinder = new THREE.Mesh(pistonCylinderGeo, copper);
    pistonCylinder.position.set(10, 2, 0);
    pistonCylinder.rotation.z = Math.PI / 4;
    group.add(pistonCylinder);
    
    const pistonRodGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const pistonRod = new THREE.Mesh(pistonRodGeo, chrome);
    pistonRod.position.set(0, 2, 0);
    pistonCylinder.add(pistonRod);
    meshes.pistonRod = pistonRod;
    meshes.pistonCylinder = pistonCylinder;

    parts.push({
        name: "Hydraulic Actuator",
        description: "A piston powered by engine fuel pressure or hydraulics.",
        material: "Copper/Chrome",
        function: "Drives the movement of the actuator unison ring based on commands from the FADEC.",
        assemblyOrder: 5,
        connections: ["Actuator Ring", "Engine Control Unit"],
        failureEffect: "Inability to actuate VSVs, locking them in their current position.",
        cascadeFailures: ["Inability to throttle up/down safely", "Compressor stall during transient operation"],
        originalPosition: { x: 10, y: 2, z: 0 },
        explodedPosition: { x: 20, y: 5, z: 15 }
    });

    // 6. Neon Sensor nodes
    const sensorGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const sensor1 = new THREE.Mesh(sensorGeo, neonBlue);
    sensor1.position.set(0, 10, 0);
    vanePivot.add(sensor1);
    
    const sensor2 = new THREE.Mesh(sensorGeo, neonOrange);
    sensor2.position.set(0, 3, 1.5);
    pistonCylinder.add(sensor2);
    
    parts.push({
        name: "LVDT Position Sensors",
        description: "Linear Variable Differential Transformers glowing with status lights.",
        material: "Neon Glowing/Plastic",
        function: "Provides precise feedback to the engine controller regarding the actual physical position of the VSVs.",
        assemblyOrder: 6,
        connections: ["Hydraulic Actuator", "Stator Vane Spindle"],
        failureEffect: "FADEC loses position feedback, triggering fault mode or fixed vane scheduling.",
        cascadeFailures: ["Suboptimal engine performance", "Maintenance alerts"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: -10, y: 28, z: 12 }
    });

    const description = "The Variable Stator Vane (VSV) system in a modern aero jet engine compressor stage is critical for maintaining aerodynamic stability across a wide range of operating speeds. By adjusting the angle of incidence of the stator vanes, it ensures optimal airflow into the downstream rotor blades, preventing catastrophic compressor stalls and surges.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of Variable Stator Vanes (VSVs) in a jet engine compressor?",
            options: [
                "To cool the compressor blades",
                "To optimize the angle of airflow onto the rotor blades at various engine speeds",
                "To generate electrical power for the aircraft",
                "To mix fuel with the incoming air"
            ],
            correct: 1,
            explanation: "VSVs change their pitch to ensure the airflow strikes the spinning rotor blades at the optimal angle, preventing aerodynamic stall during changes in engine RPM.",
            difficulty: "Medium"
        },
        {
            question: "What component simultaneously adjusts all the variable vanes in a single compressor stage?",
            options: [
                "The Hydraulic Actuator",
                "The LVDT Sensor",
                "The Unison Ring (Actuator Ring)",
                "The FADEC"
            ],
            correct: 2,
            explanation: "The unison ring acts as a mechanical linkage connecting all the actuator levers, ensuring all vanes in that stage rotate together.",
            difficulty: "Easy"
        },
        {
            question: "What is the likely consequence if the VSV system fails and the vanes get stuck at a high-power angle while the engine is decelerating?",
            options: [
                "Compressor stall or surge",
                "Increased fuel efficiency",
                "The turbine will overspeed",
                "Nothing, modern engines can compensate automatically"
            ],
            correct: 0,
            explanation: "If the vanes do not close during deceleration, the angle of attack on the rotor blades becomes too high, leading to flow separation, compressor stall, or a violent surge.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // time is in seconds, speed is a multiplier
        
        // Simulate engine RPM changing
        const cycle = Math.sin(time * speed * 0.5); // ranges from -1 to 1
        
        // Vane rotates to adjust pitch (between roughly -15 and +15 degrees)
        if (meshesObj.vanePivot) {
            meshesObj.vanePivot.rotation.y = cycle * 0.3;
        }
        
        // Actuator ring rotates slightly to drive the levers
        if (meshesObj.actuatorRing) {
            meshesObj.actuatorRing.rotation.z = cycle * 0.1;
        }
        
        // Piston rod moves in and out
        if (meshesObj.pistonRod) {
            meshesObj.pistonRod.position.y = 2 + (cycle * 1.5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStatorVane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
