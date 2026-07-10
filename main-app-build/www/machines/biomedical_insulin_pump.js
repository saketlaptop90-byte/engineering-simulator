import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    
    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
    });

    const displayGlass = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.8
    });

    // 1. Pump Casing
    const casingGeo = new THREE.BoxGeometry(4, 6, 2);
    const casing = new THREE.Mesh(casingGeo, plastic);
    casing.position.set(0, 0, 0);
    casing.name = 'pump_casing';
    group.add(casing);
    parts.push({
        name: 'Pump Casing',
        mesh: casing,
        description: 'Durable, waterproof exterior housing protecting internal components.',
        material: 'Medical Grade Polymer',
        function: 'Environmental protection and structural integrity',
        assemblyOrder: 1,
        connections: ['LCD Display', 'Control Buttons', 'Reservoir Chamber'],
        failureEffect: 'Exposure of internal components to water and dust.',
        cascadeFailures: ['Circuit board short circuit', 'Motor corrosion'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 }
    });

    // 2. LCD Display Screen
    const screenGeo = new THREE.PlaneGeometry(3, 2);
    const screen = new THREE.Mesh(screenGeo, displayGlass);
    screen.position.set(0, 1.5, 1.01);
    screen.name = 'lcd_display';
    group.add(screen);
    parts.push({
        name: 'LCD Display',
        mesh: screen,
        description: 'High-contrast OLED screen for displaying blood glucose levels and pump status.',
        material: 'Gorilla Glass',
        function: 'User interface and status monitoring',
        assemblyOrder: 2,
        connections: ['Pump Casing', 'Microcontroller'],
        failureEffect: 'User cannot monitor status or adjust basal rates.',
        cascadeFailures: ['Hypoglycemia due to unmonitored insulin delivery'],
        originalPosition: { x: 0, y: 1.5, z: 1.01 },
        explodedPosition: { x: 0, y: 3, z: 3 }
    });

    // 3. Insulin Reservoir
    const reservoirGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 32);
    const reservoir = new THREE.Mesh(reservoirGeo, glass);
    reservoir.position.set(-0.8, -1, 0.5);
    reservoir.rotation.z = Math.PI / 2;
    reservoir.name = 'insulin_reservoir';
    
    // Glowing Insulin Liquid inside reservoir
    const liquidGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.8, 32);
    const liquid = new THREE.Mesh(liquidGeo, glowBlue);
    reservoir.add(liquid);

    group.add(reservoir);
    parts.push({
        name: 'Insulin Reservoir',
        mesh: reservoir,
        description: 'Sterile cartridge holding the insulin supply.',
        material: 'Medical Glass / Glowing Insulin',
        function: 'Stores fast-acting insulin',
        assemblyOrder: 3,
        connections: ['Pump Casing', 'Micro-Stepper Motor', 'Catheter Line'],
        failureEffect: 'Insulin leakage or contamination.',
        cascadeFailures: ['Pump mechanism jamming', 'Infection at infusion site'],
        originalPosition: { x: -0.8, y: -1, z: 0.5 },
        explodedPosition: { x: -3, y: -1, z: 2 }
    });

    // 4. Micro-Stepper Motor
    const motorGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const motor = new THREE.Mesh(motorGeo, darkSteel);
    motor.position.set(1.2, -1, 0.5);
    motor.rotation.z = Math.PI / 2;
    motor.name = 'stepper_motor';
    group.add(motor);
    parts.push({
        name: 'Micro-Stepper Motor',
        mesh: motor,
        description: 'High-precision motor driving the plunger to deliver exact microliters of insulin.',
        material: 'Steel / Copper Windings',
        function: 'Actuates the reservoir plunger',
        assemblyOrder: 4,
        connections: ['Insulin Reservoir', 'Microcontroller', 'Battery'],
        failureEffect: 'Inability to deliver insulin.',
        cascadeFailures: ['Hyperglycemia', 'Diabetic ketoacidosis'],
        originalPosition: { x: 1.2, y: -1, z: 0.5 },
        explodedPosition: { x: 3, y: -1, z: 0.5 }
    });

    // 5. Battery
    const batteryGeo = new THREE.BoxGeometry(1.5, 2.5, 1);
    const battery = new THREE.Mesh(batteryGeo, aluminum);
    battery.position.set(0.8, 1, -0.2);
    battery.name = 'battery_pack';
    
    const ledGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const led = new THREE.Mesh(ledGeo, glowGreen);
    led.position.set(0, 1.2, 0.5);
    battery.add(led);

    group.add(battery);
    parts.push({
        name: 'Lithium-Ion Battery Pack',
        mesh: battery,
        description: 'Rechargeable power source with power-status LED.',
        material: 'Aluminum / Lithium',
        function: 'Provides power to the motor and electronics',
        assemblyOrder: 5,
        connections: ['Microcontroller', 'Stepper Motor'],
        failureEffect: 'Complete system shutdown.',
        cascadeFailures: ['Loss of basal insulin delivery', 'Screen blackout'],
        originalPosition: { x: 0.8, y: 1, z: -0.2 },
        explodedPosition: { x: 2, y: 3, z: -2 }
    });

    // 6. Microcontroller / PCB
    const pcbGeo = new THREE.BoxGeometry(2.5, 3.5, 0.2);
    const pcb = new THREE.Mesh(pcbGeo, copper);
    pcb.position.set(-0.5, 1, -0.5);
    pcb.name = 'microcontroller_pcb';
    group.add(pcb);
    parts.push({
        name: 'Control Board (PCB)',
        mesh: pcb,
        description: 'The brain of the pump, computing basal rates and bolus doses.',
        material: 'FR4 / Copper / Silicon',
        function: 'Processes sensor data and controls the stepper motor',
        assemblyOrder: 6,
        connections: ['Battery', 'Stepper Motor', 'LCD Display'],
        failureEffect: 'Erratic insulin delivery.',
        cascadeFailures: ['Severe Hypoglycemia', 'System crash'],
        originalPosition: { x: -0.5, y: 1, z: -0.5 },
        explodedPosition: { x: -2, y: 2, z: -3 }
    });

    // 7. Catheter Line (Tube)
    const tubeGeo = new THREE.TorusGeometry(1, 0.05, 16, 50, Math.PI);
    const tube = new THREE.Mesh(tubeGeo, plastic);
    tube.position.set(-2, -1, 0.5);
    tube.rotation.x = Math.PI / 2;
    tube.name = 'catheter_tube';
    group.add(tube);
    parts.push({
        name: 'Infusion Catheter',
        mesh: tube,
        description: 'Flexible tube connecting the reservoir to the subcutaneous infusion site.',
        material: 'Teflon / Polyurethane',
        function: 'Transports insulin into the body',
        assemblyOrder: 7,
        connections: ['Insulin Reservoir', 'Infusion Site'],
        failureEffect: 'Insulin fails to reach the patient (occlusion/kink).',
        cascadeFailures: ['Unexplained hyperglycemia', 'Pump occlusion alarm triggered'],
        originalPosition: { x: -2, y: -1, z: 0.5 },
        explodedPosition: { x: -4, y: -2, z: 0.5 }
    });

    const description = "The biomedical insulin pump is a life-saving automated drug delivery system. It uses a high-precision micro-stepper motor to deliver continuous basal insulin and on-demand bolus doses. A robust microcontroller manages the delivery schedule while monitoring for system occlusions or power failures.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Micro-Stepper Motor in the insulin pump?",
            options: [
                "To recharge the battery",
                "To control the display screen brightness",
                "To drive the plunger and deliver precise microliters of insulin",
                "To measure blood glucose levels"
            ],
            correct: 2,
            explanation: "The micro-stepper motor converts electrical pulses into precise mechanical movements, advancing the reservoir plunger by exact increments to deliver accurate doses of insulin.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the Infusion Catheter becomes kinked or blocked (occlusion)?",
            options: [
                "The pump automatically administers a larger dose",
                "Insulin delivery stops, triggering an occlusion alarm and potentially leading to hyperglycemia",
                "The pump casing cracks",
                "The battery drains immediately"
            ],
            correct: 1,
            explanation: "An occlusion prevents insulin from reaching the patient. The pump detects the increased back-pressure, stops delivery, and sounds an alarm. Without insulin, the patient's blood sugar will rise.",
            difficulty: "Hard"
        },
        {
            question: "Why is an insulin pump typically equipped with a Lithium-Ion battery rather than connecting to a wall outlet?",
            options: [
                "Lithium-ion batteries are cheaper",
                "Wall outlets deliver too much voltage",
                "The pump must be portable and continuously worn by the patient 24/7",
                "To make the pump heavier and more robust"
            ],
            correct: 2,
            explanation: "Insulin pumps are wearable medical devices that must provide continuous basal insulin delivery throughout the patient's daily activities.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the micro-stepper motor slightly to simulate pumping
        if (meshes.stepper_motor) {
            meshes.stepper_motor.rotation.y = time * speed * 2;
        }
        
        // Pulse the battery LED to show it's active
        if (meshes.battery_pack && meshes.battery_pack.children.length > 0) {
            const led = meshes.battery_pack.children[0];
            led.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5;
        }

        // Slight pulsation of the insulin liquid inside the reservoir
        if (meshes.insulin_reservoir && meshes.insulin_reservoir.children.length > 0) {
            const liquid = meshes.insulin_reservoir.children[0];
            liquid.scale.set(
                1 + Math.sin(time * speed * 10) * 0.02, 
                1, 
                1 + Math.sin(time * speed * 10) * 0.02
            );
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createInsulinPump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
