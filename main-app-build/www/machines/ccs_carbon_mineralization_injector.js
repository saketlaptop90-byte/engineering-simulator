import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials
    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.1
    });

    const glowingHotBasalt = new THREE.MeshStandardMaterial({
        color: 0x333333,
        emissive: 0xff3300,
        emissiveIntensity: 0.5,
        roughness: 0.9,
        metalness: 0.2
    });

    // 1. Basalt Rock Formation (Cross-section)
    const rockGeo = new THREE.BoxGeometry(10, 8, 10);
    const rockBase = new THREE.Mesh(rockGeo, glowingHotBasalt);
    rockBase.position.set(0, -6, 0);
    group.add(rockBase);
    meshes.rock = rockBase;

    parts.push({
        name: "Basalt Rock Formation",
        description: "Deep geological reactive basalt formation where CO2 mineralization occurs.",
        material: "glowingHotBasalt",
        function: "Provides the reactive magnesium, calcium, and iron silicates necessary to convert CO2 into stable carbonate minerals.",
        assemblyOrder: 1,
        connections: ["Injection Well"],
        failureEffect: "Geological fracturing if injection pressure exceeds rock tensile strength.",
        cascadeFailures: ["CO2 Leakage", "Seismic Activity"],
        originalPosition: { x: 0, y: -6, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Injection Well / Borehole casing
    const wellGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const well = new THREE.Mesh(wellGeo, darkSteel);
    well.position.set(0, -2, 0);
    group.add(well);
    meshes.well = well;

    parts.push({
        name: "Injection Well Casing",
        description: "High-pressure steel casing guiding CO2 deep underground.",
        material: "darkSteel",
        function: "Maintains well integrity and directs supercritical CO2 into the target basalt formation.",
        assemblyOrder: 2,
        connections: ["Basalt Rock Formation", "Wellhead"],
        failureEffect: "Loss of CO2 into shallow aquifers.",
        cascadeFailures: ["Groundwater Contamination", "Pressure Drop"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -4 }
    });

    // 3. Wellhead / Rig
    const rigBaseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const rigBase = new THREE.Mesh(rigBaseGeo, steel);
    rigBase.position.set(0, 3, 0);
    group.add(rigBase);
    meshes.rigBase = rigBase;

    parts.push({
        name: "Wellhead Platform",
        description: "Surface infrastructure connecting pipelines to the injection well.",
        material: "steel",
        function: "Regulates pressure and flow of supercritical CO2 entering the well.",
        assemblyOrder: 3,
        connections: ["Injection Well", "Compressor Pump"],
        failureEffect: "Surface blowout of supercritical CO2.",
        cascadeFailures: ["System Shutdown", "Atmospheric Release"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 4. CO2 Stream (Animated)
    const co2Geo = new THREE.CylinderGeometry(0.15, 0.15, 8, 8);
    const co2Stream = new THREE.Mesh(co2Geo, glowingBlue);
    co2Stream.position.set(0, -2, 0);
    group.add(co2Stream);
    meshes.co2Stream = co2Stream;

    parts.push({
        name: "Supercritical CO2 Stream",
        description: "High-density CO2 fluid mixed with water.",
        material: "glowingBlue",
        function: "Transport medium that reacts with basalt to form solid carbonates.",
        assemblyOrder: 4,
        connections: ["Wellhead Platform", "Basalt Rock Formation"],
        failureEffect: "Incomplete mineralization if phase state is lost.",
        cascadeFailures: ["Clogging", "Flow Disruption"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 2, y: -2, z: 0 }
    });
    
    // 5. Compressor / Pump System
    const pumpGeo = new THREE.BoxGeometry(2, 2, 2);
    const pump = new THREE.Mesh(pumpGeo, chrome);
    pump.position.set(3, 3.5, 0);
    group.add(pump);
    meshes.pump = pump;

    // pipe to wellhead
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const pipe = new THREE.Mesh(pipeGeo, copper);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(1.5, 3.5, 0);
    group.add(pipe);

    parts.push({
        name: "Compressor Pump",
        description: "High-power compressor for CO2 pressurization.",
        material: "chrome",
        function: "Maintains supercritical state of CO2 (>73.8 atm, >31.1 C) before injection.",
        assemblyOrder: 5,
        connections: ["Wellhead Platform"],
        failureEffect: "Loss of injection pressure.",
        cascadeFailures: ["CO2 Phase Change", "Injection Halt"],
        originalPosition: { x: 3, y: 3.5, z: 0 },
        explodedPosition: { x: 6, y: 3.5, z: 0 }
    });

    const description = "A Carbon Mineralization Injector systems permanently sequesters carbon dioxide by injecting supercritical CO2 mixed with water deep into reactive basaltic rock formations. Over months to years, the CO2 reacts with the rock to form solid carbonate minerals, permanently removing it from the atmosphere.";

    const quizQuestions = [
        {
            question: "Why is basalt rock preferred for carbon mineralization?",
            options: [
                "It is very porous and holds gas well like a sponge.",
                "It is rich in calcium, magnesium, and iron, which react with CO2 to form solid carbonates.",
                "It naturally repels water, keeping the CO2 pure.",
                "It is the softest rock, making drilling inexpensive."
            ],
            correct: 1,
            explanation: "Basalt contains high concentrations of reactive divalent metal cations (Ca2+, Mg2+, Fe2+) which rapidly react with dissolved CO2 to precipitate stable carbonate minerals.",
            difficulty: "Medium"
        },
        {
            question: "What phase must CO2 be in for optimal geological injection?",
            options: [
                "Solid (Dry Ice)",
                "Gas",
                "Liquid",
                "Supercritical fluid"
            ],
            correct: 3,
            explanation: "Supercritical CO2 has the density of a liquid but expands like a gas, allowing it to efficiently permeate rock fractures and transport large volumes of carbon.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary risk if the injection pressure exceeds the rock's tensile strength?",
            options: [
                "The CO2 turns back into a gas.",
                "Induced seismicity (earthquakes) and geological fracturing.",
                "The basalt melts into magma.",
                "The compressor overheats."
            ],
            correct: 1,
            explanation: "Over-pressurization can cause rock fracturing and fault slip, leading to induced earthquakes and potential leakage pathways.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate glowing CO2 stream to simulate flow
        meshes.co2Stream.material.emissiveIntensity = 1 + Math.sin(time * speed * 5) * 0.5;
        
        // Slight vibration on the pump
        meshes.pump.position.y = 3.5 + Math.sin(time * speed * 20) * 0.05;
        
        // Basalt rock glowing heat map effect
        meshes.rock.material.emissiveIntensity = 0.3 + Math.sin(time * speed) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createCarbonMineralizationInjector() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
