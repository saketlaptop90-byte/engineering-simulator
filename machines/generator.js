import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createGenerator(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Part 1: Stator Frame
    const statorGroup = new THREE.Group();
    
    // Main housing shell
    const statorGeom = new THREE.CylinderGeometry(4.5, 4.5, 8, 32, 1, true);
    const statorMesh = new THREE.Mesh(statorGeom, castIron);
    statorMesh.rotation.z = Math.PI / 2;
    statorGroup.add(statorMesh);
    
    // Base
    const baseGeom = new THREE.BoxGeometry(5, 1, 6);
    const baseMesh = new THREE.Mesh(baseGeom, castIron);
    baseMesh.position.y = -4.8;
    statorGroup.add(baseMesh);
    
    // Ribs
    for (let i = -3; i <= 3; i += 3) {
        const ribGeom = new THREE.TorusGeometry(4.5, 0.3, 16, 64);
        const ribMesh = new THREE.Mesh(ribGeom, castIron);
        ribMesh.rotation.y = Math.PI / 2;
        ribMesh.position.x = i;
        statorGroup.add(ribMesh);
    }
    
    group.add(statorGroup);
    parts.push({
        name: "Stator Frame",
        description: "Outer housing of the generator that holds the stationary components in place and provides structural support.",
        material: "Cast Iron",
        function: "Provides mechanical protection, stability, and completes the magnetic circuit for the permanent magnets.",
        assemblyOrder: 1,
        connections: ["Permanent Magnets", "Bearings"],
        failureEffect: "Loss of structural integrity, severe vibration issues.",
        cascadeFailures: ["Rotor misalignment", "Bearing destruction"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 15, 0),
        group: statorGroup
    });

    // Part 2: Permanent Magnets
    const magnetsGroup = new THREE.Group();
    const northMaterial = tinted(castIron, 0xcc2222);
    const southMaterial = tinted(castIron, 0x2222cc);
    
    // North pole (Top)
    const northGeom = new THREE.BoxGeometry(7, 0.9, 4.5);
    const northMesh = new THREE.Mesh(northGeom, northMaterial);
    northMesh.position.set(0, 4.05, 0);
    magnetsGroup.add(northMesh);

    // South pole (Bottom)
    const southGeom = new THREE.BoxGeometry(7, 0.9, 4.5);
    const southMesh = new THREE.Mesh(southGeom, southMaterial);
    southMesh.position.set(0, -4.05, 0);
    magnetsGroup.add(southMesh);
    
    group.add(magnetsGroup);
    parts.push({
        name: "Permanent Magnets",
        description: "Stationary high-strength magnets that provide a constant and uniform magnetic field.",
        material: "Magnetic Material",
        function: "Creates the primary magnetic flux required for electromagnetic induction to occur.",
        assemblyOrder: 2,
        connections: ["Stator Frame"],
        failureEffect: "Loss of magnetic field, resulting in zero voltage output.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -15, 0),
        group: magnetsGroup
    });

    // Part 3: Armature (Rotor Core)
    const rotorGroup = new THREE.Group();
    const rotorGeom = new THREE.CylinderGeometry(2.8, 2.8, 6, 32);
    const rotorMesh = new THREE.Mesh(rotorGeom, darkSteel);
    rotorMesh.rotation.z = Math.PI / 2;
    rotorGroup.add(rotorMesh);
    
    for(let i=0; i<8; i++) {
        const toothGeom = new THREE.BoxGeometry(6, 0.6, 1.2);
        const toothMesh = new THREE.Mesh(toothGeom, darkSteel);
        toothMesh.position.y = 3.1;
        const toothPivot = new THREE.Group();
        toothPivot.rotation.x = (i * Math.PI * 2) / 8;
        toothPivot.add(toothMesh);
        rotorGroup.add(toothPivot);
    }
    group.add(rotorGroup);
    parts.push({
        name: "Armature (Rotor Core)",
        description: "Central spinning laminated iron core that holds the copper coils.",
        material: "Dark Steel",
        function: "Concentrates the magnetic lines of flux and carries the copper coils through the magnetic field.",
        assemblyOrder: 3,
        connections: ["Drive Shaft", "Copper Coils"],
        failureEffect: "Imbalance or overheating due to eddy currents if laminations fail.",
        cascadeFailures: ["Bearing damage", "Coil short circuit"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 0), // Remains at center
        group: rotorGroup
    });

    // Part 4: Copper Coils
    const coilsGroup = new THREE.Group();
    const coilsMeshGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const windingGroup = new THREE.Group();
        
        const topWire = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.5, 1.5), wireCoil);
        topWire.position.set(0, 3.4, 0);
        const bottomWire = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.5, 1.5), wireCoil);
        bottomWire.position.set(0, -3.4, 0);
        
        const end1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.3, 1.5), wireCoil);
        end1.position.set(3.1, 0, 0);
        const end2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.3, 1.5), wireCoil);
        end2.position.set(-3.1, 0, 0);
        
        windingGroup.add(topWire);
        windingGroup.add(bottomWire);
        windingGroup.add(end1);
        windingGroup.add(end2);
        
        // Offset by PI/8 to perfectly seat the coils in the rotor slots
        windingGroup.rotation.x = (i * Math.PI) / 4 + Math.PI / 8;
        coilsMeshGroup.add(windingGroup);
    }
    coilsGroup.add(coilsMeshGroup);
    group.add(coilsGroup);
    parts.push({
        name: "Copper Coils",
        description: "Windings of copper wire wrapped around the slots of the rotor core.",
        material: "Copper Wire",
        function: "Induces an electromotive force (EMF) as they rotate through the magnetic field.",
        assemblyOrder: 4,
        connections: ["Armature (Rotor Core)", "Commutator"],
        failureEffect: "Open circuit or short circuit, leading to loss of power output.",
        cascadeFailures: ["Insulation breakdown", "Armature meltdown"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 15),
        group: coilsGroup
    });

    // Part 5: Commutator
    const commutatorGroup = new THREE.Group();
    const commMeshGroup = new THREE.Group();
    
    // 4 Segments to match the 4 coil windings
    for (let i = 0; i < 4; i++) {
        const startAngle = i * Math.PI / 2 + 0.05;
        const length = Math.PI / 2 - 0.1;
        const geom = new THREE.CylinderGeometry(1.25, 1.25, 1.5, 16, 1, false, startAngle, length);
        const mesh = new THREE.Mesh(geom, copper);
        mesh.rotation.z = Math.PI / 2;
        commMeshGroup.add(mesh);
    }
    
    // Cross insulation in the gaps
    const insul1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 2.6), insulation);
    const insul2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.6, 0.1), insulation);
    commMeshGroup.add(insul1);
    commMeshGroup.add(insul2);
    
    commMeshGroup.position.x = 4;
    commutatorGroup.add(commMeshGroup);
    group.add(commutatorGroup);
    parts.push({
        name: "Commutator",
        description: "A split-ring cylinder on the shaft that rotates with the armature.",
        material: "Copper",
        function: "Reverses the current direction every half-turn, converting internally induced AC to DC output.",
        assemblyOrder: 5,
        connections: ["Copper Coils", "Carbon Brushes"],
        failureEffect: "Sparking and poor electrical contact.",
        cascadeFailures: ["Brush excessive wear", "Voltage drops"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(12, 0, 0),
        group: commutatorGroup
    });

    // Part 6: Carbon Brushes
    const brushGroup = new THREE.Group();
    
    const brushGeom = new THREE.BoxGeometry(0.8, 1, 0.8);
    const holderGeom = new THREE.BoxGeometry(1.2, 1, 1.2);
    
    // Top brush
    const brush1 = new THREE.Mesh(brushGeom, carbonFiber);
    brush1.position.set(4, 1.7, 0); 
    const holder1 = new THREE.Mesh(holderGeom, brass);
    holder1.position.set(4, 2.5, 0);

    // Bottom brush
    const brush2 = new THREE.Mesh(brushGeom, carbonFiber);
    brush2.position.set(4, -1.7, 0); 
    const holder2 = new THREE.Mesh(holderGeom, brass);
    holder2.position.set(4, -2.5, 0);

    brushGroup.add(brush1);
    brushGroup.add(brush2);
    brushGroup.add(holder1);
    brushGroup.add(holder2);
    group.add(brushGroup);
    parts.push({
        name: "Carbon Brushes",
        description: "Stationary carbon blocks held by brass mounts, pressing against the commutator.",
        material: "Carbon Fiber",
        function: "Conducts the generated electrical current from the rotating commutator to the stationary external circuit.",
        assemblyOrder: 6,
        connections: ["Commutator", "Output Terminals"],
        failureEffect: "Excessive wear, loss of contact, severe sparking.",
        cascadeFailures: ["Commutator pitting", "Loss of power"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(12, 10, 0),
        group: brushGroup
    });

    // Part 7: Drive Shaft
    const shaftGroup = new THREE.Group();
    const shaftGeom = new THREE.CylinderGeometry(0.5, 0.5, 16, 16);
    const shaftMesh = new THREE.Mesh(shaftGeom, steel);
    shaftMesh.rotation.z = Math.PI / 2;
    shaftGroup.add(shaftMesh);
    group.add(shaftGroup);
    parts.push({
        name: "Drive Shaft",
        description: "Central robust axle extending through the entire generator.",
        material: "Steel",
        function: "Transmits mechanical rotational energy from an external prime mover to the armature.",
        assemblyOrder: 7,
        connections: ["Armature (Rotor Core)", "Bearings", "Cooling Fan", "Commutator"],
        failureEffect: "Shearing or bending under high torque.",
        cascadeFailures: ["Rotor strike on stator", "Bearing destruction"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-15, 0, 0),
        group: shaftGroup
    });

    // Part 8: Output Terminals
    const terminalGroup = new THREE.Group();
    
    // Top Output connection
    const term1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), redAccent);
    term1.position.set(4, 3.3, 0);
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4), copper);
    wire1.position.set(4, 5.3, 0);

    // Bottom Output connection
    const term2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), blueAccent);
    term2.position.set(4, -3.3, 0);
    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4), copper);
    wire2.position.set(4, -5.3, 0);

    terminalGroup.add(term1);
    terminalGroup.add(wire1);
    terminalGroup.add(term2);
    terminalGroup.add(wire2);
    group.add(terminalGroup);
    parts.push({
        name: "Output Terminals",
        description: "External wire connections leading to the electrical load or grid.",
        material: "Brass and Copper",
        function: "Provides a connection point to transfer the generated electrical power to external devices.",
        assemblyOrder: 8,
        connections: ["Carbon Brushes"],
        failureEffect: "High resistance, melting from heat.",
        cascadeFailures: ["External circuit failure"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(12, 15, 0),
        group: terminalGroup
    });

    // Part 9: Cooling Fan
    const fanGroup = new THREE.Group();
    const fanMeshGroup = new THREE.Group();
    const hubGeom = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    const hubMesh = new THREE.Mesh(hubGeom, plastic);
    hubMesh.rotation.z = Math.PI / 2;
    fanMeshGroup.add(hubMesh);
    
    for(let i=0; i<8; i++) {
        const bladeGeom = new THREE.BoxGeometry(0.1, 3, 1.5);
        const blade = new THREE.Mesh(bladeGeom, plastic);
        blade.position.y = 1.8;
        blade.rotation.y = Math.PI / 6; // Pitch the blade to push air
        
        const bladePivot = new THREE.Group();
        bladePivot.rotation.x = (i * Math.PI * 2) / 8;
        bladePivot.add(blade);
        fanMeshGroup.add(bladePivot);
    }
    fanMeshGroup.position.x = -6;
    fanGroup.add(fanMeshGroup);
    group.add(fanGroup);
    parts.push({
        name: "Cooling Fan",
        description: "Radial fan attached to the non-drive end of the shaft.",
        material: "Plastic",
        function: "Forces cooling air over the coils and core to dissipate heat generated by electrical resistance.",
        assemblyOrder: 9,
        connections: ["Drive Shaft"],
        failureEffect: "Overheating of the generator components.",
        cascadeFailures: ["Insulation failure", "Coil burnout"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-25, 0, 0),
        group: fanGroup
    });

    // Part 10: Bearings
    const bearingGroup = new THREE.Group();
    
    const brGeomOuter = new THREE.CylinderGeometry(1.5, 1.5, 0.8, 32);
    const brGeomInner = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 32);
    
    // Front Bearing
    const bearing1 = new THREE.Group();
    const b1Outer = new THREE.Mesh(brGeomOuter, chrome);
    b1Outer.rotation.z = Math.PI / 2;
    const b1Inner = new THREE.Mesh(brGeomInner, darkSteel);
    b1Inner.rotation.z = Math.PI / 2;
    bearing1.add(b1Outer);
    bearing1.add(b1Inner);
    bearing1.position.x = 6;

    // Rear Bearing
    const bearing2 = new THREE.Group();
    const b2Outer = new THREE.Mesh(brGeomOuter, chrome);
    b2Outer.rotation.z = Math.PI / 2;
    const b2Inner = new THREE.Mesh(brGeomInner, darkSteel);
    b2Inner.rotation.z = Math.PI / 2;
    bearing2.add(b2Outer);
    bearing2.add(b2Inner);
    bearing2.position.x = -7;
    
    bearingGroup.add(bearing1);
    bearingGroup.add(bearing2);
    group.add(bearingGroup);
    parts.push({
        name: "Bearings",
        description: "Low-friction rolling elements supporting the drive shaft at both ends.",
        material: "Chrome Steel",
        function: "Allows the rotor and shaft to spin freely while keeping it perfectly centered within the stator.",
        assemblyOrder: 10,
        connections: ["Drive Shaft", "Stator Frame"],
        failureEffect: "Increased friction, seizing.",
        cascadeFailures: ["Shaft damage", "Rotor scraping against stator"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-15, -10, 0),
        group: bearingGroup
    });

    const description = "An Electromagnetic Generator converts mechanical energy into electrical energy using Faraday's law of induction. This model represents a DC generator with a split-ring commutator, showing the path from mechanical rotation to direct current output.";

    const quizQuestions = [
        {
            question: "According to Faraday's Law, what determines the magnitude of the induced EMF in a generator?",
            options: [
                "The rate of change of magnetic flux",
                "The static magnetic field strength",
                "The electrical resistance of the wire",
                "The physical size of the permanent magnets"
            ],
            correct: 0,
            explanation: "Faraday's Law states that the induced electromotive force (EMF) is directly proportional to the rate of change of the magnetic flux linked with the circuit.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of a split-ring commutator in a DC generator?",
            options: [
                "To increase the voltage output proportionally to the speed",
                "To convert the alternating current (AC) induced in the armature into direct current (DC)",
                "To reduce physical friction on the carbon brushes",
                "To act as a slip ring for uninterrupted AC output"
            ],
            correct: 1,
            explanation: "A split-ring commutator automatically reverses the connection to the external circuit every half-turn, converting the internally generated AC into DC output.",
            difficulty: "Medium"
        },
        {
            question: "What is the role of the central spinning iron core (armature) in a generator?",
            options: [
                "To generate its own independent magnetic field",
                "To act as a permanent magnet in case the main magnets fail",
                "To concentrate and guide the magnetic flux through the coils",
                "To physically cool the copper windings during operation"
            ],
            correct: 2,
            explanation: "The laminated iron core has high magnetic permeability, which concentrates the magnetic flux lines from the stator magnets, maximizing the induced EMF in the coils.",
            difficulty: "Medium"
        },
        {
            question: "Fleming's Right-Hand Rule is used to determine which of the following in a generator?",
            options: [
                "The direction of the static magnetic field",
                "The direction of the induced current",
                "The direction of the mechanical rotational force",
                "The required number of coil turns for a specific voltage"
            ],
            correct: 1,
            explanation: "In a generator, Fleming's Right-Hand Rule is used to find the direction of the induced current given the direction of the mechanical motion and the magnetic field.",
            difficulty: "Hard"
        },
        {
            question: "While a generator produces electrical energy from mechanical motion, what opposing force acts on the armature coils as current begins to flow through them?",
            options: [
                "Centrifugal force from rotation",
                "Gravitational force pushing down on the heavy core",
                "Lorentz force acting as a mechanical back-torque",
                "Nuclear strong force binding the copper atoms"
            ],
            correct: 2,
            explanation: "Once current flows, the magnetic field exerts a Lorentz force on the charge carriers, creating an electromagnetic back-torque that opposes the mechanical rotation, making the generator harder to turn under load.",
            difficulty: "Hard"
        },
        {
            question: "Which components are directly responsible for transferring electrical energy from the rotating armature to the stationary external circuit?",
            options: [
                "Cooling fan and bearings",
                "Carbon brushes and commutator",
                "Stator frame and magnets",
                "Drive shaft and rotor core"
            ],
            correct: 1,
            explanation: "The stationary carbon brushes maintain continuous sliding electrical contact with the rotating commutator to reliably extract the generated power into the external wires.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        const rotatingParts = ["Armature (Rotor Core)", "Copper Coils", "Commutator", "Drive Shaft", "Cooling Fan"];
        meshes.forEach(m => {
            if (rotatingParts.includes(m.name)) {
                // Rotate the group around the local X axis to simulate generator spinning
                m.group.rotation.x = time * speed * 3;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
