import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });
    
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.4
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const addPart = (name, mesh, partData) => {
        mesh.name = name;
        mesh.position.copy(partData.originalPosition);
        group.add(mesh);
        meshes[name] = mesh;
        
        parts.push({
            name,
            ...partData,
            mesh
        });
    };

    // 1. Base Tripod Stand
    const standGeom = new THREE.CylinderGeometry(0.2, 0.4, 4, 8);
    const stand = new THREE.Mesh(standGeom, aluminum);
    addPart('tripod_stand', stand, {
        description: 'Main support structure for the weather station components.',
        material: 'Aluminum',
        function: 'Provides stability and elevates sensors to standard measurement heights.',
        assemblyOrder: 1,
        connections: ['data_logger_box', 'solar_panel', 'sensor_boom'],
        failureEffect: 'Station collapse, damage to all components.',
        cascadeFailures: ['anemometer', 'solar_panel', 'data_logger'],
        originalPosition: new THREE.Vector3(0, 2, 0),
        explodedPosition: new THREE.Vector3(0, 0, 0)
    });

    // 2. Data Logger Enclosure
    const boxGeom = new THREE.BoxGeometry(1.2, 1.5, 0.8);
    const box = new THREE.Mesh(boxGeom, plastic);
    addPart('data_logger_box', box, {
        description: 'Weatherproof enclosure housing the central processing unit and data logger.',
        material: 'Plastic/Polycarbonate',
        function: 'Protects sensitive electronics from environmental hazards.',
        assemblyOrder: 2,
        connections: ['tripod_stand', 'solar_charge_controller'],
        failureEffect: 'Water ingress causing short circuits.',
        cascadeFailures: ['data_logger', 'telemetry_module'],
        originalPosition: new THREE.Vector3(0, 2.5, 0.6),
        explodedPosition: new THREE.Vector3(0, 2.5, 3)
    });

    // 3. Status LEDs
    const ledGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const led = new THREE.Mesh(ledGeom, glowingGreen);
    addPart('status_led', led, {
        description: 'System status indicator.',
        material: 'LED',
        function: 'Provides visual confirmation of system operation.',
        assemblyOrder: 3,
        connections: ['data_logger_box'],
        failureEffect: 'Loss of visual diagnostics.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, 2.8, 1.0),
        explodedPosition: new THREE.Vector3(0, 2.8, 4)
    });

    // 4. Solar Panel
    const panelGeom = new THREE.BoxGeometry(2, 0.1, 1.5);
    const panel = new THREE.Mesh(panelGeom, glass);
    panel.rotation.x = Math.PI / 4;
    addPart('solar_panel', panel, {
        description: 'Photovoltaic array for generating electrical power.',
        material: 'Glass/Silicon',
        function: 'Charges the internal battery system for continuous operation.',
        assemblyOrder: 4,
        connections: ['tripod_stand', 'solar_charge_controller'],
        failureEffect: 'Loss of power generation.',
        cascadeFailures: ['battery', 'data_logger'],
        originalPosition: new THREE.Vector3(0, 3.5, -0.8),
        explodedPosition: new THREE.Vector3(0, 5, -3)
    });

    // 5. Sensor Boom
    const boomGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const boom = new THREE.Mesh(boomGeom, aluminum);
    boom.rotation.z = Math.PI / 2;
    addPart('sensor_boom', boom, {
        description: 'Horizontal arm extending away from the main mast.',
        material: 'Aluminum',
        function: 'Mounting point for sensors to avoid flow distortion from the main mast.',
        assemblyOrder: 5,
        connections: ['tripod_stand', 'anemometer_base', 'temp_shield'],
        failureEffect: 'Sensor misalignment.',
        cascadeFailures: ['wind_speed', 'wind_direction'],
        originalPosition: new THREE.Vector3(0, 4.5, 0),
        explodedPosition: new THREE.Vector3(0, 7, 0)
    });

    // 6. Anemometer Base
    const aneBaseGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const aneBase = new THREE.Mesh(aneBaseGeom, steel);
    addPart('anemometer_base', aneBase, {
        description: 'Mounting and bearing housing for the anemometer.',
        material: 'Steel',
        function: 'Allows low-friction rotation of the anemometer cups.',
        assemblyOrder: 6,
        connections: ['sensor_boom', 'anemometer_rotor'],
        failureEffect: 'Bearing seizure.',
        cascadeFailures: ['anemometer_rotor'],
        originalPosition: new THREE.Vector3(-1.4, 4.7, 0),
        explodedPosition: new THREE.Vector3(-3, 8, 0)
    });

    // 7. Anemometer Rotor (Cups)
    const rotorGroup = new THREE.Group();
    const centerHubGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const centerHub = new THREE.Mesh(centerHubGeom, plastic);
    rotorGroup.add(centerHub);
    
    for(let i=0; i<3; i++) {
        const armGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const arm = new THREE.Mesh(armGeom, aluminum);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = 0.2 * Math.cos(i * Math.PI * 2 / 3);
        arm.position.z = 0.2 * Math.sin(i * Math.PI * 2 / 3);
        arm.rotation.y = -i * Math.PI * 2 / 3;
        rotorGroup.add(arm);

        const cupGeom = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI);
        const cup = new THREE.Mesh(cupGeom, glowingBlue);
        cup.position.x = 0.4 * Math.cos(i * Math.PI * 2 / 3);
        cup.position.z = 0.4 * Math.sin(i * Math.PI * 2 / 3);
        cup.rotation.y = -i * Math.PI * 2 / 3 + Math.PI/2;
        rotorGroup.add(cup);
    }
    
    addPart('anemometer_rotor', rotorGroup, {
        description: 'Three-cup rotor for wind speed measurement.',
        material: 'Plastic/Aluminum',
        function: 'Rotates at a speed proportional to wind velocity.',
        assemblyOrder: 7,
        connections: ['anemometer_base'],
        failureEffect: 'Inaccurate or zero wind speed reading.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(-1.4, 4.9, 0),
        explodedPosition: new THREE.Vector3(-3, 9, 0)
    });

    // 8. Wind Vane
    const vaneGroup = new THREE.Group();
    const vaneBaseGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
    const vaneBase = new THREE.Mesh(vaneBaseGeom, steel);
    vaneGroup.add(vaneBase);

    const tailGeom = new THREE.BoxGeometry(0.6, 0.4, 0.05);
    const tail = new THREE.Mesh(tailGeom, darkSteel);
    tail.position.set(0.3, 0.2, 0);
    vaneGroup.add(tail);

    const pointerGeom = new THREE.ConeGeometry(0.1, 0.3, 16);
    const pointer = new THREE.Mesh(pointerGeom, glowingRed);
    pointer.rotation.z = -Math.PI / 2;
    pointer.position.set(-0.3, 0.2, 0);
    vaneGroup.add(pointer);

    addPart('wind_vane', vaneGroup, {
        description: 'Aerodynamic pointer for wind direction.',
        material: 'Steel/Plastic',
        function: 'Aligns itself with the prevailing wind direction.',
        assemblyOrder: 8,
        connections: ['sensor_boom'],
        failureEffect: 'Constant or erratic wind direction readings.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(1.4, 4.7, 0),
        explodedPosition: new THREE.Vector3(3, 8, 0)
    });

    // 9. Radiation Shield (Temp/RH Sensor)
    const shieldGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const plateGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16);
        const plate = new THREE.Mesh(plateGeom, plastic);
        plate.position.y = i * 0.1;
        shieldGroup.add(plate);
    }
    addPart('radiation_shield', shieldGroup, {
        description: 'Multi-plate louvred shield.',
        material: 'UV-resistant Plastic',
        function: 'Protects temperature and humidity sensors from direct solar radiation while allowing airflow.',
        assemblyOrder: 9,
        connections: ['sensor_boom', 'temp_rh_sensor'],
        failureEffect: 'Artificially high temperature readings during sunny days.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0.5, 4.3, 0),
        explodedPosition: new THREE.Vector3(1, 6, 2)
    });

    // 10. Rain Gauge
    const rainGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const rain = new THREE.Mesh(rainGeom, chrome);
    addPart('rain_gauge', rain, {
        description: 'Tipping bucket rain gauge.',
        material: 'Chrome/Aluminum',
        function: 'Measures precipitation through a calibrated tipping mechanism.',
        assemblyOrder: 10,
        connections: ['tripod_stand'],
        failureEffect: 'Failure to record precipitation or false readings from debris.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(-0.8, 2.5, 0),
        explodedPosition: new THREE.Vector3(-2.5, 2.5, -2)
    });

    const description = "An Automated Weather Station (AWS) is a highly integrated scientific instrument platform designed to continuously measure, record, and transmit meteorological data. It typically includes sensors for wind speed, wind direction, temperature, humidity, solar radiation, and precipitation. The data is processed by a central data logger and powered autonomously by a solar array and battery subsystem. The mechanical design emphasizes durability, sensor accuracy (via radiation shields and boom mounting), and environmental protection.";

    const quizQuestions = [
        {
            question: "Why are the temperature and humidity sensors housed inside a multi-plate louvered shield?",
            options: [
                "To keep them warm during the winter",
                "To protect them from direct solar radiation while allowing airflow",
                "To prevent birds from nesting near the sensors",
                "To amplify the ambient temperature for more precise readings"
            ],
            correct: 1,
            explanation: "The radiation shield blocks direct sunlight, which would otherwise heat the sensor above the true ambient air temperature, while the louvers allow wind to ventilate the sensor.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the sensor boom in a weather station?",
            options: [
                "To act as a lightning rod",
                "To balance the weight of the solar panel",
                "To mount sensors away from the main mast to avoid airflow distortion",
                "To provide a handle for carrying the station"
            ],
            correct: 2,
            explanation: "The main mast can disrupt wind patterns. Mounting wind sensors on a horizontal boom ensures they measure undisturbed airflow.",
            difficulty: "Medium"
        },
        {
            question: "If the anemometer's bearings seize, what is the primary consequence?",
            options: [
                "The station will lose power",
                "Wind direction readings will become erratic",
                "The station will register zero or inaccurate wind speed",
                "The data logger will short circuit"
            ],
            correct: 2,
            explanation: "The anemometer requires low friction to spin accurately with the wind. Seized bearings will stop it from rotating properly, resulting in a reading of zero or artificially low wind speeds.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Anemometer spinning based on simulated wind
        if (meshes.anemometer_rotor) {
            meshes.anemometer_rotor.rotation.y += 0.05 * speed;
        }

        // Wind vane slight swaying
        if (meshes.wind_vane) {
            meshes.wind_vane.rotation.y = Math.sin(time * 0.001 * speed) * 0.2;
        }

        // Status LED blinking
        if (meshes.status_led) {
            const blink = Math.sin(time * 0.005 * speed) > 0 ? 1 : 0.2;
            meshes.status_led.material.emissiveIntensity = blink * 0.8;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAutomatedWeatherStation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
