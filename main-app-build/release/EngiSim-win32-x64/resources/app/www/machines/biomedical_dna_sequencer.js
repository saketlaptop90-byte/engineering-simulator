import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Glowing/Neon Materials
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        emissive: 0x051020,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const laserMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8
    });

    const fluidCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
        transmission: 0.9,
        opacity: 1,
        transparent: true
    });

    const fluidMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.0,
        transmission: 0.9,
        opacity: 1,
        transparent: true
    });

    const fluidYellow = new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1.0,
        transmission: 0.9,
        opacity: 1,
        transparent: true
    });

    const fluidGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        transmission: 0.9,
        opacity: 1,
        transparent: true
    });

    const opticalLensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        roughness: 0.0,
        ior: 1.5,
        transparent: true
    });

    // 1. Main Casing
    const casingGeo = new THREE.BoxGeometry(4, 3, 3);
    const casingMesh = new THREE.Mesh(casingGeo, plastic);
    casingMesh.position.set(0, 1.5, -0.5);
    
    const baseGeo = new THREE.BoxGeometry(4.2, 0.2, 3.2);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.1, -0.5);
    
    // Front panel accents
    const accentGeo = new THREE.BoxGeometry(3.8, 2.8, 0.1);
    const accentMesh = new THREE.Mesh(accentGeo, aluminum);
    accentMesh.position.set(0, 1.5, 1.0);

    const casingGroup = new THREE.Group();
    casingGroup.add(casingMesh);
    casingGroup.add(baseMesh);
    casingGroup.add(accentMesh);

    group.add(casingGroup);
    parts.push({
        name: 'Main Housing',
        description: 'Contains all internal components and provides environmental control for sequencing.',
        material: 'Polycarbonate, Aluminum, and Steel',
        function: 'Environmental isolation, structural support, and EMI shielding.',
        assemblyOrder: 1,
        connections: ['Reagent Bay', 'Flow Cell Compartment'],
        failureEffect: 'Contamination and thermal instability',
        cascadeFailures: ['Flow Cell', 'Optical Scanner'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -2 },
        mesh: casingGroup
    });

    // 2. Flow Cell Compartment
    const compartmentGeo = new THREE.BoxGeometry(2, 1, 1.5);
    const compartmentMesh = new THREE.Mesh(compartmentGeo, aluminum);
    compartmentMesh.position.set(-0.8, 1.2, 0.5);
    
    const windowGeo = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(-0.8, 1.2, 1.26);

    const compartmentGroup = new THREE.Group();
    compartmentGroup.add(compartmentMesh);
    compartmentGroup.add(windowMesh);

    group.add(compartmentGroup);
    parts.push({
        name: 'Flow Cell Compartment',
        description: 'Thermally controlled chamber where the sequencing flow cells are loaded.',
        material: 'Aluminum and Tinted Glass',
        function: 'Temperature regulation for optimal enzyme activity during synthesis.',
        assemblyOrder: 2,
        connections: ['Main Housing', 'Optical Scanner Array'],
        failureEffect: 'Sequencing reaction failure due to incorrect temperature',
        cascadeFailures: ['Sequencing Flow Cell'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 2, z: 2 },
        mesh: compartmentGroup
    });

    // 3. Sequencing Flow Cell
    const flowCellGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    const flowCellMesh = new THREE.Mesh(flowCellGeo, glass);
    flowCellMesh.position.set(-0.8, 1.0, 0.5);

    // Flow cell channels (microfluidics)
    const channelGeo = new THREE.PlaneGeometry(1.0, 0.08);
    
    const channel1 = new THREE.Mesh(channelGeo, fluidCyan);
    channel1.rotation.x = -Math.PI / 2;
    channel1.position.set(-0.8, 1.03, 0.2);
    
    const channel2 = new THREE.Mesh(channelGeo, fluidMagenta);
    channel2.rotation.x = -Math.PI / 2;
    channel2.position.set(-0.8, 1.03, 0.4);

    const channel3 = new THREE.Mesh(channelGeo, fluidYellow);
    channel3.rotation.x = -Math.PI / 2;
    channel3.position.set(-0.8, 1.03, 0.6);

    const channel4 = new THREE.Mesh(channelGeo, fluidGreen);
    channel4.rotation.x = -Math.PI / 2;
    channel4.position.set(-0.8, 1.03, 0.8);

    const flowCellGroup = new THREE.Group();
    flowCellGroup.add(flowCellMesh);
    flowCellGroup.add(channel1);
    flowCellGroup.add(channel2);
    flowCellGroup.add(channel3);
    flowCellGroup.add(channel4);

    group.add(flowCellGroup);
    parts.push({
        name: 'Sequencing Flow Cell',
        description: 'Glass slide with microfluidic lanes where DNA templates are anchored and sequenced.',
        material: 'Silicate Glass and Polymer',
        function: 'Hosts the sequencing-by-synthesis reaction and fluidic exchange.',
        assemblyOrder: 3,
        connections: ['Flow Cell Compartment', 'Reagent Pumps'],
        failureEffect: 'Loss of sequencing data and fluid leaks',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 1.5, z: 4 },
        mesh: flowCellGroup
    });

    // 4. Optical Scanner Array
    const scannerGeo = new THREE.BoxGeometry(1.4, 0.3, 0.3);
    const scannerMesh = new THREE.Mesh(scannerGeo, chrome);
    scannerMesh.position.set(-0.8, 1.4, 0.5); 

    const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const lensMesh = new THREE.Mesh(lensGeo, opticalLensMaterial);
    lensMesh.position.set(-0.8, 1.25, 0.5);

    const laserBeamGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25);
    const laserMesh = new THREE.Mesh(laserBeamGeo, laserMaterial);
    laserMesh.position.set(-0.8, 1.15, 0.5);

    const scannerGroup = new THREE.Group();
    scannerGroup.add(scannerMesh);
    scannerGroup.add(lensMesh);
    scannerGroup.add(laserMesh);

    group.add(scannerGroup);
    parts.push({
        name: 'Optical Scanner Array',
        description: 'High-resolution camera and laser system to detect fluorescent nucleotide incorporation.',
        material: 'Chrome, Glass Optics',
        function: 'Excites fluorophores and records emission spectra to determine base calls.',
        assemblyOrder: 4,
        connections: ['Flow Cell Compartment'],
        failureEffect: 'Inaccurate base calling',
        cascadeFailures: ['Data Processor'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 4, z: 1 },
        mesh: scannerGroup
    });

    // 5. Reagent Bay
    const bayGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const bayMesh = new THREE.Mesh(bayGeo, aluminum);
    bayMesh.position.set(1.0, 1.0, 0.25);

    const bayGroup = new THREE.Group();
    bayGroup.add(bayMesh);

    group.add(bayGroup);
    parts.push({
        name: 'Reagent Bay',
        description: 'Chilled compartment holding sequencing buffers, polymerase, and fluorescent dNTPs.',
        material: 'Aluminum',
        function: 'Stores sensitive chemical reagents at optimal temperatures.',
        assemblyOrder: 5,
        connections: ['Main Housing', 'Fluidic Pumps'],
        failureEffect: 'Reagent degradation',
        cascadeFailures: ['Sequencing Reaction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 1.5, z: 2 },
        mesh: bayGroup
    });

    // 6. Reagent Cartridges
    const cartGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const cartGroup = new THREE.Group();
    const fluidMats = [fluidCyan, fluidMagenta, fluidYellow, fluidGreen];
    
    for (let i=0; i<4; i++) {
        const cart = new THREE.Mesh(cartGeo, plastic);
        const xOffset = 0.6 + (i%2)*0.6;
        const zOffset = 0.0 + Math.floor(i/2)*0.6;
        cart.position.set(xOffset, 1.0, zOffset);
        
        const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16), fluidMats[i]);
        fluid.position.set(xOffset, 1.0, zOffset);
        
        cartGroup.add(cart);
        cartGroup.add(fluid);
    }
    group.add(cartGroup);
    parts.push({
        name: 'Reagent Cartridges',
        description: 'Vials containing Adenine, Thymine, Cytosine, and Guanine fluorescently labeled nucleotides.',
        material: 'Plastic and Chemical Fluids',
        function: 'Provides the building blocks for DNA synthesis.',
        assemblyOrder: 6,
        connections: ['Reagent Bay'],
        failureEffect: 'Missing bases in sequencing reads',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 3, z: 3 },
        mesh: cartGroup
    });

    // 7. Control Panel & Display
    const screenBoxGeo = new THREE.BoxGeometry(1.6, 1.0, 0.1);
    const displayMesh = new THREE.Mesh(screenBoxGeo, screenMaterial);
    displayMesh.position.set(0, 2.5, 1.0);
    displayMesh.rotation.x = -0.15;

    const screenGroup = new THREE.Group();
    screenGroup.add(displayMesh);
    
    // Add glowing elements simulating real-time ATCG electropherogram traces
    for(let i=0; i<4; i++) {
        const traceGeo = new THREE.PlaneGeometry(1.4, 0.05);
        const trace = new THREE.Mesh(traceGeo, fluidMats[i]);
        trace.position.set(0, 2.75 - (i * 0.15), 1.06);
        trace.rotation.x = -0.15;
        screenGroup.add(trace);
    }

    group.add(screenGroup);
    parts.push({
        name: 'Control Panel & Display',
        description: 'Touchscreen interface displaying real-time sequencing metrics and base quality scores.',
        material: 'Glass and Electronics',
        function: 'User interaction and real-time monitoring of sequencing run.',
        assemblyOrder: 7,
        connections: ['Main Housing'],
        failureEffect: 'Loss of user control and monitoring',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 4 },
        mesh: screenGroup
    });

    const description = "A high-throughput DNA Sequencer utilizing sequencing-by-synthesis technology. It fluidically pumps fluorescently-labeled nucleotides into a flow cell, where DNA strands are synthesized. An optical scanner array precisely detects the fluorophores to determine the genetic sequence.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Optical Scanner Array in the DNA sequencer?",
            options: [
                "To pump reagents into the flow cell lanes", 
                "To detect fluorescently labeled nucleotides", 
                "To regulate the temperature of the reaction", 
                "To amplify the DNA sample prior to sequencing"
            ],
            correct: 1,
            explanation: "The optical scanner uses lasers to excite fluorophores attached to nucleotides and cameras to record the emission, identifying each base added during synthesis.",
            difficulty: "Medium"
        },
        {
            question: "Why must the Reagent Bay be temperature-controlled (chilled)?",
            options: [
                "To prevent the plastic cartridges from melting", 
                "To preserve the integrity of sensitive enzymes and fluorescent dyes", 
                "To increase the pressure in the fluidic lines", 
                "To cool the laser system down"
            ],
            correct: 1,
            explanation: "Biological reagents like DNA polymerase and fluorescently labeled dNTPs degrade rapidly at room temperature and must be kept chilled to maintain sequencing quality.",
            difficulty: "Medium"
        },
        {
            question: "What is the consequence of a failure in the Flow Cell Compartment's thermal regulation?",
            options: [
                "The touchscreen display will turn off", 
                "Reagents in the bay will freeze", 
                "The sequencing reaction will fail due to suboptimal enzyme activity", 
                "The optical scanner will misalign"
            ],
            correct: 2,
            explanation: "DNA synthesis requires precise temperature cycling for optimal enzyme activity. Failure in thermal regulation prevents successful sequencing-by-synthesis.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by part name to animate
        const scannerPart = parts.find(p => p.name === 'Optical Scanner Array');
        if (scannerPart) {
            // Sweep scanner back and forth over flow cell along Z-axis
            const zSweep = Math.sin(time * speed * 1.5) * 0.3;
            scannerPart.mesh.position.z = zSweep;
        }

        const screenPart = parts.find(p => p.name === 'Control Panel & Display');
        if (screenPart) {
            // Animate screen traces (simulating electropherogram data reading)
            for(let i=1; i<=4; i++) {
                const trace = screenPart.mesh.children[i];
                if(trace) {
                    trace.scale.x = 0.2 + 0.8 * Math.abs(Math.sin(time * speed * (3 + i)));
                }
            }
        }

        const flowCellPart = parts.find(p => p.name === 'Sequencing Flow Cell');
        if (flowCellPart) {
            // Pulse flow cell channels to simulate fluidics flow and laser excitation
            for(let i=1; i<=4; i++) {
                const channel = flowCellPart.mesh.children[i];
                if(channel) {
                    channel.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * speed * (4 + i));
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDNASequencer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
