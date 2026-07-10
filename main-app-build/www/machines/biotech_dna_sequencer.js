import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for Visual Flair
    const laserGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.8
    });

    const flowCellActiveMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const indicatorRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
    const indicatorGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });

    // 1. Main Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 8, 8);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.set(0, 0, 0);
    group.add(chassis);
    parts.push({
        name: 'Main Chassis',
        description: 'Vibration-damped enclosure housing all sensitive optical and microfluidic components.',
        material: 'Dark Steel',
        function: 'Environmental isolation and structural support',
        assemblyOrder: 1,
        connections: ['Optical Array', 'Microfluidics', 'Thermal Block'],
        failureEffect: 'Vibration interference causing read errors',
        cascadeFailures: ['Optical Array misalignment'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: chassis
    });

    // 2. Nano-Flow Cell Stage
    const stageGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const stage = new THREE.Mesh(stageGeo, aluminum);
    stage.position.set(0, 1.5, 2);
    group.add(stage);
    
    const flowCellGeo = new THREE.BoxGeometry(3, 0.2, 2);
    const flowCell = new THREE.Mesh(flowCellGeo, flowCellActiveMaterial);
    flowCell.position.set(0, 0.35, 0);
    stage.add(flowCell);

    parts.push({
        name: 'Nano-Flow Cell & Stage',
        description: 'Precision X-Y-Z translation stage holding the patterned glass substrate where DNA clusters are amplified and sequenced.',
        material: 'Aluminum & Photonic Glass',
        function: 'Immobilize DNA and allow precise optical scanning',
        assemblyOrder: 2,
        connections: ['Main Chassis', 'Microfluidic Pumps', 'Optical Array'],
        failureEffect: 'Total sequence loss',
        cascadeFailures: ['Reagent waste'],
        originalPosition: { x: 0, y: 1.5, z: 2 },
        explodedPosition: { x: 0, y: 1.5, z: 8 },
        mesh: stage
    });

    // 3. High-Resolution Optical Array (Camera + Lasers)
    const opticsGroup = new THREE.Group();
    opticsGroup.position.set(0, 3.5, 2);
    
    const cameraBodyGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const cameraBody = new THREE.Mesh(cameraBodyGeo, chrome);
    cameraBody.rotation.x = Math.PI / 2;
    opticsGroup.add(cameraBody);

    const lensGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.position.z = 1.1;
    lens.rotation.x = Math.PI / 2;
    opticsGroup.add(lens);

    // Laser beams
    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8);
    const laserBeam1 = new THREE.Mesh(laserGeo, laserGlowMaterial);
    laserBeam1.position.set(-0.5, -1.25, 0);
    opticsGroup.add(laserBeam1);

    const laserBeam2 = new THREE.Mesh(laserGeo, laserGlowMaterial);
    laserBeam2.position.set(0.5, -1.25, 0);
    opticsGroup.add(laserBeam2);

    group.add(opticsGroup);
    parts.push({
        name: 'Optical Scanning Array',
        description: 'TDI line-scan cameras coupled with multi-wavelength lasers to detect fluorescently labeled nucleotides.',
        material: 'Chrome & Glass',
        function: 'Image fluorescent signals during Sequencing By Synthesis (SBS)',
        assemblyOrder: 3,
        connections: ['Main Chassis', 'Data Processing Unit'],
        failureEffect: 'Low quality scores (Q-scores) or dark images',
        cascadeFailures: ['Data Processing Unit overload'],
        originalPosition: { x: 0, y: 3.5, z: 2 },
        explodedPosition: { x: 0, y: 8, z: 2 },
        mesh: opticsGroup
    });

    // 4. Microfluidic Pump System
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(-3, 1, -1);
    
    const pumpBodyGeo = new THREE.BoxGeometry(2, 2, 2);
    const pumpBody = new THREE.Mesh(pumpBodyGeo, steel);
    pumpGroup.add(pumpBody);

    const rotorGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    const rotor = new THREE.Mesh(rotorGeo, copper);
    rotor.position.set(0, 0, 1.1);
    rotor.rotation.x = Math.PI / 2;
    pumpGroup.add(rotor);

    group.add(pumpGroup);
    parts.push({
        name: 'Microfluidic Pump System',
        description: 'High-precision syringe pumps delivering reagents, enzymes, and buffers to the flow cell.',
        material: 'Steel & Copper',
        function: 'Fluidic delivery and wash cycles',
        assemblyOrder: 4,
        connections: ['Main Chassis', 'Reagent Cartridge', 'Nano-Flow Cell'],
        failureEffect: 'Incomplete chemical reactions',
        cascadeFailures: ['Phasing/Pre-phasing errors in sequencing'],
        originalPosition: { x: -3, y: 1, z: -1 },
        explodedPosition: { x: -8, y: 1, z: -1 },
        mesh: pumpGroup
    });

    // 5. Reagent Cartridge Array
    const reagentGroup = new THREE.Group();
    reagentGroup.position.set(3, 1, -1);
    
    const cartridgeChassis = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 2), plastic);
    reagentGroup.add(cartridgeChassis);

    // Reagent Tubes
    const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
    for(let i=0; i<4; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: colors[i], transparent: true, opacity: 0.8 });
        const tube = new THREE.Mesh(tubeGeo, mat);
        tube.position.set(-1 + (i * 0.66), 0.2, 0);
        reagentGroup.add(tube);
    }

    group.add(reagentGroup);
    parts.push({
        name: 'Reagent Cartridge',
        description: 'Contains fluorescently labeled dNTPs, polymerase, and wash buffers.',
        material: 'Plastic & Chemical Reagents',
        function: 'Supply consumables for the SBS chemistry',
        assemblyOrder: 5,
        connections: ['Microfluidic Pump System'],
        failureEffect: 'Chemistry failure (zero read length)',
        cascadeFailures: [],
        originalPosition: { x: 3, y: 1, z: -1 },
        explodedPosition: { x: 8, y: 1, z: -1 },
        mesh: reagentGroup
    });

    // 6. Thermal Peltier Block
    const thermalGeo = new THREE.BoxGeometry(4, 1, 3);
    const thermalMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 0.5 });
    const thermalBlock = new THREE.Mesh(thermalGeo, thermalMat);
    thermalBlock.position.set(0, 0.5, 2);
    group.add(thermalBlock);
    parts.push({
        name: 'Peltier Thermal Block',
        description: 'Rapidly cycles temperatures for enzymatic incorporation and cleavage steps.',
        material: 'Thermo-electric Element',
        function: 'Temperature control for flow cell chemistry',
        assemblyOrder: 6,
        connections: ['Nano-Flow Cell', 'Main Chassis'],
        failureEffect: 'Enzyme denaturation or failure to incorporate nucleotides',
        cascadeFailures: ['Flow cell destruction'],
        originalPosition: { x: 0, y: 0.5, z: 2 },
        explodedPosition: { x: 0, y: -2, z: 8 },
        mesh: thermalBlock
    });

    // 7. On-board Compute & FPGA Processing
    const computeGeo = new THREE.BoxGeometry(8, 2, 2);
    const compute = new THREE.Mesh(computeGeo, darkSteel);
    compute.position.set(0, 3, -2.5);
    
    // LEDs
    for(let i=0; i<5; i++) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), indicatorGreen);
        led.position.set(-3 + (i * 0.5), 0, 1.05);
        compute.add(led);
    }

    group.add(compute);
    parts.push({
        name: 'FPGA Compute Node',
        description: 'High-speed Field Programmable Gate Arrays for real-time primary analysis (base calling).',
        material: 'Silicon & PCBs',
        function: 'Convert optical image data into ATGC base calls (FASTQ generation)',
        assemblyOrder: 7,
        connections: ['Optical Array', 'Main Chassis'],
        failureEffect: 'Data processing bottleneck',
        cascadeFailures: ['Run timeout'],
        originalPosition: { x: 0, y: 3, z: -2.5 },
        explodedPosition: { x: 0, y: 8, z: -6 },
        mesh: compute
    });


    const description = "The High-Throughput Next-Gen DNA Sequencer represents the pinnacle of biotech engineering. It integrates ultra-precise microfluidics, thermo-electric temperature control, and a massive optical array to read billions of DNA clusters simultaneously via Sequencing By Synthesis (SBS).";

    const quizQuestions = [
        {
            question: "In Sequencing By Synthesis, what is the primary function of the Optical Array?",
            options: [
                "To melt the DNA strands apart",
                "To detect fluorescent signals from newly incorporated nucleotides",
                "To pump reagents into the flow cell",
                "To align the FASTQ files against a reference genome"
            ],
            correct: 1,
            explanation: "The optical array uses lasers to excite fluorophores attached to newly incorporated nucleotides, and cameras to image the emitted light to determine the base (A, T, G, or C).",
            difficulty: "Medium"
        },
        {
            question: "Which component is most likely responsible if 'phasing' errors occur (where chemical reactions fall behind schedule)?",
            options: [
                "FPGA Compute Node",
                "Optical Array",
                "Microfluidic Pump System",
                "Main Chassis"
            ],
            correct: 2,
            explanation: "Phasing occurs when enzymatic incorporation fails or wash steps are incomplete, often due to microfluidic pump inaccuracies or degraded reagents.",
            difficulty: "Hard"
        },
        {
            question: "Why is precise temperature control via the Peltier Thermal Block crucial?",
            options: [
                "To keep the hard drives from overheating",
                "To ensure optimal enzyme kinetics for polymerase during base incorporation",
                "To keep the lasers at a specific wavelength",
                "To prevent the glass flow cell from shattering"
            ],
            correct: 1,
            explanation: "Enzymes like DNA polymerase require specific, tightly controlled temperatures to accurately and efficiently add nucleotides to the growing DNA strand.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes
        const optics = parts.find(p => p.name === 'Optical Scanning Array')?.mesh;
        const pump = parts.find(p => p.name === 'Microfluidic Pump System')?.mesh;
        const thermal = parts.find(p => p.name === 'Peltier Thermal Block')?.mesh;
        const computeNode = parts.find(p => p.name === 'FPGA Compute Node')?.mesh;

        if (optics) {
            // Scanning motion (side to side)
            optics.position.x = Math.sin(time * speed * 2) * 1.5;
            
            // Pulse lasers
            optics.children.forEach(child => {
                if (child.geometry.type === 'CylinderGeometry' && child.material === laserGlowMaterial) {
                    child.material.emissiveIntensity = 2 + Math.sin(time * speed * 10) * 2;
                }
            });
        }

        if (pump) {
            // Rotate pump rotor
            const rotor = pump.children[1];
            if (rotor) {
                rotor.rotation.y = time * speed * 5;
            }
        }

        if (thermal) {
            // Pulse thermal block color (heating/cooling cycle)
            const heat = (Math.sin(time * speed) + 1) / 2; // 0 to 1
            thermal.material.emissive.setHex(heat > 0.5 ? 0xff4400 : 0x0044ff); // Red to Blue
        }

        if (computeNode) {
            // Blink compute LEDs randomly
            computeNode.children.forEach((led, index) => {
                if (Math.random() > 0.9) {
                    led.material = Math.random() > 0.5 ? indicatorGreen : indicatorRed;
                }
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createDNASequencer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
