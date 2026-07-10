import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM MATERIALS ---
    const plutoniumMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 3.0,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
    });

    const iridiumMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.3,
        metalness: 0.9,
    });

    const graphiteMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.2
    });
    
    const carbonCarbonMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.3
    });

    const ceramicMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.1
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 1.0,
        side: THREE.DoubleSide
    });

    // --- PART 1: PLUTONIUM-238 FUEL PELLETS ---
    const fuelGroup = new THREE.Group();
    const numPellets = 18;
    const pelletHeight = 0.5;
    const pelletRadius = 0.6;
    const pelletSpacing = 0.6;
    
    for (let i = 0; i < numPellets; i++) {
        const yPos = (i - numPellets / 2 + 0.5) * pelletSpacing;
        const pelletGeo = new THREE.CylinderGeometry(pelletRadius, pelletRadius, pelletHeight, 32);
        const pellet = new THREE.Mesh(pelletGeo, plutoniumMat);
        pellet.position.set(0, yPos, 0);
        fuelGroup.add(pellet);
    }
    group.add(fuelGroup);

    parts.push({
        name: "Plutonium-238 Fuel Pellets",
        description: "Pellets of Pu-238 dioxide that undergo alpha decay, generating intense heat (around 1200°C) required for thermoelectric conversion.",
        material: plutoniumMat,
        function: "Heat Generation",
        assemblyOrder: 1,
        connections: ["Iridium Cladding"],
        failureEffect: "Loss of thermal output, leading to power failure.",
        cascadeFailures: ["Thermocouples", "Electrical Output"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: fuelGroup
    });

    // --- PART 2: IRIDIUM CLADDING ---
    const claddingGroup = new THREE.Group();
    for (let i = 0; i < numPellets; i++) {
        const yPos = (i - numPellets / 2 + 0.5) * pelletSpacing;
        const cladGeo = new THREE.CylinderGeometry(pelletRadius + 0.05, pelletRadius + 0.05, pelletHeight + 0.05, 32);
        const clad = new THREE.Mesh(cladGeo, iridiumMat);
        clad.position.set(0, yPos, 0);
        claddingGroup.add(clad);
    }
    group.add(claddingGroup);

    parts.push({
        name: "Iridium Cladding",
        description: "A highly robust, high-melting-point noble metal shell encasing each fuel pellet to prevent radioactive material release during potential accidents.",
        material: iridiumMat,
        function: "Primary Containment",
        assemblyOrder: 2,
        connections: ["Fuel Pellets", "Graphite Impact Shell"],
        failureEffect: "Potential release of radioactive isotopes if subjected to extreme kinetic impact.",
        cascadeFailures: ["Environmental Contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 2 },
        mesh: claddingGroup
    });

    // --- PART 3: GRAPHITE IMPACT SHELLS (GIS) ---
    const gisGroup = new THREE.Group();
    for (let i = 0; i < numPellets/2; i++) {
        const yPos = (i * 2 - numPellets / 2 + 1) * pelletSpacing;
        const gisGeo = new THREE.CylinderGeometry(pelletRadius + 0.2, pelletRadius + 0.2, pelletHeight * 2 + 0.3, 32);
        const gis = new THREE.Mesh(gisGeo, graphiteMat);
        gis.position.set(0, yPos, 0);
        gisGroup.add(gis);
    }
    group.add(gisGroup);

    parts.push({
        name: "Graphite Impact Shells",
        description: "Thick graphite cylinders encasing the clad fuel pellets, designed to absorb kinetic energy and protect the fuel in the event of an atmospheric reentry and ground impact.",
        material: graphiteMat,
        function: "Kinetic Absorption",
        assemblyOrder: 3,
        connections: ["Iridium Cladding", "Carbon-Carbon Aeroshell"],
        failureEffect: "Reduced survivability of the core during catastrophic launch or reentry failures.",
        cascadeFailures: ["Iridium Cladding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 },
        mesh: gisGroup
    });

    // --- PART 4: CARBON-CARBON AEROSHELL (GPHS Modules) ---
    const aeroshellGroup = new THREE.Group();
    for (let i = 0; i < numPellets/4; i++) {
        const yPos = (i * 4 - numPellets / 2 + 2) * pelletSpacing;
        const width = pelletRadius * 2 + 0.8;
        const height = pelletHeight * 4 + 0.8;
        
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, -width/2);
        shape.lineTo(width/2, -width/2);
        shape.lineTo(width/2, width/2);
        shape.lineTo(-width/2, width/2);
        shape.lineTo(-width/2, -width/2);
        
        const extrudeSettings = { depth: height, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const aeroGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        aeroGeo.translate(0, 0, -height/2);
        aeroGeo.rotateX(Math.PI/2);
        
        const aero = new THREE.Mesh(aeroGeo, carbonCarbonMat);
        aero.position.set(0, yPos, 0);
        aeroshellGroup.add(aero);
    }
    group.add(aeroshellGroup);

    parts.push({
        name: "Carbon-Carbon Aeroshells",
        description: "Outer blocks of the General Purpose Heat Source (GPHS) modules. Designed to ablate and survive the extreme heat of accidental atmospheric reentry.",
        material: carbonCarbonMat,
        function: "Reentry Thermal Protection",
        assemblyOrder: 4,
        connections: ["Graphite Impact Shells", "Central Support Structure"],
        failureEffect: "Burn-up in the atmosphere during reentry.",
        cascadeFailures: ["Core Containment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 },
        mesh: aeroshellGroup
    });

    // --- PART 5: CORE SUPPORT STRUCTURE ---
    const supportGroup = new THREE.Group();
    const supportRadius = pelletRadius + 0.6;
    const supportHeight = numPellets * pelletSpacing + 2.0;
    
    const tieRodGeo = new THREE.CylinderGeometry(0.2, 0.2, supportHeight + 1, 16);
    const tieRod = new THREE.Mesh(tieRodGeo, steel);
    supportGroup.add(tieRod);
    
    const plateGeo = new THREE.CylinderGeometry(supportRadius, supportRadius, 0.3, 32);
    const topPlate = new THREE.Mesh(plateGeo, steel);
    topPlate.position.y = supportHeight / 2;
    const bottomPlate = new THREE.Mesh(plateGeo, steel);
    bottomPlate.position.y = -supportHeight / 2;
    supportGroup.add(topPlate);
    supportGroup.add(bottomPlate);
    
    group.add(supportGroup);

    parts.push({
        name: "Core Support Structure",
        description: "Titanium/Steel structural components that hold the stacked GPHS modules securely under launch vibration loads.",
        material: steel,
        function: "Structural Integrity",
        assemblyOrder: 5,
        connections: ["Aeroshells", "Inner Pressure Vessel"],
        failureEffect: "Displacement of heat source, uneven thermal distribution.",
        cascadeFailures: ["Thermocouples"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: supportGroup
    });

    // --- PART 6: MULTI-FOIL INSULATION ---
    const insulationGroup = new THREE.Group();
    const insRadius = supportRadius + 0.2;
    const insGeo = new THREE.CylinderGeometry(insRadius, insRadius, supportHeight, 64, 1, true);
    const insulation = new THREE.Mesh(insGeo, goldFoilMat);
    insulationGroup.add(insulation);
    group.add(insulationGroup);

    parts.push({
        name: "Multi-Foil Insulation",
        description: "Dozens of layers of molybdenum foil separated by quartz cloth. Directs the heat exclusively towards the thermoelectric elements, minimizing radial and axial heat leaks.",
        material: goldFoilMat,
        function: "Thermal Insulation",
        assemblyOrder: 6,
        connections: ["Support Structure", "Thermocouple Hot Shoes"],
        failureEffect: "Heat escapes without passing through thermocouples, drastically reducing electrical output.",
        cascadeFailures: ["Power Output"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: -4 },
        mesh: insulationGroup
    });

    // --- PART 7: THERMOELECTRIC COUPLES (UNICOUPLES) ---
    const tcGroup = new THREE.Group();
    const tcRadius = insRadius + 0.1;
    const tcRings = 16;
    const tcPerRing = 24;
    const tcLength = 1.2;
    
    const hotShoeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const legGeo = new THREE.BoxGeometry(0.1, 0.1, tcLength);
    const coldShoeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.1);

    for (let r = 0; r < tcRings; r++) {
        const yPos = (r - tcRings / 2 + 0.5) * (supportHeight / tcRings);
        for (let i = 0; i < tcPerRing; i++) {
            const angle = (i / tcPerRing) * Math.PI * 2;
            const tcAssembly = new THREE.Group();
            
            const hot = new THREE.Mesh(hotShoeGeo, graphiteMat);
            hot.position.z = 0;
            tcAssembly.add(hot);
            
            const pLeg = new THREE.Mesh(legGeo, ceramicMat);
            pLeg.position.set(-0.06, 0, tcLength/2);
            tcAssembly.add(pLeg);
            
            const nLeg = new THREE.Mesh(legGeo, ceramicMat);
            nLeg.position.set(0.06, 0, tcLength/2);
            tcAssembly.add(nLeg);
            
            const cold = new THREE.Mesh(coldShoeGeo, copper);
            cold.position.z = tcLength;
            tcAssembly.add(cold);
            
            tcAssembly.position.set(Math.cos(angle) * tcRadius, yPos, Math.sin(angle) * tcRadius);
            tcAssembly.lookAt(0, yPos, 0); // pointing inward
            tcAssembly.rotateY(Math.PI);
            
            tcGroup.add(tcAssembly);
        }
    }
    group.add(tcGroup);

    parts.push({
        name: "SiGe Thermocouples (Unicouples)",
        description: "Silicon-Germanium bimetallic couples that convert the temperature gradient (Seebeck effect) between the hot core and the cold outer space into electricity.",
        material: copper,
        function: "Energy Conversion",
        assemblyOrder: 7,
        connections: ["Insulation", "Cold Frame"],
        failureEffect: "Loss of power generation capability for the affected couples.",
        cascadeFailures: ["Overall Voltage Drop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 },
        mesh: tcGroup
    });

    // --- PART 8: ELECTRICAL WIRING HARNESS ---
    const wiringGroup = new THREE.Group();
    const wireRadius = tcRadius + tcLength + 0.1;
    
    for(let i=0; i<4; i++) {
        const path = new THREE.CurvePath();
        const points = [];
        for(let j=0; j<=20; j++) {
            const angle = (j/20) * Math.PI * 2;
            const y = (supportHeight/2) * Math.cos(angle * 2 + i);
            points.push(new THREE.Vector3(Math.cos(angle)*wireRadius, y, Math.sin(angle)*wireRadius));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.05, 8, true);
        const wire = new THREE.Mesh(tubeGeo, rubber);
        wiringGroup.add(wire);
    }
    group.add(wiringGroup);

    parts.push({
        name: "Wiring Harness",
        description: "Series-parallel wiring connecting hundreds of individual thermocouples to aggregate the generated voltage and current, ensuring redundancy if single couples fail.",
        material: rubber,
        function: "Power Transmission",
        assemblyOrder: 8,
        connections: ["Thermocouples", "Power Connectors"],
        failureEffect: "Open or short circuit, leading to complete or partial power loss.",
        cascadeFailures: ["Avionics Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 },
        mesh: wiringGroup
    });

    // --- PART 9: INNER PRESSURE VESSEL ---
    const vesselGroup = new THREE.Group();
    const vesselRadius = wireRadius + 0.3;
    const vesselHeight = supportHeight + 1.5;
    const vesselGeo = new THREE.CylinderGeometry(vesselRadius, vesselRadius, vesselHeight, 64, 1, false);
    const vessel = new THREE.Mesh(vesselGeo, aluminum);
    vesselGroup.add(vessel);
    group.add(vesselGroup);

    parts.push({
        name: "Inner Pressure Vessel / Cold Frame",
        description: "A hermetically sealed beryllium or aluminum shell that acts as the cold sink for the thermocouples and contains an inert cover gas (like argon) during ground operations.",
        material: aluminum,
        function: "Environmental Sealing & Heat Sink",
        assemblyOrder: 9,
        connections: ["Thermocouples", "Outer Casing"],
        failureEffect: "Loss of inert gas, potential oxidation of internal components before launch.",
        cascadeFailures: ["Thermocouple Degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 },
        mesh: vesselGroup
    });

    // --- PART 10: MASSIVE EXTERIOR RADIATOR FINS ---
    const finsGroup = new THREE.Group();
    const numFins = 8;
    const finWidth = 4.0;
    const finThickness = 0.15;
    const finHeight = vesselHeight;
    
    const finShape = new THREE.Shape();
    finShape.moveTo(0, -finHeight/2);
    finShape.lineTo(finWidth, -finHeight/2 + 0.5);
    finShape.lineTo(finWidth, finHeight/2 - 0.5);
    finShape.lineTo(0, finHeight/2);
    finShape.lineTo(0, -finHeight/2);
    
    const finExtrudeSettings = { depth: finThickness, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    
    for (let i = 0; i < numFins; i++) {
        const angle = (i / numFins) * Math.PI * 2;
        const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
        finGeo.translate(0, 0, -finThickness/2); 
        const fin = new THREE.Mesh(finGeo, darkSteel);
        
        fin.position.set(Math.cos(angle) * vesselRadius, 0, Math.sin(angle) * vesselRadius);
        fin.rotation.y = -angle; 
        
        const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, finWidth - 0.2, 16);
        pipeGeo.rotateZ(Math.PI/2);
        for(let p=0; p<4; p++) {
            const pipeY = -finHeight/3 + p * (finHeight/4.5);
            const pipe = new THREE.Mesh(pipeGeo, chrome);
            pipe.position.set(finWidth/2, pipeY, 0);
            fin.add(pipe);
        }

        finsGroup.add(fin);
    }
    group.add(finsGroup);

    parts.push({
        name: "Radiator Fins",
        description: "Massive aluminum or beryllium fins projecting radially to radiate excess waste heat into the vacuum of space, maintaining the necessary temperature gradient.",
        material: darkSteel,
        function: "Waste Heat Rejection",
        assemblyOrder: 10,
        connections: ["Outer Casing"],
        failureEffect: "Overheating of the entire RTG, leading to destruction of thermocouples and melting of components.",
        cascadeFailures: ["Complete System Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }, 
        mesh: finsGroup
    });

    // --- PART 11: GAS PURGE VALVES ---
    const valveGroup = new THREE.Group();
    const valveGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.8, 32);
    const valve1 = new THREE.Mesh(valveGeo, chrome);
    valve1.position.set(vesselRadius, vesselHeight/2 - 1, 0);
    valve1.rotation.z = -Math.PI/2;
    valveGroup.add(valve1);
    
    const valve2 = new THREE.Mesh(valveGeo, chrome);
    valve2.position.set(-vesselRadius, -vesselHeight/2 + 1, 0);
    valve2.rotation.z = Math.PI/2;
    valveGroup.add(valve2);
    
    group.add(valveGroup);

    parts.push({
        name: "Gas Purge Valves",
        description: "Valves used to flush the interior with inert gas while the RTG is on Earth, preventing oxygen from degrading the thermocouples at high temperatures.",
        material: chrome,
        function: "Atmospheric Control",
        assemblyOrder: 11,
        connections: ["Pressure Vessel"],
        failureEffect: "Inability to maintain inert atmosphere before launch.",
        cascadeFailures: ["Oxidation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 5, z: 0 },
        mesh: valveGroup
    });

    // --- PART 12: POWER INTERFACE RECEPTACLE ---
    const interfaceGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.5, 1.0, 0.5);
    const baseBox = new THREE.Mesh(baseGeo, darkSteel);
    baseBox.position.set(0, vesselHeight/2, vesselRadius + 0.2);
    interfaceGroup.add(baseBox);
    
    const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
    pinGeo.rotateX(Math.PI/2);
    for(let i=0; i<6; i++) {
        const pin = new THREE.Mesh(pinGeo, copper);
        pin.position.set(-0.5 + (i%3)*0.5, 0.2 - Math.floor(i/3)*0.4, 0.3);
        baseBox.add(pin);
    }
    group.add(interfaceGroup);

    parts.push({
        name: "Power Interface Receptacle",
        description: "The main electrical connector that links the RTG to the spacecraft's power distribution and telemetry bus.",
        material: darkSteel,
        function: "Electrical Output",
        assemblyOrder: 12,
        connections: ["Wiring Harness", "Spacecraft Bus"],
        failureEffect: "Inability to transfer generated power to the spacecraft.",
        cascadeFailures: ["Spacecraft Power Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 4 },
        mesh: interfaceGroup
    });

    // --- PART 13: END CAPS (DOMES) ---
    const domesGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(vesselRadius, 64, 32, 0, Math.PI * 2, 0, Math.PI/2);
    
    const topDome = new THREE.Mesh(domeGeo, aluminum);
    topDome.position.y = vesselHeight/2;
    domesGroup.add(topDome);
    
    const bottomDome = new THREE.Mesh(domeGeo, aluminum);
    bottomDome.position.y = -vesselHeight/2;
    bottomDome.rotation.x = Math.PI;
    domesGroup.add(bottomDome);
    
    group.add(domesGroup);

    parts.push({
        name: "Hemispherical End Caps",
        description: "Aerodynamic and pressure-retaining domes capping the cylindrical body of the RTG. Distributes structural stress and provides mounting surfaces.",
        material: aluminum,
        function: "Structural Closure",
        assemblyOrder: 13,
        connections: ["Inner Pressure Vessel"],
        failureEffect: "Breach of environmental seal.",
        cascadeFailures: ["Internal Contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: domesGroup
    });

    // --- PART 14: MOUNTING FLANGE ---
    const flangeGroup = new THREE.Group();
    const flangeGeo = new THREE.CylinderGeometry(vesselRadius + 0.5, vesselRadius + 0.5, 0.4, 64);
    const flange = new THREE.Mesh(flangeGeo, steel);
    flange.position.y = -vesselHeight/2 - 0.2;
    flangeGroup.add(flange);
    
    const holeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const holeMat = new THREE.MeshBasicMaterial({color: 0x000000});
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI*2;
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.set(Math.cos(angle)*(vesselRadius+0.25), 0, Math.sin(angle)*(vesselRadius+0.25));
        flange.add(hole);
    }
    group.add(flangeGroup);

    parts.push({
        name: "Mounting Flange",
        description: "Heavy-duty structural ring used to bolt the massive RTG assembly securely to the spacecraft bus, transferring launch vibration loads.",
        material: steel,
        function: "Structural Interface",
        assemblyOrder: 14,
        connections: ["Bottom End Cap", "Spacecraft Frame"],
        failureEffect: "RTG detaches during launch vibrations.",
        cascadeFailures: ["Total Mission Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -12, z: 0 },
        mesh: flangeGroup
    });

    // --- PART 15: TEMPERATURE TELEMETRY SENSORS ---
    const sensorGroup = new THREE.Group();
    const sensorGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    for(let i=0; i<8; i++) {
        const yPos = -vesselHeight/3 + (i%4)*(vesselHeight/4);
        const angle = (Math.floor(i/4) * Math.PI); 
        const sensor = new THREE.Mesh(sensorGeo, plastic);
        sensor.position.set(Math.cos(angle)*(vesselRadius+0.05), yPos, Math.sin(angle)*(vesselRadius+0.05));
        sensorGroup.add(sensor);
        
        const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8);
        const sWire = new THREE.Mesh(wireGeo, tinted);
        sWire.position.set(0, 0.5, 0);
        sensor.add(sWire);
    }
    group.add(sensorGroup);

    parts.push({
        name: "Telemetry Sensors",
        description: "Platinum resistance thermometers (PRTs) attached to the exterior to monitor fin and casing temperatures, ensuring the RTG operates within thermal limits.",
        material: plastic,
        function: "Diagnostics",
        assemblyOrder: 15,
        connections: ["Outer Casing", "Wiring Harness"],
        failureEffect: "Loss of temperature data; ground control cannot monitor RTG health.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: -5, z: 0 },
        mesh: sensorGroup
    });

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "Which radioactive isotope is primarily used in deep-space RTGs due to its favorable half-life and alpha decay properties?",
            options: [
                "Uranium-235",
                "Plutonium-238",
                "Strontium-90",
                "Americium-241"
            ],
            correctAnswer: 1,
            explanation: "Plutonium-238 is ideal because it undergoes alpha decay (which is easily shielded), generates substantial heat, and has a half-life of 87.7 years, providing steady power for decades."
        },
        {
            question: "What physical principle allows an RTG to convert heat directly into electricity without moving parts?",
            options: [
                "Photovoltaic Effect",
                "Piezoelectric Effect",
                "Seebeck Effect",
                "Compton Effect"
            ],
            correctAnswer: 2,
            explanation: "The Seebeck Effect occurs in thermocouples, where a temperature difference between two dissimilar electrical conductors or semiconductors produces a voltage."
        },
        {
            question: "Why does the RTG feature massive exterior radiator fins?",
            options: [
                "To increase aerodynamic stability during launch.",
                "To reject excess waste heat into space, maintaining a high temperature gradient.",
                "To capture solar radiation and supplement power.",
                "To act as communication antennas."
            ],
            correctAnswer: 1,
            explanation: "Thermocouples require a steep temperature gradient (hot inside, cold outside) to generate electricity. The fins efficiently radiate waste heat into the cold vacuum of space, keeping the cold-junction temperature low."
        },
        {
            question: "What is the primary purpose of the multi-layered Carbon-Carbon Aeroshells and Graphite Impact Shells?",
            options: [
                "To act as a moderator for nuclear fission.",
                "To protect the radioactive fuel from vaporizing or breaching during an accidental atmospheric reentry and impact.",
                "To conduct electricity from the thermocouples to the spacecraft.",
                "To provide structural support against micrometeorites."
            ],
            correctAnswer: 1,
            explanation: "Safety is paramount. In the event of a launch failure, these rugged, heat-resistant carbon components ensure the fuel pellets survive reentry heat and ground impact without releasing radioactive material."
        },
        {
            question: "Why is Iridium chosen as the cladding material for the individual Plutonium dioxide pellets?",
            options: [
                "It is highly radioactive and contributes to power generation.",
                "It is the cheapest metal available.",
                "It has an extremely high melting point and resists corrosion and chemical reactions even under extreme conditions.",
                "It is a perfect thermal insulator."
            ],
            correctAnswer: 2,
            explanation: "Iridium is a very dense, noble metal with a melting point above 2400°C. It serves as an ultra-durable primary containment vessel that won't melt or easily crack in severe accidents."
        }
    ];

    // --- ANIMATION ---
    const animate = (time, speed, meshes) => {
        const pulse = (Math.sin(time * speed * 2) + 1) / 2;
        plutoniumMat.emissiveIntensity = 2.0 + pulse * 1.5;

        group.rotation.y = time * speed * 0.1;
    };

    return { 
        group, 
        parts, 
        description: "Deep Space Radioisotope Thermoelectric Generator (RTG). A solid-state nuclear battery that converts heat from the natural radioactive decay of Plutonium-238 into electricity using arrays of thermocouples. Used on missions like Voyager, Cassini, Curiosity, and New Horizons.", 
        quizQuestions, 
        animate 
    };
}

// Auto-generated missing stub
export function createRTG() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
