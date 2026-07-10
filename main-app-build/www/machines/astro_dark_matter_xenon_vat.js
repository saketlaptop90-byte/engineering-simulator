import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const xenonGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });
    
    const sensorNeon = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2
    });

    // 1. Cryostat Outer Vessel (Vacuum Shield)
    const cryostatGeom = new THREE.CylinderGeometry(5, 5, 12, 32);
    const cryostatMesh = new THREE.Mesh(cryostatGeom, new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.3 }));
    cryostatMesh.position.set(0, 6, 0);
    group.add(cryostatMesh);
    parts.push({
        name: "Outer Cryostat Vessel",
        description: "A double-walled vacuum vessel designed to keep the internal liquid xenon at cryogenic temperatures (-100 °C) while shielding against external thermal radiation.",
        material: "darkSteel (transparent)",
        function: "Thermal insulation and structural support.",
        assemblyOrder: 1,
        connections: ["Inner Cryostat", "Vacuum Pumps"],
        failureEffect: "Thermal leak causes xenon to boil rapidly, triggering emergency venting and halting the experiment.",
        cascadeFailures: ["Xenon Loss", "Overpressure"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: cryostatMesh
    });

    // 2. Liquid Xenon Vat
    const xenonGeom = new THREE.CylinderGeometry(3.5, 3.5, 8, 32);
    const xenonVat = new THREE.Mesh(xenonGeom, xenonGlow);
    xenonVat.position.set(0, 5.5, 0);
    group.add(xenonVat);
    parts.push({
        name: "Liquid Xenon Target",
        description: "Ultra-pure liquid xenon acting as the target mass. When a dark matter particle (WIMP) scatters off a xenon nucleus, it produces a faint flash of scintillation light.",
        material: "xenonGlow",
        function: "Target material for WIMP interaction and scintillation medium.",
        assemblyOrder: 2,
        connections: ["PMT Arrays", "Electric Field Grids"],
        failureEffect: "Impurities in the xenon absorb scintillation light, drastically reducing detector sensitivity.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 0, y: 5.5, z: 0 },
        explodedPosition: { x: 0, y: 5.5, z: 12 },
        mesh: xenonVat
    });

    // 3. Top PMT Array (Photomultiplier Tubes)
    const pmtTopGroup = new THREE.Group();
    for(let i=0; i<19; i++) {
        const r = 3 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const pmtG = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
        const pmtM = new THREE.Mesh(pmtG, chrome);
        pmtM.position.set(r*Math.cos(theta), 0, r*Math.sin(theta));
        pmtTopGroup.add(pmtM);
        
        // Sensor glow
        const glowG = new THREE.CylinderGeometry(0.3, 0.3, 1.1, 16);
        const glowM = new THREE.Mesh(glowG, sensorNeon);
        glowM.position.set(r*Math.cos(theta), -0.05, r*Math.sin(theta));
        pmtTopGroup.add(glowM);
    }
    pmtTopGroup.position.set(0, 9.5, 0);
    group.add(pmtTopGroup);
    parts.push({
        name: "Top PMT Array",
        description: "An array of ultra-sensitive Photomultiplier Tubes at the top of the Time Projection Chamber to detect the prompt (S1) and proportional (S2) scintillation signals.",
        material: "chrome / sensorNeon",
        function: "Detects single photons emitted by xenon interactions.",
        assemblyOrder: 3,
        connections: ["Data Acquisition System", "Liquid Xenon Target"],
        failureEffect: "Loss of top signal array impairs the ability to localize the Z-coordinate of the interaction and distinguish particle types.",
        cascadeFailures: ["Event Misidentification"],
        originalPosition: { x: 0, y: 9.5, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: pmtTopGroup
    });

    // 4. Bottom PMT Array
    const pmtBotGroup = pmtTopGroup.clone();
    pmtBotGroup.position.set(0, 1.5, 0);
    pmtBotGroup.rotation.x = Math.PI; // flip upside down
    group.add(pmtBotGroup);
    parts.push({
        name: "Bottom PMT Array",
        description: "Bottom array of PMTs immersed directly in the liquid xenon, optimized for high light collection efficiency of the prompt S1 signal.",
        material: "chrome / sensorNeon",
        function: "Primary detector for the initial S1 scintillation flash.",
        assemblyOrder: 4,
        connections: ["Data Acquisition System", "Liquid Xenon Target"],
        failureEffect: "Reduced S1 light collection limits the energy resolution and threshold of the detector.",
        cascadeFailures: ["Reduced Sensitivity"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: pmtBotGroup
    });

    // 5. Electric Field Shaping Rings
    const ringsGroup = new THREE.Group();
    const ringGeom = new THREE.TorusGeometry(3.8, 0.1, 16, 64);
    for(let y = 2.5; y <= 8.5; y += 0.5) {
        const ring = new THREE.Mesh(ringGeom, copper);
        ring.position.set(0, y, 0);
        ring.rotation.x = Math.PI / 2;
        ringsGroup.add(ring);
    }
    group.add(ringsGroup);
    parts.push({
        name: "Field Shaping Rings",
        description: "Copper rings connected by resistors to create a highly uniform downward electric field across the liquid xenon. This field drifts electrons from the interaction site to the top of the chamber.",
        material: "copper",
        function: "Maintains a uniform drift field for ionized electrons.",
        assemblyOrder: 5,
        connections: ["Cathode", "Gate Grid"],
        failureEffect: "Non-uniform field causes electrons to drift off-path, resulting in inaccurate X-Y positioning and signal loss.",
        cascadeFailures: ["Fiducial Volume Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 },
        mesh: ringsGroup
    });

    // 6. High Voltage Cathode Grid
    const cathodeGeom = new THREE.CylinderGeometry(3.8, 3.8, 0.1, 32, 1, false);
    const cathodeMat = new THREE.MeshStandardMaterial({color: 0xff4444, emissive: 0x880000, wireframe: true});
    const cathode = new THREE.Mesh(cathodeGeom, cathodeMat);
    cathode.position.set(0, 2, 0);
    group.add(cathode);
    parts.push({
        name: "High Voltage Cathode",
        description: "A highly transparent wire grid biased at negative tens of kilovolts to establish the strong electric field needed to drift electrons upwards.",
        material: "steel wireframe (red glow)",
        function: "Provides the high voltage required for electron drift.",
        assemblyOrder: 6,
        connections: ["High Voltage Feedthrough", "Field Shaping Rings"],
        failureEffect: "Electrical sparking or short circuit destroys the drift field, rendering the detector blind to charge signals.",
        cascadeFailures: ["Complete Detector Blindness"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -10, y: 2, z: 0 },
        mesh: cathode
    });

    // 7. Data Cables and Cryogenic Pipes
    const pipesGroup = new THREE.Group();
    const pipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
    for(let i=0; i<4; i++) {
        const pipe = new THREE.Mesh(pipeGeom, aluminum);
        pipe.position.set(3 * Math.cos(i * Math.PI/2), 11, 3 * Math.sin(i * Math.PI/2));
        pipesGroup.add(pipe);
    }
    group.add(pipesGroup);
    parts.push({
        name: "Cryogenic Pipes & DAQ Cables",
        description: "Routing for continuous xenon purification and signal cables from the PMT arrays out to the DAQ electronics.",
        material: "aluminum",
        function: "Supports fluid circulation and signal readout.",
        assemblyOrder: 7,
        connections: ["Cryostat", "External Systems"],
        failureEffect: "Cable degradation introduces electrical noise; pipe leaks lead to xenon contamination.",
        cascadeFailures: ["Noise Spikes", "Xenon Impurity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 },
        mesh: pipesGroup
    });

    const description = "The Dark Matter Xenon Detector is a dual-phase Time Projection Chamber (TPC). It utilizes ultra-pure liquid xenon to capture extremely rare interactions with hypothetical Weakly Interacting Massive Particles (WIMPs). When a WIMP scatters off a xenon nucleus, it generates an immediate flash of light (S1) and releases electrons. An electric field drifts these electrons to the liquid-gas interface where they are extracted, producing a second, larger flash (S2). Analyzing the S1 and S2 signals allows physicists to pinpoint the interaction location and distinguish dark matter from background radiation.";

    const quizQuestions = [
        {
            question: "What is the purpose of the Electric Field Shaping Rings?",
            options: [
                "To cool the liquid xenon",
                "To maintain a uniform downward electric field to drift electrons",
                "To measure the mass of the WIMP",
                "To shield the detector from cosmic rays"
            ],
            correct: 1,
            explanation: "The field shaping rings create a highly uniform electric field that ensures ionized electrons drift straight up to the gas phase without deviating.",
            difficulty: "Medium"
        },
        {
            question: "Why is the detector deep underground and surrounded by a cryostat?",
            options: [
                "To keep the xenon at extremely high pressure",
                "To hide it from rival scientists",
                "To shield against background radiation like cosmic rays and thermal radiation",
                "Because xenon is heavier than air"
            ],
            correct: 2,
            explanation: "Deep underground placement and shielding protect the ultra-sensitive detector from cosmic rays and radioactive backgrounds that would drown out the faint dark matter signals.",
            difficulty: "Easy"
        },
        {
            question: "What do the PMT arrays detect in the liquid xenon target?",
            options: [
                "Scintillation light (photons)",
                "Gravitational waves",
                "Acoustic sound waves",
                "Magnetic fields"
            ],
            correct: 0,
            explanation: "Photomultiplier Tubes (PMTs) are designed to detect single photons of scintillation light produced when particles interact with the xenon.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Subtle pulsing of the xenon vat
        if(meshes[1] && meshes[1].material) {
            meshes[1].material.emissiveIntensity = 0.8 + 0.2 * Math.sin(time * 2);
        }
        
        // PMT arrays flickering (simulating dark counts / radiation)
        if(meshes[2]) {
            meshes[2].children.forEach((pmt, i) => {
                if(pmt.geometry.type === 'CylinderGeometry' && pmt.scale.y > 1) { // simplified targeting of glow meshes
                    pmt.material.emissiveIntensity = 1.0 + Math.random() * 0.5;
                }
            });
        }
        if(meshes[3]) {
            meshes[3].children.forEach((pmt, i) => {
                 if(pmt.geometry.type === 'CylinderGeometry' && pmt.scale.y > 1) {
                    pmt.material.emissiveIntensity = 1.0 + Math.random() * 0.5;
                }
            });
        }

        // Cathode grid slow rotation to simulate dynamic field or just visual flair
        if(meshes[5]) {
            meshes[5].rotation.y = time * 0.2 * speed;
            meshes[5].material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * 5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDarkMatterXenonVat() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
