export function createShakeTableSimulator(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Colors
    const colorFoundation = 0x808080;
    const colorPlaten = 0xa0a0a0;
    const colorActuator = 0xff4500;
    const colorBuilding = 0x4682b4;
    const colorBearings = 0xdcdcdc;
    const colorSensor = 0xffff00;
    const colorValve = 0x008000;
    const colorPump = 0x2f4f4f;
    const colorCable = 0x111111;
    const colorConsole = 0x1e90ff;

    // 1. FoundationBlock
    const foundationGeom = new THREE.BoxGeometry(10, 1, 10);
    const foundationMat = new THREE.MeshStandardMaterial({ color: colorFoundation });
    const foundationBlock = new THREE.Mesh(foundationGeom, foundationMat);
    foundationBlock.position.y = -0.5;
    group.add(foundationBlock);
    parts.push({ name: "FoundationBlock", object: foundationBlock, description: "Massive concrete base providing a reaction mass." });

    // 2. SlidingBearings
    const bearingGroup = new THREE.Group();
    const bearingGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    const bearingMat = new THREE.MeshStandardMaterial({ color: colorBearings });
    const bPos = [-4, 4];
    for(let x of bPos) {
        for(let z of bPos) {
            const bearing = new THREE.Mesh(bearingGeom, bearingMat);
            bearing.position.set(x, 0.25, z);
            bearingGroup.add(bearing);
        }
    }
    group.add(bearingGroup);
    parts.push({ name: "SlidingBearings", object: bearingGroup, description: "Low-friction bearings allowing the platen to move freely." });

    // 3. PlatenTable
    const platenGeom = new THREE.BoxGeometry(9, 0.5, 9);
    const platenMat = new THREE.MeshStandardMaterial({ color: colorPlaten });
    const platenTable = new THREE.Mesh(platenGeom, platenMat);
    platenTable.position.y = 0.75;
    group.add(platenTable);
    parts.push({ name: "PlatenTable", object: platenTable, description: "The rigid platform where test specimens are mounted." });

    // 4. HydraulicActuators
    const actuatorGroup = new THREE.Group();
    const actuatorGeom = new THREE.CylinderGeometry(0.3, 0.3, 2);
    const actuatorMat = new THREE.MeshStandardMaterial({ color: colorActuator });
    // X-axis actuator
    const actuatorX = new THREE.Mesh(actuatorGeom, actuatorMat);
    actuatorX.rotation.z = Math.PI / 2;
    actuatorX.position.set(-5, 0.75, 0);
    actuatorGroup.add(actuatorX);
    // Z-axis actuator
    const actuatorZ = new THREE.Mesh(actuatorGeom, actuatorMat);
    actuatorZ.rotation.x = Math.PI / 2;
    actuatorZ.position.set(0, 0.75, -5);
    actuatorGroup.add(actuatorZ);
    group.add(actuatorGroup);
    parts.push({ name: "HydraulicActuators", object: actuatorGroup, description: "High-force cylinders that drive the shake table in different axes." });

    // 5. TestBuilding
    const buildingGroup = new THREE.Group();
    const floorGeom = new THREE.BoxGeometry(4, 0.2, 4);
    const floorMat = new THREE.MeshStandardMaterial({ color: colorBuilding });
    const columnGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0x696969 });
    
    for (let i = 0; i < 3; i++) {
        const floorY = 0.85 + i * 1.5;
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.y = floorY;
        buildingGroup.add(floor);

        if (i < 2) {
            const colPos = [-1.8, 1.8];
            for (let x of colPos) {
                for (let z of colPos) {
                    const col = new THREE.Mesh(columnGeom, columnMat);
                    col.position.set(x, floorY + 0.75, z);
                    buildingGroup.add(col);
                }
            }
        }
    }
    buildingGroup.position.y = 0.25; // Relative to platen
    platenTable.add(buildingGroup);
    parts.push({ name: "TestBuilding", object: buildingGroup, description: "Multi-story scale model structure being tested for seismic response." });

    // 6. Accelerometers
    const sensorGroup = new THREE.Group();
    const sensorGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const sensorMat = new THREE.MeshStandardMaterial({ color: colorSensor });
    for (let i = 0; i < 3; i++) {
        const sensor = new THREE.Mesh(sensorGeom, sensorMat);
        sensor.position.set(2, 0.85 + i * 1.5 + 0.1, 2);
        buildingGroup.add(sensor);
        sensorGroup.add(sensor);
    }
    parts.push({ name: "Accelerometers", object: sensorGroup, description: "Sensors placed on the building floors to measure acceleration." });

    // 7. ControlValves
    const valveGroup = new THREE.Group();
    const valveGeom = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const valveMat = new THREE.MeshStandardMaterial({ color: colorValve });
    const valve1 = new THREE.Mesh(valveGeom, valveMat);
    valve1.position.set(-6, 0.75, 0);
    const valve2 = new THREE.Mesh(valveGeom, valveMat);
    valve2.position.set(0, 0.75, -6);
    valveGroup.add(valve1);
    valveGroup.add(valve2);
    group.add(valveGroup);
    parts.push({ name: "ControlValves", object: valveGroup, description: "Servo-valves regulating high-pressure hydraulic fluid to the actuators." });

    // 8. HydraulicPump
    const pumpGeom = new THREE.BoxGeometry(2, 2, 3);
    const pumpMat = new THREE.MeshStandardMaterial({ color: colorPump });
    const pump = new THREE.Mesh(pumpGeom, pumpMat);
    pump.position.set(-8, 1, -8);
    group.add(pump);
    parts.push({ name: "HydraulicPump", object: pump, description: "Hydraulic power unit supplying pressurized fluid." });

    // 9. FeedbackCables
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 4, 2),
        new THREE.Vector3(4, 2, 4),
        new THREE.Vector3(6, 0.5, 6),
        new THREE.Vector3(8, 0.5, 8)
    ]);
    const cableGeom = new THREE.TubeGeometry(cableCurve, 20, 0.05, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: colorCable });
    const cable = new THREE.Mesh(cableGeom, cableMat);
    group.add(cable);
    parts.push({ name: "FeedbackCables", object: cable, description: "Cables transmitting sensor data to the control system." });

    // 10. ControlConsole
    const consoleGeom = new THREE.BoxGeometry(2, 1.5, 1);
    const consoleMat = new THREE.MeshStandardMaterial({ color: colorConsole });
    const controlConsole = new THREE.Mesh(consoleGeom, consoleMat);
    controlConsole.position.set(8, 0.75, 8);
    group.add(controlConsole);
    parts.push({ name: "ControlConsole", object: controlConsole, description: "Computer interface for inputting earthquake records and monitoring tests." });

    const quiz = [
        {
            question: "What is the main purpose of the foundation block in a shake table?",
            options: ["To generate hydraulic pressure", "To provide a massive reaction mass to resist actuator forces", "To measure the acceleration of the building", "To slide along with the platen"],
            answer: 1
        },
        {
            question: "Which component directly pushes the platen table?",
            options: ["Sliding Bearings", "Hydraulic Pump", "Hydraulic Actuators", "Control Valves"],
            answer: 2
        },
        {
            question: "What do accelerometers mounted on the test building measure?",
            options: ["Temperature", "Hydraulic pressure", "Acceleration responses at various floors", "Displacement of the foundation"],
            answer: 2
        },
        {
            question: "What regulates the flow of high-pressure fluid to move the actuators accurately?",
            options: ["Control Valves", "Feedback Cables", "Sliding Bearings", "The Test Building"],
            answer: 0
        },
        {
            question: "Why are sliding bearings used between the foundation and the platen?",
            options: ["To anchor the platen securely", "To reduce friction while supporting the vertical load of the platen", "To absorb the seismic energy", "To generate electrical power"],
            answer: 1
        },
        {
            question: "Where are earthquake ground motion records inputted for the simulator?",
            options: ["Hydraulic Pump", "Control Console", "Foundation Block", "Accelerometers"],
            answer: 1
        }
    ];

    const animation = function(time) {
        // Simulate earthquake motion on the platen
        const freqX = 3.0;
        const freqZ = 4.5;
        const ampX = 0.3;
        const ampZ = 0.2;
        
        const dispX = Math.sin(time * freqX) * ampX;
        const dispZ = Math.cos(time * freqZ) * ampZ;
        
        platenTable.position.x = dispX;
        platenTable.position.z = dispZ;

        // Simulate building sway
        buildingGroup.rotation.z = -dispX * 0.15;
        buildingGroup.rotation.x = dispZ * 0.15;
    };

    group.userData = {
        parts: parts,
        quiz: quiz,
        animation: animation
    };

    return group;
}
