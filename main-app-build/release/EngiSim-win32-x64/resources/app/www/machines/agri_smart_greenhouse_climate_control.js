import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const ledGrowLightMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const hvacCoolAirMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });

    const hvacWarmAirMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });

    const sensorGlowMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0
    });

    const soilMoistureGlowMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.8
    });

    // 1. Structural Frame
    const frameGeo = new THREE.BoxGeometry(10, 0.5, 15);
    const frameMesh = new THREE.Mesh(frameGeo, aluminum);
    frameMesh.position.set(0, -0.25, 0);
    group.add(frameMesh);
    meshes.frame = frameMesh;
    parts.push({
        name: "Main Chassis Frame",
        description: "The sturdy aluminum base supporting the climate control unit and housing critical routing.",
        material: "Aluminum",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["HVAC Unit", "Sensor Array", "Grow Light Array"],
        failureEffect: "Structural instability leading to component misalignment.",
        cascadeFailures: ["Sensor miscalibration", "Vibration damage"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. HVAC Unit (Cooling/Heating)
    const hvacGeo = new THREE.BoxGeometry(3, 4, 4);
    const hvacMesh = new THREE.Mesh(hvacGeo, steel);
    hvacMesh.position.set(-3, 2, -4);
    group.add(hvacMesh);
    meshes.hvac = hvacMesh;
    parts.push({
        name: "Central HVAC Module",
        description: "High-efficiency heat pump for maintaining optimal temperature profiles.",
        material: "Steel/Copper",
        function: "Temperature regulation",
        assemblyOrder: 2,
        connections: ["Air Ducts", "Control Board"],
        failureEffect: "Temperature spikes or drops outside optimal crop range.",
        cascadeFailures: ["Crop thermal stress", "Humidity imbalance"],
        originalPosition: { x: -3, y: 2, z: -4 },
        explodedPosition: { x: -8, y: 2, z: -8 }
    });

    // 3. HVAC Fan
    const fanGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 16);
    const fanMesh = new THREE.Mesh(fanGeo, darkSteel);
    fanMesh.rotation.z = Math.PI / 2;
    fanMesh.position.set(1.5, 0, 0); // Relative to HVAC
    hvacMesh.add(fanMesh);
    meshes.hvacFan = fanMesh;
    parts.push({
        name: "Intake/Exhaust Fan",
        description: "Variable speed fan for circulating air through the heat exchanger.",
        material: "Dark Steel",
        function: "Air circulation",
        assemblyOrder: 3,
        connections: ["HVAC Unit"],
        failureEffect: "Poor air circulation and uneven temperature distribution.",
        cascadeFailures: ["HVAC compressor overload"],
        originalPosition: { x: -1.5, y: 2, z: -4 },
        explodedPosition: { x: -10, y: 2, z: -4 }
    });

    // 4. Humidifier/Dehumidifier Tank
    const moistureTankGeo = new THREE.CylinderGeometry(1, 1, 3, 16);
    const moistureTankMesh = new THREE.Mesh(moistureTankGeo, glass);
    moistureTankMesh.position.set(3, 1.5, -4);
    group.add(moistureTankMesh);
    meshes.moistureTank = moistureTankMesh;
    
    const waterLevelGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.5, 16);
    const waterLevelMesh = new THREE.Mesh(waterLevelGeo, hvacCoolAirMat);
    waterLevelMesh.position.set(0, -0.2, 0);
    moistureTankMesh.add(waterLevelMesh);
    meshes.waterLevel = waterLevelMesh;

    parts.push({
        name: "Moisture Control Reservoir",
        description: "Stores water for the ultrasonic humidifier and collects condensate from the dehumidifier.",
        material: "Glass/Plastic",
        function: "Humidity regulation",
        assemblyOrder: 4,
        connections: ["Control Board", "Irrigation System"],
        failureEffect: "Inability to control VPD (Vapor Pressure Deficit).",
        cascadeFailures: ["Fungal growth", "Stomatal closure in plants"],
        originalPosition: { x: 3, y: 1.5, z: -4 },
        explodedPosition: { x: 8, y: 1.5, z: -8 }
    });

    // 5. Smart Control Board (Brain)
    const boardGeo = new THREE.BoxGeometry(2, 2, 0.2);
    const boardMesh = new THREE.Mesh(boardGeo, plastic);
    boardMesh.position.set(0, 2, -6.5);
    group.add(boardMesh);
    meshes.board = boardMesh;

    const chipGeo = new THREE.BoxGeometry(0.5, 0.5, 0.1);
    const chipMesh = new THREE.Mesh(chipGeo, chrome);
    chipMesh.position.set(0, 0, 0.15);
    boardMesh.add(chipMesh);

    parts.push({
        name: "AI Control Core",
        description: "Processes sensor data and runs predictive models for energy-efficient climate control.",
        material: "PCB/Silicon",
        function: "System logic and control",
        assemblyOrder: 5,
        connections: ["Sensors", "HVAC Unit", "Grow Lights"],
        failureEffect: "Complete system shutdown or erratic control behavior.",
        cascadeFailures: ["Total crop loss if not manually overridden"],
        originalPosition: { x: 0, y: 2, z: -6.5 },
        explodedPosition: { x: 0, y: 2, z: -12 }
    });

    // 6. Sensor Array Unit
    const sensorGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorGlowMat);
    sensorMesh.position.set(0, 4, 0);
    group.add(sensorMesh);
    meshes.sensor = sensorMesh;
    parts.push({
        name: "Multi-modal Sensor Array",
        description: "Monitors Temp, Humidity, CO2, and PAR (Photosynthetically Active Radiation) levels.",
        material: "Plastic/Glass",
        function: "Data acquisition",
        assemblyOrder: 6,
        connections: ["AI Control Core"],
        failureEffect: "Blind spots in climate monitoring.",
        cascadeFailures: ["Inefficient resource usage", "Suboptimal plant growth"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 7. Grow Light Array (LED)
    const lightFrameGeo = new THREE.BoxGeometry(6, 0.2, 8);
    const lightFrameMesh = new THREE.Mesh(lightFrameGeo, aluminum);
    lightFrameMesh.position.set(0, 6, 2);
    group.add(lightFrameMesh);
    meshes.lightFrame = lightFrameMesh;

    const ledPanelGeo = new THREE.PlaneGeometry(5.5, 7.5);
    const ledPanelMesh = new THREE.Mesh(ledPanelGeo, ledGrowLightMat);
    ledPanelMesh.rotation.x = Math.PI / 2;
    ledPanelMesh.position.set(0, -0.11, 0);
    lightFrameMesh.add(ledPanelMesh);
    meshes.ledPanel = ledPanelMesh;

    parts.push({
        name: "Spectrum-Tuned LED Array",
        description: "Provides customized light spectrums optimized for different plant growth stages.",
        material: "Aluminum/LED",
        function: "Supplemental lighting",
        assemblyOrder: 7,
        connections: ["AI Control Core", "Power Grid"],
        failureEffect: "Reduced photosynthetic rate.",
        cascadeFailures: ["Stunted growth", "Delayed harvest"],
        originalPosition: { x: 0, y: 6, z: 2 },
        explodedPosition: { x: 0, y: 12, z: 2 }
    });

    // 8. CO2 Injector
    const co2Geo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const co2Mesh = new THREE.Mesh(co2Geo, tinted);
    co2Mesh.position.set(4, 1, 2);
    group.add(co2Mesh);
    meshes.co2 = co2Mesh;
    parts.push({
        name: "CO2 Injection System",
        description: "Supplements carbon dioxide to boost photosynthesis during high-light periods.",
        material: "Tinted Glass/Steel",
        function: "CO2 enrichment",
        assemblyOrder: 8,
        connections: ["AI Control Core"],
        failureEffect: "Suboptimal photosynthesis even with adequate light.",
        cascadeFailures: ["Lower yield"],
        originalPosition: { x: 4, y: 1, z: 2 },
        explodedPosition: { x: 10, y: 1, z: 4 }
    });


    const description = "The Agri Smart Greenhouse Climate Control system is an advanced AI-driven module designed to optimize plant growth environments. It seamlessly integrates HVAC, dynamic spectrum lighting, CO2 enrichment, and multimodal sensing. By continuously analyzing environmental data, it minimizes energy consumption while maximizing crop yield, adapting to external weather changes in real-time.";

    const quizQuestions = [
        {
            question: "Why is the HVAC fan speed variable in this smart system?",
            options: [
                "To reduce the noise for the plants",
                "To save energy when full airflow isn't needed and precisely control temperature gradients",
                "Because constant speed damages the motor quickly",
                "To blow away pests"
            ],
            correct: 1,
            explanation: "Variable speed fans allow the AI control core to fine-tune the airflow, saving energy while maintaining precise temperature and humidity profiles without abrupt changes.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary purpose of the multi-modal sensor array?",
            options: [
                "To provide decorative lighting",
                "To physically block sunlight when it's too bright",
                "To collect data on Temp, Humidity, CO2, and PAR for the AI core to make decisions",
                "To inject water directly into the soil"
            ],
            correct: 2,
            explanation: "The sensor array acts as the 'senses' of the system, gathering real-time data so the AI core can adjust the actuators (HVAC, lights, CO2).",
            difficulty: "Easy"
        },
        {
            question: "How does the CO2 injection system interact with the Grow Light Array?",
            options: [
                "CO2 is used to cool the LED lights",
                "CO2 is injected only when the lights are off",
                "CO2 enrichment is most effective when light levels (PAR) are high, as plants can utilize it for increased photosynthesis",
                "They do not interact at all"
            ],
            correct: 2,
            explanation: "Photosynthesis requires both light and CO2. Increasing CO2 is only beneficial if there is enough light available to drive the process, hence they are coordinated by the AI.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;

        // Rotate the HVAC fan rapidly
        if (activeMeshes.hvacFan) {
            activeMeshes.hvacFan.rotation.x += 0.2 * speed;
        }

        // Pulse the sensor array glow to simulate data collection
        if (activeMeshes.sensor) {
            const pulse = (Math.sin(time * 0.003 * speed) + 1) / 2; // 0 to 1
            activeMeshes.sensor.material.emissiveIntensity = 0.5 + 0.5 * pulse;
        }

        // Simulate LED panel light spectrum shifting slowly
        if (activeMeshes.ledPanel) {
            const hue = (Math.sin(time * 0.0005 * speed) * 0.1) + 0.8; // Shift around pink/purple
            activeMeshes.ledPanel.material.color.setHSL(hue, 1.0, 0.5);
            activeMeshes.ledPanel.material.emissive.setHSL(hue, 1.0, 0.4);
        }

        // Water level slight bobbing
        if (activeMeshes.waterLevel) {
            activeMeshes.waterLevel.position.y = -0.2 + Math.sin(time * 0.002 * speed) * 0.05;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createSmartGreenhouseClimateControl() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
