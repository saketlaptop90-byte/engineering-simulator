import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createNuclearReactor(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Part 1: Reactor Pressure Vessel
    const rpvGroup = new THREE.Group();
    const rpvBodyGeo = new THREE.CylinderGeometry(3, 3, 10, 32);
    const rpvBody = new THREE.Mesh(rpvBodyGeo, darkSteel);
    const rpvTopGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const rpvTop = new THREE.Mesh(rpvTopGeo, darkSteel);
    rpvTop.position.y = 5;
    const rpvBottomGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const rpvBottom = new THREE.Mesh(rpvBottomGeo, darkSteel);
    rpvBottom.position.y = -5;
    rpvGroup.add(rpvBody, rpvTop, rpvBottom);
    rpvGroup.position.set(-15, 0, 0);

    parts.push({
        name: "Reactor Pressure Vessel",
        description: "Massive steel cylindrical container that holds the nuclear reactor core.",
        material: "Dark Steel",
        function: "Contains the nuclear reaction and the high-pressure primary coolant.",
        assemblyOrder: 1,
        connections: ["Uranium Fuel Assemblies", "Control Rods", "Primary Coolant Loop"],
        failureEffect: "Loss of coolant, potential core meltdown.",
        cascadeFailures: ["Containment Building", "Primary Coolant Loop"],
        originalPosition: { x: -15, y: 0, z: 0 },
        explodedPosition: { x: -15, y: -10, z: 0 },
        group: rpvGroup
    });
    group.add(rpvGroup);

    // Part 2: Uranium Fuel Assemblies
    const fuelGroup = new THREE.Group();
    const fuelGeo = new THREE.BoxGeometry(0.2, 6, 0.2);
    const glowingGreen = tinted(greenAccent, 0x00ff00);
    glowingGreen.emissive = new THREE.Color(0x00ff00);
    glowingGreen.emissiveIntensity = 0.5;
    
    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            const rod = new THREE.Mesh(fuelGeo, glowingGreen);
            rod.position.set(i * 0.5, 0, j * 0.5);
            fuelGroup.add(rod);
        }
    }
    fuelGroup.position.set(-15, -1, 0);

    parts.push({
        name: "Uranium Fuel Assemblies",
        description: "The glowing core containing fissile U-235.",
        material: "Enriched Uranium (Glowing)",
        function: "Undergoes nuclear fission, releasing immense amounts of heat.",
        assemblyOrder: 2,
        connections: ["Reactor Pressure Vessel", "Control Rods"],
        failureEffect: "Overheating or cessation of reaction.",
        cascadeFailures: ["Reactor Pressure Vessel"],
        originalPosition: { x: -15, y: -1, z: 0 },
        explodedPosition: { x: -15, y: -1, z: 5 },
        group: fuelGroup
    });
    group.add(fuelGroup);

    // Part 3: Control Rods
    const rodsGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 8, 16);
    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const cRod = new THREE.Mesh(rodGeo, chrome);
            cRod.position.set(i * 0.5, 3, j * 0.5);
            rodsGroup.add(cRod);
        }
    }
    const rodPlateGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const rodPlate = new THREE.Mesh(rodPlateGeo, steel);
    rodPlate.position.y = 7;
    rodsGroup.add(rodPlate);
    rodsGroup.position.set(-15, 2, 0);

    parts.push({
        name: "Control Rods",
        description: "Neutron-absorbing rods made of boron, silver, or cadmium.",
        material: "Chrome / Cadmium",
        function: "Regulates the fission rate by absorbing neutrons when inserted into the core.",
        assemblyOrder: 3,
        connections: ["Reactor Pressure Vessel", "Uranium Fuel Assemblies"],
        failureEffect: "Uncontrolled chain reaction leading to overheating.",
        cascadeFailures: ["Uranium Fuel Assemblies", "Reactor Pressure Vessel"],
        originalPosition: { x: -15, y: 2, z: 0 },
        explodedPosition: { x: -15, y: 15, z: 0 },
        group: rodsGroup,
        isControlRods: true
    });
    group.add(rodsGroup);

    // Part 4: Primary Coolant Loop
    const primaryLoopGroup = new THREE.Group();
    
    // Pipe to Steam Generator
    class CustomCurve1 extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = -15 + t * 15;
            const y = 2 - t * 2;
            const z = 0;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const pipe1Geo = new THREE.TubeGeometry(new CustomCurve1(), 20, 0.5, 8, false);
    const pipe1 = new THREE.Mesh(pipe1Geo, redAccent);
    
    class CustomCurve2 extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = 0 - t * 15;
            const y = -4 + t * 2;
            const z = 0;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const pipe2Geo = new THREE.TubeGeometry(new CustomCurve2(), 20, 0.5, 8, false);
    const pipe2 = new THREE.Mesh(pipe2Geo, blueAccent); // cooler return
    
    primaryLoopGroup.add(pipe1, pipe2);

    parts.push({
        name: "Primary Coolant Loop",
        description: "Thick pipes carrying superheated, highly pressurized water.",
        material: "Steel (Red/Hot)",
        function: "Transfers heat from the reactor core to the steam generator without boiling.",
        assemblyOrder: 4,
        connections: ["Reactor Pressure Vessel", "Steam Generator"],
        failureEffect: "Loss of coolant accident (LOCA), core melts.",
        cascadeFailures: ["Reactor Pressure Vessel", "Uranium Fuel Assemblies"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -7.5, y: 0, z: -5 },
        group: primaryLoopGroup
    });
    group.add(primaryLoopGroup);

    // Part 5: Steam Generator
    const sgGroup = new THREE.Group();
    const sgBodyGeo = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);
    const sgBody = new THREE.Mesh(sgBodyGeo, steel);
    const sgTopGeo = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const sgTop = new THREE.Mesh(sgTopGeo, steel);
    sgTop.position.y = 6;
    const sgBottomGeo = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const sgBottom = new THREE.Mesh(sgBottomGeo, steel);
    sgBottom.position.y = -6;
    sgGroup.add(sgBody, sgTop, sgBottom);
    sgGroup.position.set(0, 0, 0);

    parts.push({
        name: "Steam Generator",
        description: "A large heat exchanger vessel.",
        material: "Steel",
        function: "Uses heat from the primary loop to boil water in the secondary loop into steam.",
        assemblyOrder: 5,
        connections: ["Primary Coolant Loop", "Secondary Coolant Loop"],
        failureEffect: "Steam line break, loss of heat sink.",
        cascadeFailures: ["Primary Coolant Loop", "Secondary Coolant Loop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        group: sgGroup
    });
    group.add(sgGroup);

    // Part 6: Secondary Coolant Loop
    const secondaryLoopGroup = new THREE.Group();
    class CustomCurve3 extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = 0 + t * 15;
            const y = 5 - t * 5;
            const z = 0;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const pipe3Geo = new THREE.TubeGeometry(new CustomCurve3(), 20, 0.6, 8, false);
    const pipe3 = new THREE.Mesh(pipe3Geo, tinted(blueAccent, 0x00ccff)); // steam
    
    class CustomCurve4 extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = 15 - t * 15;
            const y = -8 + t * 4;
            const z = 0;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const pipe4Geo = new THREE.TubeGeometry(new CustomCurve4(), 20, 0.5, 8, false);
    const pipe4 = new THREE.Mesh(pipe4Geo, blueAccent); // return water
    
    secondaryLoopGroup.add(pipe3, pipe4);

    parts.push({
        name: "Secondary Coolant Loop",
        description: "Pipes carrying steam to the turbine and liquid water back.",
        material: "Steel",
        function: "Transports steam to spin the turbine and returns condensed water.",
        assemblyOrder: 6,
        connections: ["Steam Generator", "Steam Turbine", "Condenser"],
        failureEffect: "Loss of driving force for turbine.",
        cascadeFailures: ["Steam Turbine", "Generator"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 7.5, y: 0, z: -5 },
        group: secondaryLoopGroup
    });
    group.add(secondaryLoopGroup);

    // Part 7: Steam Turbine
    const turbineGroup = new THREE.Group();
    const turbineShaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const turbineShaft = new THREE.Mesh(turbineShaftGeo, chrome);
    turbineShaft.rotation.z = Math.PI / 2;
    turbineGroup.add(turbineShaft);

    for (let i = -3; i <= 3; i += 1.5) {
        const bladeDiscGeo = new THREE.CylinderGeometry(2.5 + (i * 0.2), 2.5 + (i * 0.2), 0.2, 32);
        const bladeDisc = new THREE.Mesh(bladeDiscGeo, titanium);
        bladeDisc.rotation.z = Math.PI / 2;
        bladeDisc.position.x = i;
        turbineGroup.add(bladeDisc);
    }
    turbineGroup.position.set(15, 0, 0);

    parts.push({
        name: "Steam Turbine",
        description: "A spinning bladed cylinder driven by high-pressure steam.",
        material: "Titanium / Steel",
        function: "Converts the thermal energy of steam into mechanical rotational energy.",
        assemblyOrder: 7,
        connections: ["Secondary Coolant Loop", "Generator", "Condenser"],
        failureEffect: "Loss of mechanical power, vibration damage.",
        cascadeFailures: ["Generator"],
        originalPosition: { x: 15, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 5, z: 0 },
        group: turbineGroup,
        isTurbine: true
    });
    group.add(turbineGroup);

    // Part 8: Generator
    const generatorGroup = new THREE.Group();
    const genBodyGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const genBody = new THREE.Mesh(genBodyGeo, copper);
    genBody.rotation.z = Math.PI / 2;
    generatorGroup.add(genBody);
    
    const genEndGeo = new THREE.CylinderGeometry(2.1, 2.1, 1, 32);
    const genEnd1 = new THREE.Mesh(genEndGeo, darkSteel);
    genEnd1.rotation.z = Math.PI / 2;
    genEnd1.position.x = 3;
    const genEnd2 = new THREE.Mesh(genEndGeo, darkSteel);
    genEnd2.rotation.z = Math.PI / 2;
    genEnd2.position.x = -3;
    generatorGroup.add(genEnd1, genEnd2);
    
    generatorGroup.position.set(24, 0, 0);

    parts.push({
        name: "Generator",
        description: "An electrical machine containing large copper coils and magnets.",
        material: "Copper / Dark Steel",
        function: "Converts mechanical rotational energy from the turbine into electrical energy.",
        assemblyOrder: 8,
        connections: ["Steam Turbine"],
        failureEffect: "Loss of electrical power output.",
        cascadeFailures: [],
        originalPosition: { x: 24, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 },
        group: generatorGroup
    });
    group.add(generatorGroup);

    // Part 9: Condenser
    const condenserGroup = new THREE.Group();
    const condBoxGeo = new THREE.BoxGeometry(8, 4, 6);
    const condBox = new THREE.Mesh(condBoxGeo, steel);
    condenserGroup.add(condBox);
    
    const coolingTubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
    for (let i = -2; i <= 2; i++) {
        for (let j = -1; j <= 1; j++) {
            const tube = new THREE.Mesh(coolingTubeGeo, blueAccent);
            tube.rotation.z = Math.PI / 2;
            tube.position.set(0, j, i);
            condenserGroup.add(tube);
        }
    }
    condenserGroup.position.set(15, -6, 0);

    parts.push({
        name: "Condenser",
        description: "A heat exchanger cooling array at the bottom of the turbine.",
        material: "Steel / Blue Pipes",
        function: "Cools the exhaust steam back into liquid water to be pumped back to the steam generator.",
        assemblyOrder: 9,
        connections: ["Steam Turbine", "Secondary Coolant Loop"],
        failureEffect: "Loss of vacuum, turbine trips, inability to condense steam.",
        cascadeFailures: ["Steam Turbine", "Secondary Coolant Loop"],
        originalPosition: { x: 15, y: -6, z: 0 },
        explodedPosition: { x: 15, y: -12, z: 0 },
        group: condenserGroup
    });
    group.add(condenserGroup);

    // Part 10: Containment Building
    const containmentGroup = new THREE.Group();
    
    // Dome (cutaway)
    const domeGeo = new THREE.SphereGeometry(12, 32, 16, 0, Math.PI, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, whitePlastic); // looks like concrete
    dome.position.y = 10;
    
    // Cylinder wall (cutaway)
    const wallGeo = new THREE.CylinderGeometry(12, 12, 20, 32, 1, false, 0, Math.PI);
    const wall = new THREE.Mesh(wallGeo, whitePlastic);
    
    // Floor
    const floorGeo = new THREE.CylinderGeometry(12.5, 12.5, 1, 32);
    const floor = new THREE.Mesh(floorGeo, darkSteel);
    floor.position.y = -10.5;

    containmentGroup.add(dome, wall, floor);
    containmentGroup.position.set(-8, 0, 0);

    parts.push({
        name: "Containment Building",
        description: "A thick reinforced concrete and steel dome.",
        material: "Concrete (White Plastic representation)",
        function: "Confines radioactive materials in case of an accident and protects the reactor from external threats.",
        assemblyOrder: 10,
        connections: ["Reactor Pressure Vessel", "Steam Generator", "Primary Coolant Loop"],
        failureEffect: "Release of radioactive material to the environment.",
        cascadeFailures: [],
        originalPosition: { x: -8, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: -15 },
        group: containmentGroup
    });
    group.add(containmentGroup);

    const description = "A Pressurized Water Reactor (PWR) is a common type of nuclear reactor. It uses enriched uranium fuel to produce heat through nuclear fission. The core is cooled by pressurized water (primary loop), which transfers heat to a steam generator without boiling. The steam generator boils water in a separate secondary loop, creating steam that drives a turbine connected to an electrical generator.";

    const quizQuestions = [
        {
            question: "What is the primary difference between nuclear fission and fusion?",
            options: [
                "Fission splits heavy atoms, fusion joins light atoms",
                "Fission joins light atoms, fusion splits heavy atoms",
                "Fission produces no waste, fusion produces highly radioactive waste",
                "Fission occurs in stars, fusion occurs in current nuclear power plants"
            ],
            correctIndex: 0,
            explanation: "Nuclear fission, used in reactors, splits heavy atoms like Uranium. Fusion, which powers the sun, joins light atoms like Hydrogen.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of enriching Uranium-235 for nuclear reactors?",
            options: [
                "To make it glow green",
                "To increase the concentration of the fissile isotope",
                "To make it heavier and sink in water",
                "To prevent it from rusting"
            ],
            correctIndex: 1,
            explanation: "Natural uranium has very little U-235 (which easily undergoes fission). Enrichment increases the percentage of U-235 to sustain a chain reaction.",
            difficulty: "Hard"
        },
        {
            question: "What is the main function of control rods made of boron or cadmium?",
            options: [
                "To act as fuel for the reactor",
                "To heat up the primary coolant",
                "To absorb neutrons and regulate the fission rate",
                "To generate electricity directly"
            ],
            correctIndex: 2,
            explanation: "Control rods absorb neutrons. By inserting or withdrawing them, operators can control the rate of the nuclear chain reaction or shut it down.",
            difficulty: "Medium"
        },
        {
            question: "How does a Pressurized Water Reactor (PWR) differ from a Boiling Water Reactor (BWR)?",
            options: [
                "A PWR does not use water as a coolant",
                "In a PWR, water in the primary loop is kept under high pressure so it doesn't boil",
                "A PWR boils water directly in the reactor core to spin the turbine",
                "A BWR uses gas as a coolant instead of water"
            ],
            correctIndex: 1,
            explanation: "In a PWR, the primary coolant is highly pressurized to prevent boiling, and heat is transferred to a secondary loop. In a BWR, water boils directly in the reactor core.",
            difficulty: "Hard"
        },
        {
            question: "What causes the blue glow often seen in underwater nuclear reactors (Cherenkov radiation)?",
            options: [
                "Particles traveling faster than the speed of light in water",
                "Bioluminescent algae growing on the fuel rods",
                "Chemical reactions between uranium and water",
                "Reflection from blue painted pool walls"
            ],
            correctIndex: 0,
            explanation: "Cherenkov radiation occurs when charged particles (like electrons) travel through a dielectric medium (like water) faster than the phase velocity of light in that medium.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Condenser in the power plant?",
            options: [
                "To condense the uranium back into solid form",
                "To store excess electricity",
                "To cool exhaust steam back into liquid water",
                "To compress the control rods"
            ],
            correctIndex: 2,
            explanation: "The condenser removes heat from the steam exiting the turbine, condensing it back into water so it can be pumped back to the steam generator.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        meshes.forEach(mesh => {
            if (mesh.isControlRods) {
                // Control rods slowly moving up and down
                mesh.group.position.y = mesh.originalPosition.y + Math.sin(time * speed * 0.5) * 2;
            }
            if (mesh.isTurbine) {
                // Turbine spinning
                mesh.group.rotation.x += 0.1 * speed;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
