import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for complex geometries
    function createPumpStation() {
        const station = new THREE.Group();
        
        // Base foundation
        const baseGeom = new THREE.CylinderGeometry(15, 16, 2, 64);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        station.add(base);

        // Main Water Tank
        const tankGeom = new THREE.CylinderGeometry(8, 8, 20, 64);
        const tank = new THREE.Mesh(tankGeom, aluminum);
        tank.position.set(0, 11, -4);
        station.add(tank);
        
        // Tank details
        const tankTopGeom = new THREE.SphereGeometry(8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const tankTop = new THREE.Mesh(tankTopGeom, aluminum);
        tankTop.position.set(0, 21, -4);
        station.add(tankTop);

        const tankBandsGeom = new THREE.TorusGeometry(8.1, 0.2, 16, 100);
        for(let i=0; i<3; i++) {
            const band = new THREE.Mesh(tankBandsGeom, darkSteel);
            band.position.set(0, 5 + i*7, -4);
            band.rotation.x = Math.PI / 2;
            station.add(band);
        }

        // Pump Motor Assembly
        const motorGroup = new THREE.Group();
        const motorBodyGeom = new THREE.CylinderGeometry(3, 3, 8, 64);
        const motorBody = new THREE.Mesh(motorBodyGeom, copper);
        motorBody.rotation.z = Math.PI / 2;
        motorGroup.add(motorBody);
        
        const coolingFins = new THREE.Group();
        const finGeom = new THREE.TorusGeometry(3.2, 0.2, 8, 64);
        for(let i=0; i<15; i++) {
            const fin = new THREE.Mesh(finGeom, darkSteel);
            fin.position.x = -3.5 + i * 0.5;
            fin.rotation.y = Math.PI / 2;
            coolingFins.add(fin);
        }
        motorGroup.add(coolingFins);

        const pumpHousingGeom = new THREE.SphereGeometry(3.5, 32, 32);
        const pumpHousing = new THREE.Mesh(pumpHousingGeom, steel);
        pumpHousing.position.x = 5;
        motorGroup.add(pumpHousing);

        motorGroup.position.set(0, 4, 8);
        station.add(motorGroup);
        meshes.motorAssembly = motorGroup;
        meshes.pumpHousing = pumpHousing;

        // Filtration System
        const filterGroup = new THREE.Group();
        const filterGeom = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
        const filter1 = new THREE.Mesh(filterGeom, chrome);
        filter1.position.set(-8, 6, 8);
        const filter2 = new THREE.Mesh(filterGeom, chrome);
        filter2.position.set(-12, 6, 8);
        
        filterGroup.add(filter1);
        filterGroup.add(filter2);
        
        // Connecting pipes for filters
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(5, 4, 8),
            new THREE.Vector3(0, 4, 12),
            new THREE.Vector3(-8, 4, 12),
            new THREE.Vector3(-8, 6, 8)
        ]);
        const pipeGeom = new THREE.TubeGeometry(pipePath, 64, 0.8, 16, false);
        const pipe = new THREE.Mesh(pipeGeom, steel);
        filterGroup.add(pipe);
        
        station.add(filterGroup);
        meshes.filters = filterGroup;

        // Control Panel
        const panelGroup = new THREE.Group();
        const panelBox = new THREE.BoxGeometry(4, 6, 1);
        const panel = new THREE.Mesh(panelBox, darkSteel);
        panel.position.set(8, 8, 8);
        
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), tinted);
        screen.position.set(8, 9, 8.51);
        
        const neonMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
        const light = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), neonMaterial);
        light.position.set(7, 7, 8.51);
        meshes.statusLight = light;
        
        panelGroup.add(panel);
        panelGroup.add(screen);
        panelGroup.add(light);
        station.add(panelGroup);

        return station;
    }

    function createSensors() {
        const sensors = new THREE.Group();
        meshes.moistureSensors = [];

        for (let i = 0; i < 5; i++) {
            const sensor = new THREE.Group();
            
            // Spike
            const spikeGeom = new THREE.ConeGeometry(0.2, 2, 16);
            const spike = new THREE.Mesh(spikeGeom, chrome);
            spike.rotation.x = Math.PI;
            sensor.add(spike);

            // Head
            const headGeom = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
            const head = new THREE.Mesh(headGeom, plastic);
            head.position.y = 1.5;
            sensor.add(head);
            
            // Antenna
            const antennaGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
            const antenna = new THREE.Mesh(antennaGeom, steel);
            antenna.position.set(0, 3, 0);
            sensor.add(antenna);

            const ledGeom = new THREE.SphereGeometry(0.1, 16, 16);
            const ledMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
            const led = new THREE.Mesh(ledGeom, ledMat);
            led.position.set(0, 4, 0);
            sensor.add(led);

            // Spread out in field
            sensor.position.set(-20 + Math.random()*40, 1, -20 - Math.random()*30);
            sensors.add(sensor);
            meshes.moistureSensors.push({ sensor, led });
        }
        
        return sensors;
    }

    function createWeatherStation() {
        const weatherGroup = new THREE.Group();
        
        // Pole
        const poleGeom = new THREE.CylinderGeometry(0.3, 0.3, 15, 32);
        const pole = new THREE.Mesh(poleGeom, steel);
        pole.position.y = 7.5;
        weatherGroup.add(pole);
        
        // Anemometer (Wind Speed)
        const anemometer = new THREE.Group();
        const crossGeom = new THREE.BoxGeometry(4, 0.1, 0.1);
        const cross1 = new THREE.Mesh(crossGeom, plastic);
        const cross2 = new THREE.Mesh(crossGeom, plastic);
        cross2.rotation.y = Math.PI / 2;
        anemometer.add(cross1);
        anemometer.add(cross2);
        
        const cupGeom = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI);
        for(let i=0; i<4; i++) {
            const cup = new THREE.Mesh(cupGeom, plastic);
            cup.rotation.x = Math.PI / 2;
            const angle = (i * Math.PI) / 2;
            cup.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
            cup.rotation.y = angle + Math.PI / 2;
            anemometer.add(cup);
        }
        anemometer.position.y = 15;
        weatherGroup.add(anemometer);
        meshes.anemometer = anemometer;
        
        // Solar Panel
        const panelGroup = new THREE.Group();
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2), steel);
        const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 4), tinted);
        solarPanel.position.set(1.5, 0.5, 0);
        solarPanel.rotation.z = Math.PI / 6;
        panelGroup.add(bracket);
        panelGroup.add(solarPanel);
        panelGroup.position.set(0, 12, 0);
        weatherGroup.add(panelGroup);

        weatherGroup.position.set(15, 0, -10);
        return weatherGroup;
    }

    function createIrrigationLines() {
        const linesGroup = new THREE.Group();
        meshes.waterDrops = [];

        // Main line
        const mainLineGeom = new THREE.CylinderGeometry(0.8, 0.8, 80, 32);
        const mainLine = new THREE.Mesh(mainLineGeom, plastic);
        mainLine.rotation.x = Math.PI / 2;
        mainLine.position.set(-12, 0.8, -30);
        linesGroup.add(mainLine);
        
        // Drip lines branching off
        for(let i = 0; i < 15; i++) {
            const zPos = -10 - (i * 4);
            const dripLineGeom = new THREE.CylinderGeometry(0.2, 0.2, 50, 16);
            const dripLine = new THREE.Mesh(dripLineGeom, rubber);
            dripLine.rotation.z = Math.PI / 2;
            dripLine.position.set(13, 0.2, zPos);
            linesGroup.add(dripLine);

            // Emitters
            for(let j = 0; j < 20; j++) {
                const emitterGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
                const emitter = new THREE.Mesh(emitterGeom, plastic);
                const xPos = -10 + (j * 2.5);
                emitter.position.set(xPos, 0.4, zPos);
                linesGroup.add(emitter);
                
                // Add simulated water drops for animation
                const dropGeom = new THREE.SphereGeometry(0.15, 16, 16);
                const dropMat = new THREE.MeshStandardMaterial({ color: 0x44aaff, transparent: true, opacity: 0.8 });
                const drop = new THREE.Mesh(dropGeom, dropMat);
                drop.position.set(xPos, 0.2, zPos);
                linesGroup.add(drop);
                meshes.waterDrops.push({
                    mesh: drop,
                    initialY: 0.2,
                    speed: Math.random() * 0.05 + 0.02,
                    offset: Math.random() * Math.PI * 2
                });
            }
        }
        
        return linesGroup;
    }

    // Assemble components
    const pumpStation = createPumpStation();
    const sensors = createSensors();
    const weatherStation = createWeatherStation();
    const irrigationLines = createIrrigationLines();

    group.add(pumpStation);
    group.add(sensors);
    group.add(weatherStation);
    group.add(irrigationLines);

    // Build the extremely detailed parts array
    parts.push({
        name: "Main Water Reservoir",
        description: "A massive aluminum-reinforced cylindrical tank capable of storing thousands of liters of agricultural water, equipped with structural banding and high-pressure release valves.",
        material: "Aluminum / Dark Steel",
        function: "Stores large quantities of filtered water ready for deployment across the crop grid, maintaining static head pressure.",
        assemblyOrder: 1,
        connections: ["Pump Station Intake", "Filtration Return Line"],
        failureEffect: "Loss of primary water supply, systemic irrigation failure, extreme pressure drops.",
        cascadeFailures: ["Pump Cavitation", "Crop Dehydration", "Filter Desiccation"],
        originalPosition: { x: 0, y: 11, z: -4 },
        explodedPosition: { x: 0, y: 30, z: -10 }
    });

    parts.push({
        name: "High-Capacity Centrifugal Pump",
        description: "An industrial copper-wound induction motor coupled to a stainless steel impeller housing, generating massive flow rates for expansive agricultural zones.",
        material: "Copper / Steel",
        function: "Draws water from the main reservoir and pushes it through the multi-stage filtration system into the primary delivery lines.",
        assemblyOrder: 2,
        connections: ["Reservoir Outlet", "Primary Filter Inlet"],
        failureEffect: "Zero water flow, immediate drop in line pressure to 0 PSI.",
        cascadeFailures: ["Motor Overheating", "Control Panel Fault", "Dry Line Stress"],
        originalPosition: { x: 0, y: 4, z: 8 },
        explodedPosition: { x: 10, y: 15, z: 20 }
    });

    parts.push({
        name: "Motor Cooling Fins",
        description: "An array of highly conductive dark steel radial fins tightly clamped around the centrifugal pump's stator casing to dissipate immense thermal loads.",
        material: "Dark Steel",
        function: "Maintains optimal operating temperature for the pump motor during continuous 24/7 irrigation cycles.",
        assemblyOrder: 3,
        connections: ["Centrifugal Pump Body"],
        failureEffect: "Thermal runaway in the motor coils.",
        cascadeFailures: ["Pump Seizure", "Electrical Short", "System Shutdown"],
        originalPosition: { x: -3, y: 4, z: 8 },
        explodedPosition: { x: -15, y: 5, z: 8 }
    });

    parts.push({
        name: "Multi-Stage Chrome Filtration Array",
        description: "Twin cylindrical highly polished chrome filter housings containing microscopic mesh screens and activated carbon to remove silt, algae, and particulates.",
        material: "Chrome / Steel",
        function: "Prevents microscopic emitters in the drip line from clogging by ensuring absolute water purity.",
        assemblyOrder: 4,
        connections: ["Pump Output", "Main Irrigation Line"],
        failureEffect: "Bypass of contaminated water, particulate accumulation in drip lines.",
        cascadeFailures: ["Drip Emitter Blockage", "Uneven Water Distribution", "Line Bursting"],
        originalPosition: { x: -10, y: 6, z: 8 },
        explodedPosition: { x: -25, y: 15, z: 15 }
    });

    parts.push({
        name: "Smart Control Panel",
        description: "A centralized ruggedized logic controller casing with a tinted weatherproof touchscreen and pulsing neon status indicators, running advanced AI crop models.",
        material: "Dark Steel / Tinted Glass",
        function: "Aggregates sensor data, weather forecasts, and historical crop needs to dynamically adjust pump speeds and valve states in real time.",
        assemblyOrder: 5,
        connections: ["Pump Relay", "Sensor Network Array", "Weather Station Data Link"],
        failureEffect: "Loss of automated control, system defaults to manual override or failsafe shutdown.",
        cascadeFailures: ["Overwatering", "Underwatering", "Sensor Data Loss"],
        originalPosition: { x: 8, y: 8, z: 8 },
        explodedPosition: { x: 25, y: 12, z: 5 }
    });

    parts.push({
        name: "Telemetry Moisture Sensors",
        description: "Spiked ground-penetrating nodes containing capacitive soil moisture probes, topped with high-gain antennas and red LED transmission indicators.",
        material: "Chrome / Plastic / Steel",
        function: "Measures volumetric water content and soil temperature at various depths, beaming data back to the central control panel.",
        assemblyOrder: 6,
        connections: ["Soil Substrate", "Wireless Control Network"],
        failureEffect: "Blind spots in irrigation logic, inaccurate localized watering.",
        cascadeFailures: ["Localized Crop Failure", "Water Waste"],
        originalPosition: { x: -5, y: 1, z: -15 },
        explodedPosition: { x: -5, y: -5, z: -25 }
    });

    parts.push({
        name: "Weather Station Mast",
        description: "A tall, sturdy galvanized steel pole anchoring atmospheric sensors to capture micro-climate variations directly at the crop site.",
        material: "Steel",
        function: "Elevates wind, solar, and rain sensors above the canopy to avoid interference.",
        assemblyOrder: 7,
        connections: ["Concrete Anchor", "Anemometer Base", "Solar Bracket"],
        failureEffect: "Structural collapse of sensory equipment in high winds.",
        cascadeFailures: ["Sensor Destruction", "Erroneous Weather Data"],
        originalPosition: { x: 15, y: 7.5, z: -10 },
        explodedPosition: { x: 30, y: 0, z: -30 }
    });

    parts.push({
        name: "High-Resolution Anemometer",
        description: "A quad-cup rotational wind speed sensor mounted on low-friction ceramic bearings for extreme accuracy.",
        material: "Plastic",
        function: "Detects wind speeds to determine evaporative loss and prevent aerosolized irrigation drift during high gales.",
        assemblyOrder: 8,
        connections: ["Weather Mast Apex"],
        failureEffect: "Failure to register high winds, resulting in inefficient spray or evaporation.",
        cascadeFailures: ["Water Loss to Evaporation", "Inaccurate Crop Modeling"],
        originalPosition: { x: 15, y: 15, z: -10 },
        explodedPosition: { x: 30, y: 25, z: -30 }
    });

    parts.push({
        name: "Photovoltaic Power Array",
        description: "An angled array of tinted monocrystalline solar cells bolted to the weather mast with heavy steel brackets.",
        material: "Tinted Glass / Steel",
        function: "Provides clean, independent power to the weather station and remote telemetry units, ensuring uninterrupted data flow.",
        assemblyOrder: 9,
        connections: ["Weather Mast Midsection"],
        failureEffect: "Depletion of sensor backup batteries during prolonged overcast conditions.",
        cascadeFailures: ["Loss of Weather Telemetry", "System Reverting to Historical Averages"],
        originalPosition: { x: 16.5, y: 12, z: -10 },
        explodedPosition: { x: 35, y: 12, z: -15 }
    });

    parts.push({
        name: "Primary Distribution Manifold",
        description: "A massive high-density polyethylene (HDPE) trunk line running perpendicular to the crop rows, heavily pressurized.",
        material: "Plastic",
        function: "Distributes the immense output from the pump station into smaller, manageable sub-mains and drip lines.",
        assemblyOrder: 10,
        connections: ["Pump Station Outlet", "Lateral Drip Lines"],
        failureEffect: "Catastrophic pressure loss and flooding of the primary access trench.",
        cascadeFailures: ["Complete Irrigation Halting", "Soil Erosion near Trench"],
        originalPosition: { x: -12, y: 0.8, z: -30 },
        explodedPosition: { x: -30, y: 5, z: -50 }
    });

    parts.push({
        name: "Lateral Drip Lines",
        description: "Flexible, UV-resistant rubber tubing stretching across the crop rows, internally pressure-compensated to ensure uniform flow.",
        material: "Rubber",
        function: "Carries water directly to the base of the plants, minimizing evaporation and maximizing absorption efficiency.",
        assemblyOrder: 11,
        connections: ["Primary Manifold", "Drip Emitters"],
        failureEffect: "Localized dry rows or burst lines causing extreme localized flooding.",
        cascadeFailures: ["Crop Wilting in Affected Rows", "Nutrient Leaching"],
        originalPosition: { x: 13, y: 0.2, z: -10 },
        explodedPosition: { x: 13, y: 8, z: 10 }
    });

    parts.push({
        name: "Pressure-Compensating Emitters",
        description: "Hundreds of highly engineered plastic labyrinth valves spliced into the drip lines, designed to release exactly 2 liters per hour regardless of line pressure.",
        material: "Plastic",
        function: "Ensures that the first plant on the line and the last plant receive the exact same microscopic water droplets.",
        assemblyOrder: 12,
        connections: ["Lateral Drip Lines"],
        failureEffect: "Clogging leads to dead plants; blowout leads to overwatering and fungal disease.",
        cascadeFailures: ["Root Rot", "Uneven Crop Yield"],
        originalPosition: { x: -10, y: 0.4, z: -10 },
        explodedPosition: { x: -10, y: -2, z: -10 }
    });
    
    parts.push({
        name: "Foundational Slab",
        description: "A heavy reinforced dark steel and concrete composite slab providing a vibration-dampening base for the massive pump hardware.",
        material: "Dark Steel",
        function: "Prevents the immense torque of the centrifugal pump from causing structural micro-fractures in the pipe joints.",
        assemblyOrder: 0,
        connections: ["Ground", "Pump Station Components"],
        failureEffect: "Severe vibration leading to metal fatigue across the entire assembly.",
        cascadeFailures: ["Pipe Ruptures", "Sensor Misalignment", "Motor Bearing Destruction"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    parts.push({
        name: "Pump Station Structural Base",
        description: "Large dark steel cylindrical plinth anchoring the water tank and motor assembly.",
        material: "Dark Steel",
        function: "Distributes the immense weight of thousands of liters of water securely to the foundation slab.",
        assemblyOrder: 1,
        connections: ["Foundational Slab", "Water Tank"],
        failureEffect: "Structural listing or collapse of the main reservoir.",
        cascadeFailures: ["Complete System Destruction", "Massive Flooding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 10 }
    });

    parts.push({
        name: "Main Filtration Connecting Pipe",
        description: "Thick curved stainless steel tubing bridging the immense pressure gap between the pump impeller and the delicate filtration screens.",
        material: "Steel",
        function: "Handles the highest pressure differential in the system, forcing raw water into the filtration grid.",
        assemblyOrder: 3,
        connections: ["Pump Housing", "Filter Stage 1"],
        failureEffect: "High-pressure blowout, resulting in geyser-like water loss.",
        cascadeFailures: ["Pump Cavitation", "Loss of all Line Pressure"],
        originalPosition: { x: 0, y: 4, z: 10 },
        explodedPosition: { x: -5, y: 20, z: 20 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the Pressure-Compensating Emitters in this hyper-realistic irrigation model?",
            options: [
                "To increase water pressure at the end of the line",
                "To ensure uniform droplet release rates across the entire crop row regardless of manifold pressure variations",
                "To filter out large particulates from the main tank",
                "To measure soil moisture locally at the root zone"
            ],
            correctAnswer: 1,
            explanation: "Pressure-compensating emitters use internal labyrinth pathways to maintain a steady flow rate (e.g., 2 L/hr), guaranteeing that plants near the pump and plants far from the pump receive the exact same volume of water."
        },
        {
            question: "Why is the High-Capacity Centrifugal Pump equipped with radial Dark Steel Cooling Fins?",
            options: [
                "For aesthetic industrial design",
                "To add structural weight to counteract motor torque",
                "To dissipate immense thermal loads generated during continuous 24/7 irrigation cycles",
                "To slice through debris that enters the pump housing"
            ],
            correctAnswer: 2,
            explanation: "Centrifugal pumps running massive agricultural volumes generate immense heat in their stator coils. Radial cooling fins increase surface area, allowing ambient air to dissipate this heat and prevent thermal runaway."
        },
        {
            question: "In this system, what triggers the cascade failure of 'Inaccurate Crop Modeling' and 'Water Loss to Evaporation'?",
            options: [
                "Failure of the Multi-Stage Chrome Filtration Array",
                "Breakdown of the High-Resolution Anemometer",
                "Depletion of the Photovoltaic Power Array",
                "Clogging of the Lateral Drip Lines"
            ],
            correctAnswer: 1,
            explanation: "The Anemometer measures wind speed. If it fails, the Smart Control Panel cannot calculate evaporative loss or prevent aerosol drift during high gales, leading to water waste and flawed AI crop modeling."
        },
        {
            question: "What catastrophic event occurs if the Main Filtration Connecting Pipe suffers a high-pressure blowout?",
            options: [
                "Pump cavitation and immediate loss of all downstream line pressure",
                "The solar panels will overcharge the battery system",
                "The soil moisture sensors will short circuit",
                "The water tank will implode due to vacuum forces"
            ],
            correctAnswer: 0,
            explanation: "This pipe carries the highest pressure in the system. A blowout causes all pumped water to instantly escape as a geyser, dropping downstream pressure to zero and starving the pump of resistance, causing cavitation."
        },
        {
            question: "How does the telemetry moisture sensor network communicate with the Smart Control Panel?",
            options: [
                "Through physical copper wires buried with the drip lines",
                "By analyzing water pressure changes in the primary manifold",
                "Via high-gain antennas transmitting data over a wireless control network",
                "Using optical lasers requiring line-of-sight to the weather mast"
            ],
            correctAnswer: 2,
            explanation: "The sensors are described as having spiked ground nodes topped with high-gain antennas that beam volumetric water content and soil temperature data wirelessly back to the central logic controller."
        }
    ];

    function animate(time, speed) {
        // Animate anemometer spinning
        if (meshes.anemometer) {
            meshes.anemometer.rotation.y = time * 2.5 * speed;
        }

        // Animate water drops simulating dripping from emitters
        if (meshes.waterDrops) {
            meshes.waterDrops.forEach(dropData => {
                const dropMesh = dropData.mesh;
                // Move down
                dropMesh.position.y -= dropData.speed * speed;
                
                // Fade out as it hits the ground
                dropMesh.material.opacity = Math.max(0, (dropMesh.position.y / dropData.initialY));
                
                // Reset drop
                if (dropMesh.position.y < 0) {
                    dropMesh.position.y = dropData.initialY;
                    dropMesh.material.opacity = 0.8;
                }
            });
        }

        // Pulse the telemetry sensor LEDs
        if (meshes.moistureSensors) {
            meshes.moistureSensors.forEach((sensorData, index) => {
                const intensity = (Math.sin(time * 3 * speed + index) + 1) / 2; // 0 to 1
                sensorData.led.material.emissiveIntensity = intensity * 3;
            });
        }

        // Status light on control panel blinks rapidly indicating processing
        if (meshes.statusLight) {
            meshes.statusLight.material.emissiveIntensity = Math.random() > 0.5 ? 2 : 0.5;
        }
        
        // Slight vibration of the motor assembly to simulate running state
        if (meshes.motorAssembly) {
            meshes.motorAssembly.position.x = (Math.random() - 0.5) * 0.02 * speed;
            meshes.motorAssembly.position.y = 4 + (Math.random() - 0.5) * 0.02 * speed;
        }
    }

    return {
        group,
        parts,
        description: "An advanced, hyper-realistic, AI-driven Smart Irrigation System. This massive infrastructure complex utilizes highly accurate environmental telemetry, dual-stage chrome filtration, and pressure-compensated drip networks to maximize crop yield while minimizing water waste.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createSmartIrrigation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
