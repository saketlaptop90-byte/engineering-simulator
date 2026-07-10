import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- Custom Materials ---
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.15,
        name: 'goldMaterial'
    });
    
    const bioGelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.95,
        opacity: 1,
        metalness: 0,
        roughness: 0.05,
        ior: 1.4,
        thickness: 0.5,
        transparent: true,
        name: 'bioGel'
    });

    const retinaGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        name: 'retinaGlow'
    });

    const laserRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.2,
        name: 'laserRed'
    });

    const opticBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0022aa,
        emissiveIntensity: 0.8,
        wireframe: true,
        name: 'opticBlue'
    });

    // --- 1. Titanium Sclera Chassis ---
    // Using LatheGeometry for a complex, medical-grade casing
    const scleraPoints = [];
    for ( let i = 0; i <= 20; i ++ ) {
        const t = i / 20;
        // Create a cup-like semi-spherical shell with a flattened front and ribbed back
        const x = Math.sin(t * Math.PI * 0.6) * 4.5 + (i > 15 ? Math.sin(t*20)*0.1 : 0);
        const y = Math.cos(t * Math.PI * 0.6) * 4.5 - 2;
        scleraPoints.push(new THREE.Vector2(x, y));
    }
    const scleraGeo = new THREE.LatheGeometry(scleraPoints, 64);
    const scleraMesh = new THREE.Mesh(scleraGeo, aluminum);
    scleraMesh.rotation.x = Math.PI / 2;
    group.add(scleraMesh);
    meshes.sclera = scleraMesh;

    // --- 2. Anterior Corneal Lens ---
    // A highly curved, layered glass construct
    const lensGeo = new THREE.SphereGeometry(4.4, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const lensMesh = new THREE.Mesh(lensGeo, glass);
    lensMesh.position.z = 1.2;
    lensMesh.rotation.x = Math.PI / 2;
    group.add(lensMesh);
    meshes.lens = lensMesh;

    // --- 3. Aperture Control Ring ---
    const apertureRingGeo = new THREE.TorusGeometry(3.8, 0.2, 32, 100);
    const apertureRingMesh = new THREE.Mesh(apertureRingGeo, darkSteel);
    apertureRingMesh.position.z = 2.0;
    group.add(apertureRingMesh);
    meshes.apertureRing = apertureRingMesh;

    // --- 4. Iris Shutter Mechanism ---
    // 12 overlapping blades
    meshes.irisBlades = [];
    const irisGroup = new THREE.Group();
    irisGroup.position.z = 1.9;
    const numBlades = 12;
    
    // Create a complex shape for the iris blade
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(2.5, -0.5);
    bladeShape.quadraticCurveTo(3.5, 1.0, 1.5, 2.5);
    bladeShape.lineTo(0, 0);
    
    const bladeExtrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, bladeExtrudeSettings);

    for (let i = 0; i < numBlades; i++) {
        const blade = new THREE.Mesh(bladeGeo, chrome);
        const angle = (i / numBlades) * Math.PI * 2;
        blade.position.x = Math.cos(angle) * 1.5;
        blade.position.y = Math.sin(angle) * 1.5;
        blade.rotation.z = angle + Math.PI / 4; // Initial overlap
        // Slight z-offset to prevent z-fighting
        blade.position.z = i * 0.005; 
        irisGroup.add(blade);
        meshes.irisBlades.push({
            mesh: blade,
            baseAngle: angle,
            offsetX: blade.position.x,
            offsetY: blade.position.y
        });
    }
    group.add(irisGroup);
    meshes.irisGroup = irisGroup;

    // --- 5 & 6. Micro-Photodiode Matrix Base and Array ---
    // Massive array of tiny cylinders on a curved backing
    const retinaBaseGeo = new THREE.SphereGeometry(4.2, 64, 64, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);
    const retinaBaseMesh = new THREE.Mesh(retinaBaseGeo, darkSteel);
    retinaBaseMesh.position.z = 1.0;
    retinaBaseMesh.rotation.x = -Math.PI / 2;
    group.add(retinaBaseMesh);

    const photodiodeGroup = new THREE.Group();
    photodiodeGroup.position.z = 1.0;
    photodiodeGroup.rotation.x = -Math.PI / 2;
    
    const diodeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8);
    // Let's create an elaborate spiraling matrix of sensors
    meshes.diodes = [];
    const numSensors = 800; // Large number for complexity
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < numSensors; i++) {
        const diode = new THREE.Mesh(diodeGeo, retinaGlow);
        // Fibonacci sphere distribution for uniform packing on the retina dome
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / (numSensors * 2.5)); // Only cover the back half
        
        const r = 4.15;
        diode.position.x = r * Math.sin(phi) * Math.cos(theta);
        diode.position.y = r * Math.sin(phi) * Math.sin(theta);
        diode.position.z = r * Math.cos(phi);
        
        diode.lookAt(new THREE.Vector3(0,0,0));
        diode.rotateX(Math.PI / 2);
        
        photodiodeGroup.add(diode);
        meshes.diodes.push(diode);
    }
    group.add(photodiodeGroup);
    meshes.photodiodeGroup = photodiodeGroup;

    // --- 7. Signal Processor Chip ---
    // Extruded complex poly chip sitting in the center of the neural nexus
    const chipShape = new THREE.Shape();
    chipShape.moveTo(-0.8, -0.8);
    chipShape.lineTo(0.8, -0.8);
    chipShape.lineTo(1.2, 0);
    chipShape.lineTo(0.8, 0.8);
    chipShape.lineTo(-0.8, 0.8);
    chipShape.lineTo(-1.2, 0);
    chipShape.lineTo(-0.8, -0.8);
    const chipGeo = new THREE.ExtrudeGeometry(chipShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    const chipMesh = new THREE.Mesh(chipGeo, copper);
    chipMesh.position.z = -2.5;
    group.add(chipMesh);
    meshes.processorChip = chipMesh;

    // --- 8. Gold Neural Interface Wiring ---
    // Complex winding tubes acting as neural bridges
    const wireGroup = new THREE.Group();
    meshes.wires = [];
    const numWires = 36;
    for (let i = 0; i < numWires; i++) {
        const angle = (i / numWires) * Math.PI * 2;
        const radius = 0.8 + Math.random() * 0.4;
        
        const startX = Math.cos(angle) * 3.5;
        const startY = Math.sin(angle) * 3.5;
        const startZ = -1.0; // Near retina base
        
        const midX = Math.cos(angle + 0.5) * 2.0;
        const midY = Math.sin(angle + 0.5) * 2.0;
        const midZ = -1.8;
        
        const endX = Math.cos(angle) * radius;
        const endY = Math.sin(angle) * radius;
        const endZ = -3.0; // Into optic nerve
        
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, startY, startZ),
            new THREE.Vector3(midX, midY, midZ),
            new THREE.Vector3(endX, endY, endZ),
            new THREE.Vector3(endX * 0.2, endY * 0.2, -4.5)
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.04, 8, false);
        const wireMesh = new THREE.Mesh(tubeGeo, goldMaterial);
        wireGroup.add(wireMesh);
        meshes.wires.push(wireMesh);
    }
    group.add(wireGroup);

    // --- 9. Optic Nerve Bio-Connector ---
    // Ribbed multi-segmented cylinder
    const nerveGroup = new THREE.Group();
    nerveGroup.position.z = -4.0;
    
    const nerveCoreGeo = new THREE.CylinderGeometry(1.2, 0.8, 3.0, 32);
    const nerveCore = new THREE.Mesh(nerveCoreGeo, rubber);
    nerveCore.rotation.x = Math.PI / 2;
    nerveGroup.add(nerveCore);
    
    // Ribs
    for(let i=0; i<8; i++) {
        const ribGeo = new THREE.TorusGeometry(1.25 - (i*0.05), 0.1, 16, 32);
        const rib = new THREE.Mesh(ribGeo, darkSteel);
        rib.position.z = 1.2 - (i * 0.35);
        nerveGroup.add(rib);
    }
    group.add(nerveGroup);
    meshes.opticNerve = nerveGroup;

    // --- 10. Focus Actuation Pistons ---
    // Hydraulic arrays connecting chassis to lens mount
    const pistonGroup = new THREE.Group();
    meshes.pistons = [];
    for(let i=0; i<6; i++) {
        const pGroup = new THREE.Group();
        const angle = (i/6) * Math.PI * 2;
        pGroup.position.x = Math.cos(angle) * 3.8;
        pGroup.position.y = Math.sin(angle) * 3.8;
        pGroup.position.z = 0;
        
        // Outer cylinder
        const outerGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
        const outerPiston = new THREE.Mesh(outerGeo, steel);
        outerPiston.rotation.x = Math.PI / 2;
        pGroup.add(outerPiston);
        
        // Inner shaft (moves during animation)
        const innerGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
        const innerPiston = new THREE.Mesh(innerGeo, chrome);
        innerPiston.rotation.x = Math.PI / 2;
        innerPiston.position.z = 0.5;
        pGroup.add(innerPiston);
        
        // Hinge joints
        const hingeGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const hinge = new THREE.Mesh(hingeGeo, darkSteel);
        hinge.position.z = -0.5;
        pGroup.add(hinge);
        
        pistonGroup.add(pGroup);
        meshes.pistons.push({
            group: pGroup,
            inner: innerPiston,
            baseZ: 0.5
        });
    }
    group.add(pistonGroup);

    // --- 11. Hydraulic Fluid Reservoirs ---
    const reservoirGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2 + Math.PI/6;
        const resGeo = new THREE.CapsuleGeometry(0.3, 0.8, 16, 16);
        const resMesh = new THREE.Mesh(resGeo, tinted); // transparent/tinted shell
        resMesh.position.x = Math.cos(angle) * 4.2;
        resMesh.position.y = Math.sin(angle) * 4.2;
        resMesh.position.z = -0.5;
        
        // Inner fluid core
        const fluidGeo = new THREE.CapsuleGeometry(0.25, 0.7, 16, 16);
        const fluidMesh = new THREE.Mesh(fluidGeo, opticBlue);
        resMesh.add(fluidMesh);
        
        reservoirGroup.add(resMesh);
    }
    group.add(reservoirGroup);

    // --- 12. Power Distribution Core ---
    const powerCoreGeo = new THREE.TorusKnotGeometry(0.6, 0.15, 100, 16);
    const powerCoreMesh = new THREE.Mesh(powerCoreGeo, laserRed);
    powerCoreMesh.position.z = -1.5;
    group.add(powerCoreMesh);
    meshes.powerCore = powerCoreMesh;

    // --- 13. Thermal Dissipation Fins ---
    // Massive array of small extruded blocks along the chassis perimeter
    const finGroup = new THREE.Group();
    const finGeo = new THREE.BoxGeometry(0.1, 0.4, 1.2);
    for(let i=0; i<72; i++) {
        const fin = new THREE.Mesh(finGeo, darkSteel);
        const angle = (i/72) * Math.PI * 2;
        fin.position.x = Math.cos(angle) * 4.4;
        fin.position.y = Math.sin(angle) * 4.4;
        fin.position.z = -1.0;
        fin.rotation.z = angle;
        finGroup.add(fin);
    }
    group.add(finGroup);

    // --- 14. Data Transmitter Coil ---
    const coilGeo = new THREE.TorusGeometry(1.6, 0.05, 16, 200, Math.PI * 16); // Winding appearance
    const coilMesh = new THREE.Mesh(coilGeo, copper);
    coilMesh.position.z = -2.5;
    group.add(coilMesh);
    meshes.transmitterCoil = coilMesh;

    // --- 15. Biocompatible Gel Layer ---
    const gelGeo = new THREE.SphereGeometry(4.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const gelMesh = new THREE.Mesh(gelGeo, bioGelMaterial);
    gelMesh.rotation.x = Math.PI / 2;
    group.add(gelMesh);


    // --- PARTS DEFINITION ---
    parts.push({
        name: 'Titanium Sclera Chassis',
        description: 'Primary protective housing forged from medical-grade titanium. Houses the extremely delicate internal components and serves as the structural anchor for the ocular muscles.',
        material: 'Aluminum / Titanium Alloy',
        function: 'Structural integrity, protection, bio-integration',
        assemblyOrder: 1,
        connections: ['Anterior Corneal Lens', 'Micro-Photodiode Matrix Base', 'Thermal Dissipation Fins'],
        failureEffect: 'Loss of structural integrity, internal component crushing, potential rejection by host tissue.',
        cascadeFailures: ['Micro-Photodiode Matrix Base', 'Focus Actuation Pistons'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -2 }
    });

    parts.push({
        name: 'Anterior Corneal Lens',
        description: 'Multi-layered, high-refractive-index synthetic glass. Capable of filtering extreme UV radiation and focusing incoming light dynamically.',
        material: 'Synthetic Sapphire Glass',
        function: 'Primary light focusing and environmental protection',
        assemblyOrder: 15,
        connections: ['Aperture Control Ring', 'Titanium Sclera Chassis'],
        failureEffect: 'Severe image distortion, inability to focus, vulnerability to external particulate damage.',
        cascadeFailures: ['Quantum Dot Sensor Array', 'Iris Shutter Mechanism'],
        originalPosition: { x: 0, y: 0, z: 1.2 },
        explodedPosition: { x: 0, y: 0, z: 6 }
    });

    parts.push({
        name: 'Aperture Control Ring',
        description: 'Magnetic induction ring that drives the rapid opening and closing of the iris shutter blades based on incoming photon density.',
        material: 'Dark Steel / Neodymium',
        function: 'Actuates Iris Shutter Blades',
        assemblyOrder: 14,
        connections: ['Anterior Corneal Lens', 'Iris Shutter Blades'],
        failureEffect: 'Iris stuck in a fixed position, causing overexposure or underexposure of the sensor array.',
        cascadeFailures: ['Iris Shutter Blades'],
        originalPosition: { x: 0, y: 0, z: 2.0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    parts.push({
        name: 'Iris Shutter Mechanism',
        description: 'Array of 12 overlapping, ultra-thin chrome blades. Can contract or expand in under 2 milliseconds to regulate light intake.',
        material: 'Chrome / Graphene Matrix',
        function: 'Dynamic light regulation (f-stop control)',
        assemblyOrder: 13,
        connections: ['Aperture Control Ring'],
        failureEffect: 'Photon saturation resulting in temporary or permanent blindness in the host.',
        cascadeFailures: ['Quantum Dot Sensor Array'],
        originalPosition: { x: 0, y: 0, z: 1.9 },
        explodedPosition: { x: 0, y: 0, z: 4.5 }
    });

    parts.push({
        name: 'Micro-Photodiode Matrix Base',
        description: 'Curved structural backing perfectly mapped to the human retina. Embedded with micro-circuitry to process raw photon strikes.',
        material: 'Dark Steel / Silicon',
        function: 'Mounting and primary processing plane for the sensor array',
        assemblyOrder: 2,
        connections: ['Titanium Sclera Chassis', 'Quantum Dot Sensor Array'],
        failureEffect: 'Complete sensor decoupling resulting in a total loss of visual signal.',
        cascadeFailures: ['Quantum Dot Sensor Array', 'Signal Processor Chip'],
        originalPosition: { x: 0, y: 0, z: 1.0 },
        explodedPosition: { x: 0, y: 0, z: -1 }
    });

    parts.push({
        name: 'Quantum Dot Sensor Array',
        description: '800+ densely packed synthetic diodes utilizing quantum dots. Capable of perceiving standard human visible light, plus infrared and ultraviolet spectrums.',
        material: 'Retina Glow (Emissive Phosphors)',
        function: 'Converts photons into high-fidelity electrical nerve impulses',
        assemblyOrder: 3,
        connections: ['Micro-Photodiode Matrix Base', 'Signal Processor Chip'],
        failureEffect: 'Dead pixels in host vision, color blindness, or complete signal noise.',
        cascadeFailures: ['Signal Processor Chip', 'Optic Nerve Bio-Connector'],
        originalPosition: { x: 0, y: 0, z: 1.0 },
        explodedPosition: { x: 0, y: 5, z: 1 }
    });

    parts.push({
        name: 'Signal Processor Chip',
        description: 'The brain of the eye. An advanced extruded copper/silicon neuro-processor that compresses, filters, and formats sensor data for the human visual cortex.',
        material: 'Copper / Advanced Silicon',
        function: 'Neural signal encoding and noise reduction',
        assemblyOrder: 4,
        connections: ['Quantum Dot Sensor Array', 'Gold Neural Interface Wiring'],
        failureEffect: 'Visual hallucinations, severe latency, visual stuttering, or complete blackout.',
        cascadeFailures: ['Gold Neural Interface Wiring'],
        originalPosition: { x: 0, y: 0, z: -2.5 },
        explodedPosition: { x: 0, y: -5, z: -2.5 }
    });

    parts.push({
        name: 'Gold Neural Interface Wiring',
        description: 'Dozens of ultra-fine, highly conductive gold tubes that bridge the gap between mechanical processors and organic neural tissue. Uses bio-mimicry to avoid immune response.',
        material: 'Gold',
        function: 'High-speed, zero-latency data transmission to the optic nerve',
        assemblyOrder: 5,
        connections: ['Signal Processor Chip', 'Optic Nerve Bio-Connector'],
        failureEffect: 'Signal degradation, localized blind spots, or neural feedback loops.',
        cascadeFailures: ['Optic Nerve Bio-Connector'],
        originalPosition: { x: 0, y: 0, z: -1.5 },
        explodedPosition: { x: 5, y: 0, z: -1.5 }
    });

    parts.push({
        name: 'Optic Nerve Bio-Connector',
        description: 'A ribbed, flexible rubber/synthetic sheath that physically clamps onto the severed organic optic nerve, seamlessly splicing biological wetware with digital hardware.',
        material: 'Rubber / Bio-Steel',
        function: 'Physical and data coupling to the biological nervous system',
        assemblyOrder: 6,
        connections: ['Gold Neural Interface Wiring', 'Titanium Sclera Chassis'],
        failureEffect: 'Severe pain feedback, rejection by the host, total blindness.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -4.0 },
        explodedPosition: { x: 0, y: 0, z: -8 }
    });

    parts.push({
        name: 'Focus Actuation Pistons',
        description: 'Six micro-hydraulic piston arrays that physically alter the distance and shape of the internal lens mount, allowing instantaneous focus from macro to infinity.',
        material: 'Steel / Chrome',
        function: 'Mechanical auto-focus actuation',
        assemblyOrder: 7,
        connections: ['Titanium Sclera Chassis', 'Hydraulic Fluid Reservoirs'],
        failureEffect: 'Vision permanently locked at a single focal length.',
        cascadeFailures: ['Hydraulic Fluid Reservoirs'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    parts.push({
        name: 'Hydraulic Fluid Reservoirs',
        description: 'Tinted reinforced capsules containing highly pressurized, low-viscosity optical fluid used to drive the actuation pistons.',
        material: 'Tinted Glass / Optic Blue Fluid',
        function: 'Hydraulic pressure storage',
        assemblyOrder: 8,
        connections: ['Focus Actuation Pistons'],
        failureEffect: 'Fluid leak, causing internal optical smearing and total failure of the focus system.',
        cascadeFailures: ['Focus Actuation Pistons', 'Anterior Corneal Lens'],
        originalPosition: { x: 0, y: 0, z: -0.5 },
        explodedPosition: { x: -6, y: 0, z: -0.5 }
    });

    parts.push({
        name: 'Power Distribution Core',
        description: 'A twisted torus knot of hyper-dense isotopes providing a 50-year internal power supply to all ocular functions.',
        material: 'Laser Red Emissive',
        function: 'Primary energy source',
        assemblyOrder: 9,
        connections: ['Signal Processor Chip', 'Titanium Sclera Chassis'],
        failureEffect: 'Total system shutdown. Extreme failure may result in localized radiation burns to the eye socket.',
        cascadeFailures: ['Signal Processor Chip', 'Quantum Dot Sensor Array', 'Iris Shutter Mechanism'],
        originalPosition: { x: 0, y: 0, z: -1.5 },
        explodedPosition: { x: -4, y: -4, z: -1.5 }
    });

    parts.push({
        name: 'Thermal Dissipation Fins',
        description: 'Array of 72 external heat sinks lining the back edge of the eye, directly venting thermal build-up into surrounding blood vessels to prevent tissue boiling.',
        material: 'Dark Steel',
        function: 'Heat management and regulation',
        assemblyOrder: 10,
        connections: ['Titanium Sclera Chassis'],
        failureEffect: 'Overheating of the processor, causing thermal damage to the organic optic nerve and socket.',
        cascadeFailures: ['Signal Processor Chip', 'Optic Nerve Bio-Connector'],
        originalPosition: { x: 0, y: 0, z: -1.0 },
        explodedPosition: { x: 6, y: 6, z: -1.0 }
    });

    parts.push({
        name: 'Data Transmitter Coil',
        description: 'Tightly wound copper induction loop for over-the-air firmware updates and diagnostic data offloading to external medical scanners.',
        material: 'Copper',
        function: 'Wireless data telemetry',
        assemblyOrder: 11,
        connections: ['Signal Processor Chip'],
        failureEffect: 'Inability to receive updates or output diagnostic data, leading to slow firmware degradation.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -2.5 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    parts.push({
        name: 'Biocompatible Gel Layer',
        description: 'A soft, highly permeable synthetic gel covering the entire structure. Prevents friction, absorbs impacts, and mimics the look and feel of biological tissue.',
        material: 'Bio Gel',
        function: 'Friction reduction and organic tissue simulation',
        assemblyOrder: 16,
        connections: ['Titanium Sclera Chassis', 'Anterior Corneal Lens'],
        failureEffect: 'Severe friction burns in the socket, restricted eye movement, host immune attack.',
        cascadeFailures: ['Titanium Sclera Chassis'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: 'What is the primary function of the Gold Neural Interface Wiring?',
            options: [
                'To regulate the hydraulic fluid pressure.',
                'To provide a zero-latency data bridge between the digital processor and the biological optic nerve.',
                'To absorb shock impacts to the lens.',
                'To reflect excess UV radiation away from the iris.'
            ],
            correctAnswer: 1,
            explanation: 'The gold wiring acts as a highly conductive, biocompatible bridge to seamlessly transmit electrical impulses to the human nervous system.'
        },
        {
            question: 'Which component is directly responsible for altering the physical focus length?',
            options: [
                'Focus Actuation Pistons',
                'Thermal Dissipation Fins',
                'Iris Shutter Mechanism',
                'Power Distribution Core'
            ],
            correctAnswer: 0,
            explanation: 'The six micro-hydraulic pistons physically shift internal elements to change focus from macro distances to infinity.'
        },
        {
            question: 'Why are Thermal Dissipation Fins critically important for this synthetic organ?',
            options: [
                'They keep the internal fluid from freezing in cold environments.',
                'They prevent the high-performance processor from overheating and boiling the surrounding organic socket tissue.',
                'They emit light for night vision.',
                'They anchor the eye to the skull bone.'
            ],
            correctAnswer: 1,
            explanation: 'High-tech electronics generate significant heat. The fins vent this heat into surrounding blood vessels to maintain safe operational temperatures.'
        },
        {
            question: 'What happens if the Aperture Control Ring fails?',
            options: [
                'The eye loses all battery power.',
                'The user can no longer focus on close objects.',
                'The iris blades become stuck, causing severe overexposure or underexposure of the sensor array.',
                'The optic nerve connection severs completely.'
            ],
            correctAnswer: 2,
            explanation: 'The control ring actuates the iris. A failure here means light regulation stops, leading to photon saturation or starvation (blindness).'
        },
        {
            question: 'What allows the eye to receive firmware updates?',
            options: [
                'Quantum Dot Sensor Array',
                'Biocompatible Gel Layer',
                'Titanium Sclera Chassis',
                'Data Transmitter Coil'
            ],
            correctAnswer: 3,
            explanation: 'The Data Transmitter Coil is an induction loop specifically designed for wireless data telemetry and over-the-air updates.'
        }
    ];

    // --- ANIMATION FUNCTION ---
    const animate = (time, speed, meshes) => {
        // 1. Iris Shutter Animation (opening and closing periodically to regulate light)
        const irisOscillation = (Math.sin(time * speed * 2) + 1) / 2; // 0 to 1
        meshes.irisBlades.forEach(bladeObj => {
            const { mesh, baseAngle } = bladeObj;
            // When opening, blades slide back and rotate slightly
            const rotationOffset = irisOscillation * Math.PI * 0.15;
            mesh.rotation.z = baseAngle + Math.PI / 4 - rotationOffset;
            
            const slideAmount = irisOscillation * 0.8;
            mesh.position.x = Math.cos(baseAngle) * (1.5 + slideAmount);
            mesh.position.y = Math.sin(baseAngle) * (1.5 + slideAmount);
        });

        // 2. Photodiode Sensor Pulse
        // Sensors pulse rapidly like a data stream processing
        const pulse = (Math.sin(time * speed * 20) + Math.sin(time * speed * 13)) * 0.5 + 0.5;
        meshes.photodiodeGroup.children.forEach((diode, index) => {
            // Create a sweeping wave effect across the retina
            const wave = Math.sin((time * speed * 5) + index * 0.1);
            if (wave > 0.8) {
                diode.material.emissiveIntensity = 2.0;
            } else {
                diode.material.emissiveIntensity = 0.3 + (pulse * 0.3);
            }
        });

        // 3. Power Core Rotation & Pulse
        meshes.powerCore.rotation.x = time * speed;
        meshes.powerCore.rotation.y = time * speed * 1.5;
        meshes.powerCore.material.emissiveIntensity = 0.8 + Math.sin(time * speed * 8) * 0.4;

        // 4. Focus Pistons Actuation
        // Simulating the eye constantly micro-adjusting focus
        const focusAdjust = Math.sin(time * speed * 1.5) * 0.2 + (Math.sin(time * speed * 8) * 0.05); // Macro and micro movements
        meshes.pistons.forEach(pistonObj => {
            const { inner, baseZ } = pistonObj;
            inner.position.z = baseZ + focusAdjust;
        });

        // 5. Data Transmitter Coil Spin
        meshes.transmitterCoil.rotation.z = time * speed * 3;

        // 6. Processor Chip Hover/Vibration (simulating extreme high frequency operation)
        meshes.processorChip.position.z = -2.5 + Math.sin(time * speed * 50) * 0.005;
        
        // 7. Slow sweeping rotation of the entire optic nerve block (simulating biological movement)
        meshes.opticNerve.rotation.z = Math.sin(time * speed * 0.5) * 0.1;
    };

    return {
        group,
        parts,
        description: 'The Cybernetic Synthetic Retina is a hyper-advanced, massively complex bionic implant. Designed to replace a damaged organic eye, it features an array of over 800 quantum dot photodiodes, medical-grade titanium housing, intricate gold neural interfacing, hydraulic focus actuation, and an integrated fusion power core. It perfectly mimics and dramatically exceeds standard human visual capabilities.',
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createSyntheticRetina() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
