export function createFlightManagementSystem(THREE) {
    const group = new THREE.Group();
    group.userData = {
        id: 'flight_management_system',
        name: 'Flight Management System',
        description: 'The Flight Management System (FMS) is a fundamental component of a modern airliner\'s avionics, providing centralized control for navigation, flight planning, and performance management.',
        parts: [],
        questions: [],
        animate: null
    };

    const materialCase = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.7 }); 
    const materialScreen = new THREE.MeshStandardMaterial({ color: 0x44aa44, emissive: 0x113311 });
    const materialMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const materialBlue = new THREE.MeshStandardMaterial({ color: 0x2244aa, roughness: 0.5 });
    const materialBus = new THREE.MeshStandardMaterial({ color: 0xaa2222, emissive: 0x550000 });

    // 1. CDU (Control Display Unit)
    const cduGeom = new THREE.BoxGeometry(1, 1.5, 0.2);
    const cdu = new THREE.Mesh(cduGeom, materialCase);
    cdu.position.set(-1.8, 0, 1);
    cdu.userData = { name: 'CDU', description: 'Control Display Unit used by pilots to interface with the FMS.' };
    group.add(cdu);
    group.userData.parts.push(cdu);

    // 2. Nav DB (Navigation Database)
    const navDbGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const navDb = new THREE.Mesh(navDbGeom, materialMetal);
    navDb.position.set(0, -0.6, 0);
    navDb.rotation.x = Math.PI / 2;
    navDb.userData = { name: 'Nav DB', description: 'Navigation Database storing route, waypoint, and airport data.' };
    group.add(navDb);
    group.userData.parts.push(navDb);

    // 3. GPS Receiver
    const gpsGeom = new THREE.BoxGeometry(0.6, 0.2, 0.6);
    const gps = new THREE.Mesh(gpsGeom, materialBlue);
    gps.position.set(1.5, 0.6, 0);
    gps.userData = { name: 'GPS Receiver', description: 'Receives satellite signals to determine precise aircraft position.' };
    group.add(gps);
    group.userData.parts.push(gps);

    // 4. INS (Inertial Navigation System)
    const insGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const ins = new THREE.Mesh(insGeom, materialCase);
    ins.position.set(1.5, -0.5, 0);
    ins.userData = { name: 'INS', description: 'Inertial Navigation System that tracks acceleration and rotation to estimate position without external signals.' };
    group.add(ins);
    group.userData.parts.push(ins);

    // 5. Autopilot Interface
    const apGeom = new THREE.BoxGeometry(1.2, 0.3, 0.4);
    const autopilot = new THREE.Mesh(apGeom, materialMetal);
    autopilot.position.set(0, 1.2, 0);
    autopilot.userData = { name: 'Autopilot Interface', description: 'Sends steering, speed, and altitude commands to the aircraft autopilot system.' };
    group.add(autopilot);
    group.userData.parts.push(autopilot);

    // 6. EFIS Displays
    const efisGeom = new THREE.BoxGeometry(1.2, 0.9, 0.1);
    const efis = new THREE.Mesh(efisGeom, materialScreen);
    efis.position.set(-1.8, 1.2, 0);
    efis.userData = { name: 'EFIS Displays', description: 'Electronic Flight Instrument System for displaying flight and navigation data to the pilots.' };
    group.add(efis);
    group.userData.parts.push(efis);

    // 7. Data Bus
    const busGeom = new THREE.CylinderGeometry(0.05, 0.05, 4.5, 8);
    const dataBus = new THREE.Mesh(busGeom, materialBus);
    dataBus.rotation.z = Math.PI / 2;
    dataBus.position.set(0, 0, -0.3);
    dataBus.userData = { name: 'Data Bus', description: 'ARINC 429 or similar data bus that transmits data between different avionic components.' };
    group.add(dataBus);
    group.userData.parts.push(dataBus);

    // 8. Processor Unit
    const procGeom = new THREE.BoxGeometry(1.2, 1, 0.5);
    const processor = new THREE.Mesh(procGeom, materialMetal);
    processor.position.set(0, 0.4, 0);
    processor.userData = { name: 'Processor Unit', description: 'The core computer that calculates flight paths, performance, and navigation data.' };
    group.add(processor);
    group.userData.parts.push(processor);

    // 9. Power Supply
    const powerGeom = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const powerSupply = new THREE.Mesh(powerGeom, materialCase);
    powerSupply.position.set(0, -1.2, -0.3);
    powerSupply.userData = { name: 'Power Supply', description: 'Provides regulated electrical power to the FMS and its peripherals.' };
    group.add(powerSupply);
    group.userData.parts.push(powerSupply);

    // 10. Sensors Interface
    const sensorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const sensors = new THREE.Mesh(sensorGeom, materialBlue);
    sensors.position.set(1.5, 1.2, -0.5);
    sensors.rotation.x = Math.PI / 2;
    sensors.userData = { name: 'Sensors Interface', description: 'Interface for various aircraft sensors like pitot-static systems and temperature probes.' };
    group.add(sensors);
    group.userData.parts.push(sensors);

    // Animation: Data bus pulses and Nav DB spins
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        // Pulse data bus emission
        const intensity = (Math.sin(time * 6) + 1) / 2;
        dataBus.material.emissive.setHex( Math.floor(0xcc * intensity) * 0x010000 );
        
        // Spin nav db slowly to indicate data reading
        navDb.rotation.y += delta * 1.5;
        
        // Slight hover effect for EFIS to simulate active interface
        efis.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * 2);
    };

    // 6 Quiz Questions
    group.userData.questions = [
        {
            question: "Which component is primarily used by pilots to input flight plans and interface with the FMS?",
            options: ["EFIS Displays", "CDU", "Processor Unit", "GPS Receiver"],
            correctAnswer: 1
        },
        {
            question: "What type of data is stored in the Navigation Database (Nav DB)?",
            options: ["Passenger entertainment media", "Route, waypoint, and airport data", "Real-time engine metrics", "Crew schedules"],
            correctAnswer: 1
        },
        {
            question: "Which system tracks acceleration and rotation to estimate the aircraft's position without relying on external signals?",
            options: ["INS", "GPS Receiver", "Data Bus", "Sensors Interface"],
            correctAnswer: 0
        },
        {
            question: "What is the primary function of the EFIS Displays?",
            options: ["Calculate descent trajectories", "Provide regulated electrical power", "Display flight and navigation data to pilots", "Control cabin pressure"],
            correctAnswer: 2
        },
        {
            question: "Which component calculates optimal flight paths and performance data?",
            options: ["CDU", "Processor Unit", "Power Supply", "Autopilot Interface"],
            correctAnswer: 1
        },
        {
            question: "How do the various avionic components of the FMS communicate with each other?",
            options: ["Via the INS", "Via the Data Bus", "Through mechanical linkages", "Using the Power Supply"],
            correctAnswer: 1
        }
    ];

    return group;
}
